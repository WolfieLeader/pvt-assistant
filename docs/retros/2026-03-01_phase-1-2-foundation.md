# Retro: Phase 1 & 2 — Foundation + State & Providers

**Date**: 2026-03-01

## What was built

Phase 1: Drizzle ORM + Expo SQLite client, MMKV singleton. Phase 2: Zustand stores (theme, settings, onboarding) persisted via MMKV, React Query provider, DatabaseProvider passthrough, `useTheme` hook wiring Zustand → Uniwind, root layout integration.

## What went well

- Zustand + MMKV persistence pattern is clean and reusable — one `mmkvStorage` adapter shared by all stores
- `useTheme` hook cleanly separates user preference (what they chose) from resolved theme (what Uniwind computed)
- `just verify` caught the MMKV API issue immediately

## What didn't

- Used `mmkv.delete()` instead of `mmkv.remove()` — MMKV v4 renamed this method. Caught by typecheck, not by reading the API first
- Created `mmkvStorage` as a separate file (`stores/mmkv-storage.ts`) when it belongs next to the MMKV instance in `utils/mmkv.ts` — user consolidated it
- Manually typed `ThemePreference` as a union instead of deriving it from `Parameters<typeof Uniwind.setTheme>[0]` — user fixed to stay in sync with Uniwind's actual API

## Learnings

- **MMKV v4 API**: method is `remove(key)`, not `delete(key)`
- **Derive types from library APIs** when possible (`Parameters<typeof Fn>[0]`) rather than duplicating — stays in sync automatically
- **Co-locate adapters with their dependency**: `mmkvStorage` belongs in `utils/mmkv.ts` alongside the MMKV instance, not in `stores/`
