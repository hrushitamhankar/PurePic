import { cn } from "@/lib/utils";

interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "white";
}

export function GradientText({
  children,
  className,
  variant = "primary",
}: GradientTextProps) {
  return (
    <span
      className={cn(
        variant === "primary" ? "text-gradient-primary" : "text-gradient-white",
        className
      )}
    >
      {children}
    </span>
  );
}
