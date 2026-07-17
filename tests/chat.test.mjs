// Handler-level tests for /api/chat with Gemini mocked at the fetch layer.
// The module-level limiter is shared across this file, so tests that consume
// slots run in a deliberate order (node:test runs same-file tests serially).
import { test } from "node:test";
import assert from "node:assert/strict";

process.env.GEMINI_API_KEY = "test-key";
process.env.CHAT_RPM = "5";
process.env.CHAT_RPM_PER_IP = "2";

const { default: handler } = await import("../api/chat.js");

// ---- Gemini mock ----
let geminiMode = "ok"; // "ok" | "429" | "primary429"
const realFetch = globalThis.fetch;
globalThis.fetch = async (url, init) => {
  if (!String(url).includes("generativelanguage.googleapis.com")) {
    return realFetch(url, init);
  }
  if (geminiMode === "429") return new Response("quota", { status: 429 });
  if (geminiMode === "primary429" && String(url).includes("gemini-flash-latest")) {
    return new Response("quota", { status: 429 });
  }
  const sse =
    'data: {"candidates":[{"content":{"parts":[{"text":"Hello "}]}}]}\n' +
    'data: {"candidates":[{"content":{"parts":[{"text":"world"}]}}]}\n' +
    "data: [DONE]\n";
  return new Response(sse, {
    status: 200,
    headers: { "Content-Type": "text/event-stream" },
  });
};

function post(ip, content = "Tell me about Vijith") {
  return handler(
    new Request("http://localhost/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-real-ip": ip },
      body: JSON.stringify({ messages: [{ role: "user", content }] }),
    })
  );
}

async function readSse(res) {
  const text = await res.text();
  let out = "";
  for (const line of text.split("\n")) {
    if (!line.startsWith("data:")) continue;
    const raw = line.slice(5).trim();
    if (!raw || raw === "[DONE]") continue;
    out += JSON.parse(raw).text ?? "";
  }
  return out;
}

test("GET reports availability and backend", async () => {
  const res = await handler(new Request("http://localhost/api/chat"));
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.equal(body.status, "available");
  assert.equal(body.backend, "memory");
  assert.equal(body.capacity, 5);
});

test("invalid JSON body → 400 without burning a slot", async () => {
  const res = await handler(
    new Request("http://localhost/api/chat", { method: "POST", body: "{nope" })
  );
  assert.equal(res.status, 400);
});

test("missing user message → 400", async () => {
  const res = await handler(
    new Request("http://localhost/api/chat", {
      method: "POST",
      body: JSON.stringify({ messages: [] }),
    })
  );
  assert.equal(res.status, 400);
});

test("oversized message → 400", async () => {
  const res = await post("9.9.9.9", "x".repeat(2000));
  assert.equal(res.status, 400);
});

test("streams the mocked Gemini answer as simplified SSE", async () => {
  const res = await post("1.1.1.1");
  assert.equal(res.status, 200);
  assert.match(res.headers.get("content-type"), /text\/event-stream/);
  assert.equal(await readSse(res), "Hello world");
});

test("third request in a minute from one ip → 429 with Retry-After", async () => {
  assert.equal((await post("1.1.1.1")).status, 200); // 2nd for this ip: at cap
  const res = await post("1.1.1.1"); // 3rd: over per-ip cap
  assert.equal(res.status, 429);
  const body = await res.json();
  assert.equal(body.error, "queue");
  assert.match(body.message, /fair/);
  assert.ok(body.retryAfter >= 1 && body.retryAfter <= 60);
  assert.ok(Number(res.headers.get("retry-after")) >= 1);
});

test("global cap → 429 queue for a fresh visitor", async () => {
  assert.equal((await post("2.2.2.2")).status, 200); // 3rd global
  assert.equal((await post("3.3.3.3")).status, 200); // 4th
  assert.equal((await post("4.4.4.4")).status, 200); // 5th — capacity reached
  const res = await post("5.5.5.5");
  assert.equal(res.status, 429);
  const body = await res.json();
  assert.equal(body.error, "queue");
  assert.equal(body.queuePosition, 1);
});

test("GET flips to high-demand once the window is full", async () => {
  const res = await handler(new Request("http://localhost/api/chat"));
  const body = await res.json();
  assert.equal(body.status, "high");
  assert.ok(body.retryAfter >= 1);
});

test("provider 429 → shared backoff and queued response", async () => {
  // Fresh limiter so admission isn't blocked by the now-full window.
  const bust = await import(`../api/chat.js?providerbackoff=1`);
  geminiMode = "429";
  const res = await bust.default(
    new Request("http://localhost/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-real-ip": "6.6.6.6" },
      body: JSON.stringify({ messages: [{ role: "user", content: "hi" }] }),
    })
  );
  assert.equal(res.status, 429);
  const body = await res.json();
  assert.equal(body.error, "queue");
  assert.equal(body.retryAfter, 30);

  // Backoff now blocks the next visitor before Gemini is even called.
  geminiMode = "ok";
  const blocked = await bust.default(
    new Request("http://localhost/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-real-ip": "7.7.7.7" },
      body: JSON.stringify({ messages: [{ role: "user", content: "hi" }] }),
    })
  );
  assert.equal(blocked.status, 429);

  const avail = await bust.default(new Request("http://localhost/api/chat"));
  assert.equal((await avail.json()).status, "high");
});

test("primary model quota exhausted → falls back to flash-lite and streams", async () => {
  const bust = await import(`../api/chat.js?fallback=1`);
  geminiMode = "primary429";
  const res = await bust.default(
    new Request("http://localhost/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-real-ip": "8.8.8.8" },
      body: JSON.stringify({ messages: [{ role: "user", content: "hi" }] }),
    })
  );
  assert.equal(res.status, 200);
  assert.equal(res.headers.get("x-chat-model"), "gemini-flash-lite-latest");
  assert.equal(await readSse(res), "Hello world");

  // Second request skips the exhausted primary entirely (no primary call made).
  let primaryCalls = 0;
  const prevMode = geminiMode;
  const inner = globalThis.fetch;
  globalThis.fetch = async (url, init) => {
    if (String(url).includes("gemini-flash-latest")) primaryCalls++;
    return inner(url, init);
  };
  try {
    const res2 = await bust.default(
      new Request("http://localhost/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-real-ip": "8.8.4.4" },
        body: JSON.stringify({ messages: [{ role: "user", content: "hi" }] }),
      })
    );
    assert.equal(res2.status, 200);
    assert.equal(res2.headers.get("x-chat-model"), "gemini-flash-lite-latest");
    assert.equal(primaryCalls, 0);
  } finally {
    globalThis.fetch = inner;
    geminiMode = prevMode;
  }
});
