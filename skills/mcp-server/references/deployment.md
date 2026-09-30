# Deployment

Deep reference for Phase 3 of the mcp-server skill. Covers transports,
client and plugin configuration, authentication, and the full MCPB
packaging pipeline. Read this when the decision matrix in SKILL.md is not
enough to act on.

## Choosing a deployment model, expanded

| Model | Transport | Install friction | Auth story | Reach |
|---|---|---|---|---|
| Remote streamable HTTP | HTTPS | User adds a URL, done | OAuth, DCR, token storage all work properly | Claude Desktop, Claude Code, claude.ai, third-party hosts |
| MCP app | HTTPS (or stdio inside MCPB) | Same as remote, plus widget templates | Same as remote | Any host implementing the apps surface |
| MCPB | stdio inside a bundle | User drags one file onto the client | env vars and install-time `user_config` | Local client only |
| Local stdio | child process | User needs the right runtime (Node/Python) and correct config | env vars | Local client only |

Rules:

- Remote HTTP is the default recommendation for anything wrapping a
  cloud API. One deployment serves all users and you control upgrades.
- MCPB is the sanctioned way to ship a server that must run locally.
  Pay the packaging tax only for real local access: filesystem, desktop
  apps, localhost services, OS APIs, hardware.
- Bare stdio is a personal-tool and prototype path. Distribution is
  painful: users need the runtime, you cannot push updates, and the only
  real channel is a plugin or manual config. Flag the MCPB upgrade path
  whenever you scaffold it for someone else.

## Remote HTTP scaffold

Portable Node host using Express plus the official SDK:

```ts
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport }
  from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import express from "express";

const server = new McpServer({ name: "my-server", version: "1.0.0" });
// ... register tools here ...

const app = express();
app.use(express.json());
app.post("/mcp", async (req, res) => {
  // Stateless mode: new transport per request. Add a sessionIdGenerator
  // and a transport map if you need per-session state.
  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
  });
  res.on("close", () => transport.close());
  await server.connect(transport);
  await transport.handleRequest(req, res, req.body);
});
app.listen(process.env.PORT ?? 3000);
```

FastMCP (Python) serves the same endpoint with
`mcp.run(transport="streamable-http")`. Cloudflare Workers is the fastest
zero-to-URL deploy for TS servers.

## Server types in client config

### stdio (local process)

```json
{
  "filesystem": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-filesystem", "/allowed/path"],
    "env": { "LOG_LEVEL": "debug" }
  }
}
```

The client spawns and manages the process, communicates over
stdin/stdout, and terminates it on exit. Use for filesystem access,
local databases, custom servers, and npm-packaged servers.

### SSE (Server-Sent Events, legacy hosted)

```json
{
  "asana": {
    "type": "sse",
    "url": "https://mcp.asana.com/sse"
  }
}
```

For hosted servers that still expose SSE. OAuth is handled by the host;
the user is prompted in a browser on first use.

### HTTP (streamable or REST-style)

```json
{
  "api-service": {
    "type": "http",
    "url": "https://api.example.com/mcp",
    "headers": {
      "Authorization": "Bearer ${API_TOKEN}",
      "X-Custom-Header": "value"
    }
  }
}
```

For token-authenticated remote servers and stateless interactions.

### WebSocket (real-time)

```json
{
  "realtime-service": {
    "type": "ws",
    "url": "wss://mcp.example.com/ws",
    "headers": { "Authorization": "Bearer ${TOKEN}" }
  }
}
```

For streaming, persistent connections, and server push.

Always use `https://` or `wss://`. Plain `http://` or `ws://` leaks
tokens and tool payloads.

## Plugin integration (Claude Code)

### Config placement

- `.mcp.json` at the plugin root: preferred. Separates server config
  from plugin metadata and scales to multiple servers.
- `mcpServers` field inside `plugin.json`: acceptable for a single
  simple server.

### Environment variable expansion

- `${CLAUDE_PLUGIN_ROOT}` expands to the installed plugin directory.
  Use it for every file reference so the plugin works on any machine.
- `${VAR}` inside `env` or `headers` pulls from the user's environment.
  Document every required variable in the plugin README.

```json
{
  "database-tools": {
    "command": "${CLAUDE_PLUGIN_ROOT}/servers/db-server",
    "args": ["--config", "${CLAUDE_PLUGIN_ROOT}/config.json"],
    "env": { "DB_URL": "${DB_URL}" }
  }
}
```

### Tool naming and permissions

Plugin server tools are auto-prefixed:

`mcp__plugin_<plugin-name>_<server-name>__<tool-name>`

Example: plugin `asana`, server `asana`, tool `create_task` becomes
`mcp__plugin_asana_asana__asana_create_task`.

Pre-allow specific tools in command frontmatter:

```markdown
---
allowed-tools: [
  "mcp__plugin_asana_asana__asana_create_task",
  "mcp__plugin_asana_asana__asana_search_tasks"
]
---
```

Never use `mcp__plugin_asana_asana__*` wildcards in shipped commands;
they silently allow every tool the server ever adds.

### Lifecycle

1. Plugin loads, MCP config is parsed.
2. stdio servers are spawned, or SSE/HTTP/WS connections are negotiated.
3. Tools are discovered and registered under the prefixed names.
4. Servers connect lazily on first tool use; not all connect at startup.
5. `/mcp` lists every live server including plugin-provided ones.

Config changes require a host restart. Use `claude --debug` to watch
connection attempts, tool discovery, and auth flows.

## Authentication patterns

- **OAuth (SSE/HTTP)**: the host runs the flow automatically; the user
  authenticates in a browser on first use and the host manages tokens.
  For your own remote server, support OAuth with CIMD or DCR so
  arbitrary clients can register.
- **Token headers (HTTP/WS)**: `"Authorization": "Bearer ${API_TOKEN}"`
  in `headers`. Static bearer tokens are fine for private deployments;
  directory listing requires OAuth or authless.
- **env vars (stdio)**: everything the server needs arrives via `env`.
  Document them; the user sets them in their config or shell.

Never hardcode tokens in config files, never commit them, never echo
them in tool output.

## MCPB packaging

An `.mcpb` file is a zip:

```
my-server.mcpb
├── manifest.json           identity, entry point, config schema, compat
├── server/
│   ├── index.js            bundled server code
│   └── node_modules/       bundled or vendored dependencies
└── icon.png
```

The host reads `manifest.json`, launches `server.mcp_config.command` as
a stdio server, and pipes messages. Tool code is identical to a plain
stdio server.

### Manifest schema (v0.4)

```json
{
  "$schema": "https://raw.githubusercontent.com/anthropics/mcpb/main/schemas/mcpb-manifest-v0.4.schema.json",
  "manifest_version": "0.4",
  "name": "local-files",
  "version": "0.1.0",
  "description": "Read, search, and watch files on the local filesystem.",
  "author": { "name": "Your Name" },
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
    "rootDir": {
      "type": "directory",
      "title": "Root directory",
      "description": "Directory to expose. Defaults to ~/Documents.",
      "default": "${HOME}/Documents",
      "required": true
    },
    "apiKey": {
      "type": "string",
      "title": "API key",
      "sensitive": true,
      "required": false
    }
  },
  "compatibility": {
    "claude_desktop": ">=1.0.0",
    "platforms": ["darwin", "win32", "linux"]
  }
}
```

Field rules:

- `server.type`: `node`, `python`, or `binary`. Informational only; the
  real launch comes from `server.mcp_config`.
- `server.entry_point`: bundle-relative path to the main file.
- `server.mcp_config`: the literal command/args/env to spawn.
  `${__dirname}` resolves inside the bundle. `${user_config.<key>}`
  substitutes install-time values. Env var names pass through verbatim;
  there is no auto-prefix, so your code reads exactly what `env` says.
- `user_config`: install-time settings rendered in the host UI.
  `type: "directory"` renders a native folder picker; `type: "string"`
  a text field. `sensitive: true` stores the value in the OS keychain
  instead of plain config. `required`, `default`, `title`,
  `description` control the UI.
- `compatibility.platforms`: `darwin`, `win32`, `linux`. Only claim
  platforms you actually bundled dependencies for.

### Build pipeline

Node:

```bash
npm install
npx esbuild src/index.ts --bundle --platform=node --outfile=server/index.js
# Or copy node_modules wholesale if native deps resist bundling.
npx @anthropic-ai/mcpb pack
```

Python:

```bash
pip install -t server/vendor -r requirements.txt
# Prepend server/vendor to sys.path in the entry script.
npx @anthropic-ai/mcpb pack
```

`mcpb pack` zips the directory and validates `manifest.json` against
the schema. Native extensions must be built per target platform; avoid
native deps where possible.

Full CLI loop:

```bash
npx @anthropic-ai/mcpb init              # interactive manifest, first time
npx @modelcontextprotocol/inspector node server/index.js   # poke tools
npx @anthropic-ai/mcpb validate          # schema-check manifest
npx @anthropic-ai/mcpb pack              # build the bundle
npx @anthropic-ai/mcpb sign dist/my.mcpb # sign for distribution
```

Install by dragging the `.mcpb` onto Claude Desktop. Test on a machine
without your dev toolchain; "works on my machine" failures almost
always trace to a dependency that was never bundled.

## Local security patterns

MCPB has no sandbox and no manifest-level permissions block. The server
runs with the installing user's full privileges. Every control below is
implemented in your tool handlers or it does not exist.

- **Path confinement**: resolve the candidate path to an absolute real
  path, then verify it sits under the configured root. Reject `..`
  traversal and symlink escapes before any read or write.
- **Spawn allowlisting**: keep a fixed list of permitted commands and
  validate arguments against it. Never pass model-supplied text to a
  shell or `exec`.
- **roots/list**: when the host supports it, prefer the spec-native
  `roots` capability over a hardcoded `ROOT_DIR`; it returns
  directories the user already approved in the client.
- **Least privilege**: request only the directories, commands, and
  network origins the tools genuinely need. Scope every config value to
  the smallest useful surface.
- **Secret handling**: collect secrets through `user_config` fields
  marked `sensitive` or through `env`, never through tool parameters.
  Never echo them in results or logs.
- **stdout discipline**: on stdio transports, log to stderr only. Any
  byte on stdout corrupts the protocol stream.
