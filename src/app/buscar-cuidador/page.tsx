import type { Metadata } from "next";
import { Suspense } from "react";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { SearchForm } from "@/components/search/SearchForm";

export const metadata: Metadata = {
  title: "Buscar cuidador",
  description:
    "Diga onde você está, qual serviço precisa e quando. A MundoPetCare mostra os cuidadores verificados disponíveis por perto.",
};

const assurances = [
  {
    icon: "badge-check",
    title: "Cuidadores verificados",
    text: "Documento, referências e entrevista antes de entrar na plataforma.",
  },
  {
    icon: "map-pin",
    title: "Perto de você",
    text: "Resultados ordenados por distância da sua região.",
  },
  {
    icon: "camera",
    title: "Acompanhamento no serviço",
    text: "Início, localização e fotos durante cada atendimento.",
  },
] as const;

function FormFallback() {
  return (
    <div className="rounded-3xl border border-line bg-white p-6 shadow-lift sm:p-8">
      <div className="h-5 w-48 animate-pulse rounded bg-line" />
      <div className="mt-4 h-12 w-full animate-pulse rounded-xl bg-line/70" />
      <div className="mt-6 h-5 w-32 animate-pulse rounded bg-line" />
      <div className="mt-3 grid gap-2 sm:grid-cols-3">
        <div className="h-24 animate-pulse rounded-xl bg-line/70" />
        <div className="h-24 animate-pulse rounded-xl bg-line/70" />
        <div className="h-24 animate-pulse rounded-xl bg-line/70" />
      </div>
      <div className="mt-8 h-13 w-full animate-pulse rounded-xl bg-line/70" />
    </div>
  );
}

export default function BuscarCuidadorPage() {
  return (
    <div className="bg-cream py-14 sm:py-20">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
          <div className="max-w-md lg:pt-6">
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-forest-600">
              <span className="h-1.5 w-1.5 rounded-full bg-forest-500" />
              Buscar cuidador
            </span>
            <h1 className="mt-4 text-3xl font-semibold text-ink sm:text-4xl">
              Vamos encontrar quem cuida bem do seu pet
            </h1>
            <p className="mt-4 text-base leading-relaxed text-ink-soft">
              Preencha os três campos e veja quem está disponível. Em seguida
              você compara perfis, avaliações e valores, sem compromisso.
            </p>

            <ul className="mt-8 space-y-4">
              {assurances.map((item) => (
                <li key={item.title} className="flex gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white text-forest-700 ring-1 ring-inset ring-line-strong">
                    <Icon name={item.icon} className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-ink">{item.title}</p>
                    <p className="text-sm text-ink-soft">{item.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <Suspense fallback={<FormFallback />}>
              <SearchForm />
            </Suspense>
          </div>
        </div>
      </Container>
    </div>
  );
}
