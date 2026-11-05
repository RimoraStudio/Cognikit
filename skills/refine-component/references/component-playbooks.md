# Component Playbooks

Use these as audit prompts, not mandatory visual recipes. Preserve the current
component contract and adapt each pattern to the project's semantics and
platform.

## Button and submit action

First identify the action and its outcome. A button that saves, submits,
deletes, navigates, or opens a menu has different risk and feedback needs.

### Inspect

- Is this action a `<button>` or a link? Use a link for navigation and a button
  for an in-place action.
- Is the label a concrete verb and consistent with the completion message?
- Does the hierarchy match risk and frequency? Destructive actions need clear
  intent and proportionate confirmation, not just a red fill.
- Does keyboard activation trigger the same action exactly once?
- During async work, is repeat submission prevented and progress perceivable?
- When a form submit fails, does focus and error feedback help the user recover?

### Press feedback

Use hover and press feedback only to reinforce affordance and confirm the
user's action. If it fits the product, a subtle hover scale-up (`1.02` to
`1.04`) and press scale-down (`0.97` to `0.99`) can make a button feel
responsive. Combine transforms when using scale and vertical travel. Prefer
transforms over changing dimensions to avoid reflow, and check that scaling
does not overlap nearby controls or get clipped. Keep the focus ring visible
and distinct. Respect reduced motion and retain non-motion state cues.

For a tactile, edge-lit button, use a flat fill and directional border colors:
lighter top/right edges and darker bottom/left edges. On press, flatten or
reverse that edge contrast to suggest compression. Do not add a gradient or
stacked shadows unless the project's established style calls for them.

```css
/* Adapt values to existing tokens and component conventions. */
.button {
  transition: transform 120ms ease;
}

.button:hover:not(:disabled) {
  transform: scale(1.03);
}

.button:active:not(:disabled) {
  transform: translateY(1px) scale(0.98);
}

@media (prefers-reduced-motion: reduce) {
  .button {
    transition: none;
  }
}
```

Do not put essential feedback only on `:active`: touch users may not see it,
and keyboard users need a visible focus state. Keep `:focus-visible` distinct
from hover and pressed styling. Hover scale is optional on touch; never make
hover a prerequisite for understanding or activating the control. Avoid
transform if it clips, overlaps important content, shifts a layout users rely
on, or conflicts with an existing animation.

For async submit, keep the action's identity understandable while pending.
Prevent a second request in behavior, not only with opacity or a spinner.
Restore the correct focus and enabled state when the request settles.

## Icon button

- Give the control an accessible name describing its action. A tooltip is
  supplemental, not the only name.
- Keep the hit area generous even when the visible glyph is small; use the
  platform or project target-size convention.
- Prefer the product's icon library. If no icon fits, use a small,
  purpose-specific SVG with consistent optical size and stroke weight. Do not
  substitute emoji or Unicode text glyphs for interface icons.
- Distinguish toggle state from momentary activation with the right semantics
  and a perceivable selected state.
- Check focus visibility, tooltip timing, and narrow-spacing collisions.

## Dropdown, menu, or select

Do not assume these are interchangeable. Determine whether the control is a
native select, a listbox, an action menu, or a disclosure. Use the semantic
primitive already present in the project.

| Concern | Inspect |
|---|---|
| Trigger | Name, expanded state, clear open affordance |
| Open | Pointer, Enter/Space, and expected arrow-key behavior |
| Focus | Where focus goes on open and whether it stays in the widget appropriately |
| Selection | Selection vs. activation semantics and selected item announcement |
| Dismissal | Escape, outside click if expected, and focus return |
| Content | Viewport collision, scrolling, long labels, disabled options |

Preserve established library behavior rather than layering custom keyboard
handlers over it. Avoid `role="menu"` on ordinary navigation links or form
choices unless the interaction truly follows menu semantics.

## Sidebar and navigation rail

Treat navigation as both information architecture and an interactive
component. Inspect the route model before changing visual hierarchy.

- Keep groups meaningful and labels scannable. Do not bury frequent or
  current destinations in decorative nesting.
- Make the current location visually distinct and expose it semantically,
  such as `aria-current="page"` on the active destination.
- Ensure collapse has a labeled, keyboard-operable control. If labels disappear,
  provide an accessible name and a usable way to identify destinations.
- Preserve route state and browser back behavior. Avoid using buttons for links.
- Check long lists, independent scrolling, sticky regions, and footer/action
  placement at realistic content lengths.
- At narrow widths, choose a deliberate pattern (drawer, overlay, compact bar,
  or another existing product convention) instead of compressing desktop nav.
- If opening the mobile sidebar behaves as a modal, follow the project's
  dialog primitive for focus containment, Escape dismissal, and focus return.

## Inputs and toggles

- Keep a persistent label, helper text, and error relationship. Placeholder
  text is not the label.
- Show validation near the field and identify how to correct the value.
- Preserve entered values and focus when validation fails unless the product
  explicitly requires another flow.
- For switches and checkboxes, preserve native state semantics and make the
  label or hit area easy to activate. Do not use color alone for checked state.
- Test keyboard toggling, disabled state, and screen-reader name/state using
  available project tooling.
