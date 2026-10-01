---
name: google-play-compliance
description: >
  Audits Android apps for Google Play Developer Program Policy and Play
  Console compliance, investigates enforcement actions, and prepares
  factual policy appeals or review responses. Use when a user asks about
  Google Play rejection, Play policy, Data safety, Android permissions,
  target API requirements, Play Console declarations, store listing,
  app access, or publishing an Android app.
metadata:
  version: 1.0.0
license: MIT
---

# Google Play Compliance

> Part of [Cognikit](https://cognikit.com). A kit that gives AI agents cognitive abilities.

Use this skill for Google Play review, policy, listing, and Play Console
readiness. It is a practical audit framework, not a copy of every Google
policy and not a guarantee of approval. Policies, forms, and deadlines
change; check the current official policy and app-specific console
messages before advising or submitting.

## Workflow

1. **Classify the request**: Pre-submission audit, policy rejection,
   enforcement/appeal, Data safety, permissions, or release setup.
2. **Inventory the app** from source and developer facts: audience,
   features, data, SDKs, permissions, payments, ads, UGC, AI, category,
   target markets, and account access.
3. **Check current primary sources** linked below. Read the cited policy
   and relevant linked help articles, not just a summary.
4. **Map applicable policies** across content, privacy, security,
   monetization, store listing, functionality, families, and technical
   requirements.
5. **Resolve each gap** as code, product, metadata, Play Console,
   developer-account, legal, or response work.
6. **Verify** the release artifact, declarations, review access, testing
   tracks, and all affected locales/countries. List unresolved facts.

## Primary Google sources

- [Google Play Developer Program Policies](https://support.google.com/googleplay/android-developer/answer/9876937)
- [Policy Center](https://support.google.com/googleplay/android-developer/topic/9858052)
- [Policy deadlines](https://support.google.com/googleplay/android-developer/table/12921780)
- [Play Console Help](https://support.google.com/googleplay/android-developer/)
- [Data safety section](https://support.google.com/googleplay/android-developer/answer/10787469)
- [App access requirements](https://support.google.com/googleplay/android-developer/answer/113469)
- [Target API level requirements](https://developer.android.com/google/play/requirements/target-sdk)
- [Android permissions overview](https://developer.android.com/guide/topics/permissions/overview)
- [Play Billing](https://developer.android.com/google/play/billing)

Use the Policy Center's current category list as the master taxonomy.
For a broad sweep, use `references/policy-map.md`, then open the live
policy article for every relevant domain. Typical domains include
restricted content, child safety and Families,
privacy and user data, deceptive behavior and device abuse, malware,
monetization and ads, store listing and promotion, spam/minimum
functionality, user-generated content, permissions and sensitive APIs,
subscriptions, and other program-specific rules. This list is an
orientation aid, not a complete statement of policy.

## App inventory

Read the project before making claims. Inspect merged manifests, source,
Gradle configuration, SDK documentation, runtime behavior, and Play
Console declarations.

| Area | Inspect |
|---|---|
| Artifact | AAB/APK, package name, target/compile SDK, signing, app bundles, native code |
| Permissions | Merged AndroidManifest.xml, runtime prompts, special access, foreground services |
| Data | Collected, shared, processed, retained, deleted data and SDK behavior |
| Access | Signup, account deletion, organization provisioning, reviewer credentials |
| Payments | Digital goods/services, subscriptions, external payment links, physical goods |
| Ads | Ad SDKs, ad content/rating, personalized advertising, declarations |
| User content | Creation, sharing, reporting, blocking, moderation, child-safety contact |
| Audience | Age groups, Families eligibility, sensitive or regulated categories |
| Store listing | App title, short/full description, screenshots, feature graphic, privacy policy |
| Release | Testing tracks, staged rollout, country availability, policy declarations |

Do not infer SDK data behavior from its name. Inspect the SDK's current
Google Play data and policy disclosures and the app's configuration.

## Policy audit matrix

For each applicable policy, record the exact current policy URL/section,
app behavior, evidence, required change, and Play Console declaration.
Policy scope often depends on the content, target audience, region, and
implementation details.

### Safety, restricted content, and user-generated content

Review all content created, displayed, linked, recommended, or served
through ads. Include moderation capabilities, reporting and blocking,
terms/community standards, enforcement response, and age controls where
required. Apply child safety requirements to applicable social, dating,
chat, and user-content products. Route child-safety cases to qualified
legal/safety reviewers; do not improvise legal reporting obligations.

### Privacy and user data

- Provide a public, active privacy policy that matches the app and SDKs.
- Complete the Data safety form based on actual collection and sharing,
  including third-party SDK behavior and data transmitted off-device.
- Identify purposes, optionality, encryption, deletion, and retention
  accurately in applicable disclosures.
- Request access only for a user-facing feature that needs it. Prefer
  privacy-preserving APIs and system pickers when they meet the use case.
- Follow account deletion and data deletion requirements applicable to
  the app; provide a working web deletion resource when required.
- Ensure disclosures are available in the app and store listing where
  policy requires them.

### Permissions, APIs, and foreground services

- Inspect the **merged** manifest, not just the source manifest.
- Justify each sensitive permission and special access against core
  functionality; remove unused permissions and SDK-added access.
- For high-risk permissions or APIs, review the current declaration,
  eligibility, prominent disclosure, and review evidence requirements.
- Use the Android Photo Picker or a narrower system API where feasible
  instead of broad media/file access.
- Declare and implement foreground-service types and use cases according
  to current Android and Play requirements. Do not assume a manifest
  declaration alone grants approval.
- Check background location, SMS/call log, accessibility, VPN, exact
  alarms, package visibility, all-files access, health, and other
  restricted APIs whenever present.

### Monetization, billing, and ads

- Check the current Play Billing policy for digital goods/services,
  subscriptions, alternative billing programs, external offers, and
  eligible regions. Do not apply one region's exception globally.
- Make subscription price, billing period, trial conversion, renewal,
  cancellation, and entitlement behavior clear before purchase.
- Declare ads accurately. Check ad content, child-directed treatment,
  personalized advertising, and SDK compliance.
- Disclose paid features and avoid deceptive purchase flows, hidden
  charges, misleading trials, or ad behavior that disrupts device use.

### Store listing, functionality, and integrity

- Make title, descriptions, icon, screenshots, videos, and feature
  graphics accurate, localized, and representative of the current app.
- Do not use misleading ranking claims, impersonation, keyword stuffing,
  incentivized ratings, or deceptive promotion.
- Verify the app provides functional value and is not repetitive,
  broken, abandoned, or an unauthorized web wrapper.
- Review malware, device/network abuse, SDK supply chain, and unsafe
  external content risks.

### Audience, ratings, and regulated categories

Check the target audience and content rating questionnaires against actual
content and behavior. If the app targets children or mixed audiences,
review Families requirements, SDK/ad restrictions, disclosures, and
parental controls. Check current program-specific rules for health,
financial services, lending, gambling, news, dating, and other regulated
or sensitive categories. Confirm regional legal and distribution
requirements with qualified counsel where needed.

## Release and console audit

- **Target API**: Verify the current required target level and exceptions
  for new apps and updates. Never hardcode a year-specific level in
  advice without checking the live requirement.
- **App signing**: Confirm Play App Signing enrollment, upload-key
  custody, access control, and recovery process.
- **Testing and access**: Provide valid review credentials and stable
  backend access; disclose gated paths, region requirements, or hardware.
- **Declarations**: Reconcile Data safety, ads, target audience, content
  rating, permissions, financial/health forms, foreground services, and
  other declarations with the artifact.
- **Release**: Check countries, device compatibility, staged rollout,
  pre-launch reports, and app integrity settings.
- **Account**: Confirm developer verification and account standing
  requirements in the current Play Console.

## Handling a rejection or enforcement action

1. Preserve the app/package version, release track, date, country,
   policy citation, full notice, affected functionality, and available
   evidence.
2. Read the exact Policy Center article and the specific Play Console
   enforcement message. Distinguish review rejection, warning, removal,
   suspension, and account-level action.
3. Map each citation separately to verified app behavior and the smallest
   complete remedy. Do not treat a listing edit as a fix for a binary or
   account-level issue.
4. Correct the app, store listing, declaration, or process as applicable.
   Remove policy-violating content and prevent recurrence where required.
5. Appeal only when there is a factual or policy basis. State the relevant
   evidence and changes without speculating or making claims that cannot
   be verified.
6. Respect appeal deadlines and follow the route shown in Play Console.
   For account termination or legal questions, seek qualified counsel.

Never conceal functionality from reviewers, geofence review behavior,
submit misleading evidence, or create a reviewer-only build intended to
bypass policy.

## Preflight

- [ ] Current policy text and applicable deadlines checked
- [ ] Artifact and merged manifest inspected
- [ ] Data safety and privacy disclosures match app and SDK behavior
- [ ] Sensitive permissions, special access, and foreground services justified
- [ ] Target API level and signing requirements verified for this release
- [ ] Store listing and content ratings match the actual app
- [ ] Audience, Families, UGC, and sensitive-category rules assessed
- [ ] Billing, subscriptions, ads, and regional programs checked
- [ ] Reviewer access and backend availability verified
- [ ] Every enforcement citation addressed independently
- [ ] Console-only, account-owner, and legal actions listed separately
- [ ] Unresolved facts and policy-dependent judgments called out

## Related skills

- `apple-app-store-compliance`: Apple review and distribution
- `mobile-app-design`: Android platform UX
- `legal-docs`: privacy policies and terms
