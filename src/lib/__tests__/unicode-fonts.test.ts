import { describe, it, expect } from "vitest";
import { convertToUnicode, type FontStyle } from "@/lib/unicode-fonts";

describe("convertToUnicode", () => {
  describe("Sans-Serif Bold", () => {
    const style: FontStyle = "sansSerifBold";

    it("converts uppercase letters", () => {
      // U+1D5D4 = 120276; 'A' = 0x41 = 65
      // A -> U+1D5D4, B -> U+1D5D5, Z -> U+1D5ED
      expect(convertToUnicode("A", style)).toBe(
        String.fromCodePoint(0x1d5d4)
      );
      expect(convertToUnicode("B", style)).toBe(
        String.fromCodePoint(0x1d5d5)
      );
      expect(convertToUnicode("Z", style)).toBe(
        String.fromCodePoint(0x1d5ed)
      );
    });

    it("converts lowercase letters", () => {
      // U+1D5EE; 'a' = 0x61 = 97
      expect(convertToUnicode("a", style)).toBe(
        String.fromCodePoint(0x1d5ee)
      );
      expect(convertToUnicode("z", style)).toBe(
        String.fromCodePoint(0x1d607)
      );
    });

    it("converts digits", () => {
      // U+1D7EC
      expect(convertToUnicode("0", style)).toBe(
        String.fromCodePoint(0x1d7ec)
      );
      expect(convertToUnicode("9", style)).toBe(
        String.fromCodePoint(0x1d7f5)
      );
    });

    it("passes through CJK characters (U+4E00-U+9FFF)", () => {
      expect(convertToUnicode("\u4e00", style)).toBe("\u4e00");
      expect(convertToUnicode("\u9fff", style)).toBe("\u9fff");
      expect(convertToUnicode("\u4e2d", style)).toBe("\u4e2d"); // CJK char
    });

    it("passes through CJK Extension A (U+3400-U+4DBF)", () => {
      expect(convertToUnicode("\u3400", style)).toBe("\u3400");
      expect(convertToUnicode("\u4dbf", style)).toBe("\u4dbf");
    });

    it("handles mixed content (English + CJK + symbols)", () => {
      const input = "Hello \u4e16\u754c! 123";
      const result = convertToUnicode(input, style);

      // H -> bold sans-serif H
      const expectedH = String.fromCodePoint(0x1d5d4 + ("H".charCodeAt(0) - 0x41));
      // e -> bold sans-serif e
      const expectedE = String.fromCodePoint(0x1d5ee + ("e".charCodeAt(0) - 0x61));

      expect(result).toContain(expectedH);
      expect(result).toContain(expectedE);
      // CJK should be unchanged
      expect(result).toContain("\u4e16");
      expect(result).toContain("\u754c");
      // Symbols should be unchanged
      expect(result).toContain(" ");
      expect(result).toContain("!");
    });
  });

  describe("Sans-Serif Italic", () => {
    const style: FontStyle = "sansSerifItalic";

    it("converts uppercase letters", () => {
      // U+1D608
      expect(convertToUnicode("A", style)).toBe(
        String.fromCodePoint(0x1d608)
      );
      expect(convertToUnicode("Z", style)).toBe(
        String.fromCodePoint(0x1d621)
      );
    });

    it("converts lowercase letters", () => {
      // U+1D622
      expect(convertToUnicode("a", style)).toBe(
        String.fromCodePoint(0x1d622)
      );
      expect(convertToUnicode("z", style)).toBe(
        String.fromCodePoint(0x1d63b)
      );
    });

    it("passes through digits (no italic digits)", () => {
      expect(convertToUnicode("0", style)).toBe("0");
      expect(convertToUnicode("9", style)).toBe("9");
      expect(convertToUnicode("123", style)).toBe("123");
    });

    it("handles exception character: italic h -> U+210E", () => {
      expect(convertToUnicode("h", style)).toBe(
        String.fromCodePoint(0x210e)
      );
    });

    it("passes through CJK characters", () => {
      expect(convertToUnicode("\u4e00", style)).toBe("\u4e00");
      expect(convertToUnicode("\u3400", style)).toBe("\u3400");
    });

    it("handles mixed content with exception character", () => {
      const input = "hi\u4f60\u597d";
      const result = convertToUnicode(input, style);

      // h -> U+210E (exception)
      expect(result).toContain(String.fromCodePoint(0x210e));
      // i -> italic i
      const expectedI = String.fromCodePoint(0x1d622 + ("i".charCodeAt(0) - 0x61));
      expect(result).toContain(expectedI);
      // CJK unchanged
      expect(result).toContain("\u4f60");
      expect(result).toContain("\u597d");
    });
  });

  describe("Sans-Serif Bold Italic", () => {
    const style: FontStyle = "sansSerifBoldItalic";

    it("converts uppercase letters", () => {
      // U+1D63C
      expect(convertToUnicode("A", style)).toBe(
        String.fromCodePoint(0x1d63c)
      );
      expect(convertToUnicode("Z", style)).toBe(
        String.fromCodePoint(0x1d655)
      );
    });

    it("converts lowercase letters", () => {
      // U+1D656
      expect(convertToUnicode("a", style)).toBe(
        String.fromCodePoint(0x1d656)
      );
      expect(convertToUnicode("z", style)).toBe(
        String.fromCodePoint(0x1d66f)
      );
    });

    it("passes through digits (no bold italic digits)", () => {
      expect(convertToUnicode("0", style)).toBe("0");
      expect(convertToUnicode("5", style)).toBe("5");
      expect(convertToUnicode("9", style)).toBe("9");
    });

    it("passes through CJK characters (both ranges)", () => {
      expect(convertToUnicode("\u4e00", style)).toBe("\u4e00");
      expect(convertToUnicode("\u9fff", style)).toBe("\u9fff");
      expect(convertToUnicode("\u3400", style)).toBe("\u3400");
      expect(convertToUnicode("\u4dbf", style)).toBe("\u4dbf");
    });

    it("handles mixed content", () => {
      const input = "AB 12 \u4e2d\u6587!";
      const result = convertToUnicode(input, style);

      // A -> bold italic A
      expect(result).toContain(String.fromCodePoint(0x1d63c));
      // B -> bold italic B
      expect(result).toContain(String.fromCodePoint(0x1d63d));
      // Digits pass through
      expect(result).toContain("1");
      expect(result).toContain("2");
      // CJK unchanged
      expect(result).toContain("\u4e2d");
      expect(result).toContain("\u6587");
      // Symbols unchanged
      expect(result).toContain(" ");
      expect(result).toContain("!");
    });
  });

  describe("Monospace", () => {
    const style: FontStyle = "monospace";

    it("converts uppercase letters", () => {
      // U+1D670
      expect(convertToUnicode("A", style)).toBe(
        String.fromCodePoint(0x1d670)
      );
      expect(convertToUnicode("Z", style)).toBe(
        String.fromCodePoint(0x1d689)
      );
    });

    it("converts lowercase letters", () => {
      // U+1D68A
      expect(convertToUnicode("a", style)).toBe(
        String.fromCodePoint(0x1d68a)
      );
      expect(convertToUnicode("z", style)).toBe(
        String.fromCodePoint(0x1d6a3)
      );
    });

    it("converts digits", () => {
      // U+1D7F6
      expect(convertToUnicode("0", style)).toBe(
        String.fromCodePoint(0x1d7f6)
      );
      expect(convertToUnicode("9", style)).toBe(
        String.fromCodePoint(0x1d7ff)
      );
    });

    it("passes through CJK characters", () => {
      expect(convertToUnicode("\u4e00", style)).toBe("\u4e00");
      expect(convertToUnicode("\u3400", style)).toBe("\u3400");
    });

    it("handles mixed content", () => {
      const input = "Code: x=1 \u7a0b\u5f0f";
      const result = convertToUnicode(input, style);

      // C -> monospace C
      expect(result).toContain(String.fromCodePoint(0x1d670 + 2));
      // x -> monospace x
      expect(result).toContain(
        String.fromCodePoint(0x1d68a + ("x".charCodeAt(0) - 0x61))
      );
      // 1 -> monospace 1
      expect(result).toContain(String.fromCodePoint(0x1d7f6 + 1));
      // CJK unchanged
      expect(result).toContain("\u7a0b");
      expect(result).toContain("\u5f0f");
      // Symbols unchanged
      expect(result).toContain(":");
      expect(result).toContain("=");
    });
  });

  describe("edge cases", () => {
    it("returns empty string for empty input", () => {
      expect(convertToUnicode("", "sansSerifBold")).toBe("");
    });

    it("passes through spaces and punctuation unchanged", () => {
      const input = " !@#$%^&*()";
      expect(convertToUnicode(input, "sansSerifBold")).toBe(input);
    });

    it("handles full alphabet conversion", () => {
      const input = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      const result = convertToUnicode(input, "sansSerifBold");

      // Each character should be converted, none should remain as ASCII
      for (const char of input) {
        expect(result).not.toContain(char);
      }
      expect([...result]).toHaveLength(26);
    });

    it("handles full lowercase alphabet conversion", () => {
      const input = "abcdefghijklmnopqrstuvwxyz";
      const result = convertToUnicode(input, "sansSerifBold");

      for (const char of input) {
        expect(result).not.toContain(char);
      }
      expect([...result]).toHaveLength(26);
    });

    it("handles all digits conversion", () => {
      const input = "0123456789";
      const result = convertToUnicode(input, "monospace");

      for (const char of input) {
        expect(result).not.toContain(char);
      }
      expect([...result]).toHaveLength(10);
    });
  });
});
