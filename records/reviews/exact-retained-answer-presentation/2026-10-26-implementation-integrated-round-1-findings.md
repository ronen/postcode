# Exact retained-answer presentation — integrated review findings

Record type: findings
Received: 2026-10-26
Reviewer: Claude Opus 5.5 (independent Claude Code agent session, arranged by the human)
Handoff: [2026-10-26-implementation-integrated-handoff.md](2026-10-26-implementation-integrated-handoff.md)
Round: 1
Reviewed target: 62a282bb1e6858850e1dffd7a619b4c1b6332348

## Returned findings

### Scope and method

I reviewed the implementation diff `ffaceb4c351cb90dc318d61cad5ad6f7ba31b003..62a282bb1e6858850e1dffd7a619b4c1b6332348` (task-opening record and implementation) against the [approved plan](../../../docs/plans/exact-retained-answer-presentation.md), using the handoff only as the assignment. The handoff commit `7354b80` is outside the implementation scope.

I read all of the changed source: `retained-presentation.ts`, `answer-presentation.ts`, `answer-references.ts`, `presentation-contracts.ts`, `requests.ts`, `session.ts`, `memory-store.ts`, `commands.ts`, `subject-resolution.ts`, `request-reporting.ts`, `identity.ts`, `observations.ts`, the investigation association/presentation modules and the family presentation modules. I also read the unchanged worker/parent paths that carry the new request (`interactive-session.ts`, `command-execution.ts`) and the presentation-contract planning code. I read the focused test changes named in the handoff, plus the shell, commands, comparison and projection-content test changes. I checked the documentation reconciliation in README, STATUS, the architecture overview, investigation architecture, capability reference, CLI reference, hosted guide, implementation conventions and the two scoped backlog entries.

### Verification performed

I ran these in a separate detached worktree checked out at the exact target, inside a scratch directory, and kept it stable while the suite ran:

- `npm ci` (including the optional native dependencies): succeeded; 0 vulnerabilities.
- `npm run check`: passed.
- `npm test`: 608 tests; 608 passed; 0 failed, cancelled, skipped or todo (about 225 s).
- `git diff --check ffaceb4..62a282b`: clean.

I also ran probe scripts against the target build, using a disposable two-module fixture project and the direct Session API:
- Fresh and retained mixed module/group inspection in Unicode. These show the composite alias and precise ID, "Fresh answer selection" versus "Retained answer; selection unchanged", and the frozen association wording.
- An associated composite with `variant: associated-inspection` and its precise `mechanical` support. Retained `--source-detail` through the mechanical base produced `declaration-locations-and-excerpts` disclosure with the Projection ID unchanged. Presenting the bare support allocated a distinct alias. An explicit `revisionPage` on the composite was refused.
- Retained inventory presentation with unsupported `--source-detail`, `--revision-page 2` and `--after`. These produced qualified `presentation-unavailable` refusals that include the retained ID and alias (see F1 for their wording).
- Dependency JSON exposing `selectionMode`, `answerReference`, `referenceNotice` and `continuations`.

Confirmed by inspection and tests, with no defect found:
- **No-selection boundary.** Retained resolution uses only `get`/`lookup` plus the fixed family resolvers. It never calls `selectInvestigation`/`selectAssociatedInspection`, never enumerates current histories and never evaluates. `createAssociatedInspectionView` is removed. Compatibility is content-based: requested expansions are distinguished from qualified partial or unavailable outcomes, and there is a declared-fallback chain.
- **Fresh composite selection.** The composite is selected before the mechanical base is arranged. Selection allocates no bindings. The answer alias uses a separate `EntityBindings` map, so mechanical-then-association subject allocation order is unchanged.
- **Identity.** View identity is mode- and lifetime-aware in every family. `presentedOptions` strips raw `after`/`revisionPage` from identity-bearing presentation, so continuations enter identity only through `associationContinuation` normalization. Targeting by alias or precise ID gives equal Views. Exports identity now uses `identityReference` instead of the compact spelling. The method versions are advanced.
- **Continuations.** Continuations carry complete normalized present requests. Revision paging preserves an unknown `after` together with its failed status, and a separate restart clears only `after`. One-shot answers get no continuations. Generated commands round-trip through `parseCommand`/`captureRequest`, including in a JSON-default shell.
- **Outcomes and publication.** Retained failed or unavailable outcomes are shown from the content, independent of null current reporting. Presenting them completes with `failed: false` and exit 0, both directly and through the worker. Unknown continuation remains a failed command. Worker finalization keeps the arrangement key. The observation `formatVersion` is 3. Invalidation, publication checks and closure still apply.
- **Answer-as-subject guidance.** Answer references and precise Projection IDs supplied as subjects get guidance at the shared resolution boundary, and one-shot commands reject them before opening a Session. Literal names after `--` are preserved.

### Actionable findings

**F1 — Low/Medium — Unsupported-choice refusals are reported as missing retained information.**
`src/lib/retained-presentation.ts:364-365` returns one generic explanation for every `retainedPresentation(...) === null` case: "No compatible Presentation supports these choices and this answer’s retained materialization. A new information request is needed for additional information." That case also covers choices no Presentation offers for the answer's variant: `--source-detail` on a population inventory or organization population, `--revision-page` on a mechanical or composite answer, and `--after` on a non-association answer. Reproduced: `present @answer-<modules inventory> --revision-page 2` (and likewise `--source-detail` or `--after investigram-12345678`) gives exactly that text. It neither names the rejected choice nor indicates that the option is simply not offered for this answer. Instead it sends the human to make a new information request, which cannot help and goes against the "fresh vs. exact" distinction the plan is trying to teach. The plan's reconciliation inventory requires "accurate presentation-unavailable reasons". Its compatibility table reserves the "new information request is needed" explanation for missing expansions or richer information, and treats unsupported variant/option as a separate refusal case. Suggested correction: distinguish an unsupported option or variant from missing retained support (for example by returning the failing criterion from `retainedPresentation`), name the offending choice or choices, and keep the new-request guidance only for the missing-support case. Add an assertion on the explanation for at least one unsupported-option refusal and one missing-expansion refusal. The existing tests check only `reason`.

**F2 — Low — A mixed inspection View shows a second "Answer:" identity for its nested module detail.**
`src/lib/organization/presentation.ts:181-182` arranges `moduleDetail` with the outer selection mode and `answerReference: undefined`. `renderOrganizationView` (`:272`) then renders it through `renderUnicode`, which now prepends `answerLines` (`src/lib/presentation.ts:314`). Reproduced on fresh and retained `inspect entry` (mixed group/module). Under "Modules", the output repeats "Fresh answer selection" / "Retained answer; selection unchanged" and prints `Answer: session:…:projection:<module-detail ID>` with no alias, followed by a second reference notice. That nested Projection is a supporting component, but it is labelled as the View's answer. A human copying it would `present` a different, module-only answer. The plan requires that final output identify the composite answer and that a support pointer expose only its precise ID, without being treated as another answer alias. Suggested correction: suppress the mode, answer and notice lines for embedded module detail, or label the ID explicitly as supporting module detail. Add a Unicode assertion that a mixed inspection contains exactly one `Answer:` line.

### Non-defect observations

- No test isolates the explicit selection-mode marker for the investigation family. Fresh and retained investigation Views also differ by resolution context, so the existing ID-inequality assertions would pass without the marker. The code does include `answerIdentity(request)` in the arrangement key (`src/lib/investigation/presentation.ts:179`). This is a coverage gap for the matrix's identity row, not a behavioral defect. A direct `arrangeInvestigationView` assertion with equal inputs except mode would close it.
- The retained route appends `methods.investigationPresentation` to the analysis-context methods for every family (`src/lib/session.ts:215`). The Session method list already contains all registry methods, so this has no observable effect.
- `present` refusal text prints the target without its `@` (`Retained answer target: answer-…`), because the shell parser strips it. This is cosmetic.
- An explicit `revisionPage: 1` on an associated composite is refused. That is consistent with "omit inapplicable controls" and with generated continuations, which never emit it.
- A direct-API `present` request may specify `referenceLifetime: 'command'`. The resulting View discloses expiry and has no continuations. One-shot CLI `present` is correctly rejected before opening a Session.

### Unverified areas and residual limits

- I did not drive an interactive shell process myself for the JSON-default or Unicode continuation sequences. I relied on the suite (`source-disclosure.test.ts` drives a real shell with `present` in both formats; `investigation-selection.test.ts` round-trips generated commands through `parseCommand`) and on the direct-API probes.
- I did not independently construct more than 24 associated accounts through a real investigator double. Association paging was checked by inspection and by the existing fixture tests.
- There was no hosted inference. Provider-related behavior was assessed only through the controlled double used in the suite.
- I did not review the explicitly excluded areas (persistence, post-invalidation access, View history, Presentation registry, captured-basis export, non-View lifetime assessment).

### Gate recommendation

I found no correctness, boundary or identity defect against the plan's governing semantics. Both findings are low-severity presentation-accuracy issues with clear, in-scope corrections. I recommend that the human treat the final integrated review gate as satisfied once F1 is corrected, F2 is corrected or explicitly accepted, and both are verified by the implementer. Neither correction should materially invalidate this analysis, so a further independent round is not needed unless the corrections go beyond the refusal wording and nested-detail rendering. Merge and task closure remain the human's decision.
