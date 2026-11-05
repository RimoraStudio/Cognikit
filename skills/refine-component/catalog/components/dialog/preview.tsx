import { useState } from "react";
import { ConfirmationDialog } from "./component";

export function DialogPreview() {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState("Focus returns to the trigger after dismissal.");

  function handleConfirm() {
    setStatus("Preview action confirmed. Nothing changed outside this page.");
  }

  return (
    <section className="rc-dialog-preview" aria-labelledby="rc-dialog-preview-title">
      <style>{`
        .rc-dialog-preview { max-width: 34rem; padding: 24px; border: 1px solid #d7d9d3; border-radius: 8px; color: #20211f; background: #fff; font: 16px/1.5 system-ui, sans-serif; }
        .rc-dialog-preview h2 { margin: 0 0 8px; font-size: 1.4rem; letter-spacing: -.025em; }
        .rc-dialog-preview p { color: #5f6660; }
        .rc-dialog-preview__trigger { display: inline-flex; min-height: 44px; align-items: center; gap: 9px; padding: 9px 13px; border: 1px solid #aeb7b0; border-radius: 5px; color: #20211f; background: #fff; font: inherit; font-weight: 600; cursor: pointer; }
        .rc-dialog-preview__trigger:focus-visible { outline: 3px solid #185fbc; outline-offset: 3px; }
        .rc-dialog-preview__trigger svg { width: 15px; height: 15px; }
        .rc-dialog-preview__status { min-height: 1.5em; margin: 14px 0 0; color: #315b4b !important; font: 12px/1.5 ui-monospace, monospace; }
      `}</style>
      <h2 id="rc-dialog-preview-title">Decision dialog</h2>
      <p>Open the modal, press Escape, or confirm the local preview action.</p>
      <button
        className="rc-dialog-preview__trigger"
        type="button"
        aria-haspopup="dialog"
        onClick={() => {
          setStatus("Dialog open. Focus is inside.");
          setOpen(true);
        }}
      >
        Inspect dialog
        <svg
          aria-hidden="true"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 11 12 4M6 4h6v6" />
        </svg>
      </button>
      <p className="rc-dialog-preview__status" role="status" aria-live="polite">
        {status}
      </p>
      <ConfirmationDialog
        open={open}
        title="Keep this change in the preview?"
        description="This demonstration only updates local status. Nothing is saved outside this page."
        cancelLabel="Keep editing"
        confirmLabel="Confirm preview"
        onOpenChange={(nextOpen) => {
          setOpen(nextOpen);
        }}
        onDismiss={() => setStatus("Dialog dismissed; focus returns to the trigger.")}
        onConfirm={handleConfirm}
      />
    </section>
  );
}
