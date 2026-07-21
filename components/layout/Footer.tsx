import Link from "next/link";
import { Github, Twitter, Linkedin, Mail } from "@/components/shared/SocialIcons";
// Social icons via custom SVG components (lucide-react v1.x removed brand icons)
import { footerNavGroups } from "@/constants/navigation";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="border-t"
      style={{ borderColor: "var(--border)", background: "var(--background)" }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Top section */}
        <div className="py-16 grid grid-cols-1 gap-12 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2.5 mb-4">
              <div
                className="h-9 w-9 rounded-xl flex items-center justify-center font-bold text-base text-white"
                style={{
                  background: "linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)",
                }}
              >
                P
              </div>
              <span
                className="font-semibold text-xl tracking-tight"
                style={{
                  fontFamily: "var(--font-geist), system-ui, sans-serif",
                  color: "var(--text)",
                }}
              >
                PurePic
              </span>
            </Link>
            <p
              className="text-sm leading-relaxed max-w-xs"
              style={{ color: "var(--muted)" }}
            >
              The AI platform that understands photographs before editing them.
              Built for professional photographers who demand more.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <SocialLink href="#" label="GitHub" icon={<Github size={16} />} />
              <SocialLink href="#" label="Twitter" icon={<Twitter size={16} />} />
              <SocialLink href="#" label="LinkedIn" icon={<Linkedin size={16} />} />
              <SocialLink href="mailto:hello@purepic.app" label="Email" icon={<Mail size={16} />} />
            </div>
          </div>

          {/* Nav groups */}
          <div className="lg:col-span-3 grid grid-cols-2 gap-8 sm:grid-cols-3">
            {footerNavGroups.map((group) => (
              <div key={group.label}>
                <h3
                  className="text-xs font-semibold uppercase tracking-widest mb-4"
                  style={{ color: "var(--text)" }}
                >
                  {group.label}
                </h3>
                <ul className="space-y-2.5">
                  {group.items.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="text-sm transition-colors hover:text-white"
                        style={{ color: "var(--muted)" }}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom section */}
        <div
          className="py-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t"
          style={{ borderColor: "var(--border)" }}
        >
          <p className="text-xs" style={{ color: "var(--muted)" }}>
            © {currentYear} PurePic. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="/legal/privacy"
              className="text-xs transition-colors hover:text-white"
              style={{ color: "var(--muted)" }}
            >
              Privacy Policy
            </Link>
            <Link
              href="/legal/terms"
              className="text-xs transition-colors hover:text-white"
              style={{ color: "var(--muted)" }}
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialLink({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <a
      href={href}
      aria-label={label}
      className="flex h-8 w-8 items-center justify-center rounded-lg border transition-all duration-200 hover:border-purple-500/50 hover:text-white hover:bg-purple-500/10"
      style={{ borderColor: "var(--border)", color: "var(--muted)" }}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
    >
      {icon}
    </a>
  );
}
