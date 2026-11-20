# Project Status

Last reviewed: 2026-11-20

PostCode is currently available as a development CLI for investigating one
configured TypeScript project.

This page summarizes current capabilities and significant limits. The [capability reference](docs/capability-reference.md) describes individual supported actions; the [CLI reference](docs/cli-reference.md) supplies syntax and detailed behavior.

## Implemented capabilities

- **[Internal application entry](docs/architecture/README.md#application-entry).**
  In-process Node clients can request complete qualified content, follow precise
  subjects, retrieve exact retained answers and receive work/usage reports without
  CLI rendering or observation recording. The CLI uses the same execution engine.
  Account/configuration, observation delivery and feedback are separate services.
  This is an internal entry, without a stable public transport or browser runtime.
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
- **Qualified retained findings.** Mechanical module, dependency and organization
  answers preserve exact contribution support. Fresh answers disclose changed uses
  and their qualified grounds; presenting an earlier answer keeps its captured state.
- **[Supporting evidence](docs/cli-reference.md#source-detail-and-observations).**
  Inspections can expose qualified detail, names and captured implementation
  locations without source excerpts. Inadequacy feedback is available in the shell
  and as a context-free one-shot command. Terminal wrapping preserves combining characters and emoji,
  measures display width, and visibly escapes control characters.
- **[Local observation recording](README.md#observability).**
  Commands record their actual requested question, designation, outcomes and presented
  views, grouped by project and UTC date. Request-scoped work reports distinguish
  prerequisite analysis, reuse and evidence delivery, preserving received facts on interruption.
  Non-View JSON summarizes work detail; Session results and observations retain full reports.
  Usage is reported without a program View. Only complete batches become visible under final filenames; delivery
  and later cleanup warnings remain distinct.

- **[Interpretation integration](docs/cli-reference.md#progressive-investigation-and-usage).**
  Summary, explanation, decomposition and examination requests, retained account
  navigation, associated-account inspection and attempt/session usage are
  integrated with the shell. Fresh selection preserves all standing alternatives and their
  displacement/exposure concerns. Exact answers preserve their independently captured
  content, qualification, provenance and standing; shared immutable support never
  consults current ledger state during presentation.
  An optional OpenAI adapter supports explicit hosted
  enablement, API-key billing or persistent Sign in with ChatGPT plan use, and
  macOS Keychain credentials. Billing routes are selected explicitly.

- **Structured explanation APIs.** The internal application entry supports state-behavior
  investigation, a bounded state diagram and invocation of retained follow-up options.
  These use the same contribution ledger as the existing mechanical and agentic families;
  there are no new CLI commands for them.

The M3 mechanical and caller checkpoints are accepted. The legacy tree/correction
route is retired and the [integrated checkpoint](records/validation/structured-architectural-accounts/m4-integrated-checkpoint.md)
records the completed migration and verification. Final integrated review and human
sufficiency judgment remain pending under the active task. The temporary migration
exceptions have no remaining supported capability to cover.

## Current limits

- **[Request-model integration](docs/plans/lens-request-model.md):** normalized request
  reporting, non-View usage and qualified subject resolution are implemented at the
  request boundary. Unsuccessful lookups return reports with candidates and limits.
  Equivalent names and references share retained answers while preserving lookup
  context in displayed results. The shell can present an exact retained answer with
  new format, supported source disclosure or paging, preserving its frozen selection.
  Views identify fresh or retained selection and disclose reference lifetime. Bounded prerequisite/evidence attribution and
  Presentation compatibility are implemented. Unsupported display choices return
  qualified reports; existing displays retain partial and unavailable answers.
  Fixed catalogs support the internal interpretation and mechanical extension
  examples; public commands remain the supported toolbox. There is no dynamic
  installation, general planner or public Presentation-registration interface.

- **Hosted interpretation:** The following historical assessments concern the earlier
  instruction/representation revisions, not validation of the common dialog. M2
  [recorded trials](records/validation/structured-architectural-accounts/m2-trials/README.md)
  and focused M4 trials of [context authoring and invocation](records/validation/structured-architectural-accounts/m4-option-context-authoring.md)
  and [deduplicated input delivery](records/validation/structured-architectural-accounts/m4-dialog14-live-regression.md)
  provide live evidence for bounded common-dialog scenarios, not general reliability. [Formative assessments](records/validation/module-investigation/pass-01/report.md)
  show useful source-qualified summaries alongside omitted qualifications. A
  [subsequent reassessment](records/validation/module-investigation/pass-03/report.md)
  produced accepted summaries and an attributed documentation/source discrepancy
  after contract clarification and private reference compaction. Semantic omissions
  and limited assessment coverage remain; earlier rejected results are preserved. The human-selected ChatGPT configuration is
  GPT-5.6 Sol with medium reasoning. Disabled summaries report configuration
  unavailability; protected hosted credential setup supports macOS only. Reconsideration warnings identify actual exposure causes; they do not establish that an account is wrong or automatically reassess it.
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
