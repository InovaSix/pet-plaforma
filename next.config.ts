import type { NextConfig } from "next";

// O site roda como servidor Node.js (`next start`), por exemplo como app
// Node.js na Hostinger, com as rotas de API ativas.
const nextConfig: NextConfig = {
  // O build da Hostinger tem pouca memória: com o Turbopack ele é encerrado
  // sem log (falta de memória com 1 GB). O `npm run build` usa o webpack
  // (`--webpack`) com estas opções, que cabem em 768 MB.
  experimental: {
    webpackMemoryOptimizations: true,
    cpus: 1,
  },
  async headers() {
    return [
      {
        // O service worker sempre busca a versão nova, para as atualizações
        // chegarem aos usuários.
        source: "/sw.js",
        headers: [
          { key: "Cache-Control", value: "no-cache, no-store, must-revalidate" },
        ],
      },
    ];
  },
};

export default nextConfig;
