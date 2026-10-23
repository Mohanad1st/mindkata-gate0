# ADR 0001: Gate 0 baseline

**Status:** accepted  
**Date:** 10 August 2026

## Decision

Use a single Next.js TypeScript application with fixed in-repository synthetic scenarios, prewritten AI outputs, browser-session persistence, and no external service dependency.

## Why

Gate 0 tests proposition clarity, usability, voluntary continuation, and commercial interest. A database, authentication system, live model, analytics platform, or ingestion layer would add privacy and implementation risk without improving the immediate decision.

## Consequences

- The prototype can run locally or in a non-production preview.
- Session receipts are exported manually.
- Facilitator aggregation remains manual.
- Gate 1 infrastructure requires a new approved decision after Gate 0 passes.
