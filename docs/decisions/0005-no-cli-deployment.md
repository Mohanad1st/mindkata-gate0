# ADR 0005: This repository is not deployed from the Vercel CLI

**Status:** accepted as a constraint. The eventual hosting route remains a founder decision.
**Date:** 13 August 2026

## Decision

Do not deploy this repository with `vercel` from a terminal. There is no Vercel project for it, and
no deployment exists. If hosting is wanted later, use one of the two routes below — both need a
dashboard setting that the CLI cannot reach.

## Why: three attempts, three public production deployments

`docs/scope-lock.md` excludes "public launch … production deployment, or legal reliance on the
provisional name". `docs/decisions/0001-gate0-baseline.md` permits "a non-production preview". A
preview is therefore the only allowed target — and the CLI will not produce one for this project.

What happened on 13 August 2026, each attempt verified with `curl` against the live URL:

1. `vercel --yes` → **production**, aliased to a public `mindkata-gate0.vercel.app` serving the real
   app. A new project's first deployment is promoted to production; omitting `--prod` does not make
   it a preview.
2. CLI upgraded v51.5.0 → v58.11.0, then `vercel deploy --target=preview` → **still production**.
   The flag does not change the target for a project with no Git integration.
3. Linking the directory had created Git integration, so an ordinary push to a **pull-request
   branch** auto-created another public production deployment, with no deploy command run at all.

Cleanup also resists: `vercel git disconnect` **re-created** the project it was meant to detach,
because the working directory was still linked, and `vercel project rm` has no non-interactive
confirmation flag (`--yes` and `-y` are both rejected). The sequence that works is: delete
`.vercel/` locally first, then `vercel remove <project> --yes --scope <team>`.

All deployments and the project were removed. The alias and the deployment URLs return 404, and no
`mindkata-gate0` project remains in the team.

## The two compliant routes, and what each needs

- **Git integration with the production branch disabled.** Branch pushes then create genuine
  previews and `main` never deploys. This is the only route that satisfies the scope lock as
  written. It needs the project's production-branch setting changed in the Vercel dashboard; the
  CLI cannot set it.
- **A protected production deployment.** Vercel Authentication on every deployment, so the URL
  exists but is not public. This still contradicts the "production deployment" exclusion literally,
  so it requires a new dated decision record amending `docs/scope-lock.md`, per that file's own rule.
  Enabling the protection needs the dashboard or the Vercel API.

## Why there is no hurry

A hosted URL has no user yet. Gate 0 cannot run without the Version 2.1.1 Execution Starter Kit,
approved consent, and recruited participants, so hosting is not on the critical path — while every
CLI route available today produces a public production deployment of an unreleased research
instrument under an uncleared provisional name. The sequencing is: obtain the Kit, then consent and
recruitment, then choose a hosting route deliberately.

Local `npm run dev` remains the correct way to exercise the prototype in the meantime, and
`npm run loop` still proves the production build compiles.

## Consequence

`.gitignore` covers `.vercel`, so a future link cannot be committed. Anyone who wants a URL should
read this file first rather than rediscovering the above.
