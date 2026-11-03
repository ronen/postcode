Record type: findings
Received: 2026-10-25
Reviewer: Claude
Handoff: human-arranged planning review; no formal handoff
Round: 2
Reviewed target: b3c5e3d4f7849f2fbd3f368b3f64dce6616c60cc
Prior findings: [Round 1](2026-10-14-planning-round-1-findings.md)
Prior reviewed target: 3f5eced20c1027cb3f7f1853a6beef0ec36cebfa
Scope: exact retained-answer presentation planning package and prior disposition

# Exact retained-answer presentation: planning review, round 2

The report's authored review date is preserved below; the received date records when the human supplied it in this conversation. Relative links inside the returned report retain the author's original checkout context.

## Returned findings

# Review: exact retained-answer presentation planning package, round 2

Reviewed: 2026-10-14
Reviewed target: b3c5e3d (package corrections at 3e069d9; disposition record at b3c5e3d). Working-tree drafts are identical to the branch.
Prior round: [round 1 findings](../records/reviews/exact-retained-answer-presentation/2026-10-14-planning-round-1-findings.md) and its [disposition](../records/reviews/exact-retained-answer-presentation/2026-10-14-planning-disposition.md).
Baseline: `main` is still 2961906. I fetched nothing and ran no build or tests.

What I checked:

- I re-read every file in the package and both review records.
- I re-checked the changed claims against source: `session.ts`, `presentation.ts`, `organization/presentation.ts`, `dependencies/presentation.ts`, `identity.ts`, `typescript/project.ts`, `investigation/{presentation,associations}.ts` and `request-reporting.ts`.
- I re-ran a link check. Every relative link resolves against its intended canonical location, including fragments and the two new documents.

## Overall assessment

All round-1 findings have been addressed, and the disposition accurately describes what changed.

A1–A3 are resolved soundly:

- A1: the package keeps the unknown-continuation View, so no supersession is needed.
- A2: revision paging now applies across the whole answer, with one shared hint.
- A3: an explicit fresh/retained mode marker joins View identity, and each family's identity inputs are listed in a table.

The B-series reconciliation is complete. The decision now carries the preservation-clause inventory, and the backlog replacements are well scoped. I accept the disposition's B4 reasoning: change the version-three convention together with the producer, not at promotion.

The C-series snags are now pinned down in the plan.

I found no blocking issues. The items below are either new consequences of the round-1 changes or small residual inconsistencies. N1 and N2 should be settled before approval. The rest are editorial or can be delegated.

## Disposition check

| Round-1 item | Status in the package |
| --- | --- |
| A1 unknown continuation | Resolved. Plan §Outcomes, decision “Check Presentation”, the preservation-clause table and the verification rows agree. Only malformed syntax is refused. |
| A2 answer-wide revision paging | Resolved. Plan lines 145–147, decision line 52 and the verification row with unequal page counts all match. |
| A3 retained-route View identity | Resolved, with one factual slip (N4). |
| B1 backlog | Resolved by complete replacement entries for captured basis and reference lifetime. The F6 deletion note mentions the shared-context entry. |
| B2/B3 terminology and retired syntax | Resolved by the plan's reconciliation inventory and the decision's historical “redisplay” mapping. A few residual uses remain in the plan itself (N6). |
| B4 version-three convention | Disposition accepted. Recorded in the inventory as an implementation-time change. |
| B5 preservation inventory | Resolved. See N5 for one wording point. |
| B6 promotion housekeeping | Resolved by the promotion paragraph and the note-link instruction. |
| C1–C8 | Resolved. C1 has a follow-on ordering snag (N1). |
| D | Resolved: `#### Decision` subheadings added, delegated details listed, architecture revision updated. |

## Findings

### N1. On the fresh associated-inspection path, the composite answer does not exist yet when the base View is arranged (moderate)

The plan and decision say the answer alias is allocated “after exact target resolution/construction and before arrangement” on both routes. Each presented answer must expose its alias in human and structured output, and continuation hints must embed it.

Today's fresh inspection path runs in this order (`session.ts` lines 277–280):

1. It arranges the mechanical View with `createMechanicalView`.
2. Only then does `createAssociatedInspectionView` select the composite.
3. Finally it overwrites `projection.id`.

The composite, which is the answer whose alias should appear, therefore does not exist while the base is being arranged. The retained route has no such problem, because the composite already exists.

Recommendation: state that fresh inspection selects the associated composite from the mechanical Projection ID *before* arranging the base View, then allocates the composite alias, then arranges base and listing. `selectAssociatedInspection` needs only the Projection ID, not the View.

Also confirm that this reordering leaves the accepted subject-binding schedule unchanged. It should: composite selection allocates nothing, and associated-listing binding still follows the mechanical allocations.

Add an M1/M2 check that fresh inspect output shows the composite's alias, not the base's.

### N2. Generated continuations and the other effective choices (moderate)

The plan rightly says a request does not inherit a previous View's options. Generated hints, however, are produced by a View that knows its own effective choices. The plan does not say whether a hint repeats them. Some cases where it matters:

- A Unicode view with `--source-detail` whose hint reads only `present @answer-… --after @…` turns source detail off on the next page.
- A historical-inspection view shown at `--revision-page 2` emits an association hint. If that hint omits `--revision-page 2`, the revision rows silently return to page 1. The same applies in the other direction.

Recommendation: specify that a generated continuation reproduces the View's other non-default effective choices (format excepted where the shell default applies), changing only the paged input. Alternatively, say explicitly that hints reset other choices and disclose this in the hint. Add a verification case combining `--source-detail`, `--after` and `--revision-page` on a historical-inspection answer.

### N3. Adding the mode marker changes fresh View identity and presentation method versions, and through them captured-input references (minor to moderate)

The marker is added to *every* family's View identity, fresh routes included. That changes fresh View IDs, so `methods.presentation`, `methods.investigationPresentation` and `methods.exportsPresentation` must advance.

The method registry is captured in the Session and analysis-input records (`typescript/project.ts` lines 286 and 298). The accepted request-model decision noted that method changes can therefore change input-record references and, through them, Projection IDs across versions.

The plan says “do not change answer formulas merely to add the request route”. That stays true of the formulas, but answer IDs will still differ between builds. Within a Session, continuity is unaffected.

Recommendation:

- Say in the plan (identity section) and the decision (preservation table, qualified-construction row) that adding the marker bumps the responsible presentation methods, with this cross-version effect on input references and answer IDs.
- Say that this is permitted and unrelated to within-Session continuity.
- State that the marker counts as exposed consequential context under the accepted View-identity rule, which explains why no supersession is needed.

### N4. The retained identity table lists a title for dependency Views, which have none (minor)

Plan line 163 and decision line 94 include “neutral title” among the identity inputs for “Module, organization, dependency and internal exports View”. The module, organization and exports formulas do hash a title. The dependency View formula (`dependencies/presentation.ts` line 190) hashes no title, and the View does not expose one.

Recommendation: write “neutral title where the family exposes one”, or split the dependency row out. The plan should also make the parallel fresh-route change explicit: the fresh title stays in the formula alongside the new mode marker.

### N5. Decision wording: “authorizes” (minor)

The decision's preservation table (request-model row) says “Acceptance of this decision authorizes present, removal of fresh paging flags, …”. The package elsewhere stresses that adoption authorizes no implementation, and the request-model clause concerns *human agreement to visible changes*, not authorization to implement.

Suggested wording: “Acceptance records human agreement to these consequential visible changes: …; implementation still requires separate authorization.”

### N6. Residual terminology and stale sentences in the plan (minor)

- Implementation-assessment table: “Redisplay must recover that exact variant…” (associations row) and “No answer target or redisplay command exists” (commands row) use “redisplay” in the *exact* sense. The package's own rule now reserves that sense for “exact presentation” and maps historical “redisplay” to fresh selection. Use “exact presentation” in both places.
- Line 49 still says only that STATUS.md uses “redisplay”. The later reconciliation table supersedes it. Shorten the line to a pointer to that table.
- Decision line 27 says an embedded support pointer “receives an alias only when selected”. “Selected” collides with core selection; use “only when targeted by present”.

### N7. Guided answer-reference refusal covers only inspect (minor)

The plan and decision specify a guided refusal for `inspect @answer-…`. Every subject-taking command accepts `@` references: `children`, `parents`, `summarize`, `explain`, `decompose`, `examine`. Today each of these would report an unbound or unknown subject.

Recommendation: either apply the guided refusal wherever a subject reference is classified, or state that only `inspect` gets it. Also say how `@<precise Projection ID>` supplied as a subject is treated. The current fallback in `boundEntity` reads raw IDs as subject IDs and rejects non-entity kinds without guidance.

### N8. Verification matrix narrower than the new reference-lifetime backlog commitment (minor)

The reference-lifetime backlog replacement assigns this plan disclosure and conformance verification for *all* references in affected program Views. That includes subject and supporting source/navigation references in human and JSON output. The verification matrix still says only “one-shot lifetime is explicit for every family”.

Recommendation: extend that row (or the target/reference lifecycle row) to name answer, subject and supporting references, in Unicode and JSON. Then M3 can show the commitment the backlog relies on.

## Consistency and relationship checks

- **Plan, decision, constraint and revisions.** These agree on Q1–Q3, C4 alias semantics, unknown continuation, answer-wide paging, outcome/exit status, the observation version and lifecycle. The constraint addition is unaffected by A1: an unknown continuation is neither an incompatible target nor a need for information outside the answer.
- **Accepted decisions.** No conflicts remain beyond the clarifications in N3 and N5. The preservation inventory covers the clauses I identified in round 1. The architecture revision describes disclosed reselection as permissible but not the selected remedy, which is consistent with the coordinated-Views decision.
- **Backlog replacements.** The captured-basis and reference-lifetime replacements preserve the original entries' substance and add only the allocation to this plan. The coordinated-View conformance entry is correctly left intact.
- **Process.** Draft statuses, the promotion checklist and the note-link instruction follow `dev/planning.md` and the note policy. The review and disposition records reference the reviewed and correction commits.

## Conclusion

After N1 and N2 are settled and the small corrections in N3–N8 are made, I see no remaining obstacle to presenting the package for human approval. None of the findings reopens a human-resolved choice.
