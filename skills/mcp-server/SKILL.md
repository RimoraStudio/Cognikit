---
name: mcp-server
description: >
  Designs and builds an MCP (Model Context Protocol) server that exposes
  tools, resources, and prompts to AI agents. Use when the user asks to
  "build an MCP server", "create MCP tools", "expose tools to an agent",
  "MCP server for my API", "add MCP integration", "tool server for Claude",
  "wrap my API as MCP", "MCP app with widgets", "package an MCPB bundle",
  or "configure .mcp.json". Also triggers on "connect my service to an AI
  agent", "MCP tools for Claude Desktop", "give the agent access to my
  data". Produces a runnable server in TypeScript or Python plus client
  config for Claude Desktop or Cursor.
metadata:
  version: 1.1.0
license: MIT
---

# MCP Server

> Part of [Cognikit](https://cognikit.com). A kit that gives AI agents cognitive abilities.

Build an MCP server the way a good API designer builds an API: interrogate
the use case first, pick the deployment model before writing code, design
a small set of well-described tools, and verify with a real client before
shipping. Picking the wrong shape early causes painful rewrites later.

## AI execution flow (follow in order)

1. **Discovery**: Ask the Phase 1 questions until the deployment model,
   tool pattern, and auth are all decided. Do not scaffold first.
2. **Design**: Pick a tool pattern, route input and display needs to
   elicitation or widgets, write schemas for the model.
3. **Deployment**: Choose remote HTTP, MCP app, MCPB, or local stdio from
   the decision matrix. Wire the client config.
4. **Build**: Scaffold in TypeScript or Python. Apply the security rules
   that match the chosen model.
5. **Verify**: Exercise every tool in the MCP inspector and a real
   client, then run the pre-flight checklist at the bottom.

## Phase 1: Discovery

Ask these in one batch, adapted to what the user already said. If the
opening message answers them, acknowledge that and skip ahead.

| Question | What the answer decides |
|---|---|
| What does it connect to? | Cloud API points to remote HTTP. Local files, desktop apps, localhost services, or OS state require MCPB. Pure computation can go either way; default remote. |
| Who uses it? | Just the user or their own team: local stdio is acceptable. Anyone who installs it: remote HTTP, or MCPB only if it must be local. |
| How many distinct actions? | Under ~15 is one tool per action. Dozens to hundreds needs the search + execute pattern. |
| Mid-call input or rich display? | Confirm or short-form input uses elicitation. Charts, searchable pickers, live dashboards use MCP app widgets. Neither returns plain text or JSON. |
| What auth does upstream use? | None or API key: straightforward. OAuth 2.0: needs a remote HTTP server that can run the flow. |

State the recommendation in one opinionated sentence once the answers are
in. Wrong-shape servers get rewritten; the extra question is cheaper.

## Phase 2: Design

### Pick a tool pattern

| Pattern | When | Shape |
|---|---|---|
| One tool per action | Under ~15 operations | `create_issue`, `search_issues`, `add_comment`. The model reads the list once and knows everything possible. Required when tools bind widgets. |
| Search + execute | Dozens to hundreds of endpoints | Two tools: `search_actions(intent)` returns matching actions with IDs and parameter schemas; `execute_action(id, params)` runs one. The catalog stays server-side and the context window stays lean. |
| Hybrid | Large API with a few hot paths | Promote the 3 to 5 most-used actions to dedicated tools; keep the long tail behind search + execute. |

Tool schemas land directly in the model's context window. Every tool you
add is prompt text the model pays attention to on every call.

### Tool design principles

- **Names are verbs**: `get_user`, `search_docs`, `create_ticket`. Never
  `user`, `docs_endpoint`, `tool1`.
- **Descriptions are for the model**: state what the tool does, when to
  use it, what it returns, and its limits. "Searches the docs index and
  returns the top 5 matches with titles and URLs. Use for questions about
  the product. Does not search source code."
- **Inputs are JSON Schema**: use zod (TypeScript) or type hints plus
  docstrings (Python) so schemas stay honest. Add field descriptions.
- **Return concise structured results**: JSON or short markdown. Truncate
  and paginate large outputs. Return totals so the model knows there is
  more.
- **Errors are messages to the model**: return `isError: true` with a
  message the model can act on ("No user with id 42", "Query timed out,
  try a narrower filter"), not a stack trace.
- **Keep tool count small**: compose high-level operations. One
  `search_docs(query, filters)` beats five `search_by_title`,
  `search_by_tag`, etc.

### Elicitation vs widgets

| Need | Elicitation | Widget |
|---|---|---|
| Confirm yes/no | yes | overkill |
| Pick from a short enum | yes | overkill |
| Fill a flat form (name, email, date) | yes | overkill |
| Pick from a large or searchable list | no | yes |
| Visual preview, chart, map, diff | no | yes |
| Live-updating progress | no | yes |

Elicitation is spec-native: the server sends a flat JSON schema mid-tool
and the host renders a native form, with zero UI code. Always check the
client's elicitation capability first and keep a text fallback; host
support is still rolling out. Widgets are iframe-sandboxed HTML resources
served via `@modelcontextprotocol/ext-apps`. Both patterns with code:
`references/ui-widgets.md`.

### Framework

| Framework | Use when |
|---|---|
| Official TypeScript SDK (`@modelcontextprotocol/sdk`) | Default. Best spec coverage, first to get new features. |
| FastMCP 3.x (`fastmcp` on PyPI) | Python preferred, or wrapping a Python library. Decorator-based, low boilerplate. Not the frozen FastMCP 1.0 bundled in the `mcp` package. |

Both produce identical wire protocol. If the user already has a stack, go
with it.

### Tools vs resources vs prompts

- **Tools** are actions the model invokes: search, create, update,
  compute. Most servers are mostly tools.
- **Resources** are data the client or model reads: a file tree, a config
  document, live status. `server.registerResource` (TS) or
  `@mcp.resource("uri://...")` (Python).
- **Prompts** are reusable templates the user picks from a menu:
  "summarize this ticket". `server.registerPrompt` or `@mcp.prompt()`.
- **Sampling** lets the server request LLM inference mid-tool. Rare; only
  when tool logic itself needs a model.

Rule of thumb: if it changes state or computes, it is a tool. If it is
read-once context, it is a resource. If it is a user-facing template, it
is a prompt.

## Phase 3: Deployment model

### Decision matrix

| Scenario | Model |
|---|---|
| Wrap a cloud API for many users or installs | Remote streamable-HTTP server |
| Cloud API plus interactive pickers, charts, dashboards | MCP app (remote HTTP serving UI resources) |
| Must touch the user's machine (files, desktop apps, OS APIs) and users lack a toolchain | MCPB bundled local server |
| Must be local but drives UI widgets | MCP app packaged as MCPB |
| Personal tool or prototype on the user's own machine | Local stdio |

Defaults: local stdio for single-user desktop tools, remote HTTP for
anything shared or installed by strangers. Remote wins for cloud APIs:
zero install friction, one deployment serves everyone, OAuth flows work
properly, and you control upgrades. Choose MCPB only when the code must
run on the user's machine; a cloud API shipped as MCPB takes on
local-security burden for zero benefit.

### Transports and auth

| Type | Transport | Best for | Auth |
|---|---|---|---|
| stdio | child process | local tools, custom servers | env vars |
| Streamable HTTP | HTTPS | hosted services, multi-user | OAuth or bearer token |
| SSE | HTTPS (legacy) | older hosted servers | OAuth |
| WebSocket | WSS | real-time streams | tokens |

### Client configuration

Claude Desktop (`claude_desktop_config.json`) or Cursor
(`.cursor/mcp.json`), then restart the client:

```json
{
  "mcpServers": {
    "docs-server": {
      "command": "npx",
      "args": ["tsx", "C:/abs/path/my-mcp-server/src/index.ts"],
      "env": { "DOCS_API_KEY": "..." }
    }
  }
}
```

Python variant: `"command": "python", "args": ["C:/abs/path/server.py"]`.
Use absolute paths and pass secrets via `env`, never hardcode them.

Remote servers take a `type` and `url` instead of `command`:

```json
{
  "api-service": {
    "type": "http",
    "url": "https://api.example.com/mcp",
    "headers": { "Authorization": "Bearer ${API_TOKEN}" }
  }
}
```

### Plugin integration (Claude Code)

Bundle MCP servers in a plugin via `.mcp.json` at the plugin root
(preferred; scales to multiple servers) or an `mcpServers` field in
`plugin.json` (simple single-server plugins):

```json
{
  "db-tools": {
    "command": "${CLAUDE_PLUGIN_ROOT}/servers/db-server",
    "env": { "DB_URL": "${DB_URL}" }
  }
}
```

- `${CLAUDE_PLUGIN_ROOT}` expands to the installed plugin directory.
  Always use it for portability; never hardcode absolute paths.
- `${VAR}` pulls from the user's environment. Document every required
  variable in the plugin README.
- Plugin tools are auto-prefixed `mcp__plugin_<plugin>_<server>__<tool>`.
  Pre-allow specific names in command frontmatter (`allowed-tools`),
  never wildcards.
- Servers connect lazily on first tool use; `/mcp` lists live servers.
  Restart the host after config changes.

Remote scaffold, OAuth patterns, and all four server types in depth:
`references/deployment.md`.

## Phase 4: Build and security

### File structure

```
my-mcp-server/
  src/
    index.ts        # server entry, registers tools, connects transport
    tools/
      search.ts     # one file per logical tool group
    resources.ts    # optional
  package.json
  tsconfig.json
```

Dependencies for TypeScript: `@modelcontextprotocol/sdk`, `zod`.
Python: `mcp` (includes FastMCP) or `fastmcp`.

### Minimal TypeScript server (stdio)

```ts
// src/index.ts
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const server = new McpServer({
  name: "docs-server",
  version: "1.0.0",
});

server.registerTool(
  "search_docs",
  {
    description:
      "Searches the product docs index. Returns up to `limit` matches " +
      "with title, URL, and a short excerpt. Use for product questions.",
    inputSchema: {
      query: z.string().describe("Search text, e.g. 'reset password'"),
      limit: z.number().int().min(1).max(20).default(5)
        .describe("Max results to return"),
    },
  },
  async ({ query, limit }) => {
    const results = await searchIndex(query, limit); // your logic
    if (results.length === 0) {
      return {
        content: [{ type: "text", text: `No docs matched "${query}".` }],
      };
    }
    return {
      content: [{ type: "text", text: JSON.stringify(results, null, 2) }],
    };
  }
);

const transport = new StdioServerTransport();
await server.connect(transport);
```

```json
// package.json (key fields)
{
  "type": "module",
  "scripts": { "start": "tsx src/index.ts" }
}
```

### Minimal Python server (FastMCP)

```py
# server.py
from mcp.server.fastmcp import FastMCP

mcp = FastMCP("docs-server")

@mcp.tool()
def search_docs(query: str, limit: int = 5) -> list[dict]:
    """Search the product docs index.

    Args:
        query: Search text, e.g. "reset password".
        limit: Max results to return (1-20).

    Returns the top matches with title, URL, and a short excerpt.
    Use for product questions, not source code.
    """
    limit = max(1, min(limit, 20))
    return search_index(query, limit)  # your logic

if __name__ == "__main__":
    mcp.run()  # stdio transport by default
```

The docstring becomes the tool description. Write it for the model.

### Packaging as MCPB

An MCPB is a zip containing `manifest.json`, the server code, and bundled
dependencies. The host launches `server.mcp_config.command` over stdio,
so tool code needs no changes.

```json
{
  "manifest_version": "0.4",
  "name": "local-files",
  "version": "0.1.0",
  "server": {
    "type": "node",
    "entry_point": "server/index.js",
    "mcp_config": {
      "command": "node",
      "args": ["${__dirname}/server/index.js"],
      "env": { "ROOT_DIR": "${user_config.rootDir}" }
    }
  },
  "user_config": {
    "rootDir": { "type": "directory", "title": "Root directory", "required": true }
  },
  "compatibility": { "platforms": ["darwin", "win32", "linux"] }
}
```

- `${__dirname}` resolves inside the bundle. `${user_config.<key>}`
  substitutes install-time settings the host collects from the user.
- `user_config` fields render in the host's install UI. `type:
  "directory"` gives a native folder picker; `sensitive: true` stores
  the value in the OS keychain. Env var names pass through verbatim with
  no auto-prefix.
- Build: `npx esbuild src/index.ts --bundle --platform=node
  --outfile=server/index.js` then `npx @anthropic-ai/mcpb pack`. Python:
  `pip install -t server/vendor -r requirements.txt` and prepend
  `server/vendor` to `sys.path`.
- Test the packed bundle on a machine without your dev toolchain.

Full manifest schema and pipeline detail: `references/deployment.md`.

### Local security rules (stdio and MCPB)

There is no sandbox. A local MCP server runs with the user's full
privileges and the manifest has no permissions block, so least privilege
is enforced in your code or nowhere.

- Validate every file path against an allowlisted root. Resolve the
  absolute path and reject anything escaping it, including `..` and
  symlink hops, before touching disk.
- Allowlist spawned commands and their arguments. Never interpolate a
  model-supplied string into a shell.
- Prefer `roots/list` over a hardcoded root when the host supports it;
  it returns directories the user has approved.
- Pass secrets via `env` or `user_config` sensitive fields. Never
  hardcode them or echo them in tool output.
- On remote servers always serve HTTPS or WSS, never plain HTTP or WS.

## Testing

Run the inspector for an interactive tool-by-tool check:

```bash
npx @modelcontextprotocol/inspector npx tsx src/index.ts
```

Then connect Claude Desktop or Cursor and ask the model to use each
tool. Test the failure paths: bad input, empty results, downstream API
down. Confirm error text reaches the model intact.

For MCPB: `npx @anthropic-ai/mcpb validate` checks the manifest,
`npx @anthropic-ai/mcpb pack` builds the bundle, and the inspector can
poke `node server/index.js` directly over stdio.

## Anti-patterns (never do)

- Do not expose raw CRUD as 50 tools. Compose into a few intent-level
  tools the model can reason about.
- Do not return huge responses. Truncate, paginate, and state the total.
- Do not write tools that require a human to narrate results. The output
  text IS the interface; make it self-explanatory.
- Do not put secrets, tokens, or internal errors in tool output. The
  model may echo them to the user.
- Do not invent capabilities the server does not have. If a tool cannot
  do something, say so in the description.
- Do not log to stdout on a stdio server. It corrupts the protocol. Use
  stderr.
- Do not skip input validation. The model will send bad arguments.
- Do not ship a cloud-API wrapper as MCPB or bare stdio. Local packaging
  is a tax paid only for real local access.
- Do not hardcode absolute paths in plugin MCP config. Use
  `${CLAUDE_PLUGIN_ROOT}`.
- Do not use wildcard `allowed-tools` for plugin MCP tools. Name each
  tool.
- Do not fetch widget scripts from CDNs. The iframe CSP blocks them;
  inline the bundle instead.
- Do not scaffold before Phase 1 is answered. Wrong deployment models
  cause rewrites, not refactors.

## Related skills

- `api-design`: tool schemas follow the same contract discipline as REST endpoints
- `security-audit`: tool servers handling credentials or user data need an audit pass
- `agent-memory`: when tools need to read or write persistent agent memory

## Reference files

- `references/deployment.md`: transports, remote scaffold, plugin
  integration, auth patterns, full MCPB manifest and build pipeline
- `references/ui-widgets.md`: elicitation pattern, widget registration,
  the App class API, bundle inlining, CSP sandbox, host theming

## Pre-flight checklist

- [ ] Discovery questions answered before any code was written
- [ ] Deployment model chosen deliberately from the matrix, not by habit
- [ ] Tool pattern matches the action surface (one-per-action vs search + execute)
- [ ] Every tool name is a verb and every description is written for the model
- [ ] All inputs validated via zod schemas or typed signatures
- [ ] Tool outputs are concise, structured, and self-explanatory
- [ ] Errors return actionable messages, not stack traces
- [ ] Elicitation used for flat input; widgets only where they earn the cost
- [ ] Client config written: absolute paths for stdio, HTTPS/WSS URLs for remote
- [ ] Plugin servers use `${CLAUDE_PLUGIN_ROOT}` and named `allowed-tools`
- [ ] MCPB bundles tested on a machine without a dev toolchain
- [ ] Local servers validate paths and allowlist spawns; no sandbox assumed
- [ ] No secrets or internals in tool output; secrets passed via env
- [ ] Nothing written to stdout on a stdio server
- [ ] Verified in MCP inspector and a real client (Claude Desktop or Cursor)
- [ ] Resources and prompts added only where they fit, not by default
