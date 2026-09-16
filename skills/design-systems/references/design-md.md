# DESIGN.md: Creating and Maintaining the Design Spec

Every project this skill is applied to must have a `DESIGN.md` file at
the project root. This is the single source of truth for the project's
design system. It is not optional.

## When to create DESIGN.md

- **New project:** Create `DESIGN.md` before writing any UI code. Choose
  the design system first (see `choosing-a-system.md`), then document it.
- **Existing project without DESIGN.md:** Audit the current UI, identify
  which system it follows (or is closest to), then create `DESIGN.md` to
  match. Do not impose a new system on an existing project without the
  user's explicit request.
- **Redesign:** Read the existing `DESIGN.md` first. Update it to reflect
  the new direction before changing code. The file is the spec; code
  follows it.

## When to update DESIGN.md

- Color palette changes (new token, changed hex, removed color)
- Typography changes (new font, new size, new weight usage)
- Spacing scale changes
- New component patterns established
- Design system change (e.g. minimalist to bento grid)
- Dark mode strategy added or changed
- After any redesign that establishes new visual conventions

Do NOT update DESIGN.md for:
- One-off styling tweaks that don't establish a pattern
- Experimental changes that haven't been confirmed
- Changes that only affect a single screen (those go in code, not spec)

## DESIGN.md structure

Use this template. Adapt section names to the project, but keep the
order and the core sections.

```markdown
# Design System

> Brief one-line description of the visual direction and which system
> it follows (e.g. "Minimalist with warm neutrals" or "Bento grid
> dashboard, Material 3 influenced").

## Design system

- **System:** <name> (e.g. Minimalist, Neo-Brutalism, Bento Grid)
- **Why:** <one sentence on why this system fits this product>
- **Variance:** <1-10, how asymmetric/experimental>
- **Motion:** <1-10, how animated>
- **Density:** <1-10, how packed>

## Colors

All colors defined as tokens using a three-tier architecture. Never use
raw hex in code. Name tokens by purpose, not value.

### Tier 1: Reference (raw values)

| Token | Hex | Notes |
|---|---|---|
| `blue.600` | `#XXXXXX` | Raw palette, no opinions |
| `gray.100` | `#XXXXXX` | |
| `gray.900` | `#XXXXXX` | |

### Tier 2: Semantic (meaning)

| Token | References | Use for |
|---|---|---|
| `color.action.primary` | `{blue.600}` | Primary CTAs |
| `color.text.body` | `{gray.900}` | Body text |
| `color.surface.canvas` | `{gray.100}` | Page background |
| `color.action.primary.hover` | `{blue.700}` | Hover state |
| `success` | `{green.600}` | Success states |
| `warning` | `{amber.500}` | Warning states |
| `error` | `{red.600}` | Error/destructive states |
| `info` | `{blue.500}` | Information states |

### Tier 3: Component (scoped, optional)

| Token | References | Use for |
|---|---|---|
| `button.bg.primary` | `{color.action.primary}` | Primary button bg |
| `card.bg` | `{color.surface.canvas}` | Card background |
| `card.padding` | `{space.4}` | Card padding |

### Dark mode

<If dark mode is supported, document the token mapping here. Dark mode
is the baseline for consumer apps, not optional. Use token swaps, not
conditional CSS. If not supported, state "Dark mode not supported" or
"Planned, not implemented.">

## Typography

Font family, scale, weights, line heights, letter spacing.

### Font

- **Primary:** <font name> (via <delivery method: google_fonts,
  self-hosted, system>)
- **Mono:** <font name> (if used)
- **Display:** <font name> (if different from primary)

### Type scale

| Size | Weight | Line height | Letter spacing | Use for |
|---|---|---|---|---|
| 32 | 800 | 1.1 | -0.02em | Page titles |
| 24 | 700 | 1.2 | -0.01em | Section headers |
| 20 | 700 | 1.2 | 0 | Card titles |
| 16 | 600 | 1.4 | 0 | Buttons, emphasis |
| 14 | 400 | 1.6 | 0 | Body text |
| 12 | 400 | 1.5 | 0 | Captions |
| 11 | 600 | 1.4 | 0.05em | Labels (not uppercase) |

### Rules

- <any project-specific typography rules: no uppercase labels, no
  serif in body, tabular nums for data, etc.>

## Spacing

### Scale

| Token | Value | Use for |
|---|---|---|
| `xs` | 4 | Tight internal padding |
| `sm` | 8 | Small gaps |
| `md` | 16 | Standard padding, card gaps |
| `lg` | 24 | Section gaps |
| `xl` | 32 | Large section gaps |
| `2xl` | 48 | Page-level breaks |
| `3xl` | 64 | Hero/breaking sections |

### Page layout

- Page padding: <value>
- Max content width: <value>
- Card gap: <value>
- Section gap: <value>

## Components

### Cards

<Description, border, radius, shadow, padding, when to use>

### Buttons

| Variant | Background | Text | Border | Use for |
|---|---|---|---|---|
| Primary | <color> | <color> | none | Main CTA |
| Secondary | <color> | <color> | <color> | Alt action |
| Destructive | <color> | <color> | <color> | Delete, remove |
| Ghost | transparent | <color> | none | Tertiary |

### Inputs

<Description, border, radius, focus state, error state, label position>

### Chips / Tags

<Description, border, radius, bg, text, when to use>

### Navigation

<Bottom nav, top nav, drawer, rail, active state, etc.>

## Icons

- **Library:** <Material Icons, Lucide, Phosphor, custom SVG>
- **Standard size:** <e.g. 24x24>
- **Stroke width:** <if applicable>
- **Section icons color:** <token>
- **Row icons color:** <token>
- **No emojis as icons**

## States

### Loading

<Skeleton loader pattern, or spinner pattern, with color and size>

### Empty

<Composed empty state pattern: icon, headline, guidance, optional CTA>

### Error

<Inline error pattern, toast pattern, full-screen error pattern>

## Motion

Motion tokens are part of the design system, alongside color and type.
Every animation references a token, not a hardcoded value.

### Motion tokens

| Token | Value | Use for |
|---|---|---|
| `motion.duration.fast` | 150ms | Hover, press, small state changes |
| `motion.duration.normal` | 250ms | Page transitions, modal open |
| `motion.duration.slow` | 400ms | Hero reveals, large section transitions |
| `motion.easing.out` | `cubic-bezier(0.16, 1, 0.3, 1)` | Standard ease-out |
| `motion.easing.spring` | `type: spring, stiffness: 100, damping: 20` | Physical interactions |
| `motion.hover.scale` | `0.98` | Press feedback |
| `motion.hover.translateY` | `1px` | Press feedback |

### Rules

- **Page transitions:** <type, duration token, easing token>
- **Detail transitions:** <type, duration token, easing token>
- **Hover/press feedback:** <transform, duration token>
- **Scroll animations:** <if any, type and when. Each needs a one-sentence reason.>
- **Reduced motion:** <how prefers-reduced-motion is handled. All motion collapses to static.>

## Anti-patterns (project-specific)

List patterns explicitly rejected for this project. Reference the
universal anti-patterns from the design-systems skill, plus any
project-specific ones.

- <pattern name>: <why rejected, what to do instead>

## Platform notes

<Flutter-specific or Web-specific implementation notes. Token mapping
from the design spec to the platform's theming system.>
```

## Rules for maintaining DESIGN.md

1. **Tokens, not raw hex.** DESIGN.md defines tokens. Code uses tokens.
   If code has raw hex, that's a bug, or DESIGN.md is missing a token.
2. **One source of truth.** If the design system has a color/spacing/
   typography value, it's in DESIGN.md. Not in a comment, not in a
   theme file, not in a component. DESIGN.md is the spec.
3. **Keep it current.** Stale DESIGN.md is worse than no DESIGN.md. If
   the code has diverged, update DESIGN.md to match reality, then fix
   the code to match DESIGN.md.
4. **Don't over-document.** DESIGN.md captures the system, not every
   component variation. If a one-off component doesn't fit the system,
   it's either a new pattern to document or a bug to fix.
5. **Reference, don't duplicate.** If the project has a `docs/DESIGN.md`
   or `lib/theme/colordata.dart` or `tailwind.config.js`, DESIGN.md
   references it and explains the system, it doesn't copy every value.
6. **Update before code.** When changing the design system, update
   DESIGN.md first, then change code. The file is the spec; code follows.
7. **Commit DESIGN.md with code.** DESIGN.md lives in the repo and is
   committed alongside the code changes that established the patterns.
```
