# Cognikit Skill Map

Routing index for humans and agents. Each skill owns one field. Pick the
skill whose field matches the task; follow `Related skills` inside each
SKILL.md when the task crosses fields. When unsure which skill applies,
or a task spans several fields, start with the `cognikit` router skill.

## Routing table

| When the task involves... | Use | Field |
|---|---|---|
| Choosing visual direction, design styles, anti-AI-slop, DESIGN.md | `design-systems` | design |
| Design tokens, governance, versioning, design system engineering | `design-system-architecture` | engineering |
| Landing pages, hero sections, pricing pages, conversion copy | `marketing-sites` | design |
| Dashboards, admin panels, data tables, charts, metrics UI | `dashboard-ui` | design |
| Mobile app UI, iOS/Android conventions, nav patterns, touch | `mobile-app-design` | design |
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
| Store compliance for both platforms or unclear platform | `app-store-compliance` router | mobile |
| Privacy policy, terms of service, cookie policy, legal pages | `legal-docs` | compliance |

## Workflow chains

Common jobs that run skills in sequence.

| Job | Chain |
|---|---|
| New API feature | `api-design` → implement → `code-review` → `security-audit` |
| New landing page | `design-systems` → `marketing-sites` → `code-review` → `seo` |
| New mobile app | `design-systems` → `mobile-app-design` → `legal-docs` → Apple and/or Google Play specialist |
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
