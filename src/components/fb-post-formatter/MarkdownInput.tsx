"use client";

import { useRef, useCallback, useEffect, type ReactNode } from "react";
import { useTranslations } from "next-intl";

const MAX_CHARS = 5000;

// CJK Unified Ideographs + Extension A
const CJK_RE = /[\u4e00-\u9fff\u3400-\u4dbf]/;

// Markdown styled spans: **bold**, *italic*, _italic_, `code`, ~~del~~, ~del~
// Note: **...** must come before *...* to avoid partial matches
const MD_STYLED_RE = /(\*\*.+?\*\*|\*.+?\*|_.+?_|`.+?`|~~.+?~~|~.+?~)/g;

/** Build highlighted ReactNodes — CJK inside markdown markers get amber bg. */
const buildHighlight = (text: string): ReactNode[] => {
  const parts: ReactNode[] = [];
  let lastIndex = 0;

  MD_STYLED_RE.lastIndex = 0;
  let match = MD_STYLED_RE.exec(text);

  while (match !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    if (CJK_RE.test(match[0])) {
      parts.push(
        <mark key={match.index} className="rounded-sm bg-amber-200/70">
          {match[0]}
        </mark>
      );
    } else {
      parts.push(match[0]);
    }

    lastIndex = match.index + match[0].length;
    match = MD_STYLED_RE.exec(text);
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts;
};

type MarkdownInputProps = {
  readonly value: string;
  readonly onChange: (value: string) => void;
};

export default function MarkdownInput({
  value,
  onChange,
}: MarkdownInputProps) {
  const t = useTranslations("Editor");
  const charCount = value.length;
  const isOverLimit = charCount >= MAX_CHARS;

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const raw = e.target.value;
    onChange(raw.length > MAX_CHARS ? raw.slice(0, MAX_CHARS) : raw);
  };

  const syncScroll = useCallback(() => {
    if (textareaRef.current && backdropRef.current) {
      backdropRef.current.scrollTop = textareaRef.current.scrollTop;
      backdropRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  }, []);

  // Auto-resize textarea to fit content
  const autoResize = useCallback(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = `${Math.max(ta.scrollHeight, 384)}px`;
  }, []);

  useEffect(() => {
    autoResize();
  }, [value, autoResize]);

  // Precise check: CJK must be *inside* markdown markers
  const hasUnconvertible = (() => {
    MD_STYLED_RE.lastIndex = 0;
    let m = MD_STYLED_RE.exec(value);
    while (m !== null) {
      if (CJK_RE.test(m[0])) return true;
      m = MD_STYLED_RE.exec(value);
    }
    return false;
  })();

  return (
    <div className="flex flex-1 flex-col rounded-lg border border-border bg-white">
      <div className="flex items-center justify-between border-b border-border px-4 py-2">
        <div className="flex flex-col">
          <span className="text-sm font-medium text-[#1A1A1A]">
            {t("markdownInput")}
          </span>
          <span className="text-xs text-[#1A1A1A]/50">
            {t("markdownHint")}
          </span>
        </div>
        <span
          className={
            isOverLimit
              ? "text-xs text-red-600"
              : "text-xs text-[#1A1A1A]/50"
          }
        >
          {charCount} / {MAX_CHARS}
        </span>
      </div>

      <div className="relative flex-1">
        {/* Backdrop: same text with highlight marks, invisible text */}
        {hasUnconvertible && (
          <div
            ref={backdropRef}
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 overflow-hidden whitespace-pre-wrap break-words px-4 py-3 font-mono text-sm text-transparent"
          >
            {buildHighlight(value)}
          </div>
        )}

        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          onScroll={syncScroll}
          spellCheck={false}
          placeholder={t("placeholder")}
          className="w-full min-h-96 resize-none overflow-hidden bg-transparent px-4 py-3 font-mono text-sm text-[#1A1A1A] placeholder:text-[#1A1A1A]/30 focus:outline-none"
        />
      </div>

      {isOverLimit && (
        <div className="px-4 pb-2">
          <p className="text-xs text-amber-600">
            {t("overLimitHint")}
          </p>
        </div>
      )}
    </div>
  );
}
