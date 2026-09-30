---
name: mobile-app-design
description: >
  Designs mobile app UIs that respect platform conventions (iOS Human
  Interface Guidelines, Material Design 3) instead of producing shrunken
  web pages. Covers pre-work risk scoring (MFRI), design bible locking,
  platform-first decisions, navigation patterns, touch ergonomics, the
  60/30/10 color rule, 8-pt spacing, system typography with Dynamic
  Type and sp units, dark mode and OLED guidance, haptic feedback,
  emotional design (Peak-End rule), user-stage personalization, and
  framework selection. Use when the user asks to "design a mobile app",
  "mobile UI", "app screen design", "iOS app design", "Android app
  design", "mobile navigation", "React Native design", "Flutter UI
  design", "mobile app mockup", "bottom sheet design", or "tab bar".
metadata:
  version: 2.0.0
license: MIT
---

# Mobile App Design

> Part of [Cognikit](https://cognikit.com). A kit that gives AI agents cognitive abilities.

Design mobile interfaces the way a platform-native designer does: score
the risk before you start, lock a design bible before the first screen,
commit to one platform's conventions, map the flow before the screens,
size every target for a thumb, and treat interruption (offline, empty,
loading, error) as a first-class state. Mobile users are distracted and
one-handed on bad networks; design for that reality or the app fails
quietly.

## AI execution flow (follow in order)

Work through four layers. Do not design screens before Layer 1 is done.

**Layer 1: Pre-work**
1. **Brief**: Answer the checkpoint questions; ask once if platform, framework, or offline needs are unstated.
2. **MFRI**: Score the feature on the Mobile Feasibility and Risk Index; redesign if it drops below 0.
3. **Design bible**: Lock palette, type, spacing, radius, icon style, card behavior, and shadows.

**Layer 2: Platform and navigation**
4. **Platform**: Decide iOS, Android, or both; commit to one convention set per screen, never blend.
5. **Flow map**: Map the 5 to 8 core screens and transitions before detailing any screen.
6. **Navigation skeleton**: Choose the primary pattern from the table, then secondary patterns.
7. **Anatomy and touch**: Safe areas, sticky CTA, thumb zone, tap targets, mobile-native components.

**Layer 3: Visual design**
8. **Color**: 60/30/10 rule, opacity text hierarchy, dark mode palette.
9. **Type**: System fonts, Dynamic Type / sp units, tight scale limits.
10. **Spacing**: 8-pt grid with the 2x relationship multiplier.
11. **Surfaces and haptics**: Tinted soft shadows, icon discipline, haptic weight per action.

**Layer 4: Execution and verification**
12. **Components and states**: Empty, loading, error, and offline variants for every screen.
13. **Emotion**: Design the Peak-End moment; personalize by user stage.
14. **Framework**: Pick the target from the decision tree; apply `references/mobile-perf-patterns.md`.
15. **Verify**: Run `references/mobile-quality-checklist.md`, then the pre-flight checklist below.

## Layer 1: Pre-work

### Checkpoint questions

If any of these are unstated, ask once (batched) before proceeding:

| Aspect | Question | Why it matters |
|---|---|---|
| Platform | iOS, Android, or both? | Navigation, gestures, typography |
| Framework | React Native, Flutter, native, or visual prototype? | Performance patterns and deliverable shape |
| Offline | Must core features work without network? | Data and sync strategy |
| Devices | Phone only, or tablet and foldable too? | Layout and density rules |
| Audience | Consumer, enterprise, accessibility needs? | Target sizes and readability |

If unanswered, default to iOS conventions and state the assumption.
Never default to your favorite stack or pattern.

### MFRI: Mobile Feasibility and Risk Index

Score each dimension 1 to 5 before designing any feature or screen:

| Dimension | Question |
|---|---|
| Platform Clarity | Is the target platform explicitly defined? |
| Interaction Complexity | How complex are gestures, flows, navigation? |
| Performance Risk | Does this involve lists, animation, heavy state, media? |
| Offline Dependence | Does the feature break or degrade without network? |
| Accessibility Risk | Does this impact motor, visual, or cognitive access? |

```
MFRI = (Platform Clarity + Accessibility Readiness)
       - (Interaction Complexity + Performance Risk + Offline Dependence)
Range: -10 to +10
```

| MFRI | Meaning | Required action |
|---|---|---|
| 6-10 | Safe | Proceed normally |
| 3-5 | Moderate | Add performance and UX validation |
| 0-2 | Risky | Simplify interactions or architecture |
| < 0 | Dangerous | Redesign before implementation |

### Mobile design checkpoint

Complete this form before writing any code or drawing any screen:

```
MOBILE CHECKPOINT
Platform:   ___________   Framework: ___________   MFRI: ___
Design bible locked: palette / type / spacing / radius /
                     icons / cards / shadows
3 principles I will apply:            1.  2.  3.
2 anti-patterns I will avoid:         1.  2.
```

If you cannot fill it in, gather more context and ask the user.

### Design bible locking

Lock these tokens once, before the first screen. If a later screen needs
a new token, update the bible deliberately instead of drifting.

| Token | Lock |
|---|---|
| Palette | 60% neutral base, 30% complement, 10% accent, plus semantic colors for light and dark |
| Type | One family (system default), max 4 sizes, max 2 weights |
| Spacing | 8-pt grid values only |
| Radius | Card, sheet, and button corner radii |
| Icon style | One family (SF Symbols / Material Symbols / one custom set), consistent stroke or fill |
| Card behavior | Flat vs elevated, internal padding, tap response |
| Shadows | Soft, tinted toward background hue; one shadow recipe |
| Navigation model | Primary pattern plus sheet/modal rules |

Variation is allowed in composition and emphasis, never in the design
system. Screen 5 must feel like the same product as screen 1.

## Layer 2: Platform and navigation

### Platform-first decision

| Platform | Conventions to follow |
|---|---|
| iOS | Human Interface Guidelines: nav bar with back chevron, SF Symbols, edge swipe-back, modals slide up, action sheets for destructive confirms |
| Android | Material Design 3: top app bar, FAB for the primary action, bottom navigation or drawer, system back must always work |
| Cross-platform (RN, Flutter) | Pick one convention per screen; match the host platform by default |

Unify across platforms: business logic, data models, API contracts,
validation, error semantics. Diverge per platform: navigation, gestures,
icons, typography, pickers, dialogs. Users feel mixed conventions as
wrong even when they cannot name why. Never invent a third language.

### Navigation patterns

| Pattern | When to use | Notes |
|---|---|---|
| Tab bar / bottom navigation | 3 to 5 top-level sections of equal weight | Always visible; icons plus labels; each tab keeps its own stack |
| Stack navigation | Drill-in flows: list to detail to sub-detail | Always provide a back affordance |
| Navigation drawer | Rare; only for 6 or more top-level sections | Hides features; avoid when a tab bar fits |
| Bottom sheet | Contextual actions, filters, previews tied to content | Detents (half, full); drag-to-dismiss |
| Modal (full-screen) | Self-contained tasks: compose, edit, login | Clear done/cancel; not for navigation |
| Segmented control | Switching 2 to 4 views of the same content | Not a replacement for the tab bar |

Rules:

- Primary navigation is always visible; a menu that hides the core feature is wrong.
- Prefer a modal for self-contained tasks; prefer a stack push for browsing deeper.
- Never stack modals. One at a time, dismissed before the next.
- Plan deep links from day one; URL path mirrors navigation path. See `references/mobile-navigation.md`.

### Screen anatomy

- Respect safe area insets: notch and status bar top, home indicator bottom; nothing interactive in unsafe zones.
- Use the platform's collapsing title pattern (iOS large titles, Material top app bars); do not fake it.
- Sticky bottom action bar for primary CTAs ("Buy", "Continue", "Save"): above the home inset, always visible.
- Keyboard-avoiding layouts for every form; inputs never hide behind the keyboard; keep the action reachable.

### Touch ergonomics

- Minimum tap target: 44x44pt iOS, 48x48dp Android, 44px per WCAG 2.2; 8px spacing between targets.
- Padding counts toward the hit area even when the visible glyph is smaller.
- Thumb zone: primary actions in the bottom half; reach degrades toward the top; 49% hold one-handed.
- Destructive actions stay away from primary actions; never put "delete" next to "save".
- Swipe gestures are shortcuts, never the only path; give each a visible alternative and a visual hint.
- Pull-to-refresh only on feeds where fresh content matters.
- Tap feedback lands under 50ms (highlight, ripple, haptic); a silent tap reads as broken.

### Mobile-specific components

- Bottom sheets: detents (peek, half, full), drag-to-dismiss, dimmed backdrop; contextual actions only.
- Action sheets: destructive confirms and small choice sets on iOS; Material dialog or sheet on Android.
- Swipeable list rows: reveal actions on swipe; most destructive action furthest from the swipe origin.
- Badges on tab icons: numeric for counts, dot for "new"; clear when the user visits the tab.

## Layer 3: Visual design

### Color: the 60/30/10 rule

- 60% neutral base (backgrounds), 30% complement (text, dark elements), 10% accent (CTAs, key indicators).
- Build text hierarchy with neutral opacity: 100% headings, 80% body, 60-70% secondary.
- Accent at 5% opacity for secondary buttons and subtle highlights.
- Semantic colors (error, success, warning) follow platform defaults; never for branding or decoration.
- Pair semantic color with an icon; never let color carry meaning alone. Save strong color for real moments.

### Dark mode and OLED

- Design both modes; do not invert. Desaturate primaries, lighten tints for emphasis, check contrast per mode.
- Text on dark is off-white (#E0E0E0 to #F0F0F0), never pure white.
- Backgrounds: #000000 true black (max OLED savings) or #121212 near-black (Material; avoids scroll smear).
- Surfaces step up #1E1E1E to #2C2C2C; express elevation with lighter overlays, not shadows.
- Contrast minimums: 4.5:1 normal text, 3:1 large text and UI; aim for 7:1; assume bright sunlight.

### Typography

- System fonts by default: SF Pro on iOS, Roboto on Android; custom fonts only for brand, with system fallback.
- Use units that scale: pt + Dynamic Type on iOS, sp on Android; fixed sizes fail accessibility; test at 200%.
- Tight scale: max 4 sizes, max 2 weights; hierarchy from weight and opacity, not size jumps.
- Body at 15 to 17 (prefer 16), never below 14; line height 1.4 to 1.6; line length under 60 characters.
- Monospace or tabular figures for prices, stats, and metrics.

### Spacing: the 8-pt grid

- Every spacing value divisible by 8 or 4: 4, 8, 12, 16, 24, 32, 48, 64.
- Relationship spacing: related items sit close; the gap to the next group is at least 2x the inner gap.
- Card internal padding 24 to 32; sections get generous vertical air; the UI must breathe.
- Single-column everything; multi-column grids only for genuine thumbnail galleries.
- A screen that needs squeezing to fit becomes two screens; generous spacing beats dense information.

### Surfaces, shadows, and icons

- Soft shadows only, tinted toward the background hue; never pure gray or black on colored backgrounds.
- Cards only when grouping helps scannability; uniform rows need no cards, mixed content does.
- No box-in-box-in-box nesting; one strong structural move beats five levels of framing.
- One icon family per product, consistent stroke or fill; icons feel chosen for this app, not library-default.

### Haptics

| Action weight | Haptic |
|---|---|
| Browsing, minor selection | Light / `selection`, or none |
| Standard tap, toggle | Medium / `CLICK` |
| Completion, confirm, drop | Heavy or `success` pattern |
| Destructive, payment | Heavy plus `warning` pattern |
| Failed action | `error` pattern / `REJECT` |

Haptics mark confirmations that matter (payment, item added, task
done), never per scroll or per item; fatigue reads as cheapness. Test
on a real device, not the simulator.

## Layer 4: Execution and verification

### States and edge cases

Every screen ships four variants alongside the happy path:

- Offline: queue actions and confirm later; show cached content with a subtle indicator, never a dead screen.
- Loading: skeleton placeholders shaped like the real content; no centered spinner on a structured screen.
- Error: inline retry at the point of failure; say what happened and what to do next.
- Long lists: section indexing or search past a few screens; retain scroll position on back navigation.

### Onboarding and empty states

- First run: one calm value screen; one focal point, short headline, one CTA; no feature-tour carousels.
- Permission asks happen in context when the feature needs them; never a wall before value.
- Every empty state answers what goes here and how to add it, paired with a primary action.

### Feedback patterns

- Optimistic UI for common low-risk actions (like, save, send, toggle): update instantly, roll back on failure.
- Undo over confirm dialogs: let the action happen, offer "Undo" in a snackbar; confirms only for irreversible.
- Snackbar for non-blocking feedback: short, one action max, auto-dismiss; never block the UI for success.

### Emotional design: Peak-End rule

Users remember the peak (most intense moment) and the end (last
impression). Design both deliberately.

- Identify the peak (task completion, milestone, find) and mark it: micro-animation, celebration, payoff.
- Design the ending: summary card, progress affirmation, gentle nudge to return; never let a flow just stop.
- Reduce negative peaks at waits, errors, and long forms with microcopy, progress cues, proactive help.
- Emotional feedback beats functional: encouragement for wins, gentle corrections, celebration scaled to effort.

### User-stage personalization

| Stage | Design for |
|---|---|
| New user | Simple welcome, guided setup, minimal options |
| Returning user | Personalized content, routines, progress indicators |
| Power user | Advanced stats, optimization tools, denser information |

Smart patterns: never show a blank search screen (recent, trending,
recommended); lead status tracking with a confident status and a visual
timeline; prefer tappable selections over manual input with an "Other"
fallback.

### Industry conventions

Follow the category's conventions for familiarity; break one rule
deliberately if you need to stand out.

| Category | Conventions | Key lesson |
|---|---|---|
| Finance / banking | Blue-dominant, whitespace, conservative type | Revolut: tactile interactions (draggable charts, card flips) make basics premium |
| Crypto / Web3 | Dark, bold type, high contrast, geometric | Phantom: polish builds trust; motion and transitions are product features |
| Health / wellness | Bright approachable color, friendly illustration | Guide kindly; make the peak a personalized insight |
| Education | Playful palette, character-driven personality | Duolingo: emotional feedback loops doubled DAUs |
| Fitness | Energetic color, progress momentum | Adapt complexity to user stage |
| Sleep / meditation | Deep blues and purples, minimal, low contrast | Ambient calm is the product |
| Productivity | Dense but organized, strong grid, quick actions | Clarity over decoration |
| E-commerce / food | Product photography, frictionless checkout, trust signals | Visual rhythm sells; keep category items consistent |
| AI / tech | Soft gradients, depth, smooth motion | Motion communicates intelligence; keep it purposeful |
| Social | Media-led rhythm, clear create-vs-browse split | Feed performance and media quality dominate perceived quality |

### Framework decision tree

```
Need OTA updates or web-team velocity -> React Native + Expo
Pixel-identical custom UI on both OS  -> Flutter
iOS only                              -> SwiftUI
Android only                          -> Kotlin + Jetpack Compose
```

No debate without justification. Once chosen, apply
`references/mobile-perf-patterns.md`: FlatList + React.memo +
getItemLayout for RN; const widgets, ValueListenableBuilder, and
Riverpod selectors for Flutter.

### Implementation notes

For prototypes and web-built mockups:

- Design at 375px width (iPhone baseline); check smaller, never assume larger.
- Tailwind utilities for spacing and type; keep every value on the 8-pt grid.
- CSS variables for the color system so dark mode is a token swap.
- `rounded-2xl` / `rounded-3xl` for modern card radii; soft shadows only.
- Lucide or the platform icon set, locked to one stroke weight.

### Anti-patterns (never do)

- Shrunken desktop layouts: sidebars, multi-column grids, dense tables ported to a phone
- Hover-dependent interactions or affordances that only appear on mouseover
- Tap targets under 44pt/48dp, or targets packed edge to edge
- Back behavior that exits the app instead of returning up the stack
- Modal stacking, or modals used for section navigation
- Infinite scroll that loses position on back navigation
- Permission requests before the user has seen value
- Hamburger menus hiding the core feature
- iOS and Android conventions blended on one screen
- AI tells: default purple-blue gradients, random glass cards, ambient blobs, floating-widget homepages, chart spam with no product reason, giant empty cards, pill and badge clutter
- AI copy tells: filler phrases ("elevate your life", "unlock your potential") and fake brand names (Acme, NovaCore, Flowbit)
- Generic template feel: output must read as a designed product with specific palette and component family

## Related skills

- `design-systems`: define visual direction, color, type, and component tokens before applying them to mobile screens
- `design-system-architecture`: build the token infrastructure (primitives, semantic tokens, platform mappings) the mobile UI consumes

## References

| File | Read when |
|---|---|
| `references/mobile-navigation.md` | Tab state, deep links, back handling, predictive back, shared element transitions |
| `references/mobile-perf-patterns.md` | Implementing in React Native or Flutter; lists, animation, memory |
| `references/mobile-quality-checklist.md` | Full audit before declaring the design done |

## Pre-flight checklist

- [ ] Checkpoint questions answered; platform, framework, and offline needs stated
- [ ] MFRI scored; 3 or above, or redesign justified for lower
- [ ] Design bible locked: palette, type, spacing, radius, icons, cards, shadows
- [ ] Primary platform chosen; one convention set per screen, never blended
- [ ] Core flow mapped (5 to 8 screens) with transitions before detailing
- [ ] Primary navigation visible; each tab preserves its own stack
- [ ] Deep link path defined for shareable screens; back works everywhere
- [ ] Every interactive element meets 44x44pt / 48x48dp with 8px spacing
- [ ] Primary CTA in the thumb zone; destructive actions separated
- [ ] Safe area insets respected top and bottom
- [ ] Every swipe gesture has a visible non-gesture alternative
- [ ] 60/30/10 palette applied; opacity-based text hierarchy; contrast 4.5:1+
- [ ] Dark mode defined: off-white text, OLED-aware backgrounds
- [ ] All spacing on the 8-pt grid; type scales at 200%
- [ ] Every screen defines empty, loading, error, and offline states
- [ ] Optimistic UI and undo for common actions; confirms only for irreversible
- [ ] Peak moment and ending designed; user stage considered
- [ ] No AI tells, no emojis, no em/en dashes, no shrunken desktop patterns
