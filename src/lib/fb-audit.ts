/**
 * FB Post audit — checks for external links that reduce reach.
 */

const URL_PATTERN = /https?:\/\/\S+/gi;
const SHORT_URL_PATTERN =
  /\b(bit\.ly|goo\.gl|tinyurl\.com|t\.co|ow\.ly|is\.gd|buff\.ly|lnkd\.in|rb\.gy)\/?\S*/gi;

/** Combined pattern for splitting text around URLs (global, case-insensitive). */
export const LINK_PATTERN = new RegExp(
  `${URL_PATTERN.source}|${SHORT_URL_PATTERN.source}`,
  "gi"
);

/** Returns true if text contains any external link. */
export const hasExternalLinks = (text: string): boolean => {
  LINK_PATTERN.lastIndex = 0;
  return LINK_PATTERN.test(text);
};
