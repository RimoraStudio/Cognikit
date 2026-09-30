# UX Psychology: Laws That Drive Design Decisions

Established effects and laws that translate directly into design
decisions. Apply them to reduce friction and motivate completion. Do not
use them to manipulate (see the guardrail at the bottom).

Grouped by what they govern: attention and choice, momentum and memory,
effort and feedback.

---

## Attention and choice

### Fitts's Law

The time to hit a target depends on its size and distance. Big, near
targets are fast; small, far targets are slow.

**Apply:**
- Primary CTA is the largest tappable element on screen
- Destructive actions get small targets placed away from frequent taps
- Touch targets >= 44pt on mobile, click targets >= 24px on desktop
- Put controls near what they affect (edit button on the item, not in a
  toolbar far away)

### Hick's Law

Decision time grows with the number and complexity of options. Every
extra choice costs the user time and confidence.

**Apply:**
- Nav: 5-7 items max, progressive disclosure for the rest
- One primary action per view; demote the rest to secondary
- Break complex forms into steps instead of one wall of fields
- Offer sensible defaults so most users never face the choice

### Miller's Law / Chunking

Working memory holds roughly 4-7 items. Users do not read lists; they
chunk them.

**Apply:**
- Group related items under visible headings (3-5 per group)
- Chunk long numbers and codes (phone, card numbers, IDs)
- Pagination, tabs, and accordions exist to chunk, not to decorate
- A checklist of 20 flat items is broken; 5 groups of 4 is not

### Von Restorff Effect (Isolation)

The visually distinct item in a set is the one remembered and chosen.

**Apply:**
- One accent color per screen so the CTA stands out (see core
  principles)
- A highlighted recommended plan in pricing works because it is
  different, not because it is brighter
- If everything is highlighted, nothing is

### Serial Position Effect

Users remember the first and last items in a sequence best; the middle
blurs.

**Apply:**
- Put the most important nav items first and last (Home first, CTA last)
- In pricing, anchor ordering matters more than middle content
- In onboarding, put the highest-value step early, not at position 3

### Recognition over recall

Choosing from visible options is easier than remembering them.

**Apply:**
- Menus, autocomplete, and recent items beat typed commands
- Show password rules inline instead of making the user recall them
- Visible undo beats a confirm dialog the user must parse

---

## Momentum and memory

### Endowed progress + goal-gradient effect

Users accelerate toward a goal as they near it, and progress they did
not earn still feels like theirs to lose. See core principle 9 and the
setup progress checklist in `components.md`.

**Apply:**
- First-run checklists start at 1 of N, never 0 of N
- Show the distance remaining, not just steps done ("2 left")
- Persist progress so returning users resume mid-flow

### Zeigarnik Effect

Unfinished tasks occupy memory and pull attention back. Started work
nags; unstarted work does not.

**Apply:**
- Visible "in progress" states invite return (drafts, half-done setup)
- A progress bar at 60% is a stronger return trigger than any reminder
  email
- Same reason modals with partial input should offer "save and finish
  later"

### Peak-End Rule

Users judge an experience by its most intense moment and its ending,
not by the average. A smooth flow that ends badly is remembered badly.

**Apply:**
- Invest in the final screen: success state, confirmation, receipt
- Error recovery is a peak moment; handle it well or it defines the
  experience
- End onboarding with a payoff, not a form

### Loss Aversion

Losing feels roughly twice as bad as equivalent gaining feels good.
Users protect progress more eagerly than they pursue it.

**Apply:**
- "Your draft is saved" reassures; "unsaved changes will be lost" on
  exit warns legitimately
- Streaks, saved carts, and resume-points leverage this ethically
- Fake scarcity and countdown timers leverage it unethically (guardrail
  below)

---

## Effort and feedback

### Jakob's Law

Users spend most of their time on other products, so they expect yours
to work the same way. Conventions are learned shortcuts, not laziness.

**Apply:**
- Novel visuals, conventional IA: logo top-left, cart top-right, search
  as a magnifier, underlined links
- Do not reinvent navigation, scroll behavior, or form submission
- Break convention only when the gain clearly beats the learning cost

### Doherty Threshold

Interactions that respond in under ~400ms keep users in flow; slower
responses break attention.

**Apply:**
- Give instant feedback on every tap (press state, optimistic update)
- Under 400ms: nothing needed. Over 1s: progress indicator. Over 10s:
  percentage or step detail
- Skeletons and optimistic UI buy perceived speed for free

### Tesler's Law (Conservation of Complexity)

Every system has irreducible complexity; the only question is who
absorbs it, you or the user.

**Apply:**
- Smart defaults, inferred values, and auto-detection absorb complexity
- Advanced options exist but are collapsed, not deleted
- If the user must make a decision the system could make, the design is
  lazy, not simple

### Postel's Law (Robustness)

Be conservative in what you send, liberal in what you accept.

**Apply:**
- Accept "10/5/2026", "Oct 5", and "05-10-2026" in a date field; format
  it yourself
- Fuzzy-search and trim whitespace instead of erroring on near-misses
- Reject input only when there is no reasonable interpretation

### Aesthetic-Usability Effect

Users perceive polished, attractive interfaces as easier to use and are
more tolerant of minor issues in them.

**Apply:**
- Visual polish is functional, not decorative; it buys trust and
  patience
- Do not use it to paper over real usability problems; the effect
  raises expectations that bad UX then breaks harder
- First impressions set the tolerance budget for the whole session

### Defaults Effect (Satisficing)

Most users accept defaults rather than optimize every choice. Defaults
are the real UX.

**Apply:**
- Choose defaults as if the user will never open settings, because most
  will not
- Preselect the recommended option, the common timezone, the safe
  permission level
- Dark-pattern defaults (pre-checked marketing opt-ins) burn the trust
  this effect builds on

---

## Guardrail: motivate, don't manipulate

Every effect above can be weaponized. The line is whether the benefit
flows to the user or only to you.

**Never:**
- Fake scarcity ("Only 2 left!") or fake countdown timers
- Fake progress (endowed steps the user did not complete)
- Confirm-shaming ("No thanks, I hate saving money")
- Roach-motel patterns (easy to start, impossible to cancel)
- Hidden opt-outs and pre-checked consent boxes

**Do:**
- Real scarcity, real progress, real deadlines
- Easy exits that respect the same Fitts's-law targets as entries
- Defaults chosen for the user's benefit, documented honestly

If a pattern would embarrass you in a design review, it belongs in the
slop list, not the product.
