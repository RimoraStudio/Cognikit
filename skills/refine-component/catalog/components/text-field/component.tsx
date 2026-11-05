import {
  forwardRef,
  useEffect,
  useRef,
  type InputHTMLAttributes,
} from "react";

export type TextFieldProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "id" | "size"
> & {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  /** Increment on each invalid submit to retrigger the optional shake. */
  shakeKey?: number;
};

const styles = `
  .rc-text-field { display: grid; gap: 6px; color: #20211f; font: 16px/1.5 system-ui, sans-serif; }
  .rc-text-field__label { display: flex; align-items: baseline; gap: 5px; font-weight: 650; }
  .rc-text-field__required { color: #a0362c; }
  .rc-text-field__hint { margin: 0; color: #646a65; font-size: 13px; }
  .rc-text-field__control { position: relative; display: flex; align-items: center; }
  .rc-text-field__icon { position: absolute; left: 12px; width: 18px; height: 18px; color: #526d5e; pointer-events: none; }
  .rc-text-field__input { box-sizing: border-box; width: 100%; min-height: 46px; padding: 10px 12px 10px 40px; border: 1px solid #aeb7b0; border-radius: 5px; color: inherit; background: #fff; font: inherit; }
  .rc-text-field__input::placeholder { color: #7c847e; }
  .rc-text-field__input:focus-visible { outline: 3px solid #185fbc; outline-offset: 3px; }
  .rc-text-field__input[aria-invalid="true"] { border-color: #a0362c; }
  .rc-text-field__input--shake { animation: rc-field-invalid-shake 300ms ease-in-out; }
  .rc-text-field__error { margin: 0; color: #8d2e26; font-size: 13px; }
  @keyframes rc-field-invalid-shake {
    0%, 100% { transform: translateX(0); }
    25%, 75% { transform: translateX(-3px); }
    50% { transform: translateX(3px); }
  }
  @media (prefers-reduced-motion: reduce) {
    .rc-text-field__input--shake { animation: none; }
  }
`;

/** A labeled field whose correction text remains authoritative without motion. */
export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  function TextField(
    {
      id,
      label,
      hint,
      error,
      shakeKey = 0,
      className,
      required = false,
      ...inputProps
    },
    forwardedRef,
  ) {
    const inputRef = useRef<HTMLInputElement>(null);
    const hintId = `${id}-hint`;
    const errorId = `${id}-error`;

    useEffect(() => {
      const input = inputRef.current;
      if (!input || !error) return;

      input.classList.remove("rc-text-field__input--shake");
      void input.offsetWidth;
      input.classList.add("rc-text-field__input--shake");
      const timer = window.setTimeout(() => {
        input.classList.remove("rc-text-field__input--shake");
      }, 360);
      return () => window.clearTimeout(timer);
    }, [error, shakeKey]);

    function assignRef(input: HTMLInputElement | null) {
      inputRef.current = input;
      if (typeof forwardedRef === "function") forwardedRef(input);
      else if (forwardedRef) forwardedRef.current = input;
    }

    const describedBy = [hint ? hintId : undefined, error ? errorId : undefined]
      .filter(Boolean)
      .join(" ");

    return (
      <>
        <style>{styles}</style>
        <div className="rc-text-field">
          <label className="rc-text-field__label" htmlFor={id}>
            {label}
            {required && (
              <span className="rc-text-field__required" aria-hidden="true">
                *
              </span>
            )}
          </label>
          {hint && (
            <p className="rc-text-field__hint" id={hintId}>
              {hint}
            </p>
          )}
          <div className="rc-text-field__control">
            <svg
              className="rc-text-field__icon"
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3.5" y="5.5" width="17" height="13" rx="2" />
              <path d="m4.5 7 7.5 6 7.5-6" />
            </svg>
            <input
              {...inputProps}
              ref={assignRef}
              id={id}
              required={required}
              className={["rc-text-field__input", className]
                .filter(Boolean)
                .join(" ")}
              aria-invalid={error ? true : undefined}
              aria-describedby={describedBy || undefined}
            />
          </div>
          {error && (
            <p className="rc-text-field__error" id={errorId}>
              {error}
            </p>
          )}
        </div>
      </>
    );
  },
);
