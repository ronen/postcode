# Project Status

Last reviewed: 2026-09-23

## Implemented capabilities

- **[Interactive investigation](docs/cli-reference.md#commands) — latest addition.**
  A session shell supports successive questions, stable references to previously
  displayed subjects, and reuse of accumulated analysis.
- **[Module inventory and inspection](docs/cli-reference.md#inventory-and-inspection).**
  Modules, exports, forwarding relationships and associated documentation can be
  listed and examined.
- **[Repository organization](docs/cli-reference.md#organization-and-group-inspection).**
  Project and repository views expose groups, their relationships and module
  membership, with group inspection and navigation.
- **[Dependency investigation](docs/cli-reference.md#dependency-investigation).**
  Dependency structure, cycles, direct dependencies and dependents are available,
  with unresolved requests and analysis limits distinguished.
- **[Supporting evidence](docs/cli-reference.md#source-detail-and-observations).**
  Inspections can expose source locations and bounded excerpts supporting the
  displayed information.
- **[Local observation recording](README.md#observability).**
  Commands record requests, outcomes and presented views for later examination.

## Current limits

- **[Analysis scope](docs/cli-reference.md#supported-typescript-population-and-qualifications):**
  TypeScript only, one configured project at a time, with explicit coverage limits.
- **[Session lifetime](docs/cli-reference.md#input-stability-and-retained-work):**
  investigations cannot be saved or resumed. Detected input changes require
  reopening; long sessions can accumulate memory until closed.
