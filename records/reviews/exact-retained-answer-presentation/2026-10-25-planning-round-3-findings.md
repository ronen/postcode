Record type: findings
Received: 2026-10-25
Reviewer: Claude
Handoff: human-arranged planning review; no formal handoff
Round: 3
Reviewed target: 3677d72e99d51caaa0b623a0364b924738625999
Prior findings: [Round 1](2026-10-14-planning-round-1-findings.md), [Round 2](2026-10-25-planning-round-2-findings.md)
Prior reviewed target: b3c5e3d4f7849f2fbd3f368b3f64dce6616c60cc
Scope: exact retained-answer presentation planning package and cumulative disposition

# Exact retained-answer presentation: planning review, round 3

Relative links inside the returned report retain the author's original checkout context. The returned report below is preserved verbatim.

## Returned findings

# Review: exact retained-answer presentation planning package, round 3

Reviewed: 2026-10-25
Reviewed target: 3677d72 (round-two corrections at dcb509b and 9de34f0; disposition updated at 36b0baf and 3677d72). Working-tree drafts and review records are identical to the branch.
Prior rounds: [round 1](../records/reviews/exact-retained-answer-presentation/2026-10-14-planning-round-1-findings.md), [round 2](../records/reviews/exact-retained-answer-presentation/2026-10-25-planning-round-2-findings.md), [disposition](../records/reviews/exact-retained-answer-presentation/2026-10-14-planning-disposition.md).
Baseline: `main` is still 2961906, so the plan's source assessment is still current. I fetched nothing and ran no build or tests.

What I checked:

- I read the full diff b3c5e3d..3677d72, the current plan and decision, and the updated disposition.
- I checked that the round-2 record preserves the returned report verbatim. It does, byte for byte.
- I re-checked the new claims against source:
  - composite selection allocates no references (`selectAssociatedInspection`/`derive`);
  - listing binding comes after the base mechanical View;
  - title inputs per View family;
  - the captured method registry (`typescript/project.ts` lines 286 and 298);
  - subject-reference classification (`commands.ts`, `memory-store.ts` `boundEntity`);
  - the JSON shapes of continuation data (`associations.ts`, `revision-page.ts`).

## Overall assessment

Every round-2 finding is resolved as the disposition describes.

- N1: the fresh composite ordering is now specified. The claim that composite selection allocates no subject references matches the code. Listing binding still follows the mechanical allocations, and the M1/M2 exit evidence checks the composite alias.
- N2: the human-agreed hint policy is stated consistently in plan and decision, and has a combined-options verification row.
- N3–N8: all addressed. The method-version and captured-registry effect is stated accurately, and the dependency-title correction is right. The wording now says “records human agreement”. Terminology and the support-pointer phrasing are fixed. The answer-as-subject refusal now applies to every subject-taking command. Lifetime verification matches the backlog commitment.

The plan, decision, constraint addition and revision files still agree, and nothing reopens a human-resolved choice. I found no blocking or consequential issues. The items below are small clarifications, mostly prompted by the new hint text, plus two record-format nits. In my view the package is ready to go to the human for approval once R1 is clarified; the others can be fixed in passing or delegated.

## Findings

### R1. How JSON Views carry generated continuations is unstated (minor to moderate)

The new hint policy says to “Emit --json for a JSON View”. The combined-choices verification row executes generated continuations in an explicit-JSON context and in a JSON-default shell. Current JSON Views, however, carry no command text. The association listing exposes `next` (a reference spelling), revision statuses expose `nextPage` (a number), and the JSON renderer is `JSON.stringify(view)`. Today, hints exist only in Unicode rendering.

The plan therefore implicitly adds a generated continuation to JSON descriptors, without saying so or giving its shape. In a `postcode shell --json` session every View is JSON, so this is the only way that user can follow a continuation.

Recommendation: say that JSON Views carry the same generated continuation as a field. Either of these works:

- a shell command string, terminal-safe within JSON;
- preferably, a structured next request (target, `after`, `revisionPage`, `sourceDetail`, format) from which the command can be derived. This is easier for agents to consume and avoids quoting concerns.

Add it to the experimental-shape changes listed in the decision's request-model preservation row. Field naming can stay delegated.

### R2. Answer-as-subject guidance in one-shot mode (minor)

The refusal is specified “at the shared subject-reference classification boundary”. In one-shot mode no reference classification happens: `commands.ts` treats an `@`-prefixed selector as a reference only when `interactive`. So `postcode inspect @answer-…` currently performs a literal name lookup of `@answer-…` and reports no match.

State whether one-shot use gets equivalent guidance (an answer reference cannot be used outside the shell that bound it; open a shell and request the information there) or keeps literal-lookup behavior. Either is defensible; the plan should pick one, and the verification row should cover it.

A related small point: the command list (inspect … examine) is complete for production. Say that the internal extension fixtures reach the same shared boundary, so the extension-locality row also covers this refusal.

### R3. Carrying an unknown continuation into the revision hint (minor)

“Carry … the current --after when changing revision page” is right for a valid continuation. On a historical-inspection View whose association listing is in the unknown-continuation state, a faithful carry would reproduce that state, and the failed command status, on the next revision page.

Say which is intended. A reasonable rule: carry `--after` only when it resolved within the frozen listing, otherwise omit it and say so. Faithful reproduction is also acceptable. Add the case to the combined-choices verification row.

### R4. Decision Context omits the N2 agreement (editorial)

The decision's Context records the human agreements on Q1–Q3 and C4. The normative hint-preservation rule now in “Check Presentation against retained content” also rests on an explicit human choice (N2, 2026-10-25), but that is recorded only in the plan and the disposition. For parity, add one sentence to the decision Context, or rely on package acceptance and leave it. In either case, the promotion step that rewrites draft-only Context prose should keep the substance.

### R5. Review-record format (editorial)

- The round-2 findings record begins with its metadata block and has no record title of its own. The [findings template](../dev/templates/review-findings.md), the round-1 record and the lens-request-model series all begin with a `# … round N findings` heading. Only the verbatim report's own title appears, under “Returned findings”.
- The disposition puts its H1 after the metadata block, whereas the template puts the title first.

Neither affects the content. Align them if the series should match the template; the human decides.

## Conclusion

Three review rounds have converged. After R1 is clarified, and optionally R2–R5, I have no further concerns with the package's internal consistency, its relationship to the accepted decisions and canonical documents, or its implementability as assessed against the unchanged baseline. Approval, promotion and implementation authorization remain the human's decisions.
