// Conteúdo do cadastro de prestadores, transcrito do protótipo
// cadastro-prestador-pet.html. Textos, categorias e serviços devem
// permanecer iguais ao protótipo.

export const providerCategories = [
  "Cuidador",
  "Pet shop",
  "Veterinário",
  "Banho e tosa",
  "Loja de ração",
] as const;

export type ProviderCategory = (typeof providerCategories)[number];

export const categoryDescriptions: Record<ProviderCategory, string> = {
  Cuidador: "Passeios, visitas e pet sitter",
  "Pet shop": "Produtos e serviços para pets",
  Veterinário: "Consultas e atendimento veterinário",
  "Banho e tosa": "Higiene e cuidados com a pelagem",
  "Loja de ração": "Alimentação e acessórios",
};

export const servicesByCategory: Record<ProviderCategory, readonly string[]> = {
  Cuidador: ["Passeio", "Visita em casa", "Pet sitter"],
  "Pet shop": ["Venda de produtos", "Banho e tosa", "Entrega"],
  Veterinário: ["Consulta", "Atendimento em domicílio", "Vacinação"],
  "Banho e tosa": ["Banho", "Tosa", "Corte de unhas"],
  "Loja de ração": ["Rações", "Acessórios", "Entrega"],
};

export const registrationSteps = [
  {
    title: "Tipo de prestador",
    description: "Escolha a categoria que melhor representa seu trabalho.",
  },
  {
    title: "Seus dados",
    description: "Vamos começar pelas informações do responsável e do negócio.",
  },
  {
    title: "Local de atendimento",
    description: "Informe onde os tutores poderão encontrar seus serviços.",
  },
  {
    title: "Serviços e fotos",
    description: "Conte o que você oferece e personalize seu perfil.",
  },
  {
    title: "Revisar cadastro",
    description: "Confira as informações antes de enviar para análise.",
  },
] as const;

export const LAST_STEP = registrationSteps.length - 1;

/** Metadados da foto escolhida. O arquivo nunca sai do navegador. */
export interface SelectedPhoto {
  name: string;
  size: number;
  type: string;
}

export interface RegistrationData {
  category: ProviderCategory;
  name: string;
  business: string;
  email: string;
  phone: string;
  crmv: string;
  cep: string;
  city: string;
  address: string;
  region: string;
  about: string;
  services: string[];
  photo: SelectedPhoto | null;
}

export type TextFieldName = Exclude<
  keyof RegistrationData,
  "category" | "services" | "photo"
>;

export const emptyRegistration: RegistrationData = {
  category: "Cuidador",
  name: "",
  business: "",
  email: "",
  phone: "",
  crmv: "",
  cep: "",
  city: "",
  address: "",
  region: "",
  about: "",
  services: [],
  photo: null,
};

/** Limites técnicos da foto (somente imagens raster). */
export const PHOTO_MAX_BYTES = 5 * 1024 * 1024;
export const PHOTO_ACCEPT = "image/jpeg,image/png,image/webp";
export const PHOTO_LIMITS_TEXT = "Formatos JPEG, PNG ou WebP, até 5 MB.";

/** Tamanho máximo dos campos de texto, para evitar entradas desproporcionais. */
export const TEXT_MAX_LENGTH = 120;
export const ABOUT_MAX_LENGTH = 1000;
