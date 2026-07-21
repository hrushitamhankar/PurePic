"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { FadeIn } from "@/components/animations/FadeIn";
import { NewsletterSection } from "@/components/home/NewsletterSection";
import { faqItems } from "@/constants/faq";

const categories = ["All", "General", "Technical", "Features", "Pricing"];

export default function FAQPage() {
  const [open, setOpen] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = activeCategory === "All"
    ? faqItems
    : faqItems.filter((f) => f.category === activeCategory);

  return (
    <>
      <section className="pt-40 pb-16 text-center px-4" style={{ paddingTop: "140px" }}>
        <FadeIn>
          <span
            className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium tracking-wider uppercase mb-6"
            style={{ borderColor: "rgba(124,58,237,0.3)", background: "rgba(124,58,237,0.08)", color: "#a855f7" }}
          >
            FAQ
          </span>
          <h1
            className="text-5xl font-bold tracking-tight sm:text-6xl mb-5"
            style={{ fontFamily: "var(--font-geist), system-ui, sans-serif", color: "var(--text)" }}
          >
            Frequently asked questions
          </h1>
          <p className="text-lg max-w-xl mx-auto" style={{ color: "var(--muted)" }}>
            Everything you need to know about PurePic. Can&apos;t find what you&apos;re looking for? Contact us.
          </p>
        </FadeIn>
      </section>

      <section className="pb-32">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          {/* Category filter */}
          <FadeIn className="flex flex-wrap gap-2 justify-center mb-10">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => { setActiveCategory(cat); setOpen(null); }}
                className="rounded-full px-4 py-1.5 text-sm font-medium border transition-all duration-200"
                style={{
                  borderColor: activeCategory === cat ? "#7c3aed" : "var(--border)",
                  background: activeCategory === cat ? "rgba(124,58,237,0.1)" : "transparent",
                  color: activeCategory === cat ? "#a855f7" : "var(--muted)",
                }}
              >
                {cat}
              </button>
            ))}
          </FadeIn>

          <div
            className="rounded-2xl border divide-y overflow-hidden"
            style={{ borderColor: "var(--border)", background: "var(--surface)" }}
          >
            {filtered.map((item, i) => (
              <div key={i} style={{ borderColor: "var(--border)" }}>
                <button
                  className="flex items-center justify-between w-full px-6 py-5 text-left transition-colors hover:bg-white/[0.02]"
                  onClick={() => setOpen(open === i ? null : i)}
                  aria-expanded={open === i}
                >
                  <div className="flex items-start gap-3 pr-4">
                    <span
                      className="mt-0.5 text-xs rounded-md px-2 py-0.5 flex-shrink-0"
                      style={{ background: "rgba(124,58,237,0.1)", color: "#a855f7" }}
                    >
                      {item.category}
                    </span>
                    <span className="font-medium text-sm" style={{ color: "var(--text)" }}>
                      {item.question}
                    </span>
                  </div>
                  <motion.div
                    animate={{ rotate: open === i ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex-shrink-0"
                  >
                    <ChevronDown size={16} style={{ color: "var(--muted)" }} />
                  </motion.div>
                </button>
                <AnimatePresence initial={false}>
                  {open === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <p
                        className="px-6 pb-5 text-sm leading-relaxed"
                        style={{ color: "var(--muted)" }}
                      >
                        {item.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      <NewsletterSection />
    </>
  );
}
