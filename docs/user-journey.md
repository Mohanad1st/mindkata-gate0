# Gate 0 user journey

The journey **as implemented**, end to end, with the evidence each step produces and the Gate 0A
criterion it serves. Written so a facilitator can follow a session without reading the source, and so
a buyer conversation can be walked through screen by screen.

The prototype covers only the shaded middle of a session. The interview, the neutral offer wording,
the coding, and the decision all live in the Version 2.1.1 Execution Kit, which is the controlling
source. Where a step depends on the facilitator rather than the software, this document says so —
those are the places where a missing observation silently costs you a scored criterion.

## The whole session, in order

| #   | Step                                    | Owner                       | Duration (Kit) |
| --- | --------------------------------------- | --------------------------- | -------------- |
| 1   | Consent and data boundary read aloud    | Facilitator (Kit `02`)      | 3 min          |
| 2   | Recent-incident interview               | Facilitator (Kit `03`)      | 10 min         |
| 3   | Unprompted proposition comprehension    | Facilitator (Kit `03`)      | 3 min          |
| 4   | **Mission 1, observed**                 | **Prototype**               | target ≤12 min |
| 5   | Neutral Mission 2 offer, optional start | Facilitator + **Prototype** | 1–10 min       |
| 6   | Debrief                                 | Facilitator (Kit `03`)      | 8 min          |

Target session: 35–45 minutes. The prototype is steps 4 and 5 only.

## Entry: the start page (`/`)

One screen, three parts: the proposition, the data boundary, and a single call to action.

- **Eyebrow** reads "GATE 0 RESEARCH PROTOTYPE" — the participant is told what this is before
  anything else.
- **"Before you begin"** carries five boundary statements: synthetic information only; do not enter
  personal, employer, client, employee, patient, government or confidential information; no
  diagnosis of intelligence, cognitive decline, mental health, employability or job performance;
  results will not be used for employment decisions; the draft stays in the browser session unless
  exported. These mirror the Kit's consent script — they supplement the facilitator's read-aloud, they
  do not replace it.
- **Expected time: 8–12 minutes** is stated up front.
- **Footer** — "Working name only: MindKata. Approved for Gate 0 evidence collection, not product
  efficacy claims."

⚠️ At desktop widths the boundary panel sits **below the fold**. Scroll to it with the participant
rather than assuming they have read it.

## Mission 1 — the six stages

Entering `/mission/1` creates the session record and emits `M1_STARTED`. An anonymous session code
(`MK-` plus eight hex characters) is generated and shown. **Start your timer after the participant
has read the objective and constraints**, per the Kit — not at page load.

Every stage gates the Continue button: it stays visibly disabled until that stage's artifacts are
present. The participant sees the requirement, rather than being told after the fact.

| Step   | Stage                                                                    | Captured                                                              | Serves           |
| ------ | ------------------------------------------------------------------------ | --------------------------------------------------------------------- | ---------------- |
| 1 of 6 | **Independent judgment** — "ANSWER BEFORE SEEING AI OUTPUT"              | initial decision, initial confidence                                  | `G0-02`, `G0-05` |
| 2 of 6 | **Frame the decision**                                                   | objective, constraints, uncertainty                                   | `G0-03`          |
| 3 of 6 | **Delegate deliberately**                                                | dependency map, human-owned work, AI-assisted work, verification plan | `G0-04`          |
| 4 of 6 | **Inspect AI output** — "FIXED SYNTHETIC OUTPUT · NOT A LIVE MODEL CALL" | nothing; reading only                                                 | `G0-02`          |
| 5 of 6 | **Verify and decide**                                                    | evidence check, final decision, final confidence                      | `G0-05`          |
| 6 of 6 | **Completion receipt** — "FINITE ENDPOINT REACHED"                       | emits `M1_COMPLETED`, stamps `completedAt`                            | `G0-05`, `G0-07` |

**The order is the product.** Stage 1 closes before any AI output exists, which is the whole
proposition: independent judgment first, then structured delegation, then inspection. If a
participant asks to see the AI early, that is a finding — record it, do not accommodate it.

At stage 4 the AI output is deliberately imperfect. Mission 1's recommendation is directionally
useful but never checks the attendance arithmetic. Mission 2's **omits a mandatory USD 1,800 cost
and cites an "Assurance Statement A-114" that appears in none of the supplied sources** — so the
mission tests both a missing constraint and fabricated support.

Stage 5 also exposes a **Facilitator debrief note** disclosure, for use in step 6.

## The receipt, and what leaves the browser

The receipt card offers **Export session receipt** and **Delete this browser-session record**, plus
an inspectable **Review receipt JSON**. Nothing is transmitted anywhere: there is no analytics, no
server, and no database. Data lives in `sessionStorage` until the participant exports or deletes it.

The exported file is `MK-XXXXXXXX-mission-N.json` and contains `schemaVersion`, `sessionCode`,
`missionId`, `startedAt`, `completedAt`, the structured `answers`, and the ordered `events`. It
contains no name, email, employer, or device identifier.

## Mission 2 — voluntary continuation

After Mission 1 the receipt shows an **Optional Mission 2** block: "Continuing is voluntary. Starting
and completing Mission 2 — not merely opening it — is the Gate 0 continuation outcome."

**Read the Kit's offer wording verbatim, once, and then stop.** Do not praise, persuade, remind, or
ask again. Record offered / started / completed separately before any discussion.

`/mission/2` emits `M2_STARTED`; completing it emits `M2_COMPLETED`. Only completion counts toward
the threshold.

## Two things the software cannot tell you

Both are documented in ADR 0004 and printed by the aggregation tool on every run.

1. **Mission 1 and Mission 2 receipts cannot be linked to one participant.** The anonymous code is
   generated per mission, so the same person gets a different code for each. The Mission 2
   continuation rate is a **per-user** rate — its denominator must come from your field log's
   participant code, not from the exported files.
2. **The receipt's elapsed time includes idle time.** `startedAt` is when the mission page mounted,
   and `sessionStorage` survives a reload, so an interrupted participant inflates it. Your observed
   timing is authoritative; the receipt figure is corroboration.

Also observational, and not in any file: **rescue**. A rescue is the facilitator explaining a
required step, revealing an answer, fixing navigation, or recovering the participant from a blocking
problem. Clarifying the study boundary or preventing a confidential disclosure is **not** a rescue —
record it separately. `G0-03`'s pass condition is completion _without rescue_, so an unrecorded rescue
silently inflates a scored criterion.

## Reading the numbers

`npm run receipts:summarize <directory-of-exported-receipts>` reports, per mission: receipt files,
participants, duplicates collapsed, started, completed, and median completion minutes.

It deliberately produces **no GO / PIVOT / STOP verdict** and compares nothing against a threshold —
thresholds are a protected decision. Apply `docs/scope-lock.md` yourself, using the denominators
recorded there, including the third one: at least 8 users who completed Mission 1 **and were
neutrally offered** Mission 2.

### Worked example

Run against a **synthetic** eight-participant set, including one receipt downloaded twice, so you can
see the shape of the output before a real session. These are not findings; the data is invented.

```
Mission 1
  receipt files:        9
  participants:         8
  duplicates collapsed: 1
  started:              8
  completed:            7
  median completion:    11.0 min

Mission 2
  receipt files:        5
  participants:         5
  started:              5
  completed:            4
  median completion:    8.0 min
```

Two things to read carefully. **`receipt files` exceeds `participants`** because one export was
downloaded twice; the tool collapsed it and says so, and that duplicate's duration was not weighted
twice in the median. And **Mission 1 `participants` is 8 while Mission 2 `participants` is 5** — those
are different anonymous codes, not five of the same eight people. The continuation rate still comes
from your field log.

The synthetic fixtures are deliberately **not** committed to this repository. A generator sitting next
to real exports is a way for invented receipts to end up inside genuine gate evidence, and no
convenience is worth that.
