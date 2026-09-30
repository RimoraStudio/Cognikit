---
name: dashboard-ui
description: >
  Designs data-dense dashboards, admin panels, and internal tools
  interfaces that answer questions fast instead of decorating data.
  Use when the user says "dashboard", "admin panel", "analytics page",
  "data table", "build a dashboard", "metrics page", "monitoring UI",
  "reporting dashboard", "internal tool UI", or "data visualization
  layout". Also triggers on KPI screens, operational views, and any
  interface whose job is helping a person decide from data.
metadata:
  version: 1.1.0
license: MIT
---

# Dashboard UI

> Part of [Cognikit](https://cognikit.com). A kit that gives AI agents cognitive abilities.

A dashboard answers questions. It does not display data. Every pixel exists
so a person can answer "is something wrong, and what do I do about it" in
seconds. Design for the decision, not the dataset.

## AI execution flow (follow in order)

1. **Questions**: Before any layout, list the 3 to 5 questions the user
   asks this screen, in priority order. Example: "Is revenue on track?
   Which region slipped? Which orders need action today?"
2. **Widget map**: Assign one widget per question. If a widget cannot name
   the question it answers, cut it. That is decoration.
3. **Hierarchy**: Lay out the page for F-pattern reading. Primary metric
   or alert goes top-left or top. Supporting context sits in the middle
   band. Detail and drill-down live at the bottom.
4. **Charts and tables**: Pick from the chart selection table below only
   when a chart beats a table or a number. Default to the simplest display
   that answers the question.
5. **States**: Design loading, empty, error, and stale states for every
   widget before polishing the happy path.
6. **Interactions**: Define filters, drill-down, and keyboard behavior.
7. **Responsive**: Decide per-widget mobile behavior (stack, hide, or
   simplify). Never just shrink.
8. **Verify**: Run the pre-flight checklist at the bottom.

## Information hierarchy

Users scan dashboards in an F-pattern: across the top, then down the left
edge. Respect it.

- **Top-left or top**: the single most important metric or the active
  alert. One hero number max per view. Two heroes means neither is.
- **Middle**: supporting context, breakdowns, comparisons.
- **Bottom**: detail tables, raw rows, drill-down targets.
- **Inverted data pyramid**: KPI to breakdown to raw rows. Each level
  answers "why" for the level above it.

## Audience & KPI selection

One dashboard serves one audience. Pick the archetype before picking
widgets; it fixes the KPI count and the refresh cadence.

| Type | Audience | Cadence | KPI count |
|---|---|---|---|
| Strategic | C-suite, VPs | Weekly | 3-5 |
| Operational | Team leads, managers | Daily | 8-15 |
| Analytical | Analysts | On-demand | Unlimited |
| Real-time monitoring | Engineers, support | Live | 10-20 |

KPI selection process:

1. List 20 metrics the audience cares about.
2. Filter to metrics they can act on. Vanity metrics die here.
3. Group survivors into 3 to 5 themes (revenue, customers, ops).
4. Pick 1 to 3 primary metrics per theme.

Then tier them so size follows importance:

- **Level 1, headline**: 3 to 5 KPIs rendered large.
- **Level 2, supporting**: 6 to 10 charts of context.
- **Level 3, detail**: tables and drill-downs for investigation.

## Chart selection

| Question shape | Use | Never |
|---|---|---|
| Trend over time | Line chart | Area chart with gradient fill |
| Comparison across categories | Bar (horizontal for long labels) | Radial bars |
| Part of whole | Stacked bar or a table | Pie with more than 5 slices |
| Distribution | Histogram | Pie, radar |
| Single value | Big number + delta + sparkline | Gauge, dial |
| Status / health | Badges or colored dots | Animated gauge |
| Correlation | Scatter plot | Bubble chart with 4+ encodings |

Banned outright: 3D charts, dual y-axes, rainbow palettes, animated
gauges. If a number answers the question, show a number.

## Data table rules

- Alignment: numbers right, text left, dates in one format everywhere.
  Use `tabular-nums` or a monospace variant so digits do not jitter.
- Headers: sortable and filterable. Sticky on scroll.
- Rows: offer density options (compact, comfortable). Row click opens
  the detail view.
- Bulk: checkboxes plus a bulk-action bar when actions apply to many rows.
- Scale: paginate or virtualize beyond 50 rows. Never render thousands of
  DOM rows.

## States discipline

Every widget gets four states, designed, not improvised:

- **Loading**: skeleton matching the final shape (bars for a bar chart,
  rows for a table). A spinner lies about what is coming.
- **Empty**: explain why it is empty and give the action to fix it.
  "No orders match. Clear filters" or "Connect a data source".
- **Error**: retry affordance plus a plain-language message. Not a dead
  red box.
- **Stale**: "last updated 2m ago" on any live or polled data.

Load progressively: each section renders when its data arrives. Never
block the whole page on the slowest query.

## Filters and time range

- One global date/time-range picker at the top level, governing all
  widgets unless a widget explicitly opts out.
- Filters render as removable chips showing active state. Hidden filter
  state is invisible state.
- Sync filters, range, and view options to the URL so every view is
  shareable and back-button safe.
- Always provide a reset-all affordance.

## Density and layout

Dashboards are tools, not brochures.

- Compact spacing scale (4px base, tighter than marketing pages).
- 12-column grid; widgets snap to it. No free-floating cards.
- One card chrome treatment: same border or shadow, same radius, same
  header pattern. Per-widget chrome styling is noise.
- Tabular figures for numbers so columns stay aligned.
- Colorblind-safe palette: `#0077BB` blue, `#EE7733` orange,
  `#009988` teal, `#CC3311` red. Never pair pure red and pure green
  without a label or texture differentiator.

## Interaction rules

- Click-to-drill beats tooltip-only detail. Hover gives precision values;
  click gives the story.
- When charts share a dimension, crossfilter: selecting a region on one
  chart filters the rest.
- Everything keyboard accessible: visible focus, table row navigation,
  escape clears selection.
- Never hide the only path to detail behind a hover. Touch users exist.

## Anti-patterns

- Bento-grid layouts chosen for looks over the reading pattern
- Gradient fills on charts; they add ink, not information
- A chart for everything. A table is often the better answer.
- Fake real-time: blinking badges, re-animating counters
- Dashboard on the landing page. Marketing pages and tools have
  different jobs.
- Per-widget accent colors. One semantic palette, used consistently.

## Responsive reality

Dashboards collapse badly. Do not shrink charts until they are
unreadable. Decide per widget:

- **Stack**: reflow the grid to a single column in priority order.
- **Hide**: cut secondary widgets that do not answer a top question.
- **Simplify**: chart becomes big-number-plus-delta; table becomes a
  card list.

On mobile the rules harden: show the top 3 KPIs only, stack charts
vertically in priority order, and degrade each chart to a big number
plus its delta.

## Related skills

- `design-systems`: for the visual direction (tokens, typography, card
  chrome) applied on top of this layout logic
- `api-design`: for the data contracts behind widgets; shape responses
  so each widget gets exactly the fields it renders

## Pre-flight checklist

- [ ] Listed the 3 to 5 questions this view answers, in priority order
- [ ] Every widget maps to a question; decoration removed
- [ ] One hero number max; primary metric or alert is top-left or top
- [ ] 5-second test passes: a viewer names the most important metric
  within 5 seconds
- [ ] Every KPI carries a comparison value (vs target or prior period)
- [ ] Charts picked from the selection table; no banned chart forms
- [ ] Tables: correct alignment, sortable headers, sticky header,
  pagination or virtualization past 50 rows
- [ ] Every widget has loading (skeleton), empty, error (retry), and
  stale states; "last updated" timestamp visible on live data
- [ ] Sections load progressively; no whole-page blocking on one query
- [ ] Filters are chips; filter state synced to URL; reset-all exists
- [ ] Per-widget mobile behavior defined (stack, hide, or simplify);
  mobile shows the top 3 KPIs
- [ ] All interactions reachable by keyboard
