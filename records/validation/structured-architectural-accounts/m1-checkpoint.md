# M1 common contribution mechanism

Date: 2026-11-15
Task: [Implement structured architectural accounts](../../tasks/2026-11-15-structured-architectural-accounts.md)
Plan: [Structured architectural accounts](../../../docs/plans/structured-architectural-accounts.md#1-common-contribution-mechanism)
Starting revision: `8a7f2834470644726dd742a0ddaeb1455bac3b2a`
Implementation: `1f7e1ec8a2aafd3e0f4b28ffb7fdfa5815a081ae`
Reviewed in round 4: `2b9fce8823577cc16b94554142d3eb6db3672d33`
Reviewed in round 3: `5ebe10a19be93a2613ec5fe5cf5f5dcaf16df295`
Reviewed in round 2, by two reviewers: `b02c7bcdd59e4253dbe9cddb761c590bb52ca360`
Reviewed in round 1: `84c1cc16f70f3b384a6d772aa3bcb8fda70836b5`
Initial implementation, before the recorded follow-up: `2bc5b862d8a4acfd85463525c0abe80def0f46b2`

## Scope reached

Milestone 1 defines the producer/contribution boundary and implements identities, typed content, immutable declarations, Query-result designations, exact retrieval, recorded exposure, standing and cause propagation in `src/lib/contributions/`. It is exercised by controlled producers only. No existing capability was migrated and no existing source path was changed apart from two new method-version entries in `src/lib/identity.ts`. This milestone does not demonstrate the real application path.

The [architecture account](../../../docs/architecture/contributions.md) describes the mechanism. The schema below is recorded for review. Field spellings are exploratory implementation choices, not binding contracts.

## Concrete schema

| Record | Content | Identity |
| --- | --- | --- |
| Entity | kind, modality, optional native identity (provider, rule, scope, key), introducing investigram, acceptance position | Session-scoped digest of the scoped native tuple, or of the introducing investigram and local key |
| Invocation | operation, ordered subjects with roles, parameters, explicitly selected context, result-contract identity, Query result, fresh flag | Session allocation in request order |
| Query result | originating invocation | Derived from its originating invocation |
| Production | producer (mechanism, method, agent provenance), invocation, opened/concluded positions, outcome, deliveries, supplied program evidence, producer report, investigrams | Random, or a caller-supplied attempt identity |
| Investigram | production, local key, provider contribution key, acceptance position and ordinal, owner qualification, referents, items, declarations, options, illustrations, inconsistency reports | Digest of production and local key |
| Content item | key, type, contract-accepted body, referents, program evidence, cited content support, contract dependencies, local components, qualification | Owner plus key |
| Declaration | `add` (target, members, optional grounds), `supersede` (target, members, displaced uses, grounds), `withdraw` (displaced uses, grounds); each with qualification | Owner plus key; `add` and `supersede` establish an association at that address |
| Qualification | epistemic status, producing method, scope, guarantee, limitations, provider Claim-context references | Embedded |
| Delivery | `item`, `association`, `declaration`, `scope`, `notice`, `metadata`, `discovery`; each with its delivery position | Ordered within its production |

Association targets are an Entity with the identification role, an Entity with a topical role and producer-chosen topic key, or a Query result. Members are exact items; result designations can also select associations. Subjects are an Entity, an investigram, an exact content selection with optional component, a designation, or a non-Entity scope designation.

Derived values are `Standing` (standing or displaced, with the displacing declarations), `Cause` (the exact change declaration, its operation and position, its routes and the current standing of what it established), `InvestigramStatus` and `AssociationStatus`. Each status names its derivation method, `postcode/contribution-status@1`, and the ledger position it was derived at.

## Implementation choices offered for review

These follow the implementing agent's reading of the decisions, revised after human feedback on 2026-11-15 recorded in the task follow-ups. That feedback confirmed choices 1, 2, 6 and 12 as consistent with the adopted contracts and asked for the rationale of choices 1, 5, 6 and 9 to be clarified. It is preparation for independent review, not checkpoint acceptance.

1. **Common IDs are deterministic digests, not random values.** A native Entity's ID derives from provider, rule, scope and key together; an introduced Entity's from its introducing investigram and local key. The native key is never the ID and equal keys in different scopes give different Entities. The adopted contract does not require random IDs. Scoped digests support identity resolution and stable references within the Session; they establish no cross-session or cross-basis equivalence. Deterministic IDs do not by themselves give deterministic semantic ordering; choice 9 states what does.
2. **A supersession's displaced uses must share the new use's Entity and role class, or its Query result.** This implements the declaration contract: a change to another target is withdrawal plus addition. Topical uses with different topic keys are compatible, so an investigating agent can explicitly replace a topic with a differently named one and explain why. Structural validation does not judge whether the two topics are semantically equivalent.
3. **A newly introduced non-native Entity must receive an identification addition in the same submission.** A native Entity that resolves to a retained identity needs none, which is what lets equivalent recomputation reuse it without a new association.
4. **Program evidence references must have been registered as supplied to the citing production.** References to retained content, including grounds support, reuse members and inconsistency endpoints, need only resolve. No prior-delivery gate applies to them.
5. **Agentic qualification is always interpretation, and cannot adopt a provider Claim context as its own.** A stated stronger status or a guarantee is rejected rather than ignored, and at least one limitation is required. Mechanical qualification must state its status and at least one of guarantee, limitation or context. The `contexts` field is explained under [Qualification contexts](#qualification-contexts).
6. **A designation's recipient acquires later displacement of the designation's member associations through membership.** This implements the intended propagation contract: when D designates association A, a producer receives D and A is later displaced, that producer has a cause routed through D's membership. The route records membership only. Receiving D is not delivery of A or of A's content, and no such delivery is recorded. The same timing and notice rules apply as on every other route.
7. **Whole-investigram delivery records each association declaration as an exact use** and each withdrawal as delivered grounds, in addition to each item and metadata entry.
8. **A scope addition accepted in the same batch as the acquiring production's own submission, by another production, is a cause.** It was not disclosed to that producer before it finished.
9. **Positions are counts of accepted submissions, and ledger enumeration follows acceptance order.** Associations within a scope, including standing alternatives of a Query result, enumerate by acceptance position and then position in the pool. That enumeration is stable and repeatable for the same retained information and is not derived from identifiers. It is not a semantic order: it changes when independent contributions arrive in a different order. Mechanical answer ordering is a separate responsibility. A mechanical Lens must order its content by its method's own semantic keys, as the existing constructors do, and must not take order from ledger enumeration or from IDs. Nothing in M1 constructs a mechanical answer, so this is not yet demonstrated; see [M2 obligations](#obligations-carried-into-m2).
10. **An attempt that returns no contribution is retained as a production** with its outcome reason and deliveries and no investigram. Reuse policy for such outcomes stays with Evaluation and is not implemented here.
11. **A fresh request with no earlier equivalent invocation creates a new Query result.**
12. **The ledger is a separate Session-owned component**, not a set of new record kinds in the program record store. The decisions require one consistent identity and information contract, not one physical store. Content references program records through an injected resolver. What M2 must show for this to hold is listed under [M2 obligations](#obligations-carried-into-m2).

<a id="qualification-contexts"></a>
### Qualification contexts

A retained qualification is the Claim context of the item, declaration or metadata it is attached to, attributed to the producing method. Its `contexts` field means: where that producing method retains this claim's own Claim context as provider Claim-context records, these are those records. It identifies the claim's own scope, guarantee and limitations in full. It is not a general citation field.

An agentic claim cannot have a provider Claim context as its own. The existing provider Claim-context record qualifies mechanically derived findings only: its status is fixed as mechanically derived and it carries that method's guarantee. Naming one as the context of an interpretation would attribute a mechanical method's qualification to an interpretive judgment. The decisions rule that out directly: structure or acceptance does not raise a claim's guarantee, an agent-authored qualification can caveat but not raise epistemic status, and an organizing contribution does not confer a finding's method guarantee on its own judgment.

This restricts that one field. It does not restrict qualified reuse, which has three supported paths, each verified by a contract test:

- **Reference the content.** A declaration member or a support reference names another owner's item. The source keeps ownership, its original qualification including its own contexts, and its evidence. Delivery of the item supplies that qualification with it.
- **Cite the context as evidence.** A provider Claim-context record actually supplied to the production can be cited in an item's or grounds' evidence, like any other supplied program record. It then identifies supporting material without becoming the citing claim's qualification.
- **State the limitation.** The agent's own qualification can restate an applicable limitation in its own words, attributed to itself.

No new epistemic rule is introduced. The only change made in response to the feedback is to report this case with its own message naming the supported paths, instead of the message used for a stronger status or guarantee, and to state the field's meaning where it is declared.

One related point is not enforced: for a mechanical producer the ledger checks that each context reference resolves in the Session, not that the record belongs to the producing method. Mechanical wrappers construct these references themselves, so this is treated as a trusted internal contract. M2 is the first place it can be checked against real records.

<a id="obligations-carried-into-m2"></a>
### Obligations carried into M2

- **Mechanical ordering under reordered arrival.** Produce equivalent mechanical answers in Sessions where the same independent contributions are accepted in different orders: fresh, accumulating and reordered requests. Compare the full structured answers and rendered output under the shared reference-aware comparison policy in `test/comparison.ts`, without discarding ordering, relationships or qualification. An answer whose order follows acceptance enumeration fails that comparison.
- **Integration with existing program records.** Show one Entity identity per module, with the existing module record and the common Entity resolving to each other and no second interpreted version of a native Entity. Show that contribution content referencing claims, Claim contexts and source evidence keeps their qualification and rejects unresolved references, that both stores share the Session's lifetime and invalidation, and that no capability is left organizing the same information through both regimes after its migration.

## Contract tests

All are in `test/contributions.test.ts`, `test/contribution-exposure.test.ts` and `test/contribution-results.test.ts`, using `test/contribution-helpers.ts`.

| Plan verification area | Observations made |
| --- | --- |
| Acceptance and identity | Native resolution before allocation, same key within a scope, fresh identity across scopes, reuse by a later producer, distinct independent discoveries with equal names, 24 atomic rejection cases comparing retained state before and after, supplied-evidence eligibility, stable exact identity after identification withdrawal, ambiguous and historical name lookup, method-specific identification retained after an interpreted identification and after withdrawal, agentic reuse of mechanical content with the source qualification unchanged and no inherited guarantee |
| Organization | Addition, supersession, withdrawal, standing as of an earlier position, untouched unrelated uses and content, cross-owner reuse preserving ownership and qualification, declaration-only contribution, items-only contribution with later acquisition and association, separately attributed organizing judgment in one batch, qualified inconsistency without displacement, competing supersessions, supersession to a differently named topic, no reinstatement, explicit re-adoption |
| Results | Ordinary reuse of invocation and result, different result contract as a different request, fresh invocation keeping the repeated question's result, redesignation selected without a new producer, exact original access, historical selection superseded again to form an alternative, stable repeated enumeration, exact cross-investigram and nested membership, circular membership rejected, exact selected subject preserved after redesignation, reverse lookup of investigations |
| Exposure | Per-producer exposure within one batch, mechanical consumption of retained module identification versus independent discovery with native mapping, no exposure from read access or references, content shared through another use, baseline scope versus exact description, current-only versus all-history inventories, first acquisition after a change, refresh, exact notice versus refreshed listing versus none, notice without replacement content, post-submission notice refused, direct and transitive causes with the same change identity, known causes not re-entering, cause standing after a further displacement, discovery handles, whole-investigram delivery, disclosed excerpt, designation membership reaching its recipient with no content delivery recorded, and its four controls: address-only listing and discovery handle, the same content through an unrelated use, a change known at delivery, and an exact notice before submission |
| Outcomes | No submission, invalid submission without repair, repaired submission, accepted items-only partial result, accepted answer missing a required specialized form with its declarations in effect, producer-reported inability kept apart from the contract check, two standing alternatives with one meeting the contract, explicitly selected alternative, established empty result, last designation withdrawn then a fresh designation, fresh attempt with no organizing change, fresh addition, fresh supersession, abandoned fresh attempt, producer defect propagating |

The diagram, selected-content baseline, application-continuity and live-agent rows of the plan's verification tables belong to later milestones and are not covered here.

## Migration status by capability

| Capability | Status at this checkpoint | Applicable contract | Required by |
| --- | --- | --- | --- |
| Module and symbol identification, effective exports | Unmigrated | Pre-adoption provider, identity and qualification contracts | M2 for module identification and the exports needed for one answer; M3 for the rest |
| Dependencies, associated documentation, module composition | Unmigrated | Pre-adoption contracts | M3 |
| Repository/project organization, groups, containment, placement, properties | Unmigrated | Pre-adoption contracts | M3 |
| `summarize`, `explain`, `decompose`, `examine` | Unmigrated; investigram trees, whole-investigram correction, citation-based reconsideration | Pre-adoption progressive-investigation and execution contracts | M2 exercises an agentic investigation over retained mechanical information; M3 completes the cut-over |
| `inspect`, associated inspection, exact presentation, answer identity | Unmigrated | Pre-adoption qualified-construction and exact-answer contracts | M3 |
| State-dependent behavior investigation, state diagram, follow-up option invocation | Not available | New contracts | M2 |
| Explicit fresh investigation through the application API | Not available; the ledger supports fresh invocations | New contract | M3 at the latest |
| Exposure-index terminology in code and references | Not started | New terminology | M3 |

## Legacy check families

At this checkpoint no existing test is modified, removed or expected to fail. The inventory records the families the migration will touch, the semantic coverage to preserve, and the milestone by which each must pass again if it is intentionally unconformed in between. Exact tests will be named when a milestone actually changes them.

| Family | Test files | Expected effect | Restore by |
| --- | --- | --- | --- |
| Agentic acceptance, dialog and exposure | `investigation`, `investigation-integration`, `investigator-references`, `openai-investigator`, `chatgpt-investigator`, `assessment-budget` | Tree, correction and citation assertions replaced by flat contributions, declarations and per-producer exposure. Preserve evidence access, source-as-data, guards, repair bounds, usage, failure taxonomy, reference transport and credential exclusion. | M3; the paths the early slice shares, at M2 |
| Selection, revision and reconsideration | `investigation-selection`, `investigation-revisions` | Primary-replacement traversal, displaced trees and whole-evaluation exemptions replaced by standing, alternatives, membership and cause cases. | M3 |
| Exact presentation and answer identity | `retained-presentation`, `application-exact-compatibility`, `answer-identity`, `presentation-compatibility` | Semantic coverage preserved; snapshots change from revision trees to association, designation and status selections. | M3 |
| Application and worker journeys | `application-journey`, `application-client`, `application-lifecycle`, `application-cli-outcomes`, `application-boundary`, `application-services`, `execution-ownership`, `session`, `session-inputs`, `shell` | Preserved. Interpretive journeys are rewritten onto the new mechanism with the same direct/worker parity and lifetime checks. | M3, confirmed at M4 |
| Mechanical semantics | `discovery`, `expansions`, `exports-lens`, `dependencies`, `dependency-contract`, `dependency-projections`, `dependency-presentation`, `organization`, `organization-cli`, `repository`, `records`, `projection-content`, `processing-index`, `evidence-access`, `source-evidence`, `directed-graph`, `collection-selection` | Semantic expectations preserved unchanged. Retention and identity assertions adapt to common contributions. | M2 for module identification and exports; M3 for the rest |
| Identity, request and resolution | `foundation-identity`, `foundation-ownership`, `request-model`, `request-designation-input`, `subject-resolution`, `lens-extensions`, `method-provenance`, `verification` | Preserved, with responsible method versions advanced where semantics change. Zero/one/many lookup extended with historical names. | M3 |
| CLI, human output and observations | `cli`, `commands`, `human-output`, `output-boundary`, `source-disclosure`, `terminal-layout`, `observation-publication`, `feedback`, `work-attribution` | Preserved. Wording changes limited to the adopted contribution and status vocabulary. | M3, confirmed at M4 |
| Hosted authentication and accounting | `chatgpt-auth`, `chatgpt-diagnostic`, `assessment-usage`, `inputs`, `benchmark-analysis`, `compiler-candidate-paths` | No expected effect. | Not applicable |

## Corrections after review round 1

The [round 1 findings](../../reviews/structured-architectural-accounts/2026-11-15-m1-mechanism-round-1-findings.md) identified four conformance defects. All four were accepted as within the authorized scope, with no change to the adopted semantics.

| Finding | Correction | Regression coverage |
| --- | --- | --- |
| F1: a valid pool whose use selects content of a later investigram partially committed | Acceptance now prepares the owned immutable copies and the identifying names against the whole staged pool before changing retained state, and indexes declarations after every item is installed. The commit phase runs no content-contract code and no lookup that can fail. | The same identifying pool accepted in both orders, in one production and in independently attributed productions, with equal Entity, name, ownership and production resolution |
| F2: a bounded excerpt discarded the item's qualification | Every delivered item carries its type, own qualification, referents, evidence, support and dependencies outside the body. An excerpt bounds only the body. | An item qualified only on the item and one narrower than its owner, each delivered complete and bounded |
| F3: routed item delivery hid an already accepted displacement | Content delivered as a member of a use is acquired through one operation that first delivers the use with its grounds, standing and known displacements. Bare-item acquisition no longer accepts a route and remains independent of every use. | Complete and bounded member delivery after withdrawal and after supersession, the bare-item control, and a displacement after delivery as a later cause |
| F4: recorded deliveries aliased caller-owned objects | Each recorded delivery is an owned immutable capture. | Caller mutation of item, route and scope values and of a returned listing; the recorded history, its resolvability and the resulting causes are unchanged |

The reviewer judged the twelve implementation choices permitted or conforming and found no further consequential selection. Its remaining limits are carried forward unchanged: the qualification-context trust assumption must be checked against real record kinds, methods and scopes in M2, and the M2 obligations above are obligations, not evidence.

## Corrections after the second round 2 review

The [Codex round 2 findings](../../reviews/structured-architectural-accounts/2026-11-15-m1-mechanism-round-2-findings.md) found the round 1 corrections resolved with nothing further. A second reviewer of the same target, in the [Claude round 2 findings](../../reviews/structured-architectural-accounts/2026-11-15-m1-mechanism-round-2-claude-findings.md), agreed and found three further conformance defects over the whole mechanism. All three were accepted as within the authorized scope.

| Finding | Correction | Regression coverage |
| --- | --- | --- |
| F1: only an explicit notice made a change known, so a change fully delivered before submission was still a cause | A change is known by every route once that particular change was actually delivered before submission: as a notice, a disclosed displacement, the declaration's grounds, or the exact use it established. Record kinds stay distinct. A listing that reflects a change still does not make it known. | Re-delivery with disclosure, direct declaration delivery, the inherited variant, an addition known through delivery of the new use, and the undisclosed and refreshed-listing controls |
| F2: acquiring an addition or supersession by its declaration address delivered a use without exact-use exposure or displacement grounds | Such a declaration is delivered as the exact use it establishes. Only a withdrawal is delivered as bare grounds. | Equal recorded history through either route, a later displacement and a later member displacement as causes, and known withdrawal grounds disclosed for an already displaced use |
| F3: malformed scopes and excerpt bounds became recorded deliveries | A scope must be well formed and name an existing Entity or Query result, a topical scope must state a topic key or null, and an excerpt bound must be a non-negative whole number. Refusal happens before anything is recorded. | Eight malformed scopes, unknown baseline and designation targets, four invalid bounds, nothing recorded, and the valid null-topic and zero-bound controls. The earlier assertion that passed for an unrelated reason now checks its intended message. |

The correction of F1 treats delivery of an association as delivery of the change declaration at that address, as well as the cases the reviewer named. This follows from the same rule, since that delivery identifies the change, its operation and the uses it affects.

### Displacement context is not acquisition of the replacement

Recorded as a clarification of the existing delivery contract, at the human's direction in the task follow-ups. It was the reviewer's observation on choice 7 and introduces no new propagation policy.

When a producer acquires association A after B superseded it, A arrives with B's qualified displacement context: the exact change declaration, its operation, the use it affects, its grounds and qualification, its owner's provenance and a reference to B as the replacement. This is what the decision's "reasons" means here; it is never an explanation stripped of qualification or traceability. The delivery is recorded as delivery of that declaration's grounds. It is not acquisition of B as a use, nor of B's content.

If C later displaces B, that recipient does not acquire C as a cause. The historical displacement of A remains what it was: known context for a recipient who received A afterwards, and a retained cause, now shown with displaced standing, for one who received A before. C becomes applicable through an actual path to B: acquiring B as a use, acquiring B's content as a member of B, or an acquired scope that listed B. Receiving B's content apart from the use is not such a path.

The delivered explanation keeps its own provenance and exposure implications. Concretely, producing-context concerns of B's producer that are accepted after the delivery reach the recipient by the inherited route, because the recipient received content of B's investigram. That is a concern about how the explanation was produced, not about B's later standing.

The implementation already behaved this way. One focused test now distinguishes the three cases and their controls, and the delivered context names its replacement reference explicitly. No conflict with the governing text or with actual behavior was found.

### Observations carried forward from the second reviewer

Not defects at M1; each is assigned to the milestone that first meets it.

- Investigram and Entity local keys are unique across a whole batch, including independently attributed productions. Mechanical wrappers that batch providers must namespace their keys (M2).
- The shared producer boundary leaves a production open if the producer throws, and distinguishes only not-submitted and invalid-submission endings. Execution-limit, investigation-failure and communication-failure outcomes return with the agentic family, where the open production must be concluded or explicitly discarded (M2/M3).
- A producer report's answer must name result designations but is not checked against the production's own invocation result, and fulfillment does not consult it. The fresh-attempt path decides how a reported existing answer relates to fulfillment (M2/M3).
- Delivering a designation lists member associations as undelivered addresses without their standing. Nested designated-content acquisition must disclose members displaced before the designation was accepted (M2).
- A mechanical qualification's context reference is checked only for resolution. Real wrappers must check record kind and method (M2).

## Corrections after round 3

Two reviews examined the corrected mechanism. The [Claude round 3 rereview](../../reviews/structured-architectural-accounts/2026-11-15-m1-mechanism-round-3-claude-findings.md) of `5ebe10a` found its three round 2 findings resolved, agreed with the displacement-context clarification, and reported one remaining finding, R1. The [Copilot review](../../reviews/structured-architectural-accounts/2026-11-15-m1-mechanism-round-3-copilot-findings.md) of the pull request head made six inline comments; its sixth is the same issue as R1. All were accepted as within the authorized scope.

| Finding | Correction | Regression coverage |
| --- | --- | --- |
| Claude R1 and Copilot 6: a change disclosed as a concern on a later delivery still re-entered by an earlier route | Item, use, declaration and metadata deliveries now record the exact changes disclosed with them as concerns: the owner's producing-context causes and, for a use, its membership and content-owner causes. Those changes are known by every route, under the same rule as the earlier F1 correction. | The inherited and membership variants, each with an undisclosed control, and the recorded concerns themselves |
| Copilot 1 and 3: displacement entries and declaration entries were returned mutable | Displacement lists are returned as copies of frozen entries; declaration entries, item addresses and inconsistency addresses are frozen before they are indexed. | Attempts to truncate or alter displacements and to replace an entry's fields leave standing and exact access unchanged |
| Copilot 2: two open productions with one caller-supplied identity were accepted in one batch, the second overwriting the first | A batch containing two productions with the same identity is refused before anything is retained. | The batch is rejected with retained state unchanged; accepted separately, the second is refused and the first keeps its producer |
| Copilot 4: a method-filtered identification request defaulted to standing uses, so a withdrawn method finding disappeared | A method-specific request now defaults to all of that method's identifying findings whatever their standing. General access still defaults to standing uses, and an explicit choice overrides either. | The withdrawal test no longer overrides the default, and checks the explicit current-only and general all-history requests |
| Copilot 5: member delivery recorded the use before validating the excerpt bound | The whole request is validated before either part is delivered or recorded. | The malformed-request test now requires an empty history. Its earlier assertion had encoded the defect by expecting four leftover deliveries. |

The Claude reviewer noted that treating a disclosed concern as weaker than a notice would be a semantic choice the checkpoint should state. It is not treated as weaker here: a disclosed concern names the exact change declaration, its operation and the affected use or route, which is what the decision requires a notice to identify.

## Corrections after round 4

The [Codex round 4 findings](../../reviews/structured-architectural-accounts/2026-11-16-m1-mechanism-round-4-codex-findings.md) re-examined the whole mechanism at `2b9fce8` and reported three new defects and one concrete reproduction, O1, in an area earlier assigned to M2. All were accepted.

| Finding | Correction | Regression coverage |
| --- | --- | --- |
| F1: method-specific identification filtered by the producer of the organizing declaration | Selection follows the method that produced the identifying content. The organizing use and its standing remain available separately. | A finding and its organizing use from independently attributed producers in one batch, a different method's identification of the same Entity, and withdrawal of the organizing use |
| F2: retained excerpt deliveries did not state their actual coverage | An item delivery record carries the delivered and omitted extent of the serialized body. With the immutable item this identifies exactly what arrived, without a copy of the content. | Two bounds at one ledger position remain distinguishable after conclusion, each record recovers the delivered text, and complete deliveries carry no excerpt |
| F3: an error from the fulfillment check after acceptance reopened structural repair | Repair handling covers acceptance only. A failing check propagates with its original error. | With and without a repair allowance: one producer callback, the contribution retained, the production concluded as accepted, the original error preserved |
| O1: a fresh partial attempt was reported fulfilled by an earlier answer it did not return | An attempt's fulfillment is assessed over the answers it supplied or explicitly returned. An attempt that supplied none has the explicit status `no-answer-supplied`. A reported answer must designate the attempt's own invocation result. Assessment of the Query result as a whole is unchanged and separate. | A partial fresh attempt unmet while the earlier answer still stands, explicit reuse of an adequate existing answer fulfilled, and a reported answer for another Query result rejected |

O1 changes an earlier disposition. The second reviewer's observation that reported answers were not related to fulfillment had been carried into M2/M3. The reproduction showed the M1 producer boundary returning a false fulfilled status, and the governing text settles the behavior: an empty response does not satisfy a required form, while an exact existing answer can. It was therefore corrected here, not deferred. This is the implementing agent's scope judgment, reported to the human with this checkpoint.

The existing two-alternatives test changed accordingly: the attempt that supplied a compliant answer is itself fulfilled, and the request as a whole, with one non-compliant standing alternative, is not. Both are asserted.

The reviewer also reproduced the known open-production observation. The shared producer boundary now discards the production when the producer throws, so nothing can be submitted late; a regression covers it. Distinguishing execution-limit, investigation-failure and communication-failure outcomes still returns with the agentic family.

Two entries under the second reviewer's carried observations are thereby resolved at M1: the open production after a producer defect, and the relation of a reported answer to fulfillment.

## Known risks carried forward

- Baseline identification scopes produce an addition cause for every producer that acquired a baseline whenever any identification of that Entity is later added. The tests show the behavior on single Entities; its breadth on a real module population is unmeasured and is an explicit observation point at the M2 checkpoint.
- Status derivation recomputes all producing-context causes after every acceptance. It is linear in recorded deliveries and displacements per production and has not been measured on an accumulating Session.
- The separate ledger (choice 12) and acceptance-order enumeration (choice 9) are acceptable only if the M2 obligations above are met. Neither is demonstrated by M1.

## Verification

Run by the implementing agent on the implementation's content, offline, with no credentials or inference:

- `npm run check` and `git diff --check` passed.
- The three contribution test files pass **48/48**.
- The complete offline suite passed **716/716** with no skips in about three minutes: the 668 tests of the starting revision, none modified, and the 48 new tests.
- The initial implementation passed 697/697 on two complete runs, the round 1 review target 700/700 on one, the round 2 review target 704/704 on one, and the corrections of the second round 2 review 707/707 on one, the round 3 review target 708/708 on one, and the round 4 review target 711/711 on one. The round 4 reviewer's own two complete runs of that target passed 708/711, with three sign-in tests failing in its sandbox and passing outside it.

Three other complete runs had failures and are not counted as passes:

- At the initial implementation, one run reported 7 failures. Its output was truncated, so the failing tests were not identified. The worktree and its Git index were being modified during that run.
- At the round 1 review target, one run was stopped after two failures while the machine's load average was near 400, and one run at concurrency 2 took 70 minutes and failed 7 existing tests in five existing files. Six of those reported `Session invalidated: relevant inputs changed or could not be verified`, with individual tests taking two to seventeen minutes. No file in either failing set was changed by this task, and the contribution modules are not reachable from them.

The likely cause in all three is the environment: a slow or changing checkout makes repository capture and input validation time out or detect change. That explanation is inferred from the timings and error text, not established, and the same seven tests were not shown to pass and fail deterministically. The clean runs were made with the worktree untouched and normal machine load.

The baseline suite passed 668/668 at the starting revision before any change. These are implementing-agent checks, not independent review. Milestone 1 is implemented; the checkpoint review and Milestones 2–4 remain within the active task.
