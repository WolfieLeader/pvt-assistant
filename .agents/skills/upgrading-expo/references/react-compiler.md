# React Compiler

Available as a stable feature in Expo SDK 54+. The React Compiler automatically memoizes components and hooks, eliminating the need for manual `useMemo`, `useCallback`, and `React.memo`.

## Enable

Add to `app.json`:

```json
{
  "expo": {
    "experiments": {
      "reactCompiler": true
    }
  }
}
```

## Requirements

- Expo SDK 54 or later
- New Architecture enabled (default in SDK 54+)

## What It Does

- Automatically memoizes components and values
- Removes unnecessary re-renders
- Eliminates the need for `useMemo`, `useCallback`, `React.memo`

## After Enabling

You can safely remove:

```tsx
// Remove these - compiler handles them
const memoized = useMemo(() => expensiveCalc(a, b), [a, b]);
const callback = useCallback(() => doThing(x), [x]);
const MemoComponent = React.memo(Component);

// Replace with direct usage
const memoized = expensiveCalc(a, b);
const callback = () => doThing(x);
// Just use Component directly
```

The compiler is designed to work with idiomatic React code. It will skip optimization only when it cannot safely do so.

## Verification

The bundler shows compilation messages during build. If issues arise:

1. Clear Metro cache: `npx expo start --clear`
2. Check for non-idiomatic patterns the compiler can't optimize
3. Review console for compiler warnings
