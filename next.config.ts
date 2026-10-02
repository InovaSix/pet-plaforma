import type { NextConfig } from "next";
import { PHASE_DEVELOPMENT_SERVER } from "next/constants";

// Static export so the site can be published as plain HTML/CSS/JS on
// GitHub Pages. PAGES_BASE_PATH is injected by the deploy workflow
// (actions/configure-pages) and is undefined for local dev/build, which
// Next.js treats as "no base path".
//
// A static site has no server, so API route handlers (files named
// `route.api.ts`) are only picked up by `next dev`. The export build ignores
// them and keeps publishing the same static site as before.
export default function config(phase: string): NextConfig {
  const withServer = phase === PHASE_DEVELOPMENT_SERVER;
  return {
    output: withServer ? undefined : "export",
    pageExtensions: withServer ? ["tsx", "ts", "api.ts"] : ["tsx", "ts"],
    basePath: process.env.PAGES_BASE_PATH,
    images: {
      unoptimized: true,
    },
  };
}
