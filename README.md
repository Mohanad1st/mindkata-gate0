# MindKata Gate 0

Most of this repository is a list of things the build is forbidden to become, and 61 lines of Node
that fail the build if it becomes them.

It refuses to build the product. That is the point.

## The scope lock

A research prototype has a scope problem that ordinary software does not. The whole value of a Gate 0
study is that it tests one narrow claim under stated conditions — so the moment the codebase quietly
acquires a live model call, an analytics SDK, a real database, or a third mission, the evidence it
produces stops answering the question it was built to answer. Nobody notices, because each addition
looks like progress.

Written policy does not stop that. A document saying "no analytics at Gate 0" is not consulted at
2am by someone adding a page, and it is certainly not consulted by a coding agent. So the boundary
here is not written down and hoped for — it is a file the build reads, and a check that exits
non-zero.

[`config/scope-lock.json`](config/scope-lock.json) is the whole boundary, and it is 26 lines:

```json
{
  "gate": "0",
  "approvedMissions": ["1", "2"],
  "allowedRuntimeDependencies": ["next", "react", "react-dom", "zod"],
  "prohibitedPaths": [
    "app/feed",
    "app/news",
    "app/dashboard",
    "app/admin",
    "lib/ingestion",
    "lib/adaptive",
    "lib/scoring/automatic",
    "supabase"
  ],
  "prohibitedSourcePatterns": [
    "@ai-sdk/",
    "openai",
    "anthropic",
    "googleapis",
    "microsoft-graph",
    "imap",
    "rss-parser",
    "posthog",
    "@sentry/"
  ]
}
```

[`scripts/check-scope.mjs`](scripts/check-scope.mjs) enforces it with four checks, and accumulates
rather than short-circuits, so one run reports every violation:

1. **Prohibited paths.** If any of those eight directories exists on disk, the build fails. Not "is
   imported" — _exists_. You cannot start building the admin dashboard and wire it up later.
2. **The runtime dependency set, by exact equality.** Not a blocklist, a whitelist compared for set
   equality: adding a package fails, and so does removing one. Four runtime dependencies is the
   approved surface, and any drift is a decision that has to be made deliberately.
3. **Prohibited integration patterns.** Every `.ts`/`.tsx`/`.js`/`.mjs` file under `app/`,
   `components/`, `content/` and `lib/` is lowercased and substring-matched against the nine banned
   strings. This is what makes "no live model call at Gate 0" a mechanical fact rather than an
   intention.
4. **Mission identity.** Missions 1 and 2 must both be present, and a regex rejects any mission id
   from 3 upward. The study is two missions; a third one cannot appear by accident.

### It has been watched failing

A gate nobody has seen fail is a claim, not a control. So here it is failing. Three deliberate
violations — a prohibited dependency in `package.json`, a `mkdir app/admin`, and a source file
importing `openai` — produce this:

```
▶ Scope lock

SCOPE CHECK FAILED
- Prohibited Gate 0 path exists: app/admin
- Runtime dependencies differ from the scope lock. Expected next, react, react-dom, zod; found next, openai, react, react-dom, zod.
- Prohibited Gate 0 integration pattern "openai" in lib\leak.ts

QUALITY LOOP FAILED — repair the first failing stage, then rerun.
```

Exit code 1, and the quality loop halts at stage one and runs none of the remaining nine. Revert the
three, and it returns to:

```
SCOPE CHECK PASSED — Gate 0 boundaries are intact.
```

It runs in three places, which is what makes it hard to route around: first stage of
`npm run qa` and `npm run qa:fast`; in GitHub Actions on every push and pull request; and through a
Claude Code `Stop` hook ([`.claude/settings.json`](.claude/settings.json) →
[`scripts/stop-gate.mjs`](scripts/stop-gate.mjs)) that blocks the coding agent from reporting itself
finished while the fast loop is red.

## What this is not

It is **not** a runtime guardrail library, and it does not compete with one. Tools like
`agent-guardrails` or Galileo's Agent Control intercept an agent's actions as it executes them —
don't run destructive `terraform`, don't `rm -rf` that. Useful, and a different problem.

This operates one level earlier: it constrains **what the codebase is allowed to become**, checked
at build time, before anything runs. The question it answers is not "is this command safe" but "is
this still the study we got approval for".

So read it as a worked example of a research-ethics boundary expressed as something a build can
check — with the documents that go around it — rather than as a dependency to install. The
transferable part is the pattern and the paperwork, not the code.

## The study this was built for

MindKata is a **provisional working name** for a human–AI capability practice. Nothing here is a
launched product, and the name may not survive.

This repository contains the **Gate 0 research prototype only**: two finite synthetic missions
testing whether professionals understand and voluntarily use a structured
frame–delegate–verify–decide interaction.

- **Approved:** the Gate 0 prototype and evidence collection.
- **Not approved:** a Gate 1 research MVP, a consumer product, newsletter ingestion, a public feed,
  adaptive training, automated cognitive scoring, or production deployment.
- **Product claim under test:** structured practice for the judgment that makes AI useful.
- **Research boundary:** completion or engagement **does not** establish cognitive benefit,
  transfer, or product efficacy. A participant finishing both missions is evidence that the
  interaction is usable, and evidence of nothing else.

That last point is the one worth reading twice. It is written into the repository because the
easiest way to over-claim from a prototype like this is to treat engagement as an outcome.

## Privacy at this gate

The data boundary is designed rather than deferred — see
[`docs/security/data-classification.md`](docs/security/data-classification.md) and
[`docs/security/threat-model.md`](docs/security/threat-model.md). At Gate 0:

- there is **no participant identity field**, and no server database;
- browser state uses `sessionStorage` rather than long-lived storage, with an anonymous session code;
- export and deletion are both explicit participant actions;
- only synthetic fixtures exist in source control, and the scope lock mechanically guarantees no
  model API can be called, so no participant text can reach a third party.

## Quick start

Requirements: Node.js 22 or newer. Node.js 24 is used in CI.

```bash
npm ci
npx playwright install chromium
npm run dev
```

Open `http://localhost:3200`.

The dev port is pinned deliberately. With the default `next dev`, a port already taken by another
local app makes Next.js quietly move this one to the next free port, so the facilitator cannot know
from the command alone which URL serves the prototype. Pinning it means the URL above is always
right, and a clash fails loudly instead of drifting. E2E uses its own port (3100) so a running dev
server and a test run never collide.

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
- `npm run qa`: everything above plus production build, browser/accessibility E2E, and runtime
  dependency audit.
- `npm run loop`: alias for the full deterministic quality loop.

The loop records its last machine-readable result in `.artifacts/quality-loop/latest.json`.

Alongside the scope lock, three more deterministic gates run in that loop:
[`check-secrets.mjs`](scripts/check-secrets.mjs) scans the tree for key-shaped strings,
[`check-traceability.mjs`](scripts/check-traceability.mjs) asserts every requirement in
[`docs/test-traceability.json`](docs/test-traceability.json) maps to a test file that actually cites
its requirement ID, and [`guard-command.mjs`](scripts/guard-command.mjs) blocks force-pushes,
`git reset --hard`, production deploys and permission-bypass flags before they run.

## Human approval points

Claude Code may implement and repair one approved slice. It must stop for a human decision if work
would change:

- consent or participant rights;
- data classification, retention, or deletion;
- scenario facts, scoring, or Gate 0 thresholds;
- the fixed model/output condition;
- runtime dependencies;
- deployment or production credentials;
- the boundary between Gate 0 and Gate 1.

Claude must not merge its own pull request or deploy to production.

## Repository map

- `CLAUDE.md`: the controlling coding-agent contract.
- `config/scope-lock.json` · `scripts/check-scope.mjs`: the machine-checked boundary.
- `docs/PRD.md`: executable Gate 0 product requirements.
- `docs/scope-lock.md`: the approved scope and hard exclusions, in prose.
- `docs/decisions/`: seven numbered ADRs. Status lines are live — three are still marked awaiting
  review, which is the honest state of the log rather than an oversight.
- `docs/protocol/`: study and implementation-loop protocols.
- `docs/security/`: data classification and threat model.
- `docs/data-dictionary/`: event and artifact definitions.
- `docs/claude-code-start-prompt.md`: the prompt this project was built with.
- `content/scenarios/`: versioned synthetic mission fixtures.
- `tests/`: unit, integration, browser, and accessibility checks.
- `scripts/`: the deterministic scope, security, traceability, and QA gates.

## Source-of-truth rule

If documents conflict, resolve them in this order:

1. `docs/scope-lock.md`
2. `docs/PRD.md`
3. `docs/protocol/study-protocol.md`
4. `docs/decisions/`
5. implementation code and tests

Record a decision before changing a higher-level rule.

## License

MIT — see [LICENSE](LICENSE). It covers the documents as well as the code: the ADRs, threat model,
data classification and protocols are the part most worth reusing, and they are meant to be adapted
for other studies.
