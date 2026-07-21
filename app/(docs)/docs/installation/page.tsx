import type { Metadata } from "next";
import Link from "next/link";
import { CodeBlock } from "@/components/shared/CodeBlock";
import { generatePageMetadata } from "@/lib/metadata";

export const metadata: Metadata = generatePageMetadata({ title: "Installation", path: "/docs/installation" });

export default function InstallationPage() {
  return (
    <article className="prose-purepic max-w-none">
      <nav className="text-xs mb-8" style={{ color: "var(--muted)" }}>
        <Link href="/docs" className="hover:text-white">Docs</Link>
        <span className="mx-2">/</span>
        <span style={{ color: "var(--text)" }}>Installation</span>
      </nav>

      <h1 style={{ color: "var(--text)", fontSize: "2rem", fontWeight: 700, marginBottom: "1rem", fontFamily: "var(--font-geist), system-ui, sans-serif" }}>
        Installation
      </h1>
      <p style={{ color: "var(--muted)", marginBottom: "2rem" }}>
        PurePic runs on Windows, macOS, and Linux. Follow the steps below to get started.
      </p>

      <h2 style={{ color: "var(--text)", fontSize: "1.25rem", fontWeight: 600, marginBottom: "0.75rem", marginTop: "2rem" }}>
        Prerequisites
      </h2>
      <ul style={{ color: "var(--muted)", listStyleType: "disc", paddingLeft: "1.5rem", marginBottom: "1.5rem", lineHeight: "1.8" }}>
        <li>Python 3.9 or later</li>
        <li>pip (Python package manager)</li>
        <li>Git (to clone the repository)</li>
        <li>4 GB+ free disk space</li>
      </ul>

      <h2 style={{ color: "var(--text)", fontSize: "1.25rem", fontWeight: 600, marginBottom: "0.75rem", marginTop: "2rem" }}>
        Step 1: Clone the repository
      </h2>
      <CodeBlock code={`git clone https://github.com/FOOX-BAT/PurePic.git\ncd PurePic`} language="bash" filename="Terminal" />

      <h2 style={{ color: "var(--text)", fontSize: "1.25rem", fontWeight: 600, marginBottom: "0.75rem", marginTop: "2rem" }}>
        Step 2: Create a virtual environment
      </h2>
      <CodeBlock code={`python -m venv .venv\n\n# Windows\n.venv\\Scripts\\activate\n\n# macOS / Linux\nsource .venv/bin/activate`} language="bash" filename="Terminal" />

      <h2 style={{ color: "var(--text)", fontSize: "1.25rem", fontWeight: 600, marginBottom: "0.75rem", marginTop: "2rem" }}>
        Step 3: Install dependencies
      </h2>
      <CodeBlock code="pip install -r requirements.txt" language="bash" filename="Terminal" />

      <h2 style={{ color: "var(--text)", fontSize: "1.25rem", fontWeight: 600, marginBottom: "0.75rem", marginTop: "2rem" }}>
        Step 4: Run PurePic
      </h2>
      <CodeBlock code="python PurePic/purepic_batch.py" language="bash" filename="Terminal" />

      <div
        className="mt-8 rounded-xl border p-5"
        style={{ borderColor: "rgba(124,58,237,0.2)", background: "rgba(124,58,237,0.04)" }}
      >
        <p className="text-sm" style={{ color: "var(--muted)" }}>
          <span style={{ color: "#a855f7", fontWeight: 600 }}>Next: </span>
          <Link href="/docs/quick-start" className="underline" style={{ color: "#a855f7" }}>
            Quick Start guide
          </Link>
          {" "}— run your first batch in minutes.
        </p>
      </div>
    </article>
  );
}
