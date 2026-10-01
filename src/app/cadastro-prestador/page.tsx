import type { Metadata } from "next";
import { ProviderRegistration } from "@/components/provider-registration/ProviderRegistration";

export const metadata: Metadata = {
  title: "Cadastro de prestadores (prévia)",
  description:
    "Prévia do cadastro de prestadores da PetCare: cuidadores, pet shops, veterinários, banho e tosa e lojas de ração. O envio é apenas simulado.",
  robots: { index: false },
};

export default function CadastroPrestadorPage() {
  return <ProviderRegistration />;
}
