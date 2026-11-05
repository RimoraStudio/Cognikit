# Skill Authoring

Author, audit, and improve Agent Skills and agent configs against the open SKILL.md standard. Covers pushy trigger descriptions, three-level progressive disclosure, execution-flow body conventions, agent frontmatter, evals.json test cases, benchmark metrics, and the validate-fix-rerun iteration loop.

## When to use

Use it to create or improve an Agent Skill, fix its trigger description, organize references, add evals, or validate skill packaging.

## Install

```sh
npx skills add RimoraStudio/cognikit/tree/main/skills/skill-authoring --global --yes
```

## Package contents

- `SKILL.md`: complete agent instructions
- `references/agent-authoring.md`: detailed guidance loaded when needed
- `references/evals-and-benchmarks.md`: detailed guidance loaded when needed
- `evals/evals.json`: sample prompts for checking skill behavior

## Related skills

- [`code-review`](../code-review/README.md)
- [`mcp-server`](../mcp-server/README.md)
- [`cognikit`](../cognikit/README.md)

## License

MIT. See the repository license.
