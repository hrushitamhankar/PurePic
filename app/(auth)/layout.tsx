import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-16 relative"
      style={{ background: "var(--background)" }}
    >
      {/* Background */}
      <div className="absolute inset-0 bg-grid opacity-30" />
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 h-80 w-80 rounded-full blur-3xl opacity-10"
        style={{ background: "#7c3aed" }}
      />

      {/* Logo */}
      <Link href="/" className="relative z-10 flex items-center gap-2.5 mb-8">
        <div
          className="h-9 w-9 rounded-xl flex items-center justify-center font-bold text-base text-white"
          style={{ background: "linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)" }}
        >
          P
        </div>
        <span
          className="font-semibold text-xl tracking-tight"
          style={{ fontFamily: "var(--font-geist), system-ui, sans-serif", color: "var(--text)" }}
        >
          PurePic
        </span>
      </Link>

      <div className="relative z-10 w-full max-w-md">{children}</div>
    </div>
  );
}
