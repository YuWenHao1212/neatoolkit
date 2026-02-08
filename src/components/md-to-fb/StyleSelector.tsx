"use client";

import { type StyleName } from "@/lib/symbol-configs";

type StyleSelectorProps = {
  readonly activeStyle: StyleName;
  readonly onStyleChange: (style: StyleName) => void;
  readonly panguEnabled: boolean;
  readonly onPanguToggle: () => void;
};

const STYLE_OPTIONS: { value: StyleName; label: string }[] = [
  { value: "minimal", label: "\u6975\u7C21" },
  { value: "structured", label: "\u7D50\u69CB" },
  { value: "social", label: "\u793E\u7FA4" },
];

export default function StyleSelector({
  activeStyle,
  onStyleChange,
  panguEnabled,
  onPanguToggle,
}: StyleSelectorProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex gap-2">
        {STYLE_OPTIONS.map(({ value, label }) => {
          const isActive = value === activeStyle;
          return (
            <button
              key={value}
              type="button"
              onClick={() => onStyleChange(value)}
              className={
                isActive
                  ? "rounded-full px-4 py-1 text-sm font-medium bg-[#CA8A04] text-white"
                  : "rounded-full px-4 py-1 text-sm font-medium border border-[#1A1A1A]/20 text-[#1A1A1A]/70 hover:border-[#CA8A04]/50"
              }
            >
              {label}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={onPanguToggle}
        title="Insert spaces between CJK and English characters"
        className={
          panguEnabled
            ? "rounded-full px-4 py-1 text-sm font-medium bg-[#CA8A04] text-white"
            : "rounded-full px-4 py-1 text-sm font-medium border border-[#1A1A1A]/20 text-[#1A1A1A]/70 hover:border-[#CA8A04]/50"
        }
      >
        Pangu
      </button>
    </div>
  );
}
