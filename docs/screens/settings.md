# Settings Screen

## Layout

Grouped sections: Model, Currency, Hourly Rate, Categories, Security.

## App Lock (optional passcode)

- User sets a 4-6 digit passcode in Settings → Security
- On app foreground (AppState change), show lock screen if enabled
- Passcode stored as SHA-256 hash in MMKV (`hashed_passcode` key)
- No biometric in V1 — just passcode
- Root layout gates all routes behind lock check
- 3 failed attempts → 30s cooldown

## Amount Masking (privacy mode)

- Tap any summary amount → all monetary values across the app toggle to masked
- `$42.32` → `$xx.xx`, `≈ 0.5 hrs` → `≈ x.x hrs`
- State lives in `security-store.ts` (`amountsHidden: boolean`), persisted via MMKV
- `usePrivacy()` hook exposes `formatAmount(amount)` — returns masked string when active
- All expense cards, stats, totals, and work-hours displays consume this hook
- Visual indicator: small eye/eye-off icon next to totals
- Tap again to reveal

## Data

- **Reads/Writes**: `user_settings` table, `active_model` (MMKV), `security-store` (MMKV)
