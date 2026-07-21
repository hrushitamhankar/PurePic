"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { loginSchema, type LoginFormData } from "@/utils/validation";
import authService from "@/services/auth.service";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError(null);
    try {
      await authService.login(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
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
        Welcome back
      </h1>
      <p className="text-sm mb-8" style={{ color: "var(--muted)" }}>
        Sign in to your PurePic account
      </p>

      {error && (
        <div
          className="mb-4 rounded-xl border px-4 py-3 text-sm"
          style={{ borderColor: "rgba(239,68,68,0.3)", background: "rgba(239,68,68,0.06)", color: "#ef4444" }}
        >
          {error}
        </div>
      )}

      {/* Coming soon notice */}
      <div
        className="mb-6 rounded-xl border px-4 py-3 text-sm"
        style={{ borderColor: "rgba(124,58,237,0.3)", background: "rgba(124,58,237,0.06)", color: "#a855f7" }}
      >
        Authentication is coming soon. The backend is under development.
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
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
              placeholder="••••••••"
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2"
              style={{ color: "var(--muted)" }}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.password && <p className="mt-1 text-xs" style={{ color: "#ef4444" }}>{errors.password.message}</p>}
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: "var(--muted)" }}>
            <input {...register("rememberMe")} type="checkbox" className="rounded" />
            Remember me
          </label>
          <Link href="#" className="text-sm transition-colors hover:text-white" style={{ color: "#a855f7" }}>
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-white transition-all duration-200 hover:scale-105 disabled:opacity-50 mt-2"
          style={{ background: "linear-gradient(135deg, #7c3aed, #6d28d9)" }}
        >
          <LogIn size={14} />
          {isLoading ? "Signing in..." : "Sign In"}
        </button>
      </form>

      <div className="mt-6 text-center text-sm" style={{ color: "var(--muted)" }}>
        Don&apos;t have an account?{" "}
        <Link href="/register" className="font-medium transition-colors hover:text-white" style={{ color: "#a855f7" }}>
          Create one
        </Link>
      </div>
    </div>
  );
}
