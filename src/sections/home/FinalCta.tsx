import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { PawHeartMark } from "@/components/Logo";
import { Reveal } from "@/components/ui/Reveal";
import { assetPath } from "@/lib/asset-path";

export function FinalCta() {
  return (
    <section className="bg-cream px-5 pb-16 sm:px-6 lg:px-8">
      <Reveal className="relative mx-auto flex w-full max-w-7xl flex-col overflow-hidden rounded-[1.6rem] bg-forest-800 px-7 py-8 text-white sm:px-10 sm:py-9 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
        <div
          className="pointer-events-none absolute right-[28%] hidden h-28 w-28 text-white/10 lg:block"
          aria-hidden="true"
        >
          <PawHeartMark />
        </div>
        <div className="relative max-w-xl">
          <h2 className="text-balance text-2xl leading-tight font-semibold sm:text-3xl">
            Pronto para encontrar alguém para cuidar do seu pet?
          </h2>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-forest-100/80">
            Mais facilidade, segurança e tranquilidade para o seu melhor amigo.
          </p>
        </div>

        <div className="relative mt-8 flex items-center gap-6 lg:mt-0">
          <div className="relative hidden h-24 w-40 sm:block">
            <div className="absolute top-1 left-0 h-20 w-20 overflow-hidden rounded-full ring-4 ring-forest-800">
              <Image
                src={assetPath("/images/gallery/g2.jpg")}
                alt=""
                fill
                sizes="80px"
                className="object-cover"
              />
            </div>
            <div className="absolute top-0 left-14 h-[5.5rem] w-[5.5rem] overflow-hidden rounded-full ring-4 ring-forest-800">
              <Image
                src={assetPath("/images/gallery/g6.jpg")}
                alt=""
                fill
                sizes="88px"
                className="object-cover"
              />
            </div>
          </div>
          <Button
            href="/buscar-cuidador"
            variant="inverse"
            size="md"
            className="rounded-full"
          >
            Encontrar cuidador
            <Icon name="arrow-right" className="h-4 w-4" />
          </Button>
        </div>
      </Reveal>
    </section>
  );
}
