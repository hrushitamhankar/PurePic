import type { Metadata } from "next";
import { Monitor, Download, Shield, Cpu, HardDrive, MemoryStick } from "lucide-react";
import { FadeIn } from "@/components/animations/FadeIn";
import { StaggerChildren, StaggerItem } from "@/components/animations/StaggerChildren";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { CodeBlock } from "@/components/shared/CodeBlock";
import { generatePageMetadata } from "@/lib/metadata";

export const metadata: Metadata = generatePageMetadata({
  title: "Download",
  description: "Download PurePic for Windows, macOS, or Linux. Free to get started.",
  path: "/download",
});

const platforms = [
  {
    name: "Windows",
    icon: "⊞",
    version: "Windows 10 / 11",
    arch: "x64",
    size: "48 MB",
    href: "#",
    available: true,
  },
  {
    name: "macOS",
    icon: "",
    version: "macOS 11+",
    arch: "Universal (Intel + Apple Silicon)",
    size: "52 MB",
    href: "#",
    available: true,
  },
  {
    name: "Linux",
    icon: "🐧",
    version: "Ubuntu 20.04+",
    arch: "x64",
    size: "45 MB",
    href: "#",
    available: true,
  },
];

const requirements = [
  {
    icon: Cpu,
    label: "Processor",
    minimum: "4-core CPU, 2.0 GHz",
    recommended: "8-core CPU, 3.0 GHz",
  },
  {
    icon: MemoryStick,
    label: "Memory",
    minimum: "8 GB RAM",
    recommended: "16 GB RAM",
  },
  {
    icon: HardDrive,
    label: "Storage",
    minimum: "2 GB free space",
    recommended: "10 GB+ for project cache",
  },
  {
    icon: Monitor,
    label: "Display",
    minimum: "1280 × 800",
    recommended: "2560 × 1440 or higher",
  },
];

export default function DownloadPage() {
  return (
    <>
      <section className="pt-40 pb-20 text-center px-4" style={{ paddingTop: "140px" }}>
        <FadeIn>
          <span
            className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium tracking-wider uppercase mb-6"
            style={{ borderColor: "rgba(124,58,237,0.3)", background: "rgba(124,58,237,0.08)", color: "#a855f7" }}
          >
            Version 0.1.0-beta
          </span>
          <h1
            className="text-5xl font-bold tracking-tight sm:text-6xl mb-5"
            style={{ fontFamily: "var(--font-geist), system-ui, sans-serif", color: "var(--text)" }}
          >
            Download PurePic
          </h1>
          <p className="text-lg max-w-xl mx-auto mb-10" style={{ color: "var(--muted)" }}>
            Free to download. No account required to get started.
            100% offline — your images never leave your machine.
          </p>
          <div
            className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs border"
            style={{ borderColor: "rgba(34,197,94,0.3)", background: "rgba(34,197,94,0.05)", color: "#22c55e" }}
          >
            <Shield size={12} />
            100% offline • No cloud upload • Privacy-first
          </div>
        </FadeIn>
      </section>

      {/* Platform downloads */}
      <section className="pb-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <StaggerChildren className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {platforms.map((p) => (
              <StaggerItem key={p.name}>
                <div
                  className="rounded-2xl border p-7 text-center card-hover group"
                  style={{ borderColor: "var(--border)", background: "var(--surface)" }}
                >
                  <div className="text-4xl mb-4">{p.icon}</div>
                  <h3 className="font-semibold text-lg mb-1" style={{ color: "var(--text)" }}>
                    {p.name}
                  </h3>
                  <p className="text-sm mb-1" style={{ color: "var(--muted)" }}>
                    {p.version}
                  </p>
                  <p className="text-xs mb-6" style={{ color: "var(--muted)" }}>
                    {p.arch} · {p.size}
                  </p>
                  <a
                    href={p.href}
                    className="inline-flex items-center gap-2 w-full justify-center rounded-xl py-3 text-sm font-semibold text-white transition-all duration-200 hover:scale-105"
                    style={{ background: "linear-gradient(135deg, #7c3aed, #6d28d9)" }}
                  >
                    <Download size={14} />
                    Download for {p.name}
                  </a>
                </div>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* Installation guide */}
      <section className="py-20 border-t" style={{ borderColor: "var(--border)" }}>
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="Installation"
            title="Up and running in 2 minutes"
            subtitle="Install Python dependencies and run PurePic directly from source."
          />

          <div className="space-y-6">
            {[
              {
                step: "1",
                title: "Clone the repository",
                code: "git clone https://github.com/FOOX-BAT/PurePic.git\ncd PurePic",
              },
              {
                step: "2",
                title: "Create a virtual environment",
                code: "python -m venv .venv\n.venv\\Scripts\\activate   # Windows\nsource .venv/bin/activate  # macOS / Linux",
              },
              {
                step: "3",
                title: "Install dependencies",
                code: "pip install -r requirements.txt",
              },
              {
                step: "4",
                title: "Run PurePic",
                code: "python PurePic/purepic_batch.py",
              },
            ].map((s) => (
              <FadeIn key={s.step}>
                <div
                  className="rounded-xl border overflow-hidden"
                  style={{ borderColor: "var(--border)" }}
                >
                  <div
                    className="flex items-center gap-3 px-5 py-3 border-b"
                    style={{ borderColor: "var(--border)", background: "var(--surface)" }}
                  >
                    <span
                      className="h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                      style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)" }}
                    >
                      {s.step}
                    </span>
                    <span className="font-medium text-sm" style={{ color: "var(--text)" }}>
                      {s.title}
                    </span>
                  </div>
                  <CodeBlock code={s.code} language="bash" />
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* System requirements */}
      <section className="py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="System Requirements"
            title="What you need to run PurePic"
            subtitle="PurePic runs entirely on your machine. A GPU is optional but recommended for large batches."
          />

          <div
            className="rounded-2xl border overflow-hidden"
            style={{ borderColor: "var(--border)" }}
          >
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border)", background: "var(--surface)" }}>
                  <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Component</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Minimum</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Recommended</th>
                </tr>
              </thead>
              <tbody>
                {requirements.map((req, i) => (
                  <tr
                    key={req.label}
                    style={{
                      borderBottom: i < requirements.length - 1 ? "1px solid var(--border)" : "none",
                    }}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <req.icon size={14} style={{ color: "var(--muted)" }} />
                        <span className="text-sm font-medium" style={{ color: "var(--text)" }}>{req.label}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm" style={{ color: "var(--muted)" }}>{req.minimum}</td>
                    <td className="px-6 py-4 text-sm" style={{ color: "#a855f7" }}>{req.recommended}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  );
}
