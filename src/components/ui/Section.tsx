import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/Container";

type SectionTone = "cream" | "paper" | "mint" | "forest";
type SectionSpacing = "default" | "compact" | "loose";

const tones: Record<SectionTone, string> = {
  cream: "bg-cream text-ink",
  paper: "bg-paper text-ink",
  mint: "bg-forest-50 text-ink",
  forest: "bg-forest-900 text-white",
};

const spacings: Record<SectionSpacing, string> = {
  compact: "py-14 sm:py-16",
  default: "py-16 sm:py-20 lg:py-24",
  loose: "py-20 sm:py-28 lg:py-32",
};

interface SectionProps {
  id?: string;
  tone?: SectionTone;
  spacing?: SectionSpacing;
  containerSize?: "default" | "narrow" | "wide";
  className?: string;
  containerClassName?: string;
  watermark?: ReactNode;
  children: ReactNode;
}

export function Section({
  id,
  tone = "cream",
  spacing = "default",
  containerSize = "default",
  className,
  containerClassName,
  watermark,
  children,
}: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        "relative scroll-mt-24 overflow-hidden",
        tones[tone],
        spacings[spacing],
        className,
      )}
    >
      {watermark}
      <Container size={containerSize} className={cn("relative", containerClassName)}>
        {children}
      </Container>
    </section>
  );
}
