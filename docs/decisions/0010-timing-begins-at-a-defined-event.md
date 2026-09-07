# ADR 0010: Mission timing must begin at a defined event, not at page mount

**Status:** accepted for the additional instrumentation, which changes no existing measured value.
**One question awaits a founder decision:** which interval the Gate 0A median is scored on.
**Date:** 7 September 2026
**Relates to:** ADR 0004 (receipt aggregation), ADR 0007 (the enlarged artifact set and the timing
risk it created).

## The finding

The Execution Kit's QA requires that "timing begins and ends at defined events".

Half of that holds today. `completedAt` and `M1_COMPLETED` are written when the participant advances
out of the Verify-and-decide stage — a defined event, and the same one `07_Field_Log_and_Coding.md`
scores `M1_COMPLETE` against.

The other half does not. `startedAt` and `M1_STARTED` are written **in the mount effect of
`components/mission-flow.tsx`** — the instant the mission page loads. So the clock starts before the
participant has read the scenario brief, the three plan cards, or the constraint note, and before
they have done anything at all.

`scripts/aggregate-receipts.ts` already says as much in its own output notes: "The median is
wall-clock time from when the mission page mounted, so an interrupted or … Compare against the
facilitator's observed timings before trusting the median." The defect was known and annotated; it
was not fixed, and nothing measured the gap.

## Why this is not cosmetic

Gate 0A scores Mission 1 usability on a **median completion time of 12 minutes or less**, with a
**STOP floor above 18 minutes** (`docs/scope-lock.md`, ADR 0002). A STOP is not a soft signal — it
blocks Gate 1 regardless of how many other criteria pass.

ADR 0007 raised Mission 1's required artifacts from 11 to 15 and stated the consequence plainly:
this "materially raises the risk of breaching a scored criterion". Reading time is now being added
on top of an interval that was already at risk. Two participants who work identically fast will
record different times purely because one read the brief carefully.

That is a measurement artefact with the power to STOP the gate. It would be the worst possible
outcome: a real, usable instrument failing its own threshold for a reason that has nothing to do
with usability, and doing so in evidence that a funder or reviewer would be entitled to trust.

## Decision — the part being implemented

Capture a third defined event and leave every existing value untouched:

- A new `firstInputAt` timestamp, and a `M1_FIRST_INPUT` / `M2_FIRST_INPUT` event, written once when
  the participant first changes any answer.
- `lib/receipt-summary.ts` reports `medianTaskMinutes` (first input → completion) **alongside** the
  existing `medianCompletionMinutes` (page mount → completion).
- `scripts/aggregate-receipts.ts` prints both, and the difference between them, so the facilitator
  can see how much of the measured time was reading.

This is additive on purpose. `startedAt`, `completedAt`, `M1_STARTED`, `M1_COMPLETED`, `M2_STARTED`
and `M2_COMPLETED` keep their current semantics and their current values, so:

- no existing number changes, and no already-recorded receipt becomes unreadable;
- **`M2_STARTED` in particular is left alone.** Voluntary Mission 2 _start_ is itself a scored
  criterion ("at least 50% and at least 4 users voluntarily start **and complete** Mission 2").
  Redefining when it fires would alter a measured outcome, which is a protected decision and is not
  what this ADR does.

It sits inside the approved Gate 0 scope line "Accessibility, **timing**, facilitator observation,
and debrief support" (`CLAUDE.md`), and adds evidence rather than changing a rubric.

## The question that is not mine to answer

**Which interval does the Gate 0A median get scored on?**

- **(a) Task time** — first input to completion. Measures the thing the criterion is about: whether a
  professional can produce the artifact set without rescue. Excludes reading, which is not the task.
- **(b) Page-open time** — mount to completion, as today. Closer to "how long does a session take",
  which is what a facilitator scheduling a slot cares about, and it is the number every prior
  discussion of "8–12 minutes" implicitly referred to.
- **(c) Both, with one named as primary** and the other reported as context.

There is a real argument for each, and the choice changes whether the criterion passes. That makes
it a decision about a scored outcome, which `CLAUDE.md` lists as protected and reserves for the
founder.

**It has to be settled before the first dry run, not after.** `04_Gate_0A_Scorecard.md` states: "Do
not … lower thresholds after observing results." Choosing the measurement definition once numbers
exist is a threshold change under observation in everything but name. Deciding now is legitimate and
costs nothing; deciding later contaminates the evidence.

## Consequences

- Dry runs required by ADR 0007 will produce two numbers instead of one, and the gap between them
  quantifies how much of the session is reading. That is useful information regardless of which
  interval is scored.
- ADR 0007's instruction — "Restore a real number once dry runs measure one" — can be satisfied with
  a number whose definition is written down.
- If task time and page-open time land on opposite sides of 12 minutes, that is exactly the situation
  this ADR exists to surface before it can be resolved by hindsight.
