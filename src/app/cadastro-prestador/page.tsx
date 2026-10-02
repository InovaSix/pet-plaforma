import type { Metadata } from "next";
import { ProviderRegistration } from "@/components/provider-registration/ProviderRegistration";

export const metadata: Metadata = {
  title: "Cadastro de prestadores",
  description:
    "Cadastre-se como prestador na MundoPetCare: cuidadores, pet shops, veterinários, banho e tosa e lojas de ração.",
  robots: { index: false },
};

export default function CadastroPrestadorPage() {
  return <ProviderRegistration />;
}
