# Research-observation reconciliation

Draft for review, based on local `main` at `60f11e2ee3d25861148e7cf55117901a02f83f7c`. Planning only: no promotion or implementation is authorized. The branch is `codex/research-observation-reconciliation`; its worktree is `/Users/ronen/postcode/app-worktrees/research-observation-reconciliation`.

## Principal impacts and choices for review

The foundation now makes research recording serve the research question. This package removes the local universal capture mandate and the production-build delivery rule. Ordinary non-research use may produce no research records; automatic capture is appropriate where retrospective reconstruction would be unreliable. Current automatic CLI recording remains permitted and accurately documented.

Architectural evidence, qualifications, captured-basis attribution, exact-answer continuity, operational usage and system-work attribution remain required within their existing scopes. They are distinct from exporting information for research. System-initiated work remains attributable in the investigation and in research records that capture it. Visibility and retained local lineage do not inherently require a research event.

The consequential choices proposed for acceptance are:

1. **Keep explicit feedback useful.** A deliberate inadequacy report continues to submit a self-contained batch with the available displayed artifact and exact output. This does not require automatic records during ordinary use. The alternative of making explicit feedback unavailable when automatic recording is off would change an existing interaction unnecessarily.
2. **Keep the current batch protocol as an available format, not a universal research schema.** Other capture designs may preserve selected content or usable references. No generic configuration framework, schema-selection language or new runtime mode is selected now.
3. **Make exported-basis remediation depend on the assessment.** The confirmed export limitation remains described. Correct it before a study relies on captured-state/basis attribution; do not require complete basis export for every question or confuse missing export with missing internal provenance.
4. **Defer optional cleanup.** A no-automatic-recording path is a worthwhile bounded candidate, but it must separate feedback context from observation-batch construction. Keep the current machinery until separately authorized work chooses and verifies that behavior.

No unresolved choice prevents review of the documentary package. These are proposals for human acceptance, not choices already adopted. The future cleanup control/default and any study-specific record selection remain open for their own scope; they are not prerequisites to this pass. Broader sequencing and `notes/upcoming-work.md` are unchanged.

## Required reconciliation, implementation findings and future work

| Category | Finding and proposed disposition |
| --- | --- |
| Required documentary reconciliation | Replace automatic comprehensive capture, mandatory context-evolution recording and production-build routing in the specification. Conditionalize research clauses in governing definitions/constraints and accepted decisions without weakening architectural guarantees. |
| Required documentary reconciliation | Update the captured-basis and initiation backlog entries and future View-planning language so they do not recreate universal research obligations. Retain explicit feedback, failure visibility, sink lifecycle, output exclusion and source-independent human understanding. |
| Demonstrated implementation conflicts caused by the revision | None found in the inspected paths. The new requirements permit less capture; they do not prohibit current automatic capture or require a recording toggle. This is a focused source assessment, not a certification of every wider application requirement. |
| Existing limitations | Captured-basis export remains incomplete. General navigation-origin lineage remains incomplete and has independent investigation responsibility. Broader initiation assessment remains scoped beyond completed request-model work. These are not reclassified as implemented or silently closed. |
| Optional implementation work | Backlog decoupling of automatic batch construction/submission from feedback snapshots, with preserved operational attribution, output and failure contracts. No implementation plan or runtime work is included. |
| Future research capability | Let an actual study drive narrower payloads, references and automatic capture. No universal schema, event framework, record migration, research UI or retention service is designed here. |

## Foundation diff coverage

The only changes in `60f11e2^..60f11e2` are in system-initiated attribution and research observation support.

| Foundation change | Draft treatment |
| --- | --- |
| System work remains attributable in the investigation and any research records capturing it | New decision’s investigation-attribution, request-reporting and retained-presentation successors; specification and constraints. |
| Support observation without a diary for every action | Question-driven capture and easy optional subjective reports; preserve explicit feedback. |
| Replace comprehensive categories/provenance schema with question-driven selection | Replace the command-capture decision, relax research copies of full attribution and result/context/exposure recording, retain meaningful qualification and provenance in architectural accounts. |
| Automatic recording where retrospective reconstruction is unreliable | Explicit criterion in the decision, specification and constraints; no new blanket automatic event list. |
| Remove mandatory capture of complete surrounding investigation evolution | Preserve local investigation context and lineage responsibilities; select context for research without copying all retained understanding. |
| Deliver resulting records for research use; ordinary non-research use need not record/export | Remove production-versus-development build as the governing distinction. Retain honest submitted-record delivery and generated-output exclusion. |

## Current implementation and simplification assessment

Inspection used the merged implementation at `60f11e2`, including the previous reconciliation. It did not assume that earlier plans were still pending.

| Evidence | Actual behavior, usefulness and maintenance implication |
| --- | --- |
| [`command-execution.ts`](../../src/lib/command-execution.ts), `publishCommand` | Publication builds an observation batch after execution/output, then derives the displayed feedback snapshot and submits the batch. A discard sink still incurs construction. Separating these responsibilities is the bounded cleanup opportunity. Publication checks, actual status, usage and consequential attribution remain operational requirements. |
| [`observations.ts`](../../src/lib/observations.ts) | Version-four records contain request/context, qualified View and exact output, limits, outcomes, usage and work as applicable. Useful for actual-exposure assessment; record construction and serialized duplicate representations can be avoided when unused. No measured cost claim is made. |
| [`feedback.ts`](../../src/lib/feedback.ts), [`shell.ts`](../../src/lib/shell.ts) | `DisplayedResult` is a selection of batch fields. Explicit feedback clones that snapshot, or submits context-free feedback; it does not reconstruct a basis. This coupling makes simply deleting recording unsafe for the existing feedback contract. |
| [`cli.ts`](../../src/lib/cli.ts), `runCli`; `runShell` | Default local sink and destination disclosure; injectable sink for tests/callers. No public no-recording or study-selection control. Descriptive docs must continue saying recording is automatic. |
| [`source-disclosure.ts`](../../src/lib/source-disclosure.ts) | Family-aware actual-exposure classification serves observations. A non-recorded path could skip that classification work if human output construction and boundary verification remain intact. Removing research code must not relax the human output boundary or conflate machine evidence with exposure. |
| [`work-attribution.ts`](../../src/lib/work-attribution.ts), [`session-protocol.ts`](../../src/lib/session-protocol.ts), [`request-reporting.ts`](../../src/lib/request-reporting.ts) | Full operational attribution and request/result semantics travel separately from sink acceptance. Keep these even when a research record selects fewer details or is absent. |
| [`investigation/execute.ts`](../../src/lib/investigation/execute.ts), [`acceptance.ts`](../../src/lib/investigation/acceptance.ts), [`selection-record.ts`](../../src/lib/investigation/selection-record.ts) | Supplied-context delivery, provenance and frozen answer selection support the architectural result and citation/correction semantics. They are not comprehensive research machinery to delete. Internal records do not prove complete exported attribution. |
| Local publication in `observations.ts`; [`observation-publication.test.ts`](../../test/observation-publication.test.ts), [`feedback.test.ts`](../../test/feedback.test.ts) | Small sink with useful no-overwrite acceptance/cleanup handling and tests. Removing the sink would remove useful explicit-feedback/research delivery; there is no demonstrated maintenance case for doing so. Existing tests are starting points for any later optional cleanup, not tests run by this documentary pass. |

Recommendation: retain the sink and current format; backlog a bounded way to skip automatic recording while preserving explicit feedback. Reduce selected payloads only for a concrete question. Do not remove semantic provenance, usage accounting, citation exposure, input validation or output-boundary verification as “recording cleanup.”

## Package and promotion units

- [New decision](decisions/research-question-driven-observation.md): capture policy, preserved architectural obligations, complete supersession and implementation assessment.
- [Application specification](app-specification-revisions.md), [core concepts](core-concepts-revisions.md) and [architectural constraints](architectural-constraints-revisions.md): complete replacement units with canonical links.
- [Backlog](backlog-revisions.md): revised applicability of existing candidates and optional cleanup candidate.
- [Capability reference](capability-reference-revisions.md) and [architecture README](architecture/README-revisions.md): unchanged current recording behavior and separation from policy.
- `decisions/*-revisions.md`: complete lifecycle metadata replacements and current decision index. Preserve all earlier decision bodies, dates, rationale and existing mappings.

The package root mirrors canonical `docs/`. Revision files contain only changed units; existing anchors stay unless explicitly changed. The proposed decision uses acceptance-date/status placeholders until human acceptance. At promotion, reconcile against the latest canonical files and apply the decision plus governing revisions and lifecycle/index updates atomically. Remove this draft package only under promotion/disposal direction.

Fifteen whole decision units are replaced across eleven records: two transient-Session units, initiation, actual request reporting, retained-presentation reporting, two specialization units, three human-representation units, qualified construction, observation/store separation, inherited domain/storage observation coverage, execution-usage recording, and the complete compact-attribution record. Incorporation by reference preserves the unaffected requirements of large predecessor units instead of copying their family/identity contracts. The new decision makes each changed research clause explicit. Both mapping directions are provided. The fully replaced compact-attribution record leaves the accepted index; the other records remain partially superseded.

The earlier automatic-view and invocation-batch decisions were already superseded by the transient-Session decision. Old coordinated-View units were already superseded by specialization. Keep those chains rather than adding competing forward replacements. Explicit feedback, sink selection/lifecycle, local sink acceptance, generated-output boundaries, semantic qualification and Investigator exposure contracts remain accepted. Store separation and operational usage are carried forward explicitly while relaxing their research-copy requirements. Old adoption/conformance paragraphs and concluded plans/tasks preserve their historical claims; their successors and the current backlog state this pass’s disposition.

No changes are proposed to `foundation/`, `dev/`, `notes/`, source, tests, historical review/task records or completed implementation plans. The CLI reference's descriptions of current automatic recording remain accurate and are left alone. This is not a proposed rewrite of the implementation conventions.

## Review and verification

Validate complete replacement-unit application, preservation of unrelated canonical content and historical decision bodies, both directions of every supersession mapping, intended canonical links/anchors and whitespace. A temporary projected application of all 42 replacement/addition units across 19 canonical documents passes the new-link/anchor checks. All 15 supersession mappings are bidirectional, and every earlier decision body and original date is preserved. Draft whitespace checks pass. The unchanged historical request-model decision still links to the retired `establish-conformance-to-the-lens-request-model` backlog anchor; its body is preserved rather than rewritten. Runtime tests are not required for these draft-only documentary changes. No runtime test result or performance improvement is claimed.
