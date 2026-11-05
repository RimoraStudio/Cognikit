# Component Catalog Workflow

Use this workflow when a user requests a component catalog, reusable inventory,
or implementation-ready catalog entries. Do not create catalog artifacts for a
one-off component refinement.

## Source structure

Keep the registry small and put each component's detailed contract and code in
its own folder:

```text
catalog/
  registry.json
  components/<component>/
    component.tsx
    preview.tsx
    metadata.json
    notes.md
```

`registry.json` lists the product and stable component IDs with paths to each
file. `metadata.json` owns the purpose, design concept, semantics, variants,
states, interactions, accessibility, responsive rules, and verification notes.
Keep `component.tsx` and `preview.tsx` focused on that component. `notes.md`
records caveats and decisions that do not belong in the metadata contract.
The small examples embed CSS to remain self-contained; when integrating them,
move styling into the host project's existing stylesheet or CSS module and
load shared rules once.

The TSX catalog examples are React-specific. Preserve or add a separate
`examples/<component>/` HTML/CSS/JavaScript example when a framework-neutral,
runnable demonstration is useful. Link both formats instead of copying one
implementation into the other.

## Build and validate

From the skill package root, run:

```sh
node scripts/validate-catalog.mjs
node scripts/build-catalog.mjs
```

Validation checks the registry, metadata, unique IDs/reference codes, required
component files, safe local paths, and shell assets. The build aggregates the
registry and metadata into `catalog-shell/catalog.json`, with source paths for
the viewer's code panel. Serve `catalog-shell/` over HTTP to use the viewer;
browser `fetch()` commonly fails on `file://` URLs.

Render catalog values as text. Treat registry paths and source content as data,
not executable HTML or script. Keep generated `catalog-shell/catalog.json`
derived from the registry and metadata; do not edit it by hand.
