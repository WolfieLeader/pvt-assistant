---
name: react-navigation
description: Navigation patterns for React Navigation — tab/stack/drawer config, deep linking, TypeScript, and screen options. Use when implementing or debugging navigation, routes, screen transitions, or deep links.
---

# React Navigation

## References

Consult these resources as needed:

```
references/
  llms-full.md    Complete React Navigation 7.x documentation
```

## Quick Reference

**Pvt context:** Expo Router (file-based, wraps React Navigation) w/ `@react-navigation/native`, `bottom-tabs`, `elements`. Root `Stack` with `(tabs)` group + modal screens. Tabs: Home, Expenses, Tasks, Settings.

### Stack Screen Options

`presentation`: `card` | `modal` | `transparentModal` | `formSheet`
`animation`: `default` | `fade` | `slide_from_bottom` | `slide_from_right` | `flip` | `none`
`headerShown`, `gestureEnabled`, `contentStyle`, `statusBarStyle`
Form sheet: `sheetAllowedDetents: [0.5, 1.0]`, `sheetGrabberVisible`, `sheetCornerRadius`

### Bottom Tabs Options

`tabBarActiveTintColor`, `tabBarInactiveTintColor`, `tabBarStyle`, `tabBarLabelStyle`
`tabBarIcon: ({ color, size }) => Node`, `tabBarBadge`, `tabBarHideOnKeyboard`
`lazy` (default true), `freezeOnBlur`, `popToTopOnBlur`
Events: `tabPress`, `tabLongPress`. Hook: `useBottomTabBarHeight()`

### TypeScript

```typescript
// ParamList — must be type alias, not interface. undefined = no params.
type RootStackParamList = {
  "(tabs)": undefined;
  chat: { conversationId: string };
};
type Props = NativeStackScreenProps<RootStackParamList, "chat">;

// Nested: use NavigatorScreenParams<ChildParamList>
// Global declaration enables untyped useNavigation():
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
```

### Deep Linking

```typescript
// app.json: { "expo": { "scheme": "pvt" } }
const config = {
  screens: {
    "(tabs)": { screens: { index: "", expenses: "expenses" } },
    chat: "chat/:conversationId",
    NotFound: "*",
  },
};
// Test: npx uri-scheme open "pvt://chat/abc123" --ios
```

### Navigation Methods

`navigate(name, params)` | `push(name, params)` — always new instance
`goBack()` | `popTo(name)` | `popToTop()`
`setOptions({ title })` | `setParams({ key: val })`

### Key Patterns

- **Auth flow:** Conditionally render screen groups — never navigate manually on auth change
- **Nesting:** Minimize depth; `headerShown: false` on parent avoids duplicate headers; actions bubble up
- **Lifecycle:** Screens stay mounted when navigating away; going back unmounts departing screen only
- **Prevent back:** `usePreventRemove` hook; Android: `BackHandler.addEventListener('hardwareBackPress', ...)`
- **Drawer methods:** `openDrawer()`, `closeDrawer()`, `toggleDrawer()`; hook: `useDrawerProgress()`
