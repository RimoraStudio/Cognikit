# Anti-Drift Conventions

A design system decays the moment a contributor reaches for a raw value
instead of a token, or restyles a primitive instead of composing it.
These conventions, distilled from a production token-first marketing
site, prevent that drift. Apply them to any project with more than one
contributor.

## Token-first, always

Tokens exist for type, color, layout, shape, elevation, and
breakpoints. Reaching for `text-[clamp(...)]` or `bg-[#...]` is the #1
source of drift. Before typing any arbitrary value, check whether a
token covers it. It almost always does.

```tsx
// Wrong: four classes, values invented at the call site
<h2 className="text-[clamp(50px,4.4vw,72px)] leading-[1.02] font-[690] tracking-[-0.06em]">

// Right: one step of the scale, carries its own leading/weight/tracking
<Heading as="h2">
```

The three legitimate exceptions to "never raw":

1. **Namespaced mock palettes**: components imitating a real product
   UI (hero boards, sticky notes, workspace switchers) use a separate
   `mock-*` token namespace, never the marketing tokens. Mixing the two
   is what creates a second grey ramp.
2. **Illustration art**: one-off colors inside code-built artwork
   (status chips, avatar fills, gradients) stay local and raw. They
   are art, not system. Do not tokenize them.
3. **Genuine one-offs**: a bespoke layout value used once. Fine, but
   if you write it twice, extract it.

## Compose primitives; don't restyle them

- Override with `className`; `cn()` (clsx + tailwind-merge) makes the
  caller win. `className` goes **last**.
- **Never `!important`.** Needing one means a primitive is missing a
  variant. Add the variant.
- **Never style children through `[&_h2]:` / `[&>div:last-child]:`
  descendant variants.** Pass real components. That pattern makes
  primitives impossible to compose with and hides palettes inside
  900-character class strings.
- Build a new primitive only when a **second** real consumer exists.
  Extracting ahead of demand guesses at the wrong shape.

## Type scale: one step carries four properties

Each `text-*` step bundles size + line-height + font-weight +
letter-spacing, so one utility replaces the four-class stacks that
drift at every call site. This collapses the four near-identical `h1`
clamps and five near-identical `h2` clamps that accumulate otherwise.

```css
--text-display-xl: clamp(54px, 6.1vw, 88px);
--text-display-xl--line-height: 0.94;
--text-display-xl--font-weight: 700;
--text-display-xl--letter-spacing: -0.065em;
```

Match an existing step rather than adding one that differs by a pixel
or two.

## Quarantined debt register

Files that predate the design system hold all the `!` flags, raw hex,
arbitrary breakpoints, and template-literal `className`. Record them
in DESIGN.md as quarantined debt. **Do not copy their patterns, and do
not cite them as precedent.** If you edit them, leave them better than
you found them, not consistent with them.

## Truth comments in data files

Content drifts toward what a product could plausibly do. Open every
data file with a truth comment stating what the product actually ships
and forbidding the rest:

```ts
/**
 * Every claim here is limited to what the task board and calendar
 * actually expose: Pending / In Progress / Done / Cancelled statuses.
 * No AI scheduling, workload balancing, time tracking, dependencies,
 * or recurring tasks should be added here without those being verified
 * first.
 */
```

This keeps the verified list next to the claims, so writing an
unverified one means editing the constraint first.

## Derive; never duplicate

When a single source of truth exists (e.g. navigation), derive
secondary lists from it. The footer derives from nav, so the footer
cannot fall out of step. Never maintain a second list that will drift.

```ts
// Wrong: a second list that will drift
export const footerColumns = [{ title: "Product", items: [...] }];

// Right: derived
export const footerColumns: FooterColumn[] = [
    { title: "Product", items: menuItems("product") },
];
```

## Server-safe component barrel

In a framework with server/client component boundaries (Next.js App
Router, etc.), keep the primitive barrel server-safe. Client-only
primitives (Carousel, Reveal, anything with state/effects/browser APIs)
are imported from their own modules, never re-exported through the
barrel. This stops a `"use client"` boundary from dragging into every
server component that imports any primitive.

## Animation ownership

Animation lives with the component that owns its targets. Do not
drive child components from a parent via `data-*` selectors. That
pattern leaves components silently unanimated on every route except
the one that runs the selector.

- Scroll entrance: wrap in a `<Reveal>` primitive. Don't hand-roll it.
- Use `useGSAP` with a `scope` ref. Never target a selector that could
  match outside the component.
- **Reduced motion:** CSS transitions are handled globally. JS
  animation (GSAP) writes inline styles that CSS cannot undo, so it
  must gate on `gsap.matchMedia("(prefers-reduced-motion: no-preference)")`
  or `useReducedMotion()`. Every animated component needs a meaningful
  static state.

## Page-as-manifest composition

A page is a manifest of sections. Sections take **no props**. Each
imports its own data. Threading content through props makes every copy
edit a two-file change. Colocate by default; promote to shared only
when a second consumer actually exists.
