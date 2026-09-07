# ADR 0009: The Gate 0 prototype is deployed publicly, with no authentication

**Status:** accepted. **Supersedes:** `0008-access-protected-preview-deployment.md`.
**Amends:** `docs/scope-lock.md`, hard exclusions.
**Date:** 7 September 2026
**Decided by:** the founder, explicitly, after the access-protected option in 0008 was implemented
and reviewed.

## Decision

The prototype is deployed to a publicly reachable URL that requires no login. ADR 0008's
requirement that "an unauthenticated request to the deployment URL must not return `200`" is
withdrawn.

## Why the earlier objection no longer holds

ADR 0008 and the original exclusion were written to prevent an unreleased research instrument, under
an uncleared provisional name, from being found, opened, or mistaken for a launched product. Two of
those three concerns were already resolved by an event that happened after 0005 was written and on
the same day as 0008: **this repository became public on 6 September 2026.**

- **The instrument is already public.** Both missions, in full — briefs, prewritten AI outputs,
  adversarial content — are readable in `content/scenarios/index.ts` on GitHub. A public deployment
  exposes nothing about the study that a reader cannot already obtain from the repository. Keeping
  the app behind a login while its entire content sits in a public file was protecting the wrapper
  and not the contents.
- **The name is already public.** It is in the repository name, the README, and the page title.
  "Legal reliance on the provisional name" remains excluded, and a deployment is not reliance.
- **Nothing is collected.** There is no participant identity field, no server database, and no
  model API call is possible — the scope lock enforces the last of these mechanically. A stranger
  clicking through both missions produces no record anywhere except their own `sessionStorage`,
  which they can clear. There is no dataset for an uninvited visitor to contaminate, because
  evidence collection at Gate 0 is facilitated and receipt-based, not passive.

What remains genuinely true is that a hosted URL makes the prototype easier to mistake for a
product. The application already states its own status in-product — the start page carries "Working
name only: MindKata. Approved for Gate 0 evidence collection, not product efficacy" — and that
disclaimer is covered by an end-to-end test, so it cannot be removed silently.

## Residual risks, accepted knowingly

1. **Participant pre-exposure.** Gate 0 measures independent judgment _before_ any AI output is
   shown. A recruited participant who has already worked through Mission 1 is not measuring that.
   This risk is **created by the public repository, not by the deployment** — the mission content is
   already readable — but the deployment lowers the effort required from "read a TypeScript file" to
   "click a link". _Mitigation:_ screening for prior exposure becomes a required recruitment
   question, and a participant who reports it is excluded and reported as an exclusion, per the
   valid-denominators rule in `docs/scope-lock.md`.
2. **Misreading as a launch.** Someone may share the URL as though it were a released product. The
   in-product disclaimer reduces this; it does not eliminate it.
3. **No access record.** With authentication removed there is no log of who opened it. This is
   consistent with the privacy design — the alternative would mean collecting identity to protect
   against a risk the previous point already accepts.

## Amendment to `docs/scope-lock.md`

The hard exclusion is amended from the wording introduced by 0008:

> No public launch, paid acquisition, publicly reachable deployment, or legal reliance on the
> provisional name. An access-protected deployment … is permitted under `decisions/0008`.

to:

> No public launch, paid acquisition, or legal reliance on the provisional name. A publicly
> reachable deployment of the Gate 0 prototype is permitted under `decisions/0009`; a deployment is
> not a launch, and the in-product working-name disclaimer must remain covered by a test.

"Public launch" stays excluded and is not the same thing as a public URL. A launch is promotion,
acquisition, and a claim of readiness. None of those are authorised.

## What this still does not authorize

- No public launch, paid acquisition, or legal reliance on the provisional name.
- No running the study against the hosted URL: Gate 0 still requires the Execution Starter Kit,
  approved consent, and recruited participants.
- No movement of the Gate 0 / Gate 1 boundary, and no Gate 1 infrastructure.
- No analytics, no server-side logging of participant content, no identity collection. The scope
  lock continues to enforce this and is unchanged.
- Passing CI still does not authorize a scope change.

## How it was done

The project's Vercel Authentication setting was left untouched at
`{ enabled: true, deploymentType: "all_except_custom_domains" }`. Under Vercel's behaviour this
guards every per-deployment URL while leaving the production alias open, so the prototype was made
public by **deploying to production**, not by weakening protection. Measured afterwards: the
production alias `mindkata-gate0.vercel.app` returns `200`, while both the preview deployment URL
and the production _deployment_ URL still return `302` to the Vercel login. Only the stable alias is
public. This is the same
action the `vercel --prod` pattern in `scripts/guard-command.mjs` blocks by default, performed on
explicit founder instruction and recorded here rather than taken quietly.

Git integration remains absent, per 0008 clause 3, so no push to this repository can trigger a
deployment. That constraint outlives 0008 and is retained deliberately: the 13 August 2026 incident
in `0005-no-cli-deployment.md` was caused by automatic deployment on push, which is a different
failure from a deliberately public URL.

## Consequence

`docs/scope-lock.md` no longer forbids a public deployment, so a reviewer should not read a live
public URL as drift. The checkable conditions are now: the in-product working-name disclaimer is
present and tested; no analytics or identity collection exists; no Git integration is configured;
and recruitment screens for prior exposure. ADR 0008 is superseded and retained for the record —
its reasoning about ordering, Git integration, and the `VERCEL_OIDC_TOKEN` written by `vercel link`
remains operationally accurate.
