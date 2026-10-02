import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { ReloadButton } from "@/components/pwa/ReloadButton";

export const metadata: Metadata = {
  title: "Sem conexão",
  robots: { index: false, follow: false },
};

export default function OfflinePage() {
  return (
    <Container className="py-24 text-center">
      <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-forest-50 text-forest-600">
        <Icon name="paw-print" className="h-7 w-7" />
      </span>
      <h1 className="mt-6 font-display text-2xl font-semibold text-ink">
        Você está sem internet
      </h1>
      <p className="mx-auto mt-3 max-w-md text-sm text-ink-soft">
        Verifique sua conexão. Assim que ela voltar, o PetCare continua de onde
        você parou.
      </p>
      <div className="mt-6 flex justify-center">
        <ReloadButton />
      </div>
    </Container>
  );
}
