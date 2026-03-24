# Product Design — Pvt.

Privacy-first Israeli expense tracker with on-device AI. Feed-based single-surface UI, floating pill nav, chart-centric insights, smart context-aware nudges.

**Target audience:** Young Israelis (21-30). Premium, minimal, snappy. Not a spreadsheet — a feed you actually want to open.

---

## Visual Identity

- **iOS-refined minimal** with rose-tinted neutrals — Fuse Wallet layout discipline, MongoDB-style tinted surfaces
- **Dark-first** — target audience (21-30) uses dark mode. Rose on near-black (#1A0A10) feels premium
- **Penguin mascot** for empty states, onboarding, loading — personality that Fuse lacks
- **Snappy spring animations** — iOS .snappy preset, tight, minimal bounce
- **Fuse-style amounts**: big bold number + muted `.00` cents (--text-tertiary)
- **On-device privacy badge** — subtle persistent indicator surfacing privacy as a feature
- Rose accent (#F2416C), rose-tinted neutrals for all surfaces/text/borders

## Navigation Architecture

- **Bottom nav bar** with shadow gradient: Feed | Insights | Settings (3 items)
- **Filled icons**, active item shows label text next to icon (animated expand)
- **FAB** (right-aligned in nav bar, accent color): Quick-add expense — the primary action
- No gear icon in header — settings is in the nav bar

## Screen Structure

```
App
├── (tabs)/
│   ├── index.tsx        → Feed screen (home)
│   ├── insights.tsx     → Insights screen (charts, goals, installments)
│   └── settings.tsx     → Settings screen
├── _layout.tsx          → Root: providers + Stack
└── (modals)/
    └── expense-form.tsx → Full-screen quick-add modal
```

---

## Feed Screen (Home)

```
┌─────────────────────────────┐
│  Pvt.                   [⚙] │
├─────────────────────────────┤
│  ┌─ Weekly Summary ────────┐│
│  │ $580 this week  +$120 ↑ ││
│  │ ≈ 18 hrs of work       ││
│  │ ██████░░░ Food 40%      ││
│  └─────────────────────────┘│
├─────────────────────────────┤
│  🧠 AI Insight              │
│  "Your Wolt spending jumped │
│   65% this week — $48 more  │
│   than usual"     [More ▸]  │
├─────────────────────────────┤
│  ▸ Upcoming bills (2)       │
│    📺 Netflix  Mar 8  $14   │
│    🏠 Rent     Mar 15 $1.2k │
├─────────────────────────────┤
│  ▸ Maybe (2)              │
│    🍺 Friends  ~$50   [✓][✗]│
│    🛒 Groceries ~$60  [✓][✗]│
├─────────────────────────────┤
│  TODAY                      │
│  🍕 Dominos    $18    12:30 │
│  🚕 Gett       $8     10:15 │
│  ☕ Cofix      $3     08:40 │
│                             │
│  YESTERDAY                  │
│  🛒 Shufersal  $45    19:00 │
│  🍺 Bar        $25    21:30 │
│  ...                        │
├─────────────────────────────┤
│  ┌─────────────┐            │
│  │ Feed|Insights│      [＋] │
│  └─────────────┘            │
└─────────────────────────────┘
```

**Sections (top to bottom):**

1. **Weekly summary card** — total, delta vs last week, work-hours equivalent, category bar
2. **Smart insight** — context-aware nudge (rent due, overspending, payday, etc.)
3. **Upcoming bills** — collapsible, next recurring expenses
4. **Maybe expenses** — confirm/skip inline actions
5. **Expense feed** — grouped by day, chronological, swipe actions

### Smart Insights — Rule-Based

All insights are derived from expense data with simple logic — no LLM required:

- **Spending delta**: "Your food spending is up 35% this week"
- **Bill reminders**: "Netflix billing in 3 days"
- **Return window**: "2 days left to return that keyboard"
- **Installment milestone**: "Laptop 8/12 done — $1,000 left"
- **Work-hours shock**: "You spent 6 hours of work on dining this week"
- **Category trend**: "Transport is your fastest-growing category"

LLM-powered insights are an optional Phase 12 enhancement, not a core feature. Rule-based insights cover 90% of useful nudges.

**Light financial context** (deferred, API-dependent): exchange rate trends, inflation rate, unemployment data — practical macro context, not investor dashboard.

---

## Insights Screen

```
┌─────────────────────────────┐
│  Insights               [⚙] │
├─────────────────────────────┤
│  [Week] [Month] [Year]      │
│                              │
│        ┌─────────┐          │
│        │  $1,800 │          │
│        │  donut  │          │
│        └─────────┘          │
│                              │
│  🍕 Food       $560    31%  │
│  🚕 Transport  $320    18%  │
│  🍺 Going out  $250    14%  │
│  🛒 Groceries  $220    13%  │
│  ...                        │
├─────────────────────────────┤
│  vs last month: -$120 ↓     │
├─────────────────────────────┤
│  [Goals] [Installments] [Subs]│
├─────────────────────────────┤
│  Goals view:                │
│  ✈️ Tokyo  $1.2k/$3k   40%  │
│                              │
│  Installments view:         │
│  $620/month total            │
│  💻 Laptop   8/12  $250/mo  │
│  📱 Phone    3/24  $120/mo  │
│                              │
│  Subscriptions view:        │
│  $350/month total            │
│  📺 Netflix  $14/mo         │
│  🏠 Rent     $4.5k/mo       │
├─────────────────────────────┤
│  ┌──────────────┐           │
│  │ Feed|Insights│     [＋]  │
│  └──────────────┘           │
└─────────────────────────────┘
```

**Sections:**

1. **Period toggle** — Week / Month / Year chips
2. **Donut chart** — total spending, animated segments per category
3. **Category breakdown** — list with amount + percentage
4. **Period comparison** — "vs last month: -$120 ↓" trend indicator
5. **Sub-tabs** — Goals | Installments | Subscriptions
   - Goals: savings progress bars with deadline
   - Installments: total committed, per-purchase breakdown with progress
   - Subscriptions: monthly total, recurring expense list

---

## Quick-Add Modal (FAB → full-screen bottom sheet)

```
┌─────────────────────────────┐
│                              │
│         $ 0                 │
│   (big, centered amount)     │
│                              │
│  [☕][🍕][🚕][🛒][🍺][...]    │
│                              │
│  [Title (optional)...]       │
│                              │
│  [1] [2] [3]                │
│  [4] [5] [6]                │
│  [7] [8] [9]                │
│  [.] [0] [✓ Add]            │
└─────────────────────────────┘
```

- **Expense / Income toggle** at top — simple segmented control
- Amount-first with custom numeric keypad
- Category chips (ordered by frequency, MMKV counter)
- Title optional (auto-filled from merchant memory)
- "Continue" button submits (disabled when $0, accent when has value)
- Back arrow + "More Details" link in header
- Long-press category chip → expand with sub-categories
- More options via "More Details": date, note, installment toggle, maybe toggle, recurring toggle
- Income entries use teal/success color accent instead of rose

---

## Settings Screen

- Primary currency ($ default) + secondary currencies (up to 5)
- Hourly rate
- Category management
- AI model management (download, select, delete)
- App lock (existing security feature)
- Theme (system/light/dark)
- Backup & Export (JSON + CSV)
- About / Version

---

## Database Schema Changes

### Modified: `expenses` table

```sql
-- Add columns:
status                TEXT DEFAULT 'confirmed'  -- 'maybe' | 'confirmed' | 'skipped'
installment_count     INTEGER                   -- total installments (e.g. 12)
installment_current   INTEGER                   -- which payment (e.g. 3)
installment_parent_id TEXT REFERENCES expenses(id)
installment_interest  INTEGER DEFAULT 0         -- basis points (500 = 5.0%)
                                                -- 0 = interest-free installments
                                                -- >0 = installments with interest
returnable_until      TEXT                      -- date, nullable
```

No per-expense currency column — currency is a display concern. User sets primary currency + up to 5 secondary in settings. Exchange rates cached in MMKV.

### Remove: `tasks` table

Drop entirely. Migration removes it.

### New: `goals` table

```sql
goals (
  id          TEXT PRIMARY KEY,   -- nanoid
  title       TEXT NOT NULL,
  target      INTEGER NOT NULL,   -- agorot
  saved       INTEGER DEFAULT 0,  -- agorot accumulated
  deadline    TEXT,               -- date string, optional
  category_id INTEGER REFERENCES categories(id),
  status      TEXT DEFAULT 'active', -- 'active' | 'completed' | 'canceled'
  created_at  INTEGER NOT NULL,
  updated_at  INTEGER NOT NULL
)
```

### Keep: `categories`, `attachments` tables (unchanged)

### No `budgets` table in V1

Without income data, budget targets are arbitrary. Spending trends + period comparisons instead. Budgets may return in V1.5.

---

## MMKV Keys

| Key                         | Purpose                                                                      |
| --------------------------- | ---------------------------------------------------------------------------- |
| `category-frequency:{id}`   | Usage count per category (chip ordering)                                     |
| `merchant:{normalizedName}` | Learned category ID per merchant                                             |
| `last-amount:{categoryId}`  | Last entered amount per category                                             |
| `exchange-rates`            | Cached rates + timestamp                                                     |
| `settings`                  | Existing — add `currency` ($), `secondaryCurrencies` (up to 5), `hourlyRate` |
| `ai-insights`               | Cached LLM-generated insights + generation timestamp                         |

---

## Installment Tracking (The Wedge)

Israel's credit card culture = installments everywhere. Most expense trackers ignore this.

- **Interest-free**: `installment_interest = 0`, total = original amount
- **With interest**: `installment_interest > 0`, total = amount + (amount × rate / 10000)
- Parent expense = original purchase. Children = monthly installment entries.
- Feed shows "3/12" badge on installment expenses
- Insights → Installments sub-tab shows total monthly commitment + per-purchase breakdown

## Recurring Expenses / Subscriptions

- "This repeats" toggle + interval picker in expanded quick-add options
- Upcoming bills section on feed derived from recurring expenses
- Subscription total in Insights sub-tab
- Monthly subscriptions auto-generate upcoming bill entries

## Savings Goals

- Goal CRUD (title, target amount, optional deadline, optional category)
- Manual contribution via "+$X" button
- Progress bar visualization in Insights → Goals sub-tab
- "Goal completed" → optionally convert to confirmed expense

## Return Window Tracking

- Optional "returnable until" date in expense form
- Smart insight nudge ≤3 days before window closes
- Helps users track return deadlines (common Israeli consumer pattern)

## Multi-Currency

- Primary currency $ (default), up to 5 secondary currencies in settings
- Exchange rate cache (MMKV, fetch when online, stale-OK)
- Dual display: "$48 (~₪180)" throughout app
- All storage in primary currency (agorot/cents) — display-only conversion

## On-Device AI

- `llama.rn` for on-device inference
- Model selection/download in settings
- Spending data → prompt → LLM → insight text
- Background generation (1-2/day, cached in MMKV)
- AI insight card on feed (🧠 badge)
- Fallback: rule-based insights when no model installed
- No chat UI — just smart insight cards
