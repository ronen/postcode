# Composition probe: where a wrapped execution waits

Exploratory working notes, updated 2026-11-12. This is a first authored continuation of the
[children variant](../children/README.md), not an adopted design or an executed
investigation. It tests the [proposal's composition question](../../structured-architectural-accounts-proposal.md#composition-as-a-design-probe).
It does not change product code or broaden the first implementation scope.

## The question and the two cases

Select Circuit breaker P and Bulkhead B and ask: **in either wrapping order, what
can be waiting, whose state is Half-open, and which capacity is occupied?** No
originating explanation is presumed. The fixture explicitly treats P/B as an
unordered set of component policy kinds;
input position assigns neither outer nor inner. Both orderings are requested. The
input operation/multi-subject Lens option remains a design question, not an API.
A later request can select C-BB or C-BH as one retained pattern subject, with its
identifying support. This suggests multi-subject input is useful for comparisons
and joint investigations, while subsequent pattern investigations need only one
subject; it does not establish that every multi-subject question is a comparison.

| Case | Explicit setup | Waiting point reached | Application work |
| --- | --- | --- | --- |
| Bulkhead outside breaker | Two bulkhead execution slots. First execution is a pending breaker trial; a later execution takes the second slot. | Later execution holds bulkhead execution capacity while awaiting the breaker recovery decision. | First work started; later work not started. |
| Breaker outside bulkhead | One execution slot and one queue slot. Independent bulkhead-only work occupies the execution slot; the outer breaker is Open with elapsed recovery delay. | New trial holds the breaker trial slot while its inner operation is queued at the bulkhead. | Trial's application work not started. |

Both are **possible finite prefixes**, stopping while the stated occupancy persists.
They are not the same workload with order swapped, predictions of every invocation,
or a performance comparison. In the first setup, reducing bulkhead capacity to one
would stop the later caller at the outer policy instead. In the second, the external
occupant is explicit: reversing the first diagram does not establish a reachable
queued-trial case. Sharing choices are part of the supported hypothetical use, not
facts discovered about an application. No release or completion guarantee is made.

## Evidence and prior investigrams

The pinned revision remains `f48bea55022ab15ab07eb52a79bfc1e661300fd4`. Static inspection
checked three mechanisms:

- [Policy wrapping](https://github.com/connor4312/cockatiel/blob/f48bea55022ab15ab07eb52a79bfc1e661300fd4/src/Policy.ts): ordered invocation of the supplied, existing policy instances.
- [Bulkhead execution](https://github.com/connor4312/cockatiel/blob/f48bea55022ab15ab07eb52a79bfc1e661300fd4/src/BulkheadPolicy.ts): an active slot spans the awaited inner operation; pending queue entries are distinct from active work.
- [Breaker execution](https://github.com/connor4312/cockatiel/blob/f48bea55022ab15ab07eb52a79bfc1e661300fd4/src/CircuitBreakerPolicy.ts): trial reservation precedes invoking the supplied operation; an occupied trial causes later executions to await its decision.

Combining these establishes new, qualified overlap claims. ADMISSION-2 supplies a
bounded general admission investigram; TRIAL-1 supplies a scenario comparison; neither
establishes wrapping semantics alone. The new `application-of-components` prose
items explain the use and limits of each contribution. Earlier investigrams remain
PostCode interpretations, never independent repository evidence corroborating the
same claim. The evidence ledger distinguishes them from source inspection.

1. [Bulkhead result](bulkhead-result.json) supplies a separate orientation,
   identifying child for B, and bounded capacity/queue child BULKHEAD-1. Initial
   mechanical-module availability is a fixture precondition, not demonstrated discovery.
2. [Composition result](composition-result.json) supplies an orientation root,
   identifying child for the two patterns, and one behavioral child per order.
3. [Context and bindings](context-and-bindings.json) records selected entity projections,
   allocation, query/result identity and two checked follow-up designations.
   All records continue this children variant's hypothetical Session only.

```text
COMPOSITION-RESULT-1       orientation, not a restatement of waiting rules
├── COMPOSITION-DEFINITIONS-1  C-BB and C-BH: ordered patterns only
├── COMPOSITION-BB-1        bulkhead outside breaker
└── COMPOSITION-BH-1        breaker outside bulkhead
```

Earlier component items and declarations are delivered through P/S/R/B projections,
with exact source provenance, **not adopted children** of the new result. Pattern definitions have no sampling/capacity exclusion;
behavioral children carry their own applicable sampling, interference and scenario
conditions. The general pattern does not promise that a wait occurs.

## What identity means here

| Designation | Reused or new? | Meaning and limit |
| --- | --- | --- |
| P and S (Half-open) | Reused from earlier investigrams | Policy kind and state category; reuse does not broaden earlier behavior. |
| B | Introduced by the separate bulkhead investigation | Policy kind, not an observed bulkhead instance. |
| C-BB and C-BH | Explicitly introduced entities | The two ordered patterns, useful as primary results for later investigation. |
| `breaker`, `bulkhead`, execution roles | Item-local variables | Bound once in each scenario. Equal keys in the other item do not identify the same object. |
| `recovery-wait`, `capacity-wait` | Item-local relationship designations | Different relationships with different awaited conditions. Neither is earlier W. |
| Earlier R, E-trial, E-caller and W | Available with TRIAL-1's identifying support | Comparison context only; no identity with these new scenario participants is asserted. |

The contextual state claim is explicit: **bearer = this item's breaker role,
category = S, situation = waiting-cut**. It does not allocate another Half-open or a
universal contextual-identity object. Exact investigram/item/role/situation designation
suffices to revisit it in this example. A subsequent investigation could introduce an
entity with that designation as its qualified origin if useful. A structured origin
field and the live follow-up remain to be exercised.

This deliberately tests leaving the new relationships local. Giving every role and
relation an ID now would simplify cross-item references but require reusable identifying
support for every scenario detail. Conversely, local variables make cross-item reuse
more expensive: another investigram cannot use `{localRole: breaker}` to refer back here.
It must designate the exact prior occurrence and establish any correspondence, or
use an explicitly introduced entity. No renderer may match roles by spelling.

The probe therefore does **not** establish that context-specific entities or shared general
waiting relationships are never needed. It shows a smaller representation suffices
for these two explanations and exact follow-up selection. “Waiting for recovery in
general” would be a new abstraction with its own qualified investigram, not a rename of W.

<a id="small-experimental-additions-to-the-content-contract"></a>
## Small experimental additions to the content contract

The existing [shared envelope](../contracts.md#shared-roles-and-illustrations) is used
for `roles` and `roleScope` on interaction items. This is a second type using the same
role mechanism, without introducing an identity-binding illustration. Participants
may designate a local role instead of an entity. No illustration is needed:
the traces are new scenario investigrams, not an assertion that an old trace generalizes.

The following are **probe-local extensions to `interaction/0`**, pending discussion,
not silently adopted fields of the earlier sample:

| Field | Meaning |
| --- | --- |
| `pattern` | Retained/introduction reference for the ordered pattern being illustrated by this scenario. It does not assert equality with a runtime wrapper. |
| `policyOrder` | Ordered local policy-instance roles for the composite execution path. Independent bulkhead-only work is explicitly outside this path. |
| `relations` | Keyed architectural relations scoped to this interaction, with typed endpoints, conditions and evidence. |
| `{localRelation: key}` | Resolves only in this item's relations. Wait steps and situation records can refer to it without allocating an entity. |
| `situations` | Qualified snapshots at an exact `afterStep`, with explicit state assignments, resource occupancy, execution progress and active relations. These are asserted content, not simulated states derived by the renderer. |

`waits-for-decision` names a waiter and decision holder; `waits-for-capacity` names a
waiter and capacity owner. The snapshot's occupancy states holder, owner, resource
and amount. This probe distinguishes `execution-capacity`, `queue-capacity` and
`recovery-trial-slot`; those are experimental vocabulary entries, not PostCode-wide
resource kinds. It would be premature to make an arbitrary label imply scheduling.
Snapshots are partial: absent occupancy or progress entries mean unspecified, not
zero or false. Trace order alone does not imply causation; `causedBy` supplies the
arrival/occupancy chain, conditional on the stated setup. Preconditions such as an
elapsed recovery delay are not invented trace events.

The shape exposes a real choice: keep situations next to interaction steps, as here,
or extract a reusable situation/resource-lifetime type later. Extraction would need
explicit correspondence between that type's roles and the interaction's roles. Keeping
one item namespace avoids inventing that mapping now, but this sample consequently
does not validate cross-type or cross-investigram role binding. `policyOrder` is likewise
only the call order; it is not a full component-and-connector structural view.

<a id="nested-selector-grammar-for-this-probe"></a>
### Nested selector grammar for this probe

Every nested selection has exactly `investigram`, `contentKey` and `selector`. The first
two resolve to an exact retained investigram and one of its `interaction/0` items.
`selector` is one of these two disjoint shapes; other fields and kinds are rejected:

```json
{"kind": "relation", "key": "recovery-wait"}
{"kind": "state-assignment", "situation": "waiting-cut",
 "bearer": {"localRole": "breaker"}, "category": {"entity": "S"}}
```

A relation selector resolves exactly one key in that item's `relations`. A state
assignment selector resolves one situation and exactly one assertion in its
`stateAssignments` whose bearer and category both match. It selects an asserted
state assignment, not a transition, every use of S, or a new entity. Merely finding
the role and category separately is insufficient. Duplicate matching assertions are
ambiguous and rejected. Keys remain scoped to the addressed item; bare role selectors,
arbitrary paths, combined selectors and implicit retargeting are not defined
by this probe. Its checker resolves both follow-up selections and rejects malformed
or nonresolving alternatives. Selection addressing is now exercised; a subsequent
investigation or entity introduction from it is still not executed.

These are occurrence addresses, not entity introductions or association declarations.
Related-content links neither adopt their targets into the tree nor imply delivery.
Both follow-up probes now name RESULT-Q4 as the context entity for the selected occurrence.
The selector checker validates addresses; it does not execute a further investigation.

## Entity context, history and reconsideration

Q3 identifies B from the seeded mechanical module M-bulkhead and supplied source evidence;
RESULT-Q3 designates its contributions. Mechanical discovery remains a precondition.
Q4 receives these explicitly selected qualified projections without a navigation origin:

| Context entity | Selected information |
| --- | --- |
| P | ADMISSION-2's admission association, with full source qualification. |
| S | DEFINITIONS-1's Half-open identifying association. |
| R | ROLE-DEFINITIONS-1's shared-instance identity plus TRIAL-1 recovery and interaction. |
| B | BULKHEAD-DEFINITION-1 identity and BULKHEAD-1 capacity/queue behavior. |

The exposure index is P/S/R/B, with exact delivered items/declarations and their generating
provenance preserved. ADMISSION-1's old admission payload is not delivered by default;
references in later declarations do not supply it. There is no K record, reporter exposure
rule or claim of complete-correction-context exemption. Historical content remains explicitly
requestable under the new delivery rules. Origin-free selection is a relevance example,
not an exhaustive automatic context policy.

RESULT-Q4 includes orientation, pattern identification and scenario associations. Exact
captures stay fixed. Later supersession of one association does not rewrite its original
owner or the result designation; explicit result redesignation is separate. A nested
occurrence selection delivered from this result retains RESULT-Q4 context and the exact
designation/association route; it is not exposure to every future designation of RESULT-Q4.

Pattern definitions still share Q4's actual generating context. A later supersession of a B association actually delivered to Q4 can flag Q4's
evaluation and its result designation and reach a consumer receiving an ordering definition
through its source provenance. Splitting outputs into children does not isolate that path.
This remains a concrete cost: the definition may need no substantive revision yet receive
an uncleared warning. Association precision does not automatically provide per-output
exposure or semantic independence.

Contrast an identity established with less relevant incoming context. A separate evaluation
can narrow exposure, at an orchestration cost; necessary evidence must not be withheld to
avoid warnings. Before drafting, choose acceptable conservative warning costs, finer
exposure/propagation, or a bounded qualified reassessment mechanism. This probe implements
no clearance. Known causes must accompany fresh deliveries and are not subsequent changes
to those deliveries; this timing distinction does not establish claim-level independence. The [partition guidance](../contracts.md#provisional-partition-default)
now treats qualification scope and evaluation boundaries separately.

## State-change representation remains partial

Both traces describe entering Half-open in an `action` and assert Half-open in the
later situation. Neither action references a structured transition record. The text
is an attributable claim, but the snapshot is only an after-state assertion; a
renderer must not reconstruct a statechart from these fields. TRIAL-1's state model
is scoped to its earlier scenario and cannot be rebound automatically. If transition
identity, guards, effects or cross-type traceability become needed, investigate either
a general P-level recovery model or a state-behavior item for this scenario. This
probe supplies neither. The sequence-diagram proof consequently does not establish
adequacy for a statechart.

## Diagram proof and its limits

The concept is **Interaction / trace-oriented behavior**, and the reference diagram
type is a **sequence diagram**: SEI *Documenting Behavior* §6.2.3, already indexed in
[the reference notes](../../initial-journey/architectural-concept-references.md#interaction).
Snapshot summaries point to explicit resource/state assertions in their legends; we are not
claiming the reference defines this JSON or a standard resource-occupancy notation.

- [Bulkhead outside breaker, with legend](bulkhead-outside.md) ([Mermaid input](bulkhead-outside.mmd)).
- [Breaker outside bulkhead, with legend](breaker-outside.md) ([Mermaid input](breaker-outside.mmd)).

A small [fixture tool](check-and-render.py) checks references and uses the shared
[overview generator](../render-overviews.py) to write/check Mermaid inputs, keyed
legends and [traceability](diagram-traceability.json) from the structured records. It
adds layout/notation only: it does not calculate occupancy, infer waiting, merge role
identities or transfer Half-open between bearers. Captions show the scoped prefix;
the complete qualifications and evidence remain in the linked investigram and this note.
Rendering is a limited proof of sufficiency, not the proposed presentation system.

Verification: the [current lifecycle and guidance checks](../README.md#verification)
cover both partitions. This probe passes its additional role, relation, situation,
delivery and diagram-input checks, rejecting five malformed payload copies plus
nine invalid nested selections (including a selection with ambiguous target data).
Mermaid renders
both sequences, and image previews were inspected. Source applicability and reachable
setup were reviewed manually; these checks do not verify the truth of arbitrary
submitted claims. The diagram generator does not display causal links as additional
arrows; they remain explicit, inspectable content in each step.

## Recommendations to discuss

1. **Keep the new scenario details local for this probe.** Introduce the two pattern
   entities and reuse P/B/S; role variables and keyed relation content remain local
   structural addresses. A later investigation of a designated wait can explain that
   content, reuse an existing entity or explicitly introduce one. There is no promotion
   threshold. Test that follow-up before concluding local addressing is sufficient at
   the application boundary.
2. **Retain explicit situations, but leave their final type open.** Resource ownership,
   occupancy and whether application work has started are necessary meaning here;
   an ordinary arrow sequence cannot supply them by itself. Whether situations belong
   inside interactions or in a separate catalogue type is now a concrete question.
3. **Do not import the old trial model as a general template.** Its roles and trace
   remain scenario-specific. This composition uses the general admission investigram,
   qualified comparison and fresh source-backed synthesis. A general trial model
   would require another analysis, not just substituting role names.

The first bounded capability can still be admission → trial → correction. Composition
has exposed additional content/addressing needs without demonstrating a new core
identity type is necessary. Identity/migration guarantees, support-selection bounds,
interpretive Lens options, declaration standing and reconsideration precision remain open. This fixture exercises
neither end-to-end investigation nor the current API's acceptance of these payloads.
