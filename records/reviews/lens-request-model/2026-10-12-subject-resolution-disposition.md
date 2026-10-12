# Qualified subject resolution checkpoint: disposition

Record type: disposition
Date: 2026-10-12
Task: [Implement explicit Lenses and qualified request resolution](../../tasks/2026-10-11-lens-request-model.md)
Handoff: [Qualified subject resolution checkpoint](2026-10-12-subject-resolution-handoff.md)
Findings: [Round 1](2026-10-12-subject-resolution-round-1-findings.md)

## Findings and dispositions

### F1 — Unsuccessful name lookups allocate the lookup population

**Requires human direction on the correction.** The finding is confirmed: name lookup allocates group and module populations before deciding whether they match. The approved plan permits a different allocation history for unsuccessful requests while preserving successful allocation schedules and existing bindings. Recommend matching first, allocating the established group-then-module populations for resolved requests, and allocating only delivered candidates for ambiguous requests; a missing request would allocate nothing merely for lookup. The reviewer also allows deliberately retaining population-wide allocation. Because this choice can affect later compact spellings and the next identity migration, the human was asked to select the behavior. No F1 implementation change has been made pending that answer. The selected behavior needs explicit missing/ambiguous allocation regression coverage.

### F2 — Text hides an established module no-match behind unavailable group lookup

**Accepted and corrected** in `fd1ddfbe145407cadbaa6baa03fdc550b0d6efa8`. Unicode resolution reports describe each supporting population separately, with established coverage or its applicability, availability, execution and materialization state, the match outcome, and its concrete reason when supplied. Thus a project outside a Git worktree reports `Modules: fully established; no match` alongside unavailable group lookup and its `not-in-worktree` reason. Existing qualification remains present, including the unavailable-layout limitation; incomplete populations do not imply established absence. No status-taxonomy or retained-answer change was necessary. The CLI regression checks the distinct outcomes and reasons.

### F3 — Investigram-only name designation is called a population miss

**Accepted and corrected** in `fd1ddfbe145407cadbaa6baa03fdc550b0d6efa8`. Shared designation validation refuses a name when the Lens has no name-designatable module/group subjects. Direct `explain`, `decompose` and `examine` calls now return `invalid-designation`, explain the precise investigram-reference requirement, and preserve the supplied name as request context. The direct regression covers all three Lenses, no Evaluation or Projection writes, and no prerequisite or retained-answer references. CLI syntax is unchanged. The reference documentation covers both F2 and F3 corrections.

### F4 — Raw record IDs are accepted but omitted from reference criteria

**Requires human direction on the correction.** The finding is confirmed: `boundEntity` accepts retained same-Session module/group/investigram record IDs in addition to established compact bindings, while the criteria mention only the latter. Recommend preserving and documenting the accepted raw-ID path and correcting its criteria, including the same-Session/entity-kind restrictions. This preserves former module behavior and deliberately acknowledges its extension to groups and investigrams. The alternative removes raw IDs from the public precise-reference path. The human was asked to select the behavior before the identity migration depends on it. No F4 implementation change has been made pending that answer; the selected behavior needs regression coverage.

## Corrections and verification

Correction target: `fd1ddfbe145407cadbaa6baa03fdc550b0d6efa8` (F2 and F3 only).

- `npm run check` and `npm run build` passed.
- Targeted direct-request, subject-resolution and CLI tests ran 59 cases: 58 passed, and the newly added F2 assertion failed because it expected the layout qualification in the concrete-reason line. Actual output correctly retained both separately. The assertion was corrected to check the `not-in-worktree` reason and the unavailable-layout qualification; the affected CLI test then passed on its own after rebuilding. No product behavior was changed to satisfy that assertion, and the other 58 tests were not rerun unnecessarily.
- `git diff --check` passed. No paid inference was used. Repository inputs were held stable during the tests.
- The reviewer independently passed the full 509-test suite at the original target. A new full-suite result is not claimed for these corrections.

The reviewer's residual coverage limits remain recorded: cancellation/interruption during lookup, worker restart between candidate delivery and follow-up, mixed module/group-name lookup with partial group materialization, and mixed reference/name shell follow-up were not specifically exercised in the review. Complete prerequisite attribution remains outstanding plan work. The historical intermittent CLI failure's cause remains unconfirmed; the named test passed in both the reviewer's suite and this targeted run. These corrections do not resolve or qualify away those limits.

## Review rounds

Round 1 reviewed `6acd1e94c89e026b2fa32dc86fce24b9897d0d37` against baseline `d5041af`. The reviewer found four low-severity issues and recommended continuation without another review round unless the human prefers one. The preserved findings and original handoff remain unchanged.

## Gate conclusion

Human direction is pending for F1 and F4. The human has not yet accepted this intermediate gate. The task remains active, and wider implementation stays paused. This disposition records every finding without rejecting, materially qualifying or silently selecting between the alternatives identified by the reviewer.
