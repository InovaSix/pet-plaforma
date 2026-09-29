import Link from "next/link";
import Image from "next/image";
import { Section } from "@/components/ui/Section";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { PawWatermark } from "@/components/ui/PawWatermark";
import { homeServiceCards } from "@/data/home";
import { assetPath } from "@/lib/asset-path";

export function Services() {
  return (
    <Section
      id="servicos"
      tone="cream"
      containerSize="wide"
      watermark={
        <PawWatermark className="top-8 -right-12 h-80 w-80 sm:h-[26rem] sm:w-[26rem]" />
      }
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-xl">
          <p className="text-xs font-semibold tracking-[0.16em] text-forest-600 uppercase">
            Nossos serviços
          </p>
          <h2 className="mt-3 text-3xl text-forest-800 sm:text-4xl">
            Tudo o que seu pet precisa, em um só lugar.
          </h2>
        </div>
        <Link
          href="/cuidadores"
          className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-forest-700 transition-colors hover:text-forest-900"
        >
          Ver todos os serviços
          <Icon name="arrow-right" className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:mt-14 lg:grid-cols-4">
        {homeServiceCards.map((service, index) => (
          <Reveal
            key={service.id}
            delay={index * 70}
            className="group flex h-full flex-col overflow-hidden rounded-[1.4rem] border border-line bg-white shadow-soft transition-[transform,box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:shadow-lift"
          >
            <div className="relative aspect-[1.35/1] overflow-hidden">
              <Image
                src={assetPath(service.image)}
                alt={service.imageAlt}
                fill
                sizes="(min-width: 1024px) 25vw, 50vw"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
              />
              <span className="absolute bottom-3 left-3 grid h-9 w-9 place-items-center rounded-full bg-forest-600 text-white shadow-soft">
                <Icon name="paw-print" className="h-4 w-4" />
              </span>
            </div>

            <div className="flex flex-1 items-end gap-3 p-4">
              <div className="min-w-0 flex-1">
                <h3 className="text-base font-semibold text-ink">
                  {service.title}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-ink-soft">
                  {service.description}
                </p>
              </div>
              <Link
                href={`/cuidadores?servico=${service.id}`}
                aria-label={`Ver cuidadores para ${service.title}`}
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-forest-50 text-forest-700 transition-colors hover:bg-forest-600 hover:text-white"
              >
                <Icon name="arrow-right" className="h-4 w-4" />
              </Link>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
