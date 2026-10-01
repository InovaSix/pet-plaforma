import {
  LAST_STEP,
  PHOTO_MAX_BYTES,
  providerCategories,
  servicesByCategory,
  type ProviderCategory,
  type RegistrationData,
} from "@/data/provider-registration";

// Validação feita no navegador para guiar o preenchimento. Ela não substitui
// a validação no servidor quando houver uma integração real.

export type ValidatedField =
  | "category"
  | "name"
  | "business"
  | "email"
  | "phone"
  | "crmv"
  | "cep"
  | "city"
  | "region"
  | "services";

export interface StepIssues {
  /** Campos inválidos, na ordem em que aparecem na tela. */
  fields: ValidatedField[];
  /** Mensagens exibidas ao usuário, na ordem de exibição. */
  messages: string[];
}

const blank = (value: string) => value.trim().length === 0;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/;
const PHONE_CHARS = /^[\d\s()+.-]+$/;
const CEP_PATTERN = /^\d{5}-?\d{3}$/;

export function isValidEmail(value: string): boolean {
  return EMAIL_PATTERN.test(value.trim());
}

/** Telefone brasileiro com DDD: 10 ou 11 dígitos, com ou sem o código 55. */
export function isValidPhone(value: string): boolean {
  const trimmed = value.trim();
  if (!PHONE_CHARS.test(trimmed)) return false;
  const digits = trimmed.replace(/\D/g, "");
  const local = digits.length > 11 && digits.startsWith("55")
    ? digits.slice(2)
    : digits;
  return local.length === 10 || local.length === 11;
}

export function isValidCep(value: string): boolean {
  return CEP_PATTERN.test(value.trim());
}

export function isProviderCategory(value: string): value is ProviderCategory {
  return (providerCategories as readonly string[]).includes(value);
}

export function businessRequired(category: ProviderCategory): boolean {
  return category !== "Cuidador";
}

function issues(): StepIssues {
  return { fields: [], messages: [] };
}

function validateCategory(data: RegistrationData): StepIssues {
  const result = issues();
  if (!isProviderCategory(data.category)) {
    result.fields.push("category");
    result.messages.push("Escolha uma categoria para continuar.");
  }
  return result;
}

function validateProviderData(data: RegistrationData): StepIssues {
  const result = issues();
  const missing: ValidatedField[] = [];
  if (blank(data.name)) missing.push("name");
  const businessMissing =
    businessRequired(data.category) && blank(data.business);
  const emailMissing = blank(data.email);
  const phoneMissing = blank(data.phone);
  const emailInvalid = !emailMissing && !isValidEmail(data.email);
  const phoneInvalid = !phoneMissing && !isValidPhone(data.phone);
  const crmvMissing = data.category === "Veterinário" && blank(data.crmv);

  // Ordem dos campos na tela: nome, nome profissional/estabelecimento,
  // e-mail, telefone e CRMV.
  if (businessMissing) missing.push("business");
  if (emailMissing || emailInvalid) missing.push("email");
  if (phoneMissing || phoneInvalid) missing.push("phone");
  if (crmvMissing) missing.push("crmv");
  result.fields = missing;

  if (blank(data.name) || emailMissing || phoneMissing) {
    result.messages.push("Preencha nome, e-mail e telefone para continuar.");
  }
  if (businessMissing) {
    result.messages.push("Informe o nome do estabelecimento.");
  }
  if (crmvMissing) result.messages.push("Informe o CRMV e o estado.");
  if (emailInvalid) {
    result.messages.push("Informe um e-mail válido, como voce@exemplo.com.");
  }
  if (phoneInvalid) {
    result.messages.push(
      "Informe um telefone com DDD, como (41) 99999-0000.",
    );
  }
  return result;
}

function validateLocation(data: RegistrationData): StepIssues {
  const result = issues();
  const cepMissing = blank(data.cep);
  const cepInvalid = !cepMissing && !isValidCep(data.cep);

  if (cepMissing || cepInvalid) result.fields.push("cep");
  if (blank(data.city)) result.fields.push("city");
  if (blank(data.region)) result.fields.push("region");

  if (cepMissing || blank(data.city) || blank(data.region)) {
    result.messages.push("Preencha CEP, cidade e regiões atendidas.");
  }
  if (cepInvalid) {
    result.messages.push("Informe um CEP com 8 dígitos, como 00000-000.");
  }
  return result;
}

function validateServices(data: RegistrationData): StepIssues {
  const result = issues();
  const allowed = isProviderCategory(data.category)
    ? servicesByCategory[data.category]
    : [];
  const valid = data.services.filter((service) => allowed.includes(service));
  if (valid.length === 0 || valid.length !== data.services.length) {
    result.fields.push("services");
    result.messages.push("Selecione pelo menos um serviço.");
  }
  return result;
}

/** Valida uma etapa (0 a 3). A revisão (etapa 4) não tem campos próprios. */
export function validateStep(step: number, data: RegistrationData): StepIssues {
  switch (step) {
    case 0:
      return validateCategory(data);
    case 1:
      return validateProviderData(data);
    case 2:
      return validateLocation(data);
    case 3:
      return validateServices(data);
    default:
      return issues();
  }
}

/** Primeira etapa com pendências, ou `null` se tudo estiver válido. */
export function firstInvalidStep(data: RegistrationData): number | null {
  for (let step = 0; step < LAST_STEP; step += 1) {
    if (validateStep(step, data).fields.length > 0) return step;
  }
  return null;
}

/**
 * Troca a categoria descartando apenas o que deixa de fazer sentido:
 * serviços que não existem na nova categoria e o CRMV fora de Veterinário.
 */
export function changeCategory(
  data: RegistrationData,
  category: ProviderCategory,
): RegistrationData {
  if (data.category === category) return data;
  const allowed = servicesByCategory[category];
  return {
    ...data,
    category,
    services: data.services.filter((service) => allowed.includes(service)),
    crmv: category === "Veterinário" ? data.crmv : "",
  };
}

// --- Foto -----------------------------------------------------------------

const PHOTO_TYPES: Record<string, readonly string[]> = {
  "image/jpeg": ["jpg", "jpeg"],
  "image/png": ["png"],
  "image/webp": ["webp"],
};

function matchesSignature(type: string, bytes: Uint8Array): boolean {
  const starts = (...expected: number[]) =>
    expected.every((value, index) => bytes[index] === value);
  switch (type) {
    case "image/jpeg":
      return starts(0xff, 0xd8, 0xff);
    case "image/png":
      return starts(0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a);
    case "image/webp":
      // "RIFF" .... "WEBP"
      return (
        starts(0x52, 0x49, 0x46, 0x46) &&
        bytes[8] === 0x57 &&
        bytes[9] === 0x45 &&
        bytes[10] === 0x42 &&
        bytes[11] === 0x50
      );
    default:
      return false;
  }
}

/**
 * Confere tipo declarado, extensão, tamanho e assinatura do arquivo.
 * Retorna a mensagem de erro, ou `null` quando a foto é aceita.
 */
export async function validatePhoto(
  file: Pick<File, "name" | "size" | "type" | "slice">,
): Promise<string | null> {
  const extension = file.name.split(".").pop()?.toLowerCase() ?? "";
  const extensions = PHOTO_TYPES[file.type];
  if (!extensions || !extensions.includes(extension)) {
    return "Escolha uma imagem JPEG, PNG ou WebP.";
  }
  if (file.size === 0) return "O arquivo selecionado está vazio.";
  if (file.size > PHOTO_MAX_BYTES) return "A foto deve ter no máximo 5 MB.";

  const header = new Uint8Array(await file.slice(0, 12).arrayBuffer());
  if (!matchesSignature(file.type, header)) {
    return "Não foi possível confirmar que o arquivo é uma imagem JPEG, PNG ou WebP.";
  }
  return null;
}
