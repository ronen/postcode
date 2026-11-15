# M1 common contribution mechanism

Date: 2026-11-15
Task: [Implement structured architectural accounts](../../tasks/2026-11-15-structured-architectural-accounts.md)
Plan: [Structured architectural accounts](../../../docs/plans/structured-architectural-accounts.md#1-common-contribution-mechanism)
Starting revision: `8a7f2834470644726dd742a0ddaeb1455bac3b2a`
Implementation: `2bc5b862d8a4acfd85463525c0abe80def0f46b2`

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

These follow the implementing agent's reading of the decisions. Each is a choice the decisions leave to implementation or a point where the reading is not forced; none was resolved by weakening a stated rule.

1. **Common IDs are deterministic digests, not random values.** A native Entity's ID derives from provider, rule, scope and key together; an introduced Entity's from its introducing investigram and local key. The native key is never the ID and equal keys in different scopes give different Entities. The decision text anticipates that common IDs may be random. Deterministic IDs keep mechanical semantic ordering independent of acceptance order without further work; random allocation remains possible behind the same mapping.
2. **A supersession's displaced uses must share the new use's Entity and role class, or its Query result.** Topical uses with different topic keys are compatible. Anything else is rejected and must be expressed as withdrawal plus addition.
3. **A newly introduced non-native Entity must receive an identification addition in the same submission.** A native Entity that resolves to a retained identity needs none, which is what lets equivalent recomputation reuse it without a new association.
4. **Program evidence references must have been registered as supplied to the citing production.** References to retained content, including grounds support, reuse members and inconsistency endpoints, need only resolve. No prior-delivery gate applies to them.
5. **Agentic qualification is always interpretation.** A stated stronger status, a guarantee or a provider Claim-context reference is rejected rather than ignored, and at least one limitation is required. Mechanical qualification must state its status and at least one of guarantee, limitation or context.
6. **Receiving an association also exposes its recipient to later displacement of its member associations.** The decision states the membership path for the designation itself and says consumers of a displaced designation can need reconsideration. Extending member displacement to the designation's recipients is the implementing agent's conservative reading.
7. **Whole-investigram delivery records each association declaration as an exact use** and each withdrawal as delivered grounds, in addition to each item and metadata entry.
8. **A scope addition accepted in the same batch as the acquiring production's own submission, by another production, is a cause.** It was not disclosed to that producer before it finished.
9. **Positions are counts of accepted submissions.** Enumeration of alternatives follows acceptance order, then position in the pool. It is stable and repeatable for the same retained information and is not derived from identifiers.
10. **An attempt that returns no contribution is retained as a production** with its outcome reason and deliveries and no investigram. Reuse policy for such outcomes stays with Evaluation and is not implemented here.
11. **A fresh request with no earlier equivalent invocation creates a new Query result.**
12. **The ledger is a separate Session-owned component**, not a set of new record kinds in the program record store. Content references program records through an injected resolver.

## Contract tests

All are in `test/contributions.test.ts`, `test/contribution-exposure.test.ts` and `test/contribution-results.test.ts`, using `test/contribution-helpers.ts`.

| Plan verification area | Observations made |
| --- | --- |
| Acceptance and identity | Native resolution before allocation, same key within a scope, fresh identity across scopes, reuse by a later producer, distinct independent discoveries with equal names, 23 atomic rejection cases comparing retained state before and after, supplied-evidence eligibility, stable exact identity after identification withdrawal, ambiguous and historical name lookup, method-specific identification retained after an interpreted identification and after withdrawal |
| Organization | Addition, supersession, withdrawal, standing as of an earlier position, untouched unrelated uses and content, cross-owner reuse preserving ownership and qualification, declaration-only contribution, items-only contribution with later acquisition and association, separately attributed organizing judgment in one batch, qualified inconsistency without displacement, competing supersessions, no reinstatement, explicit re-adoption |
| Results | Ordinary reuse of invocation and result, different result contract as a different request, fresh invocation keeping the repeated question's result, redesignation selected without a new producer, exact original access, historical selection superseded again to form an alternative, stable repeated enumeration, exact cross-investigram and nested membership, circular membership rejected, exact selected subject preserved after redesignation, reverse lookup of investigations |
| Exposure | Per-producer exposure within one batch, mechanical consumption of retained module identification versus independent discovery with native mapping, no exposure from read access or references, content shared through another use, baseline scope versus exact description, current-only versus all-history inventories, first acquisition after a change, refresh, exact notice versus refreshed listing versus none, notice without replacement content, post-submission notice refused, direct and transitive causes with the same change identity, known causes not re-entering, cause standing after a further displacement, discovery handles, whole-investigram delivery, disclosed excerpt |
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

## Known risks carried forward

- Baseline identification scopes produce an addition cause for every producer that acquired a baseline whenever any identification of that Entity is later added. The tests show the behavior on single Entities; its breadth on a real module population is unmeasured and is an explicit observation point at the M2 checkpoint.
- Status derivation recomputes all producing-context causes after every acceptance. It is linear in recorded deliveries and displacements per production and has not been measured on an accumulating Session.
- Deterministic Entity IDs (choice 1) and the separate ledger (choice 12) shape how existing module and group record identities map onto Entities in M2. A different decision on either is cheapest before that integration begins.

## Verification

Run by the implementing agent on the implementation's content, offline, with no credentials or inference:

- `npm run check` and `git diff --check` passed.
- The three contribution test files pass **29/29**.
- `npm test`, the complete offline suite, passed **697/697** with no skips: the 668 tests of the starting revision, none modified, and the 29 new tests. A second complete run of the built suite also passed 697/697.
- One earlier complete run reported 690 passed and 7 failed. Its output was truncated, so the failing tests were not identified. During that run the worktree was being edited and its Git index changed, and tests that capture this checkout's repository state detect such changes. The two complete runs made with the worktree untouched had no failures. The cause of the seven failures is therefore inferred, not established.

The baseline suite passed 668/668 at the starting revision before any change. These are implementing-agent checks, not independent review. Milestone 1 is implemented; the checkpoint review and Milestones 2–4 remain within the active task.
