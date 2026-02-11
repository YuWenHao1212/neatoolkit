import type { MetadataRoute } from "next";
import { toolCategories } from "@/lib/tools";

const BASE_URL = "https://neatoolkit.com";
const LOCALES = ["zh-TW", "en"] as const;
const DEFAULT_LOCALE = "zh-TW";

function buildUrl(locale: string, page: string): string {
  return `${BASE_URL}/${locale}${page === "/" ? "" : page}`;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const toolPages = toolCategories.flatMap((category) =>
    category.tools.map((tool) => tool.href),
  );

  const staticPages = ["/", "/about", "/privacy", "/terms"];
  const allPages = [...staticPages, ...toolPages];

  return allPages.map((page) => ({
    url: buildUrl(DEFAULT_LOCALE, page),
    lastModified: new Date(),
    changeFrequency: page === "/" ? ("weekly" as const) : ("monthly" as const),
    priority: page === "/" ? 1.0 : 0.7,
    alternates: {
      languages: Object.fromEntries([
        ["x-default", buildUrl(DEFAULT_LOCALE, page)],
        ...LOCALES.map((locale) => [locale, buildUrl(locale, page)]),
      ]),
    },
  }));
}
