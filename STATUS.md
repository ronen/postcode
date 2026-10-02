# Project Status

Last reviewed: 2026-10-02

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

- **[Interpretation integration](docs/cli-reference.md#progressive-investigation-and-usage).**
  Summary, explanation, decomposition and examination requests, retained account
  navigation, associated-account inspection and attempt/session usage are
  integrated with the shell. Redisplay selects current replacement accounts while
  exact inspection preserves originals, composition and provenance. Revision views
  expose unresolved alternatives and citation-based reconsideration warnings.
  An optional OpenAI adapter supports explicit hosted
  enablement, API-key billing or persistent Sign in with ChatGPT plan use, and
  macOS Keychain credentials. Billing routes are selected explicitly.

## Current limits

- **Hosted interpretation:** [formative assessments](records/validation/module-investigation/pass-01/report.md)
  show useful source-qualified summaries alongside omitted qualifications. A
  [subsequent reassessment](records/validation/module-investigation/pass-03/report.md)
  produced accepted summaries and an attributed documentation/source discrepancy
  after contract clarification and private reference compaction. Semantic omissions
  and limited assessment coverage remain; earlier rejected results are preserved. The human-selected ChatGPT configuration is
  GPT-5.6 Sol with medium reasoning. Disabled summaries report configuration
  unavailability; protected hosted credential setup supports macOS only. Reconsideration warnings identify affected citation paths; they do not establish that an account is wrong or automatically reassess it.
  [Progressive assessments](records/validation/module-investigation/pass-04/report.md)
  show useful clarification, narrower follow-up targets and explicit corrections,
  with dense presentation and gaps in independently assessed evidence.
  [Integrated assessments](records/validation/module-investigation/pass-05/report.md)
  exercise replacement selection and reconsideration, with successful controlled
  corrections alongside incomplete live paths and a rejected submission. A
  [focused dependent-account sequence](records/validation/module-investigation/pass-06/report.md)
  adds source-supported corrections of controlled direct and transitive errors;
  deliberate examination and scripted origin limit what it establishes.

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
