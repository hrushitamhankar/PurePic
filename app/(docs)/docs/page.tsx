import type { Metadata } from "next";
import Link from "next/link";
import { Book, Terminal, Image, SortAsc, Sliders, FileOutput, Code } from "lucide-react";
import { generatePageMetadata } from "@/lib/metadata";

export const metadata: Metadata = generatePageMetadata({
  title: "Documentation",
  path: "/docs",
});

const docCards = [
  { icon: Terminal, title: "Installation", href: "/docs/installation", desc: "Install PurePic on Windows, macOS, or Linux." },
  { icon: Book, title: "Quick Start", href: "/docs/quick-start", desc: "Get from zero to your first AI-sorted batch in minutes." },
  { icon: Image, title: "Import Images", href: "/docs/import-images", desc: "Supported formats, RAW processing, and folder structures." },
  { icon: SortAsc, title: "Image Sorting", href: "/docs/image-sorting", desc: "How the scoring pipeline works and what each category means." },
  { icon: Sliders, title: "Editing", href: "/docs/editing", desc: "AI editing decisions, parameters, and overrides." },
  { icon: FileOutput, title: "Exporting", href: "/docs/exporting", desc: "CSV reports, Lightroom XMP, and output folder structure." },
  { icon: Code, title: "API Reference", href: "/docs/api-reference", desc: "Planned API endpoints for future developer integration." },
];

export default function DocsHomePage() {
  return (
    <div>
      <div className="mb-12">
        <span
          className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium tracking-wider uppercase mb-4"
          style={{ borderColor: "rgba(124,58,237,0.3)", background: "rgba(124,58,237,0.08)", color: "#a855f7" }}
        >
          Documentation
        </span>
        <h1
          className="text-4xl font-bold tracking-tight mb-4"
          style={{ fontFamily: "var(--font-geist), system-ui, sans-serif", color: "var(--text)" }}
        >
          PurePic Documentation
        </h1>
        <p className="text-base max-w-lg" style={{ color: "var(--muted)" }}>
          Everything you need to install, configure, and use PurePic to analyze and sort your photography.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {docCards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="rounded-xl border p-5 flex items-start gap-4 transition-all hover:border-purple-500/30 group card-hover"
            style={{ borderColor: "var(--border)", background: "var(--surface)" }}
          >
            <div
              className="inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg"
              style={{ background: "rgba(124,58,237,0.1)" }}
            >
              <card.icon size={16} style={{ color: "#a855f7" }} />
            </div>
            <div>
              <h3 className="font-medium text-sm mb-1 group-hover:text-white transition-colors" style={{ color: "var(--text)" }}>
                {card.title}
              </h3>
              <p className="text-xs leading-relaxed" style={{ color: "var(--muted)" }}>
                {card.desc}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
