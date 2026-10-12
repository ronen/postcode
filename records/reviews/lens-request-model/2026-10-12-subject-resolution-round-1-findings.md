# Qualified subject resolution checkpoint: round 1 findings

Record type: findings
Received: 2026-10-12
Reviewer: Claude Opus 5.5 (Claude Code), independent session with no implementation involvement (also the reviewer of the earlier request-publication round)
Handoff: [2026-10-12-subject-resolution-handoff.md](2026-10-12-subject-resolution-handoff.md)
Round: 1
Reviewed target: 6acd1e94c89e026b2fa32dc86fce24b9897d0d37 (scope `d5041af..6acd1e9`, branch `codex/lens-request-model`)

## Returned findings

### Method

- Read the handoff, the prior [disposition](2026-10-11-request-publication-disposition.md), and the relevant parts of the approved [plan](../../../docs/plans/lens-request-model.md) (coordination and selection, outcome/retention cases, reference allocation, M2 exit evidence, verification obligations). Also read the governing [request-outcome](../../../docs/decisions/lens-application-and-request-outcomes.md) and [qualified-construction](../../../docs/decisions/qualified-construction-under-the-request-model.md) decisions.
- Inspected the full source, test and documentation diff for `d5041af..6acd1e9`. That covered `subject-resolution.ts`, the Session dispatch rewrite, `boundEntity`/`EntityBindings.resolve`, the new store invariant, the module/organization/dependency constructors and arrangements, observation/publication changes, and every changed test assertion.
- Confirmed that `HEAD` (`b6daba4`) differs from the target only in review and task records: `git diff 6acd1e9 HEAD -- src test fixtures package.json` is empty.
- Ran scratch probes (not committed) against the built target through direct `openSession().execute` and through the store-level resolver. They covered:
  - name lookup of an opaque external dependency endpoint for `dependency-children`/`dependency-parents`/`inspect`/`summarize`;
  - whether the lookup module population is the same record as the dependency module basis;
  - Unicode rendering of reports with control characters;
  - name designation for investigram-only Lenses;
  - raw record IDs used as references, with command reference lifetime;
  - a missing name in a project outside any Git worktree.

### Verification performed

- `npm run check`: passed.
- `npm test` (build, then `node --test _build/test/*.test.js`, loopback permitted, repository inputs held stable): 509 tests, 509 passed.
- Probe results:
  - External endpoints resolve by handle for all four Lenses.
  - In a fresh store, the plain lookup evaluation and the dependency module basis are the same record (`plain.id === dep.moduleEvaluation`), so the resolved subjects and the dependency construction population agree.
  - Control characters in the designation are escaped (`\u001b`, `\u000a`) in the Unicode report.
  - Other probe results are cited in the findings below.

### Actionable findings

No finding blocks continuation. All four are low severity.

#### F1 (low) — Unsuccessful name lookups still allocate the whole lookup population

`resolveSubjects` calls `store.entityIds(populations.organization.groups, 'group')` and `store.entityIds(populations.modules.modules, 'module')` before matching (`src/lib/subject-resolution.ts`, the two loops after `const matches`). Every literal-name request therefore allocates compact bindings for the entire module (and, for `inspect`, group) population, including requests that end as `missing`, `lookup-incomplete`, `lookup-unavailable` or `ambiguous`. This matches the baseline schedule, so valid requests are correctly preserved.

The plan's verification obligation, however, says that "unsuccessful requests allocate only for actual prerequisites/candidate delivery, with the permitted effect on later compact spellings explicitly reflected in expectations". The construction decision likewise says that unsuccessful applications "retain any allocations needed for actual prerequisite work or explicit candidate delivery". Population bindings are not needed to decide a match: matching uses names and handles, and bindings are only used to fill `candidate.reference`. No test pins the allocation behavior of failed name lookups. The new allocation-free test covers only precise references. The handoff's statement that classification "does not allocate references, enumerate populations" is accurate only for precise references.

Recommended correction: match first. Then allocate the population in the established group-then-module order when the lookup resolves, and allocate only the delivered candidates when it does not (`ambiguous`). Add a test asserting the allocation effect, or lack of one, for `missing` and `ambiguous`. Alternatively, record an explicit judgment that population-wide allocation is the chosen candidate-delivery schedule, and test that instead. Either is acceptable under the decision, but the choice should be deliberate and verified.

#### F2 (low) — Combined module/group lookup outcomes hide an established module no-match in text output

For `inspect`, one status summarizes both lookup populations. Any unavailable outcome yields `lookup-unavailable`, even when the other population is complete. In a project outside a Git worktree, `inspect absent` reports (probe):

```
Reason: lookup-unavailable
The lookup information needed to establish a matching subject is unavailable.
… Repository layout is unavailable.
```

The module evaluation in that case is `applicable | available | full`. The JSON `support` array preserves this, but the Unicode report does not say that no module matched in the fully established module population. The baseline text did say so ("0 modules selected from 4 · no exact match … Module membership established by TypeScript analysis"). That assertion was replaced by `/lookup information.*unavailable/` in `test/cli.test.ts`. The current wording does not overclaim absence, but it loses an established, answer-relevant distinction. It also gives no hint that, in such a project, every missing `inspect` name will be reported the same way.

Recommended correction: in the text rendering of resolution reports, add a line per supporting population with its kind and state (for example "Modules: fully established; no match" and "Groups: repository layout unavailable"). The data is already in `support`. Alternatively, phrase the explanation per kind. No change to the status taxonomy is needed.

#### F3 (low) — Name designation for investigram-only Lenses is reported as a population miss

A direct `{ lens: 'explain', selector: 'foo' }` (name designation) returns `reason: missing` with the explanation "No applicable subject matches the supplied designation in the available lookup population" and the criterion "Exact name or generated module handle". No lookup population was consulted (`prerequisites` and `support` are empty), and investigrams have no names. The CLI grammar prevents this (`follow-up lenses require an exact @investigram reference`), so only direct callers are affected.

This is the kind of distinction the decision asks the resolver to keep: missing versus a designation mode the Lens cannot use. Recommended correction: refuse name designation for Lenses with no name-designatable subjects through the existing `invalid-designation` path, or give the explanation and criteria their actual meaning. Add a direct test.

#### F4 (low) — The resolution report omits the criterion for raw record IDs accepted as references

`MemoryProgramRecordStore.boundEntity` falls back to treating the supplied value as a raw record ID (`?? reference as RecordId`). A direct `{ lens: 'inspect', selector: '<session:…:module:…>', reference: true }` therefore resolves (probe: View with one match). The resolver then reports that raw ID as the candidate's `reference`. Raw IDs are not prefixes, belong to the same Session, and were already accepted for modules by the former `selectModules`, so I see no conformance defect. However:

- this now also admits groups and never-bound investigrams by raw ID, which the former investigram path did not;
- the criteria text ("Established Session reference binding") and the documentation ("usable Session references") describe only compact bindings.

Either document that raw same-Session record IDs are an accepted precise designation, and say so in the resolver criteria, or restrict `boundEntity` to established compact bindings for the public request path. Choose deliberately before the retained-answer identity migration relies on the reference designation.

### Non-defect observations

- **Precise-reference classification:**
  - It happens before any lookup Evaluation, through `EntityBindings.resolve`, which reads `#owners` without allocation.
  - Unknown compact spellings, foreign-session references and reserved-looking spellings (`group-00000000`, `investigram-00000000`) return `unknown-reference` without Evaluation or allocation.
  - Known incompatible targets return `unsupported-subject` with the target as a frozen candidate.
  - The bind group → inspect → children/parents/summary/follow-up refusal → inspect again path is covered, with zero `entityIds` and `put` calls during refusal and an identical View afterwards. This closes audit F2 at the request path.
- **Valid-request allocation schedules are preserved:**
  - name-based `inspect` allocates groups then modules in the resolver, then the same calls during construction and arrangement are no-ops;
  - reference-based summary re-establishes `entityIds(basis.modules)`, and follow-ups/exact inspection re-establish the investigram population;
  - dependency and module arrangements allocate the basis population before adding any outside-population subject.
- **Collection versus single-subject semantics:**
  - `inspect` keeps all module and group matches.
  - `summarize` with several matches returns `ambiguous` with compact candidates, and a candidate follow-up by reference works directly through the Session without a sink (`investigation-integration` test). No interpretation is invoked for missing, ambiguous or unsupported selections (`agent.inputs.length` assertions).
- **Lookup-qualification snapshots:** incomplete and unavailable lookups are distinct from `missing`, and the resolution snapshot is frozen and unaffected by later allocation (store-level test).
- **Successful resolution information:**
  - For settled applications it travels in the direct result and in a separate `resolution-information` observation record.
  - It is not yet shown in CLI View output, so lookup qualification of a successful `inspect foo` (for example, unavailable group lookup) is visible in text only through the evaluation-state lines that the Views already print.
  - The handoff discloses that moving consequential lookup context beside shared answers remains to be done.
- **Known targets outside the supplied population:**
  - Module, dependency and group answers keep the subject, add only its retained naming claim and context, and record `selection.outsidePopulation`.
  - Group properties, documentation and detail are `null`/`unavailable` rather than fabricated. Organization artifact classification gains `subject-not-materialized`.
  - Dependency text no longer says "None in the supported project-owned request population" for such subjects.
  - Source detail uses the group claim's own captured repository root.
  - The new store invariant requires `outsidePopulation` to equal exactly the subjects absent from the retained supporting population, and rejects both omission and over-claiming (tested). In production these cases arise only with the controlled narrower evaluations used in the tests, as the handoff states.
- **Identity:**
  - Module, organization and dependency Projection keys add the resolved `subjects`, and the organization key adds the embedded `moduleProjection`. `outsidePopulation` and the added claims are fixed by those inputs and the evaluation, so I found no path to conflicting resubmission.
  - The method bumps (`projection@10`, `dependency-projection@4`, `presentation@28`) accompany these payload changes.
  - Keys still include `selector`/`reference`, as disclosed.
- **Publication:**
  - Refusals publish `resolution-result`, `command-refused` and exit 3, with no `qualified-view`, `view-produced` or `source-escape` (source-disclosure and shell tests).
  - A settled summary with configuration unavailability still produces a retained unavailable answer and View.
  - Unicode report fields go through `inlineText`. The reference-lifetime notice appears only when candidates are delivered.
- **Test changes:** the changed assertions in `cli`, `organization-cli`, `session`, `source-disclosure` and `investigation-integration` replace former empty-View expectations with resolution-report expectations of equal or greater specificity. The `comparison.ts` addition (`population`, `prerequisites`, `outsidePopulation` as reference positions) normalizes only record references, not qualification or order. I found no weakened check apart from the replaced module-membership sentence noted in F2.
- **Disclosed staging:** legacy directly callable constructors still accept selector/reference and can build the former empty selection forms. The Session, worker and CLI path no longer reaches them for unsuccessful lookups. This staging does not obstruct the remaining approved outcome, provided the M3 migration removes those forms rather than routing new callers through them.

### Unverified areas and residual limits

- I did not exercise cancellation or interruption during lookup Evaluation, or a worker restart between candidate delivery and follow-up.
- I did not construct a fixture with a group and module sharing a name together with a partially materialized group population, or a mixed reference/name follow-up through the shell.
- Prerequisite attribution is not assessed beyond noting that `prerequisites` currently lists the lookup Evaluation IDs only, which the handoff states is not the completed attribution trace.
- I did not check that the earlier intermittent CLI failure recurs. The named test passed in this full run.

### Recommendation for this intermediate gate

The shared subject-resolution and materialization boundary is suitable for continuing the remaining authorized implementation. Specifically:

- the resolver's status taxonomy, precise-reference classification, preservation of valid-request allocation, outside-population qualification and its store invariant, and non-View refusal publication behave as described and are covered by meaningful tests;
- F1–F4 are low-severity precision and consistency corrections and can be addressed in continuing work under this task;
- F1 and F4 should be settled before the M3 answer-identity migration builds on reference designation and allocation expectations;
- no further review round is needed for these corrections unless the human prefers one.
