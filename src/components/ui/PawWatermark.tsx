import { PawHeartMark } from "@/components/Logo";
import { cn } from "@/lib/utils";

type PawTone = "mint" | "white";

interface PawWatermarkProps {
  className?: string;
  tone?: PawTone;
}

const tones: Record<PawTone, string> = {
  mint: "text-forest-200/55",
  white: "text-white/12",
};

export function PawWatermark({
  className,
  tone = "mint",
}: PawWatermarkProps) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute select-none",
        tones[tone],
        className,
      )}
      aria-hidden="true"
    >
      <PawHeartMark className="h-full w-full" />
    </div>
  );
}
