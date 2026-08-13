# Gate 0 design system

This documents the design system **already implemented** in `app/globals.css`. It is a description,
not a proposal. Nothing here changes a pixel.

That matters: the Execution Kit's step 1 is to **freeze** the prototype before fieldwork, and Gate 0A
scores Mission 1 against a median completion time of 12 minutes with a STOP floor at 18. A visual or
flow redesign now would invalidate the dry-run timing the freeze exists to establish. Write this
document; do not act on it until Gate 0 closes.

## Design intent

The instrument has to feel calm, finite, and non-clinical. Three constraints drive every choice:

- **It must not feel like a game or a test.** `scope-lock.md` forbids streaks, variable rewards,
  leaderboards, and infinite feed. There is no progress gamification beyond a plain
  `<progress>` element, no score, no celebration state.
- **It must not imply diagnosis.** Warm paper tones and a single serious accent, rather than
  clinical white or dashboard chrome.
- **It must be finite and visible.** Every mission shows "Step N of 6" and a progress bar, and ends
  on an explicit endpoint card.

## Tokens

All colour is defined once on `:root`. There are eight tokens and no others — any new colour should
be justified against this list rather than added ad hoc.

| Token           | Value     | Role                                                                                                      |
| --------------- | --------- | --------------------------------------------------------------------------------------------------------- |
| `--ink`         | `#17211d` | Body text, skip-link background, code block background base                                               |
| `--muted`       | `#53615b` | Secondary text: lede, footer, session code                                                                |
| `--paper`       | `#f6f3eb` | Page background — warm, deliberately not white                                                            |
| `--card`        | `#fffdf8` | Card and notice surface, one step lighter than paper                                                      |
| `--line`        | `#cfd7d1` | Borders and rules                                                                                         |
| `--accent`      | `#146b50` | Primary action, notice rule, AI-output rule, progress                                                     |
| `--accent-dark` | `#0d4b38` | Link text, eyebrow labels, hover state, summary text                                                      |
| `--focus`       | `#b35c00` | Focus ring only — deliberately a different hue from the accent so focus is never confused with "selected" |

`color-scheme: light` is declared explicitly; there is no dark theme, and adding one before Gate 0
closes would be a visual change to a frozen instrument.

## Type

One family: `Inter` with a full system fallback stack. No web font is loaded, so there is no
network dependency and no font-swap reflow — which also protects the timing measurement.

- `h1` — `clamp(2.25rem, 7vw, 4.8rem)`, capped at `760px` measure. Mission pages step this down to
  `clamp(2rem, 5vw, 3.5rem)`.
- `h2` — `clamp(1.5rem, 3vw, 2.2rem)`.
- Headings share `line-height: 1.15` and `letter-spacing: -0.02em`; body is `1.6`.
- `.lede` — `1.2rem`, `--muted`, capped at `720px`.
- `.eyebrow` / `.step-label` — `0.8rem`, weight 800, uppercase, `0.09em` tracking, `--accent-dark`.
  These carry the honesty labels: "ANSWER BEFORE SEEING AI OUTPUT", "FIXED SYNTHETIC OUTPUT · NOT A
  LIVE MODEL CALL", "FINITE ENDPOINT REACHED".
- `.session-code` — monospace, so an anonymous code can be read aloud or transcribed without
  character ambiguity.

## Layout

- `.shell` — `min(100% - 2rem, 880px)`, centred. `.mission-shell` widens to `920px`.
- One column throughout. There is no sidebar, no dashboard grid, and no persistent navigation —
  a participant should have exactly one thing to do.
- `.source-grid` — the only multi-column element: `repeat(auto-fit, minmax(210px, 1fr))`, so the
  scenario's source cards reflow to one column on narrow screens without a media query.

## Components

| Class                | What it is                                                                                                                                                           |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `.card`              | The default container: 1px `--line` border, `1rem` radius, `--card` surface, soft shadow, fluid `clamp(1.25rem, 4vw, 2.25rem)` padding                               |
| `.notice`            | A card with a `0.45rem` left rule in `--accent` — used for the "Before you begin" data boundary                                                                      |
| `.prompt`            | The decision question, on a tinted `#e6f1ec` panel, weight 700                                                                                                       |
| `.source-card`       | Scenario evidence, on `#f7faf8` to sit visually _below_ the prompt                                                                                                   |
| `.ai-output`         | The controlled AI recommendation: left rule in `--accent`, `#edf4f0` panel, `1.08rem`. Visually distinct from participant input so nobody mistakes one for the other |
| `.field`             | Label above control, `1.4rem` rhythm, label weight 750                                                                                                               |
| `.button` / `button` | Filled `--accent`, `0.65rem` radius, `min-height: 2.9rem`                                                                                                            |
| `.secondary`         | Transparent with `--accent-dark` text — used for Back and Delete                                                                                                     |
| `.text-link`         | The "← Exit to start" affordance                                                                                                                                     |
| `.continue-card`     | A top rule separating the optional Mission 2 offer from the receipt above it                                                                                         |

**Disabled buttons** go to `#8d9994` with `cursor: not-allowed`. This is load-bearing: the Continue
button is disabled until a stage's required artifacts are present, so the participant sees the gate
rather than being told about it after the fact.

## Accessibility

These are not decoration; `G0-08` is a scored requirement and an axe scan runs in CI.

- **Skip link** — `.skip-link` is fixed and translated off-screen, returning on `:focus`. Every page
  target is `id="main-content"`.
- **Focus ring** — `3px solid var(--focus)` with `3px` offset, on links, buttons, textareas, selects
  and summaries. Uses `:focus-visible`, so it appears for keyboard use without following the mouse.
- **Semantics** — `<main>`, `<header>`, `<section aria-labelledby=…>`, `<progress>`, real
  `<label for>` on every control. The loading state carries `aria-busy="true"`.
- **Reduced motion** — `@media (prefers-reduced-motion: reduce)` disables transitions and
  `scroll-behavior`, which matters because the flow smooth-scrolls on stage advance.
- **Touch targets** — `min-height: 2.9rem` (≈46px) on all buttons.
- **Contrast** — `--ink` on `--paper` is roughly 13:1; `--accent` with white text roughly 5.5:1.
  Both clear WCAG AA. Verify any new pair before adding it.

## Responsive

One breakpoint, at `560px`: the shell tightens to `min(100% - 1.2rem, 880px)` with reduced top
padding, and action buttons go full width so they remain thumb-reachable. Everything above that is
handled by `clamp()` and `auto-fit`, so there is no tablet-specific layout to maintain.

## Known gap, deliberately not fixed

At desktop widths the "Before you begin" boundary panel sits **below the fold**, under a large hero.
In a facilitated session the participant should read the data boundary before starting. Moving it is
a one-line change, but it alters the first screen of a frozen instrument and touches consent-adjacent
content, so it is recorded here rather than changed. Founder decision.

## If you extend this

Gate 4 is where expansion lives (see ADR 0003), including Arabic and RTL. Two notes for whoever gets
there:

- Nothing in this system uses logical properties yet — `border-left`, `margin-left`, `text-align`
  are all physical. An RTL pass means converting to `border-inline-start` and friends, not adding
  overrides.
- **This repository is intentionally English-only until Gate 4.** Adding an i18n layer now would
  breach the scope lock. ADR 0003 explains why, including why that contradicts the maintainer's
  usual bilingual convention.
