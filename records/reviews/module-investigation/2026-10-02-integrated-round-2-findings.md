# Module investigation final integrated review: round 2 findings

Record type: findings
Received: 2026-10-02
Reviewer: Claude Opus 5.5 (`claude-opus-5-5`) in Claude Code, arranged by the human; same reviewer and session as round 1; repository-writing reviewer
Handoff: [2026-10-02-integrated-handoff.md](2026-10-02-integrated-handoff.md)
Round: 2 (focused re-check)
Reviewed target: `f3189e356b17f6238657c144aa927dc4a6df2e70`
Prior findings: [2026-10-02-integrated-round-1-findings.md](2026-10-02-integrated-round-1-findings.md)
Prior reviewed target: `f4328296cc8fff1f4d7fd820a4ca98ede6ce1f5c`

## Returned findings

### Summary

All three round-1 findings are resolved. I have no new actionable findings.

**Recommendation:** the review evidence is sufficient for the final integrated gate.
Acceptance and task closure remain the human's decision.

### Scope and method

I reviewed the changes after my round-1 record (`7acbd7e..f3189e3`). They are:

- `d0ef2e8`: human direction;
- `921ad46`: the F3 rule and F2 documentation;
- `5dd6d35`: the pass-07 freeze;
- `1f53f5b`: the pass-07 captures and the [disposition](2026-10-02-integrated-disposition.md);
- `f3189e3`: the task checkpoint.

I read the following in full:

- the disposition and the task follow-up;
- the full source, test, decision, architecture, CLI-reference, STATUS and README
  diffs;
- the pass-07 protocol and report;
- the pass-07 examination view.

I checked the examination's claims against the pinned merge-anything source.

This was a focused re-check, not a repeat of the round-1 integrated review. Round-1
scope statements and limits still apply to everything else.

### Verification performed

- **Full suite.** `npm test` at a clean, unchanged checkout of `f3189e3` passed **469
  tests: 469 pass, 0 fail, 0 cancelled, 0 skipped**. The suite took 173.429 s
  (`duration_ms`), and 3:02.80 wall-clock including the build (13:53:29Z–13:56:32Z).
  Environment: macOS Darwin 25.6.0, Node v22.13.1, loopback listeners permitted. I did
  not run a sleep monitor.
- **Audits.** All 15 audits exited 0 under Python 3.14.7:
  - the four pass-07 audits (`results`, `lifecycle`, `completion`, `artifacts`);
  - the updated `integrated/aggregate-usage.py`;
  - the ten pass-03 to pass-06 audits.

  Afterward `git status --short` was empty, so every regenerated output is
  byte-identical. The aggregate now reports **219 provider requests / 5,526,468 known
  tokens, 3 missing, 0 anomalous, 15 synthetic excluded**. That equals round 1's
  figures plus pass-07's 16 requests and 416,143 tokens. The aggregator change is only
  the range extended to pass 07 and its limitation text.
- **Freeze and historical records.**
  - The pass-07 frozen inputs were committed in `5dd6d35` at 13:29:18Z. Preflight is
    timestamped 13:29:12Z.
  - The protocol, manifest, references, rubric, instructions and questions are
    unchanged between the freeze and the capture commit.
  - Pass-01 to pass-06 records, fixtures, `foundation/`, `dev/`, the handoff and my
    round-1 record are unchanged since `7acbd7e`.
- **Not run.** I did not run `verify-frozen.mjs`, because it needs the ignored
  historical export environment. I made no live inference and touched no credentials.

### Disposition of round-1 findings

- **F1 — resolved.**
  - **Authority.** The human chose bounded completion in the `d0ef2e8` follow-up.
  - **Protocol.** Pass 07 recreates the summary and explanation prerequisites in one
    fresh shell, then runs decomposition and examination. It uses the frozen pass-05
    runtime (exported `e54a4c3`, production `9eb0b7d`), model, route, source pin and
    override, with a recovery allowance stated in advance.
  - **Chain.** The completion audit confirms four accepted evaluations. Each follow-up
    targets the immediately preceding result's account.
  - **Usage and records.** There was no recovery, rejection or guard stop, and the 16
    requests are reconciled. The pass-05 failure records remain unchanged.
  - **Choice of runtime.** Using the historical runtime rather than the current one is
    stated openly and suits the purpose: completing the frozen pass-05 condition. As a
    consequence, pass 07 is not live evidence for F3 or for the later presentation
    fixes. The report says this correctly.
  - **Remaining cases.** I found no other required case awaiting a deferral decision.
- **F2 — resolved.**
  - **README.** The README describes the four lenses, correction-aware redisplay,
    exact inspection, paging, associations and the two explicit billing routes. That
    text is now in the CLI section, and the stale block under License is gone.
  - **Architecture overview.** `docs/architecture/README.md` describes the delivered
    integration and the ChatGPT-plan route, with no stale "pending" or
    "later milestones" claims.
  - **CLI reference.** The CLI reference section is renamed "Progressive investigation
    and usage". It keeps the old anchor as an explicit `<a id>` for historical links.
    STATUS, README and the architecture overview link the new anchor, and both anchors
    resolve.
- **F3 — resolved, as the human chose.**
  - **Governance.** The governing decision carries a dated clarification attributed to
    the `d0ef2e8` direction.
  - **Rule.** `acceptance.ts` now rejects any inconsistency target that is missing from
    `exposure.citations`.
  - **Contract text.** The instructions, the provider schema description and
    `investigation.md` state the rule consistently. An excerpt suffices, unlike for
    replacement corrections.
  - **Identities.** Method identities advanced: investigation @12 and adapters @7.
  - **Regression.** The new test covers ten cases: root and nested placement, crossed
    with five delivery modes (bare, empty-excerpt, excerpt, mixed and full). It also
    covers the prepared-but-undelivered case. It asserts whole-unit rejection with no
    repair exchange, and that an excerpt does not mark the target complete.
  - **Probe re-run.** I re-ran my round-1 probe mentally against the new code: an
    empty `citations` set now rejects it.

### Non-defect observations

- **Reporter-only citations satisfy the rule.** `citations` includes reporters whose
  only delivered content was a correction's reason and qualifications, or an
  inconsistency they reported. An inconsistency may therefore target such a reporter
  without its own prose, referent or qualifications having been delivered. This fits
  the governing rule that this content belongs to the reporter ("substantive content
  … recorded through a citation"), so I don't consider it a defect. A future
  documentation pass could state it explicitly.
- **Pass-07 examination quality.** I checked the examination (`@investigram-4f621241`
  and its children) against `src/merge.ts` at `bc7c79f`:
  - **Correct:** descriptor normalization, which preserves enumerability only and
    always writes writable, configurable data properties.
  - **Correct:** newcomer-determined enumerability on key collisions, applied again at
    each reduction step.
  - **Correct:** the eager origin getter read before the collision check, a useful
    non-obvious hazard.
  - **Missed subtlety:** for a colliding key, the newcomer loop reads `origin[key]`
    again, so an origin getter can run twice.
  - **Not verified:** the test-coverage statements.

  The sequence gives a useful, source-grounded deepening, and it neither corrects nor
  invents an error.
- **Source-detail wording.** The report candidly notes that the investigram
  `--source-detail` heading promises more than it delivers: a location, no excerpt.
  This remains an existing backlog presentation concern.

### Remaining limits

- **Round-1 limits still apply.** These are partial reading of tests and of the OAuth
  helpers, no re-inspection of formative role records, partial upstream re-derivation,
  no sleep monitor or dry-run, and shared-family and orchestration limits on assessment
  independence.
- **F3 has deterministic coverage only.** No live run has exercised the F3 rule.

### Recommendation

The findings are resolved and the evidence is sufficient for the final integrated
review gate. This is not acceptance. The human decides whether to accept the gate
and close the task.
