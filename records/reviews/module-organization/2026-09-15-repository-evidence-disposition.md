Record type: disposition

# Repository evidence checkpoint: disposition

Date: 2026-09-15
Task: [Implement the module organization slice](../../tasks/2026-09-15-module-organization.md)
Handoff: [Repository evidence checkpoint](2026-09-15-repository-evidence-handoff.md)
Findings: [Round 1](2026-09-15-repository-evidence-round-1-findings.md)
Correction target: `ae09e427acae3ce3e112081ed270f0fbe5f965d8`

## Findings and dispositions

### 1. Missing `target-not-established` regression — accepted

Added a real-filesystem fixture with a captured `Target` directory and a link
whose target uses the spelling `target`. It asserts the captured
`target-not-established` status, null resolution and target kind, preservation
of that outcome in layout derivation, and absence of an additional containment
edge or duplicate region.

The test detects whether the fixture's filesystem supports that case alias and
explicitly skips otherwise; it does not substitute a broken-link assertion and
claim to have exercised the unestablished-target branch. It ran and passed on
the implementation machine, as confirmed by the suite's zero skipped tests.

### 2. Redundant opaque-boundary classification — accepted

Confirmed that capture checks each resolved path segment for an opaque boundary
and returns `opaque-boundary` before a target at or beneath that boundary can
receive `resolved` status. Capture also does not enumerate artifacts within
those boundaries. Consequently, the second boundary-path check in
`deriveLayout` was unreachable for evidence produced by this provider.

Removed the duplicate classifier and its now-unused boundary-path collection.
A local comment identifies capture's ownership of the classification, and the
existing opaque-link fixture now asserts the derived refusal outcomes and the
absence of containment edges. This cleanup preserves behavior for valid captured
evidence, so it does not require an identity-method version change.

### Non-defect observations

- Added a three-group link-cycle fixture that verifies transitive cycle refusal,
  retained acyclic edges, and independence from artifact input order.
- Added a fixture opening a nested project through a directory alias and
  resolving an absolute link through that invoked worktree path.
- The suggested additional environmental error classifications (`ENAMETOOLONG`
  and `ESTALE`) remain unmodified and unverified. The review did not identify
  them as blockers, and this correction preserves the existing failure policy.
  Broader operational-failure coverage remains a disclosed limit rather than a
  claimed result of these corrections.

## Corrections and verification

Commit `ae09e427acae3ce3e112081ed270f0fbe5f965d8` contains the implementation
cleanup and regression tests. Relative to the reviewed target, the correction
changes only `src/lib/repository/layout.ts` and `test/repository.test.ts`;
intervening handoff, findings, and task-progress commits are review context.

Implementing-agent verification:

- `npm run check`: passed.
- `npm test`: 100 passed, zero failed, zero skipped; this includes all 23
  repository tests and the new case-spelling fixture.
- `git diff --check` and staged diff checks: passed.
- Manual correction-diff inspection: complete.

The original handoff and reviewer-authored findings remain unchanged. These
minor corrections do not materially invalidate the reviewer's analysis and
were verified by the implementing agent under the review workflow. A further
review round, if requested by the human, can use the correction target above
under the same handoff; no new assignment is needed.

## Review rounds

Round 1 examined `b48b47baff36f3f38f855a5391966fb484247bd7` against baseline
`0af5595c5d130020214245cd3b8d6205e7d59449` and recommended readiness for
integration conditioned on the missing regression test. The corrections above
address that condition and the second actionable finding. No independent round
has yet examined the correction target.

## Gate conclusion

The human directed the implementing agent to act on round-1 findings. The
corrections are complete and verified; the human has not yet explicitly recorded
the intermediate checkpoint's acceptance or requested another round. Human
direction on that checkpoint remains pending, and the task remains active.

This disposition does not close the implementation task or replace its required
final integrated review. Snapshot and record integration, organization views,
remaining planned verification, and the final human review-gate conclusion still
lie ahead.
