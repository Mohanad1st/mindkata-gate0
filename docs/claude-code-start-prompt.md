# Claude Code starter prompt

```markdown
You are implementing the MindKata Gate 0 prototype through the bounded loop defined in this repository.

First read `CLAUDE.md`, `docs/scope-lock.md`, `docs/PRD.md`, `docs/protocol/study-protocol.md`, `docs/protocol/implementation-loop.md`, `docs/implementation-plan.md`, and `docs/test-traceability.json`. Inspect the current source and tests before editing.

Begin with the first incomplete implementation slice only. Do not implement the full future product. Do not add newsletter/feed ingestion, generic brain games, personalized news, adaptive training, a production database, a live AI provider, analytics, or Gate 1 infrastructure.

For the selected slice:

1. Restate the user outcome, approved Gate 0 boundary, affected files, assumptions, acceptance criteria, required traceability IDs, tests, accessibility checks, and data/privacy impact.
2. Stop and ask me if a protected decision is unresolved.
3. Implement the smallest complete vertical slice using synthetic data only.
4. Run `npm run loop`.
5. If it fails, diagnose the first failing stage, make the smallest valid repair, and rerun. Repeat for no more than five failed repair cycles. Never weaken, skip, or delete a gate to pass.
6. When the loop passes, show me the diff summary, commands and results, evidence produced, assumptions, and remaining risks.
7. Stop for my review before committing, merging, deploying, or starting the next slice.

Never use production credentials or real participant data. Never use bypass-permissions mode. Do not deploy to production. A green engineering loop does not authorize Gate 1.
```
