"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Send, CheckCircle2 } from "lucide-react";
import { Github, Linkedin, Mail } from "@/components/shared/SocialIcons";

const socialLinks = [
  { label: "Email", value: "hello@purepic.app", href: "mailto:hello@purepic.app", IconComp: Mail },
  { label: "GitHub", value: "github.com/FOOX-BAT/PurePic", href: "https://github.com/FOOX-BAT/PurePic", IconComp: Github },
  { label: "LinkedIn", value: "linkedin.com/company/purepic", href: "#", IconComp: Linkedin },
];
import { FadeIn } from "@/components/animations/FadeIn";
import { contactSchema, type ContactFormData } from "@/utils/validation";
import contactService from "@/services/contact.service";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: { type: "general" },
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsLoading(true);
    try {
      await contactService.submit(data);
      setSubmitted(true);
    } catch {
      // placeholder
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass = "w-full rounded-xl border px-4 py-3 text-sm outline-none transition-all focus:border-purple-500 bg-transparent";
  const inputStyle = { borderColor: "var(--border)", color: "var(--text)" };

  return (
    <>
      <section className="pt-40 pb-20 text-center px-4" style={{ paddingTop: "140px" }}>
        <FadeIn>
          <span
            className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium tracking-wider uppercase mb-6"
            style={{ borderColor: "rgba(124,58,237,0.3)", background: "rgba(124,58,237,0.08)", color: "#a855f7" }}
          >
            Contact
          </span>
          <h1
            className="text-5xl font-bold tracking-tight sm:text-6xl mb-5"
            style={{ fontFamily: "var(--font-geist), system-ui, sans-serif", color: "var(--text)" }}
          >
            Get in touch
          </h1>
          <p className="text-lg max-w-xl mx-auto" style={{ color: "var(--muted)" }}>
            Questions about PurePic, enterprise pricing, partnerships, or anything else — we&apos;re here.
          </p>
        </FadeIn>
      </section>

      <section className="pb-32">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Info */}
            <FadeIn className="space-y-6">
              <div>
                <h2 className="font-semibold text-base mb-4" style={{ color: "var(--text)" }}>
                  Contact channels
                </h2>
                <div className="space-y-3">
                  {socialLinks.map((c) => (
                    <a
                      key={c.label}
                      href={c.href}
                      target={c.href.startsWith("http") ? "_blank" : undefined}
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 rounded-xl border p-4 transition-colors hover:border-purple-500/30 group"
                      style={{ borderColor: "var(--border)", background: "var(--surface)" }}
                    >
                      <span style={{ color: "#a855f7" }}>
                        <c.IconComp size={16} />
                      </span>
                      <div>
                        <p className="text-xs" style={{ color: "var(--muted)" }}>{c.label}</p>
                        <p className="text-sm font-medium" style={{ color: "var(--text)" }}>{c.value}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              <div
                className="rounded-xl border p-5"
                style={{ borderColor: "rgba(124,58,237,0.2)", background: "rgba(124,58,237,0.04)" }}
              >
                <p className="text-sm font-medium mb-1" style={{ color: "var(--text)" }}>Response time</p>
                <p className="text-sm" style={{ color: "var(--muted)" }}>
                  We typically respond within 24–48 hours on business days.
                </p>
              </div>
            </FadeIn>

            {/* Form */}
            <FadeIn delay={0.1} className="lg:col-span-2">
              <div
                className="rounded-2xl border p-8"
                style={{ borderColor: "var(--border)", background: "var(--surface)" }}
              >
                {submitted ? (
                  <div className="text-center py-12">
                    <CheckCircle2 size={48} className="mx-auto mb-4" style={{ color: "#22c55e" }} />
                    <h3 className="font-semibold text-lg mb-2" style={{ color: "var(--text)" }}>
                      Message sent
                    </h3>
                    <p className="text-sm" style={{ color: "var(--muted)" }}>
                      We&apos;ll get back to you within 24–48 hours.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: "var(--text)" }}>
                          Name <span style={{ color: "#ef4444" }}>*</span>
                        </label>
                        <input
                          {...register("name")}
                          className={inputClass}
                          style={{ ...inputStyle, borderColor: errors.name ? "#ef4444" : "var(--border)" }}
                          placeholder="Your name"
                        />
                        {errors.name && <p className="mt-1 text-xs" style={{ color: "#ef4444" }}>{errors.name.message}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: "var(--text)" }}>
                          Email <span style={{ color: "#ef4444" }}>*</span>
                        </label>
                        <input
                          {...register("email")}
                          type="email"
                          className={inputClass}
                          style={{ ...inputStyle, borderColor: errors.email ? "#ef4444" : "var(--border)" }}
                          placeholder="you@example.com"
                        />
                        {errors.email && <p className="mt-1 text-xs" style={{ color: "#ef4444" }}>{errors.email.message}</p>}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: "var(--text)" }}>
                        Inquiry type
                      </label>
                      <select
                        {...register("type")}
                        className={inputClass}
                        style={inputStyle}
                      >
                        <option value="general">General</option>
                        <option value="sales">Sales / Enterprise</option>
                        <option value="support">Support</option>
                        <option value="partnership">Partnership</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: "var(--text)" }}>
                        Subject <span style={{ color: "#ef4444" }}>*</span>
                      </label>
                      <input
                        {...register("subject")}
                        className={inputClass}
                        style={{ ...inputStyle, borderColor: errors.subject ? "#ef4444" : "var(--border)" }}
                        placeholder="What is this about?"
                      />
                      {errors.subject && <p className="mt-1 text-xs" style={{ color: "#ef4444" }}>{errors.subject.message}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: "var(--text)" }}>
                        Message <span style={{ color: "#ef4444" }}>*</span>
                      </label>
                      <textarea
                        {...register("message")}
                        rows={5}
                        className={inputClass}
                        style={{ ...inputStyle, borderColor: errors.message ? "#ef4444" : "var(--border)", resize: "vertical" }}
                        placeholder="Tell us more..."
                      />
                      {errors.message && <p className="mt-1 text-xs" style={{ color: "#ef4444" }}>{errors.message.message}</p>}
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:scale-105 disabled:opacity-50"
                      style={{ background: "linear-gradient(135deg, #7c3aed, #6d28d9)" }}
                    >
                      <Send size={14} />
                      {isLoading ? "Sending..." : "Send Message"}
                    </button>
                  </form>
                )}
              </div>
            </FadeIn>
          </div>
        </div>
      </section>
    </>
  );
}
