Record type: findings
Received: 2026-11-16
Reviewer: Codex (GPT-6), fresh review session, independent of implementation and the earlier review sessions
Handoff: [M1 common contribution mechanism review](2026-11-15-m1-mechanism-handoff.md)
Round: 7
Reviewed target: `22698aeb7ff5c99fa608ee68017c8bcd6a29ea11`
Prior findings: [Codex round 5](2026-11-16-m1-mechanism-round-5-codex-findings.md), [Codex round 6](2026-11-16-m1-mechanism-round-6-codex-findings.md); earlier records reconciled below
Prior reviewed target: round 6 examined the same target; round 5 examined `1f7e1ec8a2aafd3e0f4b28ffb7fdfa5815a081ae`
Reviewed scope: whole M1 mechanism against original baseline `8a7f2834470644726dd742a0ddaeb1455bac3b2a`, including its corrections, rather than only the last correction diff
Checkout: clean at `5f667a99b4eefd7d542aa9f6f787f01099955598`, branch `claude/structured-architectural-accounts`, in the worktree specified by the handoff

## Returned findings

### Recommendation

No confirmed actionable defect was found. I recommend that the human consider the M1 mechanism sufficient to begin M2, carrying forward the integration obligations and the unresolved secondary-standing question below. This is a recommendation about the mechanism checkpoint, not acceptance of the gate, proof of complete correctness, or authorization to close or merge the task.

Round 5 O1 remains open for human direction. Its current behavior satisfies the distinction between a reference and an exact notice; whether the producer-facing delivery should be enriched into a qualified notice is a separate choice. Beginning M2 must not silently settle that choice. Obtain the human's direction before adopting either treatment in the affected real-producer context.

### Exact scope and method

The only tracked differences between the requested target and the starting checkout were the round 6 findings and the checkpoint record. Source, tests, architecture documentation, governing documents and build configuration used here match the requested target. I verified that comparison again after running the probes. No later implementation changes were included.

I read the original handoff, task protocol and review workflow, relevant foundation/specification/core concepts/constraints, the approved plan, all four accepted contribution decisions, and the human follow-ups in the [active task](../../tasks/2026-11-15-structured-architectural-accounts.md). I derived requirements and failure hypotheses before reading earlier findings in detail. I then inspected all six contribution modules, the identity additions, the three contribution test files and helper, and the descriptive architecture. Earlier findings and checkpoint dispositions were subsequently reconciled with those observations. No sub-agent or implementing-agent result supplied the independent test oracle.

The principal requirements and hypotheses were:

| Contract | Discriminating question |
| --- | --- |
| [Atomic, separately attributed contributions](../../../docs/decisions/common-analysis-contributions.md#immutable-analysis-contributions) | Can a valid forward reference fail depending on batch order, a rejected pool allocate identity, or one producer inherit another's inputs merely through batching? |
| [Exact uses and immutable membership](../../../docs/decisions/association-organization-and-exposure.md#qualified-declarations-and-exact-uses) | Can sharing an item displace another use, replacement withdrawal reinstate a predecessor, or nested designation membership silently follow replacements? |
| [Acquisition and timing](../../../docs/decisions/association-organization-and-exposure.md#exposure-and-reconsideration) | Can a known change re-enter through another route, an inventory refresh clear an earlier dependency, or displacement context invent replacement acquisition? |
| [Qualified identity and provenance](../../../docs/decisions/common-analysis-contributions.md#identified-things-and-inquiry-results) | Does selection follow the finding's method rather than its organizer, and do exact identity, ownership and historical qualification survive displacement? |
| [Fresh attempts](../../../docs/decisions/qualified-answers-over-contributions.md#answer-identity-and-request-reuse) and [separate outcomes](../../../docs/decisions/common-analysis-contributions.md#access-and-outcomes) | Can an old answer fulfill an attempt that did not return it, one adequate alternative hide an inadequate one, or an unmet request discard valid declarations? |
| [Execution termination](../../../docs/decisions/common-analysis-contributions.md#production-and-execution) | Can repair reopen accepted work, or a terminal exception permit late submission? |

The acceptance staging, exact-reference checks and separate status bearers support these distinctions. In particular, receiving a designation can establish a membership route without delivering member content; own-declaration exclusion is per production, not per batch; and a historical answer explicitly returned by a fresh attempt can meet its content contract without becoming standing again.

### Independent state-transition model

I built a temporary JavaScript model against the freshly compiled mechanism, using a separate event-driven oracle rather than the implementation's retrospective delivery scan. The oracle uses abstract names and sets of obligations. A change pushes a cause into exact-use, acquired-scope and fixed-membership watchers. Actual delivery adds source-producer relationships and records disclosed knowledge. Cause sets propagate along those relationships; exact known changes and the producer's own declarations are excluded from its producing-context set. Designation membership retains its separate acceptance-time boundary. No implementation status, standing or membership method computes an expected value.

Reproduction parameters:

- Node `v22.13.1`; 120 independent ledgers, integer seeds **1 through 120**, **70 transitions per seed**.
- PRNG: unsigned 32-bit xorshift, initialized to the seed, with shifts `13`, `17`, `5`; each bounded choice is `(state >>> 0) % candidateCount`. Candidate collections retain insertion order. Random production UUIDs affect addresses only, not choices or expected results.
- Initial population: one identified Entity and use A, designation D selecting A, and designation E selecting D. Generated designations can select previously created designations or Entity uses, including displaced ones.
- Twelve transition choices: open production; acquire an exact use with or without its direct content; acquire a bare item; acquire current-only/all-history inventory; deliver an exact notice; submit an items-only contribution; supersede an earlier use; withdraw an earlier use; add a nested designation; reject malformed content; accept a topical addition alongside an independently attributed consumer; discovery-only acquisition.
- Scope choices: identification, one topical key, every Entity role, and Query-result designation scope. Changes can come from an independent producer or the currently open producer. Acquisitions can occur before or after changes and can repeat. Rejections preserve the open attempt for subsequent actions.
- After every transition, compare pending or concluded producing cause identities for every production, plus standing and membership cause identities for every association. Rejected submissions additionally compare serialized retained position, Entities, investigrams and productions and check that the handle remains open.

Result: **8,400 transitions, 376,907 status comparisons and 761 atomic rejections passed**. These are repeated assertions over bounded histories, not that many independent semantic scenarios or an exhaustive state-space proof. The oracle compares cause identities, not every possible proximal route; route details and delivery contents were also inspected manually and are asserted by the repository tests.

The first model run exposed an omission in my oracle, not a product defect: I had omitted the producer history of qualified displacement grounds delivered alongside an old use. The human follow-up expressly preserves that explanation's exposure implications. I corrected the oracle and reran all seeds. A reduced sequence independently confirmed the distinction:

1. Retain identification A. Producer P acquires a topical inventory, then contributes B superseding A.
2. R acquires A with B's qualified displacement grounds. Its history records association A and declaration B, with no acquisition of B's use or content. A control receives only A's bare item.
3. An independent producer adds topical association C within P's acquired scope.
4. R correctly receives C through the producer of B's delivered grounds; the bare-item control does not. An exact notice of C to R removes that producing-context cause without acquiring B.

Thus the grounds-only path can inherit a genuinely relevant cause while still refusing the automatic B-to-C replacement chain prohibited by the clarification. There was no remaining implementation/model mismatch to minimize.

### Additional boundary probes

Separate temporary probes supplied these independent checks:

- **18 fulfillment cases:** cross original-answer standing/superseded/withdrawn history with six fresh-attempt responses: no answer, explicit historical reuse, adequate new answer, inadequate new answer, mixed alternatives, and a new designation selecting the historical designation. Check attempt fulfillment separately from whole-result fulfillment, shared result identity with distinct invocation identity, original content preservation, and no reinstatement.
- **27 lifecycle cases:** repair allowances 0, 1 and 2 crossed with no submission, exhausted structural failure, successful permitted repair, immediate/asynchronous callback rejection, content-validator failure, late identifying-name-extractor failure, and post-acceptance fulfillment failures throwing either `InvalidContribution` or `TypeError`. Check callback counts, unchanged original exception identity, retention only on successful acceptance, terminal closure, and refusal of late acceptance/evidence registration.
- **12 batch cases:** all six permutations of independently attributed finder, organizer and reader, with valid and invalid pools. The organizer forward-references the finder's identifying content and local Entity; only the reader acquires an earlier use. Check atomic rejection with no native-ID allocation, finding-method selection, historical immutability, and a later withdrawal affecting only the reader's producing history.

All **57 cases passed**, as did the reduced grounds-provenance sequence and its controls. The seeded model and these probes were temporary, outside tracked files; no implementation or repository test changes were needed.

### Reconciliation with earlier reviews

| Earlier record | Observation at this target |
| --- | --- |
| [Round 1](2026-11-15-m1-mechanism-round-1-findings.md) and [Codex round 2](2026-11-15-m1-mechanism-round-2-findings.md) | Forward identifying references are staged before commit. Excerpts carry item qualification independently of the bounded body. Routed member acquisition supplies qualified use context, and delivery records are owned immutable captures. The batch permutations independently challenge the original order-dependent acceptance failure. |
| [Claude round 2](2026-11-15-m1-mechanism-round-2-claude-findings.md) and [Claude round 3](2026-11-15-m1-mechanism-round-3-claude-findings.md) | Qualified change deliveries and disclosed concerns make exact changes known across producing routes. Association-establishing declarations use qualified association acquisition. Invalid scopes and excerpt bounds are rejected before recording delivery. The model exercises repeated delivery, refresh and inherited propagation together. |
| [Copilot round 3](2026-11-15-m1-mechanism-round-3-copilot-findings.md) | Displacement collections no longer expose the backing array; entries and declarations are frozen. Duplicate production IDs are rejected before retention. Method-specific historical selection, prevalidation of member bounds and concern disclosure have corresponding corrections and passing regressions. |
| [Codex round 4](2026-11-16-m1-mechanism-round-4-codex-findings.md) | Method filtering follows identifying-content provenance; excerpt history records exact delivered/omitted extent. Fulfillment failures no longer enter structural repair. Attempt answers are separated from all standing answers of the shared Query result. The fresh-attempt and batch probes independently exercise the latter two distinctions. |
| [Codex round 5](2026-11-16-m1-mechanism-round-5-codex-findings.md) and [Codex round 6](2026-11-16-m1-mechanism-round-6-codex-findings.md) | R1's unexpected acceptance-validation exit closes the handle and preserves the original exception. Early validator and late identifying-extractor failures pass independent checks with all three repair allowances. O1 remains open as described below. |

I found no incomplete correction requiring another actionable finding. Earlier positive conclusions did not substitute for the present source inspection, generated transitions or checks.

The handoff's implementation choices remain defensible within their stated limits. Scoped deterministic IDs do not prove semantic ordering; same-target compatible-role supersession permits different topical keys; designation membership propagation does not fabricate content delivery; and a separate ledger can implement one identity/information contract. The narrow qualification `contexts` field does not bar legitimate reuse of source-qualified content. Its trusted mechanical-record kind/method checks and the separate ledger's shared Session lifecycle still require real M2 integration evidence. Acceptance enumeration must not become mechanical answer ordering.

### Unresolved interpretation: secondary standing

I read round 5 O1, round 6's response and the checkpoint's explicit open question. I inspected and reran the current regression: B supersedes A; P acquires B; C supersedes B; P subsequently acquires A and sees C only in B's secondary standing. C remains a producing-context cause. An exact notice of C or delivery of B with C's qualified displacement context makes C known.

The secondary standing contains C's reference but not its operation. The adopted exact-notice rule requires the particular change, affected use/scope and operation. Consequently this review does not classify the current reference-only value as an already-delivered qualified notice. Whether the real delivery should supply the additional information and record C as known remains a human-directed question. A passing test documenting current behavior does not resolve it. Either resolution must preserve the prohibition on inventing replacement-use/content acquisition or retrospectively clearing completed contributions.

### Independent verification and environmental limits

I used the installed dependencies, including TypeScript `6.0.3`; I did not run `npm ci` or use live credentials/inference.

| Check run in this review | Result |
| --- | --- |
| `npm run check` | Passed |
| `npm run build` | Passed |
| `node --test _build/test/contributions.test.js _build/test/contribution-exposure.test.js _build/test/contribution-results.test.js` | **50/50 passed**, no skips |
| Seeded independent model | **120 seeds / 8,400 transitions passed** |
| Additional boundary probes | **57/57 passed**, plus the reduced grounds-provenance sequence and controls |
| `node --test --test-concurrency=2 _build/test/*.test.js` in the sandbox | **715/718 passed**, three failed, no skips; about 450 seconds |
| `node --test _build/test/chatgpt-auth.test.js` outside the sandbox | **20/20 passed**, no skips |
| `git diff --check` from baseline to target over `src test docs` | Passed |

The three complete-suite failures were `real loopback sign-in validates state, PKCE, client binding and authoritative granted scope`, `returning sign-in reuses client and host, requests explicit consent only when asked, and validates before activation`, and `identity-only permission decline persists a valid sign-in without inventing access or refresh grants`. The first and third reported `sign_in_failed`; the second attempted to read `searchParams` from an undefined value. A separate minimal sandboxed TCP bind to `127.0.0.1` returned **`EPERM`, syscall `listen`**. The same authentication test file then passed outside the sandbox. This is concrete evidence of a local-network permission restriction and supports the environmental explanation for those failures; I did not run the entire suite outside the sandbox and do not claim an independent 718/718 full-suite pass. The checkpoint's 718/718 remains implementing-agent evidence.

### Coverage limits and M2 obligations

This review establishes bounded mechanism evidence, not real application integration or the truth of architectural claims. The generated model has one Entity, one Query result, a finite set of scope shapes, simple controlled content and sequential ledger calls with interleaved open productions. It is not exhaustive over arbitrary schemas, population sizes or schedules. It does not validate live dialog instructions, detailed service-failure taxonomy, performance or application-level cancellation.

The existing planned work remains required: native/common identity correspondence; equivalent recomputation without renewing withdrawn uses; method-specific qualification and deterministic full answers under reordered arrivals; real Claim-context kinds/methods; shared Session invalidation and lifetime; selected-content/enclosing-item and originating-question baselines; required dependencies and nested designated-content delivery; exact Projection snapshots; diagram fulfillment/rendering and option execution; remaining producer/caller migration; and the accumulating-Session exercise for growth, derivation cost, delivery volume and warning breadth. These are known M2/M3/integrated obligations, not newly manufactured M1 defects. Exact-only acquisition and reuse without acquisition retain their explicitly accepted dependency limits.

Only this new findings record is committed. Implementation, tests, governing material, task/checkpoint status, the handoff and earlier historical records are unchanged. Human checkpoint acceptance remains separate.
