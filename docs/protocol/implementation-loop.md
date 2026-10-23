# Bounded implementation loop

## Why the loop exists

The loop makes engineering evidence repeatable. It does not make product, research, privacy, or gate decisions autonomously.

## Cycle

1. **Inspect:** read the scope lock, slice issue, affected code, and current tests.
2. **Plan:** state the smallest end-to-end change, assumptions, acceptance criteria, and risks.
3. **Implement:** use synthetic data and the fewest necessary files.
4. **Evaluate:** run `npm run loop`.
5. **Diagnose:** work only from the first failed deterministic stage.
6. **Repair:** make the smallest in-scope correction.
7. **Repeat:** maximum five failed repair cycles.
8. **Escalate:** stop immediately on a protected decision or after the fifth failed cycle.
9. **Evidence:** provide diff summary, test output, accessibility/security impact, assumptions, and unresolved risks.
10. **Approve:** a human reviews before commit, merge, deployment, or the next slice.

## Harness profiles

- Fast: scope, secrets, traceability, format, lint, type check, unit/integration.
- Full: fast plus production build, browser/accessibility E2E, runtime dependency audit.

## Anti-gaming rules

- Do not skip, delete, weaken, or rewrite a failing check solely to pass.
- Do not change the expected behavior without a decision record.
- Do not add broad exception lists.
- Do not replace an end-to-end assertion with a shallow existence check.
- Do not claim success when browser tests were not executed.

## Exit states

- **PASS:** full loop green; human review requested.
- **REPAIR:** deterministic failure with an in-scope correction.
- **BLOCKED:** protected decision, missing authority, missing external dependency, or five failed cycles.
- **STOP:** requested work violates Gate 0 or participant/data protections.
