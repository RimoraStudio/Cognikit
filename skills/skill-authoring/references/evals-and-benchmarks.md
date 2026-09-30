# Evals and Benchmarks Reference

Depth for the "Evals" section of SKILL.md. Load when setting up,
running, or debugging skill evals.

## evals.json

Lives at `evals/evals.json` inside the skill directory:

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

- `prompt`: realistic phrasing: lowercase, typos, backstory, real
  file or column names. Include phrasings where the user never names
  the skill, since that is what the description must catch. Skip
  trivially easy prompts: a request the model handles fine without
  the skill tests nothing.
- `expected_output`: behavior-level assertion: what the agent does,
  produces, and must NOT do. Assert the shape and the discipline,
  not exact wording.
- `files`: fixture paths the eval needs, or `[]`.
- `assertions` (optional extension): objectively checkable
  conditions with descriptive names, added when grading is
  automated. Do not force assertions onto subjective output
  (writing style, design quality), grade those qualitatively.

## Per-run files

When running evals into a workspace organized by iteration
(`iteration-1/eval-0/...`):

`eval_metadata.json` per test case:

```json
{
  "eval_id": 0,
  "eval_name": "descriptive-name-here",
  "prompt": "the user task prompt",
  "assertions": []
}
```

`timing.json` per run: capture token and duration data at
completion time, it is not persisted elsewhere:

```json
{ "total_tokens": 84852, "duration_ms": 23332, "total_duration_seconds": 23.3 }
```

`grading.json` per run: the expectations array uses exactly these
field names (`text`, `passed`, `evidence`); other variants break
downstream tooling:

```json
{
  "expectations": [
    { "text": "emits findings with file:line citations", "passed": true, "evidence": "..." }
  ]
}
```

Prefer a checking script over eyeballing for assertions that are
programmatically verifiable, which is faster and repeatable across iterations.

## Benchmark aggregation

Aggregate each iteration into `benchmark.json` comparing
configurations. Metrics per configuration:

| Metric | Meaning |
|---|---|
| `pass_rate` | Fraction of assertions passed |
| `time` | Wall-clock duration per run |
| `tokens` | Total tokens consumed per run |
| variance | Mean Â± stddev across runs; the delta between configurations |

Always run **with-skill and baseline in the same turn** so they
finish together. Baseline for a new skill is no skill at all;
baseline for an improvement is a snapshot of the previous version.
Put each with-skill result before its baseline in the report.

Analyst pass, patterns aggregate stats hide:

- Assertions that pass in every configuration are
  non-discriminating; they measure nothing.
- High-variance evals are flaky or underspecified; fix the eval or
  the skill's ambiguity, not the run.
- A skill that raises pass_rate but doubles tokens may be
  instructing the agent to do unproductive work; read transcripts.

## The validate-fix-rerun loop

1. **Validate** the draft mechanically first: frontmatter parses,
   `name` matches the directory, every referenced file exists,
   description has both capability and trigger phrases.
2. **Run** all evals, with-skill and baseline, capturing timing.
3. **Read failures and transcripts**, not just final outputs. The
   transcript shows where instructions were ignored, misread, or
   caused wasted work.
4. **Fix by generalizing.** Identify the missing principle and write
   it. A patch worded to fix one eval is overfitting; the skill must
   work on prompts nobody wrote yet.
5. **Keep the prompt lean.** Cut instructions that did not change
   behavior or caused unproductive work. When every run rewrites the
   same helper script, bundle it under `scripts/` instead of
   re-teaching it.
6. **Rerun** into a new iteration directory and compare against the
   previous iteration, not just the baseline.

Stop when feedback is empty, the user is satisfied, or iterations
stop producing meaningful change.

## Trigger evals (description optimization)

Separately from behavior evals, test triggering itself: ~20 queries
split into `should_trigger` and near-miss `should_not_trigger` cases.
Negatives must share keywords with the skill but genuinely belong
elsewhere. An obviously irrelevant query tests nothing.
