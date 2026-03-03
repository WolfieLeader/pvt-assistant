# React 19

Included in Expo SDK 54.

## useContext -> use

```tsx
// Before
import { useContext } from "react";
const theme = useContext(ThemeContext);

// After
import { use } from "react";
const theme = use(ThemeContext);
```

The `use` hook can also read promises, enabling Suspense-based data fetching. Unlike `useContext`, `use` can be called conditionally.

## Context.Provider -> Context

```tsx
// Before
<ThemeContext.Provider value={theme}>

// After
<ThemeContext value={theme}>
```

## forwardRef removal

```tsx
// Before
const Input = forwardRef((props, ref) => <input ref={ref} {...props} />);

// After
function Input({ ref, ...props }) {
  return <input ref={ref} {...props} />;
}
```

`ref` is now a regular prop. No wrapper needed.

## Other New Features

- **Actions**: `useTransition` now supports async functions for mutations
- **useOptimistic**: Optimistic UI updates during async operations
- **useFormStatus**: Track form submission state (web)
- **Document metadata**: `<title>`, `<meta>`, `<link>` supported directly in components (web)

## Migration

When upgrading to SDK 54:

1. Replace `useContext(X)` with `use(X)`
2. Replace `<X.Provider>` with `<X>`
3. Remove `forwardRef` wrappers, accept `ref` as prop
