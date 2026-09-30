# Choosing a Design System

## Decision framework

### Step 1: Identify the product personality

Answer these questions about the product:

1. **Who is the primary user?** (Consumers, professionals, developers,
   children, enterprise users)
2. **What emotion should the product evoke?** (Trust, excitement, calm,
   authority, playfulness, luxury)
3. **What is the content density?** (Sparse hero pages, dense dashboards,
   long-form reading, mixed)
4. **What platform(s)?** (iOS, Android, web, desktop, embedded)
5. **What is the brand's existing visual identity?** (Conservative,
   bold, playful, minimal, none)

### Step 2: Match personality to system

| If the product is... | Consider... |
|---|---|
| Trustworthy, professional, content-heavy | Minimalist, Swiss, Flat |
| Bold, confident, unconventional | Neo-Brutalism, Cyberpunk |
| Premium, modern, consumer-facing | Glassmorphism, Minimalist |
| Soft, tactile, physical | Neumorphism (for limited scopes) |
| Structured, enterprise, Android-first | Material Design 3 |
| Story-driven, publication, rich content | Editorial, Swiss |
| Data-dense, dashboard, scannable | Bento Grid, Material Design 3 |
| High-tech, gaming, dark-themed | Cyberpunk, Flat (dark variant) |
| Luxurious, geometric, vintage | Art Deco |
| Familiar, physical, tool-like | Skeuomorphism (sparingly) |
| Vibrant, energetic, marketing | Gradient Mesh |
| Safe, universal, fast to build | Flat Design |

### Step 3: Evaluate trade-offs

Each system has strengths and weaknesses. Consider:

**Accessibility**
- Minimalist, Swiss, Flat, Material 3: Excellent (high contrast, clear hierarchy)
- Glassmorphism: Moderate (glass over busy backgrounds can fail contrast)
- Neumorphism: Poor (low contrast by design, hard for screen readers)
- Cyberpunk: Moderate (neon on dark can strain eyes at length)
- Art Deco: Variable (decorative elements can distract from content)

**Performance**
- Flat, Minimalist, Swiss: Fast (no blur, no heavy shadows, no gradients)
- Material 3: Fast (elevation is cheap)
- Glassmorphism: Expensive (backdrop blur on every glass surface)
- Neumorphism: Moderate (multiple shadows per element)
- Gradient Mesh: Moderate (large gradient images or CSS gradients)
- Cyberpunk: Moderate (glow effects, animations)

**Build speed**
- Flat, Minimalist: Fast (fewest visual rules)
- Material 3: Fast (component libraries exist for every platform)
- Swiss: Moderate (requires precise grid work)
- Editorial: Moderate (typographic detail takes time)
- Bento Grid: Moderate (responsive grid logic)
- Glassmorphism: Slow (blur tuning, layering, fallbacks)
- Neo-Brutalism: Slow (intentional clashing is hard to get right)
- Art Deco: Slow (custom geometric patterns, symmetry work)
- Skeuomorphism: Slowest (custom textures, physical metaphors)

**Longevity**
- Minimalist, Swiss, Flat: Timeless (decades of proven use)
- Material 3: Long (Google-backed, evolves slowly)
- Bento Grid: Medium (trendy but functional)
- Glassmorphism: Medium (trendy, may age)
- Neo-Brutalism: Short (trend-driven, may feel dated)
- Cyberpunk: Short (niche, trend-driven)
- Gradient Mesh: Short (trend-driven)
- Skeuomorphism: Niche (Apple moved away for a reason)

### Step 4: Check constraints

- **Brand colors exist?** → Choose a system that works with them
  (Minimalist, Flat, Material 3 adapt easily; Neo-Brutalism and
  Cyberpunk need specific palettes)
- **Dark mode required?** → Material 3, Cyberpunk, Flat adapt well;
  Neumorphism and Art Deco are harder in dark mode
- **Accessibility is critical?** → Avoid Neumorphism, be careful with
  Glassmorphism
- **Low-end devices?** → Avoid Glassmorphism (blur is expensive),
  prefer Flat or Minimalist
- **Team is small?** → Flat, Minimalist, Material 3 are fastest to
  implement consistently

### Step 5: Document the choice

Once chosen, document:
1. Which system (and why)
2. Color palette (primary, accent, neutrals, semantic colors)
3. Typography scale (font family, sizes, weights, usage)
4. Spacing scale (base unit, all steps)
5. Component patterns (card, button, input, chip, modal, nav)
6. State patterns (loading, empty, error)
7. Dark mode strategy (if applicable)

This becomes the project's design system spec. See
`design-systems.md` for the detailed rules of each system.

---

## Buy vs. build: official package or aesthetic

Before implementing, decide whether the brief maps to a real design
system (install the official package) or an aesthetic family (build it
yourself). Never hand-recreate an official system's CSS, and never
pretend an aesthetic trend is an official package.

### Reach for the official package

| Brief reads as | Install | Why |
|---|---|---|
| Microsoft / enterprise SaaS / dashboards | `@fluentui/react-components` or `@fluentui/web-components` | Official Fluent UI, Microsoft tokens, accessibility done |
| Google-ish, Material-flavored product | `@material/web` + Material 3 tokens | Official, theme-able via Material Theming |
| IBM-style B2B / enterprise analytics | `@carbon/react` + `@carbon/styles` | Official Carbon, mature data-density patterns |
| Shopify app surfaces | `@shopify/polaris` | Required for Shopify admin UI |
| Atlassian / Jira-style product | `@atlaskit/*` + `@atlaskit/tokens` | Official Atlassian DS |
| GitHub-style devtool / community page | `@primer/css` or `@primer/react-brand` | Official Primer; Brand variant for marketing |
| UK public-sector service | `govuk-frontend` | Legally / regulatorily expected |
| US public-sector / trust-first | `uswds` | Same |
| Fast local-business / agency MVP | Bootstrap 5.3 | Boring, fast, works |
| Modern accessible React foundation | `@radix-ui/themes` | Primitives + polished theme |
| Modern SaaS where you own the components | shadcn/ui | You own the code, easy to customise; never ship the default state |
| Tailwind-based indie SaaS / AI marketing | Tailwind v4 utilities + `dark:` variant | Default small-team stack |

**Rules:**
- If the brief matches a row, install the package. Do not approximate
  its CSS by hand.
- One system per project. Do not mix Fluent React with Carbon in the
  same tree, or import shadcn/ui into a Material 3 app.
- If you adopt a system's tokens, do not then override 90% of them.

### Aesthetic-only directions (no official package exists)

For these, there is no single official package. Build with native CSS +
Tailwind + a maintained component library. Be honest in code comments
about what is borrowed inspiration vs. official material.

| Aesthetic | Honest implementation |
|---|---|
| Glassmorphism / frosted glass | `backdrop-filter`, layered borders, highlight overlays. Solid-fill fallback under `prefers-reduced-transparency`. |
| Bento (Apple-style tile grids) | CSS Grid with mixed cell sizes and `grid-auto-flow: dense`. No library owns this. |
| Brutalism | Native CSS, monospace, raw borders. Pick the Swiss Industrial Print (light) or Tactical Telemetry (dark) variant (see `modern-trends.md`). |
| Editorial / magazine | Serif display type, asymmetric grid, generous whitespace. |
| Dark tech / terminal | Monospace + single neon accent, terminal motifs. |
| Aurora / mesh gradients | SVG or layered radial gradients. |
| Kinetic typography | Native CSS animations, scroll-driven animations, GSAP for scroll hijacks. |
| Apple Liquid Glass | Apple documents this for Apple platforms only. There is no official `liquid-glass.css`. Web implementations are approximations using `backdrop-filter` + layered borders + highlights. Label clearly as approximation. |
