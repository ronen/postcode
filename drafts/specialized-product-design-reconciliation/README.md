# Specialized product-design reconciliation

Status: in review
Prepared: 2026-11-05
Baseline: `03f4dd23ab6f8df90df54fe9c7f2c5243c461abc` (`main` and freshly fetched `origin/main` at preparation)
Foundation comparison: `03f4dd2^` (`b9599a3`) → `03f4dd2`, for `foundation/product-design.md`

## Principal impacts and open questions

PostCode's product role is architectural investigation and retained understanding within potentially external design conversations. Useful direct human investigation and comparative expertise remain aspirations to evaluate; specialization is independent of demonstrating advantage. The governing model must admit architectural subjects and bases beyond implemented program states, while accurately retaining the current implemented-only subset.

| Impact | Required reconciliation | Current implementation consequence |
| --- | --- | --- |
| Specialized product role | State the role, external conversations and unresolved research aspirations in the specification and a decision. | No demonstrated runtime conflict; no conversation host or GUI required. |
| Implemented, hypothetical and intended architecture | Distinguish modality from provenance and epistemological status; broaden Entity and Investigram definitions and conditional comparison rules. | Keep current module-oriented types and methods. Backlog hypothetical/intended capabilities. |
| Broader captured bases | Generalize Projection and request meaning beyond program states; retain program-state and retained-selection distinctions. | No generalized capture, schema fields or migration. Existing prior-interpretation follow-up remains a narrower mechanism. |
| Retained understanding and continuity | Retain the local investigation-context term for Views, bases and lineage; distinguish it from retained accounts, execution context and observation capture. | Preserve current feedback and context delivery; do not rename code or withdraw lineage obligations. |
| Broader agent participation | Include design and implementation roles, agent-led and mixed investigation and participant-supplied material. | CLI invocation is available within existing contracts; general exchange and contribution remain future capabilities. |

The human confirmed during preparation: **keep the local “investigation context” term and clarify its responsibility**. No consequential runtime scope expansion is proposed. The remaining acceptance choice is the coordinated semantic broadening and its explicit implemented-only staging, represented by the draft decision. Nothing in this package is accepted merely by being committed.

Questions deliberately left to subsequent capability design are how to represent and investigate hypothetical/intended material, how useful retained accounts are organized and selected, what reference and retention lifetimes an exchange needs, and which direct-human journeys merit a GUI. Comparative-advantage evaluation and broader sequencing remain strategy work. This package does not answer those questions by introducing infrastructure.

## Reviewable package

Read the [proposed decision](decisions/specialized-architectural-investigation.md) with the coordinated revisions:

- [Application specification](app-specification-revisions.md): product role, conceptual modalities/bases, continuity, comparison, external participants and observation responsibility.
- [Core concepts](core-concepts-revisions.md): complete changed definition units, including successor provenance and preserved anchors.
- [Architectural constraints](architectural-constraints-revisions.md): conditional architectural guarantees and broader basis attribution; existing binding and feedback guarantees remain.
- [Backlog](backlog-revisions.md): future hypothetical/intended capabilities and a broadened existing external-exchange candidate, without prioritization.
- [Capability reference](capability-reference-revisions.md) and [implemented architecture](architecture/README-revisions.md): accurate subset disclosures, without claiming new support.
- Decision lifecycle revisions for [initial concepts](decisions/initial-core-concepts-decisions-revisions.md), [coordinated Views](decisions/coordinated-views-and-qualified-results-revisions.md), [structured interpretation](decisions/structured-investigram-content-revisions.md), and the [decision index](decisions/README-revisions.md).

The package root corresponds to canonical `docs/`. Links inside promotion-ready content target intended canonical filenames; draft filenames are not those links' destinations. This README is a review guide and is not proposed canonical documentation. New decision metadata uses a draft status and an acceptance-date placeholder; those change only on human-directed promotion.

## Required documentary reconciliation

The foundation comparison was reviewed against the current specification, concepts, constraints and relevant accepted decisions, rather than treating the preceding reconciliation as unimplemented work. That [completed plan](../../docs/plans/product-design-reconciliation.md) and [closed task](../../records/tasks/2026-11-03-product-design-reconciliation.md) remain historical records. Its source-independent human-output boundary, qualified additional detail, inadequacy feedback and structured-content permission are preserved.

Four headed decisions require successors because they establish general definitions that are now too narrow:

| Earlier record and headed decision | Successor in the new decision |
| --- | --- |
| Initial core concepts — Define entities, subjects, claims, and relationships by their meaning | Architectural subjects |
| Coordinated Views — Generalize Lens results and View composition | Results over captured bases |
| Coordinated Views — Define request inputs and captured states | Inputs and captured bases |
| Structured investigram content — Permit structured interpretation without selecting an account model | Architectural interpretation |

The proposal uses the repository's existing incorporation-by-reference approach for unchanged requirements, with explicit replacements and additions. It does not rewrite the earlier rationale. Each earlier record has a complete forward mapping; the new decision has matching backward mappings. Existing supersession chains stay intact, including the structured-interpretation successors to earlier investigation contracts. No record becomes wholly superseded because other headed decisions remain accepted.

The Workspace/lineage decision and accumulated-understanding requirement remain binding. The new decision locally clarifies their responsibilities and extends access to agents; it does not cancel their guarantees. Earlier “program state” clauses remain appropriate for their implemented-state scope, while the new general definitions and constraints govern broader bases. Concrete TypeScript, module, Investigator-access, projection identity, retained-selection and Session decisions retain their scoped authority. New modality support must assess its actual effective inputs and identity needs when designed; generalization here selects no runtime formula.

## Implementation impact assessment

**No demonstrated implementation conflict caused by this foundation revision was found in the focused inspection.** That is a bounded source-based assessment, not a claim of complete conformance with every intended requirement or a fresh runtime certification. No implementation plan is necessary for this documentary package under the [planning workflow](../../dev/planning.md); no implementation task record was opened.

| Evidence at the baseline | What it establishes for this proposal | Limit |
| --- | --- | --- |
| [Session coordination](../../src/lib/session.ts), [current architecture subset](../../docs/architecture/README.md#implemented-subset-of-the-product-model), [capability reference](../../docs/capability-reference.md) | Current support centers on one configured TypeScript project and transient unchanged-input Sessions. Narrow types are legitimate subset choices. | Does not implement new modalities, multi-state investigation or persistence. |
| [Investigation contracts](../../src/lib/investigation/contracts.ts), [operations](../../src/lib/investigation/operations.ts) | Prose Investigrams retain originating-module and interpretation provenance; current operation subjects are module or investigram. | “Submitted”/“accepted” investigation results are validated retained outputs, not design acceptance. No need to generalize those contracts preemptively. |
| [Investigation context](../../src/lib/investigation/context.ts) | Prior interpretations are delivered with qualification, correction context, bounded omissions and exposure accounting; the code explicitly disclaims independent corroboration and comprehension. | This is Investigator execution input and bookkeeping, not the complete retained-understanding model or a general Projection-input interface. |
| [Retained presentation](../../src/lib/retained-presentation.ts), [coverage inspected](../../test/retained-presentation.test.ts) | Fixed retained-content resolution is separated from selection, Evaluation and new acquisition. | Existing supported lifecycle and content families still limit availability. Tests were read, not rerun. |
| [Feedback publication](../../src/lib/feedback.ts), [feedback coverage inspected](../../test/feedback.test.ts) | Feedback snapshots already displayed artifacts, explicitly reports missing basis/history, and performs no reconstruction or investigation. | Event context is deliberately incomplete; it is not full architectural understanding. Tests were read, not rerun. |
| [Output-boundary policy](../../src/lib/output-boundary.ts), [existing output-boundary backlog](../../docs/backlog.md#correct-output-boundaries-across-different-filesystem-case-rules) | Reuse as identified PostCode artifacts need not weaken exclusion from independent repository evidence. | Known filesystem case-rule defects are pre-existing, not newly discovered or remediated here. |

Existing captured-basis observation and navigation-origin gaps, and the remaining initiation-attribution assessment, retain their disclosed scope and prior disposition. They are not evidence that adding modalities is required now. The revised observation emphasis does not demand complete duplication of retained understanding and does not justify deleting existing useful events.

If review demonstrates an actual new conflict, add a concrete reproduction or trace, its smallest coherent runtime correction and focused behavioral verification to a bounded proposed implementation plan. Do not merely add the violation to the future-capability backlog. Bring any consequential new scope or changed guarantee back to the human. No such fix has been identified in this pass.

## Investigation-context and link audit

| Use | Meaning and treatment |
| --- | --- |
| Specification Workspaces/navigation; core Investigation context and Workspace; lineage backlog and capability disclosure | Local Views, bases and lineage. Retain the term and obligations; remove the false claim that it is the foundation's current definition of continuity. |
| Feedback specification/constraints, `feedback.ts`, feedback tests | Available surrounding activity needed to interpret a report. Keep it; do not expand it into reconstruction or complete account capture. |
| Research observation “investigation-context evolution” | Relevant activity/event changes. Keep this local obligation and clarify that observations need not duplicate retained understanding. |
| Hosted credential exclusion; Investigator execution/context delivery; architecture Responsibilities and flow | Material supplied to an execution and security-sensitive context. Keep wording and code names; it is a different responsibility. |
| Retry and broader UX backlog entries | Lost Session state or navigation context. Retain; neither use defines all accumulated architectural knowledge. |
| Accepted decisions and completed plans/tasks/reviews | Historical meaning and continuing authority are assessed, not mechanically edited. Only specified lifecycle metadata is revised; add clarification through the new decision. |

A repository Markdown search found one exact reference to the removed `investigation-context-and-continuity` anchor: [notes/upcoming-work.md](../../notes/upcoming-work.md), in its retained-understanding discussion. Its appropriate replacement is `[product design: retained architectural understanding and continuity](../foundation/product-design.md#retained-architectural-understanding-and-continuity)` **when the strategy discussion edits that note**. This package does not modify or propose a revision file for the note, as explicitly directed. No mutable canonical `docs/` link uses the removed anchor. New retained-understanding links in this package target `retained-architectural-understanding-and-continuity`. Historical numeric/renamed-section links are left as recorded; supersession and the new decision clarify continuing authority where relevant.

## Review and promotion

1. Review the proposed decision and governing revisions together. Confirm the implemented-only staging and conditional guarantees; detailed future capability design remains outside this acceptance.
2. On explicit human direction, promote as one coordinated documentation change. Set decision status/date, merge revision units into the then-current documents, and preserve anchors and intervening work. No formal implementation plan is selected because no runtime conflict was demonstrated.
3. Apply all four bidirectional headed-decision mappings, retain earlier mappings, and update the accepted-decision index. Preserve historical bodies and the completed previous reconciliation plan/task.
4. Promote the capability disclosures and backlog revisions with the governing text. Check intended canonical links and anchors, including references to superseded headings, without rewriting historical rationale. Keep `foundation/`, `dev/`, `notes/` and runtime files unchanged.
5. After ensuring all necessary rationale survives in the new decision and canonical documents, remove this draft package as part of the atomic promotion. Any notes cleanup, strategy sequencing or repair of the identified note link is separate human-directed work.

## Verification

The draft pass uses document and source inspection. Validation checked 164 relative links against intended canonical destinations and guide paths, simulated all proposed specification/core-concept section replacements in memory, confirmed preservation of their existing anchors, verified all four bidirectional supersession mappings, and checked preservation of the earlier decision metadata. Git whitespace and scope checks cover the draft package. Runtime tests and hosted inference are not needed for this unchanged implementation and were not run. This is a self-review, not an independent implementation review or acceptance gate.
