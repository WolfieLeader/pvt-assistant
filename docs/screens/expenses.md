# Expenses Screen

## Layout

- Stats card + Subscriptions link card at top
- Period toggle (day/week/month)
- Grouped expense list below (FlashList)

## Expense Card Detail

```
icon  Title                 -$4.50
Food  · Coffee · Today        ≈ 0.5 hrs
```

Amount stored as integer cents, displayed via `formatAmount()` from `src/utils/amount.ts`.

When hourly rate is set, cards show work-hours equivalent (`≈ X hrs`).

## Amount Masking

- `usePrivacy()` hook exposes `formatAmount(amount)`
- When privacy mode active: `$42.32` → `$xx.xx`, `≈ 0.5 hrs` → `≈ x.x hrs`
- Visual indicator: small eye/eye-off icon next to totals
- Tap total to toggle, tap again to reveal

## Data

- **Reads**: `expenses` table, categories (see `src/db/schema.ts`)
- **Writes**: via React Query mutations
