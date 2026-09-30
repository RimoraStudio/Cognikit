---
name: design-system-architecture
description: Use when building, scaling, auditing, or governing a design system as an engineering product. Triggers on "design system architecture", "design tokens pipeline", "design system governance", "design drift", "component contribution model", "design system versioning", "multi-brand design system", "Figma to code sync", "design system audit", "design system health score", "design system monorepo", "component API design", "design system deprecation", "design system adoption metrics", or any task about the structure, scaling, and maintenance of a design system itself (not the visual style). Covers token architecture, governance models, contribution tiers, versioning, deprecation, drift detection, multi-brand orchestration, Figma-to-code pipelines, CI gates, adoption metrics, and AI-agent readiness.
metadata:
  version: 1.0.0
license: MIT
---

# Design System Architecture: Building, Scaling & Governing the System

> Part of [Cognikit](https://cognikit.com). A kit that gives AI agents cognitive abilities.

This skill is about the **engineering of a design system itself**, not the
visual style it contains. Use a visual design skill for choosing visual
direction (brutalism, minimalist, etc.). This skill focuses on the
engineering, not the aesthetics. Use this skill for the architecture,
governance, token pipeline, contribution model, versioning, drift detection,
and scaling of the system as a product.

## AI execution flow (follow in order)

1. **Assess**: Determine the system's maturity (Step 1 below). Is it
   new, growing, or mature with many consumers?
2. **Architecture**: Design or audit the token pipeline, monorepo
   structure, and component package boundaries (Step 2).
3. **Governance**: Establish or audit the contribution model, decision
   rights, and review tiers (Step 3).
4. **Versioning**: Set up SemVer, changelog, deprecation policy, and
   codemod workflow (Step 4).
5. **Drift detection**: Install CI gates, token validation, and
   component-usage scanning (Step 5).
6. **Adoption**: Measure adoption, coverage, and health score (Step 6).
7. **AI readiness**: Generate `AGENTS.md`, `llms.txt`, and component
   manifests so AI agents build within the system, not around it (Step 7).
8. **Verify**: Run the pre-flight checklist at the bottom of this file.

## When to use

- Building a new design system from scratch (token architecture, package
  structure, governance)
- Scaling an existing system to 10+ consumer teams
- Setting up a Figma-to-code token pipeline
- Establishing a contribution model (who can add components, tokens)
- Versioning and deprecating design system packages
- Detecting and preventing design drift (hardcoded values, reinvented
  components)
- Multi-brand or multi-theme orchestration
- Making a design system AI-agent ready (CLAUDE.md, AGENTS.md, manifests)
- Auditing a design system's health and adoption

## When NOT to use

- Choosing a visual style (brutalism, minimalist, etc.)
- Building individual UI components
- Responsive/adaptive layout decisions

Those are visual design tasks, not system architecture tasks.

## Step 1: Assess maturity

| Stage | Consumers | Tokens | Components | Governance | Action |
|---|---|---|---|---|---|
| New | 0-2 | Ad hoc | 5-20 | None | Build foundation (Step 2) |
| Growing | 3-9 | Some structure | 20-50 | Informal | Add governance (Step 3) |
| Mature | 10+ | Three-tier | 50-200 | Hybrid model | Optimize, drift detect (Step 5) |
| Scaling | 50+ | Multi-brand | 200+ | Federated | Multi-brand orchestration |

## Step 2: Architecture

### Token pipeline

The token pipeline is the contract. Components are replaceable
implementations of a tokenized system.

**Three-tier token architecture (industry standard since W3C DTCG spec,
October 2025):**

1. **Reference (primitive) tokens**: raw values, no opinions.
   `blue.600: #2563EB`, `space.4: 16px`. Names may describe values here
   only. This is the only tier where value-naming is allowed.
2. **Semantic tokens**: meaning and purpose. `color.action.primary:
   {blue.600}`, `color.text.body: {gray.900}`. Name by purpose, never
   value. This is where the design language lives.
3. **Component tokens**: scoped to specific UI. `button.bg.primary:
   {color.action.primary}`. Build this tier only when needed. Most teams
   before Series C only need tiers 1 and 2.

**Rules:**
- Name tokens by purpose, not value. `color.action.primary` is correct.
  `blue-500` as a semantic name is wrong.
- Start with 30-50 tokens covering color, space, type, and radius. A
  400-token vocabulary nobody adopts fails.
- One token source drives Figma, CSS, iOS, and Android without a
  hand-built translation layer (W3C DTCG format).
- Dark mode, theming, and rebranding are token swaps, not rewrites.
- Motion tokens (duration, easing, spring) are part of the system,
  alongside color and type.

See `references/token-architecture.md` for the full pipeline spec,
DTCG format, and Style Dictionary configuration.

### Monorepo structure

```
design-system/
├── package.json              # Root: scripts, dev tooling
├── pnpm-workspace.yaml       # Workspace config
├── figma.config.json         # Figma Code Connect
├── packages/                 # Published packages
│   ├── tokens/               # Design tokens (DTCG JSON)
│   ├── theme/                # Theme engine (token compilation)
│   ├── react/                # React component library
│   ├── icons/                # Icon library
│   ├── utils/                # Shared utilities
│   └── cli/                  # CLI tooling (optional)
├── apps/                     # Applications (not published)
│   ├── docs/                 # Documentation site
│   └── demo/                 # Demo app
├── scripts/                  # Build scripts (token sync, icon gen)
└── .github/workflows/        # CI (lint, test, drift detect, publish)
```

**Rules:**
- Inter-package dependencies use `workspace:*`.
- Public API is the package root export. Internal modules are restricted
  (ESLint `restricted-imports` bans deep imports).
- One publish pipeline per package. Independent versioning per package
  or unified versioning (choose based on release cadence).

See `references/monorepo-structure.md` for detailed package roles,
build pipelines, and publish workflows.

### Component package boundaries

Each component package exports:
- The component (React, Vue, Flutter, etc.)
- TypeScript types / Dart classes
- Props table (documented API)
- Accessibility spec (ARIA patterns, keyboard nav, focus management)
- Motion spec (duration token, easing token, reduced-motion behavior)
- Usage examples
- When to use / when not to use

**Component API rules:**
- Props are typed and documented. No `any` types.
- Variant props use a union type, not boolean combinations.
  `variant: "primary" | "secondary" | "ghost"` not `primary?: boolean,
  secondary?: boolean, ghost?: boolean`.
- Compound components (Button.Icon, Button.Label) for composition over
  prop explosion.
- Forward ref always (React). Expose imperative API only when necessary.
- Default props are token references, not hardcoded values.

See `references/component-api.md` for full API design patterns.

## Step 3: Governance

### Contribution models

| Model | Owner | Scales | Use when |
|---|---|---|---|
| Centralized | Single dedicated team | Slow | System is young, < 5 consumers |
| Federated | Many teams, no single owner | Fast short-term, expensive long-term | Rare. Not recommended. |
| Hybrid (cyclical) | Small core + embedded contributors | Well | 10+ consumers. Almost always right. |

**Hybrid model (recommended for 10+ consumers):**
- Small core team (2-4 people) owns tokens, accessibility review, release
  cadence.
- Embedded contributors from product teams ship components and propose
  changes.
- Core team reviews for consistency. Product teams own domain-specific
  patterns.

Document the model in `CONTRIBUTING.md` at the repo root: who can merge
to main, who can propose components, who decides on tokens, what the SLA
on PR review is.

### Contribution tiers

| Tier | Scope | Review intensity | Who can propose |
|---|---|---|---|
| Core | Tokens, primitives, architecture, policy | Highest | Core team only |
| Federated | Patterns, product-area components, mature variations | Medium | Any team, core review |
| Community | Fixes, docs, examples, minor guidance updates | Light | Anyone, auto-merge for docs |

**Core protects:** decisions that create downstream cost. Token changes,
accessibility behavior, API logic, naming rules, cross-platform
consistency. These are not gatekeeping. They are cost control.

**Community keeps the system from becoming precious.** Documentation
fixes, usage examples, content clarifications should be easy to submit
and easy to merge. If these require a committee, contributors learn that
helping is not worth the effort.

### Decision rights

Answer these in `CONTRIBUTING.md`:
1. Who owns the system roadmap?
2. Who can approve a new component, token, variant, or breaking change?
3. How does a product team request a pattern the system does not cover?
4. What quality gates must a contribution pass before release?
5. How are teams told about changes, migration work, and deprecations?
6. Which data proves the system is used in shipped products?

### Contribution workflow

One path for all changes:
1. **Propose**: submit use case, evidence, affected products, reuse
   potential.
2. **Review**: core team checks overlap with existing patterns, decides
   if it belongs in the system.
3. **Build**: design and code move together. Tokens, states, responsive
   behavior, and accessibility covered.
4. **Document**: when to use, when not to use, common mistakes.
5. **Release**: version note, migration guidance, support window.
6. **Measure**: usage, overrides, issues, feedback inform next release.

See `references/governance.md` for full governance templates.

## Step 4: Versioning

### Semantic versioning

Use SemVer at the package level. `MAJOR.MINOR.PATCH`.

| Bump | When | Migration |
|---|---|---|
| MAJOR | Breaking API change, token rename, removed component | Codemod + migration guide + 6-month deprecation window |
| MINOR | New component, new token, new variant | No migration needed |
| PATCH | Bug fix, accessibility fix, docs update | No migration needed |

### Changelog

Every release ships a changelog. Format:
```
## [1.4.0] - 2026-01-15

### Added
- `DatePicker` component with calendar and input modes
- `motion.duration.slow` token (400ms)

### Changed
- `Button` variant prop now accepts "ghost" (was "text")

### Deprecated
- `Button` variant "text" will be removed in 2.0.0. Use "ghost".

### Fixed
- `Modal` focus trap now works with nested modals
```

### Deprecation policy

Every deprecation ships with:
1. A codemod (automated migration script).
2. A six-month support window.
3. Console warnings in development.
4. Migration documentation.

**Deprecation timeline:**
- Month 0: Mark as deprecated. Console warning. Codemod released.
- Month 3: Reminder. Usage metrics shared with teams still on old API.
- Month 6: Remove in next MAJOR release.

See `references/versioning.md` for codemod templates and deprecation
workflows.

## Step 5: Drift detection

Design drift is when code uses hardcoded values or reinvents components
instead of using the design system. AI agents are the biggest source of
drift in 2026.

### Drift types

| Drift type | Example | Detection |
|---|---|---|
| Hardcoded tokens | `color: #3b82f6` instead of `color.brand.primary` | Regex / AST scan for raw values |
| Reinvented components | Custom `<div>` button instead of `<Button>` | DOM structure matching against component library |
| Magic breakpoints | `@media (min-width: 768px)` not in the system | Media query scan |
| Prop misuse | `<Button variant="text">` (deprecated) | TypeScript / prop type check |
| Token aliasing | Background color token used for text | Semantic token usage audit |
| Orphaned components | Component in code, missing from Figma/Storybook | Cross-reference scan |
| Unused tokens | Token defined, never referenced | Token usage scan |
| Naming drift | Inconsistent naming across codebase | Naming convention linter |
| Framework sprawl | Multiple UI frameworks competing | Import scan |
| Accessibility gaps | Missing ARIA, focus management | a11y audit |

### CI gates

Install drift detection in CI. Every PR is scanned before merge.

```yaml
# .github/workflows/drift-check.yml
name: Design System Drift Check
on: [pull_request]
jobs:
  drift:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm run tokens:validate
      - run: npm run drift:check
      - run: npm run a11y:audit
```

**Gate rules:**
- Hardcoded tokens: error (block merge).
- Reinvented components: warning (comment on PR).
- Accessibility gaps: error (block merge).
- Deprecated patterns: warning (comment with migration link).
- Coverage delta: comment on PR (show adoption change).

### Health score

Score the system 0-100 based on:
- Token adoption (percentage of styles using tokens vs hardcoded)
- Component adoption (percentage of UI using system components vs custom)
- Accessibility compliance (percentage passing WCAG AA)
- Documentation coverage (percentage of components with docs)
- Test coverage (percentage of components with tests)
- Drift trend (improving or worsening over time)

See `references/drift-detection.md` for scanner setup, CI configuration,
and health score calculation.

## Step 6: Adoption metrics

Track these to prove the system is used:

| Metric | What it measures | Target |
|---|---|---|
| Adoption rate | % of product files/repos using approved libraries | > 80% |
| Component coverage | % of UI built with system components | > 70% |
| Token coverage | % of styles using tokens vs hardcoded | > 90% |
| Drift rate | New drift instances per sprint | < 5 |
| Time to adopt | Time for a new team to start using the system | < 1 sprint |
| PR review SLA | Time from proposal to decision | < 5 days |
| Component reuse | Average usage count per component | > 3 |

Report quarterly. Treat the system as a product with users (internal
teams), not infrastructure.

## Step 7: AI-agent readiness

AI agents (Claude Code, Cursor, Windsurf, Codex) must build within the
system, not around it. Make the system AI-readable.

### AGENTS.md

Write an `AGENTS.md` at the repo root that tells AI agents:
- Which components exist and when to use them.
- Which tokens to reference (never hardcode values).
- Which patterns are approved vs banned.
- Where the documentation lives.
- How to contribute new components.

### Component manifest

Generate a machine-readable manifest of all components, tokens, and
patterns. AI agents read this to know what exists before generating new
code.

```json
{
  "version": "1.4.0",
  "tokens": ["color.action.primary", "color.text.body", "space.4", ...],
  "components": [
    {
      "name": "Button",
      "props": ["variant", "size", "disabled", "loading"],
      "variants": ["primary", "secondary", "ghost", "destructive"],
      "import": "@designsystem/react"
    }
  ]
}
```

### CLAUDE.md / llms.txt

For AI tools that read `CLAUDE.md` or `llms.txt`:
- List every available component with a one-line description.
- List every token with its semantic name.
- State the rule: "If a component exists, use it. Do not reinvent. If a
  token exists, reference it. Do not hardcode values."
- State the drift policy: "Hardcoded values and reinvented components
  are bugs."

See `references/ai-readiness.md` for full templates.

## References

Load these for detailed guidance. All files exist under `references/`.

| File | What's inside | When to load |
|---|---|---|
| `token-architecture.md` | Three-tier token pipeline, DTCG format, Style Dictionary config, Figma-to-code sync | When building or auditing the token pipeline |
| `monorepo-structure.md` | Package roles, workspace config, build pipelines, publish workflows | When structuring the design system repo |
| `component-api.md` | Component API design patterns, prop types, compound components, variant matrices | When designing component APIs |
| `governance.md` | Contribution model templates, decision rights, review tiers, CONTRIBUTING.md template | When establishing or auditing governance |
| `versioning.md` | SemVer policy, changelog format, deprecation timeline, codemod templates | When versioning or deprecating |
| `drift-detection.md` | Drift types, scanner setup, CI gates, health score calculation | When installing drift detection |
| `ai-readiness.md` | AGENTS.md, CLAUDE.md, llms.txt, component manifest templates | When making the system AI-agent ready |

## Related skills

- `design-systems`: for choosing and applying the visual direction this architecture serves
- `code-review`: review component API and token pipeline diffs before merge

## Pre-flight checklist

Before considering a design system architecture task complete:

- [ ] Token architecture is three-tier (reference, semantic, component)
- [ ] Tokens named by purpose, not value
- [ ] Token pipeline drives all platforms from one source
- [ ] Monorepo structure with clear package boundaries
- [ ] Component APIs are typed, documented, variant-based
- [ ] Contribution model documented in CONTRIBUTING.md
- [ ] Contribution tiers defined (Core, Federated, Community)
- [ ] Decision rights answered (who owns what)
- [ ] SemVer versioning with changelog per release
- [ ] Deprecation policy with codemod and 6-month window
- [ ] Drift detection installed in CI
- [ ] Hardcoded tokens block merge (error gate)
- [ ] Accessibility gaps block merge (error gate)
- [ ] Health score tracked (0-100)
- [ ] Adoption metrics reported quarterly
- [ ] AGENTS.md written for AI agents
- [ ] Component manifest generated
- [ ] CLAUDE.md / llms.txt states the drift policy
