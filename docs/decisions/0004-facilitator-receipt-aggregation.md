# ADR 0004: Facilitator receipt aggregation

**Status:** accepted.
**Founder authorisation, 7 September 2026.** The work sits inside the approved Gate 0 scope line
"Accessibility, **timing**, facilitator observation, and debrief support" (`CLAUDE.md`), and it is now
load-bearing: the task-time reporting required by `decisions/0010` extends this module. It had been
shipped while this record still read "proposed", which is the kind of gap this repository exists to
catch; the status is corrected rather than the history rewritten.
**Date:** 12 August 2026

## Decision

Add `lib/receipt-summary.ts` (pure, tested) and `scripts/aggregate-receipts.ts` (a CLI over a
directory of exported receipts, wired as `npm run receipts:summarize`). It reports operational
counts per mission: receipt files, participants, duplicates collapsed, started, completed, and the
median completion time in minutes.

This sits inside the approved Gate 0 scope line "Accessibility, **timing**, facilitator observation,
and debrief support" (`CLAUDE.md`), and `docs/protocol/study-protocol.md` already lists "Mission 1
completion time" as a recorded prototype outcome.

## Supersedes one consequence of ADR 0001

`docs/decisions/0001-gate0-baseline.md` records as an accepted consequence: "Facilitator
aggregation remains manual." **This ADR reverses that**, for reporting only. It is stated
explicitly because an unacknowledged reversal of a prior decision record is precisely the drift ADR
0002 and ADR 0003 were written to stop. Session receipts are still exported manually by each
participant; only the arithmetic over those files is now automated.

## Why

Gate 0A turns on `>=75% complete Mission 1 without rescue, with median completion no more than 12
minutes`. Without this, a facilitator computes a median across at least eight participants by hand,
mid-session — a place to make an arithmetic error in the one number a gate decision depends on.

## What it deliberately does not do

- **No threshold comparison and no GO / PIVOT / STOP verdict.** Thresholds are a protected decision
  (`CLAUDE.md`: "task facts, rubrics, scoring, outcomes, or thresholds"). The tool prints evidence;
  a human applies `docs/scope-lock.md`. The output says so on every run.
- **No observation sheet, screener, scorecard, or coding scheme.** Those belong to the Version 2.1.1
  Gate 0 Execution Starter Kit, which is the controlling source and is not in this repository.
- **No participant text.** `parseReceipt` rebuilds a whitelisted object rather than spreading input,
  so excluding `answers` is a runtime guarantee, not only a type-level one. A test asserts it.
- **No new dependency.** Node built-ins only; `allowedRuntimeDependencies` in
  `config/scope-lock.json` is unchanged.
- **No new locked requirement.** This deviates from the original plan, which proposed a new
  traceability ID. Adding `G0-11` would assert a locked Gate 0 requirement that the controlling
  Build-Ready PRD does not contain, and inventing study requirements locally is the same drift
  again. The unit tests run in the normal suite; all ten real requirements stay mapped.

## Two measurement caveats the numbers cannot fix

**Mission 1 and Mission 2 receipts cannot be linked to one participant.**
`components/mission-flow.tsx` generates the anonymous session code _inside_ the per-mission
initialisation effect, and the storage key is per mission, so the same person receives a different
code for each mission. Gate 0A's "at least 50% of eligible users, minimum 4, voluntarily start and
complete Mission 2" is a **per-user** rate, and these files support only per-mission counts. The
denominator must come from facilitator observation. Not changed here: altering what identifies a
participant across missions is a protected privacy decision, and per-mission anonymity may be
deliberate. Flagged for founder and privacy review.

**The median includes idle time.** `startedAt` is when the mission page mounted, and
`sessionStorage` survives a reload, so an interrupted participant inflates the figure a STOP floor
turns on (`median >18 minutes`). The CLI prints this caveat on every run and advises comparing
against observed timings. Deciding what "completion time" officially means is a protected decision
about outcomes, so it is documented rather than redefined.

## Defects found in review and fixed before merge

Two independent review passes ran against the first draft. Both found real problems; the two that
could have handed the gate a wrong number:

- **Timestamps were validated with `Date.parse` alone**, which accepts `"2026-08-10"` (read as UTC)
  and `"2026-08-10T10:00:00"` (read as **local**), plus `"2026"` and `"August 10, 2026"`. Mixing
  those forms turned a real ten-minute mission into 250 minutes on a UTC-4 machine, and into a
  negative — silently dropped from the sample while still counting as completed — east of UTC. Now
  an explicit `Z` or numeric offset is required. This mattered because the tool already anticipates
  receipts re-saved through editors and spreadsheets, which is exactly what rewrites timestamps.
- **Duplicate exports were counted as separate participants.** A second click on Download, or a
  copy saved as `… (1).json`, inflated `started`, `completed`, and weighted one duration twice in
  the median. Receipts are now de-duplicated by session code, preferring the completed copy, and
  the collapsed count is reported rather than hidden.

Also fixed: an unknown event name discarded an entire receipt (a later slice adding an event would
have silently deflated the counts, so unknown names are now ignored); `completedAt: null` lost the
whole receipt instead of meaning "not completed"; a receipt whose `missionId` disagreed with its
event names was accepted and then silently dropped from both missions, and is now rejected with a
reason; the run exited 0 even when every file was rejected; and three tests were tautological or
never exercised the `parseReceipt` → `summarize` seam.

## Notes and trade-offs

- The CLI is TypeScript executed directly by Node's native type stripping, importing
  `../lib/receipt-summary.ts` with an explicit extension, so one tested implementation serves both
  the suite and the command line. This required `allowImportingTsExtensions: true` in
  `tsconfig.json` (legal because `noEmit` is set) and was verified to run before being relied on.
  The trade-off, noted honestly: the flag applies project-wide, so `.ts` import specifiers are now
  permitted in `app/` and `components/` too, where the bundler may not resolve them. A scoped
  `scripts/tsconfig.json` would have narrowed it; that is a reasonable follow-up.
- `engines.node` was raised from `>=22.0.0` to `>=22.18.0`. Native type stripping is only unflagged
  from 22.18, so the previous floor advertised support the documented command does not have. This is
  the first `.ts` entrypoint in `scripts/`; every other script is `.mjs`.
- Parsing strips a leading byte-order mark. A browser export never has one, but a receipt re-saved
  through a Windows editor usually does, and `JSON.parse` rejects it outright — found while
  verifying against fixtures, where BOM-encoded files were rejected as invalid JSON.
- A malformed receipt is reported and excluded rather than aborting the run, so one bad export
  cannot cost a facilitator a session's numbers.

## Evidence

`npm run loop` passes all 10 stages. CLI output hand-checked against synthetic fixtures — durations
8, 14 and 10 minutes returning a median of 10, malformed and out-of-scope missions rejected with
reasons, and planted participant text absent from all output.
