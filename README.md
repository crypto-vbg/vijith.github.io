# Vijith BG — AI Engineer Portfolio

React + Vite portfolio with cinematic motion, filterable projects, expandable experience cards and a Gemini assistant grounded in the same content as the site.

## Edit the website in one file

**Edit `CONTENT.md`.** Its labeled YAML blocks contain the hero, about, experience, personal projects, skills, interests, contact links, footer, chatbot copy and search/social metadata. Editing instructions are at the top of that file.

- Save while the local server is running: the page reloads and the chatbot uses the updated content on its next request.
- Add a project by copying a project entry. A new category automatically appears as a filter. `featured: true` gives one project the wide featured layout.
- Longer descriptions remain available under **Explore the build** in Experience.
- Images and videos still need their files in `public/media`; update their paths in `CONTENT.md`.
- Generated files are build outputs; do not edit `src/content.generated.json` or `api/_lib/content.generated.js`.
- `npm run content:check` validates the file and reports missing fields, malformed YAML, duplicate titles or invalid URLs.

Vite generates both frontend content and chatbot grounding before building. Production HTML metadata is generated from the same source. Additional public education and award facts live under `chatbot.background`.

**Local edits do not deploy.** Your existing Git-to-Vercel integration deploys when you push to its connected branch. Review locally first, then commit/push when ready.

## Local preview

```sh
npm install
npm run dev -- --host 127.0.0.1
```

Open the local URL printed in the terminal (usually http://127.0.0.1:5173). The existing `.env` supplies `GEMINI_API_KEY` for local chat; the webpage itself does not require it. Never commit keys.

If this Windows machine's npm launcher reports a missing `npm-cli.js`, the installed Node runtime can run the preview directly:

```powershell
node node_modules/vite/bin/vite.js --host 127.0.0.1
```

For npm commands on this machine, the working installed CLI is:

```powershell
node 'C:/Program Files/nodejs/node_modules/npm/bin/npm-cli.js' run build
```

## Verification

```sh
npm run content:check
npm test
npm run build
```

Tests cover Markdown editing and validation, chatbot handler behavior with mocked Gemini, and shared/in-memory rate limiting. `npm run test:live` makes a real Gemini request using `.env`; it is optional.

## Interactions

The header tracks the current section; mobile navigation supports Escape and outside-click dismissal. Project categories animate into place, experience details expand, and the Mira waveform responds to hover and keyboard focus. The Motion control pauses decorative motion and remembers the preference. Device reduced-motion settings take priority; phones and data-saving connections receive the hero poster instead of video.

## Hosting and chatbot

The existing Vercel setup serves the static build and `/api/chat`. No hosting migration is needed. The server-side assistant uses Gemini streaming, CORS, security headers and shared Upstash rate limiting when configured, with an in-memory fallback. Keep existing project environment variables in place.

For future deployment inspection and logs, I strongly recommend installing the Vercel CLI with `npm i -g vercel`; it enables `vercel env pull`, `vercel deploy`, and `vercel logs`. It is not required for this local preview or your existing automatic Git deployments.
