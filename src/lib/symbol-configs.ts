/**
 * Style configurations for rendering Markdown structural elements
 * as plain text with Unicode symbols.
 *
 * Three styles are provided:
 * - minimal: clean, undecorated output
 * - structured: clear visual hierarchy with box-drawing characters
 * - social: decorative symbols suited for social media posts
 */

export type StyleName = "minimal" | "structured" | "social";

export type SymbolConfig = {
  readonly h1: (text: string) => string;
  readonly h2: (text: string) => string;
  readonly h3: (text: string) => string;
  readonly listItem: (text: string) => string;
  readonly orderedItem: (n: number, text: string) => string;
  readonly blockquote: (text: string) => string;
  readonly hr: string;
};

const minimalConfig: SymbolConfig = Object.freeze({
  h1: (text: string) => text,
  h2: (text: string) => text,
  h3: (text: string) => text,
  listItem: (text: string) => `\u2022 ${text}`,
  orderedItem: (n: number, text: string) => `${n}. ${text}`,
  blockquote: (text: string) => `\u300C${text}\u300D`,
  hr: "\u2014\u2014\u2014",
});

const structuredConfig: SymbolConfig = Object.freeze({
  h1: (text: string) => `\u3010${text}\u3011`,
  h2: (text: string) => `\u258D${text}`,
  h3: (text: string) => text,
  listItem: (text: string) => `- ${text}`,
  orderedItem: (n: number, text: string) => `${n}. ${text}`,
  blockquote: (text: string) => `\u2503${text}`,
  hr: "\u2501\u2501\u2501\u2501\u2501\u2501",
});

const socialConfig: SymbolConfig = Object.freeze({
  h1: (text: string) => `\u2738 ${text}`,
  h2: (text: string) => `\u25B8 ${text}`,
  h3: (text: string) => text,
  listItem: (text: string) => `\u2192 ${text}`,
  orderedItem: (n: number, text: string) => `${n}. ${text}`,
  blockquote: (text: string) => `\uD83D\uDCAC ${text}`,
  hr: "\u00B7 \u00B7 \u00B7",
});

export const STYLE_CONFIGS: Readonly<Record<StyleName, SymbolConfig>> =
  Object.freeze({
    minimal: minimalConfig,
    structured: structuredConfig,
    social: socialConfig,
  });

export const DEFAULT_STYLE: StyleName = "structured";
