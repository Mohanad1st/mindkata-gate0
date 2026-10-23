# Gate 0 implementation PRD

## Objective

Build a low-data research-observation instrument that lets a facilitator test whether the core MindKata interaction is understandable, usable, finite, and valuable enough to justify priced offer testing.

## Users

- Eligible professional participant who uses AI for consequential work.
- Facilitator who observes the session and exports a de-identified receipt.
- Qualified organizational buyer interviewed separately using the execution protocol.

## Primary product flow

1. Read the research and data boundary.
2. Start Mission 1 with an anonymous session code.
3. Make an independent decision before AI is visible.
4. Frame objective, constraints, and uncertainty.
5. Assign human, AI, and verification work.
6. Inspect one controlled AI output.
7. Verify evidence and make a final decision.
8. Reach a finite receipt with export and deletion controls.
9. Choose voluntarily whether to start Mission 2.
10. Complete the adversarial mission and reach a second finite receipt.

## Functional requirements

| ID    | Requirement                                                                | Acceptance evidence                |
| ----- | -------------------------------------------------------------------------- | ---------------------------------- |
| G0-01 | Only two fixed synthetic missions are available                            | Schema and route tests             |
| G0-02 | AI output is hidden until independent judgment is submitted                | Browser flow test                  |
| G0-03 | Framing captures objective, constraints, and uncertainty                   | Unit and browser tests             |
| G0-04 | Delegation separates human work, AI assistance, and verification           | Unit and browser tests             |
| G0-05 | Final decision preserves initial judgment in the receipt                   | Browser receipt assertion          |
| G0-06 | Mission 2 continuation is voluntary and completion is separate from start  | Browser event assertion            |
| G0-07 | Draft remains in browser-session storage; export and deletion are explicit | Browser persistence/deletion tests |
| G0-08 | Core pages have no serious automated accessibility violations              | axe browser tests                  |
| G0-09 | Prohibited integrations and dependencies cannot enter silently             | Scope-lock script                  |
| G0-10 | Every locked requirement maps to executable test evidence                  | Traceability script                |

## Non-functional requirements

- Responsive, laptop-first and usable on narrow screens.
- Keyboard operable with visible focus and skip link.
- No hidden autoplay, infinite scroll, streak, ranking, or variable reward.
- No network call is needed for mission content or AI output.
- No personal data field.
- A failure must preserve the draft inside the current browser session.
- The page must identify the prototype and non-efficacy boundary.

## Delivery slices

1. Repository and harness baseline.
2. Scenario shell and fixed content.
3. Independent judgment and immutable receipt representation.
4. Frame and delegation stages.
5. Controlled AI output, verification, and final decision.
6. Voluntary Mission 2, export/delete, facilitator evidence, and final UAT.

## Definition of done

A slice is done only when acceptance criteria, scope lock, secret scan, traceability, formatting, lint, type checks, unit/integration tests, relevant browser/accessibility tests, production build, and dependency audit pass. Documentation must be updated and a human must review the diff.

## Gate boundary

The prototype may be used only under the separate Gate 0 consent, recruitment, observation, scorecard, and buyer-offer protocols. Product engagement data alone cannot decide GO, PIVOT, or STOP.
