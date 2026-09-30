# UI Widgets and Elicitation

Deep reference for the input-and-display decisions in Phase 2 of the
mcp-server skill. Covers spec-native elicitation, interactive widget
resources via `@modelcontextprotocol/ext-apps`, the App class API, the
mandatory bundle-inlining step, and the iframe sandbox rules. The UI
layer is additive: underneath it is still tools, resources, and the same
wire protocol.

## When a widget beats plain text

Do not add UI for its own sake; most tools are fine returning text or
JSON. Add a widget only when one of these is true:

| Signal | Widget type |
|---|---|
| Tool needs structured input the model cannot reliably infer | Form |
| User must pick from a list the model cannot rank (files, contacts, records) | Picker or table |
| Destructive or billable action needs explicit confirmation | Confirm dialog |
| Output is spatial or visual (charts, maps, diffs, previews) | Display widget |
| Long-running job the user wants to watch | Progress or live status |

## Elicitation vs widgets

Elicitation is spec-native and zero UI code. Route there first.

| Need | Elicitation | Widget |
|---|---|---|
| Confirm yes/no | yes | overkill |
| Pick from a short enum | yes | overkill |
| Fill a flat form (name, email, date) | yes | overkill |
| Pick from a large or searchable list | no (no scroll or search) | yes |
| Visual preview before choosing | no | yes |
| Chart, map, or diff view | no | yes |
| Live-updating progress | no | yes |

## Elicitation pattern

The server sends a flat JSON schema mid-tool; the host renders a native
form and returns the user's input. Host support is still rolling out, so
always check `clientCapabilities.elicitation` and keep a fallback:

```ts
const caps = server.getClientCapabilities?.() ?? {};

if (caps.elicitation) {
  const res = await server.elicitInput({
    message: "Pick a target environment",
    requestedSchema: {
      type: "object",
      properties: {
        env: { type: "string", enum: ["staging", "prod"] },
      },
      required: ["env"],
    },
  });
  // res: { action: "accept" | "decline" | "cancel", content?: {...} }
} else {
  // Fallback: ask the model to ask the user, or require the arg.
}
```

Rules:

- Schemas must be flat objects with primitive fields. No nesting, no
  arrays of objects, no large enums.
- Always handle `decline` and `cancel` actions, not just `accept`.
- The SDK throws if the client does not advertise the capability;
  check first, then fall back to requiring the input as a tool arg.

## Widget registration

A widget-enabled tool has two separate registrations:

1. The tool declares a UI resource via `_meta.ui.resourceUri` and its
   handler returns plain text or JSON, never the HTML.
2. The resource is registered separately and serves the HTML.

The host sees `_meta.ui.resourceUri`, fetches the resource, renders it
in an iframe sandbox, and pipes the tool result in via `ontoolresult`.

```ts
import { registerAppTool, registerAppResource, RESOURCE_MIME_TYPE }
  from "@modelcontextprotocol/ext-apps/server";

// 1. Tool returns DATA and declares which UI renders it.
registerAppTool(server, "pick_contact", {
  description: "Open an interactive contact picker",
  annotations: { title: "Pick Contact", readOnlyHint: true },
  inputSchema: { filter: z.string().optional() },
  _meta: { ui: { resourceUri: "ui://widgets/contact-picker.html" } },
}, async ({ filter }) => {
  const contacts = await db.contacts.search(filter);
  return { content: [{ type: "text", text: JSON.stringify(contacts) }] };
});

// 2. Resource serves the HTML.
registerAppResource(
  server, "Contact Picker", "ui://widgets/contact-picker.html", {},
  async () => ({
    contents: [{
      uri: "ui://widgets/contact-picker.html",
      mimeType: RESOURCE_MIME_TYPE,
      text: pickerHtml,
    }],
  }),
);
```

- `ui://` is convention; the URI just has to match between the two
  registrations.
- The mime type must be `RESOURCE_MIME_TYPE`
  (`"text/html;profile=mcp-app"`). That is how the host knows to render
  an interactive iframe instead of showing the source.
- Claude-specific `_meta.ui.*` keys: `visibility: ["app"]` hides a
  widget-only helper tool from the tool list; `prefersBorder: false`
  drops the host card border; `csp.{connectDomains, resourceDomains,
  baseUriDomains}` declares external origins (default is block-all and
  `frameDomains` is restricted).

## App class API

Inside the iframe, the widget talks to the host through `App` from the
inlined ext-apps bundle. It is a persistent bidirectional connection;
the widget stays alive for the conversation.

```html
<script type="module">
  /*__EXT_APPS_BUNDLE__*/
  const { App } = globalThis.ExtApps;

  const app = new App({ name: "ContactPicker", version: "1.0.0" }, {});

  // Set handlers BEFORE connecting.
  app.ontoolresult = ({ content }) => {
    render(JSON.parse(content[0].text));
  };

  await app.connect();

  function onPick(contact) {
    app.sendMessage({
      role: "user",
      content: [{ type: "text", text: `Selected: ${contact.id}` }],
    });
  }
</script>
```

| Method | Direction | Use for |
|---|---|---|
| `app.ontoolresult = fn` | host to widget | Receive the tool's return value |
| `app.ontoolinput = fn` | host to widget | Receive the args the model passed |
| `app.sendMessage({...})` | widget to host | Inject a message into the conversation |
| `app.updateModelContext({...})` | widget to host | Update context silently, no visible message |
| `app.callServerTool({name, arguments})` | widget to server | Call another tool on your server |
| `app.openLink({url})` | widget to host | Open a URL; sandbox blocks `window.open` |
| `app.getHostContext()` / `app.onhostcontextchanged` | host to widget | Theme, CSS vars, `containerDimensions`, `displayMode`, `safeAreaInsets` |
| `app.requestDisplayMode({mode})` | widget to host | Ask for `inline`, `pip`, or `fullscreen` |
| `app.downloadFile({name, mimeType, content})` | widget to host | Host-mediated download, base64 content |
| `new App(info, caps, {autoResize: true})` | - | Iframe height tracks rendered content |

`sendMessage` is the typical "user picked something, tell the model"
path. `updateModelContext` is for state the model should know but the
chat should not show. `openLink` is required for outbound navigation;
`window.open` and `<a target="_blank">` are blocked by the sandbox.

## Bundle inlining is mandatory

The iframe's CSP blocks CDN script fetches, so
`import { App } from "https://esm.sh/..."` renders a blank widget. The
server must inline `@modelcontextprotocol/ext-apps/app-with-deps` into
the widget HTML at startup, replacing the `/*__EXT_APPS_BUNDLE__*/`
placeholder:

```ts
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

const bundle = readFileSync(
  require.resolve("@modelcontextprotocol/ext-apps/app-with-deps"), "utf8",
).replace(/export\{([^}]+)\};?\s*$/, (_, body) =>
  "globalThis.ExtApps={" +
  body.split(",").map((p) => {
    const [local, exported] = p.split(" as ").map((s) => s.trim());
    return `${exported ?? local}:${local}`;
  }).join(",") + "};",
);

const pickerHtml = readFileSync("./widgets/picker.html", "utf8")
  .replace("/*__EXT_APPS_BUNDLE__*/", () => bundle);
```

## Sandbox constraints

Widgets cannot:

- Access the host page's DOM, cookies, or storage.
- Call arbitrary network origins; CSP restricts connections, so route
  external calls through `callServerTool`.
- Open popups or navigate directly; use `app.openLink`.
- Load remote images reliably; inline them as `data:` URLs server-side.

CSP violations are the number one cause of silently blank widgets. Open
the iframe's own devtools console when debugging; the main console
shows nothing.

## Host theming and safe areas

- Read `app.getHostContext()?.theme` after `connect()` and subscribe to
  `app.onhostcontextchanged` for live updates.
- Keep colors in CSS custom properties with a `:root.dark` override
  block, toggle a `.dark` class on `<html>`, and set `color-scheme`.
- Disable `mix-blend-mode: multiply` in dark mode; it makes images
  vanish.
- Honor `hostContext.safeAreaInsets` (`top/right/bottom/left` in px)
  for notches and the composer overlay.

## Design rules that prevent rewrites

- **One widget per tool.** A picker picks, a chart displays. Split
  would-be mega-widgets into multiple tools with focused widgets.
- **Mention the widget in the tool description.** The model only sees
  the description when choosing tools; "opens an interactive picker" is
  what makes it reach for the tool.
- **Widgets degrade automatically.** Hosts without the apps surface
  ignore `_meta.ui` and show the tool's text content. Since the handler
  already returns meaningful JSON, the fallback is free.
- **Read-only widgets must not block.** A display-only widget (chart,
  preview) should return its data plus a text summary in the same
  result so the model can keep reasoning.
- **Fork layout by item count, not tool count.** One tool taking
  `items[]` with `items.length === 1` rendering detail view and more
  rendering a list beats two tools.
- **Put the model's reasoning in the payload.** A short `note` field per
  item rendered as a callout shows users why each option was chosen.
  Name the field in the tool description so the model fills it.
- **Normalize images server-side.** Rewrite wildly varying aspect
  ratios to a predictable variant before inlining, then give the image
  container a fixed `aspect-ratio` with `object-fit: contain`.

## Testing widgets

Claude Desktop lacks a native `"type": "http"` config on some builds;
wrap with `mcp-remote` and force `http-only` so the SSE probe does not
swallow widget-capability negotiation:

```json
{
  "mcpServers": {
    "my-server": {
      "command": "npx",
      "args": ["-y", "mcp-remote", "http://localhost:3000/mcp",
               "--allow-http", "--transport", "http-only"]
    }
  }
}
```

Desktop caches UI resources aggressively. After editing widget HTML,
fully quit (not just close the window) and relaunch.

Headless JSON-RPC loop for fast iteration:

```bash
# test.jsonl: one JSON-RPC message per line
{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2025-06-18","capabilities":{},"clientInfo":{"name":"t","version":"0"}}}
{"jsonrpc":"2.0","method":"notifications/initialized"}
{"jsonrpc":"2.0","id":2,"method":"tools/list"}
{"jsonrpc":"2.0","id":3,"method":"tools/call","params":{"name":"your_tool","arguments":{}}}

(cat test.jsonl; sleep 10) | npx mcp-remote http://localhost:3000/mcp --allow-http
```

The `sleep` keeps stdin open long enough to collect all responses.

Browser dev loop: serve the inlined widget HTML on a plain GET route
with a fake `ExtApps` shim that fires `ontoolresult` from a query
param, then iterate in a normal browser tab with ordinary devtools:

```ts
app.get("/widget-preview", (_req, res) => {
  const shim = `globalThis.ExtApps={applyHostStyleVariables:()=>{},App:class{
    constructor(){this.h={}} ontoolresult;onhostcontextchanged;
    async connect(){const p=new URLSearchParams(location.search).get("payload");
      if(p)this.ontoolresult?.({content:[{type:"text",text:p}]});}
    getHostContext(){return{theme:"light"}}
    sendMessage(m){console.log("sendMessage",m)} updateModelContext(){}
    callServerTool(){return Promise.resolve({content:[]})} openLink(){} downloadFile(){}
  }};`;
  res.type("html").send(widgetHtml.replace("/*__EXT_APPS_BUNDLE__*/", shim));
});
```

Finally, verify the text fallback in a host without the apps surface
(or MCP Inspector) so non-widget clients still get usable output.
