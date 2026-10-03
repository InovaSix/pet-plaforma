"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { Icon, type IconName } from "@/components/ui/Icon";
import {
  closeInstallHelp,
  getInAppBrowser,
  getPlatform,
  useInstallState,
  type InstallPlatform,
} from "@/components/pwa/install-store";

interface Step {
  icon: IconName;
  text: ReactNode;
}

const steps: Record<InstallPlatform, Step[]> = {
  ios: [
    {
      icon: "share",
      text: (
        <>
          No Safari, toque em <strong>Compartilhar</strong> (o quadrado com a
          seta para cima, na barra de baixo).
        </>
      ),
    },
    {
      icon: "square-plus",
      text: (
        <>
          Role a lista e toque em <strong>Adicionar à Tela de Início</strong>.
        </>
      ),
    },
    {
      icon: "check",
      text: (
        <>
          Toque em <strong>Adicionar</strong>. O ícone do MundoPetCare aparece
          na tela inicial.
        </>
      ),
    },
  ],
  android: [
    {
      icon: "ellipsis-vertical",
      text: (
        <>
          No Chrome, toque no menu <strong>⋮</strong> (três pontinhos, no canto
          de cima).
        </>
      ),
    },
    {
      icon: "download",
      text: (
        <>
          Toque em <strong>Instalar app</strong> ou{" "}
          <strong>Adicionar à tela inicial</strong>.
        </>
      ),
    },
    {
      icon: "check",
      text: (
        <>
          Confirme em <strong>Instalar</strong>. O ícone do MundoPetCare aparece
          na tela inicial.
        </>
      ),
    },
  ],
  desktop: [
    {
      icon: "download",
      text: (
        <>
          No Chrome ou no Edge, clique no ícone de instalar no fim da barra de
          endereço, ou no menu <strong>⋮</strong> e depois em{" "}
          <strong>Instalar MundoPetCare</strong>.
        </>
      ),
    },
    {
      icon: "smartphone",
      text: (
        <>
          Para ter no celular, abra este site no navegador do celular e toque em{" "}
          <strong>Baixar app</strong>.
        </>
      ),
    },
  ],
};

export function InstallHelp() {
  const { helpOpen, installed, standalone } = useInstallState();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!helpOpen) return;
    closeRef.current?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeInstallHelp();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [helpOpen]);

  if (!helpOpen) return null;

  // Só abre no navegador (helpOpen é sempre falso no servidor).
  const platform = getPlatform();
  const inApp = getInAppBrowser();
  const done = installed || standalone;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-end justify-center bg-ink/40 p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] backdrop-blur-sm sm:items-center"
      onClick={closeInstallHelp}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="install-help-title"
        onClick={(event) => event.stopPropagation()}
        className="w-full max-w-md rounded-2xl border border-line bg-paper p-5 shadow-lift sm:p-6"
      >
        <div className="flex items-start gap-3">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-forest-50 text-forest-600">
            <Icon name={done ? "check" : "paw-print"} className="h-6 w-6" />
          </span>
          <div className="min-w-0 flex-1">
            <h2
              id="install-help-title"
              className="font-display text-lg font-semibold text-ink"
            >
              {done ? "App instalado" : "Baixe o app MundoPetCare"}
            </h2>
            <p className="mt-1 text-sm text-ink-soft">
              {done
                ? "Procure o ícone do MundoPetCare na tela inicial do seu aparelho."
                : "É grátis, não ocupa quase nada de espaço e abre direto da tela inicial."}
            </p>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={closeInstallHelp}
            aria-label="Fechar"
            className="-m-1 grid h-8 w-8 shrink-0 place-items-center rounded-lg text-ink-faint transition-colors hover:bg-forest-50 hover:text-ink"
          >
            <Icon name="x" className="h-4 w-4" />
          </button>
        </div>

        {!done && inApp && (
          <p className="mt-5 rounded-xl bg-forest-50 p-4 text-sm text-forest-900">
            Você está no navegador do <strong>{inApp}</strong>, que não permite
            instalar apps. Toque no menu <strong>⋮</strong> ou{" "}
            <strong>•••</strong> e escolha{" "}
            <strong>
              Abrir no {platform === "ios" ? "Safari" : "Chrome"}
            </strong>
            . Depois siga os passos abaixo.
          </p>
        )}

        {!done && (
          <ol className="mt-5 space-y-3">
            {steps[platform].map((step, index) => (
              <li
                key={index}
                className="flex items-start gap-3 text-sm text-ink-soft [&_strong]:font-semibold [&_strong]:text-ink"
              >
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-forest-600 text-white">
                  <Icon name={step.icon} className="h-4 w-4" strokeWidth={2} />
                </span>
                <span className="pt-1.5">{step.text}</span>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}
