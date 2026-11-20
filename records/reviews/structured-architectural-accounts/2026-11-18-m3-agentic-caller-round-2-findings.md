# M3 agentic/caller cut-over review: round 2 findings

Record type: findings
Received: 2026-11-18
Reviewer: Claude (Opus 5.5), independent review session
Handoff: [M3 agentic/caller cut-over review](2026-11-18-m3-agentic-caller-handoff.md)
Round: 2
Reviewed target: `4a4d060e2c789f903f950d68602ffa99d0575d42`
Reviewed scope: `e6f5c4c28a467670100fbdc77b9fabac0b1df17e..4a4d060e2c789f903f950d68602ffa99d0575d42` (`renderContributionView`, the contribution acquisition path in `conductDialog`, the presentation method version, two documentation paragraphs and the new tests). `65b1277` was read as the disposition only.
Prior findings: [round 1](2026-11-18-m3-agentic-caller-round-1-findings.md)
Prior reviewed target: `e6f5c4c28a467670100fbdc77b9fabac0b1df17e`

## Returned findings

### Recommendation

**No actionable findings.** F1 and F2 are both corrected, and the corrections change nothing outside the rendering and work-disposition code. My round 1 assessment of the rest of the cut-over therefore applies to `4a4d060`. In my view the M3 caller checkpoint is ready for human acceptance. The human decides whether the gate is satisfied.

### Method and verification

I read the correction diff, the disposition and the 13 new tests. I then rebuilt the target from a `git archive` copy in a Linux VM on the user's machine (Node 22.23.5), committed into a scratch Git repository, and reran my round 1 probes against the new build. The worktree was not modified apart from this record.

- **Checks.** `npm run check` and `npm run build` passed. `git diff --check e6f5c4c 4a4d060` passed.
- **Build digest.** Using the `buildIdentity` reproduction command given in the disposition, the digest is `2244430ef84968a0020ca0a99ca60017b629a7831e24f77c56998cbb037d7490`, which matches the disposition. This resolves the digest limit I recorded in round 1 (for this target).
- **Full offline suite**, run as 19 batches of four files at concurrency 4: **787 tests: 784 passed, 1 skipped, 2 failed.** That is round 1's 774 plus the 13 new tests. The failures and the skip are the same native kernel-lock credential cases as in round 1, which need the macOS-built `fs-ext` binary. The implementing agent ran only 89 focused tests on the corrected target, so this is the first full-suite run at `4a4d060`.
- **Probes**, using scripted doubles and no live inference:
  - *Undesignated inability.* Renders "New investigation request.", "Attempt: accepted" and "Attempt report: Producer-reported inability: …"; on repeat, "Retained outcome; no new investigation." with the same report.
  - *Refusal and malformed reply.* Both render `Attempt: investigation-failure: <reason>`; on repeat, as a retained outcome with the identical line.
  - *Unconfigured agent* (no investigator). Renders `Attempt: configuration-unavailable (investigating-agent-not-configured): <diagnostic>`, and a repeat is again a new request (still retryable). The diagnostic now appears once; at round 1 it appeared once as a bare line.
  - *Over-bound acquisition.* My round 1 70,000-character probe now records both contribution entries as `delivery: 'withheld'`, with the omission reason and empty records and deliveries.

### Assessment of the corrections

- **F1.**
  - `renderContributionView` reads the outcome from `reporting.contribution.outcome`, falling back to `reporting.unavailable`. It prints kind, code and reason or diagnostic, each submission problem, the attempt report's inability and statement, and reused versus new.
  - All text passes through `inlineText`. The new tests assert that embedded newlines cannot forge lines.
  - Nothing changed in the answer projection or its identity. Exact presentation still has `reporting: null`, and the tests assert that none of the attempt lines appear there.
  - The presentation method advanced to `@3`, which is appropriate because the rendered artifact changed.
  - The six scenarios × direct/worker tests cover each outcome shape, retained versus retryable repetition, and preservation of the reported lines on reuse.
- **F2.**
  - `withheld` is set after `acquiredContributions` and before dispatch. `delivered()` leaves a withheld entry unchanged, so a later dispatch of the omission notice cannot flip it.
  - Exposure is unaffected: the boundary already discards the omitted deliveries, and the new test confirms that only the later bounded excerpt appears in `contributionDeliveries`.

### Non-defect observations

- Accepted attempts now always print `Attempt: accepted`, including on successful answers. That line is redundant there but harmless.
- The `reporting.provider` field is still not rendered. This is unchanged from round 1 and outside the findings; I note it only as a reminder of the existing provider-detail disclosure policy.

### Unverified areas and residual limits

- I did not rerun the representative memory comparison. The corrections do not touch retention or answer construction.
- The native kernel-lock credential tests could not run in this VM.
- My round 1 limits on legacy-helper retirement (M4) and on live usability evidence stand.
