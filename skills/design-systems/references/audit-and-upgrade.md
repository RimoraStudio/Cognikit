# Audit & Upgrade: Redesigning Existing Projects

Use this when the task is to improve an existing UI rather than choose
a new direction. Work with the existing stack. Do not rewrite from
scratch, do not migrate frameworks or styling libraries, and do not
break functionality. Test after every change.

## Sequence

1. **Scan.** Read the codebase. Identify the framework, the styling
   method (Tailwind v3 vs v4, CSS Modules, styled-components, vanilla
   CSS), and the design patterns currently in use.
2. **Diagnose.** Run the audit in `anti-ai-slop.md` (all 122 tells)
   plus the workflow audit in `SKILL.md` Step 3. List every generic
   pattern, weak point, and missing state you find.
3. **Fix.** Apply targeted upgrades in the priority order below.
   Small, reviewable changes over big rewrites.

## Preserve vs. overhaul

Decide which mode the brief calls for before touching code:

| Mode | What changes |
|---|---|
| Preserve | Existing palette, fonts, and layout family stay. Fix tells only: states, spacing, hover feedback, contrast, alignment. |
| Overhaul | Apply the full fix priority below. Set `DESIGN_VARIANCE` +2 and `MOTION_INTENSITY` +2 over the existing baseline (see SKILL.md Step 0). |

## Fix priority order

Apply changes in this order. Maximum visual impact, minimum risk:

| # | Fix | Why it lands first |
|---|---|---|
| 1 | Font swap | Biggest instant improvement, lowest risk |
| 2 | Color palette cleanup | Remove clashing and oversaturated colors, lock one accent |
| 3 | Hover and active states | Makes the interface feel alive |
| 4 | Layout and spacing | Grid, max-width, consistent padding |
| 5 | Replace generic components | Swap cliche patterns for modern alternatives |
| 6 | Add loading, empty, error states | Makes it feel finished |
| 7 | Polish type scale and spacing | The premium final touch |

## Upgrade techniques

Pull from these to replace generic patterns. Apply only what the
direction calls for; unmotivated motion and decoration are tells.

### Typography upgrades

- Variable font animation: interpolate weight or width on scroll or
  hover.
- Outlined-to-fill transitions on scroll entry or interaction.
- Text mask reveals: display type as a window to video or imagery.
- `tabular-nums` or a monospace face for data-heavy numbers.
- `text-wrap: balance` on headings, `text-wrap: pretty` on body.

### Layout upgrades

- Broken grid / deliberate asymmetry: overlapping elements,
  off-screen bleed, offset with calculated randomness.
- Whitespace maximization around a single element.
- Parallax card stacks that pin and stack during scroll.
- Split-screen scroll: two halves sliding in opposite directions.
- Double-bezel enclosures for hero and feature surfaces (see
  `components.md`).

### Motion upgrades

- Smooth scroll with inertia for a heavier, cinematic feel.
- Staggered entry (`delay = index * 80ms`), combining Y-translation
  with opacity fade. Never mount everything at once.
- Spring physics instead of linear easing on interactive elements.
- Scroll-driven reveals: expanding masks, wipes, draw-on SVG paths
  tied to scroll progress.
- Scroll choreography via IntersectionObserver, `whileInView`, or
  GSAP ScrollTrigger. Never `window.addEventListener('scroll')`.

### Surface upgrades

- True glassmorphism: `backdrop-filter` + 1px inner border + subtle
  inner shadow for edge refraction.
- Spotlight borders: card borders that illuminate under the cursor.
- Grain and noise overlays on fixed, `pointer-events-none`
  pseudo-elements only.
- Colored, tinted shadows carrying the background hue instead of
  generic black.

## Redesign rules

- Match the existing stack. Never migrate frameworks mid-redesign.
- Before importing any library, check the project's dependency file.
  If the package is missing, output the install command first.
- If the project uses Tailwind, check the version (v3 vs v4) before
  modifying config.
- No framework at all means vanilla CSS.
- Keep changes reviewable and focused. Targeted improvements over big
  rewrites.
- Preserve content and functionality. The redesign is visual and
  structural, not a product change.
- Update `DESIGN.md` before changing code, so the spec and the
  implementation never diverge.
