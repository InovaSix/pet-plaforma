"use client";

import { useEffect } from "react";
import { assetPath } from "@/lib/asset-path";

/**
 * Registra o service worker do PWA só em produção. Em `next dev` ele
 * atrapalharia o hot reload, então qualquer registro antigo é removido.
 */
export function ServiceWorkerRegister() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    if (process.env.NODE_ENV !== "production") {
      navigator.serviceWorker
        .getRegistrations()
        .then((registrations) => registrations.forEach((r) => r.unregister()))
        .catch(() => {});
      return;
    }

    navigator.serviceWorker
      .register(assetPath("/sw.js"), {
        scope: assetPath("/"),
        updateViaCache: "none",
      })
      .catch(() => {});
  }, []);

  return null;
}
