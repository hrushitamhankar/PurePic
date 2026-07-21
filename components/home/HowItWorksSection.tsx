"use client";

import { motion } from "framer-motion";
import { FolderOpen, Brain, SlidersHorizontal, Download } from "lucide-react";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { FadeIn } from "@/components/animations/FadeIn";
import { StaggerChildren, StaggerItem } from "@/components/animations/StaggerChildren";

const steps = [
  {
    step: "01",
    icon: FolderOpen,
    title: "Import Your Images",
    description:
      "Point PurePic at any folder. JPEG, PNG, or RAW files from any major camera brand — it reads them all natively.",
  },
  {
    step: "02",
    icon: Brain,
    title: "AI Analyzes Every Frame",
    description:
      "Each image is scored independently across six dimensions: technical quality, aesthetic composition, subject presence, moment strength, eye focus, and photographer intent.",
  },
  {
    step: "03",
    icon: SlidersHorizontal,
    title: "Intelligent Sorting",
    description:
      "Images are sorted into meaningful categories — artistic keep, good, ok, reject — with full reasoning for every decision.",
  },
  {
    step: "04",
    icon: Download,
    title: "Export & Edit",
    description:
      "Export results to Lightroom as XMP presets, review AI-generated reports, and move directly into focused editing.",
  },
];

export function HowItWorksSection() {
  return (
    <section className="py-32 relative" id="how-it-works">
      {/* Subtle top border line */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-full max-w-7xl"
        style={{ background: "linear-gradient(90deg, transparent, var(--border), transparent)" }}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="How It Works"
          title="From import to insight in minutes"
          subtitle="A four-step pipeline that replaces hours of manual culling with intelligent AI analysis."
        />

        <StaggerChildren className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Connecting line */}
          <div
            className="absolute top-10 left-0 right-0 h-px hidden lg:block"
            style={{ background: "linear-gradient(90deg, transparent 5%, var(--border) 20%, var(--border) 80%, transparent 95%)" }}
          />

          {steps.map((step, i) => (
            <StaggerItem key={step.step}>
              <div className="relative text-center lg:text-left">
                {/* Step dot */}
                <div className="flex justify-center lg:justify-start mb-6">
                  <div
                    className="relative z-10 flex h-20 w-20 items-center justify-center rounded-2xl border"
                    style={{
                      borderColor: "rgba(124,58,237,0.3)",
                      background: "var(--surface)",
                      boxShadow: "0 0 30px rgba(124,58,237,0.1)",
                    }}
                  >
                    <step.icon size={28} style={{ color: "#a855f7" }} />
                    <span
                      className="absolute -top-2 -right-2 text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center"
                      style={{
                        background: "linear-gradient(135deg, #7c3aed, #a855f7)",
                        color: "white",
                        fontSize: "10px",
                      }}
                    >
                      {i + 1}
                    </span>
                  </div>
                </div>

                <h3
                  className="font-semibold text-lg mb-2"
                  style={{ color: "var(--text)" }}
                >
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                  {step.description}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </div>
    </section>
  );
}
