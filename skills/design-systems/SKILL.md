---
name: design-systems
description: Use when building, redesigning, or choosing a visual design system for any app or website. Triggers on "design system", "UI/UX", "redesign", "make it modern", "make it professional", "brutalism", "minimalist", "glassmorphism", "neumorphism", "material design", "bento grid", "editorial", "swiss design", "cyberpunk UI", "art deco UI", "what design style", "choose a design system", "design direction", or any visual design decision for a new or existing project. Covers 14 design systems with when-to-use guidance, color/typography/spacing rules, component patterns, anti-AI-slop checklist, DESIGN.md spec generation, and Flutter + Web implementation notes.
version: 1.0.0
license: MIT
---

# Design Systems: Choosing & Implementing Visual Direction

> Part of [Cognikit](https://cognikit.com). A kit that gives AI agents cognitive abilities.

This skill helps you choose the right design system for a project and
implement it consistently. It covers 14 established design systems,
each with its visual characteristics, when-to-use guidance, and
implementation patterns for Flutter, Web, and React Native.

## AI execution flow (follow in order)

When this skill activates, follow these steps in order. Do not skip.

1. **Detect**: Check if the project already has a design system (Step 1
   below). If yes, read it and follow it. If no, continue.
2. **Gather**: Read the project's stack, screens, brand assets, content
   type, and platform targets (Step 2).
3. **Audit**: If the project has existing UI, audit it for anti-patterns
   and inconsistencies (Step 3).
4. **Propose**: Propose 1-3 design directions. Let the user choose if
   multiple are viable (Step 4).
5. **Document**: Generate or update `DESIGN.md` at the project root
   using the template in `references/design-md.md` (Step 5).
6. **Implement**: Build components using `references/components.md` as
   the base, adapting visual style to the chosen system from
   `references/design-systems.md`.
7. **Modernize**: Apply 2026 best practices from
   `references/modern-trends.md`: three-tier token architecture, motion
   tokens, calm interfaces, accessibility-first, dark mode baseline.
8. **Adapt**: Ensure the design works on phone, tablet, and desktop
   using `references/responsive-adaptive.md`.
9. **Audit**: Run the 110-point anti-AI-slop checklist from
   `references/anti-ai-slop.md` before declaring done.
10. **Verify**: Run the pre-flight checklist at the bottom of this file.

## When to use

Activate this skill when:

- Starting a new project and choosing a visual direction
- Redesigning an existing app or website
- Asked to make something "more modern" or "more professional"
- A user names a specific style (brutalism, minimalist, glassmorphism, etc.)
- Choosing between multiple design directions
- Reviewing a design for consistency with its intended system
- No existing design system is detected in the project

## Discovery workflow (run before choosing a system)

Before choosing or suggesting a design system, gather the current project
context. This is mandatory for existing projects and recommended for new
ones.

### Step 1: Detect if a design system exists

Check the project for these signals:

| Signal | What to look for |
|---|---|
| `DESIGN.md` | A design spec file at the project root |
| `docs/DESIGN.md` | Design docs in a docs folder |
| Theme file | `lib/theme/*.dart` (Flutter), `tailwind.config.*`, `theme.*`, `tokens.*` |
| Color tokens | `colordata.dart`, `colors.ts`, `colors.css`, CSS variables in `:root` |
| Typography | `textStyle*.dart`, `fonts.*`, `typography.*`, font config in theme |
| Component library | `shadcn/ui`, `@fluentui/*`, `@carbon/*`, `@material/*`, `@radix-ui/*` |
| Storybook | `.storybook/` directory |
| Design tokens | Style Dictionary, `tokens.json`, `design-tokens.*` |

**If a design system exists:** Read it. Do not impose a new system without
the user's explicit request. Follow the existing system. If the user asks
for a change, audit the current system first (Step 3), then propose a
direction (Step 4).

**If no design system exists:** Run the full discovery below, then propose
a direction.

### Step 2: Gather project context

Read these to understand what the project is and what it has:

**Framework and stack**
- `package.json` / `pubspec.yaml` / `Cargo.toml` / `go.mod`: what
  framework, what UI libraries, what styling method
- Flutter? React? Next.js? Vue? Svelte? Vanilla?
- Tailwind? CSS Modules? styled-components? vanilla CSS? GetX?

**Existing visual patterns**
- Read 3-5 representative screens/pages/components
- Identify: color usage, typography, spacing, component shapes, borders,
  shadows, radius, motion
- Note what's consistent and what's inconsistent

**Brand assets**
- Logo files (`assets/logo*`, `public/logo*`, `android/app/src/main/res/`)
- Brand colors (in theme, in marketing site, in social profiles)
- Existing fonts (in `pubspec.yaml`, `package.json`, `@font-face`, Google
  Fonts link)
- Photography style (if any brand imagery exists)

**Content type**
- What does the app/site primarily show? (Forms, lists, dashboards,
  articles, media, chat, etc.)
- How dense is the content? (Sparse hero pages, dense tables, mixed)

**Platform targets**
- Mobile only? Web only? Both? Desktop?
- iOS-first? Android-first? Cross-platform?

### Step 3: Audit current state (for existing projects)

If the project already has UI, audit it before suggesting changes:

**Typography audit**
- What fonts are used? Are they the AI defaults (Inter, Roboto)?
- Is there a type scale, or random sizes?
- Are weights used well (400/500/600/700) or just 400/700?
- Letter-spacing adjustments present?
- Any all-caps overuse?

**Color audit**
- How many accent colors? More than one?
- Are colors tokenized or raw hex?
- Warm or cool greys? Mixed?
- Any AI-purple gradients?
- Saturation levels?

**Layout audit**
- Centered everything?
- Three equal cards pattern?
- Eyebrow labels on every section?
- Same layout family repeated?
- Mobile collapse handled?

**Component audit**
- Generic card look (border + shadow + white)?
- Filled + ghost button pattern everywhere?
- Pill badges, accordion FAQ, carousel testimonials?
- Modals for simple actions?

**State audit**
- Loading states? Skeleton or spinner?
- Empty states? Composed or blank?
- Error states? Inline or alert?
- Hover/active feedback?

**Icon audit**
- Lucide/Feather only?
- Cliche metaphors (rocket, shield, lightbulb)?
- Inconsistent stroke widths?
- Emojis as icons?

**Content audit**
- Em dashes in copy?
- AI cliches (Elevate, Seamless, Unleash)?
- Fake-precise numbers?
- Placeholder names (Acme, Nexus)?
- Lorem ipsum?

Record the findings. These inform the direction proposal in Step 4 and
the DESIGN.md creation in the output phase.

### Step 4: Propose a direction

Based on the discovery (Step 2) and audit (Step 3), propose 1-3 design
directions. For each:

1. **Name the system** (e.g. "Minimalist with warm neutrals", "Bento grid
   dashboard, Material 3 influenced")
2. **Why it fits**: one sentence connecting the project context to the
   system choice (audience, content type, platform, brand)
3. **What changes**: high-level summary of what would change from the
   current state (if existing) or what would be built (if new)
4. **Trade-offs**: what the system does well and what to watch for
   (accessibility, performance, build speed, longevity)

Present the options to the user. If only one direction is clearly right,
state it and proceed. If multiple are viable, let the user choose.

### Step 5: Output DESIGN.md

Once a direction is chosen (by the user or by clear fit), generate the
`DESIGN.md` file at the project root following the template in
`references/design-md.md`. This becomes the spec. All code changes
follow it.

## Core design principles (always apply)

Regardless of which design system you choose, these principles are
universal:

1. **Contrast over decoration.** Text must be readable. Hierarchy must
   be clear. Decoration that hurts contrast is wrong, no matter how
   pretty.
2. **One accent color per screen.** Multiple accents compete for
   attention. Pick one and let the rest be neutral.
3. **Consistent spacing rhythm.** Use a scale (4/8/12/16/24/32/48/64)
   and stick to it. Inconsistent spacing looks broken.
4. **Cover all states.** Loading, empty, error, and loaded. A screen
   that only handles "loaded" is incomplete.
5. **No em dashes in UI copy.** Use periods, commas, or line breaks.
6. **No emojis as icons.** Use a proper icon library (Lucide, Material,
   Heroicons, or custom SVG).
7. **Match the platform.** Flutter apps should feel like Flutter, web
   should feel like web. Don't force web patterns into Flutter or vice
   versa.
8. **Progressive data loading.** Show data as it arrives. Don't block
   the entire UI behind a single loading state.

## Choosing a design system

The right system depends on the product's personality, audience, and
content type. Use the decision framework in
`references/choosing-a-system.md` for detailed guidance.

### Quick reference table

| System | Personality | Best for | Key trait |
|---|---|---|---|
| Minimalist | Clean, calm, editorial | Portfolios, reading, SaaS | Whitespace, typographic hierarchy |
| Neo-Brutalism | Bold, raw, confident | Developer tools, creative agencies | Hard shadows, thick borders, clashing colors |
| Glassmorphism | Premium, modern, layered | Consumer apps, dashboards | Frosted glass, depth, vibrancy behind glass |
| Neumorphism | Soft, tactile, physical | Embedded devices, controlled inputs | Extruded shapes, single-tone backgrounds |
| Material Design 3 | Structured, familiar, accessible | Android apps, enterprise | Elevation, dynamic color, rounded shapes |
| Flat Design | Simple, fast, universal | Content-heavy sites, utility apps | Solid colors, no depth, icon-driven |
| Swiss / International | Precise, academic, grid-based | Editorial, data, documentation | Mathematical grids, sans-serif, asymmetry |
| Editorial / Magazine | Storytelling, rich, serif | Publications, blogs, portfolios | Large type, serif headings, column layouts |
| Bento Grid | Modular, scannable, dense | Dashboards, feature showcases, landing pages | Grid of varied-size cards |
| Cyberpunk / Futurism | High-tech, neon, dark | Gaming, crypto, dev tools | Neon on dark, glow effects, monospace |
| Art Deco | Luxurious, geometric, vintage | Luxury brands, hospitality, events | Gold accents, symmetry, geometric patterns |
| Skeuomorphism | Familiar, physical, intuitive | Creative tools, music apps | Real-world textures, physical metaphors |
| Gradient Mesh | Vibrant, modern, energetic | Marketing, startups, landing pages | Flowing multi-color gradients |
| Corporate / Professional | Trustworthy, structured, clean | Enterprise, B2B, government, finance | Blue palette, structured grid, conservative |

### Decision shortcuts

- **Enterprise / B2B / dashboard** → Material Design 3 or Minimalist
- **Government / finance / legal / trust-first** → Corporate or Swiss
- **Consumer app / social** → Glassmorphism or Flat Design
- **Developer tool / creative agency** → Neo-Brutalism
- **Portfolio / blog / publication** → Editorial or Swiss
- **Gaming / crypto / dev tool (dark)** → Cyberpunk
- **Luxury brand / hospitality** → Art Deco or Minimalist
- **Dashboard with many widgets** → Bento Grid
- **Music / creative / physical metaphor** → Skeuomorphism (sparingly)
- **Marketing landing page** → Gradient Mesh or Flat Design
- **Unsure / safe default** → Minimalist

## References

Load these for detailed guidance. All files exist under `references/`.

| File | What's inside | When to load |
|---|---|---|
| `choosing-a-system.md` | Full decision framework with trade-offs | When deciding which system fits |
| `design-systems.md` | Detailed breakdown of all 14 systems (colors, typography, spacing, components, when to use, when to avoid) | After choosing a system, to get its rules |
| `components.md` | Universal component library (nav, cards, inputs, buttons, modals, lists, tables, empty states, skeletons, FAB, etc.) with Flutter + Web + React Native snippets | When building any UI component |
| `responsive-adaptive.md` | Phone, tablet, desktop adaptation rules, breakpoints, touch vs mouse, platform conventions | When making the design work across form factors |
| `anti-ai-slop.md` | 110 universal AI design tells to avoid, organized by category | Before declaring any design task done |
| `design-md.md` | DESIGN.md template and maintenance rules | When creating or updating the project's DESIGN.md |
| `modern-trends.md` | 2026 design system trends: token architecture, motion tokens, evolved bento, calm interfaces, WCAG 3.0, dark mode baseline, functional micro-interactions, variable fonts, AI governance | When implementing the chosen system, to apply current best practices |

## Anti-AI Slop (always check)

AI-generated design has recognizable fingerprints. Regardless of which
design system you choose, avoid all 110 tells in
`references/anti-ai-slop.md`. Organized by category:

**Color (6 tells):** Lila Rule, premium-consumer palette ban, oversaturated
accents, multiple accents, color consistency violations, mixed grey families

**Typography (8 tells):** serif-as-default, Inter everywhere, mixed-family
emphasis, missing weight variety, missing letter-spacing, all-caps
overuse, title case, italic descender clipping

**Layout (21 tells):** centered hero, three equal cards, eyebrow everywhere,
section repetition, zigzag alternation, split-header, bento without rhythm,
empty bento cells, forced symmetry, `100vh` instead of `100dvh`, flexbox
math, no max-width, uniform radius, no overlap/depth, symmetrical padding,
edge-to-edge nav, hero stack overload, logo wall in hero, nav wrap,
hero overflow, mobile collapse not explicit

**Materiality (7 tells):** glassmorphism on everything, pure-black shadows,
generic grey borders, inconsistent radii, zero texture, even gradients,
inconsistent lighting

**Interactivity (11 tells):** static-only state, no hover, no press
feedback, instant transitions, missing focus ring, unmotivated motion,
marquee overload, standard easing, animating layout properties,
scroll listeners, no reduced motion

**Component (10 tells):** generic card, filled+ghost button pattern, pill
badges, accordion FAQ, 3-card carousel, 3-tower pricing, modals
everywhere, circle avatars, sun/moon toggle, footer link farm

**Iconography (6 tells):** Lucide/Feather only, cliche metaphors,
inconsistent strokes, missing favicon, stock team photos, emojis as icons

**Content (14 tells):** em dashes, AI cliches (Elevate/Seamless/Unleash),
fake-precise numbers, fake round numbers, placeholder names, exclamation
marks, "Oops!" errors, passive voice, lorem ipsum, copy self-audit
failures, long spec sheets, long lists with hairlines, same avatar
reused, identical dates

**Assets (4 tells):** div-based fake screenshots, text wordmark logos,
hand-rolled SVGs, text-only pages

**Theme (3 tells):** theme inconsistency, pure black bg, no dark mode

**Accessibility (10 tells):** button contrast, form contrast, CTA wrap,
duplicate CTA intent, missing alt text, div soup, no skip link, no back
nav, no 404 page, no form validation

**Code quality (7 tells):** inline styles, hardcoded widths, arbitrary
z-index, dead code, import hallucinations, missing meta tags, no legal
links

**Performance (3 tells):** grain on scrolling containers, heavy bundle,
no Core Web Vitals check

Run the full checklist in `references/anti-ai-slop.md` before
considering any design task complete.

## DESIGN.md (mandatory output)

Every project this skill is applied to must have a `DESIGN.md` file at
the project root. This is the single source of truth for the project's
design system.

- **New project:** Create `DESIGN.md` before writing UI code
- **Existing project without DESIGN.md:** Audit current UI, create `DESIGN.md` to match
- **Redesign:** Update `DESIGN.md` before changing code
- **After any pattern change:** Update `DESIGN.md` to reflect the new pattern

See `references/design-md.md` for the full template and maintenance rules.

## Pre-flight checklist

Before considering a design task complete:

- [ ] Design system chosen and documented (which system, why)
- [ ] `DESIGN.md` created or updated at project root
- [ ] Color palette defined in DESIGN.md (primary, accent, neutrals, semantic)
- [ ] Typography scale defined in DESIGN.md (sizes, weights, usage)
- [ ] Spacing rhythm defined in DESIGN.md (base unit, scale)
- [ ] Component patterns established in DESIGN.md (cards, buttons, inputs, chips)
- [ ] All states covered (loading, empty, error, loaded)
- [ ] No universal anti-patterns (em dashes, emoji icons, generic AI tells)
- [ ] Anti-AI Slop 110-point checklist passed (see `references/anti-ai-slop.md`)
- [ ] Responsive: layout adapts at phone, tablet, desktop breakpoints
- [ ] Touch targets >= 44pt on mobile, click targets >= 24px on desktop
- [ ] Platform-appropriate (Flutter feels like Flutter, web feels like web)
- [ ] Consistent within the chosen system (don't mix systems without intent)
- [ ] DESIGN.md committed with code changes
