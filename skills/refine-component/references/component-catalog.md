# Component Catalog

Use this catalog to scope a refinement, not as a checklist to apply to every
screen. Identify the component the user means, inspect its context, then load
the closest playbook in `component-playbooks.md`. If a specific component is
not listed, select the nearest family and preserve its native semantics.

## Actions and controls

- **Buttons**: primary, secondary, tertiary, destructive, icon-only, split,
  floating action button
- **Links**: inline, navigation, external, download
- **Icon buttons**
- **Toggle buttons and button groups**
- **Segmented controls**
- **Checkboxes**
- **Radio buttons**
- **Switches and toggles**
- **Sliders and range sliders**
- **Steppers**
- **Rating controls**
- **Color pickers**
- **Date and time pickers**

For controls, verify intent, semantic element, activation, state feedback,
keyboard/touch operation, constraints, and boundary values. For links, verify
destination, external indication, download behavior, and browser conventions.
For sliders, steppers, ratings, and color controls, expose the current value
and allow precise operation through keyboard or direct entry where appropriate.

## Forms and input

- **Text fields and text areas**
- **Password fields with show/hide**
- **Search fields**
- **Number inputs**
- **Phone and email inputs**
- **Select menus and dropdowns**
- **Multi-selects**
- **Comboboxes and autocomplete**
- **File upload and drag-and-drop areas**
- **OTP and verification-code inputs**
- **Input masks**
- **Labels, helper text, and validation messages**
- **Character counters**
- **Form sections and field groups**

Treat labels, help, constraints, error text, and the control as one field
contract. Keep input values through recoverable errors. For masked or split
inputs, support paste and assistive technology, and avoid forcing awkward
character-by-character entry. Counters should explain limits without
interrupting typing. See the form and choice-control playbooks for details.

## Navigation

- **Top navigation bars**
- **Sidebars and navigation rails**
- **Tabs**
- **Breadcrumbs**
- **Pagination**
- **Step navigation and progress steps**
- **Menus and submenus**
- **Bottom navigation**
- **Navigation drawers**
- **Table of contents**
- **Back buttons**

For navigation, preserve routes, browser history, selected location, and query
state. Distinguish route links from local actions. Check overflow, active state,
keyboard sequence, narrow-screen adaptation, and whether mobile navigation is
modal or non-modal. For step navigation, distinguish completed, current,
upcoming, and blocked steps and do not imply completion prematurely.

## Feedback and status

- **Alerts and banners**
- **Toasts and snackbars**
- **Dialogs and confirmation modals**
- **Progress bars**
- **Spinners and loading indicators**
- **Skeleton loaders**
- **Badges and status indicators**
- **Tooltips and popovers**
- **Empty states**
- **Success, error, warning, and info states**
- **Inline validation feedback**

Match the feedback mechanism to urgency, persistence, and blocking behavior.
Give users a recovery action for failures. Do not announce routine status by
stealing focus, fake progress, or make important errors disappear as toasts.
Use the overlay playbooks for focus, dismissal, and background behavior.

## Content and layout

- **Cards**
- **Lists and list items**
- **Tables and data grids**
- **Accordions and dividers**
- **Avatars**
- **Image galleries and carousels**
- **Video and audio players**
- **Charts and graphs**
- **Code blocks**
- **Tags and chips**
- **Timelines**
- **Tree views**
- **Kanban boards**
- **Calendars and maps**

For content components, check hierarchy, relationships, variable-length
content, empty/loading/error states, density, and responsive behavior. For
tables, trees, kanban boards, charts, maps, galleries, and media players, test
their core operation rather than only the container styling: sorting and
selection, expand/collapse, drag/drop, filters, zoom or playback, captions,
legends, and alternate text or summaries where applicable. Preserve accurate
data and avoid conveying meaning by color alone.

## Overlays and contextual UI

- **Dropdown menus and context menus**
- **Command palettes**
- **Modal dialogs and lightboxes**
- **Side sheets and drawers**
- **Popovers and tooltips**
- **Cookie notices**
- **Onboarding tours**

Define trigger, open state, focus entry, navigation within the surface,
dismissal, focus return, and stacking with other overlays. Context menus and
command palettes need a discoverable keyboard path. Cookie notices need
clear, equally understandable choices and must not obscure essential content.
Onboarding tours should be dismissible and should not trap users away from the
task they came to complete.

## Common page and flow patterns

- **Login, sign-up, and password reset**
- **Search results and filters**
- **Settings and profile pages**
- **Dashboards**
- **Checkout and payment flows**
- **Multi-step forms**
- **Confirmation and review screens**
- **Error pages**
- **Landing page sections**
- **Responsive mobile navigation**

These are composed flows, not atomic components. Trace the user's goal from
entry to completion, identify each component that blocks or advances it, and
refine the flow's state transitions together. Preserve entered data, clarify
progress and consequences, and avoid broad redesign unless requested. Route
specialist dashboard or marketing work to the related skill when the task
exceeds component-level refinement.

## Coverage rule

Do not implement the entire catalog in a single request. Scope to the named
component or flow, list the states and operations that actually apply, and
verify those. Ask one clarifying question only when behavior or risk cannot be
inferred safely from the project.
