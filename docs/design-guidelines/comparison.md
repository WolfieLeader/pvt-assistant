# Platform Comparison — Apple HIG · Material Design 3 · Samsung OneUI

Last verified: 2026-03-04

Side-by-side comparison tables. No Pvt.-specific decisions — see `docs/design-system.md` for app resolutions.

For full details, see per-platform files: [`apple.md`](apple.md) · [`android.md`](android.md) · [`samsung.md`](samsung.md)

---

## 1. Gestures

| Gesture                   | Apple HIG                                     | Material Design 3                                            | Samsung OneUI                        |
| ------------------------- | --------------------------------------------- | ------------------------------------------------------------ | ------------------------------------ |
| **Tap**                   | Activates control / selects item              | Same                                                         | Same                                 |
| **Swipe trailing (left)** | Reveals destructive actions (Delete, Archive) | Dismiss gesture — horizontal threshold                       | Consistent with Apple                |
| **Swipe leading (right)** | Contextual shortcuts (Pin, Read, Favorite)    | Same dismiss mechanism, either direction                     | Consistent with Apple                |
| **Long press**            | **Context menu** or rearrangement mode        | **Selection mode** (NOT context menu) — drag to multi-select | **Context menu** (untitled dropdown) |
| **Pinch**                 | Zoom in/out                                   | Same                                                         | Same                                 |
| **Shake**                 | Undo/redo (system)                            | N/A                                                          | N/A                                  |

**Key difference**: M3 uses long-press for selection, not context menus. Apple + Samsung both use long-press for context menus.

---

## 2. Touch Targets

| Metric           | Apple HIG               | Material Design 3   | Samsung OneUI                                                               |
| ---------------- | ----------------------- | ------------------- | --------------------------------------------------------------------------- |
| **Minimum**      | **44×44pt**             | **48×48dp**         | 48dp (M3 baseline)                                                          |
| **Content icon** | ≥24pt within target     | —                   | —                                                                           |
| **Spacing**      | No strict minimum       | 8dp between targets | —                                                                           |
| **Ergonomics**   | —                       | —                   | Thumb-reachable interaction area at bottom; reject/grip/cutout safety zones |
| **WCAG 2.2**     | 24×24 CSS px (Level AA) | Same                | Same                                                                        |

---

## 3. Modals & Dialogs

| Type             | Apple HIG                                 | Material Design 3                         | Samsung OneUI                      |
| ---------------- | ----------------------------------------- | ----------------------------------------- | ---------------------------------- |
| **Alert**        | Centered, small, 2-3 buttons              | Centered dialog                           | Center (information)               |
| **Action sheet** | Bottom (iPhone) / popover (iPad)          | Bottom sheet (modal) or menu              | **Bottom** (choices/confirmations) |
| **Sheet**        | Bottom slide-up, detents (.medium/.large) | Standard (non-modal) + Modal bottom sheet | N/A (uses bottom dialog)           |
| **Form sheet**   | Centered, smaller than full screen        | Full-screen dialog                        | N/A                                |
| **Context menu** | Long-press → preview + actions            | From icon buttons (NOT long-press)        | Long-press → untitled dropdown     |

### Dialog Position

| Purpose               | Apple                                     | M3          | Samsung    |
| --------------------- | ----------------------------------------- | ----------- | ---------- |
| Information           | Centered                                  | Centered    | **Center** |
| Choices/confirmations | Centered (alert) or bottom (action sheet) | Centered    | **Bottom** |
| Complex input         | Centered (form sheet)                     | Full-screen | —          |

### Dismissal

| Type           | Apple             | M3                                    | Samsung                      |
| -------------- | ----------------- | ------------------------------------- | ---------------------------- |
| Alert          | Button tap only   | Choice or tap outside                 | Choice, Back, or tap outside |
| Bottom sheet   | Swipe down, tap X | Swipe down, tap scrim, back           | Back, tap outside            |
| Dialog buttons | —                 | Right-aligned text buttons, no filled | **Flat** (no background)     |

---

## 4. Destructive Actions

| Aspect           | Apple HIG                          | Material Design 3                                 | Samsung OneUI                  |
| ---------------- | ---------------------------------- | ------------------------------------------------- | ------------------------------ |
| **Confirmation** | "Always require user confirmation" | Escalating friction by severity                   | Dialog for destructive choices |
| **Button color** | Red (`systemRed` #FF3B30/#FF453A)  | Red for destructive in dialogs                    | Red/danger styling             |
| **Placement**    | Top of action sheet                | Right side (away from primary flow)               | Within dialog                  |
| **Undo pattern** | Shake-to-undo + in-app undo        | **Snackbar with undo action** (4s/10s/indefinite) | N/A                            |
| **Swipe delete** | Swipe-to-delete in lists           | SwipeToDismiss                                    | Similar                        |

### Escalation Levels (All Platforms)

| Severity              | Pattern                                                  |
| --------------------- | -------------------------------------------------------- |
| Single item           | Undo option sufficient                                   |
| Bulk items            | Confirmation dialog                                      |
| Critical/irreversible | Explicit confirmation (type "DELETE", re-enter password) |

---

## 5. Lists

| Aspect              | Apple HIG                                    | Material Design 3                         | Samsung OneUI                     |
| ------------------- | -------------------------------------------- | ----------------------------------------- | --------------------------------- |
| **Min row height**  | 44pt                                         | 56dp (one-line), 72dp (two), 88dp (three) | 48dp                              |
| **Swipe actions**   | Trailing = destructive, leading = contextual | SwipeToDismiss horizontal                 | Similar                           |
| **Long press**      | Context menu                                 | Selection mode (multi-select)             | Context menu                      |
| **Dividers**        | Full-bleed or inset                          | 1dp, `outlineVariant` color               | Full-bleed                        |
| **Styles**          | plain / grouped / insetGrouped / sidebar     | M3 ListItem                               | Focus blocks (card/list/singular) |
| **Text limit**      | —                                            | —                                         | **31 chars** max per line         |
| **Pull-to-refresh** | System gesture                               | SwipeRefreshLayout                        | System gesture                    |

---

## 6. Navigation

| Aspect                  | Apple HIG                      | Material Design 3                                              | Samsung OneUI                      |
| ----------------------- | ------------------------------ | -------------------------------------------------------------- | ---------------------------------- |
| **Primary**             | Tab bar (2–5)                  | Bottom nav bar (3–5)                                           | Bottom tabs (3–5), **text only**   |
| **Tab labels**          | Icon + text, always visible    | Icon + text, always visible                                    | **Text only** (no icons)           |
| **Tab swipe**           | N/A                            | Not default on NavigationBar; supported on Tabs component only | **No swipe** between tabs          |
| **Nav bar height**      | —                              | 80dp                                                           | —                                  |
| **FAB**                 | Not native (custom)            | Core component — 56dp                                          | Supported                          |
| **Max depth**           | ≤2 taps from home              | Shallow hierarchy                                              | Minimize user movement             |
| **App bar**             | Large title → inline on scroll | TopAppBar (small/medium/large)                                 | **Extended ↔ condensed** two-state |
| **Max app bar actions** | 2-3 bar items                  | —                                                              | **3 max** (including title)        |

### Tablet Navigation Adaptation

| Width Class | dp Range | Apple      | M3                        | Samsung                |
| ----------- | -------- | ---------- | ------------------------- | ---------------------- |
| Compact     | < 600    | Tab bar    | Bottom nav                | Bottom tabs            |
| Medium      | 600–839  | Sidebar    | Navigation rail (80dp)    | Nav rail, modal drawer |
| Expanded    | 840+     | Split view | Navigation drawer (360dp) | Nav rail/drawer        |

---

## 7. Haptics

| Aspect         | Apple HIG                                                                                                                                          | Material Design 3                      | Samsung OneUI                                      |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------- | -------------------------------------------------- |
| **System**     | UIImpactFeedbackGenerator (light/medium/heavy/soft/rigid) + UINotificationFeedbackGenerator (success/warning/error) + UISelectionFeedbackGenerator | HapticFeedbackConstants (17 constants) | M3 constants + metaphor-based patterns             |
| **Timing**     | Within **100ms**; >250ms → abandonment                                                                                                             | —                                      | **< 30ms** duration                                |
| **Philosophy** | Physics-based intensity                                                                                                                            | Semantic constants                     | **Familiar metaphors** (realistic sensations)      |
| **Sync**       | —                                                                                                                                                  | —                                      | Visual movement must **perfectly match** vibration |

---

## 8. Typography

| Aspect           | Apple HIG                         | Material Design 3                                    | Samsung OneUI            |
| ---------------- | --------------------------------- | ---------------------------------------------------- | ------------------------ |
| **System font**  | SF Pro                            | Roboto (Roboto Flex for Expressive)                  | **Samsung One**          |
| **Body size**    | 17pt (Body)                       | 16sp (Body Large), 14sp (Body Medium)                | M3 baseline              |
| **Scale**        | 11 text styles                    | 15 roles (display/headline/title/body/label × L/M/S) | M3 scale baseline        |
| **Scaling**      | Dynamic Type (12 size categories) | Font scaling (1.0x–2.0x)                             | **200% resize** required |
| **Weight range** | Regular–Bold                      | 400–500                                              | M3 baseline              |
| **Contrast**     | 4.5:1 WCAG AA                     | 4.5:1 WCAG AA                                        | WCAG AA                  |

---

## 9. Accessibility

| Feature        | Apple (VoiceOver)                        | Android (TalkBack)                            |
| -------------- | ---------------------------------------- | --------------------------------------------- |
| Labels         | `accessibilityLabel`                     | `contentDescription`                          |
| Hints          | `accessibilityHint`                      | `stateDescription` (API 30+)                  |
| Traits         | `accessibilityTraits` (.button, .header) | `accessibilityRole` via AccessibilityNodeInfo |
| Grouping       | `accessibilityElements` container        | `importantForAccessibility`                   |
| Custom actions | `accessibilityCustomAction`              | `AccessibilityAction`                         |
| Announcements  | `UIAccessibility.post(.announcement)`    | `AccessibilityEvent.TYPE_ANNOUNCEMENT`        |
| Live regions   | —                                        | `accessibilityLiveRegion` (polite/assertive)  |
| Reduce Motion  | `UIAccessibility.isReduceMotionEnabled`  | `ANIMATOR_DURATION_SCALE == 0`                |

---

## 10. Dark Mode & Color System

| Aspect               | Apple                                                                  | Material Design 3                                          | Samsung OneUI                           |
| -------------------- | ---------------------------------------------------------------------- | ---------------------------------------------------------- | --------------------------------------- |
| **System**           | Semantic colors (backgrounds, labels, fills, separators, tints, grays) | ~49 color roles (accent, surface, utility, overlay, fixed) | M3 + Good Lock Theme Park               |
| **Dark bg**          | True black (#000000) for OLED                                          | Surface tint elevation (not shadows)                       | M3 baseline + blur/gradient effects     |
| **Dynamic color**    | N/A                                                                    | Material You — wallpaper-derived via HCT (Android 12+)     | M3 dynamic + gallery palette extraction |
| **Elevation (dark)** | Lighter grays for depth                                                | Tonal overlay (5–14% surfaceTint)                          | M3 baseline                             |
| **Tint colors**      | 12 system tint colors (shift lighter in dark)                          | Primary/secondary/tertiary from scheme                     | M3 + OneUI 8.x colored glass overlays   |

---

## 11. App Icons

| Aspect           | Apple                     | Android                                    | Samsung            |
| ---------------- | ------------------------- | ------------------------------------------ | ------------------ |
| **Size**         | 1024×1024px (auto-scaled) | 108×108dp (foreground + background layers) | Android adaptive   |
| **Visible area** | Full (squircle masked)    | 72dp diameter                              | 72dp               |
| **Safe zone**    | Full usable               | **66dp center**                            | 66dp               |
| **Shape**        | System squircle           | OEM-defined (circle, squircle, etc.)       | OEM                |
| **Variants**     | Dark + Tinted (iOS 18+)   | Monochrome layer (Android 13+)             | Android monochrome |
| **Store icon**   | 1024×1024px               | 512×512px PNG                              | 512×512px          |

---

## 12. Launch / Splash Screen

| Aspect             | Apple                               | Android (SplashScreen API)               |
| ------------------ | ----------------------------------- | ---------------------------------------- |
| **Implementation** | LaunchScreen.storyboard             | SplashScreen API (Android 12+)           |
| **Branding**       | No logos, no marketing              | 200×80dp branded image (not recommended) |
| **Animation**      | Not supported                       | ≤1000ms animated icon (AVD XML)          |
| **Content**        | Resemble first screen minus content | Icon in circle (160dp/192dp)             |
| **Duration**       | System-controlled                   | System-controlled                        |

---

## 13. Status Bar & Edge-to-Edge

| Aspect             | Apple                  | Android                                 |
| ------------------ | ---------------------- | --------------------------------------- |
| **Transparency**   | Always transparent     | **Mandatory transparent** (SDK 35+)     |
| **Color override** | N/A                    | `setStatusBarColor()` deprecated SDK 35 |
| **Edge-to-edge**   | Default behavior       | Mandatory SDK 35; no opt-out SDK 36     |
| **Status bar tap** | Scrolls content to top | No system behavior                      |

---

## 14. Safe Areas & Insets

| Aspect                | Apple                              | Android                             | Samsung                                 |
| --------------------- | ---------------------------------- | ----------------------------------- | --------------------------------------- |
| **Bottom (portrait)** | 34pt (home indicator, all Face ID) | 48dp (gesture nav)                  | Android baseline                        |
| **Side insets**       | 0pt (no notch)                     | 24dp (gesture back areas)           | **24dp minimum margins** (curved edges) |
| **Display cutout**    | Dynamic Island (59–68pt top)       | `WindowInsets.Type.displayCutout()` | + reject/grip/cutout safety zones       |
| **Keyboard**          | `KeyboardAvoidingView` (padding)   | `WindowInsets.Type.ime()`           | Android baseline                        |
| **React Native**      | `react-native-safe-area-context`   | Same                                | Same                                    |

---

## 15. Keyboard

| Type    | iOS `keyboardType` | Android Constant                    |
| ------- | ------------------ | ----------------------------------- |
| Default | `default`          | `TYPE_CLASS_TEXT`                   |
| Email   | `email-address`    | `TYPE_TEXT_VARIATION_EMAIL_ADDRESS` |
| Numeric | `number-pad`       | `TYPE_CLASS_NUMBER`                 |
| Phone   | `phone-pad`        | `TYPE_CLASS_PHONE`                  |
| Decimal | `decimal-pad`      | `TYPE_NUMBER_FLAG_DECIMAL`          |
| URL     | `url`              | `TYPE_TEXT_VARIATION_URI`           |

| Return Key | iOS      | Android             |
| ---------- | -------- | ------------------- |
| Done       | `done`   | `IME_ACTION_DONE`   |
| Go         | `go`     | `IME_ACTION_GO`     |
| Next       | `next`   | `IME_ACTION_NEXT`   |
| Search     | `search` | `IME_ACTION_SEARCH` |
| Send       | `send`   | `IME_ACTION_SEND`   |

---

## 16. Permissions

| Aspect                 | Apple                              | Android                                       |
| ---------------------- | ---------------------------------- | --------------------------------------------- |
| **Declaration**        | Info.plist purpose strings         | AndroidManifest.xml                           |
| **Runtime prompt**     | System dialog with purpose string  | System dialog (rationale optional)            |
| **Denied handling**    | Gracefully degrade, never block UI | `shouldShowRequestPermissionRationale()` flow |
| **One-time**           | N/A                                | Android 11+ (location, mic, camera)           |
| **Auto-revoke**        | N/A                                | Android 11+ (unused apps)                     |
| **Location hierarchy** | foreground / background (separate) | coarse → fine → background (incremental)      |
| **Timing**             | Just-in-time, not first launch     | Just-in-time                                  |

---

## 17. Search

| Aspect        | Apple                          | M3                            | Samsung                                                 |
| ------------- | ------------------------------ | ----------------------------- | ------------------------------------------------------- |
| **Placement** | Nav bar, revealed on pull-down | Search bar (56dp, persistent) | Search field in header (bottom-positioned in OneUI 8.5) |
| **Behavior**  | Full-screen overlay            | Expands into search view      | Inline results                                          |
| **Scopes**    | Scope bar (segmented control)  | N/A (use chips/filters)       | N/A                                                     |
| **Tokens**    | Tokenized search (iOS 16+)     | N/A                           | N/A                                                     |
| **Dismiss**   | Cancel button or swipe down    | Back arrow or X               | Back button                                             |

---

## 18. Loading States

| Pattern             | Apple                                   | Material Design 3                                        |
| ------------------- | --------------------------------------- | -------------------------------------------------------- |
| **Spinner**         | Activity indicator (indeterminate, <2s) | Circular progress (48dp), Loading Indicator (Expressive) |
| **Progress bar**    | Determinate                             | Linear (4dp height)                                      |
| **Skeleton**        | Preferred for first load                | Preferred for lists/grids                                |
| **Pull-to-refresh** | System gesture                          | SwipeRefreshLayout / M3 pull-to-refresh                  |
| **Timeout**         | 10–30s → error state                    | 10–30s → error state                                     |

---

## 19. Error Handling

| Pattern          | Apple                        | M3                                                    | Samsung  |
| ---------------- | ---------------------------- | ----------------------------------------------------- | -------- |
| **Inline field** | Red text + red border        | Red outline + red supporting text + error icon (24dp) | Red text |
| **Non-blocking** | Error banner                 | Snackbar with action                                  | —        |
| **Critical**     | Alert dialog                 | Dialog with action                                    | —        |
| **Empty state**  | Illustration + message + CTA | Same                                                  | Same     |

---

## 20. Animations & Motion

| Aspect              | Apple                                                     | Material Design 3                                               |
| ------------------- | --------------------------------------------------------- | --------------------------------------------------------------- |
| **Default type**    | Spring-based                                              | Easing curves (7) + springs (6, Expressive)                     |
| **Spring presets**  | .bouncy (d=0.7), .smooth (d=0.86), .snappy (d=0.86, fast) | fastSpatial (1400 N/m), defaultSpatial (700), slowSpatial (300) |
| **Duration tokens** | N/A (spring-based)                                        | 16 tokens: 50ms–1000ms                                          |
| **Easing curves**   | N/A (spring-based)                                        | emphasized, standard, linear + accel/decel variants             |
| **Reduce Motion**   | `isReduceMotionEnabled` → crossfade                       | `ANIMATOR_DURATION_SCALE == 0` → crossfade                      |

---

## 21. Back Navigation

| Aspect          | Apple                                                  | Android                                                            |
| --------------- | ------------------------------------------------------ | ------------------------------------------------------------------ |
| **Gesture**     | Swipe from left edge (≤iOS 25); **anywhere** (iOS 26+) | Swipe from either edge                                             |
| **Predictive**  | N/A                                                    | Destination preview during gesture (Android 15+, mandatory API 36) |
| **Button**      | "< Back" or "< [Previous Title]"                       | ← arrow or system back                                             |
| **Data loss**   | "Discard changes?" alert                               | `OnBackPressedCallback`                                            |
| **Root screen** | No back — tab bar navigates                            | Back-to-home (exits to launcher)                                   |

---

## 22. Scrolling

| Behavior            | Apple                          | Android                          | Samsung                            |
| ------------------- | ------------------------------ | -------------------------------- | ---------------------------------- |
| **Overscroll**      | Rubber-banding (bounce)        | Stretch overscroll (Android 12+) | Android baseline                   |
| **Scroll-to-top**   | Tap status bar                 | No system gesture                | No system gesture                  |
| **Title collapse**  | Large title 34pt → 17pt inline | TopAppBar scroll behaviors       | **Extended ↔ condensed** two-state |
| **Pull-to-refresh** | System gesture with haptic     | SwipeRefreshLayout               | System gesture                     |

---

## 23. Form Inputs

| Aspect               | Apple                      | M3                                             | Samsung      |
| -------------------- | -------------------------- | ---------------------------------------------- | ------------ |
| **Text field style** | Rounded rect or underline  | Filled (default) or Outlined                   | Rounded rect |
| **Height**           | 44pt                       | 56dp                                           | 48dp         |
| **Label**            | Placeholder text           | **Floating label** (animates on focus)         | Placeholder  |
| **Error**            | Red text + red border      | Red outline + red supporting text + error icon | Red text     |
| **Date picker**      | Wheel or calendar (inline) | Modal or docked calendar                       | —            |
| **Time picker**      | Wheel                      | Dial or input mode                             | —            |
| **Stepper**          | − / + buttons (native)     | No native stepper                              | —            |

---

## 24. Selection Controls

| Control       | Apple                                       | M3                                            | Samsung             |
| ------------- | ------------------------------------------- | --------------------------------------------- | ------------------- |
| **Switch**    | Green track (#34C759), 51×31pt, white thumb | Primary track, 52×32dp, thumb grows on toggle | Samsung styled      |
| **Checkbox**  | Not native (use list checkmark)             | 18dp box, primary fill                        | M3 baseline         |
| **Radio**     | Not native (use list selection)             | 20dp circle, primary fill                     | M3 baseline         |
| **Segmented** | UISegmentedControl                          | Segmented button (40dp)                       | Samsung tab/segment |

---

## 25. Cards

| Aspect            | Apple                          | M3                                                     | Samsung                           |
| ----------------- | ------------------------------ | ------------------------------------------------------ | --------------------------------- |
| **Types**         | Inset grouped list (card-like) | Elevated / Filled / Outlined                           | Focus blocks (card/list/singular) |
| **Corner radius** | ~10pt (continuous curve)       | 12dp (medium)                                          | 16dp                              |
| **Elevation**     | Subtle shadow                  | Elevated: 1dp, Filled: 0dp+tonal, Outlined: 0dp+border | Subtle shadow                     |
| **Padding**       | System inset                   | 16dp recommended                                       | Samsung grid rules                |

---

## 26. Menus

| Type             | Apple                            | M3                                     | Samsung               |
| ---------------- | -------------------------------- | -------------------------------------- | --------------------- |
| **Context menu** | Long-press → preview + actions   | **Not from long-press** (icon buttons) | Long-press → dropdown |
| **Pull-down**    | Tap bar button                   | Dropdown from icon button              | —                     |
| **Overflow**     | "..." ellipsis                   | ⋮ three-dot                            | ⋮ more options        |
| **Action sheet** | Bottom (iPhone) / popover (iPad) | Bottom sheet or menu                   | Bottom dialog         |

---

## 27. Chips / Badges

| Aspect        | Apple                      | M3                                             | Samsung           |
| ------------- | -------------------------- | ---------------------------------------------- | ----------------- |
| **Chips**     | No native component        | 4 types: assist/filter/input/suggestion (32dp) | —                 |
| **Tab badge** | Red circle (number or dot) | Badge: 6dp (dot) or 16dp (number)              | Red dot or number |
| **App badge** | Red circle with number     | Notification dot on icon (Android 8+)          | —                 |

---

## 28. Tablet & Large Screen

| Aspect           | Apple (iPad)                                               | M3 (Android)                                                                    | Samsung                                        |
| ---------------- | ---------------------------------------------------------- | ------------------------------------------------------------------------------- | ---------------------------------------------- |
| **Size classes** | Compact / Regular (width+height)                           | 5 width classes (compact–extra-large)                                           | M3 classes + DeX                               |
| **Layouts**      | Split view, sidebar, popovers                              | List-Detail, Supporting Pane, Feed                                              | Multi-pane ratios (42:58, 38:62)               |
| **Multitasking** | Slide Over + Split View + Stage Manager                    | Multi-window                                                                    | Up to **3 split + 5 pop-up** windows           |
| **Desktop mode** | N/A                                                        | —                                                                               | **DeX** (FHD/HD+/WQHD, 160dpi, mouse+keyboard) |
| **Orientation**  | Strongly recommended for both (HIG guidance, not hard req) | Size classes, not orientation; resizability mandatory API 36, no opt-out API 37 | —                                              |
| **Drag & drop**  | Inter-app and intra-app                                    | —                                                                               | Cross-window D&D                               |

---

## 29. Notifications

| Aspect            | Apple (iOS)                        | Android                                     |
| ----------------- | ---------------------------------- | ------------------------------------------- |
| **System**        | 4 interruption levels              | Notification channels (5 importance levels) |
| **Passive / Low** | No sound, no wake                  | IMPORTANCE_MIN: no sound, no icon           |
| **Default**       | Sound + badge                      | IMPORTANCE_DEFAULT: sound, no heads-up      |
| **Urgent**        | Time Sensitive: breaks Focus       | IMPORTANCE_HIGH: sound + heads-up           |
| **Critical**      | Overrides mute (Apple entitlement) | —                                           |
| **Rich**          | Images, video, custom UI           | Expandable, custom layouts                  |
| **Actions**       | Up to 4 buttons                    | Unlimited (practical limit ~3)              |
| **Permission**    | System prompt (just-in-time)       | `POST_NOTIFICATIONS` (API 33+)              |
| **Live updates**  | Live Activities                    | ProgressStyle notification (Android 16)     |

---

## 30. Store Compliance

| Aspect                  | Apple App Store                                                                                    | Google Play Store                                                                   |
| ----------------------- | -------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| **Top rejections**      | Crashes (2.1), metadata (2.3), missing IAP (3.1.1), poor UI (4.0), too simple (4.2), privacy (5.1) | Permission misuse, data safety mismatch, privacy policy, crashes/ANRs               |
| **Account deletion**    | Required if account creation exists                                                                | Required if account creation exists                                                 |
| **AI disclosure**       | Must name AI provider + explicit consent (Nov 2025)                                                | —                                                                                   |
| **Target SDK**          | Xcode 26 / iOS 26 SDK (**April 28, 2026**)                                                         | API 35 (Aug 2025), API 36 (_~Aug 2026, projected_), API 37 (_~Aug 2027, projected_) |
| **Privacy declaration** | Privacy nutrition labels + PrivacyInfo.xcprivacy                                                   | Data safety form                                                                    |
| **Binary limit**        | ≤200MB default cellular prompt threshold (user-configurable)                                       | —                                                                                   |
| **Upcoming**            | iOS 27 / WWDC 2026 (~June 2026, _date not confirmed_)                                              | Android 17 (API 37) — Beta 2 out, stable Q2 2026                                    |

---

## 31. Privacy

| Aspect               | Apple                                        | Android                                |
| -------------------- | -------------------------------------------- | -------------------------------------- |
| **Tracking**         | ATT framework (iOS 14.5+), ~25-30% opt-in    | —                                      |
| **Privacy manifest** | PrivacyInfo.xcprivacy (required reason APIs) | Data safety form                       |
| **Data declaration** | Nutrition labels in App Store Connect        | Data safety categories in Play Console |
| **Purpose strings**  | Info.plist keys (24+ keys)                   | —                                      |
| **Privacy policy**   | In-app accessible, web OK                    | Active URL, non-PDF, non-editable      |

---

## 32. Version Timeline

| Platform          | Current                            | Next                                            | Key Deadline                         |
| ----------------- | ---------------------------------- | ----------------------------------------------- | ------------------------------------ |
| **iOS**           | iOS 26 (Liquid Glass, Xcode 26)    | iOS 27 (WWDC 2026, _~June, date TBA_)           | Xcode 26 SDK required April 28, 2026 |
| **Android**       | Android 16 (API 36, M3 Expressive) | Android 17 (API 37, Beta 2 out, stable Q2 2026) | API 36 target required Aug 2026      |
| **Samsung OneUI** | OneUI 8.5 (Feb 2026, Galaxy S26)   | —                                               | Follows Android timeline             |

---

## Quick Decision Matrix

| Scenario                  | Recommended Pattern                           | Source                                            |
| ------------------------- | --------------------------------------------- | ------------------------------------------------- |
| View item details         | Centered modal or push navigation             | Samsung (center info), Apple (sheet/push)         |
| Edit item                 | Bottom sheet form                             | All platforms                                     |
| Delete single item        | Swipe-left trash + undo snackbar              | Material (snackbar undo), Apple (swipe-to-delete) |
| Delete bulk / critical    | Confirmation dialog + explicit label          | All platforms                                     |
| Show item actions         | Long-press context menu                       | Apple + Samsung                                   |
| Select multiple items     | Long-press → selection mode                   | Material Design                                   |
| Pick from options         | Bottom sheet or action sheet                  | All platforms                                     |
| Show feedback             | Toast/snackbar at bottom                      | Material (snackbar), Apple (banner)               |
| Navigate between sections | Bottom tab bar (phone), rail (tablet)         | All platforms + window size classes               |
| Primary action            | FAB (bottom-right)                            | Material (core), Apple+Samsung (custom)           |
| Loading (< 2s)            | Activity indicator / spinner                  | All platforms                                     |
| Loading (data)            | Skeleton screen / shimmer                     | All platforms                                     |
| Progress feedback         | Progress bar with percentage                  | All platforms                                     |
| Field validation error    | Inline red text below field                   | All platforms (M3 adds border + icon)             |
| Non-blocking error        | Toast/snackbar with retry action              | Material (snackbar), Apple (banner)               |
| Critical error            | Alert dialog with action                      | All platforms                                     |
| Empty state               | Illustration + message + CTA                  | All platforms                                     |
| Request permission        | Just-in-time, when feature invoked            | Apple + Android                                   |
| Search                    | Search bar in header, full-screen results     | All platforms                                     |
| Settings                  | Grouped list with switches/navigation         | All platforms                                     |
| Share content             | System share sheet                            | All platforms                                     |
| Theme switching           | Follow system, manual toggle in settings      | All platforms                                     |
| Tablet layout             | List-detail split, navigation rail            | Window size classes                               |
| Date/time selection       | Native platform picker                        | Apple (wheel/calendar), M3 (modal/docked)         |
| Back navigation           | Swipe from edge (iOS) / either edge (Android) | Platform native                                   |
