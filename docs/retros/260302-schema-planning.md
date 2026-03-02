# Retro: Schema Planning

**Date**: 2026-03-02

## What was designed

DB schema (expenses, tasks, categories, attachments), Drizzle config, seed data, zod validation utils, and app-ready hooks for a Bun/Expo SQLite app.

## Key decisions

- **Enum ints over strings** (`INTERVAL_UNIT`, `PRIORITY`) w/ const maps in `enums.ts` — smaller storage, type-safe, labels decoupled from values
- **`Date.now()` via `$defaultFn`** over `unixepoch() * 1000` SQL default — JS-side is simpler with Drizzle's API, both produce ms epoch
- **Amount in cents (int)** not floats — avoids floating point math issues
- **nanoid for user-facing IDs**, autoIncrement int for internal (categories) — readable URLs, fast joins
- **Zod shorthand utils** (`zStr`, `zText`, `zCents`) — DRY form validation without repeating constraints
- **Color as hex string** not int — simpler UI consumption, no conversion overhead
- **`integer as int, text as str`** aliases in schema — readability preference
- **`sql.d.ts`** — allows `import x from "*.sql"` for raw migration files
- **`PRAGMA foreign_keys = ON`** — SQLite has FKs off by default, must enable per-connection
- **Seed runs only when `count() === 0`** — idempotent, safe on every app open
- **Hooks return `{ success, error }`** — `useAppReady` composes them cleanly
- **Icons as actual emoji** in seed data (🍔, 🏠, etc.) — no icon library needed for categories

## Open questions

- Should color be stored as int instead of hex string?
- Regex validation for English-only input in zod utils?
- CLAUDE.md compactness — audit for context pollution

## Learnings

- Drizzle's `$defaultFn` is the cleanest way to set JS-side defaults — avoids SQL expression gymnastics
- SQLite's FK enforcement is opt-in per connection — easy to miss, must be explicit in client setup
- Const enum maps (int → label) keep storage lean while giving UI-friendly display values
- Seed idempotency via `count() === 0` is simple and prevents duplicate data on re-opens
- Composing hook results into a single `useAppReady` gate keeps the app entry clean
