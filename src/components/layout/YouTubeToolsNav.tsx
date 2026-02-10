"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";

const YOUTUBE_TOOLS = [
  { href: "/youtube/subtitle", key: "subtitle" },
  { href: "/youtube/summary", key: "summary" },
  { href: "/youtube/translate", key: "translate" },
] as const;

export default function YouTubeToolsNav() {
  const t = useTranslations("YouTubeToolsNav");
  const pathname = usePathname();

  return (
    <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1600px]">
      <nav className="flex gap-0 border-b border-border">
        {YOUTUBE_TOOLS.map(({ href, key }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={key}
              href={href}
              className={
                isActive
                  ? "border-b-2 border-accent px-4 py-3 text-base font-semibold text-ink-900"
                  : "border-b-2 border-transparent px-4 py-3 text-base text-ink-500 hover:text-ink-700"
              }
            >
              {t(key)}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
