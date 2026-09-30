# Cognikit

> A kit that gives AI agents cognitive abilities. Premium Agent Skills for Claude Code, Cursor, Windsurf, and any SKILL.md-compatible platform.

Cognikit is a curated marketplace and registry of Agent Skills following the open [SKILL.md standard](https://docs.claude.com/en/docs/claude-code/skills). Each skill is a self-contained package of expertise that makes AI agents better at specific tasks: design systems, code review, accessibility, motion engineering, and more.

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

## Available skills

| Skill | What it does | Category | Install |
|---|---|---|---|
| `design-systems` | Choose and implement a visual design system. 14 design systems, 110 anti-AI-slop rules, component library, responsive adaptation, DESIGN.md generation. | design | `npx skills add RimoraStudio/cognikit --skill design-systems -g -y` |
| `design-system-architecture` | Build, scale, and govern a design system as an engineering product. Token architecture, governance, versioning, drift detection, AI-agent readiness. | engineering | `npx skills add RimoraStudio/cognikit --skill design-system-architecture -g -y` |
| `code-review` | Confidence-filtered code review. Real bugs, security issues, and convention violations ranked by severity with file:line citations. | engineering | `npx skills add RimoraStudio/cognikit --skill code-review -g -y` |
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

## Marketplace

Visit [cognikit.com](https://cognikit.com) for the full marketplace with search, ratings, documentation, and one-click install.

## Structure

```
cognikit/
├── README.md                          # This file
├── LICENSE                            # MIT
├── registry.json                      # Skill registry index
├── CONTRIBUTING.md                    # How to author and submit skills
├── .github/workflows/                 # CI: validate, lint, publish
│   ├── validate-skills.yml
│   └── publish-skills.yml
├── skills/                            # All skill packages
│   ├── design-systems/                # Visual design system skill
│   │   ├── SKILL.md
│   │   └── references/
│   └── design-system-architecture/    # Design system engineering skill
│       ├── SKILL.md
│       └── references/
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
