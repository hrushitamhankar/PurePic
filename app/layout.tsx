import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { ThemeProvider } from "@/features/theme/ThemeProvider";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://purepic.app"),
  title: {
    default: "PurePic — AI-Powered Photography Intelligence",
    template: "%s | PurePic",
  },
  description:
    "PurePic is an AI platform that understands photographs before editing them. Intelligent culling, aesthetic analysis, semantic editing, and batch processing for professional photographers.",
  keywords: [
    "AI photo editor",
    "photo culling",
    "photography AI",
    "image sorting",
    "aesthetic analysis",
    "batch photo editing",
    "RAW photo editing",
    "photography software",
    "PurePic",
  ],
  authors: [{ name: "PurePic" }],
  creator: "PurePic",
  publisher: "PurePic",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://purepic.app",
    siteName: "PurePic",
    title: "PurePic — AI-Powered Photography Intelligence",
    description:
      "The AI platform that understands photographs before editing them. Built for professional photographers.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "PurePic — AI-Powered Photography Intelligence",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PurePic — AI-Powered Photography Intelligence",
    description:
      "The AI platform that understands photographs before editing them.",
    images: ["/og-image.png"],
    creator: "@purepic",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
    { media: "(prefers-color-scheme: light)", color: "#09090b" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable} ${inter.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body className="font-sans antialiased" style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
