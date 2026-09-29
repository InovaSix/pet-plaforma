import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { heroTrustPoints } from "@/data/home";
import { assetPath } from "@/lib/asset-path";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-cream">
      <div
        className="u-paw-field pointer-events-none absolute inset-0 opacity-70 [mask-image:radial-gradient(120%_80%_at_80%_0%,black,transparent_70%)]"
        aria-hidden="true"
      />
      <div className="relative mx-auto grid w-full max-w-7xl gap-10 px-5 pt-10 pb-14 sm:px-6 sm:pt-14 lg:grid-cols-[0.92fr_1.08fr] lg:items-center lg:gap-12 lg:px-8 lg:pt-16 lg:pb-20">
        <div className="max-w-xl">
          <span className="u-rise inline-flex items-center gap-2 rounded-full border border-forest-100 bg-white px-3 py-1.5 text-xs font-semibold tracking-tight text-forest-700">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-forest-400 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-forest-500" />
            </span>
            Cuidadores verificados perto de você
          </span>

          <h1
            className="u-rise mt-5 text-balance text-[2.7rem] leading-[1.04] font-semibold text-ink sm:text-5xl lg:text-[3.7rem]"
            style={{ animationDelay: "70ms" }}
          >
            Seu pet merece <span className="text-forest-600">cuidado de verdade.</span>
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
            <Button href="/buscar-cuidador" size="md">
              Encontrar cuidador
              <Icon name="arrow-right" className="h-4 w-4" />
            </Button>
            <Button href="/#cuidadores" variant="secondary" size="md">
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
          <div className="relative aspect-[1.16/1] overflow-hidden rounded-[2rem] bg-forest-100 shadow-lift ring-1 ring-black/5 sm:aspect-[1.25/1]">
            <Image
              src={assetPath("/images/hero-marshmallow.jpg")}
              alt="Marshmallow, um Spitz Alemão branco, correndo feliz por um parque ao entardecer."
              fill
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>

          <div className="absolute bottom-3 left-3 flex gap-2 sm:bottom-4 sm:left-4">
            {["/images/gallery/g1.jpg", "/images/gallery/g2.jpg", "/images/gallery/g3.jpg"].map(
              (src, index) => (
                <div
                  key={src}
                  className="relative h-12 w-12 overflow-hidden rounded-xl border-2 border-white shadow-soft sm:h-14 sm:w-14"
                >
                  <Image
                    src={assetPath(src)}
                    alt=""
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                  {index === 2 && (
                    <span className="absolute inset-0 grid place-items-center bg-forest-900/45 text-xs font-semibold text-white">
                      +6
                    </span>
                  )}
                </div>
              ),
            )}
          </div>

          <div className="absolute -bottom-5 left-3 flex items-center gap-3 rounded-2xl border border-line bg-white/95 p-3 pr-4 text-left shadow-lift backdrop-blur sm:left-5">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-forest-50 text-forest-600">
              <Icon name="route" className="h-5 w-5" />
            </span>
            <div>
              <p className="text-[0.8rem] font-semibold text-ink">
                Passeio em andamento
              </p>
              <p className="text-xs text-ink-soft">
                Marina está com o Thor · 12 min
              </p>
            </div>
          </div>

          <div className="absolute -top-4 right-2 hidden items-center gap-2 rounded-2xl border border-line bg-white/95 px-3 py-2 shadow-lift backdrop-blur sm:flex lg:right-3">
            <Icon
              name="star"
              className="h-4 w-4 text-forest-500"
              strokeWidth={2}
            />
            <p className="text-[0.8rem] font-semibold text-ink">
              4,9{" "}
              <span className="font-normal text-ink-faint">
                média das avaliações
              </span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
