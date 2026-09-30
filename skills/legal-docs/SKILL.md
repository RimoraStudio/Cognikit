---
name: legal-docs
description: >
  Drafts professional-grade legal and policy documents for software
  products: privacy policies, terms of service, cookie policies, refund
  policies, disclaimers, and acceptable use policies. Intake-first: builds
  every document around the product's actual data practices, jurisdictions,
  and business model instead of shipping a generic template. Use when the
  user asks for a "privacy policy", "terms of service", "terms and
  conditions", "cookie policy", "write a policy", "legal page", "GDPR
  privacy policy", "refund policy", "acceptable use policy", "disclaimer",
  "data processing agreement", "terms for my app", or "privacy policy for
  website".
metadata:
  version: 1.0.0
license: MIT
---

# Legal Docs

> Part of [Cognikit](https://cognikit.com). A kit that gives AI agents cognitive abilities.

Draft legal documents the way a careful product counsel would: learn what
the product actually does with data first, then write the document around
those facts. A policy that lies about practices is worse than no policy at
all, so intake always comes before drafting.

## AI execution flow (follow in order)

1. **Intake**: Collect the facts in the intake section below. Never skip to
   drafting. If the user gave partial info, ask only for what is missing and
   mark anything unanswerable as a placeholder.
2. **Classify**: Determine which document(s) are needed and which
   jurisdictions apply (see the jurisdiction matrix). Flag gaps: an app with
   user content needs a UGC license clause, EU users need GDPR legal bases.
3. **Draft**: Write the document using the required sections for its type.
   Build every clause around the intake facts. Use `[COMPANY NAME]` style
   placeholders for unknowns instead of inventing values.
4. **Annotate**: Add the plain-language summary layer, effective date,
   version number, and a real contact section.
5. **Advise**: State once, cleanly, at generation time that the document is
   a starting draft and regulated industries (health, finance, children's
   products) or significant jurisdictional exposure warrant legal review.
   One sentence, not a lecture.
6. **Verify**: Run the pre-flight checklist at the bottom.

## Intake (always before drafting)

Collect these facts. Ask in one batch, accept partial answers, use
placeholders for the rest.

- **Entity**: company name, entity type (LLC, Ltd, sole proprietor),
  jurisdiction of incorporation
- **Product type**: SaaS, mobile app, marketplace, ecommerce, content site
- **Data collected**: accounts, payments, analytics, cookies, location,
  device data, AI training on user content
- **Third parties**: processors and services (Stripe, Google Analytics,
  hosting providers, email tools)
- **User geography**: EU/UK (GDPR), California (CCPA/CPRA), children under
  13 (COPPA), other regions
- **Business model**: subscription, one-time purchase, ads, free,
  marketplace fees

## Document types and required sections

### Privacy policy

Must include all of:

- Data collected (mapped to actual practices from intake)
- Purposes of processing
- Legal bases for processing (GDPR: consent, contract, legitimate interest,
  legal obligation)
- Sharing and processors (categories, ideally named vendors)
- Retention periods
- User rights: access, deletion, portability, correction, objection
- Cookies and tracking (link to cookie policy if separate)
- Children's privacy
- International transfers
- Contact / DPO details
- How changes are communicated

### Terms of service

Must include all of:

- Acceptance of terms
- Service description
- Account terms (registration, security, eligibility)
- Acceptable use rules
- IP ownership split: what is the company's vs what is the user's
- UGC license: what rights the company takes over user content (required
  for any product that hosts user content)
- Payment and refund terms
- Disclaimer of warranties
- Limitation of liability
- Indemnification
- Termination (by user and by company)
- Governing law
- Dispute resolution (arbitration clause, class action waiver where
  enforceable)
- Changes to terms

### Cookie policy

- Categories: essential, functional, analytics, marketing/advertising
- Per-category cookie table or list (name, purpose, duration, provider)
- Consent mechanism stated explicitly: GDPR requires opt-in before
  non-essential cookies fire; most US states accept opt-out. Choose based
  on intake geography
- How to withdraw or change consent

### Shorter-form documents

- **Refund policy**: eligibility window, what is refundable vs not, request
  process, processing time, exceptions for digital goods and subscriptions
- **Acceptable use policy**: prohibited content, prohibited conduct,
  abuse/scraping/spam rules, enforcement and consequences
- **Disclaimer**: no-professional-advice scope, affiliate disclosure if
  applicable, external links, accuracy caveats

## Jurisdiction matrix

| Region | Regime | What it demands in the document |
|---|---|---|
| EU/UK | GDPR / UK GDPR | Named legal basis per purpose, full user rights list, DPO or EU representative contact where required, international transfer mechanism |
| US state laws | CCPA/CPRA and similar | Rights list (know, delete, correct, opt out), "sale"/"share" disclosure, Do Not Sell or Share link where applicable |
| California minors | CCPA minors / COPPA | Parental consent under 13, opt-in sale consent under 16 |
| Canada | PIPEDA | Consent-based framing, access and correction rights, breach contact |
| Brazil | LGPD | GDPR-like rights, legal bases, DPO contact |
| Other | Flag only | Note the jurisdiction to the user; do not fake compliance detail |

## Platform and processor requirements

- Apple App Store and Google Play require a working privacy policy URL,
  reachable without login
- Stripe and most payment processors require published refund terms and
  terms of service
- GDPR requires opt-in consent before analytics or marketing cookies fire;
  a banner that fires Google Analytics anyway is noncompliant
- Ad networks (AdSense, Meta) require disclosure of ad tracking in the
  privacy policy

## Quality standards

- Layered structure: short plain-language summary per section, then the
  full legal text
- Defined terms capitalized and used consistently ("Service", "Personal
  Data", "Content")
- Every bracketed placeholder customized or clearly marked; never ship a
  half-filled template silently
- Document header carries title, effective date, version, and last-updated
  date
- Contact section must contain a real reachable address or an explicit
  placeholder; never invent an email that looks real
- Never copy a competitor's policy verbatim; standard clauses are fine,
  their specific terms and company details are not

## Anti-patterns (never do)

- Do not ship a generic template unedited; if intake produced nothing, ask
  again rather than guess
- Do not write promises that contradict the real stack ("we never share
  your data" while using Google Analytics and ads)
- Do not omit the effective date or version
- Do not set governing law somewhere unrelated to the business's actual
  location without flagging it
- Do not write liability caps or arbitration clauses that are unenforceable
  in the user's key jurisdictions without noting the risk
- Do not omit the UGC license when the product hosts user content
- Do not list cookies or third parties the product does not actually use
- Do not pad the legal-review disclaimer into a lecture; one clean
  statement is enough

## Output format

- Markdown document with consistent heading structure (`##` for major
  sections)
- Header block: title, effective date, version, last updated
- Unknowns marked as `[COMPANY NAME]`, `[CONTACT EMAIL]` style placeholders
- One-line notice at the top or bottom: starting draft, legal review
  recommended for regulated industries or broad jurisdictional exposure

## Related skills

- `app-store-compliance`: app stores require a privacy policy URL and
  reject listings without one; run that skill before submission
- `seo`: legal pages sometimes need noindex or canonical decisions; check
  when publishing to a site

## Pre-flight checklist

- [ ] Intake completed (or placeholders used for every unanswered item)
- [ ] Document sections match the required list for its type
- [ ] Every clause reflects stated practices, no contradictions
- [ ] Jurisdiction-specific requirements applied per the matrix
- [ ] Effective date, version, and contact section present
- [ ] Defined terms capitalized and consistent throughout
- [ ] No invented company details; all unknowns are `[PLACEHOLDER]`s
- [ ] The one-line legal-review notice is included, no lecture
- [ ] UGC license included if the product hosts user content
- [ ] Cookie and consent claims match the actual consent mechanism
