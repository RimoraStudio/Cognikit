# Code Review

Review code changes for real bugs, security issues, and convention violations with a confidence filter that suppresses noise. Covers correctness, security, state/concurrency, error handling, and project-convention violations, plus an optional simplicity pass that hunts over-engineering (reinvented stdlib, dead abstractions, unneeded deps) with one-liner findings. Severity-ranked findings with file:line citations, not style nitpicks.

## When to use

Use it before merging or after a refactor to find concrete correctness, security, error-handling, concurrency, or simplicity issues in code changes.

## Install

```sh
npx skills add RimoraStudio/cognikit/tree/main/skills/code-review --global --yes
```

## Package contents

- `SKILL.md`: complete agent instructions
- `evals/evals.json`: sample prompts for checking skill behavior

## Related skills

- [`security-audit`](../security-audit/README.md)
- [`api-design`](../api-design/README.md)
- [`mcp-server`](../mcp-server/README.md)

## License

MIT. See the repository license.
