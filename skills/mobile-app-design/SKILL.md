---
name: mobile-app-design
description: >
  Designs mobile app UIs that respect platform conventions (iOS Human
  Interface Guidelines, Material Design 3) instead of producing shrunken
  web pages. Covers platform-first decisions, navigation patterns, touch
  ergonomics, screen anatomy, mobile components, density, onboarding,
  feedback, and offline states. Use when the user asks to "design a mobile
  app", "mobile UI", "app screen design", "iOS app design", "Android app
  design", "mobile navigation", "React Native design", "Flutter UI
  design", "mobile app mockup", "bottom sheet design", or "tab bar".
metadata:
  version: 1.0.0
license: MIT
---

# Mobile App Design

> Part of [Cognikit](https://cognikit.com). A kit that gives AI agents cognitive abilities.

Design mobile interfaces the way a platform-native designer does: pick a
platform's conventions, map the flow before the screens, size every target
for a thumb, and design for interruption (offline, empty, loading, error)
as a first-class state. The output is a set of connected screens that feel
built for the device, not a desktop layout squeezed onto a small canvas.

## AI execution flow (follow in order)

1. **Platform**: Decide iOS, Android, or both. If both, pick the primary
   platform's conventions and design to them; do not average the two.
   For cross-platform frameworks (React Native, Flutter), pick one
   convention per screen rather than blending.
2. **Flow map**: Before designing any screen, map the 5 to 8 core screens
   and the transitions between them. You are designing a flow, not
   isolated artboards. Every screen needs a way in and a way back.
3. **Navigation skeleton**: Choose the primary navigation pattern from
   the table below, then secondary patterns (stack, sheets, modals).
4. **Screen anatomy**: Apply safe area insets, title behavior, and the
   primary CTA placement. Decide what is sticky and what scrolls.
5. **Components and density**: Select mobile-native components, set type
   and spacing for mobile density, and size every tap target.
6. **States**: For each screen, define empty, loading, error, and offline
   variants, plus the feedback pattern for each user action.
7. **Verify**: Run the pre-flight checklist at the bottom.

## 1. Platform-first decision

Commit to one platform's language per screen. Users feel mixed
conventions as wrong even when they cannot name why.

| Platform | Conventions to follow |
|---|---|
| iOS | Human Interface Guidelines: navigation bar with back chevron, SF Symbols for icons, edge swipe-back gesture, modals slide up, action sheets for destructive confirms |
| Android | Material Design 3: top app bar, FAB for the primary action, navigation bar or drawer, hardware/gesture back button must always work |
| Cross-platform (RN, Flutter) | Pick one convention per screen. A screen is either iOS-flavored or Android-flavored, never a blend. Match the platform the app runs on by default |

If the user gives no platform, ask once or default to iOS conventions and
state the assumption. Never invent a third navigation language.

## 2. Navigation patterns

| Pattern | When to use | Notes |
|---|---|---|
| Tab bar / bottom navigation | 3 to 5 top-level sections of roughly equal weight | The most common pattern. Always visible. Icons plus labels |
| Stack navigation | Drill-in flows: list to detail, detail to sub-detail | Always provide a back affordance (navbar button on iOS, back button on Android) |
| Navigation drawer | Rare. Only for 6 or more top-level sections | Hamburger menus hide features. Avoid when a tab bar fits |
| Bottom sheet | Contextual actions, filters, previews tied to content below | Use detents (half, full). Support drag-to-dismiss |
| Modal (full-screen) | Self-contained tasks: compose, edit, login | Use for focused tasks with a clear done/cancel. Not for navigation |
| Segmented control | Switching between 2 to 4 views of the same content | Not a replacement for the tab bar |

Rules:

- Primary navigation is always visible. If users must open a menu to find
  the core feature, the navigation is wrong.
- Prefer a modal push for self-contained tasks; prefer a stack push for
  browsing deeper into content.
- Never stack modals. One modal at a time, dismissed before the next.

## 3. Touch ergonomics

- Minimum tap target: 44x44pt on iOS, 48x48dp on Android. Padding counts.
  Visible glyphs may be smaller; the hit area may not.
- Thumb zone: place primary actions in the bottom half of the screen.
  One-handed reach gets worse toward the top.
- Keep destructive actions away from primary actions. Never place
  "delete" adjacent to "save".
- Swipe gestures are shortcuts, never the only path. Every swipe action
  (delete a row, archive) needs a visible alternative (button, menu item).
- Pull-to-refresh on feeds and lists where fresh content matters.

## 4. Screen anatomy

- Respect safe area insets: notch and status bar at top, home indicator
  at bottom. No interactive element inside the unsafe zone.
- Large title collapsing: use the platform pattern (iOS large titles
  collapse into the nav bar on scroll; Material top app bars can elevate
  or collapse). Do not fake it with custom headers.
- Sticky bottom action bar for primary CTAs ("Buy", "Continue", "Save").
  It sits above the home indicator inset, stays visible while content
  scrolls, and uses one dominant button.
- Keyboard-avoiding layouts for every form: inputs must not hide behind
  the keyboard, and the primary action should stay reachable (pin to
  keyboard top or keep the sticky bar).

## 5. Mobile-specific components

- Bottom sheets: define detents (peek, half, full), support
  drag-to-dismiss, dim the content behind. Use for contextual actions,
  not for navigation between sections.
- Action sheets: for destructive confirmations and small choice sets on
  iOS. On Android, use a Material dialog or bottom sheet equivalent.
- Segmented control vs tabs: segmented controls switch views of the same
  data within a screen; the tab bar switches app sections. Do not mix.
- Swipeable list rows: reveal actions (delete, archive, flag) on swipe.
  Keep the most destructive action furthest from the swipe origin.
- Badges on tab icons: numeric for counts, dot for "something new".
  Clear the badge when the user visits the tab.

## 6. Density and type

- Mobile is denser than desktop instincts suggest. Body text at 15 to
  17px equivalent. Do not shrink body below 14px.
- Build hierarchy with weight (regular, medium, semibold) more than with
  size jumps. Two or three text styles cover most screens.
- Single-column everything. No multi-column grids except genuine
  thumbnail galleries.
- Use cards only when grouping genuinely helps scannability. A list of
  uniform rows needs no cards; mixed content types do.
- Generous touch spacing beats dense information. If a screen needs
  squeezing to fit, split it into two screens.

## 7. Onboarding and empty states

- First run: one value screen that shows what the app does and why it
  matters. No carousels of feature tours. Get to the product fast.
- Permission asks happen in context, at the moment the feature needs
  them. Never an upfront permission wall before the user has seen value.
- Every empty state answers two questions: what goes here, and how to
  add it. Pair a one-line explanation with a primary action
  ("No saved routes yet. Find a route to save it.").

## 8. Feedback patterns

- Haptics for confirmations that matter: successful payment, item added,
  task complete. Do not vibrate on every tap.
- Optimistic UI for common low-risk actions: like, save, send, toggle.
  Update instantly, reconcile with the server, roll back on failure.
- Undo over confirm dialogs where possible. Let the action happen
  immediately and offer "Undo" in a snackbar, instead of asking "Are you
  sure?" Reserve confirms for irreversible destructive actions.
- Toast/snackbar for non-blocking feedback. Keep it short, one action
  max, auto-dismiss. Never block the UI for "success" messages.

## 9. States and edge cases

Every screen ships four variants alongside the happy path:

- Offline: queue user actions and confirm later; show cached content
  with a subtle indicator instead of an empty error screen.
- Loading: skeleton placeholders shaped like the real content. No
  centered spinner for a whole screen that already has structure.
- Error: inline retry at the point of failure, not a dead-end error
  screen. Message says what happened and what to do next.
- Long lists: section indexing (alphabet jump bar) or search once the
  list exceeds a few screens. Retain scroll position on back navigation.

## 10. Anti-patterns (never do)

- Shrunken desktop layouts: multi-column grids, sidebars, and dense
  tables ported directly to a phone
- Hover-dependent interactions: tooltips, hover-reveal menus, or any
  affordance that only appears on mouseover
- Tap targets smaller than 44pt/48dp, or targets packed edge to edge
- A back button or gesture that exits the app unexpectedly instead of
  returning up the stack
- Modal stacking: a sheet or dialog opening on top of another modal
- Infinite scroll that loses position when the user navigates back
- Permission requests before the user has seen any value
- Hamburger menus hiding the core feature behind a single icon
- Using both iOS and Android conventions on the same screen

## Related skills

- `design-systems`: define visual direction, color, type, and component tokens before applying them to mobile screens
- `design-system-architecture`: build the token infrastructure (primitives, semantic tokens, platform mappings) the mobile UI consumes

## Pre-flight checklist

- [ ] Primary platform chosen and stated; conventions match it per screen
- [ ] Core flow mapped (5 to 8 screens) with transitions before any screen was detailed
- [ ] Primary navigation visible at all times; no hidden hamburger for core features
- [ ] Every interactive element meets 44x44pt / 48x48dp minimum
- [ ] Primary CTA reachable in the thumb zone; destructive actions separated
- [ ] Safe area insets respected top and bottom; no UI under notch or home indicator
- [ ] Every swipe gesture has a visible non-gesture alternative
- [ ] Each screen defines empty, loading, error, and offline states
- [ ] Optimistic UI and undo used for common actions; confirms only for irreversible actions
- [ ] No emojis, no em/en dashes, no shrunken desktop patterns in the output
