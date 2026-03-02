# Screens Overview

## Navigation Tree

```
Root Layout
  ├── Lock Screen (if app lock enabled)
  ├── Onboarding (if not completed)
  └── Tab Stack
      ├── (tabs) — Home, Expenses, Tasks, Settings
      └── fullScreenModal → Chat Modal (via FAB)
```

## Loading States

- **Splash screen** — shows during critical init (DB migrations, LLM context load)
- **Skeleton screens** — for non-critical data (expense list, task list, chat history)

## Tab Bar

- Background: solid card color (`--card`), no glass/blur
- Border: 0.5px `--border` top border
- Active tint: accent color (`--accent`)
- Labels: Inter_500Medium, caption size
- Haptic feedback on tab press
- Icons: lucide — House, Receipt, ListChecks, Settings

## FAB (Floating Action Button)

- Size: 56x56
- Background: accent color (`--accent`)
- Position: bottom-right, above tab bar
- Icon: lucide `MessageCircle`
- Scroll behavior: hides on scroll down, reappears on scroll up (reanimated shared value via ScrollContext)
- Press: opens chat modal
