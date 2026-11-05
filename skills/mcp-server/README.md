# MCP Server

Design and build Model Context Protocol servers that expose tools, resources, and prompts to AI agents. Discovery-first design phase, deployment decision matrix (remote HTTP / MCP app / MCPB bundled / stdio), tool design patterns, elicitation vs widget routing, .mcp.json plugin integration, MCPB manifest and bundling, local security rules, runnable TypeScript and Python examples, and inspector testing.

## When to use

Use it to design or build an MCP server that exposes tools, resources, prompts, or interactive widgets to agents.

## Install

```sh
npx skills add RimoraStudio/cognikit/tree/main/skills/mcp-server --global --yes
```

## Package contents

- `SKILL.md`: complete agent instructions
- `references/deployment.md`: detailed guidance loaded when needed
- `references/ui-widgets.md`: detailed guidance loaded when needed
- `evals/evals.json`: sample prompts for checking skill behavior

## Related skills

- [`api-design`](../api-design/README.md)
- [`security-audit`](../security-audit/README.md)
- [`agent-memory`](../agent-memory/README.md)

## License

MIT. See the repository license.
