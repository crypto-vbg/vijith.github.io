// Live smoke test against the real Gemini API (uses one request of quota).
// Run manually:  node --env-file=.env tests/live-smoke.mjs
// Not part of `npm test` so CI and pre-push runs stay offline.
import handler from "../api/chat.js";

if (!process.env.GEMINI_API_KEY) {
  console.error("GEMINI_API_KEY not set — run with: node --env-file=.env tests/live-smoke.mjs");
  process.exit(1);
}

const availability = await handler(new Request("http://localhost/api/chat"));
console.log("GET /api/chat →", await availability.json());

const res = await handler(
  new Request("http://localhost/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-real-ip": "127.0.0.1" },
    body: JSON.stringify({
      messages: [{ role: "user", content: "Where is Vijith based?" }],
    }),
  })
);
console.log("POST /api/chat →", res.status, res.headers.get("content-type"));
if (!res.ok) {
  console.error(await res.text());
  process.exit(1);
}

let answer = "";
const text = await res.text();
for (const line of text.split("\n")) {
  if (!line.startsWith("data:")) continue;
  const raw = line.slice(5).trim();
  if (!raw || raw === "[DONE]") continue;
  try {
    answer += JSON.parse(raw).text ?? "";
  } catch {}
}
console.log("Streamed answer:", JSON.stringify(answer));
if (!answer.trim()) {
  console.error("FAIL: empty answer");
  process.exit(1);
}
console.log("PASS: live streaming answer received");
