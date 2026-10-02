import { register } from "node:module";
import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { after, test } from "node:test";

register("./ts-resolve.mjs", import.meta.url);

// Cada execução grava num arquivo temporário, nunca em data/prestadores.json
// nem no Supabase.
delete process.env.NEXT_PUBLIC_SUPABASE_URL;
delete process.env.SUPABASE_SERVICE_ROLE_KEY;
const dir = await mkdtemp(path.join(tmpdir(), "mundopetcare-api-"));
const storeFile = path.join(dir, "prestadores.json");
process.env.PROVIDER_STORE_PATH = storeFile;
after(() => rm(dir, { recursive: true, force: true }));

const { POST, GET } = await import("../src/app/api/prestadores/route.ts");

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
  photo: null,
};

const JPEG_HEADER = [0xff, 0xd8, 0xff, 0xe0, 0, 0x10, 0x4a, 0x46, 0x49, 0x46, 0, 1];
const jpeg = (name = "ana.jpg", size = 1024) => {
  const bytes = new Uint8Array(size);
  bytes.set(JPEG_HEADER);
  return new File([bytes], name, { type: "image/jpeg" });
};

/** Monta o mesmo multipart que o formulário envia. */
function post(dados, foto = null, headers = {}) {
  const body = new FormData();
  if (dados !== undefined) {
    body.append("dados", typeof dados === "string" ? dados : JSON.stringify(dados));
  }
  if (foto) body.append("foto", foto);
  return POST(
    new Request("http://localhost/api/prestadores", { method: "POST", body, headers }),
  );
}

test("cadastro válido é salvo com status em análise e dados da foto recebida", async () => {
  // O que o navegador diz sobre a foto é ignorado: vale o arquivo enviado.
  const response = await post(
    { ...complete, photo: { name: "mentira.png", size: 1, type: "image/png" } },
    jpeg(),
  );
  assert.equal(response.status, 201);
  const created = await response.json();
  assert.equal(created.status, "em_analise");

  const saved = JSON.parse(await readFile(storeFile, "utf8"));
  const record = saved.find((item) => item.id === created.id);
  assert.equal(record.name, "Ana Oliveira");
  assert.deepEqual(record.services, ["Passeio"]);
  assert.deepEqual(record.photo, { name: "ana.jpg", size: 1024, type: "image/jpeg" });

  const listed = await (await GET()).json();
  assert.ok(listed.some((item) => item.id === created.id));
});

test("a foto é opcional", async () => {
  const response = await post(complete);
  assert.equal(response.status, 201);
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

test("recusa fotos que não são imagens de verdade", async () => {
  const svg = new File(["<svg/>"], "x.svg", { type: "image/svg+xml" });
  const fake = new File(["não sou jpeg"], "x.jpg", { type: "image/jpeg" });
  for (const file of [svg, fake]) {
    const response = await post(complete, file);
    assert.equal(response.status, 400);
    assert.deepEqual((await response.json()).fields, ["photo"]);
  }
});

test("recusa formatos inesperados", async () => {
  const json = await POST(
    new Request("http://localhost/api/prestadores", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(complete),
    }),
  );
  assert.equal(json.status, 415);
  assert.equal((await post(undefined)).status, 400);
  assert.equal((await post("{quebrado")).status, 400);
  assert.equal((await post([])).status, 400);
  assert.equal((await post({ ...complete, category: "Hacker" })).status, 400);
  assert.equal((await post({ ...complete, name: 42 })).status, 400);
  assert.equal((await post({ ...complete, name: "a".repeat(500) })).status, 400);
  assert.equal((await post({ ...complete, about: "a".repeat(20000) })).status, 413);
  assert.equal(
    (await post(complete, null, { "content-length": String(50 * 1024 * 1024) })).status,
    413,
  );
});
