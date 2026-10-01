import { register } from "node:module";
import assert from "node:assert/strict";
import { test } from "node:test";

register("./ts-resolve.mjs", import.meta.url);

const {
  changeCategory,
  firstInvalidStep,
  isValidCep,
  isValidEmail,
  isValidPhone,
  validatePhoto,
  validateStep,
} = await import("../src/lib/provider-registration.ts");
const { emptyRegistration } = await import(
  "../src/data/provider-registration.ts"
);

const complete = {
  ...emptyRegistration,
  category: "Cuidador",
  name: "Ana Oliveira",
  email: "ana@exemplo.com",
  phone: "(41) 99999-0000",
  cep: "80000-000",
  city: "Curitiba, PR",
  region: "Centro",
  services: ["Passeio"],
};

test("formatos de e-mail, telefone e CEP", () => {
  assert.ok(isValidEmail("voce@exemplo.com"));
  assert.ok(!isValidEmail("voce@exemplo"));
  assert.ok(!isValidEmail("voce exemplo.com"));
  assert.ok(isValidPhone("(41) 99999-0000"));
  assert.ok(isValidPhone("4133334444"));
  assert.ok(isValidPhone("+55 41 99999-0000"));
  assert.ok(!isValidPhone("99999-0000"));
  assert.ok(!isValidPhone("41 9999a-0000"));
  assert.ok(isValidCep("80000-000"));
  assert.ok(isValidCep("80000000"));
  assert.ok(!isValidCep("8000-000"));
});

test("seus dados: obrigatórios e mensagens do protótipo", () => {
  const empty = validateStep(1, emptyRegistration);
  assert.deepEqual(empty.fields, ["name", "email", "phone"]);
  assert.deepEqual(empty.messages, [
    "Preencha nome, e-mail e telefone para continuar.",
  ]);

  const shop = validateStep(1, { ...complete, category: "Pet shop" });
  assert.deepEqual(shop.fields, ["business"]);
  assert.deepEqual(shop.messages, ["Informe o nome do estabelecimento."]);

  const vet = validateStep(1, {
    ...complete,
    category: "Veterinário",
    business: "Clínica",
  });
  assert.deepEqual(vet.fields, ["crmv"]);
  assert.deepEqual(vet.messages, ["Informe o CRMV e o estado."]);

  assert.deepEqual(validateStep(1, complete).fields, []);
});

test("local de atendimento: endereço é opcional e CEP é conferido", () => {
  assert.deepEqual(validateStep(2, complete).fields, []);
  const bad = validateStep(2, { ...complete, cep: "123" });
  assert.deepEqual(bad.fields, ["cep"]);
});

test("serviços precisam pertencer à categoria", () => {
  assert.deepEqual(validateStep(3, { ...complete, services: [] }).fields, [
    "services",
  ]);
  assert.deepEqual(
    validateStep(3, { ...complete, services: ["Consulta"] }).fields,
    ["services"],
  );
});

test("revisão bloqueia dados incompletos mesmo com navegação direta", () => {
  assert.equal(firstInvalidStep(emptyRegistration), 1);
  assert.equal(firstInvalidStep({ ...complete, region: " " }), 2);
  assert.equal(firstInvalidStep({ ...complete, services: [] }), 3);
  assert.equal(firstInvalidStep(complete), null);
});

test("trocar a categoria descarta apenas dados incompatíveis", () => {
  const shop = {
    ...complete,
    category: "Pet shop",
    business: "Pet Feliz",
    services: ["Banho e tosa", "Entrega"],
  };
  const feed = changeCategory(shop, "Loja de ração");
  assert.deepEqual(feed.services, ["Entrega"]);
  assert.equal(feed.business, "Pet Feliz");
  assert.equal(feed.name, complete.name);

  const vet = changeCategory(
    { ...complete, category: "Veterinário", crmv: "CRMV-PR 1" },
    "Cuidador",
  );
  assert.equal(vet.crmv, "");

  assert.equal(changeCategory(complete, "Cuidador"), complete);
});

const png = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0, 0, 0]);
const jpeg = new Uint8Array([0xff, 0xd8, 0xff, 0xe0, 0, 0, 0, 0, 0, 0, 0, 0]);
const webp = new Uint8Array([0x52, 0x49, 0x46, 0x46, 1, 0, 0, 0, 0x57, 0x45, 0x42, 0x50]);

test("foto: aceita JPEG, PNG e WebP verdadeiros", async () => {
  assert.equal(await validatePhoto(new File([png], "a.png", { type: "image/png" })), null);
  assert.equal(await validatePhoto(new File([jpeg], "a.JPG", { type: "image/jpeg" })), null);
  assert.equal(await validatePhoto(new File([webp], "a.webp", { type: "image/webp" })), null);
});

test("foto: rejeita SVG, HTML, extensão trocada, vazio e acima de 5 MB", async () => {
  const svg = new File(["<svg/>"], "a.svg", { type: "image/svg+xml" });
  assert.match(await validatePhoto(svg), /JPEG, PNG ou WebP/);
  const html = new File(["<html>"], "a.png", { type: "image/png" });
  assert.match(await validatePhoto(html), /Não foi possível confirmar/);
  const renamed = new File([png], "a.html", { type: "image/png" });
  assert.match(await validatePhoto(renamed), /JPEG, PNG ou WebP/);
  const empty = new File([], "a.png", { type: "image/png" });
  assert.match(await validatePhoto(empty), /vazio/);
  const big = new File([png, new Uint8Array(5 * 1024 * 1024)], "a.png", {
    type: "image/png",
  });
  assert.match(await validatePhoto(big), /5 MB/);
});
