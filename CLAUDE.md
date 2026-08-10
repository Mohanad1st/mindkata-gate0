# Claude Code operating contract

## Mission

Implement one reviewed vertical slice of the MindKata **Gate 0** prototype. The current product promise is: **structured practice for the judgment that makes AI useful**.

## Read before editing

1. `docs/scope-lock.md`
2. `docs/PRD.md`
3. `docs/protocol/study-protocol.md`
4. `docs/protocol/implementation-loop.md`
5. `docs/test-traceability.json`
6. the current tests for the affected behavior

## Operating loop

For every slice:

1. Restate the user outcome, current gate, affected files, assumptions, data/privacy impact, acceptance criteria, and tests.
2. Stop if a protected decision is unresolved.
3. Implement the smallest complete vertical slice. Do not add unrelated refactors or dependencies.
4. Add or update tests and traceability before declaring completion.
5. Run `npm run loop`.
6. If it fails, diagnose only the first failed stage, make the smallest repair, and rerun.
7. Stop after five failed repair cycles and present the evidence; do not weaken or bypass a check.
8. On pass, show the diff summary, commands run, evidence, assumptions, and remaining risks.
9. Wait for human review before commit, merge, deployment, or the next slice.

## Approved Gate 0 scope

- Two fixed English synthetic missions: one normal and one adversarial.
- Independent judgment before any AI output.
- Structured framing, delegation, verification, final decision, and finite receipt.
- A prewritten controlled AI output; no live model call is required.
- Browser-session persistence, anonymous session code, JSON export, and deletion.
- Voluntary Mission 2 start and completion captured separately.
- Accessibility, timing, facilitator observation, and debrief support.

## Prohibited scope

Do not add:

- newsletter, email, RSS, URL, browser-history, or private-document ingestion;
- infinite feed, autoplay, variable rewards, streak pressure, or social leaderboard;
- generic brain games or cognitive-decline claims;
- adaptive difficulty, personalized news, vector search, or recommender systems;
- automated primary-outcome scoring or individual buyer dashboards;
- live production AI providers, Supabase, PostHog, Sentry, billing, SSO, or multi-agent frameworks;
- real participant data, production secrets, production deployment, or Gate 1 infrastructure.

The automated scope check enforces part of this boundary. Documentation rules remain binding even when not machine-detectable.

## Data rules

- Use public, licensed, or synthetic content only.
- Never place participant text, prompts, private context, identity, or model content in analytics or logs.
- Preserve original submitted states; corrections must be separate events in later gates.
- Gate 0 browser data uses `sessionStorage`, an anonymous code, explicit export, and explicit deletion.
- Never read `.env`, credential stores, production exports, or unrelated local directories.

## Engineering rules

- TypeScript strict mode.
- Server validation for any future server boundary; client validation is not authorization.
- Semantic HTML, keyboard access, visible focus, reduced-motion support, and WCAG-aware contrast.
- No dependency without an explicit decision record and founder review.
- No destructive migrations, forced pushes, bypass-permissions mode, or production deployment.
- Keep changes small and reviewable. One intentional slice per pull request.

## Required checks

```bash
npm run qa:fast
npm run loop
```

The full loop must pass before requesting merge. Never modify tests, scope rules, or hooks merely to turn a failure green.

## Protected decisions requiring a human

- participant rights, consent, privacy, retention, or deletion;
- task facts, rubrics, scoring, outcomes, or thresholds;
- AI provider/model/prompt/configuration;
- a new integration or runtime dependency;
- any move beyond Gate 0;
- production credentials, deployment, data migration, or external communication.

Claude Code is an implementation assistant—not the product owner, research authority, security approver, data controller, or gate decision-maker.
