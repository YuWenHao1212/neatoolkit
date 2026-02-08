"use client";

import { useState, useCallback, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { copyToClipboard } from "@/lib/clipboard";
import { LINK_PATTERN } from "@/lib/fb-audit";

type FbPreviewProps = {
  readonly output: string;
  readonly highlightLinks?: boolean;
};

/**
 * Normalize Unicode Mathematical Alphanumeric characters back to ASCII.
 * Covers Sans-Serif Bold, Sans-Serif Italic, and Monospace styles
 * used by our fb-renderer.
 */
const normalizeChar = (char: string): string => {
  const cp = char.codePointAt(0);
  if (cp === undefined) return char;

  // Sans-Serif Bold: A-Z, a-z, 0-9
  if (cp >= 0x1D5D4 && cp <= 0x1D5ED) return String.fromCharCode(65 + cp - 0x1D5D4);
  if (cp >= 0x1D5EE && cp <= 0x1D607) return String.fromCharCode(97 + cp - 0x1D5EE);
  if (cp >= 0x1D7EC && cp <= 0x1D7F5) return String.fromCharCode(48 + cp - 0x1D7EC);

  // Sans-Serif Italic: A-Z, a-z
  if (cp >= 0x1D608 && cp <= 0x1D621) return String.fromCharCode(65 + cp - 0x1D608);
  if (cp >= 0x1D622 && cp <= 0x1D63B) return String.fromCharCode(97 + cp - 0x1D622);

  // Monospace: A-Z, a-z, 0-9
  if (cp >= 0x1D670 && cp <= 0x1D689) return String.fromCharCode(65 + cp - 0x1D670);
  if (cp >= 0x1D68A && cp <= 0x1D6A3) return String.fromCharCode(97 + cp - 0x1D68A);
  if (cp >= 0x1D7F6 && cp <= 0x1D7FF) return String.fromCharCode(48 + cp - 0x1D7F6);

  return char;
};

const highlightUrls = (text: string): ReactNode[] => {
  // Split into characters (handles surrogate pairs)
  const chars = Array.from(text);
  // Normalize to ASCII so LINK_PATTERN can match Unicode URLs
  const normalized = chars.map(normalizeChar).join("");

  LINK_PATTERN.lastIndex = 0;
  const matches: { start: number; end: number }[] = [];
  let match = LINK_PATTERN.exec(normalized);
  while (match !== null) {
    matches.push({ start: match.index, end: match.index + match[0].length });
    match = LINK_PATTERN.exec(normalized);
  }

  if (matches.length === 0) return [text];

  const parts: ReactNode[] = [];
  let lastEnd = 0;

  for (const { start, end } of matches) {
    if (start > lastEnd) {
      parts.push(chars.slice(lastEnd, start).join(""));
    }
    parts.push(
      <mark
        key={start}
        className="rounded bg-red-100 px-0.5 text-red-800"
      >
        {chars.slice(start, end).join("")}
      </mark>
    );
    lastEnd = end;
  }

  if (lastEnd < chars.length) {
    parts.push(chars.slice(lastEnd).join(""));
  }

  return parts;
};

export default function FbPreview({ output, highlightLinks }: FbPreviewProps) {
  const t = useTranslations("Editor");
  const [copied, setCopied] = useState(false);
  const isEmpty = output.trim() === "";

  const handleCopy = useCallback(async () => {
    const success = await copyToClipboard(output);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  }, [output]);

  return (
    <div className="flex flex-1 flex-col rounded-lg border border-border bg-white">
      <div className="flex items-center justify-between border-b border-border px-4 py-2">
        <span className="text-base font-medium text-[#1A1A1A]">
          {t("fbPreview")}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          disabled={isEmpty}
          className={
            copied
              ? "rounded-full px-3 py-1 text-xs font-medium bg-green-600 text-white"
              : isEmpty
                ? "rounded-full px-3 py-1 text-xs font-medium bg-[#1A1A1A]/10 text-[#1A1A1A]/30 cursor-not-allowed"
                : "rounded-full px-3 py-1 text-xs font-medium bg-[#CA8A04] text-white hover:bg-[#A16207]"
          }
        >
          {copied ? t("copied") : t("copy")}
        </button>
      </div>

      <div className="flex-1 px-4 py-3">
        {isEmpty ? (
          <p className="text-base text-[#1A1A1A]/30">
            {t("previewPlaceholder")}
          </p>
        ) : (
          <pre className="whitespace-pre-wrap break-words font-sans text-base text-[#1A1A1A]">
            {highlightLinks ? highlightUrls(output) : output}
          </pre>
        )}
      </div>
    </div>
  );
}
