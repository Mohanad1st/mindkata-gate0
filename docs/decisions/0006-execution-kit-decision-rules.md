# ADR 0006: Decision rules transcribed from the v2.1.1 Execution Kit

**Status:** accepted. The conflict recorded below was resolved by
`0007-full-mission-artifact-set.md` on 13 August 2026 in favour of the fuller `05` set; this status
line had continued to read "awaits a founder decision" afterwards and is corrected here. The
conflict and both options are retained below because the reasoning is what makes 0007 legible.
**Date:** 13 August 2026

## Context

The Version 2.1.1 Gate 0 Execution Starter Kit — the controlling operational source named by
`docs/protocol/study-protocol.md` — is now available. Until today it existed only as a citation, and
ADR 0002 transcribed the Gate 0A thresholds from the Version 2.1 **decision package** instead.

**The thresholds match exactly.** All five pass criteria, all five pivot bands, and all five stop
floors in the Kit's `04_Gate_0A_Scorecard.md` agree with `docs/scope-lock.md`. ADR 0002 is confirmed
against the controlling source; nothing was mis-transcribed.

The Kit does, however, carry four decision rules the repository never had. They are not thresholds,
they are the arithmetic _around_ the thresholds, which is exactly where a gate decision goes wrong
quietly.

## Decision

Transcribe into `docs/scope-lock.md`, verbatim in substance:

1. **The recency window.** A qualifying incident must have occurred **in the past six months**. The
   scope lock previously said only "recent", which left each facilitator to decide what that meant.
2. **The third denominator.** At least 8 eligible users must complete Mission 1 **and be neutrally
   offered Mission 2**. That set — not the enrolled-user count — is the denominator of the Mission 2
   continuation rate. Using the wrong denominator changes the result of a scored criterion.
3. **Rounding.** Percentages are rounded **up** to whole participants. This decides borderline cases.
4. **The STOP clarification.** Fewer than three passing criteria is STOP _even when every failed
   criterion is still inside its warning band_, closing a reading in which pivot bands could rescue a
   STOP.

Also added: "no material safety or privacy issue" as an explicit condition of the Mission 1 usability
criterion, matching the Kit, where it was previously only implied by the separate STOP sentence.

No threshold is created, relaxed, or tightened.

## Recorded conflict: which artifacts define Mission 1 completion

`00_START_HERE.md` instructs: "If they appear to conflict, stop and record a decision before changing
the protocol." Two Kit documents describe completion differently.

- **`03_Interview_and_Prototype_Protocol.md`** defines it operationally, and this is what the
  `M1_COMPLETE` code in `07_Field_Log_and_Coding.md` scores against: "a submitted independent answer,
  confidence rating, frame, **task/dependency map**, delegation choice, verification choice, and final
  decision" — seven artifacts.
- **`05_Mission_Briefs.md`** lists a longer set of completion artifacts, adding **audience**,
  **accepted/modified/rejected AI contributions**, **residual risk**, and an **escalation owner**,
  plus a **claim/evidence table** for Mission 2. That file describes itself as defining "content and
  scoring targets", not the completion gate.

Against the seven-artifact operational definition, the prototype is missing exactly one: the
**task/dependency map**. That gap is being closed as a separate reviewed slice.

The additional `05` artifacts are **not** being built on this transcription alone, for a reason that
is itself a gate concern: each new required field lengthens the session, and Mission 1 is scored
against a **median completion time of 12 minutes or less** with a STOP floor at 18. Adding five
fields could move a scored criterion. The Kit's own QA requires that "two dry runs confirm the
interface can be completed without facilitator rescue" and that "timing begins and ends at defined
events".

**Founder decision required — taken 13 August 2026: option (b), see `0007`.** Either (a) treat `03`'s seven artifacts as the completion definition
and `05`'s extras as scoring guidance for the facilitator, or (b) build the full `05` set and re-time
the mission in dry runs before freezing the prototype.

## Consequences

- The GO / PIVOT / STOP arithmetic can now be applied from this repository without ambiguity about
  recency, denominators, or rounding.
- The Kit remains the controlling source. This is a convenience transcription; if the Kit is revised,
  a new dated decision record must update `docs/scope-lock.md`. The Kit itself is deliberately **not**
  copied into this repository — duplicating a controlling document is the drift ADR 0002 and ADR 0003
  exist to prevent.
- Facilitator-side material — the screener, consent script, interview wording, coding dictionary, and
  daily close procedure — stays in the Kit and is not mirrored here.
