"use client";

import { Link } from "@/i18n/navigation";
import LucideIcon from "@/components/home/LucideIcon";

interface CategoryCardProps {
  href: string;
  icon: string;
  title: string;
  toolCount: string;
  description: string;
  colorClass: string;
  featuredLabel: string;
  featuredTool: string;
}

export default function CategoryCard({
  href,
  icon,
  title,
  toolCount,
  description,
  colorClass,
  featuredLabel,
  featuredTool,
}: CategoryCardProps) {
  return (
    <Link
      href={href}
      className={`group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl text-white transition-all duration-200 hover:-translate-y-1 hover:shadow-lg ${colorClass}`}
    >
      {/* Main content */}
      <div className="flex min-h-[160px] flex-1 flex-col justify-between p-6">
        <div className="flex items-start justify-between">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/20">
            <LucideIcon name={icon} size={22} strokeWidth={1.8} />
          </span>
          <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-medium">
            {toolCount}
          </span>
        </div>
        <div className="mt-auto flex items-end justify-between">
          <div>
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="mt-0.5 line-clamp-1 text-sm text-white/75">{description}</p>
          </div>
          <span className="mb-0.5 shrink-0 text-white/60 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-white">
            <LucideIcon name="ArrowRight" size={18} strokeWidth={1.8} />
          </span>
        </div>
      </div>

      {/* Featured tool label */}
      <div className="flex items-center gap-2 bg-white/10 px-6 py-3 text-xs backdrop-blur-sm">
        <span className="text-white/60">{featuredLabel}</span>
        <span className="font-medium text-white">{featuredTool}</span>
      </div>
    </Link>
  );
}
