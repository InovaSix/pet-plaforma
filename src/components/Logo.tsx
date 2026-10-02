import Link from "next/link";
import { cn } from "@/lib/utils";

type LogoTone = "brand" | "inverse" | "mono";

interface LogoProps {
  tone?: LogoTone;
  className?: string;
  withWordmark?: boolean;
  href?: string | null;
  label?: string;
}

const toneMap: Record<LogoTone, { mark: string; word: string }> = {
  brand: { mark: "text-forest-600", word: "text-forest-900" },
  inverse: { mark: "text-forest-300", word: "text-white" },
  mono: { mark: "text-current", word: "text-current" },
};

export function PawHeartMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      role="img"
      aria-hidden="true"
      className={cn("h-full w-full", className)}
      fill="currentColor"
    >
      <ellipse cx="15" cy="12.5" rx="5" ry="6.6" />
      <ellipse cx="33" cy="12.5" rx="5" ry="6.6" />
      <ellipse cx="7.4" cy="24" rx="4.7" ry="6" />
      <ellipse cx="40.6" cy="24" rx="4.7" ry="6" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M24 20.6c6.1 0 12 4.1 13 10.2 1 6-4.1 11.2-13 11.2s-14-5.2-13-11.2c1-6.1 6.9-10.2 13-10.2Zm0 15.2c.4 0 .8-.15 1.1-.42l4.6-4.2c1.7-1.55 1.8-4.2.2-5.9-1.5-1.6-4-1.7-5.6-.25l-.3.28-.3-.28c-1.6-1.45-4.1-1.35-5.6.25-1.6 1.7-1.5 4.35.2 5.9l4.6 4.2c.3.27.7.42 1.1.42Z"
      />
    </svg>
  );
}

export function Logo({
  tone = "brand",
  className,
  withWordmark = true,
  href = "/",
  label = "MundoPetCare, página inicial",
}: LogoProps) {
  const colors = toneMap[tone];

  const content = (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <span className={cn("block h-8 w-8 shrink-0", colors.mark)}>
        <PawHeartMark />
      </span>
      {withWordmark && (
        <span
          className={cn(
            "font-display text-[1.5rem] font-bold leading-none tracking-[-0.03em]",
            colors.word,
          )}
        >
          MundoPetCare
        </span>
      )}
    </span>
  );

  if (!href) return content;

  return (
    <Link href={href} aria-label={label} className="inline-flex">
      {content}
    </Link>
  );
}
