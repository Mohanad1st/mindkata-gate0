# Gate 0 scope lock

**Locked on:** 10 August 2026  
**Controlling status:** approved for Gate 0 evidence collection only.

## Testable proposition

Professionals and organizational buyers may value structured practice that helps people frame work, delegate to AI, verify critical claims, and retain accountable decision ownership.

## Approved build

- One coherent, finite web experience.
- Mission 1: normal synthetic work decision.
- Mission 2: adversarial synthetic work decision.
- Six stages: independent judgment, frame, delegate, inspect, verify/decide, receipt.
- Controlled prewritten AI outputs.
- Browser-session persistence only.
- Anonymous session code, explicit export, explicit deletion.
- Separate `M2_STARTED` and `M2_COMPLETED` evidence.

## Gate 0A pass conditions

All conditions must pass:

- at least 8 eligible users and 8 qualified buyers;
- at least 60% and at least 5 users report a consequential human–AI incident **in the past six
  months**;
- at least 70% of both users and buyers accurately explain the proposition;
- at least 75% complete Mission 1 without rescue, with median **task time** no more than 12 minutes,
  **and no material safety or privacy issue**;
- at least 50% and at least 4 users voluntarily start **and complete** Mission 2, without added
  incentive or direct prompting;
- at least 50% and at least 4 buyers identify a credible use case, owner/budget route, and outcome.

PIVOT is allowed only when at least three of five scored criteria pass, no stop floor is crossed, no material safety/privacy issue occurs, and one bounded retest is preregistered. Fewer than three passing criteria is STOP, **even when every failed criterion is still inside its warning band**.

### Valid denominators

- at least 8 eligible users;
- at least 8 qualified buyers, kept as a distinct denominator even when one person could fit both
  roles;
- at least 8 eligible users who complete Mission 1 **and are neutrally offered Mission 2** — this is
  the denominator of the Mission 2 continuation rate, not the count of enrolled users;
- exclusions and missing data are reported, and a denominator is never silently changed;
- **percentages are rounded up to whole participants.**

### Gate 0A warning bands and STOP floors

A criterion that misses its pass condition but lands inside its warning band counts as a failed
criterion for the three-of-five PIVOT rule. A criterion below its floor is an immediate STOP,
regardless of how many other criteria pass.

The **five scored criteria** are recent need, comprehension, Mission 1, Mission 2, and buyer
relevance. Mission 1 completion and Mission 1 median are two conditions of the single Mission 1
criterion, not two separate criteria — the table below lists them on their own rows because each
carries its own floor.

| Criterion            | PASS        | Warning band (PIVOT eligible) | STOP floor |
| -------------------- | ----------- | ----------------------------- | ---------- |
| Recent need          | ≥60%, min 5 | 40–59%                        | <40%       |
| Comprehension        | ≥70%        | 50–69%                        | <50%       |
| Mission 1 completion | ≥75%        | 50–74%                        | <50%       |
| Mission 1 median     | ≤12 min     | 12–18 min                     | >18 min    |
| Mission 2 completion | ≥50%, min 4 | 25–49%                        | <25%       |
| Buyer relevance      | ≥50%, min 4 | 30–49%                        | <30%       |

**The Mission 1 median measures task time**: from the participant's first answer change to the
recorded completion, per `decisions/0010-timing-begins-at-a-defined-event.md`. It is not page-open
time, which starts on mount and therefore counts time spent reading the brief. Page-open time is
still reported alongside it as scheduling context and is not scored. Founder decision, 7 September
2026, taken before any participant ran — `04_Gate_0A_Scorecard.md` forbids changing a threshold
after observing results, and choosing the measurement definition later would be the same thing.

STOP also applies on any material safety or privacy issue, or after a failed retest.

A **bounded retest** for Gate 0A changes exactly one primary variable and recruits at least 5 new
users and 5 new buyers. It must be preregistered before the retest begins.

## Gate 0B pass conditions

After Gate 0A passes: 10 valid priced proposals, at least 8 substantive responses, at least 2 hard commercial progressions, and at least 1 financial or contractual commitment. A permitted retest passes only when cumulative original-plus-retest evidence reaches the full commercial threshold.

PIVOT is allowed on exactly 1 hard commercial signal without a commitment, or on 0 hard signals
accompanied by at least 3 repeated solvable objections and at least 2 requests for revision. The
bounded retest for Gate 0B is one further round of 5 priced proposals.

STOP applies on 0 hard signals without that pivot evidence, on training-only demand, or after a
failed retest.

## Hard exclusions

- No full product or research MVP before Gate 0 passes.
- No newsletter/feed layer.
- No broad cognitive-training library.
- No personalized AI-capability layer.
- No live inbox, RSS, URL, or private-data ingestion.
- No production database, persistent identity, or organization integration.
- No automated primary-outcome scoring.
- No claim of cognitive protection, transfer, or efficacy.
- No public launch, paid acquisition, or legal reliance on the provisional name. A publicly reachable deployment of the Gate 0 prototype is permitted under `decisions/0009-public-deployment-of-the-gate0-prototype.md`; a deployment is not a launch, and the in-product working-name disclaimer must remain covered by a test (`G0-11`).

Changing any item above requires a dated decision record and founder approval. Passing CI does not authorize a scope change.

Gates 1 to 4 and their entry conditions are recorded in `decisions/0003-gate-sequence.md`. Gate 1
is a new approved build with its own scope lock, not the next slice of this one — and Arabic/RTL is
a Gate 4 hypothesis, so this prototype stays English-only.
