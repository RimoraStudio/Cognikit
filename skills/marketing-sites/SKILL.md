---
name: marketing-sites
description: >
  Designs and writes marketing and landing websites that convert and do
  not look AI-generated. Covers grounding, page narrative, hero
  discipline, conversion copy, pricing pages, and anti-slop patterns.
  Trigger phrases: "landing page", "marketing site", "build a landing
  page", "hero section", "pricing page", "product page", "waitlist
  page", "launch page", "conversion page", "homepage design".
metadata:
  version: 1.0.0
license: MIT
---

# Marketing Sites

> Part of [Cognikit](https://cognikit.com). A kit that gives AI agents cognitive abilities.

Build marketing pages the way a senior conversion designer does:
grounded in the actual product, structured as a narrative, and
distinctive enough that nobody guesses an AI wrote it. Generic output
is a failure even if the code is clean.

## AI execution flow (follow in order)

1. **Brief**: Answer the grounding questions in section 1 before
   drawing anything. If the user gave a thin prompt, ask for the
   missing facts or state explicit assumptions.
2. **Narrative**: Choose the section sequence for this product type.
   Do not default to the standard arc.
3. **Wireframe**: Sketch an ASCII wireframe with a one-line goal per
   section. Decide the hero variation and the ONE memorable element.
4. **Self-check**: Ask "could this page appear unchanged on a site for
   any similar product?" For every section where the answer is yes,
   rewrite it before building.
5. **Build**: Write real copy and markup. Apply the copy rules, slop
   blocklist, and technical notes below.
6. **Verify**: Run the pre-flight checklist at the bottom.

## 1. Ground first

Before designing, write down:

- **Product**: what it actually does, in one sentence a stranger gets
- **Audience**: who lands here, and what they already believe or fear
- **The ONE job**: the single action the page exists for. Sign up,
  buy, book a call, download, join a waitlist. Pick one.

Every design decision flows from these three answers. A page with two
equal CTAs has no job. If you cannot name the job, stop and ask.

## 2. Page narrative

A converting page is an argument in order. The default arc:

1. Hero: the promise
2. Problem and stakes: what hurts today
3. Solution and mechanism: how it works, not just what it does
4. Proof: logos, numbers, testimonials, demos
5. Objection handling: FAQ, comparison table, security notes, pricing
6. Final CTA: repeat the one job

Vary by product type. A developer tool can open with a live code block
and push testimonials to the bottom. A waitlist page is often hero,
mechanism, one proof beat, done. Not every page needs every block. A
short confident page beats a long padded one.

Example wireframe for pass three:

```
| HERO      | giant outcome headline, one CTA, product visual      |
| PROBLEM   | two-sentence pain statement, no cards                |
| MECHANISM | numbered how-it-works with real screenshots          |
| PROOF     | numbers row, then one deep testimonial               |
| PRICING   | 3 tiers, middle anchored, annual toggle              |
| FINAL CTA | repeat the hero promise and the one job              |
```

## 3. Hero discipline

A hero is exactly four things: a headline stating the outcome, a
subhead explaining how, ONE call to action, ONE visual. Anything else
is noise.

Forbidden defaults (the AI fingerprint):

- Gradient background with everything centered
- Eyebrow label, H1, paragraph, two buttons, dashboard screenshot
- "Get Started" or "Learn More" CTAs that name no result
- Two competing buttons with equal visual weight

### Hero variations

| Variation | Fits when |
|---|---|
| Giant type | Brand-led product with strong opinionated copy; little UI worth showing |
| Product-led screenshot | The UI is the differentiator; use a crisp real product state, not a mockup |
| Live demo / interactive | Value provable in 10 seconds: editors, playgrounds, API tools |
| Data / stat-led | One number carries the pitch: savings, speed, volume |
| Founder note / letter | Early stage, high-trust sale, mission or community driven |
| Video-first | Motion is the value: animation tools, games, camera apps |
| Minimalist text-only | Confident tone, technical audience, waitlist pages |

## 4. Conversion copy rules

- **Outcome-first headlines**: sell the result ("Ship pages that
  rank") not the feature ("Static site generation pipeline")
- **Specificity beats adjectives**: "Deploys in 40 seconds" beats
  "Blazing fast". Use numbers, names, and concrete nouns.
- **CTAs name the result**: "Start free trial", "Book a demo", "Get
  the checklist". Never "Submit", "Click here", or a bare "Get
  Started".
- **Social proof with real numbers**: "4,200 teams", "SOC 2
  certified", real names with real roles. Never invented stats.
- **Write scannable**: a reader skimming only headings and CTAs must
  get the full story. Headings carry the narrative alone.

### Pricing pages

- 3 tiers max; 4 only if an enterprise row is genuinely needed
- Anchor the middle tier as recommended ("Most popular")
- Annual toggle showing the saving as a concrete amount
- Each tier states who it is for, not just its limits
- The CTA on the recommended tier is the most prominent element on
  the page

## 5. One memorable element

Pick exactly ONE distinctive thing per page: an unusual layout, a
signature illustration style, one strong interaction, a bold type
choice. Everything else stays quiet so the one thing lands. Three or
more scattered effects read as generic decoration, not personality.

## 6. Patterns that read as AI slop

Avoid these unless the brief truly demands them:

- Three equal feature cards with icon, title, and two-line text
- Testimonial carousel with rotating quotes
- Accordion FAQ as the default objection handler
- The "features, testimonials, pricing, footer" assembly line
- Fake statistics like "10x productivity" with no source or number
- Stock metaphors: rockets, lightning bolts, puzzle pieces, gears
- Emoji or gradient-icon bullet lists running down the whole page

## 7. Real content rule

- No lorem ipsum anywhere, ever
- No placeholder company names: Acme, Nexus, Globex, "YourBrand"
- Write plausible real copy derived from the brief. When facts are
  unknown, mark them `[verify]` at exactly the spots needing input.
- No em dashes or en dashes in copy. Use periods, commas, or colons.
- Banned words in generated copy: Elevate, Seamless, Unlock,
  Supercharge, Delve, Cutting-edge, Revolutionize, Next-level
- No "Loved by thousands" or "Trusted by teams" claims without a real
  number or name behind them

## 8. Technical notes

- **LCP discipline**: the hero is the largest paint. Compress and
  preload the hero image, set explicit dimensions, avoid
  render-blocking fonts, never ship an unoptimized hero video.
- **Autoplay video**: muted, looping, behind a `prefers-reduced-motion`
  check, with a static poster fallback.
- **Forms**: fewest fields that close the deal. Email alone for
  waitlists. Every extra field costs conversion.
- **Mobile conversion**: primary CTA in thumb reach, tap targets at
  least 44px, confirm the narrative order still works when stacked.

## Related skills

- `design-systems`: invoke for visual direction, tokens, and type
  scale before styling the page
- `code-review`: run over the generated markup and styles before
  shipping

## Pre-flight checklist

- [ ] The ONE job is named and every CTA on the page serves it
- [ ] Hero is headline + subhead + one CTA + one visual, with no forbidden default
- [ ] Section order was chosen for this product, not copied from the default arc
- [ ] Exactly one memorable element; everything else stays quiet
- [ ] No slop sections: 3 equal cards, carousel, accordion FAQ, fake stats, stock metaphors
- [ ] No lorem ipsum, placeholder names, banned words, or em/en dashes
- [ ] Headings alone tell the story; every CTA names a result
- [ ] Hero asset optimized for LCP; forms minimal; mobile CTA thumb-reachable
- [ ] Passed the self-check: no section could appear unchanged on a competitor's page
