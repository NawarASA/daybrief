import { useState } from "react";
import { INSTALL_COMMAND } from "../constants";

export default function InstallCommand() {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(INSTALL_COMMAND);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard API unavailable - the command is still selectable text.
    }
  }

  return (
    <div className="install-command">
      <code>{INSTALL_COMMAND}</code>
      <button onClick={handleCopy} aria-label="Copy install command">
        {copied ? "Copied" : "Copy"}
      </button>
    </div>
  );
}
