# Component Accessibility Checklist

Use this as a component-level review aid. It does not establish WCAG
conformance by itself. Follow the platform, semantic HTML, and the project's
existing accessible primitive before inventing custom roles or keyboard logic.

## Semantics and names

- Use native elements for native actions: links navigate, buttons act, and
  form controls accept values.
- Give controls an accessible name that describes the action or value. An
  icon, placeholder, or tooltip is not automatically a sufficient name.
- Use the product's icon library or a purpose-built SVG, not emoji or Unicode
  glyphs. Mark decorative SVGs `aria-hidden="true"`; name icon-only controls.
- Expose value, selected, expanded, checked, disabled, and invalid state using
  native semantics or a correctly implemented accessible primitive.
- Associate labels, instructions, and errors with the relevant field.
- Do not add ARIA roles that conflict with native element behavior.

## Keyboard and focus

- Make every pointer operation available by keyboard.
- Preserve logical tab order. Do not add a positive `tabindex` to force order.
- Keep focus visible, unobscured, and clipped by neither overflow nor overlays.
- For dialogs and menus, define focus entry, movement, dismissal, and return.
- Do not trap focus in non-modal content or allow it behind a true modal.
- Ensure shortcuts do not override normal typing or platform commands.

## Visual and sensory access

- Check text, icons, borders, and focus indicators against their backgrounds.
- Do not communicate status, selection, or errors with color alone.
- Preserve content under zoom and larger text settings. Avoid fixed heights that
  clip labels or validation messages.
- Provide adequate target size and spacing for the target platform.
- Respect reduced motion. Do not encode essential state only through motion.
- Provide text alternatives, captions, labels, or summaries for non-text
  content when the component's purpose requires them.

## Dynamic feedback

- Put errors near the affected control and explain recovery.
- Announce asynchronous updates only when useful; do not move focus for routine
  status changes.
- Prevent duplicate submissions while pending and communicate completion or
  failure without relying only on a spinner.
- Keep live regions focused, concise, and limited to meaningful updates.

## Verification

Combine code inspection and automated checks with keyboard testing and, where
available, a screen reader. Test the actual rendered component at the required
zoom, viewport, and input mode. Automated scanners find some issues, not all.
Report the checks performed and any assistive technology or platform not
available for verification.
