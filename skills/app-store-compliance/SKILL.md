---
name: app-store-compliance
description: >
  Routes app-store review and publishing work to the Apple App Store or
  Google Play compliance skill. Use when a user asks about mobile app
  store compliance without naming a platform, needs both stores audited,
  or asks which store-specific compliance workflow applies.
metadata:
  version: 2.0.0
license: MIT
---

# App Store Compliance Router

> Part of [Cognikit](https://cognikit.com). A kit that gives AI agents cognitive abilities.

This skill routes store-policy tasks to platform-specific guidance. It
is not a full policy reference. Policies are living documents, so the
specialist skills require checking current official sources.

## Route

- Apple App Store, iOS/iPadOS, App Review, App Store Connect, TestFlight,
  Apple screenshots, or Apple distribution: use
  `apple-app-store-compliance`.
- Google Play, Android publishing, Play Console, Data safety, Android
  permissions, or Google Play rejection: use `google-play-compliance`.
- Both platforms: run each specialist independently. Reconcile shared
  disclosures only after platform-specific requirements are assessed.
- Unclear platform: ask which stores and platforms are in scope.

Do not copy one platform's policy answer to the other. Billing,
permissions, privacy declarations, distribution, and review processes
have platform-specific rules and exceptions.

## Shared intake

For either specialist, collect or inspect the app's features, audience,
account provisioning, regions, monetization, data practices, third-party
SDKs, user-generated content, sensitive categories, and reviewer notice.
For a rejection, preserve every guideline/policy citation, exact notice,
app version, review environment, requested action, and reviewer question.

## Related skills

- `apple-app-store-compliance`: Apple policy and review workflow
- `google-play-compliance`: Google Play policy and review workflow
- `mobile-app-design`: platform-specific mobile UX
- `legal-docs`: privacy policy and terms
