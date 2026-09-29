"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { primaryNav } from "@/data/navigation";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b transition-colors duration-300",
        scrolled || menuOpen
          ? "border-line bg-cream/90 backdrop-blur-md"
          : "border-transparent bg-cream/70 backdrop-blur-sm",
      )}
    >
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-5 sm:px-6 lg:px-8">
        <Logo />

        <nav
          aria-label="Navegação principal"
          className="hidden items-center gap-1 lg:flex"
        >
          {primaryNav.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-ink-soft transition-colors hover:bg-forest-50 hover:text-forest-800"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-1 lg:flex">
          <Link
            href="/#cuidadores"
            className="rounded-lg px-3 py-2 text-sm font-medium text-ink-soft transition-colors hover:bg-forest-50 hover:text-forest-800"
          >
            Entrar
          </Link>
          <Button href="/buscar-cuidador" size="sm" className="rounded-full">
            Encontrar cuidador
            <Icon name="arrow-right" className="h-3.5 w-3.5" />
          </Button>
        </div>

        <button
          type="button"
          aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
          className="grid h-10 w-10 place-items-center rounded-lg border border-line-strong bg-white text-ink transition-colors hover:border-forest-300 lg:hidden"
        >
          <Icon name={menuOpen ? "x" : "menu"} className="h-5 w-5" />
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-line bg-cream lg:hidden">
          <nav
            aria-label="Navegação principal"
            className="mx-auto flex w-full max-w-7xl flex-col gap-1 px-5 py-4 sm:px-6"
          >
            {primaryNav.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                className="rounded-lg px-3 py-3 text-[0.95rem] font-medium text-ink transition-colors hover:bg-forest-50"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/#cuidadores"
              onClick={closeMenu}
              className="rounded-lg px-3 py-3 text-[0.95rem] font-medium text-ink transition-colors hover:bg-forest-50"
            >
              Entrar
            </Link>
            <Button
              href="/buscar-cuidador"
              onClick={closeMenu}
              fullWidth
              className="mt-2 rounded-full"
            >
              Encontrar cuidador
              <Icon name="arrow-right" className="h-4 w-4" />
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
