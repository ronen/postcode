# Exact retained-answer presentation: planning review, round 1

Record type: findings
Received: 2026-10-14
Reviewer: Claude
Handoff: Human-arranged planning review; no formal handoff record
Round: 1
Reviewed target: 3f5eced20c1027cb3f7f1853a6beef0ec36cebfa
Scope: Planning package introduced by c209d5e and revised by 3f5eced; implementation baseline 296190615e60872bd8db6bf9a40334ca7787a3ed

The human supplied the review and requested assessment, discussion of disagreements or consequential choices, and action on the remainder. This is a planning review, not an implementation review gate or authorization to implement.

The returned report is preserved verbatim below. Its ../docs/ links use the reviewer's original checkout-relative context and identify docs/ at the reviewed baseline, rather than paths relative to this preservation directory. No source report is needed to recover the findings.

## Returned findings

# Review: exact retained-answer presentation planning package

Reviewed: 2026-10-14
Package: `drafts/exact-retained-answer-presentation/` on `codex/exact-retained-answer-presentation` (commits c209d5e, 3f5eced; working tree identical to 3f5eced)
Baseline checked: `main` = `origin/main` (as last fetched) = 2961906, matching the plan's stated assessment baseline. No fetch, build or test run was performed for this review.

Scope of reading: every file in the package; `dev/planning.md`, `dev/process-conventions.md`, `drafts/README.md`, the plan/decision indexes; the backlog (F5, F6, captured-basis, coordinated-View conformance, navigation-origin, reference-lifetime, retry/rerun entries); the architectural constraints (Views, bindings, session references, retained interpretation, observations); the coordinated-Views, qualified-construction-under-the-request-model, experimental-outputs and investigrams decisions (relevant sections); the audit F5/F6 anchors; and the source files the plan's assessment table cites, with particular attention to `session.ts`, `commands.ts`, `presentation-contracts.ts`, `mechanical-implementations.ts`, `investigation/{selection,associations,presentation,revision-page}.ts`, `reference-binding.ts`, `identity.ts`, `memory-store.ts`, `interactive-session.ts`, `request-reporting.ts` and `resolution-context.ts`.

## Overall assessment

The package is well aligned with the governing material. It makes the existing continuity contract operable without redefining Projection, View or pinned input. Its scope boundaries hold up: no persistence, no refresh-from-Projection, no generic registry, and Q2 is kept as a lifecycle limitation. The implementation assessment is accurate; every code claim I checked holds (see the last section). Plan, decision and constraint text agree on the main points.

There are three substantive problems to resolve before promotion:

1. The refusal rule for invalid continuations conflicts with an accepted decision and with the plan's own identity row (A1).
2. Revision-page continuation semantics are underspecified once paging moves to `present` (A2).
3. The identity treatment of the new presentation-mode and target context is not stated (A3).

Several other items are omissions in reconciling the backlog and documentation (B-series), plus some implementation snags worth pinning down in the plan (C-series).

## A. Substantive issues (resolve before promotion)

### A1. Invalid/unknown continuation as non-View refusal contradicts accepted contracts and the plan itself

- Decision, “Check Presentation against retained content”: “Invalid continuations produce non-View refusal.” Plan §Outcomes: “A refused target, option, continuation … is a current refusal.” Verification matrix: “a Q-only token is refused for P.”
- The accepted [qualified construction under the request model](../docs/decisions/qualified-construction-under-the-request-model.md) assigns “Association continuation and unknown-token handling” to Presentation (family table). It also says an unknown token “contributes a literal in a disjoint key space” of View identity (line 104). Current code matches this. `arrangeAssociatedInvestigations` returns `status: 'unknown-continuation'` within a View, and `session.ts` marks such Views `failed`.
- Internal inconsistency: the plan's identity row still requires “Semantic continuation normalization retains literals in a disjoint key space”. The decision also says “Preserve explicit continuation normalization”. If unknown tokens are refused, no literal ever reaches View identity on the retained path, and after the paging move there is no fresh path that accepts `--after` at all. The rule becomes dead.
- The decision's Governing impact claims it “does not replace a headed decision”, so this change is currently unmapped.

Recommendation: choose one of the following.

- (a) Keep the existing unknown-continuation View. It already preserves the answer and its identity rule. Restrict refusals to malformed tokens, such as a non-investigram spelling. A Q-only token for P then yields P's explicit unknown-continuation page, not a refusal. Reword the matrix row to “is not a valid continuation for P”.
- (b) Explicitly supersede the unknown-token clause in the request-model construction decision, with forward/backward mappings. Then remove the literal-key-space requirement from the plan's identity row.

Option (a) is the smaller change and keeps the package supplementary.

### A2. Revision-page continuation is underspecified for answers with several revision statuses

- `revisionPage()` applies one page number to every revision status in a View (`revisions = revisionSubjects.map(id => revisionPage(..., request.revisionPage))`). Page N of an answer pages all of its revision listings at once.
- Today's per-status hint reads “Inspect @original --revision-page N for more” (`investigation/presentation.ts`). That is subject navigation to a different answer, the historical inspection of that original, not paging of the displayed answer. Because `commands.ts` permits `--revision-page` only on `inspect @investigram`, operation-result answers have never been paged in place.
- The plan says “Every rendered continuation points to retained presentation”. It also enables revision paging for operation-result answers (matrix row and the note below it). This silently changes what the hint means. It also leaves open what a per-original hint should say:
  - `present @answer --revision-page N`, which pages every listed status; or
  - navigation to the original (`inspect @original`, then `present` its answer), which is now two steps.

Recommendation:

- State that a revision page is answer-wide across all displayed revision statuses.
- Specify the guidance wording for request-variant and historical-inspection answers, including when only some statuses have further rows.
- Decide whether the “inspect the original” navigation hint remains alongside the present hint. The subject-navigation paragraph already warns that this is a new selection.
- Add a verification case where two revision statuses in one answer have different page counts.

### A3. View identity for retained-presentation context is not specified

- The accepted rule says View identity includes “consequential supplied resolution context actually exposed”, and “Consequential differences cannot collide.” The investigation arrangement key also hashes title, resolution context and reporting.
- The new route exposes things that fresh Views do not:
  - the selection mode (“Retained answer; selection unchanged” versus “Fresh answer selection”);
  - the presentation target as supplied (precise ID versus alias);
  - a neutral title;
  - no resolution context.

  The plan says context is “not automatically identity-neutral”. It does not say which of these enter View identity or the arrangement key. The decision says alias spelling does not redefine *answer* identity, but is silent on *View* identity.
- In practice fresh Views always carry a non-null resolution context, so an accidental collision with a present View is unlikely. That is incidental, though, not designed. “Repeated equal effective presentation is stable under equal reporting” also needs “reporting” defined for the retained route, where attempt/reuse reporting is absent.

Recommendation: add one paragraph, or a table row per family, listing the retained-route identity inputs. A suggested set:

- Presentation method;
- Projection ID;
- effective choices;
- normalized continuation/page;
- lifetime;
- an explicit `retained` mode marker;
- the neutral title;
- whether the supplied target spelling is exposed, and if so whether it is normalized to the Projection.

Say explicitly that the arrangement key's reporting slot is null on this route, and that this cannot be confused with fresh historical inspection, which also has null reporting.

## B. Gaps in relating to existing documents

### B1. Backlog entries partly absorbed but left unrevised

- **Preserve captured-basis attribution in observations.** Its associated-inspection paragraph says the exported descriptor “uses the composite selection ID while retaining mechanical descriptor fields, and omits the explicit mechanical support reference”. The plan makes the variant and mechanical-support reference explicit in descriptor and observation. `backlog-revisions.md` says to leave the entry unchanged, which will make it inaccurate once implemented. Revise that paragraph now, for example: “the exact retained-answer plan exposes the composite variant and mechanical-support reference; the general basis-export gap remains”. Alternatively, have the plan's M3 do it with its documentation updates.
- **Assess reference-lifetime disclosure in existing views.** The plan requires a one-shot notice for “every family touched by the new output”. That covers answer references in module, organization and dependency one-shot output, which is part of this entry. State whether the entry is narrowed to entity references or left whole, and add a revision unit if narrowed.
- **Allow a View to be requested for an existing Projection (F6).** It asks to “preserve this distinction in agent-context references and future interface wording”. The shared-context entry already carries this, so dropping it is fine. The deletion note claims the plan carries everything, so mention that this part lives on in the shared-context entry.

### B2. “Redisplay” terminology inventory is incomplete, and one revision reintroduces the ambiguity

The plan names only STATUS.md. “Redisplay” in the *reselection* sense also appears in:

- `src/lib/commands.ts` help line 50;
- `README.md` line 174;
- `docs/cli-reference.md` lines 662 and 683;
- `docs/hosted-investigation.md` line 245;
- `docs/architecture/README.md` line 244;
- `docs/architecture/investigation.md` lines 310 and 667;
- STATUS.md line 39.

In the *exact* sense it appears in `src/lib/request-reporting.ts` line 64 (“Redisplay using retained answer IDs is not yet supported.”) and in the draft `cli-reference-revisions.md` itself. After promotion that revision would sit in the same document as line 662's opposite usage.

The accepted [investigrams decision](../docs/decisions/investigrams-and-progressive-investigation.md) uses “redisplay” throughout for fresh reselection (“Redisplay follows explicit replacement chains…”) and cannot be edited. Recommendation:

- Give the decision one sentence mapping historical “redisplay” to fresh selection.
- Use “present” or “exact presentation” in the CLI-reference revision.
- List all the sites above as implementation documentation work.

### B3. Documented paging syntax that will become invalid

These need rewriting at implementation; list them so M2/M3 exit evidence can check them:

- help lines 48–49 in `commands.ts`;
- `docs/cli-reference.md` line 677;
- `docs/architecture/investigation.md` lines 613 and 700;
- `README.md` line 177;
- the generated hints in `associations.ts` (“Continue this inspection with --after…”, “Inspect without --after…”) and in `investigation/presentation.ts`.

### B4. Observation version-two references outside the listed documents

`docs/implementation-conventions.md` line 74 prescribes “new version-two batches”. Agents are told to follow this document, so it is more than description. `docs/capability-reference.md` line 46 and `docs/architecture/README.md` line 66 also say version two. The plan's M3 lists only “implementation/status/capability/CLI descriptions”.

Add `implementation-conventions.md` to the update list. Because it is followed as a convention, consider including a revision unit in the package.

### B5. Experimental-output decision's inventory obligation

[Experimental structured outputs](../docs/decisions/experimental-structured-outputs.md) asks each approved change to “inventory affected preservation clauses”. The draft decision gives only a general preservation statement. A short inventory would make the package self-checking. It should cover:

- the unknown-token clause (A1);
- the request-model verification clause that “other consequential visible changes still require human agreement”. This change set introduces new ones: the present command, paging removal, a new allocation path (C3), answer aliases in every View, mode labels and changed observation records;
- the associated-inspection descriptor change;
- the investigrams decision's paging/redisplay wording.

### B6. Notes and promotion housekeeping

- `notes/upcoming-work.md` (EXACT) links to the backlog anchor that promotion deletes. Promotion step 7 requires human-directed note cleanup, so flag it for the human rather than editing the note.
- At promotion, rewrite the plan's “Resolved review choices” prose (“The package remains non-governing pending approval…”) and the decision Context sentence (“The complete decision package remains in review…”) into canonical wording. Do the same for `Decided: pending package acceptance` and both `Status:` lines.
- The F5 replacement says “Approval of that plan does not implement the separation”. That will go stale when the plan completes; consider phrasing that does not depend on plan status.

## C. Implementation snags the plan should pin down

### C1. When and where the answer alias is allocated

The parent has no binding capability, and finalization re-renders from the worker's View. Continuation hints must embed `@answer-…`, so the alias must be allocated in the worker before arrangement, for fresh as well as retained Views. It must also travel in the View payload. State this, and state the one-shot behaviour: is an alias allocated and shown when it can never be used? Also say what one-shot continuation hints say. They should point to opening a shell, not to `present`.

### C2. Mechanical inspection “without an associated composite” (matrix row 2)

Every production `inspect` of a module or group yields an associated composite, because `associatedSubjects` is always set in `mechanical-implementations.ts`. A bare mechanical inspection target arises only through precise IDs. These come from:

- `retainedAnswers` in presentation-unavailable resolution reports, which list the organization Projection and embedded module Projection, never the composite;
- the mechanical-support reference that this plan newly exposes.

Say so explicitly. Confirm that presenting such a target is intended and shows a different answer, without associations. Decide whether that exposed support reference gets a compact alias.

### C3. New allocation path versus the established schedule

The retained route binds only the answer's fixed populations, plus off-page support on demand. That can change later collision lengths relative to a history without `present`. The request-model decision treated the analogous effect of unsuccessful applications as an explicitly permitted visible change. Do the same here, or state that answer-namespace allocation can never affect subject spellings and that subject allocations on this route are a subset of ones already made.

### C4. “Foreign Session” and alias resolution

Compact spellings are hash prefixes of session-normalized identity keys (`EntityBindings.prepare`, `identityReference`). Identical answers in two Sessions can therefore share a spelling. Only precise IDs, with their session prefix, can be classified as foreign. Specify:

- An alias resolves only through this Session's answer bindings, with no hash-prefix search over retained records.
- An unbound spelling is “not bound in this Session”, not “foreign”.

The verification row's “stale same-spelling foreign Session” case should expect exactly that.

### C5. Invalidation output

Q2 keeps current behaviour. The verification row, however, requires output that “describes the lifecycle limitation without declaring the earlier answer invalid”. The current message is “Session invalidated: relevant inputs changed or could not be verified. Restart to continue.” It does not declare answers invalid. State whether a wording change is expected. If none is, reduce the row to “existing message; no claim that earlier answers are invalid”.

### C6. Exit status and outcome for retained failures

Exit status and outcome are driven by `failed` in `session.ts`, `interactive-session.ts` (`failed ?? false`) and `command-execution.ts`. Presenting a retained failed or unavailable answer must yield `failed: false` and a completed command outcome. The fresh path derives `failed` from the evaluation result. Name this as a concrete M1/M3 check.

### C7. Source detail and revision paging on operation-result answers only via `present`

`present @answer --source-detail` becomes valid for summarize/explain answers, while fresh `summarize --source-detail` stays a usage error. This asymmetry is defensible as scope control, but give the reason in the plan or decision. Name `src/lib/source-disclosure.ts` and its test as required classification coverage for the new route; the code comment in `investigation/presentation.ts` requires this.

### C8. Smaller behavioural clarifications

- The default format in a `postcode shell --json` session should follow the shell default. “Interface default” implies this; say it.
- Give `inspect @answer-…` a guided refusal pointing to `present`, since users will try it.
- The Q1 table says the flags are rejected “on fresh Lens requests”, while the body says “Fresh inspect”. Only `inspect` accepts them today; harmonize.
- “Display failure” (plan §Request and CLI behavior; decision) should name the presentation-unavailable resolution result and its `retainedAnswers` field.

## D. Internal consistency (plan ↔ decision ↔ constraint ↔ revisions)

Consistent apart from the items above:

- Q1–Q3 are stated identically in all three documents.
- The constraint addition matches the decision headings it cites; its anchors exist in the draft decision.
- All relative links resolve to existing canonical files or to intended canonical filenames.
- No links to notes, drafts or scratch.
- Insertion and replacement points in the revision files match current canonical text: the architecture README paragraph (line 30), capability-reference (line 50), CLI reference (line 91), the backlog headings, and the constraint bullet after which insertion occurs.

Minor points:

- The decision omits the `#### Decision` subheadings used by the README template and recent records. Optional, but matching aids later partial supersession.
- The plan has no explicit “Open questions” section. If anything remains delegated beyond names and layout, for example the alias prefix spelling or neutral title wording, list it there.
- The architecture-README revision keeps “Clearly disclosed reselection could be an interim treatment”. That remains true as governing permission, but a clause noting the chosen route (exact presentation with paging moved) would avoid implying it is still under consideration.

## E. Assessment claims verified against source

Each of these holds at 2961906:

- `presentation-contracts.ts` compatibility depends on the Lens request and definition (`lens.cardinality`, `lens.requirements.kind`).
- The source-detail rules match the option matrix: inventory/organization population answers have none; dependency answers are `supported`.
- Selection records retain unpaged revision snapshots and associations.
- `test/investigation-selection.test.ts` reconstructs content with enumeration, allocation and publication stubbed to throw.
- `createAssociatedInspectionView` calls `selectAssociatedInspection`. The composite View copies the mechanical `projection` and swaps in the composite ID.
- `arrangeInvestigationView` derives the displayed `result` only from non-null `reporting`, so null reporting hides retained failure.
- The association limitation text says “current revision status”.
- `commands.ts` restricts `--after` and `--revision-page` to shell `inspect`. Generated hints direct users to the reselection path.
- Parent finalization uses `investigationArrangementKey` without lookup.
- Observations are `formatVersion: 2`.
- Subject bindings are append-only per Session, with collision lengthening.

