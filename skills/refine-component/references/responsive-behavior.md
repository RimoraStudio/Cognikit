# Responsive Behavior

Adapt a component to its real content and interaction at narrow widths; do not
simply scale down its desktop dimensions.

## Inspect

- Identify the narrowest supported viewport, expected zoom, and any virtual
  keyboard or short-height conditions.
- Check whether labels, helper text, errors, actions, and dialog content can
  wrap without clipping or changing meaning.
- Preserve a sensible reading and focus order when layout changes.
- Keep interactive targets and spacing usable for touch under the product's
  platform conventions.
- Avoid horizontal scrolling, hidden actions, hover-only behavior, and fixed
  overlays that cover the active field or dialog controls.

## Adapt by component

- **Buttons:** allow text to wrap only when the surrounding layout supports it;
  keep the action's hit area and full label available.
- **Fields:** keep labels and error text adjacent to the input; ensure helper
  content remains visible and does not rely on placeholder text.
- **Dialogs:** constrain width and height to the viewport, allow content to
  scroll when necessary, and keep the dismissal and primary actions reachable.
- **Navigation and composite controls:** preserve the current location,
  selection, and keyboard model when changing orientation or presentation.

## Verify

Test a narrow viewport, a larger text or zoom setting when available, and a
short viewport for overlays. Confirm there is no horizontal overflow, focus is
not obscured, and pointer, keyboard, and touch paths remain usable. Do not claim
device coverage that was not checked.
