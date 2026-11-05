# Cognikit Router

Meta-skill that routes tasks to the right Cognikit skill and sequences multi-skill workflows. Use when a request spans fields or it is unclear which specialist applies.

## When to use

Use it only when a request is ambiguous or spans multiple specialist skills. For a clear single-skill task, invoke that specialist directly. `SKILLS.md` is the human routing map.

## Install

```sh
npx skills add RimoraStudio/cognikit/tree/main/skills/cognikit --global --yes
```

## Package contents

- `SKILL.md`: router instructions and specialist boundaries
- [`../../SKILLS.md`](../../SKILLS.md): human-readable task map and workflows
- [`../../registry.json`](../../registry.json): machine-readable skill and bundle catalog

## Related skills

- [`design-systems`](../design-systems/README.md)
- [`code-review`](../code-review/README.md)
- [`mcp-server`](../mcp-server/README.md)

## License

MIT. See the repository license.
