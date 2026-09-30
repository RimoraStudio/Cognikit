# Cognikit

> A kit that gives AI agents cognitive abilities. Premium Agent Skills for Claude Code, Cursor, Windsurf, and any SKILL.md-compatible platform.

Cognikit is a curated marketplace and registry of Agent Skills following the open [SKILL.md standard](https://docs.claude.com/en/docs/claude-code/skills). Each skill is a self-contained package of expertise that makes AI agents better at specific tasks: design systems, code review, security audits, MCP servers, SEO, store compliance, legal docs, and more. Skills pass Anthropic's official spec validator and ship with eval prompts.

## Install a skill

```bash
# Install a specific skill (shortest command)
npx skills add RimoraStudio/cognikit --skill design-systems -g -y
npx skills add RimoraStudio/cognikit --skill design-system-architecture -g -y

# Install all skills at once
npx skills add RimoraStudio/cognikit --all -g -y

# List available skills without installing
npx skills add RimoraStudio/cognikit --list
```

## Bundles

Groups of related skills installed together:

| Bundle | Skills | Install |
|---|---|---|
| `full` | All 17 skills | `npx skills add RimoraStudio/cognikit --all -g -y` |
| `design` | design-systems, design-system-architecture, marketing-sites, dashboard-ui, mobile-app-design | `npx skills add RimoraStudio/cognikit --skill design-systems --skill design-system-architecture --skill marketing-sites --skill dashboard-ui --skill mobile-app-design -g -y` |
| `engineering` | code-review, api-design, security-audit, skill-authoring | `npx skills add RimoraStudio/cognikit --skill code-review --skill api-design --skill security-audit --skill skill-authoring -g -y` |
| `ai-stack` | mcp-server, agent-memory, model-distillation, rag-pipelines | `npx skills add RimoraStudio/cognikit --skill mcp-server --skill agent-memory --skill model-distillation --skill rag-pipelines -g -y` |
| `launch` | security-audit, seo, legal-docs, app-store-compliance | `npx skills add RimoraStudio/cognikit --skill security-audit --skill seo --skill legal-docs --skill app-store-compliance -g -y` |

## Available skills

| Skill | What it does | Category | Install |
|---|---|---|---|
| `design-systems` | Choose and implement a visual design system. 14 design systems, 110 anti-AI-slop rules, component library, responsive adaptation, DESIGN.md generation. | design | `npx skills add RimoraStudio/cognikit --skill design-systems -g -y` |
| `design-system-architecture` | Build, scale, and govern a design system as an engineering product. Token architecture, governance, versioning, drift detection, AI-agent readiness. | engineering | `npx skills add RimoraStudio/cognikit --skill design-system-architecture -g -y` |
| `code-review` | Confidence-filtered code review. Real bugs, security issues, and convention violations ranked by severity, plus an optional over-engineering pass. | engineering | `npx skills add RimoraStudio/cognikit --skill code-review -g -y` |
| `skill-authoring` | Author and audit Agent Skills and agent configs. Pushy trigger descriptions, progressive disclosure, evals, agent frontmatter. | engineering | `npx skills add RimoraStudio/cognikit --skill skill-authoring -g -y` |
| `api-design` | Design REST contracts before implementation. Routes, error shapes, pagination, idempotency, versioning. | engineering | `npx skills add RimoraStudio/cognikit --skill api-design -g -y` |
| `security-audit` | Adversarial OWASP audit. Attack surface mapping, exploitability-confirmed findings, dependency CVEs, remediation. | security | `npx skills add RimoraStudio/cognikit --skill security-audit -g -y` |
| `mcp-server` | Build Model Context Protocol servers. stdio/HTTP/MCPB deployment, tool design, TS + Python examples, inspector testing. | ai-agents | `npx skills add RimoraStudio/cognikit --skill mcp-server -g -y` |
| `agent-memory` | Persistent agent memory architecture. Four-layer model, self-improvement loop, confidence rules, poisoning defenses. | ai-agents | `npx skills add RimoraStudio/cognikit --skill agent-memory -g -y` |
| `model-distillation` | Distill a teacher model into a small local model. Data generation, LoRA fine-tuning, GGUF quantization, Ollama deployment. | ai-ml | `npx skills add RimoraStudio/cognikit --skill model-distillation -g -y` |
| `rag-pipelines` | Build RAG systems. Structure-aware chunking, hybrid retrieval, grounded answers with citations, multi-tenant isolation. | data | `npx skills add RimoraStudio/cognikit --skill rag-pipelines -g -y` |
| `marketing-sites` | Landing pages that convert without looking generated. Narrative arc, hero variations, conversion copy, pricing patterns, anti-slop blocklist. | design | `npx skills add RimoraStudio/cognikit --skill marketing-sites -g -y` |
| `dashboard-ui` | Data-dense dashboards that answer questions. Chart selection, table discipline, widget states, filters, density. | design | `npx skills add RimoraStudio/cognikit --skill dashboard-ui -g -y` |
| `mobile-app-design` | Mobile UIs that respect platform conventions. iOS HIG vs Material 3, nav patterns, touch ergonomics, safe areas. | design | `npx skills add RimoraStudio/cognikit --skill mobile-app-design -g -y` |
| `seo` | Technical and on-page SEO to professional standard. Meta, canonicals, JSON-LD, OG tags, Core Web Vitals. | marketing | `npx skills add RimoraStudio/cognikit --skill seo -g -y` |
| `app-store-compliance` | App Store and Google Play requirements. Rejection causes, privacy manifests, data safety, submission setup. | mobile | `npx skills add RimoraStudio/cognikit --skill app-store-compliance -g -y` |
| `legal-docs` | Professional privacy policies, ToS, cookie and refund policies. Intake-driven, jurisdiction-aware drafting. | compliance | `npx skills add RimoraStudio/cognikit --skill legal-docs -g -y` |
| `cognikit` | Meta-skill router. Maps tasks to the right Cognikit skill and sequences multi-skill workflows. | meta | `npx skills add RimoraStudio/cognikit --skill cognikit -g -y` |

Every skill is self-contained. Where a task crosses fields, skills carry soft "Related skills" pointers that degrade gracefully if the sibling is not installed. The `related` field in `registry.json` makes the graph machine-readable for the marketplace.

## How agents pick a skill

Three layers teach an agent which skill to use and when:

1. **`SKILLS.md`** at the repo root is the routing map: a task-to-skill table plus workflow chains for common jobs (e.g. new API feature = api-design, implement, code-review, security-audit).
2. **The `cognikit` skill** is a router meta-skill. It activates only when a request spans fields or is ambiguous, then hands off to the right specialist.
3. **Skill descriptions** carry concrete trigger phrases, so single-field tasks route directly to the specialist without passing through the router.

## Quality

- All 17 skills pass Anthropic's official spec validator (spec-allowed frontmatter keys only; version lives under `metadata:`)
- Each skill ships `evals/evals.json` with realistic test prompts, including implicit triggers that never name the skill
- CI checks required frontmatter, kebab-case names, reference file integrity, registry consistency, and no em dashes

## Marketplace

Visit [cognikit.com](https://cognikit.com) for the full marketplace with search, ratings, documentation, and one-click install.

## Structure

```
cognikit/
├── README.md                          # This file
├── LICENSE                            # MIT
├── SKILLS.md                          # Routing map: task -> skill, workflow chains
├── registry.json                      # Skill registry index, related graph, bundles
├── CONTRIBUTING.md                    # How to author and submit skills
├── .github/workflows/                 # CI: validate, lint, publish
│   ├── validate-skills.yml
│   └── publish-skills.yml
├── skills/                            # All skill packages (17)
│   ├── cognikit/                      # Router meta-skill
│   ├── design-systems/                # Visual design system skill
│   │   ├── SKILL.md
│   │   ├── references/
│   │   └── evals/
│   ├── marketing-sites/               # Landing page + conversion design
│   ├── dashboard-ui/                  # Data-dense interface design
│   ├── mobile-app-design/             # Mobile UI conventions
│   ├── design-system-architecture/    # Design system engineering
│   ├── code-review/                   # Confidence-filtered code review
│   ├── skill-authoring/               # Skill + agent authoring
│   ├── api-design/                    # API contract design
│   ├── security-audit/                # OWASP security audit
│   ├── mcp-server/                    # MCP server building
│   ├── agent-memory/                  # Agent memory architecture
│   ├── model-distillation/            # Local model distillation
│   ├── rag-pipelines/                 # RAG systems
│   ├── seo/                           # Technical + on-page SEO
│   ├── app-store-compliance/          # App Store / Play requirements
│   └── legal-docs/                    # Privacy policy, ToS, legal pages
└── marketplace/                       # Dedicated marketplace platform
    └── README.md                      # Platform spec and roadmap
```

## Brand

- **Name:** Cognikit
- **Tagline:** A kit that gives AI agents cognitive abilities.
- **Domain:** cognikit.com
- **GitHub:** github.com/RimoraStudio/cognikit
- **License:** MIT (skills) / proprietary (marketplace platform)

## License

MIT for all skills in this repository. The marketplace platform (cognikit.com) has its own license.
