// Sliding-window rate limiting for the chat API.
//
// Two backends behind one interface:
//   • RedisWindow  — Upstash Redis over REST (usable from Edge isolates). Active
//     when UPSTASH_REDIS_REST_URL/TOKEN (or the Vercel KV aliases) are set,
//     giving one true global window shared by every isolate in every region.
//   • MemoryWindow — per-isolate fallback for local dev and deployments where
//     Redis isn't provisioned yet. Best-effort only: each isolate counts alone.
//
// Limits (overridable via env):
//   CHAT_RPM        — global requests/minute forwarded to Gemini (default 60)
//   CHAT_RPM_PER_IP — per-visitor requests/minute, keeps one visitor from
//                     draining the global budget (default 12)
//
// The limiter fails open: if Redis errors, the request falls through to the
// in-memory window rather than being rejected — a briefly unenforced limit is
// better than a dead chatbot.

export const WINDOW_MS = 60_000;

const GLOBAL_KEY = "chat:rl:global";
const BACKOFF_KEY = "chat:rl:backoff";
const ipKey = (ip) => `chat:rl:ip:${ip}`;

function clampInt(raw, fallback, min, max) {
  const n = Number.parseInt(raw ?? "", 10);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, n));
}

const clampSec = (s) => Math.min(60, Math.max(1, Math.ceil(s)));

// Shared admission decision. `g`/`ip` are { count, oldest } where count already
// includes the request being decided.
export function decide(now, limits, g, ip, backoffMs) {
  if (backoffMs > 0) {
    return {
      ok: false,
      reason: "backoff",
      retryAfterSec: clampSec(backoffMs / 1000),
      queuePosition: 1,
    };
  }
  if (g.count > limits.capacity) {
    return {
      ok: false,
      reason: "global",
      retryAfterSec: clampSec((g.oldest + WINDOW_MS - now) / 1000),
      queuePosition: Math.max(1, g.count - limits.capacity),
    };
  }
  if (ip.count > limits.perIp) {
    return {
      ok: false,
      reason: "ip",
      retryAfterSec: clampSec((ip.oldest + WINDOW_MS - now) / 1000),
      queuePosition: 1,
    };
  }
  return { ok: true };
}

export class MemoryWindow {
  constructor() {
    this.global = [];
    this.byIp = new Map();
    this.backoffUntil = 0;
  }

  take(ip, limits, now = Date.now()) {
    this.global = this.global.filter((t) => now - t < WINDOW_MS);
    const ipArr = (this.byIp.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
    const backoffMs = Math.max(0, this.backoffUntil - now);
    const g = { count: this.global.length + 1, oldest: this.global[0] ?? now };
    const p = { count: ipArr.length + 1, oldest: ipArr[0] ?? now };
    const verdict = decide(now, limits, g, p, backoffMs);
    if (verdict.ok) {
      this.global.push(now);
      ipArr.push(now);
    }
    this.byIp.set(ip, ipArr);
    if (this.byIp.size > 1000) this.gc(now);
    return {
      ...verdict,
      used: verdict.ok ? g.count : g.count - 1,
      capacity: limits.capacity,
    };
  }

  peek(limits, now = Date.now()) {
    this.global = this.global.filter((t) => now - t < WINDOW_MS);
    const used = this.global.length;
    const backoffMs = Math.max(0, this.backoffUntil - now);
    let retryAfterSec;
    if (backoffMs > 0) retryAfterSec = clampSec(backoffMs / 1000);
    else if (used >= limits.capacity) {
      retryAfterSec = clampSec((this.global[0] + WINDOW_MS - now) / 1000);
    }
    return { used, capacity: limits.capacity, backoffMs, retryAfterSec };
  }

  noteProviderBackoff(ms, now = Date.now()) {
    this.backoffUntil = Math.max(this.backoffUntil, now + ms);
  }

  gc(now) {
    for (const [key, arr] of this.byIp) {
      if (arr.every((t) => now - t >= WINDOW_MS)) this.byIp.delete(key);
    }
  }
}

// Oldest entry's score from a ZRANGE ... WITHSCORES reply ([member, score]).
function oldestScore(zrangeRow, fallback) {
  const score = Array.isArray(zrangeRow) ? Number(zrangeRow[1]) : NaN;
  return Number.isFinite(score) ? score : fallback;
}

export class RedisWindow {
  constructor(url, token, fetchImpl = fetch) {
    this.url = url.replace(/\/+$/, "");
    this.token = token;
    this.fetch = fetchImpl;
  }

  async pipeline(commands) {
    const res = await this.fetch(`${this.url}/pipeline`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(commands),
    });
    if (!res.ok) throw new Error(`redis pipeline HTTP ${res.status}`);
    const rows = await res.json();
    return rows.map((row) => {
      if (row.error) throw new Error(`redis: ${row.error}`);
      return row.result;
    });
  }

  async take(ip, limits, now = Date.now()) {
    const member = `${now}-${Math.random().toString(36).slice(2, 10)}`;
    const gk = GLOBAL_KEY;
    const ik = ipKey(ip);
    const cutoff = String(now - WINDOW_MS);
    const rows = await this.pipeline([
      ["ZREMRANGEBYSCORE", gk, "0", cutoff],
      ["ZADD", gk, String(now), member],
      ["ZCARD", gk],
      ["ZRANGE", gk, "0", "0", "WITHSCORES"],
      ["PEXPIRE", gk, String(WINDOW_MS)],
      ["ZREMRANGEBYSCORE", ik, "0", cutoff],
      ["ZADD", ik, String(now), member],
      ["ZCARD", ik],
      ["ZRANGE", ik, "0", "0", "WITHSCORES"],
      ["PEXPIRE", ik, String(WINDOW_MS)],
      ["PTTL", BACKOFF_KEY],
    ]);
    const g = { count: rows[2], oldest: oldestScore(rows[3], now) };
    const p = { count: rows[7], oldest: oldestScore(rows[8], now) };
    const backoffMs = Math.max(0, rows[10] ?? -1); // PTTL → -2/-1 when unset
    const verdict = decide(now, limits, g, p, backoffMs);
    if (!verdict.ok) {
      // Roll back this request's entries so rejected retries don't inflate the
      // window and starve everyone indefinitely.
      await this.pipeline([
        ["ZREM", gk, member],
        ["ZREM", ik, member],
      ]).catch(() => {});
    }
    return {
      ...verdict,
      used: verdict.ok ? g.count : g.count - 1,
      capacity: limits.capacity,
    };
  }

  async peek(limits, now = Date.now()) {
    const rows = await this.pipeline([
      ["ZREMRANGEBYSCORE", GLOBAL_KEY, "0", String(now - WINDOW_MS)],
      ["ZCARD", GLOBAL_KEY],
      ["ZRANGE", GLOBAL_KEY, "0", "0", "WITHSCORES"],
      ["PTTL", BACKOFF_KEY],
    ]);
    const used = rows[1];
    const backoffMs = Math.max(0, rows[3] ?? -1);
    let retryAfterSec;
    if (backoffMs > 0) retryAfterSec = clampSec(backoffMs / 1000);
    else if (used >= limits.capacity) {
      retryAfterSec = clampSec((oldestScore(rows[2], now) + WINDOW_MS - now) / 1000);
    }
    return { used, capacity: limits.capacity, backoffMs, retryAfterSec };
  }

  async noteProviderBackoff(ms) {
    await this.pipeline([["SET", BACKOFF_KEY, "1", "PX", String(ms)]]);
  }
}

export function createLimiter(env = process.env) {
  const limits = {
    capacity: clampInt(env.CHAT_RPM, 60, 1, 1000),
    perIp: clampInt(env.CHAT_RPM_PER_IP, 12, 1, 1000),
  };
  const url = env.UPSTASH_REDIS_REST_URL || env.KV_REST_API_URL;
  const token = env.UPSTASH_REDIS_REST_TOKEN || env.KV_REST_API_TOKEN;
  const redis = url && token ? new RedisWindow(url, token) : null;
  const memory = new MemoryWindow();

  return {
    backend: redis ? "redis" : "memory",
    limits,

    async take(ip) {
      if (redis) {
        try {
          return await redis.take(ip, limits);
        } catch (err) {
          console.error("rate limiter: redis unavailable, using in-memory fallback", err);
        }
      }
      return memory.take(ip, limits);
    },

    async peek() {
      if (redis) {
        try {
          return await redis.peek(limits);
        } catch (err) {
          console.error("rate limiter: redis unavailable, using in-memory fallback", err);
        }
      }
      return memory.peek(limits);
    },

    async noteProviderBackoff(ms) {
      memory.noteProviderBackoff(ms);
      if (redis) await redis.noteProviderBackoff(ms).catch(() => {});
    },
  };
}
