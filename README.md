# MindKata Gate 0

MindKata is a provisional working name for a human–AI capability practice. This repository contains the **Gate 0 research prototype only**: two finite synthetic missions that test whether professionals understand and voluntarily use a structured frame–delegate–verify–decide interaction.

## Status

- Approved: Gate 0 prototype and evidence collection.
- Not approved: Gate 1 research MVP, a consumer product, newsletter ingestion, public feed, adaptive training, automated cognitive scoring, or production deployment.
- Product claim: **structured practice for the judgment that makes AI useful**.
- Research boundary: completion or engagement does not establish cognitive benefit, transfer, or product efficacy.

## Quick start

Requirements: Node.js 22 or newer. Node.js 24 is used in CI.

```bash
npm ci
npx playwright install chromium
npm run dev
```

Open `http://localhost:3200`.

The dev port is pinned. With the default `next dev`, a port already taken by another local
app makes Next.js quietly move this one to the next free port, so the facilitator cannot know
from the command alone which URL serves the prototype. Pinning it means the URL above is
always right, and a clash fails loudly instead of drifting. E2E uses its own port (3100) so a
running dev server and a test run never collide.

## The bounded implementation loop

```text
read locked scope
  → plan one vertical slice
  → implement with synthetic data
  → run npm run loop
  → diagnose first failure
  → make smallest in-scope repair
  → rerun (maximum five failed repair cycles)
  → produce evidence and request human review
```

Commands:

- `npm run qa:fast`: scope, secrets, traceability, format, lint, types, unit and integration tests.
- `npm run qa`: everything above plus production build, browser/accessibility E2E, and runtime dependency audit.
- `npm run loop`: alias for the full deterministic quality loop.

The loop records its last machine-readable result in `.artifacts/quality-loop/latest.json`. Claude Code's project `Stop` hook runs the fast loop and blocks completion while it fails. GitHub Actions runs the full loop on every pull request and push to `main`.

## Human approval points

Claude Code may implement and repair one approved slice. It must stop for a human decision if work would change:

- consent or participant rights;
- data classification, retention, or deletion;
- scenario facts, scoring, or Gate 0 thresholds;
- the fixed model/output condition;
- runtime dependencies;
- deployment or production credentials;
- the boundary between Gate 0 and Gate 1.

Claude must not merge its own pull request or deploy to production.

## Repository map

- `CLAUDE.md`: controlling coding-agent rules.
- `docs/PRD.md`: executable Gate 0 product requirements.
- `docs/scope-lock.md`: approved scope and hard exclusions.
- `docs/protocol/`: study and implementation-loop protocols.
- `docs/security/`: data boundary and threat model.
- `docs/data-dictionary/`: event and artifact definitions.
- `content/scenarios/`: versioned synthetic mission fixtures.
- `tests/`: unit, integration, browser, and accessibility checks.
- `scripts/`: deterministic scope, security, traceability, and QA gates.

## Source-of-truth rule

If documents conflict, resolve them in this order:

1. `docs/scope-lock.md`
2. `docs/PRD.md`
3. `docs/protocol/study-protocol.md`
4. `docs/decisions/`
5. implementation code and tests

Record a decision before changing a higher-level rule.
