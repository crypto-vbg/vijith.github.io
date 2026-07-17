# Vijith BG — AI Engineer Portfolio

Cinematic, animated portfolio for an AI Lead Engineer — with a built-in **RAG chatbot**
grounded in my resume, powered by Google Gemini on Vercel Edge Functions.

## Stack

- **Frontend**: React 18 + Vite, Framer Motion, hand-built SVG/canvas animations
- **Chatbot**: Retrieval-Augmented Generation
  - Resume content sanitized (no phone number), chunked, embedded with `gemini-embedding-001`
  - Query-time cosine-similarity retrieval inside a Vercel Edge Function
  - `gemini-flash-latest` streams grounded answers over SSE
  - In-memory rate limiting + fair queue UX (position, ETA, progress, auto-retry)
- **Hosting**: Vercel (static site + `/api` edge functions)

## Local development

```bash
npm install
echo "GEMINI_API_KEY=your-key-here" > .env
npm run dev        # vite dev server serves /api locally too
```

## Regenerating the knowledge base

Edit `scripts/knowledge-content.mjs`, then:

```bash
npm run embed      # writes api/_lib/kb.js with fresh embeddings
```

## Deploying on Vercel

1. Import this repo in Vercel (framework preset: **Vite**).
2. Add an environment variable: `GEMINI_API_KEY` = your Gemini API key.
3. Deploy. The chatbot endpoint lives at `/api/chat`.

> `.env` is gitignored — the API key must never be committed.
