// Service worker do PetCare (PWA).
// Mude CACHE_VERSION quando alterar este arquivo para descartar caches antigos.
const CACHE_VERSION = "v1";
const PAGES_CACHE = `petcare-pages-${CACHE_VERSION}`;
const ASSETS_CACHE = `petcare-assets-${CACHE_VERSION}`;

// Funciona com ou sem sub-caminho (basePath): tudo é relativo ao escopo.
const BASE = new URL(self.registration.scope).pathname.replace(/\/$/, "");
// O build estático gera offline.html; o nome com extensão funciona em
// qualquer hospedagem (Apache/Hostinger, nginx, serve-out) sem regras extras.
const OFFLINE_URL = `${BASE}/offline.html`;
const PRECACHE = [
  OFFLINE_URL,
  `${BASE}/`,
  `${BASE}/icons/icon-192.png`,
  `${BASE}/icons/icon-512.png`,
];

// A página offline também precisa dos próprios JS/CSS/fontes, senão ela não
// carrega quando a internet cai antes de o usuário ter visitado a página.
async function precacheOfflineAssets() {
  const html = await (await caches.match(OFFLINE_URL)).text();
  const assets = new Set(
    html.match(new RegExp(`${BASE}/_next/static/[^"'\\s)\\\\]+`, "g")) ?? [],
  );
  const cache = await caches.open(ASSETS_CACHE);
  await Promise.all(
    [...assets].map((asset) => cache.add(asset).catch(() => {})),
  );
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(PAGES_CACHE)
      .then((cache) => cache.addAll(PRECACHE))
      .then(precacheOfflineAssets)
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  const keep = [PAGES_CACHE, ASSETS_CACHE];
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key.startsWith("petcare-") && !keep.includes(key))
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

function isStaticAsset(pathname) {
  return (
    pathname.startsWith(`${BASE}/_next/static/`) ||
    pathname.startsWith(`${BASE}/images/`) ||
    pathname.startsWith(`${BASE}/icons/`)
  );
}

// Páginas: tenta a rede primeiro; sem conexão, usa a cópia salva ou /offline.
async function networkFirst(request) {
  const cache = await caches.open(PAGES_CACHE);
  try {
    const response = await fetch(request);
    if (response.ok) cache.put(request, response.clone());
    return response;
  } catch {
    const cached = await cache.match(request, { ignoreSearch: true });
    if (cached) return cached;
    // Redireciona em vez de servir o HTML da página offline no endereço
    // original: o roteador do Next estranharia a URL e mostraria um erro.
    if (await cache.match(OFFLINE_URL)) {
      return Response.redirect(new URL(OFFLINE_URL, self.location.origin), 302);
    }
    return Response.error();
  }
}

// Arquivos estáticos (com hash no nome ou imagens): usa o cache primeiro.
async function cacheFirst(request) {
  const cache = await caches.open(ASSETS_CACHE);
  const cached = await cache.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response.ok) cache.put(request, response.clone());
  return response;
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  // Outros domínios, API e dados de sessão nunca passam pelo cache.
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith(`${BASE}/api/`)) return;

  if (request.mode === "navigate") {
    event.respondWith(networkFirst(request));
  } else if (isStaticAsset(url.pathname)) {
    event.respondWith(cacheFirst(request));
  }
});
