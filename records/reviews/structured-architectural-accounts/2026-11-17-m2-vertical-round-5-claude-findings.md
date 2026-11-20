# M2 early vertical application review: findings

Record type: findings
Received: 2026-11-17
Reviewer: Claude (Opus 5.5), the same independent review session as round 4. It did not take part in implementing M2 or in its corrections.
Handoff: [M2 early vertical application review](2026-11-17-m2-vertical-handoff.md)
Round: 5
Reviewed target: `6f72f86d7cf4cfa1dd61c34e4455cc97ec42133b`
Reviewed scope: corrections `5699501..6f72f86`, including the task follow-up `8c50756`, assessed against the full M2 vertical result reviewed in round 4
Prior findings: [M2 round 4 Claude findings](2026-11-17-m2-vertical-round-4-claude-findings.md)
Prior reviewed target: `56995015770f4c1a8bf4a91ca179526884dafd97`

## Returned findings

### Recommendation

**No actionable findings.** R4-F1 to R4-F5 are resolved. R4-F1 is resolved in the direction the human chose in the task follow-up of 2026-11-17: exact option identity. With the earlier rounds, I recommend that the human consider the M2 vertical result technically sufficient to proceed to M3. This recommendation does not satisfy the human-controlled gate, begin M3 or close the task.

### Scope and method

I read correction commit `6f72f86` in full: source, tests, the architecture description and the trial-record clarification. I also read task follow-up `8c50756`, which records the human's choice for R4-F1.

I built and tested an exact export of the target, made with `git archive 6f72f86`, at a checkout path as long as the user's worktree path and also at a short path. I re-ran my round 4 probe scripts against the corrected build without changing what they check. Those probes are review scripts and were not committed. No live inference was run.

The corrections touch only the follow-up path, dialog instructions, the arrangement, the renderer, wire protocol subject shapes and tests. The rest of the vertical result is unchanged since round 4. I checked the changes for effects on the rest of the vertical result, as described below, rather than repeating the whole round 4 review.

### Resolution of round 4 findings

- **R4-F1, option question identity.**
  - **The change:**
    - `InvocationRequest` carries an optional `option: { investigram, key }`, which enters the canonical request key.
    - The ledger checks that this option exists.
    - Retained option requests still reject an `option` field, because acceptance accepts only `operation`, `subjects`, `parameters`, `context` and `resultContract`. An agent therefore cannot forge option identity.
    - The option and its meaning are captured in fixed answer support, delivered to the dialog as initial input and in `request.option`, and named in attempt reporting as `followUp`.
    - On the wire, the option's investigram travels as a handle.
  - **Probe result.** My round 4 reproduction now gives:
    - Separate Query results for `reopen` and `shared`, each answered by its own dialog. `MEANING_A` reached one dialog and `MEANING_B` the other.
    - Ordinary reuse within one option.
    - A `fresh` invocation of `shared` adds its alternative only to `shared`'s question, and `reopen` still returns only its own answer.
- **R4-F2, option authoring instructions.**
  - **The change.** `followUpInstructions()` is derived from the same operation and result-contract registrations that invocation uses. Generated instructions for both operations now name:
    - `state-behavior` and `examine-content`;
    - their subject shapes;
    - `postcode/state-diagram-answer@1`.
  - **Consistency check.** The subject kinds described match the executor's subject-signature check and the dialog's initial-context handling. The hosted schema now also accepts `investigram` and `designation` subjects, and the ledger resolves those, including submission-local references.
  - **Evidence limit.** The trial record now states that the earlier live option evidence relied on the elicitation's operation list. It also states that the corrected instructions have not been run live.
- **R4-F3, unpresented content.** `unpresented` lists every selected item that is not rendered, by address and type. An incompatible state model also keeps its bearer, its full model and the reason, including when another model in the same alternative can be drawn. In my probe, the zero-state model's bearer, applicability and unsupported semantics are now in the view, and the identification item is listed as unpresented.
- **R4-F4, state label ambiguity.**
  - **The change.**
    - When displayed captions collide, including after truncation, consistent `S<n>` mnemonics prefix the state labels in the SVG nodes, the text form, the transition endpoints and the entry note.
    - `stateLegend` gives each state's key, mnemonic and full label.
    - The renderer method advances to version 7.
  - **Probe result:** the colliding case renders as `S1: Waiting for pri…`, `S2: Waiting for pri…`, `S3: Done` and `S4: Done`, and `T1 S1 … → S3: Done`. Distinct states are now always distinguishable.
- **R4-F5, path-dependent test.** The exposure test now accepts either inline or separately acquired delivery of the retained export finding, and checks the omission notice on the separate path. It passed both at the short path where it failed in round 4 and at the long path.

### Independent verification

Under Node 22.23.4 on Linux:

- `npm run check` and `npm run build` passed, and `git diff --check 5699501 6f72f86` passed.
- Contribution and ledger suites: **87/87 passed**. At the short path, `contribution-dialog.test.js` passed 10/10.
- Full offline suite, run in six batches: **755 tests, 752 passed, 2 failed, 1 skipped**. The two failures and the skip are the same environment-only cases as in round 4: kernel-lock tests in `chatgpt-auth.test.js`, and a skip that needs a case-insensitive filesystem.
- Organization tests need a git repository, and my first run used a bare export, so I initialized one for the counted run.
- The round 4 probes for R4-F1, R4-F2, R4-F3 and R4-F4 were re-run with the results above.

### Non-defect observations and limits

- **Fulfillment.** Fulfillment still counts the state-diagram requirement as met when any selected model can be drawn. The arrangement now discloses the models that cannot be drawn, so this is consistent with the contract and not a defect.
- **Reuse across follow-up and ordinary questions.** A follow-up option with an operation such as `state-behavior` on a module is now a different question from the ordinary request on that module, and neither reuses the other's outcome. This is the consequence of the human's choice in `8c50756`.
- **Live evidence.** The corrected instructions have not been run live. The trial record says so, and further live verification needs separately confirmed authorization.
- **Earlier observations.** The round 4 and earlier observations still apply: warning breadth, supersede versus add, the single repair attempt, the missing hosted configuration path, answer record size, and the human's explicit acceptance of undesignated accepted reports.
- **Limits.** I did not inspect the rendered SVGs visually, and I did not repeat a fresh review of the unchanged components beyond checking the corrections' effects on them.

Only this findings record is created and committed by this reviewer. Implementation, governing material, the task record, task status and the original handoff remain untouched.
