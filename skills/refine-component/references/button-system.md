# Reusable Button System

Use this guide when creating, refactoring, or auditing a reusable button
component. Treat the states and API below as a coverage checklist, not a
request to implement every option in every product.

## Model the API around intent

Keep semantic purpose, size, and optional visual treatment conceptually
separate. Match local conventions; do not add props that the product does not
need.

| Axis | Common choices | Guidance |
|---|---|---|
| Intent | primary, secondary, quiet/tertiary, destructive | Communicate hierarchy and risk; avoid multiple competing primary actions. |
| Size | small, medium, large | Use a small stable scale, with platform-appropriate hit areas. |
| Content | label, leading/trailing icon, icon-only | Preserve label clarity; icon-only buttons need an accessible name. |
| Behavior | standard action, submit, toggle | Keep native button semantics; expose toggle state with `aria-pressed` when appropriate. |
| Status | enabled, disabled, pending | Model status separately from visual intent; pending is not just a style variant. |
| Finish | standard, edge-lit, sheen | Optional visual treatment only; use the product's design language and avoid combining effects by default. |

Avoid a prop for every CSS detail. Do not allow unsupported combinations such
as `iconOnly + longLabel`, or unrelated boolean flags that create a variant
matrix no one can reason about. Use composition or a dedicated icon-button
component when its accessible contract differs.

## Cover relevant states

At minimum, inspect the states applicable to the button's behavior:

| State | Meaning and expected treatment |
|---|---|
| Rest | Ready; label, hierarchy, and hit area are clear. |
| Hover | Optional pointer affordance; never required to understand the action. |
| Focus-visible | Strong, persistent keyboard indicator, distinct from hover and press. |
| Pressed | Immediate activation feedback; keep transform subtle and avoid reflow. |
| Disabled | Unavailable and cannot activate; provide a reason when not obvious. |
| Pending | Async action is in progress; prevent duplicate activation and announce useful progress. |
| Success / error | Use only when the result belongs in the button; otherwise communicate through adjacent status feedback and keep the action label stable. |
| Selected | For toggle buttons only; expose the persistent state, e.g. `aria-pressed`. |

Do not implement success, error, selected, or loading merely to complete a
checklist. These states have different semantics. Avoid changing a button's
label during async work if it causes confusing accessible-name changes; retain
the action name and provide a concise status when that is clearer.

### Interaction contract

- Use native `<button>` elements for in-place actions and native `disabled`
  when removing the control from keyboard interaction is appropriate.
- If pending should retain focus, `aria-disabled="true"` can preserve the
  button in the tab sequence, but it does **not** block activation. Guard the
  handler against repeat activation and expose the pending state.
- Keep keyboard and pointer activation equivalent; native buttons handle Enter
  and Space without custom keyboard handlers.
- Keep focus visible during hover, pending, and transitions. Never hide or
  replace it with a shine or glow.
- Use `aria-pressed` only for a persistent toggle state, not momentary press.
- For form buttons, specify `type="button"`, `type="submit"`, or
  `type="reset"` intentionally; do not let a reusable default submit forms by
  accident.

## Optional dimensional finishes

Choose at most one extra finish when it reinforces the product's material or
interaction language. Check the surrounding layout and keep the default button
simple.

### Edge-lit 3D

Use a flat fill with directional border contrast: lighter top/right edges,
darker bottom/left edges. A pressed state may flatten or reverse the contrast.
Avoid gradient fills and large shadow stacks when the requested effect is
border lighting. Preserve adequate contrast and avoid a beveled appearance that
reduces legibility.

### Sheen / shine

Use a brief, restrained highlight sweep only as optional hover or focus
feedback. Keep it inside the button, behind its label, and away from the focus
indicator. Do not run a continuous loop, trigger repeated sweeps, or imply
loading/success with decorative shine. On touch, the action must remain clear
without hover. Disable the sweep under `prefers-reduced-motion` while retaining
a static color/border cue.

### Scale and press

A subtle hover scale around `1.02` to `1.04` and press scale around `0.97` to `0.99`
may suit a tactile button. Prefer transforms to avoid layout reflow, but check
the transformed bounds for clipping and overlap. Combine scale with any
vertical travel in a single `transform` declaration. Respect reduced motion.

Do not combine sheen, scale, glow, edge lighting, and multiple shadows by
default. Test the complete state matrix so effects do not compete with focus,
disabled, pending, or destructive feedback.

## Verification checklist

- [ ] Variants reflect real intent and have documented combinations.
- [ ] Native role, accessible name, and form `type` are correct.
- [ ] Hover, focus-visible, pressed, disabled, and pending states are distinct.
- [ ] Pending blocks duplicate actions and communicates progress.
- [ ] Toggle state is persistent and exposed only when applicable.
- [ ] Success and failure paths preserve recovery and focus.
- [ ] Motion respects reduced-motion settings; touch does not depend on hover.
- [ ] Edge lighting or sheen does not reduce contrast, hide focus, clip, or overlap.
- [ ] Tests cover observable behavior and important variant/state combinations.
