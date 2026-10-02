import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Inter } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { InstallPrompt } from "@/components/pwa/InstallPrompt";
import { ServiceWorkerRegister } from "@/components/pwa/ServiceWorkerRegister";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-bricolage",
});

const siteUrl = "https://petcare.example";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "MundoPetCare | Cuidado e carinho quando você não pode estar",
    template: "%s | MundoPetCare",
  },
  description:
    "Encontre cuidadores de confiança para passeios, visitas e cuidados. Acompanhe o serviço em tempo real e receba fotos e atualizações do seu melhor amigo.",
  applicationName: "MundoPetCare",
  keywords: [
    "cuidador de cães",
    "passeador de cães",
    "pet sitter",
    "dog walker",
    "hospedagem de pets",
  ],
  authors: [{ name: "MundoPetCare" }],
  appleWebApp: {
    capable: true,
    title: "MundoPetCare",
    statusBarStyle: "default",
  },
  formatDetection: { telephone: false },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "MundoPetCare",
    title: "MundoPetCare | Cuidado e carinho quando você não pode estar",
    description:
      "Cuidadores verificados para passeios, visitas e cuidados, com acompanhamento e fotos durante o serviço.",
  },
  twitter: {
    card: "summary_large_image",
    title: "MundoPetCare",
    description:
      "Cuidadores verificados para passeios, visitas e cuidados do seu pet.",
  },
};

export const viewport: Viewport = {
  themeColor: "#f7f6f1",
  colorScheme: "light",
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="pt-BR"
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${bricolage.variable} antialiased`}
    >
      <body className="flex min-h-dvh flex-col bg-cream text-ink">
        <a
          href="#conteudo"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-forest-600 focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white"
        >
          Pular para o conteúdo
        </a>
        <SiteHeader />
        <main id="conteudo" className="flex-1">
          {children}
        </main>
        <SiteFooter />
        <InstallPrompt />
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
