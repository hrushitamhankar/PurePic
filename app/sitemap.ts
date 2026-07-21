import type { MetadataRoute } from "next";

const baseUrl = "https://purepic.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/features",
    "/download",
    "/pricing",
    "/roadmap",
    "/about",
    "/contact",
    "/faq",
    "/blog",
    "/docs",
    "/docs/installation",
    "/docs/quick-start",
    "/docs/import-images",
    "/docs/image-sorting",
    "/docs/editing",
    "/docs/exporting",
    "/docs/api-reference",
    "/legal/privacy",
    "/legal/terms",
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.8,
  }));
}
