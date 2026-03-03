---
name: uniwind
description: Uniwind styling API for React Native — className, withUniwind, theming, data selectors, platform styles. Use when styling components, wrapping 3rd-party libs, configuring themes, or using CSS variables.
---

# Uniwind

## References

Consult these resources as needed:

```
references/
  api-reference.md    Full API reference — hooks, HOCs, theming, component bindings, platform selectors
```

## Styling Priority (best → worst)

1. **`className` prop** — Tailwind classes on Uniwind-supported components. Compile-time, most performant.
2. **`withUniwind(Component)`** — Wraps 3rd-party components to add `className` support.
3. **`useResolveClassNames(classes)`** — Converts Tailwind string → RN style object at runtime.
4. **`useCSSVariable(name)`** — Raw CSS variable value. Use sparingly.

## withUniwind

Adds `className` support to any component. Auto-maps props containing "style" or "color":

- `style` → `className`
- `color` → `colorClassName`
- `backgroundColor` → `backgroundColorClassName`

Custom mappings:

```tsx
withUniwind(Component, {
  stroke: { fromClassName: "strokeClassName", styleProperty: "accentColor" },
});
```

**Define at module level** — never inside render. Wrap once, use everywhere.

## Hooks

- `useUniwind()` → `{ theme, hasAdaptiveThemes }` — current theme info
- `useResolveClassNames(classes)` → RN style object — for libs accepting only `style` prop
- `useCSSVariable(name)` → value — supports array syntax for batch reads

## Theming

- CSS vars in `src/global.css` with `@variant dark` for dark mode
- `@theme static` for JS-only tokens (no Tailwind utilities generated)
- `Uniwind.setTheme('dark'|'light'|'system')` — programmatic switch
- `ScopedTheme` component — theme boundary for subtree
- `light-dark(lightVal, darkVal)` CSS function for inline theme-aware values

## Data Selectors

Style by props: `data-[prop=value]:utility`

- Only equality selectors supported (`data-[prop=value]`)
- No presence-only (`data-[prop]`) or other operators

## Platform Styles

Prefixes: `ios:`, `android:`, `web:`, `native:` (iOS + Android)

## Color Props

Use `accent-` prefix for non-style color properties:

```tsx
<Icon colorClassName="accent-blue-500 dark:accent-blue-400" />
```

## Component Bindings

Key auto-mapped className props:

- **TextInput**: `className`, `cursorColorClassName`, `placeholderTextColorClassName`
- **FlatList**: `className`, `contentContainerClassName`, `columnWrapperClassName`
- **Switch**: `thumbColorClassName`, `trackColorOnClassName`, `trackColorOffClassName`
- **Image**: `className`, `colorClassName`

## Safe Area

`p-safe`, `m-safe`, `inset-safe` + `*-safe-or-*` (max of inset/value) + `*-safe-offset-*` (inset + value)

## CSS Functions

`hairlineWidth()`, `fontScale()`, `pixelRatio()`, `light-dark(l, d)` — available in global.css
