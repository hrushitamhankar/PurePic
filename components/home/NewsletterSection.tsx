"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Send, CheckCircle2 } from "lucide-react";
import { FadeIn } from "@/components/animations/FadeIn";
import { newsletterSchema, type NewsletterFormData } from "@/utils/validation";
import newsletterService from "@/services/newsletter.service";
import { cn } from "@/lib/utils";

export function NewsletterSection() {
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NewsletterFormData>({
    resolver: zodResolver(newsletterSchema),
  });

  const onSubmit = async (data: NewsletterFormData) => {
    setIsLoading(true);
    try {
      await newsletterService.subscribe(data.email);
      setSubmitted(true);
    } catch {
      // fail silently for now — backend not connected
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse 60% 80% at 50% 50%, rgba(124,58,237,0.06) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute inset-0 border-y"
        style={{ borderColor: "var(--border)" }}
      />

      <div className="relative mx-auto max-w-2xl px-4 sm:px-6 text-center">
        <FadeIn>
          <p
            className="text-xs font-semibold uppercase tracking-widest mb-3"
            style={{ color: "#a855f7" }}
          >
            Stay in the loop
          </p>
          <h2
            className="text-3xl font-bold tracking-tight mb-4 sm:text-4xl"
            style={{ fontFamily: "var(--font-geist), system-ui, sans-serif", color: "var(--text)" }}
          >
            Get notified when new features ship
          </h2>
          <p className="text-base mb-8" style={{ color: "var(--muted)" }}>
            No spam. Just release notes and early access invites for Pro and Studio features.
          </p>

          {submitted ? (
            <div
              className="inline-flex items-center gap-2 rounded-xl border px-6 py-4 text-sm font-medium"
              style={{
                borderColor: "rgba(34,197,94,0.3)",
                background: "rgba(34,197,94,0.06)",
                color: "#22c55e",
              }}
            >
              <CheckCircle2 size={16} />
              You&apos;re on the list. We&apos;ll be in touch.
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <div className="flex-1">
                  <input
                    {...register("email")}
                    type="email"
                    placeholder="your@email.com"
                    className="w-full rounded-xl border px-4 py-3 text-sm outline-none transition-colors focus:border-purple-500"
                    style={{
                      borderColor: errors.email ? "#ef4444" : "var(--border)",
                      background: "var(--surface)",
                      color: "var(--text)",
                    }}
                    aria-label="Email address"
                    aria-invalid={!!errors.email}
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs text-left" style={{ color: "#ef4444" }}>
                      {errors.email.message}
                    </p>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    background: "linear-gradient(135deg, #7c3aed, #6d28d9)",
                    boxShadow: "0 0 20px rgba(124,58,237,0.25)",
                  }}
                >
                  <Send size={14} />
                  {isLoading ? "Subscribing..." : "Subscribe"}
                </button>
              </div>
            </form>
          )}
        </FadeIn>
      </div>
    </section>
  );
}
