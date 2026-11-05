import {
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
  type SyntheticEvent,
} from "react";

export type ConfirmationDialogProps = {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  children?: ReactNode;
  onOpenChange: (open: boolean) => void;
  onDismiss?: () => void;
  onConfirm: () => void | Promise<void>;
};

const styles = `
  .rc-confirm-dialog {
    box-sizing: border-box;
    width: min(92vw, 440px);
    max-height: min(84vh, 680px);
    overflow: auto;
    padding: 26px;
    border: 1px solid #cfd3ce;
    border-radius: 10px;
    color: #20211f;
    background: #fff;
    opacity: 0;
    transform: translateY(10px) scale(.99);
    transition: opacity 180ms ease, transform 180ms ease,
      display 180ms allow-discrete, overlay 180ms allow-discrete;
  }
  .rc-confirm-dialog[open] { opacity: 1; transform: translateY(0) scale(1); }
  .rc-confirm-dialog::backdrop {
    background: rgb(15 18 16 / 52%);
    opacity: 0;
    transition: opacity 180ms ease, display 180ms allow-discrete,
      overlay 180ms allow-discrete;
  }
  .rc-confirm-dialog[open]::backdrop { opacity: 1; }
  @starting-style {
    .rc-confirm-dialog[open] { opacity: 0; transform: translateY(10px) scale(.99); }
    .rc-confirm-dialog[open]::backdrop { opacity: 0; }
  }
  .rc-confirm-dialog__eyebrow { margin: 0 0 9px; color: #315b4b; font: 650 11px/1.4 ui-monospace, monospace; letter-spacing: .08em; }
  .rc-confirm-dialog h2 { margin: 0; font-size: clamp(1.35rem, 4vw, 1.7rem); line-height: 1.15; letter-spacing: -.035em; }
  .rc-confirm-dialog__description { margin: 12px 0 0; color: #5f6660; }
  .rc-confirm-dialog__error { margin: 12px 0 0; color: #8d2e26; font-size: 13px; }
  .rc-confirm-dialog__content { margin-top: 14px; }
  .rc-confirm-dialog__actions { display: flex; flex-wrap: wrap; justify-content: flex-end; gap: 10px; margin-top: 24px; }
  .rc-confirm-dialog__button { min-height: 44px; padding: 9px 13px; border: 1px solid #aeb7b0; border-radius: 5px; color: #20211f; background: #fff; font: inherit; font-weight: 600; cursor: pointer; }
  .rc-confirm-dialog__button--confirm { border-color: #315b4b; color: #fff; background: #315b4b; }
  .rc-confirm-dialog__button:focus-visible { outline: 3px solid #185fbc; outline-offset: 3px; }
  .rc-confirm-dialog__button:disabled { cursor: wait; opacity: .62; }
  @media (max-width: 420px) {
    .rc-confirm-dialog { padding: 20px; }
    .rc-confirm-dialog__actions { flex-direction: column-reverse; }
    .rc-confirm-dialog__button { width: 100%; }
  }
  @media (prefers-reduced-motion: reduce) {
    .rc-confirm-dialog, .rc-confirm-dialog::backdrop { transition: none; }
  }
`;

/** A native modal confirmation dialog with controlled state and safe defaults. */
export function ConfirmationDialog({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  children,
  onOpenChange,
  onDismiss,
  onConfirm,
}: ConfirmationDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const id = useId();
  const titleId = `${id}-title`;
  const descriptionId = `${id}-description`;
  const errorId = `${id}-error`;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();

    return () => {
      if (dialog.open) dialog.close();
    };
  }, [open]);

  function handleCancel(event: SyntheticEvent<HTMLDialogElement>) {
    event.preventDefault();
    if (pending) return;
    onDismiss?.();
    onOpenChange(false);
  }

  async function handleConfirm() {
    if (pending) return;
    setPending(true);
    setError("");
    try {
      await onConfirm();
      onOpenChange(false);
    } catch {
      setError("The action could not be completed. Try again or cancel.");
    } finally {
      setPending(false);
    }
  }

  return (
    <>
      <style>{styles}</style>
      <dialog
        ref={dialogRef}
        className="rc-confirm-dialog"
        aria-labelledby={titleId}
        aria-describedby={error ? `${descriptionId} ${errorId}` : descriptionId}
        onCancel={handleCancel}
      >
        <p className="rc-confirm-dialog__eyebrow">CONFIRMATION / REVIEW</p>
        <h2 id={titleId}>{title}</h2>
        <p
          className="rc-confirm-dialog__description"
          id={descriptionId}
        >
          {description}
        </p>
        {error && (
          <p className="rc-confirm-dialog__error" id={errorId} role="alert">
            {error}
          </p>
        )}
        {children && <div className="rc-confirm-dialog__content">{children}</div>}
        <div className="rc-confirm-dialog__actions">
          <button
            className="rc-confirm-dialog__button"
            type="button"
            autoFocus
            disabled={pending}
            onClick={() => {
              onDismiss?.();
              onOpenChange(false);
            }}
          >
            {cancelLabel}
          </button>
          <button
            className="rc-confirm-dialog__button rc-confirm-dialog__button--confirm"
            type="button"
            disabled={pending}
            aria-busy={pending || undefined}
            onClick={handleConfirm}
          >
            {pending ? "Working…" : confirmLabel}
          </button>
        </div>
      </dialog>
    </>
  );
}
