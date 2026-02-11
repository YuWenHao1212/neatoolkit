"use client";

import { Link } from "@/i18n/navigation";
import LucideIcon from "@/components/home/LucideIcon";

interface ToolCardProps {
  href: string;
  icon: string;
  title: string;
  description: string;
  iconColorClass: string;
  iconBgClass: string;
}

export default function ToolCard({
  href,
  icon,
  title,
  description,
  iconColorClass,
  iconBgClass,
}: ToolCardProps) {
  return (
    <Link
      href={href}
      className="group flex cursor-pointer items-center gap-4 rounded-xl border border-border bg-white p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-ink-900/10 hover:shadow-md"
    >
      <span
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconBgClass}`}
      >
        <LucideIcon
          name={icon}
          size={20}
          strokeWidth={1.8}
          className={iconColorClass}
        />
      </span>
      <div className="min-w-0 flex-1">
        <h3 className="text-base font-semibold leading-snug text-ink-900">
          {title}
        </h3>
        <p className="mt-1 text-[15px] leading-relaxed text-ink-600">
          {description}
        </p>
      </div>
      <span className="shrink-0 text-ink-600/40 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-ink-600">
        <LucideIcon name="ArrowRight" size={16} strokeWidth={1.8} />
      </span>
    </Link>
  );
}
