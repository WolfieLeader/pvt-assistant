# Apple Human Interface Guidelines — iOS / iPadOS

Standalone reference for Apple platform design. All values from Apple HIG, WWDC sessions, and official documentation.

Last verified: 2026-03-04

---

## 1. Gestures

| Gesture                      | Behavior                                      |
| ---------------------------- | --------------------------------------------- |
| **Tap**                      | Activates control / selects item              |
| **Swipe trailing (left)**    | Reveals destructive actions (Delete, Archive) |
| **Swipe leading (right)**    | Contextual shortcuts (Pin, Read, Favorite)    |
| **Long press**               | Context menu or rearrangement mode            |
| **Pinch**                    | Zoom in/out                                   |
| **Shake**                    | Undo/redo (system-level)                      |
| **Swipe from edge**          | Back navigation (left edge; iOS 26: anywhere) |
| **Two-finger drag**          | Scroll in scroll views                        |
| **Three-finger pinch**       | Copy/cut/paste (system)                       |
| **Three-finger swipe left**  | Undo                                          |
| **Three-finger swipe right** | Redo                                          |

Long press activates context menus. This differs from Material Design which uses long press for selection mode.

---

## 2. Touch Targets

| Metric                      | Value                                         |
| --------------------------- | --------------------------------------------- |
| **Minimum target size**     | 44×44pt                                       |
| **Content icon minimum**    | ≥24pt within the 44pt target                  |
| **Spacing between targets** | No strict minimum, but should avoid misclicks |
| **hitSlop**                 | Use when visual element < 44pt                |

All interactive elements must be at least 44×44pt. This is smaller than Material Design's 48×48dp but close after density scaling.

---

## 3. Modals & Dialogs

| Type                   | Description                          | Position                           |
| ---------------------- | ------------------------------------ | ---------------------------------- |
| **Alert**              | Essential info, 2-3 buttons max      | Centered                           |
| **Action sheet**       | Choices related to an action         | Bottom (iPhone) / popover (iPad)   |
| **Sheet (page sheet)** | Scoped task related to context       | Bottom slide-up                    |
| **Form sheet**         | Gathering information                | Centered, smaller than full screen |
| **Context menu**       | Long-press on items                  | In-place with preview              |
| **Popover**            | Secondary info, iPad only from arrow | Anchored to source                 |

### Dismissal Patterns

| Type         | Dismiss Method                         |
| ------------ | -------------------------------------- |
| Alert        | Button tap only (not tappable outside) |
| Action sheet | Tap action, tap Cancel, swipe down     |
| Sheet        | Swipe down, tap X button               |
| Popover      | Tap outside                            |
| Context menu | Tap outside, tap action                |

### Sheet Detents

Sheets support multiple stop points (detents):

- `.medium` — half screen
- `.large` — full height
- Custom fraction via `UISheetPresentationController.Detent.custom`

---

## 4. Destructive Actions

| Rule               | Details                                                      |
| ------------------ | ------------------------------------------------------------ |
| **Always confirm** | "Always require user confirmation" before destructive action |
| **Button color**   | Red — `systemRed` (#FF3B30 light / #FF453A dark)             |
| **Placement**      | Top of action sheet (most prominent position)                |
| **Label**          | Explicit verb — "Delete Expense" not "Delete"                |
| **Undo**           | System shake-to-undo + in-app undo patterns                  |
| **Swipe delete**   | Swipe-to-delete in lists with confirmation or undo           |

### Escalation Levels

| Severity              | Pattern                                                  |
| --------------------- | -------------------------------------------------------- |
| Single item           | Undo option sufficient                                   |
| Bulk items            | Confirmation dialog                                      |
| Critical/irreversible | Explicit confirmation (re-enter password, type "DELETE") |

---

## 5. Lists

| Aspect                     | Value                          |
| -------------------------- | ------------------------------ |
| **Minimum row height**     | 44pt                           |
| **Swipe actions trailing** | Destructive (Delete, Archive)  |
| **Swipe actions leading**  | Contextual (Pin, Flag, Read)   |
| **Long press**             | Context menu                   |
| **Dividers**               | Full-bleed or inset            |
| **Pull to refresh**        | System gesture                 |
| **Empty state**            | Custom illustration encouraged |
| **Section headers**        | Grouped/inset grouped styles   |

### List Styles (UIKit / SwiftUI)

| Style           | Appearance                                                |
| --------------- | --------------------------------------------------------- |
| `.plain`        | Full-width rows, no grouping                              |
| `.grouped`      | Sections with headers, gray background                    |
| `.insetGrouped` | Card-like sections with rounded corners, inset from edges |
| `.sidebar`      | iPadOS sidebar navigation style                           |

---

## 6. Navigation

### Primary Patterns

| Pattern              | When to Use                            |
| -------------------- | -------------------------------------- |
| **Tab bar**          | 2–5 top-level destinations             |
| **Navigation stack** | Push/pop hierarchy (detail views)      |
| **Sidebar**          | Many categories, flat hierarchy (iPad) |
| **Split view**       | List → detail on iPad                  |

### Tab Bar

| Rule             | Value                                                                |
| ---------------- | -------------------------------------------------------------------- |
| Items            | 2–5                                                                  |
| Label visibility | Always visible (icon + text)                                         |
| Badge            | Red circle with number or dot                                        |
| iOS 26           | Floats above content, minimizes on scroll down, expands on scroll up |
| iPad             | Tab bar + sidebar unified; scales with canvas size                   |

### Navigation Bar

| Element     | Details                                                     |
| ----------- | ----------------------------------------------------------- |
| Title       | Centered or large title (left-aligned, collapses on scroll) |
| Back button | "< Back" or "< [Previous Title]"                            |
| Right items | Up to 2–3 bar button items                                  |
| Large title | 34pt, collapses to inline 17pt on scroll                    |

### Depth Rule

Main functions should be reachable within ≤2 taps from the home screen.

---

## 7. Haptics

### Feedback Generators

| Generator                         | Styles                                           | Use Case                                   |
| --------------------------------- | ------------------------------------------------ | ------------------------------------------ |
| `UIImpactFeedbackGenerator`       | `.light`, `.medium`, `.heavy`, `.soft`, `.rigid` | Physical metaphor — collisions, snaps      |
| `UINotificationFeedbackGenerator` | `.success`, `.warning`, `.error`                 | Task outcomes                              |
| `UISelectionFeedbackGenerator`    | `.selectionChanged`                              | Scrolling through picker, selection change |

### Timing Rules

| Rule                  | Value                                              |
| --------------------- | -------------------------------------------------- |
| Max latency           | Feedback within **100ms** of event                 |
| Abandonment threshold | >250ms lag causes user to stop expecting feedback  |
| Prepare               | Call `.prepare()` before trigger to reduce latency |

### When to Use

- All toggle changes
- Swipe action commits
- Delete confirmations
- Picker value changes
- Pull-to-refresh activation
- Success/error outcomes

---

## 8. Typography

### SF Pro Text Styles — Default Sizes (at "Large" / default setting)

| Text Style  | Size (pt) | Weight       | Leading (pt) |
| ----------- | --------- | ------------ | ------------ |
| Large Title | 34        | Regular      | 41           |
| Title 1     | 28        | Regular      | 34           |
| Title 2     | 22        | Regular      | 28           |
| Title 3     | 20        | Regular      | 25           |
| Headline    | 17        | **Semibold** | 22           |
| Body        | 17        | Regular      | 22           |
| Callout     | 16        | Regular      | 21           |
| Subheadline | 15        | Regular      | 20           |
| Footnote    | 13        | Regular      | 18           |
| Caption 1   | 12        | Regular      | 16           |
| Caption 2   | 11        | Regular      | 13           |

### Dynamic Type — Complete Size Table (pt)

7 standard sizes + 5 accessibility sizes. Default is **Large**.

| Style       | xS  | S   | M   | **L**  | xL  | xxL | xxxL | AX1 | AX2 | AX3 | AX4 | AX5 |
| ----------- | --- | --- | --- | ------ | --- | --- | ---- | --- | --- | --- | --- | --- |
| Large Title | 31  | 32  | 33  | **34** | 36  | 38  | 40   | 44  | 48  | 52  | 56  | 60  |
| Title 1     | 25  | 26  | 27  | **28** | 30  | 32  | 34   | 38  | 43  | 48  | 53  | 58  |
| Title 2     | 20  | 20  | 21  | **22** | 24  | 26  | 28   | 34  | 43  | 44  | 50  | 56  |
| Title 3     | 17  | 18  | 19  | **20** | 22  | 24  | 26   | 31  | 37  | 43  | 43  | 55  |
| Headline    | 14  | 15  | 16  | **17** | 19  | 21  | 23   | 28  | 33  | 40  | 47  | 53  |
| Body        | 14  | 15  | 16  | **17** | 19  | 21  | 23   | 28  | 33  | 40  | 47  | 53  |
| Callout     | 13  | 14  | 15  | **16** | 18  | 22  | 23   | 26  | 32  | 38  | 44  | 51  |
| Subhead     | 12  | 13  | 14  | **15** | 17  | 19  | 21   | 25  | 30  | 36  | 42  | 49  |
| Footnote    | 12  | 12  | 12  | **13** | 15  | 17  | 19   | 23  | 27  | 33  | 38  | 44  |
| Caption 1   | 11  | 11  | 11  | **12** | 14  | 16  | 18   | 22  | 26  | 32  | 37  | 43  |
| Caption 2   | 11  | 11  | 11  | **11** | 13  | 15  | 17   | 20  | 24  | 29  | 34  | 40  |

Source: Apple HIG Typography Specifications; sizes do not follow a simple multiplier — each style has predefined values per category.

Use `UIFont.preferredFont(forTextStyle:)` in UIKit or `.font(.body)` in SwiftUI. Use `UIFontMetrics` for custom fonts that scale with Dynamic Type.

---

## 9. Accessibility

### VoiceOver

| Feature        | API                                                                      |
| -------------- | ------------------------------------------------------------------------ |
| Label          | `accessibilityLabel` — concise description of element                    |
| Hint           | `accessibilityHint` — describes result of action                         |
| Traits         | `accessibilityTraits` — `.button`, `.header`, `.selected`, `.adjustable` |
| Grouping       | `accessibilityElements` container                                        |
| Custom actions | `accessibilityCustomAction`                                              |
| Announcements  | `UIAccessibility.post(.announcement, argument:)`                         |
| Value          | `accessibilityValue` — current value for adjustable elements             |

### Dynamic Type Support

- All text must scale with Dynamic Type
- Use text styles (not fixed sizes) for all UI text
- Test at all 12 size categories (xSmall through AX5)
- Truncation: allow multiline wrapping; avoid cutting off text at large sizes
- `@ScaledMetric` in SwiftUI for non-text dimensions that should scale

### Reduce Motion

| Setting             | Detection                                     | Behavior                                            |
| ------------------- | --------------------------------------------- | --------------------------------------------------- |
| Reduce Motion       | `UIAccessibility.isReduceMotionEnabled`       | Replace animations with crossfade; disable parallax |
| Reduce Transparency | `UIAccessibility.isReduceTransparencyEnabled` | Increase opacity of translucent elements            |

### Contrast

| Element                                  | Minimum Ratio (WCAG 2.1 AA) |
| ---------------------------------------- | --------------------------- |
| Normal text (<18pt regular / <14pt bold) | 4.5:1                       |
| Large text (≥18pt regular / ≥14pt bold)  | 3:1                         |
| UI components (borders, icons)           | 3:1                         |

### Color Independence

Never convey information through color alone. Always pair with icons, text labels, patterns, or position.

### React Native Props

| Prop                   | Purpose                                         |
| ---------------------- | ----------------------------------------------- |
| `accessible`           | Mark as accessibility element                   |
| `accessibilityLabel`   | Screen reader text                              |
| `accessibilityHint`    | Describes result of action                      |
| `accessibilityRole`    | `button`, `header`, `link`, `image`, etc.       |
| `accessibilityState`   | `{disabled, selected, checked, busy, expanded}` |
| `accessibilityValue`   | `{min, max, now, text}`                         |
| `accessibilityActions` | Custom actions array                            |

---

## 10. Dark Mode — iOS Semantic Colors

All colors automatically adapt to light/dark mode. Use semantic colors, not hardcoded hex.

### Backgrounds

| Color                              | Light     | Dark      |
| ---------------------------------- | --------- | --------- |
| `systemBackground`                 | `#FFFFFF` | `#000000` |
| `secondarySystemBackground`        | `#F2F2F7` | `#1C1C1E` |
| `tertiarySystemBackground`         | `#FFFFFF` | `#2C2C2E` |
| `systemGroupedBackground`          | `#F2F2F7` | `#000000` |
| `secondarySystemGroupedBackground` | `#FFFFFF` | `#1C1C1E` |
| `tertiarySystemGroupedBackground`  | `#F2F2F7` | `#2C2C2E` |

### Labels

| Color             | Light (base / alpha) | Dark (base / alpha) |
| ----------------- | -------------------- | ------------------- |
| `label`           | `#000000` / 1.0      | `#FFFFFF` / 1.0     |
| `secondaryLabel`  | `#3C3C43` / 0.6      | `#EBEBF5` / 0.6     |
| `tertiaryLabel`   | `#3C3C43` / 0.3      | `#EBEBF5` / 0.3     |
| `quaternaryLabel` | `#3C3C43` / 0.18     | `#EBEBF5` / 0.18    |

### Fills

| Color                  | Light (base / alpha) | Dark (base / alpha) |
| ---------------------- | -------------------- | ------------------- |
| `systemFill`           | `#787880` / 0.2      | `#787880` / 0.36    |
| `secondarySystemFill`  | `#787880` / 0.16     | `#787880` / 0.32    |
| `tertiarySystemFill`   | `#767680` / 0.12     | `#767680` / 0.24    |
| `quaternarySystemFill` | `#747480` / 0.08     | `#747480` / 0.18    |

### Separators & Other

| Color             | Light              | Dark               |
| ----------------- | ------------------ | ------------------ |
| `separator`       | `#3C3C43` / α 0.29 | `#545458` / α 0.65 |
| `opaqueSeparator` | `#C6C6C8`          | `#38383A`          |
| `link`            | `#007AFF`          | `#0A84FF`          |
| `placeholderText` | `#3C3C43` / α 0.3  | `#EBEBF5` / α 0.3  |

### System Tint Colors

| Color          | Light     | Dark      |
| -------------- | --------- | --------- |
| `systemRed`    | `#FF3B30` | `#FF453A` |
| `systemOrange` | `#FF9500` | `#FF9F0A` |
| `systemYellow` | `#FFCC00` | `#FFD60A` |
| `systemGreen`  | `#34C759` | `#30D158` |
| `systemMint`   | `#00C7BE` | `#63E6E2` |
| `systemTeal`   | `#30B0C7` | `#40CBE0` |
| `systemCyan`   | `#32ADE6` | `#64D2FF` |
| `systemBlue`   | `#007AFF` | `#0A84FF` |
| `systemIndigo` | `#5856D6` | `#5E5CE6` |
| `systemPurple` | `#AF52DE` | `#BF5AF2` |
| `systemPink`   | `#FF2D55` | `#FF375F` |
| `systemBrown`  | `#A2845E` | `#AC8E68` |

### System Grays

| Color         | Light     | Dark      |
| ------------- | --------- | --------- |
| `systemGray`  | `#8E8E93` | `#8E8E93` |
| `systemGray2` | `#AEAEB2` | `#636366` |
| `systemGray3` | `#C7C7CC` | `#48484A` |
| `systemGray4` | `#D1D1D6` | `#3A3A3C` |
| `systemGray5` | `#E5E5EA` | `#2C2C2E` |
| `systemGray6` | `#F2F2F7` | `#1C1C1E` |

### Dark Mode Design Rules

- Never hardcode colors — always use semantic or adaptive colors
- Dark mode background is true black (`#000000`) for OLED efficiency
- Elevated surfaces use lighter grays (not shadows) for depth
- Vibrancy increases in dark mode (tint colors shift to lighter variants)
- Test both modes at all Dynamic Type sizes

---

## 11. App Icons

| Requirement            | Value                                                     |
| ---------------------- | --------------------------------------------------------- |
| Size                   | 1024×1024px single asset (auto-scaled by system)          |
| Shape                  | System applies squircle mask — do not add rounded corners |
| Transparency           | Not allowed                                               |
| Alpha channel          | Not allowed (flat only)                                   |
| Color space            | sRGB or Display P3                                        |
| iOS 18+ dark variant   | Darker background, lighter glyph                          |
| iOS 18+ tinted variant | Monochrome glyph on tint-colored background               |

### iOS 26 Icon Changes

App icons adopt a new clear look with Liquid Glass material, allowing the background to use a light or dark tint that appears transparent.

---

## 12. Launch Screen

| Aspect         | Requirement                                                        |
| -------------- | ------------------------------------------------------------------ |
| Implementation | Storyboard (`LaunchScreen.storyboard`) or Info.plist configuration |
| Branding       | No logos, no marketing text                                        |
| Animation      | Not supported                                                      |
| Content        | Should resemble first screen minus content                         |
| Background     | Match app background color                                         |
| Duration       | System-controlled (as brief as possible)                           |
| Caching        | System caches — must delete app to see changes during dev          |

---

## 13. Status Bar

| Aspect         | Details                                               |
| -------------- | ----------------------------------------------------- |
| Content style  | Light content (white text) / dark content (dark text) |
| Transparency   | Always transparent (content scrolls behind)           |
| Height         | Device-dependent (see Safe Areas)                     |
| Time / battery | Always shown except in full-screen mode               |
| Hiding         | Allowed for immersive content only                    |
| Tap            | Tapping status bar scrolls content to top             |

---

## 14. Safe Areas

### iPhone Safe Area Insets — Portrait (pt)

| Device                  | Screen (pt)       | Scale | Top | Bottom | Left | Right |
| ----------------------- | ----------------- | ----- | --- | ------ | ---- | ----- |
| iPhone SE (3rd gen)     | 375×667           | 2x    | 20  | 0      | 0    | 0     |
| iPhone 13 mini          | 375×812           | 2.88x | 50  | 34     | 0    | 0     |
| iPhone 13 / 13 Pro      | 390×844           | 3x    | 47  | 34     | 0    | 0     |
| iPhone 13 Pro Max       | 428×926           | 3x    | 47  | 34     | 0    | 0     |
| iPhone 14               | 390×844           | 3x    | 47  | 34     | 0    | 0     |
| iPhone 14 Plus          | 428×926           | 3x    | 47  | 34     | 0    | 0     |
| iPhone 14 Pro           | 393×852           | 3x    | 59  | 34     | 0    | 0     |
| iPhone 14 Pro Max       | 430×932           | 3x    | 59  | 34     | 0    | 0     |
| iPhone 15 / 15 Plus     | 393×852 / 430×932 | 3x    | 59  | 34     | 0    | 0     |
| iPhone 15 Pro / Pro Max | 393×852 / 430×932 | 3x    | 59  | 34     | 0    | 0     |
| iPhone 16               | 393×852           | 3x    | 59  | 34     | 0    | 0     |
| iPhone 16 Plus          | 430×932           | 3x    | 59  | 34     | 0    | 0     |
| iPhone 16 Pro           | 402×874           | 3x    | 62  | 34     | 0    | 0     |
| iPhone 16 Pro Max       | 440×956           | 3x    | 62  | 34     | 0    | 0     |
| iPhone 17               | 402×874           | 3x    | 62  | 34     | 0    | 0     |
| iPhone 17 Pro           | 402×874           | 3x    | 62  | 34     | 0    | 0     |
| iPhone 17 Pro Max       | 440×956           | 3x    | 62  | 34     | 0    | 0     |
| iPhone Air              | 420×912           | 3x    | 68  | 34     | 0    | 0     |

### iPhone Safe Area Insets — Landscape (pt)

| Device Group                    | Top | Bottom | Left | Right |
| ------------------------------- | --- | ------ | ---- | ----- |
| iPhone SE (3rd gen)             | 0   | 0      | 0    | 0     |
| Notch models (13, 14, 14 Plus)  | 0   | 21     | 47   | 47    |
| Dynamic Island (14 Pro–16 Plus) | 0   | 21     | 59   | 59    |
| iPhone 16 Pro / Pro Max         | 0   | 21     | 62   | 62    |
| iPhone 17 series                | 20  | 20     | 62   | 62    |
| iPhone Air                      | 20  | 29     | 68   | 68    |

**Note**: Bottom 34pt (portrait) = home indicator on all Face ID devices. iPhone SE has physical home button (no bottom inset). iPhone 17+ has new 20pt top inset in landscape. Do not hardcode safe-area values per device model; use runtime safe-area APIs.

### iPad Safe Area Insets (pt)

| Device                        | Portrait Top | Portrait Bottom | Landscape Top | Landscape Bottom |
| ----------------------------- | ------------ | --------------- | ------------- | ---------------- |
| Modern iPads (no home button) | 24           | 20              | 24            | 20               |
| iPads with home button        | 20           | 0               | 20            | 0                |

Left/right insets are 0 on all iPads (no notch/island).

### React Native

```
react-native-safe-area-context:
- <SafeAreaView> for automatic padding
- useSafeAreaInsets() for manual control
- initialWindowMetrics for splash screen layout
```

---

## 15. Keyboard

### Keyboard Types

| Type    | `keyboardType` Value | Use Case                       |
| ------- | -------------------- | ------------------------------ |
| Default | `default`            | General text                   |
| Email   | `email-address`      | Email fields (@ and . visible) |
| Numeric | `number-pad`         | Numbers only                   |
| Phone   | `phone-pad`          | Phone numbers                  |
| Decimal | `decimal-pad`        | Currency, amounts              |
| URL     | `url`                | Web addresses                  |

### Return Key Types

| Type   | `returnKeyType` Value |
| ------ | --------------------- |
| Done   | `done`                |
| Go     | `go`                  |
| Next   | `next`                |
| Search | `search`              |
| Send   | `send`                |

### Keyboard Avoidance

iOS system automatically scrolls to focused field. In React Native, use `KeyboardAvoidingView` with `behavior="padding"` on iOS.

### Input Accessory View

Toolbar above keyboard for additional actions (Done button, navigation arrows). Use `inputAccessoryView` in UIKit or `InputAccessoryView` component in React Native.

---

## 16. Permissions — Info.plist Purpose Strings

Every permission requires a human-readable purpose string explaining _why_ the app needs access. Generic strings get rejected by App Store review.

| Key                                                  | When Required                 |
| ---------------------------------------------------- | ----------------------------- |
| `NSCameraUsageDescription`                           | Camera capture                |
| `NSPhotoLibraryUsageDescription`                     | Selecting photos/videos       |
| `NSPhotoLibraryAddUsageDescription`                  | Saving photos/videos          |
| `NSLocationWhenInUseUsageDescription`                | Foreground location           |
| `NSLocationAlwaysAndWhenInUseUsageDescription`       | Background location           |
| `NSMicrophoneUsageDescription`                       | Audio recording               |
| `NSFaceIDUsageDescription`                           | Face ID authentication        |
| `NSContactsUsageDescription`                         | Contacts read/write           |
| `NSCalendarsUsageDescription`                        | Calendar events               |
| `NSRemindersUsageDescription`                        | Reminders read/write          |
| `NSMotionUsageDescription`                           | Core Motion / accelerometer   |
| `NSBluetoothAlwaysUsageDescription`                  | BLE peripherals               |
| `NSBluetoothPeripheralUsageDescription`              | Bluetooth peripheral (legacy) |
| `NSSpeechRecognitionUsageDescription`                | Speech-to-text                |
| `NSUserTrackingUsageDescription`                     | ATT / IDFA tracking           |
| `NSLocalNetworkUsageDescription`                     | Bonjour / local network       |
| `NSAppleMusicUsageDescription`                       | Apple Music / media library   |
| `NSSiriUsageDescription`                             | SiriKit intents               |
| `NSHealthShareUsageDescription`                      | Reading HealthKit data        |
| `NSHealthUpdateUsageDescription`                     | Writing HealthKit data        |
| `NSHealthClinicalHealthRecordsShareUsageDescription` | Clinical health records       |
| `NSHomeKitUsageDescription`                          | HomeKit smart home            |
| `NFCReaderUsageDescription`                          | NFC reader                    |
| `NSVideoSubscriberAccountUsageDescription`           | Video subscriber (tvOS)       |

### Best Practices

- Request at contextually appropriate moment (just-in-time), not on first launch
- Explain benefit to user before system prompt
- Gracefully degrade if denied
- Never block the entire UI on permission denial

---

## 17. Search

| Aspect      | Details                                                         |
| ----------- | --------------------------------------------------------------- |
| Placement   | In navigation bar, revealed on pull-down                        |
| Behavior    | Full-screen overlay with results                                |
| Scope bar   | Segmented control below search field                            |
| Tokens      | Tokenized search (iOS 16+) — pills representing filter criteria |
| Suggestions | Recent searches + suggested results                             |
| Dismiss     | Cancel button or swipe down                                     |

---

## 18. Loading States

| Pattern                | When to Use                                  |
| ---------------------- | -------------------------------------------- |
| **Activity indicator** | Indeterminate, <2s expected (spinning wheel) |
| **Progress bar**       | Determinate progress (upload, download)      |
| **Skeleton screen**    | Content structure known, loading data        |
| **Pull-to-refresh**    | User-initiated content refresh               |
| **Inline spinner**     | Loading within a button or component         |

### Rules

- Show skeleton/shimmer for first load, spinner for refresh
- Never show empty screen while loading
- Progress bars for operations >2s with known progress
- Timeout after 10–30s and show error state

---

## 19. Error Handling

| Pattern          | When to Use                                              |
| ---------------- | -------------------------------------------------------- |
| **Inline error** | Form field validation — red text below field, red border |
| **Error banner** | Non-blocking error affecting whole section               |
| **Error alert**  | Critical error requiring acknowledgment                  |
| **Empty state**  | No data — illustration + message + CTA                   |
| **Retry button** | Recoverable error                                        |

### Error State Anatomy

1. Icon — visual indicator
2. Title — what happened (short)
3. Description — why, and what user can do
4. Action — retry button, settings link, dismiss

---

## 20. Animations & Motion

### Spring Animations (Default)

iOS uses spring-based animation as the default. Parameters:

| Parameter         | Description                                                         |
| ----------------- | ------------------------------------------------------------------- |
| `response`        | Duration-like (seconds) — lower = faster                            |
| `dampingFraction` | 0 = no damping (infinite bounce), 1 = critically damped (no bounce) |
| `blendDuration`   | Overlap with other animations                                       |

### SwiftUI Spring Presets

| Preset               | Parameters                             | Character                  |
| -------------------- | -------------------------------------- | -------------------------- |
| `.spring()`          | response: 0.55, dampingFraction: 0.825 | Default, balanced          |
| `.smooth`            | duration: 0.5, extraBounce: 0.0        | No bounce, elegant         |
| `.snappy`            | duration: 0.5, small extraBounce       | Minimal bounce, responsive |
| `.bouncy`            | duration: 0.5, large extraBounce       | Playful, visible overshoot |
| `.interactiveSpring` | response: 0.15, dampingFraction: 0.86  | Gesture-driven, immediate  |

### Common UIKit Presets

| Preset    | response | dampingFraction | Character             |
| --------- | -------- | --------------- | --------------------- |
| `.bouncy` | ~0.5     | ~0.7            | Visible bounce        |
| `.smooth` | ~0.5     | ~0.86           | Critically damped     |
| `.snappy` | ~0.35    | ~0.86           | Quick, minimal bounce |

### Reduce Motion

When Reduce Motion is enabled:

- Replace all non-essential animations with crossfade or instant state changes
- Disable parallax effects
- Keep functional animations (scroll, navigation transitions) but simplify them
- Check: `UIAccessibility.isReduceMotionEnabled` or `AccessibilityInfo.isReduceMotionEnabled` (RN)

---

## 21. Back Navigation

| Aspect                | Details                                                           |
| --------------------- | ----------------------------------------------------------------- |
| **Gesture (iOS ≤25)** | Swipe from left edge                                              |
| **Gesture (iOS 26+)** | Swipe from **anywhere** on screen (if not on interactive element) |
| **Button**            | "< Back" or "< [Previous Title]" in nav bar                       |
| **Data loss**         | Alert: "Discard changes?" if unsaved data                         |
| **Root screen**       | No back button — tab bar navigates                                |
| **Interruptible**     | Back gesture is interactive and cancellable mid-swipe             |

The iOS 26 back gesture change makes navigation easier on large phones. Works with system apps and third-party apps using standard UINavigationController.

---

## 22. Scrolling

| Behavior                 | Details                                           |
| ------------------------ | ------------------------------------------------- |
| **Overscroll**           | Rubber-banding (bounces back)                     |
| **Scroll-to-top**        | Tap status bar                                    |
| **Large title collapse** | Nav bar title shrinks from 34pt to 17pt on scroll |
| **Pull-to-refresh**      | System gesture with haptic                        |
| **Momentum**             | Deceleration rate: `.normal` or `.fast`           |
| **Paging**               | Optional snap-to-page behavior                    |

---

## 23. Form Inputs

### Text Fields

| Aspect       | Value                                |
| ------------ | ------------------------------------ |
| Height       | 44pt minimum                         |
| Style        | Rounded rect or underline            |
| Label        | Placeholder text (no floating label) |
| Error        | Red text + red border                |
| Clear button | Trailing X button while editing      |
| Leading icon | Optional                             |

### Pickers

| Type    | Component                                                  |
| ------- | ---------------------------------------------------------- |
| Date    | Wheel picker, compact calendar (inline), or calendar sheet |
| Time    | Wheel picker                                               |
| Options | `UIPickerView` (wheel)                                     |

### Stepper

`UIStepper` — minus/plus buttons, 44pt height. For increment/decrement of numeric values.

### Slider

`UISlider` — continuous by default. Track + thumb.

---

## 24. Selection Controls

| Control               | Appearance                                                           |
| --------------------- | -------------------------------------------------------------------- |
| **Switch (Toggle)**   | 51×31pt, green track (`#34C759`) when on, gray when off, white thumb |
| **Checkbox**          | Not native iOS — use custom or list checkmark                        |
| **Radio button**      | Not native iOS — use list with checkmark selection                   |
| **Segmented control** | `UISegmentedControl` — horizontal segments, equal width              |

---

## 25. Cards

iOS does not have a native "card" component. The card-like appearance comes from **inset grouped list** style.

| Aspect        | Value                                    |
| ------------- | ---------------------------------------- |
| Corner radius | ~10pt (system default, continuous curve) |
| Background    | `secondarySystemGroupedBackground`       |
| Shadow        | Subtle or none                           |
| Padding       | System inset margins                     |

---

## 26. Menus

| Type               | Trigger                  | Description                      |
| ------------------ | ------------------------ | -------------------------------- |
| **Context menu**   | Long press               | Preview + action list, in-place  |
| **Pull-down menu** | Tap bar button           | Drops down from button           |
| **Action sheet**   | Programmatic             | Bottom (iPhone) / popover (iPad) |
| **Overflow**       | "..." or ellipsis button | Pull-down menu                   |

### Context Menu Features

- Shows blurred preview of item
- Actions grouped in sections
- Supports destructive styling (red text)
- Supports submenus
- Can include inline menu sections (displayed without nesting)

---

## 27. Chips / Badges

### Badges

| Context        | Appearance                    |
| -------------- | ----------------------------- |
| Tab bar badge  | Red circle with number or dot |
| App icon badge | Red circle with number        |
| List cell      | Accessory badge               |

iOS has no native chip component. For cross-platform consistency, use custom pill-shaped buttons.

---

## 28. Tablet — iPad

### Size Classes

| Device + Orientation                  | Width Class | Height Class |
| ------------------------------------- | ----------- | ------------ |
| iPhone portrait                       | Compact     | Regular      |
| iPhone landscape                      | Compact     | Compact      |
| iPhone Plus landscape                 | Regular     | Compact      |
| iPad portrait                         | Regular     | Regular      |
| iPad landscape                        | Regular     | Regular      |
| iPad Split View (narrow)              | Compact     | Regular      |
| iPad Split View 50/50 landscape (Pro) | Regular     | Regular      |

### iPad Patterns

| Feature       | Details                                              |
| ------------- | ---------------------------------------------------- |
| Split view    | Primary (list) + secondary (detail) side-by-side     |
| Sidebar       | Persistent sidebar for navigation                    |
| Popovers      | Use popovers instead of sheets/action sheets on iPad |
| Multitasking  | Must support Slide Over + Split View                 |
| Drag and drop | Support inter-app and intra-app                      |
| Stage Manager | Resizable windows; use size classes, not fixed sizes |

### Multitasking Split Ratios

| Orientation | Ratios Available    |
| ----------- | ------------------- |
| Landscape   | 50:50, 25:75, 75:25 |
| Portrait    | ~30:60              |

### Slide Over

A narrow floating window (~320pt wide, Compact width class) hovering over the main app. Must support Compact width layouts.

---

## 29. Orientation

| Device | Requirement                                                                                                                               |
| ------ | ----------------------------------------------------------------------------------------------------------------------------------------- |
| iPad   | **Strongly recommended to support both orientations** (HIG guidance; not a hard App Store rule, but violations may trigger 4.0 rejection) |
| iPhone | Portrait default; landscape optional per app                                                                                              |

Design for size classes, not specific devices:

- **Compact width** → single-column, full-width content
- **Regular width** → multi-column, sidebar, split view

---

## 30. Notifications

### Interruption Levels

| Level                | Sound                | Wake | Focus Breakthrough               |
| -------------------- | -------------------- | ---- | -------------------------------- |
| **Passive**          | No                   | No   | No                               |
| **Active** (default) | Yes                  | Yes  | No                               |
| **Time Sensitive**   | Yes                  | Yes  | Yes (breaks through Focus)       |
| **Critical**         | Yes (overrides mute) | Yes  | Yes (requires Apple entitlement) |

### Features

| Feature            | Details                                    |
| ------------------ | ------------------------------------------ |
| Rich notifications | Images, video, audio, custom UI            |
| Actions            | Up to 4 action buttons                     |
| Grouping           | Automatic by thread ID or app              |
| Summary            | Scheduled summary in Focus modes           |
| Permission         | Request at contextually appropriate moment |

---

## 31. App Store Compliance

### Top Rejection Reasons

| Guideline   | Reason                                             | Fix                                                      |
| ----------- | -------------------------------------------------- | -------------------------------------------------------- |
| 2.1         | Crashes, broken flows, incomplete features         | Thorough QA on all supported devices                     |
| 2.3         | Misleading metadata/screenshots                    | Match metadata exactly to functionality                  |
| 2.5.1/2.5.2 | Use of private APIs or downloading executable code | Use only public APIs                                     |
| 3.1.1       | Missing IAP for digital content                    | Use StoreKit; add "Restore Purchases"                    |
| 4.0         | Non-standard UI, poor device adaptation            | Follow HIG, support all screen sizes                     |
| 4.2         | Too simple, repackaged website                     | Provide meaningful native functionality                  |
| 4.8         | Sign in with Apple parity                          | If third-party login offered, evaluate SIWA requirements |
| 5.1.1       | Data collection without consent                    | Minimize collection, explain purpose                     |
| 5.1.2       | Undisclosed third-party data sharing               | Disclose all sharing in privacy label                    |

### Additional Requirements

| Requirement           | Details                                                                                                                   |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| Account deletion      | If app supports account creation, must allow in-app deletion                                                              |
| Privacy policy        | Must be accessible within the app                                                                                         |
| IPv6                  | Must work on IPv6-only networks                                                                                           |
| Binary size           | ≤200MB default cellular download prompt threshold (user-configurable in Settings)                                         |
| Xcode 26 / iOS 26 SDK | Required for new submissions starting April 28, 2026                                                                      |
| Liquid Glass adoption | Opt-out available in iOS 26 via `UIDesignRequiresCompatibility`; removal in iOS 27 is _projected, not confirmed by Apple_ |

### AI Disclosure (Guideline 5.1.2(i), Nov 2025)

| Rule                      | Details                                                       |
| ------------------------- | ------------------------------------------------------------- |
| Third-party AI disclosure | Must identify AI provider by name                             |
| Consent                   | Explicit in-app permission before sending personal data to AI |
| Generic language          | "We may share with service providers" — rejected              |
| Consent mechanism         | Pop-ups or visible interaction, not just privacy policy       |
| Content moderation        | AI features must be rated appropriately                       |

---

## 32. Privacy

### App Tracking Transparency (ATT)

| Aspect         | Details                                        |
| -------------- | ---------------------------------------------- |
| Framework      | `AppTrackingTransparency`                      |
| When required  | Before accessing IDFA or cross-app tracking    |
| iOS version    | 14.5+                                          |
| Prompt timing  | Contextually appropriate, not first launch     |
| Opt-in rates   | ~25–30% average                                |
| Purpose string | `NSUserTrackingUsageDescription` in Info.plist |

### Privacy Manifest (PrivacyInfo.xcprivacy)

| Aspect         | Details                                           |
| -------------- | ------------------------------------------------- |
| File           | `PrivacyInfo.xcprivacy` (property list)           |
| Enforcement    | Since May 1, 2024 — rejections for non-compliance |
| Rejection rate | ~12% of submissions in Q1 2025                    |

### Required Reason APIs

Must declare approved reason codes for using these APIs:

| API Category        | Examples                                                 |
| ------------------- | -------------------------------------------------------- |
| File timestamp APIs | `NSFileCreationDate`, `NSFileModificationDate`           |
| System boot time    | `systemUptime`, `ProcessInfo.processInfo.systemUptime`   |
| Disk space APIs     | `volumeAvailableCapacityKey`, `FileManager` disk queries |
| User defaults       | `UserDefaults` standard                                  |
| Active keyboards    | `activeInputModes`                                       |

### Privacy Nutrition Labels

Accurate declaration in App Store Connect of:

- Data types collected
- Whether data is linked to identity
- Whether data is used for tracking
- Purposes (analytics, functionality, advertising, etc.)

---

## 33. Liquid Glass (iOS 26)

Introduced at WWDC 2025. Most significant design evolution since iOS 7. A translucent material that reflects and refracts surrounding content.

### Auto-Adoption (No Code Changes)

| Component         | Behavior                                               |
| ----------------- | ------------------------------------------------------ |
| NavigationBar     | Automatic glass material                               |
| TabBar            | Floats, minimizes on scroll down, expands on scroll up |
| Toolbar           | Automatic glass material                               |
| Sheets / Popovers | Glass material applied                                 |
| Alerts            | Glass material applied                                 |
| Search bars       | Glass material applied                                 |
| Toggles / Sliders | Glass during interaction                               |

### Tab Bar Changes (iOS 26)

- Floats above content (no longer anchored to bottom edge)
- Minimizes to small pill on scroll down
- Expands on scroll up
- Tab bar and sidebar unified as single nav element on iPad
- Cannot override tab bar background on iOS 26+

### Glass Variants

| Variant     | Use Case                              | Transparency | Adaptivity |
| ----------- | ------------------------------------- | ------------ | ---------- |
| `.regular`  | Toolbars, buttons, nav bars, tab bars | Medium       | Full       |
| `.clear`    | Small floating controls over media    | High         | Limited    |
| `.identity` | Conditional disable (no effect)       | None         | N/A        |

### SwiftUI API

```swift
// Basic
view.glassEffect(.regular, in: .capsule)

// With tint
view.glassEffect(Glass.regular.tint(.blue), in: .capsule)

// Interactive (scaling, bounce, shimmer on press)
view.glassEffect(Glass.regular.interactive(), in: .capsule)

// Container for morphing between glass elements
GlassEffectContainer(spacing: 30) {
    Button(...).glassEffect().glassEffectID("btn1", in: namespace)
    Button(...).glassEffect().glassEffectID("btn2", in: namespace)
}
```

### UIKit API

- `UIGlassEffect` with `UIVisualEffectView`
- `UIGlassContainerEffect` for grouping

### Shape Options

`.capsule` (default), `.circle`, `RoundedRectangle(cornerRadius:)`, `.ellipse`, `.rect(cornerRadius: .containerConcentric)`, custom `Shape`.

### User Controls (iOS 26.2+)

Users can adjust Liquid Glass appearance via Settings > Display & Brightness > Liquid Glass:

- **Clear** (default) — standard translucent look
- **Tinted** — adds more contrast and opacity for improved readability

### Opt-Out

| Scope                  | Method                                                                    |
| ---------------------- | ------------------------------------------------------------------------- |
| Per-view (SwiftUI)     | `.glassEffect(.none)`                                                     |
| Per-view (UIKit)       | `hidesSharedBackground = true`                                            |
| Global scroll opt-out  | `UIScrollView.appearance().allowsLiquidTransform = false`                 |
| Full adoption deadline | Opt-out exists in iOS 26; removal in iOS 27 is _projected, not confirmed_ |

### Key Rules

| Rule                     | Details                                                           |
| ------------------------ | ----------------------------------------------------------------- |
| Don't stack glass        | Glass = navigation layer only. Never on list rows, cards, content |
| Avoid busy backgrounds   | Glass refracts — complex backgrounds = visual noise               |
| Use GlassEffectContainer | Required for morphing + shared sampling region                    |
| Content stays non-glass  | Lists, tables, media, text — never glass                          |
| Text on glass            | Automatically gets vibrant treatment; use high-contrast colors    |

### Accessibility (Automatic)

- Reduce Transparency: Increases frosting
- Increased Contrast: Stark colors and borders
- Reduce Motion: Tones down elastic effects
- iOS 26.1+ Tinted Mode: User-controlled opacity

### React Native / Expo

- Requires Expo SDK 54+, Xcode 26+
- Native tabs (`UITabBarController`) get Liquid Glass automatically
- Tab bar background adapts automatically — cannot be overridden

---

## 34. Submission Checklist

- [ ] No crashes/blocking defects in reviewed flows
- [ ] Metadata/screenshots/privacy declarations match shipped behavior
- [ ] IAP/account deletion/login compliance checked
- [ ] Sign in with Apple parity evaluated (if third-party login offered)
- [ ] Permission prompts are contextual and clearly explained
- [ ] Accessibility + Dynamic Type + contrast verified
- [ ] iPad layout and multitasking scenarios tested
- [ ] Privacy Manifest and required-reason API declarations current
- [ ] AI disclosure compliance (if applicable)
- [ ] Built with Xcode 26 / iOS 26 SDK
- [ ] Liquid Glass rendering verified in key flows
- [ ] Time-sensitive requirements rechecked before each release

---

## Sources

- [Apple HIG](https://developer.apple.com/design/human-interface-guidelines/)
- [Apple HIG — Typography](https://developer.apple.com/design/human-interface-guidelines/typography)
- [Apple HIG — Color](https://developer.apple.com/design/human-interface-guidelines/color)
- [Apple HIG — Modality](https://developer.apple.com/design/human-interface-guidelines/modality)
- [Apple HIG — Gestures](https://developer.apple.com/design/human-interface-guidelines/gestures)
- [App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [Apple Upcoming Requirements](https://developer.apple.com/news/upcoming-requirements/)
- [Account Deletion Requirements](https://developer.apple.com/support/offering-account-deletion-in-your-app/)
- [Screenshot Specifications](https://developer.apple.com/help/app-store-connect/reference/app-information/screenshot-specifications)
- [Safe Area Insets](https://developer.apple.com/documentation/uikit/uiview/safeareainsets)
- [Info.plist Reference](https://developer.apple.com/documentation/bundleresources/information_property_list)
- [App Tracking Transparency](https://developer.apple.com/documentation/apptrackingtransparency)
- [Privacy Manifest Files](https://developer.apple.com/documentation/bundleresources/privacy_manifest_files)
- [Liquid Glass Overview](https://developer.apple.com/documentation/TechnologyOverviews/liquid-glass)
- [Liquid Glass Reference (GitHub)](https://github.com/conorluddy/LiquidGlassReference)
- [Dynamic Type Sizes Visualized](https://observablehq.com/@thierryc/dynamic-type-sizes-visualized)
- [iPhone Screen Sizes (UseYourLoaf)](https://useyourloaf.com/blog/iphone-16-screen-sizes/)
- [Spring Animations Guide](https://github.com/GetStream/swiftui-spring-animations)
- [iOS Permissions Reference](https://www.iosdev.recipes/info-plist/permissions/)
- [WWDC25 — Build a SwiftUI app with the new design](https://developer.apple.com/videos/play/wwdc2025/323/)
- [WWDC25 — Build a UIKit app with the new design](https://developer.apple.com/videos/play/wwdc2025/284/)
- [WWDC24 — Get started with Dynamic Type](https://developer.apple.com/videos/play/wwdc2024/10074/)
