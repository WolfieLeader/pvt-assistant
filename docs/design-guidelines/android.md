# Material Design 3 & Android Guidelines

Standalone M3/Android reference. All values from official sources unless noted.

Last verified: 2026-03-04

---

## 1. Gestures

| Gesture | M3/Android Behavior |
|---------|---------------------|
| **Tap** | Activates control / selects item |
| **Swipe horizontal** | Dismiss gesture — crosses threshold to commit. Either direction. |
| **Long press** | **Selection mode** (NOT context menu) — drag to multi-select |
| **Pinch** | Zoom in/out |
| **Double tap** | Zoom or select word (context-dependent) |
| **Drag** | Reorder items, move objects |

M3 uses long-press for **selection**, not context menus. Menus trigger from icon buttons or overflow (three-dot).

M3 Expressive: spring-based motion applies to gesture feedback — swipe actions have subtle bounce on commit/cancel.

---

## 2. Touch Targets

| Metric | Value |
|--------|-------|
| Minimum touch target | **48x48dp** |
| Spacing between targets | 8dp recommended |
| Accessibility scanner | Flags targets < 48dp |
| WCAG 2.2 | 24x24 CSS px minimum (Level AA) |

All interactive elements must meet 48dp minimum. Visual size can be smaller if touch target is padded.

---

## 3. Modals & Dialogs

### Dialog Types

| Type | Position | Use Case |
|------|----------|----------|
| **Basic dialog** | Centered | Decisions, critical info, confirmations |
| **Full-screen dialog** | Full screen | Complex input, multi-step forms |
| **Date picker** | Centered (modal) or inline (docked) | Date selection |
| **Time picker** | Centered | Time selection (dial or input mode) |

### Bottom Sheets

| Type | Behavior | Use Case |
|------|----------|----------|
| **Standard** | Co-exists with page content, non-blocking | Filters, supplementary content |
| **Modal** | Scrim overlay, blocks interaction below | Actions requiring focus, secondary content |

Dismissal: swipe down, tap scrim (modal), back gesture/button.

### Dialog Behavior

- Buttons: right-aligned, text buttons (no filled buttons in dialogs)
- Dismissible: tap outside or back gesture (unless undismissible by design)
- Max width: 560dp on large screens
- Elevation: Level 3 (6dp)
- Corner radius: 28dp (extra-large)

---

## 4. Destructive Actions

| Pattern | Details |
|---------|---------|
| **Snackbar with undo** | "Item deleted — UNDO" at bottom |
| **Confirmation dialog** | For bulk/irreversible actions |
| **Escalating friction** | Severity determines confirmation level |

### Snackbar Specs

| Property | Value |
|----------|-------|
| Duration SHORT | 4s (actual, includes animation) |
| Duration LONG | 10s |
| Duration INDEFINITE | Until dismissed |
| Position | Bottom, above FAB and nav bar |
| Max lines | 2 |
| Action button | Single, text button |
| Corner radius | 4dp |
| Elevation | Level 3 (6dp) |

FAB shifts up to avoid snackbar overlap. Single action button (usually "Undo").

---

## 5. Lists

| Property | M3 Value |
|----------|----------|
| One-line item height | 56dp |
| Two-line item height | 72dp |
| Three-line item height | 88dp |
| Leading element | 40dp (avatar), 24dp (icon) |
| Trailing element | 24dp icon or text |
| Horizontal padding | 16dp |
| Dividers | Full-bleed or inset, 1dp, `outlineVariant` color |
| Swipe action | SwipeToDismiss — horizontal threshold-based |
| Long press | Selection mode (multi-select) |

### Empty State

Illustrated empty state with:
1. Illustration or icon
2. Headline text
3. Supporting text
4. Optional action button

---

## 6. Navigation

### Bottom Navigation Bar

| Property | Value |
|----------|-------|
| Destinations | 3-5 |
| Height | 80dp |
| Icon size | 24dp |
| Label | Always visible (M3 — no hide on unselected) |
| Active indicator | Pill shape behind icon, `secondaryContainer` color |
| Elevation | Level 2 (3dp) |

### Navigation Rail (Tablets)

| Property | Value |
|----------|-------|
| Width | 80dp |
| Alignment | Vertical, start side |
| FAB position | Top of rail (optional) |
| Labels | Optional, below icons |

### Navigation Drawer

| Property | Value |
|----------|-------|
| Width | 360dp max |
| Types | Standard (persistent), Modal (overlay) |
| Active indicator | `secondaryContainer` fill, rounded end |

### Tabs

| Type | Use Case |
|------|----------|
| Primary tabs | Top-level content categories |
| Secondary tabs | Sub-categories within content |
| Scrollable tabs | > 5 items |

### FAB (Floating Action Button)

| Type | Size | Corner Radius |
|------|------|---------------|
| FAB | 56dp | 16dp |
| Small FAB | 40dp | 12dp |
| Large FAB | 96dp | 28dp |
| Extended FAB | 56dp height | 16dp |

### Tablet/Large Screen Navigation Adaptation

| Width Class | dp Range | Navigation Pattern |
|-------------|----------|--------------------|
| Compact | < 600 | Bottom navigation bar |
| Medium | 600-839 | Navigation rail (80dp) |
| Expanded | 840-1199 | Navigation drawer or persistent rail |
| Large | 1200-1599 | Persistent navigation drawer |
| Extra-large | >= 1600 | Full navigation drawer |

---

## 7. Haptics

### HapticFeedbackConstants

| Constant | API | Use Case |
|----------|-----|----------|
| `LONG_PRESS` | 3 | Long press detected |
| `VIRTUAL_KEY` | 5 | Virtual button press |
| `VIRTUAL_KEY_RELEASE` | 27 | Virtual button release |
| `CONTEXT_CLICK` | 23 | Context click / right-click equivalent |
| `KEYBOARD_PRESS` | 27 | Keyboard key down |
| `KEYBOARD_RELEASE` | 27 | Keyboard key up |
| `TEXT_HANDLE_MOVE` | 27 | Text selection handle drag |
| `GESTURE_START` | 30 | Gesture begins |
| `GESTURE_END` | 30 | Gesture completes |
| `CONFIRM` | 30 | Success / affirmative feedback |
| `REJECT` | 30 | Failure / negative feedback |
| `TOGGLE_ON` | 34 | Toggle switched on |
| `TOGGLE_OFF` | 34 | Toggle switched off |
| `DRAG_START` | 34 | Drag operation begins |
| `SEGMENT_TICK` | 34 | Segment boundary crossed |
| `SEGMENT_FREQUENT_TICK` | 34 | Frequent segment ticks (slider) |

No `VIBRATE` permission required. Respects system `HAPTIC_FEEDBACK_ENABLED` setting. Automatic fallback on unsupported devices.

---

## 8. Typography

### M3 Type Scale (15 Roles)

Default font: Roboto (stock) / Roboto Flex (Expressive).

| Role | Size (sp) | Line Height (sp) | Weight | Tracking (sp) |
|------|-----------|------------------|--------|---------------|
| Display Large | 57 | 64 | 400 | -0.25 |
| Display Medium | 45 | 52 | 400 | 0 |
| Display Small | 36 | 44 | 400 | 0 |
| Headline Large | 32 | 40 | 400 | 0 |
| Headline Medium | 28 | 36 | 400 | 0 |
| Headline Small | 24 | 32 | 400 | 0 |
| Title Large | 22 | 28 | 400 | 0 |
| Title Medium | 16 | 24 | 500 | 0.15 |
| Title Small | 14 | 20 | 500 | 0.1 |
| Body Large | 16 | 24 | 400 | 0.5 |
| Body Medium | 14 | 20 | 400 | 0.25 |
| Body Small | 12 | 16 | 400 | 0.4 |
| Label Large | 14 | 20 | 500 | 0.1 |
| Label Medium | 12 | 16 | 500 | 0.5 |
| Label Small | 11 | 16 | 500 | 0.5 |

### M3 Expressive Type Scale Updates

Expressive uses Roboto Flex (variable font) and adjusts:
- Display/Headline weights: 475 (was 400)
- Title Large line height: 30sp (was 28sp)
- Most tracking values reduced to 0
- 15 additional "emphasized" styles (higher weight variants for bold/selection)
- Total: 30 styles (15 standard + 15 emphasized)

### Font Scaling

Android respects system font size setting. Test at:
- Default (1.0x)
- Large (1.15x)
- Largest (1.3x)
- Accessibility sizes up to 2.0x

Use `sp` for text sizes (scales with user preference). Use `dp` for fixed dimensions.

---

## 9. Accessibility

### Touch Targets

| Standard | Minimum Size |
|----------|--------------|
| M3 / Android | 48x48dp |
| WCAG 2.2 | 24x24 CSS px (Level AA) |
| Accessibility Scanner | Flags < 48dp |

### Contrast Ratios (WCAG 2.1 AA)

| Element | Minimum Ratio |
|---------|---------------|
| Normal text (< 18sp or < 14sp bold) | 4.5:1 |
| Large text (>= 18sp or >= 14sp bold) | 3:1 |
| UI components, icons | 3:1 |

### TalkBack Support

| Feature | API |
|---------|-----|
| Labels | `contentDescription` |
| State | `stateDescription` (API 30+) |
| Roles | `accessibilityRole` via `AccessibilityNodeInfo` |
| Grouping | `importantForAccessibility` |
| Custom actions | `AccessibilityAction` |
| Announcements | `AccessibilityEvent.TYPE_ANNOUNCEMENT` |
| Live regions | `accessibilityLiveRegion` (polite / assertive) |
| Headings | `accessibilityHeading` (API 28+) |

### Reduce Motion

Detection: `Settings.Global.ANIMATOR_DURATION_SCALE` (0 = off).

When reduce motion enabled:
- Replace animations with crossfade or instant changes
- Disable parallax and auto-scrolling
- Keep functional animations (progress indicators)

### Color-Independent Information

Never convey information through color alone. Pair with icons, text labels, patterns, or position.

---

## 10. Dark Mode & Color

### M3 Color Roles (Complete)

#### Accent Colors (16 roles)

| Role | Usage |
|------|-------|
| `primary` | Main brand — filled buttons, FAB, active states |
| `onPrimary` | Text/icons on primary |
| `primaryContainer` | Tonal fill — tonal buttons, chips |
| `onPrimaryContainer` | Text/icons on primaryContainer |
| `secondary` | Accent — filter chips, toggles |
| `onSecondary` | Text/icons on secondary |
| `secondaryContainer` | Nav indicator, tonal buttons |
| `onSecondaryContainer` | Text/icons on secondaryContainer |
| `tertiary` | Balance — input accents, complementary |
| `onTertiary` | Text/icons on tertiary |
| `tertiaryContainer` | Tonal fill for tertiary |
| `onTertiaryContainer` | Text/icons on tertiaryContainer |
| `error` | Error states — invalid fields, destructive |
| `onError` | Text/icons on error |
| `errorContainer` | Error banners, alerts |
| `onErrorContainer` | Text/icons on errorContainer |

#### Surface Colors (13 roles)

| Role | Usage |
|------|-------|
| `surface` | Default background — page, cards, sheets |
| `onSurface` | Primary text/icons |
| `surfaceVariant` | Lower-emphasis — chip bg, text field fill |
| `onSurfaceVariant` | Secondary text — helper text, trailing icons |
| `surfaceDim` | Dimmer background |
| `surfaceBright` | High-emphasis surface |
| `surfaceContainerLowest` | Lowest-emphasis container |
| `surfaceContainerLow` | Low-emphasis — side sheets, card bg |
| `surfaceContainer` | Default container — cards, sheets, dialogs |
| `surfaceContainerHigh` | Higher emphasis — search bars, nav drawers |
| `surfaceContainerHighest` | Highest emphasis — text field fills |
| `surfaceTint` | Tint overlay for elevation (deprecated path) |
| `background` | Alias for surface (legacy) |

#### Utility Colors (5 roles)

| Role | Usage |
|------|-------|
| `outline` | Strong-contrast borders — outlined buttons, fields |
| `outlineVariant` | Subtle dividers, decorative borders |
| `inverseSurface` | Contrasts with surface — snackbars, tooltips |
| `inverseOnSurface` | Text on inverseSurface |
| `inversePrimary` | Primary for inverse — snackbar actions |

#### Overlay Colors (2 roles)

| Role | Usage |
|------|-------|
| `scrim` | Dim overlay — behind modals, drawers |
| `shadow` | Shadow color for elevation |

#### Fixed Colors (12 roles — for elements that don't change between light/dark)

| Role | Usage |
|------|-------|
| `primaryFixed` | Fixed primary fill |
| `primaryFixedDim` | Dimmer variant |
| `onPrimaryFixed` | Text on primaryFixed |
| `onPrimaryFixedVariant` | Secondary text on primaryFixed |
| `secondaryFixed` | Fixed secondary fill |
| `secondaryFixedDim` | Dimmer variant |
| `onSecondaryFixed` | Text on secondaryFixed |
| `onSecondaryFixedVariant` | Secondary text on secondaryFixed |
| `tertiaryFixed` | Fixed tertiary fill |
| `tertiaryFixedDim` | Dimmer variant |
| `onTertiaryFixed` | Text on tertiaryFixed |
| `onTertiaryFixedVariant` | Secondary text on tertiaryFixed |

**Total: ~49 color roles** in a complete M3 ColorScheme.

### Dynamic Color (Material You)

Available since Android 12 (API 31). System extracts wallpaper color using HCT color space.

| Palette | Chroma | Hue |
|---------|--------|-----|
| Accent 1 (primary) | 48 (40 at tones 0,10,50,100) | Source hue |
| Accent 2 (secondary) | 16 | Source hue |
| Accent 3 (tertiary) | 32 | Source hue + 60deg |
| Neutral 1 | 4 | Source hue |
| Neutral 2 | 8 | Source hue |

Each palette has 13 tonal levels (0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 95, 99, 100). Total: 65 tonal values.

Minimum source color CAM16 chroma: 5.

Enable: `DynamicColors.applyToActivitiesIfAvailable()`.

### M3 Elevation System

M3 uses tonal elevation (surface tint) instead of shadows for dark mode.

| Level | Elevation | Tonal Overlay (dark) |
|-------|-----------|----------------------|
| Level 0 | 0dp | 0% |
| Level 1 | 1dp | 5% surfaceTint |
| Level 2 | 3dp | 8% |
| Level 3 | 6dp | 11% |
| Level 4 | 8dp | 12% |
| Level 5 | 12dp | 14% |

---

## 11. App Icons (Adaptive Icons)

| Property | Value |
|----------|-------|
| Full canvas | 108x108dp |
| Visible area (masked) | 72dp diameter |
| Safe zone | 66dp diameter center |
| Layers | Foreground + Background (both 108dp) |
| Background | Must be fully opaque |
| Foreground | May include transparency |
| Mask shape | OEM-defined (circle, squircle, rounded square, etc.) |
| Minimum mask distance | 33dp from center |
| Format | VectorDrawable (preferred) or PNG |
| Play Store icon | 512x512px PNG |

### Monochrome Layer (Android 13+)

Required for themed icons. Flat, single-color vector drawable of logo. System applies wallpaper-derived tint.

### Icon Guidelines

- Keep critical content within 66dp safe zone
- Both layers can shift independently (parallax effect — up to 4dp)
- Do not include shadows in layers (system applies)
- Avoid text in icons (doesn't scale across shapes)

---

## 12. Launch / Splash Screen

### SplashScreen API (Android 12+)

| Property | Value |
|----------|-------|
| Icon with background | 240x240dp total, icon in 160dp circle |
| Icon without background | 288x288dp total, icon in 192dp circle |
| Animated icon canvas | 432dp (AVD XML); visible 288dp (inner 2/3) |
| Animation duration | <= 1000ms recommended |
| Branded image | 200x80dp at bottom (not recommended) |
| Background | Single opaque color, dark mode variant |

### Theme Attributes

| Attribute | Purpose |
|-----------|---------|
| `windowSplashScreenBackground` | Fill background color |
| `windowSplashScreenAnimatedIcon` | Center icon |
| `windowSplashScreenAnimationDuration` | Icon animation duration |
| `windowSplashScreenIconBackgroundColor` | Optional contrast circle behind icon |
| `windowSplashScreenBrandingImage` | Bottom branding (200x80dp) |

Dependency: `androidx.core:core-splashscreen:1.0.0`

---

## 13. Status Bar

| Property | Android 14 (API 34) | Android 15+ (API 35+) |
|----------|---------------------|-----------------------|
| Transparency | Configurable | Transparent (mandatory) |
| `setStatusBarColor()` | Works | Deprecated, disabled |
| `setNavigationBarColor()` | Works | Deprecated (gesture nav) |
| Height | ~24dp + cutout | ~24dp + cutout |
| Content style | Light/dark icons | Light/dark icons |

### Edge-to-Edge Enforcement

**Android 15 (API 35)**: Edge-to-edge mandatory. Content draws behind system bars. Must handle insets.

**Android 16 (API 36)**: No opt-out. `windowOptOutEdgeToEdgeEnforcement` deprecated and disabled.

---

## 14. Safe Areas & Insets

### Inset Types

| Type | Purpose | API |
|------|---------|-----|
| System Bars | Status bar + nav bar | `WindowInsets.Type.systemBars()` |
| Status Bars | Status bar only | `WindowInsets.Type.statusBars()` |
| Navigation Bars | Nav bar only | `WindowInsets.Type.navigationBars()` |
| Tappable Element | 3-button nav bar height | `WindowInsets.Type.tappableElement()` |
| System Gestures | Gesture nav areas (system priority) | `WindowInsets.Type.systemGestures()` |
| Mandatory Gestures | Non-overridable gesture areas | `WindowInsets.Type.mandatorySystemGestures()` |
| Display Cutout | Camera/sensor cutout | `WindowInsets.Type.displayCutout()` |
| IME | Keyboard | `WindowInsets.Type.ime()` |

### Gesture Navigation Insets

| Area | Typical Size | Notes |
|------|--------------|-------|
| Bottom (home gesture) | 48dp | Swipe up from bottom |
| Left edge (back) | 24dp | Swipe from left edge |
| Right edge (back) | 24dp | Swipe from right edge |

### 3-Button Navigation

| Button | Height |
|--------|--------|
| Navigation bar | 48dp |

Content must not be obscured by system bars. Use `ViewCompat.setOnApplyWindowInsetsListener()` or Compose `WindowInsets` APIs.

---

## 15. Keyboard Handling

### Keyboard Types

| Type | Android Constant | Use Case |
|------|------------------|----------|
| Default | `TYPE_CLASS_TEXT` | General text |
| Email | `TYPE_TEXT_VARIATION_EMAIL_ADDRESS` | Email fields |
| Numeric | `TYPE_CLASS_NUMBER` | Numbers only |
| Phone | `TYPE_CLASS_PHONE` | Phone numbers |
| Decimal | `TYPE_NUMBER_FLAG_DECIMAL` | Currency, amounts |
| URL | `TYPE_TEXT_VARIATION_URI` | Web addresses |
| Password | `TYPE_TEXT_VARIATION_PASSWORD` | Password input |

### IME Actions

| Action | Constant | Use Case |
|--------|----------|----------|
| Done | `IME_ACTION_DONE` | Completes input, dismisses keyboard |
| Go | `IME_ACTION_GO` | Navigate to target |
| Next | `IME_ACTION_NEXT` | Move to next field |
| Search | `IME_ACTION_SEARCH` | Execute search |
| Send | `IME_ACTION_SEND` | Send message |
| Previous | `IME_ACTION_PREVIOUS` | Move to previous field |

### Keyboard Avoidance

- `android:windowSoftInputMode="adjustResize"` (preferred) — resizes layout
- `android:windowSoftInputMode="adjustPan"` — pans viewport
- Keyboard insets via `WindowInsets.Type.ime()` for precise control

---

## 16. Permissions

### Runtime Permission Flow

| Step | Action |
|------|--------|
| 1 | Declare in `AndroidManifest.xml` |
| 2 | Wait until user invokes the feature (just-in-time) |
| 3 | Check: `ContextCompat.checkSelfPermission()` |
| 4 | Rationale: `shouldShowRequestPermissionRationale()` |
| 5 | Request: `requestPermissionLauncher.launch()` |
| 6 | Handle grant/deny in callback |
| 7 | Gracefully degrade if denied |

### shouldShowRequestPermissionRationale() States

| Return | Context | Meaning |
|--------|---------|---------|
| `false` | First request | Show permission dialog directly |
| `true` | Previously denied | Show educational UI before re-asking |
| `false` | "Don't ask again" | Permanently denied — guide to Settings |

### Key Permission Groups

| Group | Permissions |
|-------|-------------|
| Camera | `CAMERA` |
| Location | `ACCESS_FINE_LOCATION`, `ACCESS_COARSE_LOCATION`, `ACCESS_BACKGROUND_LOCATION` |
| Microphone | `RECORD_AUDIO` |
| Contacts | `READ_CONTACTS`, `WRITE_CONTACTS` |
| Calendar | `READ_CALENDAR`, `WRITE_CALENDAR` |
| Storage | `READ_MEDIA_IMAGES`, `READ_MEDIA_VIDEO`, `READ_MEDIA_AUDIO` (API 33+) |
| Phone | `READ_PHONE_STATE`, `CALL_PHONE` |
| Notifications | `POST_NOTIFICATIONS` (API 33+) |
| Nearby | `NEARBY_WIFI_DEVICES` (API 33+), `BLUETOOTH_CONNECT` (API 31+) |
| Body Sensors | `BODY_SENSORS` (replaced by granular health perms in API 36) |

### Location Permission Hierarchy

| Permission | Precision | When |
|------------|-----------|------|
| `ACCESS_COARSE_LOCATION` | ~3km area | Request first |
| `ACCESS_FINE_LOCATION` | ~50m | Request with COARSE (API 31+) |
| `ACCESS_BACKGROUND_LOCATION` | While closed | Separate request, after foreground grant |

### One-Time Permissions (Android 11+)

Location, microphone, camera include "Only this time" option. Permission lasts while activity visible + short grace period.

### Auto-Reset (Android 11+)

Unused apps have sensitive permissions auto-revoked after months of inactivity.

---

## 17. Search

### M3 Search Components

| Component | Height | Behavior |
|-----------|--------|----------|
| Search bar | 56dp | Persistent, always visible |
| Search view | Full-width | Expands from search bar, shows results |

### Search View Behavior

1. Tap search bar -> expands to search view
2. Shows recent searches + suggestions
3. Type query -> results update
4. Back arrow or X to dismiss
5. Returns to search bar state

### Search Bar Specs

| Property | Value |
|----------|-------|
| Height | 56dp |
| Corner radius | 28dp (full) |
| Leading icon | Search (24dp) |
| Trailing icon | Avatar or mic (optional) |
| Fill color | `surfaceContainerHigh` |

---

## 18. Loading States

### M3 Progress Indicators

| Type | Size | Use Case |
|------|------|----------|
| Circular (determinate) | 48dp default | Known progress |
| Circular (indeterminate) | 48dp default | Unknown duration > 2s |
| Linear (determinate) | 4dp height, full-width | Upload/download progress |
| Linear (indeterminate) | 4dp height, full-width | Unknown duration |

### Loading Indicator (M3 Expressive)

New component replacing most indeterminate circular progress for sub-5-second loads. Used in pull-to-refresh.

### Skeleton Screens

- Use when content structure is known
- Preferred over spinners for list/grid loading
- Shimmer animation optional (adds polished feel)
- Never show empty screen while loading

### Best Practices

- First load: skeleton/shimmer
- Refresh: spinner or pull-to-refresh indicator
- Progress > 2s with known total: progress bar
- Timeout after 10-30s: show error state with retry

---

## 19. Error Handling

### Patterns

| Pattern | When | M3 Implementation |
|---------|------|-------------------|
| Inline field error | Form validation | Red outline + red supporting text + error icon |
| Snackbar | Brief, non-blocking | Bottom bar with optional action |
| Banner | Persistent, non-blocking | Top of content area |
| Dialog | Critical, blocking | Centered dialog with action |
| Empty state | No data available | Illustration + message + CTA |

### Inline Field Error Anatomy

1. Field outline turns `error` color
2. Supporting text turns `error` color with error message
3. Trailing error icon appears (24dp)
4. Label turns `error` color
5. Focus indicator uses `error` color

---

## 20. Animations & Motion

### M3 Easing Curves (7)

| Token | Cubic-Bezier | Usage |
|-------|--------------|-------|
| `emphasized` | Path-based* | Default for most transitions |
| `emphasizedDecelerate` | `(0.05, 0.7, 0.1, 1.0)` | Elements entering screen |
| `emphasizedAccelerate` | `(0.3, 0.0, 0.8, 0.15)` | Elements leaving screen |
| `standard` | `(0.2, 0.0, 0, 1.0)` | Changes in place (resize, color) |
| `standardDecelerate` | `(0, 0, 0, 1.0)` | Entering from off-screen |
| `standardAccelerate` | `(0.3, 0, 1, 1.0)` | Exiting off-screen |
| `linear` | `(0, 0, 1, 1)` | Opacity-only, color fades |

*`emphasized` path: `M 0,0 C 0.05,0,0.133,0.06,0.167,0.4 C 0.208,0.82,0.25,1,1,1`

### M3 Duration Tokens (16)

| Token | ms | Use |
|-------|----|-----|
| `short1` | 50 | Micro-interactions (ripple start) |
| `short2` | 100 | Small state changes |
| `short3` | 150 | Icon transitions, toggles |
| `short4` | 200 | Small component enter/exit (chips) |
| `medium1` | 250 | Component enters (FAB, buttons) |
| `medium2` | 300 | Tab switches |
| `medium3` | 350 | Navigation rail, bottom nav |
| `medium4` | 400 | Card expand, partial-screen |
| `long1` | 450 | Bottom sheet, side sheet |
| `long2` | 500 | Navigation drawer, large cards |
| `long3` | 550 | Dialog enter/exit |
| `long4` | 600 | Full-screen enter |
| `extraLong1` | 700 | Page-level transitions |
| `extraLong2` | 800 | Complex multi-element sequences |
| `extraLong3` | 900 | Staggered list animations |
| `extraLong4` | 1000 | Very large/dramatic transitions |

### M3 Spring Parameters (6 — Expressive)

| Token | Damping | Stiffness (N/m) | Type | Use |
|-------|---------|-----------------|------|-----|
| `fastSpatial` | 0.9 | 1400 | Spatial | Switches, checkboxes |
| `fastEffects` | 1.0 | 3800 | Effects | Small color/opacity changes |
| `defaultSpatial` | 0.9 | 700 | Spatial | Bottom sheets, cards, drawers |
| `defaultEffects` | 1.0 | 1600 | Effects | Partial-screen color/opacity |
| `slowSpatial` | 0.9 | 300 | Spatial | Full-screen, page-level |
| `slowEffects` | 1.0 | 800 | Effects | Full-screen color/opacity |

**Spatial** (damping 0.9) = slight bounce — position, size, shape.
**Effects** (damping 1.0) = no bounce — color, opacity, blur.

### Reduce Motion

Respect `ANIMATOR_DURATION_SCALE == 0`. Replace non-essential animations with crossfade or instant.

---

## 21. Back Navigation

### Predictive Back

| Android Version | Behavior |
|-----------------|----------|
| Android 13-14 | Opt-in via developer options |
| Android 15 | System animations no longer behind dev option |
| Android 16 | Mandatory — `onBackPressed()` not called, `KEYCODE_BACK` not dispatched |

### Predictive Back Animations

| Animation | Trigger |
|-----------|---------|
| Back-to-home | Swipe from root activity, shows home screen preview |
| Cross-activity | Swipe shows destination preview within app |
| Cross-task | Cross-task destination preview |

### OnBackPressedCallback API

| Method | When |
|--------|------|
| `handleOnBackStarted()` | Gesture begins |
| `handleOnBackProgressed()` | Continuous during swipe (for custom animations) |
| `handleOnBackCancelled()` | User cancelled |
| `handleOnBackPressed()` | Gesture completed |

Tie callback enable/disable to observable UI state (e.g., dirty form = enabled).

### Android 16 Opt-Out (Temporary)

```xml
<application android:enableOnBackInvokedCallback="false">
```

Will be removed in future API levels.

---

## 22. Scrolling

| Behavior | Android Implementation |
|----------|------------------------|
| Overscroll | Stretch overscroll (Android 12+) |
| Pull-to-refresh | SwipeRefreshLayout or M3 pull-to-refresh |
| Collapsing toolbar | TopAppBar with scroll behavior |
| Momentum | Fling with friction |
| Snap | SnapHelper (RecyclerView) |
| Scroll-to-top | No system gesture (custom implementation) |

### M3 TopAppBar Scroll Behaviors

| Type | Behavior |
|------|----------|
| `enterAlwaysScrollBehavior` | Collapses on scroll up, enters on any scroll down |
| `exitUntilCollapsedScrollBehavior` | Collapses on scroll up, enters only at top |
| `pinnedScrollBehavior` | Stays visible, elevation changes on scroll |

---

## 23. Form Inputs

### Text Fields

| Property | Filled | Outlined |
|----------|--------|----------|
| Height | 56dp | 56dp |
| Corner radius | 4dp top, 0dp bottom | 4dp all |
| Default style | Filled (recommended) | Alternative |
| Label | Floating (animates on focus) | Floating |
| Helper text | Supporting text below (persistent) | Same |
| Error state | Red container + supporting text + error icon | Red outline + same |
| Counter | Character count in supporting text | Same |
| Leading icon | 24dp, inside field | Same |
| Trailing icon | Error, visibility toggle, clear (24dp) | Same |

### Pickers

| Type | M3 Component | Behavior |
|------|--------------|----------|
| Date | DatePicker (modal or docked) | Calendar grid, input mode |
| Date range | DateRangePicker | Two dates, calendar grid |
| Time | TimePicker (dial or input) | Clock dial or number input |
| Options | ExposedDropdownMenu | Dropdown below field |

---

## 24. Selection Controls

| Control | Size | Active Color |
|---------|------|--------------|
| Switch | 52x32dp (track) | `primary` (track), `onPrimary` (thumb) |
| Checkbox | 18dp box | `primary` fill, `onPrimary` check |
| Radio button | 20dp circle | `primary` fill |
| Segmented button | 40dp height | `secondaryContainer` fill |

### Switch Behavior

- Thumb smaller when off (16dp), larger when on (24dp)
- Optional icon in thumb (check when on, X when off)
- Track uses `surfaceContainerHighest` (off), `primary` (on)

### Ripple Effect

All interactive controls show ripple on press. Ripple color: `onSurface` at 12% opacity (light), 10% (dark).

---

## 25. Cards

### M3 Card Types

| Type | Surface Color | Border | Elevation | Use Case |
|------|---------------|--------|-----------|----------|
| Elevated | `surfaceContainerLow` | None | 1dp | Default, general content |
| Filled | `surfaceContainerHighest` | None | 0dp | Emphasis, visual grouping |
| Outlined | `surface` | `outlineVariant` 1dp | 0dp | Delineation, subtle |

### Card Specs

| Property | Value |
|----------|-------|
| Corner radius | 12dp (medium) |
| Internal padding | 16dp recommended |
| States | Ripple, pressed, focused, dragged |
| Min touch target | 48dp when interactive |

---

## 26. Menus

### M3 Menu Types

| Type | Trigger | Position |
|------|---------|----------|
| Dropdown menu | Tap on icon button | Below/above anchor |
| Exposed dropdown | Tap on text field | Below field |
| Overflow menu | Tap on three-dot icon | Below/above anchor |

### Menu Specs

| Property | Value |
|----------|-------|
| Min width | 112dp |
| Max width | 280dp |
| Item height | 48dp |
| Corner radius | 4dp |
| Elevation | Level 2 (3dp) |
| Leading icon | 24dp (optional) |
| Trailing text | Supporting text (optional) |
| Dividers | `outlineVariant`, 1dp |

M3 does NOT use long-press for menus — menus come from icon buttons and overflow.

---

## 27. Chips & Badges

### M3 Chips (4 Types)

| Type | Purpose | Interaction | Deletable |
|------|---------|-------------|-----------|
| Assist | Smart suggestions, actions | Tap to execute | No |
| Filter | Narrow content | Toggle on/off, checkmark | Optional |
| Input | User-entered info | Represent user input | Yes |
| Suggestion | Dynamic recommendations | Tap to insert/apply | No |

### Chip Specs

| Property | Value |
|----------|-------|
| Height | 32dp |
| Horizontal padding | 16dp (label), 8dp (with icon) |
| Leading icon | 18dp |
| Corner radius | 8dp |
| Label style | Label Large |

### Badges

| Type | Size | Content |
|------|------|---------|
| Small (dot) | 6dp | No content, presence indicator |
| Large | 16dp height | Number (up to 999+) |

Badge position: top-right of icon, overlapping by ~4dp.

---

## 28. Tablet & Large Screen

### Window Size Classes

| Class | Width (dp) | Typical Devices |
|-------|------------|-----------------|
| Compact | < 600 | 99.96% phones portrait |
| Medium | 600-839 | 93.73% tablets portrait, foldables |
| Expanded | 840-1199 | 97.22% tablets landscape |
| Large | 1200-1599 | Large tablets |
| Extra-large | >= 1600 | Desktop displays |

| Height Class | Range |
|--------------|-------|
| Compact | < 480dp |
| Medium | 480-899dp |
| Expanded | >= 900dp |

### Canonical Layouts

| Layout | When | Pattern |
|--------|------|---------|
| List-Detail | Browse + inspect items | List pane + detail pane |
| Supporting Pane | Main content + reference | Primary + supporting |
| Feed | Scrollable content stream | Wider cards, more columns |

### Navigation Adaptation

| Width | Phone | Tablet |
|-------|-------|--------|
| Compact (< 600) | Bottom nav bar | — |
| Medium (600-839) | — | Navigation rail (80dp) |
| Expanded (840+) | — | Navigation drawer (360dp) |

### Large Screen Enforcement (API 36+)

On displays with smallest width >= 600dp, these attributes are **ignored**:
- `android:screenOrientation`
- `android:resizableActivity="false"`
- `android:minAspectRatio` / `android:maxAspectRatio`
- `setRequestedOrientation()`

Apps fill the entire display window. Games (by `android:appCategory`) are exempt.

Temporary opt-out via `android.window.PROPERTY_COMPAT_ALLOW_RESTRICTED_RESIZABILITY` (API 36 only — removed in API 37).

**Android 17 (API 37)**: Orientation and resizability opt-out removed entirely. All apps must support resizable windows on large screens.

---

## 29. Orientation

Android recommends designing for **size classes, not orientation**.

| Size Class | Layout |
|------------|--------|
| Compact width | Single-column, full-width |
| Medium width | Optional second column |
| Expanded width | Multi-column, split view |

Android 16 (API 36): orientation restrictions ignored on >= 600dp displays. Android 17 (API 37): no opt-out — apps must support all orientations on large screens.

---

## 30. Notifications

### Android Notification Channels

| Importance | Constant | Sound | Heads-Up | Status Icon | Shade |
|------------|----------|-------|----------|-------------|-------|
| Urgent | `IMPORTANCE_HIGH` (4) | Yes | Yes | Yes | Yes |
| High | `IMPORTANCE_DEFAULT` (3) | Yes | No | Yes | Yes |
| Medium | `IMPORTANCE_LOW` (2) | No | No | Yes | Yes |
| Low | `IMPORTANCE_MIN` (1) | No | No | No | Yes |
| None | `IMPORTANCE_NONE` (0) | No | No | No | No |

Importance **cannot be changed** after channel creation. Users have full control over channel settings.

### Channel Groups

Organize channels in settings UI. Useful for multi-account apps. Associations immutable after submission.

### Notification Badges

Supported on Android 8.0+ launchers. Colored dot on app icon. Can show notification count in long-press popup.

### Live Updates (Android 16)

New `ProgressStyle` notification template for ongoing activities:
- Rideshare tracking
- Delivery status
- Navigation progress
- Real-time scores

### Best Practices

- Request `POST_NOTIFICATIONS` permission at contextually appropriate moment (API 33+)
- Group related notifications by thread
- Provide in-app notification settings
- Make notifications actionable (reply, mark done, snooze)

---

## 31. Play Store Compliance

### Target API Requirements

| Deadline | Requirement |
|----------|-------------|
| Aug 31, 2025 | New apps: API 35. Updates: API 35. |
| Nov 1, 2025 | Extension deadline for Aug 2025 |
| ~Aug 2026 | API 36 required — *projected per Google's annual pattern, not yet formally announced* |
| ~Aug 2027 | API 37 required — *projected per Google's annual pattern, not yet formally announced* |

Non-compliance: app updates blocked. Existing installs unaffected. Reduced discoverability for users on newer Android versions.

### Account Deletion Requirement

If account creation exists in-app, must provide an account deletion request path accessible both in-app and via web.

### Common Rejections

| Reason | Details |
|--------|---------|
| Permission misuse | Requesting unnecessary permissions |
| Data safety mismatch | Declared practices != actual SDK behavior |
| Privacy policy issues | Missing, PDF format, broken URL, generic |
| Content rating mismatch | Declared rating != actual content |
| Crashes/ANRs | Pre-launch test failures on virtual devices |
| Incomplete listing | Unclear descriptions, missing screenshots |
| SDK policy violations | Third-party SDK behavior not declared |

### Content Ratings

Must complete IARC questionnaire. Rating assigned based on:
- Violence level
- Sexual content
- Language
- Substance use
- Gambling
- User-generated content exposure

Mismatched rating = policy violation.

---

## 32. Privacy

### Data Safety Form

Required for all apps. Must declare:

| Category | Data Types |
|----------|------------|
| Location | Approximate, precise |
| Personal Info | Name, email, address, phone |
| Financial Info | Purchase history, credit info |
| Health & Fitness | Health, fitness data |
| Messages | Emails, SMS, other |
| Photos & Videos | Photos, videos |
| Audio | Voice recordings, music |
| Files & Docs | Documents |
| Calendar | Events |
| Contacts | Contact list |
| App Activity | Interactions, search history |
| Web Browsing | Browsing history |
| App Info | Crash logs, diagnostics |
| Device/Other IDs | Device identifiers |

### Declarations Required

| Declaration | What |
|-------------|------|
| Collection | Data transmitted off device (including SDKs) |
| Sharing | Data transferred to third parties |
| Encryption | Whether all data encrypted in transit |
| Deletion | Whether users can request data deletion |
| Purposes | Functionality, analytics, ads, fraud prevention, personalization |

### Privacy Policy

- Active URL (no PDFs)
- Non-editable
- Publicly accessible, non-geofenced
- Must cover all declared data collection
- Must be linked in Play Console AND accessible within the app
- Must be consistent with Data Safety form

### Android 16 Privacy Changes

- `MediaStore.getVersion()` now unique per app (anti-fingerprinting)
- Local network permission (opt-in phase, `NEARBY_WIFI_DEVICES`)
- App-owned photos pre-selected in photo picker when users limit access

---

## 33. M3 Expressive

Announced Google I/O 2025. Major visual update shipping with Android 16. Backed by 46 user research studies (18,000+ participants). Rolling out across Google apps (Gmail, Drive, etc.) as of early 2026.

### New Components

| Component | Description |
|-----------|-------------|
| **FAB Menu** | Menu panel from FAB for related actions; replaces speed-dial stacked FABs |
| **Button Group** | Coordinated shape, motion, and width across a row of buttons |
| **Split Button** | Leading = primary action, trailing = secondary menu |
| **Loading Indicator** | Replaces indeterminate circular progress for < 5s loads |
| **Docked Toolbar** | Replaces deprecated bottom app bar; shorter, more flexible |
| **Floating Toolbar** | Free-placement toolbar; varied positioning |

### Design Pillars

| Pillar | Details |
|--------|---------|
| **Spring-based Motion** | Physics springs replace duration+easing for spatial animations. Spatial (damping 0.9 = bounce) + Effects (damping 1.0 = no bounce). Three speeds: fast/default/slow. |
| **Vibrant Color** | Richer, more saturated dynamic color palette |
| **Shape** | 35 abstract shapes; 10-step corner radius scale; built-in shape-morph animations |
| **Typography** | Roboto Flex variable font; emphasized styles (higher weights); 30 total styles |

### Shape Scale (10 Steps)

| Token | Corner Radius |
|-------|---------------|
| None | 0dp |
| Extra Small | 4dp |
| Small | 8dp |
| Medium | 12dp |
| Large | 16dp |
| Large Increased | 20dp |
| Extra Large | 28dp |
| Extra Large Increased | 32dp |
| Extra Extra Large | 48dp |
| Full | 9999dp (pill) |

### Shape Morphing

Built-in animated transitions between shapes. Framework handles interpolation. Components morph shape on state changes (e.g., FAB expanding to FAB menu).

### Deprecations

- Bottom app bar -> use docked toolbar
- Speed-dial FAB pattern -> use FAB menu

---

## 34. Android 17 (API 37)

Android 17 Beta 2 released February 2026. Codename: CinnamonBun. Stable release expected Q2 2026.

### Key Changes

| Change | Details |
|--------|---------|
| Resizability enforcement | Orientation/resizability opt-out removed entirely on large screens |
| Generational GC | ART Concurrent Mark-Compact gets generational collection |
| EyeDropper API | System-level color picker from any pixel (no screen capture permission) |
| Handoff API | Cross-device state resumption (phone to tablet) |
| Secure contacts selection | New contact picker API |

---

## 35. Submission Checklist

- [ ] Target API requirement verified for current release cycle
- [ ] Data Safety + privacy policy + in-app behavior aligned
- [ ] Account deletion path provided (if account creation exists)
- [ ] Sensitive permission declarations complete and justified
- [ ] Edge-to-edge + insets + keyboard handling validated
- [ ] Predictive Back tested across core flows
- [ ] Tablet/foldable layouts tested at compact/medium/expanded widths
- [ ] Crash/ANR and restricted-access review paths verified
- [ ] Content rating questionnaire completed and accurate
- [ ] Adaptive icon with monochrome layer included

---

## Sources

### Material Design 3
- [M3 Overview](https://m3.material.io/)
- [M3 Typography](https://m3.material.io/styles/typography/type-scale-tokens)
- [M3 Color Roles](https://m3.material.io/styles/color/roles)
- [M3 Color Choosing](https://m3.material.io/styles/color/choosing-a-scheme)
- [M3 Motion](https://m3.material.io/styles/motion/easing-and-duration/tokens-specs)
- [M3 Motion Overview](https://m3.material.io/styles/motion/overview/specs)
- [M3 Shape](https://m3.material.io/styles/shape/shape-scale-tokens)
- [M3 Shape Morph](https://m3.material.io/styles/shape/shape-morph)
- [M3 Corner Radius](https://m3.material.io/styles/shape/corner-radius-scale)
- [M3 Layout / Window Size Classes](https://m3.material.io/foundations/layout/applying-layout/window-size-classes)
- [M3 Bottom Sheets](https://m3.material.io/components/bottom-sheets/guidelines)
- [M3 Snackbar](https://m3.material.io/components/snackbar/guidelines)
- [M3 Dialogs](https://m3.material.io/components/dialogs/guidelines)
- [M3 Lists](https://m3.material.io/components/lists/guidelines)
- [Material Components Android — Motion](https://github.com/material-components/material-components-android/blob/master/docs/theming/Motion.md)

### Android Developer
- [Android 15 Changes](https://developer.android.com/about/versions/15/behavior-changes-15)
- [Android 16 Changes](https://developer.android.com/about/versions/16/behavior-changes-16)
- [Android 16 All Apps](https://developer.android.com/about/versions/16/behavior-changes-all)
- [Android 16 Features](https://developer.android.com/about/versions/16/features)
- [Android 17 Release Notes](https://developer.android.com/about/versions/17/release-notes)
- [Android 17 Resizability](https://android-developers.googleblog.com/2026/02/prepare-your-app-for-resizability-and.html)
- [Edge-to-Edge](https://developer.android.com/develop/ui/views/layout/edge-to-edge)
- [Predictive Back](https://developer.android.com/guide/navigation/custom-back/predictive-back-gesture)
- [Adaptive Icons](https://developer.android.com/develop/ui/views/launch/icon_design_adaptive)
- [Splash Screen](https://developer.android.com/develop/ui/views/launch/splash-screen)
- [Permissions](https://developer.android.com/training/permissions/requesting)
- [Notification Channels](https://developer.android.com/develop/ui/views/notifications/channels)
- [Haptic Feedback](https://developer.android.com/develop/ui/views/haptics/haptic-feedback)
- [HapticFeedbackConstants](https://developer.android.com/reference/android/view/HapticFeedbackConstants)
- [Window Size Classes](https://developer.android.com/develop/ui/views/layout/use-window-size-classes)
- [Dynamic Colors](https://developer.android.com/develop/ui/views/theming/dynamic-colors)
- [Material Design 3 in Compose](https://developer.android.com/develop/ui/compose/designsystems/material3)

### Play Store & Privacy
- [Target API Requirements](https://support.google.com/googleplay/android-developer/answer/11926878)
- [Target API Policy](https://support.google.com/googleplay/android-developer/answer/16561298)
- [Data Safety](https://support.google.com/googleplay/android-developer/answer/10787469)
- [Account Deletion Requirements](https://support.google.com/googleplay/android-developer/answer/9859455)
- [Play Policy July 2025](https://support.google.com/googleplay/android-developer/answer/16296680)

### M3 Expressive
- [M3 Expressive — Building](https://m3.material.io/blog/building-with-m3-expressive)
- [M3 Expressive — Supercharge](https://supercharge.design/blog/material-3-expressive)
- [M3 Expressive — Android Authority](https://www.androidauthority.com/google-material-3-expressive-features-changes-availability-supported-devices-3556392/)
- [M3 Expressive — 9to5Google](https://9to5google.com/2025/05/13/android-16-material-3-expressive-redesign/)
- [M3 Expressive Menus — 9to5Google](https://9to5google.com/2025/11/22/material-3-expressive-menus/)
- [Flutter M3 Color Roles](https://docs.flutter.dev/release/breaking-changes/new-color-scheme-roles)
- [Material Color Utilities](https://github.com/material-foundation/material-color-utilities)
