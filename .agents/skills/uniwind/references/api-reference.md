# Uniwind API Reference

## Styling Priority

1. **`className` prop** — Tailwind classes on Uniwind-supported components. Compile-time optimized.
2. **`withUniwind(Component)`** — HOC adding `className` support to any component.
3. **`useResolveClassNames(classes)`** — Runtime Tailwind → RN style conversion.
4. **`useCSSVariable(name)`** — Raw CSS variable access. Use sparingly.

---

## className Prop

All Uniwind-bound RN components accept `className` with Tailwind utilities:

```tsx
<View className="flex-1 p-4 bg-background">
  <Text className="text-lg font-semibold text-text">Hello</Text>
</View>
```

Standard Tailwind utilities supported: layout, spacing, sizing, typography, colors, borders, effects, flexbox, positioning, transforms.

**Not supported in RN:** hover, visited, before/after pseudo-elements, floats, CSS Grid.

---

## withUniwind(Component, mappings?)

Higher-order component that adds `className` support to any React Native component.

### Auto-mapped props

Props containing "style" or "color" are automatically mapped:

- `style` → `className`
- `color` → `colorClassName`
- `backgroundColor` → `backgroundColorClassName`
- `tintColor` → `tintColorClassName`

### Custom mappings

```tsx
const StyledComponent = withUniwind(Component, {
  stroke: { fromClassName: "strokeClassName", styleProperty: "accentColor" },
});
```

### Usage rules

- **Define at module level** for reuse and performance
- Never call inside render functions or hooks
- Wrap once, import everywhere

### Lucide Icons example

```tsx
import { X as LucideX } from "lucide-react-native";
import { withUniwind } from "uniwind";
export const X = withUniwind(LucideX);
// Usage: <X size={20} colorClassName="text-text" />
```

---

## useResolveClassNames(classes)

Converts Tailwind class string → React Native style object at runtime.

```tsx
import { useResolveClassNames } from "uniwind";

const style = useResolveClassNames("p-4 bg-blue-500 rounded-lg");
// Returns: { padding: 16, backgroundColor: '#3b82f6', borderRadius: 8 }
```

**Use when:** 3rd-party lib accepts only `style` prop, complex style composition, config objects.

---

## useCSSVariable(name)

Retrieves CSS variable values in JavaScript.

```tsx
import { useCSSVariable } from "uniwind";

// Single variable
const primary = useCSSVariable("--color-primary");

// Array syntax (single subscription, better perf)
const [primary, secondary] = useCSSVariable(["--color-primary", "--color-secondary"]);
```

**Use sparingly.** Only for:

- Raw values needed in JS logic
- 3rd-party lib configs needing string values
- Runtime calculations with design tokens

Variables must be used in a `className` or defined in `@theme static` to be available.

---

## useUniwind()

Returns current theme info:

```tsx
const { theme, hasAdaptiveThemes } = useUniwind();
// theme: 'light' | 'dark' | custom theme name
// hasAdaptiveThemes: boolean
```

---

## Uniwind Static Methods

- `Uniwind.setTheme('dark' | 'light' | 'system')` — Programmatic theme switch
- `Uniwind.updateCSSVariables()` — Runtime CSS variable modification

---

## ScopedTheme

Applies a different theme to a subtree without changing global theme:

```tsx
import { ScopedTheme } from "uniwind";

<ScopedTheme theme="dark">
  <Card /> {/* Uses dark theme regardless of global setting */}
</ScopedTheme>;
```

Nested scopes override parent scopes.

---

## Data Selectors

Style based on component props:

```tsx
<View className="data-[active=true]:bg-primary data-[active=false]:bg-muted" data-active={isActive}>
```

**Only equality selectors supported:** `data-[prop=value]`
**Not supported:** `data-[prop]` (presence-only), other operators

---

## Platform Selectors

```tsx
<View className="ios:bg-blue-500 android:bg-green-500 web:bg-red-500" />
<Text className="native:text-lg web:text-base" />
```

- `ios:` — iOS only
- `android:` — Android only
- `web:` — Web only
- `native:` — iOS + Android

---

## Color Props Convention

Non-style color properties use `accent-` prefix in their className variant:

```tsx
<Icon colorClassName="accent-blue-500 dark:accent-blue-400" />
<TextInput placeholderTextColorClassName="accent-gray-400" />
```

---

## Component Bindings

### Auto-mapped className props by component:

| Component             | className props                                                                                                                                             |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **View**              | `className`                                                                                                                                                 |
| **Text**              | `className`, `selectionColorClassName`                                                                                                                      |
| **TextInput**         | `className`, `cursorColorClassName`, `selectionColorClassName`, `placeholderTextColorClassName`                                                             |
| **Image**             | `className`, `colorClassName`                                                                                                                               |
| **ScrollView**        | `className`, `contentContainerClassName`                                                                                                                    |
| **FlatList**          | `className`, `contentContainerClassName`, `columnWrapperClassName`, `ListHeaderComponentClassName`, `ListFooterComponentClassName`, `endFillColorClassName` |
| **SectionList**       | `className`, `contentContainerClassName`                                                                                                                    |
| **Switch**            | `className`, `thumbColorClassName`, `trackColorOnClassName`, `trackColorOffClassName`, `ios_backgroundColorClassName`                                       |
| **ActivityIndicator** | `className`, `colorClassName`                                                                                                                               |
| **Button**            | `colorClassName`                                                                                                                                            |

Reanimated components already support className (no wrapping needed).

---

## Safe Area Utilities

- `p-safe`, `m-safe`, `inset-safe` — Apply safe area insets
- `*-safe-or-*` — Uses `Math.max(inset, value)` — e.g., `pt-safe-or-4`
- `*-safe-offset-*` — Uses `inset + value` — e.g., `pt-safe-offset-4`

---

## CSS Functions (in global.css)

- `hairlineWidth()` — Thinnest displayable line width
- `fontScale()` — Multiplies by device font scale setting
- `pixelRatio()` — Multiplies by device pixel ratio
- `light-dark(lightValue, darkValue)` — Theme-aware values without CSS variables

---

## Theming in global.css

```css
@import "tailwindcss";
@import "uniwind";

@theme {
  --color-primary: oklch(0.65 0.2 250);
  --color-background: #ffffff;
  --color-text: #1a1a1a;

  /* Platform-specific tokens */
  @media ios {
    --font-sans: "system-ui";
  }
  @media android {
    --font-sans: "Roboto";
  }
}

@variant dark {
  --color-background: #0a0a0a;
  --color-text: #fafafa;
}

/* JS-only tokens (no Tailwind utilities generated) */
@theme static {
  --animation-duration: 300ms;
}
```

### Responsive Breakpoints

Mobile-first. Default breakpoints:

- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

Customize via `--breakpoint-*` CSS variables in `@theme`.

---

## Metro Configuration

```js
const { withUniwindConfig } = require("uniwind/metro");

module.exports = withUniwindConfig(config, {
  cssEntryFile: "./src/global.css", // Required — relative paths only!
  extraThemes: ["dim"], // Custom themes beyond light/dark
  dtsFile: "./uniwind.d.ts", // TypeScript definitions output
  polyfills: { rem: 16 }, // rem base value
  debug: false,
});
```

`withUniwindConfig` must be the **outermost** wrapper in metro config.

---

## Docs

- Full index: https://docs.uniwind.dev/llms.txt
- Migration from NativeWind: https://docs.uniwind.dev/skills.md
