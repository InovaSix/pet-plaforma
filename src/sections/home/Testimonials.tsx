import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Avatar } from "@/components/ui/Avatar";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { homeTestimonials } from "@/data/home";

export function Testimonials() {
  return (
    <Section id="depoimentos" tone="cream" spacing="compact" containerSize="wide">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold tracking-[0.16em] text-forest-600 uppercase">
            Depoimentos
          </p>
          <h2 className="mt-3 text-3xl text-forest-800 sm:text-4xl">
            O que nossos clientes dizem
          </h2>
        </div>
        <Link
          href="/cuidadores"
          className="inline-flex items-center gap-1 text-sm font-medium text-forest-700 transition-colors hover:text-forest-900"
        >
          Ver mais avaliações
          <Icon name="arrow-right" className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {homeTestimonials.map((item, index) => (
          <Reveal
            key={item.name}
            delay={index * 80}
            className="rounded-[1.4rem] border border-line bg-white p-5 shadow-soft"
          >
            <div className="flex items-center gap-3">
              <Avatar name={item.name} size="sm" />
              <div>
                <p className="text-sm font-semibold text-ink">{item.name}</p>
                <p className="text-xs font-medium text-forest-700">
                  {"★".repeat(item.rating)} {item.rating.toFixed(1)}
                </p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-ink-soft">
              “{item.quote}”
            </p>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
