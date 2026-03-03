---
title: React Compiler
impact: HIGH
tags: compiler, memoization, memo, useCallback, useMemo
---

# Skill: React Compiler

Enable React Compiler for automatic memoization, eliminating manual `memo`, `useCallback`, and `useMemo`.

## Quick Config

**Expo (SDK 54+):**

```bash
npx expo install babel-plugin-react-compiler
```

```json
// app.json
{
  "expo": {
    "experiments": {
      "reactCompiler": true
    }
  }
}
```

**React Native CLI:**

```bash
npm install -D babel-plugin-react-compiler
```

```javascript
// babel.config.js
module.exports = {
  plugins: [
    ["babel-plugin-react-compiler"], // Must be first!
    // ... other plugins
  ],
};
```

## When to Use

- Many components with unnecessary re-renders
- Codebase has lots of manual `memo`/`useCallback`/`useMemo`
- Want to simplify code while maintaining performance
- Team struggles with memoization decisions

## Prerequisites

- React 17+ (React 19 recommended for full features)
- Babel-based build system
- Code follows Rules of React

## Step-by-Step Instructions

### 1. Check Compatibility

```bash
npx react-compiler-healthcheck@latest
```

Reports:

- Number of compatible components
- Issues that need fixing
- Overall readiness score

### 2. Install

**Expo:**

```bash
npx expo install babel-plugin-react-compiler
```

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

**React Native CLI:**

```bash
npm install -D babel-plugin-react-compiler
```

Add to `babel.config.js`:

```javascript
module.exports = {
  plugins: [
    ["babel-plugin-react-compiler"], // MUST be first
    // ... other plugins
  ],
};
```

### 3. Set Up ESLint

```bash
npm install -D eslint-plugin-react-compiler
```

```javascript
// eslint.config.js
import reactCompiler from "eslint-plugin-react-compiler";

export default [
  {
    plugins: { "react-compiler": reactCompiler },
    rules: {
      "react-compiler/react-compiler": "error",
    },
  },
];
```

ESLint catches code patterns that prevent optimization.

### 4. Verify Optimization

Open React DevTools:

- Optimized components show **"Memo"** badge
- Check Profiler for reduced re-renders

## Code Examples

### Before: Manual Memoization

```jsx
const TodoList = memo(({ todos, filter }) => {
  const filteredTodos = useMemo(() => todos.filter((t) => matchesFilter(t, filter)), [todos, filter]);

  const handleToggle = useCallback(
    (id) => {
      dispatch({ type: "TOGGLE", id });
    },
    [dispatch],
  );

  return filteredTodos.map((todo) => <TodoItem key={todo.id} todo={todo} onToggle={handleToggle} />);
});
```

### After: React Compiler (Automatic)

```jsx
const TodoList = ({ todos, filter }) => {
  const filteredTodos = todos.filter((t) => matchesFilter(t, filter));

  const handleToggle = (id) => {
    dispatch({ type: "TOGGLE", id });
  };

  return filteredTodos.map((todo) => <TodoItem key={todo.id} todo={todo} onToggle={handleToggle} />);
};
```

The compiler automatically memoizes components, values, and callbacks.

## Incremental Adoption

### Option 1: Limit to Specific Directories

```javascript
// babel.config.js
module.exports = {
  plugins: [
    [
      "babel-plugin-react-compiler",
      {
        sources: (filename) => {
          return filename.includes("src/components");
        },
      },
    ],
  ],
};
```

### Option 2: Opt Out Individual Components

```jsx
// Add directive to skip compilation
function LegacyComponent() {
  "use no memo";
  // This component won't be optimized
}
```

## What Gets Optimized

| Pattern          | Before                    | After (Compiled)      |
| ---------------- | ------------------------- | --------------------- |
| Component body   | Re-runs entirely          | Skips unchanged parts |
| Inline callbacks | New reference each render | Stable reference      |
| Computed values  | Recalculated each render  | Cached                |
| JSX elements     | Recreated                 | Reused if props same  |

## Performance Impact

Expensify case study:

- **4.3% improvement** in Chat Finder TTI
- Significant reduction in cascading re-renders
- Apps already heavily pre-optimized may see minimal gains

## What Won't Be Optimized

- Components with ESLint violations (skipped safely)
- Code with mutations during render
- Side effects in render path
- Class components
- Code using `arguments` or `eval`

## Common Pitfalls

- **Not running first**: Compiler must be first Babel plugin
- **Ignoring ESLint errors**: Violations cause components to be skipped
- **Expecting magic**: Won't fix architectural issues (prop drilling, etc.)
- **Removing existing memo()**: Safe to do gradually after verifying

## Related Skills

- [js-profile-react.md](./js-profile-react.md) - Verify optimization impact
- [js-atomic-state.md](./js-atomic-state.md) - Alternative: reduce re-renders at state level
