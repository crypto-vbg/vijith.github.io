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
  - In-memory rate limiting + fair queue UX (position, ETA, progress, auto-retry)
- **Hosting**: Vercel (static site + `/api` edge functions)

## Local development

```bash
npm install
echo "GEMINI_API_KEY=your-key-here" > .env
npm run dev        # vite dev server serves /api locally too
```

## Updating the knowledge base

Edit `api/_lib/knowledge.js` and redeploy — no build step needed.

## Deploying on Vercel

1. Import this repo in Vercel (framework preset: **Vite**).
2. Add an environment variable: `GEMINI_API_KEY` = your Gemini API key.
3. Deploy. The chatbot endpoint lives at `/api/chat`.

> `.env` is gitignored — the API key must never be committed.
