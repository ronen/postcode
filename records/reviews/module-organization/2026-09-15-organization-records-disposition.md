Record type: disposition

# Organization records and projections checkpoint disposition

Recorded: 2026-09-15
Handoff: [Organization records and projections](2026-09-15-organization-records-handoff.md)
Findings: [Round 1](2026-09-15-organization-records-round-1-findings.md)
Task: [Module organization](../../tasks/2026-09-15-module-organization.md)
Correction: `f46b513`

## Findings and corrections

Accepted the low-severity opaque-README finding. Layout derivation excludes
boundary artifacts from documentation matching while retaining their artifact
placements. Regression coverage includes README-named nested repositories and
gitlinks. An older special-artifact assertion encoded the erroneous behavior; it
now asserts the corrected distinction. Ordinary non-boundary README artifact
matching is preserved, and the layout method version is incremented.

Addressed the invocation-root observation as a small robustness correction.
Capture now retains a lexical root alias only when an actual lexical ancestor
resolves to the discovered worktree root. It no longer infers root aliases from
equal path depth. An intermediate-segment link regression verifies established
module placement and the absence of a falsely invented root alias. The capture
method version is incremented.

The expansion and individual-claim partiality observations require no behavioral
change. Direct relationships remain available in organization subjects;
inspection expansions carry adjacent entities. Partial individual claims and
candidate ambiguity remain supported outcomes rather than invented provider data.
The returned findings and handoff remain unchanged.

## Verification and gate

`npm run check` passed. After correcting the obsolete special-artifact assertion,
`npm test` passed all 117 tests with zero failures and zero skips. The diff and
staged whitespace checks passed. The existing whole-worktree alias, link,
snapshot, store, and projection regressions continue to pass.

The human explicitly authorized the implementing agent to determine whether
another round is needed and to accept the checkpoint if it is not. The agent
judges these bounded corrections sufficiently covered without another round:
they preserve the reviewed record/evaluation/projection contracts and have direct
regressions for the reported counterexamples. This intermediate checkpoint is
accepted under that authorization; implementation proceeds to presentation and
CLI integration. Final integrated review and explicit human acceptance remain
required before task closure.
