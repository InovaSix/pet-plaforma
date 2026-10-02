import type { MetadataRoute } from "next";
import { assetPath } from "@/lib/asset-path";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: assetPath("/"),
    name: "PetCare – Cuidadores de confiança",
    short_name: "PetCare",
    description:
      "Encontre cuidadores de confiança para passeios, visitas e cuidados. Acompanhe o serviço em tempo real e receba fotos e atualizações do seu melhor amigo.",
    lang: "pt-BR",
    start_url: assetPath("/?source=pwa"),
    scope: assetPath("/"),
    display: "standalone",
    orientation: "portrait",
    background_color: "#f7f6f1",
    theme_color: "#f7f6f1",
    categories: ["lifestyle"],
    icons: [
      {
        src: assetPath("/icons/icon-192.png"),
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: assetPath("/icons/icon-512.png"),
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: assetPath("/icons/icon-maskable-512.png"),
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    shortcuts: [
      {
        name: "Encontrar cuidador",
        url: assetPath("/buscar-cuidador"),
        icons: [{ src: assetPath("/icons/icon-192.png"), sizes: "192x192" }],
      },
      {
        name: "Seja cuidador",
        url: assetPath("/cadastro-prestador"),
        icons: [{ src: assetPath("/icons/icon-192.png"), sizes: "192x192" }],
      },
    ],
  };
}
