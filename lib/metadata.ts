import type { Metadata } from "next";

const siteConfig = {
  name: "PurePic",
  description:
    "AI-Powered Photography Intelligence. Intelligent culling, aesthetic analysis, semantic editing, and batch processing for professional photographers.",
  url: "https://purepic.app",
  ogImage: "/og-image.png",
};

interface GenerateMetadataOptions {
  title: string;
  description?: string;
  image?: string;
  noIndex?: boolean;
  path?: string;
}

export function generatePageMetadata({
  title,
  description,
  image,
  noIndex,
  path = "",
}: GenerateMetadataOptions): Metadata {
  const pageDescription = description ?? siteConfig.description;
  const pageImage = image ?? siteConfig.ogImage;
  const pageUrl = `${siteConfig.url}${path}`;

  return {
    title,
    description: pageDescription,
    openGraph: {
      title: `${title} | ${siteConfig.name}`,
      description: pageDescription,
      url: pageUrl,
      siteName: siteConfig.name,
      images: [{ url: pageImage, width: 1200, height: 630, alt: title }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${siteConfig.name}`,
      description: pageDescription,
      images: [pageImage],
    },
    ...(noIndex && { robots: { index: false, follow: false } }),
  };
}

export { siteConfig };
