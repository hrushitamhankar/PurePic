"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Download, Play, ArrowRight, Sparkles } from "lucide-react";
import { GradientText } from "@/components/shared/GradientText";

export function HeroSection() {
  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ paddingTop: "80px" }}
    >
      {/* Background grid */}
      <div className="absolute inset-0 bg-grid opacity-50" />

      {/* Glow orbs */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 h-96 w-96 rounded-full blur-3xl opacity-20"
        style={{ background: "radial-gradient(circle, #7c3aed, transparent)" }}
      />
      <div
        className="absolute top-1/3 left-1/3 h-64 w-64 rounded-full blur-3xl opacity-10"
        style={{ background: "radial-gradient(circle, #3b82f6, transparent)" }}
      />

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8 inline-flex"
        >
          <span
            className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-medium"
            style={{
              borderColor: "rgba(124,58,237,0.3)",
              background: "rgba(124,58,237,0.08)",
              color: "#a855f7",
            }}
          >
            <Sparkles size={12} />
            Now in Beta — Download Free
            <ArrowRight size={12} />
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl leading-none mb-6"
          style={{ fontFamily: "var(--font-geist), system-ui, sans-serif" }}
        >
          Photography that
          <br />
          <GradientText>thinks before</GradientText>
          <br />
          it edits.
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="mx-auto mb-10 max-w-2xl text-lg sm:text-xl leading-relaxed"
          style={{ color: "var(--muted)" }}
        >
          PurePic is an AI platform that deeply analyzes every photograph before
          making any editing decision. Intelligent culling. Aesthetic scoring.
          Semantic editing. Built for professionals.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.48 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/download"
            className="inline-flex items-center gap-2.5 rounded-xl px-7 py-3.5 text-base font-semibold text-white transition-all duration-200 hover:scale-105 active:scale-100"
            style={{
              background: "linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)",
              boxShadow: "0 0 40px rgba(124,58,237,0.3), 0 4px 20px rgba(0,0,0,0.3)",
            }}
          >
            <Download size={18} />
            Download Free
          </Link>
          <button
            className="inline-flex items-center gap-2.5 rounded-xl px-7 py-3.5 text-base font-medium border transition-all duration-200 hover:border-purple-500/40"
            style={{
              borderColor: "var(--border)",
              color: "var(--muted)",
            }}
          >
            <div
              className="h-5 w-5 rounded-full flex items-center justify-center"
              style={{ background: "rgba(124,58,237,0.2)" }}
            >
              <Play size={9} className="translate-x-px" style={{ color: "#a855f7" }} />
            </div>
            Watch Demo
          </button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto"
        >
          {[
            { value: "10×", label: "Faster culling" },
            { value: "100%", label: "Offline & private" },
            { value: "12+", label: "RAW formats" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div
                className="text-2xl sm:text-3xl font-bold mb-1"
                style={{
                  fontFamily: "var(--font-geist), system-ui, sans-serif",
                  color: "var(--text)",
                }}
              >
                {stat.value}
              </div>
              <div className="text-xs sm:text-sm" style={{ color: "var(--muted)" }}>
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>

        {/* App mockup */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="mt-20 relative mx-auto max-w-5xl"
        >
          <div
            className="relative rounded-2xl border overflow-hidden"
            style={{
              borderColor: "var(--border)",
              background: "var(--surface)",
              boxShadow: "0 40px 80px rgba(0,0,0,0.5), 0 0 80px rgba(124,58,237,0.08)",
            }}
          >
            {/* Fake window chrome */}
            <div
              className="flex items-center gap-2 px-4 py-3 border-b"
              style={{ borderColor: "var(--border)" }}
            >
              <div className="h-3 w-3 rounded-full bg-red-500/60" />
              <div className="h-3 w-3 rounded-full bg-yellow-500/60" />
              <div className="h-3 w-3 rounded-full bg-green-500/60" />
              <div
                className="ml-4 flex-1 h-5 rounded-md max-w-xs mx-auto"
                style={{ background: "var(--border)" }}
              />
            </div>
            {/* App preview placeholder */}
            <div
              className="aspect-video flex items-center justify-center relative"
              style={{ background: "var(--background)" }}
            >
              {/* Grid overlay */}
              <div className="absolute inset-0 bg-grid opacity-30" />
              <div className="relative z-10 grid grid-cols-4 gap-3 p-8 w-full">
                {Array.from({ length: 8 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="aspect-square rounded-lg overflow-hidden"
                    style={{ background: "var(--surface)" }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 + i * 0.05 }}
                  >
                    <div
                      className="h-full w-full flex flex-col items-center justify-end p-2"
                      style={{
                        background: `linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.7) 100%)`,
                      }}
                    >
                      <div
                        className="h-1 w-full rounded-full mb-1"
                        style={{
                          background: i < 3
                            ? "#22c55e"
                            : i < 5
                            ? "#7c3aed"
                            : i < 7
                            ? "#eab308"
                            : "#ef4444",
                          width: `${60 + Math.random() * 40}%`,
                        }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
              {/* Score overlay */}
              <div
                className="absolute bottom-4 right-4 rounded-lg border p-3 text-left"
                style={{
                  borderColor: "rgba(124,58,237,0.3)",
                  background: "rgba(124,58,237,0.1)",
                  backdropFilter: "blur(8px)",
                }}
              >
                <div className="text-xs font-medium mb-2" style={{ color: "#a855f7" }}>
                  AI Analysis
                </div>
                {[
                  { label: "Technical", val: 87 },
                  { label: "Aesthetic", val: 72 },
                  { label: "Moment", val: 91 },
                ].map((s) => (
                  <div key={s.label} className="flex items-center gap-2 text-xs mb-1">
                    <span style={{ color: "var(--muted)", width: 60 }}>{s.label}</span>
                    <div
                      className="h-1 rounded-full"
                      style={{
                        width: 60,
                        background: "var(--border)",
                      }}
                    >
                      <motion.div
                        className="h-1 rounded-full"
                        style={{ background: "#7c3aed" }}
                        initial={{ width: 0 }}
                        animate={{ width: `${s.val}%` }}
                        transition={{ delay: 1.2, duration: 0.8 }}
                      />
                    </div>
                    <span style={{ color: "var(--text)" }}>{s.val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Glow below mockup */}
          <div
            className="absolute -bottom-8 left-1/2 -translate-x-1/2 h-16 w-3/4 blur-2xl opacity-30 rounded-full"
            style={{ background: "#7c3aed" }}
          />
        </motion.div>
      </div>
    </section>
  );
}
