# Qualified result and Presentation compatibility: round 1 findings

Record type: findings
Received: 2026-10-13
Reviewer: Claude Opus 5.5 (Claude Code), independent session with no implementation involvement (also the reviewer of the earlier rounds on this task)
Handoff: [2026-10-13-presentation-compatibility-handoff.md](2026-10-13-presentation-compatibility-handoff.md)
Round: 1
Reviewed target: 1b853bd61961b4da94b630c9c4e8de91c3be49e6 (scope `d8ceb60..1b853bd`, branch `codex/lens-request-model`)

## Returned findings

### Method

- Read the handoff, the plan's outcome table (including the "no compatible Presentation…" row), its verification bullets for Presentation failure and fallback, and the M4 description.
- Confirmed that `HEAD` (`365cf10`) differs from the target only in records and documentation (`git diff 1b853bd HEAD -- src test fixtures package.json` is empty).
- Inspected the complete source and test diff for `d8ceb60..1b853bd`:
  - the new `presentation-contracts.ts` (definitions, `validatePresentations`, `compatiblePresentation`, `planPresentation`, `validatePresentationContent`, `materializationLimitations`, `settlePresentation`);
  - catalog capture;
  - Session `requestExecutor` (the prospective check, resolved-contract choice, expansion union, content resolution before arrangement, and the `presentationFailure` result);
  - the four family wrappers and arrangements, and associated-inspection validation;
  - request-report rendering;
  - the method bumps;
  - the new tests.
- Confirmed that the production expansion sets are unchanged. The removed `presentationRequirements`, `dependencyPresentationRequirements.modules` and `organizationPresentationRequirements` all equal the standard expansions now declared by the default Presentations.
- Checked identity: the View identity inputs (`view`, `organization-view`, `dependency-view` and the investigation arrangement key) include the full `presentation`, and therefore the decision. Retained Projection and selection identities are unchanged.
- Traced the resolved-contract choice for `inspect` (candidate kinds) against construction's `moduleOnly` branch. `inspectModules` keeps module candidates that are outside the population, so module-only candidates always produce module content and the plan cannot mismatch.
- Built the baseline `d8ceb60` and the target `1b853bd` in the scratchpad (`git archive`) and ran direct-Session probes there on `fixtures/dependency-journey` and a one-module temporary project. Nothing was written to the repository.

### Verification performed

- `npm run check`: passed.
- `npm test`, run under `caffeinate -is` with loopback permitted and repository inputs held stable: 566 tests, 566 passed, none cancelled.
- Option matrix through `Session.execute`:

| Request | Baseline `d8ceb60` | Target `1b853bd` |
|---|---|---|
| `modules` / `organization` with source detail | Throws `Source detail requires inspection` | `presentation-unavailable`, refused before lookup |
| `dependencies` / `children` with source detail | View | View (`dependency` selected) |
| `modules` / `dependencies` / `summarize` with `after` | View (option silently ignored) | `presentation-unavailable` before lookup |
| `summarize` with `revisionPage: 2` | View | View (`interpretation` selected) |
| `inspect` module with `revisionPage: 2` | View (option ignored) | `presentation-unavailable` after resolution |
| `inspect` module with source detail; `inspect` investigram with `after` | View | View |
| `usage` with source detail | Usage report | Usage report (outside Presentation compatibility) |

  Each change is a defect or a silently dropped explicit choice becoming an explicit refusal. The CLI already rejects these combinations during option validation, so production CLI behavior is unchanged apart from the View method/identity bump.

- Materialization refusal with a strict interpretation definition and no investigator:
  - the result is `presentation-unavailable` with the candidate, the prerequisite support, the `Interpretation: configuration-unavailable` qualification and one retained selection ID;
  - no View is produced.
  - I then supplied that retained ID as a reference to `inspect` and to `summarize`. Both returned `unknown-reference` (see F1).

### Actionable findings

#### F1 (low) — Unicode refusal reports present retained-answer IDs as usable references, but no request accepts them

`renderRequestReport` now prints each retained answer as `Retained answer: <record ID>`. It appends "References remain usable while this Session is valid." when there are candidates *or* retained answers (`request-reporting.ts`, the `candidates.length || retainedAnswers.length` condition).

The retained IDs are raw record IDs (`session:…:investigation-selection-projection:<hash>`), and no Lens accepts them: `inspect` and `summarize` with that ID as a reference both return `unknown-reference`. Exact retained-answer redisplay is explicitly deferred (plan F6). JSON and the CLI reference describe them accurately as "retained answer IDs".

Two cases follow:

- When candidates are present, the sentence is about the candidate references, but it now sits directly under the retained-answer lines.
- When only retained answers exist, such as a refused population Lens under a strict modules precondition, the sentence claims a usability the IDs do not have.

Suggested correction (wording is the implementer's choice):

- keep the "References remain usable…" condition on candidates only;
- label retained answers as identifiers whose redisplay is not yet supported;
- add an assertion to the existing Unicode refusal test.

The JSON contract needs no change.

### Non-defect observations

- **Definitions constrain behavior:**
  - Format, source and paging compatibility is checked against the default and each declared fallback.
  - The prospective check covers every declared result contract before any lookup work; the test confirms an empty attribution.
  - The resolved contract is rechecked after resolution, with candidates and prerequisite support preserved.
  - Expansions for the whole compatible chain are acquired before Evaluation (tested).
  - A fallback that would drop an explicit format or source choice is not used (tested).
  - `presentation-unavailable` is a distinct reason from Lens inapplicability (`unsupported-subject`/`invalid-designation`).
- **Qualified versus malformed content:**
  - All production definitions are `qualified`, so partial, unavailable and empty answers are presented as before.
  - The strict precondition reports unmet states, including outside-population subjects, as qualifications.
  - `validatePresentationContent` runs at both settlement and each family arrangement, so arrangement checks contract and invariants even when called directly.
  - Its checks are deliberately shallow for organization and dependencies (record kinds and embedded module detail), relying on the family resolvers for support validation. It is a contract boundary, not a full payload validator.
- **Identity and disclosure:**
  - The decision (initial and selected IDs, criteria, changes) is frozen inside `presentation` and enters View identity. The method bumps (`presentation@31`, `investigation-presentation@18`) cover that change.
  - Unicode explains fallback changes through `inlineText`.
  - Parent usage finalization keeps the decision unchanged (tested). Embedded module detail is arranged with a plain format/source Presentation without a decision, consistent with it remaining a composition rather than a top-level choice.
- **Consumption on refusal:** `consumeInterpretation` runs before settlement. It records only relation, displaced and associated accounts, which are empty for non-accepted outcomes, the only ones a strict interpretation precondition can refuse. A refusal therefore reports no presented interpretation consumption.
- **Remaining name-based coupling:** `compatiblePresentation` keys inspection-only source and association paging on `request.lens === 'inspect'`, and contract selection in the Session still branches on Lens names. This is consistent with the disclosed remaining mechanical-dispatch work. The mechanical/exports integration should move these to declarations rather than add more names.

### Unverified areas and residual limits

- I did not exercise custom-catalog worker delivery or compatibility-specific fallback paging, as the handoff also discloses.
- I did not systematically fuzz malformed content beyond reading the validators and the implementer's malformed-module test.
- I did not exercise hosted investigators.
- The mechanical exports constructor/Presentation extension and the final integrated verification are outside this checkpoint.
- The full suite passed without timing failures under sleep inhibition. The historical intermittent CLI failure and the implementer's sleep-related failures were not reproduced or root-caused.

### Recommendation for this intermediate gate

The compatibility slice does what the handoff describes:

- definitions govern choice, acquisition and fallback;
- refusals keep the actual request, prerequisite information and retained answer IDs without fabricating Views;
- qualified partial content stays ordinary;
- identity changes are confined to Views and versioned.

I consider it suitable for the remaining mechanical extension work. F1 is a small Unicode wording correction that can be made alongside that work. A separate review round for it is not necessary unless the human prefers one.
