"use client";

import { Button } from "@/components/ui/Button";

export function ReloadButton() {
  return (
    <Button size="sm" onClick={() => window.location.reload()}>
      Tentar novamente
    </Button>
  );
}
