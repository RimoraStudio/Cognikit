# Text-field notes

- The shake is tied to an invalid submit attempt, not to every keystroke or
  focus change. Inline error text and focus remain the authoritative feedback.
- Use the product's validation rules. Native `type="email"` validation is only
  appropriate when an email address is the actual field value.
- This preview validates locally and sends or stores nothing.
- The framework-neutral counterpart is `examples/input/`.
