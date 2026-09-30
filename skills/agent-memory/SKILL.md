---
name: agent-memory
description: >
  Designs and manages persistent memory for AI agents: layered memory
  files, learned preferences, and a self-improvement loop that updates
  memory from feedback without behavioral drift. Use when the user asks
  to "add memory to my agent", build an "agent memory system", create a
  "self-improving agent", manage "learned preferences", write an "agent
  soul file", set up "persistent agent memory", build an "agent that
  learns from feedback", or design "memory architecture".
metadata:
  version: 1.0.0
license: MIT
---

# Agent Memory

> Part of [Cognikit](https://cognikit.com). A kit that gives AI agents cognitive abilities.

Agent memory is a small set of layered files plus a scheduled review
process, not a transcript dump. Each layer has its own write rules,
owner, and lifetime. Getting the boundaries right is what lets an
agent learn from feedback without drifting away from its identity.

## AI execution flow (follow in order)

1. **Scope**: Identify what the agent must remember and for how long.
   List the user populations (single user or multi-tenant), the
   feedback channels, and the safety constraints memory must never
   weaken.
2. **Design layers**: Place every kind of state into exactly one of
   the four layers below. If information does not fit a layer's
   lifetime, it does not belong in memory.
3. **Define write rules**: For each writable layer, record what may be
   stored, what may not, and who can edit it. Apply the durability
   test to every candidate entry.
4. **Build the loop**: Implement the self-improvement loop as a
   separate periodic process with confidence-gated writes. Never run
   it inline on every turn.
5. **Wire the review job**: Add the scheduled job that reads the
   corrections log and promotes high-confidence patterns into
   preferences.md, with the poisoning defenses in place.
6. **Verify**: Run the pre-flight checklist at the bottom.

## The four-layer memory model

### 1. Permanent rules (soul.md)

Identity, values, and non-negotiables: who the agent is, how it talks,
what it must never do. Human-edited only. The agent reads this file
but never writes to it. Treat any agent-generated edit to soul.md as a
bug, not a feature.

### 2. Learned preferences (preferences.md)

Durable user preferences discovered over time: preferred formats,
recurring workflows, standing instructions. Agent-writable through
the improvement loop only, human-reviewable at any time. Every entry
carries metadata (confidence, source, date learned) so it can be
audited and reverted.

### 3. Working memory (session state)

Current task context: the plan in progress, intermediate results, the
conversation so far. Ephemeral by definition, cleared or summarized at
session end. Nothing leaves working memory without passing the write
rules.

### 4. Knowledge base (RAG and documents)

Facts the agent looks up: docs, codebases, tickets, reference material.
Retrieved at query time and cited, never memorized into prompts or
copied into preferences. The knowledge base answers questions; it does
not change behavior.

### Why the layers are separate

- **Identity protection**: session context can never overwrite who the
  agent is, because working memory has no write path to soul.md.
- **Small prompts**: only soul.md and preferences.md load every turn;
  the knowledge base is fetched on demand, so prompt size stays flat
  as knowledge grows.
- **Poisoning containment**: learned preferences live in their own
  file with metadata and review, so a bad pattern can be found and
  reverted without touching identity or facts.

## Memory write rules

Store only what will still be true next month:

- Stable preferences: "use table format for comparisons"
- Long-term projects: "the Postgres migration is ongoing"
- Explicit standing instructions: "always run tests before committing"
- Recurring workflows: "the weekly report goes out on Fridays"

Do not store:

- Temporary moods or one-off requests ("make it funnier this once")
- Secrets, credentials, or personal data not explicitly cleared for
  storage
- Guesses about what the user wants; inferences need evidence first
- Easily outdated facts (prices, versions, "current" anything); those
  belong in the knowledge base

The durability test: "don't do this" is a rule and may persist.
"Don't do this today" is context and stays in working memory. If a
correction starts with "just this once", "for now", or "in this
case", it is not a preference.

## The self-improvement loop

Run this as a separate periodic process (nightly, weekly, or per
session-batch), not inline on every message. Inline learning is
expensive and drifts the agent toward whatever happened most recently.

1. **Observe**: Scan the corrections log and recent sessions for
   explicit corrections, repeated failures, and recurring patterns.
   Explicit corrections outrank inferred failures; single observations
   outrank nothing.
2. **Classify**: Assign each candidate an improvement class:
   `accuracy`, `tool_usage`, `communication`, `workflow`, `safety`, or
   `other`. If you cannot classify it, you do not understand it well
   enough to store it.
3. **Diagnose**: Find the root cause, not the symptom. "User re-asked
   the question" is a symptom; "answer lacked the exact command" is a
   cause. A fix aimed at a symptom produces drift.
4. **Propose**: Design the smallest memory write that fixes the cause.
   One line in preferences.md beats a paragraph. Amend an existing
   entry rather than adding a near-duplicate.
5. **Validate**: Check for conflicts with soul.md and existing
   preferences, side effects on other workflows, and evidence
   strength. Reject anything that touches security rules, permissions,
   or spend limits; learned rules never enter that territory.
6. **Apply by confidence**:

| Confidence | Evidence | Action |
|---|---|---|
| `high` | Explicit user instruction, or the same correction 3+ times | Persist to preferences.md |
| `medium` | Pattern observed 2+ times, not yet explicit | Propose to the user; persist only on approval |
| `low` | Single inference or ambiguous signal | Note in the corrections log only |

## Memory poisoning defense

- **Per-user scoping**: in multi-tenant systems, preferences and
  corrections logs are keyed per user or workspace. One user's
  feedback must never leak into another user's memory.
- **Safety floor**: learned rules can never override security
  constraints, permission checks, or spend limits. Enforce this in
  the apply step, not just by policy.
- **Validation before promotion**: every write to preferences.md goes
  through the validate step. No direct writes from conversation.
- **Human review for soul.md**: changes to permanent rules require a
  human edit. The agent may propose, never apply.

## File templates

### soul.md

```markdown
---
version: 1
last_human_edit: 2026-01-15
---

# Identity
You are <name>, a <role> for <team or product>.

# Values
- <value 1, e.g., correctness over speed>
- <value 2>

# Non-negotiables
- Never <action, e.g., run destructive commands without confirmation>
- Never <action>
```

### preferences.md

```markdown
---
owner: <user-or-workspace-id>
last_review: 2026-01-15
---

## Preferences

### <short title>
- rule: <the learned preference, one line>
- confidence: high | medium | low
- source: <explicit correction | repeated observation | user request>
- learned: 2026-01-15
- evidence: <one line describing what happened>
```

### corrections log (corrections.jsonl, one JSON object per line)

```json
{"date": "2026-01-15", "type": "correction", "class": "communication", "summary": "user asked for shorter answers", "evidence": "session abc123", "status": "pending"}
```

`status` moves from `pending` to `promoted`, `proposed`, or `rejected`
when the review job processes the entry.

## Implementation patterns

- **File layout**: keep memory next to the agent config:
  `memory/soul.md`, `memory/preferences.md`, `memory/corrections.jsonl`.
  One directory per user or workspace in multi-tenant setups.
- **Load order**: soul.md first, then preferences.md, then session
  context. The knowledge base is never pre-loaded; it is queried.
  Total injected memory should fit in a few hundred lines.
- **Review job**: a scheduled task (cron, CI schedule, or a
  `review_memory` agent command) that reads corrections.jsonl, runs
  loop steps 2 to 6, and writes only `high` confidence entries to
  preferences.md. It outputs a diff or summary a human can scan.
- **Session end**: working memory is discarded or compressed into a
  session summary. Candidate lessons go to corrections.jsonl as
  `pending`, never straight to preferences.md.

## Anti-patterns (never do)

- Do not dump transcripts or whole conversations into memory files
- Do not store every detail; memory that records everything retrieves
  nothing useful
- Do not let learned preferences override safety rules, permissions,
  or spend limits, ever
- Do not let the agent write to soul.md, even for "small" fixes
- Do not run the improvement loop on every message; it is expensive
  and drifts the agent toward the most recent interaction
- Do not persist from a single observation; one data point is a note,
  not a rule
- Do not store secrets, tokens, or personal data in memory files

## Related skills

- `rag-pipelines`: the knowledge-base layer of the memory model is a RAG pipeline
- `model-distillation`: learned behavior that stabilizes can be distilled into weights instead of memory
- `mcp-server`: memory stores can be exposed to other agents as MCP tools

## Pre-flight checklist

- [ ] Every kind of state lives in exactly one of the four layers
- [ ] soul.md is human-edited only; the agent has no write path to it
- [ ] Every stored preference passed the durability test (still true next month)
- [ ] The improvement loop runs on a schedule, not per message
- [ ] Every preferences.md entry has confidence, source, and date learned
- [ ] Learned rules are checked against safety constraints before apply
- [ ] Multi-tenant memory is scoped per user or workspace
- [ ] Working memory is cleared or summarized between sessions
- [ ] The knowledge base is retrieved at query time, not memorized
