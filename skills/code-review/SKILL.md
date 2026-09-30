---
name: code-review
description: >
  Reviews code changes for real bugs, security issues, and convention
  violations, filtered by confidence so only findings that matter get
  reported. Use when the user asks to "review my code", "review this PR",
  "check this diff", "find bugs", "is this safe to merge", "review before
  commit", or wants a second pass on recently written code. Also triggers
  on "code review", "PR review", "pre-merge check", "look for issues in
  this file". Produces findings ranked by severity with file:line
  citations, not style nitpicks.
metadata:
  version: 1.1.0
license: MIT
---

# Code Review

> Part of [Cognikit](https://cognikit.com). A kit that gives AI agents cognitive abilities.

Review code the way a senior engineer reviews a PR: hunt for defects
that will actually hurt, cite exact locations, and stay quiet about
things that do not matter. The output is a short list of high-confidence
findings, not a wall of suggestions.

## AI execution flow (follow in order)

1. **Scope**: Identify what to review. Prefer the diff (`git diff`,
   `git diff main...HEAD`, staged changes) over whole files. If the
   user gives a file list or PR, review those changes only.
2. **Context**: Before judging any line, read enough surrounding code
   to understand intent: callers, callees, types, error contracts,
   and the project's conventions. Do not flag code you have not traced.
3. **Scan**: Walk the changes once for each category below, in order:
   correctness, security, state/concurrency, error handling, then
   project-convention violations.
4. **Filter**: Score every candidate finding against the confidence
   filter. Drop anything below the bar.
5. **Report**: Emit findings in the format below. If nothing survives
   the filter, say so plainly. Do not pad with nitpicks to look busy.
6. **Verify**: Run the pre-flight checklist at the bottom.

## What to look for (in priority order)

### 1. Correctness bugs

- Logic errors: wrong operator, off-by-one, inverted condition, wrong
  variable
- Broken edge cases: empty arrays, null/undefined, zero, negative,
  boundary values
- Type mismatches and unsafe coercions that survive the type checker
- Async bugs: missing `await`, floating promises, race conditions,
  unhandled rejections
- Wrong API usage: deprecated calls, wrong argument order, ignored
  return values

### 2. Security issues

- Injection: SQL, shell, template, path traversal built from user input
- Authz gaps: missing ownership checks on object access (IDOR),
  privileged routes without guards
- Secrets: hardcoded keys, tokens, passwords, or secrets in logs
- Unsafe deserialization, `eval`/`new Function` on external input
- Data exposure: sensitive fields in API responses, verbose errors
  leaking internals to clients

### 3. State and concurrency

- Shared mutable state across requests or threads
- Check-then-act races (read, decide, write without a lock or
  transaction)
- Cache invalidation bugs, stale reads where freshness matters

### 4. Error handling

- Swallowed errors (`catch {}` empty, `.catch(() => {})`)
- Errors that lose context (rethrowing without the cause)
- Missing error paths on external calls that can realistically fail
- User-facing messages that leak stack traces or internals

### 5. Convention violations

- Only flag violations of *this project's* established patterns. Never
  impose outside style rules. If the codebase uses tabs and the diff
  uses spaces, that is a finding. If you merely prefer a different
  pattern, that is not.

## Confidence filter

Report a finding only if it passes ALL of these:

- You can explain exactly what breaks and when
- You traced the code path enough to confirm it is real
- A reasonable engineer would block or request changes for it
- It is not already handled elsewhere in the code

Rank each surviving finding:

| Severity | Meaning |
|---|---|
| `high` | Bug, security hole, or data loss. Blocks merge. |
| `medium` | Real defect with limited blast radius, or a convention break that causes inconsistency. |
| `low` | Worth fixing while in the file. Never more than a few of these. |

## Report format

```
## Findings

### [HIGH] file.ts:142: Title of the bug
One sentence: what is wrong.
One sentence: when it breaks.
One short code snippet or fix sketch if the fix is not obvious.
```

Group by severity, highest first. Number of findings is not a goal.

## Anti-patterns (never do)

- Do not review style preferences the project does not enforce
- Do not suggest refactors unless the current code is actually wrong
- Do not flag missing tests unless the project has a test suite the
  change clearly should have used
- Do not report "potential" issues you could not confirm
- Do not praise the code. The user asked for findings, not validation
- Do not flag code outside the review scope at length. But scope bounds
  what you review, not what you disclose: a real defect you saw outside
  the diff must still be named under "Out of scope". A bug you noticed
  and stayed silent on is a review falsified by omission

## Related skills

- `security-audit`: escalate when findings suggest a deeper adversarial audit (auth flows, injection surface, secrets)
- `api-design`: when the diff adds endpoints, check them against contract conventions first
- `mcp-server`: when reviewing tool definitions or agent-facing interfaces

## Pre-flight checklist

- [ ] Every finding has a file and line reference
- [ ] Every finding passed the confidence filter
- [ ] Severity ranking reflects blast radius, not how it sounds
- [ ] No style-only or preference-only findings
- [ ] Reviewed the diff scope, not the whole codebase
- [ ] If zero findings: stated that plainly with what was checked
