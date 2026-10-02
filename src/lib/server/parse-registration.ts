import {
  ABOUT_MAX_LENGTH,
  LAST_STEP,
  PHOTO_MAX_BYTES,
  TEXT_MAX_LENGTH,
  type RegistrationData,
  type SelectedPhoto,
  type TextFieldName,
} from "@/data/provider-registration";
import {
  isProviderCategory,
  validateStep,
  type ValidatedField,
} from "@/lib/provider-registration";

// Validação do cadastro no servidor. Primeiro confere o formato do que chegou
// (o corpo da requisição pode vir de qualquer lugar, não só do formulário) e
// depois aplica as mesmas regras que o navegador usa em cada etapa.

export type ParseResult =
  | { ok: true; data: RegistrationData }
  | { ok: false; fields: string[]; messages: string[] };

const TEXT_FIELDS: readonly TextFieldName[] = [
  "name",
  "business",
  "email",
  "phone",
  "crmv",
  "cep",
  "city",
  "address",
  "region",
  "about",
];

const PHOTO_TYPES = ["image/jpeg", "image/png", "image/webp"];
const SERVICES_MAX = 20;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parsePhoto(value: unknown): SelectedPhoto | null | undefined {
  if (value === null || value === undefined) return null;
  if (!isRecord(value)) return undefined;
  const { name, size, type } = value;
  if (
    typeof name !== "string" ||
    name.length === 0 ||
    name.length > TEXT_MAX_LENGTH ||
    typeof size !== "number" ||
    !Number.isInteger(size) ||
    size <= 0 ||
    size > PHOTO_MAX_BYTES ||
    typeof type !== "string" ||
    !PHOTO_TYPES.includes(type)
  ) {
    return undefined;
  }
  return { name, size, type };
}

export function parseRegistration(input: unknown): ParseResult {
  if (!isRecord(input)) {
    return {
      ok: false,
      fields: [],
      messages: ["Envie os dados do cadastro em formato JSON."],
    };
  }

  const fields: string[] = [];
  const messages: string[] = [];

  const category = typeof input.category === "string" ? input.category : "";
  if (!isProviderCategory(category)) {
    return {
      ok: false,
      fields: ["category"],
      messages: ["Escolha uma categoria para continuar."],
    };
  }

  const text = {} as Record<TextFieldName, string>;
  for (const field of TEXT_FIELDS) {
    const raw = input[field] ?? "";
    const limit = field === "about" ? ABOUT_MAX_LENGTH : TEXT_MAX_LENGTH;
    if (typeof raw !== "string" || raw.length > limit) {
      fields.push(field);
      text[field] = "";
    } else {
      text[field] = raw.trim();
    }
  }
  if (fields.length > 0) {
    messages.push("Alguns campos vieram em formato inválido ou longos demais.");
  }

  const services = input.services;
  const serviceList =
    Array.isArray(services) &&
    services.length <= SERVICES_MAX &&
    services.every((service) => typeof service === "string")
      ? [...new Set(services as string[])]
      : null;
  if (!serviceList) {
    fields.push("services");
    messages.push("Selecione pelo menos um serviço.");
  }

  const photo = parsePhoto(input.photo);
  if (photo === undefined) {
    fields.push("photo");
    messages.push("A foto deve ser JPEG, PNG ou WebP, com até 5 MB.");
  }

  if (fields.length > 0) return { ok: false, fields, messages };

  const data: RegistrationData = {
    category,
    ...text,
    // O CRMV só faz sentido para veterinários.
    crmv: category === "Veterinário" ? text.crmv : "",
    services: serviceList ?? [],
    photo: photo ?? null,
  };

  // Mesmas regras do navegador, juntando as pendências de todas as etapas.
  const invalid: ValidatedField[] = [];
  for (let step = 0; step < LAST_STEP; step += 1) {
    const found = validateStep(step, data);
    invalid.push(...found.fields);
    messages.push(...found.messages);
  }
  if (invalid.length > 0) return { ok: false, fields: invalid, messages };

  return { ok: true, data };
}
