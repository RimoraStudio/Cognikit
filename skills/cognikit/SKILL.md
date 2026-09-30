---
name: cognikit
description: >
  Router for the Cognikit skill set. Use when a request could involve
  multiple Cognikit skills, when it is unclear which specialist skill
  applies, or when planning work that spans fields (e.g. "build and
  launch an app", "set up an AI agent platform"). Do NOT use for
  requests that clearly match one skill; go directly to that skill
  instead. Maps tasks to the right skill and sequences multi-skill
  workflows.
metadata:
  version: 1.0.0
license: MIT
---

# Cognikit Router

> Part of [Cognikit](https://cognikit.com). A kit that gives AI agents cognitive abilities.

This skill does no work itself. It maps the task to the right
specialist skill and sequences the workflow when a job crosses fields.
Think of it as the index, not a chapter.

## AI execution flow (follow in order)

1. **Check for a direct match**: If the request clearly belongs to one
   skill in the routing table, hand off immediately. Do not summarize,
   do not interpose.
2. **Split multi-field tasks**: When a request spans fields ("design
   and launch a landing page"), decompose it into the ordered chain
   from the workflow table, then execute each step with its skill.
3. **Handle missing skills**: If the needed skill is not installed,
   say so briefly and do the work yourself using the routing table's
   field description as guidance. Never block on installation unless
   the user asks for the skill specifically.
4. **Verify**: Each skill hands off its own pre-flight checklist. Run
   the checklist below only for the routing itself.

## Routing table

| Task involves | Skill |
|---|---|
| Visual direction, design styles, DESIGN.md, anti-AI-slop | `design-systems` |
| Tokens, governance, versioning, design system engineering | `design-system-architecture` |
| Landing pages, heroes, pricing, conversion copy | `marketing-sites` |
| Dashboards, admin panels, charts, data tables | `dashboard-ui` |
| Mobile app UI, iOS/Android conventions, touch patterns | `mobile-app-design` |
| Code diffs, PR review, bug finding | `code-review` |
| REST contracts, endpoints, error shapes, pagination | `api-design` |
| Vulnerabilities, OWASP, secrets, dependency CVEs | `security-audit` |
| MCP servers, agent tools, tool schemas | `mcp-server` |
| Agent memory, preferences, self-improvement | `agent-memory` |
| Fine-tuning, distillation, small local models | `model-distillation` |
| RAG, knowledge bases, grounded doc answers | `rag-pipelines` |
| SEO audits, meta tags, structured data, Web Vitals | `seo` |
| App Store / Play review, store submission, rejections | `app-store-compliance` |
| Privacy policy, ToS, cookie policy, legal pages | `legal-docs` |

## Workflow chains

| Job | Sequence |
|---|---|
| New API feature | `api-design` → implement → `code-review` → `security-audit` |
| New landing page | `design-systems` → `marketing-sites` → `code-review` → `seo` |
| New mobile app | `design-systems` → `mobile-app-design` → `legal-docs` → `app-store-compliance` |
| Agent platform | `mcp-server` → `agent-memory` → `rag-pipelines` → `model-distillation` → `security-audit` |
| Launch checklist | `security-audit` → `seo` → `legal-docs` → `app-store-compliance` (mobile only) |

## Rules

- Match before routing. One clear skill means one direct handoff.
- Chains are starting points, not contracts. Skip steps the task does
  not need; tell the user what was skipped and why.
- Keep each skill's output format. Routing changes who answers, not
  how the answer looks.
- If no skill matches the task at all, say so and answer directly.
  Do not force a skill onto a task it does not fit.

## Related skills

- All Cognikit skills; see the routing table and `SKILLS.md` at the
  repo root for the machine-readable map.

## Pre-flight checklist

- [ ] Direct single-skill requests were handed off without detour
- [ ] Multi-field tasks were decomposed into the chain and each step assigned a skill
- [ ] Missing skills were noted and worked around, not silently skipped
- [ ] No skill was applied to a task outside its field
