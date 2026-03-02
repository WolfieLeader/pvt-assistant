# Chat Screen

## Layout

Full-screen modal (presented via `fullScreenModal` at root stack level):

- Quick-action cards at top (Add Expense, Add Task)
- Chat messages below
- Input at bottom

## State

Ephemeral `useState` in chat modal — clears on dismiss.
Messages: `{ id, role, content, extractedType?, extractedId?, createdAt }`.
Extracted expenses/tasks persist in DB independently.

## LLM Pipeline (Chat → Storage)

```
User types message
  │
  ▼
1. Add user message to chat state (ephemeral useState)
  │
  ▼
2. Regex/keyword pre-processor (before LLM)
   Checks for: dollar signs, numbers+currency, "remind", "todo",
   "buy", "subscription", "monthly", time patterns, etc.
   Produces: hints = { likelyExpense: bool, likelyTask: bool, keywords: [] }
  │
  ▼
3. Load last 5 messages for context
  │
  ▼
4. Call LLM: intent-classifier prompt (with hints injected)
   → constrained to: "expense" | "task" | "question" | "unknown"
  │
  ▼
5. Based on intent:
   ├── expense → expense-extraction prompt + GBNF grammar
   ├── task → task-extraction prompt + GBNF grammar
   └── question/unknown → freeform response
  │
  ▼
6. Parse JSON → Zod validation (safeParse)
   ├── success → write to DB via feature service
   └── failure → return clarification message
  │
  ▼
7. Add assistant reply to chat state (linked to extracted entity, ephemeral)
```

### Pre-processor (`llm/pre-processor.ts`)

Regex/keyword layer runs **before** LLM to:

- Provide hints that improve small model accuracy
- Detect obvious patterns (e.g., `$XX.XX` = almost certainly expense)
- Inject context like "The user message contains a dollar amount" into the LLM prompt
- Does NOT replace LLM — just assists it

### Why two-step LLM (classify → extract)?

- Classification is fast (single token output)
- Avoids sending heavy GBNF grammar when intent is just a question
- Small models (~3B) benefit from focused, single-purpose prompts
- Pre-processor hints make classification even more reliable

## Manual Entry Path (bypasses LLM)

```
User taps "Add Expense" or "Add Task" quick-action card
  │
  ▼
1. Chat input hides, form appears inline
  │
  ▼
2. User fills form fields (amount/description/category or title/due/priority)
  │
  ▼
3. Zod validation (safeParse) on submit
   ├── success → DB write via React Query mutation → dismiss form
   └── failure → inline field errors
  │
  ▼
4. Chat input reappears
```

- Entirely skips the LLM pipeline (no pre-processor, no classifier, no extraction)
- Direct form → Zod validation → DB write
- Useful when user knows exactly what to add (no ambiguity for AI to resolve)

## Data

- **Writes**: expenses/tasks to DB via feature services
- Extracted entities persist; messages don't
