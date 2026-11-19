# M3 agentic/caller coverage migration

Date: 2026-11-18
Task: `2026-11-15-structured-architectural-accounts`
Scope: the caller checkpoint after mechanical acceptance, including the accepted attempt/answer decision. This inventory supplements the [M1 family inventory](m1-checkpoint.md) and the [mechanical checkpoint](m3-mechanical-checkpoint.md). It is implementation evidence, not review acceptance.

## Preserved families

| Family | Current checks and change |
| --- | --- |
| Agentic acceptance, dialogs, transport and exposure | `investigation-integration`, `contribution-dialog`, `contribution-hosted`, `contributions`, `contribution-exposure`, `openai-investigator`, `chatgpt-investigator`, `assessment-budget`. Supported integration fixtures submit flat owned content and explicit designations. Native evidence acquisition, source-as-data, structural repair, bounded dispatch, authentication, usage, failure taxonomy and cleanup remain checked. Hosted SDK calls use doubles. Assessment injection uses the same common protocol as production. |
| Selection, revision and reconsideration | `application-journey`, `m3-agentic-cutover`, `contribution-results`, `contribution-answers`, `contribution-exposure`, `application-exact-compatibility`. Exact subjects, equal alternatives, explicit displacement, transitive causes, known-change and own-producer exemptions replace primary-tree traversal. |
| Exact answers and identity | `answer-identity`, `retained-presentation`, `application-exact-compatibility`, `presentation-compatibility`, `contribution-measurement`, `investigation-answer-outcomes`. Captures keep independent selection/standing/causes; replay neither consults the ledger nor runs an agent. Native answer identities remain independent of associated content; inspection identities include captured common support and declared references. |
| Direct/application/worker/session | `application-journey`, `m3-agentic-cutover`, `application-client`, `application-lifecycle`, `application-cli-outcomes`, `application-boundary`, `application-services`, `execution-ownership`, `session`, `session-inputs`, `shell`. Test casts now unwrap the common View's native component where the assertion concerns a native finding; whole common delivery is checked separately. |
| Mechanical semantics | The M3 mechanical tests continue. Caller fixtures unwrap native components without changing provider finding expectations. No new provider algorithm or source-analysis behavior is introduced. |
| Identity, request and resolution | `request-model`, `request-designation-input`, `subject-resolution`, `lens-extensions`, `verification`, `m3-agentic-cutover`. Native-only projection helpers filter native subjects; public resolution additionally returns explicitly identified Entities and historical names with standing. Operation reuse fingerprints the full operation and fixed catalog. Literal source strings and foreign Session references remain literal in comparison helpers. |
| CLI, human output, observations and attribution | `cli`, `human-output`, `output-boundary`, `source-disclosure`, `retained-presentation`, `work-attribution`, `verification`, plus unchanged command/layout/publication checks. Common View replaces legacy investigation View; embedded native headers/diagnostics render once. Recorded assertions retain disclosure limits; raw source/native bodies are not serialized. Actual common acquisitions and dispatches have work/attempt attribution. |
| Ownership and lifecycle | `immutable-capture`, `contribution-measurement`, `application-client`, `execution-ownership`, `m3-agentic-cutover` and the full suite retain simultaneous-Session, external mutation, frozen-untrusted-input, historical capture, close/disposal, collision/atomicity and plain worker delivery coverage. The accepted ownership implementation is unchanged. |

## Replacement of retired integration scenarios

The following names identify the removed legacy cases in `investigation-integration.test.ts`; they are not a claim that old tree semantics remain supported. The approved plan replaces whole-investigram corrections, inferred parent/child composition and citation-gated mutation with exact explicit declarations and actual exposure. General safeguards remain tested through the supported path.

| Earlier scenario | Replacement / rationale |
| --- | --- |
| Operation retention independent of presentation; original composition | `m3-agentic-cutover`: all four operations, exact item/designation/contribution subjects, reuse, historical and detached presentation. Composition is explicitly selected items/uses. |
| Unbound raw investigrams and compact references | `subject-resolution`, `m3-agentic-cutover`, `investigation-integration`: raw/compact identity, applicability and foreign-Session rejection before generation. |
| Successive operations atomically retain corrections/context | `m3-agentic-cutover`: explicit redesignation and exact original status; `application-journey`: cross-producer reuse/displacement and captured causes. |
| Invalid submitted corrections leave previous answers untouched | `m3-agentic-cutover`: public invalid batch containing withdrawal plus a dangling member is rejected atomically, repair response preserved; `contributions` and `contribution-dialog` cover validation/repair/collision boundaries. |
| Shell accompanying corrections / original and replacement inspection | `m3-agentic-cutover` direct/worker follow-up chains and exact replay; `application-exact-compatibility` fixed associated inspection and continuations. There is no implicit accompanying replacement tree. |
| Progressive worker lenses and per-evaluation origin (JSON/Unicode) | `m3-agentic-cutover` direct/worker all-four-operation chain, plain structured delivery and usage; `investigation-integration` worker source/context/usage; `work-attribution` generating question versus current consumption. `feedback` preserves the actual common inspection artifact across later usage/reporting and sink failure, independently of current selection. |
| Bounded associated inspection independent of incidental module context | `application-exact-compatibility` 30-owner/26-change fixture, all qualification pages recovered, unknown-cursor restart; `application-journey` native answer independent of associated interpretations. |
| All follow-ups and candid empty decomposition | `m3-agentic-cutover` follows each operation; `investigation-answer-outcomes` and `contribution-dialog` retain no-answer/inability distinctly from selected partial information. |
| Discovery cannot authorize correction of undelivered content | Replaced by `contribution-exposure`: discovery/reference/host reading creates no content exposure; exact acquisition records the actual route. The adopted contract guides acquisition before displacement but deliberately does not use a citation index as a semantic acceptance gate. |
| Revision lifecycle, conflicts, causes, exemptions and immutable Views | `application-journey` common A→Y→Z and competing B/C/D changes; `contribution-exposure`, `contribution-results`, `contribution-answers` precise endpoints, causes, alternatives, membership, exemptions and historical capture. |
| Revision submission after invalidation/interruption | `investigation-integration` post-submission invalidation, worker interruption and ignored late replies; `contribution-dialog` guarded termination/cleanup and no late acceptance; fixed original-answer atomicity tested by `m3-agentic-cutover`. |
| Historical pages show competing corrections with no primary change/inference | `application-exact-compatibility` fixed pages with no new agent call; `application-journey` equal standing alternatives. Primary replacement preference is retired. |
| Large displaced history with bounded metadata / recover omitted status | `application-exact-compatibility` separately bounded owner and status pages, complete qualification recovery, exact snapshot invariance; `contribution-answers` qualified displacement support. No global serialized-output byte ceiling is claimed. |
| Accompanying replacement discloses deeper original/subtree | Exact owned items, declared member-use graphs and recursive support in `contribution-answers`/`contribution-results`; no implicit subtree discovery is retained. |
| Displaced/accompanying lists truncate with exact navigation/counts | Common owner/status pagination and counts in `application-exact-compatibility`, plus frozen historical access in `m3-agentic-cutover`. The old 256-entry correction-list layout is retired. |

## Accepted outcome change

[Investigation attempts and answer outcomes](../../../docs/decisions/investigation-attempts-and-answer-outcomes.md), accepted at `bd9f581`, explicitly replaces tests requiring different investigation failures to create different answer identities. `investigation-answer-outcomes.test.ts` tests both `summarize` and `state-behavior`: distinct retained kind/code/diagnostic with equal empty answer; undesignated inability; selected partial owner report; failed fresh attempt preserving the previous answer/fulfillment; exact replay excluding attempt diagnostics; withdrawal grounds; and established empty native findings. The worker case verifies transient retry, exact delivery, partial qualification and compatible reuse. Mechanical unavailable distinctions remain in existing native tests.

## Remaining retirement work

Legacy low-level `investigation`, `investigation-selection`, `investigation-revisions` and old protocol tests still exercise unreachable helpers; they are not evidence for the new caller route. `investigation-selection` uses explicit test-local definitions rather than restoring legacy production registration. The supported application catalog rejects the legacy interpretation requirement. M4 must remove the unused evaluator/tree/correction/citation machinery and associated tests after its reachability audit, update remaining descriptive architecture, and reconcile this inventory at integrated review. No new live instruction-usability trial was run; existing M2 trials cover their recorded instruction revision only.


## M4 retirement closure (2026-11-18)

After human acceptance of both M3 checkpoints, the remaining unreachable legacy machinery and representation-specific tests were retired. The [integrated coverage inventory](m4-retirement-coverage.md) maps those cases to current checks or explicitly retired semantics and records the remaining shared boundaries. The separate final integrated gate remains open.
