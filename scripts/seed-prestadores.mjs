// Cadastra os prestadores de exemplo na API local, um por vez.
// Uso: com `npm run dev` rodando, `npm run seed`.
// Outra porta: `npm run seed -- http://localhost:3001`.
import { readFile } from "node:fs/promises";

const baseUrl = process.argv[2] ?? "http://localhost:3000";
const file = new URL("./seed/prestadores-exemplo.json", import.meta.url);
const providers = JSON.parse(await readFile(file, "utf8"));

let failures = 0;
for (const provider of providers) {
  // A API recebe multipart/form-data: o cadastro em `dados` (os exemplos não
  // têm foto, então o campo `foto` não vai).
  const form = new FormData();
  form.set("dados", JSON.stringify(provider));
  try {
    const response = await fetch(`${baseUrl}/api/prestadores`, {
      method: "POST",
      body: form,
    });
    const body = await response.json();
    if (response.status === 201) {
      console.log(`201  ${provider.name}  ${body.id}`);
    } else {
      failures += 1;
      console.log(`${response.status}  ${provider.name}  ${body.messages?.join(" ")}`);
    }
  } catch (error) {
    console.error(`Não consegui acessar ${baseUrl}. O npm run dev está rodando?`);
    console.error(error.message);
    process.exit(1);
  }
}

console.log(`\n${providers.length - failures} de ${providers.length} cadastrados.`);
process.exitCode = failures > 0 ? 1 : 0;
