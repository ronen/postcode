# Composition probe: where a wrapped execution waits

Exploratory working notes, 2026-11-11. This is a first authored continuation of the
[children variant](../children/README.md), not an adopted design or an executed
investigation. It tests the [proposal's composition question](../../structured-architectural-accounts-proposal.md#composition-as-a-design-probe).
It does not change product code or broaden the first implementation scope.

## The question and the two cases

Select Circuit breaker P and Bulkhead B and ask: **in either wrapping order, what
can be waiting, whose state is Half-open, and which capacity is occupied?** No
originating explanation is presumed. The fixture explicitly treats P/B as an
unordered set of component policy kinds;
input position assigns neither outer nor inner. Both orderings are requested. The
input operation/multi-subject Lens offer remains a design question, not an API.
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

## Evidence and prior accounts

The pinned revision remains `f48bea55022ab15ab07eb52a79bfc1e661300fd4`. Static inspection
checked three mechanisms:

- [Policy wrapping](https://github.com/connor4312/cockatiel/blob/f48bea55022ab15ab07eb52a79bfc1e661300fd4/src/Policy.ts): ordered invocation of the supplied, existing policy instances.
- [Bulkhead execution](https://github.com/connor4312/cockatiel/blob/f48bea55022ab15ab07eb52a79bfc1e661300fd4/src/BulkheadPolicy.ts): an active slot spans the awaited inner operation; pending queue entries are distinct from active work.
- [Breaker execution](https://github.com/connor4312/cockatiel/blob/f48bea55022ab15ab07eb52a79bfc1e661300fd4/src/CircuitBreakerPolicy.ts): trial reservation precedes invoking the supplied operation; an occupied trial causes later executions to await its decision.

Combining these establishes new, qualified overlap claims. ADMISSION-2 supplies a
bounded general admission account; TRIAL-1 supplies a scenario comparison; neither
establishes wrapping semantics alone. The new `application-of-components` prose
items explain the use and limits of each contribution. Earlier accounts remain
PostCode interpretations, never independent repository evidence corroborating the
same claim. The evidence ledger distinguishes them from source inspection.

1. [Bulkhead result](bulkhead-result.json) supplies a separate orientation,
   identifying child for B, and bounded capacity/queue child BULKHEAD-1. Initial
   mechanical-module availability is a fixture precondition, not demonstrated discovery.
2. [Composition result](composition-result.json) supplies an orientation root,
   identifying child for the two patterns, and one behavioral child per order.
3. [Context and bindings](context-and-bindings.json) records delivered own content,
   allocation, K history disclosure, the retained answer and two checked follow-up
   designations.
   All records continue this children variant's hypothetical Session only.

```text
COMPOSITION-RESULT-1       orientation, not a restatement of waiting rules
├── COMPOSITION-DEFINITIONS-1  C-BB and C-BH: ordered patterns only
├── COMPOSITION-BB-1        bulkhead outside breaker
└── COMPOSITION-BH-1        breaker outside bulkhead
```

Earlier component accounts are supplied context and exact links, **not adopted
children** of the new result. Pattern definitions have no sampling/capacity exclusion;
behavioral children carry their own applicable sampling, interference and scenario
conditions. The general pattern does not promise that a wait occurs.

## What identity means here

| Designation | Reused or new? | Meaning and limit |
| --- | --- | --- |
| P and S (Half-open) | Reused from earlier accounts | Policy kind and state category; reuse does not broaden earlier behavior. |
| B | Introduced by the separate bulkhead investigation | Policy kind, not an observed bulkhead instance. |
| C-BB and C-BH | Explicitly introduced shared subjects | The two ordered patterns, useful as primary results for later investigation. |
| `breaker`, `bulkhead`, execution roles | Item-local variables | Bound once in each scenario. Equal keys in the other item do not identify the same object. |
| `recovery-wait`, `capacity-wait` | Item-local relationship designations | Different relationships with different awaited conditions. Neither is earlier W. |
| Earlier R, E-trial, E-caller and W | Available with TRIAL-1's identifying support | Comparison context only; no identity with these new scenario participants is asserted. |

The contextual state claim is explicit: **bearer = this item's breaker role,
category = S, situation = waiting-cut**. It does not allocate another Half-open or a
universal contextual-identity object. Exact account/item/role/situation designation
suffices to revisit it in this example. A subsequent investigation can introduce a
shared subject with that designation as its qualified origin if continuity needs it.

This deliberately tests leaving the new relationships local. Giving every role and
relation an ID now would simplify cross-item references but require reusable identifying
support for every scenario detail. Conversely, local variables make cross-item reuse
more expensive: another account cannot use `{localRole: breaker}` to refer back here.
It must designate the exact prior occurrence and establish any correspondence, or
use an explicitly promoted subject. No renderer may match roles by spelling.

The probe therefore does **not** establish that contextual subjects or shared general
waiting relationships are never needed. It shows a smaller representation suffices
for these two explanations and exact follow-up selection. “Waiting for recovery in
general” would be a new abstraction with its own qualified account, not a rename of W.

## Small experimental additions to the content contract

The existing [shared envelope](../contracts.md#shared-roles-and-illustrations) is used
for `roles` and `roleScope` on interaction items. This is a second form using the same
role mechanism, without introducing an identity-binding illustration. Participants
may designate a local role instead of a retained subject. No illustration is needed:
the traces are new scenario accounts, not an assertion that an old trace generalizes.

The following are **probe-local extensions to `interaction/0`**, pending discussion,
not silently adopted fields of the earlier sample:

| Field | Meaning |
| --- | --- |
| `pattern` | Retained/introduction reference for the ordered pattern being illustrated by this scenario. It does not assert equality with a runtime wrapper. |
| `policyOrder` | Ordered local policy-instance roles for the composite execution path. Independent bulkhead-only work is explicitly outside this path. |
| `relations` | Keyed architectural relations scoped to this interaction, with typed endpoints, conditions and evidence. |
| `{localRelation: key}` | Resolves only in this item's relations. Wait steps and situation records can refer to it without allocating a subject. |
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
or extract a reusable situation/resource-lifetime form later. Extraction would need
explicit correspondence between that form's roles and the interaction's roles. Keeping
one item namespace avoids inventing that mapping now, but this sample consequently
does not validate cross-form or cross-account role binding. `policyOrder` is likewise
only the call order; it is not a full component-and-connector structural view.

### Nested selector grammar for this probe

Every nested selection has exactly `account`, `contentKey` and `selector`. The first
two resolve to an exact retained account and one of its `interaction/0` items.
`selector` is one of these two disjoint shapes; other fields and kinds are rejected:

```json
{"kind": "relation", "key": "recovery-wait"}
{"kind": "state-assignment", "situation": "waiting-cut",
 "bearer": {"localRole": "breaker"}, "category": {"subject": "S"}}
```

A relation selector resolves exactly one key in that item's `relations`. A state
assignment selector resolves one situation and exactly one assertion in its
`stateAssignments` whose bearer and category both match. It selects an asserted
state assignment, not a transition, every use of S, or a new subject. Merely finding
the role and category separately is insufficient. Duplicate matching assertions are
ambiguous and rejected. Keys remain scoped to the addressed item; bare role selectors,
arbitrary paths, combined selectors and migration to replacements are not defined
by this probe. Its checker resolves both follow-up selections and rejects malformed
or nonresolving alternatives. Selection addressing is now exercised; a subsequent
investigation or promotion from it is still not executed.

This does not make an occurrence an independent correction unit. Related-content
links locate earlier qualified interpretations; they neither adopt them into the tree
nor imply delivery. This request actually receives the accounts listed in the ledger.

## Retention, correction and access

For this origin-free request, supply the relevant current admission account
ADMISSION-2. Disclose K's reason, qualifications and endpoint references as history;
retain access to ADMISSION-1 without delivering its interpretation by default.
ADMISSION-2 is not itself corrected here, so this selection does not require supplying
the superseded target or claiming complete correction-context delivery. A later
explicit request for ADMISSION-1 must follow the existing corrected-content rules.
This is a proposed relevance policy for this question, not a rule to hide competing
accounts or omit requested historical context.

K's substantive explanation cites its reporter TRIAL-1, which is already supplied
in full. Bare references to the target do not cite ADMISSION-1. The resulting citation
set contains seven accounts. No new complete-K-context exemption is claimed; earlier
outputs produced with K retain their own cause-specific exemption. This example
proposes no new account relationship: architectural waiting/composition relations
are content, not correction metadata.

All four composition outputs share the investigation's actual exposure, including
the identifying child. Item evidence lists explain support; they do not narrow the
citation set. If BULKHEAD-1 is later corrected, the applicable reconsideration path
can flag both cases and the definition child. It establishes neither invalidity nor
which claim needs changing. Separate evaluations could narrow exposure, at a cost;
splitting the result tree alone cannot do so.

A later consumer receiving just COMPOSITION-DEFINITIONS-1 cites that account, not
its behavioral siblings. That still does not sever the definition account's own
prior-exposure history: if a cause reaches the definition, it can propagate to that
later consumer too. Narrower direct citation targets do not prevent this transitive
path. Here an ordering-only definition shares seven citations with the synthesis;
a later BULKHEAD-1 or TRIAL-1 correction can leave it flagged despite unchanged
ordering claims. The current slice has no clearance operation.

Contrast DEFINITIONS-1: its producing evaluation received only ORIENTATION-0,
so its consumers avoid the behavioral sibling's correction path without inheriting
this synthesis's broader context. This ties the [partition guidance](../contracts.md#provisional-partition-default)
to evaluation boundaries. The distinction concerns relevant correction paths, not
context volume alone; necessary evidence must not be withheld to reduce warnings.

This is now a concrete planning risk, not merely an unspecified future convenience.
Before settling the implementation package, explicitly accept the cost of uncleared
causes or prioritize a bounded qualified reassessment probe. Finer per-output exposure
is another design alternative, but changes the governing delivered-context semantics;
agent-declared evidence or claimed nonreliance cannot silently replace that record.
Separate evaluations can bound actual delivery at the cost of more orchestration.
No reassessment or narrower-exposure policy is adopted by these notes.

COMPOSITION-ANSWER-1 captures its selected accounts, identifying support, basis,
history disclosure and revision context. Exact access preserves them and the
original role designations;
fresh status or selection is separate. A future correction of a case replaces its
whole account, without mutating the old root, another case or its captured diagrams.
No same-named role or content key auto-migrates to a replacement. Reassessment and
clearing warnings remain outside this probe.

## State-change representation remains partial

Both traces describe entering Half-open in an `action` and assert Half-open in the
later situation. Neither action references a structured transition record. The text
is an attributable claim, but the snapshot is only an after-state assertion; a
renderer must not reconstruct a statechart from these fields. TRIAL-1's state model
is scoped to its earlier scenario and cannot be rebound automatically. If transition
identity, guards, effects or cross-form traceability become needed, investigate either
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
the complete qualifications and evidence remain in the linked account and this note.
Rendering is a limited proof of sufficiency, not the proposed presentation system.

Verification: the earlier two partitions still pass their checks and ten malformed
copies are rejected. This probe passes its additional role, relation, situation,
delivery and diagram-input checks, rejecting five malformed payload copies plus
nine invalid nested selections (including a selection with ambiguous target data).
Mermaid renders
both sequences, and image previews were inspected. Source applicability and reachable
setup were reviewed manually; these checks do not verify the truth of arbitrary
submitted claims. The diagram generator does not display causal links as additional
arrows; they remain explicit, inspectable content in each step.

## Recommendations to discuss

1. **Keep the new scenario details local for this probe.** Explicitly retain the two
   patterns, reuse P/B/S, and promote individual roles or relations only when subsequent
   use warrants it. We should test a later investigation of one designated wait before
   concluding that local addressing is sufficient in the application boundary.
2. **Retain explicit situations, but leave their final form open.** Resource ownership,
   occupancy and whether application work has started are necessary meaning here;
   an ordinary arrow sequence cannot supply them by itself. Whether situations belong
   inside interactions or in a separate catalogue form is now a concrete question.
3. **Do not import the old trial model as a general template.** Its roles and trace
   remain scenario-specific. This composition uses the general admission account,
   qualified comparison and fresh source-backed synthesis. A general trial model
   would require another analysis, not just substituting role names.

The first bounded capability can still be admission → trial → correction. Composition
has exposed additional content/addressing needs without demonstrating a new core
identity type is necessary. Interpreted identity guarantees, support-selection bounds,
interpretive Lens offers and correction standing remain open. This fixture exercises
neither end-to-end investigation nor the current API's acceptance of these payloads.
