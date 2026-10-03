"use client";

import { useSyncExternalStore } from "react";

// Estado da instalação do app (PWA), compartilhado entre o banner, os botões
// "Baixar app" do cabeçalho e o passo a passo.
//
// O Chrome/Android dispara `beforeinstallprompt` uma única vez por página, e
// pode ser antes de qualquer botão aparecer. Por isso o evento é capturado
// aqui, assim que este módulo carrega, e fica guardado para quem precisar.

// Evento do Chrome/Android que permite abrir o diálogo de instalação.
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export type InstallPlatform = "ios" | "android" | "desktop";

export interface InstallState {
  /** O navegador oferece o diálogo de instalação (Chrome/Edge/Android). */
  canPrompt: boolean;
  /** O site já está aberto como app instalado. */
  standalone: boolean;
  /** O app foi instalado nesta visita. */
  installed: boolean;
  /** O passo a passo de instalação está aberto. */
  helpOpen: boolean;
}

const serverState: InstallState = {
  canPrompt: false,
  standalone: false,
  installed: false,
  helpOpen: false,
};

let state = serverState;
let deferred: BeforeInstallPromptEvent | null = null;
const listeners = new Set<() => void>();

function update(patch: Partial<InstallState>) {
  state = { ...state, ...patch };
  listeners.forEach((listener) => listener());
}

function isStandalone() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

if (typeof window !== "undefined") {
  state = { ...state, standalone: isStandalone() };

  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    deferred = event as BeforeInstallPromptEvent;
    update({ canPrompt: true });
  });

  window.addEventListener("appinstalled", () => {
    deferred = null;
    update({ canPrompt: false, installed: true });
  });
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useInstallState(): InstallState {
  return useSyncExternalStore(
    subscribe,
    () => state,
    () => serverState,
  );
}

export function getPlatform(): InstallPlatform {
  const ua = navigator.userAgent;
  // iPadOS se identifica como Mac, mas tem tela touch.
  if (
    /iPad|iPhone|iPod/.test(ua) ||
    (ua.includes("Macintosh") && navigator.maxTouchPoints > 1)
  ) {
    return "ios";
  }
  if (/Android/i.test(ua)) return "android";
  return "desktop";
}

/**
 * Navegador embutido de outro app (Instagram, Facebook, TikTok...), que não
 * deixa instalar. A pessoa precisa abrir o site no Chrome ou no Safari.
 */
export function getInAppBrowser(): string | null {
  const ua = navigator.userAgent;
  if (/Instagram/i.test(ua)) return "Instagram";
  if (/FBAN|FBAV|FB_IAB/i.test(ua)) return "Facebook";
  if (/musical_ly|Bytedance|TikTok/i.test(ua)) return "TikTok";
  if (/LinkedInApp/i.test(ua)) return "LinkedIn";
  return null;
}

export function openInstallHelp() {
  update({ helpOpen: true });
}

export function closeInstallHelp() {
  update({ helpOpen: false });
}

/**
 * Abre a instalação: o diálogo do navegador quando ele oferece, ou o passo a
 * passo manual (iPhone, navegadores sem suporte ou depois de um cancelamento).
 */
export async function requestInstall(): Promise<void> {
  const event = deferred;
  if (!event) {
    openInstallHelp();
    return;
  }

  // O evento só pode ser usado uma vez.
  deferred = null;
  update({ canPrompt: false });
  try {
    await event.prompt();
    const { outcome } = await event.userChoice;
    if (outcome === "accepted") update({ installed: true });
  } catch {
    openInstallHelp();
  }
}
