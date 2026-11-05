# Component Composition and State Patterns

Use these patterns to keep a component understandable as variants and
interactions grow. Follow the local architecture instead of introducing a new
pattern for its own sake.

## Separate intent from appearance

Model variants around user intent (primary, destructive, quiet) rather than
arbitrary color names. Keep size and visual emphasis separate when the API
needs both. Do not create combinations that have no real use case.

## Define state transitions

Represent interactive behavior as explicit states and events. For a save
action, this might be `ready -> saving -> saved` or `ready -> saving -> error`.
For a disclosure, it might be `closed <-> open`. For each transition specify:

- The event that causes it
- The immediate visible and accessible feedback
- Whether the action can repeat while pending
- How dismissal or recovery works
- Which layer owns the state and whether it persists

Do not make disabled, loading, selected, and pressed synonymous. Each means a
different thing to the user.

## Compose complex components

- Keep the trigger, surface, items, and state connected through the project's
  existing primitives or composition API.
- Avoid making a whole card clickable when it contains independent controls.
- Let a dialog own modal focus behavior. Avoid duplicating it in child buttons.
- Let navigation derive active state from the routing source instead of
  maintaining a second manually synchronized copy.
- Keep layout, behavior, and data ownership clear. Avoid prop drilling or
  global state changes just to polish one control.

## Avoid variant explosion

Before adding a prop or variant, ask whether it represents a stable user need,
whether an existing composition already supports it, and whether all relevant
states can be implemented consistently. Prefer a small set of documented
variants and state-specific behavior over many one-off flags.

## Document API contracts

For reusable components, describe required and optional props, controlled vs.
uncontrolled state, event timing, async behavior, composition slots, and
unsupported combinations. Keep examples aligned with the actual API and add
tests for observable behavior rather than internal implementation details.
