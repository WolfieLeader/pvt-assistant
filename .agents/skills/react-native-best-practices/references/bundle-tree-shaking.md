---
title: Tree Shaking
impact: HIGH
tags: tree-shaking, dead-code, metro, repack, esm
---

# Skill: Tree Shaking

Enable dead code elimination to remove unused exports from your JavaScript bundle.

## Quick Config

**Expo SDK 52+:**

```bash
# .env
EXPO_UNSTABLE_METRO_OPTIMIZE_GRAPH=1
EXPO_UNSTABLE_TREE_SHAKING=1
```

```javascript
// metro.config.js
const { getDefaultConfig } = require("expo/metro-config");
const config = getDefaultConfig(__dirname);

config.transformer.getTransformOptions = async () => ({
  transform: {
    experimentalImportSupport: true,
  },
});

module.exports = config;
```

## When to Use

- Bundle contains unused library code
- Using libraries with barrel exports
- Want automatic dead code elimination
- Alternative to manually rewriting all imports

## Prerequisites

- ESM imports (not CommonJS)
- Libraries must declare `"sideEffects": false` in package.json

## Platform Support

| Bundler                  | Tree Shaking | Notes                    |
| ------------------------ | ------------ | ------------------------ |
| Metro                    | No           | Not supported natively   |
| Expo (SDK 52+)           | Experimental | Via env vars + config    |
| metro-serializer-esbuild | Yes          | Drop-in Metro serializer |
| Re.Pack (Webpack/Rspack) | Yes          | Built-in                 |

## Step-by-Step Instructions

### Expo SDK 52+

1. Add environment variables:

```bash
# .env
EXPO_UNSTABLE_METRO_OPTIMIZE_GRAPH=1
EXPO_UNSTABLE_TREE_SHAKING=1
```

2. Configure Metro:

```javascript
// metro.config.js
const { getDefaultConfig } = require("expo/metro-config");
const config = getDefaultConfig(__dirname);

config.transformer.getTransformOptions = async () => ({
  transform: {
    experimentalImportSupport: true,
  },
});

module.exports = config;
```

### Non-Expo (Babel Config)

```javascript
// babel.config.js
module.exports = {
  presets: [
    [
      "module:@react-native/babel-preset",
      {
        disableImportExportTransform: true, // Keep ESM imports
      },
    ],
  ],
};
```

```javascript
// metro.config.js
const config = getDefaultConfig(__dirname);

config.transformer.getTransformOptions = async () => ({
  transform: {
    experimentalImportSupport: true,
  },
});

module.exports = config;
```

### metro-serializer-esbuild

```bash
npm install @rnx-kit/metro-serializer-esbuild
```

```javascript
// metro.config.js
const { createModuleIdFactory } = require("@rnx-kit/metro-serializer-esbuild");

module.exports = {
  serializer: {
    customSerializer: createModuleIdFactory(),
  },
};
```

### Re.Pack

Tree shaking is built-in with Webpack/Rspack. No additional configuration needed.

## How Tree Shaking Works

```tsx
// library.ts
export function used() {
  return "used";
}
export function unused() {
  return "unused";
} // Dead code

// app.ts
import { used } from "./library";
used();
// unused() is never imported -> removed from bundle
```

**Requirements:**

- ESM imports (`import`/`export`)
- CommonJS (`require`/`module.exports`) is NOT tree shakeable
- Library must declare `"sideEffects": false` in package.json

## Platform-Specific Code Removal

Tree shaking can remove platform-specific code:

```tsx
import { Platform } from "react-native";

if (Platform.OS === "ios") {
  // Android build removes this entire block
  doIOSThing();
}
```

**Important**: Must use direct import:

```tsx
// Works with tree shaking
import { Platform } from "react-native";

// Does NOT work
import * as RN from "react-native";
RN.Platform.OS; // Cannot be statically analyzed
```

## Expected Results

Real-world testing on bare React Native Community CLI project:

| Metric             | Reduction                    |
| ------------------ | ---------------------------- |
| Minified JS bundle | ~15% smaller                 |
| Hermes bytecode    | ~5% smaller                  |
| Typical range      | 10-15% bundle size reduction |

## Verification

```bash
# Build production bundle
npx react-native bundle \
  --entry-file index.js \
  --bundle-output output.js \
  --platform ios \
  --dev false --minify true

# Check if unused function exists in bundle
grep "unusedFunction" output.js
# Should return nothing if tree shaking works

# Use source-map-explorer for visual verification
npx source-map-explorer output.js --no-border-checks
```

## Common Pitfalls

- **Using CommonJS**: `require()` prevents tree shaking
- **Missing sideEffects flag**: Libraries without it won't be shaken
- **Namespace imports**: `import * as X` prevents analysis
- **Dev builds**: Tree shaking only applies in production builds
- **Mismatched config**: `disableImportExportTransform` must match `experimentalImportSupport`

## Related Skills

- [bundle-barrel-exports.md](./bundle-barrel-exports.md) - Manual alternative
- [bundle-analyze-js.md](./bundle-analyze-js.md) - Verify tree shaking impact
- [bundle-library-size.md](./bundle-library-size.md) - Check library tree-shakeability
