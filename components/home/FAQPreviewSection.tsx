"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ArrowRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { faqItems } from "@/constants/faq";
import { cn } from "@/lib/utils";

export function FAQPreviewSection() {
  const [open, setOpen] = useState<number | null>(0);
  const preview = faqItems.slice(0, 5);

  return (
    <section className="py-32 relative">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="FAQ"
          title="Common questions"
          subtitle="Everything you need to know before getting started."
        />

        <div
          className="rounded-2xl border divide-y overflow-hidden"
          style={{ borderColor: "var(--border)", background: "var(--surface)" }}
        >
          {preview.map((item, i) => (
            <div
              key={i}
              style={{ borderColor: "var(--border)" }}
            >
              <button
                className="flex items-center justify-between w-full px-6 py-5 text-left transition-colors hover:bg-white/[0.02]"
                onClick={() => setOpen(open === i ? null : i)}
                aria-expanded={open === i}
              >
                <span
                  className="font-medium text-sm pr-4"
                  style={{ color: "var(--text)" }}
                >
                  {item.question}
                </span>
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
                    key="answer"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: [0.21, 0.47, 0.32, 0.98] }}
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

        <div className="mt-8 text-center">
          <Link
            href="/faq"
            className="inline-flex items-center gap-2 text-sm font-medium transition-colors hover:text-white"
            style={{ color: "#a855f7" }}
          >
            View all frequently asked questions
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
