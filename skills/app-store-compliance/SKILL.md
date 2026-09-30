---
name: app-store-compliance
description: >
  Audits a mobile app against Apple App Store and Google Play review
  requirements, then walks through correct submission setup in App Store
  Connect and Play Console. This is store policy and review compliance,
  not UI design. Use when the user asks about "app store review",
  "app rejected", "App Store guidelines", "Google Play requirements",
  "submit app", "app store compliance", "privacy manifest",
  "data safety section", "app review requirements", "store listing",
  "App Store Connect", "Play Console", or "why was my app rejected".
metadata:
  version: 1.0.0
license: MIT
---

# App Store Compliance

> Part of [Cognikit](https://cognikit.com). A kit that gives AI agents cognitive abilities.

Check whether a mobile app will pass Apple and Google review before it
is submitted, then set up the store listings and technical declarations
correctly. Requirements differ by app category, so always inventory what
the app does before checking rules. Both stores reject for policy
reasons that have nothing to do with code quality.

## AI execution flow (follow in order)

1. **Inventory**: Build the app profile below (permissions, data
   collection, third-party SDKs, account system, payments, UGC, AI
   features, category). Never skip this. Which rules apply depends
   entirely on the answers.
2. **Classify**: Flag sensitive categories (kids, health, financial,
   dating, UGC, AI-generated content) that trigger extra rules.
3. **Apple check**: Walk the rejection causes table and the Apple
   technical setup items. Note every gap.
4. **Play check**: Walk Data safety, permissions, target API level,
   and declarations. Note every gap.
5. **Shared check**: Verify the cross-store requirements table
   (privacy policy URL, ratings, demo credentials, monetization
   disclosure).
6. **Fix or report**: Fix what is fixable in the repo (plist strings,
   manifests, metadata files). Report what needs human action (store
   console answers, legal documents) as an explicit list.
7. **Verify**: Run the pre-flight checklist at the bottom.

## Step 1: App inventory (do this first)

Answer each item by reading the codebase, not by asking the user what
the app is supposed to do:

| Item | What to find |
|---|---|
| Permissions | Every Info.plist usage string and AndroidManifest.xml permission |
| Data collection | What is collected, where it goes, which third parties receive it |
| Third-party SDKs | Analytics, ads, crash reporting, social login, payment SDKs |
| Account system | Sign-up flow, login providers, in-app account deletion |
| Payments | IAP, subscriptions, external payment links, donations |
| UGC | Text, image, or video visible to other users |
| AI features | Chatbots, image generation, AI personalization |
| Category | Kids, health, financial, dating, games, news |
| Ads | Ad SDKs present, behavioral vs contextual targeting |

Read `Info.plist`, `AndroidManifest.xml`, `Podfile`, `build.gradle`,
and dependency lists to ground this. A permissions inventory that
contradicts the declared data practices is itself a finding.

## Apple App Store review

The App Review Guidelines group into five themes: safety, performance,
business, design, legal. Rejections cite a guideline number (like
5.1.1). Match the citation to the table below.

### Common rejection causes

| Cause | Guideline area | Fix |
|---|---|---|
| Crash or bug during review | Performance 2.1 | Reproduce on the exact device and OS in the rejection; fix before resubmitting |
| Incomplete metadata | Performance 2.3 | Fill every App Store Connect field; screenshots must show real current UI |
| No demo account for gated app | Performance 2.1 | Provide working credentials in the review notes field |
| Privacy policy URL missing or broken | Legal 5.1.1 | Live URL, publicly accessible, matches actual practices |
| Missing or vague permission strings | Legal 5.1.1 | Every Info.plist usage key explains why in plain user terms |
| Permission requested before needed | Legal 5.1.1 | Request at first use, not at launch |
| No in-app account deletion | Legal 5.1.1 | Apps with account creation must offer deletion inside the app |
| Third-party login without Sign in with Apple | Design 4.8 | Offer Sign in with Apple alongside other social logins |
| Minimum functionality / web wrapper | Design 4.2 | App must do more than wrap a website |
| Private API usage | Performance 2.5 | Remove undocumented API calls and SDK symbols |
| Misleading screenshots | Performance 2.3 | Show only shipped features on real device frames |
| Wrong age rating | Legal 1.3 | Answer the questionnaire honestly; mismatches flag manual review |

### Apple technical setup

- **Privacy manifest**: Add `PrivacyInfo.xcprivacy` declaring
  required-reason API usage (file timestamps, UserDefaults, disk space,
  system boot time) and collected data types. Every third-party SDK
  must ship its own manifest; missing SDK manifests trigger warnings
  and then rejections.
- **Info.plist purpose strings**: `NSCameraUsageDescription`,
  `NSLocationWhenInUseUsageDescription`, and friends. Write a specific
  reason ("to scan QR codes"), never a generic one ("this app needs
  access").
- **Encryption declaration**: Set `ITSAppUsesNonExemptEncryption` in
  Info.plist when the app only uses exempt encryption (HTTPS, platform
  crypto). Non-exempt crypto needs export compliance documentation.
- **App Store Connect metadata**: App name 30 characters max, subtitle
  30 characters, keywords field 100 characters comma-separated with no
  wasted spaces, screenshots for each required device class, optional
  app preview video.
- **Review notes**: Include demo credentials, steps to reach gated
  features, and anything a reviewer could misread as broken.

## Google Play review

- **Data safety section**: Declare every data type collected or shared,
  its purpose, and whether collection is optional. Must match actual
  behavior and the privacy policy. Undeclared collection found by
  Google's scanner is a common rejection cause.
- **Target API level**: Must target a recent Android API level. Old
  targets block submission entirely.
- **Permissions declaration**: Justify each permission. Sensitive
  groups (SMS, call log, background location, all-files access) need a
  declaration form and a video demo in Play Console.
- **Photo and video access**: Prefer the system photo picker.
  `READ_MEDIA_*` permissions require justification; broad storage
  access is restricted on newer targets.
- **Foreground services**: Declare each foreground service type and
  justify it in Play Console.
- **Play App Signing**: Enroll; keep the upload key separate and backed
  up.
- **Content rating questionnaire**: Answer accurately; rating bodies
  differ by region.
- **Ads declaration**: Declare if the app serves ads, including ads
  from third-party SDKs.
- **Health and financial apps**: Extra declarations and eligibility
  requirements apply.

## Cross-store shared requirements

| Requirement | Both stores check |
|---|---|
| Privacy policy URL | Live, publicly accessible, matches actual practices, linked in store listing and in-app |
| Age and content rating | Questionnaire answers consistent with real content |
| Demo credentials | Working reviewer account for anything gated |
| Monetization disclosure | IAP flagged as IAP; ads declared |
| Completeness | No placeholder content, dead buttons, or "coming soon" features |
| Accurate metadata | Name, description, and screenshots reflect the real app |

## Kids, COPPA, and sensitive categories

Flag these before proceeding. Rules are stricter and mistakes are
expensive:

- **Kids apps**: No behavioral advertising, no third-party analytics
  that collect identifiers, parental gates before external links or
  purchases, enrollment in Apple Kids Category or Play Families.
- **Health**: Medical claims require evidence; health data handling is
  heavily restricted on both stores.
- **Financial**: Licensing requirements in some regions; crypto and
  loan apps have dedicated policies.
- **Dating and UGC**: Moderation, reporting, and blocking required.

If the app falls in one of these, tell the user explicitly that review
will be slower and scrutiny higher, and list the extra requirements.

## AI-generated content

Newer rules, enforced inconsistently but cited in rejections:

- Disclose AI-generated content where the app presents it as a feature
- AI chat and image apps need UGC-style moderation: report and block
  flows, content filters, no generation of illegal content
- Do not describe AI output as human-created in metadata
- Apps generating health, legal, or financial advice need disclaimers

## Handling a rejection

1. Read the cited guideline number, not just the summary text.
2. Check App Store Connect Resolution Center or Play Console for
   reviewer notes and screenshots; they usually show the exact screen
   that failed.
3. Map the clause to the tables above for the standard fix.
4. Fix, then resubmit with notes explaining the change.
5. If the rejection is wrong (the reviewer missed a feature), use the
   appeal or reply path with clear steps to reach the feature. Stay
   factual and short. Escalating only helps when the rejection is
   demonstrably mistaken.

## Anti-patterns (never do)

- Do not request permissions at launch before the feature needs them
- Do not treat the privacy policy as a placeholder or link a dead URL
- Do not submit screenshots showing features that do not exist
- Do not pick a store category for ranking if it mismatches the app
- Do not submit without a test account when any content is gated
- Do not hardcode special behavior for reviewers (demo mode triggered
  by review networks). It is detectable and can get the developer
  banned.
- Do not copy a competitor's metadata or keywords into the listing
- Do not skip the Data safety form because a privacy policy exists.
  Both are checked independently.

## Related skills

- `mobile-app-design`: platform design conventions when review feedback touches UI
- `legal-docs`: the privacy policy and terms the stores require you to link

## Pre-flight checklist

- [ ] App inventory completed before any requirement checks
- [ ] Sensitive categories (kids, health, financial, UGC, AI) flagged or ruled out
- [ ] Every Info.plist permission has a specific purpose string
- [ ] Privacy manifest covers required-reason APIs; SDK manifests verified
- [ ] Data safety section matches actual collection and the privacy policy
- [ ] Privacy policy URL is live and reachable
- [ ] Demo credentials provided for gated features
- [ ] In-app account deletion present if the app has account creation
- [ ] Sign in with Apple offered if other third-party social login exists
- [ ] Encryption export compliance declared
- [ ] Age and content ratings answered honestly on both stores
- [ ] Repo-fixable items fixed; console-only actions listed for the user
