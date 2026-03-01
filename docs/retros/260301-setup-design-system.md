# Retro: Design System Setup

**Date**: 2026-03-01

## What was built

Design system foundation: CSS design tokens (`global.css` via `@theme`), dark mode, Inter font loading, and JS constants for programmatic use (colors, typography, spacing, haptics).

### App-init refactor

- **ThemeProvider** — extracted `Uniwind.setTheme()` side-effect from `useTheme` into a dedicated provider
- **useAppReady** — unified splash-screen gating hook (fonts + migrations must complete before hiding splash)
- **use-migrations** — no-op placeholder, ready for Phase 5+ when real DB migrations land
- **Deleted DatabaseProvider** — was a pass-through wrapper; migrations now handled by `use-migrations` hook

## What went well

- Dual token layer (CSS vars + JS consts) cleanly separates NativeWind styling from imperative APIs
- Platform-specific haptics map abstracts iOS `impactAsync` vs Android `performAndroidHapticsAsync` behind a single `hapticFeedback()` call
- All files passed `just verify` on first run

## What didn't

- **Lost planning context**: Several decisions made during planning weren't captured in docs:
  - Color palette generated using uicolors.app (e.g. `/generate/fb75ae`) and cross-referenced against Tailwind v4's OKLCH-based color docs — 77/23 rose/pink blend came from this process
  - iOS and Android have fundamentally different haptic APIs — iOS uses impact feedback styles, Android uses semantic haptics (Confirm, Reject, Toggle_On) — this drove the dual-config map
  - RN can't resolve font weights from a single family name — must map each weight to a separate font name, confirmed via Uniwind FAQ
- `colors.ts` missed in original plan — added as follow-up

## Learnings

- **Document "why" in design-system.md, not just "what"**: Color generation tools and reference URLs should be captured so future palette changes follow the same process
- **Plan checklist**: Cross-check that every CSS token group has a corresponding JS const file before calling phase complete
- **Haptics are platform-divergent**: iOS = physics-based (light/medium/heavy), Android = semantic (confirm/reject/toggle). Always design haptic maps with both models
- **RN font weight workaround**: Always use explicit per-weight font family names, never rely on `fontWeight` CSS property alone
- **Side-effects belong in providers, not bare hooks**: `useTheme` became read-only after extracting `Uniwind.setTheme()` into ThemeProvider — hooks that trigger global side-effects should be wrapped in a provider
