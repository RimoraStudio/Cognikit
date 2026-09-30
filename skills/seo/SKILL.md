---
name: seo
description: >
  Audits and implements technical and on-page SEO to a professional
  standard: titles, meta descriptions, canonicals, robots.txt, sitemaps,
  structured data, social tags, Core Web Vitals, and content quality
  signals. Use when the user asks for an "SEO audit", to "improve SEO",
  "meta tags", "rank higher", "SEO requirements", "structured data",
  "sitemap", "SEO checklist", "optimize for search", "why am I not
  ranking", "add schema markup", or "Core Web Vitals SEO". Produces a
  severity-ranked audit report or concrete code and config changes.
metadata:
  version: 1.0.0
license: MIT
---

# SEO

> Part of [Cognikit](https://cognikit.com). A kit that gives AI agents cognitive abilities.

Work like an SEO consultant: establish the current state first, then fix
what is actually broken. The output is either a severity-ranked audit
report or concrete changes to markup, config, and content. Never rewrite
meta tags blindly, and never chase vanity optimizations that do not
affect crawling, indexing, or ranking.

## AI execution flow (follow in order)

1. **Audit first**: Inspect the current state before changing anything.
   View source or fetch the HTML of key pages and check titles, meta
   descriptions, canonicals, robots meta tags, heading structure, and
   existing schema. Request `robots.txt` and `sitemap.xml` directly. If
   the user has Search Console or analytics access, ask for coverage and
   query data. Note what already exists so fixes preserve what works.
2. **Classify**: Determine if the user wants an audit (report only),
   implementation (make the changes), or both. Default to both when the
   request is ambiguous, but present the audit findings before editing.
3. **Technical pass**: Work through the technical checklist below:
   indexation, robots.txt, sitemap, canonicals, redirects, URL
   consistency, HTTPS.
4. **On-page pass**: Check titles, meta descriptions, headings,
   keywords, alt text, internal links, and URL slugs per page.
5. **Enhancement pass**: Structured data, Open Graph and Twitter tags,
   favicon set.
6. **Performance pass**: Measure or estimate Core Web Vitals and flag
   violations with concrete fixes.
7. **Output**: Produce the audit report format below, or apply the
   changes with a one-line summary per file touched.
8. **Verify**: Run the pre-flight checklist at the bottom.

## Technical SEO checklist

### Titles and meta descriptions

- `<title>`: 50 to 60 characters, unique per page, primary keyword near
  the front. Format like `Primary Keyword - Brand` or a natural phrase.
- Meta description: 120 to 160 characters, written to earn the click,
  not to stuff keywords. Google rewrites weak descriptions anyway.
- Every indexable page needs both. Duplicate or missing titles and
  descriptions across pages are a high-severity finding.

### Canonicals and indexation

- Every page should have a self-referencing `<link rel="canonical">`
  unless it intentionally points at another URL (pagination, syndicated
  content, parameter variants).
- Use `noindex` (meta robots or `X-Robots-Tag` header) deliberately:
  thank-you pages, internal search results, staging, filtered views.
  Verify noindex is absent from pages that should rank.
- Never combine `noindex` with a canonical pointing elsewhere. The
  signals conflict.

### robots.txt

- Located at `/robots.txt`. It controls crawling, not indexing. A
  blocked page can still appear in results as a bare URL.
- Common mistakes to flag: `Disallow: /` on production, blocking CSS or
  JS bundles (breaks rendering and mobile-first indexing), blocking the
  pages you are trying to rank, listing `noindex` directives (Google
  ignores them in robots.txt).
- Include a `Sitemap:` line pointing to the full sitemap URL.

### sitemap.xml

- Valid XML sitemap at `/sitemap.xml` (or an index referencing child
  sitemaps). Only include canonical, indexable, 200-status URLs. Never
  list redirects, 404s, or noindexed pages.
- `lastmod` must reflect real modification dates. Fake freshness is
  worse than omitting it.
- Submit the sitemap in Search Console after changes. Regenerate it
  automatically on deploy for dynamic sites.

### Redirects and URL consistency

- Use 301 for permanent moves, 302 only for genuinely temporary ones.
- Eliminate redirect chains (A to B to C). Point everything at the
  final URL in one hop.
- HTTPS everywhere. HTTP should 301 to the HTTPS canonical, and every
  internal link should use HTTPS.
- Pick one host (`www` or apex) and one trailing-slash convention, then
  redirect the alternates. Inconsistent slash handling creates
  duplicate URLs.
- `hreflang` only for genuinely multilingual or multi-regional sites.
  Every cluster needs reciprocal tags plus an `x-default` entry.

## On-page SEO

- Exactly one `<h1>` per page, matching the search intent of the title.
- Heading hierarchy descends without skips: h1, then h2, then h3. Do
  not jump h1 to h3 or use headings for styling.
- Keyword placement, naturally: title tag, h1, first 100 words, and
  the URL slug. If it reads stuffed, it is stuffed.
- Image `alt` text describes the image for someone who cannot see it.
  Decorative images get empty `alt=""`. Never comma-list keywords.
- Internal links use descriptive anchor text ("the pricing guide"),
  never "click here". Every important page needs inbound internal
  links; orphan pages do not rank.
- URLs: short, lowercase, hyphenated slugs (`/seo-checklist`). Avoid
  query parameters, dates, and IDs on content pages.

## Structured data (schema.org)

- Use JSON-LD in a `<script type="application/ld+json">` tag. Never
  microdata or RDFa for new work.
- Types worth implementing, in order of value: `Organization` (with
  logo and sameAs), `WebSite` with `SearchAction` if site search
  exists, `BreadcrumbList` matching the visible breadcrumbs, `Article`
  for posts, `Product` with `offers` for commerce, `LocalBusiness` for
  local sites, `FAQPage` only where a real FAQ is visible on the page.
- Only mark up content that is visible on the page. FAQ schema abuse
  (marking up non-FAQ content to win SERP space) gets structured data
  privileges revoked.
- Validate with the Rich Results Test or validator.schema.org after
  implementing.

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Technical SEO Checklist for 2026",
  "author": { "@type": "Person", "name": "Jane Doe" },
  "datePublished": "2026-09-01",
  "dateModified": "2026-09-15",
  "image": "https://example.com/og/seo-checklist.png",
  "publisher": {
    "@type": "Organization",
    "name": "Example Co",
    "logo": { "@type": "ImageObject", "url": "https://example.com/logo.png" }
  }
}
</script>
```

## Social and preview tags

- Open Graph on every shareable page: `og:title`, `og:description`,
  `og:image` (1200x630, absolute URL), `og:url` (canonical), `og:type`.
- Twitter: `twitter:card` = `summary_large_image` when you have a real
  image, plus `twitter:title`/`twitter:description` only if they differ
  from the og tags.
- Favicon set: ICO fallback plus PNG sizes, and `apple-touch-icon`.
  Missing favicons look broken in tabs, bookmarks, and SERPs.

## Core Web Vitals

Ranking thresholds: LCP under 2.5s, INP under 200ms, CLS under 0.1,
measured at the 75th percentile of real users.

| Metric | Quick fixes |
|---|---|
| LCP | Preload the hero image, set `fetchpriority="high"`, inline critical CSS, remove render-blocking scripts, compress and serve modern formats (AVIF/WebP) |
| INP | Break up long tasks, defer non-critical JS, reduce third-party scripts, avoid heavy event handlers on interaction paths |
| CLS | Always set `width`/`height` or `aspect-ratio` on images and embeds, reserve space for ads and dynamic content, use `font-display: swap` with size-matched fallbacks |

## Content quality and EEAT

- Helpful, specific content beats thin keyword-targeted pages. Pages
  that exist only to catch a query (doorway pages, generic templated
  pages) get demoted.
- Authorship signals matter: named authors, real bios, About and
  Contact pages, cited sources for factual claims.
- Freshness: update content when facts change, and keep `dateModified`
  honest. Cosmetic date bumps without real edits are a spam signal.
- Avoid AI-slop patterns: generic filler paragraphs, keyword pages
  mass-generated with no unique information, content that restates the
  query back without answering it.

## Mobile and crawling

- Google indexes the mobile version. Mobile content IS what ranks, so
  anything hidden or missing on mobile effectively does not exist.
- Required: `<meta name="viewport" content="width=device-width, initial-scale=1">`
  and a responsive layout. No separate mobile URL hacks.
- Content behind accordions on mobile is indexed but may be weighted
  less. Do not hide primary content behind interactions.

## Anti-patterns (never do)

- Keyword stuffing in titles, descriptions, body copy, or alt text
- Duplicate titles or meta descriptions across pages
- Hidden text, cloaking, or content shown only to crawlers
- Link schemes: bought links, spammy guest-post exchanges, footer link
  farms
- Auto-generated thin pages at scale with no unique value
- Missing alt text on meaningful images
- Broken internal links (404s in nav, footers, body copy)
- Orphan pages with no inbound internal links
- Inconsistent NAP (name, address, phone) across pages for local sites
- Marking up invisible content or abusing FAQ schema
- Changing URLs without 301 redirects from the old ones

## Output format

For audits, report issues ranked by severity:

```
## SEO Audit

### [HIGH] /pricing: Missing canonical, duplicate of /plans
What is wrong and why it suppresses ranking.
Fix: add <link rel="canonical" href="https://example.com/pricing">
and 301 /plans to /pricing (or differentiate the pages).

### [MEDIUM] /blog/*: No Article schema
Posts render without structured data, losing rich result eligibility.
Fix: add the JSON-LD Article block to the post template.
```

Group by severity, highest first. Cite the page or file for every
finding. For implementation tasks, state each change made per file and
list what still needs manual action (Search Console submission, CMS
settings, DNS).

## Related skills

- `marketing-sites`: landing page copy and structure that SEO changes must not break
- `code-review`: review the diff of SEO changes for regressions before shipping

## Pre-flight checklist

- [ ] Audited current state (source, robots.txt, sitemap) before changing anything
- [ ] Every page has a unique title (50-60 chars) and meta description (120-160 chars)
- [ ] Canonicals self-reference or intentionally consolidate; no noindex conflicts
- [ ] robots.txt allows crawling of CSS/JS and does not block target pages
- [ ] sitemap.xml contains only canonical, indexable, 200-status URLs
- [ ] Redirects are 301, single-hop, HTTPS, with consistent host and trailing slash
- [ ] One h1 per page, no skipped heading levels
- [ ] Structured data is JSON-LD and only marks up visible content
- [ ] og:image is 1200x630 with an absolute URL
- [ ] All internal links work and important pages are not orphaned
- [ ] Findings or changes are severity-ranked with file/page citations
