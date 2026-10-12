# Qualified subject resolution checkpoint: disposition

Record type: disposition
Date: 2026-10-12
Task: [Implement explicit Lenses and qualified request resolution](../../tasks/2026-10-11-lens-request-model.md)
Handoff: [Qualified subject resolution checkpoint](2026-10-12-subject-resolution-handoff.md)
Findings: [Round 1](2026-10-12-subject-resolution-round-1-findings.md)

## Findings and dispositions

### F1 — Unsuccessful name lookups allocate the lookup population

**Accepted and corrected** in `218e00c37498d9c80987e709907f0b29bbea65dd`, after explicit human direction recorded in the task follow-up. Lookup now matches before allocating. Missing, incomplete no-match and unavailable no-match results allocate no references merely for lookup; ambiguity binds the full returned candidate set, independently of rendered paging. Successful requests retain the group-then-module whole-population schedule. Existing bindings and genuine prerequisite allocations remain intact. The human rejected the alternative of binding unrelated population members on failure. Controlled collision coverage verifies no allocation for all three no-match states, the complete ambiguous candidate bindings, preservation of earlier bindings, and the longer spelling assigned to an unrelated colliding subject only when it is later allocated. Separate coverage pins successful whole-population order. The [accepted reference decision](../../../docs/decisions/precise-subject-designations-and-lookup-bindings.md) preserves the choice for the remaining migration.

### F2 — Text hides an established module no-match behind unavailable group lookup

**Accepted and corrected** in `fd1ddfbe145407cadbaa6baa03fdc550b0d6efa8`. Unicode resolution reports describe each supporting population separately, with established coverage or its applicability, availability, execution and materialization state, the match outcome, and its concrete reason when supplied. Thus a project outside a Git worktree reports `Modules: fully established; no match` alongside unavailable group lookup and its `not-in-worktree` reason. Existing qualification remains present, including the unavailable-layout limitation; incomplete populations do not imply established absence. No status-taxonomy or retained-answer change was necessary. The CLI regression checks the distinct outcomes and reasons.

### F3 — Investigram-only name designation is called a population miss

**Accepted and corrected** in `fd1ddfbe145407cadbaa6baa03fdc550b0d6efa8`. Shared designation validation refuses a name when the Lens has no name-designatable module/group subjects. Direct `explain`, `decompose` and `examine` calls now return `invalid-designation`, explain the precise investigram-reference requirement, and preserve the supplied name as request context. The direct regression covers all three Lenses, no Evaluation or Projection writes, and no prerequisite or retained-answer references. CLI syntax is unchanged. The reference documentation covers both F2 and F3 corrections.

### F4 — Raw record IDs are accepted but omitted from reference criteria

**Accepted and corrected** in `218e00c37498d9c80987e709907f0b29bbea65dd`, following explicit human approval of retained raw same-Session IDs alongside compact references. Resolution criteria, unknown-reference wording and documentation now state both forms. Both paths verify the actual retained record, Session and supported subject kind before separate Lens applicability checking. A known incompatible subject remains unsupported. Literal names are not reinterpreted, and neither spelling promises persistence or cross-Session validity.

Public request coordination supplies the resolved record ID to construction for either precise spelling. This makes raw and compact module/group references retain identical mechanical answer payloads and IDs; investigation selection already retained the resolved subject, and its View descriptor now uses the same normalized spelling. Request context and resolution candidates preserve the supplied spelling. Responsible methods advance to `projection@11`, `dependency-projection@5` and `investigation-presentation@13`. Shell revision-page syntax also accepts a raw investigram subject, with actual record validation still performed in coordination. Tests cover module inspection, both dependency directions, unavailable summary, group inspection, exact investigram inspection, never-bound raw groups/investigrams, unsupported targets, non-entity records, foreign Sessions, and raw-looking literals. Raw and compact requests share answer descriptors without conflicting retained resubmission. This completes precise-spelling equivalence; the broader name/handle/reference answer migration and legacy low-level builder migration remain approved plan work.

## Corrections and verification

Correction targets: `fd1ddfbe145407cadbaa6baa03fdc550b0d6efa8` (F2 and F3), followed by `218e00c37498d9c80987e709907f0b29bbea65dd` (F1 and F4). The latter is the complete corrected target for this assignment.

- `npm run check` and `npm run build` passed.
- Targeted direct-request, subject-resolution and CLI tests ran 59 cases: 58 passed, and the newly added F2 assertion failed because it expected the layout qualification in the concrete-reason line. Actual output correctly retained both separately. The assertion was corrected to check the `not-in-worktree` reason and the unavailable-layout qualification; the affected CLI test then passed on its own after rebuilding. No product behavior was changed to satisfy that assertion, and the other 58 tests were not rerun unnecessarily.
- `git diff --check` passed. No paid inference was used. Repository inputs were held stable during the tests.
- The reviewer independently passed the full 509-test suite at the original target.

After F1/F4 corrections, final `npm run check` and `npm test` passed all **513 tests** (about 171 seconds). An initial focused run passed 64 of 67 tests; two new equality assertions exposed the remaining supplied spelling in investigation View descriptors, and one new allocation-order test incorrectly assumed the first group had a name. The descriptors were normalized and the allocation test now selects an established module handle while checking both population calls. A subsequent focused run passed 14 tests, and the final full suite includes all corrected cases plus unbound group coverage. `git diff --check` passed. Repository inputs were held stable during every test run; no paid inference was used. The local loopback permission serves existing offline authentication tests.

The reviewer's residual coverage limits remain recorded: cancellation/interruption during lookup, worker restart between candidate delivery and follow-up, mixed module/group-name lookup with partial group materialization, and mixed reference/name shell follow-up were not specifically exercised in the review. Complete prerequisite attribution remains outstanding plan work. The historical intermittent CLI failure's cause remains unconfirmed; the named test passed in both the reviewer's suite and this targeted run. These corrections do not resolve or qualify away those limits.

## Review rounds

Round 1 reviewed `6acd1e94c89e026b2fa32dc86fce24b9897d0d37` against baseline `d5041af`. The reviewer found four low-severity issues and recommended continuation without another review round unless the human prefers one. The preserved findings and original handoff remain unchanged.

## Gate conclusion

All four findings are accepted and corrected, with the consequential F1/F4 alternatives settled by the human. No finding is rejected or deferred. The human has not yet accepted this intermediate gate; the task remains active and wider implementation stays paused pending that acceptance. The reviewer recommended no further round for these corrections unless the human prefers one. The exact corrected target above is available for such a round under the existing handoff. The full-plan identity migration, attribution, compatibility, extension demonstrations and final integrated review remain required.
