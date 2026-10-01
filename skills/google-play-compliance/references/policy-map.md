# Google Play Developer Policy Map

This is a navigation checklist, not a reproduction of Google's policies.
For every audit, open the live [Developer Program Policies](https://support.google.com/googleplay/android-developer/answer/9876937),
Policy Center articles, linked Play Console Help, and the app-specific
notice. Check dates, regions, eligibility, and exceptions. The live
Policy Center is authoritative; this map is not exhaustive.

## Policy-domain map

Use current Policy Center categories and exact policy text. Assess the
app, listing, ads, SDKs, developer account, linked content, and behavior.

### Restricted content and user safety

Review prohibited/restricted content, child safety, sexual content,
hate/harassment, violence, dangerous activities, illegal goods/services,
and region-specific restrictions. For UGC and social features, review
moderation, reporting, blocking, terms, child-safety standards, escalation
and enforcement operations. Check age classification, target audience,
Families requirements, and parental controls where applicable.

### Privacy, user data, and security

Review privacy policy, Data safety, prominent in-app disclosures and
consent, data minimization, security, retention/deletion, account
deactivation/deletion, third-party SDK behavior, and data exposed to
other apps or services. Reconcile Play Console answers with runtime
traffic and SDK documentation. Inspect the complete merged manifest and
all data flows.

### Permissions and sensitive APIs

Review runtime and special permissions, sensitive information, health
and fitness APIs, background location, SMS/call logs, accessibility,
VPN, exact alarms, package visibility, broad storage, photo/video access,
foreground services, and other restricted APIs present in the app.
Check policy eligibility, core use, declarations, prominent disclosures,
review evidence, and platform API rules separately. Prefer system
pickers and least-privilege APIs when suitable.

### Monetization and ads

Review Play Billing requirements for digital products, subscriptions,
regional alternative billing/offer programs, external links, physical
goods, and services. Check purchase disclosures, renewal/cancellation,
refund representation, ad declarations, ad behavior, child-directed
advertising, and deceptive monetization. Verify regional scope and
program enrollment in current sources.

### Store listing and promotion

Review name, icon, descriptions, screenshots, video, feature graphic,
localizations, developer identity, metadata claims, and promotional
practices. Check accuracy, intellectual property, impersonation,
misleading claims, ratings/reviews manipulation, and country-specific
availability. Ensure listing and app behavior agree.

### Functionality, spam, malware, and device abuse

Review minimum functionality, repetitive or low-quality content, broken
flows, unauthorized app installation or update behavior, malware,
network/device abuse, SDK supply chain, deceptive behavior, and app
integrity. Confirm that the app remains usable and does not mislead or
harm users or the platform.

### Programs and regulated categories

Check current requirements for Families, health, financial services,
loans, gambling, news, government, dating/social, VPN, accessibility,
crypto, and other program categories implicated by the app. Validate
regional legal requirements and program eligibility with qualified
counsel when needed.

## Technical and console cross-checks

- **Artifact and SDKs**: Inspect the release AAB/APK, dependency tree,
  SDK versions, native code, signing, and Play SDK requirements.
- **Target API**: Check the current target API deadline and applicable
  rules for new apps, updates, and exceptions. Avoid year-specific
  assumptions without checking the live page.
- **Manifest**: Inspect the merged manifest and permission additions
  from libraries; test runtime permission and denial flows.
- **Data safety**: Trace data from collection to storage, transmission,
  sharing, retention, and deletion. Include SDKs and optional flows.
- **Declarations**: Match ads, target audience, content rating,
  permissions, foreground services, financial/health forms, and other
  declarations to the exact release.
- **Testing and review access**: Provide working test credentials,
  reachable backend, region/hardware instructions, and reproducible steps.
- **Release management**: Check countries, device compatibility,
  testing-track status, staged rollout, integrity checks, and account
  verification/standing.

## Enforcement and appeal record

For every notice, record:

| Field | Record |
|---|---|
| Notice | Exact text, policy URL/section, date, deadline |
| Scope | Package/version, track, countries, affected content or feature |
| Type | Rejection, warning, removal, suspension, account restriction, or other action |
| Evidence | Artifact, runtime behavior, declaration, listing, SDK evidence |
| Remedy | Smallest complete change, owner, verification build |
| Appeal | Factual basis, evidence, changes already made, submission date |

Distinguish app-level issues from account-level enforcement. Do not
appeal based only on disagreement. Use the route and deadline shown in
Play Console, and seek legal assistance for account termination or
complex regulatory issues.
