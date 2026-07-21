"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, UserPlus } from "lucide-react";
import { registerSchema, type RegisterFormData } from "@/utils/validation";
import authService from "@/services/auth.service";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({ resolver: zodResolver(registerSchema) });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    setError(null);
    try {
      await authService.register(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass = "w-full rounded-xl border px-4 py-3 text-sm outline-none transition-all focus:border-purple-500 bg-transparent";

  return (
    <div
      className="rounded-2xl border p-8"
      style={{ borderColor: "var(--border)", background: "var(--surface)" }}
    >
      <h1
        className="text-2xl font-bold mb-2"
        style={{ fontFamily: "var(--font-geist), system-ui, sans-serif", color: "var(--text)" }}
      >
        Create account
      </h1>
      <p className="text-sm mb-8" style={{ color: "var(--muted)" }}>
        Start with the free plan. No credit card required.
      </p>

      {error && (
        <div
          className="mb-4 rounded-xl border px-4 py-3 text-sm"
          style={{ borderColor: "rgba(239,68,68,0.3)", background: "rgba(239,68,68,0.06)", color: "#ef4444" }}
        >
          {error}
        </div>
      )}

      <div
        className="mb-6 rounded-xl border px-4 py-3 text-sm"
        style={{ borderColor: "rgba(124,58,237,0.3)", background: "rgba(124,58,237,0.06)", color: "#a855f7" }}
      >
        Registration is coming soon. The backend is under development.
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: "var(--text)" }}>Full name</label>
          <input
            {...register("name")}
            className={inputClass}
            style={{ borderColor: errors.name ? "#ef4444" : "var(--border)", color: "var(--text)" }}
            placeholder="Your name"
            autoComplete="name"
          />
          {errors.name && <p className="mt-1 text-xs" style={{ color: "#ef4444" }}>{errors.name.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: "var(--text)" }}>Email</label>
          <input
            {...register("email")}
            type="email"
            className={inputClass}
            style={{ borderColor: errors.email ? "#ef4444" : "var(--border)", color: "var(--text)" }}
            placeholder="you@example.com"
            autoComplete="email"
          />
          {errors.email && <p className="mt-1 text-xs" style={{ color: "#ef4444" }}>{errors.email.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: "var(--text)" }}>Password</label>
          <div className="relative">
            <input
              {...register("password")}
              type={showPassword ? "text" : "password"}
              className={inputClass}
              style={{ borderColor: errors.password ? "#ef4444" : "var(--border)", color: "var(--text)", paddingRight: "2.75rem" }}
              placeholder="Min. 8 characters"
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2"
              style={{ color: "var(--muted)" }}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.password && <p className="mt-1 text-xs" style={{ color: "#ef4444" }}>{errors.password.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: "var(--text)" }}>Confirm password</label>
          <input
            {...register("confirmPassword")}
            type="password"
            className={inputClass}
            style={{ borderColor: errors.confirmPassword ? "#ef4444" : "var(--border)", color: "var(--text)" }}
            placeholder="Repeat password"
            autoComplete="new-password"
          />
          {errors.confirmPassword && <p className="mt-1 text-xs" style={{ color: "#ef4444" }}>{errors.confirmPassword.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-white transition-all duration-200 hover:scale-105 disabled:opacity-50 mt-2"
          style={{ background: "linear-gradient(135deg, #7c3aed, #6d28d9)" }}
        >
          <UserPlus size={14} />
          {isLoading ? "Creating account..." : "Create Account"}
        </button>
      </form>

      <div className="mt-6 text-center text-sm" style={{ color: "var(--muted)" }}>
        Already have an account?{" "}
        <Link href="/login" className="font-medium transition-colors hover:text-white" style={{ color: "#a855f7" }}>
          Sign in
        </Link>
      </div>

      <p className="mt-4 text-xs text-center" style={{ color: "var(--muted)" }}>
        By creating an account you agree to our{" "}
        <Link href="/legal/terms" className="underline" style={{ color: "#a855f7" }}>Terms</Link>
        {" "}and{" "}
        <Link href="/legal/privacy" className="underline" style={{ color: "#a855f7" }}>Privacy Policy</Link>.
      </p>
    </div>
  );
}
