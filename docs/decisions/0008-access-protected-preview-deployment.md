# ADR 0008: An access-protected deployment is permitted; public deployment is not

**Status:** accepted. Amends the hard exclusion in `docs/scope-lock.md` on production deployment.
**Date:** 6 September 2026
**Supersedes:** nothing. **Amends:** `docs/scope-lock.md`, hard exclusions.
**Relates to:** `0005-no-cli-deployment.md`, which remains accurate about what the CLI does by
default and why three attempts on 13 August 2026 each produced a public production deployment.

## Context

The repository became public on 6 September 2026. A hosted URL was wanted so the prototype can be
looked at without a local Node install.

`docs/scope-lock.md` excludes "No public launch, paid acquisition, production deployment, or legal
reliance on the provisional name", and that file's own rule states that changing any hard exclusion
"requires a dated decision record and founder approval". This is that record.

ADR 0005 identified two compliant routes and noted that the protected-deployment route "still
contradicts the 'production deployment' exclusion literally, so it requires a new dated decision
record amending `docs/scope-lock.md`". It does not identify a third route, and nothing since has
changed that.

## Decision

A deployment of this repository is permitted **only** while access protection is enabled on every
deployment in the project, so that opening the URL requires authentication against the owning Vercel
account. A deployment that any unauthenticated visitor can open is still excluded.

Concretely, all of the following hold or the deployment must be removed:

1. Project-level deployment protection is set so that **all deployments**, production and preview
   alike, require Vercel Authentication.
2. Protection is configured **before** the first deployment, not after it. The window between an
   unprotected deploy and a later protection change is itself a public production deployment.
3. **No Git integration.** The project is not connected to the GitHub repository. ADR 0005 records
   that linking the directory created Git integration, after which an ordinary push to a
   pull-request branch auto-created a public production deployment with no deploy command run at
   all. Deployment is therefore made from a copy of the source outside the git working tree.
4. `.vercel/` stays untracked, as `.gitignore` already ensures, so a link cannot be committed.
5. The URL is not published anywhere a participant could reach it, and is not used for recruitment,
   consent, or evidence collection. It is a viewing convenience.

## What this does not authorize

- It does not authorize public launch, paid acquisition, or legal reliance on the provisional name.
  Those exclusions are unchanged.
- It does not authorize running any part of the study against the hosted URL. Gate 0 still cannot
  run without the Execution Starter Kit, approved consent, and recruited participants.
- It does not move the Gate 0 / Gate 1 boundary, and does not authorize any Gate 1 infrastructure.
- Passing CI still does not authorize a scope change.

## Amendment to `docs/scope-lock.md`

The hard exclusion is amended from:

> No public launch, paid acquisition, production deployment, or legal reliance on the provisional
> name.

to:

> No public launch, paid acquisition, publicly reachable deployment, or legal reliance on the
> provisional name. An access-protected deployment, where every deployment in the project requires
> authentication against the owning account, is permitted under `decisions/0008`.

## Why this is the narrow change

The exclusion exists so that an unreleased research instrument under an uncleared provisional name
cannot be found, opened, or mistaken for a launched product. Access protection preserves every part
of that. What it gives up is only the assumption that "deployed" and "public" are the same thing,
which was true of the CLI's default behaviour and is not true of a protected project.

The broader alternative — permitting genuine previews via Git integration with the production branch
disabled — was rejected for now because it re-introduces the exact mechanism that caused the 13
August incident, and because it needs the same dashboard access as protection while giving weaker
guarantees.

## What was actually done, and verified

Executed 6 September 2026, in this order, which matters:

1. `vercel project add mindkata-gate0` — created the project with **no deployment**.
2. Confirmed protection on the empty project **before** deploying:
   `ssoProtection: { enabled: true, deploymentType: "all_except_custom_domains" }`. This is the
   Vercel default for a new project on this team; it was verified rather than assumed, and nothing
   had to be changed.
3. Deployed from a copy of `git archive HEAD` unpacked outside the working tree, with `.git`
   removed, so no Git integration could be created. A `vercel.json` declaring
   `{"framework": "nextjs"}` exists only in that copy, because a project created by
   `vercel project add` has no detected framework and the first build failed looking for a `public/`
   output directory.
4. Verified unauthenticated: the deployment URL returns **302** to `vercel.com/sso-api` and then
   `vercel.com/login`. It does not return 200. `mindkata-gate0.vercel.app` returns **404** — no
   production alias exists.
5. The failed first build was removed.

One operational note: `vercel link` writes a `.env.local` containing a real `VERCEL_OIDC_TOKEN` into
the linked directory. It was deleted before the upload. Anyone repeating this should check for it.

### A correction to ADR 0005

ADR 0005 concluded that "a preview is the only allowed target — and the CLI will not produce one for
this project", based on three attempts that each produced a production deployment. That conclusion
holds for the sequence it tried, but not in general. The deciding factor is whether the project
already exists: a **new** project's first deployment is promoted to production, which is what
happened all three times. Creating the project first with `vercel project add` and deploying into it
produces `Environment: Preview`, as it did here — with no Git integration and no production alias.

This does not change ADR 0005's decision or its warnings, which remain accurate about the default
CLI behaviour and about how the cleanup resists. It corrects one operational claim inside it.

## Consequence

If protection is ever removed from this Vercel project, the deployment falls outside the scope lock
immediately and must be deleted, not merely re-protected. Anyone reviewing this should verify the
current state rather than trusting this record: an unauthenticated request to the deployment URL
must not return `200`.
