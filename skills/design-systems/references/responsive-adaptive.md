# Responsive & Adaptive Design: Mobile, Tablet, Desktop

Design must work across phone, tablet/iPad, and desktop. Each form factor
has different constraints, input methods, and user expectations. This
reference covers the rules for each platform and how to adapt a single
design system across all of them.

---

## Core principle: Adapt, don't shrink

A phone is not a small desktop. A desktop is not a large phone. A tablet
is not either one. Each form factor has:

- Different input methods (touch, mouse, stylus, keyboard)
- Different screen sizes and aspect ratios
- Different viewing distances
- Different usage contexts (on-the-go, lean-back, focused work)
- Different platform conventions (iOS, Android, macOS, Windows, web)

Design for each context. Do not scale one layout to fit all three.

---

## Form factor profiles

### Phone

**Constraints:**
- Screen: 320-430px wide, 560-932px tall
- Input: touch (finger, one-handed common)
- Viewing distance: 12-18 inches
- Context: distracted, on-the-go, one-handed
- Network: unstable (cellular, weak wifi)
- Battery: constrained

**Design rules:**
- Touch targets minimum 44x44pt (iOS) / 48x48dp (Android)
- Primary actions in thumb zone (bottom 2/3 of screen)
- Single-column layouts
- Bottom navigation preferred over side drawers
- Max content width: full screen (no max-width constraint)
- Font sizes: 16px body minimum (prevent iOS zoom on focus)
- Forms: one field per row, large inputs, native pickers
- Lists: virtualized (FlatList, ListView.builder, RecyclerView)
- Images: lazy-loaded, appropriate resolution for screen
- Modals: full-screen or bottom sheet (not centered popups)
- Avoid hover-dependent interactions (no hover states as the only
  way to discover functionality)

### Tablet / iPad

**Constraints:**
- Screen: 768-1366px wide, 1024-1024px tall (varies)
- Input: touch + optional stylus + optional keyboard
- Viewing distance: 18-24 inches
- Context: lean-back reading, focused work, presentations
- Orientation: portrait and landscape both common

**Design rules:**
- Touch targets still 44x44pt minimum (touch is primary input)
- Two-column layouts (master-detail, split view)
- Sidebar navigation viable (especially in landscape)
- Max content width: 720-960px for reading, full width for dashboards
- Font sizes: 16-18px body (more breathing room than phone)
- Forms: two fields per row possible, still large inputs
- Lists: virtualized, but can show more context per row
- Images: higher resolution, can be larger
- Modals: centered popups OK (screen is large enough)
- Support both orientations explicitly (don't just rotate the phone layout)
- Split-screen / multi-column navigation (iPadOS, Android split view)
- Stylus input: support drawing, handwriting where relevant

### Desktop (PC, Mac, Web)

**Constraints:**
- Screen: 1024-3840px wide, 768-2160px tall
- Input: mouse + keyboard (precise, hover available)
- Viewing distance: 24-30 inches
- Context: focused work, long sessions
- Network: stable (usually)

**Design rules:**
- Click targets minimum 24x24px (mouse is precise), but 32x32px
  recommended for accessibility
- Multi-column layouts (2-4 columns common)
- Sidebar navigation, top navigation, or hybrid
- Max content width: 1200-1440px (don't stretch edge-to-edge on wide
  screens)
- Font sizes: 14-16px body (can be smaller, viewing distance is greater)
- Forms: multiple fields per row, compact inputs OK
- Lists: full data density, pagination or infinite scroll
- Images: highest resolution, can be very large
- Modals: centered popups, slide-over panels
- Hover states are valid (mouse is present)
- Keyboard shortcuts expected (Cmd/Ctrl+S, Esc to close, Tab navigation)
- Right-click context menus where relevant
- Tooltips on icon-only buttons (no touch ambiguity)

---

## Breakpoint system

Use a consistent breakpoint scale. These are the most common:

| Name | Width | Target |
|---|---|---|
| `xs` | < 640px | Phone (portrait) |
| `sm` | 640-767px | Phone (landscape), small tablet |
| `md` | 768-1023px | Tablet (portrait) |
| `lg` | 1024-1279px | Tablet (landscape), small desktop |
| `xl` | 1280-1535px | Desktop |
| `2xl` | >= 1536px | Large desktop |

**Tailwind default breakpoints:** `sm:640`, `md:768`, `lg:1024`,
`xl:1280`, `2xl:1536`

**Flutter:** Use `LayoutBuilder` or `MediaQuery.of(context).size.width`
to switch layouts. Common breakpoints:
- `< 600`: phone (single column)
- `600-899`: tablet portrait (two column)
- `900-1199`: tablet landscape (two-three column)
- `>= 1200`: desktop (multi-column, sidebar)

---

## Layout adaptation patterns

### 1. Single column to multi-column

**Phone:** One column, full width
**Tablet:** Two columns (master-detail or content + sidebar)
**Desktop:** Three+ columns (sidebar + content + detail panel)

```
Phone:          Tablet:              Desktop:
┌──────────┐    ┌────────┬─────────┐  ┌──────┬──────────┬──────┐
│  List    │    │ List   │ Detail  │  │ Nav  │ List     │Detail│
│          │    │        │         │  │      │          │      │
│          │    │        │         │  │      │          │      │
└──────────┘    └────────┴─────────┘  └──────┴──────────┴──────┘
```

### 2. Bottom nav to sidebar

**Phone:** Bottom navigation bar (thumb-reachable)
**Tablet:** Side navigation rail (icons only) or bottom nav
**Desktop:** Full sidebar (icons + labels)

```
Phone:                    Tablet:                  Desktop:
┌──────────────┐          ┌──┬───────────┐        ┌────────┬─────────┐
│   Content    │          │  │  Content   │        │ Nav    │ Content │
│              │          │  │            │        │ Item 1 │         │
│              │          │  │            │        │ Item 2 │         │
├──────────────┤          └──┴───────────┘        │ Item 3 │         │
│ Home  Search │          (rail: icons only)      │        │         │
└──────────────┘                                  └────────┴─────────┘
```

### 3. Stacked to split

**Phone:** Sections stack vertically (scroll down to see next)
**Tablet:** Sections can split side-by-side
**Desktop:** Full split layouts, side-by-side comparison

### 4. Full-screen modal to centered popup

**Phone:** Modal takes full screen or slides up as bottom sheet
**Tablet:** Modal centered with margin, or slide-over panel
**Desktop:** Centered popup with backdrop, or slide-over from edge

### 5. Forms

**Phone:** One field per row, large inputs, native pickers, big buttons
**Tablet:** Two fields per row possible, still touch-sized inputs
**Desktop:** Multiple fields per row, compact inputs, inline validation

### 6. Data tables

**Phone:** Cards (one record per card, swipe for actions) or collapsed
  rows with expand
**Tablet:** Simplified table (key columns only) with expand for detail
**Desktop:** Full data table (all columns, sortable, filterable,
  pagination)

### 7. Dashboards

**Phone:** Stacked metric cards (one or two per row), vertical scrolling
**Tablet:** Bento grid (2-3 columns), some widgets expandable
**Desktop:** Full bento grid (3-4 columns), sidebar filters, dense data

---

## Touch vs mouse vs stylus

### Touch (phone, tablet)

- Minimum target: 44x44pt (iOS) / 48x48dp (Android)
- No hover states (press states instead)
- Gestures: swipe, pinch, long-press, drag
- Fitts' Law: reach matters more than precision
- Thumb zone: bottom 2/3 of phone screen
- No right-click
- No scroll wheel
- No keyboard shortcuts (unless external keyboard connected)

### Mouse (desktop)

- Minimum target: 24x24px (32x32px recommended for a11y)
- Hover states valid (tooltips, previews, menu reveal)
- Right-click context menus
- Scroll wheel
- Keyboard shortcuts expected
- Precise selection (text selection, drag-and-drop)
- Cursor states (pointer, not-allowed, text, grab)

### Stylus (tablet with Apple Pencil, S Pen)

- Precise touch (smaller targets OK when stylus is active)
- Drawing / handwriting input
- Pressure sensitivity
- Hover with stylus (Samsung S Pen, Apple Pencil hover on iPadOS 16+)
- Palm rejection expected

---

## Platform conventions

### iOS (iPhone, iPad)

| Element | Convention |
|---|---|
| Font | SF Pro (system) |
| Min touch | 44pt |
| Back | Edge swipe (left edge) or back button top-left |
| Sheets | Bottom sheet (slide up, grabber handle) |
| Modals | Slide up from bottom, swipe down to dismiss |
| Tab bar | Bottom, 5 items max, icon + label |
| List | Right-pointing chevron for drill-down |
| Selection | Checkmark on right, blue accent |
| Refresh | Pull-to-refresh (spinner) |
| Icons | SF Symbols |
| Title | Large title that collapses on scroll (since iOS 11) |

### Android (phone, tablet)

| Element | Convention |
|---|---|
| Font | Roboto (system) |
| Min touch | 48dp |
| Back | System back button/gesture |
| Sheets | Bottom sheet or full-screen dialog |
| Modals | Dialog or full-screen |
| Tab bar | Bottom (Material 3) or top (older) |
| List | Right-pointing arrow or card tap |
| Selection | Checkbox/radio, teal accent (Material 3 dynamic) |
| Refresh | Pull-to-refresh or FAB |
| Icons | Material Icons |
| Title | Top app bar, collapses on scroll (Material 3) |
| FAB | Floating action button for primary action |

### Web (desktop, responsive)

| Element | Convention |
|---|---|
| Font | System stack or web font (Inter, Geist, etc.) |
| Min click | 24px (32px recommended) |
| Back | Browser back, or breadcrumb, or explicit back link |
| Sheets | Slide-over panel from right, or modal |
| Modals | Centered with backdrop, Esc to close |
| Tab bar | Top navigation bar, or sidebar |
| List | Table rows or card grid |
| Selection | Checkbox/radio, brand accent |
| Refresh | Full page reload, or AJAX refresh |
| Icons | Lucide, Phosphor, Heroicons, custom SVG |
| Title | H1 in content area, not in nav |
| Hover | Valid (tooltips, dropdowns, previews) |

### macOS (desktop app)

| Element | Convention |
|---|---|
| Font | SF Pro (system) |
| Min click | 24px |
| Back | Window history, or sidebar selection |
| Sheets | Modal sheet attached to window (slide down) |
| Modals | Sheet attached to parent window |
| Tab bar | Sidebar (source list), or top tabs |
| Icons | SF Symbols |
| Title | Window title bar, or hidden (unified toolbar) |
| Hover | Valid |
| Menu bar | Top screen menu bar (global) |

### Windows (desktop app)

| Element | Convention |
|---|---|
| Font | Segoe UI (system) |
| Min click | 24px |
| Back | Back button, or breadcrumb |
| Sheets | Content dialog (centered) |
| Modals | Content dialog, or flyout |
| Tab bar | Top navigation, or sidebar (NavigationView) |
| Icons | Fluent Icons |
| Title | Title bar (custom or standard) |
| Hover | Valid |
| Menu | App-level menu (ribbon, command bar, or menu bar) |

---

## Responsive implementation

### CSS / Tailwind (web)

```css
/* Mobile-first: base styles target phone */
.card { padding: 16px; }

/* Tablet: override at md */
@media (min-width: 768px) {
  .card { padding: 24px; }
}

/* Desktop: override at lg */
@media (min-width: 1024px) {
  .card { padding: 32px; }
}
```

Tailwind:
```html
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
```

### Flutter

```dart
LayoutBuilder(
  builder: (context, constraints) {
    if (constraints.maxWidth < 600) {
      return _PhoneLayout();    // single column
    } else if (constraints.maxWidth < 1200) {
      return _TabletLayout();   // two column
    } else {
      return _DesktopLayout();  // multi-column + sidebar
    }
  },
)
```

Or use `MediaQuery`:
```dart
final width = MediaQuery.of(context).size.width;
final isPhone = width < 600;
final isTablet = width >= 600 && width < 1200;
final isDesktop = width >= 1200;
```

### React Native

```tsx
import { useWindowDimensions } from 'react-native';

const { width } = useWindowDimensions();
const isTablet = width >= 768;
```

---

## Adaptive typography

Font sizes should scale with viewport, but not linearly. Use `clamp()`
for web:

```css
h1 { font-size: clamp(2rem, 5vw, 4rem); }
body { font-size: clamp(1rem, 1.5vw, 1.125rem); }
```

For Flutter, use `MediaQuery.textScaleFactor` or fixed sizes per
breakpoint:

```dart
final titleSize = isPhone ? 20.0 : (isTablet ? 24.0 : 28.0);
```

### Type scale by form factor

| Element | Phone | Tablet | Desktop |
|---|---|---|---|
| Hero / display | 32-40px | 40-56px | 48-72px |
| H1 | 28-32px | 32-40px | 36-48px |
| H2 | 22-24px | 24-28px | 24-32px |
| H3 | 18-20px | 20-22px | 20-24px |
| Body | 16px | 16-18px | 14-16px |
| Small | 14px | 14px | 12-14px |
| Caption | 12px | 12px | 11-12px |

Note: Desktop body can be smaller because viewing distance is greater.
Phone body must be 16px minimum to prevent iOS auto-zoom on input focus.

---

## Adaptive spacing

| Context | Phone | Tablet | Desktop |
|---|---|---|---|
| Page padding | 16px | 24-32px | 32-48px |
| Card padding | 16px | 20-24px | 24-32px |
| Card gap | 12-14px | 16-20px | 20-24px |
| Section gap | 32-48px | 48-64px | 64-96px |
| Button padding | 12-14px vertical | 14-16px | 12-14px |

Phone: tighter spacing (screen is small, every pixel counts)
Tablet: more generous (screen has room to breathe)
Desktop: moderate (density is expected, but not cramped)

---

## Adaptive component patterns

### Navigation

| Form factor | Pattern |
|---|---|
| Phone | Bottom tab bar (5 max), or hamburger drawer |
| Tablet portrait | Bottom tab bar or side rail (icons) |
| Tablet landscape | Side rail (icons + labels) or sidebar |
| Desktop | Full sidebar (icons + labels), collapsible |

### Lists

| Form factor | Pattern |
|---|---|
| Phone | Single-column cards, swipe actions, pull-to-refresh |
| Tablet | Two-column cards, or simplified table |
| Desktop | Full data table with sorting, filtering, pagination |

### Forms

| Form factor | Pattern |
|---|---|
| Phone | One field per row, large inputs, native pickers, big buttons |
| Tablet | Two fields per row, still touch-sized |
| Desktop | Multiple fields per row, compact, inline validation, keyboard nav |

### Modals

| Form factor | Pattern |
|---|---|
| Phone | Full-screen or bottom sheet (slide up, swipe down to dismiss) |
| Tablet | Centered with margin, or slide-over panel |
| Desktop | Centered popup with backdrop, Esc to close |

### Images

| Form factor | Pattern |
|---|---|
| Phone | Full-width, lazy-loaded, 1x or 2x resolution |
| Tablet | Larger, can be side-by-side with text, 2x resolution |
| Desktop | Highest resolution, can be very large, lightbox on click |

---

## Mobile-specific rules (always apply on phone)

1. **Touch targets >= 44x44pt.** No exceptions. Smaller targets miss taps.
2. **Primary CTAs in thumb zone.** Bottom 2/3 of screen. Top is hard to
   reach one-handed.
3. **No hover-dependent interactions.** Touch has no hover. If
   functionality is hidden behind hover, it's inaccessible on mobile.
4. **Bottom sheet, not centered popup.** Phone screens are small.
   Centered popups feel cramped. Bottom sheets are thumb-reachable and
   swipe-to-dismiss.
5. **Single-column layouts.** Multi-column forces horizontal scroll or
   tiny content. One column, full width.
6. **16px body minimum.** iOS auto-zooms on focus if font-size < 16px.
   Prevent the zoom.
7. **Virtualize long lists.** FlatList, ListView.builder, RecyclerView.
   Rendering 1000 rows kills performance and memory.
8. **Lazy-load images.** Use cached_network_image (Flutter), next/image
   (web), or lazy loading. Don't load all images at once.
9. **Offline handling.** Show cached data, queue actions, sync when back
   online. Mobile networks are unstable.
10. **Battery-conscious animations.** Avoid continuous GPU work
    (infinite blur, infinite animation loops on scrolling content).

---

## Tablet-specific rules

1. **Support both orientations.** Don't just rotate the phone layout.
   Design for portrait and landscape explicitly.
2. **Two-column layouts.** Master-detail, split view, content + sidebar.
   The screen has room, use it.
3. **Touch is still primary.** Keep 44pt touch targets even on tablet.
   Stylus and keyboard are secondary.
4. **Don't stretch phone layout.** A phone layout on a 12-inch screen
   looks broken. Adapt the layout, don't scale it.
5. **Split-screen support.** iPadOS and Android support split-view
   (two apps side by side). Design for narrow widths even on tablet.

---

## Desktop-specific rules

1. **Hover is valid.** Use it for tooltips, previews, menu reveal. But
   don't hide critical functionality behind hover only.
2. **Keyboard navigation.** Tab, Enter, Esc, Cmd/Ctrl shortcuts. Focus
   rings must be visible.
3. **Right-click context menus.** Expected on desktop. Add them where
   relevant.
4. **Multi-column density.** Use the screen width. 2-4 columns, sidebars,
   detail panels.
5. **Max-width container.** Don't stretch content edge-to-edge on a 4K
   monitor. Cap at 1200-1440px with auto margins.
6. **Scroll wheel support.** Smooth scrolling, horizontal scroll with
   shift+wheel.
7. **Window resizing.** Layout should adapt smoothly from 1024px to 3840px
   without breaking.

---

## Cross-platform consistency

While each platform has its conventions, maintain visual consistency
across platforms through:

1. **Same color tokens.** The brand blue is the same hex on phone,
   tablet, and desktop.
2. **Same type scale.** The type hierarchy is the same, sizes adapt per
   form factor.
3. **Same component shapes.** Card radius, button radius, chip radius
   follow the same scale.
4. **Same spacing rhythm.** The spacing scale is the same, values adapt
   per form factor.
5. **Same icon style.** Same icon family (or visually similar) across
   platforms. Material Icons on Android, SF Symbols on iOS can look
   different but should feel consistent.
6. **Same motion language.** Same easing curves, same durations, same
   transition patterns. Adapt the complexity per form factor (less
   motion on phone for battery, more on desktop for polish).

---

## The "One Layout" anti-pattern

Do not build one layout and scale it. This is the most common mistake.

**Bad:** A 3-column desktop layout that collapses to 1 column on phone by
just stacking the columns. The result is a phone screen with 3 sections
that feel like a stretched desktop page.

**Good:** A phone screen designed as a phone screen (bottom nav, single
column, thumb-reachable CTAs), a tablet screen designed as a tablet
screen (split view, side rail), and a desktop screen designed as a
desktop screen (sidebar, multi-column, hover states). They share the
same design system (colors, type, spacing scale) but have different
layouts.

---

## Pre-flight checklist (responsive)

Before considering a responsive design task complete:

- [ ] Layout adapts at every breakpoint (phone, tablet, desktop)
- [ ] Touch targets >= 44pt on phone and tablet
- [ ] No hover-dependent functionality (hover is enhancement, not
      requirement)
- [ ] Both orientations supported on tablet
- [ ] Max-width container on desktop
- [ ] Typography scales per form factor
- [ ] Spacing scales per form factor
- [ ] Navigation pattern adapts (bottom nav -> rail -> sidebar)
- [ ] Modals adapt (bottom sheet -> centered popup)
- [ ] Lists adapt (cards -> table)
- [ ] Forms adapt (one field -> multi field)
- [ ] Images lazy-loaded and resolution-appropriate
- [ ] Keyboard navigation works on desktop
- [ ] Focus rings visible on desktop
- [ ] No horizontal scroll on any viewport
- [ ] Tested on real devices (not just browser resize)
