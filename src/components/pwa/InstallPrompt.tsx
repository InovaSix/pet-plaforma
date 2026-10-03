"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { InstallHelp } from "@/components/pwa/InstallHelp";
import {
  getPlatform,
  requestInstall,
  useInstallState,
} from "@/components/pwa/install-store";

const DISMISS_KEY = "mundopetcare:install-dismissed-at";
const DISMISS_DAYS = 7;
const SHOW_DELAY_MS = 3000;

function recentlyDismissed() {
  try {
    const at = Number(localStorage.getItem(DISMISS_KEY));
    return at > 0 && Date.now() - at < DISMISS_DAYS * 24 * 60 * 60 * 1000;
  } catch {
    return false;
  }
}

/**
 * Banner "Instale o app" que aparece sozinho no celular. Fechado, ele some por
 * 7 dias, mas o botão "Baixar app" do cabeçalho continua disponível. Também
 * monta o passo a passo de instalação usado pelos botões.
 */
export function InstallPrompt() {
  const { canPrompt, standalone, installed } = useInstallState();
  const [ios, setIos] = useState(false);
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    const isIos = getPlatform() === "ios";
    // O Safari não oferece instalação automática: mostramos o banner depois
    // de alguns segundos, com o botão para o passo a passo.
    const timer = window.setTimeout(
      () => {
        setIos(isIos);
        setDismissed(recentlyDismissed());
      },
      isIos ? SHOW_DELAY_MS : 0,
    );
    return () => window.clearTimeout(timer);
  }, []);

  const dismiss = () => {
    setDismissed(true);
    try {
      localStorage.setItem(DISMISS_KEY, String(Date.now()));
    } catch {
      // sem localStorage (aba anônima): só esconde nesta visita
    }
  };

  const visible = !dismissed && !standalone && !installed && (canPrompt || ios);

  return (
    <>
      <InstallHelp />
      {visible && (
        <div
          role="dialog"
          aria-label="Instalar o app MundoPetCare"
          className="fixed inset-x-3 bottom-[calc(0.75rem+env(safe-area-inset-bottom))] z-[60] mx-auto max-w-md rounded-2xl border border-line bg-paper p-4 shadow-lift sm:inset-x-auto sm:right-6 sm:bottom-6"
        >
          <div className="flex items-start gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-forest-50 text-forest-600">
              <Icon name="paw-print" className="h-6 w-6" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-display text-base font-semibold text-ink">
                Instale o app MundoPetCare
              </p>
              <p className="mt-1 text-sm text-ink-soft">
                Acesse mais rápido, direto da tela inicial do seu celular.
              </p>
              <Button
                size="sm"
                onClick={() => {
                  setDismissed(true);
                  void requestInstall();
                }}
                className="mt-3 rounded-full"
              >
                <Icon name="download" className="h-4 w-4" />
                {canPrompt ? "Instalar app" : "Ver como instalar"}
              </Button>
            </div>
            <button
              type="button"
              onClick={dismiss}
              aria-label="Fechar"
              className="-m-1 grid h-8 w-8 shrink-0 place-items-center rounded-lg text-ink-faint transition-colors hover:bg-forest-50 hover:text-ink"
            >
              <Icon name="x" className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
