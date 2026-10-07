# Adoption impact and later Lens preparation

This is review material for the draft package, not a plan or runtime-conformance certification. The baseline is commit `c0ed132`. Evidence comes from the revised product design, governing documents, the preserved [representation audit](../records/audits/2026-10-06-user-model-concept-representations/REPORT.md), and targeted inspection of request dispatch, observation construction and dependency subject selection. No runtime probes or application tests were rerun for this documentation proposal.

## Conceptual changes

| Change | Adoption effect |
| --- | --- |
| One Presentation/View may coordinate several Projections | Removes universal single-input wording; preserves every input's independent identity, state basis, qualification and population. A coordinated View is distinguished by shared presentation/interaction relationships, not a shared container. |
| One Lens may use several analyses or qualified contributions | Removes a special composite-Lens category and any one-to-one execution assumption. It does not impose component records or a Lens registry. |
| One Projection may concern several states | Requires attributable captured state bases and meaningful order/roles. It does not establish cross-state correspondence, atomic capture or a universal schema. |
| Live bindings and immutable answers | Following inputs affects subsequent requests. Earlier results remain fixed; refresh produces another result. |
| Counts and aggregates | Retains the accepted full-supplied-population permission, including “87 dependencies; showing 20”. New program claims require analysis. Exact arithmetic does not erase partiality or establish coverage. |
| Summary-first | Restores the default for an unspecified need, while allowing coordination, synthesis or both. A summary View need not depend on a summary Lens. |

The foundation amendment is necessary: c0ed132's “may suggest” weakens the intended default, and its displayed-item count and live-state wording can be read too narrowly or as mutable results. The draft makes these qualifications explicit rather than treating an architecture decision as authority to reinterpret foundation text silently.

## Implementation limitations permitted at adoption

The CLI remains a transient single-project, single-state implementation with family-specific, single-top-level-Projection View descriptors. Existing embedded module bases and associated-inspection records remain legitimate; they are not evidence of arbitrary multi-Projection View support. The eager evaluation/construction strategy, interface-independent qualified content, immutable records and existing identity formulas remain supported.

There is no general multi-state analysis, multi-Projection GUI, live refresh, persisted workspace, or planner commitment. Detected input changes still invalidate the session. The no-argument `modules` default and module-only interpretation are an explicitly disclosed gap in product summary-first coverage, not a new definition of summary. Descriptive architecture and CLI revisions explain these limits without claiming changed behavior; `STATUS.md` need not change because no externally meaningful capability changes in this proposal.

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
| Pinned revision versus retained-result interaction, refresh triggers, failure/partial-refresh handling and visible timing | Live binding or refresh support |
| View identity continuity, composition history, recording/export and storage lifecycle | Managed multi-Projection Views or workspace persistence |
| Which Lens identities span subject kinds; applicability/refusal contracts; lookup/result identity; semantic registration and extension mechanism | A substantive Lens representation implementation |
| Public descriptors, normalized parameters and versioned compatibility; independently attributable inputs in observations | Changing Lens/Projection/View/observation schemas |
| Requesting an exact retained Projection versus repeating a request; paging disclosure | Promising stable presentation of retained results |
| Summary selection criteria and breadth/depth under incomplete capabilities | Implementing a general summary-first entry experience |

These are explicit deferrals, not unresolved assumptions needed to understand this proposal. If review requests a choice among them as part of adoption, resolve it before expanding the package. No discussion pause was needed to draft the conceptual choices already directed by the human.

## Review and verification

Review the [decision ](../drafts/product-design-architecture/decisions/coordinated-views-and-qualified-results.md), [foundation revisions ](../drafts/product-design-architecture/foundation/product-design-revisions.md), concepts and constraints together. The decision supersedes precisely three whole units; metadata files preserve complete forward/backward mappings and historical bodies. Its retained-boundaries section carries the replaced session heading's unaffected domain/storage text, avoiding accidental withdrawal of unrelated rules.

Verification completed: all revision destinations exist and insertion/replacement targets were checked against the baseline; 64 local links and anchors resolve against their actual draft or intended canonical destinations; the carried-forward domain/storage text matches the earlier heading exactly outside the identified conceptual paragraph. The worktree changes are confined to this 13-file draft package. Wording was checked for accidental implementation commitments and the three supersession mappings were compared in both directions. Application tests were not run because no implementation changed. Review is still pending; these checks do not constitute human acceptance or an independent review.
