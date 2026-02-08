import { describe, it, expect } from "vitest";
import { hasExternalLinks, LINK_PATTERN } from "@/lib/fb-audit";

describe("hasExternalLinks", () => {
  it("returns false for empty input", () => {
    expect(hasExternalLinks("")).toBe(false);
  });

  it("returns false for clean text", () => {
    expect(hasExternalLinks("Hello world!")).toBe(false);
  });

  it("detects https URLs", () => {
    expect(hasExternalLinks("Check out https://example.com today")).toBe(true);
  });

  it("detects http URLs", () => {
    expect(hasExternalLinks("Visit http://example.com")).toBe(true);
  });

  it("detects short URL domains", () => {
    expect(hasExternalLinks("Link: bit.ly/abc123")).toBe(true);
  });

  it("detects t.co short URLs", () => {
    expect(hasExternalLinks("See t.co/xyz")).toBe(true);
  });

  it("does not flag text without URLs", () => {
    expect(hasExternalLinks("No links here, just text about websites")).toBe(false);
  });
});

describe("LINK_PATTERN", () => {
  it("matches all URLs in text for highlighting", () => {
    const text = "Visit https://example.com and bit.ly/abc";
    LINK_PATTERN.lastIndex = 0;
    const matches: string[] = [];
    let m = LINK_PATTERN.exec(text);
    while (m !== null) {
      matches.push(m[0]);
      m = LINK_PATTERN.exec(text);
    }
    expect(matches.length).toBe(2);
  });
});
