# Mobile Navigation Reference

> Deep guide to navigation pattern selection, tab state, deep linking,
> back handling, and transitions. Read when designing the app's
> navigation skeleton or wiring routes.

Navigation is invisible when done right. If users think about how to
get somewhere, something is wrong.

## Navigation selection decision tree

```
WHAT TYPE OF APP?
        |
        |-- 3-5 top-level sections of equal importance
        |      -> Tab bar / bottom navigation
        |         (social, e-commerce, utility)
        |
        |-- Deep hierarchical content, drill-down
        |      -> Stack navigation inside a tab or root
        |         (settings, email folders, detail flows)
        |
        |-- More than 5 top-level destinations
        |      -> Drawer navigation, or tab bar + "More"
        |         (Gmail, complex enterprise)
        |
        |-- Single linear flow
        |      -> Stack only (onboarding, checkout, wizard)
        |
        |-- Tablet / foldable
               -> Navigation rail + list-detail split
                  (mail, notes on large screens)
```

Count the top-level destinations before picking. Five or fewer
equal-weight destinations means a tab bar; more means a drawer or a
tab-plus-More hybrid. Never hide the core feature behind a hamburger.

## Tab bar / bottom navigation

| | iOS | Android |
|---|---|---|
| Height | 49pt (83pt with home indicator) | 80dp |
| Items | Max 5 | 3 to 5 |
| Icons | SF Symbols, 25x25pt | Material Symbols, 24dp |
| Labels | Always show | Always show |
| Active state | Tint color | Pill indicator + filled icon |

### Tab state preservation

Each tab owns its own navigation stack. A user who drills into a tab,
switches away, and switches back must land where they left off, not at
the tab root.

- React Navigation: give each tab its own nested navigator. Do not
  reset the stack on tab press (wire "tap active tab to pop to root"
  only as a deliberate shortcut).
- Flutter: use `IndexedStack` (or per-tab `Navigator`) so offstage tabs
  keep scroll position and stack.
- Never reset a tab stack on switch. Losing drill-down state reads as
  a bug.

## Stack navigation

Push adds a screen on top; pop removes it. New screens slide in from
the right (LTR); back slides out. Patterns:

| Pattern | Use case |
|---|---|
| Simple stack | Linear drill-in flows |
| Nested stack | A section inside a tab with its own history |
| Modal stack | A self-contained task with its own context |
| Auth gate | Conditional root: login stack vs main stack |

### Back behavior

- iOS: edge swipe from the left plus nav-bar back. Never override the
  interactive pop gesture without a strong reason.
- Android: system back button/gesture must always work. Support
  predictive back (Android 14+), where the back gesture previews the
  destination behind the current screen. Confirm before discarding
  unsaved data.
- Cross-platform rule: back always moves up the stack. Never hijack it
  to exit the app or trigger unrelated behavior. Deep-linked screens
  must have a constructed stack beneath them so back works.

## Drawer navigation

Use a modal drawer only for 6 or more top-level destinations, or
destinations of clearly unequal weight. On tablets and large screens a
permanent drawer or navigation rail (80dp strip, icons plus optional
labels) beats a hidden hamburger.

## Modal vs push

| Push (stack) | Modal |
|---|---|
| Horizontal slide | Vertical slide up (sheet) |
| Part of the hierarchy | A separate, focused task |
| Back returns | Dismiss (X, swipe, scrim) returns |
| "Drill in" | "Focus on this" |

Use modals for creating content, settings, transactions, and
self-contained workflows. Modal types: sheet (quick tasks, detents),
full-screen cover (complex forms), alert/action sheet (confirmations
and small choice sets). Only block dismissal for unsaved data. Never
stack a modal on a modal.

## Deep linking

Plan deep links at the start; retrofitting forces a navigation refactor.
The URL path should mirror the navigation path:

```
myapp://home
myapp://home/product/123
myapp://home/product/123/reviews
https://myapp.com/product/123   (Universal Link / App Link)
```

Deep link rules:

1. Full stack construction: a link to `product/123` builds Home at the
   root and pushes Product on top, so back returns somewhere sane.
2. Auth awareness: if the target needs auth, save the destination,
   route to login, then continue to the target after success.
3. Invalid links: navigate to a fallback (home) with a message. Never
   crash or show a blank screen.
4. Active sessions: do not blow away the current stack; push on top or
   ask before navigating away.

Deep links power push-notification routing, content sharing, marketing
campaigns, widgets, and search integration. Skip them and all of those
break.

## Navigation state persistence

Persist: current tab, scroll position in lists, form drafts, user
preferences. Do not persist: modal/dialog state, transient UI state,
stale data (refresh on return), or auth tokens (those belong in secure
storage, never plain AsyncStorage).

## Transitions

| Transition | iOS | Android |
|---|---|---|
| Push | Slide from right | Fade + slide from right |
| Modal | Slide up (sheet) or fade | Slide up from bottom |
| Tab switch | Cross-fade | Cross-fade or none |
| Back | Interactive edge swipe | Predictive back (14+) |

Prefer platform defaults; they carry muscle memory and are already
performant. Customize only for brand-critical moments, keep it under
300ms, and never animate layout properties (width, height, padding):
only transform and opacity.

### Shared element transitions

Connect an element across screens: the product image on a card grows
into the same image on the detail screen. Implementations:

| Framework | API |
|---|---|
| React Navigation | shared-element library / Reanimated |
| Flutter | `Hero` widget |
| SwiftUI | `matchedGeometryEffect` |
| Jetpack Compose | shared element transitions |

Use shared elements where continuity aids comprehension (media,
products, avatars). Do not animate every row.

## Navigation anti-patterns

| Anti-pattern | Problem | Fix |
|---|---|---|
| Inconsistent back | User cannot predict | Back always pops |
| Hidden navigation | Features undiscoverable | Visible tabs or rail |
| Deep nesting | User gets lost | Max 3 to 4 levels |
| Broken swipe back | iOS muscle memory broken | Never override the gesture |
| No deep links | Sharing and notifications dead-end | Plan from day one |
| Tab stack reset | Work lost on tab switch | Per-tab stacks, IndexedStack |
| Modal for primary flow | Cannot retrace steps | Use stack navigation |
| Modal stacking | Trapped feeling, dismissal bugs | One modal at a time |

## Checklist

- [ ] Navigation pattern matches destination count and weight
- [ ] Each tab preserves its own stack and scroll position
- [ ] Back works everywhere: iOS edge swipe, Android predictive back
- [ ] Deep link scheme planned; links construct a full stack
- [ ] Auth-gated deep links resume after login
- [ ] Invalid links fall back safely
- [ ] Transitions use platform defaults; custom ones stay under 300ms
- [ ] Shared element transitions only where continuity aids meaning
- [ ] Scroll position retained on back navigation
- [ ] No modal stacking, no hamburger hiding the core feature
