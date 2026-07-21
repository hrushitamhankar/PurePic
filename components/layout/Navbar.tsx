"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Download, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { mainNavItems } from "@/constants/navigation";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 16);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          isScrolled
            ? "glass border-b py-3"
            : "bg-transparent border-b border-transparent py-5"
        )}
        style={isScrolled ? { borderBottomColor: "var(--border)" } : {}}
      >
        <nav
          className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"
          aria-label="Main navigation"
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div
              className="h-8 w-8 rounded-lg flex items-center justify-center font-bold text-sm text-white"
              style={{
                background: "linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)",
              }}
            >
              P
            </div>
            <span
              className="font-semibold text-lg tracking-tight"
              style={{
                fontFamily: "var(--font-geist), system-ui, sans-serif",
                color: "var(--text)",
              }}
            >
              PurePic
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {mainNavItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative px-3 py-2 text-sm font-medium rounded-md transition-colors",
                    isActive
                      ? "text-white"
                      : "hover:text-white"
                  )}
                  style={{
                    color: isActive ? "var(--text)" : "var(--muted)",
                  }}
                >
                  {item.label}
                  {isActive && (
                    <motion.div
                      className="absolute inset-0 rounded-md"
                      style={{ background: "rgba(124,58,237,0.1)" }}
                      layoutId="nav-active"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-medium px-3 py-2 rounded-md transition-colors"
              style={{ color: "var(--muted)" }}
            >
              Sign In
            </Link>
            <Link
              href="/download"
              className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:scale-105"
              style={{
                background: "linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)",
                boxShadow: "0 0 20px rgba(124,58,237,0.25)",
              }}
            >
              <Download size={14} />
              Download
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-md transition-colors"
            style={{ color: "var(--muted)" }}
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            aria-label="Toggle menu"
            aria-expanded={isMobileOpen}
          >
            {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </nav>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 top-0 z-40 md:hidden"
            style={{ paddingTop: "72px" }}
          >
            <div
              className="absolute inset-0"
              style={{ background: "var(--background)", opacity: 0.98 }}
              onClick={() => setIsMobileOpen(false)}
            />
            <div className="relative z-10 px-4 py-6 space-y-1">
              {mainNavItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-colors"
                    style={{
                      color: isActive ? "var(--text)" : "var(--muted)",
                      background: isActive ? "rgba(124,58,237,0.1)" : "transparent",
                    }}
                  >
                    {item.label}
                    <ChevronRight size={14} style={{ color: "var(--border)" }} />
                  </Link>
                );
              })}
              <div className="pt-4 space-y-2 border-t" style={{ borderColor: "var(--border)" }}>
                <Link
                  href="/login"
                  className="block w-full text-center px-4 py-3 rounded-lg text-sm font-medium border transition-colors"
                  style={{
                    borderColor: "var(--border)",
                    color: "var(--muted)",
                  }}
                >
                  Sign In
                </Link>
                <Link
                  href="/download"
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-lg text-sm font-medium text-white"
                  style={{
                    background: "linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)",
                  }}
                >
                  <Download size={14} />
                  Download Free
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
