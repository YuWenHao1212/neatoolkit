"use client";

import { useState, useMemo } from "react";
import { type StyleName, STYLE_CONFIGS } from "@/lib/symbol-configs";
import { convertMarkdownToFb } from "@/lib/fb-renderer";
import { postProcess } from "@/lib/post-process";
import StyleSelector from "@/components/md-to-fb/StyleSelector";
import MarkdownInput from "@/components/md-to-fb/MarkdownInput";
import FbPreview from "@/components/md-to-fb/FbPreview";

export default function Editor() {
  const [markdownInput, setMarkdownInput] = useState("");
  const [activeStyle, setActiveStyle] = useState<StyleName>("structured");
  const [panguEnabled, setPanguEnabled] = useState(false);

  const fbOutput = useMemo(() => {
    if (markdownInput.trim() === "") return "";

    const config = STYLE_CONFIGS[activeStyle];
    const rendered = convertMarkdownToFb(markdownInput, config);
    return postProcess(rendered, panguEnabled);
  }, [markdownInput, activeStyle, panguEnabled]);

  return (
    <div className="flex flex-col gap-4">
      <StyleSelector
        activeStyle={activeStyle}
        onStyleChange={setActiveStyle}
        panguEnabled={panguEnabled}
        onPanguToggle={() => setPanguEnabled((prev) => !prev)}
      />

      <div className="flex flex-col gap-4 md:flex-row md:gap-6">
        <MarkdownInput
          value={markdownInput}
          onChange={setMarkdownInput}
        />
        <FbPreview output={fbOutput} />
      </div>
    </div>
  );
}
