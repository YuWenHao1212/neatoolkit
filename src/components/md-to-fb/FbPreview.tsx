"use client";

import { useState, useCallback } from "react";
import { copyToClipboard } from "@/lib/clipboard";

type FbPreviewProps = {
  readonly output: string;
};

export default function FbPreview({ output }: FbPreviewProps) {
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
    <div className="flex flex-1 flex-col rounded-lg border border-[#1A1A1A]/20 bg-white">
      <div className="flex items-center justify-between border-b border-[#1A1A1A]/10 px-4 py-2">
        <span className="text-sm font-medium text-[#1A1A1A]">
          FB Preview
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
          {copied ? "Copied!" : "Copy All"}
        </button>
      </div>

      <div className="flex-1 px-4 py-3">
        {isEmpty ? (
          <p className="text-sm text-[#1A1A1A]/30">
            Preview will appear here...
          </p>
        ) : (
          <pre className="whitespace-pre-wrap break-words font-sans text-sm text-[#1A1A1A]">
            {output}
          </pre>
        )}
      </div>
    </div>
  );
}
