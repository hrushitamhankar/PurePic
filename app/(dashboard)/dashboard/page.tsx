import { LayoutDashboard, Lock } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div
        className="inline-flex h-16 w-16 items-center justify-center rounded-2xl mb-6"
        style={{ background: "rgba(124,58,237,0.1)" }}
      >
        <Lock size={28} style={{ color: "#a855f7" }} />
      </div>
      <h1
        className="text-3xl font-bold mb-3"
        style={{ fontFamily: "var(--font-geist), system-ui, sans-serif", color: "var(--text)" }}
      >
        Dashboard Coming Soon
      </h1>
      <p className="text-base max-w-md mb-8" style={{ color: "var(--muted)" }}>
        The user dashboard is currently under development. This is where you will manage your license, view usage, and configure your account.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white"
        style={{ background: "linear-gradient(135deg, #7c3aed, #6d28d9)" }}
      >
        Back to Home
      </Link>
    </div>
  );
}
