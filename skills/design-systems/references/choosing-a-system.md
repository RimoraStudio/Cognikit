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
