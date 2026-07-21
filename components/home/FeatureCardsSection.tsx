"use client";

import {
  Layers, SortAsc, Microscope, Palette, Sliders, Scan,
  Wand2, Zap, FileOutput, Sparkles
} from "lucide-react";
import { FadeIn } from "@/components/animations/FadeIn";
import { StaggerChildren, StaggerItem } from "@/components/animations/StaggerChildren";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { FeatureBadge } from "@/components/shared/FeatureBadge";
import { coreFeatures } from "@/constants/features";

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }>> = {
  Layers, SortAsc, Microscope, Palette, Sliders, Scan,
  Wand2, Zap, FileOutput, Sparkles,
};

export function FeatureCardsSection() {
  return (
    <section className="py-32 relative" id="features">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="Core Intelligence"
          title="Every feature driven by AI"
          subtitle="PurePic doesn't apply generic algorithms. It understands your image first — then acts."
        />

        <StaggerChildren className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {coreFeatures.slice(0, 9).map((feature) => {
            const Icon = iconMap[feature.icon] ?? Sparkles;
            return (
              <StaggerItem key={feature.id}>
                <div
                  className="relative rounded-xl border p-6 h-full card-hover group"
                  style={{
                    borderColor: "var(--border)",
                    background: "var(--surface)",
                  }}
                >
                  {/* Icon */}
                  <div
                    className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg"
                    style={{ background: "rgba(124,58,237,0.1)" }}
                  >
                    <Icon size={18} style={{ color: "#a855f7" }} />
                  </div>

                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3
                      className="font-semibold text-base"
                      style={{ color: "var(--text)" }}
                    >
                      {feature.title}
                    </h3>
                    {feature.status !== "available" && (
                      <FeatureBadge variant={feature.status} />
                    )}
                  </div>

                  <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    {feature.description}
                  </p>

                  {/* Hover glow */}
                  <div
                    className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                    style={{
                      background: "radial-gradient(circle at 50% 0%, rgba(124,58,237,0.04) 0%, transparent 70%)",
                    }}
                  />
                </div>
              </StaggerItem>
            );
          })}
        </StaggerChildren>
      </div>
    </section>
  );
}
