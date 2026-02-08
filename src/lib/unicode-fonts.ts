/**
 * Unicode Mathematical Alphanumeric Symbols conversion module.
 *
 * Converts ASCII letters (A-Z, a-z) and digits (0-9) into styled Unicode
 * characters via code-point offset calculation. CJK characters and all
 * other symbols pass through unchanged.
 */

export type FontStyle =
  | "sansSerifBold"
  | "sansSerifItalic"
  | "sansSerifBoldItalic"
  | "monospace";

interface FontConfig {
  readonly uppercaseStart: number;
  readonly lowercaseStart: number;
  readonly digitStart: number | null;
  readonly exceptions?: Readonly<Record<string, number>>;
}

const FONT_CONFIGS: Readonly<Record<FontStyle, FontConfig>> = {
  sansSerifBold: {
    uppercaseStart: 0x1d5d4,
    lowercaseStart: 0x1d5ee,
    digitStart: 0x1d7ec,
  },
  sansSerifItalic: {
    uppercaseStart: 0x1d608,
    lowercaseStart: 0x1d622,
    digitStart: null,
    exceptions: {
      h: 0x210e,
    },
  },
  sansSerifBoldItalic: {
    uppercaseStart: 0x1d63c,
    lowercaseStart: 0x1d656,
    digitStart: null,
  },
  monospace: {
    uppercaseStart: 0x1d670,
    lowercaseStart: 0x1d68a,
    digitStart: 0x1d7f6,
  },
};

const isUppercase = (code: number): boolean =>
  code >= 0x41 && code <= 0x5a;

const isLowercase = (code: number): boolean =>
  code >= 0x61 && code <= 0x7a;

const isDigit = (code: number): boolean =>
  code >= 0x30 && code <= 0x39;

const isCjk = (code: number): boolean =>
  (code >= 0x4e00 && code <= 0x9fff) ||
  (code >= 0x3400 && code <= 0x4dbf);

/** Check if a character is CJK (for use in other modules). */
export const isCjkChar = (char: string): boolean =>
  isCjk(char.codePointAt(0)!);

/**
 * Convert a single character to its Unicode styled equivalent.
 * Returns the original character if no conversion applies.
 */
const convertChar = (char: string, config: FontConfig): string => {
  // Check exception map first
  if (config.exceptions?.[char] !== undefined) {
    return String.fromCodePoint(config.exceptions[char]);
  }

  const code = char.codePointAt(0)!;

  // CJK passthrough
  if (isCjk(code)) {
    return char;
  }

  // Uppercase A-Z
  if (isUppercase(code)) {
    return String.fromCodePoint(config.uppercaseStart + (code - 0x41));
  }

  // Lowercase a-z
  if (isLowercase(code)) {
    return String.fromCodePoint(config.lowercaseStart + (code - 0x61));
  }

  // Digits 0-9 (only when style supports digits)
  if (isDigit(code) && config.digitStart !== null) {
    return String.fromCodePoint(config.digitStart + (code - 0x30));
  }

  // Everything else passes through unchanged
  return char;
};

/**
 * Convert text to Unicode Mathematical Alphanumeric Symbols for the given
 * font style. ASCII letters and digits are converted; CJK characters,
 * punctuation, spaces, and all other characters pass through unchanged.
 */
export const convertToUnicode = (text: string, style: FontStyle): string => {
  const config = FONT_CONFIGS[style];

  return [...text].map((char) => convertChar(char, config)).join("");
};
