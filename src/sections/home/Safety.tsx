import Image from "next/image";
import { Icon } from "@/components/ui/Icon";
import { Avatar } from "@/components/ui/Avatar";
import { Reveal } from "@/components/ui/Reveal";
import { PawWatermark } from "@/components/ui/PawWatermark";
import { safetyItems } from "@/data/home";
import { assetPath } from "@/lib/asset-path";

export function Safety() {
  return (
    <Reveal className="relative grid h-full overflow-hidden rounded-[1.6rem] border border-forest-100 bg-forest-50 lg:grid-cols-[1.05fr_0.95fr]">
      <PawWatermark className="-left-16 -top-10 h-64 w-64 sm:h-80 sm:w-80" />
      <div id="seguranca" className="relative z-10 flex flex-col justify-center p-7 sm:p-9 lg:p-10">
        <p className="text-xs font-semibold tracking-[0.16em] text-forest-600 uppercase">
          Segurança em primeiro lugar
        </p>
        <h2 className="mt-3 text-3xl text-forest-900 sm:text-[2.15rem]">
          Mais do que cuidado, é confiança.
        </h2>
        <ul className="mt-6 space-y-3">
          {safetyItems.map((item) => (
            <li key={item.title} className="flex items-start gap-2.5 text-sm text-ink">
              <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-forest-600 text-white">
                <Icon name="check" className="h-3 w-3" strokeWidth={3} />
              </span>
              {item.title}
            </li>
          ))}
        </ul>
      </div>

      <div className="relative min-h-[280px] p-4 sm:p-5">
        <div className="relative h-full min-h-[260px] overflow-hidden rounded-[1.35rem]">
          <Image
            src={assetPath("/images/mascot-marshmallow.jpg")}
            alt="Marshmallow, mascote da PetCare, com bandana verde."
            fill
            sizes="(min-width: 1024px) 28vw, 90vw"
            className="object-cover object-[50%_20%]"
          />
          <div className="absolute right-4 bottom-4 max-w-[15.5rem] rounded-2xl bg-white/96 p-3 shadow-lift backdrop-blur">
            <div className="flex items-center gap-2.5">
              <Avatar name="Carla Mendes" size="xs" />
              <div>
                <p className="text-sm font-semibold text-ink">Carla Mendes</p>
                <p className="text-xs font-medium text-forest-700">★★★★★ 5.0</p>
              </div>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-ink-soft">
              “A experiência é incrível! Meus pets ficam super bem cuidados.”
            </p>
          </div>
        </div>
      </div>
    </Reveal>
  );
}
