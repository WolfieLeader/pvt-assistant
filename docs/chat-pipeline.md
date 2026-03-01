# Chat Pipeline — pvt-assistant

## Chat → Storage Pipeline

```
User types message
  │
  ▼
1. Add user message to chat-store (Zustand, in-memory)
  │
  ▼
2. Regex/keyword pre-processor (before LLM)
  │  Checks for: dollar signs, numbers+currency, "remind", "todo",
  │  "buy", "subscription", "monthly", time patterns, etc.
  │  Produces: hints = { likelyExpense: bool, likelyTask: bool, keywords: [] }
  │
  ▼
3. Load last 5 messages for context
  │
  ▼
4. Call LLM: intent-classifier prompt (with hints injected)
  │  → constrained to: "expense" | "task" | "question" | "unknown"
  │
  ▼
5. Based on intent:
  │  ├── expense → expense-extraction prompt + GBNF grammar
  │  ├── task → task-extraction prompt + GBNF grammar
  │  └── question/unknown → freeform response
  │
  ▼
6. Parse JSON → Zod validation (safeParse)
  │  ├── success → write to DB via feature service
  │  └── failure → return clarification message
  │
  ▼
7. Add assistant reply to chat-store (linked to extracted entity, ephemeral)
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
