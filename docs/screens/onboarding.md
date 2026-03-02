# Onboarding Screen

## Layout

```
1. Welcome screen — app name, tagline, CTA "Get Started"
2. Model selection — skip-able placeholder ("Set up later") until Phase 6
3. Currency picker — user's default currency
4. Hourly rate (optional) — "How much do you make per hour?" for work-hours context
5. Done → Home screen
```

## Data Flow

- **Writes**: currency + hourly rate to `user_settings` table
- **Sets**: `onboardingStore.completed = true` (Zustand/MMKV)

## Gating

Root layout redirects to onboarding if `!onboardingStore.completed`.
