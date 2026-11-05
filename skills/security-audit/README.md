# Security Audit

Adversarial security review of a codebase. Maps attack surface, checks OWASP Top 10 in priority order (access control, injection, auth, crypto, misconfig, SSRF, XSS, secrets), audits dependency CVEs, and produces severity-ranked findings with exploitability confirmation and remediation. Defensive analysis only.

## When to use

Use it for a dedicated defensive security assessment of a repository, service, auth flow, dependency set, or exposed attack surface.

## Install

```sh
npx skills add RimoraStudio/cognikit/tree/main/skills/security-audit --global --yes
```

## Package contents

- `SKILL.md`: complete agent instructions
- `evals/evals.json`: sample prompts for checking skill behavior

## Related skills

- [`code-review`](../code-review/README.md)
- [`api-design`](../api-design/README.md)
- [`rag-pipelines`](../rag-pipelines/README.md)
- [`mcp-server`](../mcp-server/README.md)

## License

MIT. See the repository license.
