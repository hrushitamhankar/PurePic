import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const docNav = [
  {
    group: "Getting Started",
    items: [
      { label: "Overview", href: "/docs" },
      { label: "Installation", href: "/docs/installation" },
      { label: "Quick Start", href: "/docs/quick-start" },
    ],
  },
  {
    group: "Using PurePic",
    items: [
      { label: "Import Images", href: "/docs/import-images" },
      { label: "Image Sorting", href: "/docs/image-sorting" },
      { label: "Editing", href: "/docs/editing" },
      { label: "Exporting", href: "/docs/exporting" },
    ],
  },
  {
    group: "Reference",
    items: [
      { label: "API Reference", href: "/docs/api-reference" },
    ],
  },
];

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-20" style={{ paddingTop: "80px" }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex gap-10 py-12">
            {/* Sidebar */}
            <aside className="hidden lg:block w-56 flex-shrink-0 sticky top-24 self-start">
              <div className="space-y-6">
                {docNav.map((group) => (
                  <div key={group.group}>
                    <p
                      className="text-xs font-semibold uppercase tracking-widest mb-2"
                      style={{ color: "var(--muted)" }}
                    >
                      {group.group}
                    </p>
                    <ul className="space-y-1">
                      {group.items.map((item) => (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            className="block px-3 py-1.5 text-sm rounded-lg transition-colors hover:text-white"
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
            </aside>

            {/* Content */}
            <main className="flex-1 min-w-0">{children}</main>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
