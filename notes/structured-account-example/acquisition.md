# Acquisition scope and declaration disclosure: review follow-up

2026-11-12. Exploratory authored boundary probes, not product implementation, an agent
transcript or a semantic coverage-dependency mechanism. The [inputs](acquisition-probes.json)
and [report](acquisition-report.json) have corresponding [children inputs](children/acquisition-probes.json)
and [report](children/acquisition-report.json). Both partitions pass the same checks.

## Exact selection versus scope-selected initial context

Supplying an exact caller-named association makes no claim that every relevant association
was selected. In contrast, supplying **all undisplaced identifying descriptions of S** depends
on the available association population in that scope. This dependency exists even if the
investigator did not explicitly request a separate inventory list.

The bounded selector is:

```json
{"entity":"S","scopeSelection":{"roles":["identifies"],"standing":"undisplaced"}}
```

PostCode selects and delivers every qualifying association with its complete qualified content.
The delivery records `selectionScope` with entity, roles, `all-undisplaced-in-scope` coverage
and actual retained-state position. That scope guarantee accompanies the supplied content;
it is not an invented assertion that an unseen inventory was read. The normal `associationUses`,
`declarations` and `items` retain exact delivered references. Scope-based and by-reference
selection are alternative acquisition modes in this fixture, not silently mixed policies.

“Undisplaced” means no accepted displacement targets the association at the captured position.
It is not a truth/authority ranking; multiple competing undisplaced descriptions are all
selected. Withdrawing a replacement does not reinstate its predecessor. Ranking, representative
sampling and incomplete scope selection remain undesigned; the probe supports one explicit
complete policy, not a general context selector.

Q-scope-selected and Q-exact-selected initially receive the same identifying content. Only
the former has a scope dependency. Adding another identifying description affects Q-scope-selected
and a recipient of its result, **one direct and one inherited evaluation/designation**; the
exact-reference reader stays unmarked for that cause. A describes-role addition does not match
the identifies scope. Fresh scope selection after the identifying addition supplies both
qualified descriptions without a new retrospective cause. An earlier captured selection still
counts even if its evaluation finishes later. Historical scope selection is reconstructed at
its original position, not using today's displacement status.

This is the same selection-opportunity concern as an acquired inventory, generalized to
scope-based content acquisition. A standing architectural completeness dependency is not
introduced: all selected *retained descriptions* is different from all *program behaviors*.

## Discovery before retrieval in the follow-up

The original 0/7 evaluations and 0/8 designations result is explicitly a by-reference control.
It says nothing about normal warning frequency. In this branch the same Q2 question has three
successive boundary deliveries:

1. Its original selected result context and follow-up option.
2. A mechanical S inventory, scoped to identifies/describes.
3. The selected Half-open identifying association's qualified content.

The content is already reachable in Q2's initial context; the extra acquisition makes the
agent's discovery choice explicit rather than asserting a new architectural finding. These are
authored dialogue-shaped requests, not a live investigator choosing tools. The list itself
contains no prose summaries and grants no full-member evidence eligibility.

With this Q2 in the same seven-query history, either subsequent S/describes addition affects:

| Target | Route |
| --- | --- |
| Q2 | Direct exposure to the discovered S inventory. |
| Q-updated | Inherits Q2's concern through its actually supplied updated result declaration. |
| Q-role-only | Inherits Q2's concern through supplied recovery content. |
| Q2's own result and its updated designation of Q1 | Their generating evaluation is affected. |
| Q-updated and Q-role-only results | Their generating evaluations inherit the concern. |

That is **3/7 evaluations and 4/8 designations**, in both partitions. The original Q1 designation
is not marked by the addition merely because its members include S. No semantic suppression
or per-output independence was inferred. These counts show the effect of different acquisition,
not measured false-positive rates or a promise of low warning volume.

The review described the existing `investigations` dialog tool as returning 400-character
excerpts. In this checkout, [dialog listing](../../src/lib/investigation/context.ts:104)
returns bare references/pagination; [dispatch](../../src/lib/investigation/execute.ts:188)
uses that listing. The excerpts are in the separate [human-facing presentation](../../src/lib/investigation/associations.ts:29).
The review's broader discovery point remains valid. If substantive excerpts/summaries are
supplied to an investigator, record that content exposure as well as the availability scope.

## Exact exposure to a substantively supplied declaration

Fresh access to the original ADMISSION-1 admission association supplies ADMISSION-2's qualified
supersession declaration/reason as context. It does **not** supply ADMISSION-2's admission item.
The declaration's own exact address is nevertheless exposed. Later supersession or withdrawal
of that declaration can therefore affect its recipient directly, without waiting for the
producing evaluation to acquire a concern.

The model derives this exact exposure from the already captured `notices` map alongside
`associationUses`. No second copy of the reason or redundant payload field is needed. Bare
references *inside* the supplied declaration do not recursively expose their targets. Full
`declarations` and member delivery remain separate eligibility requirements.

In the authored branch, Q-notice-reader receives the original admission content and the
qualified ADMISSION-2 declaration. WITHDRAW-UPDATE-1 then withdraws the revised admission
association. Q-notice-reader acquires that exact cause directly; Q2, the replacement's
producer, does not acquire it. A separate recipient of only a mechanical inventory containing
ADMISSION-2's address is unmarked by the withdrawal: its all-retained inventory still contains
the historical entry and never supplied the reason or current standing.

Fresh original-admission access now discloses both the supersession declaration and its later
withdrawal. Omitting that applicable context is rejected. A recipient of the fresh disclosure
is not warned retrospectively; a pre-withdrawal acquisition still is. The original displacement
fact remains retained, and no original association is automatically reinstated. Attempting to
withdraw ADMISSION-2 based only on its disclosed reason fails: its member content was not acquired.

## Coverage dependency is still a question

ADMISSION-1 already has an explicit architectural coverage claim. A newly added waiting case
could challenge that claim even if no retained-information inventory had been acquired. That
case has not been fixed, hidden or assigned an automatic dependency by this pass.

The unresolved choice is whether such claims should declare a standing change scope (for
example relevant future admission information), or whether their impact should be identified
by qualified later analysis, including the deferred investigator-directed propagation route.
A broad P/describes subscription would be conservative but includes unrelated policy descriptions;
a precise admission-behavior scope needs further semantics. Coverage of program behavior and
completeness of a retained-information selection must not be conflated. Discuss this choice
before adding any field or propagation rule to the model.

## Verification

Run `python3 notes/structured-account-example/check-acquisition.py`; `--write` regenerates the
two condensed reports of delivered references, scope, qualified disclosures and exact causes.
Checks cover scope/reference contrasts, new matching descriptions, source-time reconstruction,
later finishing evaluations, discovery/retrieval, direct notice-declaration displacement,
bare-reference controls, fresh disclosure completeness and full-member eligibility.
**22 malformed/ineligible cases** are rejected atomically across the partitions. Existing
addition, lifecycle, guidance, composition, selector and diagram checks remain separate regressions.
