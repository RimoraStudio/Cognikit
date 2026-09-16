# Versioning and Deprecation

SemVer policy for design systems, changelog format, deprecation timeline, codemod templates, and release workflows.

## SemVer policy for design systems

Use SemVer at the package level: `MAJOR.MINOR.PATCH`.

| Bump | When | Migration required | Codemod | Deprecation window |
|---|---|---|---|---|
| MAJOR | Breaking API change, token rename, removed component | Yes | Yes | 6 months |
| MINOR | New component, new token, new variant | No | No | None |
| PATCH | Bug fix, accessibility fix, docs update | No | No | None |

### What constitutes MAJOR vs MINOR vs PATCH

**MAJOR (breaking changes):**
- Removing a component or variant.
- Renaming a token (`color.action.primary` to `color.action.brand`).
- Changing a prop type (`variant: string` to `variant: enum`).
- Changing a prop name (`onSelect` to `onChange`).
- Changing default behavior that affects existing consumers (e.g., default size changes).
- Removing a CSS class that consumers override.

**MINOR (additive, non-breaking):**
- Adding a new component.
- Adding a new variant to an existing component.
- Adding a new token.
- Adding a new prop with a default that preserves existing behavior.
- Adding a new sub-component to a compound component.

**PATCH (fixes, no API change):**
- Bug fixes (focus trap, rendering edge cases).
- Accessibility fixes (ARIA attributes, keyboard nav).
- Documentation updates.
- Internal refactoring with no public API change.
- Token value adjustments that do not change the semantic name.

## Changelog format (Keep a Changelog standard)

Every release ships a changelog in `CHANGELOG.md`.

```md
# Changelog

## [1.5.0] - 2026-02-15

### Added
- `DatePicker` component with calendar and input modes
- `motion.duration.slow` token (400ms)
- `Button` variant "destructive" (was only in Dialog before)

### Changed
- `Button` variant "text" renamed to "ghost" (see deprecation below)
- `Modal` now traps focus correctly with nested modals

### Deprecated
- `Button` variant "text" will be removed in 2.0.0. Use "ghost". Run `npx @designsystem/codemod button-variant-text-to-ghost`.

### Fixed
- `Modal` focus trap now works with nested modals
- `Input` error text now meets WCAG AA contrast in dark mode

### Security
- Updated `react-aria` dependency to patch CVE-2026-1234
```

## Deprecation timeline (6-month window)

| Month | Action | Communication |
|---|---|---|
| 0 | Mark as deprecated. Console warning in dev. Codemod released. | Changelog, Slack, newsletter |
| 1 | Usage metrics collected. Teams still on old API identified. | Direct message to team leads |
| 3 | Reminder sent. Usage metrics shared with teams still on old API. | Slack, quarterly review |
| 5 | Final warning. Teams must confirm migration plan. | Direct message, steering committee |
| 6 | Remove in next MAJOR release. | Changelog, migration guide |

## Codemod templates (jscodeshift)

Codemods automate migration. Ship one with every deprecation.

```js
// codemods/button-variant-text-to-ghost.cjs
// npx jscodeshift -t codemods/button-variant-text-to-ghost.cjs src/

module.exports = function (fileInfo, api) {
  const j = api.jscodeshift;
  const root = j(fileInfo.source);

  root
    .find(j.JSXOpeningElement, { name: { name: "Button" } })
    .find(j.JSXAttribute, { name: { name: "variant" } })
    .forEach((path) => {
      const value = path.node.value;
      if (
        value &&
        value.type === "StringLiteral" &&
        value.value === "text"
      ) {
        j(path).replaceWith(
          j.jsxAttribute(
            j.jsxIdentifier("variant"),
            j.stringLiteral("ghost")
          )
        );
      }
    });

  return root.toSource({ quote: "single" });
};
```

### Codemod for token renames

```js
// codemods/rename-action-primary.cjs
module.exports = function (fileInfo, api) {
  const j = api.jscodeshift;
  const root = j(fileInfo.source);

  root
    .find(j.Literal, { value: "var(--color-action-primary)" })
    .forEach((path) => {
      j(path).replaceWith(j.literal("var(--color-action-brand)"));
    });

  return root.toSource();
};
```

## Migration guide template

```md
# Migration Guide: 1.x to 2.0

## Overview
Version 2.0 removes all deprecated APIs from 1.x. Run the codemods below before upgrading.

## Prerequisites
- Design system 1.5.0 or later
- Node 20+

## Step 1: Run codemods

\`\`\`bash
npx @designsystem/codemod button-variant-text-to-ghost
npx @designsystem/codemod rename-action-primary
\`\`\`

## Step 2: Update dependencies

\`\`\`bash
pnpm add @designsystem/react@^2.0.0 @designsystem/theme@^2.0.0
\`\`\`

## Step 3: Review manual changes

The codemods handle 95% of migrations. The following require manual review:

| Change | Codemod coverage | Manual action |
|---|---|---|
| Button variant "text" to "ghost" | 100% | None |
| Token `color.action.primary` to `color.action.brand` | 90% | Check inline styles |
| Removed `Card.Compact` | 80% | Replace with `Card size="sm"` |

## Step 4: Verify
- Run `pnpm test`
- Run `pnpm drift:check`
- Run visual regression (Chromatic)

## Breaking changes
- `Button` variant "text" removed. Use "ghost".
- `Card.Compact` removed. Use `<Card size="sm">`.
- Token `color.action.primary` renamed to `color.action.brand`.
- `Modal` prop `isOpen` renamed to `open`.
```

## Console warning patterns

Deprecated APIs emit console warnings in development only. Never in production.

```tsx
function warnDeprecated(oldName: string, newName: string, removalVersion: string) {
  if (process.env.NODE_ENV !== "production") {
    console.warn(
      `[DesignSystem] "${oldName}" is deprecated and will be removed in ${removalVersion}. ` +
      `Use "${newName}" instead. See migration guide: https://designsystem.dev/migrate`
    );
  }
}

// In the component
function Button({ variant, ...props }: ButtonProps) {
  if (variant === "text" && process.env.NODE_ENV !== "production") {
    warnDeprecated('Button variant "text"', 'Button variant "ghost"', "2.0.0");
  }
  // ...
}
```

## Version synchronization across packages

### Independent versioning

Each package versions independently. The `@designsystem/tokens` package may be at 1.2.0 while `@designsystem/react` is at 1.4.0. Use `changeset` to track which packages need bumps.

### Unified versioning

All packages share one version. Simpler for consumers (one version to track). Use when packages release together.

```json
// .changeset/config.json
{
  "fixed": [
    "@designsystem/tokens",
    "@designsystem/theme",
    "@designsystem/react",
    "@designsystem/icons",
    "@designsystem/utils"
  ]
}
```

## Release workflow (GitHub Releases)

```yaml
# .github/workflows/release.yml
name: Release
on:
  push:
    branches: [main]
concurrency: release
jobs:
  release:
    runs-on: ubuntu-latest
    permissions:
      contents: write
      pull-requests: write
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - uses: pnpm/action-setup@v2
      - run: pnpm install --frozen-lockfile
      - run: pnpm build
      - name: Create release
        run: pnpm changeset publish
        env:
          NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      - name: Create GitHub release
        run: pnpm changeset tag
```

## Backward compatibility rules

1. Never remove an API without a 6-month deprecation window.
2. Never change a default behavior without a MAJOR bump.
3. Never change a token semantic name without a codemod.
4. New props must have defaults that preserve existing behavior.
5. New variants must not change the rendering of existing variants.
6. CSS class names that consumers may override are part of the public API. Removing or renaming them is a MAJOR change.
7. Accessibility behavior changes that affect screen reader output are MAJOR changes (consumers may have trained users on specific patterns).
