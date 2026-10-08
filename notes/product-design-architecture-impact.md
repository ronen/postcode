# Adopted architecture reconciliation: impact and later Lens preparation

Updated: 2026-10-08
Foundation baseline: `337451bd37f91004a14d56149c52b4491bef783a`
Adopted: 2026-10-08
Decision: [Coordinate Views while preserving qualified results](../docs/decisions/coordinated-views-and-qualified-results.md)

This note describes the final adopted architecture reconciliation and its implementation impact. It is non-governing, non-permanent supporting material, not an implementation plan or runtime-conformance certification. Canonical documents do not depend on it. Evidence comes from the revised product design, governing documents, the preserved [representation audit](../records/audits/2026-10-06-user-model-concept-representations/REPORT.md), and targeted inspection of request dispatch, observation construction and dependency subject selection. Promotion changed documentation only; it did not change runtime behavior or perform a new runtime conformance audit.

## Adopted conceptual changes

| Change | Adopted meaning or requirement |
| --- | --- |
| One Presentation/View may coordinate several Projections | Removes universal single-input wording; preserves every input's independent identity, state basis, qualification and population. A coordinated View is distinguished by shared presentation/interaction relationships, not a shared container. |
| One Lens may use several analyses or qualified contributions | Removes a special composite-Lens category and any one-to-one execution assumption. It does not impose component records or a Lens registry. |
| One Projection may concern several states | Requires attributable captured state bases and meaningful order/roles. It does not establish cross-state correspondence, atomic capture or a universal schema. |
| Input bindings and immutable answers | Following resolves changing inputs again; pinned reuses the same captured state. Requests and their captured results remain distinct. The existing application commitment to immutable results remains compatible with the updated foundation. |
| Subject and changes | Keeps Subject open-ended. Investigating a module across captured states differs from investigating an identified qualified change; states and evidence remain explicit. No change entity or implementation is introduced. |
| Stable presentation | Paging and reformatting preserve the selected answer. Refresh must be apparent and consequential answer/selection/qualification changes disclosed. Retained interpretation selections are distinct from captured program states; no interpretation-history binding policy is introduced. |
| Selection inspectability | Exposes actual choices, criteria used at the time and consequential omissions; later defaults cannot reconstruct the explanation. No general planner or separate plan artifact is required. |
| Observation recording | Requires recording presented Projections, composition and captured-state associations, with composition and basis changes visible and recorded. This is independent of workspace persistence. |
| Counts and aggregates | Retains the accepted full-supplied-population permission, including “87 dependencies; showing 20”. New program claims require analysis. Exact arithmetic does not erase partiality or establish coverage; the presentational examples are not an exhaustive whitelist of UI computation. |
| Optional summary entry | A summary View may be suggested for an unspecified need, using coordination, synthesis or both. There is no required summary-first default and no requirement for a summary Lens. |

The adopted architecture conforms to the existing foundation without amending it. Summary suggestions remain optional; supplied-population counts, captured states, following/pinned input policies and captured-result versus repeatable-request references retain the meanings established by the product design.

## Implementation limitations permitted at adoption

The CLI remains a transient single-project, single-state implementation with family-specific, single-top-level-Projection View descriptors. Existing embedded module bases and associated-inspection records remain legitimate; they are not evidence of arbitrary multi-Projection View support. The eager evaluation/construction strategy, interface-independent qualified content, immutable records and existing identity formulas remain supported.

There is no general multi-state analysis, multi-Projection GUI, live refresh, persisted workspace, or planner commitment. Detected input changes still invalidate the session. The no-argument `modules` default is compatible with optional summary suggestions. Module-only interpretation is a limited capability, not a definition of every summary View or a failure to implement a mandatory entry default. The [implemented architecture](../docs/architecture/README.md#implemented-subset-of-the-product-model) and [CLI reference](../docs/cli-reference.md#product-model-and-current-cli-scope) explain these limits. `STATUS.md` is unchanged because adoption introduces no runtime capability.

GUI plans must identify missing core capabilities needed for qualified results, without requiring all of them to be built first. Coordinating several existing Projections from one Session does not inherently require multi-state support. Additional captures do require a deliberate identity, namespace, reuse and session-scope policy: separate Sessions per capture and an extended multi-capture Session remain different possibilities. Reusing a key is not evidence of semantic correspondence, and required attribution does not prescribe new state fields or keys in every family.

No current source layout, type, schema, method version or migration is selected. The qualified-construction decision's current family-specific compatibility obligations remain accepted. Later changes to those obligations need their own accepted decision and precise supersession treatment.

## Known conformance and correctness issues

| Evidence | Current implication | Adopted treatment |
| --- | --- | --- |
| Audit F1; `src/lib/observations.ts` retains a fallback navigation description | Follow-up and some unsupported requests are described as inventory. This misstates current requests. | Existing correction candidate remains open. It need not wait for Lens redesign, a GUI or multi-state support. |
| Audit F2; dependency selection still calls module inspection | Bound unsupported group references can be reported as unknown. Applicability and reference existence are conflated. | Existing correction candidate remains open; later scope must settle accurate refusal vocabulary. |
| Audit F3 | Subject designation is reported as Lens parameters. No true parameters currently change the answer, but the descriptor is semantically misleading. | Keep the descriptor/compatibility candidate; do not claim conformance merely because future parameters are absent. |
| Audit F4; dependency construction consumes inspection selection data | Selection is coupled to inspection and its module-only population without consuming the qualified inspection answer as an attributed contribution. | Reassess/extract selection in later work; preserve genuine qualified component use without prescribing a universal direct component pointer. |
| Audit F6 | Paging/reformatting can select newer interpretations or correction/association snapshots. Immutable old results and changed JSON IDs do not provide human-facing continuity or sufficient refresh disclosure. | Settled current continuity/disclosure limitation; remediation explicitly deferred. Direction: exact retained Projection with new presentation inputs. Disclosed reselection may be interim, not equivalent continuity. No warning is required merely for an identifier change or every independently requested fresh investigation. |
| Targeted observation export check | Ordinary module observations omit retained analysis-input support; stored core qualification does not guarantee exported captured-state attribution. | Known current limitation relevant to existing observation obligations, with correction explicitly deferred. It need not block architectural adoption or interface exploration; the bounded correction must precede reliance on newly collected observations for assessments requiring program-state attribution. |
| Audit F5 | Presentation format, bounds and other choices have a CLI-specific representation. | A limitation to reassess before GUI work; not proof of present analysis-boundary failure. |

These findings survive the conceptual revision to the extent described. The preserved audit evaluated the earlier product model; its broader prescriptions are not newly accepted requirements. Targeted source inspection supports continued relevance of F1/F2/F4 and observation field conflation; it is not a fresh comprehensive audit. The audit's statement that the Projection layer needs no change is bounded to its baseline and cannot rule out later multi-state or multi-input work.

Deferring implementation here does not waive accurate current observations, reference status or population claims. The decision records the known issues, the [backlog](../docs/backlog.md) preserves existing candidates and includes the [captured-basis observation correction](../docs/backlog.md#preserve-captured-basis-attribution-in-observations), and the CLI scope wording exposes the current reselection limitation. Both the observation gap's deferral and F6's deferral are agreed. Recorded output remains evidence of what PostCode displayed, but observations do not generally establish the captured program basis supporting that output. Adoption authorizes no implementation. The limitation and required correction milestone are also visible in the [CLI observation reference](../docs/cli-reference.md#source-detail-and-observations) and [README](../README.md#observability).

## Bounded source evidence for the observation gap

The previous core-support inspection and the new export inspection answer different questions. Retained core records contain claim/evidence/input support; this does not establish what survives in an observation batch.

- [`command-execution.ts`](../src/lib/command-execution.ts) supplies `observationBatch` with the published View, rendered text, configured paths and methods.
- [`observations.ts`](../src/lib/observations.ts) records those values without exporting the program-record store. The local sink serializes that batch; it does not add a state capture.
- [`presentation.ts`](../src/lib/presentation.ts) exports an ordinary module View with conceptual qualifications; [`qualification-view.ts`](../src/lib/qualification-view.ts) deliberately omits input and evidence references. Its analysis field describes provider, coverage and input consistency, not the captured input basis. Optional source-detail records include individual evidence digests, but are not a general state-attribution mechanism.
- [`investigation/associations.ts`](../src/lib/investigation/associations.ts) uses the retained composite selection ID with mechanical descriptor fields and omits the explicit mechanical support reference retained in core. Adequacy of the exported attribution needs bounded assessment. This does not establish that the View must record two independent top-level Projections or that legitimate composition requires a direct pointer everywhere.

This confirms a concrete current gap without claiming that every observation contains no evidence, or that all result families need the same representation. It is source inspection, not an exhaustive runtime conformance audit. Historical observations remain unchanged; later design must not reconstruct their basis from a newer working tree.

The bounded correction concerns identifying the captured basis and its limitations, not retaining everything needed to reproduce an investigation. It must not silently expand into a durable analysis store or repository archive. Neither a commit hash alone nor references into a discarded store can be assumed sufficient attribution. Necessary representation and any bounded retention remain follow-up design choices; full reproducibility is a separate concern.

## Implications for subsequent Lens preparation

The unchanged [Lens representation note](lens-representation-proposal.md) is exploratory context only. It is not an approved plan, and no prescription in it is adopted by reference.

Retain its useful distinctions: Lens question versus execution operation; designation versus selected subjects versus parameters; applicability versus availability and failure; compatible reuse versus new evaluation; and qualified retained answers versus invocation reporting. A shared semantic vocabulary and easier Lens additions remain candidates to evaluate, not a mandate for one all-purpose table.

Reassess composition examples according to their intended information. A module summary that coordinates dependency, structure and interpretation Projections can be one Presentation. A Lens producing a new synthesized answer still needs declared analytical requirements and its own qualified result. A legitimate qualified selection can also be a Projection without deriving new facts; shared layout alone need not create an outer Projection. Several contributions to one answer do not require the “composite” category. Summary View selection is not necessarily Lens selection, so a View caption, observation or agent-context descriptor cannot generally infer one Lens from the View as a whole.

Do not import the note's suggested implementation scope (F1–F4 together), one-inspection-Lens recommendation, canonical identifier choices, registration table, prompt mechanism or schema migration as accepted architecture. Existing component records may remain. Preserve the current reporting-only meaning of `usage`; its compatibility representation may be revisited separately. Lens preparation should avoid baking in a one-operation, one-prompt or one-state universal model while remaining free to implement only a bounded current subset.

## Consequential choices left for later assessment

| Choice | Required before |
| --- | --- |
| Captured-state representation, namespace/session-scope policy, record identity, reuse compatibility, state order/roles, correspondence and capture consistency | Introducing another capture or cross-state/cross-session coordination; not automatically required for several existing Projections from one Session |
| Mechanisms for following inputs and reusing pinned captured states, request/result references, capture failures and visible basis changes | Input-following or refresh support; the meaning of pinned is already defined by the foundation |
| View identity continuity, composition history, recording/export and storage lifecycle | Managed multi-Projection Views or workspace persistence |
| Which Lens identities span subject kinds; applicability/refusal contracts; lookup/result identity; semantic registration and extension mechanism | A substantive Lens representation implementation |
| Public descriptors, normalized parameters and versioned compatibility; independently attributable inputs in observations | Changing Lens/Projection/View/observation schemas |
| Request/API, identity and compatibility design for exact retained-Projection presentation | F6 remediation; the continuity rule and current limitation are already settled |
| Adequate captured-basis attribution in observations, including representation and any necessary bounded retention | Reliance on newly collected observations for assessments requiring attribution to a particular program state; correction is deferred and does not block architectural adoption or interface exploration |
| Whether to offer summary suggestions, their selection criteria and breadth/depth under incomplete capabilities | Choosing to implement a general summary suggestion; no default change is required |

These are follow-up implementation choices, with the observation correction required before the specified reliance on newly collected observations. The human has explicitly agreed its deferral for architectural adoption and interface exploration. F6 remains another current gap with its agreed deferral unchanged. Neither deferral establishes conformance or removes the existing obligations. No consequential adoption choice remains unresolved; the conceptual model remains compatible with the foundation and immutable results.

## Promotion and verification

The human accepted the reconciliation on 2026-10-08. The [decision](../docs/decisions/coordinated-views-and-qualified-results.md) is accepted; the [core concepts](../docs/core-concepts.md), [architectural constraints](../docs/architectural-constraints.md), [implemented architecture](../docs/architecture/README.md), [CLI reference](../docs/cli-reference.md) and [backlog](../docs/backlog.md) incorporate the approved revisions. The [decision index](../docs/decisions/README.md) and forward/backward supersession metadata identify precisely the three replaced units. Historical decision bodies and their earlier mappings remain intact; unaffected domain/storage commitments are carried forward.

The promoted draft package and its review guide have been removed. This impact note remains as supporting context with canonical links. No canonical document depends on notes or disposable review material. Foundation, application code, human-maintained development instructions, concluded records and the exploratory Lens representation note remain unchanged.

Promotion verification passed: 312 local links and anchors in the changed/new documents resolve, including the new observation-backlog anchor; 24 inbound references to replaced units remain valid through preserved headings and supersession metadata. Promoted units match the approved content, and historical bodies, original decision dates, earlier mappings and unaffected domain/storage commitments are preserved. No links remain to the removed package or review guide; canonical documents have no dependencies on notes or disposable review material. Whitespace and promotion scope checks passed. No application tests are required for this documentation-only adoption. The agreed F6 and observation-provenance deferrals remain in force, with no implementation authorized.
