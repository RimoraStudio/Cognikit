# Anti-AI Slop: Universal Design Tells to Avoid

AI-generated design has recognizable fingerprints. These are the patterns
that make a UI look "AI-built" rather than designed. Avoid all of them
regardless of which design system you choose.

This is a self-contained checklist. Run through every item before
considering any design task complete.

---

## Color tells

### 1. The Lila Rule

**The tell:** Purple/blue "AI gradient" aesthetic. Automatic purple button
glows, random neon gradients, violet accent on everything.

**Why it's slop:** It's the single most common AI design fingerprint. Every
LLM defaults to purple/blue gradients. The brand becomes invisible.

**Instead:**
- Use neutral bases (zinc, slate, stone, warm grey)
- One high-contrast singular accent (emerald, electric blue, deep rose,
  burnt orange)
- If the brand explicitly asks for purple, embrace it with intent:
  consistent palette, harmonized neutrals, restrained gradients

**Banned as defaults:**
- `#7C3AED` / `#8B5CF6` violet buttons
- Purple-to-blue gradient backgrounds
- Neon purple glow shadows
- Indigo accent on slate-grey dashboards

### 2. The Premium-Consumer Palette Ban

**The tell:** Warm beige/cream + brass/clay/oxblood/ochre + espresso/ink
dark text for every "premium" or "artisan" brand.

**Why it's slop:** Every AI-generated premium-consumer site uses this exact
palette. The brand becomes invisible.

**Banned hex families as defaults:**
- Backgrounds: `#f5f1ea`, `#f7f5f1`, `#fbf8f1`, `#efeae0`, `#ece6db`,
  `#faf7f1`, `#e8dfcb`
- Accents: `#b08947`, `#b6553a`, `#9a2436`, `#9c6e2a`, `#bc7c3a`,
  `#7d5621`
- Text: `#1a1714`, `#1a1814`, `#1b1814`

**Instead, rotate from these alternatives:**
- Cold Luxury: silver-grey + chrome + smoke
- Forest: deep green + bone + amber accent
- Black and Tan: true off-black + warm tan, sharp contrast
- Cobalt + Cream: saturated blue against a single neutral
- Terracotta + Slate: warm rust against cool grey
- Olive + Brick + Paper: muted olive plus brick-red accent
- Pure monochrome + single saturated pop

**Rule:** If the previous premium-consumer project used the beige+brass
family, the next one MUST use a different family. Never ship the same
warm-craft palette twice in a row.

**Override:** The beige+brass+espresso palette is acceptable ONLY when the
brand brief explicitly names those colors, or when the brand identity is
genuinely vintage/artisan AND you can articulate why this specific palette
fits this specific brand.

### 3. Oversaturated Accents

**The tell:** Accent colors at full saturation, screaming for attention.

**Instead:** Keep saturation below 80%. Desaturate accents so they blend
with neutrals instead of competing.

### 4. Multiple Accent Colors

**The tell:** Blue, teal, orange, and yellow all on the same screen.

**Instead:** One accent color per screen. Pick one and let the rest be
neutral. Consistency beats variety.

### 5. Color Consistency Violations

**The tell:** A warm-grey site with a blue CTA in section 7. A rose-
accented site with a teal status badge in the footer.

**Rule:** Once an accent color is chosen for a page, it is used on the
WHOLE page. Pick one accent, lock it, audit every component before
shipping.

### 6. Mixing Warm and Cool Greys

**The tell:** Warm grey text on cool grey background, or vice versa.

**Instead:** Stick to one grey family. Tint all greys with a consistent
hue (warm or cool, not both).

---

## Typography tells

### 7. Serif-as-Default Bias

**The tell:** Reaching for a serif display font for any "creative" or
"premium" brief. "It feels editorial" is not a reason.

**Why it's slop:** The mental model that "creative brief = serif" is one
of the most reliable AI tells.

**Banned as defaults:**
- `Fraunces` (the #1 LLM-favorite display serif)
- `Instrument Serif`
- Any serif used because "this is a creative/premium brief"

**Serif is only acceptable when ONE of these is explicitly true:**
1. The brand brief literally names a serif font
2. The aesthetic is genuinely editorial/luxury/publication/heritage AND
   you can articulate why this specific serif fits this specific brand

**For everything else, default sans-serif display:**
- Geist Display, ABC Diatype, Söhne Breit, Cabinet Grotesk Display,
  Migra Sans, GT Walsheim, Inter Display, PP Neue Montreal

### 8. Inter Everywhere

**The tell:** Inter as the default sans-serif for every project.

**Why it's slop:** Inter is the most-used font in AI output. It's fine,
but it's the default reach, not a considered choice.

**Banned as default fonts:**
- Inter, Roboto, Arial, Open Sans, Helvetica

**Instead, reach for first:**
- Geist, Outfit, Cabinet Grotesk, Satoshi, PP Neue Montreal, Plus Jakarta
  Sans, Clash Display

**Override:** Inter is acceptable when the user explicitly asks for a
neutral/standard/Linear-style feel, or for public-sector/accessibility-
first sites.

### 9. Mixed-Family Emphasis

**The tell:** Injecting a random serif word into a sans headline (or vice
versa) to add visual interest.

**Why it's slop:** Amateur. Mixed-family emphasis looks like a mistake.

**Instead:** Use italic or bold of the SAME font for emphasis.

### 10. Only Regular (400) and Bold (700) Weights

**The tell:** No medium (500) or semibold (600) weights used.

**Instead:** Introduce Medium (500) and SemiBold (600) for more subtle
hierarchy.

### 11. Missing Letter-Spacing Adjustments

**The tell:** No tracking adjustments. Same letter-spacing for 48px
headlines and 11px labels.

**Instead:** Use negative tracking for large headers (-0.02em), positive
tracking for small caps or labels (0.05-0.2em).

### 12. All-Caps Subheaders Everywhere

**The tell:** Every section header is uppercase.

**Instead:** Try lowercase italics, sentence case, or small-caps.

### 13. Title Case On Every Header

**The tell:** "Get Started With Our Platform" instead of "Get started
with our platform".

**Instead:** Use sentence case for headers. Title case reads as formal
and dated.

### 14. Italic Descender Clipping

**The tell:** Italic display type with descender letters (`y g j p q`)
clipped because `line-height: 1` is too tight.

**Instead:** Use `line-height: 1.1` minimum and add `padding-bottom` reserve
on the wrapping element when italic is used in display type.

---

## Layout tells

### 15. Centered Hero Bias

**The tell:** Centered hero with H1 + subtext + two CTAs, every time.

**Why it's slop:** It's the LLM default layout. Every AI site starts with
a centered hero.

**Instead (when variance is medium to high):**
- Split screen (50/50)
- Left-aligned content / right-aligned asset
- Asymmetric whitespace
- Scroll-pinned structures

**Override:** Centered hero is OK for editorial/manifesto/launch
announcements where the message itself is the design.

### 16. Three Equal Feature Cards

**The tell:** Three equal-height cards in a row, each with an icon, a
title, and a description. The most generic AI layout.

**Why it's slop:** It's the default for every "features" section.

**Instead:**
- 2-column zig-zag
- Asymmetric grid (one large + two small)
- Horizontal scroll
- Masonry layout
- Bento grid with varied cell sizes
- Single full-width feature with inline highlights

### 17. Eyebrow Everywhere

**The tell:** Small uppercase wide-tracking label above EVERY section
header (`FOUR COLORWAYS`, `SELECTED WORK`, `THE HARDWARE`).

**Why it's slop:** Every AI-built site puts an eyebrow above every section,
producing the same templated rhythm. This is the #1 violated rule in
production tests.

**Rule:** Maximum 1 eyebrow per 3 sections. Hero counts as 1. If section
A has an eyebrow, the next 2 sections cannot have one.

**Instead:** Drop it entirely. The headline alone is enough. The section's
location on the page already categorizes it.

### 18. Section-Layout Repetition

**The tell:** Every section uses the same layout family (3-column cards,
full-width quote, split-text-image repeated).

**Why it's slop:** Templated rhythm. Reads as one template applied
everywhere.

**Rule:** Once you use a layout family for a section, it can appear at
most ONCE on the page. A page with 8 sections must use at least 4
different layout families.

### 19. Zigzag Alternation

**The tell:** Alternating "left-image + right-text" then "left-text +
right-image" for every section.

**Why it's slop:** Banal. Max 2 sections in a row with this pattern. The
3rd consecutive image+text split is a fail.

**Instead:** Break the pattern with a full-width section, a vertical-stack
section, a bento grid, a marquee, or a different layout family.

### 20. Split-Header Pattern

**The tell:** "Left big headline + right small explainer paragraph" as a
section header (left col-span-7/8, right col-span-4/5 with a small body
paragraph floating in the right column).

**Why it's slop:** Sections should have ONE focused message.

**Instead:** Stack headline and body vertically (headline on top, body
below, max-width 65ch). Reach for split-header only when the right column
carries a visual or interactive element, not just filler text.

### 21. Bento Grid Without Rhythm

**The tell:** 6 left-image / right-text rows stacked, or 6 identical
white-on-white cards.

**Instead:** Vary the composition. Alternate full-width feature rows,
asymmetric tile sizes, vertical breaks. At least 2-3 cells in any
multi-cell grid need real visual variation (image, gradient, pattern,
tinted background).

### 22. Bento Empty Cells

**The tell:** A bento grid with an empty cell in the middle or at the end.

**Rule:** A bento grid has EXACTLY as many cells as you have content for.
3 items = 3 cells. 5 items = 5 cells. If your grid has an empty cell, you
planned wrong. Re-shape the grid.

### 23. Everything Centered and Symmetrical

**The tell:** All content centered, all sections symmetrical.

**Instead:** Break symmetry with offset margins, mixed aspect ratios, or
left-aligned headers over centered content.

### 24. Using `height: 100vh` for Full-Screen Sections

**The tell:** `height: 100vh` causes layout jumping on mobile (iOS Safari
address bar).

**Instead:** Use `min-height: 100dvh` to prevent viewport jumping.

### 25. Complex Flexbox Percentage Math

**The tell:** `width: calc(33% - 1rem)` for grid layouts.

**Instead:** Use CSS Grid for reliable multi-column structures
(`grid grid-cols-1 md:grid-cols-3 gap-6`).

### 26. No Max-Width Container

**The tell:** Content stretches edge-to-edge on wide screens.

**Instead:** Add a container constraint (1200-1440px) with auto margins.

### 27. Uniform Border-Radius on Everything

**The tell:** Same `border-radius` on buttons, cards, inputs, images.

**Instead:** Vary the radius: tighter on inner elements, softer on
containers. Or pick one scale and document it (see tell #43).

### 28. No Overlap or Depth

**The tell:** Elements sit flat next to each other, no layering.

**Instead:** Use negative margins to create layering and visual depth.

### 29. Symmetrical Vertical Padding

**The tell:** Top and bottom padding are always identical.

**Instead:** Adjust optically. Bottom padding often needs to be slightly
larger to feel balanced.

### 30. Edge-to-Edge Sticky Navbars

**The tell:** Navbar glued to the top, full width, no breathing room.

**Instead:** Floating nav pill detached from the top with margin.

### 31. Hero Stack Overload

**The tell:** Hero has eyebrow + headline + subtext + CTAs + tagline +
trust micro-strip + pricing teaser + feature bullets + social-proof
avatars.

**Rule:** The hero is a single moment, not a feature list. Max 4 text
elements:
1. Eyebrow (optional, pick zero or one)
2. Headline (max 2 lines)
3. Subtext (max 20 words, max 4 lines)
4. CTAs (1 primary + max 1 secondary)

**Banned in the hero:** tiny tagline below CTAs, trust micro-strip,
pricing teaser, feature bullet list, social-proof avatar row. All of
those move to dedicated sections below the hero.

### 32. "Used by" Logo Wall Inside the Hero

**The tell:** Trust logos stuffed into the same flex row as the hero copy.

**Instead:** The logo wall is a separate section directly below the hero.

### 33. Navigation Wraps to Two Lines on Desktop

**The tell:** Nav items don't fit at 1024px, so they wrap.

**Rule:** Navigation MUST render on a single line on desktop. If items
don't fit, condense labels, drop secondary items, or move to a hamburger.
Nav height cap: 80px max desktop, default 64-72px.

### 34. Hero Overflows the Initial Viewport

**The tell:** Headline is 6 lines, subtext is 40 words, CTAs require scroll
to find.

**Rule:** Hero MUST fit in the initial viewport. Headline max 2 lines on
desktop, subtext max 20 words AND max 3-4 lines, CTAs visible without
scroll. Hero top padding max 6rem at desktop.

### 35. Mobile Collapse Not Explicit

**The tell:** "It'll work, Tailwind handles it" assumptions for mobile.

**Rule:** For every multi-column layout, declare the `< 768px` fallback
explicitly. Asymmetric layouts above `md:` MUST collapse to strict
single-column with `w-full`, `px-4`, `py-8` on viewports below 768px.

---

## Materiality tells

### 36. Glassmorphism on Everything

**The tell:** `backdrop-blur` on every surface, regardless of context.

**Why it's slop:** Glassmorphism is overused. It's expensive, fails
contrast on busy backgrounds, and looks generic when applied to
everything.

**Instead:** Use glass only when:
- Premium consumer, Apple-adjacent, luxury brand, or media-overlay vibes
- There's vibrant background content to show through
- You add a 1px inner border and subtle inner shadow for physical edge
  refraction

**Avoid glass for:**
- Dashboards, public-sector, "boring B2B"
- Apps with mostly white/text-only content (nothing to blur)
- Accessibility-critical apps
- Low-end devices

**Performance rule:** Apply `backdrop-blur` only to fixed or sticky
elements (navbars, overlays). Never apply blur filters to scrolling
containers or large content areas. This causes continuous GPU repaints
and severe mobile frame drops.

### 37. Pure-Black Drop Shadows

**The tell:** `rgba(0,0,0,0.1)` or `shadow-md` on light backgrounds.

**Instead:** Tint shadows to match the background hue. Dark blue shadow
on a blue background, warm grey shadow on a cream background.

### 38. Generic 1px Solid Grey Borders

**The tell:** `border: 1px solid #e5e7eb` on every card.

**Instead:** Remove the border and use background color or spacing for
separation. Or use a tinted border that matches the palette. Cards
should exist only when elevation communicates real hierarchy.

### 39. Inconsistent Corner Radii

**The tell:** Round buttons in a square layout, or square cards on a
pill-button page.

**Rule:** Pick ONE corner-radius scale for the page and stick to it.
Mixed systems are allowed only when there is a documented rule (e.g.
"buttons are full-pill, cards are 16px, inputs are 8px") and that rule
is followed everywhere.

### 40. Flat Design with Zero Texture

**The tell:** Pure flat vectors, no depth, no texture.

**Instead:** Add subtle noise, grain, or micro-patterns to backgrounds.
Pure flat vectors feel sterile.

### 41. Perfectly Even Gradients

**The tell:** Standard linear 45-degree fades.

**Instead:** Break the uniformity with radial gradients, noise overlays,
or mesh gradients.

### 42. Inconsistent Lighting Direction

**The tell:** Shadows suggesting different light sources on different
elements.

**Instead:** Audit all shadows to ensure they suggest a single,
consistent light source.

---

## Interactivity tells

### 43. Static Successful State Only

**The tell:** Only the "loaded" state is designed. Loading, empty, and
error states are missing or use generic spinners.

**Instead:**
- **Loading:** Skeletal loaders matching the final layout's shape. Not
  generic circular spinners.
- **Empty:** Beautifully composed. Indicate how to populate.
- **Error:** Clear, inline (forms) or contextual (toasts only for
  transient). Never `window.alert()`.
- **Tactile feedback:** On `:active`, use `-translate-y-[1px]` or
  `scale-[0.98]` to simulate a physical push.

### 44. No Hover States

**The tell:** Buttons don't respond to hover.

**Instead:** Add background shift, slight scale, or translate on hover.
200-300ms transitions.

### 45. No Active/Pressed Feedback

**The tell:** Buttons don't respond to press.

**Instead:** Add a subtle `scale(0.98)` or `translateY(1px)` on press to
simulate a physical click.

### 46. Instant Transitions

**The tell:** Zero-duration transitions, instant state changes.

**Instead:** Add smooth transitions (200-300ms) to all interactive
elements.

### 47. Missing Focus Ring

**The tell:** No visible focus indicators for keyboard navigation.

**Instead:** Ensure visible focus indicators. This is an accessibility
requirement, not optional.

### 48. Unmotivated Motion

**The tell:** GSAP everywhere because GSAP is available. Every card has
an infinite loop animation.

**Rule:** Before adding any animation, ask "what does this animation
communicate?" Valid answers: hierarchy, storytelling, feedback, state
transition. Invalid answer: "it looked cool."

### 49. Marquee Overload

**The tell:** Two or more horizontal scrolling marquees on the same page.

**Rule:** At most ONE marquee per page. Two or more reads as lazy filler.

### 50. Standard Easing Curves

**The tell:** `linear` or `ease-in-out` transitions everywhere.

**Instead:** Use custom cubic-bezier curves (e.g.
`cubic-bezier(0.32, 0.72, 0, 1)`) or spring physics for natural,
weighty motion.

### 51. Animating Layout-Triggering Properties

**The tell:** Animating `top`, `left`, `width`, `height`.

**Instead:** Animate ONLY `transform` and `opacity`. Use
`will-change: transform` sparingly, only on elements that will actually
animate.

### 52. `window.addEventListener("scroll")` for Animations

**The tell:** Scroll listeners that run on every frame, causing reflows.

**Instead:** Use IntersectionObserver, CSS scroll-driven animations
(`animation-timeline: view()`), or a motion library's scroll utilities.

### 53. No Reduced Motion Support

**The tell:** Animations don't respect `prefers-reduced-motion`.

**Rule:** Any motion above intensity 3 MUST honor `prefers-reduced-motion`.
Infinite loops, parallax, scroll-hijack, and magnetic physics MUST
collapse to static or instant under reduced motion. This is
non-negotiable.

---

## Component tells

### 54. Generic Card Look

**The tell:** Border + shadow + white background on every card.

**Instead:** Remove the border, or use only background color, or use only
spacing. Cards should exist only when elevation communicates hierarchy.

### 55. Always One Filled + One Ghost Button

**The tell:** Every CTA row has one filled button and one outline button.

**Instead:** Add text links or tertiary styles to reduce visual noise.

### 56. Pill-Shaped "New" and "Beta" Badges

**The tell:** Every badge is a pill with bright color.

**Instead:** Try square badges, flags, or plain text labels.

### 57. Accordion FAQ Sections

**The tell:** FAQ is always a collapsible accordion.

**Instead:** Use a side-by-side list, searchable help, or inline
progressive disclosure.

### 58. 3-Card Carousel Testimonials

**The tell:** Three testimonial cards in a carousel with dots.

**Instead:** Replace with a masonry wall, embedded social posts, or a
single rotating quote.

### 59. Pricing Table with 3 Towers

**The tell:** Three pricing columns, middle one slightly taller.

**Instead:** Highlight the recommended tier with color and emphasis, not
just extra height.

### 60. Modals for Everything

**The tell:** Popups for simple actions that could be inline.

**Instead:** Use inline editing, slide-over panels, or expandable
sections.

### 61. Avatar Circles Exclusively

**The tell:** Every avatar is a perfect circle.

**Instead:** Try squircles or rounded squares for a less generic look.

### 62. Sun/Moon Light-Dark Toggle

**The tell:** Theme toggle is always a sun/moon switch.

**Instead:** Use a dropdown, system preference detection, or integrate
into settings.

### 63. Footer Link Farm with 4 Columns

**The tell:** Footer has 4 columns of links, dozens of links total.

**Instead:** Simplify. Focus on main navigational paths and legally
required links.

---

## Iconography tells

### 64. Lucide or Feather Icons Exclusively

**The tell:** These are the "default" AI icon choices.

**Instead:** Use Phosphor, Heroicons, Remix Line, or a custom set for
differentiation. Use ultra-light, precise lines, not thick strokes.

### 65. Cliche Icon Metaphors

**The tell:** Rocketship for "Launch", shield for "Security", lightbulb
for "Idea".

**Instead:** Replace cliche metaphors with less obvious icons (bolt,
fingerprint, spark, vault).

### 66. Inconsistent Stroke Widths

**The tell:** Icons with different stroke weights on the same screen.

**Instead:** Audit all icons and standardize to one stroke weight.

### 67. Missing Favicon

**The tell:** No favicon, or default browser favicon.

**Instead:** Always include a branded favicon.

### 68. Stock "Diverse Team" Photos

**The tell:** Uncanny stock imagery of diverse groups posing.

**Instead:** Use real team photos, candid shots, or a consistent
illustration style.

### 69. Emojis as Icons

**The tell:** Emoji characters (🔒, ⚙️, 👤) used as UI icons.

**Instead:** Use a proper icon library (Lucide, Phosphor, Material,
Heroicons, or custom SVG).

---

## Content tells

### 70. Em Dashes in UI Copy

**The tell:** Em dashes (`—`) as sentence connectors in headlines,
descriptions, button labels, or UI text.

**Why it's slop:** Reads as AI-generated text. One of the most reliable
LLM tells.

**Banned everywhere:** UI copy, code comments, README files, button
labels, descriptions, error messages.

**Instead:** Use periods, commas, or line breaks.

### 71. AI Copywriting Cliches

**The tell:** "Elevate", "Seamless", "Unleash", "Next-Gen",
"Game-changer", "Delve", "Tapestry", "In the world of...".

**Instead:** Write plain, specific language. Never use these words.

### 72. Fake-Precise Numbers

**The tell:** Numbers like `92%`, `4.1x`, `48k`, `5.8mm`, `13.4lb` that
look precise but are AI-invented.

**Instead:**
- Use real data from the brief, brand guidelines, or public metrics
- Or explicitly label as mock (`<!-- mock -->`, "example", "sample data")
- Never fake engineering precision the brand doesn't claim

### 73. Fake Round Numbers

**The tell:** `99.99%`, `50%`, `$100.00`.

**Instead:** Use organic, messy data: `47.2%`, `$99.00`,
`+1 (312) 847-1928`.

### 74. Placeholder Names

**The tell:** "Acme Corp", "Nexus", "SmartFlow", "John Doe", "Jane
Smith".

**Instead:** Invent contextual, believable brand names. Use diverse,
realistic-sounding names for people.

### 75. Exclamation Marks in Success Messages

**The tell:** "Saved successfully!" with exclamation.

**Instead:** Remove exclamation marks. Be confident, not loud.
"Saved successfully."

### 76. "Oops!" Error Messages

**The tell:** "Oops! Something went wrong."

**Instead:** Be direct: "Connection failed. Please try again."

### 77. Passive Voice

**The tell:** "Mistakes were made." "An error occurred."

**Instead:** Use active voice: "We couldn't save your changes."

### 78. Lorem Ipsum

**The tell:** Placeholder Latin text.

**Instead:** Never use placeholder Latin. Write real draft copy.

### 79. Copy Self-Audit Failures

**The tell:** Grammatically broken strings, unclear referents, AI
hallucination wordplay, forced metaphors, passive-aggressive humility,
fake-craftsman labels, mock-poetic micro-meta.

**Rule:** Before declaring done, re-read every visible string. Flag any
that are grammatically broken, have unclear referents, sound like AI
hallucination, or read like an LLM trying to sound thoughtful. Rewrite
every flagged string. If unsure, replace with a plain functional
sentence. AI-generated cute copy is worse than boring copy.

### 80. Long Spec Sheets

**The tell:** A 20-row specification table with `border-b` on every row.

**Instead:**
- 2-col card grid: each spec gets its own card with name, value (large
  display number), and one-line "why it matters"
- Scroll-snap horizontal pills
- Grouped chunks: group specs into 3 logical clusters with ONE soft
  divider per cluster
- Featured-vs-rest: 3-4 hero specs as large display tiles, rest collapsed
  under "View full specifications"

### 81. Long Lists with Hairline Dividers

**The tell:** A 20-item list with `border-b` under every row.

**Instead:** Group rows into 2-3 chunks with sparse dividers, or move to
a card-per-item layout. Use tabs, accordion, horizontal scroll, or
carousel for breadth-heavy lists.

### 82. Same Avatar for Multiple Users

**The tell:** One stock image reused for every user testimonial.

**Instead:** Use unique assets for every distinct person.

### 83. All Blog Post Dates Identical

**The tell:** Every blog post has the same date.

**Instead:** Randomize dates to appear real.

---

## Asset tells

### 84. Div-Based Fake Screenshots

**The tell:** Hand-built "product preview" rendered with `<div>`
rectangles, fake task lists, fake dashboards, fake terminal windows.

**Why it's slop:** It's a Tell. Real products have real screenshots.

**Instead:**
- Use a real screenshot URL if one exists
- Generate one via image tool
- Use a real component preview (an actual mini-version of the UI)
- Or skip the preview entirely and use editorial photography

### 85. Plain Text Wordmarks for Logos

**The tell:** "Trusted by" logo wall rendered as `<span>Acme Co</span>`
styled in a row.

**Instead:**
- Use Simple Icons (`https://cdn.simpleicons.org/{slug}/ffffff`)
- Use devicon for tech-stack logos
- If the brand is invented, generate a simple monogram SVG (one letter
  in a circle, two-letter ligature, abstract glyph)
- Logos only, no industry/category labels below each logo

### 86. Hand-Rolled SVG Illustrations

**The tell:** Custom decorative SVGs drawn from scratch.

**Instead:** Strongly discouraged as default. Acceptable only when the
brief explicitly calls for it, or it's a single simple geometric mark.

### 87. Text-Only Pages

**The tell:** A landing page with zero images, just text and gradients.

**Instead:** Even minimalist sites need real images. A pure-text page is
not minimalism, it is incomplete work. Generate at least 2-3 real images
(hero, one product/lifestyle shot, one supporting image).

---

## Theme tells

### 88. Page Theme Inconsistency

**The tell:** Light-mode section sandwiched between dark sections (or
vice versa).

**Why it's slop:** The user feels they walked into a different website
mid-scroll.

**Rule:** The page has ONE theme. Sections do not invert. Pick light,
dark, or auto at the page level and lock it. Section-level background
tints within the same theme family are fine; flipping to a different
theme in the middle is broken.

### 89. Pure `#000000` Background

**The tell:** Pure black background in dark mode.

**Instead:** Replace with off-black, dark charcoal, or tinted dark
(`#0a0a0a`, `#121212`, or a dark navy).

### 90. No Dark Mode for Consumer Apps

**The tell:** Light-only design for a consumer-facing app.

**Rule:** Design for both modes from the start. Use CSS variables or
utility `dark:` variants. Respect `prefers-color-scheme: dark`.

---

## Accessibility tells

### 91. Button Contrast Failures

**The tell:** White button + white text. `bg-white` CTA with `text-white`
label. Transparent button against page background with no border.

**Rule:** Before shipping any button, verify contrast ratio WCAG AA min
(4.5:1 for body, 3:1 for large text 18px+). Audit every CTA.

### 92. Form Contrast Failures

**The tell:** Light placeholders on near-white forms, white form on
white page, form labels with less than 4.5:1 contrast.

**Rule:** Form inputs, placeholder text, focus rings, helper text, and
error text all pass WCAG AA contrast against the section background.

### 93. CTA Button Wrap

**The tell:** Button text wraps to 2 or 3 lines on desktop.

**Rule:** Button text MUST fit on one line at desktop. Shorten the label
(3 words max for primary CTAs, ideally 1-2) or widen the button.

### 94. Duplicate CTA Intent

**The tell:** Two CTAs with the same intent on one page ("Get in touch"
+ "Contact us" + "Let's talk").

**Rule:** One label per intent. Pick ONE label and use it everywhere on
the page (nav, hero, footer).

### 95. Missing Alt Text

**The tell:** `alt=""` or `alt="image"` on meaningful images.

**Instead:** Describe image content for screen readers.

### 96. Missing Semantic HTML

**The tell:** Div soup. `<div>` for everything.

**Instead:** Use `<nav>`, `<main>`, `<article>`, `<aside>`, `<section>`.

### 97. No "Skip to Content" Link

**The tell:** No skip link for keyboard users.

**Instead:** Add a hidden skip-link at the top of the page.

### 98. No "Back" Navigation

**The tell:** Dead ends in user flows. No way to go back.

**Instead:** Every page needs a way back.

### 99. No Custom 404 Page

**The tell:** Default browser 404.

**Instead:** Design a helpful, branded "page not found" experience.

### 100. No Form Validation

**The tell:** No client-side validation.

**Instead:** Add client-side validation for emails, required fields, and
format checks.

---

## Code quality tells

### 101. Inline Styles Mixed with CSS Classes

**The tell:** `style="..."` attributes alongside CSS classes.

**Instead:** Move all styling to the project's styling system.

### 102. Hardcoded Pixel Widths

**The tell:** `width: 800px` instead of relative units.

**Instead:** Use relative units (`%`, `rem`, `em`, `max-width`).

### 103. Arbitrary Z-Index Values

**The tell:** `z-50`, `z-[9999]` without a system.

**Instead:** Establish a clean z-index scale in a constants file. Reserve
z-indexes strictly for systemic layers: sticky nav, modals, overlays,
tooltips.

### 104. Commented-Out Dead Code

**The tell:** Debug artifacts left in production code.

**Instead:** Remove all debug artifacts before shipping.

### 105. Import Hallucinations

**The tell:** Imports that don't exist in `package.json`.

**Instead:** Check that every import actually exists in the project
dependencies.

### 106. Missing Meta Tags

**The tell:** No `<title>`, `description`, `og:image`, or social sharing
meta tags.

**Instead:** Add proper meta tags for SEO and social sharing.

### 107. No Legal Links

**The tell:** No privacy policy or terms of service links.

**Instead:** Add legal links in the footer.

---

## Performance tells

### 108. Grain/Noise on Scrolling Containers

**The tell:** Noise filter applied to a scrolling container.

**Instead:** Apply grain/noise exclusively to fixed, `pointer-events-none`
pseudo-elements. Never on scrolling containers. Continuous GPU repaints
destroy mobile FPS.

### 109. Heavy Bundle Size

**The tell:** Large animation libraries loaded for above-the-fold content.

**Instead:** Lazy-load anything that's not above-the-fold. Be aware of
bundle size.

### 110. No Core Web Vitals Check

**The tell:** No Lighthouse audit before declaring done.

**Targets:**
- LCP < 2.5s. Hero image must be preloaded.
- INP < 200ms. Heavy work off main thread.
- CLS < 0.1. Reserve space for images, fonts, embeds.

---

## The "One More Pass" Rule

Before declaring any design task complete, do one final pass reading
every visible string, every component, every color, every spacing
value. If anything reads as "AI-default" or "templated", fix it. The
difference between AI-generated design and designed design is the
willingness to do one more pass.
