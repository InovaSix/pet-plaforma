import http from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve("out");
const PORT = 5050;

const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".webmanifest": "application/manifest+json",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
};

async function resolveFile(urlPath) {
  const clean = decodeURIComponent(urlPath.split("?")[0]);
  const candidates = [
    path.join(ROOT, clean),
    path.join(ROOT, `${clean}.html`),
    path.join(ROOT, clean, "index.html"),
  ];
  for (const candidate of candidates) {
    try {
      const info = await stat(candidate);
      if (info.isFile()) return candidate;
    } catch {
      // try next candidate
    }
  }
  return null;
}

http
  .createServer(async (req, res) => {
    const file = await resolveFile(req.url ?? "/");
    if (!file) {
      const notFound = path.join(ROOT, "404.html");
      res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
      res.end(await readFile(notFound).catch(() => "Not found"));
      return;
    }
    const ext = path.extname(file);
    res.writeHead(200, { "Content-Type": types[ext] ?? "application/octet-stream" });
    res.end(await readFile(file));
  })
  .listen(PORT, () => console.log(`serving out/ at http://localhost:${PORT}`));
