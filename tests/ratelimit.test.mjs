import { test } from "node:test";
import assert from "node:assert/strict";
import {
  WINDOW_MS,
  MemoryWindow,
  RedisWindow,
  createLimiter,
} from "../api/_lib/ratelimit.js";
import { createFakeUpstash } from "./fake-upstash.mjs";

const LIMITS = { capacity: 5, perIp: 2, dailyCapacity: 1000, perIpDay: 100 };

// ---------- MemoryWindow ----------

test("memory: per-ip cap rejects the third request from one visitor", () => {
  const w = new MemoryWindow();
  const t = 1_000_000;
  assert.equal(w.take("a", LIMITS, t).ok, true);
  assert.equal(w.take("a", LIMITS, t + 1).ok, true);
  const rejected = w.take("a", LIMITS, t + 2);
  assert.equal(rejected.ok, false);
  assert.equal(rejected.reason, "ip");
  assert.ok(rejected.retryAfterSec >= 1 && rejected.retryAfterSec <= 60);
  // the rejected request must not consume a global slot
  assert.equal(rejected.used, 2);
});

test("memory: global cap rejects once capacity is reached across ips", () => {
  const w = new MemoryWindow();
  const t = 1_000_000;
  for (let i = 0; i < LIMITS.capacity; i++) {
    assert.equal(w.take(`ip-${i}`, LIMITS, t + i).ok, true);
  }
  const rejected = w.take("fresh-ip", LIMITS, t + 10);
  assert.equal(rejected.ok, false);
  assert.equal(rejected.reason, "global");
  assert.equal(rejected.queuePosition, 1);
});

test("memory: window slides — old requests free up capacity", () => {
  const w = new MemoryWindow();
  const t = 1_000_000;
  for (let i = 0; i < LIMITS.capacity; i++) w.take(`ip-${i}`, LIMITS, t);
  assert.equal(w.take("late", LIMITS, t + 1).ok, false);
  assert.equal(w.take("late", LIMITS, t + WINDOW_MS + 1).ok, true);
});

test("memory: provider backoff blocks everyone until it expires", () => {
  const w = new MemoryWindow();
  const t = 1_000_000;
  w.noteProviderBackoff(30_000, t);
  const rejected = w.take("a", LIMITS, t + 1_000);
  assert.equal(rejected.ok, false);
  assert.equal(rejected.reason, "backoff");
  assert.equal(rejected.retryAfterSec, 29);
  assert.equal(w.take("a", LIMITS, t + 31_000).ok, true);
});

test("memory: per-ip daily cap rejects and resets on the next UTC day", () => {
  const limits = { capacity: 100, perIp: 100, dailyCapacity: 1000, perIpDay: 2 };
  const w = new MemoryWindow();
  const t = Date.UTC(2026, 0, 1, 12, 0, 0); // noon, so +13h crosses midnight
  // Spread past the minute window so only the daily cap is in play.
  assert.equal(w.take("a", limits, t).ok, true);
  assert.equal(w.take("a", limits, t + 2 * WINDOW_MS).ok, true);
  const rejected = w.take("a", limits, t + 4 * WINDOW_MS);
  assert.equal(rejected.ok, false);
  assert.equal(rejected.reason, "ip-day");
  assert.ok(rejected.retryAfterSec > 60); // points at the day reset, not the minute window
  // another visitor is unaffected
  assert.equal(w.take("b", limits, t + 4 * WINDOW_MS).ok, true);
  // next UTC day: fresh budget
  assert.equal(w.take("a", limits, t + 13 * 3_600_000).ok, true);
});

test("memory: global daily cap rejects fresh visitors once exhausted", () => {
  const limits = { capacity: 100, perIp: 100, dailyCapacity: 2, perIpDay: 100 };
  const w = new MemoryWindow();
  const t = Date.UTC(2026, 0, 1, 12, 0, 0);
  assert.equal(w.take("a", limits, t).ok, true);
  assert.equal(w.take("b", limits, t + 2 * WINDOW_MS).ok, true);
  const rejected = w.take("c", limits, t + 4 * WINDOW_MS);
  assert.equal(rejected.ok, false);
  assert.equal(rejected.reason, "global-day");
  // peek reflects daily exhaustion
  const seen = w.peek(limits, t + 4 * WINDOW_MS);
  assert.equal(seen.dayUsed, 2);
  assert.ok(seen.retryAfterSec > 60);
});

// ---------- RedisWindow (against the fake Upstash) ----------

test("redis: two isolates share one global window", async () => {
  const { fetchImpl, zsets } = createFakeUpstash();
  const isoA = new RedisWindow("https://fake.upstash.io", "tok", fetchImpl);
  const isoB = new RedisWindow("https://fake.upstash.io", "tok", fetchImpl);
  const t = Date.now();

  assert.equal((await isoA.take("a1", LIMITS, t)).ok, true);
  assert.equal((await isoA.take("a2", LIMITS, t + 1)).ok, true);
  assert.equal((await isoA.take("a3", LIMITS, t + 2)).ok, true);
  assert.equal((await isoB.take("b1", LIMITS, t + 3)).ok, true);
  assert.equal((await isoB.take("b2", LIMITS, t + 4)).ok, true);

  // 5 admitted globally — isolate B must now reject even though it only saw 2
  const rejected = await isoB.take("b3", LIMITS, t + 5);
  assert.equal(rejected.ok, false);
  assert.equal(rejected.reason, "global");
  assert.ok(rejected.retryAfterSec >= 1 && rejected.retryAfterSec <= 60);

  // rejected request rolled back — window still holds exactly `capacity`
  assert.equal(zsets.get("chat:rl:global").size, LIMITS.capacity);
});

test("redis: per-ip cap is enforced and rolled back on rejection", async () => {
  const { fetchImpl, zsets } = createFakeUpstash();
  const w = new RedisWindow("https://fake.upstash.io", "tok", fetchImpl);
  const t = Date.now();
  await w.take("a", LIMITS, t);
  await w.take("a", LIMITS, t + 1);
  const rejected = await w.take("a", LIMITS, t + 2);
  assert.equal(rejected.ok, false);
  assert.equal(rejected.reason, "ip");
  assert.equal(zsets.get("chat:rl:ip:a").size, LIMITS.perIp);
  assert.equal(zsets.get("chat:rl:global").size, LIMITS.perIp);
});

test("redis: provider backoff set by one isolate blocks the other", async () => {
  const { fetchImpl } = createFakeUpstash();
  const isoA = new RedisWindow("https://fake.upstash.io", "tok", fetchImpl);
  const isoB = new RedisWindow("https://fake.upstash.io", "tok", fetchImpl);
  await isoA.noteProviderBackoff(30_000);
  const rejected = await isoB.take("x", LIMITS, Date.now());
  assert.equal(rejected.ok, false);
  assert.equal(rejected.reason, "backoff");
});

test("redis: peek reports usage without consuming a slot", async () => {
  const { fetchImpl } = createFakeUpstash();
  const w = new RedisWindow("https://fake.upstash.io", "tok", fetchImpl);
  const t = Date.now();
  await w.take("a", LIMITS, t);
  await w.take("b", LIMITS, t + 1);
  const seen = await w.peek(LIMITS, t + 2);
  assert.equal(seen.used, 2);
  assert.equal(seen.capacity, LIMITS.capacity);
  assert.equal((await w.peek(LIMITS, t + 3)).used, 2);
});

test("redis: daily cap is enforced and the counters roll back on rejection", async () => {
  const limits = { capacity: 100, perIp: 100, dailyCapacity: 2, perIpDay: 100 };
  const { fetchImpl, strings } = createFakeUpstash();
  const w = new RedisWindow("https://fake.upstash.io", "tok", fetchImpl);
  const t = Date.UTC(2026, 0, 1, 12, 0, 0);
  assert.equal((await w.take("a", limits, t)).ok, true);
  assert.equal((await w.take("b", limits, t + 1)).ok, true);
  const rejected = await w.take("c", limits, t + 2);
  assert.equal(rejected.ok, false);
  assert.equal(rejected.reason, "global-day");
  // rolled back: the day counter still holds exactly `dailyCapacity`
  const dayKey = [...strings.keys()].find((k) => k.startsWith("chat:rl:day:global:"));
  assert.equal(Number(strings.get(dayKey).value), limits.dailyCapacity);
  // and peek reports daily exhaustion
  const seen = await w.peek(limits, t + 3);
  assert.equal(seen.dayUsed, 2);
  assert.ok(seen.retryAfterSec > 60);
});

// ---------- createLimiter wiring ----------

test("createLimiter: no redis env → memory backend with env-tuned limits", async () => {
  const limiter = createLimiter({ CHAT_RPM: "60", CHAT_RPM_PER_IP: "12" });
  assert.equal(limiter.backend, "memory");
  assert.equal(limiter.limits.capacity, 60);
  assert.equal(limiter.limits.perIp, 12);
  assert.equal((await limiter.take("a")).ok, true);
});

test("createLimiter: redis errors fail open to the in-memory window", async () => {
  const original = globalThis.fetch;
  globalThis.fetch = async () => {
    throw new Error("network down");
  };
  try {
    const limiter = createLimiter({
      UPSTASH_REDIS_REST_URL: "https://unreachable.upstash.io",
      UPSTASH_REDIS_REST_TOKEN: "tok",
    });
    assert.equal(limiter.backend, "redis");
    const res = await limiter.take("a");
    assert.equal(res.ok, true); // admitted via memory fallback, not rejected
    const seen = await limiter.peek();
    assert.equal(seen.used, 1);
  } finally {
    globalThis.fetch = original;
  }
});

test("createLimiter: invalid env values fall back to defaults", () => {
  const limiter = createLimiter({ CHAT_RPM: "not-a-number", CHAT_RPM_PER_IP: "-5" });
  assert.equal(limiter.limits.capacity, 60);
  assert.equal(limiter.limits.perIp, 1); // clamped to minimum
  assert.equal(limiter.limits.dailyCapacity, 1000);
  assert.equal(limiter.limits.perIpDay, 100);
});
