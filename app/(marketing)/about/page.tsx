import type { Metadata } from "next";
import { Eye, Target, Cpu, Heart } from "lucide-react";
import { FadeIn } from "@/components/animations/FadeIn";
import { StaggerChildren, StaggerItem } from "@/components/animations/StaggerChildren";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { NewsletterSection } from "@/components/home/NewsletterSection";
import { generatePageMetadata } from "@/lib/metadata";

export const metadata: Metadata = generatePageMetadata({
  title: "About",
  description: "Learn about PurePic — the vision, mission, and technology behind the AI photography platform.",
  path: "/about",
});

const values = [
  {
    icon: Eye,
    title: "Understand First",
    description:
      "Every PurePic decision starts with understanding. Not processing. The AI reads an image the way an experienced editor would — before touching a single slider.",
  },
  {
    icon: Target,
    title: "Precision Over Volume",
    description:
      "PurePic isn't built to process as many images as possible. It's built to make the right call on every single one. Quality of analysis, not speed of output.",
  },
  {
    icon: Cpu,
    title: "Local Intelligence",
    description:
      "Every model runs on your machine. No cloud upload. No subscription required to run AI. Privacy is not a feature — it's a non-negotiable architectural decision.",
  },
  {
    icon: Heart,
    title: "Photographer-First",
    description:
      "PurePic is built by people who understand photography. The scoring system doesn't reward technically perfect but emotionally empty images — it rewards moments.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-40 pb-20 text-center px-4" style={{ paddingTop: "140px" }}>
        <FadeIn>
          <span
            className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium tracking-wider uppercase mb-6"
            style={{ borderColor: "rgba(124,58,237,0.3)", background: "rgba(124,58,237,0.08)", color: "#a855f7" }}
          >
            About PurePic
          </span>
          <h1
            className="text-5xl font-bold tracking-tight sm:text-6xl mb-6"
            style={{ fontFamily: "var(--font-geist), system-ui, sans-serif", color: "var(--text)" }}
          >
            Built to answer one question
          </h1>
          <p
            className="text-xl max-w-2xl mx-auto font-medium"
            style={{
              fontFamily: "var(--font-geist), system-ui, sans-serif",
              background: "linear-gradient(135deg, #7c3aed, #a855f7, #3b82f6)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            "Which photos would a real editor keep — and why?"
          </p>
        </FadeIn>
      </section>

      {/* Mission */}
      <section className="pb-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FadeIn delay={0}>
              <div
                className="rounded-2xl border p-7"
                style={{ borderColor: "var(--border)", background: "var(--surface)" }}
              >
                <h2
                  className="text-xs font-semibold uppercase tracking-widest mb-4"
                  style={{ color: "var(--muted)" }}
                >
                  Vision
                </h2>
                <p className="text-base leading-relaxed" style={{ color: "var(--text)" }}>
                  A world where photographers focus on creating — not culling. Where AI handles the volume work with editorial judgment, and humans stay in control of the creative direction.
                </p>
              </div>
            </FadeIn>
            <FadeIn delay={0.1}>
              <div
                className="rounded-2xl border p-7"
                style={{ borderColor: "var(--border)", background: "var(--surface)" }}
              >
                <h2
                  className="text-xs font-semibold uppercase tracking-widest mb-4"
                  style={{ color: "var(--muted)" }}
                >
                  Mission
                </h2>
                <p className="text-base leading-relaxed" style={{ color: "var(--text)" }}>
                  Build an AI platform that understands photographs before editing them. Not a preset applier. Not a batch resizer. A system that perceives, reasons, and acts — like a professional editor.
                </p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 border-t" style={{ borderColor: "var(--border)" }}>
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="Philosophy"
            title="How we think about photography AI"
          />
          <StaggerChildren className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {values.map((v) => (
              <StaggerItem key={v.title}>
                <div
                  className="rounded-xl border p-6 card-hover"
                  style={{ borderColor: "var(--border)", background: "var(--surface)" }}
                >
                  <div
                    className="inline-flex h-10 w-10 items-center justify-center rounded-lg mb-4"
                    style={{ background: "rgba(124,58,237,0.1)" }}
                  >
                    <v.icon size={18} style={{ color: "#a855f7" }} />
                  </div>
                  <h3 className="font-semibold text-base mb-2" style={{ color: "var(--text)" }}>
                    {v.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    {v.description}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* Tech section */}
      <section className="py-24 border-t" style={{ borderColor: "var(--border)" }}>
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="Technology"
            title="What runs under the hood"
          />
          <FadeIn>
            <div
              className="rounded-2xl border p-8 space-y-6"
              style={{ borderColor: "rgba(124,58,237,0.2)", background: "rgba(124,58,237,0.03)" }}
            >
              {[
                { label: "AI Models", value: "Custom-trained ONNX and TFLite models for aesthetic scoring, running fully offline via local inference." },
                { label: "Scoring Engine", value: "A multi-dimensional weighted pipeline covering Technical Quality, Aesthetic Composition, Subject Intelligence, Moment Strength, Eye Focus, and Intent Bonus." },
                { label: "RAW Processing", value: "Embedded JPEG preview extraction for all major RAW formats. Full perceptual quality at 10× the decode speed." },
                { label: "Batch Engine", value: "Multi-core parallel processing using Python multiprocessing. Scales linearly with CPU core count." },
                { label: "Privacy Architecture", value: "Zero network calls during analysis. All models, weights, and processing run entirely on the local machine." },
              ].map((t) => (
                <div key={t.label} className="flex flex-col sm:flex-row gap-2 sm:gap-6">
                  <div
                    className="text-sm font-semibold flex-shrink-0 sm:w-40"
                    style={{ color: "#a855f7" }}
                  >
                    {t.label}
                  </div>
                  <div className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    {t.value}
                  </div>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      <NewsletterSection />
    </>
  );
}
