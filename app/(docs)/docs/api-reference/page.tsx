import type { Metadata } from "next";
import Link from "next/link";
import { generatePageMetadata } from "@/lib/metadata";

export const metadata: Metadata = generatePageMetadata({ title: "API Reference", path: "/docs/api-reference" });

export default function APIReferencePage() {
  return (
    <article className="prose-purepic max-w-none">
      <nav className="text-xs mb-8" style={{ color: "var(--muted)" }}>
        <Link href="/docs" className="hover:text-white">Docs</Link>
        <span className="mx-2">/</span>
        <span style={{ color: "var(--text)" }}>API Reference</span>
      </nav>

      <h1 style={{ color: "var(--text)", fontSize: "2rem", fontWeight: 700, marginBottom: "1rem", fontFamily: "var(--font-geist), system-ui, sans-serif" }}>
        API Reference
      </h1>

      <div
        className="rounded-xl border p-6 mb-8"
        style={{ borderColor: "rgba(124,58,237,0.3)", background: "rgba(124,58,237,0.06)" }}
      >
        <p className="text-sm font-medium mb-2" style={{ color: "#a855f7" }}>
          API Under Development
        </p>
        <p className="text-sm" style={{ color: "var(--muted)" }}>
          The PurePic REST API is currently planned and will be implemented in Phase 4. This page will be updated with full endpoint documentation when the API is available. Enterprise plans will include API access.
        </p>
      </div>

      <h2 style={{ color: "var(--text)", fontSize: "1.25rem", fontWeight: 600, marginBottom: "1rem" }}>
        Planned Endpoints
      </h2>

      <div className="space-y-3">
        {[
          { method: "POST", path: "/api/v1/analyze", desc: "Submit images for AI analysis and receive scores." },
          { method: "GET", path: "/api/v1/jobs/{id}", desc: "Poll the status and results of a processing job." },
          { method: "GET", path: "/api/v1/releases/latest", desc: "Fetch the latest PurePic version and download URLs." },
          { method: "POST", path: "/api/v1/auth/login", desc: "Authenticate with email and password." },
          { method: "GET", path: "/api/v1/user/me", desc: "Retrieve authenticated user profile and license info." },
          { method: "POST", path: "/api/v1/licensing/validate", desc: "Validate a license key." },
        ].map((ep) => (
          <div
            key={ep.path}
            className="rounded-lg border p-4 flex items-start gap-4"
            style={{ borderColor: "var(--border)", background: "var(--surface)" }}
          >
            <span
              className="text-xs font-bold rounded px-2 py-1 flex-shrink-0"
              style={{
                background: ep.method === "GET" ? "rgba(34,197,94,0.1)" : "rgba(59,130,246,0.1)",
                color: ep.method === "GET" ? "#22c55e" : "#3b82f6",
              }}
            >
              {ep.method}
            </span>
            <div>
              <code
                className="text-sm block mb-1"
                style={{ fontFamily: "var(--font-jetbrains), monospace", color: "#a855f7" }}
              >
                {ep.path}
              </code>
              <p className="text-xs" style={{ color: "var(--muted)" }}>{ep.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}
