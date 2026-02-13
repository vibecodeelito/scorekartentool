import type { MetadataRoute } from "next";

const locales = ["de", "fr", "en", "it"];
const baseUrl = "https://scorekarte.ch";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = locales.map((locale) => ({
    url: `${baseUrl}/${locale}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 1.0,
    alternates: {
      languages: Object.fromEntries(
        locales.map((l) => [l, `${baseUrl}/${l}`])
      ),
    },
  }));

  return routes;
}
