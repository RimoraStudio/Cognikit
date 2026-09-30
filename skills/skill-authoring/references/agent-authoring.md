# Agent Authoring Reference

Depth for the "Authoring agents" section of SKILL.md. Load when
writing or fixing an agent file.

An agent file is Markdown with YAML frontmatter, auto-discovered from
an `agents/` directory. The frontmatter decides when the harness
dispatches to the agent; the body becomes the agent's system prompt.

## Frontmatter fields

| Field | Required | Format | Notes |
|---|---|---|---|
| `name` | yes | lowercase-hyphens, 3-50 chars, starts/ends alphanumeric | Namespaced automatically (`plugin:subdir:agent-name` in nested dirs) |
| `description` | yes | Triggering conditions + prose trigger scenarios | The dispatch mechanism; 200-1000 chars works best |
| `model` | yes | `inherit` / `sonnet` / `opus` / `haiku` | Use `inherit` unless a specific capability is needed |
| `color` | yes | `blue` `cyan` `green` `yellow` `magenta` `red` | Distinct per agent in one plugin; consistent across similar agent types |
| `tools` | no | Array of tool names | Omit for full access |

Color conventions that have emerged: blue/cyan for analysis and
review, green for success-oriented tasks, yellow for caution and
validation, red for security and critical work, magenta for creative
generation.

### description format

```
Use this agent when [conditions]. Typical triggers include
[scenario 1 in prose], [scenario 2 in prose], and [scenario 3 in
prose]. See "When to invoke" in the agent body for worked scenarios.
```

- Name 2-4 trigger scenarios as prose, not keyword lists.
- Cover both reactive triggers (user asks) and proactive triggers
  (the harness should dispatch on its own).
- Cover different phrasings of the same intent.
- Be explicit about when NOT to dispatch, where ambiguity exists.

### tools

Apply least privilege. Common sets:

| Job | Tools |
|---|---|
| Read-only analysis | `["Read", "Grep", "Glob"]` |
| Code generation | `["Read", "Write", "Grep"]` |
| Testing | `["Read", "Bash", "Grep"]` |
| Full access | Omit the field |

## System prompt structure

The body is the agent's system prompt. Write in second person,
addressing the agent. Target 500-3,000 characters; hard limit ~10,000.

```markdown
You are [role] specializing in [domain].

## When to invoke

- **[Scenario name].** What the situation looks like and what the
  agent should do.
- **[Scenario name].** Same.

**Your Core Responsibilities:**
1. [Primary responsibility]
2. [Secondary responsibility]

**Analysis Process:**
1. [Step one]
2. [Step two]

**Quality Standards:**
- [Standard]

**Output Format:**
Provide results in this format: [structure]

**Edge Cases:**
- [Edge case]: [how to handle]
```

The "When to invoke" section holds the worked scenarios the
description summarized. The description names them in a sentence,
the body develops each into a prose bullet.

## Worked example

```markdown
---
name: migration-reviewer
description: Use this agent when reviewing database migrations or
  schema changes before they ship. Typical triggers include a PR
  that adds a migration file, a schema change touching existing
  tables, and a request to check migration safety on a production
  database. See "When to invoke" in the agent body for worked
  scenarios.
model: inherit
color: yellow
tools: ["Read", "Grep", "Glob"]
---

You are a database migration reviewer specializing in Postgres
schema changes on live traffic.

## When to invoke

- **Migration PR review.** A pull request adds or edits files under
  the migrations directory; check for locking, backfill, and
  rollback safety.
- **Schema change audit.** An existing table gains a column or
  index; verify the operation is online-safe.

**Your Core Responsibilities:**
1. Identify operations that lock tables (ALTER, non-concurrent
   index builds)
2. Flag irreversible or lossy changes
3. Verify every migration has a rollback path

**Analysis Process:**
1. Read the migration diff
2. Classify each statement by lock level
3. Check backfill strategy for large tables
4. Report blockers and warnings

**Output Format:**
- Blockers (must fix before merge)
- Warnings (merge with care)
- Safe operations (one line each)
```

## Validation rules

- `name`: 3-50 chars, lowercase letters, numbers, hyphens; no
  underscores or spaces; starts and ends alphanumeric.
  Valid: `code-reviewer`, `api-analyzer-v2`.
  Invalid: `ag` (too short), `-start` (leading hyphen), `my_agent`
  (underscore), `helper` (too generic to mean anything).
- `description`: 10-5,000 chars; must name triggering conditions and
  scenarios; 200-1,000 chars with 2-4 scenarios is the sweet spot.
- System prompt: 20-10,000 chars; 500-3,000 is the sweet spot; must
  define responsibilities, process, and output format.

## Testing an agent

1. Triggering: write prompts matching the description scenarios,
   plus near-miss phrasings, and confirm the agent dispatches on the
   right ones only.
2. Behavior: give it a typical task; confirm it follows the process
   steps, produces the output format, and handles the edge cases the
   prompt claims to cover.
