# Implementation Roadmap — pvt-assistant

## Implementation Phases

### Phase 1: Foundation & Design System

1. Install all deps (drizzle, expo-sqlite, zod, nanoid, zustand, tanstack-query, flash-list, lucide, mmkv, expo-haptics)
2. Set up MMKV instance (`utils/mmkv.ts`)
3. Set up Zustand stores (theme-store with MMKV persistence, settings-store, onboarding-store)
4. Set up design tokens in `global.css` via @theme (primary palette, semantic colors, radius) + `typography.ts`, `spacing.ts`, `haptics.ts`
5. Load custom font via `expo-font` (start with Rubik, test others later)
6. Set up Drizzle schema + migrations + client
7. Create providers: DatabaseProvider, QueryProvider
8. Create `use-theme` hook (reads theme-store + system preference)
9. Set up tab navigation (`(tabs)/_layout.tsx`)
10. Build shared UI components (button with platform interactions, card, input, skeleton, search-bar)
11. Create screen-wrapper layout component

### Phase 2: Onboarding

1. Build hello screen with CTA
2. Model selection screen (curated list, device info, download progress)
3. Currency picker screen
4. Optional hourly rate input screen
5. Persist settings in user_settings table
6. Gate: redirect to onboarding if no model downloaded

### Phase 3: Chat Core

1. Install llama.rn
2. Build LLM context manager (`llm/context.ts`)
3. Create LlmProvider
4. Build regex pre-processor (`llm/pre-processor.ts`)
5. Build chat UI (chat-list, chat-bubble, chat-input)
6. Implement chat-service pipeline (without extraction yet — echo mode)
7. Store chat messages in DB

### Phase 4: Expense Extraction

1. Write intent-classifier prompt + GBNF
2. Write expense-extraction prompt + GBNF grammar + zExpenseExtraction
3. Implement expense-service (create, read, update, delete)
4. Build expense list screen + expense-card (with work-hours context)
5. Wire chat → pre-process → classify → extract → store → confirm flow
6. Add search bar + category/date filters on expense list

### Phase 5: Task Extraction

1. Write task-extraction prompt + GBNF grammar + zTaskExtraction
2. Implement task-service
3. Set up expo-notifications for reminders
4. Build task list screen + task-card
5. Wire task extraction into chat pipeline
6. Add search + priority/status filters on task list

### Phase 6: Settings & Model Management

1. Build model-manager service (download, delete, swap)
2. Build settings screen (model picker, currency, hourly rate, categories, security)
3. Category management UI (add/edit/remove custom categories)
4. App lock: passcode set/change UI + lock screen + AppState listener
5. Privacy mode: security-store + usePrivacy hook + wire into expense cards/totals

### Phase 7: Polish

1. Attachments (camera, photo library, document picker → expense)
2. Subscription keyword detection in pre-processor + LLM extraction
3. Expense stats/summaries (daily/weekly/monthly)
4. Manual add/edit forms for expenses and tasks
5. Error handling, loading states, empty states
6. Platform-specific haptic feedback tuning

---

## Verification

- `just typecheck` — all new files must pass strict TS
- `just verify` — fmt + lint + typecheck
- Manual test: run on iOS simulator, type "bought coffee $4", verify it appears in both chat and expenses tab
- Manual test: "remind me to buy groceries tomorrow at 10am", verify task + notification scheduled
- Verify model download flow in settings on real device (simulator doesn't support Metal GPU)
- Manual test: enable app lock, background app, re-open → lock screen appears
- Manual test: tap total on expenses tab → all amounts mask to $xx.xx, tap again → reveal

---

## Remaining Open Questions

1. **Which font?** — test Rubik, Heebo, Inter, Plus Jakarta Sans on device, decide later
