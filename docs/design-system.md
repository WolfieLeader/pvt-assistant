# Design System — Pvt.

## UI/UX Design System

### Design Language

iOS-refined minimal. Inspired by **Fuse Wallet** (layout discipline, whitespace, big hero numbers, card grids) + **MongoDB** (tinted neutrals). Rose-tinted surfaces create warmth. Color used sparingly — rose accent for primary CTAs only. Typography-driven hierarchy. Dark-first design.

- Rose-tinted off-white / near-black backgrounds with card-based UI
- 16px border-radius on cards (Fuse-level refined)
- Generous whitespace, visual hierarchy via font weight + opacity
- Clean separation through spacing (not borders)
- **Snappy spring animations** — iOS .snappy preset, tight, minimal bounce
- **Penguin mascot** for empty states, onboarding, loading — gives Pvt. personality

### Color Palette — Rose + Tinted Neutrals

Custom primary color defined in `global.css` via `@theme`. Rose (#f2416c) — distinctive in finance, vibrant yet refined.

**Generation process**: Seed #f2416c via [uicolors.app](https://uicolors.app), cross-referenced against [Tailwind v4 OKLCH colors](https://tailwindcss.com/docs/colors).

**Primary scale (final hex):**

| Shade | Hex     | Usage                                 |
| ----- | ------- | ------------------------------------- |
| 50    | #fff1f3 | Tinted backgrounds                    |
| 100   | #fee5e9 | Hover states, light fills             |
| 200   | #fdcdd8 | Soft borders, secondary backgrounds   |
| 300   | #fca5b8 | Inactive/disabled accents             |
| 400   | #f97190 | Dark mode accent, secondary buttons   |
| 500   | #f2416c | Primary accent — buttons, active tabs |
| 600   | #e01f53 | Pressed states, emphasis              |
| 700   | #be1344 | Dark text on light backgrounds        |
| 800   | #9f133e | High-contrast elements                |
| 900   | #87143a | Very dark accent                      |
| 950   | #4d051c | Near-black tinted                     |

**Semantic tokens — rose-tinted neutrals (MongoDB-style):**

| Token               | Light                 | Dark                   | Usage                            |
| ------------------- | --------------------- | ---------------------- | -------------------------------- |
| --background        | #FBF7F8               | #1A0A10                | Rose-tinted off-white/near-black |
| --card              | #FFFFFF               | #231418                | Card/surface background          |
| --surface-elevated  | #FFFFFF               | #2E1C21                | Sheets, modals, elevated cards   |
| --surface-secondary | #F7F0F2               | #1A0A10                | Section backgrounds              |
| --text              | #1A0A10               | #F5F0F1                | Rose-tinted primary text         |
| --muted             | #8A7A7E               | #9A8A8E                | Rose-tinted gray (NOT pure gray) |
| --text-tertiary     | rgba(26,10,16,0.35)   | rgba(245,240,241,0.35) | Muted .00 cents (Fuse pattern)   |
| --accent            | #f2416c (primary-500) | #f97190 (primary-400)  | Buttons, active tabs             |
| --success           | #14B8A6               | #2DD4BF                | Teal — distinct from rose        |
| --danger            | #FF6347               | #FF7B61                | Orange-red (distinct from rose)  |
| --border            | #F0E0E4               | #3A1E26                | Rose-tinted borders              |

**Usage in components:**

- `className="bg-background dark:bg-background"` (via CSS vars)
- `className="text-primary-500 dark:text-primary-400"`
- `className="bg-card dark:bg-card border-border"`
- No JS-based color switching — `dark:` prefix handles it

Theme follows system preference by default, manual toggle in settings.

### Font — Inter

**Inter** (humanist sans-serif) — great readability. Loaded via `expo-font` — same font on both platforms.

### Typography Scale

Sizes defined in `src/consts/typography.ts`. Weight pairings:

| Token    | Size | Weight   | Usage                                  |
| -------- | ---- | -------- | -------------------------------------- |
| display  | 34   | bold     | Hero amounts; regular for large labels |
| heading  | 28   | semibold | Section headings                       |
| title    | 20   | semibold | Card titles, screen titles             |
| subtitle | 16   | medium   | Emphasized body text                   |
| body     | 16   | regular  | Default text                           |
| caption  | 13   | regular  | Labels, timestamps — use --muted color |

**Fuse-style amount rendering**: `$23,531` in display/bold + `.00` in display/regular + --text-tertiary color.

### Spacing Scale

Defined in `src/consts/spacing.ts`:

| Token | Value | Usage                   |
| ----- | ----- | ----------------------- |
| xs    | 4     | Tight gaps              |
| sm    | 8     | Icon-text gap, inline   |
| md    | 12    | Card internal padding   |
| lg    | 16    | Standard gap            |
| xl    | 24    | Section spacing         |
| 2xl   | 32    | Large section gaps      |
| 3xl   | 48    | Fuse-level section gaps |

Card constants: `{ padding: 20, radius: 16, gap: 12 }`. Screen padding: 20.

### Platform-Specific Interactions

**iOS:**

- Buttons: scale (0.97) + opacity (0.8) on press
- Haptics: `expo-haptics` — light on tap, medium on success, heavy on delete
- Native-feel but custom-rendered components

**Android:**

- Buttons: scale (0.97) + Material ripple effect
- Haptics: only on important actions (delete, confirm expense)
- No ripple on minor interactions

### Component Patterns

- **No native components** — all custom for cross-platform consistency
- Buttons: rounded-rect, primary (filled) + secondary (outlined), 12px radius
- Cards: 16px radius, rose-tinted shadow (light), surface elevation via color layers (dark, no shadow)
- Amounts: big bold number + muted `.00` cents in --text-tertiary (Fuse pattern)
- Whitespace: generous padding, Fuse-level breathing room, 48px section gaps
- Inputs: bottom-border or rounded-rect style (10px radius), clear focus states
- Lists: FlashList with card items, swipe actions where appropriate
- Bottom sheets (`@gorhom/bottom-sheet`) for quick actions
- **Penguin mascot** for empty states, onboarding, loading

### Navigation Pattern — Floating Pill + FAB

**No traditional tab bar.** Custom floating component over content:

- **Floating pill nav** (left-aligned): Two segments — Feed | Insights
  - Pill shape, rose-tinted surface
  - Active segment highlighted with accent color
  - Spring animation on segment switch
  - Positioned above safe area bottom, ~16px from bottom edge
- **QuickAddFAB** (right-aligned): Accent-colored circle with "+" icon
  - Primary action — always visible
  - Opens full-screen bottom sheet (quick-add modal)
  - Spring scale animation on press
  - Haptic feedback on tap
- **Settings gear** in header top-right (not in nav bar)
- **On-device privacy badge** — small persistent "on-device" indicator or lock icon

### Quick-Add Pattern — Amount-First Keypad

Full-screen bottom sheet triggered by FAB:

- **Big centered amount** at top — the hero element
- **Category chips row** — horizontal scroll, ordered by MMKV frequency count
  - Long-press → expand sub-categories
  - Active chip = accent fill, inactive = ghost/outlined
- **Optional title field** — auto-filled from merchant memory when available
- **Custom numeric keypad** — NOT native keyboard
  - 3×4 grid: digits, decimal point, "✓ Add" button (accent color)
  - Large touch targets (≥56px), spring animations on key press
  - Haptic feedback per key tap
- **Expanded options** (swipe up or "..." button): date, note, installment toggle, planned toggle, recurring toggle

### AI Insight Card Pattern

Feed card with distinct visual treatment:

- 🧠 badge / icon to indicate AI-generated content
- Slightly different card background (subtle accent tint or gradient border)
- Insight text: 1-2 sentences, conversational tone
- Optional "More ▸" action for detailed breakdown
- Two tiers visually identical (rule-based vs LLM — user doesn't see the distinction)

### Feed Section Patterns

- **Weekly summary card** — hero position, total + delta + work-hours equivalent + category mini-bar
- **Collapsible sections** — "Upcoming bills", "Planned expenses" with chevron toggle
- **Day group headers** — "TODAY", "YESTERDAY", "Mar 3" style, sticky
- **Expense row** — emoji icon | title | amount | time, swipe-to-delete

### Styling Rules

- **Tokens live in two layers**: CSS tokens in `global.css` (`@theme`), JS constants in `src/consts/` (spacing, typography, haptics). Check both before using arbitrary values.
- **Never use `fontWeight`** — RN can't resolve weights from a single family name. Use per-weight font families: `font-sans` (400), `font-sans-medium` (500), `font-sans-semibold` (600), `font-sans-bold` (700). Defined in `global.css`, loaded via `use-load-fonts.ts`.
- **Check `global.css` `@theme` before using arbitrary Tailwind `[value]` syntax** — a token likely already exists

### UI Interaction Rules

- Modals dismiss w/ "Close"/X (not "Back"), leading position; "Back" = stack pop only
- Touch targets: minimum 44pt (iOS HIG)
- Reuse `src/components/ui/` — check before building custom
- All interactive elements need press animation (`usePressAnimation`) + haptics (`hapticFeedback`)

### Category Visuals

- **Icons**: Emoji strings stored in `categories` DB table (e.g. "🍕"). Universal, zero bundle cost
- **Colors**: Hex from Tailwind palette (400/500 level), stored on parent category rows only
- Children inherit parent color via `parent_id` FK lookup at query time
- One distinct hue per parent category (12 total): orange, blue, cyan, violet, pink, red, green, amber, sky, emerald, rose, gray

See `docs/product/product-design.md` for full screen layouts and feature specs.

## Platform Decisions

Cross-platform resolutions where Apple HIG, M3, and Samsung OneUI disagree. See [`docs/design-guidelines/`](design-guidelines/) for per-platform specs.

### Gestures

- **Long-press** = context menu (Apple + Samsung aligned)
- **Swipe trailing (left)** = trash icon on red background
- **Swipe leading (right)** = not used

### Touch Targets

- **44pt minimum** (iOS-aligned). Close enough to M3's 48dp after density scaling
- All interactive elements wrapped in `Pressable` with `hitSlop` when visual size < 44pt

### Modals & Dialog Placement

- **Detail views** = centered modal (Samsung info dialog pattern)
- **Forms / editing** = bottom sheets (all platforms support)
- **Confirmations** = centered dialog (M3 + Apple aligned)
- Modal dismiss: Close/X button (leading position)

### Destructive Actions

- **Single item deletion** = undo toast + 60s tray (Material snackbar pattern, extended duration)
- **Critical / irreversible** = destructive-button with double-press confirmation
- Delete button in detail modal uses `variant="danger"` (orange-red, per all platforms)
- Color: orange-red exclusively for destructive — don't dilute. Distinct from rose accent

### Navigation

- **Floating pill nav** (Feed | Insights) + FAB for quick-add
- Main functions reachable within ≤2 taps from home

### Haptics

- Platform-divergent maps in `src/consts/haptics.ts`
- **iOS** = physics-based (light/medium/heavy via UIImpactFeedbackGenerator)
- **Android** = semantic (confirm/reject/toggle via HapticFeedbackConstants)

### Typography

- **Inter** 400–700, body=16, cross-platform consistency
- Meets WCAG AA contrast requirements (4.5:1)
- See Styling Rules above for weight handling

### Dark Mode / Theming

- Custom tokens in `global.css` via `@theme` — not platform semantic colors
- `dark:` Tailwind prefix, no JS-based color switching
- Theme follows system preference, manual toggle in settings
- Dark mode: depth via surface color layers only (no shadows)

### Selection Controls

- Custom-rendered switches/toggles for cross-platform consistency
- No native checkboxes or radio buttons

### Cards

- Custom card components (not platform-native)
- 16px border-radius, rose-tinted shadow (light), elevated surface color (dark)

### Search

- Search bar in header area
- Full-screen results overlay

### Platform Design Guidelines

The app follows **Apple Human Interface Guidelines** (iOS) and **Samsung OneUI** (Android/Galaxy).

**iOS — Apple HIG:**

- [Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
- [Patterns](https://developer.apple.com/design/human-interface-guidelines/patterns)
- [Foundations](https://developer.apple.com/design/human-interface-guidelines/foundations)
- [Components](https://developer.apple.com/design/human-interface-guidelines/components)
- [Inputs](https://developer.apple.com/design/human-interface-guidelines/inputs)
- [Technologies](https://developer.apple.com/design/human-interface-guidelines/technologies)
- [Adopting Liquid Glass](https://developer.apple.com/documentation/TechnologyOverviews/adopting-liquid-glass)
- [Apple Design Resources](https://developer.apple.com/design/)

**Android — Material Design 3 + Samsung OneUI:**

- [Material Design 3](https://m3.material.io/)
- [Android Design](https://developer.android.com/design/)
- [Samsung OneUI Developer](https://developer.samsung.com/one-ui/)
- [OneUI Design Guide (PDF)](https://design.samsung.com/global/contents/one-ui/download/oneui_design_guide_eng.pdf/)
- [Samsung Design System](https://developer.samsung.com/design-system/)
