# Project Status

Last reviewed: 2026-09-30

PostCode is currently available as a development CLI for investigating one
configured TypeScript project.

## Implemented capabilities

- **[Interactive investigation](docs/cli-reference.md#commands).**
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
  displayed information. Terminal wrapping preserves combining characters and emoji,
  measures display width, and visibly escapes control characters.
- **[Local observation recording](README.md#observability).**
  Commands record requests, outcomes and presented views, grouped by project and
  UTC date. Only complete batches become visible under final filenames; delivery
  and later cleanup warnings remain distinct.

- **[Interpretation integration](docs/cli-reference.md#interpretation-checkpoint-summary-inspection-and-usage).**
  Summary requests, retained investigram inspection and attempt/session usage are
  integrated with the shell. An optional OpenAI adapter supports explicit hosted
  enablement, API-key billing or persistent Sign in with ChatGPT plan use, and
  macOS Keychain credentials. Billing routes are selected explicitly.

## Current limits

- **Hosted interpretation:** live provider verification and formative assessment
  remain pending resolution of empty terminal output in a live subscription stream. The human-selected
  ChatGPT configuration is GPT-5.6 Sol with medium reasoning. Disabled summaries report configuration
  unavailability; protected hosted credential setup supports macOS only. Public follow-up
  lenses and correction-aware replacement display are not implemented yet.

- **[Analysis scope](docs/cli-reference.md#supported-typescript-population-and-qualifications):**
  TypeScript only, one configured project at a time, with explicit coverage limits.
- **[Session lifetime](docs/cli-reference.md#input-stability-and-retained-work):**
  investigations cannot be saved or resumed. Detected input changes require
  reopening; long sessions can accumulate memory until closed. Active commands
  can be interrupted in both CLI modes. Git acquisition has a per-call deadline;
  unconfirmed cleanup is reported separately, without promising a deadline for
  the whole analysis.
- **[Output exclusions](docs/backlog.md#correct-output-boundaries-across-different-filesystem-case-rules):**
  paths crossing different filesystem case rules, or directories with different
  case rules on one filesystem, have known exclusion defects awaiting correction.
