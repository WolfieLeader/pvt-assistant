---
name: retro
description: Use after completing a feature/task OR after a planning/design session to capture decisions, trade-offs, and learnings
---

# Retro

Lightweight retrospective after completing work.

## When to Use

- After finishing a feature, bugfix, or significant task — before moving on
- After a planning or design session — to capture decisions and open questions before implementation

## Steps

1. **Classify** — Is this a planning/design retro or an implementation retro? Pick the matching template below.
2. **Review** — Summarize what was built/designed and key decisions made
3. **Reflect** — What went well? What didn't? Any surprises?
4. **Learnings** — Extract reusable patterns or pitfalls
5. **Write retro** — Save to `docs/retros/<YYMMDD>-<what-was-done>.md` with:
   - Use the implementation template for features/bugfixes
   - Use the planning template for design/planning sessions
6. **CLAUDE.md check** — If reusable patterns emerged, suggest specific CLAUDE.md updates

## Implementation Retro Template

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

## Planning Retro Template

```markdown
# Retro: <Planning Topic>

**Date**: <YYYY-MM-DD>

## What was designed

<1-2 sentences>

## Key decisions

- **Decision**: rationale

## Open questions

- ...

## Learnings

- ...
```

## Guidelines

- Planning retros focus on decisions and rationale; implementation retros focus on friction and patterns
- Keep retros short — value density over length
- Focus on actionable learnings, not venting
- Only suggest CLAUDE.md updates for patterns that will recur
- **Naming**: filename describes what was done (e.g. `setup-design-system`, `add-auth-flow`), not phase/ticket/issue references
