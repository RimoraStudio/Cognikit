---
name: apple-app-store-compliance
description: >
  Audits iOS, iPadOS, and other Apple-platform apps for App Review and
  App Store Connect compliance, investigates rejections, and prepares
  factual reviewer replies. Use when a user asks about Apple app review,
  App Store rejection, App Review Guidelines, App Store screenshots,
  App Store Connect metadata, TestFlight review, Apple privacy manifests,
  business distribution, or submitting an Apple-platform app.
metadata:
  version: 1.0.0
license: MIT
---

# Apple App Store Compliance

> Part of [Cognikit](https://cognikit.com). A kit that gives AI agents cognitive abilities.

Use this skill for Apple App Store review, metadata, distribution, and
submission readiness. It is a practical audit framework, not a copy of
every Apple rule and not a guarantee of approval. Apple policies change;
verify the live guideline and linked program terms for every review.

## Workflow

1. **Classify the request**: Pre-submission audit, specific rejection,
   distribution decision, or metadata/review reply.
2. **Inventory the app** from the repository and user facts. Record
   platforms, features, audience, account access, monetization, UGC, AI,
   sensitive data, SDKs, permissions, and target markets.
3. **Read the current primary sources** linked below. Match every cited
   guideline number exactly. Do not rely on cached summaries when a
   policy question is disputed or high impact.
4. **Map scope**: Review the relevant policy domains and all applicable
   platform, entitlement, privacy, and business-program terms.
5. **Resolve each gap** as one of: code change, product change, metadata
   change, App Store Connect action, legal/compliance action, or factual
   reviewer explanation.
6. **Verify** affected build, device, locale, screenshot size, account
   path, and review credentials. Report unresolved facts explicitly.

## Primary Apple sources

- [App Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [App Store Connect Help](https://developer.apple.com/help/app-store-connect/)
- [Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
- [Apple Developer Program agreements](https://developer.apple.com/support/terms/)
- [App Store privacy details](https://developer.apple.com/app-store/app-privacy-details/)
- [Privacy manifests and required-reason APIs](https://developer.apple.com/documentation/bundleresources/privacy_manifest_files)
- [App Store Connect distribution methods](https://developer.apple.com/help/app-store-connect/manage-your-apps-availability/set-distribution-methods/)
- [App Store Connect upcoming requirements](https://developer.apple.com/news/upcoming-requirements/)

Open the current App Review Guidelines and assess all five sections,
not only the rejection's headline category:

1. Safety
2. Performance
3. Business
4. Design
5. Legal

For an app-specific review, check guideline subsections that match the
features and business model. Common areas include objectionable content
and UGC, children and age ratings, security and data handling, accurate
metadata, minimum functionality, business distribution, in-app purchase
and external purchase rules, subscriptions, sign-in, account deletion,
privacy disclosures, permissions, intellectual property, and regulated
or sensitive categories. This list is a triage index, not a complete
statement of policy.

## App inventory

Read the project before making claims. Inspect relevant source, build
settings, SDK documentation, privacy declarations, and runtime flows.

| Area | Inspect |
|---|---|
| Platform/build | iOS/iPadOS/watchOS/tvOS/visionOS support, deployment target, entitlements, extensions |
| Access | Open signup, invitation, organization provisioning, demo mode, account deletion |
| Data | Collected/linked/tracked data, purpose, retention, processors, SDK behavior |
| Permissions | Info.plist usage descriptions, requested timing, least-privilege alternatives |
| Payments | Digital goods, subscriptions, physical goods/services, external links, reader access |
| User content | Creation, sharing, moderation, reporting, blocking, contact and takedown flows |
| Safety | Age audience, parental controls, medical/financial claims, regulated activity |
| Platform | Sign in with Apple applicability, APIs, background modes, notifications, widgets |
| Store assets | Name, subtitle, description, privacy labels, age rating, screenshots, previews |
| Reviewer access | Credentials, backend availability, hardware, sample data, review notes |

Do not infer compliance from a package name alone. Trace data and
permissions into the actual flows and SDK configuration.

## Rejection triage

For each issue, preserve the submission/build identifier, review date,
device/OS, guideline citation, quoted issue, requested next step, and
screenshots or attachments. Make a separate row per guideline:

| Citation | Reviewer claim | Verified app facts | Required action | Owner | Evidence to verify |
|---|---|---|---|---|---|
| Guideline/subsection | Exact issue | Observed behavior | Code, product, metadata, console, or response | Developer/agent | Build, capture, policy text |

Do not merge separate issues into one response. If the reviewer asks
questions, answer each in order and distinguish verified facts from
unknowns. Ask the developer for missing business facts rather than
inventing them.

### 2.3.10: third-party platform references in screenshots

When the rejection cites 2.3.10, follow the exact notice and inspect all
screenshot slots, localizations, and device sizes. Replace images with
accurate captures of the submitted Apple-platform app. Remove non-iOS
status bars, navigation controls, and other foreign system chrome. Do
not merely paint over it or create a composite that misrepresents the UI.
Show real shipped features on supported devices. In App Store Connect,
inspect **View All Sizes in Media Manager**, including iPad assets. If a
third-party service is genuinely central, explain how it works in the
app, but still correct any screenshot defect.

### 3.2: business distribution and audience

Determine the real eligible audience and account provisioning, not just
whether anyone can download the binary. Ask:

1. Is access restricted to a single organization, its workforce, or
   partners?
2. Is the product built for a defined set of organizations? Can any
   organization become a customer without invitation or pre-approval?
3. Can unaffiliated members of the public register and use meaningful
   core functionality?
4. Who creates accounts: self-service signup, invitation, administrator,
   or approval?
5. Who pays, and what paid access or content exists?

Evaluate the current Apple distribution options against the answers,
including public App Store, unlisted app, custom app via Apple Business
Manager/Apple School Manager, and the Apple Developer Enterprise Program
for qualifying internal employee use. These routes are not interchangeable.
Unlisted distribution is not a workaround for a product restricted to a
single business. Confirm current eligibility and terms using Apple
sources. State clearly when developer account action or a business
change is required.

### Screenshot and metadata audit

- Capture the submitted build on supported Apple devices or simulators.
- Check every device family, screenshot size, language, and storefront.
- Keep system status bars, safe areas, and UI consistent with the Apple
  platform shown. Never submit Android system chrome as iOS UI.
- Show the app's actual features. Do not add fictional UI, data, or
  capabilities to promotional compositions.
- Ensure screenshots, app previews, description, privacy labels, and
  age rating agree with the product and each other.
- Record asset device, locale, build, and capture date to prevent stale
  screenshots from returning.

## Submission readiness areas

Use the official guidelines and console requirements as the source of
truth. This checklist directs the audit; applicability varies by app.
For a broad policy sweep, use `references/policy-map.md`, then verify
each relevant subsection in the live guideline.

- **Safety and content**: UGC safeguards; reporting/moderation where
  required; child safety; age-appropriate content; accurate age rating;
  no harmful or illegal functionality.
- **Privacy and security**: Privacy policy; App Store privacy answers;
  data minimization; permission purpose strings and timing; account
  deletion where required; privacy manifests and required-reason API
  declarations; third-party SDK privacy signatures/manifests as required.
- **Performance and integrity**: Stable build, live backend, complete
  functionality, accurate metadata and screenshots, supported APIs,
  no private APIs or review circumvention.
- **Business and payments**: Correct distribution for the audience;
  compliant in-app purchase and subscription setup; accurate pricing,
  renewal, trial, and restore behavior; external purchase rules checked
  for target storefront and any applicable entitlement/program.
- **Design and platform**: Native platform behavior where appropriate;
  Sign in with Apple assessment when third-party login is used; complete
  navigation, accessibility, and account flows.
- **Legal and rights**: IP permissions, required licenses, regulated
  service eligibility, export compliance, and legal disclosures.
- **Review operations**: Working demo credentials, detailed steps,
  sample data/hardware if needed, reachable support contact, and review
  notes describing non-obvious features and purchases.

Do not turn a checklist item into a universal rule without checking its
scope and exceptions in current Apple policy.

## Distribution decision notes

- **Public App Store**: Select when the app is genuinely intended for a
  broad audience and its access model supports that audience.
- **Unlisted app**: A discovery method for eligible use cases, not a
  private-access control. Anyone with the link may be able to find it;
  verify the current process and suitability.
- **Custom app**: Private delivery to specified organizations through
  Apple Business Manager or Apple School Manager.
- **Enterprise program**: Internal proprietary apps for an organization's
  own employees, subject to program eligibility and terms. Do not present
  this as a customer distribution channel.
- **TestFlight / Ad Hoc**: Testing or limited deployment methods, not
  substitutes for a compliant production distribution model.

Confirm route and availability with the developer. Do not change store
distribution settings or submit a build without explicit instruction.

## Drafting the reviewer response

1. Acknowledge each cited issue and number the answer to match Apple's
   questions.
2. State what changed, where, and in which build or metadata asset.
3. Give reproducible steps for disputed or misunderstood functionality.
4. For business questions, answer audience, organizations served,
   unaffiliated access, account creation, and payer with verifiable facts.
5. Do not assert changes that have not shipped or facts the developer
   has not confirmed.
6. Ask one focused clarification question if policy application or
   distribution eligibility remains unclear.

Keep the response factual, concise, and respectful. Never hardcode
reviewer-specific behavior or conceal functionality.

## Preflight

- [ ] Current Apple guideline text and relevant linked terms checked
- [ ] App inventory grounded in source and runtime behavior
- [ ] Every rejection citation addressed independently
- [ ] Audience, signup, organizations, features, and payer verified for 3.2
- [ ] All screenshot sizes/locales inspected, including Media Manager
- [ ] Metadata, privacy answers, and shipped behavior agree
- [ ] Reviewer has working access and clear review notes
- [ ] Console-only or account-owner actions listed separately
- [ ] Remaining unknowns and policy-dependent judgments called out

## Related skills

- `google-play-compliance`: Android and Google Play policy
- `mobile-app-design`: platform-specific app UX
- `legal-docs`: privacy policies and terms
