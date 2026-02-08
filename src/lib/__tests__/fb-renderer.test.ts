import { describe, it, expect } from "vitest";
import { convertMarkdownToFb } from "@/lib/fb-renderer";
import { STYLE_CONFIGS } from "@/lib/symbol-configs";

const structured = STYLE_CONFIGS.structured;
const minimal = STYLE_CONFIGS.minimal;

describe("convertMarkdownToFb", () => {
  describe("headings", () => {
    it("converts h1 with structured config wrapping", () => {
      const result = convertMarkdownToFb("# Title", structured);
      // structured h1: 【text】
      expect(result).toContain("\u3010Title\u3011");
    });

    it("converts h2 with structured config prefix", () => {
      const result = convertMarkdownToFb("## Section", structured);
      // structured h2: ▍text
      expect(result).toContain("\u258DSection");
    });

    it("converts h3 with structured config (plain text)", () => {
      const result = convertMarkdownToFb("### Detail", structured);
      expect(result).toContain("Detail");
    });

    it("wraps headings with newlines", () => {
      const result = convertMarkdownToFb("# Title\n\nParagraph", structured);
      // Heading should be separated from paragraph
      expect(result).toMatch(/\u3010Title\u3011\n/);
    });
  });

  describe("bold (strong)", () => {
    it("converts bold English text to sans-serif bold unicode", () => {
      const result = convertMarkdownToFb("**Hello**", structured);
      // H=0x1d5db e=0x1d5f2 l=0x1d5f9 l=0x1d5f9 o=0x1d5fc
      expect(result).toContain(
        "\u{1d5db}\u{1d5f2}\u{1d5f9}\u{1d5f9}\u{1d5fc}"
      );
    });

    it("passes through CJK characters in bold unchanged", () => {
      const result = convertMarkdownToFb("**\u4F60\u597D**", structured);
      // CJK characters should pass through
      expect(result).toContain("\u4F60\u597D");
    });
  });

  describe("italic (em)", () => {
    it("converts italic English text to sans-serif italic unicode", () => {
      const result = convertMarkdownToFb("*world*", structured);
      // w=0x1d638 o=0x1d630 r=0x1d633 l=0x1d62d d=0x1d625
      expect(result).toContain(
        "\u{1d638}\u{1d630}\u{1d633}\u{1d62d}\u{1d625}"
      );
    });
  });

  describe("inline code (codespan)", () => {
    it("converts inline code to monospace unicode", () => {
      const result = convertMarkdownToFb("`code`", structured);
      // c=0x1d68c o=0x1d698 d=0x1d68d e=0x1d68e
      expect(result).toContain(
        "\u{1d68c}\u{1d698}\u{1d68d}\u{1d68e}"
      );
    });
  });

  describe("unordered list", () => {
    it("renders unordered list items with config listItem", () => {
      const result = convertMarkdownToFb("- apple\n- banana", structured);
      // structured listItem: - text
      expect(result).toContain("- apple");
      expect(result).toContain("- banana");
    });
  });

  describe("ordered list", () => {
    it("renders ordered list items with config orderedItem", () => {
      const result = convertMarkdownToFb("1. first\n2. second", structured);
      // structured orderedItem: n. text
      expect(result).toContain("1. first");
      expect(result).toContain("2. second");
    });
  });

  describe("blockquote", () => {
    it("renders blockquote with config blockquote", () => {
      const result = convertMarkdownToFb("> a quote", structured);
      // structured blockquote: ┃text
      expect(result).toContain("\u2503a quote");
    });
  });

  describe("horizontal rule", () => {
    it("renders hr with config hr symbol", () => {
      const result = convertMarkdownToFb("---", structured);
      // structured hr: ━━━━━━
      expect(result).toContain("\u2501\u2501\u2501\u2501\u2501\u2501");
    });
  });

  describe("link", () => {
    it("expands links to text (url) format", () => {
      const result = convertMarkdownToFb(
        "[Example](https://example.com)",
        structured
      );
      expect(result).toContain("Example (https://example.com)");
    });
  });

  describe("image", () => {
    it("renders image as [image: alt] marker", () => {
      const result = convertMarkdownToFb(
        "![alt text](https://img.jpg)",
        structured
      );
      expect(result).toContain("[image: alt text]");
    });
  });

  describe("fenced code block", () => {
    it("converts fenced code to monospace unicode", () => {
      const result = convertMarkdownToFb(
        "```\nconst x = 1;\n```",
        structured
      );
      // 'x' in monospace: 0x1d6a1
      expect(result).toContain("\u{1d6a1}");
      // '1' in monospace: 0x1d7f7
      expect(result).toContain("\u{1d7f7}");
      // 'const' c=0x1d68c o=0x1d698 n=0x1d697 s=0x1d69c t=0x1d69d
      expect(result).toContain(
        "\u{1d68c}\u{1d698}\u{1d697}\u{1d69c}\u{1d69d}"
      );
    });
  });

  describe("table", () => {
    it("converts multi-column table to key:value format", () => {
      const md = "| Name | Value | Note |\n| --- | --- | --- |\n| A | 1 | good |\n| B | 2 | ok |";
      const result = convertMarkdownToFb(md, structured);
      // First column is list item, subsequent columns are "Header: Value"
      // with ideographic space (U+3000) indentation
      expect(result).toContain("- A");
      expect(result).toContain("\u3000Value: 1");
      expect(result).toContain("\u3000Note: good");
      expect(result).toContain("- B");
      expect(result).toContain("\u3000Value: 2");
      expect(result).toContain("\u3000Note: ok");
    });

    it("converts single-column table to plain list", () => {
      const md = "| Name |\n| --- |\n| Alice |\n| Bob |";
      const result = convertMarkdownToFb(md, structured);
      expect(result).toContain("- Alice");
      expect(result).toContain("- Bob");
      // No key:value pairs for single column
      expect(result).not.toContain(":");
    });
  });

  describe("paragraph", () => {
    it("renders paragraph text with line break", () => {
      const result = convertMarkdownToFb("Hello world", structured);
      expect(result).toContain("Hello world");
      // Should end with newline(s)
      expect(result).toMatch(/Hello world\n/);
    });
  });

  describe("style switching", () => {
    it("uses minimal config symbols instead of structured", () => {
      const result = convertMarkdownToFb("- item\n\n---", minimal);
      // minimal listItem: • text (U+2022)
      expect(result).toContain("\u2022 item");
      // minimal hr: ——— (U+2014 x3)
      expect(result).toContain("\u2014\u2014\u2014");
    });

    it("uses minimal blockquote wrapping", () => {
      const result = convertMarkdownToFb("> quote", minimal);
      // minimal blockquote: 「text」
      expect(result).toContain("\u300Cquote\u300D");
    });
  });

  describe("excessive blank lines cleanup", () => {
    it("collapses more than 2 consecutive newlines to 2", () => {
      const result = convertMarkdownToFb(
        "# Title\n\n\n\n\nParagraph",
        structured
      );
      // Should not have more than 2 consecutive newlines
      expect(result).not.toMatch(/\n{3,}/);
    });
  });
});
