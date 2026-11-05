import { useRef, useState, type FormEvent } from "react";
import { TextField } from "./component";

export function TextFieldPreview() {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState("Ready for input.");
  const [shakeKey, setShakeKey] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("");

    if (!inputRef.current?.validity.valid) {
      setError(
        value.trim()
          ? "Enter an address in the format name@example.com."
          : "Enter an email address to continue.",
      );
      setShakeKey((key) => key + 1);
      inputRef.current?.focus();
      return;
    }

    setError("");
    setStatus("That address looks valid. Nothing was sent or stored.");
  }

  function handleChange(nextValue: string) {
    setValue(nextValue);
    if (inputRef.current?.validity.valid) setError("");
  }

  return (
    <section className="rc-preview rc-field-preview" aria-labelledby="rc-field-preview-title">
      <style>{`
        .rc-preview { max-width: 34rem; padding: 24px; border: 1px solid #d7d9d3; border-radius: 8px; color: #20211f; background: #fff; font: 16px/1.5 system-ui, sans-serif; }
        .rc-preview h2 { margin: 0 0 8px; font-size: 1.4rem; letter-spacing: -.025em; }
        .rc-preview > p { color: #5f6660; }
        .rc-field-preview form { display: grid; gap: 16px; }
        .rc-field-preview button { display: inline-flex; width: fit-content; min-height: 44px; align-items: center; gap: 9px; padding: 9px 14px; border: 1px solid #315b4b; border-radius: 5px; color: #fff; background: #315b4b; font: inherit; font-weight: 650; cursor: pointer; }
        .rc-field-preview button:focus-visible { outline: 3px solid #185fbc; outline-offset: 3px; }
        .rc-field-preview button svg { width: 15px; height: 15px; }
        .rc-field-preview .rc-preview__status { min-height: 1.5em; margin: 0; color: #315b4b; font: 12px/1.5 ui-monospace, monospace; }
        @media (max-width: 420px) { .rc-preview { padding: 18px; } .rc-field-preview button { width: 100%; justify-content: center; } }
      `}</style>
      <h2 id="rc-field-preview-title">Required email address</h2>
      <p>Submit empty or malformed input to inspect recovery feedback.</p>
      <form noValidate onSubmit={handleSubmit}>
        <TextField
          ref={inputRef}
          id="rc-preview-email"
          label="Email address"
          type="email"
          name="email"
          autoComplete="email"
          placeholder="you@example.com"
          hint="Validation is local. No message will be sent."
          value={value}
          required
          error={error}
          shakeKey={shakeKey}
          onChange={(event) => handleChange(event.currentTarget.value)}
        />
        <button type="submit">
          Check address
          <svg
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
        </button>
        <p className="rc-preview__status" role="status" aria-live="polite">
          {status}
        </p>
      </form>
    </section>
  );
}
