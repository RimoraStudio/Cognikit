# Design Systems: Detailed Reference

Each system below has: when to use, visual characteristics, color
guidance, typography, spacing, component patterns, when to avoid, and
platform notes.

---

## 1. Minimalist

**Personality:** Clean, calm, editorial. Lets content breathe.

### When to use
- Portfolios, reading apps, SaaS dashboards, documentation
- Product-led marketing sites with oversized tightly-tracked headings
  on clean pale-blue surfaces (the "Avanta style")
- When content is the hero and UI should disappear
- When you want timeless design that won't age

### Visual characteristics
- Generous whitespace (40-60% of screen is empty)
- Strong typographic hierarchy (large headings, small body)
- Limited color palette (1-2 colors + neutrals)
- No decorative elements (no gradients, no shadows, no patterns)
- Thin borders or no borders (rely on whitespace for separation)

### Production example: Avanta marketing site
A token-first implementation of this direction, distilled into
patterns you can apply to any Next.js marketing site:
- **Type scale bundles four properties per step.** Each `text-*` token
  carries size + line-height + weight + letter-spacing, collapsing the
  four-class stacks (`text-[clamp(...)] leading-[...] font-[690]
  tracking-[-0.06em]`) that drift at every call site.
- **Namespaced mock palette.** Product-mockup components (hero boards,
  sticky notes, workspace switchers) use a separate `mock-*` token
  namespace, never the marketing surface tokens. This prevents a
  second grey ramp from drifting in.
- **One cool-neutral ramp.** `neutral-50` through `neutral-900`
  replaces the two competing grey families that drift in otherwise.
- **Scroll-reveal via `<Reveal>` primitive.** GSAP gated on
  `prefers-reduced-motion: no-preference` because CSS cannot undo
  inline styles. Animation lives with the component that owns its
  targets, never driven from page-level selectors.
- **Server-safe barrel.** Client-only primitives imported from their
  own modules so the barrel stays server-safe.
- **Page-as-manifest.** Sections take no props; each imports its own
  data. Pages are manifests of sections, not prop-threading trees.

### Color
- Background: warm white (`#FAFAF8`, `#F7F5F2`) or pure white
- Text: near-black (`#1A1A1A`, `#171717`)
- Secondary text: medium grey (`#6B7280`, `#78716C`)
- Accent: one color, used sparingly (links, active states, CTAs)
- Semantic: green for success, red for destructive, both muted

### Typography
- Font: Inter, Söhne, Neue Haas Grotesk, or system sans-serif
- Scale: 32/24/20/16/14/12 (large jumps for hierarchy)
- Weights: 400 for body, 600 for emphasis, 700 for headings
- Line height: 1.6 for body, 1.2 for headings
- Letter spacing: -0.02em for large headings, 0 for body

### Spacing
- Base unit: 8
- Scale: 8, 16, 24, 32, 48, 64, 96
- Page padding: 24-32px
- Section gaps: 48-64px

### Components
- **Cards:** No border, no shadow, separated by whitespace or a 1px line
- **Buttons:** Text-only or outline, no fill. Active state = underline or bg tint
- **Inputs:** Underline only (no box), label above
- **Chips:** Text + thin underline, no background

### When to avoid
- Content-dense dashboards (too sparse)
- Playful or entertainment apps (too serious)
- When you need to convey richness or luxury

### Platform notes
- **Flutter:** Use `Scaffold` with white bg, `FontStyleInter` or similar, `SizedBox` for spacing. Avoid `Card` widget (has shadow by default).
- **Web:** CSS Grid with `gap`, system font stack, `border-bottom` for dividers.

---

## 2. Neo-Brutalism

**Personality:** Bold, raw, confident. Intentionally clashing.

### When to use
- Developer tools, creative agencies, portfolios that want to stand out
- When the brand is rebellious or unconventional
- When you want to make a strong visual statement

### Visual characteristics
- Thick black borders (2-4px)
- Hard offset shadows (no blur, e.g. `4px 4px 0 #000`)
- Clashing, saturated colors (yellow + pink + blue + green)
- Large, bold typography (often condensed or monospace)
- Raw, unpolished feel (intentionally)
- Grid-based but with deliberate breaks

### Color
- Background: bright solid colors (`#FFD700`, `#FF6B6B`, `#4ECDC4`, `#FFE66D`)
- Text: black (`#000000`) on light, white on dark colors
- Borders: always black, always thick
- Shadows: always black, always hard (no blur)
- No gradients, no transparency

### Typography
- Font: Space Grotesk, Archivo, or monospace (JetBrains Mono, Space Mono)
- Scale: 48/32/24/20/16/14 (large, bold)
- Weights: 700-900 for headings, 500-700 for body
- Letter spacing: -0.03em for large, 0 for body
- Often uppercase for labels and buttons

### Spacing
- Base unit: 4 or 8
- Scale: 4, 8, 16, 24, 32, 48
- Tight spacing (elements close together, separated by borders)

### Components
- **Cards:** Thick black border, hard shadow offset 4px down-right, solid color bg
- **Buttons:** Thick border, hard shadow, solid color bg, bold uppercase text
  - Active/pressed: shadow disappears, element moves down-right by shadow offset
- **Inputs:** Thick border, no radius, monospace font
- **Chips:** Thick border, solid bg, no radius

### When to avoid
- Enterprise or B2B (too aggressive)
- Content-heavy reading apps (hard to read at length)
- Accessibility-critical apps (low contrast on some color combos)
- Apps targeting older or conservative audiences

### Platform notes
- **Flutter:** `Border.all(color: Colors.black, width: 3)`, `BoxShadow(offset: Offset(4,4), color: Colors.black)` with `blurRadius: 0`.
- **Web:** `border: 3px solid #000; box-shadow: 4px 4px 0 #000;` No border-radius.

---

## 3. Glassmorphism

**Personality:** Premium, modern, layered. Depth through transparency.

### When to use
- Consumer apps, premium dashboards, music/media apps
- When you have vibrant background content to show through
- When you want a "premium" feel without heavy decoration

### Visual characteristics
- Frosted glass surfaces (backdrop blur over colorful backgrounds)
- Translucent backgrounds (10-40% opacity white or color)
- Subtle borders (1px white at 20-40% opacity)
- Layered depth (glass cards over photos or gradients)
- Vibrant backgrounds (gradients, photos, abstract shapes)

### Color
- Background: vibrant gradient or photo (this is essential, glass needs something behind it)
- Glass surfaces: white at 10-20% opacity, or color at 15-30%
- Text: white or near-white on glass over dark backgrounds, dark on glass over light
- Borders: white at 20-40% opacity, 1px
- Accent: bright, saturated (works well against glass)

### Typography
- Font: Inter, SF Pro, or system sans-serif
- Scale: 28/22/18/16/14/12
- Weights: 600 for headings, 400-500 for body
- Text on glass needs sufficient contrast, use text shadows if needed

### Spacing
- Base unit: 8
- Scale: 8, 16, 24, 32, 48
- Generous spacing inside glass cards (16-24px padding)

### Components
- **Cards:** `backdrop-filter: blur(12px)`, bg `rgba(255,255,255,0.15)`, border `1px solid rgba(255,255,255,0.3)`, radius 16-20px
- **Buttons:** Glass surface or solid accent, radius 12-16px
- **Inputs:** Glass surface, white placeholder, subtle inner border
- **Nav bars:** Glass surface over content (most common use case)

### When to avoid
- Low-end devices (backdrop blur is expensive)
- Apps with mostly white/text-only content (nothing to blur)
- Accessibility-critical apps (contrast can fail on busy backgrounds)
- When the user has explicitly rejected it (common, it's overused)

### Platform notes
- **Flutter:** `BackdropFilter(filter: ImageFilter.blur(sigmaX: 12, sigmaY: 12))` wrapped in `ClipRRect`. Use sparingly, it's expensive.
- **Web:** `backdrop-filter: blur(12px); background: rgba(255,255,255,0.15);` Provide fallback solid bg for unsupported browsers.

---

## 4. Neumorphism

**Personality:** Soft, tactile, physical. UI elements appear extruded from the background.

### When to use
- Embedded device interfaces, calculator apps, music apps
- When the UI should feel like physical buttons or panels
- Controlled input environments (not content-heavy)

### Visual characteristics
- Elements appear to be extruded from or pressed into the background
- Two shadows per element (one light top-left, one dark bottom-right)
- Single-tone background (the bg and elements share the same color)
- Soft, rounded shapes (radius 16-24px)
- Minimal color (mostly monochrome with one accent)

### Color
- Background: single soft tone (`#E0E5EC`, `#F0F0F3`, `#E6E7EE`)
- Elements: same color as background (shadows create the shape)
- Text: medium grey to dark (`#4A4A4A`, `#333333`)
- Accent: one muted color (`#5B8DEF`, `#A3A3A3`)

### Typography
- Font: Inter, SF Pro, or system sans-serif
- Scale: 24/20/16/14/12
- Weights: 500-600 throughout (not too bold, keep it soft)

### Spacing
- Base unit: 8
- Scale: 8, 16, 24, 32
- Elements need space around them for shadows to be visible

### Components
- **Cards:** Same bg as page, `box-shadow: 8px 8px 16px rgba(0,0,0,0.15), -8px -8px 16px rgba(255,255,255,0.8)`, radius 20px
- **Buttons:** Extruded by default, pressed = inset (swap shadows)
- **Inputs:** Inset appearance (pressed into surface)
- **Toggles/Sliders:** Physical, tactile feel

### When to avoid
- Accessibility-critical apps (low contrast by design)
- Content-heavy apps (hard to read text on soft surfaces)
- Dark mode (neumorphism in dark mode is hard to get right)
- Apps that need clear visual hierarchy (everything looks similar)

### Platform notes
- **Flutter:** Two `BoxShadow`s per element, one with negative offset. Same bg color for page and element.
- **Web:** `box-shadow: 8px 8px 16px rgba(0,0,0,0.15), -8px -8px 16px rgba(255,255,255,0.8); background: #E0E5EC;`

---

## 5. Material Design 3 (Material You)

**Personality:** Structured, familiar, accessible. Google's design system.

### When to use
- Android apps (it's the platform standard)
- Enterprise apps, B2B tools, apps needing broad accessibility
- When you want a proven, well-documented system with component libraries

### Visual characteristics
- Elevation system (5 levels, each with a shadow)
- Dynamic color (adapts to user's wallpaper or brand)
- Rounded shapes (corners range from 4px to 28px)
- Clear tonal hierarchy (surface, surface variant, surface container)
- FAB (floating action button) for primary action
- Navigation drawer, bottom nav, or rail

### Color
- Use Material 3 color roles: primary, on-primary, primary-container, on-primary-container, surface, on-surface, surface-variant, etc.
- Generate from a seed color using Material Theme Builder
- Dark mode: swap surface/on-surface roles

### Typography
- Font: Roboto (default), or any sans-serif (Material 3 is font-agnostic)
- Scale: M3 type roles: display, headline, title, body, label (each with large/medium/small)
- Weights: 400 for body, 500 for label, 600-700 for title/headline

### Spacing
- Base unit: 4
- Scale: 4, 8, 12, 16, 24, 32
- M3 has standard padding values for each component

### Components
- Use the official Material 3 component library for your platform
- **Cards:** `ElevatedCard`, `FilledCard`, `OutlinedCard`
- **Buttons:** Filled, Tonal, Outlined, Text (4 variants)
- **FAB:** Primary action, extended FAB for longer labels
- **Nav:** Bottom nav (mobile), navigation rail (tablet), drawer (desktop)

### When to avoid
- iOS-first apps (use HIG instead)
- When you want a distinctive, non-Google look
- When you need precise visual control (M3 is opinionated)

### Platform notes
- **Flutter:** `useMaterial3: true` in `ThemeData`. Use `Card`, `FilledButton`, `NavigationBar`, etc.
- **Web:** Use M3 Web Components or Tailwind with M3 color tokens.

---

## 6. Flat Design

**Personality:** Simple, fast, universal. No decoration, pure function.

### When to use
- Content-heavy websites, utility apps, internal tools
- When you need to build fast and stay simple
- When accessibility and speed matter more than visual distinction

### Visual characteristics
- Solid colors, no gradients, no shadows, no textures
- Clean typography, clear hierarchy
- Icon-driven navigation
- Bright, saturated accent colors
- Simple shapes (rectangles, circles)

### Color
- Background: white or very light grey (`#FFFFFF`, `#F9FAFB`)
- Text: dark grey to black (`#1F2937`, `#111827`)
- Accent: one bright color (`#3B82F6`, `#10B981`, `#F59E0B`)
- Semantic: standard green/red/yellow/blue

### Typography
- Font: Inter, system sans-serif, Roboto
- Scale: 24/20/16/14/12
- Weights: 400 for body, 600 for emphasis, 700 for headings

### Spacing
- Base unit: 8
- Scale: 8, 16, 24, 32, 48

### Components
- **Cards:** Solid bg, no shadow, thin border or whitespace separation
- **Buttons:** Solid color fill, no shadow, radius 6-8px
- **Inputs:** 1px border, radius 6-8px, focus = border color change
- **Chips:** Solid light bg, no border, radius 16px

### When to avoid
- When you want to stand out (it's the most common style)
- Premium or luxury products (too plain)
- When you need depth or layering

### Platform notes
- **Flutter:** Default `ThemeData` is close to flat. Remove elevations, use solid colors.
- **Web:** Tailwind's default is flat design. Use it as-is.

---

## 7. Swiss / International Typographic Style

**Personality:** Precise, academic, grid-based. Mathematical design.

### When to use
- Editorial, data-heavy, documentation, academic
- When precision and clarity matter more than decoration
- When you want a timeless, intellectual feel

### Visual characteristics
- Mathematical grid system (12-column or modular)
- Sans-serif typography (Helvetica, Inter, Neue Haas Grotesk)
- Asymmetric layouts (not centered)
- Strong typographic hierarchy (size + weight, not color)
- Minimal color (black, white, one accent)
- Flush-left, ragged-right text alignment

### Color
- Background: white (`#FFFFFF`) or off-white (`#FAFAFA`)
- Text: black (`#000000`) or near-black (`#1A1A1A`)
- Accent: one strong color (red `#E63946`, blue `#0066CC`, or brand color)
- No gradients, no tints

### Typography
- Font: Helvetica, Inter, Neue Haas Grotesk, or any grotesque sans-serif
- Scale: 64/48/32/24/16/12 (large jumps, mathematical)
- Weights: 400 for body, 700 for headings (no middle weights)
- Line height: 1.5 for body, 1.1 for headings
- Letter spacing: -0.02em for large, 0 for body

### Spacing
- Base unit: 8 or 12
- Scale: based on the grid (12-column with gutters)
- Page padding: 24-48px
- Generous whitespace between sections

### Components
- **Cards:** No card. Use grid columns and whitespace.
- **Buttons:** Text + underline, or solid black/white rectangle, no radius
- **Inputs:** 1px black border, no radius
- **Chips:** Not used. Use text labels with color coding.

### When to avoid
- Playful or entertainment apps (too serious)
- When you need visual richness or decoration
- Apps for non-technical audiences who find it cold

### Platform notes
- **Flutter:** Use `GridView` or `Column` with `CrossAxisAlignment.start`. No `Card` widget.
- **Web:** CSS Grid is ideal. 12-column grid, `gap: 24px`.

---

## 8. Editorial / Magazine

**Personality:** Storytelling, rich, serif. Like a print magazine.

### When to use
- Publications, blogs, portfolios, content-first apps
- When storytelling and reading experience are the priority
- When you want a sophisticated, literary feel

### Visual characteristics
- Large serif headings (Playfair, Tiempos, Georgia)
- Multi-column text layouts (2-3 columns for long-form)
- Pull quotes, drop caps, image captions
- Generous margins and line height
- Mix of serif (headings) and sans-serif (body, captions)

### Color
- Background: warm white (`#FAF9F7`, `#FFFBF5`) or cream
- Text: dark grey-brown (`#2D2D2D`, `#3A3A3A`), not pure black
- Accent: muted, sophisticated (burgundy `#7C2D12`, forest `#14532D`, navy `#1E3A5F`)
- Images: full-bleed, high quality

### Typography
- Headings: Playfair Display, Tiempos Headline, Georgia (serif)
- Body: Inter, Söhne, or system sans-serif
- Scale: 56/40/28/22/18/16/14 (large display headings)
- Weights: 400-500 for serif headings, 400 for body, 600 for sans labels
- Line height: 1.7 for body (generous), 1.1 for headings
- Drop caps: first letter of article, 4-5x body size, serif

### Spacing
- Base unit: 8
- Scale: 8, 16, 24, 32, 48, 64, 96
- Very generous margins (48-96px on desktop, 24-32px on mobile)
- Large gaps between sections (64-96px)

### Components
- **Cards:** Not used. Content flows in columns.
- **Buttons:** Minimal, text + arrow, or outline
- **Images:** Full-bleed, with caption in small sans-serif below
- **Pull quotes:** Large serif, indented, with left border

### When to avoid
- Data-dense dashboards (not suited for widgets)
- Apps with mostly interactive elements, not content
- When space is limited (editorial needs room to breathe)

### Platform notes
- **Flutter:** `GoogleFonts.playfairDisplay()` for headings, `GoogleFonts.inter()` for body. `Column` with generous padding.
- **Web:** CSS multi-column for long-form, `font-family` stacks, `column-gap: 32px`.

---

## 9. Bento Grid

**Personality:** Modular, scannable, dense. Like a Japanese bento box.

### When to use
- Dashboards, feature showcases, landing pages
- When you have many widgets/cards of varying importance
- When users need to scan and compare information quickly

### Visual characteristics
- Grid of varied-size cards (some 1x1, some 2x1, some 2x2)
- Each card is self-contained (one metric, one feature, one chart)
- Rounded corners (16-24px)
- Consistent gap between cards (12-16px)
- Cards can have different visual treatments (some solid, some with images)

### Color
- Background: light grey (`#F5F5F7`, `#F9FAFB`) or white
- Cards: white or light tinted (each card can have its own subtle bg)
- Text: dark for primary, grey for secondary
- Accent: one color, used for interactive elements or highlights

### Typography
- Font: Inter, SF Pro, or system sans-serif
- Scale: 32/24/20/16/14/12 (large numbers for metrics)
- Weights: 700 for big numbers/metrics, 500 for card titles, 400 for body

### Spacing
- Base unit: 4
- Card gap: 12-16px
- Card padding: 16-24px
- Page padding: 16-24px

### Components
- **Cards:** `BorderRadius.circular(20)`, white bg, subtle shadow or 1px border
- **Metric cards:** Large number (32px 700) + small label (12px 500) + trend indicator
- **Image cards:** Full-bleed image with overlay text or text below
- **Feature cards:** Icon + title + description in a 2x1 or 2x2 card

### When to avoid
- Content that is naturally linear (articles, flows)
- When you have very few items (looks sparse)
- Mobile screens with limited width (bento needs space)

### Platform notes
- **Flutter:** `GridView.count` or `SliverGrid` with `crossAxisCount: 2`, `crossAxisSpacing: 12`, `mainAxisSpacing: 12`. Use `SliverGridDelegateWithMaxCrossAxisExtent` for varied sizes.
- **Web:** CSS Grid with `grid-template-columns: repeat(auto-fit, minmax(200px, 1fr))` and `gap: 12px`.

---

## 10. Cyberpunk / Futurism

**Personality:** High-tech, neon, dark. Sci-fi aesthetic.

### When to use
- Gaming apps, crypto, developer tools, dark-themed dashboards
- When the brand is tech-forward or futuristic
- When dark mode is the primary (not secondary) mode

### Visual characteristics
- Dark background (near-black, `#0A0A0F`, `#0D0D12`)
- Neon accent colors (cyan `#00F5FF`, magenta `#FF00FF`, electric blue `#0080FF`)
- Glow effects (box-shadow with color, text-shadow)
- Monospace fonts for data/labels
- Angular shapes, thin borders, scanline effects
- Animated elements (glitch, flicker, scan)

### Color
- Background: `#0A0A0F`, `#0D0D12`, `#0F0F1A`
- Surface: slightly lighter dark (`#1A1A2E`, `#16213E`)
- Text: white or light grey (`#E0E0E0`, `#C0C0C0`)
- Neon accents: cyan `#00F5FF`, magenta `#FF00FF`, green `#39FF14`, purple `#BF00FF`
- Glow: same as accent color, used in shadows

### Typography
- Headings: Orbitron, Audiowide, or bold sans-serif
- Body: Inter, Roboto, or system sans-serif
- Data/labels: JetBrains Mono, Fira Code, or monospace
- Scale: 32/24/20/16/14/12
- Weights: 700 for headings, 400 for body, 500 for mono labels
- Uppercase for labels and buttons

### Spacing
- Base unit: 4
- Scale: 4, 8, 12, 16, 24, 32
- Tight, dense layouts

### Components
- **Cards:** Dark surface, 1px neon border, subtle neon glow shadow, radius 4-8px (angular)
- **Buttons:** Neon border, neon text, glow on hover. Filled = neon bg + dark text.
- **Inputs:** 1px neon border, dark bg, monospace font, neon caret
- **Chips:** 1px neon border, dark bg, monospace, uppercase

### When to avoid
- Enterprise or conservative brands
- Apps used for long reading sessions (neon strains eyes)
- Light mode apps (cyberpunk is inherently dark)
- Accessibility-critical apps (glow effects reduce clarity)

### Platform notes
- **Flutter:** `BoxShadow(color: neonColor, blurRadius: 8)` for glow. `GoogleFonts.orbitron()` for headings. Dark `Scaffold` bg.
- **Web:** `box-shadow: 0 0 10px #00F5FF;` for glow. `font-family: 'Orbitron', monospace;` Dark theme.

---

## 11. Art Deco

**Personality:** Luxurious, geometric, vintage. 1920s elegance.

### When to use
- Luxury brands, hospitality, events, fashion
- When the brand is premium and wants a vintage-but-timeless feel
- When you can invest in custom geometric patterns

### Visual characteristics
- Gold or metallic accents on dark or cream backgrounds
- Geometric patterns (chevrons, sunbursts, symmetry)
- Serif typography with high contrast strokes (Didot, Bodoni)
- Symmetrical layouts
- Thin gold borders and dividers
- Fan, arch, and stepped shapes

### Color
- Background: deep black (`#0C0C0C`), navy (`#0A1A2F`), or cream (`#F5F0E1`)
- Gold: `#D4AF37`, `#C5A55A`, `#BF9B30`
- Text: cream/white on dark, dark brown on cream
- Accent: gold for all decorative elements

### Typography
- Headings: Playfair Display, Cormorant, Didot, Bodoni (high-contrast serif)
- Body: Inter, or a refined sans-serif
- Scale: 48/36/28/22/18/16/14
- Weights: 400 for serif (they're already dramatic), 400-500 for body
- Letter spacing: 0.1em for labels (wide, elegant)
- Often uppercase for labels and headings

### Spacing
- Base unit: 8
- Scale: 8, 16, 24, 32, 48, 64
- Symmetrical, generous spacing

### Components
- **Cards:** Thin gold border, cream or dark bg, gold corner accents
- **Buttons:** Gold border, gold text, no fill. Or gold fill with dark text.
- **Dividers:** Gold lines, often with a geometric ornament in the center
- **Section headers:** Centered, with gold lines on either side

### When to avoid
- Tech or casual brands (too formal)
- Content-heavy apps (decoration competes with content)
- When you can't invest in custom patterns (looks cheap without detail)
- Dark mode (art deco is hard to adapt to dark mode)

### Platform notes
- **Flutter:** `GoogleFonts.playfairDisplay()`, gold `Color(0xFFD4AF37)`, `Border.all(color: gold, width: 1)`. Custom `CustomPaint` for geometric patterns.
- **Web:** `font-family: 'Playfair Display', serif; border: 1px solid #D4AF37;` SVG for patterns.

---

## 12. Skeuomorphism

**Personality:** Familiar, physical, intuitive. UI mimics real-world objects.

### When to use
- Creative tools (music production, drawing apps)
- When physical metaphors aid understanding
- Niche, when the brand is playful or tactile

### Visual characteristics
- Real-world textures (leather, wood, metal, paper)
- Physical metaphors (buttons that look pressable, dials that look turnable)
- Depth and dimension (gradients, shadows, highlights)
- Realistic icons (not flat, not outline)

### Color
- Depends on the metaphor (leather = brown, metal = grey, paper = cream)
- Text: high contrast against the texture
- Accents: physical (red record button, green power LED)

### Typography
- Font: depends on the metaphor (typewriter = monospace, ledger = serif)
- Often smaller, embedded in the physical metaphor

### Spacing
- Follows the physical metaphor (buttons spaced like a real device)

### Components
- **Buttons:** 3D, with gradient (light top, dark bottom), pressed = invert
- **Dials/Sliders:** Realistic, with tick marks and indicators
- **Toggles:** Physical switch animation
- **Backgrounds:** Textured (leather, wood, paper)

### When to avoid
- Most modern apps (Apple moved away for a reason)
- Content-heavy or data-dense apps
- When you need fast, consistent builds (custom textures are slow)
- Accessibility-critical apps (textures reduce contrast)

### Platform notes
- **Flutter:** `LinearGradient` for 3D buttons, `BoxShadow` for depth. Custom `CustomPaint` for textures.
- **Web:** CSS gradients for 3D, `background-image` for textures. Avoid, it's very hard to do well.

---

## 13. Gradient Mesh

**Personality:** Vibrant, modern, energetic. Flowing color.

### When to use
- Marketing landing pages, startup homepages, splash screens
- When you want to convey energy and modernity
- When the brand is colorful and bold

### Visual characteristics
- Multi-color gradients (mesh gradients, conic gradients)
- Flowing, organic color transitions
- Often used as backgrounds or hero sections
- White or dark text on top of the gradient
- Minimal UI elements (let the gradient be the hero)

### Color
- 3-5 colors in the gradient (e.g. blue → purple → pink → orange)
- Text: white on dark gradients, dark on light gradients
- UI elements: white or glass (so they don't compete with the gradient)

### Typography
- Font: Inter, SF Pro, or system sans-serif
- Scale: 56/40/28/22/18/16/14 (large hero text)
- Weights: 700-800 for hero, 400-500 for body

### Spacing
- Base unit: 8
- Scale: 8, 16, 24, 32, 48, 64
- Generous spacing (let the gradient breathe)

### Components
- **Cards:** White or glass, so they stand out from the gradient
- **Buttons:** White bg with dark text, or glass
- **Inputs:** White bg, subtle shadow

### When to avoid
- Content-heavy apps (gradient competes with content)
- Dashboards or data apps (too distracting)
- When you need to convey trust or stability (too playful)
- Accessibility-critical apps (contrast on gradients is hard to guarantee)

### Platform notes
- **Flutter:** `RadialGradient` or `LinearGradient` in a `Container` decoration. Or use a pre-rendered image.
- **Web:** CSS `background: conic-gradient(...)` or `background: radial-gradient(...)`. Or use an SVG/image.

---

## 14. Corporate / Professional

**Personality:** Trustworthy, structured, safe. B2B and enterprise.

### When to use
- B2B SaaS, enterprise apps, financial services, healthcare
- When trust and clarity matter more than visual distinction
- When the audience is professional and conservative

### Visual characteristics
- Clean, structured layouts
- Blue as primary (trust color)
- Generous whitespace, clear hierarchy
- Professional photography (not illustrations)
- Tables, charts, data displays
- Subtle shadows and borders

### Color
- Background: white or very light grey (`#FFFFFF`, `#F8FAFC`)
- Primary: blue (`#2563EB`, `#1E40AF`, `#1D4ED8`)
- Text: dark grey (`#1E293B`, `#334155`)
- Secondary text: medium grey (`#64748B`, `#94A3B8`)
- Semantic: green `#16A34A`, red `#DC2626`, amber `#D97706`

### Typography
- Font: Inter, Roboto, or system sans-serif
- Scale: 30/24/20/16/14/12
- Weights: 600 for headings, 400 for body, 500 for labels

### Spacing
- Base unit: 4 or 8
- Scale: 4, 8, 12, 16, 24, 32, 48
- Structured, consistent spacing

### Components
- **Cards:** White bg, 1px border `#E2E8F0`, radius 8-12px, subtle shadow
- **Buttons:** Blue fill, white text, radius 6-8px. Secondary = outline.
- **Tables:** Striped rows, sortable headers, pagination
- **Charts:** Clean, labeled, blue primary series

### When to avoid
- Consumer or entertainment apps (too stiff)
- When you want to stand out (it's the default B2B look)
- Creative or artistic brands

### Platform notes
- **Flutter:** Standard `ThemeData` with blue primary. `Card` with `elevation: 1`. `DataTable` for tables.
- **Web:** Tailwind or shadcn/ui defaults. Blue primary, slate neutrals.
