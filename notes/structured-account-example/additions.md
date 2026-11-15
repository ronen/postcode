# Association and inventory exposure: addition probe

Updated 2026-11-12. Exploratory authored boundary experiment, not an adopted protocol,
live investigation, product implementation or qualified clearance operation.

**By-reference boundary control:** either addition marks **0/7 original evaluations and 0/8
original result designations**, compared with 5/7 and 7/8 under the earlier entity-wide rule. None
of those original evaluations received an inventory or scoped context selection. This is not
an estimate of realistic warning frequency. The [discovery follow-up](acquisition.md) adds Q2
inventory discovery and content retrieval to that baseline and reaches **3/7 and 4/8**. An extended branch explicitly requests
an inventory of Half-open's associations, then consumes that investigation's result: either
addition marks **2/9 evaluations and 2/10 designations**, one directly and one by inherited
producer provenance. Both partitions give the same counts.

## What is being compared

[Authored inputs](addition-probes.json) and the [generated report](addition-report.json)
have corresponding [partitioned inputs](children/addition-probes.json) and
[partitioned report](children/addition-report.json). Each report reproduces the earlier broad
rule under `earlierEntityWidePolicy` and the current rule under `associationInventoryPolicy`.
The old rule is a comparison, not an investigator-selectable exemption or recommendation.

Both additions target Half-open (S), with role `topic`, and displace nothing:

| Branch | Added associated information | Interpretation limit |
| --- | --- | --- |
| Category clarification | Half-open is a state category, distinct from a particular breaker instance. | Makes an existing distinction explicit; no new admission or transition rule. |
| Recovery caveat | An error not matched by the failure policy is recorded as recovery success and still delivered to the caller. | Keeps the retained default single-trial scenario's qualifications. |

Both re-express information already in the retained example; the caveat is explicit in
TRIAL-1. They test newly associated information, not new source discovery. Semantic novelty
is not detected mechanically. Equal treatment of these two additions remains expected.

The unchanged baseline is Q1, Q-observer, Q-excerpt, Q2, Q-updated, Q-role-only and
Q-reference-only. Q2 designates both its own result and an updated Q1 answer, so the baseline
has eight designations. Existing waiting-omission displacement concerns remain; zero here
means no new cause from either tested addition, not that all baseline results are clear.

## Current boundary contract

**Association exposure** records the exact association uses and qualified content actually
supplied. Initial identifying information named by exact reference is such a delivery; it
does not silently include all other entity information. Initial context selected by scope,
such as all undisplaced identifying descriptions, additionally records that selection dependency
and time. See the [acquisition refinement](acquisition.md); a separate list need not be shown. Exact
supersession/withdrawal continues to affect those recipients and exact result memberships.

**Inventory exposure** records a separately requested availability snapshot, with its entity,
scope and actual delivery position. The fixture selection is:

```json
{"entity":"S","associations":[],"items":[],"options":[],
 "inventory":{"roles":["identification","topic"]}}
```

The returned `inventory` contains entity, roles, coverage, retained-state position and an
exact list of association addresses/roles. It includes **all retained associations in scope,
including displaced ones**. It reports neither current standing nor substantive summaries,
reasons, definitions, names or member content. Entries do not create exposure to the producing
investigations or establish understanding of listed content. References can be reused if structurally
valid; doing so does not fabricate content exposure or certify instruction compliance. Content acquisition
is a separate explicit delivery. This is a small complete-list fixture; general pagination,
ranked search and current-only inventories are not specified here.

A later **addition or supersession introduces an association entry**. It affects a previously
delivered inventory when the entity and role match its declared scope, even if that inventory
was empty. An already accepted entry is part of the captured inventory, not a later change.
Withdrawal does not remove an entry from this all-retained inventory or change any field it
contains; exact-association displacement effects remain. A future current-only or status-bearing
inventory would need explicit rules for removals/status changes too.

The producer excludes its own causes. Exact cause references and conservative propagation
through later deliveries remain. A fresh inventory read after an addition creates no warning
for that already-present association. Refreshing only an old inventory does not deliver the added
content. The [production-update probe](review-alignment.md) additionally checks substantive update
delivery before submission; this does not clear completed contributions. Receiving content before
an addition, but first requesting inventory after
it, does not create retroactive inventory exposure.

Fixed result membership is **not** inventory exposure. Adding another association to S does
not itself affect a result merely containing S's description. Displacing an exact member
still creates a membership concern. An inventory-affected producing evaluation can still
pass its concern to its results and their actual recipients. This prevents the old broad
trigger from reappearing through designation membership.

Automatic delivery of every other association's reason is removed. Relevant displacement
and inherited-cause context for actually supplied material still accompanies it. A substantively
supplied declaration reason exposes that exact declaration to later displacement, without
supplying its referenced members or fulfilling the complete-support acquisition instruction. For example,
freshly receiving Q-inventory's result after an addition discloses its known cause; merely
requesting S's original description does not pull in every added S association. No blanket
exemption for interpretive reasons has been introduced.

This is an investigation-boundary contract. It does not prescribe dialog tools, user menus,
a universal initial context selector, or notification behavior. Substantive listing summaries
would be content exposure in addition to inventory exposure; this fixture deliberately uses
only mechanical entries.

## Observed propagation

| Recipient/result | Earlier entity-wide rule | Revised association/inventory rule |
| --- | --- | --- |
| Q1 evaluation | No cause from either S addition. | Unchanged. |
| Original Q1 designation | S membership triggered a new-information cause. | No addition cause: exact membership is not an inventory. Existing displacement standing/causes remain. |
| Q-observer, Q2, Q-updated | Direct entity-scoped causes. | No addition causes: supplied associations, no inventory. |
| Q-excerpt | Inherited through automatically supplied Q-observer association reason. | No addition cause. That unrelated association is not automatically supplied. |
| Q-role-only | Inherited through Q2. | No addition cause: Q2 did not receive an inventory. |
| Q-reference-only | Unaffected. | Unchanged; bare identity is neither exposure kind. |
| New Q-inventory | Not part of earlier baseline. | Direct inventory cause. Listed content was never delivered. |
| New Q-inventory-dependent | Not part of earlier baseline. | Inherits Q-inventory's concern through actually received result content/provenance; does not itself acquire inventory exposure. |

For each independent addition: **0/7 evaluations and 0/8 designations** in the original
baseline; **2/9 and 2/10** after adding the inventory reader and its downstream recipient.
In the cumulative extended branch, an additional inventory reader arrives between additions.
The second addition marks **3/11 evaluations and 3/12 designations**: the two earlier recipients
plus that intervening reader. The first addition's producer did not read an inventory and
therefore does not acquire the second cause merely because it concerns S.

Role-filtered `S/identification` and other-entity `R/describes` inventories do not react to an
`S/topic` addition. An empty `S/topic` inventory does react. Superseding S's identifying
association still affects its exact content recipients and containing designations; it also
adds an entry to an earlier `S/identification` inventory. Historical content, captured inventories,
answers and original association standing are unchanged by the two pure additions.

## Assessment and remaining limits

This removes structural overreach without asserting that either addition is harmless. The
new trigger means “your available selection has expanded,” not “you received content that is
now false.” The remaining inherited warning on the downstream inventory-result control can
still be semantically unhelpful; no per-output dependency assessment or suppression is inferred.

The earlier broad counts should no longer motivate bringing reassessment into first delivery
by themselves. The current proposal keeps additions conservative for actual inventory exposure.
A stronger semantic-impact probe would still include genuinely new information challenging
an earlier conclusion. It could expose a real coverage limit: an investigation that received
only a definition might benefit from new information without having requested an inventory.
The revised mechanism intentionally does not manufacture that unreceived inventory exposure;
its marks do not guarantee that every materially affected explanation has been found.

No automatic live “all information about S” designation is modeled. A future completeness
claim or live collection needs explicit treatment, not an implication from a fixed membership
list. ADMISSION-1 already contains an architectural coverage claim; whether to give such claims
a standing future-information dependency is deferred alongside investigator-directed propagation.
Observe the frequency and circumstances of missed impacts before choosing anticipatory dependencies,
later qualified impact assessment, or both; either supplements actual exposure tracking.
Runtime-domain coverage is not the same as completeness of a scoped retained-information selection.
The human accepts imperfect coverage, including a newly added waiting case that may challenge
ADMISSION-1 without a cause when there was no relevant scope exposure or explicit displacement. Investigator-directed propagation
could later complement structural causes: find candidate prior results through the exposure
index, inspect their question/content/support, then assert a qualified concern for an exact
result and new finding. A candidate is not an impact judgment; a concern would not fabricate
exposure or displace earlier information. No such lookup/concern contract is implemented.
Investigator-directed propagation, targeted suppression, reassessment/clearance and automatic
scheduling are deferred. Renewed assertions can use new associations to original qualified
content; general declaration revocation/reinstatement is deferred (see [contracts](contracts.md)).

At the boundary, inventory deliveries can be indexed once by their scope and position;
listing many entries need not create many content-exposure edges. Actual snapshots remain
preserved. Storage sharing, repeated-delivery indexing and transitive-cause computation are
implementation concerns; no performance bound or scaling benchmark is established here.

Reuse without acquiring its source association has no automatic exposure path from later
displacement of that association. This is an accepted coverage limit, not a reason to infer
exposure from an outgoing reference. Result membership contributes causes only for included
associations; a direct reference to the shared item is insufficient. A future audit can derive
references without recorded delivery. No retained audit flag or new dependency is added here.

## Manual assessment of likely changes

This section assesses the earlier entity-wide experiment, retained for comparison; those
marks are absent under the revised boundary. On 2026-11-12 the human asked whether the flagged outputs would actually be likely to
change on reconsideration. This is a reading of the exact authored questions, content and
memberships, not an executed qualified reassessment or permission to clear stored causes.
Assess each new addition alone; the earlier missing-waiting correction remains independent.
“Change” here means a warranted change to assertions, qualifications or designated membership,
not arbitrary wording differences from rerunning an investigator.

The five flagged evaluations are Q-observer, Q-excerpt, Q2, Q-updated and Q-role-only.
The seven designations below overlap those outputs: these are not twelve independent findings.
Q2 owns both its own result and the newer designation of Q1's result. Q1's original designation
is also marked through membership, although Q1's evaluation is not marked by these S additions.
The assessment is the same in both partitions; the table uses mixed-variant addresses.

| Flagged designation / producing evaluation | Category clarification | Recovery caveat |
| --- | --- | --- |
| ADMISSION-1::result / Q1 (membership only) | Probably unchanged: Half-open already has `classification: state-category`; the orientation distinguishes state from caller progress. | No necessary change to the admission/inspection answer. A caveat could enrich its explanation, but it does not establish an additional admission case or contradict its state identification. The already-known waiting omission has a separate cause. |
| OBSERVER-1::result / Q-observer | Probably unchanged: retains the original admission item, makes no new behavior claim, and does not confuse category with instance. | Probably unchanged for this cause: retains admission information, with no claim that recovery success proves application success. Its use of the old admission item still needs attention for the separate waiting correction. |
| EXCERPT-1::result / Q-excerpt | Probably unchanged for the same admission-specific reason; the incoming path is a notice, not a new category-dependent conclusion. | Probably unchanged for this cause; neither the association's purpose nor the admission item's assertion depends on outcome classification. The waiting correction still matters independently. |
| TRIAL-1::result / Q2 | Probably unchanged: already distinguishes S's state category, R's instance role and the participating executions in descriptions and structured relations. | Probably unchanged: `recovery.outcomeQualification` explicitly states the same caveat; the interaction explicitly classifies unmatched errors as recovery success. |
| TRIAL-1::updated-admission-result / Q2 | Probably unchanged: retains the original qualified identification and uses per-request instance roles in the new admission item. | No necessary change to this admission/inspection designation. Adding the caveat could be useful enrichment, but membership need not grow with every relevant addition. Waiting already explicitly promises neither execution nor success. |
| UPDATED-1::result / Q-updated | Probably unchanged: re-associates ADMISSION-2's admission item; no new conflation. | Probably unchanged: retains the admission table, not a claim about the trial caller's successful outcome. |
| ROLE-READER-1::result / Q-role-only | Probably unchanged: retains the recovery item, whose bearer R and state-category nodes are already distinct. | Probably unchanged: retains the exact recovery item that already contains the caveat. |

Sources for this assessment are [initial content](first-result.json),
[follow-up content](followup-result.json), the three consumer questions/outputs in
[lifecycle-probes.json](lifecycle-probes.json), and the additional controls in
[addition-probes.json](addition-probes.json). The original and newer Q1 designations are
admission/inspection answers, not exhaustive collections of everything known about Half-open.
Their optional enrichment is therefore distinct from a required revision.

For either addition, this reading finds **no clear required substantive change in the five
flagged evaluations' outputs or seven flagged designations**. That is not a demonstrated
zero-impact guarantee for their downstream consumers. No causes have been cleared, and no
statement is made about the unrelated baseline causes.

This also limits the earlier policy inference. Four of the five evaluations are intentionally
simple retain/re-associate probes. The substantive Q2 already contains both distinctions, and
the later additions re-express them. These are useful redundancy/organization stress tests,
but a weak sample for deciding how often genuinely new information warrants changed answers.
A stronger comparison would include an earlier explicit conclusion whose assumption is
actually challenged by later information, and trace that beside an unaffected conclusion.

## Verification

Run `python3 notes/structured-account-example/check-additions.py` from the worktree root;
`--write` regenerates both reports. The checker reproduces the earlier broad comparison and
runs the revised baseline, explicit inventory and cumulative branches in both partitions.
It checks direct/inherited causes, exact history/standing, empty/filtered/unrelated inventories,
separate acquisition timing, refresh, fresh inherited-cause disclosure, producer exemption,
and preserved exact-displacement behavior. It rejects **26 malformed inventory, disclosure or
unresolved-reference cases**, plus four historical broad-policy disclosure negatives.

The existing 72-case displacement regression, guidance, composition/selector and diagram
checks remain applicable. These validate authored mechanics, not live investigator quality,
semantic equivalence, suppression eligibility or production performance.
