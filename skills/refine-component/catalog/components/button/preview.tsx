import { useEffect, useState } from "react";
import { PrimaryActionButton } from "./component";

type PreviewStatus = "idle" | "pending" | "success";

export function ButtonPreview() {
  const [status, setStatus] = useState<PreviewStatus>("idle");

  useEffect(() => {
    if (status === "pending") {
      const timer = window.setTimeout(() => setStatus("success"), 650);
      return () => window.clearTimeout(timer);
    }
    if (status === "success") {
      const timer = window.setTimeout(() => setStatus("idle"), 1100);
      return () => window.clearTimeout(timer);
    }
  }, [status]);

  function handleSave() {
    if (status === "pending") return;
    setStatus("pending");
  }

  const message =
    status === "pending"
      ? "Saving preview…"
      : status === "success"
        ? "Preview saved for this visit."
        : "Ready for preview.";

  return (
    <section className="rc-preview rc-button-preview" aria-labelledby="rc-button-preview-title">
      <style>{`
        .rc-preview { max-width: 34rem; padding: 24px; border: 1px solid #d7d9d3; border-radius: 8px; color: #20211f; background: #fff; font: 16px/1.5 system-ui, sans-serif; }
        .rc-preview h2 { margin: 0 0 8px; font-size: 1.4rem; letter-spacing: -.025em; }
        .rc-preview p { color: #5f6660; }
        .rc-button-preview .rc-preview__status { min-height: 1.5em; margin: 14px 0 0; color: #315b4b; font: 12px/1.5 ui-monospace, monospace; }
      `}</style>
      <h2 id="rc-button-preview-title">Save action</h2>
      <p>Activate once to inspect pending and completion feedback.</p>
      <PrimaryActionButton status={status} onClick={handleSave}>
        Save changes
      </PrimaryActionButton>
      <p className="rc-preview__status" role="status" aria-live="polite">
        {message}
      </p>
    </section>
  );
}
