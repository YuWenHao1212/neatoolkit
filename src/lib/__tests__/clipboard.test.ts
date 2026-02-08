import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { copyToClipboard } from "@/lib/clipboard";

describe("copyToClipboard", () => {
  let originalClipboard: Clipboard;

  beforeEach(() => {
    originalClipboard = navigator.clipboard;
  });

  afterEach(() => {
    vi.restoreAllMocks();
    Object.defineProperty(navigator, "clipboard", {
      value: originalClipboard,
      writable: true,
      configurable: true,
    });
  });

  describe("when navigator.clipboard is available", () => {
    it("uses navigator.clipboard.writeText and returns true on success", async () => {
      const writeTextMock = vi.fn().mockResolvedValue(undefined);
      Object.defineProperty(navigator, "clipboard", {
        value: { writeText: writeTextMock },
        writable: true,
        configurable: true,
      });

      const result = await copyToClipboard("hello");

      expect(writeTextMock).toHaveBeenCalledWith("hello");
      expect(result).toBe(true);
    });

    it("returns false when navigator.clipboard.writeText rejects", async () => {
      const writeTextMock = vi.fn().mockRejectedValue(new Error("denied"));
      Object.defineProperty(navigator, "clipboard", {
        value: { writeText: writeTextMock },
        writable: true,
        configurable: true,
      });

      const result = await copyToClipboard("hello");

      expect(writeTextMock).toHaveBeenCalledWith("hello");
      expect(result).toBe(false);
    });
  });

  describe("when navigator.clipboard is NOT available", () => {
    beforeEach(() => {
      Object.defineProperty(navigator, "clipboard", {
        value: undefined,
        writable: true,
        configurable: true,
      });
      // jsdom does not define execCommand, so we add it for spying
      if (!document.execCommand) {
        document.execCommand = vi.fn();
      }
    });

    it("falls back to execCommand and returns true on success", async () => {
      const execCommandMock = vi.spyOn(document, "execCommand").mockReturnValue(true);
      const createElementSpy = vi.spyOn(document, "createElement");
      const appendChildSpy = vi.spyOn(document.body, "appendChild");
      const removeChildSpy = vi.spyOn(document.body, "removeChild");

      const result = await copyToClipboard("fallback text");

      expect(createElementSpy).toHaveBeenCalledWith("textarea");
      expect(appendChildSpy).toHaveBeenCalled();
      expect(execCommandMock).toHaveBeenCalledWith("copy");
      expect(removeChildSpy).toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it("returns false when execCommand returns false", async () => {
      vi.spyOn(document, "execCommand").mockReturnValue(false);

      const result = await copyToClipboard("fail text");

      expect(result).toBe(false);
    });

    it("returns false when execCommand throws", async () => {
      vi.spyOn(document, "execCommand").mockImplementation(() => {
        throw new Error("execCommand failed");
      });

      const result = await copyToClipboard("error text");

      expect(result).toBe(false);
    });
  });

  describe("never throws", () => {
    it("returns false instead of throwing for any unexpected error", async () => {
      Object.defineProperty(navigator, "clipboard", {
        get() {
          throw new Error("unexpected");
        },
        configurable: true,
      });
      // execCommand fallback will also fail since the error is in the outer try
      // but the function should still return false
      if (!document.execCommand) {
        document.execCommand = vi.fn().mockReturnValue(false);
      } else {
        vi.spyOn(document, "execCommand").mockReturnValue(false);
      }

      const result = await copyToClipboard("boom");

      expect(result).toBe(false);
    });
  });
});
