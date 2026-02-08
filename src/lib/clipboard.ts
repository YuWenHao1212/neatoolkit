/**
 * Copy text to clipboard with fallback support.
 *
 * Attempts navigator.clipboard.writeText first.
 * Falls back to document.execCommand('copy') via a hidden textarea.
 * Never throws — always resolves to a boolean.
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }

    return copyViaExecCommand(text);
  } catch {
    return copyViaExecCommand(text);
  }
}

function copyViaExecCommand(text: string): boolean {
  try {
    const textarea = document.createElement("textarea");
    textarea.value = text;

    // Prevent scrolling and keep element invisible
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    textarea.style.top = "-9999px";
    textarea.style.opacity = "0";

    document.body.appendChild(textarea);
    textarea.select();

    const success = document.execCommand("copy");

    document.body.removeChild(textarea);

    return success;
  } catch {
    return false;
  }
}
