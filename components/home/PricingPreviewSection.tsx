import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";
import { FadeIn } from "@/components/animations/FadeIn";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { pricingPlans } from "@/constants/pricing";

export function PricingPreviewSection() {
  const plans = pricingPlans.slice(0, 3);

  return (
    <section className="py-32 relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="Pricing"
          title="Simple, transparent pricing"
          subtitle="Start free. Upgrade when you need the full power of PurePic."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {plans.map((plan, i) => (
            <FadeIn key={plan.id} delay={i * 0.1}>
              <div
                className="relative rounded-2xl border p-7 h-full flex flex-col"
                style={{
                  borderColor: plan.highlighted
                    ? "rgba(124,58,237,0.4)"
                    : "var(--border)",
                  background: plan.highlighted
                    ? "linear-gradient(180deg, rgba(124,58,237,0.06) 0%, var(--surface) 100%)"
                    : "var(--surface)",
                  boxShadow: plan.highlighted
                    ? "0 0 60px rgba(124,58,237,0.1)"
                    : "none",
                }}
              >
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span
                      className="rounded-full px-3 py-1 text-xs font-semibold text-white"
                      style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)" }}
                    >
                      {plan.badge}
                    </span>
                  </div>
                )}

                <div className="mb-6">
                  <h3
                    className="font-semibold text-lg mb-1"
                    style={{ color: "var(--text)" }}
                  >
                    {plan.name}
                  </h3>
                  <p className="text-sm" style={{ color: "var(--muted)" }}>
                    {plan.description}
                  </p>
                </div>

                <div className="mb-6">
                  {plan.monthlyPrice === null ? (
                    <div className="text-3xl font-bold" style={{ color: "var(--text)" }}>
                      Custom
                    </div>
                  ) : (
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold" style={{ color: "var(--text)" }}>
                        {plan.monthlyPrice === 0 ? "Free" : `$${plan.monthlyPrice}`}
                      </span>
                      {plan.monthlyPrice > 0 && (
                        <span className="text-sm" style={{ color: "var(--muted)" }}>
                          /mo
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <ul className="space-y-2.5 mb-8 flex-1">
                  {plan.features.slice(0, 6).map((feat) => (
                    <li key={feat.label} className="flex items-start gap-2">
                      <Check
                        size={14}
                        className="mt-0.5 flex-shrink-0"
                        style={{ color: feat.included ? "#22c55e" : "var(--border)" }}
                      />
                      <span
                        className="text-sm"
                        style={{
                          color: feat.included ? "var(--muted)" : "var(--border)",
                          textDecoration: feat.included ? "none" : "line-through",
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
                      ? {
                          background: "linear-gradient(135deg, #7c3aed, #6d28d9)",
                          color: "white",
                        }
                      : {
                          background: "transparent",
                          color: "var(--text)",
                          border: "1px solid var(--border)",
                        }
                  }
                >
                  {plan.ctaLabel}
                </Link>
              </div>
            </FadeIn>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 text-sm font-medium transition-colors hover:text-white"
            style={{ color: "#a855f7" }}
          >
            View full pricing comparison
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
