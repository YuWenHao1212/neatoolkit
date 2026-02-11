import type { MetadataRoute } from "next";
import { toolCategories } from "@/lib/tools";

const BASE_URL = "https://neatoolkit.com";
const LOCALES = ["zh-TW", "en"];

export default function sitemap(): MetadataRoute.Sitemap {
  const toolPages = toolCategories.flatMap((category) =>
    category.tools.map((tool) => tool.href)
  );

  const staticPages = ["/", "/about", "/privacy", "/terms"];
  const allPages = [...staticPages, ...toolPages];

  return allPages.flatMap((page) =>
    LOCALES.map((locale) => ({
      url: `${BASE_URL}/${locale}${page === "/" ? "" : page}`,
      lastModified: new Date(),
      changeFrequency: page === "/" ? "weekly" as const : "monthly" as const,
      priority: page === "/" ? 1.0 : 0.7,
    }))
  );
}
