---
name: skill-authoring
description: >
  Authors new AI skills and agents: frontmatter that triggers
  reliably, lean SKILL.md bodies, references for depth, and evals.
  Use when the user asks to "create a skill", "write a SKILL.md",
  "improve this skill", "fix a skill description", "why didn't my
  skill trigger", "create an agent", "write a subagent", "agent
  frontmatter", or "write evals for a skill". Also triggers on
  skill structure, progressive disclosure, and skill debugging
  questions. Produces ship-ready skills, agents, and eval sets.
metadata:
  version: 1.0.0
license: MIT
---

# Skill Authoring

> Part of [Cognikit](https://cognikit.com). A kit that gives AI agents cognitive abilities.

A skill is two things: a description that decides whether it ever
loads, and a body that decides whether it helps once loaded. Write
both on purpose. Pushy metadata that names the phrases real users
say, then a lean body of decisions already made so the next agent
never has to re-derive them.

## AI execution flow (follow in order)

1. **Capture intent**: Pin down the one-line job and the trigger
   phrases before writing anything. If the user said "turn this into
   a skill", extract the workflow from the conversation first: the
   steps taken, corrections made, output format produced. Ask only
   for what is missing: what it should do, when it should trigger,
   what the output looks like.
2. **Draft frontmatter**: Write `name` and `description` (rules
   below). The description is the trigger mechanism, so draft it
   before the body, not after.
3. **Write the body**: Follow the Cognikit conventions below:
   execution flow, decision tables, anti-patterns, related skills,
   pre-flight checklist.
4. **Add references only for depth**: If a section is pushing the
   body past ~500 lines or covers a rare case, move it to
   `references/` and leave a pointer in the body saying when to load
   it. Do not create reference files for content that fits the body.
5. **Write evals**: Create `evals/evals.json` with realistic prompts
   and behavior-level assertions (schema below). Skip only when the
   output is purely subjective.
6. **Iterate**: Run the evals, read failures and transcripts, fix by
   generalizing, rerun. Repeat until clean or progress stalls.
7. **Verify**: Run the pre-flight checklist at the bottom.

## Frontmatter rules

The house frontmatter has four fields: `name`, `description`,
`metadata.version`, `license: MIT`.

### name

- Lowercase letters, numbers, hyphens only. 3-50 characters. Starts
  and ends with an alphanumeric.
- Names the capability, not the wrapper: `code-review`, not
  `helper` or `my_agent`.
- Matches the directory name exactly.

### description

The description is always in context; the body is not. It is the
only place "when to use" information can live. Every description
needs BOTH:

1. **What it does**: one clause stating the capability.
2. **Trigger phrases**: quoted strings a real user would type
   ("review my code", "build a dashboard"), plus an "Also triggers
   on" tail for adjacent contexts where the user never names the
   skill.

Stay under ~500 characters. Err toward pushy: skills undertrigger
far more often than they overtrigger. Close with "Produces X" so the
agent knows what the output looks like.

```
Does <capability>. Use when the user asks to "phrase", "phrase",
"phrase". Also triggers on <adjacent contexts>. Produces <output>.
```

Bad: `Helps with skills.` No triggers, no capability, never fires.

## Progressive disclosure

Skills load in three levels. Author for all three consciously.

| Level | Content | Loaded | Budget |
|---|---|---|---|
| 1. Metadata | `name` + `description` | Always, for every skill | ~100 words |
| 2. SKILL.md body | Workflow, tables, checklists | When the skill triggers | Under ~500 lines |
| 3. `references/` | Depth: schemas, long examples, edge cases | On demand, when the body names the file | Effectively unlimited |

The body is the expensive level. It enters context on every
trigger. Keep it lean and push detail down. Conversely, level 3 is
invisible until named: reference each file from the body with
when-to-load guidance, or it does not exist as far as the agent is
concerned. Never duplicate content between levels; pick one home.

## Body conventions (Cognikit house style)

Match the sibling skills, in this order:

1. `# Title`, then the attribution line:
   `> Part of [Cognikit](https://cognikit.com). A kit that gives AI agents cognitive abilities.`
2. One opinionated opening paragraph stating the worldview, the
   principle that organizes everything below.
3. `## AI execution flow (follow in order)`: numbered steps, each
   `**Label**: instruction`. The last step is always
   `**Verify**: Run the pre-flight checklist at the bottom.`
4. Domain sections. Prose for principles, tables for decisions:
   mappings, selection logic, severity rankings, field references.
   If a reader would build the table mentally, write it for them.
5. `## Anti-patterns (never do)`: the specific failure modes this
   domain produces, as bullets.
6. `## Related skills`: `skill-name`: when to escalate or combine.
7. `## Pre-flight checklist`: `- [ ]` items that verify the OUTPUT
   ("every finding has file:line"), not the process ("you scanned
   the file").

Write imperative ("Scan the diff", not "You should scan the diff").
Explain the why behind non-obvious rules instead of stacking MUSTs.
The agent generalizes from reasons; it can only obey orders.

## Review bar

Score a draft against these before shipping:

| Criterion | Pass looks like |
|---|---|
| Conciseness | Every line earns its context cost; nothing restates what code or platform docs already say |
| Actionability | Instructions are executable decisions ("default to a table"), not considerations ("you might consider tables vs prose") |
| Workflow clarity | The execution flow is ordered, and each step says what done looks like |
| Progressive disclosure | The body carries the common case; depth lives in `references/` with load-when pointers |

## Authoring agents

Same idea, different file: YAML frontmatter decides dispatch, the
Markdown body becomes the system prompt.

| Field | Rule |
|---|---|
| `name` | Same as skills: lowercase-hyphens, 3-50 chars |
| `description` | `Use this agent when [conditions]. Typical triggers include [scenario], [scenario], and [scenario].` 2-4 scenarios as prose, covering phrasings where the user never says "agent" |
| `model` | `inherit` unless a specific capability is required |
| `color` | Distinct per agent within the same plugin |
| `tools` | Omit for full access; restrict for least privilege |

System prompt structure, second person: role line ("You are [role]
specializing in [domain]") â†’ responsibilities â†’ numbered process â†’
output format â†’ edge cases â†’ a "When to invoke" section with the
worked scenarios the description summarized.

Full field reference, worked example, and validation rules:
`references/agent-authoring.md`.

## Evals

Every skill gets `evals/evals.json`:

```json
{
  "skill_name": "skill-name",
  "evals": [
    {
      "id": 1,
      "prompt": "the request as a real user would type it",
      "expected_output": "what correct behavior looks like",
      "files": []
    }
  ]
}
```

A good test case:

- **prompt** reads like a real user typed it: lowercase, typos,
  backstory, file names. Include phrasings the description claims to
  catch where the user never names the skill. Skip trivially easy
  prompts; they do not exercise the skill.
- **expected_output** asserts behavior, not wording: what the agent
  does, what it produces, what it must NOT do.

Iterate on failures:

- **Generalize.** A patch that fixes eval 2 and nothing else is
  overfitting. Find the missing principle and write that instead.
- **Keep the prompt lean.** Read transcripts, not just outputs; cut
  instructions that made the agent do unproductive work.
- **Bundle repeated work.** If every eval run rewrites the same
  helper, move it to `scripts/` and point the body at it.

Full eval schema, benchmark metrics, and the validate-fix-rerun
loop: `references/evals-and-benchmarks.md`.

## References

Load only when the task needs depth. Files under `references/`.

| File | What's inside | When to load |
|---|---|---|
| `agent-authoring.md` | Full agent frontmatter spec, description format, system prompt template, worked example, validation rules | When writing or fixing an agent file |
| `evals-and-benchmarks.md` | evals.json schema, grading fields, benchmark aggregation (pass_rate, time, tokens, variance), iteration discipline | When setting up, running, or debugging skill evals |

## Anti-patterns (never do)

- Walls of prose where a table would do. Mappings and selections are
  tables; prose is for principles.
- Duplicating platform or library docs. A skill captures decisions,
  conventions, and workflow, not documentation the agent can
  already reach.
- Vague descriptions that never trigger: "helps with code", "useful
  for documents". If no real user would say the quoted phrase, the
  skill never loads.
- "When to use" buried in the body. Triggering happens in the
  description only; the body is invisible until the skill loads.
- Checklists that restate the execution flow. Checklist items verify
  the output, not the steps already taken.
- SKILL.md bloated past ~500 lines. Depth moves to `references/`;
  the body stays the common case.
- ALL-CAPS MUST/NEVER scaffolding everywhere. Explain the why;
  reserve hard rules for real hazards.
- Ad-hoc patches per eval failure. Generalize the fix or the skill
  only works on the test set.

## Related skills

- `mcp-server`: when the capability is a callable tool, not a
  procedure. Skills instruct, tools act
- `agent-memory`: when the request is persisting a learned
  preference or self-improvement rather than authoring a reusable
  workflow
- `cognikit`: when the new skill is one step of a larger multi-skill
  workflow and needs routing context

## Pre-flight checklist

- [ ] `name` is lowercase-hyphens, 3-50 chars, matches the directory
- [ ] `description` states what it does AND quotes real trigger
  phrases; under ~500 chars
- [ ] Description covers phrasings where the user never names the
  skill (err pushy)
- [ ] "When to use" lives only in the description; the body assumes
  the skill already triggered
- [ ] Body follows house order: attribution line â†’ opening
  paragraph â†’ execution flow â†’ domain sections â†’ anti-patterns â†’
  related skills â†’ pre-flight checklist
- [ ] Execution flow is numbered and ordered, ending in the verify
  step
- [ ] Mappings and selection logic are tables, not paragraphs
- [ ] Every `references/` file is named in the body with
  when-to-load guidance; no content duplicated between levels
- [ ] SKILL.md stays under ~500 lines
- [ ] `evals/evals.json` exists with realistic prompts and
  behavior-level `expected_output` assertions
- [ ] Instructions explain the why; no all-caps MUST scaffolding
- [ ] Anti-patterns name real failure modes, not restated rules
