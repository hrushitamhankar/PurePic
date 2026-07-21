"use client";

import { motion } from "framer-motion";
import { FadeIn } from "@/components/animations/FadeIn";
import { SectionHeader } from "@/components/shared/SectionHeader";

const pipelineStages = [
  {
    label: "Image Input",
    description: "JPEG / RAW",
    color: "#3b82f6",
    items: ["Embedded preview extraction", "Color profile detection", "EXIF metadata read"],
  },
  {
    label: "Technical Analysis",
    description: "Quality Engine",
    color: "#8b5cf6",
    items: ["Sharpness map", "Exposure analysis", "Noise estimation", "Focus detection"],
  },
  {
    label: "Aesthetic Analysis",
    description: "Deep Learning Model",
    color: "#a855f7",
    items: ["Composition scoring", "Color harmony", "Tonal balance", "Visual weight"],
  },
  {
    label: "Subject Intelligence",
    description: "Perception Layer",
    color: "#ec4899",
    items: ["Subject detection", "Eye focus check", "Emotion/moment scoring", "Genre intent"],
  },
  {
    label: "Final Scoring",
    description: "Editor Simulation",
    color: "#7c3aed",
    items: ["Weighted final score", "Category assignment", "Confidence calibration", "CSV report"],
  },
];

export function AIPipelineSection() {
  return (
    <section className="py-32 relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background: "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(124,58,237,0.06) 0%, transparent 70%)",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="AI Pipeline"
          title="Six dimensions. One score."
          subtitle="PurePic's scoring engine simulates how a professional photo editor evaluates an image — not a simple sharpness check."
        />

        {/* Pipeline diagram */}
        <div className="relative mt-16">
          <div className="flex flex-col lg:flex-row items-stretch gap-0">
            {pipelineStages.map((stage, i) => (
              <div key={stage.label} className="flex flex-col lg:flex-row items-stretch flex-1">
                <FadeIn
                  delay={i * 0.1}
                  direction="up"
                  className="flex-1"
                >
                  <div
                    className="relative h-full rounded-xl border p-5 card-hover"
                    style={{
                      borderColor: "var(--border)",
                      background: "var(--surface)",
                      borderTopColor: stage.color,
                      borderTopWidth: "2px",
                    }}
                  >
                    <div
                      className="inline-flex items-center justify-center h-7 w-7 rounded-md text-xs font-bold mb-3 text-white"
                      style={{ background: stage.color }}
                    >
                      {i + 1}
                    </div>
                    <h3
                      className="font-semibold text-sm mb-0.5"
                      style={{ color: "var(--text)" }}
                    >
                      {stage.label}
                    </h3>
                    <p className="text-xs mb-3" style={{ color: stage.color }}>
                      {stage.description}
                    </p>
                    <ul className="space-y-1">
                      {stage.items.map((item) => (
                        <li
                          key={item}
                          className="flex items-center gap-1.5 text-xs"
                          style={{ color: "var(--muted)" }}
                        >
                          <span
                            className="h-1 w-1 rounded-full flex-shrink-0"
                            style={{ background: stage.color }}
                          />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </FadeIn>

                {/* Arrow between stages */}
                {i < pipelineStages.length - 1 && (
                  <div className="hidden lg:flex items-center justify-center w-6 flex-shrink-0 mx-1">
                    <div
                      className="h-px flex-1"
                      style={{ background: "var(--border)" }}
                    />
                    <svg width="6" height="10" viewBox="0 0 6 10" fill="none">
                      <path d="M1 1l4 4-4 4" stroke="var(--border)" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Score formula */}
        <FadeIn delay={0.5} className="mt-12">
          <div
            className="rounded-xl border p-6 text-center"
            style={{ borderColor: "rgba(124,58,237,0.2)", background: "rgba(124,58,237,0.04)" }}
          >
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--muted)" }}>
              Final Score Formula
            </p>
            <code
              className="text-sm"
              style={{ fontFamily: "var(--font-jetbrains), monospace", color: "#a855f7" }}
            >
              Final Score = Technical + Aesthetic + Subject + Moment + Eye Focus + Intent Bonus + Confidence
            </code>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
