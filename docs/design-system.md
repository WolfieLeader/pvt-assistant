# Design System — pvt-assistant

## UI/UX Design System

### Design Language

Inspired by **Fuse Wallet** and **Five Cents** expense app:

- Off-white / near-black backgrounds with card-based UI
- Large border-radius (20-32px on cards/modals)
- Generous padding, visual hierarchy via opacity + font weight
- Clean separation through spacing (not borders)
- Minimal, professional fintech aesthetic

### Color Palette — Custom Primary (Rose × Pink blend)

Custom primary color defined in `global.css` via `@theme`. 70% rose / 30% pink blend — warm, slightly pink-tinted rose.

**Primary scale (approximate hex):**

| Shade | Hex     | Usage                                 |
| ----- | ------- | ------------------------------------- |
| 50    | #fef1f4 | Tinted backgrounds                    |
| 100   | #fee5ea | Hover states, light fills             |
| 200   | #fdced9 | Soft borders, secondary backgrounds   |
| 300   | #fca5ba | Inactive/disabled accents             |
| 400   | #f97194 | Secondary buttons, tags               |
| 500   | #f24270 | Primary accent — buttons, active tabs |
| 600   | #df2056 | Pressed states, emphasis              |
| 700   | #be1446 | Dark text on light backgrounds        |
| 800   | #9e143f | High-contrast elements                |
| 900   | #87153b | Very dark accent                      |
| 950   | #4d061c | Near-black tinted                     |

**Semantic tokens (CSS custom properties via @theme):**

Light mode uses default values; dark mode overrides via `@variant dark`:

| Token        | Light                 | Dark                  | Usage                   |
| ------------ | --------------------- | --------------------- | ----------------------- |
| --background | #FCFCFC               | #0A0A0A               | Screen background       |
| --card       | #FFFFFF               | #161616               | Card/surface background |
| --text       | #1A1A1A               | #F5F5F5               | Primary text            |
| --muted      | #71717A               | #A1A1AA               | Secondary text          |
| --accent     | primary-500 (#f24270) | primary-400 (#f97194) | Buttons, active tabs    |
| --success    | #22C55E               | #4ADE80               | Positive actions        |
| --danger     | #DC2626               | #F87171               | Destructive actions     |
| --border     | #E4E4E7               | #27272A               | Subtle dividers         |

**Usage in components:**

- `className="bg-background dark:bg-background"` (via CSS vars)
- `className="text-primary-500 dark:text-primary-400"`
- `className="bg-card dark:bg-card border-border"`
- No JS-based color switching — `dark:` prefix handles it

Theme follows system preference by default, manual toggle in settings. Components use `dark:` Tailwind prefix for two-theme styling. `theme-store` still controls system/manual toggle + provides `colorScheme` to the root View.

### Loading Strategy

- **Splash screen** — shows during critical init (DB migrations, LLM context load)
- **Skeleton screens** — for non-critical data (expense list, task list, chat history)

### Font Candidates (to be tested)

| Font              | Style             | Notes                                    |
| ----------------- | ----------------- | ---------------------------------------- |
| Rubik             | Rounded geometric | User has used before, warm feel          |
| Heebo             | Clean geometric   | User has used before, Hebrew support     |
| Inter             | Humanist sans     | Fuse Wallet uses this, great readability |
| Plus Jakarta Sans | Soft geometric    | Close to SF Pro, modern feel             |
| Manrope           | Geometric sans    | SF Pro-like x-height and proportions     |

Load via `expo-font` — same font on both platforms for consistency.

### Platform-Specific Interactions

**iOS:**

- Buttons: scale (0.97) + opacity (0.8) on press
- Haptics: `expo-haptics` — light on tap, medium on success, heavy on delete
- Native-feel but custom-rendered components

**Android:**

- Buttons: scale (0.97) + Material ripple effect
- Haptics: only on important actions (delete, complete task, confirm expense)
- No ripple on minor interactions

### Component Patterns

- **No native components** — all custom for cross-platform consistency
- Buttons: rounded pill or rounded-rect, primary (filled) + secondary (outlined)
- Cards: elevated with subtle shadow, large radius, white background
- Inputs: bottom-border or rounded-rect style, clear focus states
- Lists: FlatList with card items, swipe actions where appropriate
- Bottom sheets (`@gorhom/bottom-sheet`) for quick actions (edit expense, mark done, category picker, filters)

### Onboarding Flow

```
1. Hello screen — app name, tagline, CTA "Get Started"
2. Model selection — curated list, device-aware recommendations, download progress
3. Currency picker — user's default currency
4. Hourly rate (optional) — "How much do you make per hour?" for work-hours context
5. Done → Chat screen
```

### Expense Card — Work-Hours Context

When hourly rate is set, expense cards show:

```
☕ Coffee at Starbucks         -$4.50
Cash · Food & Drink · Today    ≈ 0.5 hrs
```

### Privacy Features

**App Lock (optional passcode):**

- User sets a 4-6 digit passcode in Settings → Security
- On app foreground (AppState change), show lock screen if enabled
- Passcode stored as SHA-256 hash in MMKV (`hashed_passcode` key)
- No biometric in V1 — just passcode
- Root layout gates all routes behind lock check
- 3 failed attempts → 30s cooldown

**Amount Masking (privacy mode):**

- Tap "Total Expenses" header (or any summary amount) → all monetary values across the app toggle to masked
- `$42.32` → `$xx.xx`, `≈ 0.5 hrs` → `≈ x.x hrs`
- State lives in `security-store.ts` (`amountsHidden: boolean`), persisted via MMKV
- `usePrivacy()` hook exposes `formatAmount(amount)` — returns masked string when active
- All expense cards, stats, totals, and work-hours displays consume this hook
- Visual indicator: small eye/eye-off icon next to totals
- Tap again to reveal
