# Skill freshness and maintenance

Skills are versioned instructions, not self-updating documentation. A release must distinguish durable principles from claims that can change: API shapes, SDK/package versions, model availability, prices, platform policy, and legal requirements.

## When writing or using a skill

- Keep durable decision criteria in `SKILL.md`; label version-specific code examples with the versions they were tested against.
- Before giving implementation guidance, inspect the project's lockfiles/configuration and consult the relevant vendor's current primary docs, release notes, or policy page.
- Do not call a model, API, policy threshold, or package version “latest” unless it was checked for the task. If primary sources are unavailable, say so and do not invent replacement syntax.
- Prefer stable interfaces and provider-neutral selection criteria where possible. Keep dated examples in references, not as timeless defaults.
- Update `skill-freshness.json` only after reviewing the skill's volatile claims and sources. A process edit is not a content review.

## Review cadence

Use `skill-freshness.json` as the maintenance ledger. High-change skills are reviewed every 90 days, medium-change every 180 days, and low-change every 365 days. A missing `reviewed_on` means the skill has not had a recorded content review; do not fill it with the date of a mechanical edit.

Run `npm run freshness` to report pending and overdue reviews. The check is also scheduled in GitHub Actions. It reports review debt; it does not automatically rewrite guidance from search results.

## Review checklist

1. Identify volatile claims, commands, examples, and named products in the skill and its references.
2. Check those claims against primary documentation for the current supported versions and policy dates.
3. Update examples and source links; remove obsolete defaults rather than adding a new unverified “latest” version.
4. Add or revise eval cases that catch the changed behavior, then run `npm run validate` and `npm run freshness`.
5. Record the review date and a short scope note in `skill-freshness.json`; increment the skill version when its guidance changes.

Installed copies remain snapshots. Tell users to run `npx skills update` (or `npx skills update -g -y` for global installs) after a new package release.
