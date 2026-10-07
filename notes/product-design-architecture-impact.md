# Adoption impact and later Lens preparation

This is review material for the draft package, not a plan or runtime-conformance certification. The baseline is commit `337451bd37f91004a14d56149c52b4491bef783a`. The assessment is non-permanent supporting material; no proposed canonical file links to it or requires it for interpretation. Evidence comes from the revised product design, governing documents, the preserved [representation audit](../records/audits/2026-10-06-user-model-concept-representations/REPORT.md), and targeted inspection of request dispatch, observation construction and dependency subject selection. No runtime probes or application tests were rerun for this documentation proposal.

## Conceptual changes

| Change | Adoption effect |
| --- | --- |
| One Presentation/View may coordinate several Projections | Removes universal single-input wording; preserves every input's independent identity, state basis, qualification and population. A coordinated View is distinguished by shared presentation/interaction relationships, not a shared container. |
| One Lens may use several analyses or qualified contributions | Removes a special composite-Lens category and any one-to-one execution assumption. It does not impose component records or a Lens registry. |
| One Projection may concern several states | Requires attributable captured state bases and meaningful order/roles. It does not establish cross-state correspondence, atomic capture or a universal schema. |
| Input bindings and immutable answers | Following resolves changing inputs again; pinned reuses the same captured state. Requests and their captured results remain distinct. The existing application commitment to immutable results remains compatible with the updated foundation. |
| Counts and aggregates | Retains the accepted full-supplied-population permission, including “87 dependencies; showing 20”. New program claims require analysis. Exact arithmetic does not erase partiality or establish coverage. |
| Optional summary entry | A summary View may be suggested for an unspecified need, using coordination, synthesis or both. There is no required summary-first default and no requirement for a summary Lens. |

The earlier draft incorrectly proposed restoring a mandatory summary default and amending the foundation. Those changes are withdrawn. The current foundation intentionally permits, rather than requires, summary suggestions and now explicitly describes supplied-population counts, captured states, following/pinned input policies and captured-result versus repeatable-request references. The draft conforms to those choices without requesting foundation revisions.

## Implementation limitations permitted at adoption

The CLI remains a transient single-project, single-state implementation with family-specific, single-top-level-Projection View descriptors. Existing embedded module bases and associated-inspection records remain legitimate; they are not evidence of arbitrary multi-Projection View support. The eager evaluation/construction strategy, interface-independent qualified content, immutable records and existing identity formulas remain supported.

There is no general multi-state analysis, multi-Projection GUI, live refresh, persisted workspace, or planner commitment. Detected input changes still invalidate the session. The no-argument `modules` default is compatible with optional summary suggestions. Module-only interpretation is a limited capability, not a definition of every summary View or a failure to implement a mandatory entry default. Descriptive architecture and CLI revisions explain these limits without claiming changed behavior; `STATUS.md` need not change because no externally meaningful capability changes in this proposal.

No current source layout, type, schema, method version or migration is selected. The qualified-construction decision's current family-specific compatibility obligations remain accepted. Later changes to those obligations need their own accepted decision and precise supersession treatment.

## Known conformance and correctness issues

| Evidence | Current implication | Treatment in this package |
| --- | --- | --- |
| Audit F1; `src/lib/observations.ts` retains a fallback navigation description | Follow-up and some unsupported requests are described as inventory. This misstates current requests. | Existing correction candidate remains open. It need not wait for Lens redesign, a GUI or multi-state support. |
| Audit F2; dependency selection still calls module inspection | Bound unsupported group references can be reported as unknown. Applicability and reference existence are conflated. | Existing correction candidate remains open; later scope must settle accurate refusal vocabulary. |
| Audit F3 | Subject designation is reported as Lens parameters. No true parameters currently change the answer, but the descriptor is semantically misleading. | Keep the descriptor/compatibility candidate; do not claim conformance merely because future parameters are absent. |
| Audit F4; dependency construction retains an unused inspection result | Selection is coupled to inspection and its module-only population. | Reassess/extract selection in later work; do not prohibit legitimate internally consumed Projections. |
| Audit F6 | A page/format request reselects retained interpretation, potentially yielding a different Projection. Existing records stay immutable. | Treat as a current selection/disclosure concern and absent retained-result redisplay facility; assess before promising stable paging. Do not call it mutation or resolve it through a live-binding label. |
| Audit F5 | Presentation format, bounds and other choices have a CLI-specific representation. | A limitation to reassess before GUI work; not proof of present analysis-boundary failure. |

These findings survive the conceptual revision to the extent described. The preserved audit evaluated the earlier product model; its broader prescriptions are not newly accepted requirements. Targeted source inspection supports continued relevance of F1/F2/F4 and observation field conflation; it is not a fresh comprehensive audit. The audit's statement that the Projection layer needs no change is bounded to its baseline and cannot rule out later multi-state or multi-input work.

Deferring implementation here does not waive accurate current observations, reference status or population claims. The decision records the known issues, the draft backlog preserves the existing candidates, and the CLI scope wording exposes the current reselection limitation. Remediation is outside the authorized proposal scope.

## Implications for subsequent Lens preparation

The unchanged [Lens representation note](lens-representation-proposal.md) is exploratory context only. It is not an approved plan, and no prescription in it is adopted by reference.

Retain its useful distinctions: Lens question versus execution operation; designation versus selected subjects versus parameters; applicability versus availability and failure; compatible reuse versus new evaluation; and qualified retained answers versus invocation reporting. A shared semantic vocabulary and easier Lens additions remain candidates to evaluate, not a mandate for one all-purpose table.

Reassess composition examples according to their intended information. A module summary that coordinates dependency, structure and interpretation Projections can be one Presentation. A Lens producing a new synthesized answer still needs declared analytical requirements and its own qualified result. Several contributions to one answer do not require the “composite” category. Summary View selection is not necessarily Lens selection, so a View caption, observation or agent-context descriptor cannot generally infer one Lens from the View as a whole.

Do not import the note's suggested implementation scope (F1–F4 together), one-inspection-Lens recommendation, canonical identifier choices, registration table, prompt mechanism or schema migration as accepted architecture. Existing component records may remain. Preserve the current reporting-only meaning of `usage`; its compatibility representation may be revisited separately. Lens preparation should avoid baking in a one-operation, one-prompt or one-state universal model while remaining free to implement only a bounded current subset.

## Consequential choices left for later assessment

| Choice | Required before |
| --- | --- |
| Captured state representation, state order/roles, correspondence guarantees, cross-session references and capture consistency | Multi-state analysis or cross-state/cross-session coordination |
| Mechanisms for following inputs and reusing pinned captured states, request/result references, capture failures and visible basis changes | Input-following or refresh support; the meaning of pinned is already defined by the foundation |
| View identity continuity, composition history, recording/export and storage lifecycle | Managed multi-Projection Views or workspace persistence |
| Which Lens identities span subject kinds; applicability/refusal contracts; lookup/result identity; semantic registration and extension mechanism | A substantive Lens representation implementation |
| Public descriptors, normalized parameters and versioned compatibility; independently attributable inputs in observations | Changing Lens/Projection/View/observation schemas |
| Requesting an exact retained Projection versus repeating a request; paging disclosure | Promising stable presentation of retained results |
| Whether to offer summary suggestions, their selection criteria and breadth/depth under incomplete capabilities | Choosing to implement a general summary suggestion; no default change is required |

These are explicit implementation deferrals, not difficulties in conforming the draft to the foundation. No blocking conflict was identified. In particular, the application’s existing immutable-result commitment is compatible with identifying each captured basis, while the current session invalidation contract remains a limited implementation policy. If review exposes a consequential conflict, discuss it before altering the proposal’s meaning or scope.

## Review and verification

Review the [decision](../drafts/product-design-architecture/decisions/coordinated-views-and-qualified-results.md), proposed concepts and constraints against the [adopted product design](../foundation/product-design.md). The [review guide](product-design-architecture-review.md) lists the ten proposed canonical files. The decision still supersedes precisely three whole units; metadata files preserve forward/backward mappings and historical bodies. Its retained-boundaries section carries the replaced session heading’s unaffected domain/storage text.

Documentation verification completed: all revision destinations exist; 66 local links and anchors resolve against actual note/draft files or intended canonical destinations; the retained domain/storage provisions still match the earlier decision outside the identified conceptual paragraph. Summary/default and following/pinned wording was reviewed against the adopted product design. Only ten canonical-shaped proposal files remain in the package, with no links from them to notes. Changes are confined to that package and these two reclassified review notes. Foundation, canonical documentation, application code, human-maintained instructions, historical records and the original Lens note remain unchanged. No application tests or fresh runtime audit were performed; review and human acceptance remain pending.
