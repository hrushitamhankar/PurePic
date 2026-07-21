import type { Metadata } from "next";
import { FadeIn } from "@/components/animations/FadeIn";
import { generatePageMetadata } from "@/lib/metadata";

export const metadata: Metadata = generatePageMetadata({
  title: "Blog",
  path: "/blog",
});

export default function BlogPage() {
  return (
    <>
      <section className="pt-40 pb-20 text-center px-4" style={{ paddingTop: "140px" }}>
        <FadeIn>
          <span
            className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium tracking-wider uppercase mb-6"
            style={{ borderColor: "rgba(124,58,237,0.3)", background: "rgba(124,58,237,0.08)", color: "#a855f7" }}
          >
            Blog
          </span>
          <h1
            className="text-5xl font-bold tracking-tight sm:text-6xl mb-5"
            style={{ fontFamily: "var(--font-geist), system-ui, sans-serif", color: "var(--text)" }}
          >
            Updates & insights
          </h1>
          <p className="text-lg max-w-xl mx-auto" style={{ color: "var(--muted)" }}>
            Release notes, AI photography research, and product updates from the PurePic team.
          </p>
        </FadeIn>
      </section>

      <section className="pb-32">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div
              className="rounded-2xl border p-12 text-center"
              style={{ borderColor: "var(--border)", background: "var(--surface)" }}
            >
              <div
                className="inline-flex h-14 w-14 items-center justify-center rounded-2xl mb-4"
                style={{ background: "rgba(124,58,237,0.1)" }}
              >
                <span className="text-2xl">✍️</span>
              </div>
              <h2 className="font-semibold text-xl mb-2" style={{ color: "var(--text)" }}>
                Blog coming soon
              </h2>
              <p className="text-sm" style={{ color: "var(--muted)" }}>
                The first posts are being written. Subscribe to our newsletter to get notified.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
