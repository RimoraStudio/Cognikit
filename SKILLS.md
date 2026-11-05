# Cognikit Skill Map

Routing index for humans and agents. Pick the narrowest skill that matches
the task; follow `Related skills` inside its `SKILL.md` when work crosses
fields. For an unclear or multi-field request, use the `cognikit` router.

## Routing table

| When the task involves... | Use | Field |
|---|---|---|
| Choosing visual direction, design styles, anti-AI-slop, DESIGN.md | `design-systems` | design |
| Design tokens, governance, versioning, design system engineering | `design-system-architecture` | engineering |
| Landing pages, hero sections, pricing pages, conversion copy | `marketing-sites` | design |
| Dashboards, admin panels, data tables, charts, metrics UI | `dashboard-ui` | design |
| Mobile app UI, iOS/Android conventions, nav patterns, touch | `mobile-app-design` | design |
| Refining buttons, inputs, dropdowns, sidebars, interaction states | `refine-component` | design |
| Reviewing code, diffs, PRs, finding bugs or bloat before merge | `code-review` | engineering |
| Authoring skills or agent configs, SKILL.md files, eval prompts | `skill-authoring` | engineering |
| REST endpoints, API contracts, error shapes, pagination | `api-design` | engineering |
| Vulnerabilities, OWASP, secrets, dependency CVEs, audit | `security-audit` | security |
| Building MCP servers, exposing tools/resources to agents | `mcp-server` | ai-agents |
| Agent memory, learned preferences, self-improvement loops | `agent-memory` | ai-agents |
| Fine-tuning, distilling a small model, local LLMs, GGUF | `model-distillation` | ai-ml |
| RAG, document search, knowledge bases, grounded answers | `rag-pipelines` | data |
| SEO audits, meta tags, structured data, Core Web Vitals | `seo` | marketing |
| Apple App Store review, iOS rejection, App Store Connect, Apple distribution | `apple-app-store-compliance` | mobile |
| Google Play review, Android rejection, Play Console, Data safety | `google-play-compliance` | mobile |
| Privacy policy, terms of service, cookie policy, legal pages | `legal-docs` | compliance |

`app-store-compliance` is a deprecated compatibility alias, not a default
route for new work. For both platforms, use the Apple and Google Play
specialists independently. The `cognikit` skill is the multi-field router;
this file is the human-readable routing index.

## Boundaries between adjacent skills

- `design-systems` chooses the product's visual direction and reusable UI
  patterns. `design-system-architecture` handles the engineering that scales
  and governs a system: tokens, versioning, pipelines, and drift.
- `refine-component` improves a specific control or short interaction flow;
  use `design-systems` for broad product or page direction instead.
- `marketing-sites` handles conversion narrative and marketing-page structure;
  `dashboard-ui` handles data-dense decision interfaces; `mobile-app-design`
  handles native iOS and Android interaction conventions.
- `code-review` reviews implementation changes for defects. `security-audit`
  performs a dedicated adversarial security assessment.
- `legal-docs` drafts product legal documents. Store-policy checks belong to
  the Apple or Google Play compliance specialist.

## Workflow chains

Common jobs that run skills in sequence.

| Job | Chain |
|---|---|
| New API feature | `api-design` → implement → `code-review` → `security-audit` |
| New landing page | `design-systems` → `marketing-sites` → `code-review` → `seo` |
| New mobile app | `design-systems` → `mobile-app-design` → `legal-docs` → Apple and/or Google Play specialist |
| Cross-platform store review | Apple specialist + Google Play specialist, assessed separately |
| Agent platform | `mcp-server` → `agent-memory` → `rag-pipelines` → `model-distillation` → `security-audit` |
| Launch checklist | `security-audit` → `seo` → `legal-docs` → relevant store specialist(s) (if mobile) |
| Internal chatbot | `rag-pipelines` → `agent-memory` → `model-distillation` (when data justifies) |
| New Cognikit skill | `skill-authoring` → `code-review` |

## Rules for agents

- A task that matches exactly one skill goes straight to it; do not
  route through the meta-skill.
- `Related skills` sections are soft pointers. Follow them when the
  current task crosses into the sibling's field, not before.
- Sibling skills may not be installed. If a referenced skill is
  missing, do the work yourself using this map instead of failing.
