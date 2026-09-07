# Contributing

Read this before opening a pull request, because this repository will reject changes that most
repositories would welcome.

## What this repository is

A Gate 0 research prototype, published as a worked example of a research-ethics boundary a build can
check. It is not a library, and it is not accepting features.

The scope lock in [`config/scope-lock.json`](config/scope-lock.json) is enforced by
[`scripts/check-scope.mjs`](scripts/check-scope.mjs), which runs first in `npm run qa` and in CI on
every push and pull request. It fails the build if a prohibited path exists, if the runtime
dependency set differs from the allow-list **by even one package in either direction**, if any source
file contains one of nine banned integration strings, or if an unapproved mission id appears.

That means a well-intentioned PR adding a chart library, an analytics SDK, error tracking, or a
third mission **cannot be merged**, and will fail before any human reads it. This is working as
designed, not a misconfiguration.

## What is welcome

- **Bugs.** A stage of `npm run qa` failing on a clean clone, a broken link, a doc that contradicts
  the code, an accessibility defect.
- **Accessibility fixes.** `tests/e2e/accessibility.spec.ts` runs axe on the start and mission pages
  and fails on serious or critical violations. If you find one it misses, that is a real find.
- **Documentation corrections**, particularly where a document overstates what the evidence shows.
  ADR 0008 was corrected by ADR 0009 for exactly that reason.
- **Adaptations of the pattern.** If you reuse the scope lock in your own study, an issue describing
  what you had to change is genuinely useful and will influence how this is written up.

## What is not welcome

- New runtime dependencies. Adding one requires a dated decision record and founder review
  (`CLAUDE.md`, engineering rules), and the scope check will fail regardless.
- Features beyond Gate 0 — a feed, adaptive difficulty, automated scoring, a live model call,
  a database. These are excluded in [`docs/scope-lock.md`](docs/scope-lock.md) as hard exclusions.
- Changes to mission content, rubrics, thresholds, or scoring. These are the study instrument;
  changing them invalidates the evidence and is a protected decision.
- **Weakening a gate to make a build pass.** If a check is wrong, say so in an issue with the
  evidence. Do not delete it, loosen its regex, or add an exclusion.

## Setting up

Node.js 22 or newer.

```bash
npm ci
npx playwright install chromium
npm run dev       # http://localhost:3200 — the port is pinned deliberately
```

## Before opening a PR

```bash
npm run qa
```

All ten stages must pass: scope lock, secret scan, traceability, formatting, lint, type check, unit
and integration tests, production build, browser and accessibility E2E, runtime dependency audit.
CI runs the same command, so a green local run is a good predictor.

Two conventions that are checked rather than requested:

- **Traceability.** If you change behaviour covered by
  [`docs/test-traceability.json`](docs/test-traceability.json), the mapped test file must literally
  cite the requirement id (for example `G0-11`) or `check-traceability.mjs` fails.
- **Conventional commits** — `feat:`, `fix:`, `docs:`, `chore:`, `test:`.

## Reporting something sensitive

Do not open a public issue for a security or privacy problem. See [SECURITY.md](SECURITY.md).

## Licence

By contributing you agree your contribution is licensed under the MIT License in
[LICENSE](LICENSE), which covers the documents as well as the code.
