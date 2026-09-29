# Module investigation: domain execution review findings

Record type: findings
Received: 2026-09-29
Reviewer: Claude Opus 5.5 (Claude Code session arranged by the human; not the implementing agent)
Handoff: [2026-09-29-milestone-1-handoff.md](2026-09-29-milestone-1-handoff.md)
Round: 1
Reviewed target: `d4260522c2abf0530de076c05944f531de003e4b`

## Returned findings

### Scope and method

I reviewed the implementation diff `c15afdd..d426052` against milestone 1 of the
[approved plan](../../../docs/plans/module-investigation.md), the investigram,
investigator-execution and operations decisions, the
[architecture account](../../../docs/architecture/investigation.md), the task
record's evaluation-layer rationale and the
[validation record](../../validation/module-investigation/2026-09-29-milestone-1.md).
The working tree was at `c527411`; `git diff d426052..c527411` touches only the
task record and handoff, so the implementation under test was the target.

I read all new investigation modules (`contracts`, `execute`, `acceptance`,
`context`, `usage`), `evidence-access.ts`, the store, record, identity and
provider changes, the relevant input-host, repository link-resolution and
expansion code, and both new test files. I then ran scratch probes against the
built code (not committed) to confirm suspected behavior.

### Checks performed

- `npm run check`: passed.
- `npm test`, first run: 310 passed, 0 failed, 13 cancelled. All 13 cancellations
  are in `execution-ownership.test.js` (`cancelledByParent`, "Promise resolution
  is still pending but the event loop has already resolved"). That file is not
  touched by the diff. It passed 13/13 when run alone.
- `node --test _build/test/*.test.js`, second full run: 323 of 323 passed.
- `node --test _build/test/investigation.test.js`: 27 of 27 passed.
- Scratch probes confirming findings 1, 2, 4, 5 and 6 below.

### Actionable findings

**F1 (medium). Replacement associations misattribute "corrected-subject".**
`src/lib/investigation/acceptance.ts:94-96,103-104` attaches every replacement to
`[correction.target, targetOrigin.request.subject]`, both with role
`corrected-subject`. The target's originating request subject was not
necessarily corrected. Probe: A = functionality(module); B = clarification(A);
C = examination(B) corrects B with replacement R. R's associations are
`[B, corrected-subject]` and `[A, corrected-subject]`, but A's account was never
corrected. For a subordinate target (a child describing another module), the
replacement is associated with the parent investigation's module rather than
the subject the corrected account described. The single role also conflates the
corrected investigram with a program subject. The decision says a replacement
"remains associated with the subject whose account it corrects", and other
subjects need explicit attribution. The test at `test/investigation.test.ts:309`
and the architecture text ("preserve the corrected account's originating request
subject") codify the current behavior. This does not block milestone 1 by
itself. However, milestone 2's `inspect(subject)` listings and milestone 5's
correction views would inherit wrong associations from retained units. Fix the
contract before retention begins: distinguish the corrected account from
described subjects, and never label an uncorrected investigram as corrected.

**F2 (medium). Unusual provider usage becomes an unexpected defect.**
`src/lib/investigation/usage.ts:14-32` throws plain `Error`s from the
`reportUsage` callback for subset-exceeds-parent, a missing parent category,
duplicate categories, and a differing repeated report. The callback runs inside
the adapter's `exchange` (`execute.ts:123`), so the error propagates as a defect
and discards the investigation. Probe: a report where `reasoning` (5) exceeds its
`output` parent (1) throws "Usage subset exceeds parent" out of `investigate`.
Real providers can plausibly send such reports, for example with provider
accounting quirks, cumulative streaming updates, or categories whose parent is
absent. The plan asks PostCode to preserve reported usage, keep unknown usage
distinct, and keep operational outcomes separate from defects. Usage accounting
should not decide whether an investigation fails. Two options are available:
retain the report with an explicit anomaly qualification, or mark that call's
usage as unobtained with a diagnostic. Decide this before the hosted adapter in
milestone 3.

**F3 (low–medium). One oversized evidence response stops the whole evaluation.**
Evidence responses have no per-response size bound. `acquireContent` returns
full files of any size, and `organization` returns the whole population. The
next `volume(input)` (`execute.ts:97-103,116`) then ends the evaluation with
`limit-stop`. It does not return an explicitly incomplete tool response that the
investigator could continue past. The plan allows chunking or an explicitly
incomplete response. It also treats unavailable or incomplete content as tool
responses, not terminal outcomes. The architecture document notes the missing
range selector but not this terminal consequence. The 2,000,000-unit guard is far
above practical hosted context windows. A single large mapped file therefore
remains an unaddressed contract gap for milestone 3. Consider a per-response bound
that returns a qualified partial or unavailable response, and document the
behavior.

**F4 (low; needs a ruling). Correction reasons do not cite their reporter.**
`InvestigationContext.prepare` (`context.ts:29-42`) delivers full `Correction`
records, including reasons and qualifications, even when `parts` is `[]`.
`supplied()` (`context.ts:73-83`) cites only accounts, and the reporting
investigram is never traversed. Probe: requesting B with `parts: []` delivered
C's correction reason, but `citations` was empty. The decision says "any
substantive content from an investigram ... creates a citation". Corrections are
described as immutable accompanying content of the reporting investigram. If
that reading holds, the citation index under-records exposure, and a later
correction of the reporter would not propagate reconsideration in milestone 5.
If correction records are deliberately separate from reporter content, record
that interpretation in the architecture account.

**F5 (low). An empty excerpt creates a citation.**
`excerptCharacters: 0` delivers `prose: ''`, and `supplied()` treats the defined
prose as exposure (`context.ts:52,77`). Probe: one citation results. Only
substantive content should cite. Either reject a zero or empty excerpt, or do not
count empty prose as exposure.

**F6 (low; test quality). Rejection tests do not pin their reasons.**
The parametric rejection tests (`test/investigation.test.ts:198-213`) assert
only `investigation-failure`. As a result:
- The `cycle` case is rejected by the dialogue volume serializer ("Non-serializable
  agent exchange.", `execute.ts:99`), not by the acceptance cycle/shared check.
- `same-result` targets a local ID string, and `unseen-target` targets a module.
  Both are rejected by the generic "not an earlier investigram" branch.
- No test covers an acyclic shared node (the same object in two child positions).
  A probe confirms the acceptance check does reject it ("Result tree is cyclic,
  shared, or exceeds structural bounds.").

These tests would still pass if the intended checks regressed. Assert the reasons,
and add a shared-node case. The earlier-but-undelivered target is already covered
properly at line 289.

**F7 (low; uncertain). Artifact reads widen the compiler input basis.**
Organization artifacts are read through the TypeScript input host
(`project.ts:160-172`). That read increases `inputs.revision()` and changes
`inputs.identity()`. As a result, partial mechanical results cached against an
older revision retry (`project.ts:247,431-439`), and later analysis-input records
include documentation reads that are not compiler inputs. This fits the existing
"acquired inputs force partial retry" rule and the plan's validity requirement.
However, it can change attempt counts or reuse of partial mechanical evaluations
after an investigator reads a README. No regression test covers a mechanical query
after investigator acquisition. Confirm the intent and add a regression test, or
record it as accepted behavior.

### Non-defect observations (verified)

- **Symbol and alias documentation.** Export evidence selects provider expansions,
  which are already module-scoped (`expansions.ts:317`). It includes
  documentation-association claims and chases their assertions. The existing test
  asserts that the origin-symbol documentation reaches the investigator.
- **Source acquisition stays on the shared input host.** It goes through the
  memoized host, so compiler-read files are served from the first observation
  rather than re-read. Output exclusions are checked through `inputs.excluded`.
  Symlink targets resolve only within the captured repository population, and
  outside or excluded targets are unavailable. The store rejects forged
  module/artifact mappings and digest mismatches. There is no path-based route.
- **Validation rules.** Correction targets must be earlier investigrams from this
  session, with complete supplied context accumulated across exchanges. Evidence
  must identify delivered records or cited accounts. Status is always
  `interpretation`, and unknown fields, including `status`, are rejected.
  Competing and recursive corrections are accepted, and replacement trees are
  disjoint through unique local IDs. Rejection is all-or-nothing.
- **Guards and late results.** Guards, interruption and invalidation close the
  dialogue exactly once, reject late submissions, and emit a final report with
  earlier usage and in-flight calls marked unknown. Late usage callbacks after
  termination are ignored, as documented.
- **Validity check after submission.** This check is deliberately outside the
  generation deadline, so it relies on interruption or its own subsystem
  deadlines. This is consistent with the plan and is tested.
- **Delivery bounds.** Metadata (provenance, evidence lists) is outside the
  60,000-unit context bound and covered only by the dialogue volume guard. This is
  documented.

### Residual limits and unverified areas

- The 13 cancelled `execution-ownership` tests in the first full run were not
  reproduced in the second full run or in isolation. I did not determine whether
  they are pre-existing flakes (for example, from load), or rerun the baseline.
  They appear unrelated to this diff, but this is not established.
- No real adapter, provider responses, credentials or live inference exist at
  this checkpoint. The agent communication contract is exercised only by the
  scripted double.
- I did not independently review retention, reconsideration propagation or
  display semantics. Those belong to later milestones.

### Recommendation for the milestone-1 gate

The domain boundary, evidence access and result contract are substantially
sound, and the reproduced checks pass. I recommend correcting F1 and F2 before
milestone 2 begins, or explicitly dispositioning them. F1 would otherwise be
persisted into retained associations, and F2 affects the contract the milestone-3
adapter must satisfy. F3–F7 can be corrected or dispositioned alongside them. I
do not consider a further independent round necessary if the F1 and F2
corrections are small and verified with targeted tests. That decision and the
gate remain the human's.
