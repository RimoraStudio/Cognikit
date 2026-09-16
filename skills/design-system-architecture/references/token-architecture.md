# Token Architecture

Three-tier token pipeline, DTCG format, Style Dictionary v4, Figma-to-code sync, and multi-platform output.

## Three-tier pipeline

| Tier | Purpose | Naming | Example | When to build |
|---|---|---|---|---|
| Reference (primitive) | Raw values, no opinions | By value description only | `blue.600: #2563EB`, `space.4: 16px` | Always |
| Semantic | Meaning and purpose | By purpose, never value | `color.action.primary: {blue.600}` | Always |
| Component | Scoped to specific UI | By component + slot | `button.bg.primary: {color.action.primary}` | Only when needed (usually after Series C) |

The only tier where value-naming is allowed is the reference tier. Semantic names describe purpose (`color.text.body`), not value (`gray.900`). Most teams before Series C only need tiers 1 and 2.

### Reference tier

```json
{
  "color": {
    "blue": {
      "600": { "$value": "#2563EB", "$type": "color" }
    },
    "gray": {
      "900": { "$value": "#111827", "$type": "color" },
      "100": { "$value": "#F3F4F6", "$type": "color" }
    }
  },
  "space": {
    "2": { "$value": "8px", "$type": "dimension" },
    "4": { "$value": "16px", "$type": "dimension" },
    "8": { "$value": "32px", "$type": "dimension" }
  }
}
```

### Semantic tier

```json
{
  "color": {
    "action": {
      "primary": { "$value": "{color.blue.600}", "$type": "color" },
      "primary.hover": { "$value": "{color.blue.700}", "$type": "color" }
    },
    "text": {
      "body": { "$value": "{color.gray.900}", "$type": "color" },
      "muted": { "$value": "{color.gray.500}", "$type": "color" }
    },
    "surface": {
      "primary": { "$value": "{color.gray.100}", "$type": "color" }
    }
  }
}
```

### Component tier

```json
{
  "button": {
    "bg": {
      "primary": { "$value": "{color.action.primary}", "$type": "color" },
      "primary.hover": { "$value": "{color.action.primary.hover}", "$type": "color" }
    },
    "text": {
      "primary": { "$value": "{color.text.body}", "$type": "color" }
    },
    "padding": {
      "y": { "$value": "{space.2}", "$type": "dimension" },
      "x": { "$value": "{space.4}", "$type": "dimension" }
    }
  }
}
```

## W3C DTCG JSON format

The W3C Design Tokens Community Group format (spec finalized October 2025) is the single source of truth. One token file drives Figma, CSS, iOS, Android, and Flutter without a hand-built translation layer.

Key rules:
- `$value` holds the raw or aliased value.
- `$type` declares the token type (`color`, `dimension`, `fontFamily`, `fontWeight`, `duration`, `cubicBezier`, `shadow`, `border`).
- Aliases use `{path.to.token}` curly brace syntax.
- Groups are plain objects (no `$value`), tokens have `$value`.

```json
{
  "typography": {
    "font.family": {
      "body": { "$value": "Inter, sans-serif", "$type": "fontFamily" }
    },
    "font.size": {
      "body": { "$value": "16px", "$type": "dimension" }
    },
    "font.weight": {
      "regular": { "$value": 400, "$type": "fontWeight" },
      "bold": { "$value": 700, "$type": "fontWeight" }
    }
  }
}
```

## Style Dictionary v4 configuration

Style Dictionary v4 compiles DTCG JSON into platform-specific outputs.

```js
// style-dictionary.config.mjs
import { registerTransform, extend } from 'style-dictionary';

registerTransform({
  name: 'size/pxToRem',
  type: 'value',
  filter: (token) => token.$type === 'dimension',
  transform: (token) => `${parseFloat(token.$value) / 16}rem`,
});

export default extend({
  source: ['tokens/reference.json', 'tokens/semantic.json', 'tokens/component.json'],
  platforms: {
    css: {
      transformGroup: 'css',
      buildPath: 'build/css/',
      files: [{
        destination: 'tokens.css',
        format: 'css/variables',
        options: { outputReferences: true },
      }],
    },
    ios: {
      transformGroup: 'ios-swift',
      buildPath: 'build/ios/',
      files: [{
        destination: 'Tokens.swift',
        className: 'DesignTokens',
        format: 'ios-swift/class.swift',
      }],
    },
    android: {
      transformGroup: 'android',
      buildPath: 'build/android/',
      files: [{
        destination: 'colors.xml',
        format: 'android/colors',
      }],
    },
    flutter: {
      transformGroup: 'flutter-dart',
      buildPath: 'build/flutter/',
      files: [{
        destination: 'tokens.dart',
        format: 'flutter/dart.class',
        className: 'DesignTokens',
      }],
    },
  },
});
```

### Multi-platform output

| Platform | Output format | Example |
|---|---|---|
| CSS | `--color-action-primary: #2563EB;` | CSS custom properties |
| iOS Swift | `static let colorActionPrimary = UIColor(#2563EB)` | Swift class |
| Android XML | `<color name="color_action_primary">#2563EB</color>` | resources/colors.xml |
| Flutter Dart | `static const colorActionPrimary = Color(0xFF2563EB);` | Dart class |

## Figma-to-code sync pipeline

```
Figma (Variables / Tokens Plugin)
  |  export to DTCG JSON
  v
tokens/semantic.json (source of truth)
  |  Style Dictionary v4
  v
build/css/tokens.css, build/ios/Tokens.swift, build/android/colors.xml, build/flutter/tokens.dart
```

Figma Code Connect maps Figma components to code components so design-to-code tools emit system components, not raw divs.

```json
// figma.config.json
{
  "codeConnect": {
    "Button": {
      "import": "import { Button } from '@designsystem/react';",
      "props": {
        "variant": { "figmaPropName": "Variant", "type": "string" },
        "size": { "figmaPropName": "Size", "type": "string" }
      }
    }
  }
}
```

## Token validation rules

Run `tokens:validate` in CI before any build. Rules:

1. Every semantic token must alias a reference token (no raw values in semantic tier).
2. Every component token must alias a semantic token (no reference tokens used directly).
3. No duplicate `$value` entries across the same tier.
4. All `$type` values must be in the allowed set.
5. Dark mode variants must exist for every color semantic token.

```js
// scripts/validate-tokens.mjs
const ALLOWED_TYPES = ['color', 'dimension', 'fontFamily', 'fontWeight', 'duration', 'cubicBezier', 'shadow', 'border'];

function validateToken(token, path, tier) {
  if (!ALLOWED_TYPES.includes(token.$type)) throw new Error(`Invalid $type at ${path}: ${token.$type}`);
  if (tier === 'semantic' && !token.$value.startsWith('{')) throw new Error(`Semantic token ${path} must be an alias`);
  if (tier === 'component' && !token.$value.startsWith('{')) throw new Error(`Component token ${path} must be an alias`);
}
```

## Dark mode token swapping

Dark mode is a token swap, not a rewrite. Define light and dark values for the same semantic token.

```json
{
  "color": {
    "text": {
      "body": {
        "$value": "{color.gray.900}",
        "$type": "color",
        "$extensions": {
          "mode": {
            "light": "{color.gray.900}",
            "dark": "{color.gray.100}"
          }
        }
      }
    }
  }
}
```

CSS output uses `[data-theme]` attribute selectors:

```css
:root, [data-theme="light"] {
  --color-text-body: #111827;
}
[data-theme="dark"] {
  --color-text-body: #F3F4F6;
}
```

## Motion tokens

Motion tokens are first-class, alongside color and type.

```json
{
  "motion": {
    "duration": {
      "fast": { "$value": "150ms", "$type": "duration" },
      "normal": { "$value": "250ms", "$type": "duration" },
      "slow": { "$value": "400ms", "$type": "duration" }
    },
    "easing": {
      "standard": { "$value": [0.4, 0.0, 0.2, 1], "$type": "cubicBezier" },
      "entrance": { "$value": [0.0, 0.0, 0.2, 1], "$type": "cubicBezier" },
      "exit": { "$value": [0.4, 0.0, 1.0, 1.0], "$type": "cubicBezier" }
    },
    "spring": {
      "gentle": {
        "$value": { "stiffness": 180, "damping": 20, "mass": 1 },
        "$type": "spring"
      }
    }
  }
}
```

CSS output:

```css
--motion-duration-fast: 150ms;
--motion-easing-standard: cubic-bezier(0.4, 0.0, 0.2, 1);
```

Always respect `prefers-reduced-motion`. Components must disable or shorten animations when this media query matches.
