# Agent Memory

Design persistent memory systems for AI agents. Four-layer architecture (soul rules, learned preferences, working memory, knowledge base), memory write rules, a self-improvement loop that runs as a periodic review process, confidence levels, memory poisoning defenses, and multi-tenant scoping.

## When to use

Use it when designing persistent agent memory, preference learning, memory-write rules, or defenses against poisoned memory.

## Install

```sh
npx skills add RimoraStudio/cognikit/tree/main/skills/agent-memory --global --yes
```

## Package contents

- `SKILL.md`: complete agent instructions
- `evals/evals.json`: sample prompts for checking skill behavior

## Related skills

- [`rag-pipelines`](../rag-pipelines/README.md)
- [`model-distillation`](../model-distillation/README.md)
- [`mcp-server`](../mcp-server/README.md)

## License

MIT. See the repository license.
