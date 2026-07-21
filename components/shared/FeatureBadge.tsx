import { cn } from "@/lib/utils";

type BadgeVariant = "available" | "coming-soon" | "in-development" | "new";

const variantStyles: Record<BadgeVariant, string> = {
  available: "bg-green-500/10 text-green-400 border-green-500/20",
  "coming-soon": "bg-orange-500/10 text-orange-400 border-orange-500/20",
  "in-development": "bg-blue-500/10 text-blue-400 border-blue-500/20",
  new: "bg-purple-500/10 text-purple-400 border-purple-500/20",
};

const variantLabels: Record<BadgeVariant, string> = {
  available: "Available",
  "coming-soon": "Coming Soon",
  "in-development": "In Development",
  new: "New",
};

interface FeatureBadgeProps {
  variant: BadgeVariant;
  className?: string;
  label?: string;
}

export function FeatureBadge({ variant, className, label }: FeatureBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        variantStyles[variant],
        className
      )}
    >
      {label ?? variantLabels[variant]}
    </span>
  );
}
