---
name: mcp-server
description: >
  Designs and builds an MCP (Model Context Protocol) server that exposes
  tools, resources, and prompts to AI agents. Use when the user asks to
  "build an MCP server", "create MCP tools", "expose tools to an agent",
  "MCP server for my API", "add MCP integration", "tool server for Claude",
  or "wrap my API as MCP". Also triggers on "connect my service to an AI
  agent", "MCP tools for Claude Desktop", "give the agent access to my
  data". Produces a runnable server in TypeScript or Python plus client
  config for Claude Desktop or Cursor.
metadata:
  version: 1.0.0
license: MIT
---

# MCP Server

> Part of [Cognikit](https://cognikit.com). A kit that gives AI agents cognitive abilities.

Build an MCP server the way a good API designer builds an API: decide the
deployment model first, design a small set of well-described tools, return
concise structured results, and verify with a real client before shipping.

## AI execution flow (follow in order)

1. **Deployment model**: Pick the transport before writing code. Default
   to local stdio for desktop tools. See "Pick a deployment model" below.
2. **Tool design**: List the 3 to 10 actions the agent actually needs.
   Name them as verbs, write descriptions for the model, and define JSON
   Schema inputs. Compose tools rather than enumerate CRUD.
3. **Scaffold**: Create the file structure below and implement the
   minimal server in TypeScript or Python.
4. **Wire a client**: Add the server to Claude Desktop or Cursor config
   and confirm it appears and calls tools.
5. **Resources and prompts**: Add only if the design needs them. Data and
   context go in resources, reusable templates in prompts.
6. **Test**: Run the MCP inspector and exercise every tool, including
   failure paths.
7. **Verify**: Run the pre-flight checklist at the bottom.

## Pick a deployment model

| Model | Transport | When to use |
|---|---|---|
| Local stdio | `StdioServerTransport` | Default. Tools that run on the user's machine with their credentials: file access, local DBs, CLI wrappers, personal APIs. Claude Desktop and Cursor launch the process per session. |
| Remote HTTP/SSE | Streamable HTTP (or legacy SSE) | Hosted multi-user servers, shared team services, anything that needs OAuth or central state. One process serves many clients over HTTPS. |
| Bundled MCPB | `.mcpb` package wrapping stdio | Distributing a local server to non-technical users. Bundles code plus a manifest into a single installable file. |

Pick stdio unless the user explicitly needs remote access or many users.
Stdio is simpler, needs no auth layer, and inherits the local user's
permissions. Move to HTTP only for hosted, multi-tenant, or team cases.

## Tool design principles

- **Names are verbs**: `get_user`, `search_docs`, `create_ticket`. Never
  `user`, `docs_endpoint`, `tool1`.
- **Descriptions are for the model**: State what the tool does, when to
  use it, what it returns, and its limits. "Searches the docs index and
  returns the top 5 matches with titles and URLs. Use for questions about
  the product. Does not search source code."
- **Inputs are JSON Schema**: Use zod (TypeScript) or type hints plus
  docstrings (Python) so schemas stay honest. Add field descriptions.
- **Return concise structured results**: JSON or short markdown. Truncate
  and paginate large outputs. Return totals so the model knows there is
  more.
- **Errors are messages to the model**: Return `isError: true` with a
  message the model can act on ("No user with id 42", "Query timed out,
  try a narrower filter"), not a stack trace.
- **Keep tool count small**: Compose high-level operations. One
  `search_docs(query, filters)` beats five `search_by_title`,
  `search_by_tag`, etc.

## File structure

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

## Minimal TypeScript server (stdio)

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

## Minimal Python server (FastMCP)

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

## Connecting Claude Desktop or Cursor

Add to `claude_desktop_config.json` (Claude Desktop) or `.cursor/mcp.json`
(Cursor), then restart the client:

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

## Tools vs resources vs prompts

- **Tools** are actions the model can invoke: search, create, update,
  compute. Most servers are mostly tools.
- **Resources** are data and context the client or model reads: a file
  tree, a config document, a live status page. Expose with
  `server.registerResource` (TS) or `@mcp.resource("uri://...")` (Python).
- **Prompts** are reusable prompt templates the user picks from a menu:
  "summarize this ticket", "draft a reply". Expose with
  `server.registerPrompt` or `@mcp.prompt()`.

Rule of thumb: if it changes state or computes, it is a tool. If it is
read-once context, it is a resource. If it is a user-facing template, it
is a prompt.

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
- Do not log to stdout in a stdio server. It corrupts the protocol. Use
  stderr.
- Do not skip input validation. The model will send bad arguments.

## Testing

Run the inspector for an interactive tool-by-tool check:

```bash
npx @modelcontextprotocol/inspector npx tsx src/index.ts
```

Then connect Claude Desktop or Cursor and ask the model to use each
tool. Test the failure paths: bad input, empty results, downstream API
down. Confirm error text reaches the model intact.

## Related skills

- `api-design`: tool schemas follow the same contract discipline as REST endpoints
- `security-audit`: tool servers handling credentials or user data need an audit pass
- `agent-memory`: when tools need to read or write persistent agent memory

## Pre-flight checklist

- [ ] Deployment model chosen deliberately (stdio default, not by habit)
- [ ] Every tool name is a verb and every description is written for the model
- [ ] All inputs validated via zod schemas or typed signatures
- [ ] Tool outputs are concise, structured, and self-explanatory
- [ ] Errors return actionable messages, not stack traces
- [ ] Tool count is small (compose, do not enumerate CRUD)
- [ ] No secrets or internals in tool output; secrets passed via env
- [ ] Nothing written to stdout on a stdio server
- [ ] Verified in MCP inspector and a real client (Claude Desktop or Cursor)
- [ ] Resources and prompts added only where they fit, not by default
