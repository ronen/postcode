# Proposed revisions to docs/decisions/transient-analysis-sessions.md

Replace the title and lifecycle metadata block before the first body anchor or section with the following. Preserve every body section, original date, rationale and historical mapping.

# Transient analysis sessions

Status: partially superseded
Decided: 2026-09-23
Arising from: [Transient interactive session shell](../plans/transient-session-shell.md)
Scope: session context, reference binding, accumulated analysis, and CLI/observation lifecycle
Supersedes:

- [Initial core concepts — Include only the analysis and identity context needed by the definitions](initial-core-concepts-decisions.md#include-only-the-analysis-and-identity-context-needed-by-the-definitions)
- [Initial core concepts — Preserve the lens, projection, presentation, and view distinction](initial-core-concepts-decisions.md#preserve-the-lens-projection-presentation-and-view-distinction)
- [Projection architecture — Use a record-oriented program-information model](initial-projection-architecture-decisions.md#use-a-record-oriented-program-information-model)
- [Projection architecture — Isolate storage behind ProgramRecordStore](initial-projection-architecture-decisions.md#isolate-storage-behind-programrecordstore)
- [Projection architecture — Use deterministic logical identity independently of persistence](initial-projection-architecture-decisions.md#use-deterministic-logical-identity-independently-of-persistence)
- [Module inventory — Represent modules as qualified domain entities](initial-module-inventory-decisions.md#represent-modules-as-qualified-domain-entities)
- [Module inventory — Make references repeatable but snapshot-scoped](initial-module-inventory-decisions.md#make-references-repeatable-but-snapshot-scoped)
- [Identity constraints — Make analysis identity independent of invocation identity](adopt-identity-evidence-and-observation-constraints.md#make-analysis-identity-independent-of-invocation-identity)
- [Repository organization — Represent groups and placement with qualified identities and relationships](repository-organization-decisions.md#represent-groups-and-placement-with-qualified-identities-and-relationships)
- [Repository organization — Extend snapshot identity only with claim-relevant organization inputs](repository-organization-decisions.md#extend-snapshot-identity-only-with-claim-relevant-organization-inputs)
- [Module dependencies — Preserve external, diagnostic, evaluation, and observation boundaries](module-dependency-structure-decisions.md#preserve-external-diagnostic-evaluation-and-observation-boundaries)
- [Observation recording — Submit self-contained, invocation-scoped observation batches](initial-observation-recording-decisions.md#submit-self-contained-invocation-scoped-observation-batches)
- [Projection architecture — Make projection and evaluation state first-class records](initial-projection-architecture-decisions.md#make-projection-and-evaluation-state-first-class-records)
- [Module inventory — Preserve Claim context and evaluation outcomes distinctly](initial-module-inventory-decisions.md#preserve-claim-context-and-evaluation-outcomes-distinctly)
- [Observation recording — Record normal view production automatically](initial-observation-recording-decisions.md#record-normal-view-production-automatically)
- [Repository organization — Keep organization schemes explicit and separate](repository-organization-decisions.md#keep-organization-schemes-explicit-and-separate)

Superseded in part:

- [Retained domain and storage boundaries](#retained-domain-and-storage-boundaries) is replaced in full by [Generalize Lens results and View composition](coordinated-views-and-qualified-results.md#generalize-lens-results-and-view-composition), [Preserve immutable results under bindings and refresh](coordinated-views-and-qualified-results.md#preserve-immutable-results-under-bindings-and-refresh), and [Retain unaffected domain and storage commitments](coordinated-views-and-qualified-results.md#retain-unaffected-domain-and-storage-commitments).
- [Command-scoped observations with session correlation](#command-scoped-observations-with-session-correlation) is replaced in full by [research capture](research-question-driven-observation.md#research-capture).
- [Stable inputs as the session precondition](#stable-inputs-as-the-session-precondition) is replaced in full by [validity and recording](research-question-driven-observation.md#validity-and-recording).
