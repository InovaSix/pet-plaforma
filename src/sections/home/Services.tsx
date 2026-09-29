import Link from "next/link";
import Image from "next/image";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { IconTile } from "@/components/ui/IconTile";
import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { services } from "@/data/services";
import { formatBRL } from "@/lib/format";
import { cn } from "@/lib/utils";
import { assetPath } from "@/lib/asset-path";

const serviceImages = [
  "/images/gallery/g1.jpg",
  "/images/gallery/g2.jpg",
  "/images/gallery/g3.jpg",
  "/images/gallery/g4.jpg",
];

export function Services() {
  return (
    <Section id="servicos" tone="cream">
      <SectionHeading
        eyebrow="Serviços"
        title="O cuidado certo para a rotina do seu pet"
        description="Escolha o serviço e encontre cuidadores disponíveis na sua região."
      />

      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">
        {services.map((service, index) => {
          const comingSoon = service.status === "em-breve";
          return (
            <Reveal
              key={service.id}
              delay={index * 70}
              className={cn(
                "flex h-full flex-col overflow-hidden rounded-2xl border bg-white shadow-soft transition-[transform,box-shadow,border-color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
                comingSoon
                  ? "border-dashed border-line-strong bg-cream/50"
                  : "border-line hover:-translate-y-1 hover:border-forest-200 hover:shadow-lift",
              )}
            >
              <div className="relative aspect-[1.55/1] overflow-hidden">
                <Image
                  src={assetPath(serviceImages[index])}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 25vw, 50vw"
                  className="object-cover"
                />
                <IconTile
                  name={service.icon}
                  size="md"
                  tone={comingSoon ? "outline" : "mint"}
                  className="absolute bottom-3 left-3 border-2 border-white shadow-soft"
                />
                {comingSoon && (
                  <Badge tone="sand" size="sm" className="absolute top-3 right-3">
                    Em breve
                  </Badge>
                )}
              </div>

              <div className="flex flex-1 flex-col p-4 pt-5">
              <h3 className="text-lg font-semibold text-ink">
                {service.name}
              </h3>
              <p className="mt-1 text-sm font-medium text-forest-700">
                {service.tagline}
              </p>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-soft">
                {service.description}
              </p>

              <div className="mt-5 border-t border-line pt-4">
                {comingSoon ? (
                  <p className="text-sm text-ink-faint">Estamos preparando</p>
                ) : (
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm text-ink-soft">
                      a partir de{" "}
                      <span className="font-display text-base font-semibold text-ink">
                        {service.fromPrice !== null
                          ? formatBRL(service.fromPrice)
                          : ""}
                      </span>
                      <span className="text-xs text-ink-faint">
                        {" "}
                        /{service.priceUnit}
                      </span>
                    </p>
                    <Link
                      href={`/cuidadores?servico=${service.id}`}
                      className="inline-flex shrink-0 items-center gap-1 whitespace-nowrap text-sm font-medium text-forest-700 transition-colors hover:text-forest-900"
                      aria-label={`Ver cuidadores para ${service.name}`}
                    >
                      Ver cuidadores
                      <Icon name="arrow-right" className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                )}
              </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
