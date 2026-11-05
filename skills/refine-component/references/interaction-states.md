# Interaction States

Model states from the component's task and consequences. Do not implement a
state merely because another component has it.

## Define the transition contract

For each relevant state, record its trigger, user-visible feedback, next action,
and recovery path. Include the state owner and persistence rule when state is
controlled by a parent or saved outside the component.

| State | Questions |
|---|---|
| Resting | Is the purpose and available action clear? |
| Hover | Does pointer feedback reinforce affordance without carrying essential meaning? |
| Focus-visible | Can keyboard users identify focus at every size and background? |
| Pressed | Is activation acknowledged without shifting surrounding layout? |
| Selected or expanded | Is persistent state distinct from hover and momentary press? |
| Pending | Is progress clear and duplicate activation prevented? |
| Error | Is the problem explained with a useful recovery step? |
| Disabled | Is the unavailable action clear, and is its behavior actually blocked? |

## Give each component its own motion

Choose motion to explain a component-specific event. Keep it brief, interruptible,
and secondary to clear text and state. Do not reuse one animation across
unrelated components.

- A button can use a short press transform to acknowledge activation.
- A field can briefly shake on a failed submit when the inline error and focus
  also identify what needs attention.
- A dialog can ease opacity and position as it enters or exits while native
  focus and dismissal behavior remain intact.
- A toggle should communicate its persistent on/off state, not mimic a button's
  temporary pressed effect.

These are examples, not defaults. Follow the product's motion tokens and remove
motion that delays a task, causes layout movement, or adds no useful feedback.
Honor `prefers-reduced-motion`, and ensure every state remains understandable
without animation.

## Verify behavior

Check pointer and keyboard activation, repeated events, focus movement, disabled
enforcement, async completion, error recovery, and reduced-motion behavior for
the states that apply. See `verification.md` for the focused verification loop.
