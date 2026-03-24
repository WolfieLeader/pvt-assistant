# docs/

- `plan.md` — phased roadmap (1-6 infra complete, 7-15 V1 pivot), deliverables per phase, key decisions, verification gates
- `product/product-design.md` — full product spec: screen designs, navigation, DB schema, MMKV keys, feature specs
- `design-system.md` — color palette, semantic tokens, typography, component patterns, floating pill nav, FAB quick-add, platform interactions, styling rules
- `deps.md` — installed + planned deps w/ doc links, library roles, AI resources
- `models.md` — on-device LLM catalog (<4B), sizes, tiers, GGUF sources
- `design-guidelines/` — per-platform specs (Apple HIG, Samsung OneUI, M3) and comparison tables
- `retros/` — post-impl retrospectives (`YYMMDD-topic.md`), API gotchas, learnings — read before working on related areas

## Product Posture

- **Privacy-first Israeli expense tracker** with on-device AI insights
- Feed-based single-surface UI — scrollable, familiar, fast to scan
- Installment tracking as the wedge feature (Israeli credit card culture)
- On-device LLM generates smart insight cards (no chat, no cloud)
- Comfort-first UX for daily use
- App lock is optional/opt-in privacy, not a hard security boundary

## Project Folder Structure

- `src/features/{name}/` — feature modules w/ barrel `index.ts` as public API
- `src/{components, hooks, stores, utils, consts}/` — shared code (used by 2+ features)
- Feature-internal imports use relative paths; cross-feature imports use barrel (`~/features/security`)
- Feature-internal code is NOT exported from barrel
