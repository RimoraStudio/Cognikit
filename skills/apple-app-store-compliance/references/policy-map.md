# Apple App Review Policy Map

This is a navigation checklist, not a reproduction of Apple's guidelines.
For every audit, open the [live App Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
and inspect the full text, current exceptions, linked program terms, and
relevant App Store Connect messages. Guideline numbering and wording can
change. Never claim exhaustive coverage from this map alone.

## Five-section review map

Use the applicable numbered subsections in the live guideline. Check
related sections too; a feature may trigger more than one policy.

### 1. Safety

Review objectionable content, user-generated content, child safety,
physical harm, regulated or dangerous functionality, and content that
requires restrictions or moderation. For UGC, inspect creation, display,
sharing, reporting, blocking, moderation, and response operations. Verify
age suitability and applicable parental protections. Follow relevant
regional laws and Apple program requirements.

### 2. Performance

Review app completeness, stability, beta/demo behavior, accurate
metadata, minimum functionality, software requirements, hardware
compatibility, background behavior, and use of public APIs. Check that
the shipped binary and listing match. For 2.3, verify all listing text
and assets; for 2.3.10 specifically inspect third-party platform
references and non-Apple system chrome in screenshots.

### 3. Business

Review business-model eligibility and distribution, in-app purchase,
subscriptions, purchase restoration, pricing disclosure, external
purchase links/offers, donations, advertising, and any applicable
entitlement or regional program. For 3.2, establish actual audience,
organization relationships, account access, payer, and suitable public,
unlisted, custom, or internal distribution. Do not presume these routes
are interchangeable.

### 4. Design

Review minimum design quality, copycat behavior, sign-in, Apple services,
Apple Pay/Wallet use where relevant, extensions, notifications, and
platform interaction patterns. For social login, check the exact scope
and exceptions in the current sign-in rule. Cross-check the Human
Interface Guidelines for usability, accessibility, and platform
expectations; HIG guidance is not a replacement for review policy.

### 5. Legal

Review privacy policy and data handling, consent, collection/use/sharing,
account deletion, permissions and purpose strings, security, intellectual
property, licensing, regulated services, export compliance, and required
legal disclosures. Verify the App Store privacy label against runtime
behavior and every SDK. Check privacy manifests and required-reason APIs
against current Apple documentation.

## Feature-triggered cross-checks

For each feature, search the live guideline and linked pages for every
relevant obligation:

- Accounts, authentication, social login, account deletion
- User-generated content, social networking, messaging, dating, or
  creator content
- Children, education, parental controls, or mixed-age audiences
- Health, medical, fitness, financial, lending, gambling, crypto, or
  other regulated functionality
- Digital goods, subscriptions, trials, reader access, external offers,
  physical goods, services, donations, or advertising
- Location, camera, microphone, photos, Bluetooth, contacts, tracking,
  notifications, background tasks, or other protected APIs
- AI-generated content, chatbot functionality, moderation, and claims
- Third-party SDKs, analytics, attribution, ads, payment, or login
- User data exported, linked across apps/sites, or shared with partners
- Alternative distribution, notarization, entitlements, and regional
  programs
- Intellectual property, trademarks, third-party content, and licenses

This list is intentionally a prompt for research, not a declaration that
all listed features share one rule.

## Audit record

For every conclusion, record:

| Field | Record |
|---|---|
| Source | Official URL and exact section/subsection |
| Checked | Date of policy verification |
| Scope | Platform, storefront, app feature, audience, and account model |
| Evidence | Code path, runtime behavior, SDK documentation, or console setting |
| Result | Pass, gap, not applicable, or unknown |
| Action | Code/product/metadata/console/legal change and responsible owner |

Classify unresolved policy interpretation as **unknown**, not pass. For
legal interpretation or high-impact eligibility questions, direct the
developer to Apple or qualified counsel.
