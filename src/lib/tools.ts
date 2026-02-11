export interface Tool {
  key: string;
  href: string;
  icon: string;
}

export interface ToolCategory {
  key: string;
  icon: string;
  color: string;
  tools: Tool[];
}

// Category colors for UI — muted, warm tones for premium feel
export const categoryColors: Record<string, { bg: string; text: string; iconBg: string }> = {
  image: { bg: "bg-cat-image", text: "text-cat-image", iconBg: "bg-cat-image/12" },
  video: { bg: "bg-cat-video", text: "text-cat-video", iconBg: "bg-cat-video/12" },
  youtube: { bg: "bg-cat-youtube", text: "text-cat-youtube", iconBg: "bg-cat-youtube/12" },
  text: { bg: "bg-cat-text", text: "text-cat-text", iconBg: "bg-cat-text/12" },
};

// Ordered by SEO search volume (highest first)
export const toolCategories: ToolCategory[] = [
  {
    key: "image",
    icon: "Image",
    color: "amber",
    tools: [
      { key: "removeBackground", href: "/image/remove-background", icon: "Eraser" },
      { key: "imageCompress", href: "/image/compress", icon: "Image" },
    ],
  },
  {
    key: "video",
    icon: "FileVideo",
    color: "red",
    tools: [
      { key: "videoCompress", href: "/video/compress", icon: "FileVideo" },
      { key: "videoToGif", href: "/video/to-gif", icon: "Film" },
    ],
  },
  {
    key: "youtube",
    icon: "Captions",
    color: "teal",
    tools: [
      { key: "youtubeSubtitle", href: "/youtube/subtitle", icon: "Captions" },
      { key: "youtubeSummary", href: "/youtube/summary", icon: "BrainCircuit" },
      { key: "youtubeTranslate", href: "/youtube/translate", icon: "Languages" },
    ],
  },
  {
    key: "text",
    icon: "Type",
    color: "purple",
    tools: [
      { key: "fontGenerator", href: "/text/font-generator", icon: "Type" },
      { key: "fbPostFormatter", href: "/text/fb-post-formatter", icon: "Bold" },
    ],
  },
];
