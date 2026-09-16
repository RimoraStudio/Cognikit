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

| Skill | What it does | Install |
|---|---|---|
| `design-systems` | Choose and implement a visual design system. 14 design systems, 110 anti-AI-slop rules, component library, responsive adaptation, DESIGN.md generation. | `npx skills add RimoraStudio/cognikit --skill design-systems -g -y` |
| `design-system-architecture` | Build, scale, and govern a design system as an engineering product. Token architecture, governance, versioning, drift detection, AI-agent readiness. | `npx skills add RimoraStudio/cognikit --skill design-system-architecture -g -y` |

More skills coming soon.

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
