# Security and privacy reporting

## Reporting

Please do not open a public issue for a security or privacy problem.

Use GitHub's private vulnerability reporting on this repository
(**Security → Report a vulnerability**), which reaches the maintainer without disclosing the report.

Expect an acknowledgement within seven days. This is a research prototype maintained by one person,
not a product with an on-call rotation — please size your expectations accordingly, and say in the
report if you intend to disclose publicly on a deadline.

## What is in scope

This is a Gate 0 research prototype. There is **no server-side data store, no participant identity
field, and no authentication**, so the usual account-takeover and data-breach classes do not apply.
What is genuinely in scope:

- Anything that causes participant-entered text to leave the browser. The
  [scope lock](config/scope-lock.json) is intended to make this impossible by forbidding every
  outbound integration pattern; a way around it is a real finding.
- A path by which `sessionStorage` contents could be read by another origin.
- A way to make the in-product working-name disclaimer disappear without failing the build
  (requirement `G0-11`).
- A way to make `scripts/check-scope.mjs`, `check-secrets.mjs`, or `check-traceability.mjs` pass
  while its stated condition is violated. **The gates are the security boundary here**, so a bypass
  of a gate is the most valuable thing you can report.
- A secret, key, or token committed anywhere in the git history.

## What is not in scope

- The absence of authentication on the public deployment. That is a recorded, deliberate decision —
  see [ADR 0009](docs/decisions/0009-public-deployment-of-the-gate0-prototype.md).
- Missing rate limiting, CSP hardening, or security headers on a static prototype that stores
  nothing server-side. Worth an issue, not a vulnerability report.
- Dependency advisories with no exploit path here. `npm run qa` already runs
  `npm audit --omit=dev --audit-level=high` on every build.

## Data handling, for reference

No participant data has been collected. Gate 0 uses `sessionStorage`, an anonymous session code,
explicit export and explicit deletion, with synthetic fixtures only in source control. The design is
documented in [`docs/security/data-classification.md`](docs/security/data-classification.md) and
[`docs/security/threat-model.md`](docs/security/threat-model.md).
