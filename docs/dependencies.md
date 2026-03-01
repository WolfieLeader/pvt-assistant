# Dependencies

npm: `npmjs.com/package/{name}`

## Production

- **react**, **react-dom** — UI library and DOM renderer — [docs](https://react.dev) · [gh](https://github.com/facebook/react)
- **react-native** — Native mobile framework — [docs](https://reactnative.dev) · [gh](https://github.com/facebook/react-native)
- **react-native-web** — Run RN components on web — [docs](https://necolas.github.io/react-native-web) · [gh](https://github.com/nicolo-ribaudo/react-native-web)
- **react-native-gesture-handler** — Native touch and gesture system — [docs](https://docs.swmansion.com/react-native-gesture-handler) · [gh](https://github.com/software-mansion/react-native-gesture-handler)
- **react-native-reanimated** — Native thread animations — [docs](https://docs.swmansion.com/react-native-reanimated) · [gh](https://github.com/software-mansion/react-native-reanimated)
- **react-native-worklets** — JS worklets for native threads — [gh](https://github.com/nicolo-ribaudo/react-native-worklets)
- **react-native-screens** — Native navigation primitives — [gh](https://github.com/software-mansion/react-native-screens)
- **react-native-safe-area-context** — Safe area insets provider — [gh](https://github.com/th3rdwave/react-native-safe-area-context)
- **@react-navigation/native**, **bottom-tabs**, **elements** — Navigation framework — [docs](https://reactnavigation.org) · [gh](https://github.com/react-navigation/react-navigation)
- **uniwind** — Fast Tailwind bindings for RN — [docs](https://uniwind.dev) · [gh](https://github.com/nicolo-ribaudo/uniwind)
- **tailwindcss** — Utility-first CSS framework — [docs](https://tailwindcss.com) · [gh](https://github.com/tailwindlabs/tailwindcss)

### Expo — [docs](https://docs.expo.dev)

expo, expo-constants, expo-device, expo-font, expo-glass-effect, expo-image, expo-linking, expo-router, expo-splash-screen, expo-status-bar, expo-symbols, expo-system-ui, expo-web-browser

## Dev

- **typescript** — Static type checker — [docs](https://www.typescriptlang.org) · [gh](https://github.com/microsoft/TypeScript)
- **eslint** ^9 — Code linter (pinned to 9.x; eslint-plugin-react incompatible w/ v10) — [docs](https://eslint.org) · [gh](https://github.com/eslint/eslint)
- **eslint-config-expo** — Expo ESLint preset — [gh](https://github.com/expo/expo)
- **eslint-plugin-unicorn** — Opinionated ESLint rules — [gh](https://github.com/sindresorhus/eslint-plugin-unicorn)
- **prettier** — Code formatter — [docs](https://prettier.io) · [gh](https://github.com/prettier/prettier)
- **@types/react** — React type definitions — [gh](https://github.com/DefinitelyTyped/DefinitelyTyped)

## Planned

```bash
# Production
bun add llama.rn drizzle-orm expo-sqlite zod expo-notifications expo-file-system expo-haptics expo-document-picker expo-image-picker expo-camera nanoid zustand @tanstack/react-query @shopify/flash-list lucide-react-native react-native-svg react-native-mmkv @gorhom/bottom-sheet

# Dev
bun add -d drizzle-kit babel-plugin-inline-import
```

### Library Roles

| Library                     | Role                                                                                |
| --------------------------- | ----------------------------------------------------------------------------------- |
| **zustand**                 | Global state: theme, onboarding status, active model, user settings cache           |
| **@tanstack/react-query**   | Async data: DB queries, mutations, cache invalidation, optimistic updates           |
| **@shopify/flash-list** v2  | All lists (chat, expenses, tasks). New Arch only, auto-sizing, masonry support      |
| **lucide-react-native**     | Consistent icon set across app. Requires `react-native-svg` peer                    |
| **react-native-mmkv**       | Sync key-value: theme pref, onboarding complete flag, last active model ID          |
| **react-native-reanimated** | Already installed. Shared element transitions, spring animations, layout animations |
| **@gorhom/bottom-sheet**    | Bottom sheets for filters, category picker, quick edit, confirmations               |
