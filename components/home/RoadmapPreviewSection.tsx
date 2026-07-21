import Link from "next/link";
import { ArrowRight, CheckCircle2, Circle, Clock } from "lucide-react";
import { FadeIn } from "@/components/animations/FadeIn";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { roadmapPhases } from "@/constants/roadmap";
import type { RoadmapStatus } from "@/types/roadmap.types";

const statusIcon: Record<RoadmapStatus, React.ReactNode> = {
  completed: <CheckCircle2 size={14} style={{ color: "#22c55e" }} />,
  "in-progress": <Clock size={14} style={{ color: "#3b82f6" }} />,
  planned: <Circle size={14} style={{ color: "#a855f7" }} />,
  future: <Circle size={14} style={{ color: "var(--border)" }} />,
};

export function RoadmapPreviewSection() {
  const phase1 = roadmapPhases[0];
  const phase2 = roadmapPhases[1];

  return (
    <section className="py-32 relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="Roadmap"
          title="Where PurePic is going"
          subtitle="The AI backend is under active development. Here's what's built, what's building, and what's next."
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          {[phase1, phase2].map((phase, pi) => (
            <FadeIn key={phase.id} delay={pi * 0.1}>
              <div
                className="rounded-2xl border p-7 h-full"
                style={{ borderColor: "var(--border)", background: "var(--surface)" }}
              >
                <h3
                  className="font-semibold text-base mb-1"
                  style={{ color: "var(--text)" }}
                >
                  {phase.title}
                </h3>
                <p className="text-sm mb-6" style={{ color: "var(--muted)" }}>
                  {phase.subtitle}
                </p>
                <ul className="space-y-3">
                  {phase.items.map((item) => (
                    <li key={item.id} className="flex items-start gap-3">
                      <span className="mt-0.5 flex-shrink-0">{statusIcon[item.status]}</span>
                      <div>
                        <p
                          className="text-sm font-medium"
                          style={{ color: "var(--text)" }}
                        >
                          {item.title}
                        </p>
                        {item.eta && (
                          <p className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>
                            ETA: {item.eta}
                          </p>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/roadmap"
            className="inline-flex items-center gap-2 text-sm font-medium transition-colors hover:text-white"
            style={{ color: "#a855f7" }}
          >
            View full roadmap
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
