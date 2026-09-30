---
name: api-design
description: >
  Designs REST API endpoints, request/response contracts, error shapes,
  and versioning strategy before implementation. Use when the user asks
  to "design an API", "add an endpoint", "design REST routes", "create
  API contract", "how should this endpoint look", "API versioning",
  "design a resource", "error response format", "pagination design",
  "OpenAPI spec", or is building backend routes for a new feature and
  the contract is not yet fixed. Produces consistent, conventional API
  contracts, not implementation code.
metadata:
  version: 1.0.0
license: MIT
---

# API Design

> Part of [Cognikit](https://cognikit.com). A kit that gives AI agents cognitive abilities.

Design the contract before writing the handler. A good API is boring:
predictable naming, consistent errors, and contracts that do not break
when the product grows.

## AI execution flow (follow in order)

1. **Survey**: Read the existing codebase for API conventions already
   in use: route prefix, error shape, auth method, pagination style.
   New endpoints must match them. Only apply the rules below where no
   convention exists.
2. **Model**: List the resources (nouns) the feature touches and their
   relationships. Avoid verb endpoints; the HTTP method is the verb.
3. **Contract**: Write the endpoint table for the feature (below).
4. **Errors**: Define the error shape and codes.
5. **Edge cases**: Pagination, filtering, idempotency, rate limits for
   write endpoints, and versioning if the API is public.
6. **Present**: Show the contract to the user for approval before
   implementation. Flag any decision that is hard to change later
   (field names, URL structure, auth scheme).
7. **Verify**: Run the pre-flight checklist at the bottom.

## Resource and route conventions

- Plural nouns: `/users`, `/invoices`, `/invoices/:id/line-items`
- HTTP methods carry the action: `GET` read, `POST` create,
  `PATCH` partial update, `PUT` full replace, `DELETE` remove
- Nested resources only one level deep: `/users/:id/orders` is fine,
  `/users/:id/orders/:oid/items` is a smell (flatten with a query
  param: `/items?orderId=x`)
- Actions that do not fit CRUD: `POST /invoices/:id/send`,
  `POST /sessions/:id/revoke`. Prefer a sub-resource verb only when
  the action does not map to a state change on a field

## Response contract

- Return the created/updated resource from `POST`/`PATCH` (`201`/`200`)
- Wrap lists with pagination metadata:

```json
{
  "data": [...],
  "cursor": "eyJpZCI6MTIzfQ==",
  "hasMore": true
}
```

- Cursor pagination for feeds and large tables. Offset pagination only
  for admin/reporting views where page jumping is needed
- Field names: `camelCase` for JSON unless the codebase already uses
  `snake_case`. Never mix.
- IDs and timestamps as strings. Dates as ISO 8601 UTC.

## Error contract

One shape for every error:

```json
{
  "error": {
    "code": "INVOICE_NOT_FOUND",
    "message": "Invoice not found",
    "details": { "invoiceId": "inv_123" }
  }
}
```

Rules:

- `code` is a machine-readable `SCREAMING_SNAKE` constant. Clients
  branch on `code`, never on `message`.
- `message` is human-readable and safe to show users. Never include
  stack traces, SQL errors, or internal paths.
- HTTP status tells the class; `code` tells the specific failure:

| Status | Use for |
|---|---|
| 400 | Malformed request, unreadable body |
| 401 | Missing or invalid credentials |
| 403 | Authenticated but not allowed |
| 404 | Resource does not exist (or is hidden from this user) |
| 409 | Conflict: duplicate, version mismatch, state violation |
| 422 | Well-formed request, semantic validation failed |
| 429 | Rate limited (include `Retry-After`) |
| 500 | Unexpected server failure only |

## Writing rules that prevent regret

- Never expose database internals: no auto-increment IDs in URLs
  (use opaque IDs or UUIDs), no column names in error messages,
  no `?sort=users.created_at` raw field passthrough
- Every write endpoint that clients may retry needs idempotency:
  accept an `Idempotency-Key` header or use natural keys with `409`
- GET endpoints are read-only and safe to retry. No state changes.
- Validate at the boundary, return `422` listing all failures at once,
  not one at a time
- Public APIs get a version prefix (`/v1/`) from day one. Internal
  APIs may skip it, but never mix versioned and unversioned routes.

## Anti-patterns (never do)

- `POST /api/getUser`, `GET /deleteUser?id=5` (verbs in routes)
- `200 OK` with `{ "success": false, "error": "..." }` (errors as
  success responses)
- Different error shapes per endpoint
- Leaking `INSERT INTO users...` or `NullPointerException` to clients
- Array response without pagination wrapper on a collection that grows
- `DELETE` returning the deleted resource's internals

## Related skills

- `code-review`: after implementing the contract, review the handler diff
- `security-audit`: when endpoints touch authz, file upload, or sensitive data
- `mcp-server`: when the same contract needs to be exposed as agent tools

## Pre-flight checklist

- [ ] Routes use nouns and methods carry actions
- [ ] Error shape is identical across all endpoints
- [ ] Every error has a machine-readable `code`
- [ ] List endpoints have pagination
- [ ] No database internals in URLs, fields, or errors
- [ ] New endpoints match existing codebase conventions
- [ ] User approved the contract before implementation
