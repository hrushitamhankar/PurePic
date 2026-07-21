import { cn } from "@/lib/utils";
import { FadeIn } from "@/components/animations/FadeIn";

interface SectionHeaderProps {
  badge?: string;
  title: string;
  subtitle?: string;
  centered?: boolean;
  className?: string;
}

export function SectionHeader({
  badge,
  title,
  subtitle,
  centered = true,
  className,
}: SectionHeaderProps) {
  return (
    <FadeIn className={cn("mb-16", centered && "text-center", className)}>
      {badge && (
        <div className={cn("mb-4", centered && "flex justify-center")}>
          <span
            className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium tracking-wider uppercase"
            style={{
              borderColor: "rgba(124,58,237,0.3)",
              background: "rgba(124,58,237,0.08)",
              color: "#a855f7",
            }}
          >
            {badge}
          </span>
        </div>
      )}
      <h2
        className="font-display text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl"
        style={{
          fontFamily: "var(--font-geist), system-ui, sans-serif",
          color: "var(--text)",
        }}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className="mt-4 text-lg leading-relaxed max-w-2xl"
          style={{
            color: "var(--muted)",
            margin: centered ? "1rem auto 0" : "1rem 0 0",
          }}
        >
          {subtitle}
        </p>
      )}
    </FadeIn>
  );
}
