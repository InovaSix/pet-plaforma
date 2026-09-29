import Link from "next/link";
import { Logo } from "@/components/Logo";
import { socialLinks, primaryNav } from "@/data/navigation";

const currentYear = new Date().getFullYear();

function SocialGlyph({ name }: { name: string }) {
  const common = {
    viewBox: "0 0 24 24",
    className: "h-4 w-4 fill-current",
    "aria-hidden": true as const,
  };

  if (name === "Instagram") {
    return (
      <svg {...common}>
        <path d="M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4zm10 1.8H7A2.2 2.2 0 0 0 4.8 7v10A2.2 2.2 0 0 0 7 19.2h10A2.2 2.2 0 0 0 19.2 17V7A2.2 2.2 0 0 0 17 4.8zM12 8.2A3.8 3.8 0 1 1 8.2 12 3.8 3.8 0 0 1 12 8.2zm0 1.6A2.2 2.2 0 1 0 14.2 12 2.2 2.2 0 0 0 12 9.8zm4.55-3.05a.95.95 0 1 1-.95.95.95.95 0 0 1 .95-.95z" />
      </svg>
    );
  }

  if (name === "Facebook") {
    return (
      <svg {...common}>
        <path d="M14 9h3V6h-3c-2.2 0-4 1.8-4 4v2H8v3h2v7h3v-7h2.6l.4-3H13v-2c0-.6.4-1 1-1z" />
      </svg>
    );
  }

  return (
    <svg {...common}>
      <path d="M23 7.2a3 3 0 0 0-2.1-2.1C19 4.7 12 4.7 12 4.7s-7 0-8.9.4A3 3 0 0 0 1 7.2 31.6 31.6 0 0 0 .6 12a31.6 31.6 0 0 0 .4 4.8 3 3 0 0 0 2.1 2.1c1.9.4 8.9.4 8.9.4s7 0 8.9-.4a3 3 0 0 0 2.1-2.1A31.6 31.6 0 0 0 23.4 12 31.6 31.6 0 0 0 23 7.2zM9.8 15.5V8.5L15.8 12z" />
    </svg>
  );
}

export function SiteFooter() {
  return (
    <footer className="bg-forest-900 text-forest-100">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-5 py-10 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div className="flex max-w-sm items-start gap-3">
          <Logo tone="inverse" href="/" />
        </div>
        <p className="hidden max-w-xs text-sm text-forest-100/65 lg:block">
          Conectando tutores e cuidadores de confiança.
        </p>

        <nav aria-label="Rodapé" className="flex flex-wrap gap-x-6 gap-y-2">
          {primaryNav.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-forest-100/75 transition-colors hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {socialLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              aria-label={link.label}
              className="grid h-9 w-9 place-items-center rounded-full text-forest-100/80 transition-colors hover:bg-white/10 hover:text-white"
            >
              <SocialGlyph name={link.label} />
            </Link>
          ))}
        </div>
      </div>

      <div className="border-t border-forest-800">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-5 py-5 text-xs text-forest-100/55 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>© {currentYear} PetCare. Todos os direitos reservados.</p>
          <div className="flex gap-5">
            <Link href="/#seguranca" className="hover:text-white">
              Termos de uso
            </Link>
            <Link href="/#seguranca" className="hover:text-white">
              Política de privacidade
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
