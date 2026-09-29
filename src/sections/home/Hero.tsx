import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Avatar } from "@/components/ui/Avatar";
import { PawHeartMark } from "@/components/Logo";
import { heroTrustPoints } from "@/data/home";
import { assetPath } from "@/lib/asset-path";

const heroThumbs = [
  { src: "/images/gallery/g5.jpg", alt: "Marshmallow em retrato circular." },
  { src: "/images/gallery/g2.jpg", alt: "Marshmallow sorrindo." },
  { src: "/images/gallery/g4.jpg", alt: "Close de Marshmallow." },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-cream">
      <div
        className="pointer-events-none absolute -left-24 top-8 h-[28rem] w-[28rem] text-forest-200/55 sm:-left-16 sm:top-0"
        aria-hidden="true"
      >
        <PawHeartMark className="h-full w-full" />
      </div>

      <div className="relative mx-auto grid w-full max-w-7xl items-center gap-10 px-5 pt-6 pb-16 sm:px-6 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:gap-8 lg:px-8 lg:pt-8 lg:pb-20">
        <div className="relative z-10 max-w-xl">
          <span className="u-rise inline-flex items-center gap-2 text-sm font-medium text-forest-700">
            <Icon name="shield-check" className="h-4 w-4" strokeWidth={2} />
            Cuidadores verificados perto de você
          </span>

          <h1
            className="u-rise mt-4 text-balance text-[2.55rem] leading-[1.05] font-semibold text-ink sm:text-5xl lg:text-[3.35rem]"
            style={{ animationDelay: "70ms" }}
          >
            Seu pet merece{" "}
            <span className="text-forest-700">cuidado de verdade.</span>
          </h1>

          <p
            className="u-rise mt-5 max-w-md text-base leading-relaxed text-ink-soft sm:text-lg"
            style={{ animationDelay: "140ms" }}
          >
            Encontre pessoas confiáveis para passear, cuidar e acompanhar seu
            melhor amigo.
          </p>

          <div
            className="u-rise mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap"
            style={{ animationDelay: "210ms" }}
          >
            <Button href="/buscar-cuidador" size="md" className="rounded-full px-6">
              Encontrar cuidador
              <Icon name="arrow-right" className="h-4 w-4" />
            </Button>
            <Button
              href="/#cuidadores"
              variant="secondary"
              size="md"
              className="rounded-full px-6"
            >
              Quero ser cuidador
            </Button>
          </div>

          <ul
            className="u-rise mt-8 flex flex-wrap gap-x-5 gap-y-3"
            style={{ animationDelay: "280ms" }}
          >
            {heroTrustPoints.map((point) => (
              <li
                key={point.label}
                className="flex items-center gap-2 text-sm font-medium text-ink-soft"
              >
                <Icon
                  name={point.icon}
                  className="h-[1.05rem] w-[1.05rem] text-forest-600"
                  strokeWidth={2}
                />
                {point.label}
              </li>
            ))}
          </ul>
        </div>

        <div className="u-rise relative" style={{ animationDelay: "160ms" }}>
          <p className="absolute -top-1 left-[12%] z-20 hidden max-w-[7.5rem] text-center text-[0.7rem] leading-snug font-medium text-forest-800 sm:block lg:left-[8%]">
            Mais tempo com quem te faz bem
            <span className="mt-1 block text-forest-500">♡</span>
          </p>

          <div className="relative isolate ml-auto aspect-[1.18/1] w-full overflow-hidden rounded-[2.75rem] rounded-bl-[4.5rem] bg-forest-100 shadow-lift ring-1 ring-black/5 sm:aspect-[1.28/1] lg:w-[96%]">
            <Image
              src={assetPath("/images/hero-marshmallow.jpg")}
              alt="Marshmallow, um Spitz Alemão branco, correndo feliz por um parque ao entardecer."
              fill
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover object-[50%_40%]"
            />

            <div className="absolute top-4 right-4 flex items-center gap-2 rounded-2xl bg-white/95 px-3 py-2 shadow-lift backdrop-blur">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-sand text-sand-ink">
                <Icon name="star" className="h-4 w-4" />
              </span>
              <div className="leading-tight">
                <p className="text-sm font-semibold text-ink">4,9</p>
                <p className="text-[0.65rem] text-ink-faint">128 avaliações</p>
              </div>
            </div>

            <div className="absolute bottom-4 left-4 flex -space-x-2 sm:bottom-5 sm:left-5">
              {heroThumbs.map((thumb) => (
                <div
                  key={thumb.src}
                  className="relative h-11 w-11 overflow-hidden rounded-full border-[3px] border-white shadow-soft sm:h-12 sm:w-12"
                >
                  <Image
                    src={assetPath(thumb.src)}
                    alt={thumb.alt}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>

            <div className="absolute right-3 bottom-3 flex max-w-[15.5rem] items-center gap-3 rounded-2xl bg-white/96 p-2.5 pr-3.5 shadow-lift backdrop-blur sm:right-5 sm:bottom-5">
              <Avatar name="Maria Santos" size="sm" />
              <div className="min-w-0">
                <p className="text-[0.8rem] font-semibold text-ink">
                  Passeio acontecendo
                </p>
                <p className="truncate text-xs text-ink-soft">
                  Maria está com Thor
                </p>
                <p className="mt-0.5 flex items-center gap-1 text-[0.7rem] text-ink-faint">
                  <Icon name="map-pin" className="h-3 w-3 text-forest-600" />
                  12 min · Curitiba
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
