# Component Design Principles

Use these principles to decide whether a refinement improves the component's
job. They are decision rules, not a visual style preset.

## Start with the user task

Write down the component's purpose in one sentence: “A person uses this to…”.
Tie every proposed visual or interaction change to that task. If the rationale
is only “looks more modern”, inspect the context again.

## Preserve product conventions

- Read the project's tokens, variants, component primitives, and nearby usage.
- Reuse established naming, sizing, icon, and motion conventions.
- Preserve public props, callbacks, URLs, persistence, and parent-owned state.
- Fix the smallest coherent boundary. Avoid introducing a new design language
  for one component.

## Make hierarchy carry meaning

- Emphasis should reflect action priority, frequency, and consequence.
- Keep labels concrete and outcomes predictable. “Save changes” is clearer
  than “Submit” when the action saves changes.
- Use borders, badges, icons, and numbering only when they encode useful
  structure or status.
- Reuse the product's icon family, or create a small custom SVG when no icon
  fits. Do not use emoji or Unicode text as a substitute for an interface icon.
- Prefer one clear primary action in a component instance. Make secondary
  and destructive actions distinguishable without relying on color alone.

## Feedback should explain change

- Pointer, keyboard, and touch activation should produce equivalent results.
- Give immediate, restrained feedback for actions. Persistent states such as
  selected, expanded, or saved must remain distinct from transient hover.
- Use motion to explain cause and effect, such as a disclosure opening. Avoid
  animation that delays the task or makes layout jump.
- Pick motion per component and state. A restrained press response, invalid
  field shake, or dialog transition may fit its task, but do not apply the same
  effect to unrelated components or animate states that need no motion.
- Preserve user input and provide a next step after errors.

## Refine, do not decorate

1. Remove friction or ambiguity first.
2. Improve the most important state or hierarchy issue.
3. Add polish only when it reinforces the component's purpose.
4. Compare against the project's existing UI and remove redundant effects.

Do not add gradients, shadows, rounded corners, animations, or iconography
without a product-specific reason.
