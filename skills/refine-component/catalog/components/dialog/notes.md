# Dialog notes

- The example uses the native `<dialog>` element and `showModal()` to retain
  browser modal semantics, inert background behavior, Escape handling, and
  focus restoration.
- The transition is specific to the overlay. Do not reuse it as a generic
  entrance animation for fields or buttons.
- Do not close a consequential dialog before an asynchronous action succeeds;
  preserve retry and cancel paths on failure.
- The framework-neutral counterpart is `examples/dialog/`.
