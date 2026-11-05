---
name: refine-component
description: >
  Designs, audits, and refines UI components from small controls to complex
  navigation, making them polished, distinctive, accessible, and production
  ready without breaking behavior. Use when users ask to design a component,
  make a UI component professional or unique, polish a button, fix a dropdown
  or input, improve a sidebar, define reusable component states, add pressed
  or focus feedback, or review component-level UX/UI. Covers product-grounded
  visual concepts, component anatomy, state transitions, keyboard and pointer
  behavior, responsive adaptation, and implementation verification.
metadata:
  version: 1.6.0
license: MIT
---

# Refine Component

> Part of [Cognikit](https://cognikit.com). A kit that gives AI agents cognitive abilities.

Refine the component the product already needs. Improve its clarity, feedback,
and finish while preserving its purpose, surrounding design language, and
working behavior. Apply this to a single control or a composed flow. When a
project needs a reusable component inventory, build or update a catalog using
the schema and templates bundled with this skill.

## AI execution flow

1. **Scope the component**: Identify the component, its users, the task it
   supports, and the specific friction the user described. If the request is
   broad, inspect the target component and its immediate context before
   choosing a scope.
2. **Read the existing system**: Inspect the component implementation,
   nearby usage, tokens, variants, state logic, and relevant tests. Follow the
   project's framework and conventions. Do not replace its design system or
   rewrite unrelated components. Load `references/design-quality.md` when the
   request asks for a new, professional, or distinctive concept. Load
    `references/design-principles.md` and `references/accessibility.md` when
    deeper guidance is needed. Load `references/interaction-states.md` for
    state and motion decisions, `references/responsive-behavior.md` for
    viewport adaptation, and `references/catalog-workflow.md` for catalog work.
    When refining or designing a reusable button, also load
    `references/button-system.md` for variant and interaction coverage.
3. **Audit behavior before appearance**: Trace the main interaction from
   entry to completion. Record current states, keyboard behavior, focus
   handling, responsive behavior, and any disabled, loading, empty, or error
   cases that apply. Preserve behavior unless the user asks to change it.
4. **Choose the highest-value fixes**: Prioritize broken behavior and
   accessibility, then hierarchy, affordance, legibility, and visual finish.
   For a new or distinctive concept, write a one-sentence product-grounded
   design rationale and select one or two purposeful visual cues. Make the
   component distinctive through its task and context, not random novelty.
   Avoid generic polish and decoration that does not improve use or feedback.
5. **Refine in place**: Reuse existing tokens and primitives. Make the
   smallest coherent change. Keep native semantics, visible focus, and
   predictable interaction. Avoid new dependencies for isolated polish.
6. **Critique the result**: Compare the updated component with the original
   problem, the surrounding interface, and the project's design language. If
   browser preview or screenshots are available, inspect the actual rendered
   states instead of relying on code inspection alone. Remove any flourish
   that competes with the task.
7. **Verify the component**: Use the relevant checklist in
   `references/verification.md`. Run existing tests, lint, or type checks.
   Inspect changed states and one narrow viewport. Report what was verified
   and anything blocked.

## Component scale

Use the same audit method at different scales, but match the depth to the
component:

- **Control**: Button, icon button, input, checkbox, switch, select, tooltip.
  Check label, hit area, affordance, focus, activation, validation, and
  disabled or pending behavior.
- **Composite**: Menu, dropdown, dialog, accordion, tabs, command palette.
  Check open/close rules, focus entry and return, dismissal, item selection,
  keyboard navigation, and content overflow.
- **Navigation or data component**: Sidebar, table toolbar, filter panel,
  pagination. Check hierarchy, active location, grouping, collapse behavior,
  scroll, dense content, and responsive adaptation.

## Interaction state checklist

Inspect only states relevant to the component. Do not add meaningless variants
just to complete a list.

| State or input | Check |
|---|---|
| Resting | Purpose and available action are clear |
| Hover | Pointer affordance is distinct but not the only feedback |
| Focus-visible | Keyboard focus is obvious and not clipped |
| Pressed or active | Activation has immediate, restrained feedback |
| Selected or expanded | Persistent state is distinguishable from hover |
| Disabled | Unavailable action is clear and cannot activate |
| Loading | Duplicate action is prevented and progress is communicated |
| Error or empty | Recovery or next step is apparent where applicable |
| Keyboard | Native keys and expected tab order work |
| Touch and narrow layout | Target is usable without hover or horizontal overflow |

For pointer press feedback, prefer a short transform or color response that
does not shift layout. For a tactile button, a subtle 1 to 2 px downward press
can make activation legible, but only if it fits the existing visual language.
Do not simulate physical depth with a stack of arbitrary shadows or shift
nearby content. Keep a visible focus indicator for keyboard users. Respect
`prefers-reduced-motion`; never make motion the only way to convey a state.

Choose motion for each component's job instead of applying one stock animation
everywhere. A brief press can confirm a button action; a short shake may call
attention to a failed field submission when paired with an inline error and
focus; a dialog may use a restrained opacity/transform transition for entry and
exit. These are options, not defaults. Keep state feedback understandable
without motion and test reduced-motion behavior.

For components with multiple events, write down the contract before changing
handlers:

| Current state | Event | Expected result |
|---|---|---|
| Ready | Pointer down or keyboard activation | Immediate pressed feedback, one activation |
| Loading | Repeat activation | No duplicate submission |
| Expanded | Escape or outside dismissal, if expected | Close and restore focus to trigger |
| Selected | Navigate away and back | State matches the product's persistence rules |

Adjust the rows to the actual component. Do not add transitions or persistence
that the product does not need.

## Component playbooks

Use `references/component-catalog.md` to identify the component family,
`references/component-playbooks.md` for concrete patterns, and
`references/component-patterns.md` for composition and state design. Load only
the relevant sections. For reusable button work, apply
`references/button-system.md`. For page patterns, refine the requested flow and
its components together, not the entire application by default.

## Reusable component catalog

Create catalog artifacts only when the user asks for a catalog, component
library audit, reusable specs, or a repeatable inventory. Do not generate a
catalog for a one-off component polish.

1. Define the components and platforms in scope. Check for an existing
   catalog, design system, Storybook, or equivalent. Extend the source of truth
   instead of creating a competing inventory.
2. Register stable component IDs and file paths in `catalog/registry.json`.
   Give each component its own `catalog/components/<id>/` folder containing
   `component.tsx`, `preview.tsx`, `metadata.json`, and `notes.md`.
3. Put purpose, product-grounded design concept, semantics, variants, states,
   interactions, accessibility, responsive rules, and verification cases in
   that component's `metadata.json`. Keep React TSX source and preview focused
   on the component. Use `templates/component-spec.md` for longer contracts.
4. Run `node scripts/validate-catalog.mjs`, then
   `node scripts/build-catalog.mjs`. The build creates
   `catalog-shell/catalog.json`; serve `catalog-shell/` over HTTP to browse and
   copy prompts or source. Render catalog values as text, never as executable
   HTML or script.
5. Keep framework-neutral runnable examples in `examples/<component>/` when
   useful. Catalog TSX and HTML examples are separate formats; link to each
   rather than duplicating one implementation into the other. Verify each
   example's behavior and reduced-motion path.

## Refinement rules

- Keep one clear primary action per component instance. Do not make secondary
  actions compete through equal emphasis.
- Ground visual changes in the component's job, content, and audience. Do not
  apply a favored palette, shape, motion, or interaction pattern without a
  project-specific reason.
- Preserve content, callbacks, URL behavior, form semantics, and state
  ownership. Avoid changing API contracts or parent behavior as a side effect.
- Prefer native `<button>`, `<a>`, form controls, and established accessible
  primitives over clickable generic containers.
- Keep pointer, keyboard, and touch interactions functionally equivalent.
- Make focus, hover, pressed, selected, disabled, and error states visually
  distinct where applicable. Do not rely on color alone.
- Use the project's existing spacing, color, type, radius, and motion tokens.
  If a token is missing, use the nearest established value rather than adding
  an isolated token without need.
- Use the project's icon library when it fits. Otherwise draw a small,
  purpose-specific SVG instead of using emoji or Unicode text as an icon.
  Give icon-only controls an accessible name and hide purely decorative SVGs
  from assistive technology.
- Avoid decorative gradients, shadows, icons, and animations unless they
  clarify hierarchy or state.
- For sidebars and other large components, refine information grouping,
  active state, collapse affordance, scroll behavior, and mobile pattern as a
  coherent unit. Do not merely shrink the desktop layout.
- Do not claim an interaction is fixed until its resulting state and keyboard
  path have been checked.

## Output

For an audit-only request, return prioritized findings with the component,
observed behavior, user impact, and a concrete refinement. For an
implementation request, make the change and briefly summarize what changed
and how it was verified. Keep unrelated design-system or page-level work out
of scope unless requested.

When useful, describe the change as **before → after → verification**. Do not
claim WCAG conformance or complete cross-device coverage based only on visual
inspection.

## Related skills

- `design-systems`: when selecting or changing the broader visual system
- `mobile-app-design`: when platform-specific mobile patterns drive the work
- `dashboard-ui`: when refining a data-dense dashboard or admin interface
- `code-review`: when a separate correctness and regression review is needed

## Pre-flight checklist

- [ ] Component purpose and existing behavior are understood
- [ ] Existing tokens, primitives, and conventions are reused
- [ ] Relevant interaction states have clear feedback
- [ ] Visual changes fit the component's task and surrounding interface
- [ ] Keyboard, focus, semantics, and touch behavior are checked
- [ ] Responsive and reduced-motion behavior are considered
- [ ] Tests or checks pass, and unverified cases are disclosed
- [ ] No unrelated component or design-system rewrite was introduced

## References

- `references/component-playbooks.md`: behavior, visual state, and adaptation
  patterns for common small and large components
- `references/interaction-states.md`: state contracts and component-specific
  motion choices
- `references/responsive-behavior.md`: narrow layout, touch, zoom, and overlay
  checks
- `references/catalog-workflow.md`: per-component catalog files, build, and
  validation workflow
- `references/component-catalog.md`: broad component inventory and selection
  guide for controls, forms, navigation, feedback, content, overlays, and flows
- `references/design-principles.md`: decision rules for purposeful refinement
- `references/design-quality.md`: product-grounded process for professional, distinctive component concepts
- `references/accessibility.md`: component-level semantics, keyboard, focus,
  contrast, motion, and testing guidance
- `references/component-patterns.md`: composition and state modeling patterns
- `references/button-system.md`: reusable button API, state coverage, and optional tactile finishes
- `references/verification.md`: focused behavior, accessibility, responsive,
  and visual verification loops
- `agents/openai.yaml`: OpenAI skill display metadata and invocation policy
- `catalog/registry.json`: stable catalog IDs and component file paths
- `catalog/components/<id>/`: component TSX, preview, metadata, and notes
- `catalog-shell/`: standalone searchable viewer; `catalog.json` is generated
  from the registry and component metadata
- `scripts/validate-catalog.mjs` and `scripts/build-catalog.mjs`: dependency-free
  catalog checks and viewer-data generation
- `templates/component-spec.md`: detailed component contract template
- `examples/button/`, `examples/input/`, and `examples/dialog/`: runnable,
  framework-neutral component examples
