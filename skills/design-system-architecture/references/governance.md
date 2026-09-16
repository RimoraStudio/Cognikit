# Governance

Contribution models, decision rights, review tiers, CONTRIBUTING.md template, and review SLAs for a design system.

## CONTRIBUTING.md template

```md
# Contributing to the Design System

## Contribution model

This system uses a **hybrid contribution model**. A small core team owns
tokens, accessibility, and release cadence. Product teams contribute
components and patterns. Anyone can contribute fixes, docs, and examples.

## Contribution tiers

| Tier | Scope | Review intensity | Who can propose |
|---|---|---|---|
| Core | Tokens, primitives, architecture, policy | Highest (2 core reviewers) | Core team only |
| Federated | Patterns, product-area components, mature variations | Medium (1 core + 1 domain) | Any team, core review |
| Community | Fixes, docs, examples, minor guidance updates | Light (1 reviewer) | Anyone, auto-merge for docs |

## Decision rights

1. **Roadmap**: Core team owns the system roadmap, reviewed quarterly.
2. **New component/token/variant**: Core team approves. Any team may propose.
3. **Breaking change**: Core team approves. Requires codemod and 6-month deprecation window.
4. **Pattern not covered**: Open a "pattern request" issue. Core team triages within 5 business days.
5. **Quality gates**: All contributions must pass lint, tests, a11y audit, and drift check.
6. **Communication**: Changes announced via changelog, Slack #designsystem, and quarterly newsletter.
7. **Adoption proof**: Usage data collected via telemetry, reported quarterly.

## PR review SLA

| Tier | First response | Decision | Merge |
|---|---|---|---|
| Core | 2 business days | 5 business days | After approval + CI green |
| Federated | 3 business days | 7 business days | After approval + CI green |
| Community | 1 business day | 2 business days | Auto-merge for docs/typos |

## Quality gates

All PRs must pass:
- [ ] Lint (ESLint, Prettier)
- [ ] Type check (tsc --noEmit)
- [ ] Unit tests (90% coverage on changed lines)
- [ ] Accessibility audit (axe-core, zero violations)
- [ ] Drift check (no hardcoded tokens, no reinvented components)
- [ ] Token validation (if tokens changed)
- [ ] Visual regression (Chromatic or Percy, if UI changed)
- [ ] Documentation updated (props table, examples)

## Contribution workflow

1. **Propose**: Open an issue with use case, evidence, affected products, reuse potential.
2. **Review**: Core team checks overlap with existing patterns. Decides if it belongs in the system.
3. **Build**: Design and code move together. Tokens, states, responsive behavior, accessibility covered.
4. **Document**: When to use, when not to use, common mistakes. Props table and examples.
5. **Release**: Version note, migration guidance, support window.
6. **Measure**: Usage, overrides, issues, feedback inform next release.

## Onboarding new teams

1. Add the team lead to the #designsystem Slack channel.
2. Schedule a 1-hour onboarding session (system overview, install, first component).
3. Provide a starter template repo with tokens and components pre-installed.
4. Assign a core team member as liaison for the first sprint.
5. Track adoption metrics after sprint 1 (target: first component shipped).
```

## Contribution model comparison

| Model | Owner | Scales | Pros | Cons | Use when |
|---|---|---|---|---|---|
| Centralized | Single dedicated team | Slow | High consistency, clear ownership | Bottleneck, detached from product needs | System is young, fewer than 5 consumers |
| Federated | Many teams, no single owner | Fast short-term | Fast, embedded | Inconsistent, expensive long-term, no steward | Rare. Not recommended. |
| Hybrid (cyclical) | Small core + embedded contributors | Well | Balance of consistency and speed | Requires clear governance docs | 10+ consumers. Almost always right. |

## Contribution tiers with examples

### Core tier

Scope: tokens, primitives, architecture, policy.

Examples:
- Adding `motion.duration.slow` token (affects all platforms).
- Changing `color.action.primary` semantic token (affects brand identity).
- Modifying the contribution model or deprecation policy.
- Adding a new accessibility requirement to the quality gates.

Review: 2 core reviewers required. Changeset must include migration guidance if breaking.

### Federated tier

Scope: patterns, product-area components, mature variations.

Examples:
- Adding a `DatePicker` component (product team needs it, reuse potential high).
- Adding a `DataTable` variant for dense financial displays.
- Proposing a new `EmptyState` pattern with illustration support.

Review: 1 core reviewer + 1 domain reviewer (from the proposing team or a related team).

### Community tier

Scope: fixes, docs, examples, minor guidance updates.

Examples:
- Fixing a typo in the `Button` documentation.
- Adding a usage example for `Modal` with nested forms.
- Fixing a focus ring color that does not meet contrast in dark mode.
- Clarifying the "when to use" guidance for `Card`.

Review: 1 reviewer. Auto-merge for docs and typos after CI passes.

## Decision rights template

| Decision | Owner | Input from | Escalation |
|---|---|---|---|
| System roadmap | Core team | All teams (quarterly survey) | Design system steering committee |
| New token | Core team | Proposing team | Core team lead |
| New component | Core team | Proposing team + domain experts | Core team lead |
| Breaking change | Core team | All affected teams (6-month notice) | Steering committee |
| Accessibility policy | Core team | A11y specialists | A11y lead |
| Deprecation | Core team | Usage metrics | Core team lead |
| Visual style change | Core team + Design lead | Brand team | Design lead |

## PR review SLA template

```md
## Review SLA

| Tier | First response | Decision | Notes |
|---|---|---|---|
| Core | 2 business days | 5 business days | Requires 2 core reviewers |
| Federated | 3 business days | 7 business days | Requires 1 core + 1 domain |
| Community | 1 business day | 2 business days | Auto-merge for docs |

If the SLA is missed, the contributor escalates to the core team lead.
Repeated SLA misses trigger a process review.
```

## Handling exceptions and override requests

Sometimes a product team needs behavior the system does not cover. The override process keeps this visible and tracked.

1. **File an override request**: Open an issue tagged `override`. Describe what is needed, why the system does not cover it, and the expected lifetime.
2. **Core team triage**: Within 5 business days, core team decides: accept as temporary override, add to system (federated tier), or reject with alternative.
3. **If accepted**: The override is documented in an `overrides.md` file with an expiry date (max 6 months). The code uses a clearly marked escape hatch.
4. **Review**: At expiry, the override is reviewed. If the system now covers the need, the override is removed. If not, it is renewed or the gap is added to the roadmap.

```md
# overrides.md

| Team | Component | Reason | Escape hatch | Expires | Status |
|---|---|---|---|---|---|
| Billing | InvoiceTable | Dense financial grid not covered by DataTable | `<InvoiceTable>` (local) | 2026-06-01 | Active |
```

## Quarterly review template

```md
# Q1 2026 Design System Review

## Adoption metrics
| Metric | Target | Actual | Trend |
|---|---|---|---|
| Adoption rate | > 80% | 84% | Up 6% |
| Component coverage | > 70% | 68% | Up 4% |
| Token coverage | > 90% | 91% | Flat |
| Drift rate | < 5/sprint | 3/sprint | Down 2 |
| PR review SLA | < 5 days | 4.2 days | Met |
| Component reuse | > 3 | 3.8 | Up 0.3 |

## Wins
- DatePicker shipped, adopted by 4 teams.
- Token coverage crossed 90% threshold.
- Drift rate below target for 2 consecutive sprints.

## Gaps
- Component coverage 2 points below target (DataTable density variants needed).
- 3 overrides still active past expiry (follow up needed).

## Roadmap adjustments
- Prioritize DataTable dense variant (Q2).
- Schedule override review for Billing InvoiceTable.
- Begin motion token adoption audit (Q2).
```
