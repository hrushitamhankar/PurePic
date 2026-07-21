import { FadeIn } from "@/components/animations/FadeIn";
import { StaggerChildren, StaggerItem } from "@/components/animations/StaggerChildren";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { supportedFormats } from "@/constants/formats";

export function SupportedFormatsSection() {
  const rawFormats = supportedFormats.filter((f) => f.category === "raw");
  const standardFormats = supportedFormats.filter((f) => f.category === "standard");

  return (
    <section className="py-24 relative">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="Compatibility"
          title="Works with every format you shoot"
          subtitle="RAW files are processed using embedded preview extraction — full-quality perception at 10× the speed of full RAW decoding."
        />

        {/* RAW formats */}
        <FadeIn className="mb-8">
          <p
            className="text-xs font-semibold uppercase tracking-widest mb-4 text-center"
            style={{ color: "var(--muted)" }}
          >
            RAW Formats
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {rawFormats.map((fmt) => (
              <div
                key={fmt.extension}
                className="flex items-center gap-2 rounded-lg border px-3 py-2"
                style={{ borderColor: "var(--border)", background: "var(--surface)" }}
              >
                <span
                  className="text-sm font-mono font-semibold"
                  style={{ color: "#a855f7" }}
                >
                  {fmt.extension}
                </span>
                {fmt.brand && (
                  <span className="text-xs" style={{ color: "var(--muted)" }}>
                    {fmt.brand}
                  </span>
                )}
              </div>
            ))}
          </div>
        </FadeIn>

        {/* Standard formats */}
        <FadeIn delay={0.1}>
          <p
            className="text-xs font-semibold uppercase tracking-widest mb-4 text-center"
            style={{ color: "var(--muted)" }}
          >
            Standard Formats
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {standardFormats.map((fmt) => (
              <div
                key={fmt.extension}
                className="rounded-lg border px-3 py-2"
                style={{ borderColor: "var(--border)", background: "var(--surface)" }}
              >
                <span
                  className="text-sm font-mono font-semibold"
                  style={{ color: "var(--text)" }}
                >
                  {fmt.extension}
                </span>
              </div>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
