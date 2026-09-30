# Contributing to Cognikit

A guide for creating, submitting, and publishing Agent Skills under the Cognikit brand.

---

## What is a Cognikit skill

A Cognikit skill is a self-contained `SKILL.md` package that follows the open Agent Skills standard. Skills are compatible with Claude Code, Cursor, Windsurf, and skills.sh. Each skill teaches an AI agent how to perform a specific task by providing a trigger description, instructions, and optional reference material.

---

## Skill structure

Every skill lives in its own directory under `skills/`:

```
skill-name/
├── SKILL.md          # Required: YAML frontmatter + instructions
├── references/       # Optional: Deep docs loaded on demand
├── scripts/          # Optional: Executable code
└── assets/           # Optional: Templates or static files
```

Only `SKILL.md` is required. The other directories are optional but must follow the naming conventions above if present.

---

## SKILL.md frontmatter requirements

The top of every `SKILL.md` must contain a YAML frontmatter block with these fields:

| Field         | Required | Format / Rule                                                        |
|---------------|----------|----------------------------------------------------------------------|
| `name`        | Yes      | Kebab-case, no prefix (e.g. `my-skill`, not `cognikit/my-skill`)      |
| `description` | Yes      | Clear summary plus exact trigger phrases. This is how AI agents decide to activate the skill. Be specific. |
| `metadata.version` | Yes | SemVer (e.g. `1.0.0`), nested under `metadata:` to stay within the official spec's allowed frontmatter keys |
| `license`     | Yes      | `MIT` (required for all Cognikit skills)                              |

Only spec-allowed frontmatter keys (`name`, `description`, `license`, `compatibility`, `metadata`, `allowed-tools`) may appear. Custom fields go under `metadata:` so Cognikit skills pass third-party validators.

Example:

```yaml
---
name: my-skill
description: >
  Generates a REST API scaffold from an OpenAPI spec.
  Trigger phrases: "scaffold api from openapi", "generate rest endpoints",
  "create api from spec", "build openapi server".
metadata:
  version: 1.0.0
license: MIT
---
```

---

## Writing effective SKILL.md

### Description with trigger phrases

The `description` field is the single most important part of your skill. AI agents read it to decide whether to activate the skill. Include exact phrases a user might say. Be specific, not generic.

### Body: actionable, not theoretical

Write instructions an agent can execute step by step. Avoid background theory, history lessons, or motivational prose. If the agent needs deep context, put it in `references/` and link to it from the body.

### Progressive disclosure

The main `SKILL.md` is the entry point. Keep it focused. Move detailed docs, long examples, and extended specs into `references/`. The agent loads reference files only when needed.

### Required sections

Every `SKILL.md` body must include:

1. **AI execution flow** - A numbered list of steps the agent follows to complete the task.
2. **Pre-flight checklist** - A short checklist at the end the agent runs before declaring the task done.

### Size limit

Keep `SKILL.md` under 20KB. Move detail to `references/`.

### Style rules

- No emojis in code, examples, or output.
- No em dashes in UI copy or docs. Use periods, commas, or line breaks instead.

---

## Submission process

1. **Fork** the cognikit monorepo.
2. **Create your skill** under `skills/your-skill-name/`.
3. **Add your skill** to `registry.json`.
4. **Validate** by running `npm run validate`. This checks frontmatter, directory structure, and links.
5. **Open a PR** with a clear title and description.
6. **Core team reviews** for:
   - Trigger accuracy (is the description specific and correct?)
   - No overlap with existing skills
   - Quality of instructions
   - Anti-AI-slop compliance (no filler, no generic boilerplate, no em dashes, no emojis)
7. **Approved skills are published** to skills.sh and cognikit.com.

---

## Quality bar

All Cognikit skills must meet the following before they can be merged:

| Requirement | Detail |
|-------------|--------|
| Clear trigger description | Specific phrases, not vague summaries |
| AI execution flow | Numbered steps the agent follows |
| Pre-flight checklist | Present at the end of SKILL.md |
| Self-contained | Must fully work standalone. Soft "Related skills" pointers to sibling Cognikit skills are allowed but never required for the skill to function |
| Frontmatter validation | Passes `npm run validate` |
| Reference files exist | Every file listed in SKILL.md must exist on disk |
| No em dashes in UI copy | Use periods or commas instead |
| No emojis as icons in examples | Use text or proper icon names |

---

## Versioning

Skills use Semantic Versioning:

| Change type | When to bump | Example |
|-------------|--------------|---------|
| MAJOR | Breaking change to skill behavior or trigger | `1.0.0` -> `2.0.0` |
| MINOR | New capability added, backward compatible | `1.0.0` -> `1.1.0` |
| PATCH | Fix or clarification, no behavior change | `1.0.0` -> `1.0.1` |

Update the `metadata.version` field in frontmatter on every change.
