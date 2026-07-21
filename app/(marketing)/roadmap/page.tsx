import type { Metadata } from "next";
import { CheckCircle2, Circle, Clock, Rocket } from "lucide-react";
import { FadeIn } from "@/components/animations/FadeIn";
import { StaggerChildren, StaggerItem } from "@/components/animations/StaggerChildren";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { FeatureBadge } from "@/components/shared/FeatureBadge";
import { NewsletterSection } from "@/components/home/NewsletterSection";
import { roadmapPhases } from "@/constants/roadmap";
import { generatePageMetadata } from "@/lib/metadata";
import type { RoadmapStatus } from "@/types/roadmap.types";

export const metadata: Metadata = generatePageMetadata({
  title: "Roadmap",
  description: "See what's built, what's in active development, and what's planned next for PurePic.",
  path: "/roadmap",
});

const statusConfig: Record<RoadmapStatus, { icon: React.ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }>, label: string, color: string }> = {
  completed: { icon: CheckCircle2, label: "Completed", color: "#22c55e" },
  "in-progress": { icon: Clock, label: "In Progress", color: "#3b82f6" },
  planned: { icon: Circle, label: "Planned", color: "#a855f7" },
  future: { icon: Rocket, label: "Future", color: "var(--muted)" },
};

export default function RoadmapPage() {
  return (
    <>
      <section className="pt-40 pb-16 text-center px-4" style={{ paddingTop: "140px" }}>
        <FadeIn>
          <span
            className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium tracking-wider uppercase mb-6"
            style={{ borderColor: "rgba(124,58,237,0.3)", background: "rgba(124,58,237,0.08)", color: "#a855f7" }}
          >
            Product Roadmap
          </span>
          <h1
            className="text-5xl font-bold tracking-tight sm:text-6xl mb-5"
            style={{ fontFamily: "var(--font-geist), system-ui, sans-serif", color: "var(--text)" }}
          >
            Where PurePic is going
          </h1>
          <p className="text-lg max-w-xl mx-auto" style={{ color: "var(--muted)" }}>
            The AI backend is under active development. Here is what is built, what is building, and what comes next.
          </p>
        </FadeIn>
      </section>

      {/* Status legend */}
      <FadeIn>
        <div className="mx-auto max-w-4xl px-4 pb-12">
          <div className="flex flex-wrap items-center justify-center gap-6">
            {Object.entries(statusConfig).map(([key, config]) => (
              <div key={key} className="flex items-center gap-2">
                <config.icon size={14} style={{ color: config.color }} />
                <span className="text-sm" style={{ color: "var(--muted)" }}>{config.label}</span>
              </div>
            ))}
          </div>
        </div>
      </FadeIn>

      {/* Phases */}
      <section className="pb-32">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            {roadmapPhases.map((phase, pi) => (
              <FadeIn key={phase.id} delay={pi * 0.1}>
                <div
                  className="rounded-2xl border overflow-hidden"
                  style={{ borderColor: "var(--border)" }}
                >
                  {/* Phase header */}
                  <div
                    className="px-7 py-5 border-b"
                    style={{ borderColor: "var(--border)", background: "var(--surface)" }}
                  >
                    <h2
                      className="font-bold text-xl mb-1"
                      style={{ color: "var(--text)" }}
                    >
                      {phase.title}
                    </h2>
                    <p className="text-sm" style={{ color: "var(--muted)" }}>
                      {phase.subtitle}
                    </p>
                  </div>

                  {/* Items */}
                  <div className="divide-y" style={{ borderColor: "var(--border)" }}>
                    {phase.items.map((item) => {
                      const sc = statusConfig[item.status];
                      return (
                        <div
                          key={item.id}
                          className="flex items-start gap-4 px-7 py-5 hover:bg-white/[0.01] transition-colors"
                          style={{ borderColor: "var(--border)" }}
                        >
                          <sc.icon
                            size={18}
                            className="mt-0.5 flex-shrink-0"
                            style={{ color: sc.color }}
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-1 flex-wrap">
                              <h3 className="font-medium text-base" style={{ color: "var(--text)" }}>
                                {item.title}
                              </h3>
                              {item.eta && (
                                <span
                                  className="text-xs px-2 py-0.5 rounded-md"
                                  style={{ background: "rgba(59,130,246,0.1)", color: "#3b82f6" }}
                                >
                                  ETA: {item.eta}
                                </span>
                              )}
                              {item.tags?.map((tag) => (
                                <span
                                  key={tag}
                                  className="text-xs px-2 py-0.5 rounded-md"
                                  style={{ background: "var(--border)", color: "var(--muted)" }}
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                            <p className="text-sm" style={{ color: "var(--muted)" }}>
                              {item.description}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <NewsletterSection />
    </>
  );
}
