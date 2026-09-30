---
name: security-audit
description: >
  Audits a codebase for exploitable security issues: broken access
  control, injection, auth failures, crypto misuse, misconfiguration,
  SSRF, XSS, leaked secrets, and vulnerable dependencies. Use when the
  user asks for a "security audit", "check for vulnerabilities",
  "OWASP review", "find security issues", "is my code secure",
  "audit auth", "penetration test my app", "review security of this
  endpoint", or wants a defensive assessment before shipping. Produces
  severity-ranked findings with file:line citations and remediations.
  Defensive analysis only: it traces exploitability but never builds
  weaponized exploits.
metadata:
  version: 1.1.0
license: MIT
---

# Security Audit

> Part of [Cognikit](https://cognikit.com). A kit that gives AI agents cognitive abilities.

Audit a codebase the way an attacker reads it: start at the entry
points, follow untrusted input to the dangerous sinks, and report
only what you can trace. The output is a short list of real,
exploitable findings, not a dump of everything that looks suspicious.

This is a defensive activity. You describe impact and remediation.
You do not write exploit payloads.

## AI execution flow (follow in order)

1. **Scope**: Identify what to audit. Prefer the diff (`git diff`,
   `git diff main...HEAD`, staged changes) when the user asks about a
   change. Use the whole repo only when asked for a full audit. If the
   user names files, routes, or a feature, audit those only.
2. **Map the attack surface**: Enumerate entry points before reading
   line by line (section below). Rank them by exposure and data
   sensitivity so audit time goes where it matters.
3. **Scan**: Walk each prioritized entry point against the OWASP
   checklist below, in order. Follow untrusted input from source to
   sink.
4. **Trace**: For every candidate finding, trace the full path from
   attacker-controlled input to impact. If you cannot trace it, it is
   not a finding yet.
5. **Dependencies**: Run the ecosystem's audit command and record
   only reachable, relevant CVEs.
6. **Report**: Emit findings in the format below, ranked by severity.
7. **Verify**: Run the pre-flight checklist at the bottom.

## Step 1: Map the attack surface

Build the entry-point list first. Do not read code linearly.

- HTTP routes and handlers: grep for route registration
  (`router.get`, `app.post`, `@app.route`, `@RequestMapping`,
  `http.HandleFunc`, `addRoute`)
- Auth boundaries: middleware, decorators, guards
  (`@RequireAuth`, `authenticate`, `isAdmin`, `permission`)
- File uploads and parsers: multipart handlers, image/PDF processing,
  archive extraction
- Outbound calls: HTTP clients, fetch, SDK calls to third parties
- Background jobs and consumers: queue handlers, cron tasks, webhook
  receivers
- Places where raw input crosses trust boundaries: query params,
  request bodies, headers, cookies, env vars

Prioritize by:

1. Internet-facing, unauthenticated endpoints (highest)
2. Authenticated endpoints touching auth, payments, PII, files
3. Admin and privileged routes
4. Internal tooling, jobs, low-sensitivity reads (lowest)

## Step 2: OWASP checks in priority order

Work top to bottom. Higher items are more likely to be real and
exploitable in most codebases.

### 1. Broken access control / IDOR

- Object access by ID with no ownership or permission check:
  `GET /orders/:id` returning any user's order
- Privileged routes missing guards: admin endpoints reachable by any
  authenticated user, or no auth at all
- Trust in client-supplied role/tenant fields: `req.body.orgId`,
  `req.user.isAdmin` set from the request
- Check: for every handler that reads `req.params.id` or
  `req.body.<id>`, confirm an ownership or role check exists before
  the fetch, not after

```ts
// Vulnerable
const order = await db.orders.find(req.params.id);
return res.json(order);

// Safe
const order = await db.orders.find(req.params.id);
if (!order || order.userId !== req.user.id) return res.status(404).end();
```

### 2. Injection

Trace every string that reaches a query, shell, template, or path
from user input.

- SQL: string concatenation or interpolation into queries instead of
  parameters
- Shell/command: `exec`, `spawn`, `os.system`, `ProcessBuilder` with
  user input
- Path traversal: `path.join(base, req.query.name)` without
  normalization and containment checks
- Template: rendering user input as a template (SSTI), not as data
- ORM raw escape hatches: `.raw()`, `.where("... " + x)`, `$where`

```ts
// Vulnerable
db.query(`SELECT * FROM users WHERE id = ${req.params.id}`);
exec(`convert ${req.query.file} out.png`);
res.sendFile(path.join(UPLOADS, req.query.name));

// Safe
db.query('SELECT * FROM users WHERE id = ?', [req.params.id]);
execFile('convert', [validatedName, 'out.png']);
const p = path.resolve(UPLOADS, req.query.name);
if (!p.startsWith(UPLOADS + path.sep)) return res.status(400).end();
```

### 3. Auth failures

- Login, password reset, and token endpoints with no rate limiting or
  lockout
- Session tokens that never expire, never rotate, or survive logout
- Tokens in URLs or logs (query string tokens get logged everywhere)
- Password reset tokens that are predictable or reusable
- JWT verification that skips signature or expiry checks
  (`alg: none`, `verify` disabled, decode-only reads)

### 4. Crypto failures

- Password hashing with MD5, SHA1, or plain SHA256 instead of
  bcrypt, scrypt, or argon2
- Hardcoded encryption keys, IVs, or salts in source
- `Math.random()`, `rand()`, or timestamps for tokens, session IDs,
  or reset codes (must use `crypto.randomBytes` / `secrets` /
  `SecureRandom`)
- Reused or static IVs in AES-CBC; ECB mode anywhere
- Custom crypto: homegrown hashing, encoding-as-encryption (Base64)

### 5. Security misconfiguration

- Debug flags on in production paths: `DEBUG=true`, `debug=True`,
  Flask `debug=True`, `NODE_ENV` not production
- Verbose errors to clients: stack traces, SQL errors, internal paths
  in responses
- Permissive CORS: `Access-Control-Allow-Origin: *` combined with
  credentials, or reflecting `Origin` unchecked
- Default credentials shipped: `admin/admin`, seeded passwords in
  code or migrations
- Missing security headers where the project already sets them
  (consistency check, not a style preference)

### 6. SSRF, deserialization, eval

- Server-side fetch of a user-supplied URL with no allowlist:
  `fetch(req.body.url)`, webhook testers, URL preview features.
  Confirm whether internal ranges (`169.254.169.254`, `localhost`,
  RFC1918) are blocked
- Unsafe deserialization: `pickle.loads`, `yaml.load` (not
  `safe_load`), Java `ObjectInputStream`, `unserialize` on
  attacker-controlled bytes
- `eval`, `new Function`, `exec` on external input in any language

### 7. XSS

- Unescaped user data into HTML: `innerHTML`, `dangerouslySetInnerHTML`,
  `|safe`, `html_safe`, raw `<%= %>` in templates
- User input into JS contexts: building `<script>` content, `href`
  with `javascript:` URLs
- Only flag it if you traced user-controlled data to the sink.
  Sanitized or framework-escaped output is not a finding.

### 8. Secrets and sensitive data

- Hardcoded keys, tokens, passwords. Run these greps:

```
git grep -nE '(api[_-]?key|secret|token|password|passwd|private[_-]?key)\s*[:=]\s*["'"'"'][^"'"'"']+'
git grep -nE '(AKIA[0-9A-Z]{16}|-----BEGIN [A-Z ]*PRIVATE KEY-----|ghp_[0-9a-zA-Z]{36}|sk-[0-9a-zA-Z]{20,}|xox[baprs]-[0-9a-zA-Z-]{10,})'
git grep -nE 'console\.(log|error)\(.*(token|password|secret|key)'
```

- Secrets in client bundles: check `env` exposure to frontend builds,
  `.env` files copied into Docker images or shipped assets
- Sensitive fields in API responses: password hashes, tokens, full
  PII where a subset would do
- Secrets in git history: `git log -p | grep` on the patterns above
  for files already deleted

## Step 3: Dependency CVEs

Run the audit tool for each ecosystem present:

| Ecosystem | Command |
|---|---|
| Node | `npm audit --json` or `pnpm audit` |
| Python | `pip-audit` or `safety check` |
| Ruby | `bundle audit` |
| Go | `govulncheck ./...` |
| Rust | `cargo audit` |
| Java | `mvn org.owasp:dependency-check-maven:check` or `gradle dependencyCheckAnalyze` |
| PHP | `composer audit` |

Report a dependency CVE only when:

- The vulnerable package is actually used (the vulnerable function or
  code path is reachable), or reachability cannot be ruled out and the
  severity is critical
- It is not already noted as accepted risk in the repo

Do not dump the whole CVE list. Summarize the rest in one line:
"N other advisories, none reachable in audited paths."

## Confidence filter

Report a finding only if ALL of these hold:

- You traced attacker-controlled input to the dangerous operation
- You can describe the concrete impact (what an attacker gains)
- It is in scope (within the diff or the named area)
- It is not already mitigated by middleware, validation, or framework
  behavior you confirmed exists
- A reasonable engineer would act on it

Mark each finding one of:

- `Confirmed exploitable`: full path traced, no mitigations found
- `Needs verification`: pattern looks vulnerable but a runtime detail
  (config value, upstream validation) could not be confirmed in code

## Report format

```
## Security findings

### [CRITICAL] src/routes/orders.ts:42 - Title
Status: Confirmed exploitable / Needs verification
What: one sentence on the vulnerability.
Trace: entry point -> sink (e.g. req.params.id -> db.orders.find).
Impact: one sentence on what an attacker gains.
Remediation: concrete fix, code sketch if not obvious.
```

Severity guide:

| Severity | Meaning |
|---|---|
| `critical` | Unauthenticated RCE, auth bypass, mass data exposure |
| `high` | Privileged IDOR, injection with auth, leaked live secrets |
| `medium` | XSS needing specific conditions, weak crypto in use, missing rate limit on auth |
| `low` | Hardening gaps with a real but narrow attack path |

Group by severity, highest first. If nothing survives the filter,
say what was checked and stop. Do not pad.

## Anti-patterns (never do)

- Do not report theoretical issues you could not trace to a real
  input source. "This could be vulnerable" is not a finding.
- Do not dump every dependency CVE. Report reachable ones, summarize
  the rest in one line.
- Do not flag code outside the audit scope at length. One line under
  "Out of scope" at most. But scope bounds what you audit, not what you
  disclose: a critical issue you saw outside scope must still be named
  there. A vulnerability you noticed and stayed silent on is an audit
  falsified by omission.
- Do not write weaponized exploit code, payloads, or attack scripts.
  Describe the impact and the fix.
- Do not flag framework defaults the project did not override and you
  did not confirm are active (e.g. "no CSRF protection" when the
  framework provides it).
- Do not report style-level hardening advice as findings. A missing
  header with no concrete attack path is low at best, usually noise.
- Do not paraphrase severity upward. An IDOR on a public resource is
  not critical.

## Related skills

- `code-review`: lighter-weight pass when a full audit is overkill
- `api-design`: to fix contract-level authz or error-leak findings at the design layer
- `rag-pipelines`: multi-tenant isolation findings map to its retrieval-layer rules
- `mcp-server`: when the attack surface includes agent tool endpoints

## Pre-flight checklist

- [ ] Audit scope defined (diff, feature, or whole repo) and respected
- [ ] Attack surface mapped before line-by-line reading
- [ ] Every finding has file:line and a traced input-to-sink path
- [ ] Every finding marked Confirmed exploitable or Needs verification
- [ ] Severity reflects real impact, not how it sounds
- [ ] Dependency CVEs filtered to reachable/relevant only
- [ ] No hardcoded secret values reproduced in the report (cite location only)
- [ ] Defensive only: no exploit payloads written
- [ ] If zero findings: stated what was checked plainly
