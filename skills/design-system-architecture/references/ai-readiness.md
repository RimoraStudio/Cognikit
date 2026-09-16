# AI Agent Readiness

Templates and schemas for making a design system discoverable and usable by AI agents (Claude Code, Cursor, Windsurf, Codex).

## AGENTS.md template (full example)

```md
# AGENTS.md

This file guides AI agents working in this codebase. Read it before generating any UI code.

## Core rules

1. If a component exists in the design system, use it. Do not reinvent it with raw HTML.
2. If a token exists, reference it. Do not hardcode hex, px, or rem values.
3. Hardcoded values and reinvented components are bugs. Fix them, do not ship them.
4. Every component must pass the accessibility spec (ARIA, keyboard, focus).
5. Every animation must respect prefers-reduced-motion.

## Available components

| Component | Import | When to use |
|---|---|---|
| Button | `@designsystem/react` | Primary actions, form submits |
| Input | `@designsystem/react` | Text entry, form fields |
| Select | `@designsystem/react` | Choosing from a list |
| Modal | `@designsystem/react` | Focused tasks, confirmations |
| Card | `@designsystem/react` | Grouping related content |
| DataTable | `@designsystem/react` | Tabular data with sorting, pagination |
| DatePicker | `@designsystem/react` | Date selection |
| Toast | `@designsystem/react` | Transient notifications |
| Tabs | `@designsystem/react` | Switching views within a page |
| Menu | `@designsystem/react` | Action menus, dropdowns |

## Available tokens

| Token | CSS variable | Purpose |
|---|---|---|
| color.action.primary | `--color-action-primary` | Primary action background |
| color.text.body | `--color-text-body` | Body text color |
| color.surface.primary | `--color-surface-primary` | Card and panel background |
| space.4 | `--space-4` | Standard padding (16px) |
| radius.md | `--radius-md` | Standard border radius (6px) |
| motion.duration.fast | `--motion-duration-fast` | Hover and press transitions |
| motion.easing.standard | `--motion-easing-standard` | Standard easing curve |

Full token list: `packages/tokens/build/tokens.css`

## Approved patterns

- Use compound components for flexible composition (Card.Header, Card.Body, Card.Footer).
- Use union variant props (`variant="primary"`), not boolean combinations.
- Use forward ref on all interactive components.
- Default props must reference tokens, not hardcoded values.

## Banned patterns

- Raw `<button onClick>` with inline styles. Use `<Button>`.
- Hardcoded `color: #3b82f6`. Use `var(--color-action-primary)`.
- Hardcoded `padding: 16px`. Use `var(--space-4)`.
- `@media (min-width: 768px)` not from the system. Use breakpoint tokens.
- Boolean variant props (`primary?: boolean`). Use union types.

## Documentation

- Component docs: `apps/docs/src/content/components/`
- Token docs: `apps/docs/src/content/tokens/`
- Props tables: in each component MDX file

## How to contribute a new component

1. Open a proposal issue with use case and reuse potential.
2. Core team reviews (see CONTRIBUTING.md).
3. Build with tokens, accessibility spec, and motion spec.
4. Document props table, examples, when to use, when not to use.
5. Add to the component manifest (`packages/react/manifest.json`).
6. Update this file's component table.
```

## CLAUDE.md template (full example)

```md
# CLAUDE.md

## Design system rules

This project uses a design system. Follow these rules when generating code.

### Components
- Import from `@designsystem/react`. Do not write custom components that duplicate existing ones.
- Check the component manifest at `packages/react/manifest.json` before creating any new component.
- If a component exists, use it. If it does not, propose adding it via the contribution process.

### Tokens
- Reference tokens via CSS variables: `var(--color-action-primary)`.
- Never hardcode hex colors, pixel values, or rem values.
- Token list: `packages/tokens/build/tokens.css`.

### Drift policy
- Hardcoded values and reinvented components are bugs.
- If you encounter them in existing code, flag them in a comment and create an issue.
- Do not introduce new drift in generated code.

### Accessibility
- All interactive components must support keyboard navigation.
- All interactive components must have visible focus states.
- Use semantic HTML. Add ARIA only when semantic HTML is insufficient.

### Motion
- Use motion tokens for all animations: `var(--motion-duration-fast)`, `var(--motion-easing-standard)`.
- Respect `prefers-reduced-motion`. Disable or shorten animations when it matches.
```

## llms.txt template (full example)

```txt
# Design System

> A component library and token system for building consistent UI.

## Core principle
If a component exists, use it. Do not reinvent. If a token exists, reference it. Do not hardcode values. Hardcoded values and reinvented components are bugs.

## Components
- Button: Primary actions, form submits. Import: @designsystem/react. Props: variant (primary|secondary|ghost|destructive), size (sm|md|lg), disabled, loading.
- Input: Text entry, form fields. Import: @designsystem/react. Props: label, error, value, onChange.
- Select: Choosing from a list. Import: @designsystem/react. Props: value, options, onChange.
- Modal: Focused tasks, confirmations. Import: @designsystem/react. Props: open, onClose, title.
- Card: Grouping related content. Import: @designsystem/react. Compound: Card.Header, Card.Body, Card.Footer.
- DataTable: Tabular data with sorting, pagination. Import: @designsystem/react. Props: columns, data, sortable.
- DatePicker: Date selection. Import: @designsystem/react. Props: value, onChange, minDate, maxDate.
- Toast: Transient notifications. Import: @designsystem/react. Props: message, variant, duration.
- Tabs: Switching views within a page. Import: @designsystem/react. Compound: Tabs.List, Tabs.Tab, Tabs.Panel.
- Menu: Action menus, dropdowns. Import: @designsystem/react. Props: trigger, items.

## Tokens
- color.action.primary (--color-action-primary): Primary action background.
- color.text.body (--color-text-body): Body text color.
- color.surface.primary (--color-surface-primary): Card and panel background.
- space.4 (--space-4): Standard padding (16px).
- radius.md (--radius-md): Standard border radius (6px).
- motion.duration.fast (--motion-duration-fast): Hover and press transitions.
- motion.easing.standard (--motion-easing-standard): Standard easing curve.

## Links
- Documentation: https://designsystem.dev
- Component manifest: https://designsystem.dev/manifest.json
- Storybook: https://designsystem.dev/storybook
- Changelog: https://github.com/org/design-system/blob/main/CHANGELOG.md
```

## Component manifest JSON schema

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "Design System Component Manifest",
  "type": "object",
  "required": ["version", "components"],
  "properties": {
    "version": { "type": "string", "pattern": "^\\d+\\.\\d+\\.\\d+$" },
    "components": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["name", "import", "props", "variants"],
        "properties": {
          "name": { "type": "string" },
          "import": { "type": "string" },
          "description": { "type": "string" },
          "props": {
            "type": "array",
            "items": {
              "type": "object",
              "required": ["name", "type"],
              "properties": {
                "name": { "type": "string" },
                "type": { "type": "string" },
                "default": {},
                "required": { "type": "boolean" },
                "description": { "type": "string" }
              }
            }
          },
          "variants": {
            "type": "array",
            "items": { "type": "string" }
          },
          "compound": {
            "type": "array",
            "items": { "type": "string" }
          },
          "accessibility": { "type": "string" },
          "motion": { "type": "string" }
        }
      }
    }
  }
}
```

### Example component manifest

```json
{
  "version": "1.4.0",
  "components": [
    {
      "name": "Button",
      "import": "@designsystem/react",
      "description": "Primary actions, form submits",
      "props": [
        { "name": "variant", "type": "\"primary\" | \"secondary\" | \"ghost\" | \"destructive\"", "default": "\"primary\"" },
        { "name": "size", "type": "\"sm\" | \"md\" | \"lg\"", "default": "\"md\"" },
        { "name": "disabled", "type": "boolean", "default": "false" },
        { "name": "loading", "type": "boolean", "default": "false" }
      ],
      "variants": ["primary", "secondary", "ghost", "destructive"],
      "compound": ["Button.Icon", "Button.Label"],
      "accessibility": "role=button, aria-disabled when disabled, Enter/Space activates",
      "motion": "hover: motion.duration.fast, press: scale(0.98)"
    }
  ]
}
```

## Token manifest JSON schema

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "Design System Token Manifest",
  "type": "object",
  "required": ["version", "tokens"],
  "properties": {
    "version": { "type": "string" },
    "tokens": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["name", "type", "value"],
        "properties": {
          "name": { "type": "string", "description": "Semantic name, e.g. color.action.primary" },
          "type": { "type": "string", "enum": ["color", "dimension", "fontFamily", "fontWeight", "duration", "cubicBezier", "shadow", "border"] },
          "value": { "type": "string", "description": "CSS variable reference or raw value" },
          "cssVariable": { "type": "string" },
          "darkModeValue": { "type": "string" },
          "description": { "type": "string" }
        }
      }
    }
  }
}
```

### Example token manifest

```json
{
  "version": "1.4.0",
  "tokens": [
    {
      "name": "color.action.primary",
      "type": "color",
      "value": "#2563EB",
      "cssVariable": "--color-action-primary",
      "darkModeValue": "#3B82F6",
      "description": "Primary action background"
    },
    {
      "name": "space.4",
      "type": "dimension",
      "value": "16px",
      "cssVariable": "--space-4",
      "description": "Standard padding"
    }
  ]
}
```

## Pattern manifest

Patterns document composed solutions (e.g., "form layout", "empty state"). AI agents use these to assemble multi-component solutions.

```json
{
  "version": "1.4.0",
  "patterns": [
    {
      "name": "FormLayout",
      "description": "Standard form with labels, validation, and submit",
      "components": ["Form", "Input", "Select", "Button"],
      "example": "<Form onSubmit={handleSubmit}><FormField label=\"Email\"><Input type=\"email\" /></FormField><Button type=\"submit\">Save</Button></Form>",
      "accessibility": "Labels associated, error text with role=alert, focus on first error"
    },
    {
      "name": "EmptyState",
      "description": "No data available with illustration and action",
      "components": ["Card", "Button", "Illustration"],
      "example": "<Card><Card.Body><Illustration name=\"empty\" /><Heading>No results</Heading><Button>Clear filters</Button></Card.Body></Card>"
    }
  ]
}
```

## How AI agents discover and use the system

1. **AGENTS.md**: Agent reads this first. Learns rules, available components, banned patterns.
2. **Component manifest**: Agent checks `manifest.json` before creating any component. If it exists, use it.
3. **Token manifest**: Agent references tokens by CSS variable. Never hardcodes values.
4. **Pattern manifest**: Agent uses patterns for multi-component solutions.
5. **CLAUDE.md / llms.txt**: Agent-specific files reinforce the rules in the agent's context.

## Drift policy for AI-generated code

AI agents are the biggest source of drift in 2026. Enforce these rules:

1. AI-generated code must pass the same drift gates as human code.
2. If an agent generates a hardcoded value, the CI gate blocks the PR.
3. If an agent reinvents a component, the CI gate comments on the PR with the correct component to use.
4. AGENTS.md and CLAUDE.md explicitly state: "Hardcoded values and reinvented components are bugs."
5. The component manifest is the source of truth. If a component is not in the manifest, the agent should propose adding it, not build a one-off.

## MCP server integration for design system queries

An MCP (Model Context Protocol) server lets AI agents query the design system at runtime instead of relying on static files.

```json
// mcp-config.json
{
  "mcpServers": {
    "designsystem": {
      "command": "npx",
      "args": ["@designsystem/mcp-server"],
      "env": {
        "MANIFEST_PATH": "packages/react/manifest.json",
        "TOKENS_PATH": "packages/tokens/build/tokens.css"
      }
    }
  }
}
```

### MCP server tools

| Tool | Description | Example query |
|---|---|---|
| `get_component` | Returns component props, variants, examples | `get_component("Button")` |
| `search_components` | Searches by use case description | `search_components("date selection")` |
| `get_token` | Returns token value and CSS variable | `get_token("color.action.primary")` |
| `search_tokens` | Searches by purpose description | `search_tokens("primary action background")` |
| `get_pattern` | Returns a pattern with example code | `get_pattern("FormLayout")` |
| `validate_usage` | Checks if a value or component is valid | `validate_usage("#3b82f6")` returns "Use var(--color-action-primary)" |

## Self-documenting components for AI consumption

Components should include JSDoc comments that AI agents can read directly.

```tsx
/**
 * Button triggers an action when clicked.
 *
 * @example
 * <Button variant="primary" onClick={handleSave}>Save</Button>
 *
 * @example
 * <Button variant="ghost" size="sm">
 *   <Button.Icon><PlusIcon /></Button.Icon>
 *   <Button.Label>Add item</Button.Label>
 * </Button>
 *
 * @accessibility
 * - role: button (native)
 * - keyboard: Enter and Space activate
 * - focus: visible ring via :focus-visible
 * - aria-disabled: true when disabled
 *
 * @motion
 * - hover: background-color transition, motion.duration.fast
 * - press: scale(0.98), motion.duration.fast
 * - reduced-motion: all transitions disabled
 *
 * @tokens
 * - background: var(--color-action-primary)
 * - text: var(--color-text-on-primary)
 * - padding: var(--space-2) var(--space-4)
 * - radius: var(--radius-md)
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", ...props }, ref) => { /* ... */ }
);
```
