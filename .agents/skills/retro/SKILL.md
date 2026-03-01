---
name: retro
description: Use after completing a feature or significant task to reflect on what was built, what went well, what didn't, and capture reusable learnings
---

# Retro

Lightweight retrospective after completing work.

## When to Use

After finishing a feature, bugfix, or significant task — before moving on.

## Steps

1. **Review** — Summarize what was built and key decisions made
2. **Reflect** — What went well? What didn't? Any surprises?
3. **Learnings** — Extract reusable patterns or pitfalls
4. **Write retro** — Save to `docs/retros/<YYMMDD>-<what-was-done>.md` with:
   - What was built (1-2 sentences)
   - What went well
   - What didn't / friction points
   - Learnings / recommendations
5. **CLAUDE.md check** — If reusable patterns emerged, suggest specific CLAUDE.md updates

## Retro File Template

```markdown
# Retro: <Feature Name>

**Date**: <YYYY-MM-DD>

## What was built

<1-2 sentences>

## What went well

- ...

## What didn't

- ...

## Learnings

- ...
```

## Guidelines

- Keep retros short — value density over length
- Focus on actionable learnings, not venting
- Only suggest CLAUDE.md updates for patterns that will recur
- **Naming**: filename describes what was done (e.g. `setup-design-system`, `add-auth-flow`), not phase/ticket/issue references
