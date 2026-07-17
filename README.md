# Vijith BG — AI Engineer Portfolio

Cinematic, animated portfolio for an AI Lead Engineer — with a built-in **grounded chatbot**
powered by Google Gemini on Vercel Edge Functions.

## Stack

- **Frontend**: React 18 + Vite, Framer Motion, hand-built SVG/canvas animations
- **Chatbot**: full-context grounding (no retrieval step)
  - Resume content sanitized (no phone number) and kept in `api/_lib/knowledge.js`
  - The whole corpus (~2.5k tokens) is inlined into the system prompt — one
    Gemini call per message, no embedding round trip
  - `gemini-flash-latest` streams grounded answers over SSE
  - Shared sliding-window rate limiting (60 req/min global + per-visitor cap)
    backed by Upstash Redis, with fair queue UX (position, ETA, progress,
    auto-retry) and graceful in-memory fallback
- **Hosting**: Vercel (static site + `/api` edge functions)

## Local development

```bash
npm install
echo "GEMINI_API_KEY=your-key-here" > .env
npm run dev        # vite dev server serves /api locally too
```

## Updating the knowledge base

Edit `api/_lib/knowledge.js` and redeploy — no build step needed.

## Testing

```bash
npm test           # offline: limiter unit tests + handler tests (Gemini mocked)
npm run test:live  # one real Gemini call through the handler (uses .env key)
```

## Deploying on Vercel

1. Import this repo in Vercel (framework preset: **Vite**).
2. Add an environment variable: `GEMINI_API_KEY` = your Gemini API key.
3. **Rate limiting (recommended):** in the Vercel dashboard → Storage →
   Marketplace, add **Upstash for Redis** (free tier) and connect it to this
   project. That injects `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN`
   (or the `KV_REST_API_*` aliases) and the chat API automatically switches to
   one globally shared 60 req/min window across all edge regions. Without it,
   limiting degrades to best-effort per isolate.
4. Deploy. The chatbot endpoint lives at `/api/chat`; `GET /api/chat` reports
   `{ status, used, capacity, backend }` — `backend: "redis"` confirms the
   shared limiter is active.

Optional env knobs: `CHAT_RPM` (global requests/min, default **60**),
`CHAT_RPM_PER_IP` (per-visitor requests/min, default **12**).

> `.env` is gitignored — the API key must never be committed.
