import Link from "next/link";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen" style={{ background: "var(--background)" }}>
      {/* Dashboard nav placeholder */}
      <nav
        className="border-b px-6 py-4 flex items-center justify-between"
        style={{ borderColor: "var(--border)", background: "var(--surface)" }}
      >
        <Link href="/" className="flex items-center gap-2.5">
          <div
            className="h-8 w-8 rounded-lg flex items-center justify-center font-bold text-sm text-white"
            style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)" }}
          >
            P
          </div>
          <span
            className="font-semibold text-base"
            style={{ fontFamily: "var(--font-geist), system-ui, sans-serif", color: "var(--text)" }}
          >
            PurePic
          </span>
        </Link>
        <span className="text-xs px-2 py-1 rounded-md" style={{ background: "rgba(124,58,237,0.1)", color: "#a855f7" }}>
          Dashboard Preview
        </span>
      </nav>
      <main className="p-6">{children}</main>
    </div>
  );
}
