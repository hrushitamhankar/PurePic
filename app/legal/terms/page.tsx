import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { generatePageMetadata } from "@/lib/metadata";

export const metadata: Metadata = generatePageMetadata({
  title: "Terms of Service",
  path: "/legal/terms",
});

const sections = [
  {
    title: "Acceptance of Terms",
    content: "By downloading, installing, or using PurePic, you agree to be bound by these Terms of Service. If you do not agree, do not use the software.",
  },
  {
    title: "License Grant",
    content: "Subject to these terms, PurePic grants you a limited, non-exclusive, non-transferable license to use the software for personal or commercial photography work, depending on your subscription tier.",
  },
  {
    title: "Acceptable Use",
    content: "You may use PurePic for legitimate photography workflows. You may not reverse engineer, decompile, modify, distribute, or create derivative works from the software without explicit written permission.",
  },
  {
    title: "Intellectual Property",
    content: "PurePic and all its components, AI models, algorithms, and associated intellectual property are owned by PurePic. Your photographs remain your property at all times.",
  },
  {
    title: "No Warranty",
    content: "PurePic is provided as-is during the beta period. We make no warranties about the accuracy of AI analysis results. AI-generated scores and recommendations are advisory, not authoritative.",
  },
  {
    title: "Limitation of Liability",
    content: "PurePic shall not be liable for any indirect, incidental, or consequential damages arising from your use of the software, including any loss of data or business.",
  },
  {
    title: "Subscription and Billing",
    content: "Paid plans are billed monthly or annually. Cancellations take effect at the end of the billing period. Refunds are available within 14 days of initial purchase.",
  },
  {
    title: "Changes to Terms",
    content: "We may update these terms periodically. Continued use of PurePic after changes constitutes acceptance of the new terms.",
  },
];

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-32 pb-24" style={{ paddingTop: "120px" }}>
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <Link href="/legal/privacy" className="text-sm hover:text-white" style={{ color: "var(--muted)" }}>
              Also see: Privacy Policy →
            </Link>
            <h1
              className="text-4xl font-bold mt-4 mb-3"
              style={{ fontFamily: "var(--font-geist), system-ui, sans-serif", color: "var(--text)" }}
            >
              Terms of Service
            </h1>
            <p className="text-sm" style={{ color: "var(--muted)" }}>Last updated: January 2025</p>
          </div>

          <div className="space-y-8">
            {sections.map((s, i) => (
              <div
                key={s.title}
                className="rounded-xl border p-6"
                style={{ borderColor: "var(--border)", background: "var(--surface)" }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <span
                    className="text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center text-white flex-shrink-0"
                    style={{ background: "#7c3aed", fontSize: "10px" }}
                  >
                    {i + 1}
                  </span>
                  <h2 className="font-semibold text-base" style={{ color: "var(--text)" }}>
                    {s.title}
                  </h2>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                  {s.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
