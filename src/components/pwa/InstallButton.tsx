"use client";

import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { requestInstall, useInstallState } from "@/components/pwa/install-store";
import { cn } from "@/lib/utils";

interface InstallButtonProps {
  /** `icon`: só o ícone (cabeçalho no celular); `menu`: largura total. */
  variant?: "header" | "icon" | "menu";
  onClick?: () => void;
  className?: string;
}

/**
 * Botão "Baixar app", sempre disponível: abre a instalação do navegador ou o
 * passo a passo. Some quando o site já está aberto como app.
 */
export function InstallButton({
  variant = "header",
  onClick,
  className,
}: InstallButtonProps) {
  const { standalone } = useInstallState();
  if (standalone) return null;

  const handleClick = () => {
    onClick?.();
    void requestInstall();
  };

  if (variant === "icon") {
    return (
      <button
        type="button"
        onClick={handleClick}
        aria-label="Baixar o app MundoPetCare"
        className={cn(
          "grid h-10 w-10 place-items-center rounded-lg border border-line-strong bg-white text-forest-700 transition-colors hover:border-forest-300",
          className,
        )}
      >
        <Icon name="download" className="h-5 w-5" />
      </button>
    );
  }

  if (variant === "menu") {
    return (
      <Button
        variant="secondary"
        fullWidth
        onClick={handleClick}
        className={cn("rounded-full", className)}
      >
        <Icon name="download" className="h-4 w-4" />
        Baixar o app
      </Button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-ink-soft transition-colors hover:bg-forest-50 hover:text-forest-800",
        className,
      )}
    >
      <Icon name="download" className="h-4 w-4" />
      Baixar app
    </button>
  );
}
