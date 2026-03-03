---
title: View Flattening
impact: MEDIUM
tags: view-hierarchy, collapsable, layout-only, fabric
---

# Skill: View Flattening

Understand and debug React Native's automatic view flattening optimization.

## Quick Pattern

**Problem (native component gets wrong children):**

```jsx
<NativeTabBar>
  <TabContent title="Home" /> {/* May be flattened */}
  <TabContent title="Profile" /> {/* May be flattened */}
</NativeTabBar>
// NativeTabBar expects 2 children but receives 5+ after flattening
```

**Fix (prevent flattening):**

```jsx
<NativeTabBar>
  <TabContent title="Home" collapsable={false} />
  <TabContent title="Profile" collapsable={false} />
</NativeTabBar>
```

## When to Use

- Native components receive unexpected number of children
- Layout breaks after React Native upgrade
- Building native components that depend on child count
- Debugging view hierarchy mismatches

## What is View Flattening?

React Native's renderer automatically removes "layout-only" views that only affect layout (no visual rendering). This reduces:

- Native view count
- Memory usage
- Rendering overhead

### When Views Get Flattened

A view is "layout-only" when it has **none** of these:

- `backgroundColor`
- `borderWidth` / `borderColor`
- `shadow*` properties
- `opacity` (< 1.0)
- Event handlers (`onPress`, `onLayout`, etc.)
- `overflow: 'hidden'`

### Example

```jsx
// This View is layout-only (just flexbox container)
<View style={{ flexDirection: "row", padding: 10 }}>
  <Text>Hello</Text>
</View>
// The View may be removed from native hierarchy
```

```jsx
// This View is NOT layout-only (has visual effect)
<View style={{ flexDirection: "row", padding: 10, backgroundColor: "red" }}>
  <Text>Hello</Text>
</View>
// The View stays in native hierarchy
```

## Debugging View Hierarchy

### iOS: Xcode Debug View Hierarchy

1. Run app via Xcode
2. **Debug → View Debugging → Capture View Hierarchy**
3. Inspect 3D view of native hierarchy
4. Check if expected views are present

### Android: Layout Inspector

1. Run app via Android Studio
2. **View → Tool Windows → Layout Inspector**
3. Inspect component tree
4. Compare with React component tree

## The `collapsable` Prop

```jsx
// Prevent this specific view from being flattened
<View collapsable={false} style={{ flexDirection: "row" }}>
  <Text>I won't be flattened</Text>
</View>
```

**Use `collapsable={false}` when:**

- Wrapping children for a native component that expects specific child count
- View removal causes layout issues
- You need the view in the native hierarchy for measurement

**Don't overuse** - flattening is a performance optimization. Only disable when necessary.

## Common Scenarios

### Native Component with Expected Children

```jsx
// Native ViewPager expects exactly N page children
<NativeViewPager>
  <View collapsable={false}>
    <PageContent />
  </View>
  <View collapsable={false}>
    <PageContent />
  </View>
</NativeViewPager>
```

### Measurement Boundaries

```jsx
// Need this view for onLayout measurement
<View
  collapsable={false}
  onLayout={(e) => {
    const { width, height } = e.nativeEvent.layout;
  }}>
  <Content />
</View>
```

## Workarounds (Alternatives to collapsable)

Instead of `collapsable={false}`, you can add a visual property:

```jsx
// These prevent flattening naturally
<View style={{ opacity: 0.999 }}>  {/* Nearly invisible change */}
<View style={{ borderWidth: 0 }}>  {/* No visible border */}
```

But `collapsable={false}` is the cleanest solution.

## Common Pitfalls

- **Assuming all Views exist in native tree**: Layout-only views are removed
- **Over-using collapsable={false}**: Defeats the optimization
- **Not documenting native component requirements**: Document expected child count

## Related Skills

- [native-profiling.md](./native-profiling.md) - Use view debugging tools
- [native-threading-model.md](./native-threading-model.md) - View lifecycle threading
