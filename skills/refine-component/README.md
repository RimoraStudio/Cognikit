# Refine Component

Human-facing guide to the `refine-component` Agent Skill. The skill helps
developers and AI agents improve existing UI components, from buttons and
fields to dialogs, navigation, and data-heavy components, without casually
breaking their behavior.

## Use it for

- Polishing an existing button, input, dropdown, dialog, or sidebar
- Fixing interaction states, keyboard behavior, focus, or responsive issues
- Auditing a component library and writing reusable component contracts
- Building a browsable component inventory from a validated JSON catalog

It is not a replacement for choosing a whole product design system. Use
`design-systems` for broad visual direction, `mobile-app-design` for
platform-specific mobile design, or `dashboard-ui` for dashboard-level work.

## How to use

Install the skill:

```sh
npx skills add RimoraStudio/cognikit/tree/main/skills/refine-component --global --yes
```

Example requests:

- “Make this save button feel tactile when pressed, but keep keyboard focus obvious.”
- “Make the button grow slightly on hover and shrink on press, without a gradient or layout jump.”
- “Give this required field a clear invalid state and a short shake on failed submit, without relying on motion alone.”
- “Follow component `RC-ACT-001` for the save action, adapting it to this screen and preserving the keyboard and pending behavior.”
- “Give this dialog a restrained open/close transition; Escape must still close it and restore focus to the trigger.”
- “Audit our component library and produce behavior specs for the controls.”
- “Build the component catalog from its per-component TSX, metadata, and notes files.”

The agent should inspect the existing implementation and conventions first,
preserve the component contract, make focused changes, and report verification
evidence. Use `SKILL.md` for the full agent workflow.

## Package contents

- `SKILL.md`: agent triggers, execution flow, guardrails, and checklist
- `agents/openai.yaml`: OpenAI display metadata and invocation policy
- `catalog/registry.json`: source registry for stable IDs and per-component paths
- `catalog/components/<id>/`: separate `component.tsx`, `preview.tsx`, `metadata.json`, and `notes.md` files for each component
- `catalog-shell/`: searchable standalone catalog viewer with copyable AI instructions and source panels; run the build before viewing
- `scripts/validate-catalog.mjs` and `scripts/build-catalog.mjs`: dependency-free validation and catalog generation
- `references/`: component patterns, design principles, accessibility, and verification
- `references/interaction-states.md`, `references/responsive-behavior.md`, and `references/catalog-workflow.md`: state/motion, responsive, and catalog guidance
- `references/button-system.md`: reusable button variants, states, and optional edge-lit / sheen treatments
- `references/design-quality.md`: professional, product-grounded component concepts and finish criteria
- `templates/component-spec.md`: reusable detailed component contract
- `examples/button/`, `examples/input/`, and `examples/dialog/`: runnable framework-neutral HTML examples, kept separate from React-specific catalog TSX
- `evals/evals.json`: sample prompts used to check skill behavior

Build and validate the catalog from the skill package root:

```sh
node scripts/validate-catalog.mjs
node scripts/build-catalog.mjs
```

Then serve `catalog-shell/` over HTTP because browsers commonly block `fetch()`
for local files. The generated `catalog-shell/catalog.json` is derived from
`catalog/registry.json` and each component's metadata; do not edit it by hand.

## Scope and safety

The catalog is a behavior and implementation aid, not proof that a component
is accessible or compliant. Verify real keyboard, screen-reader, touch, and
responsive behavior with the project's available tooling. The standalone
viewer renders catalog values as text and should not be changed to inject
untrusted values as HTML.

## License

MIT. See the repository license.
