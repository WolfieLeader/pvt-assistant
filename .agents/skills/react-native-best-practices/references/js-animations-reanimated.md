---
title: High-Performance Animations
impact: MEDIUM
tags: reanimated, animations, worklets, ui-thread
---

# Skill: High-Performance Animations

Run animations on the UI thread using Reanimated worklets for smooth 60+ FPS.

## Quick Pattern

**Incorrect (JS thread - blocks on heavy work):**

```jsx
const opacity = useRef(new Animated.Value(0)).current;

useEffect(() => {
  Animated.timing(opacity, {
    toValue: 1,
    duration: 300,
    useNativeDriver: true,
  }).start();
}, []);
```

**Correct (UI thread - always smooth):**

```jsx
const opacity = useSharedValue(0);

const style = useAnimatedStyle(() => ({
  opacity: opacity.value,
}));

useEffect(() => {
  opacity.value = withTiming(1, { duration: 300 });
}, []);

<Animated.View style={style} />;
```

## When to Use

- Animations stutter during JS-heavy operations
- Gesture-driven animations need to be responsive
- Complex animation sequences
- Shared element transitions

## Prerequisites

- `react-native-reanimated` (v4+)
- `react-native-worklets` (peer dependency)
- React Native New Architecture enabled (required for Reanimated 4)

```bash
npm install react-native-reanimated react-native-worklets
```

### Babel Configuration

```javascript
// babel.config.js
module.exports = {
  plugins: [
    // ... other plugins
    "react-native-worklets/plugin", // Must be last!
  ],
};
```

## Why UI Thread Matters

```
JS Thread:  [React render] [Heavy computation] [More work...]
            └── Animation on JS thread FREEZES here ──┘

UI Thread:  [Smooth 60fps] [Smooth 60fps] [Smooth 60fps]
            └── Animation on UI thread UNAFFECTED ──┘
```

Reanimated runs animation code as "worklets" on the UI thread, independent of JS.

## Step-by-Step Instructions

### 1. Create Shared Values

```jsx
import { useSharedValue } from "react-native-reanimated";

const Component = () => {
  const translateX = useSharedValue(0);
  const opacity = useSharedValue(1);
  const scale = useSharedValue(1);
};
```

### 2. Create Animated Styles

```jsx
import { useAnimatedStyle } from "react-native-reanimated";

const animatedStyle = useAnimatedStyle(() => ({
  transform: [{ translateX: translateX.value }, { scale: scale.value }],
  opacity: opacity.value,
}));
```

### 3. Apply to Animated Components

```jsx
import Animated from "react-native-reanimated";

<Animated.View style={[styles.box, animatedStyle]}>
  <Text>Animated!</Text>
</Animated.View>;
```

### 4. Trigger Animations

```jsx
import { withTiming, withSpring, withDelay } from "react-native-reanimated";

// Timing animation
opacity.value = withTiming(0, { duration: 500 });

// Spring animation
scale.value = withSpring(1.5, {
  damping: 10,
  stiffness: 100,
});

// Delayed animation
translateX.value = withDelay(200, withTiming(100));
```

## Thread Management

### What Runs on UI Thread

- `useAnimatedStyle` callbacks
- Animation drivers (withTiming, withSpring)
- Gesture handlers

### What Runs on JS Thread

- React state updates
- Data fetching
- Business logic

### Communicating Between Threads

```jsx
import { scheduleOnUI, scheduleOnRN } from "react-native-worklets";

// From JS to UI thread
scheduleOnUI(() => {
  "worklet";
  opacity.value = withTiming(1);
})();

// From UI to JS thread (inside a worklet)
const onGestureEnd = () => {
  "worklet";
  scheduleOnRN(() => {
    // Back on JS thread - safe to update React state
    setCompleted(true);
  })();
};
```

## Gesture Integration

```jsx
import { Gesture, GestureDetector } from "react-native-gesture-handler";

const pan = Gesture.Pan()
  .onUpdate((event) => {
    translateX.value = event.translationX;
    translateY.value = event.translationY;
  })
  .onEnd(() => {
    translateX.value = withSpring(0);
    translateY.value = withSpring(0);
  });

<GestureDetector gesture={pan}>
  <Animated.View style={animatedStyle} />
</GestureDetector>;
```

## Migration from Reanimated 3 to 4

| v3                                             | v4                             |
| ---------------------------------------------- | ------------------------------ |
| `runOnUI()`                                    | `scheduleOnUI()`               |
| `runOnJS()`                                    | `scheduleOnRN()`               |
| Babel plugin: `react-native-reanimated/plugin` | `react-native-worklets/plugin` |

### Breaking Changes in v4

- Requires New Architecture (Fabric + TurboModules)
- `withSpring` config: `mass`/`stiffness`/`damping` replaced by `mass`/`stiffness`/`damping` (same names, different defaults)
- Gesture Handler v2+ required

## Common Pitfalls

- **Accessing JS values in worklets**: Use shared values, not React state
- **Missing 'worklet' directive**: Functions on UI thread need the directive
- **Heavy computation in worklets**: Keep UI thread work light
- **Not using Animated components**: Regular View won't animate

## Related Skills

- [js-measure-fps.md](./js-measure-fps.md) - Measure animation smoothness
- [native-threading-model.md](./native-threading-model.md) - Understanding threads
