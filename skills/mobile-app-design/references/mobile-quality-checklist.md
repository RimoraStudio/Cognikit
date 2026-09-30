# Mobile Quality Checklist

> The expanded audit for mobile app design and implementation work.
> Run every group before declaring a screen set or build done. The
> pre-flight checklist in `../SKILL.md` is the fast version; this file
> is the deep pass.

A "yes" must mean "verified," not "probably." If an item cannot be
checked, say so instead of assuming it passes.

## A. Pre-work

- [ ] **A1.** Checkpoint questions answered: platform, framework, offline, devices, audience are stated, not assumed
- [ ] **A2.** MFRI scored; result is 3 or above, or the design was simplified until it is
- [ ] **A3.** Design bible locked before screens: palette, type scale, spacing, radius, icon style, card behavior, shadows, navigation model

## B. Platform and navigation

- [ ] **B1.** One platform convention per screen; no iOS/Android blending; the primary platform is stated
- [ ] **B2.** Core flow mapped (5 to 8 screens) with a way in and a way back on every screen; sequence is believable (onboarding > auth > home, browse > detail > cart)
- [ ] **B3.** Primary navigation always visible; pattern matches destination count (tab bar for 3-5, drawer only for 6+)
- [ ] **B4.** Each tab preserves its own stack and scroll position; switching back lands where the user left off
- [ ] **B5.** Back works everywhere: iOS edge swipe, Android system back with predictive back; back never exits unexpectedly
- [ ] **B6.** Deep links planned with URL paths mirroring navigation; deep-linked screens construct a full stack; auth-gated links resume after login

## C. Touch and interaction

- [ ] **C1.** Every interactive element hits 44x44pt / 48x48dp minimum, including padding, with 8px spacing between targets
- [ ] **C2.** Primary CTA sits in the thumb zone (bottom half); destructive actions are separated from primary actions
- [ ] **C3.** Every gesture has a visible non-gesture alternative and a discoverability hint; no gesture is the only path
- [ ] **C4.** Tap feedback lands under 50ms; actions over 100ms show progress; buttons disable against double-tap
- [ ] **C5.** Haptics assigned by action weight (light for selection, medium for taps, heavy/success for completion, warning/error for destructive and failures); no per-scroll vibration

## D. Visual design

- [ ] **D1.** 60/30/10 palette applied; accent reserved for CTAs and key indicators; semantic colors only carry semantic meaning
- [ ] **D2.** Text hierarchy built from size, weight, and opacity (100/80/60-70%), not from bolding everything
- [ ] **D3.** All spacing values divisible by 8 or 4; group gaps at least 2x inner gaps; card padding 24-32
- [ ] **D4.** Typography: system font or justified custom font, max 4 sizes and 2 weights, body 15-17 and never below 14, line height 1.4-1.6
- [ ] **D5.** Text scales: Dynamic Type on iOS, sp on Android; layout survives 200% scaling without truncation
- [ ] **D6.** Dark mode designed, not inverted: off-white text (#E0E0E0-F0F0F0), true-black or #121212 backgrounds, elevated surfaces via lighter overlays; contrast 4.5:1 minimum in both modes
- [ ] **D7.** Shadows soft and tinted to the surface; no box-in-box nesting; one icon family with consistent stroke or fill

## E. States and feedback

- [ ] **E1.** Every screen has empty, loading (skeleton, not a spinner), error (inline retry with a next step), and offline (cached content or queued actions) variants
- [ ] **E2.** Optimistic UI covers common low-risk actions with rollback; destructive actions get undo in a snackbar rather than a confirm dialog, unless irreversible
- [ ] **E3.** Empty states say what goes here and how to add it, with a primary action
- [ ] **E4.** First screen is calm: one focal point, short headline, one CTA; no permission wall before value
- [ ] **E5.** The Peak-End is designed: one deliberate peak moment (completion, milestone) and a closing state (summary, affirmation, reason to return); waits and errors get reduced negative peaks
- [ ] **E6.** Experience adapts to user stage: new (guided, minimal), returning (personalized, progress), power (dense, advanced)

## F. Craft and anti-tells

- [ ] **F1.** This is a real mobile app, not a website inside a phone: no sidebars, no multi-column grids, no dense tables, no hover-dependent affordances
- [ ] **F2.** No AI tells: no default purple-blue gradients, random glass cards, ambient blobs, floating-widget homepages, chart spam without product reason, giant empty cards, or pill/badge clutter
- [ ] **F3.** Copy is short and believable: no filler ("elevate your life", "unlock your potential", "seamless control"), no fake brand slop (Acme, NovaCore, Flowbit), no lorem walls
- [ ] **F4.** The design is non-generic: a specific palette logic, a chosen component family, and a mood that belongs to this product, not a starter template
- [ ] **F5.** Every screen in the set belongs to the same product world: same bible, same component language; composition varies, system does not
- [ ] **F6.** Every decorative element earns its place; clutter disguised as creativity was cut

## G. Build and release

- [ ] **G1.** Lists are virtualized (FlatList/FlashList, ListView.builder) with memoized rows and stable keys; see `mobile-perf-patterns.md`
- [ ] **G2.** Animations run on the UI thread and animate transform/opacity only; verified at 60fps on a low-end device in a release build
- [ ] **G3.** Accessibility: labels on interactive elements, contrast verified, color never the only signal, tested at largest text size
- [ ] **G4.** Secrets and tokens in secure storage (Keychain / EncryptedSharedPreferences / SecureStore), never AsyncStorage or logs
- [ ] **G5.** Memory clean: effects and subscriptions disposed; images decode-bounded; no leak growth over extended use
- [ ] **G6.** Verified on real devices: low-end Android and older iPhone, release build, realistic data volume, slow-network pass
