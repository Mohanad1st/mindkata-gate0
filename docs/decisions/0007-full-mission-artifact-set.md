# ADR 0007: Build the full `05_Mission_Briefs.md` artifact set

**Status:** accepted
**Date:** 13 August 2026
**Resolves:** the conflict recorded in ADR 0006

## Decision

Capture every completion artifact listed in the Execution Kit's `05_Mission_Briefs.md`, not only the
seven that `03_Interview_and_Prototype_Protocol.md` requires. ADR 0006 left this open as a founder
decision; it is now resolved in favour of the fuller set.

Founder authorisation, 13 August 2026: finalise the product now and measure timing when real people
try it. That accepts the trade-off in the next section rather than avoiding it.

## What was added

| Stage                      | Field                                                                                        | Kit source                                                                              |
| -------------------------- | -------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| Frame                      | `audience` — "Who is this decision for?"                                                     | `05` shared structure step 2                                                            |
| Frame                      | `assumptions` — "What are you assuming?"                                                     | `05` shared structure step 2                                                            |
| Verify                     | `aiContributions` — "What did you accept, change, or reject from the AI output?"             | `05` shared structure step 6                                                            |
| Verify                     | `residualRisk` — "What risk remains after this decision?"                                    | `05` Mission 1 completion artifacts                                                     |
| Verify                     | `accountableOwner` — "Who is accountable, and who do you escalate to?"                       | `05` Mission 1 completion artifacts                                                     |
| Verify, **Mission 2 only** | `claimEvidence` — "List each AI claim and the evidence that supports or fails to support it" | `05` — "Completion artifacts mirror Mission 1 and add an explicit claim/evidence table" |

Each is gated: the stage cannot be advanced until it is present, the same as every existing artifact.

`stageIsComplete` gained an optional `missionId` parameter, consulted only for the Mission 2
claim/evidence table. Mission 1 must not demand it, and a test asserts both directions.

Mission 1 now captures **15** fields; Mission 2 captures **16**.

## The trade-off this creates, stated plainly

Gate 0A scores Mission 1 usability as "at least 75% complete without rescue, **median completion time
12 minutes or less**", with a STOP floor at a median over 18 minutes. Mission 1's required fields went
from 11 to 15. **This materially raises the risk of breaching a scored criterion**, and that risk was
accepted deliberately rather than discovered later.

The Kit's own two documents pull in opposite directions here: `05` asks for these artifacts, `04`
scores the time it takes to produce them. Building the fuller set makes the instrument a better test
of judgment and a harder test of the 12-minute threshold.

Consequently, the start page no longer claims "Expected time: 8–12 minutes". That number was measured
against the smaller field set and is now unverified; rather than invent a replacement, the page says
the facilitator will confirm the expected time. **Restore a real number once dry runs measure one.**

## What the dry runs must now decide

The Kit requires "two dry runs confirm the interface can be completed without facilitator rescue" and
that "timing begins and ends at defined events". Run them before recruiting. If the median lands over
12 minutes, there are exactly three honest options and no fourth:

1. **Reduce the required set** — but these artifacts are Kit-specified, so dropping one needs a dated
   decision that says which and why.
2. **Amend the threshold** — a protected decision about outcomes, requiring founder approval and a
   dated record. Note that changing a threshold _after_ seeing results is explicitly forbidden by
   `04_Gate_0A_Scorecard.md`: "Do not … lower thresholds after observing results." Doing it before
   any participant runs is legitimate; doing it after is not.
3. **Accept the result** — a PIVOT band at 12–18 minutes, or STOP above 18.

Deciding this before the first session is cheap. Deciding it after is a threshold change under
observation, which the scorecard prohibits.

## Consequences

- The prototype now produces the complete artifact set a blinded rater needs, which is what makes the
  Gate 2 scoring design possible later.
- Mission 2 finally tests what its brief describes: a missing mandatory constraint **and** fabricated
  support, with an explicit place to record the claim-by-claim check.
- The 8–12 minute expectation is retired until measured.
- `npm run loop` passes all 10 stages with 36 tests, so the enlarged flow is fully covered by the
  browser suite as well as the unit tests.
