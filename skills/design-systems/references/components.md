# Component Library: Universal Reference

Components for mobile, tablet, and desktop. Each component has:
- When to use
- Platform variants (phone, tablet, desktop)
- Anatomy (structure)
- States (rest, hover, active, disabled, loading, error)
- Adaptation rules (how it changes per design system)
- Implementation snippets (Flutter, Web/CSS, React Native where relevant)

Use these as the base. Adapt the visual style (colors, radius, shadows,
typography) to match the chosen design system from `design-systems.md`.

---

## Navigation components

### Bottom navigation bar (mobile)

**When:** Primary navigation on phone. 3-5 top-level destinations.

**Anatomy:**
- Fixed to bottom of screen
- Safe-area aware (padding for iPhone home indicator, Android nav bar)
- 3-5 items, each: icon (24px) + label (11-12px)
- Active item: filled icon + accent color + label visible
- Inactive item: outline icon + muted color + label visible or hidden
- Height: 56-64px + safe area inset

**States:**
- Rest: muted icon, muted label
- Active: accent icon, accent label (or filled pill behind icon)
- Pressed: scale 0.95, ripple (Android) or opacity change (iOS)
- Disabled: 40% opacity

**Design system adaptation:**
- Minimalist: icon only, no labels, thin divider on top
- Material 3: filled active pill, ripple, dynamic color
- Neo-Brutalism: thick top border, hard shadow, bold labels
- Glassmorphism: frosted glass bg, blur over content

**Flutter:**
```dart
Scaffold(
  bottomNavigationBar: NavigationBar(
    selectedIndex: controller.currentIndex,
    onDestinationSelected: controller.changePage,
    destinations: [
      NavigationDestination(icon: Icon(Icons.home_outlined), selectedIcon: Icon(Icons.home), label: 'Home'),
      NavigationDestination(icon: Icon(Icons.search_outlined), selectedIcon: Icon(Icons.search), label: 'Search'),
      NavigationDestination(icon: Icon(Icons.person_outline), selectedIcon: Icon(Icons.person), label: 'Profile'),
    ],
  ),
)
```

**Web (React):**
```tsx
<nav className="fixed bottom-0 inset-x-0 bg-white border-t border-gray-200 pb-safe">
  <div className="flex justify-around items-center h-14">
    {items.map(item => (
      <button className={active ? "text-accent" : "text-gray-500"}>
        <Icon size={24} />
        <span className="text-[11px]">{label}</span>
      </button>
    ))}
  </div>
</nav>
```

**Rules:**
- Max 5 items (more = use drawer + bottom nav hybrid)
- Icon + label preferred (icon-only fails for new users)
- Active state must be obvious (color, fill, or pill)
- Never auto-hide on scroll (users lose orientation)
- Badge counts on icons OK (small dot or number)

---

### Navigation rail (tablet)

**When:** Tablet portrait, or tablet landscape with limited width. Middle
ground between bottom nav and full sidebar.

**Anatomy:**
- Fixed to left or right edge
- Width: 72-80px
- Icon (24px) + optional label (11px) below
- Active: pill behind icon, accent color
- Floating variant: detached from edge with margin, rounded

**States:** Same as bottom nav.

**Flutter:**
```dart
NavigationRail(
  selectedIndex: index,
  onDestinationSelected: (i) => ...,
  destinations: [
    NavigationRailDestination(icon: Icon(Icons.home_outlined), selectedIcon: Icon(Icons.home), label: Text('Home')),
  ],
)
```

**Web:**
```tsx
<aside className="fixed left-0 top-0 bottom-0 w-20 flex flex-col items-center py-4 bg-white border-r">
  {items.map(item => (
    <button className="p-3 rounded-full hover:bg-gray-100">
      <Icon size={24} />
      <span className="text-[10px] mt-1">{label}</span>
    </button>
  ))}
</aside>
```

**Rules:**
- Icons always visible, labels optional (show on active or always)
- Floating variant looks more premium (Material 3 style)
- Can expand to full sidebar on wider screens

---

### Sidebar navigation (desktop, tablet landscape)

**When:** Desktop apps, wide tablets. Full navigation with icons + labels.

**Anatomy:**
- Fixed left (or right for RTL)
- Width: 240-280px (collapsible to 72px rail)
- Logo/brand at top
- Nav items: icon (20px) + label (14px), full width, left-aligned
- Active: accent bg tint or accent left border + accent text
- Sections separated by dividers or spacing
- Footer: user profile, settings, collapse toggle

**States:**
- Rest: muted text, muted icon
- Hover: bg tint, no text color change
- Active: accent bg tint, accent text, accent icon
- Collapsed: icon only (72px width)

**Design system adaptation:**
- Minimalist: no icons, text only, thin divider
- Material 3: filled active pill, dynamic color
- Neo-Brutalism: thick right border, hard shadow, monospace labels
- Corporate: blue accent, structured sections, dense

**Flutter:**
```dart
Drawer(
  child: ListView(
    children: [
      DrawerHeader(child: Logo()),
      ListTile(leading: Icon(Icons.home), title: Text('Home'), selected: isActive, onTap: ...),
      ListTile(leading: Icon(Icons.settings), title: Text('Settings'), onTap: ...),
    ],
  ),
)
```

**Web:**
```tsx
<aside className="fixed left-0 top-0 bottom-0 w-64 bg-white border-r flex flex-col">
  <div className="p-6"><Logo /></div>
  <nav className="flex-1 px-3">
    {items.map(item => (
      <a className={active ? "flex items-center gap-3 px-3 py-2 rounded-lg bg-accent/10 text-accent" : "flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100"}>
        <Icon size={20} />
        <span>{label}</span>
      </a>
    ))}
  </nav>
  <div className="p-4 border-t"><UserProfile /></div>
</aside>
```

**Rules:**
- Collapsible (icon-only mode for power users)
- Keyboard navigable (Tab + Enter)
- Active state obvious but not overwhelming
- Group related items with section headers
- Max 1 level of nesting (deeper = use drill-down page)

---

### Top app bar (all platforms)

**When:** Page header with title, actions, and optional back button.

**Anatomy (mobile):**
- Height: 56px (standard), 152px (large title, collapses on scroll)
- Back button (left), title (center or left), actions (right)
- Background: solid color or transparent (over scrolling content)
- Large title: 28-34px, scrolls into standard 16px on scroll

**Anatomy (desktop):**
- Height: 48-64px
- Logo (left), nav links or search (center), user menu (right)
- Sticky to top

**States:**
- Rest: solid bg
- Scrolled: bg becomes opaque (if transparent initially), elevation appears
- With back: back arrow visible
- Without back: leading space or menu icon

**Flutter:**
```dart
SliverAppBar(
  expandedHeight: 152,
  pinned: true,
  flexibleSpace: FlexibleSpaceBar(title: Text('Page Title')),
  leading: IconButton(icon: Icon(Icons.arrow_back), onPressed: ...),
  actions: [IconButton(icon: Icon(Icons.search), onPressed: ...)],
)
```

**Web:**
```tsx
<header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b">
  <div className="flex items-center justify-between h-14 px-4">
    <button onClick={onBack}><ArrowLeft /></button>
    <h1 className="text-lg font-semibold">{title}</h1>
    <div className="flex gap-2">{actions}</div>
  </div>
</header>
```

**Rules:**
- Mobile: back button + title + max 2 actions
- Desktop: logo + nav + search + user menu
- Large title (iOS style) collapses on scroll, don't use on every page
- Transparent over content: add bg on scroll

---

### Tab bar (top, in-content)

**When:** Secondary navigation within a page. Switching between views of
the same content.

**Anatomy:**
- Top of content area, below app bar
- Tabs: text label, optional icon
- Active: underline (2-3px) or pill background
- Inactive: muted text
- Scrollable if > 4 tabs

**States:**
- Rest: muted text
- Active: accent text + underline or pill
- Hover: text color shift
- Pressed: ripple or opacity

**Design system adaptation:**
- Minimalist: thin underline only
- Material 3: pill background, dynamic color
- Neo-Brutalism: thick underline, bold text, uppercase

**Flutter:**
```dart
TabBar(
  tabs: [Tab(text: 'All'), Tab(text: 'Active'), Tab(text: 'Archived')],
  indicator: BoxDecoration(color: accentColor, borderRadius: BorderRadius.circular(8)),
)
```

**Web:**
```tsx
<div className="flex gap-1 border-b">
  {tabs.map(tab => (
    <button className={active ? "px-4 py-2 text-accent border-b-2 border-accent" : "px-4 py-2 text-gray-500"}>
      {tab.label}
    </button>
  ))}
</div>
```

**Rules:**
- Max 5 visible tabs (more = scrollable or use dropdown)
- Active state must be obvious
- Don't mix top tabs with bottom nav for same-level navigation
- Swipe between tabs on mobile (gesture)

---

## Content components

### Card

**When:** Grouping related content. Displaying a discrete item.

**Anatomy:**
- Container with padding (16-24px)
- Border radius (8-20px depending on system)
- Background: white or surface color
- Border: 1px neutral or none (use shadow instead)
- Shadow: none, subtle, or tinted (per design system)
- Content: title, body, media, actions

**States:**
- Rest: as designed
- Hover (desktop): subtle bg shift, shadow lift, or border color change
- Pressed (mobile): scale 0.98 or bg shift
- Selected: accent border or accent bg tint

**Design system adaptation:**
- Minimalist: no border, no shadow, separated by whitespace or 1px line
- Material 3: elevation (level 1-3), no border, rounded 16px
- Neo-Brutalism: thick black border, hard shadow, solid color bg
- Glassmorphism: frosted glass bg, 1px white/20 border, no shadow
- Bento Grid: varied sizes, gap 12-16px, consistent radius

**Flutter:**
```dart
Container(
  padding: EdgeInsets.all(16),
  decoration: BoxDecoration(
    color: appColor.card,
    borderRadius: BorderRadius.circular(16),
    border: Border.all(color: Color(0xFFE8EDF2)),
  ),
  child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [...]),
)
```

**Web:**
```tsx
<div className="p-4 bg-white rounded-2xl border border-gray-200">
  {children}
</div>
```

**Rules:**
- One card = one concept (don't stuff unrelated content)
- Consistent radius across all cards on a page
- Don't nest cards inside cards (depth confusion)
- If every element is a card, remove the cards (use spacing instead)

---

### List item / row

**When:** Displaying a single record in a list. Settings rows, search
results, chat list, inbox.

**Anatomy:**
- Full width, left-aligned
- Leading: icon (24px) or avatar (40px) or image thumbnail
- Title (14-16px) + optional subtitle (12-14px muted)
- Trailing: chevron, badge, toggle, or action button
- Divider: 1px below, or none (use spacing)
- Height: 48-72px (touch-friendly)

**States:**
- Rest: as designed
- Hover (desktop): bg tint
- Pressed (mobile): bg tint or ripple
- Selected: accent bg tint

**Design system adaptation:**
- Minimalist: no dividers, generous spacing, text-only
- Material 3: ripple, container color on active
- iOS: chevron right, separator inset, grouped style

**Flutter:**
```dart
ListTile(
  leading: Icon(Icons.person_outline, color: appColor.textSecondary),
  title: FontStyleInter(text: 'John Doe', fsize: 15, fontweight: FontWeight.w600),
  subtitle: FontStyleInter(text: 'john@example.com', fsize: 13, color: appColor.textSecondary),
  trailing: Icon(Icons.chevron_right, color: appColor.textSecondary),
  onTap: () => ...,
)
```

**Web:**
```tsx
<div className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer">
  <Icon size={24} className="text-gray-400" />
  <div className="flex-1">
    <div className="text-sm font-semibold">John Doe</div>
    <div className="text-xs text-gray-500">john@example.com</div>
  </div>
  <ChevronRight size={20} className="text-gray-400" />
</div>
```

**Rules:**
- Consistent leading icon/avatar size across all rows
- Trailing element consistent (all chevrons, or all actions, don't mix)
- Min height 48px for touch
- Long titles: truncate with ellipsis, don't wrap to 3 lines

---

### Bento grid cell

**When:** Dashboard widget, feature showcase, metric display.

**Anatomy:**
- Varied sizes (1x1, 2x1, 1x2, 2x2)
- Content: icon + label + metric, or image + overlay text, or chart
- Consistent radius with other cards
- Gap: 12-16px between cells

**States:**
- Rest: as designed
- Hover (desktop): subtle lift or bg shift
- Loading: skeleton matching cell shape

**Design system adaptation:**
- Minimalist: no border, subtle bg variation
- Neo-Brutalism: thick border, hard shadow, solid color per cell
- Glassmorphism: frosted glass cells over gradient bg
- Material 3: surface container colors, elevation

**Flutter:**
```dart
SliverGrid(
  gridDelegate: SliverGridDelegateWithMaxCrossAxisExtent(
    maxCrossAxisExtent: 200,
    crossAxisSpacing: 12,
    mainAxisSpacing: 12,
    childAspectRatio: 1.0,
  ),
  delegate: SliverChildBuilderDelegate((context, index) {
    return _BentoCell(item: items[index]);
  }, childCount: items.length),
)
```

**Web:**
```tsx
<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 auto-rows-fr grid-flow-dense">
  {items.map(item => (
    <div className={cn("p-4 rounded-2xl", item.spanClass)}>
      {item.content}
    </div>
  ))}
</div>
```

**Rules:**
- Use `grid-flow-dense` to prevent empty cells
- Vary cell sizes for visual rhythm
- 3-5 intentional cells > 8 messy ones
- At least 2-3 cells need visual variation (image, gradient, chart)

---

## Input components

### Text input

**When:** Text entry (name, email, search, message).

**Anatomy:**
- Label above (14px) or floating label
- Input field: 40-56px height (touch-friendly on mobile)
- Border: 1px, radius per system
- Placeholder: muted, 14px
- Helper text below (12px muted) or error text (12px red)
- Clear button (trailing, optional)
- Prefix/suffix icons (leading/trailing)

**States:**
- Rest: neutral border
- Focus: accent border (2px) or accent ring
- Filled: neutral border, text visible
- Error: red border + red helper text
- Disabled: 40% opacity, no input

**Design system adaptation:**
- Minimalist: underline only, no box
- Material 3: filled or outlined, dynamic color on focus
- Neo-Brutalism: thick border, no radius, monospace
- iOS: rounded rectangle, no border, gray bg

**Flutter:**
```dart
TextField(
  decoration: InputDecoration(
    labelText: 'Email',
    labelStyle: TextStyle(fontSize: 14, color: appColor.textSecondary),
    border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
    focusedBorder: OutlineInputBorder(borderSide: BorderSide(color: appColor.accent, width: 2)),
    errorBorder: OutlineInputBorder(borderSide: BorderSide(color: Colors.red)),
  ),
  style: TextStyle(fontSize: 16, color: appColor.textPrimary),
)
```

**Web:**
```tsx
<div className="space-y-1.5">
  <label className="text-sm font-medium text-gray-700">Email</label>
  <input
    type="email"
    className="w-full h-12 px-4 rounded-lg border border-gray-300 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none text-base"
    placeholder="you@example.com"
  />
  <p className="text-xs text-gray-500">We'll never share your email.</p>
</div>
```

**Rules:**
- Label above input, never placeholder-as-label
- 16px font on mobile (prevent iOS zoom)
- Error text below, not in a toast
- Focus state must be visible (accessibility)
- Don't auto-submit on focus

---

### Button

**When:** Primary, secondary, tertiary actions.

**Variants:**
| Variant | When to use |
|---|---|
| Primary (filled) | Main CTA, one per section |
| Secondary (outline) | Alternative action |
| Tertiary (text/ghost) | Low-priority action, inline |
| Destructive (red/orange) | Delete, remove, logout |
| Icon button | Compact action (toolbar, header) |
| FAB | Mobile primary action (compose, add) |

**Anatomy:**
- Height: 40-48px (touch), 32-40px (desktop)
- Padding: horizontal 16-24px
- Radius: per system (pill, 8px, 12px, 0px brutalist)
- Text: 14-16px, semibold, one line
- Icon: optional, 18-20px, before or after text

**States:**
- Rest: as designed
- Hover (desktop): bg shift darker, or border brighten
- Pressed: scale 0.98, bg darker
- Disabled: 40% opacity, no pointer events
- Loading: spinner replaces text, no pointer events
- Focus: visible ring (accessibility)

**Design system adaptation:**
- Minimalist: text-only or outline, no fill
- Material 3: filled, tonal, outlined, text (4 variants)
- Neo-Brutalism: thick border, hard shadow, solid bg, uppercase
- Glassmorphism: glass bg or solid accent over glass surface

**Flutter:**
```dart
ElevatedButton(
  onPressed: onSubmit,
  style: ElevatedButton.styleFrom(
    backgroundColor: appColor.accent,
    foregroundColor: Colors.white,
    minimumSize: Size(double.infinity, 48),
    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
  ),
  child: Text('Submit'),
)
```

**Web:**
```tsx
<button className="h-12 px-6 rounded-xl bg-accent text-white font-semibold hover:bg-accent-dark active:scale-[0.98] transition-all disabled:opacity-40">
  Submit
</button>
```

**Rules:**
- One primary button per section
- Text fits on one line (max 3 words for primary CTAs)
- Destructive = red/orange, never the primary color
- Icon buttons need tooltips on desktop
- FAB: one per screen, bottom-right, 56px

---

### Chip / tag

**When:** Labels, filters, skill tags, categories, status badges.

**Anatomy:**
- Padding: horizontal 8-12px, vertical 4-8px
- Radius: full (pill) or 4-8px
- Background: tinted or white
- Text: 12-13px
- Optional: leading icon, trailing remove button

**States:**
- Rest: as designed
- Selected: accent bg tint + accent text
- Hover (desktop): bg shift
- Pressed: bg darker
- Disabled: 40% opacity

**Design system adaptation:**
- Minimalist: text + thin underline, no bg
- Material 3: filled, outlined, or filter chip variants
- Neo-Brutalism: thick border, solid bg, no radius
- Uniform: all chips same style (no alternating palette)

**Flutter:**
```dart
Container(
  padding: EdgeInsets.symmetric(horizontal: 12, vertical: 6),
  decoration: BoxDecoration(
    color: appColor.card,
    borderRadius: BorderRadius.circular(20),
    border: Border.all(color: Color(0xFFE8EDF2)),
  ),
  child: FontStyleInter(text: label, fsize: 12, fontweight: FontWeight.w500, color: appColor.textPrimary),
)
```

**Web:**
```tsx
<span className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-xs font-medium text-gray-700">
  {label}
</span>
```

**Rules:**
- Uniform style (no alternating colors)
- Max one line of text
- Removable chips need a clear X button
- Filter chips show selected state clearly

---

### Toggle / switch

**When:** Binary on/off setting.

**Anatomy:**
- Track: 44-52px wide, 24-28px tall, pill shape
- Thumb: 20-24px circle, slides left to right
- On: accent track, thumb on right
- Off: neutral track, thumb on left

**States:**
- Rest on: accent bg
- Rest off: neutral bg
- Disabled: 40% opacity
- Pressed: thumb scale 0.9

**Flutter:**
```dart
Switch(value: enabled, onChanged: (v) => ..., activeColor: appColor.accent)
```

**Web:**
```tsx
<button
  role="switch"
  aria-checked={enabled}
  onClick={() => setEnabled(!enabled)}
  className={cn("relative h-7 w-12 rounded-full transition-colors", enabled ? "bg-accent" : "bg-gray-300")}
>
  <span className={cn("absolute top-0.5 left-0.5 h-6 w-6 rounded-full bg-white transition-transform", enabled && "translate-x-5")} />
</button>
```

**Rules:**
- Label next to switch, not inside
- On state must be obvious (color change)
- Don't use for multi-state (use radio or dropdown)

---

## Overlay components

### Bottom sheet (mobile)

**When:** Modal interaction on mobile. Filters, menus, forms, detail
view.

**Anatomy:**
- Slides up from bottom
- Grabber handle at top (4x32px, neutral)
- Full width, max 90% screen height
- Rounded top corners (16-20px)
- Backdrop: 30-50% black overlay
- Swipe down to dismiss

**States:**
- Closed: hidden
- Opening: slide up animation (300ms, ease-out)
- Open: visible with backdrop
- Closing: slide down or fade

**Flutter:**
```dart
showModalBottomSheet(
  context: context,
  backgroundColor: Colors.white,
  shape: RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(20))),
  builder: (context) => Padding(
    padding: EdgeInsets.only(bottom: MediaQuery.of(context).viewInsets.bottom),
    child: SheetContent(),
  ),
)
```

**Web:**
```tsx
<div className="fixed inset-0 z-50 flex items-end">
  <div className="absolute inset-0 bg-black/40" onClick={onClose} />
  <div className="relative w-full bg-white rounded-t-2xl p-6 pb-safe animate-slide-up">
    <div className="w-8 h-1 bg-gray-300 rounded-full mx-auto mb-4" />
    {children}
  </div>
</div>
```

**Rules:**
- Swipe down to dismiss (gesture)
- Grabber handle always visible
- Don't stack sheets (close one before opening another)
- Keyboard-aware (padding adjusts when keyboard opens)

---

### Modal / dialog (desktop, tablet)

**When:** Modal interaction on larger screens. Confirmations, forms,
detail view.

**Anatomy:**
- Centered on screen
- Max 90% viewport width/height, typically 400-600px wide
- Backdrop: 40-60% black overlay
- Close button (top-right) or Esc to close
- Rounded corners (12-16px)
- Title + body + actions (footer)

**States:**
- Closed: hidden
- Opening: fade + scale up (200ms)
- Open: visible with backdrop
- Closing: fade + scale down

**Rules:**
- Esc to close
- Click backdrop to close (unless form is dirty)
- Focus trap (Tab stays inside modal)
- One modal at a time (no stacking)
- Actions in footer: primary right, secondary left (desktop convention)

---

### Toast / snackbar

**When:** Transient feedback. Success, error, info messages.

**Anatomy:**
- Top or bottom of screen
- Auto-dismiss after 3-5 seconds
- Max one line (two if necessary)
- Optional action button (e.g. "Undo")
- Background: dark (light text) or colored by type

**States:**
- Entering: slide in (250ms)
- Visible: 3-5 seconds
- Exiting: slide out or fade

**Flutter:**
```dart
Get.snackbar('Success', 'Profile updated', backgroundColor: appColor.card, snackPosition: SnackPosition.BOTTOM)
```

**Web:**
```tsx
<div className="fixed bottom-4 right-4 z-50 px-4 py-3 bg-gray-900 text-white rounded-lg shadow-lg animate-slide-up">
  {message}
</div>
```

**Rules:**
- Auto-dismiss (don't require user action)
- Max one visible at a time (queue others)
- Don't use for errors that require action (use inline or modal)
- Position: bottom on mobile, top-right or bottom-right on desktop

---

### Tooltip (desktop)

**When:** Explaining an icon-only button or providing extra context.

**Anatomy:**
- Small popup near trigger
- Dark bg, light text (or inverted)
- 11-12px text, max 1-2 lines
- Arrow pointing to trigger
- Appears on hover (300ms delay), disappears on leave

**Rules:**
- Desktop only (no hover on mobile)
- Don't put critical info in tooltips
- 300ms delay before showing (avoid flicker)
- Don't use for errors or warnings (use inline text)

---

## Data display components

### Data table (desktop)

**When:** Dense data display on desktop. Admin panels, dashboards,
reports.

**Anatomy:**
- Columns: header (sortable), rows (data)
- Row height: 40-56px
- Column header: 14px semibold, sortable (click to sort)
- Cell: 14px regular
- Pagination or infinite scroll at bottom
- Row hover: bg tint
- Row select: checkbox in first column
- Empty: composed empty state

**States:**
- Rest: white bg
- Hover: bg tint
- Selected: accent bg tint
- Sorted column: accent header bg or accent underline

**Rules:**
- Desktop only (phones use cards)
- Sticky header on scroll
- Column widths: fixed or resizable
- Max 7 visible columns (more = hide secondary, show on expand)
- Pagination > infinite scroll for large datasets (predictable)

---

### Empty state

**When:** No data to display. List is empty, no results, first-time use.

**Anatomy:**
- Centered in content area
- Illustration or icon (64-96px, muted)
- Headline (16-18px semibold)
- Description (14px regular, muted)
- Optional CTA button

**Design system adaptation:**
- Minimalist: icon + text, no illustration
- Material 3: illustration + text + CTA
- Neo-Brutalism: bold icon, thick border box, uppercase headline

**Flutter:**
```dart
Center(
  child: Column(mainAxisAlignment: MainAxisAlignment.center, children: [
    Icon(Icons.inbox_outlined, size: 72, color: appColor.textSecondary),
    SizedBox(height: 16),
    FontStyleInter(text: 'No jobs yet', fsize: 16, fontweight: FontWeight.w600, color: appColor.textPrimary),
    SizedBox(height: 8),
    FontStyleInter(text: 'Jobs you apply for will appear here', fsize: 14, color: appColor.textSecondary),
    SizedBox(height: 24),
    OutlinedButton(onPressed: browseJobs, child: Text('Browse jobs')),
  ]),
)
```

**Web:**
```tsx
<div className="flex flex-col items-center justify-center py-20 text-center">
  <Inbox size={72} className="text-gray-300" />
  <h3 className="mt-4 text-base font-semibold text-gray-900">No jobs yet</h3>
  <p className="mt-1 text-sm text-gray-500">Jobs you apply for will appear here</p>
  <button className="mt-6 ...">Browse jobs</button>
</div>
```

**Rules:**
- Never show a blank screen
- Headline + description always (not just "No data")
- CTA only if user can take action
- Keep it calm, not apologetic
- First-time use: pair the empty state with setup progress (below) so
  the user sees they've already started, not just that nothing exists

---

### Setup progress / checklist

**When:** First-run onboarding, profile completeness, multi-step setup.
Show advancement before the user has acted. Endowed progress motivates
completion because abandoning feels like losing what's already earned.

**Anatomy:**
- Progress bar or "N of M" step indicator, never starting at 0
- Checklist rows in three states: done (check, muted), current
  (highlighted), upcoming (neutral)
- The first item is already complete (account created, workspace set up)
- Optional: "Continue" CTA targeting the next incomplete step

**Design system adaptation:**
- Minimalist: thin bar, check marks, no percentage label
- Material 3: linear progress indicator + checklist cards
- Neo-Brutalism: thick-bordered steps, hard-offset "done" stamps

**Flutter:**
```dart
Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
  FontStyleInter(text: 'Getting started · 1 of 4', fsize: 14, fontweight: FontWeight.w600, color: appColor.textPrimary),
  SizedBox(height: 8),
  LinearProgressIndicator(value: 0.25, backgroundColor: appColor.homeBlueVeryLight),
])
```

**Web:**
```tsx
<div className="rounded-lg border p-4">
  <p className="text-sm font-medium">Getting started · 1 of 4</p>
  <div className="mt-2 h-1.5 rounded-full bg-gray-100">
    <div className="h-full w-1/4 rounded-full bg-accent" />
  </div>
  <ul className="mt-3 space-y-2 text-sm">
    <li className="flex gap-2 text-gray-400"><Check size={16} /> Create account</li>
    <li className="flex gap-2 font-medium"><CircleDot size={16} /> Add your first job</li>
    <li className="flex gap-2 text-gray-500"><Circle size={16} /> Invite your team</li>
  </ul>
</div>
```

**Rules:**
- The endowed step must be real (account created, email verified),
  never fake; invented progress is an AI slop tell
- Never display 0% or "0 of N"; frame the user as already started
- Always show the path ahead: how many steps and what is next
- Persist progress so a returning user resumes where they left off
- Cap checklists at 5-7 items; longer lists kill the goal-gradient effect

---

### Skeleton loader

**When:** Waiting for data to load. Show the shape of coming content.

**Anatomy:**
- Grey boxes matching the real layout shape
- Animated shimmer (left to right, 1.5s loop)
- Same dimensions as real content
- Same spacing as real content

**Flutter:**
```dart
Container(
  width: double.infinity, height: 16,
  decoration: BoxDecoration(color: appColor.homeBlueVeryLight, borderRadius: BorderRadius.circular(4)),
)
```

**Web:**
```tsx
<div className="animate-pulse bg-gray-200 rounded h-4 w-3/4" />
```

**Rules:**
- Match the real layout (not a generic spinner)
- Animate with shimmer (subtle, not distracting)
- Stop shimmer when reduced motion is preferred
- Replace with real content as it arrives (progressive loading)

---

### Avatar

**When:** User representation. Profile, comment, chat, list.

**Anatomy:**
- Circle or squircle (rounded square)
- Size: 24px (inline), 32px (list), 40px (card), 88px (profile)
- Image: user photo or initials fallback
- Border: 1-2px white or neutral (when overlapping)

**States:**
- Rest: as designed
- With badge: small dot (online status, notification)
- Group: overlapping avatars (max 4 visible, +N for more)

**Rules:**
- Fallback to initials (not generic user icon)
- Consistent size within a context
- Don't mix circle and squircle on same screen

---

## Action components

### FAB (Floating Action Button)

**When:** Primary action on mobile. Compose, add, create.

**Anatomy:**
- Bottom-right (above bottom nav if present)
- 56px diameter (standard), 48px (mini)
- Accent color bg, white icon
- Shadow: elevation 3-6
- Optional: extended FAB (icon + label pill)

**States:**
- Rest: visible with shadow
- Pressed: scale 0.95, elevation reduces
- Scrolled: can hide on scroll down, show on scroll up

**Flutter:**
```dart
FloatingActionButton(onPressed: onCreate, child: Icon(Icons.add), backgroundColor: appColor.accent)
```

**Rules:**
- One FAB per screen
- Don't use on desktop (use a button in the toolbar or header instead)
- Extended FAB for actions that need a label
- Don't place where it overlaps critical content

---

### Pull-to-refresh

**When:** Refreshing a list or feed on mobile.

**Anatomy:**
- Drag down from top of scrollable content
- Spinner appears at top (below header)
- Release to refresh
- Spinner animates while fetching
- Disappears when done

**Flutter:**
```dart
RefreshIndicator(onRefresh: refreshData, child: ListView.builder(...))
```

**Rules:**
- Mobile only (desktop uses a refresh button or auto-refresh)
- Spinner color: accent
- Don't auto-trigger (user must pull)
- Show success/failure feedback after refresh

---

### Context menu (desktop, tablet)

**When:** Right-click (desktop) or long-press (tablet) actions.

**Anatomy:**
- Popup menu at cursor/touch position
- List of actions (icon + label)
- Dividers between groups
- Destructive actions in red
- Close on outside click or Esc

**Rules:**
- Desktop: right-click
- Tablet: long-press
- Mobile: not recommended (use swipe actions or explicit buttons)
- Max 7 items (more = use a panel instead)

---

### Swipe action (mobile)

**When:** Quick actions on list items. Delete, archive, pin.

**Anatomy:**
- Swipe left or right on list row
- Action icon + bg color revealed behind
- Swipe fully to execute, or tap icon to execute
- Destructive: red bg (delete), neutral: accent bg (archive)

**Flutter:**
```dart
Dismissible(
  key: Key(item.id),
  background: Container(color: Colors.red, child: Icon(Icons.delete, color: Colors.white)),
  onDismissed: (direction) => deleteItem(item),
  child: ListItem(item: item),
)
```

**Rules:**
- Mobile only (no swipe on desktop)
- One action per direction (left = delete, right = archive)
- Confirm destructive actions with a snackbar undo
- Don't hide the only way to do something behind a swipe (provide button too)

---

## Selection components

### Checkbox

**When:** Multi-select from a list, or binary consent (terms).

**Anatomy:**
- Box: 18-24px, rounded 2-4px
- Unchecked: neutral border, empty
- Checked: accent bg, white checkmark
- Label: 14-16px, next to box

**States:**
- Unchecked, checked, indeterminate (for select-all)
- Disabled: 40% opacity
- Error: red border (for required)

---

### Radio button

**When:** Single-select from a small set (2-5 options).

**Anatomy:**
- Circle: 18-24px
- Unselected: neutral border, empty
- Selected: accent border, accent dot inside
- Label: 14-16px, next to circle

**Rules:**
- Use for 2-5 options (more = dropdown or segmented control)
- Always show selected state
- Don't use for binary (use toggle)

---

### Dropdown / select

**When:** Single-select from many options (6+), or when options are
dynamic.

**Anatomy:**
- Trigger: input-like, with chevron-down
- Menu: popup below trigger, max 300px height (scroll if more)
- Options: text, optional icon, checkmark on selected
- Search: optional, for long lists

**States:**
- Rest: neutral border
- Open: accent border, menu visible
- Selected: checkmark on chosen option
- Disabled: 40% opacity

**Flutter:**
```dart
DropdownButton<String>(
  value: selected,
  items: options.map((o) => DropdownMenuItem(value: o, child: Text(o))).toList(),
  onChanged: (v) => ...,
)
```

**Web:**
```tsx
<select className="h-12 px-4 rounded-lg border border-gray-300 focus:border-accent">
  {options.map(o => <option value={o}>{o}</option>)}
</select>
```

**Rules:**
- Use native select on mobile (better UX than custom)
- Custom dropdown OK on desktop
- Search for lists > 10 items
- Show selected state on trigger after selection

---

## Summary: Component adaptation by form factor

| Component | Phone | Tablet | Desktop |
|---|---|---|---|
| Navigation | Bottom nav | Rail | Sidebar |
| Header | Top app bar (compact) | Top app bar | Top bar + nav |
| Tabs | Top tabs or bottom | Top tabs | Top tabs |
| Card | Full width | 2-col grid | 3-4 col grid |
| List | Single column | 1-2 column | Multi-column or table |
| Form | 1 field/row | 1-2 fields/row | Multi-field/row |
| Input | 48-56px height | 48-56px height | 40-48px height |
| Button | 48px height | 44-48px height | 40px height |
| Modal | Bottom sheet | Centered or slide-over | Centered dialog |
| Toast | Bottom | Bottom or top-right | Top-right or bottom-right |
| FAB | Yes | Optional | No (use toolbar button) |
| Context menu | Long-press | Long-press | Right-click |
| Refresh | Pull-to-refresh | Pull-to-refresh | Button or auto |
| Data display | Cards | Cards or simple table | Full data table |
| Empty state | Centered, full screen | Centered in content | Centered in content |
| Skeleton | Match layout | Match layout | Match layout |
