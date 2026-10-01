// Hook de resolução para `node --test`: permite importar os módulos .ts do
// projeto (alias "@/" e imports sem extensão) usando o suporte nativo do
// Node a TypeScript, sem adicionar dependências de teste.
import { existsSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";

const srcDir = new URL("../src/", import.meta.url);

export async function resolve(specifier, context, nextResolve) {
  let target = specifier;
  if (specifier.startsWith("@/")) {
    target = new URL(specifier.slice(2), srcDir).href;
  } else if (specifier.startsWith(".") && context.parentURL) {
    target = new URL(specifier, context.parentURL).href;
  }
  if (target.startsWith("file:") && !/\.[cm]?[jt]sx?$/.test(target)) {
    const candidate = `${target}.ts`;
    if (existsSync(fileURLToPath(candidate))) {
      return nextResolve(pathToFileURL(fileURLToPath(candidate)).href, context);
    }
  }
  return nextResolve(target, context);
}
