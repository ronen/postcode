# M3 remaining mechanical-family checkpoint

Date: 2026-11-18
Task: [Implement structured architectural accounts](../../tasks/2026-11-15-structured-architectural-accounts.md)
Plan: [Complete producer and caller migration](../../../docs/plans/structured-architectural-accounts.md#3-complete-producer-and-caller-migration)
Precondition: [M2 accepted disposition](../../reviews/structured-architectural-accounts/2026-11-18-m2-vertical-disposition.md)
Implementation target: `6d30d89e35971b04d759ff99f9f2a25f2111dab1`

## Scope and migration status

This is the mechanical-family checkpoint within M3, not completion of M3 or final integration. The existing branch and task remain active. No live inference was authorized or used.

| Family | Result at this checkpoint |
| --- | --- |
| Module identification and aggregate exports | Accepted M2 mechanism retained; mechanical answers now also capture the remaining native findings. |
| Symbols and individual exports | Scoped symbol Entities with identifying findings; export variants and routes retain exact provider statements and explicit participants. |
| Documentation and composition | Associations, recorded assertions and composition retained with their provider qualifications. Documentation text remains an assertion. |
| Dependencies | Relationships, occurrences and recognition coverage retained; unresolved/opaque distinctions and partial populations remain provider-defined. A relationship does not become an Entity. |
| Repository organization | Group Entities, anonymous roots, containment, placement and properties retained. Existing schemes, incomplete populations and placement ambiguity remain qualified. |
| Dependency organization | Derived classifications retain provider statements and exact fixed inputs. |
| Mechanical answers | Module, organization, dependency and internal exports Projections capture common findings, uses and qualified support. Fresh selection shows displacement and reconsideration; exact answers keep the captured snapshot. CLI presentations disclose concerns without exporting source bodies. |
| Agentic/caller cut-over | Still due in M3: legacy summarize/explain/decompose/examine, tree and correction replacement, mixed associated-content inspection, general common/historical subject resolution, hosted native-reference transport and exact common-content caller access. Existing tests passing does not establish conformance for these transitional paths. |
| Final integration | M4 remains required, including removal of temporary conformance notices after full migration. |

## Implementation choices

The native content contract validates the complete submitted provider record against the same Session's retained record. Findings keep their own Claim-context method and qualification, including composite inherited qualification. Deterministic organizing uses have separately attributed productions. Non-Entity subjects remain exact addressable items through their owners; no filler Entity or identification is introduced.

Native keys use provider identity. Placement, properties and dependency organization additionally normalize attempt-specific evaluation references using the actual statement, qualification and relevant module population. A different requirement set can therefore reuse an equivalent finding without renewing its withdrawn use. The original provider record remains exact in the established contribution.

Independent compiler/source discovery records no retained-input delivery. Layout uses captured repository evidence. Placement/properties consume exact module findings; dependency organization consumes exact relationship, occurrence and organization findings. These are fixed item deliveries, not acquired evolving inventories or delivery through organizing uses. Assembly and identity mapping create no exposure. A later withdrawal of a separate organizing use does not make a bare immutable item input dependent on that use.

Fixed support identity uses immutable owner/item/declaration addresses plus captured derived status. Resolved evidence remains in the payload. Operational analysis-input exclusions do not independently change answer identity: direct/client and measurement-output-directory tests exercise this distinction.

Provider analysis methods are unchanged. Record/projection and presentation method versions advance for the added snapshots and output concerns. Descriptive architecture, capability migration notice and status describe the intermediate state.

## Verification

Verification is by the implementing agent, not independent review:

- `npm run check` and `npm run build` passed.
- The complete offline suite passed **769/769**, with no skips, using Node 22.13.1 and test concurrency 2. Native credential-lock and local callback tests ran outside the sandbox.
- Focused native/inspection/organization/presentation checks passed **41/41** before the final full run.
- After adding the duplicate-provider-key rejection case, the mechanism, exposure and native suites passed **44/44**; the build passed again. Product code was unchanged from the full-suite run.
- `git diff --check` passed.
- The [accumulating-Session measurement](m3-mechanical-measurement.md) compares the fixed 741-module journey against the pre-M3 build and exercises 40 scripted dialogs. No live inference was performed.

New real-compiler fixture coverage in `test/contribution-native.test.ts` exercises all remaining native families, exact provider content and recorded-assertion qualification, symbol/group identity, rejection of fabricated provider content, fixed input exposure versus independent compiler work, displaced-use selection, unchanged exact snapshots, historical group names and equivalent recomputation under a different requirement set.

Existing synthetic selection/organization fixtures now explicitly contribute their provider findings at the same boundary as real evaluators. M2 count assertions account for newly present symbols and findings while preserving no-duplicate and no-delivery controls. Comparison normalization adds only declared reference positions, preserving literal source text. Presentation-version expectations reflect the changed contract.

Exploratory runs were not final verification results. The first ran while the build changed and identified fixture-boundary omissions, reference normalization and operational input identity issues. A later Node 26 run passed 766/769: two failures were the installed `fs-ext` binary's Node ABI mismatch (127 versus 147); the third was a Session invalidation while checkpoint documentation was being edited. The final full run used Node 22 with the checkout unchanged and passed all 769 tests. No authentication implementation or dependency was changed. An additional duplicate-provider-key case in the existing atomic-rejection test was checked after that run, together with the contribution mechanism/exposure/native suites.

Measurement found repeated per-investigram evidence-set construction and linear scans of the acceptance pool. Batch-local maps/sets replace those repeated operations without changing validation, atomicity or producer separation. On the representative fixture, all-expansion evaluation fell from 225.4 seconds before that correction to 7.6 seconds. The 132.6-million-character serialized ledger and higher answer-snapshot memory remain explicit review concerns, not an assertion of performance parity.

## Review gate

The approved plan requires separate remaining-mechanical and agentic/caller checkpoints. Submit this result for human-arranged independent mechanical review before continuing the remaining migration. No legacy failure is being waived, no family is moved to another plan, and this checkpoint does not satisfy M4's integrated review or authorize task closure.

## Round 1 corrections — 2026-11-18

The [round 1 findings](../../reviews/structured-architectural-accounts/2026-11-18-m3-mechanical-round-1-findings.md), preserved in `473602e`, reviewed the original target above. All four actionable findings are accepted. Correction target: `8e06c5c74ba6679dd7e030dbb28162503b6235aa`. The original handoff remains the assignment for focused rereview.

| Finding | Correction and regression evidence |
| --- | --- |
| F1: Unrelated dependency-organization selection | Children/parents capture only classifications whose subjects are selected relationships. A real fixture supplies nonempty children and parents selections; a controlled inconsistency between two unrelated classifications leaves both answer IDs and human concerns unchanged, while the whole-project answer still discloses it. |
| F2: Overstated derived input exposure | The provider records the exact relationships, their resolved occurrences, and the placement, containment, group and artifact-placement findings it reads. Group properties, group documentation and non-edge requests are excluded. Input mapping no longer recursively delivers other findings referenced by those records. The test compares the complete delivered-item set against the expected inputs, with documentation, properties and an unresolved request present as negative controls. This implements the reviewer's narrower-input correction under the existing actual-exposure contract; it does not adopt a broader meaning of supplied input. |
| F3: Missing input contribution silently dropped | Every declared native input must resolve to an established common item. A missing item throws before any production opens or accepts content. A mixed known/missing-input test checks unchanged ledger position, production count and retained investigrams. The synthetic partial/ambiguous dependency-placement fixture now contributes its constructed inputs through the normal boundary before invoking the deriving provider. |
| F4: Duplicate warning display | Exports retain the specific naming/export-listing disclosure and omit those exact uses, changes and already-disclosed producing concerns from the additional generic text. Independent native concerns remain visible. Embedded module detail leaves native warning text to the enclosing organization view. Both structured captures remain complete. Tests require each withdrawal's grounds once, retain structured details, and confirm an independent individual-export withdrawal is still shown. |

Responsible dependency-organization, dependency-Projection and Presentation method versions advance. Descriptive architecture documents the narrowed selection, exact input mapping and fail-closed boundary. No governing material, task scope or agentic/caller checkpoint was changed.

Verification by the implementing agent:

- Before correction, the new regression assertions reproduced five failing tests covering F1–F3 and both F4 presentation paths.
- `npm run check`, `npm run build` and `git diff --check` passed.
- Targeted contribution/native/dependency/organization/presentation checks: **49/49 passed**. An earlier targeted run exposed the synthetic input fixture addressed under F3; its original semantic assertions remain intact.
- Complete offline suite on Node 22.13.1, concurrency 2: **773/773 passed**, no failures or skips. The checkout was held unchanged throughout. Local callback and native credential-lock tests ran outside the sandbox.
- No live inference was used. The large-repository measurement was not repeated for these corrections; its earlier exact target and representation-cost limitations remain explicit. No performance improvement beyond the verified narrowing of selected findings is claimed.

The review's non-defect snapshot-size observation remains a limitation; these corrections do not redesign immutable answer support. Other non-defect observations do not require a scope change. Focused independent rereview of F1–F4 remains pending, followed by the human's mechanical-gate judgment. The task is active; agentic/caller migration and final integrated review remain outstanding.
