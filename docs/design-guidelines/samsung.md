# Samsung OneUI — Deltas from Material Design 3

OneUI builds on M3 but diverges in structure, ergonomics, and component behavior. This document covers **only** where OneUI differs from or adds to M3 baseline. Reader is assumed to know M3 from `android.md`.

**OneUI version**: 8.x (Android 16) — latest: OneUI 8.5, launched Feb 2026 with Galaxy S26 series
**Last verified**: 2026-03-04

---

## 1. Screen Structure — Viewing Area vs Interaction Area

M3 has no equivalent concept. OneUI divides every screen into two functional zones based on thumb reachability.

| Zone                 | Position | Content                                          | Purpose                |
| -------------------- | -------- | ------------------------------------------------ | ---------------------- |
| **Viewing area**     | Top      | Titles, headers, images, non-interactive content | Information display    |
| **Interaction area** | Bottom   | Buttons, tabs, navigation, dialogs, toggles      | All touch interactions |

Rules:

- Straight-line separation between zones (no complex shapes — reduces visual complexity)
- Viewing area uses wide margins for "open space" impression
- Center-aligned typography in viewing area for visual stability
- All frequently-used components must be in interaction area (thumb-reachable)
- Images in viewing area use straight cuts to minimize content loss

> Source: [Basic layout](https://developer.samsung.com/one-ui/layout/basic.html), [Basic structure](https://developer.samsung.com/one-ui/structure/basic.html)

---

## 2. Touch Targets & Safety Zones

M3 defines 48dp minimum touch targets. OneUI adds **safety zones** for Samsung's curved-edge displays.

| Zone            | Purpose                                                                     |
| --------------- | --------------------------------------------------------------------------- |
| **Reject zone** | Blocks accidental touches in the interaction area                           |
| **Grip zone**   | Blocks palm and three-finger touches during normal phone handling           |
| **Cutout area** | Optimized positioning around camera cutouts (90deg and 270deg orientations) |

All interactive components must stay within the safe area defined by these zones. Re-check cutout handling for both portrait and landscape states.

> Source: [Grid system](https://developer.samsung.com/one-ui/layout/grid.html)

---

## 3. Dialogs — Bottom vs Center Placement

**Key divergence from M3**: M3 centers all dialogs. OneUI positions dialogs based on whether they require user action.

| Dialog Purpose          | Position   | Examples                                             |
| ----------------------- | ---------- | ---------------------------------------------------- |
| Choices / confirmations | **Bottom** | Delete confirmation, action list, settings selection |
| Information / progress  | **Center** | Loading indicator, status alert, progress popup      |

Rules:

- If action is required -> bottom (interaction area)
- If no action allowed (e.g., loading) -> center
- Button style in dialogs: **flat** (no background color) — avoids visual clutter
- Higher priority action buttons placed at bottom of dialog
- Dismissal: user choice, Back button, or tap outside

> Source: [Dialog](https://developer.samsung.com/one-ui/comp/dialog.html)

---

## 4. App Bar — Condensed vs Extended

M3 has TopAppBar with small/medium/large variants. OneUI replaces this with a two-state system optimized for one-handed use.

| State         | Behavior                                                                                   | When                 |
| ------------- | ------------------------------------------------------------------------------------------ | -------------------- |
| **Extended**  | Title centered, functions/buttons lower (thumb reach), more info/notifications below title | Default on page load |
| **Condensed** | Standard height, more content visible                                                      | User scrolls down    |

Scroll behavior:

- Scroll down -> extended collapses to condensed
- Scroll up -> condensed expands to extended
- State persisted across app revisits

Component rules:

- Max **3 action buttons** per page (including title)
- Icon buttons recommended; text buttons for hard-to-symbolize actions
- Dynamic titles can replace standard app/page names for critical info
- Dynamic titles support up to 2 action buttons beneath them
- Long titles: auto-resize, ellipsis, or subheading overflow

> Source: [App bar](https://developer.samsung.com/one-ui/comp/app-bar.html)

---

## 5. Bottom Navigation (Tabs)

Significant divergences from M3 NavigationBar.

| Aspect                  | M3                                   | OneUI                                                        |
| ----------------------- | ------------------------------------ | ------------------------------------------------------------ |
| Tab content             | Icon + label (labels always visible) | **Text only** (no icons)                                     |
| Tab count               | 3-5                                  | 3-4 standard, max 5                                          |
| Swipe between tabs      | Supported                            | **Not supported**                                            |
| Title when tabs present | Always shown                         | Can be **omitted**; main tab title can serve as page heading |

> Note: OneUI 8.5 introduces a floating, compact, pill-shaped tab bar design in stock apps.

> Source: [Bottom navigation](https://developer.samsung.com/one-ui/comp/bottom-navigation.html)

---

## 6. Bottom Bar (Toolbar)

M3 has BottomAppBar (FAB + overflow). OneUI replaces with a dedicated toolbar pattern.

| Aspect          | Spec                                                    |
| --------------- | ------------------------------------------------------- |
| Max buttons     | **5** (icons + text required on each)                   |
| Min buttons     | **2** (single button prohibited)                        |
| Overflow        | 4 most-used shown + **More options** menu (far right)   |
| Scroll behavior | Auto-hides on scroll down, reappears on scroll up       |
| Use case        | Contextual actions after selection (edit, move, delete) |

> Source: [Bottom bar](https://developer.samsung.com/one-ui/comp/bottom-bar.html)

---

## 7. Margins & Grid

M3 uses 16dp default margins. OneUI requires wider margins.

| Spec                     | Value                                         |
| ------------------------ | --------------------------------------------- |
| **Minimum side margins** | **24dp** (left and right)                     |
| Reason                   | Curved edges, screen corners, touch safe area |
| Margin optimization      | Per focus block type (card, list, singular)   |

### Grid types

- List grid
- Card grid
- 2-column grid
- 3-column grid

Grid adjusted per screen based on content display needs and margin allocation.

> Source: [Grid system](https://developer.samsung.com/one-ui/layout/grid.html), [Basic layout](https://developer.samsung.com/one-ui/layout/basic.html)

---

## 8. Focus Blocks (Samsung-specific)

No M3 equivalent. Card-type containers with large rounded corners to capture attention and group content.

### Three types

| Type                | Content                         | Variants                                                                                            |
| ------------------- | ------------------------------- | --------------------------------------------------------------------------------------------------- |
| **Card (Multiple)** | Multiple related items as cards | Image+text divided, full-bleed bg, image+text stacked, text-only, clustered images, text+controller |
| **List (Grouped)**  | Multiple items in list format   | Text-only, thumbnail images, container icons, 2D icons                                              |
| **Singular**        | Single image or hero content    | Thumbnails, card-contained images                                                                   |

Layout rules:

- Text: top-left corner
- On/off controller: bottom-right corner
- Margins optimized per focus block type

> Source: [Basic layout](https://developer.samsung.com/one-ui/layout/basic.html)

---

## 9. Buttons

M3 has filled/outlined/text/elevated/tonal variants. OneUI simplifies to three emphasis levels with different rules.

| Emphasis | Style                    | When              |
| -------- | ------------------------ | ----------------- |
| Low      | **Flat** (no background) | Toolbars, dialogs |
| Medium   | **Gray background**      | Moderate emphasis |
| High     | **Colored background**   | Primary actions   |

Rules:

- **Only one button style per screen** (M3 allows mixing)
- Corner radius: **18dp** (M3 = 20dp for filled, varies by type)
- Ripple effect: `colorControlHighlight`
- Icon buttons recommended for actions; text buttons for hard-to-symbolize functions

> Source: [Buttons](https://developer.samsung.com/one-ui/comp/button.html)

---

## 10. Large Screen, Foldables & DeX

OneUI shares M3 window size classes but adds Samsung-specific multi-pane ratios, multi-window capabilities, and DeX desktop mode.

### Multi-pane layout ratios (OneUI-specific)

| Width Range | 1st Pane | 2nd Pane |
| ----------- | -------- | -------- |
| 600-960dp   | 42%      | 58%      |
| >= 960dp    | 38%      | 62%      |
| Foldable    | 50%      | 50%      |

### Navigation by width class

| Width Class         | Panes | Navigation                      |
| ------------------- | ----- | ------------------------------- |
| Compact (< 600dp)   | 1     | Bottom bar, modal drawer        |
| Medium (600-839dp)  | 1-2   | Navigation rail, modal drawer   |
| Expanded (>= 840dp) | 1-2   | Nav rail, modal/standard drawer |

### Multi-window (Samsung-specific)

| Feature            | Limit                         |
| ------------------ | ----------------------------- |
| Split-screen views | Up to **3** simultaneous      |
| Pop-up windows     | Up to **5** simultaneous      |
| Resizing           | User-customizable             |
| Cross-window       | Drag and drop between windows |

### Foldable considerations

- Validate foldable continuity between cover and main display
- In flex/posture states, keep content and controls ergonomically split (viewing area on top panel, interaction area on bottom panel)
- Z Fold: portrait navigation rail orientation

### Samsung DeX

| Spec         | Value                                                       |
| ------------ | ----------------------------------------------------------- |
| Window mode  | Free-form (Android Multi-Window compliant)                  |
| Resolution   | FHD (1920x1080), HD+ (1600x900), WQHD (2560x1440)           |
| DPI          | 160dpi (mdpi)                                               |
| Screen class | xLarge                                                      |
| Orientation  | Landscape (differs from portrait mobile)                    |
| Input        | Mouse, keyboard, pointer                                    |
| API          | No proprietary Samsung APIs — standard Android Multi-Window |

Design notes:

- Triple-pane layout recommended for tablets in landscape
- Pop-overs for small input fields on large screens
- Optimize for pointer + keyboard usage in DeX contexts

> Source: [Large screen](https://developer.samsung.com/one-ui/largescreen-and-foldable/intro.html), [DeX](https://developer.samsung.com/samsung-dex/how-it-works.html)

---

## 11. Haptics

M3 defines semantic haptic constants (confirm, reject, toggle). OneUI adds expressive haptic design with stricter timing and metaphor-based feedback.

| Aspect     | M3                 | OneUI                                                     |
| ---------- | ------------------ | --------------------------------------------------------- |
| Duration   | No strict limit    | **< 30ms** recommended                                    |
| Philosophy | Semantic constants | **Familiar metaphors** — realistic sensations             |
| Sync       | Not specified      | Visual movement timing must **perfectly match** vibration |

### Samsung-specific haptic patterns

| Interaction                      | Haptic Pattern                                 |
| -------------------------------- | ---------------------------------------------- |
| Keyboard input                   | Crisp click per key                            |
| Special keys (Delete, Space, Fn) | Distinctive differentiated feedback            |
| Camera zoom                      | Continuous feedback matching zoom              |
| Camera shutter                   | Analog camera click feel                       |
| Switch toggles                   | Directional vibration matching visual movement |
| Vibrate mode activation          | "Heavy ball falling and bouncing"              |
| Fingerprint failure              | Two quick vibrations                           |
| Time picker scroll               | Tick feedback per increment                    |

Design principles:

- Haptics + visuals = "one united component"
- Sound and vibration must have consistent meanings across same functions
- Consider human tactile thresholds: intensity discrimination, frequency range, duration sensitivity

> Source: [Haptic](https://developer.samsung.com/one-ui/sound-and-haptic/haptic.html)

---

## 12. Theme & Dynamic Color

M3 baseline: Material You dynamic color from wallpaper. OneUI extends this with Samsung's theme engine and Good Lock customization.

### Shared with M3

- `DynamicColors.applyToActivitiesIfAvailable()` — same API

### OneUI additions

| Feature                     | Details                                                                      |
| --------------------------- | ---------------------------------------------------------------------------- |
| **Good Lock Theme Park**    | Deep customization: icon editing, custom effects, system-level elements      |
| **Gallery palette**         | Extract dominant colors from any image                                       |
| **Color extraction scope**  | Wallpaper, video wallpapers, gallery images                                  |
| **OneUI 7+ effects**        | Colored glass overlays, translucent blur, gradient backgrounds               |
| **Lock screen**             | Blur, grayscale, color overlay, darken effects                               |
| **Exposed system elements** | Animation controls, context-aware icon sets, responsive color per Focus Mode |

OneUI visual language (7+):

- Circle as foundational shape throughout UI
- Translucent blur effects for depth/texture layering
- Colored gradients on full-background screens (Clock, Calendar, Reminder, alarms)
- Redesigned app icons with new visual metaphors

OneUI 8.5 additions:

- Floating, compact design elements (pill-shaped bars, floating buttons)
- Rounder settings UI with larger spacing between entries
- Bottom-positioned search bar in app drawer and settings

> Source: [OneUI Design](https://design.samsung.com/global/contents/one-ui-7/), [OneUI Developer](https://developer.samsung.com/one-ui)

---

## 13. Context Menus

M3 uses icon buttons or overflow (three-dot) for menus — long-press triggers **selection mode**.
OneUI uses long-press for **context menus** (same as Apple HIG).

| Aspect      | M3                                    | OneUI                       |
| ----------- | ------------------------------------- | --------------------------- |
| Long-press  | Selection mode (drag to multi-select) | **Context menu**            |
| Menu format | Menu anchored to trigger button       | **Untitled dropdown list**  |
| Trigger     | Icon button / overflow                | **Long-press on list item** |

> Source: [Dialog](https://developer.samsung.com/one-ui/comp/dialog.html)

---

## 14. Lists

M3 defines ListItem with one/two/three-line variants (56dp/72dp/88dp heights). OneUI adds specific text constraints and organizational rules.

| Aspect           | OneUI Spec                                      |
| ---------------- | ----------------------------------------------- |
| Text limit       | **31 characters** max per line (avoid overflow) |
| Toggle placement | Right side of row                               |
| Naming           | Clear, intuitive — noun or short verbal phrase  |
| Subtext          | Below main text, or on destination page         |
| Subheaders       | Visual chunking of sections                     |
| Icons/images     | Optional (most lists text-only)                 |
| Ordering         | Priority-based when possible                    |

> Source: [Lists](https://developer.samsung.com/one-ui/comp/list.html)

---

## 15. Typography

M3 defines a 15-role type scale with Roboto default. OneUI differences:

| Aspect        | M3                 | OneUI                                                    |
| ------------- | ------------------ | -------------------------------------------------------- |
| System font   | Roboto             | **Samsung One**                                          |
| Text resizing | Recommended        | Required: **up to 200%** without affecting functionality |
| Type scale    | 15 roles published | Uses M3 scale as baseline; no separate published scale   |

Samsung One font designed by Neville Brody, Luke Prowse, and Florian Runge. Provides typographic foundation across all Samsung products.

> Source: [Layout and typography](https://developer.samsung.com/one-ui/accessibility/layout-and-typo.html)

---

## 16. Accessibility

Beyond M3 accessibility baseline, OneUI requires:

- Validate large text scaling aggressively (up to 200%) on Samsung devices
- Icon-only actions must have clear accessible labeling
- Haptics must be meaningful and synchronized with visual transitions
- TalkBack behavior should be verified on Samsung builds specifically

> Source: [Layout and typography](https://developer.samsung.com/one-ui/accessibility/layout-and-typo.html)

---

## 17. OneUI Release Variability

- Some OneUI visuals are advisory design direction, not strict API contract
- Mark version-sensitive claims explicitly and re-verify per release
- Do not treat Samsung design-marketing pages as hard compliance policy

---

## 18. Submission Checklist (Samsung Device QA)

- [ ] Core flows work on Galaxy phone + tablet + foldable test set
- [ ] Reachability: frequent actions in interaction zone
- [ ] Edge/cutout/gesture conflicts tested across orientations
- [ ] Bottom nav/bar behavior matches OneUI expectations
- [ ] Foldable continuity validated between cover and main display
- [ ] Flex/posture states: content and controls ergonomically split
- [ ] DeX pointer/keyboard/window resize behavior validated
- [ ] Accessibility scaling + TalkBack checks pass on Samsung builds
- [ ] Haptic feedback synchronized with visual transitions

---

## Sources

- [OneUI — Layout Basics](https://developer.samsung.com/one-ui/layout/basic.html)
- [OneUI — Structure Basics](https://developer.samsung.com/one-ui/structure/basic.html)
- [OneUI — Grid Layout](https://developer.samsung.com/one-ui/layout/grid.html)
- [OneUI — App Bar](https://developer.samsung.com/one-ui/comp/app-bar.html)
- [OneUI — Dialog](https://developer.samsung.com/one-ui/comp/dialog.html)
- [OneUI — Bottom Navigation](https://developer.samsung.com/one-ui/comp/bottom-navigation.html)
- [OneUI — Bottom Bar](https://developer.samsung.com/one-ui/comp/bottom-bar.html)
- [OneUI — Button](https://developer.samsung.com/one-ui/comp/button.html)
- [OneUI — List](https://developer.samsung.com/one-ui/comp/list.html)
- [OneUI — Accessibility (Layout & Typography)](https://developer.samsung.com/one-ui/accessibility/layout-and-typo.html)
- [OneUI — Haptics](https://developer.samsung.com/one-ui/sound-and-haptic/haptic.html)
- [OneUI — Large Screen & Foldable](https://developer.samsung.com/one-ui/largescreen-and-foldable/intro.html)
- [Samsung DeX — How It Works](https://developer.samsung.com/samsung-dex/how-it-works.html)
- [One UI 7 Design](https://design.samsung.com/global/contents/one-ui-7/)
- [OneUI Developer Portal](https://developer.samsung.com/one-ui)
