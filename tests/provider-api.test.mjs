import { register } from "node:module";
import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { after, test } from "node:test";

register("./ts-resolve.mjs", import.meta.url);

// Cada execução grava num arquivo temporário, nunca em data/prestadores.json.
const dir = await mkdtemp(path.join(tmpdir(), "petcare-api-"));
const storeFile = path.join(dir, "prestadores.json");
process.env.PROVIDER_STORE_PATH = storeFile;
after(() => rm(dir, { recursive: true, force: true }));

const { POST, GET } = await import("../src/app/api/prestadores/route.api.ts");

const complete = {
  category: "Cuidador",
  name: "  Ana Oliveira ",
  business: "",
  email: "ana@exemplo.com",
  phone: "(41) 99999-0000",
  crmv: "",
  cep: "80000-000",
  city: "Curitiba, PR",
  address: "",
  region: "Centro",
  about: "",
  services: ["Passeio"],
  photo: { name: "ana.jpg", size: 1024, type: "image/jpeg" },
};

function post(body, contentType = "application/json") {
  return POST(
    new Request("http://localhost/api/prestadores", {
      method: "POST",
      headers: { "content-type": contentType },
      body: typeof body === "string" ? body : JSON.stringify(body),
    }),
  );
}

test("cadastro válido é salvo com status em análise", async () => {
  const response = await post(complete);
  assert.equal(response.status, 201);
  const created = await response.json();
  assert.equal(created.status, "em_analise");

  const saved = JSON.parse(await readFile(storeFile, "utf8"));
  const record = saved.find((item) => item.id === created.id);
  assert.equal(record.name, "Ana Oliveira");
  assert.deepEqual(record.services, ["Passeio"]);

  const listed = await (await GET()).json();
  assert.ok(listed.some((item) => item.id === created.id));
});

test("usa as mesmas mensagens de validação do formulário", async () => {
  const response = await post({ ...complete, email: "ana@", cep: "123" });
  assert.equal(response.status, 400);
  const body = await response.json();
  assert.deepEqual(body.fields, ["email", "cep"]);
  assert.ok(
    body.messages.includes("Informe um e-mail válido, como voce@exemplo.com."),
  );
});

test("veterinário precisa de CRMV e estabelecimento", async () => {
  const body = await (await post({ ...complete, category: "Veterinário" })).json();
  assert.deepEqual(body.fields, ["business", "crmv", "services"]);
});

test("recusa formatos inesperados", async () => {
  assert.equal((await post("{quebrado")).status, 400);
  assert.equal((await post(complete, "text/plain")).status, 415);
  assert.equal((await post([])).status, 400);
  assert.equal((await post({ ...complete, category: "Hacker" })).status, 400);
  assert.equal((await post({ ...complete, name: 42 })).status, 400);
  assert.equal(
    (await post({ ...complete, name: "a".repeat(500) })).status,
    400,
  );
  assert.equal(
    (await post({ ...complete, photo: { name: "x.svg", size: 10, type: "image/svg+xml" } }))
      .status,
    400,
  );
  assert.equal((await post({ ...complete, about: "a".repeat(20000) })).status, 413);
});
