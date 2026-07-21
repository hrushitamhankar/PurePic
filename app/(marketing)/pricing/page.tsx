"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, X, HelpCircle } from "lucide-react";
import { motion } from "framer-motion";
import { FadeIn } from "@/components/animations/FadeIn";
import { StaggerChildren, StaggerItem } from "@/components/animations/StaggerChildren";
import { NewsletterSection } from "@/components/home/NewsletterSection";
import { pricingPlans } from "@/constants/pricing";
import { cn } from "@/lib/utils";
import type { BillingCycle } from "@/types/pricing.types";

export default function PricingPage() {
  const [billing, setBilling] = useState<BillingCycle>("monthly");

  return (
    <>
      {/* Hero */}
      <section className="pt-40 pb-16 text-center px-4" style={{ paddingTop: "140px" }}>
        <FadeIn>
          <span
            className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium tracking-wider uppercase mb-6"
            style={{ borderColor: "rgba(124,58,237,0.3)", background: "rgba(124,58,237,0.08)", color: "#a855f7" }}
          >
            Pricing
          </span>
          <h1
            className="text-5xl font-bold tracking-tight sm:text-6xl mb-5"
            style={{ fontFamily: "var(--font-geist), system-ui, sans-serif", color: "var(--text)" }}
          >
            Simple, honest pricing
          </h1>
          <p className="text-lg max-w-xl mx-auto mb-10" style={{ color: "var(--muted)" }}>
            Start free. No credit card required. Upgrade when PurePic becomes essential to your workflow.
          </p>

          {/* Billing toggle */}
          <div
            className="inline-flex items-center rounded-xl border p-1"
            style={{ borderColor: "var(--border)", background: "var(--surface)" }}
          >
            {(["monthly", "annual"] as BillingCycle[]).map((b) => (
              <button
                key={b}
                onClick={() => setBilling(b)}
                className="relative px-5 py-2 text-sm font-medium rounded-lg transition-colors"
                style={{ color: billing === b ? "white" : "var(--muted)" }}
              >
                {billing === b && (
                  <motion.div
                    className="absolute inset-0 rounded-lg"
                    style={{ background: "linear-gradient(135deg, #7c3aed, #6d28d9)" }}
                    layoutId="billing-bg"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative">
                  {b === "monthly" ? "Monthly" : "Annual"}
                  {b === "annual" && (
                    <span
                      className="ml-2 text-xs font-semibold"
                      style={{ color: billing === "annual" ? "#a5f3fc" : "#22c55e" }}
                    >
                      Save 20%
                    </span>
                  )}
                </span>
              </button>
            ))}
          </div>
        </FadeIn>
      </section>

      {/* Plans */}
      <section className="pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {pricingPlans.map((plan) => {
              const price = billing === "monthly" ? plan.monthlyPrice : plan.annualPrice;
              return (
                <StaggerItem key={plan.id}>
                  <div
                    className="relative rounded-2xl border p-7 h-full flex flex-col"
                    style={{
                      borderColor: plan.highlighted ? "rgba(124,58,237,0.4)" : "var(--border)",
                      background: plan.highlighted
                        ? "linear-gradient(180deg, rgba(124,58,237,0.06) 0%, var(--surface) 100%)"
                        : "var(--surface)",
                      boxShadow: plan.highlighted ? "0 0 60px rgba(124,58,237,0.1)" : "none",
                    }}
                  >
                    {plan.badge && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <span
                          className="rounded-full px-3 py-1 text-xs font-semibold text-white whitespace-nowrap"
                          style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)" }}
                        >
                          {plan.badge}
                        </span>
                      </div>
                    )}

                    <div className="mb-5">
                      <h3 className="font-semibold text-lg" style={{ color: "var(--text)" }}>
                        {plan.name}
                      </h3>
                      <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>
                        {plan.description}
                      </p>
                    </div>

                    <div className="mb-6">
                      {price === null ? (
                        <div className="text-3xl font-bold" style={{ color: "var(--text)" }}>Custom</div>
                      ) : (
                        <div className="flex items-baseline gap-1">
                          <span className="text-4xl font-bold" style={{ color: "var(--text)" }}>
                            {price === 0 ? "Free" : `$${price}`}
                          </span>
                          {price > 0 && (
                            <span className="text-sm" style={{ color: "var(--muted)" }}>
                              /{billing === "monthly" ? "mo" : "mo, billed annually"}
                            </span>
                          )}
                        </div>
                      )}
                      {price !== null && price > 0 && billing === "annual" && (
                        <p className="text-xs mt-1" style={{ color: "#22c55e" }}>
                          Save ${(plan.monthlyPrice! - price) * 12}/year
                        </p>
                      )}
                    </div>

                    <ul className="space-y-2.5 flex-1 mb-7">
                      {plan.features.map((feat) => (
                        <li key={feat.label} className="flex items-start gap-2">
                          {feat.included ? (
                            <Check size={14} className="mt-0.5 flex-shrink-0" style={{ color: "#22c55e" }} />
                          ) : (
                            <X size={14} className="mt-0.5 flex-shrink-0" style={{ color: "var(--border)" }} />
                          )}
                          <span
                            className="text-sm"
                            style={{
                              color: feat.included ? "var(--muted)" : "var(--border)",
                            }}
                          >
                            {feat.label}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <Link
                      href={plan.ctaHref}
                      className="block w-full text-center rounded-xl py-3 text-sm font-semibold transition-all duration-200 hover:scale-105"
                      style={
                        plan.highlighted
                          ? { background: "linear-gradient(135deg, #7c3aed, #6d28d9)", color: "white" }
                          : { border: "1px solid var(--border)", color: "var(--text)" }
                      }
                    >
                      {plan.ctaLabel}
                    </Link>
                  </div>
                </StaggerItem>
              );
            })}
          </StaggerChildren>
        </div>
      </section>

      {/* FAQ note */}
      <FadeIn>
        <div className="pb-24 text-center px-4">
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            All plans include a 14-day free trial. No credit card required.{" "}
            <Link href="/faq" className="underline" style={{ color: "#a855f7" }}>
              Have questions? See the FAQ.
            </Link>
          </p>
        </div>
      </FadeIn>

      <NewsletterSection />
    </>
  );
}
