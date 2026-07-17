import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Dev-only middleware that serves the Vercel edge-style functions in /api
// so the chatbot can be tested locally with `npm run dev`.
function localApiPlugin() {
  return {
    name: "local-api",
    configureServer(server) {
      loadDotEnv();
      server.middlewares.use(async (req, res, next) => {
        if (!req.url.startsWith("/api/")) return next();
        const name = req.url.split("?")[0].replace("/api/", "").replace(/\/$/, "");
        const file = path.join(__dirname, "api", `${name}.js`);
        if (!fs.existsSync(file)) return next();
        try {
          const mod = await import(pathToFileURL(file).href + `?t=${Date.now()}`);
          const request = await nodeReqToWebRequest(req);
          const response = await mod.default(request);
          res.statusCode = response.status;
          response.headers.forEach((v, k) => res.setHeader(k, v));
          if (response.body) {
            const reader = response.body.getReader();
            for (;;) {
              const { done, value } = await reader.read();
              if (done) break;
              res.write(Buffer.from(value));
            }
          }
          res.end();
        } catch (err) {
          console.error("[local-api]", err);
          res.statusCode = 500;
          res.end(JSON.stringify({ error: "Local API error", detail: String(err) }));
        }
      });
    },
  };
}

function loadDotEnv() {
  const envPath = path.join(__dirname, ".env");
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
    if (m && !(m[1] in process.env)) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}

async function nodeReqToWebRequest(req) {
  const url = `http://${req.headers.host || "localhost"}${req.url}`;
  const init = { method: req.method, headers: req.headers };
  if (req.method !== "GET" && req.method !== "HEAD") {
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    init.body = Buffer.concat(chunks);
  }
  return new Request(url, init);
}

export default defineConfig({
  plugins: [react(), localApiPlugin()],
});
