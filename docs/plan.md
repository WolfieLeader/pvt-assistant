# Implementation Roadmap — Pvt.

## Implementation Phases

### Phase 1: Dependencies & Storage — Complete

1. Install production deps (drizzle-orm, expo-sqlite, zod, nanoid, zustand, @tanstack/react-query, @shopify/flash-list, lucide-react-native, react-native-svg, react-native-mmkv, expo-haptics, @gorhom/bottom-sheet)
2. Install dev deps (drizzle-kit, babel-plugin-inline-import)
3. Set up MMKV instance (`utils/mmkv.ts`)
4. Set up Drizzle client + connection (schema + migrations deferred to feature phases)
5. Update `docs/deps.md` — move installed deps from Planned to Installed

### Phase 2: State & Providers — Complete

1. Create Zustand stores with MMKV persistence (theme-store, settings-store, onboarding-store)
2. Create providers: ThemeProvider, QueryProvider (DatabaseProvider removed — migrations handled via `use-migrations` hook)
3. Create `use-theme` hook (reads theme-store + system preference)
4. Wire providers into root layout (`src/app/_layout.tsx`)

### Phase 3: Design System — Complete

1. Set up design tokens in `global.css` via @theme (primary palette 50-950, semantic colors, radius, shadows)
2. Add dark mode overrides via `@variant dark`
3. Load custom font via `expo-font` (Inter) with custom hook
4. Create constants: `typography.ts`, `spacing.ts`, `haptics.ts`

### Phase 3.5: Schema Definition — Complete

All Drizzle schemas, Zod validation types, and migrations defined upfront so forms/validators/services build on real types from day 1.

1. Define Drizzle schema — `src/db/schema.ts` (categories, expenses, tasks, attachments)
2. Create Zod validation schemas — `src/db/schemas.ts` (insert + extraction schemas)
3. Pass schema to Drizzle client + enable FK pragma — `src/db/client.ts`
4. Configure babel inline-import for `.sql` migrations
5. Generate migration via `drizzle-kit generate`
6. Create category seed — `src/db/seed.ts` (~80 rows, 12 parents)
7. Wire real migrations hook — `src/hooks/use-migrations.ts`
8. Create amount utilities — `src/utils/amount.ts`

### Phase 4: Navigation Shell — Complete

1. Set up tab navigation (`(tabs)/_layout.tsx`) — Home, Expenses, Tasks, Settings
2. Add FAB + chat modal (`fullScreenModal` presentation at root stack level)
3. Add ScrollContext (reanimated shared value) for FAB scroll-hide behavior
4. Create placeholder tab screens

### Phase 5: Shared UI Components — Complete

1. Build shared UI components: Button, Card, Text, Chip, IconButton, Skeleton, Screen, FAB

### Phase 6: Security — App Lock & Privacy — Complete

1. Install `expo-secure-store`
2. Security Zustand store (lock enabled flag, privacy mode flag, lock state, failed attempt count)
3. Passcode set/change UI — hash PIN with SHA-256, store hash + salt in `expo-secure-store`
4. Attempt throttling — 5 failed attempts then lockout escalation
5. Recovery questions setup
6. PIN recovery flow
7. Lock screen + AppState listener
8. Privacy mode: `usePrivacy` hook
9. Update `docs/deps.md`

---

## V1 Pivot — Expense Tracker Rewrite

Phases 7+ pivot from expenses+tasks+chat to focused expense tracker with on-device AI insights.

See `docs/product/product-design.md` for full product spec.

### Phase 7: Clean Slate + Schema Migration

- Delete tasks feature, chat feature, tasks screen
- Remove all task/chat imports throughout codebase
- Remove `tasks` table + `PRIORITY` enum from schema
- Add expense columns: `status`, installment fields (incl. `installment_interest`), `returnable_until`
- Create `goals` table
- Generate Drizzle migration
- Update expense service + create goal service + React Query hooks
- Clean screens → placeholders, rename expenses.tsx → insights.tsx
- **Exit**: app compiles, no task/chat code, new schema active

### Phase 7.5: Navigation Shell

- Bottom nav bar with shadow gradient: Feed | Insights | Settings (3 items)
- Filled icons, active item shows label + icon (animated expand), inactive = icon only
- QuickAddFAB (right-aligned in nav bar, accent color)
- Spring animations on mount, haptic feedback
- **Exit**: 3 screens navigable, FAB visible

### Phase 8: Expense Feed + Quick-Add

- Feed screen: weekly summary card, expense list grouped by day (FlashList)
- Expense card: emoji icon, title, amount, time, swipe actions
- FAB → amount-first bottom sheet with custom numeric keypad
- Category chips (MMKV frequency-sorted), optional title, merchant memory
- MMKV: category frequency, last amount, merchant→category learning
- **Exit**: can add + view expenses, feed scrolls smoothly

### Phase 8.5: Feed Sections

- Rule-based smart insight card (time-of-day, bills approaching, spending delta)
- Upcoming bills section (collapsible)
- Planned expenses section (confirm ✓ / skip ✗ inline)
- Hooks: `useWeeklySummary`, `useUpcomingBills`, `usePlannedExpenses`, `useSmartInsight`
- **Exit**: feed shows all contextual sections

### Phase 9: Installment Tracking (THE WEDGE)

- "Paying in installments" toggle in quick-add expanded options
- Installment count picker + interest rate input (0 = interest-free, >0 = with interest)
- Service: create parent expense + generate child installment entries (with interest spread)
- Installment summary component, detail view, "3/12" badge on feed
- **Exit**: can log installment purchase, see monthly breakdown + total cost with interest

### Phase 9.5: Insights Screen

- Period toggle (Week / Month / Year)
- Donut chart (animated segments, center total)
- Category breakdown list
- Spending trends (period-over-period comparison)
- Sub-tabs: Goals | Installments | Subscriptions
- **Exit**: visual spending overview works

### Phase 10: Savings Goals

- Goal CRUD (title, target, deadline, category)
- Manual contribution "+$X"
- Progress bar, Goals sub-tab in Insights
- "Goal completed" → convert to confirmed expense
- **Exit**: can create goals, track progress, complete them

### Phase 10.5: Recurring / Subscriptions

- "This repeats" toggle + interval picker
- Upcoming bills derived from recurring expenses
- Subscription total in Insights
- **Exit**: recurring expenses auto-generate upcoming bills

### Phase 11: Return Window Tracking

- Optional "returnable until" date in expense form
- Smart insight nudge ≤3 days before window closes
- Return windows list in Insights
- **Exit**: return window nudges appear

### Phase 11.5: Multi-Currency

- Primary currency $ (default), up to 5 secondary currencies in settings
- Exchange rate cache (MMKV, fetch when online, stale-OK)
- Dual display: "$48 (~₪180)" throughout app
- Summaries in both currencies
- **Exit**: amounts show in multiple currencies

### Phase 12: On-Device AI Insights

- `bun add llama.rn` + `expo-file-system`
- Model selection/download in settings
- Spending data → prompt → LLM → insight text
- Background generation (1-2/day, cached in MMKV)
- AI insight card on feed (🧠 badge)
- Fallback: rule-based insights when no model
- Future slot: light financial context (exchange trends, inflation — deferred)
- **Exit**: AI insight cards appear on feed when model downloaded

### Phase 13: Backup & Export

- JSON export (all tables, encrypted with PIN)
- JSON import (validate, confirm, restore)
- CSV export (share sheet)
- **Exit**: backup/restore round-trip works

### Phase 14: Settings Screen

- Primary + secondary currencies
- Hourly rate
- Category management
- AI model management
- App lock (existing)
- Theme toggle
- Backup & Export
- About
- **Exit**: all settings persist across restart

### Phase 15: Hardening + Release

- Error boundaries, empty state illustrations
- Haptic tuning pass
- Accessibility labels
- Final QA + regression
- **Exit**: release-ready

---

## Key Decisions

| Decision                                        | Rationale                                                                                        |
| ----------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| **Custom floating pill nav** (not Expo Tabs)    | Fuse-inspired, modern feel, no traditional tab bar. More work but defines the app's personality. |
| **Amount-first quick-add**                      | Fastest path: tap FAB → type number → tap category → done.                                       |
| **Feed as primary screen**                      | Instagram muscle memory for young users. Scrollable, familiar, fast to scan.                     |
| **Chart-centric insights** (not budget-centric) | Visual impact first. Young users want to "see" spending, not manage spreadsheets.                |
| **No budgets in V1**                            | Without income data, budget targets are arbitrary guesses. Trends + comparisons more useful.     |
| **On-device LLM insights**                      | Differentiator. Background-generated personalized tips (1-2/day). No chat.                       |
| **No chat UI**                                  | Chat adds complexity without clear V1 value. Insight cards deliver AI value without overhead.    |
| **$ default, multi-currency display**           | Currency is display-only. Store in cents. Exchange rates cached in MMKV.                         |
| **Custom numeric keypad**                       | Native keyboard is slow and takes too much screen. Custom pad = faster, better animation.        |
| **MMKV for smart defaults**                     | Category frequency, merchant memory, last amounts — all local, instant, no DB overhead.          |
| **Feature-slice vertical build**                | Each slice testable end-to-end. No big-bang integration risk.                                    |
| **Keep existing infra**                         | Drizzle, Zustand, React Query, Uniwind, security — all solid. No reason to rewrite.              |
| **English only for V1**                         | Scope control; multi-language deferred to V2.                                                    |

## V2 (post-V1)

- Hebrew / multi-language support
- Biometrics (Face ID / fingerprint)
- Budget goals & threshold alerts (with income data)
- Light financial context (exchange trends, inflation, unemployment)
- PDF export
- Advanced subscription intelligence
- Chat-based expense entry (if user demand exists)
- Activity log + undo expansion

## Targeted Specs (created during their phases)

- `docs/llm-insights.md` — prompt design, model requirements, insight types, generation schedule (Phase 12)

## Dependency Plan

| Phase | Dependency         | Purpose                     |
| ----- | ------------------ | --------------------------- |
| 12    | `llama.rn`         | On-device inference runtime |
| 12    | `expo-file-system` | Model file lifecycle        |

All other deps already installed (Phases 1-6).

## Verification Gates

- Every phase: app compiles, no crashes
- Phase 7: no task/chat code remains, new schema active
- Phase 7.5: floating nav navigable, FAB visible
- Phase 8: add + view expenses, feed scrolls smoothly
- Phase 9: installment purchase → monthly breakdown visible
- Phase 9.5: donut chart + category breakdown render
- Phase 12: AI insight cards appear on feed
- Phase 15: full regression, release checklist

## Unresolved Questions

None — all resolved.
