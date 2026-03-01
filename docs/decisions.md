# Decisions — pvt-assistant

## Decisions Made

| Decision                 | Choice                                                                                     |
| ------------------------ | ------------------------------------------------------------------------------------------ |
| LLM engine               | llama.rn (v0.11+) with GGUF quantized models                                               |
| Platforms                | iOS + Android                                                                              |
| NLP approach             | LLM extraction with GBNF grammar-constrained JSON                                          |
| Finance scope            | Expense log + subscriptions + payment method + categories + attachments                    |
| Task scope               | Title, done, priority, category/tag, due date, reminders                                   |
| Navigation               | Bottom tabs: Chat (home), Expenses, Tasks, Settings                                        |
| Model distribution       | Download on first launch, curated HF list + custom URL                                     |
| Categories               | Predefined set + user-custom in settings                                                   |
| Currency                 | Single default currency (user sets in settings)                                            |
| Chat context             | Last 5 messages included in LLM context (in-memory, ephemeral)                             |
| Chat persistence         | Ephemeral — clears when user exits chat screen. Extracted data persists in DB.             |
| Model swap               | Delete old model file, download new one (only 1 model on device at a time)                 |
| Model catalog            | Fetched from network (curated list endpoint / HuggingFace)                                 |
| Bottom sheets            | @gorhom/bottom-sheet for quick actions (edit expense, filters, category picker)            |
| DB                       | Drizzle ORM + expo-sqlite                                                                  |
| Validation               | Zod v4 (`zXxx` naming)                                                                     |
| Attachments              | Documents, images, camera only                                                             |
| Subscriptions            | Regex/keyword pre-check before LLM (e.g., "subscription", "monthly", "recurring")          |
| Onboarding               | Hello screen → CTA → model download → currency → optional hourly rate                      |
| Hourly rate              | Shows "this cost X hours of work" on expense cards                                         |
| Search                   | Minimal search + filters in V1                                                             |
| Export                   | Not in V1                                                                                  |
| UI style                 | iOS-inspired/Fuse app inspired, cross-platform (no native components), dark + light themes |
| Color                    | Custom "primary" palette (rose×pink blend) defined in Tailwind @theme, full 50-950 scale   |
| Font                     | SF Pro-like (candidates: Rubik, Heebo, Inter, Plus Jakarta Sans, Manrope — test later)     |
| Interactions             | iOS: scale+opacity+haptics / Android: scale+ripple+haptics (important only)                |
| State mgmt               | Zustand (global state) + TanStack Query (async queries/mutations)                          |
| Lists                    | FlashList v2 (New Architecture only, JS-based recycling)                                   |
| Icons                    | lucide-react-native                                                                        |
| Theming                  | Tailwind `dark:` variant for two themes; design tokens via @theme in global.css            |
| Storage                  | MMKV for sync key-value (settings, theme, onboarding state)                                |
| Animations               | react-native-reanimated (already installed v4.2.1)                                         |
| Loading                  | Splash screen for critical init, skeleton screens for data                                 |
| App lock                 | Optional passcode to open app, stored hashed in MMKV                                       |
| Privacy mode             | Tap any total/amount to mask all values ($xx.xx), persisted in MMKV                        |
| Architecture pattern     | Feature-based modules (no DDD) — domain too thin for aggregates/repositories/value objects |
| Route files              | Thin wrappers — import + render feature components, no business logic                      |
| Feature module structure | `components/`, `hooks/`, `services/`, `schemas.ts` per feature                             |
| Shared components        | `src/components/ui/` for primitives, `src/components/layout/` for layout helpers           |
