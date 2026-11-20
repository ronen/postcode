Record type: findings
Received: 2026-11-15
Reviewer: Codex (GPT-6), independent review session
Handoff: [M1 common contribution mechanism review](2026-11-15-m1-mechanism-handoff.md)
Round: 1
Reviewed target: `84c1cc16f70f3b384a6d772aa3bcb8fda70836b5`
Reviewed scope: `8a7f2834470644726dd742a0ddaeb1455bac3b2a..84c1cc16f70f3b384a6d772aa3bcb8fda70836b5`

## Returned findings

### Recommendation

Correct the four findings below before treating the M1 mechanism checkpoint as sufficient for M2. F1 breaks atomic acceptance of a valid flat pool; F2–F4 break qualified delivery or the integrity of actual delivery history. These are conformance defects within the assigned mechanism, not requests to accelerate later milestones or adopt new semantics. Recommend a focused further review of the corrections and their regression coverage. The human determines whether the checkpoint is sufficient.

### Method and verification

Reviewed all six contribution modules, the three contribution test files and helper, the changed identity method declarations, descriptive architecture and testing convention against the approved plan and four governing decisions. Read the relevant foundation, specification, core concepts, architectural constraints, task follow-ups and checkpoint choices. Inspected acceptance staging/indexing, exact acquisition, timing/notice propagation, status bearers and outcome assessment directly rather than accepting the handoff's reported checks as proof.

The checkout was clean at review start, at `e55c525`. Its only differences from the immutable target were the handoff and checkpoint records; the implementation and tests used for verification match the reviewed target.

Independent verification performed:

- `npm run check` — passed.
- `npm run build` — passed.
- `node --test _build/test/contributions.test.js _build/test/contribution-exposure.test.js _build/test/contribution-results.test.js` — **32/32 passed**, no skips.
- `git diff --check 8a7f2834470644726dd742a0ddaeb1455bac3b2a..84c1cc16f70f3b384a6d772aa3bcb8fda70836b5` — passed.
- Additional in-memory Node reproductions against the compiled target confirmed F1–F4, including successful acceptance when F1's pool order was reversed and acceptance of the malformed delivery history in F4. No implementation or test files were changed for these probes.

Used the installed dependencies; did not reinstall them. Did not rerun the complete offline suite, invoke live inference, or measure an accumulating real Session. The implementing agent's 700-test result and environmental explanations remain its evidence, not independently reproduced conclusions of this review.

### Actionable findings

#### F1 — P1: Identification indexing can partially commit a valid forward reference

Location: [ledger.ts:549](../../../src/lib/contributions/ledger.ts#L549) and [ledger.ts:571](../../../src/lib/contributions/ledger.ts#L571).

Acceptance correctly resolves a declaration member to an item anywhere in the staged pool, but the commit loop installs one investigram's items and immediately indexes its declarations. Identification indexing then calls `this.item(entry.item)`. If the identifying item belongs to a later investigram in the same pool, that item has not been installed yet. The lookup throws after the acceptance position, Entities, earlier investigrams and some indexes have already changed.

Reproduction:

1. In an empty ledger, prepare `finding`, introducing local Entity `e` and a qualified `identification` item `name`.
2. Prepare a qualified declaration-only `organizer`, adding an identification association for `{ local: 'e' }` whose member is `{ investigram: { local: 'finding' }, item: 'name' }`.
3. Accept the pool in order `[organizer, finding]`.

Observed: `Missing content item` is thrown; `position` is 1, one Entity and `organizer` are retained, no productions are concluded, and the production handles remain open. The Entity's introducing investigram is absent. `[finding, organizer]` succeeds. Reproduced both within one production and with independently attributed productions in one batch.

The [flat contribution contract](../../../docs/decisions/common-analysis-contributions.md#immutable-analysis-contributions) permits same-submission cross-owner organization without a semantic pool order, and requires atomic acceptance. This is particularly relevant to module identification migration: valid producer ordering must not corrupt the ledger.

Stage the information needed for identification indexes before mutating retained state, or install the complete validated item population before resolving cross-owner indexes while preserving the atomic boundary. Add a regression that accepts the same identifying pool in both orders, including separate producers, and checks consistent Entity, name, ownership and production resolution. Preserve the existing rejection-with-no-mutation checks.

#### F2 — P2: Bounded excerpts discard item qualification

Location: [production.ts:106](../../../src/lib/contributions/production.ts#L106), with the `DeliveredItem` shape at [production.ts:20](../../../src/lib/contributions/production.ts#L20).

When an excerpt is bounded, `item()` returns `item: null` and only the sliced body text plus its omitted-character count. The item's qualification exists only inside the omitted `ContentItem`. `DeliveredOwner.qualification` carries only the owner's qualification, so it cannot preserve narrower item limitations or replace a qualification supplied exclusively on the item. Evidence, support and item referents are also absent from this bounded value.

Reproduction: accept an investigram with no owner-wide qualification and one prose item qualified by `limitations: ['Only configuration A.']`. Call `handle.item(address, { excerptCharacters: 20 })`. The result contains substantive excerpt text, `owner.qualification: null` and `item: null`; the limitation and explicit interpretation status are nowhere in the returned delivery. This is a valid accepted contribution, not malformed producer input.

The [acquisition contract](../../../docs/decisions/association-organization-and-exposure.md#acquisition-baseline-context-and-discovery) explicitly requires excerpts to retain applicable source qualification. A character-omission count does not disclose loss of the claim's scope or epistemic status. This defect is in the already implemented excerpt primitive, independently of the selected-content baseline deferred to M2.

Retain item qualification and applicable attribution/support metadata outside the bounded body, alongside owner qualification. Test an item-only qualification and an item with a narrower qualification than its owner; assert that both full and bounded acquisition preserve the applicable limits.

#### F3 — P2: Direct routed-item delivery hides an already accepted displacement

Location: [production.ts:98](../../../src/lib/contributions/production.ts#L98); timing consequence at [status.ts:99](../../../src/lib/contributions/status.ts#L99).

The public `item(address, { route })` operation verifies membership and records exact-use exposure, but returns only the route address, item and item-owner context. It does not supply the route's qualification, standing or displacement grounds. Unlike `association(route, { content: true })`, it does not first deliver that context or require an earlier qualified route delivery.

Reproduction: create a qualified identification association A, withdraw A with grounds, then open a new production and call `item(A's item, { route: A })` directly. The returned value contains no withdrawal, standing or grounds. `pending()` is empty because the displacement predates this delivery. Thus the caller receives an exact displaced use without its required historical qualification, and the timing rule correctly does not generate a later-change warning to compensate.

The [acquisition contract](../../../docs/decisions/association-organization-and-exposure.md#acquisition-baseline-context-and-discovery) requires known displacement/reason/qualification context with displaced information and explicitly classifies missing disclosure as a delivery defect. The absence of a later-change cause is not clearance. Bare-item acquisition without a route should remain independent of unrelated uses; this finding concerns the explicitly selected route only.

Make routed acquisition supply the relevant qualified association context, or restrict the routed helper to an internal operation whose enclosing qualified acquisition guarantees that delivery. Test direct full and excerpt acquisition after withdrawal/supersession, distinguishing them from bare-item acquisition and from later displacements.

#### F4 — P2: Delivery history retains mutable caller-owned references

Location: [production.ts:80](../../../src/lib/contributions/production.ts#L80), [production.ts:105](../../../src/lib/contributions/production.ts#L105), and the shallow history getter at [production.ts:76](../../../src/lib/contributions/production.ts#L76).

`#record` stores the supplied delivery object without taking ownership of its nested values. In particular, `item()` stores the caller's address object directly. `deliveries` copies only the outer array. The later clone in `#conclude` captures whatever those objects contain at conclusion, rather than what was delivered. TypeScript's readonly parameter type does not prevent the caller from retaining and changing its own mutable object.

Reproduction: construct a mutable address for an existing identifying item, call `handle.item(address)`, then set `address.item = 'never-delivered'`. Accept a valid qualified consumer contribution. Acceptance succeeds and the retained production's delivery names `never-delivered`; resolving that item throws `Missing content item`. No such item was ever delivered. This required no cast, custom content contract or mutation of a retained investigram.

Actual acquisition history is the authority for reconsideration, so changing an input object must not rewrite it. The [exposure contract](../../../docs/decisions/association-organization-and-exposure.md#exposure-and-reconsideration) requires original actual deliveries to remain recorded; the acquisition contract also rejects malformed captured delivery records.

Capture owned immutable delivery values when recording them, and ensure public history/delivery access cannot mutate the internal record. Cover caller-owned item/route addresses, scope values and returned nested collections as applicable. Verify that subsequent caller mutation neither changes the accepted history nor invents/removes a cause.

### Checkpoint implementation choices

These judgments concern the choices' stated semantics. They do not waive the implementation defects above or the checkpoint's unperformed M2 obligations.

| Choice | Review judgment |
| --- | --- |
| 1. Scoped deterministic common IDs | Permitted. Provider, rule, scope and key are resolved together; introduced identities remain distinct. The human's clarification is consistent with the decisions. These IDs do not prove semantic ordering. |
| 2. Same-target, compatible-role supersession | Conforms. Entity and role class, or Query result, remain fixed; different topical keys need no semantic-equivalence validator. Cross-target change remains withdrawal plus addition. |
| 3. Identification for newly introduced Entities | Conforms. New identities need qualified identifying information; resolving an existing native mapping need not reassert identification. F1 concerns retaining a valid identification, not this requirement. |
| 4. Supplied program evidence versus resolvable retained references | Permitted. Source acquisition remains attributable while reuse, grounds support, displacement and inconsistency references gain no retired delivery-eligibility gate. Real wrappers must truthfully register supplied evidence. |
| 5. Meaning of qualification `contexts` | Permitted under its clarified narrow meaning: the claim's own provider Claim-context records, not a general source-context citation field. The existing `ClaimContextRecord` has mechanically-derived status. Referenced content and supplied evidence provide legitimate qualified reuse without transferring guarantees. Item-only source qualification is retained on acceptance, but F2 shows delivery does not always preserve it. The trusted mechanical-wrapper obligation still needs checking against real record kinds, methods and scopes in M2. |
| 6. Membership concerns reaching a designation recipient | Conforms to the adopted D/A example and the human clarification. The focused controls distinguish a received designation from address-only listing, discovery handles and unrelated reuse. The route does not fabricate member-content delivery. |
| 7. Whole-investigram delivery of declarations and metadata | Permitted. The operation actually returns these parts and records exact uses or withdrawal grounds. This alone does not demonstrate the later complete selected-subject baseline. |
| 8. Another production's same-batch scope addition | Conforms. It was not known at the acquiring production's delivery position. Own-declaration exclusion remains per production, not per acceptance batch. |
| 9. Acceptance-order ledger enumeration | Permitted as stable enumeration of a fixed retained population, with no authority or semantic-order claim. The explicit M2 comparison under reordered arrivals is necessary; native Lens ordering must come from the mechanical method. |
| 10. Retained no-contribution attempt | Permitted. It preserves actual attempt provenance/deliveries without fabricating an investigram. Evaluation's later reuse policy remains separate. |
| 11. First fresh request creates a result | Permitted. There is no earlier equivalent result to preserve; subsequent fresh attempts retain the repeated question's existing result. |
| 12. Separate Session-owned ledger | Permitted. One identity/information contract does not require one physical store. M2 must establish native/common identity mapping, qualified reference resolution, shared lifetime/invalidation and removal of competing organization for each migrated capability. |

I found no additional consequential semantic selection in these twelve choices requiring a new decision before correction. The stated M2 obligations for choices 1, 9 and 12 are sufficient as obligations, not as evidence already obtained. The qualification-context trust assumption must remain part of the real-record integration checks; it must not become a way to attach a different method's guarantee.

### Test independence, positive observations and remaining limits

The existing tests substantially exercise decision-derived distinctions: equal names versus identity, scoped native resolution, item ownership without association reachability, cross-owner reuse, exact displacement without reinstatement, qualified competing alternatives, separate production histories, direct/scope/membership routes, known-versus-later timing, notices versus refresh, and validity versus fulfillment. The negative controls for designation-recipient membership are particularly useful. Standing, membership, declaring-producer and direct foreign-content-owner concerns have separate representations; there is no merged Query-result warning set or global item displacement.

Coverage nevertheless misses the four discriminating cases above. The atomicity test rejects invalid pools during staging but never accepts a valid forward identifying reference. The cross-producer test puts the finding before the organizer and uses a topical association, bypassing name indexing. The excerpt test checks truncation and omission count with owner-qualified content, not preservation of item qualification. Known-displacement tests use the richer association delivery path. No test protects recorded delivery values from caller aliasing. Passing those tests therefore does not establish the missing invariants.

The representation otherwise appears capable of supporting module identification, exports and agentic integration without weakening the adopted rules, subject to correction and the stated migration demonstrations. Keep these remaining areas explicit:

- Real provider recomputation/reuse after withdrawal, method-specific identification, full qualified mechanical answer equality under reordered arrival, and shared Session invalidation are M2 integration evidence, not demonstrated by controlled mappings.
- Selected-content baseline construction, originating question context, required content dependencies and substantive delivery of nested designated answers remain later work. `undeliveredMembers` honestly reports that current association delivery has not supplied nested content; M2 must acquire it where the selected-subject contract requires it.
- Structured state content, diagrams, option execution, real dialog instructions, operational limits/cancellation and live instruction usability remain assigned to later milestones. Their absence is not an M1 defect.
- Representative retained-data growth, status derivation cost and baseline-identification warning breadth were not measured here. The checkpoint already carries them into the bounded accumulating-Session exercise.

This review changes only this findings record. It does not accept the checkpoint, modify task status, authorize implementation beyond the active task, or close or merge the task.
