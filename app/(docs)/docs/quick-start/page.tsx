import type { Metadata } from "next";
import Link from "next/link";
import { CodeBlock } from "@/components/shared/CodeBlock";
import { generatePageMetadata } from "@/lib/metadata";

export const metadata: Metadata = generatePageMetadata({ title: "Quick Start", path: "/docs/quick-start" });

export default function QuickStartPage() {
  return (
    <article className="prose-purepic max-w-none">
      <nav className="text-xs mb-8" style={{ color: "var(--muted)" }}>
        <Link href="/docs" className="hover:text-white">Docs</Link>
        <span className="mx-2">/</span>
        <span style={{ color: "var(--text)" }}>Quick Start</span>
      </nav>

      <h1 style={{ color: "var(--text)", fontSize: "2rem", fontWeight: 700, marginBottom: "1rem", fontFamily: "var(--font-geist), system-ui, sans-serif" }}>
        Quick Start
      </h1>
      <p style={{ color: "var(--muted)", marginBottom: "2rem" }}>
        Run your first AI-powered batch in under 5 minutes.
      </p>

      <h2 style={{ color: "var(--text)", fontSize: "1.25rem", fontWeight: 600, marginBottom: "0.75rem" }}>
        1. Activate your environment
      </h2>
      <CodeBlock code={`.venv\\Scripts\\activate   # Windows\nsource .venv/bin/activate  # macOS / Linux`} language="bash" />

      <h2 style={{ color: "var(--text)", fontSize: "1.25rem", fontWeight: 600, marginBottom: "0.75rem", marginTop: "2rem" }}>
        2. Run the batch processor
      </h2>
      <CodeBlock code="python PurePic/purepic_batch.py" language="bash" />

      <h2 style={{ color: "var(--text)", fontSize: "1.25rem", fontWeight: 600, marginBottom: "0.75rem", marginTop: "2rem" }}>
        3. Enter folder paths
      </h2>
      <p style={{ color: "var(--muted)", marginBottom: "1rem" }}>
        PurePic will prompt you for an input folder and output folder:
      </p>
      <CodeBlock
        code={`Enter folder path to scan: /path/to/your/photos\nEnter OUTPUT folder path: /path/to/output`}
        language="text"
      />

      <h2 style={{ color: "var(--text)", fontSize: "1.25rem", fontWeight: 600, marginBottom: "0.75rem", marginTop: "2rem" }}>
        4. Review results
      </h2>
      <p style={{ color: "var(--muted)", marginBottom: "1rem" }}>
        PurePic will sort your images into four categories and generate a CSV report:
      </p>
      <CodeBlock
        code={`output/\n  artistic_keep/    # Strong editorial / portfolio shots\n  good/             # Deliverable photos\n  ok/               # Backup / secondary selections\n  reject/           # Technically or visually weak\n  report.csv        # Full analysis report`}
        language="text"
        filename="Output structure"
      />

      <h2 style={{ color: "var(--text)", fontSize: "1.25rem", fontWeight: 600, marginBottom: "0.75rem", marginTop: "2rem" }}>
        Example terminal output
      </h2>
      <CodeBlock
        code={`technical: 47.54\naesthetic: 55.41\nsubject: 22.3\nmoment: 18.2\neye_focus: 63.5\nintent_bonus: 10\nconfidence: 82\nfinal_score: 61.2\nlabel: artistic_keep`}
        language="text"
        filename="Debug output"
      />
    </article>
  );
}
