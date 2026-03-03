# React Navigation 7.x Documentation

Source: https://reactnavigation.org/llms-full.txt

## Getting Started

**Minimum Requirements:**

- `react-native` >= 0.72.0
- `expo` >= 52 (if using Expo Go)
- `typescript` >= 5.0.0 (if using TypeScript)

### Installation

```bash
npm install @react-navigation/native
npx expo install react-native-screens react-native-safe-area-context
```

### Configuration Methods

Two approaches: **Static configuration** (recommended, reduces boilerplate, simpler TypeScript) and **dynamic configuration** (more runtime flexibility).

---

## Hello React Navigation

React Navigation provides a history stack with native stack navigator handling screen transitions, headers, gestures, and animations.

```bash
npm install @react-navigation/native-stack
npm install @react-navigation/elements
```

### Creating Navigators

**Static API:**

```typescript
const RootStack = createNativeStackNavigator({
  initialRouteName: "Home",
  screens: {
    Home: HomeScreen,
    Details: DetailsScreen,
  },
});

const Navigation = createStaticNavigation(RootStack);
// Use <Navigation /> at root — only once in app
```

**Dynamic API:**

```tsx
const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Details" component={DetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

`createStaticNavigation` / `NavigationContainer` should be used only once at the root.

---

## Moving Between Screens

### Link and Button Components

- `Link` from `@react-navigation/native`
- `Button` from `@react-navigation/elements`
- Both accept a `screen` prop

### Navigation Object

```typescript
const navigation = useNavigation();

navigation.navigate("RouteName"); // navigate if not already there
navigation.push("RouteName"); // always push new instance
navigation.goBack(); // go back
navigation.popTo("RouteName"); // go to specific screen in stack
navigation.popToTop(); // go to first screen
```

On Android, hardware back button/gesture calls `goBack()` automatically.

---

## Passing Parameters

```typescript
navigation.navigate("RouteName", { itemId: 42 });
// Access via route.params in target screen
```

**Best practices:**

- Params should contain minimal info (IDs, not full data objects)
- Use global stores for data fetching
- `navigation.setParams()` merges new params
- `navigation.replaceParams()` replaces entirely
- Reserved param names: `screen`, `params`, `initial`, `state`

**Initial params:** Set via `initialParams`, shallow merged with passed params.

**Nested navigation:**

```typescript
navigation.navigate("Parent", { screen: "Child", params: { data } });
```

---

## Configuring the Header Bar

### Header Options

```typescript
options={{
  title: 'My Screen',
  headerStyle: { backgroundColor: '#f4511e' },
  headerTintColor: '#fff',
  headerTitleStyle: { fontWeight: 'bold' },
}}
```

- `headerTitle` — header-specific; `title` also used by tabs/drawers
- `headerLeft` / `headerRight` — custom button components
- `headerBackTitle` — iOS back label
- `headerBackTitleStyle` — style the back label

### Shared Options

Use `screenOptions` on navigator for consistent styling. Individual screens override with `options`.

### Dynamic Title

```typescript
options: ({ route }) => ({ title: route.params.name });
```

### Header Buttons with Screen State

```typescript
React.useEffect(() => {
  navigation.setOptions({
    headerRight: () => (
      <Button onPress={() => setCount(c => c + 1)}>Update</Button>
    ),
  });
}, [navigation]);
```

---

## Nesting Navigators

Rendering one navigator inside another's screen creates nested structures.

### Key Behaviors

- Each navigator maintains separate history
- Each has independent options
- Params isolated to specific screens
- Navigation actions bubble up if current navigator can't handle
- Parent UI renders above child UI

### Navigating to Nested Screens

```typescript
navigation.navigate("Parent", { screen: "NestedChild" });
navigation.navigate("Parent", { screen: "NestedChild", params: { userId: "jane" } });
```

Setting `initial: false` prevents specified screen from becoming initial route.

### Avoiding Duplicate Headers

Set `headerShown: false` on parent screen to show only child navigator's header.

### Best Practices

Minimize nesting. Use `Group` components or `groups` property for code organization instead of navigation structure.

---

## Navigation Lifecycle

Screens don't unmount when navigating away — they persist in background.

**Stack:** New screen mounts, previous stays. Going back: current unmounts, previous shown without remounting.

**Tabs with nested stacks:** Switching tabs mounts new content, previous stays. Returning shows without remounting.

---

## TypeScript

### ParamList Type

```typescript
type RootStackParamList = {
  Home: undefined;
  Profile: { userId: string };
  Feed: { sort: "latest" | "top" } | undefined;
};
```

Must be a `type` alias, not `interface`. Use `undefined` for no params.

### Navigator Type Checking

```typescript
const RootStack = createNativeStackNavigator<RootStackParamList>();
```

### Screen Props

```typescript
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
type Props = NativeStackScreenProps<RootStackParamList, "Profile">;

function ProfileScreen({ route, navigation }: Props) {}
```

Other types: `StackScreenProps`, `DrawerScreenProps`, `BottomTabScreenProps`.

### Separate Navigation and Route Props

```typescript
type ProfileNavigationProp = NativeStackNavigationProp<RootStackParamList, "Profile">;
type ProfileRouteProp = RouteProp<RootStackParamList, "Profile">;
```

### Nested Navigators

```typescript
import { NavigatorScreenParams } from "@react-navigation/native";

type TabParamList = {
  Home: NavigatorScreenParams<StackParamList>;
  Profile: { userId: string };
};
```

### Composite Navigation Props

```typescript
type ProfileScreenProps = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, "Profile">,
  StackScreenProps<StackParamList, "Account">
>;
```

### Hook Annotations

```typescript
const navigation = useNavigation<ProfileScreenNavigationProp>();
const route = useRoute<ProfileScreenRouteProp>();
```

### Global Type Declaration

```typescript
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
```

### Options Typing

```typescript
import type { StackNavigationOptions, StackOptionsArgs } from "@react-navigation/stack";

const options: StackNavigationOptions = { headerShown: false };
const dynamicOptions = ({ route }: StackOptionsArgs): StackNavigationOptions => ({
  headerTitle: route.name,
});
```

### Static API with StaticScreenProps

```typescript
import type { StaticScreenProps, StaticParamList } from "@react-navigation/native";

type Props = StaticScreenProps<{ username: string }>;
function ProfileScreen({ route }: Props) {}

type RootStackParamList = StaticParamList<typeof RootStack>;
```

---

## Native Stack Navigator

Install: `npm install @react-navigation/native-stack`

### Presentation Options

- `card` — standard push
- `modal` — modal presentation
- `transparentModal` — modal with content visible underneath
- `containedModal` — native modal context
- `containedTransparentModal` — transparent over current context
- `fullScreenModal` — full screen, non-dismissible
- `formSheet` — bottom sheet behavior

### Animation Options

`default`, `fade`, `fade_from_bottom`, `flip`, `simple_push`, `slide_from_bottom`, `slide_from_right`, `slide_from_left`, `none`

### Gesture Options

- `gestureEnabled` — swipe-to-dismiss (iOS, default `true`)
- `fullScreenGestureEnabled` — full-screen gesture (iOS, default `false`)
- `gestureDirection` — `vertical` or `horizontal`
- `animationDuration` — transition ms (iOS only)

### Header Options

- `headerShown` — toggle visibility (default `true`)
- `headerTitle` — custom title string or function
- `headerStyle` — style with `backgroundColor`
- `headerTintColor` — back button and title color
- `headerLargeTitleEnabled` — collapsible large title (iOS)
- `headerLargeTitleStyle` — fontFamily, fontSize, fontWeight, color
- `headerBackTitle` — back button label (iOS)
- `headerBackButtonDisplayMode` — `default`, `generic`, `minimal` (iOS)
- `headerBackVisible` — show back button alongside `headerLeft`
- `headerLeft` / `headerRight` — custom components
- `headerTransparent` — translucent, overlays content
- `headerBlurEffect` — blur for translucent header (iOS): `light`, `dark`, `extraLight`, `regular`
- `headerBackground` — function returning custom background
- `headerShadowVisible` — toggle shadow/border
- `headerSearchBarOptions` — native search bar
- `headerTitleAlign` — `left` or `center`
- `headerTitleStyle` — fontFamily, fontSize, fontWeight, color

### Form Sheet Options (iOS & Android)

- `sheetAllowedDetents` — snap points: `fitToContents` or `[0.25, 0.5, 0.75]`
- `sheetInitialDetentIndex` — starting detent or `last`
- `sheetGrabberVisible` — show grabber (iOS)
- `sheetCornerRadius` — corner radius
- `sheetExpandsWhenScrolledToEdge` — expand on scroll (iOS)
- `sheetLargestUndimmedDetentIndex` — last undimmed detent
- `sheetElevation` — shadow (Android)

### Other Options

- `contentStyle` — scene content styling
- `orientation` — `default`, `all`, `portrait`, `portrait_up`, `landscape`
- `freezeOnBlur` — prevent re-renders when unfocused
- `statusBarStyle` — `auto`, `dark`, `light`, `inverted`
- `statusBarHidden` — hide status bar
- `navigationBarHidden` — hide nav bar (Android)

### Events

- `transitionStart` — includes `closing` boolean
- `transitionEnd` — includes `closing` boolean
- `gestureCancel` — swipe-back cancelled (iOS)
- `sheetDetentChange` — form sheet detent changes

### Methods

```typescript
navigation.push(name, params);
navigation.replace(name, params);
navigation.pop(count);
navigation.popTo(name, params, options);
navigation.popToTop();
```

### Hooks

`useAnimatedHeaderHeight()` — animated value tracking header height changes.

---

## Bottom Tab Navigator

Install: `npm install @react-navigation/bottom-tabs`

### Navigator Props

- `backBehavior` — `firstRoute` (default), `initialRoute`, `order`, `history`, `fullHistory`, `none`
- `detachInactiveScreens` — detach inactive (default `true`)
- `tabBar` — custom tab bar function receiving `{ state, descriptors, navigation }`

### Screen Options — Visual

- `tabBarLabel` — text or function returning React.Node
- `tabBarShowLabel` — boolean (default `true`)
- `tabBarLabelPosition` — `below-icon` or `beside-icon`
- `tabBarLabelStyle` — fontSize, fontFamily, fontWeight
- `tabBarIcon` — function `({ focused, color, size }) => React.Node`
- `tabBarIconStyle` — icon styling
- `tabBarBadge` — string or number badge
- `tabBarBadgeStyle` — badge styling

### Screen Options — Styling

- `tabBarActiveTintColor` — active icon/label color
- `tabBarInactiveTintColor` — inactive color
- `tabBarActiveBackgroundColor` — active tab bg
- `tabBarInactiveBackgroundColor` — inactive bg
- `tabBarStyle` — tab bar container style
- `tabBarItemStyle` — individual tab item style
- `tabBarBackground` — function returning custom background element

### Screen Options — Behavior

- `tabBarHideOnKeyboard` — hide on keyboard (default `false`)
- `tabBarPosition` — `bottom` (default), `top`, `left`, `right`
- `tabBarVariant` — `uikit` (default, iOS) or `material`
- `tabBarButton` — custom button wrapper
- `lazy` — lazy load (default `true`)
- `freezeOnBlur` — prevent re-renders when inactive
- `popToTopOnBlur` — pop nested stack when navigating away
- `sceneStyle` — content wrapper style

### Events

- `tabPress` — call `e.preventDefault()` to override
- `tabLongPress` — long press

### Methods

```typescript
navigation.jumpTo("Profile", { owner: "user" });
```

### Hooks

```typescript
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
const tabBarHeight = useBottomTabBarHeight();
```

### Animation

- `animation` — `fade`, `shift`, `none`
- `transitionSpec` — custom animation config
- `sceneStyleInterpolator` — interpolated styles during transition
- Presets: `TransitionPresets.FadeTransition`, `TransitionPresets.ShiftTransition`

---

## Drawer Navigator

Install:

```bash
npm install @react-navigation/drawer
npx expo install react-native-gesture-handler react-native-reanimated react-native-worklets
```

### Basic Usage

```tsx
const Drawer = createDrawerNavigator();

function MyDrawer() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="Profile" component={ProfileScreen} />
    </Drawer.Navigator>
  );
}
```

### Navigator Props

- `backBehavior` — same as tabs
- `defaultStatus` — `open` or `closed`
- `detachInactiveScreens` — default `true`
- `drawerContent` — custom drawer content component

### Drawer Types

```typescript
drawerType: "front"; // overlay (default Android)
drawerType: "back"; // behind screen
drawerType: "slide"; // slide alongside (default iOS)
drawerType: "permanent"; // always visible sidebar
```

### Responsive Drawer

```typescript
const dimensions = useWindowDimensions();
screenOptions={{
  drawerType: dimensions.width >= 768 ? 'permanent' : 'front',
}}
```

### Styling Options

- `drawerActiveTintColor` / `drawerInactiveTintColor`
- `drawerActiveBackgroundColor` / `drawerInactiveBackgroundColor`
- `drawerItemStyle`, `drawerLabelStyle`, `drawerContentStyle`
- `drawerStyle` — `{ width, backgroundColor }`
- `drawerPosition` — `left` or `right`
- `overlayColor` — overlay when open
- `swipeEnabled` — default `true`
- `swipeEdgeWidth`, `swipeMinDistance`

### Custom Drawer Content

```tsx
import { DrawerContentScrollView, DrawerItemList, DrawerItem } from "@react-navigation/drawer";

function CustomDrawerContent(props) {
  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <DrawerItem label="Help" onPress={() => Linking.openURL("https://example.com/help")} />
    </DrawerContentScrollView>
  );
}
```

### Methods

```typescript
navigation.openDrawer();
navigation.closeDrawer();
navigation.toggleDrawer();
navigation.jumpTo("Profile", { owner: "user" });
```

### Hooks

```typescript
import { useDrawerProgress } from "@react-navigation/drawer";
const progress = useDrawerProgress(); // SharedValue 0..1

import { useDrawerStatus } from "@react-navigation/drawer";
const isOpen = useDrawerStatus() === "open";
```

---

## Deep Linking

### Basic Config

```typescript
const linking = {
  prefixes: ["example://", "https://app.example.com"],
};
```

For Expo: `prefixes: [Linking.createURL('/')]`

### Path Configuration

```typescript
const config = {
  screens: {
    Chat: "feed/:sort",
    Profile: {
      path: "user/:id/:section?",
      parse: {
        id: (id: string) => id.replace(/^@/, ""),
      },
      stringify: {
        id: (id: string) => `@${id}`,
      },
    },
    NotFound: "*",
  },
};
```

### Nested Navigator Paths

```typescript
const config = {
  screens: {
    Home: {
      screens: {
        Chat: "feed/:sort",
      },
    },
    Profile: "user",
  },
};
```

### Advanced Patterns

- Optional params: `:section?`
- Regex: `':sort(latest|popular)'`
- Path aliases: `{ path: ':id', alias: ['users/:id'] }`
- Exact matching: `{ path: 'users/:id', exact: true }`
- Wildcard catch-all: `'*'`

### Initial Route

```typescript
Home: {
  initialRouteName: 'Feed',
  screens: { Profile: 'users/:id' },
}
```

### Custom Transformation

```typescript
const linking = {
  getStateFromPath(path, options) {
    /* custom URL -> state */
  },
  getPathFromState(state, config) {
    /* custom state -> URL */
  },
};
```

### Platform Setup

**iOS — URL Scheme** in `app.json`:

```json
{ "expo": { "scheme": "example" } }
```

**iOS — Universal Links** in `app.json`:

```json
{
  "expo": {
    "ios": {
      "associatedDomains": ["applinks:app.example.com"]
    }
  }
}
```

**Android — Intent Filters** in `app.json`:

```json
{
  "expo": {
    "android": {
      "intentFilters": [
        {
          "action": "VIEW",
          "autoVerify": true,
          "data": [{ "scheme": "https", "host": "app.example.com" }],
          "category": ["BROWSABLE", "DEFAULT"]
        }
      ]
    }
  }
}
```

### Testing

```bash
npx uri-scheme open "example://chat/jane" --ios
xcrun simctl openurl booted "example://chat/jane"
adb shell am start -W -a android.intent.action.VIEW -d "example://chat/jane" com.app
```

### Custom URL Handling (e.g., push notifications)

```typescript
const linking = {
  prefixes: ["example://"],
  async getInitialURL() {
    const url = await Linking.getInitialURL();
    if (url != null) return url;
    const response = await Notifications.getLastNotificationResponseAsync();
    return response?.notification.request.content.data.url;
  },
  subscribe(listener) {
    const linkingSub = Linking.addEventListener("url", ({ url }) => listener(url));
    const pushSub = Notifications.addNotificationResponseReceivedListener((response) => {
      listener(response.notification.request.content.data.url);
    });
    return () => {
      linkingSub.remove();
      pushSub.remove();
    };
  },
};
```

---

## Themes

### Theme Object Structure

```typescript
const MyTheme = {
  dark: boolean,
  colors: {
    primary: string, // brand color
    background: string, // screen backgrounds
    card: string, // headers, tabs
    text: string, // text color
    border: string, // borders, dividers
    notification: string, // badges
  },
  fonts: {
    regular: { fontFamily: string, fontWeight: string },
    medium: { fontFamily: string, fontWeight: string },
    bold: { fontFamily: string, fontWeight: string },
    heavy: { fontFamily: string, fontWeight: string },
  },
};
```

### Built-in Themes

```typescript
import { DefaultTheme, DarkTheme } from "@react-navigation/native";
```

### Custom Theme

```typescript
const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "rgb(255, 45, 85)",
    background: "rgb(242, 242, 242)",
  },
};
```

### Applying

```tsx
// Static
<Navigation theme={MyTheme} />
// Dynamic
<NavigationContainer theme={MyTheme}>{/* ... */}</NavigationContainer>
```

### useTheme Hook

```typescript
import { useTheme } from "@react-navigation/native";
const { colors } = useTheme();
```

### System Preference

```typescript
import { useColorScheme } from 'react-native';
const scheme = useColorScheme();
<NavigationContainer theme={scheme === 'dark' ? DarkTheme : DefaultTheme}>
```

---

## Authentication Flows

Conditional screen rendering based on auth state:

### Static API

```typescript
const RootStack = createNativeStackNavigator({
  screens: {
    Home: { if: useIsSignedIn, screen: HomeScreen },
    SignIn: { if: useIsSignedOut, screen: SignInScreen },
  },
});
```

### Dynamic API

```tsx
<Stack.Navigator>
  {isSignedIn ? (
    <Stack.Screen name="Home" component={HomeScreen} />
  ) : (
    <Stack.Screen name="SignIn" component={SignInScreen} />
  )}
</Stack.Navigator>
```

### Groups for Multiple Screens

```typescript
const RootStack = createNativeStackNavigator({
  groups: {
    SignedIn: {
      if: useIsSignedIn,
      screens: { Home: HomeScreen, Profile: ProfileScreen },
    },
    SignedOut: {
      if: useIsSignedOut,
      screens: { SignIn: SignInScreen, SignUp: SignUpScreen },
    },
  },
});
```

### Shared Screens

Use `navigationKey` to reset state on auth change:

```tsx
<Stack.Screen navigationKey={isSignedIn ? "user" : "guest"} name="Help" component={HelpScreen} />
```

**Critical:** Don't manually navigate when conditionally rendering screens — React Navigation handles transitions automatically.

---

## Preventing Going Back

### usePreventRemove Hook

Works across nested navigators, cancels gestures, allows continuing the prevented action.

### Preventing App Exit (Android)

```typescript
import { BackHandler } from "react-native";

React.useEffect(() => {
  const onBackPress = () => {
    Alert.alert("Exit App", "Do you want to exit?", [
      { text: "Cancel", style: "cancel" },
      { text: "YES", onPress: () => BackHandler.exitApp() },
    ]);
    return true;
  };
  const handler = BackHandler.addEventListener("hardwareBackPress", onBackPress);
  return () => handler.remove();
}, []);
```

### Web

```typescript
window.addEventListener("beforeunload", (e) => {
  e.preventDefault();
  e.returnValue = true;
});
```

**Limitation:** Users can always close via app switcher or browser tab. Persist data for restoration.

---

## Navigation Events

```typescript
React.useEffect(() => {
  const unsubscribe = navigation.addListener("focus", () => {
    // screen focused
  });
  return unsubscribe;
}, [navigation]);
```

For parent events in nested navigators:

```typescript
navigation.getParent("NavigatorId").addListener("tabPress", callback);
```

Common events: `focus`, `blur`, `beforeRemove`, `state`, `tabPress`, `tabLongPress`, `drawerItemPress`, `transitionStart`, `transitionEnd`.
