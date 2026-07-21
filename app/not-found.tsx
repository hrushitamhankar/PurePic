import Link from "next/link";

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center text-center px-4 relative"
      style={{ background: "var(--background)" }}
    >
      <div className="absolute inset-0 bg-grid opacity-30" />
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 h-80 w-80 rounded-full blur-3xl opacity-10"
        style={{ background: "#7c3aed" }}
      />

      <div className="relative z-10">
        <div
          className="text-8xl font-bold mb-4 sm:text-9xl"
          style={{
            fontFamily: "var(--font-geist), system-ui, sans-serif",
            background: "linear-gradient(135deg, #7c3aed, #a855f7, #3b82f6)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          404
        </div>
        <h1
          className="text-2xl font-bold mb-3 sm:text-3xl"
          style={{ color: "var(--text)" }}
        >
          Page not found
        </h1>
        <p className="text-base mb-8 max-w-sm mx-auto" style={{ color: "var(--muted)" }}>
          The page you are looking for does not exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="rounded-xl px-6 py-3 text-sm font-semibold text-white transition-all hover:scale-105"
            style={{ background: "linear-gradient(135deg, #7c3aed, #6d28d9)" }}
          >
            Go Home
          </Link>
          <Link
            href="/docs"
            className="rounded-xl px-6 py-3 text-sm font-medium border transition-colors"
            style={{ borderColor: "var(--border)", color: "var(--muted)" }}
          >
            View Docs
          </Link>
        </div>
      </div>
    </div>
  );
}
