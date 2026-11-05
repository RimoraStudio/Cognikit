# Professional, Distinctive Component Design

Use this guide when designing a new component, refining its visual concept, or
reviewing a set of components for quality. It is a design method, not a preset
style. A professional result is purposeful, legible, coherent, complete across
states, and credible in its real product context. A distinctive result has a
recognizable reason for its choices, not decoration added for novelty.

## 1. Read the product before choosing a look

Inspect the target component and nearby UI. Record:

- Who uses it, what task it supports, and the consequence of an error
- Platform, input modes, viewport, content density, and realistic data length
- Existing design tokens, type scale, surfaces, icon family, motion, and component APIs
- Relevant constraints: accessibility, localization, zoom, themes, and established patterns

Do not invent a new visual language because the surrounding system is sparse or
because a reference screenshot is unavailable. Derive from the product's actual
brand and usage. Ask only when missing context would materially change behavior
or direction.

## 2. Define a component-specific concept

Write one sentence before styling:

> For [user and task], this component should feel [qualities] because [product
> reason], while making [primary action or information] unmistakable.

Choose one or two visual cues that express this concept. Examples include a
clear typographic hierarchy for a dense data filter, a quiet surface for a
secondary action, or a tactile border for a physical-feeling control. Give
different component families different visual jobs; do not apply the same
card, pill, glow, gradient, and animation treatment everywhere.

Choose state feedback and motion by component purpose, not by novelty. A button
may use a brief press response, an invalid field may use a short shake alongside
clear text, and a dialog may ease in and out. Do not force motion onto every
component or copy one animation across unrelated controls. Keep equivalent
non-motion feedback and respect reduced-motion preferences.

Prefer the product's existing icon library. If no suitable icon exists, use a
small purpose-specific SVG with a consistent stroke and optical size. Do not
substitute emoji or Unicode characters for interface icons; decorative SVGs
should be hidden from assistive technology, and icon-only controls need an
accessible name.

If the user asks for concept exploration, present a small set of genuinely
different directions with tradeoffs before implementing. Otherwise, select
the best-fit direction and briefly state its rationale rather than making the
user choose from unnecessary options.

## 3. Make the design distinctive without breaking cohesion

- Keep shared tokens, spacing, typography, focus behavior, and interaction
  conventions coherent across the product.
- Differentiate components through purpose, hierarchy, density, anatomy, and
  state feedback, not arbitrary one-off colors or novelty effects.
- Use signature details sparingly and consistently. A detail should reinforce
  use, brand, material, or status.
- Do not confuse uniqueness with unusual shapes, weak affordances, reduced
  contrast, hidden labels, unexpected motion, or unfamiliar control behavior.
- Avoid generic “AI polish”: gratuitous gradients, glass, glow, shadows,
  rounded pills, floating blobs, ornamental icons, and repeated card grids.
  Use them only when the existing product language and component purpose justify them.

## 4. Resolve structure before surface

Set the component's anatomy and hierarchy before decoration:

1. Identify the primary content or action and its semantic role.
2. Group related content and separate independent actions.
3. Set alignment, spacing, sizing, and responsive behavior using local tokens.
4. Establish readable typography, contrast, and clear labels.
5. Style relevant states and only then add a restrained finishing detail.

Use real content where possible. Check long labels, empty values, validation
messages, localization expansion, and loading content so the design is not
optimized only for a short placeholder.

## 5. Finish the full component, not just its resting screenshot

For each applicable state, specify a visible and accessible response:

- Rest, hover, focus-visible, pressed, selected/expanded, disabled, pending,
  success, and error as relevant to the component
- Entry, exit, dismissal, recovery, and repeated activation behavior
- Keyboard and touch operation, target size, and focus order
- Responsive layout, zoom/larger text, overflow, and reduced motion

Keep persistent states distinct from transient interaction states. Maintain a
visible focus indicator above decorative layers. Do not rely on color, hover,
animation, or an icon alone to communicate meaning.

## 6. Apply a craft pass

Before calling the result done, inspect:

- Optical alignment, spacing rhythm, type scale, line length, and label clarity
- Border, radius, surface, icon, and focus-ring consistency with the product
- Contrast and state differentiation at actual rendered sizes
- Hit area, clipping, overlap, layout shifts, and content overflow
- Motion timing and reduced-motion behavior
- Whether every effect has a reason; remove effects that do not help

Compare against neighboring components and the original implementation. The
result should feel intentionally related to the product, not copied from a
generic component gallery and not visually detached from its surroundings.

## Output for new component concepts

When asked to design a new component, provide or implement:

1. A one-sentence design rationale grounded in the product
2. Component anatomy, semantic role, and primary behavior
3. Only the variants and state transitions the use case needs
4. Responsive and accessibility behavior
5. The implementation, plus relevant tests or a verification checklist

Keep the explanation short for a small implementation. Do not produce a full
design-system document unless requested.
