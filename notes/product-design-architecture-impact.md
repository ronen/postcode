# Adoption impact and later Lens preparation

Updated: 2026-10-08
Foundation baseline: `337451bd37f91004a14d56149c52b4491bef783a`
Proposal coverage: `0bb24fe` (re-review corrections following `9deb123`).

This is review material for the draft package, not a plan or runtime-conformance certification. The assessment is non-permanent supporting material; no proposed canonical file links to it or requires it for interpretation. Evidence comes from the revised product design, governing documents, the preserved [representation audit](../records/audits/2026-10-06-user-model-concept-representations/REPORT.md), and targeted inspection of request dispatch, observation construction and dependency subject selection. No runtime probes or application tests were rerun for this documentation proposal.

## Conceptual changes

| Change | Adoption effect |
| --- | --- |
| One Presentation/View may coordinate several Projections | Removes universal single-input wording; preserves every input's independent identity, state basis, qualification and population. A coordinated View is distinguished by shared presentation/interaction relationships, not a shared container. |
| One Lens may use several analyses or qualified contributions | Removes a special composite-Lens category and any one-to-one execution assumption. It does not impose component records or a Lens registry. |
| One Projection may concern several states | Requires attributable captured state bases and meaningful order/roles. It does not establish cross-state correspondence, atomic capture or a universal schema. |
| Input bindings and immutable answers | Following resolves changing inputs again; pinned reuses the same captured state. Requests and their captured results remain distinct. The existing application commitment to immutable results remains compatible with the updated foundation. |
| Subject and changes | Keeps Subject open-ended. Investigating a module across captured states differs from investigating an identified qualified change; states and evidence remain explicit. No change entity or implementation is introduced. |
| Stable presentation | Paging and reformatting preserve the selected answer. Refresh must be apparent and consequential answer/selection/qualification changes disclosed. Retained interpretation selections are distinct from captured program states; no interpretation-history binding policy is introduced. |
| Selection inspectability | Exposes actual choices, criteria used at the time and consequential omissions; later defaults cannot reconstruct the explanation. No general planner or separate plan artifact is required. |
| Observation recording | Records presented Projections, composition and captured-state associations; makes composition and basis changes visible and recorded. This is independent of workspace persistence. |
| Counts and aggregates | Retains the accepted full-supplied-population permission, including “87 dependencies; showing 20”. New program claims require analysis. Exact arithmetic does not erase partiality or establish coverage; the presentational examples are not an exhaustive whitelist of UI computation. |
| Optional summary entry | A summary View may be suggested for an unspecified need, using coordination, synthesis or both. There is no required summary-first default and no requirement for a summary Lens. |

The earlier draft incorrectly proposed restoring a mandatory summary default and amending the foundation. Those changes are withdrawn. The current foundation intentionally permits, rather than requires, summary suggestions and now explicitly describes supplied-population counts, captured states, following/pinned input policies and captured-result versus repeatable-request references. The draft conforms to those choices without requesting foundation revisions.

## Implementation limitations permitted at adoption

The CLI remains a transient single-project, single-state implementation with family-specific, single-top-level-Projection View descriptors. Existing embedded module bases and associated-inspection records remain legitimate; they are not evidence of arbitrary multi-Projection View support. The eager evaluation/construction strategy, interface-independent qualified content, immutable records and existing identity formulas remain supported.

There is no general multi-state analysis, multi-Projection GUI, live refresh, persisted workspace, or planner commitment. Detected input changes still invalidate the session. The no-argument `modules` default is compatible with optional summary suggestions. Module-only interpretation is a limited capability, not a definition of every summary View or a failure to implement a mandatory entry default. Descriptive architecture and CLI revisions explain these limits without claiming changed behavior; `STATUS.md` need not change because no externally meaningful capability changes in this proposal.

GUI plans must identify missing core capabilities needed for qualified results, without requiring all of them to be built first. Coordinating several existing Projections from one Session does not inherently require multi-state support. Additional captures do require a deliberate identity, namespace, reuse and session-scope policy: separate Sessions per capture and an extended multi-capture Session remain different possibilities. Reusing a key is not evidence of semantic correspondence, and required attribution does not prescribe new state fields or keys in every family.

No current source layout, type, schema, method version or migration is selected. The qualified-construction decision's current family-specific compatibility obligations remain accepted. Later changes to those obligations need their own accepted decision and precise supersession treatment.

## Known conformance and correctness issues

| Evidence | Current implication | Treatment in this package |
| --- | --- | --- |
| Audit F1; `src/lib/observations.ts` retains a fallback navigation description | Follow-up and some unsupported requests are described as inventory. This misstates current requests. | Existing correction candidate remains open. It need not wait for Lens redesign, a GUI or multi-state support. |
| Audit F2; dependency selection still calls module inspection | Bound unsupported group references can be reported as unknown. Applicability and reference existence are conflated. | Existing correction candidate remains open; later scope must settle accurate refusal vocabulary. |
| Audit F3 | Subject designation is reported as Lens parameters. No true parameters currently change the answer, but the descriptor is semantically misleading. | Keep the descriptor/compatibility candidate; do not claim conformance merely because future parameters are absent. |
| Audit F4; dependency construction consumes inspection selection data | Selection is coupled to inspection and its module-only population without consuming the qualified inspection answer as an attributed contribution. | Reassess/extract selection in later work; preserve genuine qualified component use without prescribing a universal direct component pointer. |
| Audit F6 | Paging/reformatting can select newer interpretations or correction/association snapshots. Immutable old results and changed JSON IDs do not provide human-facing continuity or sufficient refresh disclosure. | Settled current continuity/disclosure limitation; remediation explicitly deferred. Direction: exact retained Projection with new presentation inputs. Disclosed reselection may be interim, not equivalent continuity. No warning is required merely for an identifier change or every independently requested fresh investigation. |
| Targeted observation export check | Ordinary module observations omit retained analysis-input support; stored core qualification does not guarantee exported captured-state attribution. | Known current recording gap with a new bounded backlog candidate. Adoption-time deferral versus correction before acceptance remains a human decision. |
| Audit F5 | Presentation format, bounds and other choices have a CLI-specific representation. | A limitation to reassess before GUI work; not proof of present analysis-boundary failure. |

These findings survive the conceptual revision to the extent described. The preserved audit evaluated the earlier product model; its broader prescriptions are not newly accepted requirements. Targeted source inspection supports continued relevance of F1/F2/F4 and observation field conflation; it is not a fresh comprehensive audit. The audit's statement that the Projection layer needs no change is bounded to its baseline and cannot rule out later multi-state or multi-input work.

Deferring implementation here does not waive accurate current observations, reference status or population claims. The decision records the known issues, the draft backlog preserves existing candidates and adds the captured-basis observation candidate, and the CLI scope wording exposes the current reselection limitation. The observation gap's adoption treatment remains open; F6's deferral is already agreed. Remediation is outside the authorized proposal scope.

## Bounded source evidence for the observation gap

The previous core-support inspection and the new export inspection answer different questions. Retained core records contain claim/evidence/input support; this does not establish what survives in an observation batch.

- [`command-execution.ts`](../src/lib/command-execution.ts) supplies `observationBatch` with the published View, rendered text, configured paths and methods.
- [`observations.ts`](../src/lib/observations.ts) records those values without exporting the program-record store. The local sink serializes that batch; it does not add a state capture.
- [`presentation.ts`](../src/lib/presentation.ts) exports an ordinary module View with conceptual qualifications; [`qualification-view.ts`](../src/lib/qualification-view.ts) deliberately omits input and evidence references. Its analysis field describes provider, coverage and input consistency, not the captured input basis. Optional source-detail records include individual evidence digests, but are not a general state-attribution mechanism.
- [`investigation/associations.ts`](../src/lib/investigation/associations.ts) uses the retained composite selection ID with mechanical descriptor fields and omits the explicit mechanical support reference retained in core. Adequacy of the exported attribution needs bounded assessment. This does not establish that the View must record two independent top-level Projections or that legitimate composition requires a direct pointer everywhere.

This confirms a concrete current gap without claiming that every observation contains no evidence, or that all result families need the same representation. It is source inspection, not an exhaustive runtime conformance audit. Historical observations remain unchanged; later design must not reconstruct their basis from a newer working tree.

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
| Accepting the current observation-provenance gap with explicit deferral versus requiring a bounded correction first | Acceptance of this proposal; remediation scope and urgency must be agreed |
| Whether to offer summary suggestions, their selection criteria and breadth/depth under incomplete capabilities | Choosing to implement a general summary suggestion; no default change is required |

Most rows are implementation choices to resolve when the relevant capability is introduced. The observation-provenance row is an adoption question now, because the current implementation does not satisfy the proposed recording obligation. F6 is another known current gap, with deferral already agreed. Neither gap is legitimized by calling the current CLI a limited subset. The conceptual model remains compatible with the foundation and immutable results; accepting a particular conformance deferral is a separate judgment.

## Review and verification

Review the [decision](../drafts/product-design-architecture/decisions/coordinated-views-and-qualified-results.md), proposed concepts and constraints against the [adopted product design](../foundation/product-design.md). The [review guide](product-design-architecture-review.md) lists the ten proposed canonical files. The decision still supersedes precisely three whole units; metadata files preserve forward/backward mappings and historical bodies. Its retained-boundaries section carries the replaced session heading’s unaffected domain/storage text.

The re-review corrections retain ten canonical-shaped proposal files, with no links from them to notes or disposable material. Verification passed for this revision: proposed destinations and local links/anchors resolve, carried-forward domain/storage provisions match the preserved decision, whitespace is clean, and the only local review annotation concerns observation-provenance deferral. Supersession metadata and the three-unit replacement scope are unchanged. Foundation, canonical documentation, application code, human-maintained instructions, historical records and the original Lens note remain unchanged. These two reconciliation notes are refreshed at the human's direction. No application tests or fresh runtime audit are required for the documentation-only edits; targeted source inspection supports the observation finding. Review, resolution of the marked adoption choice and human acceptance remain pending.
