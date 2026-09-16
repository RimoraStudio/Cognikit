# Monorepo Structure

Package roles, pnpm workspace configuration, build pipelines, publish workflows, and CI/CD for a design system monorepo.

## Directory layout

```
design-system/
├── package.json              # Root: scripts, dev tooling
├── pnpm-workspace.yaml       # Workspace config
├── figma.config.json         # Figma Code Connect
├── packages/                 # Published packages
│   ├── tokens/               # Design tokens (DTCG JSON)
│   ├── theme/                # Theme engine (token compilation)
│   ├── react/                # React component library
│   ├── icons/                # Icon library
│   ├── utils/                # Shared utilities
│   └── cli/                  # CLI tooling (optional)
├── apps/                     # Applications (not published)
│   ├── docs/                 # Documentation site
│   └── demo/                 # Demo app
├── scripts/                  # Build scripts (token sync, icon gen)
└── .github/workflows/        # CI (lint, test, drift detect, publish)
```

## pnpm workspace configuration

```yaml
# pnpm-workspace.yaml
packages:
  - "packages/*"
  - "apps/*"
```

```json
// package.json (root)
{
  "name": "@designsystem/root",
  "private": true,
  "scripts": {
    "build": "pnpm -r run build",
    "test": "pnpm -r run test",
    "lint": "pnpm -r run lint",
    "tokens:build": "pnpm --filter @designsystem/tokens run build",
    "tokens:validate": "pnpm --filter @designsystem/tokens run validate",
    "drift:check": "pnpm --filter @designsystem/cli run drift:check",
    "publish": "pnpm -r run publish"
  },
  "devDependencies": {
    "typescript": "^5.4.0",
    "eslint": "^9.0.0",
    "style-dictionary": "^4.0.0"
  }
}
```

## Package roles

| Package | Name | Depends on | Publishes | Build tool |
|---|---|---|---|---|
| tokens | `@designsystem/tokens` | none | DTCG JSON, compiled CSS/Swift/XML/Dart | Style Dictionary v4 |
| theme | `@designsystem/theme` | `@designsystem/tokens` | Theme provider, token compiler | tsup |
| react | `@designsystem/react` | `@designsystem/theme`, `@designsystem/icons`, `@designsystem/utils` | React components | Vite library mode |
| icons | `@designsystem/icons` | none | SVG icons, React icon components | tsup |
| utils | `@designsystem/utils` | none | Shared utilities (clsx wrappers, hooks) | tsup |
| cli | `@designsystem/cli` | `@designsystem/tokens` | Drift scanner, token validator | tsup |

## Inter-package dependencies

All inter-package dependencies use `workspace:*`. This keeps versions in sync and avoids premature publishing during local development.

```json
// packages/react/package.json
{
  "name": "@designsystem/react",
  "version": "1.4.0",
  "dependencies": {
    "@designsystem/theme": "workspace:*",
    "@designsystem/icons": "workspace:*",
    "@designsystem/utils": "workspace:*"
  },
  "peerDependencies": {
    "react": "^18.0.0 || ^19.0.0",
    "react-dom": "^18.0.0 || ^19.0.0"
  }
}
```

When publishing, `workspace:*` is resolved to the actual version number by pnpm automatically.

## Public API surface and internal module restrictions

The public API is the package root export. Internal modules are restricted. Deep imports into `src/` or internal files break the contract and create coupling.

```json
// packages/react/package.json
{
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.mjs",
      "require": "./dist/index.cjs"
    },
    "./package.json": "./package.json"
  }
}
```

### ESLint restricted-imports config

```js
// eslint.config.mjs
export default [
  {
    rules: {
      'no-restricted-imports': ['error', {
        patterns: [
          {
            group: ['@designsystem/react/*', '@designsystem/react/dist/*', '@designsystem/react/src/*'],
            message: 'Use the package root export. Deep imports are not part of the public API.',
          },
          {
            group: ['@designsystem/theme/src/*'],
            message: 'Use @designsystem/theme root export only.',
          },
        ],
      }],
    },
  },
];
```

## Build pipeline per package

Each package builds independently. The root `build` script runs them in topological order via pnpm.

| Package | Build command | Output | Artifacts |
|---|---|---|---|
| tokens | `style-dictionary build` | `build/css/`, `build/ios/`, etc. | Compiled token files |
| theme | `tsup src/index.ts --format esm,cjs --dts` | `dist/` | ESM + CJS + types |
| react | `vite build --lib` | `dist/` | ESM + CJS + types |
| icons | `tsup src/index.ts --format esm,cjs --dts` | `dist/` | ESM + CJS + types |
| utils | `tsup src/index.ts --format esm,cjs --dts` | `dist/` | ESM + CJS + types |
| cli | `tsup src/index.ts --format esm` | `dist/` | ESM binary |

## Publish workflow

### Independent versioning

Each package versions independently. Use when packages have different release cadences (e.g., icons ship more often than react).

```json
// packages/icons/package.json
{ "name": "@designsystem/icons", "version": "1.6.2" }

// packages/react/package.json
{ "name": "@designsystem/react", "version": "1.4.0" }
```

Use `changeset` to manage independent releases:

```json
// .changeset/config.json
{
  "changelog": "@changesets/cli/changelog",
  "commit": false,
  "access": "public",
  "baseBranch": "main",
  "updateInternalDependencies": "patch"
}
```

### Unified versioning

All packages share one version. Use when packages release together (simpler for consumers).

```json
// .changeset/config.json
{
  "fixed": ["@designsystem/tokens", "@designsystem/theme", "@designsystem/react", "@designsystem/icons", "@designsystem/utils"]
}
```

## Documentation site setup

The docs app lives under `apps/docs`. Use a static site generator (Astro, Next.js, or Vitepress).

```
apps/docs/
├── package.json
├── astro.config.mjs
├── src/
│   ├── content/           # MDX docs per component
│   │   ├── components/
│   │   │   └── button.mdx
│   │   └── tokens/
│   ├── pages/
│   └── components/        # Doc site UI (uses design system itself)
└── public/
```

Each component has an MDX file with live examples, props table, accessibility spec, and usage guidance. The docs site consumes the design system packages via `workspace:*`.

## Demo app setup

The demo app proves the system works in a real app context.

```
apps/demo/
├── package.json
├── src/
│   ├── App.tsx
│   ├── routes/            # Demo routes exercising every component
│   └── main.tsx
└── vite.config.ts
```

The demo app imports from `@designsystem/react` exactly as a consumer would. It serves as both a integration test and an onboarding reference.

## CI/CD pipeline structure

```yaml
# .github/workflows/ci.yml
name: CI
on: [pull_request, push]
jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v4
      - run: pnpm install --frozen-lockfile
      - run: pnpm lint
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - run: pnpm install --frozen-lockfile
      - run: pnpm test
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - run: pnpm install --frozen-lockfile
      - run: pnpm build
  drift:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: pnpm install --frozen-lockfile
      - run: pnpm tokens:validate
      - run: pnpm drift:check
      - run: pnpm a11y:audit
```

```yaml
# .github/workflows/release.yml
name: Release
on:
  push:
    branches: [main]
jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: pnpm install --frozen-lockfile
      - run: pnpm build
      - run: pnpm changeset publish
        env:
          NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
```
