"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";

const DISMISS_KEY = "mundopetcare:install-dismissed-at";
const DISMISS_DAYS = 7;
const SHOW_DELAY_MS = 3000;

// Evento do Chrome/Android que permite abrir o diálogo de instalação.
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

type Mode = "hidden" | "android" | "ios";

function isStandalone() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

function isIOS() {
  const ua = navigator.userAgent;
  // iPadOS se identifica como Mac, mas tem tela touch.
  return (
    /iPad|iPhone|iPod/.test(ua) ||
    (ua.includes("Macintosh") && navigator.maxTouchPoints > 1)
  );
}

function recentlyDismissed() {
  try {
    const at = Number(localStorage.getItem(DISMISS_KEY));
    return at > 0 && Date.now() - at < DISMISS_DAYS * 24 * 60 * 60 * 1000;
  } catch {
    return false;
  }
}

export function InstallPrompt() {
  const [mode, setMode] = useState<Mode>("hidden");
  const [installEvent, setInstallEvent] =
    useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    if (isStandalone() || recentlyDismissed()) return;

    const onBeforeInstall = (event: Event) => {
      event.preventDefault();
      setInstallEvent(event as BeforeInstallPromptEvent);
      setMode("android");
    };
    const onInstalled = () => setMode("hidden");

    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    window.addEventListener("appinstalled", onInstalled);

    // O Safari não dispara beforeinstallprompt: mostramos a dica manual.
    const timer = isIOS()
      ? window.setTimeout(() => setMode("ios"), SHOW_DELAY_MS)
      : undefined;

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
      window.removeEventListener("appinstalled", onInstalled);
      window.clearTimeout(timer);
    };
  }, []);

  const dismiss = () => {
    setMode("hidden");
    try {
      localStorage.setItem(DISMISS_KEY, String(Date.now()));
    } catch {
      // sem localStorage (aba anônima): só esconde nesta visita
    }
  };

  const install = async () => {
    if (!installEvent) return;
    await installEvent.prompt();
    const { outcome } = await installEvent.userChoice;
    setInstallEvent(null);
    if (outcome === "accepted") setMode("hidden");
    else dismiss();
  };

  if (mode === "hidden") return null;

  return (
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
          {mode === "android" ? (
            <p className="mt-1 text-sm text-ink-soft">
              Acesse mais rápido, direto da tela inicial do seu celular.
            </p>
          ) : (
            <p className="mt-1 text-sm text-ink-soft">
              Toque em{" "}
              <Icon
                name="share"
                className="inline h-4 w-4 align-[-2px] text-forest-700"
              />{" "}
              <strong className="font-medium text-ink">Compartilhar</strong> e
              depois em{" "}
              <strong className="font-medium text-ink">
                Adicionar à Tela de Início
              </strong>
              .
            </p>
          )}
          {mode === "android" && (
            <Button size="sm" onClick={install} className="mt-3 rounded-full">
              <Icon name="download" className="h-4 w-4" />
              Instalar app
            </Button>
          )}
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
  );
}
