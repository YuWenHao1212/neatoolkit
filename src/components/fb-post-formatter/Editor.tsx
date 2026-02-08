"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { STYLE_CONFIGS } from "@/lib/symbol-configs";
import { convertMarkdownToFb } from "@/lib/fb-renderer";
import { postProcess } from "@/lib/post-process";
import { hasExternalLinks } from "@/lib/fb-audit";
import MarkdownInput from "@/components/fb-post-formatter/MarkdownInput";
import FbPreview from "@/components/fb-post-formatter/FbPreview";

// CJK inside markdown markers — only these need a warning
// Note: ** before *, ~~ before ~ to avoid partial matches
const CJK_RE_CLASS = "[\u4e00-\u9fff\u3400-\u4dbf]";
const CJK_IN_MARKERS_RE = new RegExp(
  `(\\*\\*[^*]*${CJK_RE_CLASS}[^*]*\\*\\*` +
  `|\\*[^*]*${CJK_RE_CLASS}[^*]*\\*` +
  `|_[^_]*${CJK_RE_CLASS}[^_]*_` +
  `|~~[^~]*${CJK_RE_CLASS}[^~]*~~` +
  `|~[^~]*${CJK_RE_CLASS}[^~]*~)`
);

export default function Editor() {
  const t = useTranslations("Editor");
  const tAudit = useTranslations("Audit");
  const [markdownInput, setMarkdownInput] = useState("");
  const [panguEnabled, setPanguEnabled] = useState(false);

  const fbOutput = useMemo(() => {
    if (markdownInput.trim() === "") return "";

    const config = STYLE_CONFIGS["structured"];
    const rendered = convertMarkdownToFb(markdownInput, config);
    return postProcess(rendered, panguEnabled);
  }, [markdownInput, panguEnabled]);

  const hasStyledText = CJK_IN_MARKERS_RE.test(markdownInput);
  const hasLinks = useMemo(
    () => hasExternalLinks(markdownInput) || hasExternalLinks(fbOutput),
    [markdownInput, fbOutput]
  );

  return (
    <div className="flex flex-col gap-4">
      {/* Pangu toggle */}
      <div className="flex items-center justify-end">
        <div className="group relative inline-block">
          <button
            type="button"
            onClick={() => setPanguEnabled((prev) => !prev)}
            className={
              panguEnabled
                ? "rounded-full px-4 py-1 text-sm font-medium bg-[#CA8A04] text-white"
                : "rounded-full px-4 py-1 text-sm font-medium border border-[#1A1A1A]/20 text-[#1A1A1A]/70 hover:border-[#CA8A04]/50"
            }
          >
            {t("panguLabel")}
          </button>
          <span className="pointer-events-none absolute right-0 top-full z-10 mt-2 w-56 rounded-lg bg-ink-900 px-3 py-2 text-xs leading-relaxed text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
            {t("panguTooltip")}
          </span>
        </div>
      </div>

      {/* Hints */}
      {hasStyledText && (
        <div className="rounded-lg bg-accent-light px-4 py-2.5 text-center text-sm text-ink-700">
          <span className="font-medium">{t("boldHintLabel")}</span>{" "}
          {t("boldHint")}
        </div>
      )}
      {hasLinks && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-center text-sm text-red-800">
          {tAudit("externalLinks")}
        </div>
      )}

      <div className="flex flex-col gap-4 md:flex-row md:gap-6">
        <MarkdownInput
          value={markdownInput}
          onChange={setMarkdownInput}
        />
        <FbPreview output={fbOutput} highlightLinks={hasLinks} />
      </div>
    </div>
  );
}
