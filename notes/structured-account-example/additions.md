# Conservative addition probe

2026-11-12. Exploratory authored experiment, not adopted policy, a live investigation,
or product implementation. This tests the proposed conservative default before deciding
whether first delivery needs suppression or reassessment.

**Finding:** a category clarification and a behavioral caveat each mark five of seven
prior evaluations and seven of eight prior result designations. The same spread occurs
in both partitions. Equal spread is expected from an entity-scoped rule without semantic
impact classification; the useful observation is its extent and the actual propagation paths.
This is evidence of broad warning propagation under the tested scope, not proof that every
warning is unnecessary or that every conservative policy must be this broad.

## Inputs and comparison

[Authored inputs](addition-probes.json) and the [generated report](addition-report.json)
have corresponding [children inputs](children/addition-probes.json) and
[children report](children/addition-report.json). Both additions target Half-open (S),
with role `describes`, and leave all prior associations standing:

| Branch | Added associated information | Why compare it |
| --- | --- | --- |
| Category clarification | Half-open is a state category; the particular breaker instance is a different kind of referent. | Appears complementary to the bounded admission/trial questions, without changing their rules. That is a reading of this example, not an investigator-certified harmlessness exemption. |
| Recovery caveat | In the retained default single-trial scenario, an error not matched by the failure policy is recorded as recovery success while still being delivered to the caller. | Potentially important to interpreting recovery success versus application success. |

Both use claims already present in the retained, qualified example. In particular the caveat
is already in TRIAL-1. This tests newly **associated** information, not newly discovered
source facts. Recipients may already know equivalent content through another association;
the mechanism has no semantic novelty test. The caveat keeps the scenario's limitations.

Each branch starts from the same seven-evaluation baseline: Q1, Q-observer, Q-excerpt,
Q2, Q-updated, Q-role-only and Q-reference-only. There are eight result designations because
Q2 also redesignates Q1's result. Ordinary baseline additions trigger too: the test does
not selectively enable only the two additions being compared. The original expansion,
reuse, withdrawal and competing-supersession chain remains a separate regression.

## Exact policy exercised

- A substantive delivery's new-information scope includes its organizing entity and the
  target entities of its explicitly delivered association uses. Role does not narrow it.
  A bare subject ID or a referent mentioned inside content does not expand it.
- An addition to one of those entities is a `new-information` cause for an earlier recipient.
  It does not mean that recipient previously received the new association or relied on it.
- An earlier result designation gets a membership cause when the addition concerns its own
  target entity or an entity targeted by a member association. Raw item-only membership
  does not infer architectural associations from the item's text.
- Existing evaluation-provenance propagation then applies, including provenance of qualified
  notices. The exact declaration remains the cause through every path.
- Only later changes count: compare acceptance against actual delivery, or designation
  acceptance for membership. The producing evaluation excludes its own causes. Known causes
  must be disclosed; an earlier acquisition remains exposed despite a later refresh.

For this experiment, fresh delivery discloses all existing, unsupplied additions in that
explicit entity scope as qualified notices. It does not deliver their new member content
unless selected. This is a deliberately broad **disclosure policy**, not a notification UI
or a settled relevance/discovery algorithm. Those notices carry producer provenance, so
broad disclosure can itself create future propagation paths. The report records delivered
notices, explicit scope and source evaluations so that this cost is inspectable.

The simulator's `conservative` versus `displacement-only` switch selects the experiment
as a whole. It is not an investigator-controlled harmlessness flag. Exact-association rules
for displacement remain unchanged in both modes.

## Observed paths

Either new addition has these effects:

| Earlier recipient/result | Effect and route |
| --- | --- |
| Q1 evaluation | None: it created S; it did not receive S as context. |
| Q1's original designation | Membership cause: includes S's identifying association. Its existing displacement standing remains separate. |
| Q-observer, Q2, Q-updated | Direct: their earlier deliveries explicitly included S information. |
| Q-excerpt | Indirect only: its P admission delivery included a qualified notice from Q-observer. Q-observer had received S information. This is notice provenance, not inferred S exposure from the admission prose. |
| Q-role-only | Indirect only: it received R's recovery content from Q2, whose evaluation had received S. S being mentioned in that content does not create a direct path. |
| Q-reference-only | None: subject/referent S without delivered information is not exposure. Its result is the sole unmarked prior designation. |

The independent comparisons each mark **5/7 evaluations and 7/8 designations**. Separating
identity into children does not reduce that spread: the path runs through the same generating
evaluations and explicit memberships. The existing qualification benefit of children remains.

In the cumulative run, the clarification is accepted, an informed consumer receives it,
and then the recovery caveat is added. The second addition marks **7/9 earlier evaluations
and 9/10 designations**, including the first addition's result and that intervening consumer.
The seven affected original designations now have both exact causes. Baseline causes are
reported separately; these counts are incremental for each new cause, not counts of newly
changed warning badges or a measured false-positive rate.

Fresh recipients informed of either or both additions have no new warning from those known
causes. Four deliberately incomplete disclosures are rejected. A recipient that acquired
context before an addition and refreshed after it still has the earlier cause. Earlier
investigrams, captured answers, deliveries and association standing are unchanged.

## Manual assessment of likely changes

On 2026-11-12 the human asked whether the flagged outputs would actually be likely to
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

## Assessment and recommendation for discussion

The timing and attribution rules behave coherently. The precision cost is substantial even
in this short chain. Category clarification reaches behavioral outputs; a caveat some
recipients already knew reaches them again; qualified notices add another indirect route.
The mechanism cannot distinguish useful review from redundant review by itself.

The manual assessment above narrows the earlier recommendation: these redundant additions
expose a real precision cost, but do not by themselves show that reassessment must be in first
delivery. They also do not justify a generic investigator assertion that an addition is
harmless, automatic scheduling, or a notification system. Before choosing scope, consider a
case where genuinely new information challenges an earlier conclusion. The policy alternatives
remain:

- Accept these conservative marks initially as a coarse signal that related information
  has grown, with explicit acknowledgement that they do not prioritize meaningful changes.
- Or include a bounded qualified target-and-cause reassessment, showing how one assessed
  path can stop while independent paths and causes remain.
- Review the tested entity/role scope and broad notice-disclosure policy before treating
  the observed breadth as inevitable. Reducing either needs an explicit completeness tradeoff;
  silently omitting context merely to reduce warning counts would not be a solution.

No option is adopted here. Suppression, clearance, reassessment and scheduling remain
unimplemented. These authored counts are useful design evidence, not a usability study,
performance benchmark or source-backed proof of semantic relevance.

## Verification

Run `python3 notes/structured-account-example/check-additions.py` from the worktree root.
`--write` regenerates the two reports. It checks both partitions, independent and cumulative
runs, cause identity, direct versus inherited paths, unaffected controls, timing/disclosure,
producer exemption and unchanged history/standing. The existing displacement, guidance,
composition, selector and diagram checks remain separate regressions.
