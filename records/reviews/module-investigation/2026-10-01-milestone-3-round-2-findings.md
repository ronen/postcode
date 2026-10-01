# Module investigation: milestone 3 hosted execution and formative summaries review findings, round 2

Record type: findings
Received: 2026-10-01
Reviewer: Claude Opus 5.5 (Claude Code session arranged by the human; not the implementing agent)
Handoff: [2026-09-30-milestone-3-handoff.md](2026-09-30-milestone-3-handoff.md)
Round: 2
Reviewed target: `bba3d7af352981e7ba755f46d6364825a2c2685f`
Prior findings: [2026-09-30-milestone-3-round-1-findings.md](2026-09-30-milestone-3-round-1-findings.md)
Prior reviewed target: `986fddb6945eadf613ca28899003916fc689f8b7`

## Returned findings

### Scope and method

This round reviews the range `986fddb..bba3d7a`, which the human presented together
with the [disposition](2026-09-30-milestone-3-disposition.md) and the
[pass-03 report](../../validation/module-investigation/pass-03/report.md). The
code changes are in `57c2c84` (F2–F4), `79a33bb`/`a1c1f04` (nearby documentation
exposure and status checks), `db091cd` (submission-contract clarification) and
`71949dd` (private reference handles). The remaining commits change records,
documentation, harness preflight and ledgers. The original handoff is still the
assignment.

I read these in full:

- the source diff for this range: `references.ts`, `adapter.ts`,
  `stream-output.ts`, `chatgpt-credentials.ts`, `protocol.ts`, the `execute.ts`
  instruction and tool changes, the module-inspection change in
  `evidence-access.ts`, and `presentation.ts`;
- the new reference tests and the integrated short-handle and character-guard
  tests;
- the reference-transport decision record;
- the `a53ea33` authorization;
- the ledger changes;
- the disposition;
- the pass-03 report.

I also inspected the pass-03 focused-entry view and the Cockatiel
discovery-accounting file. I scanned the captured wire requests and replies of all
four pass-03 cases.

As in round 1, I sent no provider requests, accessed no Keychain items or
credentials, and changed nothing outside a scratch worktree and probe directory.

### Checks performed

- **Full suite at the target:** `npm ci` and `npm test` in a detached scratch
  worktree at `bba3d7a`, on Node 22.13.1. Result: **438 tests, 438 passed, 0 failed, 0 cancelled, 0 skipped**, 158.81 s by the test runner (168.6 s wall-clock, plus build). `git status --porcelain` was empty both before and after the run. I applied no sleep prevention, and the run was not interrupted.
- **Pass-03 audit:** `python3 records/validation/module-investigation/pass-03/audit-results.py`
  ran without error. It reports, for example for merge-anything, 67 exactly
  resolved fields and 0 unresolved, README delivered in exchange 3, wire exposure
  equal to the canonical ledger, and agreement between usage views, observations
  and provider reports.
- **Pass-03 wire scan (my own script):**
  - No canonical `session:<uuid>…` identifier appears in any captured wire request
    (input or instructions) or in any function-call reply, across 19 exchanges.
  - Every recorded resolution has a non-null reference.
  - The requested evidence kinds were:

    | Case | Evidence kinds requested |
    | --- | --- |
    | focused-entry | inspect 1, source 4, exports 1, dependencies 3, dependents 1 |
    | Cockatiel | inspect 9, source 6, exports 1, dependencies 1, dependents 1 |
    | fsm-engine | inspect 4, source 11, exports 1, dependencies 2, dependents 1 |
    | merge-anything | inspect 1, source 8, exports 3, dependencies 4, dependents 1 |

  - The focused account's first evidence handle resolves to the captured README
    content. The README text is in the wire input.
- **Reference-coverage probe:** I built a small git-initialized TypeScript project
  with a README. Against the built target, I ran a breadth-first crawl of real
  `evidenceAccess` queries, starting from `modules` and `organization` and
  following records, support references and `page.next`. In total I made 192
  queries covering `modules`, `organization`, `group`, `membership`, `inspect`,
  `exports`, `dependencies`, `dependents` and `source`, including unavailable
  outcomes. I encoded each response through `InvestigatorReferences`:
  - Raw responses contained 1,988 canonical-ID occurrences.
  - Encoded responses contained **0**.

  The probe did not cover investigram context, but the unit tests cover the
  delivery and account shapes.

### Round-1 findings

| Round 1 | Status at this target | Basis |
| --- | --- | --- |
| F1: documentation never acquired | **Resolved for this gate, with limits the report retains.** | Module inspection now supplies placement, containing and ancestor groups, and nearby documentation references, qualified as not establishing applicability. The instructions explain how to acquire and attribute documentation. In pass 03, focused-entry, fsm-engine and merge-anything received README text through normal acquisition. The accepted focused account attributes the README's pure/stateless claim and states that `nextSequence` contradicts it. It does this in attributed prose and qualifications, not as a structured inconsistency or correction. The fresh evaluator and assessor kept the distinction. Cockatiel still did not read its README, and the human's direction accepted that. |
| F2: unfinished done-item status | **Fixed.** | `stream-output.ts` invalidates on any present non-`completed` done status. The adapter also rejects a non-completed function-call status in non-empty terminal output on both routes. |
| F3: malformed non-submission arguments | **Fixed.** | The function name is classified before parsing. Only `submit_investigram` yields a malformed submission. Unknown functions and malformed `request_evidence` arguments return `ended`. |
| F4: expiry-time admission | **Fixed as a mitigation.** | A 60-second renewal margin applies under the existing lock. The disposition correctly says it is not a guarantee. |

The disposition also covers the round-1 observations: disclosure of the
retained-but-revoked refresh token, the ID-token hint in browser history, the
neutral `ceiling` ledger key (a ledger with both keys is rejected), removal of the
generic correction footer, and the additional one-call hard-limit control. I
agree with each disposition.

### New actionable findings

#### 1. The new decision record is missing from the decisions index (minor; documentation)

`docs/decisions/investigator-reference-transport.md` (status `accepted`) is not
listed in the index in `docs/decisions/README.md`, which lists the other accepted
records, including `hosted-authentication-and-billing.md`. Readers who use the
index will not find it. Suggested fix: add one line to the index.

#### 2. Integrated tests do not check that wire encoding is complete (minor; test coverage)

Encoding is a hand-written structural traversal of every `ProgramRecord` kind
and claim-information type. A compile-time `never` check catches new
*kinds*. It does not catch a new reference-bearing *field* added to an existing
kind.

Such a field would send a canonical ID to the model unencoded. Any citation of it
would decode to `invalid-investigator-reference:…`, and the whole submission
would be rejected with no repair. The failure is safe, but it is a silent
regression in usefulness, and the decision record says that "translation and
audit coverage must evolve with the typed communication contract".

The unit tests use hand-made records. The integrated short-handle test exercises
only `modules`, `inspect` and submission. My probe shows the current traversal is
complete for every real evidence kind on a small project. That was a one-off
check, not a regression test.

Suggested fix: add a deterministic test that runs every evidence kind on the test
fixture, plus an investigram-context delivery, through `encode`, and asserts that
no canonical record ID appears in the encoded output. Optionally, add the same
assertion to the adapter as a fail-closed development check.

### Non-defect observations

- **Reference transport.** The design matches the human's three conditions in
  `a53ea33`:
  - Handles do not count as exposure: `suppliedEvidence` stays canonical and
    exposure-driven, and the bare-reference test confirms both outcomes.
  - Translation is structural: literal source, assertion, prose and
    qualification text is untouched.
  - The audit keeps per-exchange bindings and path-indexed resolutions.

  Unknown, foreign, canonical and over-long spellings decode to a non-shrinking
  invalid marker. The decoded-reply character guard still measures canonical
  domain sizes, and a test shows that compact wire size cannot bypass it.
  `references.audit()` in the adapter's `finally` cannot run after `close()`,
  because the closed/aborted check happens synchronously before it.
- **Decision acceptance.** The record says `Status: accepted` and cites
  `a53ea33`. The human wrote "yes, go ahead and implement it" and listed
  implementation conditions. Under `docs/decisions/README.md`, only explicit
  human agreement accepts a decision. The human may want to confirm that the
  implementation approval was meant to accept the decision record as written,
  including its statement about alternatives.
- **Inspect paging.** `inspect` is now a paged kind, and `tool()` accepts a
  `cursor` for every `inspect` subject. Only module inspection uses `delivery.select`. On
  other subjects a cursor is presumably ignored rather than rejected. This is
  harmless in practice, and I did not verify it further.
- **Organization tools still unused.** Even in pass 03, no investigator requested
  `organization`, `group` or `membership`. Documentation now arrives through
  module inspection. The organization tools remain unused by the fixed model, and
  that is fine for this gate.
- **Integrated suite history.** The disposition discloses the earlier
  410/9/5 failed integrated suite and the sleep/wake explanation, and keeps it
  separate from the later passing runs. That is appropriate. My run here is a
  separate data point; a complete passing run at the exact target.
- **Semantic limits carried forward.** These remain assessment findings for human
  judgment, not defects in this target:
  - Cockatiel's omission of filter exceptions and of its README;
  - the fsm-engine "no-op stay" ambiguity;
  - merge-anything's omitted caveats about retained nested references and getter
    evaluation;
  - dense identifiers.

  Pass 03 cannot separate the effect of short handles from the contract
  clarification or from ordinary run-to-run variation, as the report says.

### Unverified areas and residual limits

- I sent no live provider requests and did not exercise the Keychain or browser.
  All conclusions about live behavior rest on the pass-03 captures and audits.
- I did not independently recheck the source pins, the merge-anything override
  or harness reproduction. I did not rerun pass 02 or the one-call control. I read
  their descriptions in the disposition but did not inspect their captures in
  detail.
- I did not audit the factual accuracy of the upstream summaries beyond the
  report and the focused view.
- The coverage probe ran on one small project. It does not cover investigram
  context or every possible record field in larger repositories.

### Gate recommendation

**Adequate for human milestone-3 acceptance.**

Round-1 F1–F4 are resolved or appropriately mitigated. The
conflicting-documentation case now has an accepted, attributed reconciliation in
a live run. The reference-transport correction holds up under capture scans and
an independent coverage probe.

The two new findings are minor. They can be fixed as ordinary in-scope clean-ups
without another review round.

The remaining limits are semantic assessment findings, not defects in this target:

- a single run per subject;
- Cockatiel's unread README;
- shared-family assessors;
- no live re-verification of the credential paths in this round.

The human should weigh them and confirm that the decision record was accepted as
written.
