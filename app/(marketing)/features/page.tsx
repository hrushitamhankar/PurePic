import type { Metadata } from "next";
import { Layers, SortAsc, Microscope, Palette, Sliders, Scan, Wand2, Zap, FileOutput, Cloud, Sparkles, MessageSquare } from "lucide-react";
import { FadeIn } from "@/components/animations/FadeIn";
import { StaggerChildren, StaggerItem } from "@/components/animations/StaggerChildren";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { FeatureBadge } from "@/components/shared/FeatureBadge";
import { NewsletterSection } from "@/components/home/NewsletterSection";
import { coreFeatures } from "@/constants/features";
import { generatePageMetadata } from "@/lib/metadata";

export const metadata: Metadata = generatePageMetadata({
  title: "Features",
  description: "Explore every AI-powered feature PurePic offers — from intelligent culling to semantic region editing.",
  path: "/features",
});

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }>> = {
  Layers, SortAsc, Microscope, Palette, Sliders, Scan,
  Wand2, Zap, FileOutput, Cloud, Sparkles, MessageSquare,
};

export default function FeaturesPage() {
  const available = coreFeatures.filter((f) => f.status === "available");
  const inDev = coreFeatures.filter((f) => f.status === "in-development");
  const coming = coreFeatures.filter((f) => f.status === "coming-soon");

  const renderGroup = (features: typeof coreFeatures, title: string) => (
    <div className="mb-20">
      <FadeIn>
        <h2
          className="text-lg font-semibold uppercase tracking-widest mb-8"
          style={{ color: "var(--muted)" }}
        >
          {title}
        </h2>
      </FadeIn>
      <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {features.map((feature) => {
          const Icon = iconMap[feature.icon] ?? Sparkles;
          return (
            <StaggerItem key={feature.id}>
              <div
                className="rounded-xl border p-7 h-full card-hover group relative"
                style={{ borderColor: "var(--border)", background: "var(--surface)" }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="inline-flex h-11 w-11 items-center justify-center rounded-xl"
                    style={{ background: "rgba(124,58,237,0.1)" }}
                  >
                    <Icon size={20} style={{ color: "#a855f7" }} />
                  </div>
                  {feature.status !== "available" && (
                    <FeatureBadge variant={feature.status} />
                  )}
                  {feature.status === "available" && (
                    <FeatureBadge variant="available" />
                  )}
                </div>
                <h3 className="font-semibold text-base mb-2" style={{ color: "var(--text)" }}>
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed mb-3" style={{ color: "var(--muted)" }}>
                  {feature.description}
                </p>
                {feature.detail && (
                  <p className="text-xs leading-relaxed border-t pt-3" style={{ color: "var(--muted)", borderColor: "var(--border)" }}>
                    {feature.detail}
                  </p>
                )}
              </div>
            </StaggerItem>
          );
        })}
      </StaggerChildren>
    </div>
  );

  return (
    <>
      {/* Hero */}
      <section className="pt-40 pb-16 text-center px-4" style={{ paddingTop: "140px" }}>
        <FadeIn>
          <span
            className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium tracking-wider uppercase mb-6"
            style={{ borderColor: "rgba(124,58,237,0.3)", background: "rgba(124,58,237,0.08)", color: "#a855f7" }}
          >
            Platform Features
          </span>
          <h1
            className="text-5xl font-bold tracking-tight sm:text-6xl mb-5"
            style={{ fontFamily: "var(--font-geist), system-ui, sans-serif", color: "var(--text)" }}
          >
            Every feature driven by AI
          </h1>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: "var(--muted)" }}>
            PurePic doesn't apply generic algorithms. It understands what's in your image first — then makes intelligent decisions.
          </p>
        </FadeIn>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {renderGroup(available, "Available Now")}
          {renderGroup(inDev, "In Active Development")}
          {renderGroup(coming, "Coming Soon")}
        </div>
      </section>

      <NewsletterSection />
    </>
  );
}
