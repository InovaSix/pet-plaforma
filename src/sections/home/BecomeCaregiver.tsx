import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { PawHeartMark } from "@/components/Logo";
import { Reveal } from "@/components/ui/Reveal";
import { assetPath } from "@/lib/asset-path";

export function BecomeCaregiver() {
  return (
    <Reveal
      delay={80}
      className="relative h-full overflow-hidden rounded-[1.6rem] bg-forest-800 text-white"
    >
      <div
        className="pointer-events-none absolute -right-6 -top-8 h-36 w-36 text-white/10"
        aria-hidden="true"
      >
        <PawHeartMark />
      </div>
      <div
        id="cuidadores"
        className="relative grid min-h-full gap-6 p-7 sm:p-8 lg:grid-cols-[1fr_0.85fr] lg:items-center lg:p-9"
      >
        <div>
          <p className="text-xs font-semibold tracking-[0.16em] text-forest-200 uppercase">
            Quer fazer parte?
          </p>
          <h2 className="mt-3 text-3xl text-white sm:text-[2.15rem]">
            Seja um cuidador PetCare
          </h2>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-forest-100/80">
            Transforme seu amor por animais em uma fonte de renda. Cadastre-se e
            comece a receber solicitações.
          </p>
          <Button
            href="/#cuidadores"
            variant="inverse"
            size="md"
            className="mt-6 rounded-full"
          >
            Quero ser cuidador
          </Button>
        </div>

        <div className="relative mx-auto aspect-square w-full max-w-[220px] overflow-hidden rounded-[1.4rem] ring-4 ring-white/10 lg:max-w-none">
          <Image
            src={assetPath("/images/gallery/g6.jpg")}
            alt="Marshmallow correndo na grama, a cara da PetCare."
            fill
            sizes="220px"
            className="object-cover"
          />
        </div>
      </div>
    </Reveal>
  );
}
