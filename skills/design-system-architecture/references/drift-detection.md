# Drift Detection

All 10 drift types, scanner setup, CI gate configuration, health score calculation, and PR comment format for design drift detection.

## Drift types and detection methods

| # | Drift type | Example | Detection method | Gate |
|---|---|---|---|---|
| 1 | Hardcoded tokens | `color: #3b82f6` instead of `color.action.primary` | Regex / AST scan for raw hex, px, rem values | Error |
| 2 | Reinvented components | Custom `<div onClick>` button instead of `<Button>` | AST structure matching against component library | Warning |
| 3 | Magic breakpoints | `@media (min-width: 768px)` not in the system | Media query regex scan | Warning |
| 4 | Prop misuse | `<Button variant="text">` (deprecated) | TypeScript / prop type check | Warning |
| 5 | Token aliasing | Background color token used for text color | Semantic token usage audit (token type vs CSS property) | Warning |
| 6 | Orphaned components | Component in code, missing from Figma/Storybook | Cross-reference scan (code vs manifest) | Warning |
| 7 | Unused tokens | Token defined, never referenced in any code | Token usage scan (grep all repos) | Info |
| 8 | Naming drift | `color-primary` in one file, `primaryColor` in another | Naming convention linter | Warning |
| 9 | Framework sprawl | Multiple UI frameworks competing (MUI + custom + system) | Import scan (package.json + import statements) | Warning |
| 10 | Accessibility gaps | Missing ARIA, focus management, keyboard nav | axe-core audit | Error |

## Scanner setup: regex patterns for hardcoded values

```js
// scripts/drift-scanner.mjs
const HARDCODED_PATTERNS = [
  // Hex colors (not in token files)
  { pattern: /#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\b/g, type: "color", message: "Use a color token instead of a hex value" },
  // Pixel values (not in token files)
  { pattern: /\b\d+px\b/g, type: "dimension", message: "Use a space or size token instead of px" },
  // Rem values (not in token files)
  { pattern: /\b\d*\.?\d+rem\b/g, type: "dimension", message: "Use a space or size token instead of rem" },
  // RGB/RGBA values
  { pattern: /rgba?\([^)]+\)/g, type: "color", message: "Use a color token instead of rgb/rgba" },
  // Hardcoded font families
  { pattern: /font-family:\s*["'][^"']+["']/g, type: "fontFamily", message: "Use a font family token" },
];

const TOKEN_FILE_PATTERNS = [/tokens\/.*\.json$/, /\.tokens\.json$/, /style-dictionary/];

function isTokenFile(filePath) {
  return TOKEN_FILE_PATTERNS.some((p) => p.test(filePath));
}

function scanFile(filePath, content) {
  if (isTokenFile(filePath)) return []; // Token files are allowed to have raw values
  const violations = [];
  for (const { pattern, type, message } of HARDCODED_PATTERNS) {
    const matches = content.matchAll(pattern);
    for (const match of matches) {
      violations.push({
        file: filePath,
        line: content.substring(0, match.index).split("\n").length,
        value: match[0],
        type,
        message,
        severity: type === "color" || type === "dimension" ? "error" : "warning",
      });
    }
  }
  return violations;
}
```

## AST-based component reinvention detection

Regex catches hardcoded values. AST catches structural reinvention (a div styled to look like a Button).

```js
// scripts/reinvention-scanner.mjs
import { parse } from "@babel/parser";
import traverse from "@babel/traverse";

const COMPONENT_SIGNATURES = {
  Button: {
    tag: "button",
    requiredProps: ["onClick"],
    styleIndicators: ["background", "border-radius", "padding"],
  },
  Card: {
    tag: "div",
    styleIndicators: ["border", "box-shadow", "border-radius"],
    minChildren: 2,
  },
};

function detectReinvention(source) {
  const ast = parse(source, { sourceType: "module", plugins: ["jsx", "typescript"] });
  const findings = [];

  traverse(ast, {
    JSXOpeningElement(path) {
      const tagName = path.node.name.name;
      if (tagName !== "div" && tagName !== "button") return;

      const attributes = path.node.attributes.map((a) => a.name?.name).filter(Boolean);
      const hasClick = attributes.includes("onClick");
      const hasStyled = attributes.includes("style") || attributes.includes("className");

      // A raw <button onClick> with inline styles is likely a reinvented Button
      if (tagName === "button" && hasClick && hasStyled) {
        findings.push({
          type: "reinvented-component",
          component: "Button",
          message: "Use <Button> from @designsystem/react instead of a raw styled button",
          severity: "warning",
        });
      }
    },
  });

  return findings;
}
```

## CI gate configuration (GitHub Actions YAML)

```yaml
# .github/workflows/drift-check.yml
name: Design System Drift Check
on: [pull_request]
jobs:
  drift:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - run: pnpm install --frozen-lockfile
      - name: Token validation
        run: pnpm tokens:validate
      - name: Drift scan
        run: pnpm drift:check
      - name: Accessibility audit
        run: pnpm a11y:audit
      - name: Comment PR
        if: always()
        uses: actions/github-script@v7
        with:
          script: |
            const fs = require('fs');
            const report = JSON.parse(fs.readFileSync('drift-report.json', 'utf8'));
            const body = formatReport(report);
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body,
            });
```

## Gate rules: error vs warning

| Rule | Severity | Action | Rationale |
|---|---|---|---|
| Hardcoded tokens (color, dimension) | Error | Block merge | Breaks theming, dark mode, rebrand |
| Reinvented components | Warning | Comment on PR | Educates, does not block |
| Magic breakpoints | Warning | Comment on PR | Inconsistent responsive behavior |
| Prop misuse (deprecated) | Warning | Comment with migration link | Guides migration |
| Token aliasing | Warning | Comment on PR | Semantic misuse |
| Accessibility gaps | Error | Block merge | Legal and usability requirement |
| Naming drift | Warning | Comment on PR | Consistency |
| Framework sprawl | Warning | Comment on PR | Adoption risk |
| Coverage delta | Info | Comment on PR | Shows adoption trend |

## Health score calculation (0-100)

```js
// scripts/health-score.mjs
function calculateHealthScore(metrics) {
  const weights = {
    tokenAdoption: 0.25,      // % of styles using tokens vs hardcoded
    componentAdoption: 0.20,  // % of UI using system components vs custom
    accessibility: 0.20,      // % passing WCAG AA
    documentation: 0.10,      // % of components with docs
    testCoverage: 0.10,       // % of components with tests
    driftTrend: 0.15,         // improving (100), flat (50), worsening (0)
  };

  let score = 0;
  for (const [key, weight] of Object.entries(weights)) {
    score += (metrics[key] / 100) * weight * 100;
  }
  return Math.round(score);
}

// Example
const score = calculateHealthScore({
  tokenAdoption: 91,
  componentAdoption: 68,
  accessibility: 95,
  documentation: 88,
  testCoverage: 82,
  driftTrend: 100, // improving
});
// score = 87
```

| Score | Status | Action |
|---|---|---|
| 90-100 | Excellent | Maintain, focus on new features |
| 75-89 | Good | Address lowest-scoring metric |
| 60-74 | Fair | Prioritize drift reduction and coverage |
| Below 60 | At risk | Pause new features, focus on health |

## Coverage tracking over time

Store health score and coverage metrics per sprint in a JSON file. Plot trends in the docs site.

```json
// metrics/health-history.json
[
  { "sprint": "2026-S01", "score": 72, "tokenAdoption": 80, "componentAdoption": 55 },
  { "sprint": "2026-S02", "score": 78, "tokenAdoption": 85, "componentAdoption": 62 },
  { "sprint": "2026-S03", "score": 87, "tokenAdoption": 91, "componentAdoption": 68 }
]
```

## Baseline management (accepting existing drift)

Legacy code has drift. A hard error gate on day one blocks all PRs. Use a baseline to accept existing drift and only fail on new drift.

```json
// drift-baseline.json
{
  "version": "1.0.0",
  "generatedAt": "2026-01-15",
  "violations": {
    "src/legacy/old-component.tsx": {
      "hardcoded-color": 3,
      "hardcoded-px": 12,
      "reinvented-button": 1
    }
  }
}
```

```js
// scripts/drift-check.mjs
function isNewViolation(violation, baseline) {
  const fileBaseline = baseline.violations[violation.file];
  if (!fileBaseline) return true;
  return fileBaseline[violation.type] > 0
    ? (fileBaseline[violation.type]--, false)
    : true;
}
```

Update the baseline only when legacy code is cleaned up (remove the entry, never add new violations to the baseline).

## PR comment format for drift reports

```md
## Design System Drift Report

**Health score: 87/100** (up 2 from last sprint)

### Errors (must fix before merge)
| File | Line | Issue | Fix |
|---|---|---|---|
| `src/Button.tsx` | 14 | Hardcoded `#3b82f6` | Use `var(--color-action-primary)` |

### Warnings (review recommended)
| File | Line | Issue | Fix |
|---|---|---|---|
| `src/Card.tsx` | 22 | Reinvented button (raw `<button onClick>`) | Use `<Button>` component |
| `src/Layout.tsx` | 8 | Magic breakpoint `768px` | Use `breakpoint.md` token |

### Coverage
| Metric | Before | After | Delta |
|---|---|---|---|
| Token adoption | 91% | 91% | 0% |
| Component adoption | 68% | 69% | +1% |

[Full report](https://designsystem.dev/drift/pr/123)
```

## Tools comparison

| Tool | Type | Strengths | Weaknesses | Use when |
|---|---|---|---|---|
| Lyse | Drift scanner | Token-focused, fast | Limited component detection | Token drift is primary concern |
| Subpixel | Visual regression | Catches visual drift | Does not catch code-level drift | Visual consistency across releases |
| Buoy | Design system analytics | Adoption metrics, usage tracking | SaaS, requires setup | Measuring adoption at scale |
| Custom (this doc) | Full control | Tailored to your system, CI-native | Build and maintain cost | Specific drift rules needed |

A custom scanner built on the patterns in this file covers 80% of needs. Add Lyse or Buoy when adoption analytics become the bottleneck.
