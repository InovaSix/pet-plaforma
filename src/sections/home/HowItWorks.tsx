import { Section } from "@/components/ui/Section";
import { IconTile } from "@/components/ui/IconTile";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { PawWatermark } from "@/components/ui/PawWatermark";
import { howItWorksSteps } from "@/data/home";

export function HowItWorks() {
  return (
    <Section
      id="como-funciona"
      tone="paper"
      containerSize="wide"
      watermark={
        <>
          <PawWatermark className="-left-20 -top-6 h-72 w-72 sm:h-[22rem] sm:w-[22rem]" />
          <PawWatermark className="-right-16 bottom-0 hidden h-56 w-56 sm:block" />
        </>
      }
    >
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-xl">
          <p className="text-xs font-semibold tracking-[0.16em] text-forest-600 uppercase">
            Simples e seguro
          </p>
          <h2 className="mt-3 text-3xl text-forest-800 sm:text-4xl">
            Como o MundoPetCare acompanha cada momento
          </h2>
        </div>
        <p className="max-w-sm text-sm leading-relaxed text-ink-soft lg:text-right">
          Do primeiro contato ao relatório final, você tem total visibilidade e
          tranquilidade em todas as etapas.
        </p>
      </div>

      <ol className="mt-12 grid gap-4 sm:grid-cols-2 lg:mt-14 lg:grid-cols-4">
        {howItWorksSteps.map((step, index) => (
          <Reveal
            as="li"
            key={step.number}
            delay={index * 80}
            className="relative flex h-full flex-col gap-4 rounded-[1.4rem] border border-line bg-white p-6"
          >
            <div className="flex items-start justify-between">
              <IconTile name={step.icon} size="md" />
              {index === 2 && (
                <span className="grid h-8 w-8 place-items-center rounded-full bg-forest-50 text-forest-600">
                  <Icon name="chevron-right" className="h-4 w-4" />
                </span>
              )}
            </div>
            <div>
              <h3 className="text-[0.95rem] font-semibold text-ink">
                {String(step.number).padStart(2, "0")}. {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                {step.description}
              </p>
            </div>
          </Reveal>
        ))}
      </ol>
    </Section>
  );
}
