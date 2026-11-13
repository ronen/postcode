# Structured architectural information: executable working examples

Updated 2026-11-12. These are authored exploratory fixtures, not an adopted protocol,
product implementation or live investigator run. They now follow the entity/context and
association-declaration direction throughout. Earlier whole-investigram correction
fixtures remain in Git history; current examples no longer return correction record K.

Start with the [proposal](../structured-architectural-accounts-proposal.md),
[consolidation](../structured-architectural-accounts-consolidation.md), and
[step-by-step walkthrough](../structured-architectural-accounts-example.md).
The [contracts](contracts.md) distinguish agreed direction from provisional executable
choices. [Payload tour](metadata-payload.md) connects the records to those concepts.

Terminology: **Projection** means the outer application answer. These fixtures simulate engine
**context selection/delivery**. Existing helper identifiers such as `project()` and report keys
such as `qualifiedCurrentAdmissionProjection` are local fixture implementation names for that
context operation, not a second architectural Projection type or prescribed product API names.

## What the example demonstrates

Entities organize qualified information. Each particular invocation Q has a separate
result entity RESULT-Q. Investigrams preserve immutable contributions, including content
and qualified association declarations. Addition, supersession and withdrawal act on
associations; the entire source investigram does not become superseded.

A later association may reference earlier content without copying it. A later result
designation may retain earlier definitions while substituting a newly qualified behavioral
association. Exact prior answers and delivered context stay fixed. Investigator context
is a selected entity/result context delivery with exact source qualification and provenance.

The first investigation deliberately omits waiting during an occupied recovery trial.
The follow-up supplies that behavior and explicitly supersedes the admission association.
This is a staged omission for testing the model, not evidence of a live discovery or a
claim that a source bug was found. Architectural interpretation remains pinned to Cockatiel
revision `f48bea55022ab15ab07eb52a79bfc1e661300fd4` and the source/method qualifications
in each fixture. Existing [exploratory examples](../initial-journey/cockatiel-account-examples.md)
provide the investigation background.

## Reading the files

| File/group | Purpose |
| --- | --- |
| [Seed](seed-context.json), [ledger](context-and-bindings.json) | Existing mechanical/architectural identity, basis/evidence registry, exact requests, context selections and allocated IDs. |
| [First result](first-result.json) | Q1 introduces state categories and associates definitions/admission with P/S; designates RESULT-Q1. |
| [Follow-up](followup-result.json) | Q2 introduces scenario roles and trial behavior, supersedes P's admission association, redesignates RESULT-Q1 and designates RESULT-Q2. |
| [Lifecycle probes](lifecycle-probes.json) | Earlier-result consumer, fuller description, declaration-only reuse, and withdrawal. |
| [Generated report](lifecycle-report.json) | Exact qualified context deliveries, displacement links, exposure and distinct evaluation/designation reconsideration causes in the displacement-only regression. |
| [Acquisition refinements](acquisition.md) | Scope-selected initial content, discovery before retrieval, and exact exposure to delivered declaration reasons; declared dependencies and investigator-directed propagation remain deferred. |
| [Mechanical/agentic unification](unification/README.md) | Authored discovery, exports and source dependencies; interpreted extension and separately attributed supersession, with original guarantees and histories preserved. |
| [Addition probe](additions.md) | Association/inventory exposure comparison in both partitions: original readers no longer acquire addition causes; an explicit inventory reader and its consumer do. Earlier broad counts remain reproducible. |
| [Children variant](children/README.md) | Same behavior with appropriately separated qualification boundaries. Its own seed/ledger/probes/reports describe a separate hypothetical Session. |
| [Composition](composition/README.md) | Two wrapping orders, local roles/relations/situations and exact follow-up selectors. |
| [Follow-up options](followup-options.md) | RESULT-Q1 as context/subject, exact originating metadata as option address. |
| [Diagram overview guide](diagrams.md) | Four compact diagrams with full keyed legends and source mappings. |

Readable IDs are aliases, not a production UUID format. Each variant resolves its own
submission-local IDs. Identical aliases across variants do not join their Sessions.

## Admission, trial and revised designation

In the mixed variant ADMISSION-1 contains descriptions and admission claims together.
In the children variant INTRO-1 owns DEFINITIONS-1 and ADMISSION-1. Both have exact item
associations, so ADMISSION-1/admission-cases can be displaced independently. Q2's
ADMISSION-2 contains only the new admission item and its supersession declaration;
it copies no unchanged definitions, inspection guidance or root prose.

Q2 also explicitly supersedes Q1's result designation. Its new members reference the
unchanged original associations and the new admission association. The original result
and all original bundles remain retained, as do fixed child lists. New result membership
is neither a patched tree nor a global replacement flag.

Q2 receives a RESULT-Q1 context delivery including the exact declarations/members it will
displace. This is a deliberate completeness example, not a default to deliver every
historical result. Investigators are instructed to acquire the exact target and designated
members with qualifications before displacement; an option excerpt alone does not fulfill that
instruction. Mechanical target-support completeness enforcement is deferred; structural validity
and accurate delivery records remain mandatory.
Redesignation instructions require understanding Q1's exact question/scope and parameters;
prior delivery is not mechanically required. Redesignation is optional, not a duty to update
every containing result. The follow-up option stays on ADMISSION-1 and is not copied to ADMISSION-2 because this
submission already answers it.

## Exposure boundary and deferred extensions

Entity and query-result IDs organize access. Actual association uses and qualified content
are recorded separately from explicitly requested inventories with scope/coverage and time.
A by-reference description, fixed result membership or bare subject reference does not imply
an inventory. Content selected by explicit scope also records a scope/time dependency, even
when no separate list is requested. Substantively delivered declaration reasons expose their
own exact declaration, without delivering every referenced member.
Listing an association does not deliver its content; substantive summaries/options/reasons
still require content provenance. Exact displacement and inherited-cause context remains
required, without automatically supplying every unrelated addition's reason.

The [addition comparison](additions.md) shows why this distinction matters. The human accepts
that structural exposure cannot find every semantically affected explanation. Investigator-
directed propagation could later identify exact-target concerns after inspecting candidate
prior results; targeted suppression, reassessment/clearance and automatic scheduling are
also deferred. None is added to the submitted payloads or implemented by these fixtures.

## Qualification and partition costs

Mixed descriptions still carry their original investigram-level default-sampling scope.
Moving their associations or projecting only one item cannot shed that limitation.
The children variant separately qualifies state identity and behavior, so category
identification is not restricted by unrelated behavioral assumptions. That is a real
reason to separate content; it is no longer necessary simply to obtain independently
supersedable associations or exact item access.

An identifying item can still inherit reconsideration through its generating evaluation's
actual exposures. Grouping or splitting output bundles does not erase that provenance.
Separate evaluations, per-output delivery records or qualified reassessment have different
costs; the current fixture conservatively preserves those warning paths.

## New lifecycle probes

Main acceptance order: Q1, Q-observer, Q-excerpt, Q2, Q-updated, Q-expansion, Q-reuse,
Q-withdraw, then the checker-generated Q-competing. The input `status` and generated
report give this order; separate timing branches below do not change the main sequence.


- Q-observer receives RESULT-Q1 before Q2. It contributes an association to already
  delivered admission content without creating a new item, plus its own result designation.
- Q-excerpt receives an admission item with its exact P association route, without the
  result designation. Q-updated receives the new RESULT-Q1 designation after Q2; neither
  gets warnings for unreceived associations merely sharing the entity.
- Q-expansion supersedes S's identifying association with a fuller description, without
  claiming the earlier identification was false. RESULT-Q1 is affected through membership;
  Q1 itself was never exposed to S. Q-observer is reached through its actual result exposure.
- Q-reuse associates an earlier description with P under qualified scope. Its bundle has
  no new content; the original item's ownership/limitations remain visible.
- Q-withdraw withdraws only that new P association, with reason and no replacement members.
  Its result includes the withdrawal declaration. The original S association is not thereby
  withdrawn, and the old content remains accessible.
- A checker-only competing supersession remains alongside the first; recency does not
  silently reconcile them.

Warnings and association standing are different. Each exact result designation records
displacement separately from membership/generating-context concerns. No warning follows
merely from sharing an entity or content item in this displacement-only regression. The report includes checkpoints before the
independent expansion/competition probes so successful redesignation is visible. It
uses actual delivery timing: disclosed prior causes are known context, while later changes
can trigger warnings. Missing direct or inherited disclosure is a delivery defect. Producer
exemption remains. The separate addition experiment uses explicit inventory exposure for new-information
causes, not every entity use. General inventory coverage remains open; clearance and general
reinstatement are deferred. Renewed assertions can use new associations to original qualified
content, preserving provenance without undoing earlier displacement (see [contracts](contracts.md)).

<a id="verification"></a>
## Verification

Timing branches contrast delivery before a change with informed delivery afterward,
including an investigation finishing later, a later refresh that does not clear an old
exposure, inherited producer concerns and knowingly designating historical membership.
Q-reuse/Q-withdraw do not acquire the already-disclosed expansion cause. Q-competing does
not acquire the expansion it knew about, while its new cause still reaches earlier consumers.
The report preserves acceptance/delivery positions and qualified known-cause notices.


Run from the worktree root with Python 3:

```sh
python3 notes/structured-account-example/check-fixtures.py
python3 notes/structured-account-example/check-guidance.py
python3 notes/structured-account-example/check-additions.py
python3 notes/structured-account-example/check-acquisition.py
python3 notes/structured-account-example/unification/check-unification.py
python3 notes/structured-account-example/composition/check-and-render.py
python3 notes/structured-account-example/render-overviews.py
```

The first checks both partitions, qualified delivery, structural validity and reference integrity, immutable original
answers, exact association standing, result-membership versus exposure paths, atomic
rejection and matching architectural state/interaction content. It rejects 72 malformed
cases across the partitions. Use `--write` only to deliberately regenerate lifecycle
reports after changing authored input or the bounded simulator. A separate no-context branch
checks that reuse and earlier-query redesignation are structurally accepted without inventing
exposure or certifying adequate understanding.

The addition checker compares the earlier broad mode with association/inventory exposure,
including independent/cumulative runs, empty/filtered inventories, inherited concerns and
separate acquisition timing in both partitions. It rejects 26 malformed inventory, disclosure
or unresolved-reference cases plus four historical broad-policy disclosure negatives. Its `--write`
regenerates both comparison reports. An inventory-only reuse branch is structurally accepted
without treating its referenced content as previously delivered; unknown references still fail.
Modes are host-selected experiments, not investigator
options to suppress warnings. The revised baseline is 0/7 evaluations and 0/8 designations;
explicit inventory branches reach 2/9 and 2/10, one direct and one inherited. These are boundary
controls, not warning-rate estimates. The acquisition checker adds scope-selected descriptions
and a discovery-before-retrieval Q2 (3/7 evaluations, 4/8 designations), plus direct exposure to
supplied declaration reasons. A counterfactual renewal also checks fresh cause standing while preserving the original concern
and captured history. It rejects 26 malformed scope, disclosure or declaration cases. It also accepts deliberately
incomplete target-support branches to demonstrate the instruction/enforcement boundary, not sound
analysis. `--write` regenerates its condensed reports in both partitions.

The guidance checker rejects 26 malformed metadata/address/request cases and verifies
both trial diagrams resolve identically without recommendations. Composition checks
five malformed structural cases and nine malformed/ambiguous nested selections. The
overview generator verifies committed Mermaid sources, legends and traceability; existing
rendered SVGs remain unchanged by the lifecycle conversion.

The unification checker uses the same model with four additional bounded content contracts and
per-investigram producer/basis attribution within one acceptance. It checks seven authored invocations,
six provider re-encounter branches, organizing withdrawal-plus-addition/restoration and twenty-eight
malformed cases, including renewal-history disclosure, later symbol introduction, no invented
mechanical prose, complementary dependencies,
producer-neutral supersession, exact source qualification and preserved answers. It does not run
native providers, a new compiler method or a live investigator. See its [walkthrough](unification/README.md).

[model.py](model.py) is a bounded simulation of proposed rules, not production code or a
universal schema. The checkers do not prove identity judgments, truth of causal claims,
sufficient evidence, semantic suitability of qualification, or live agent behavior.
No supported product API accepts these payloads yet. Session-lifetime acceptance,
exact/direct API delivery, provider migration, source-backed investigation and appropriate
failure handling still need independently verifiable implementation planning.
