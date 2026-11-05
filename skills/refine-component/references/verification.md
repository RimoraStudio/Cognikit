# Component Verification Loop

Use this loop after a focused component change. Reuse the project's existing
test and preview tools. Do not install a new test stack just to verify a small
refinement.

## 1. Capture the contract

Before editing, note:

- Component API and parent-owned state
- Primary event and expected result
- Existing keyboard and focus behavior
- Applicable disabled, pending, selected, error, and empty states
- Responsive breakpoint or platform adaptation

Turn the changed behaviors into assertions or manual checks. Avoid testing
implementation details that do not protect user-visible behavior.

## 2. Verify behavior

For each changed path, check:

- Pointer and keyboard reach the same intended outcome
- Activation happens once, including async and rapid input cases
- Disabled controls cannot activate
- Open/close, selection, navigation, and dismissal preserve the component's
  existing contract
- Focus is visible, moves intentionally, and returns sensibly after dismissal
- Errors and pending work give clear feedback and a recovery path

Prefer existing unit or component tests for state transitions, then existing
browser or end-to-end tests for real focus, viewport, and pointer behavior.

## 3. Verify accessibility and layout

- Use semantic elements and inspect accessible name, role, and state.
- Check visible focus, text and control contrast, zoom, and content at narrow
  viewport sizes.
- Confirm there is no unintended horizontal overflow, clipped focus ring,
  obscured sticky content, or target collision.
- Test reduced motion when the change introduces or alters animation.
- Use an automated accessibility checker if the project already has one, but
  do not treat a clean automated scan as proof of full accessibility.

## 4. Review rendered states

When a browser preview or screenshot tool is available, inspect the states the
change touched: resting, focused, pressed, selected/open, and pending/error as
applicable. Compare with the surrounding UI at the same scale. Look for
layout shifts, inconsistent tokens, weak hierarchy, and effects that compete
with the action. If visual tooling is unavailable, say the result was checked
in code/tests only.

## 5. Report evidence

Summarize checks honestly:

```text
Changed: pressed feedback and duplicate-submit guard
Verified: component test, keyboard activation, 390px viewport
Not verified: screen-reader announcement (no assistive-technology setup)
```

Never state that a check passed unless it was actually run. Report failures and
pre-existing failures separately from the component change.
