import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { generatePageMetadata } from "@/lib/metadata";

export const metadata: Metadata = generatePageMetadata({
  title: "Privacy Policy",
  path: "/legal/privacy",
});

const sections = [
  {
    title: "Data Collection",
    content: "PurePic desktop application runs entirely offline. When using the desktop application, no image data, metadata, or personally identifiable information is transmitted to our servers. The application processes all images locally on your machine.",
  },
  {
    title: "Website Analytics",
    content: "Our website may use privacy-respecting analytics to understand how visitors use the site. We do not sell, share, or transmit your personal information to third parties for advertising purposes.",
  },
  {
    title: "Account Data",
    content: "If you create an account, we store your name, email address, and account preferences. This data is used solely to provide the service, manage your license, and communicate updates. We do not sell your data.",
  },
  {
    title: "Cookies",
    content: "We use essential cookies for authentication and session management. We do not use tracking cookies or third-party advertising cookies.",
  },
  {
    title: "Image Privacy",
    content: "Your photographs are yours. The desktop application performs all AI analysis locally. No images are uploaded to our servers unless you explicitly enable cloud sync as part of a paid plan.",
  },
  {
    title: "Contact",
    content: "If you have privacy-related questions, contact us at privacy@purepic.app.",
  },
];

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-32 pb-24" style={{ paddingTop: "120px" }}>
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <Link href="/legal/terms" className="text-sm hover:text-white" style={{ color: "var(--muted)" }}>
              Also see: Terms of Service →
            </Link>
            <h1
              className="text-4xl font-bold mt-4 mb-3"
              style={{ fontFamily: "var(--font-geist), system-ui, sans-serif", color: "var(--text)" }}
            >
              Privacy Policy
            </h1>
            <p className="text-sm" style={{ color: "var(--muted)" }}>Last updated: January 2025</p>
          </div>

          <div className="space-y-8">
            {sections.map((s) => (
              <div
                key={s.title}
                className="rounded-xl border p-6"
                style={{ borderColor: "var(--border)", background: "var(--surface)" }}
              >
                <h2
                  className="font-semibold text-lg mb-3"
                  style={{ color: "var(--text)" }}
                >
                  {s.title}
                </h2>
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
