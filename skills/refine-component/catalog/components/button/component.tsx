import type { ButtonHTMLAttributes, ReactNode } from "react";

type ActionStatus = "idle" | "pending" | "success";

export type PrimaryActionButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "children"
> & {
  children: ReactNode;
  status?: ActionStatus;
};

const styles = `
  .rc-action-button {
    --rc-action-face: #315b4b;
    --rc-action-edge-light: #91aa9a;
    --rc-action-edge-dark: #19372b;
    display: inline-flex;
    min-height: 46px;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 10px 16px;
    border: 1px solid;
    border-color: var(--rc-action-edge-light) var(--rc-action-edge-light)
      var(--rc-action-edge-dark) var(--rc-action-edge-dark);
    border-radius: 5px;
    color: #fff;
    background: var(--rc-action-face);
    font: inherit;
    font-weight: 650;
    cursor: pointer;
    transition: transform 120ms ease, background-color 120ms ease,
      border-color 120ms ease;
  }
  .rc-action-button:hover:not(:disabled) {
    background: #3a6855;
    border-color: #a3b8aa #a3b8aa #19372b #19372b;
  }
  .rc-action-button:active:not(:disabled) {
    transform: translateY(1px);
    background: #294b3d;
    border-color: #19372b #19372b #91aa9a #91aa9a;
  }
  .rc-action-button:focus-visible {
    outline: 3px solid #185fbc;
    outline-offset: 3px;
  }
  .rc-action-button:disabled {
    cursor: not-allowed;
    opacity: .66;
  }
  .rc-action-button__icon { width: 16px; height: 16px; flex: none; }
  @media (prefers-reduced-motion: reduce) {
    .rc-action-button { transition: none; }
  }
`;

/** A semantic action button with explicit pending and completion feedback. */
export function PrimaryActionButton({
  children,
  className,
  disabled = false,
  status = "idle",
  type = "button",
  ...buttonProps
}: PrimaryActionButtonProps) {
  const pending = status === "pending";
  const label = pending ? "Saving…" : status === "success" ? "Saved" : children;

  return (
    <>
      <style>{styles}</style>
      <button
        {...buttonProps}
        className={["rc-action-button", className].filter(Boolean).join(" ")}
        type={type}
        disabled={disabled || pending}
        aria-busy={pending || undefined}
      >
        <span>{label}</span>
        {status === "success" ? (
          <svg
            className="rc-action-button__icon"
            aria-hidden="true"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m3 8.5 3.2 3.2L13 5" />
          </svg>
        ) : (
          <svg
            className="rc-action-button__icon"
            aria-hidden="true"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 8h10M8 3l5 5-5 5" />
          </svg>
        )}
      </button>
    </>
  );
}
