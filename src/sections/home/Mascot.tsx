import Image from "next/image";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { PawHeartMark } from "@/components/Logo";
import { Icon } from "@/components/ui/Icon";
import { assetPath } from "@/lib/asset-path";

const mascotTraits = ["Alegria", "Confiança", "Carinho", "Muito amor pelos animais"];

export function Mascot() {
  return (
    <Section id="mascote" tone="cream">
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <Reveal className="relative order-1 mx-auto w-full max-w-sm lg:mx-0">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem] bg-forest-100 shadow-lift ring-1 ring-black/5">
            <Image
              src={assetPath("/images/mascot-marshmallow.jpg")}
              alt="Retrato de Marshmallow, um Spitz Alemão branco usando uma bandana verde da MundoPetCare."
              fill
              sizes="(min-width: 1024px) 30vw, 90vw"
              className="object-cover object-[50%_30%]"
            />
          </div>
          <div className="absolute -bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full border border-line bg-white/95 px-4 py-2 shadow-lift backdrop-blur">
            <span className="h-5 w-5 shrink-0 text-forest-600">
              <PawHeartMark />
            </span>
            <span className="text-sm font-semibold text-ink">
              Spitz Alemão · 1 ano
            </span>
          </div>
        </Reveal>

        <div className="order-2 max-w-xl">
          <Reveal
            as="span"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-forest-600"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-forest-500" />
            O mascote
          </Reveal>
          <Reveal as="h2" delay={60} className="mt-4 text-3xl sm:text-4xl">
            Conheça o Marshmallow
          </Reveal>
          <Reveal as="p" delay={120} className="mt-4 text-lg leading-relaxed text-ink-soft">
            Nosso mascote representa exatamente o que queremos entregar: alegria,
            confiança, carinho e muito amor pelos animais.
          </Reveal>
          <Reveal as="p" delay={160} className="mt-3 leading-relaxed text-ink-soft">
            Ele é a cara da MundoPetCare e o lembrete diário do porquê a gente leva
            cada passeio a sério.
          </Reveal>

          <Reveal delay={220} as="ul" className="mt-6 flex flex-wrap gap-2">
            {mascotTraits.map((trait) => (
              <li
                key={trait}
                className="inline-flex items-center gap-1.5 rounded-full bg-forest-50 px-3 py-1.5 text-sm font-medium text-forest-800 ring-1 ring-inset ring-forest-100"
              >
                <Icon name="heart" className="h-3.5 w-3.5" strokeWidth={2} />
                {trait}
              </li>
            ))}
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
