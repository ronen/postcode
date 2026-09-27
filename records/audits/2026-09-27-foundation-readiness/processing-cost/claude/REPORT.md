# Processing-cost audit of PostCode against the engineering guidelines

Date: 2026-09-27
Audited revision: `5c04869` on `main`. The only uncommitted change was the guideline update itself, in `dev/engineering-guidelines.md`.
Auditor: Claude (Opus 5.5), working in an interactive session. This is an audit only. No repository file outside this directory was changed.

## 1. What was audited

The updated `dev/engineering-guidelines.md` has a *Processing cost* guideline:

> Consider how processing cost grows with input size, including work repeated across calls. Unless the total cost is known to remain negligible given input size, execution frequency, and cost per operation, avoid unnecessary repeated work when a straightforward change would reduce the cost without materially complicating the design—for example, replacing repeated full-collection scans with a lookup or index. Use representative measurements to establish performance priorities and justify more complex optimizations.

I read all application source under `src/lib/` and checked each loop that works per subject (per module, group, edge, occurrence, or request) for scans of whole collections. For each candidate I asked three questions:

1. How does its cost grow?
2. Does it actually cost anything at realistic sizes?
3. Would a straightforward change remove the cost without a design decision?

I checked the answers by measurement, not by inspection alone.

The report classifies each finding in one of two ways:

- **Demonstrated:** measured and attributed by CPU profile at a stated input size.
- **Potential risk:** growth is superlinear by construction, but no measurable cost was found at the sizes tested.

The earlier latency task (`records/validation/2026-09-21-analysis-latency.md`) removed repeated hashing of source text. None of the findings below overlap with that fix. That investigation measured PostCode's own project, where these costs are still small (about 40 ms each for organization evaluation and view construction). What hides them is scale, not their absence.

## 2. Summary

1. **Demonstrated: presentation cost grows quadratically, and it dominates steady-state requests beyond a few hundred modules.** When a view is built, each displayed module, group, or edge rescans every expansion claim or organization claim in the projection. The scans are in `compositionView` and in the three `create*View` functions.
   - At 800 modules, a repeated `modules` inventory takes **14.3 s** after evaluation has already been reused. At 200 modules it takes 0.63 s.
   - On PostCode itself (215 modules), the same request takes 1.25 s. About 0.9 s of that is these scans.
2. **Demonstrated: repository placement scans every repository artifact for each source location it places.** The function is `locate()` in `organization/placement.ts`. It is called once per project-module source and twice per dependency occurrence.
   - With 800 modules and 33 k repository artifacts, it accounts for about **12 s of a 25 s** first `dependencies` request.
   - Organization evaluation adds a separate linear `claims.find` for every module.
3. **Demonstrated but smaller: discovery-time scans in the TypeScript provider.** Expansion results are grouped by filtering all export and documentation claims once per module, and import-resolution evidence is filtered once per module. Together these cost about 1.2 s at 800 modules.
4. **Demonstrated, moderate: source-evidence excerpts are built by spreading whole spans into arrays.** `evidence()` in `typescript/project.ts` spreads each captured span into a code-point array just to count omitted characters. On PostCode's own analysis that is 22 M characters over 21.6 k calls, about 0.3 s, or roughly 10% of a first request.
5. **Design-level observation: input verification becomes the cost floor once the above is fixed.** Each CLI or shell command runs the input-change check three times. Each check re-runs the full Git and worktree repository capture and re-reads every memoized input. That costs 0.3 s per check on PostCode and 1.1 s with 33 k artifacts. The frequency and strategy are governed by the stable-inputs decision and conventions, so changing them is not a local fix. Two small in-check savings are local.
6. **Potential risks, low priority:** several other quadratic patterns show no measurable cost at the sizes tested (section 5.6). Fix them only when the code is touched.

**Straightforward indexing fixes the demonstrated findings.** I wrote a throwaway prototype in this directory. It changes 9 files (+155/−53 lines) and replaces the scans with maps built once per view or evaluation. The rest of the design is unchanged.

- It produced **byte-identical output** in 186 request comparisons across four fixtures, PostCode itself, and two synthetic projects. The comparisons covered Unicode, JSON, and source-detail output.
- The existing test suite gave the same results with and without the prototype.
- Steady-state inventory at 800 modules fell from 14.3 s to 0.67 s (21×). On PostCode itself it fell from 1.25 s to 0.36 s.

**Recommendation:** one bounded implementation task covering findings 1–3, optionally 4, plus a measure-only scale scenario in the existing benchmark scripts. Finding 5 should become a backlog note attached to the existing *Investigate analysis parallelism and asynchronous I/O* entry, not a code change now. Details are in section 7.

## 3. Method and measurement conditions

- **Host:** Intel Core i9-9980HK at 2.40 GHz, 16 logical CPUs, 64 GB RAM, macOS 26.6.2. Node 22.13.1, TypeScript 6.0.3.
- **Execution:** runs were sequential, with no other builds or tests running.
- **Timing scope:** requests were timed in-process through `openSession(...).session.execute()`, with no worker and no observation sink. Each timed request includes the one input check that `execute()` performs before its work.
- **Passes:** each request ran twice in one session.
  - *Pass 1* includes whatever evaluation the request triggers.
  - *Pass 2* is the steady state: the evaluation has been reused, so the time is projection, view, and rendering work plus that one check.
- **Samples:** each cell is a single sample. The differences that matter are 5–20× and far outside run-to-run variation. Differences of 10–20% should not be read as meaningful.
- **Attribution:** each hotspot was attributed with a V8 CPU profile of a single request, captured through `node:inspector`.

### 3.1 Inputs

Synthetic projects were generated by `scripts/generate-synthetic.mjs`. Each is its own Git repository with deterministic contents. Each module has 5 exported constants plus one function, each with JSDoc, and 4 relative imports. Directories are nested two levels deep, and every fifth directory has a README.

| Input | Modules | Repository artifacts | Directories | Purpose |
| --- | ---: | ---: | ---: | --- |
| `s1` | 200 | 606 | 20 | small |
| `s2` | 400 | 2,010 | 40 | ×2 modules |
| `s4` | 800 | 7,218 | 80 | ×4 modules |
| `s4a` | 800 | 32,818 | 80 | many non-module files per directory |
| `sdirs` | 1,500 | 4,802 | 1,500 | many directories |
| PostCode `tsconfig.json` | 215 (incl. externals) | 325 tracked | — | the real, representative project |

For comparison, a mid-sized real TypeScript application commonly has 500–3,000 modules and a worktree of 10–50 k files. PostCode's stated purpose is supervising real development, so the synthetic sizes are not extreme.

## 4. Measurements

Times are in milliseconds. "base" is the audited revision and "proto" is the prototype described in section 6.

**Steady state (pass 2):**

| Request | s1 base | s1 proto | s2 base | s2 proto | s4 base | s4 proto | s4a base | s4a proto | PostCode base | PostCode proto |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| `modules` (Unicode) | 631 | 257 | 1,772 | 343 | **14,347** | 665 | 8,419 | 1,423 | 1,246 | 355 |
| `modules --json` | 691 | 283 | 2,072 | 373 | **17,141** | 714 | 10,165 | 1,321 | 1,420 | 339 |
| `organization project` | 411 | 212 | 1,053 | 322 | 5,028 | 601 | 7,393 | 1,578 | 336 | 313 |
| `organization repository --json` | 419 | 214 | 1,155 | 343 | 4,904 | 605 | 7,165 | 1,597 | 322 | 305 |
| `dependencies` (Unicode) | 454 | 268 | 945 | 385 | 6,240 | 694 | 4,942 | 1,456 | 472 | 403 |
| `dependencies --json` | 426 | 314 | 1,063 | 452 | 5,667 | 793 | 5,047 | 1,650 | 484 | 420 |
| `children mod1 --json` | 254 | 252 | 332 | 315 | 626 | 606 | 1,354 | 1,331 | 395 | 382 |

**First request (pass 1), selected rows:**

| Request | s4 base | s4 proto | s4a base | s4a proto | PostCode base | PostCode proto |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| `modules` (Unicode) | 16,957 | 2,378 | 12,003 | 3,207 | 3,686 | 2,474 |
| `modules --json` | 20,037 | 721 | 9,648 | 1,367 | 1,474 | 364 |
| `dependencies` (Unicode) | 9,108 | 1,727 | **16,860** | 3,012 | 648 | 583 |

In a separate profiled run on `sdirs`, the first `organization repository --json` request took 16,586 ms before the prototype and 4,194 ms after.

The single input check costs 0.2–0.3 s on `s1`/`s2` and PostCode, 0.45 s on `s4`, and 1.1 s on `s4a`. It is included once in every figure above. The prototype does not change it.

**How to read the scaling.**

- From `s2` to `s4`, modules double and steady-state `modules` rises 8×, from 1.8 to 14.3 s. Both baseline presentation scans are quadratic (modules × claims), and allocation and GC pressure add to them.
- With the prototype, the same step rises about 2×, from 0.34 to 0.67 s, which is roughly linear.
- `children mod1` shows almost no growth in either build. It displays one module, which confirms that the cost is per displayed subject.

The raw data is in `results/baseline-*.json`, `results/prototype-*.json`, and `results/summary-table.txt`. The profiles are in `results/*.cpuprofile`.

## 5. Findings

### 5.1 Demonstrated: per-subject rescans while building views

**Code paths.** Each item below runs once per displayed subject and scans a list that covers the whole projection.

- `src/lib/composition-view.ts:12–25`. `compositionView(store, subject, claimIds, evaluationIds)` does two things:
  - It calls `store.get` on every expansion claim in the projection and keeps those whose subject matches.
  - It scans every evaluation with `outcome.modules.includes(subject)`.

  It is called once per displayed module from all three presentations:
  - `src/lib/presentation.ts:123`
  - `src/lib/organization/presentation.ts:126`
  - `src/lib/dependencies/presentation.ts:147`

  Cost: O(modules × expansion claims).
- `src/lib/presentation.ts`, inside `createView`'s per-module callback:
  - `:124`, `:127`, `:129` filter all of `expanded` (every export, documentation, and composition claim) for each module.
  - `:83`, in `documentation()`, filters all of `expanded` with `subjects.includes` again for each displayed export and each module.
  - `:167` checks `projection.modules.includes(...)` for every context of every evaluation, which is O(modules²).
- `src/lib/organization/presentation.ts`:
  - `group()` (`:114–115`) runs two `claims.find` scans over all organization claims. It is called for every group in the population and again for every parent, subgroup, and module-location reference.
  - The per-group callback repeats `available.filter` (`:135`), `claims.find` (`:136`), `placements.filter(... groups.includes(id))` (`:139`), `projection.groups.includes(id)` (`:144`), and `available.flatMap` for parents (`:145`).
  - Organization claims include one artifact-placement claim per repository artifact, so the cost is O(groups × (artifacts + groups + modules)).
- `src/lib/dependencies/presentation.ts`:
  - `organizationClaims.find` runs for each selected edge (`:119`). JSON is unbounded, so the cost is O(edges²).
  - `allEdges.filter` runs for each expanded component (`:92`).

**Evidence.** In steady-state profiles at `s4`, `createView` accounts for 95% of the 15.8 s `modules` request. `compositionView` accounts for about 80% of the steady-state `organization` and `dependencies` requests, 3.8–4.3 s of 4.8–5.4 s.

**Why it matters.** This is repeated work across calls: shell sessions exist to support repeated questions, and every question pays this cost again even after evaluation has been reused. It is already about 0.9 s per inventory command on PostCode itself, and it is superlinear.

**Proportionate change.** Build maps once per view:

- claims by subject;
- composition claims and evaluations by module;
- group and group-properties claims by group;
- placements by group;
- containment parents by child;
- organization claims by relationship;
- edges by component.

`compositionView` becomes a small factory that indexes once and returns a per-subject accessor. Display order must be preserved. In one place, where claims for several subjects are gathered, this means sorting the gathered claims by their original position (see the prototype). No semantics or identity methods change.

### 5.2 Demonstrated: repository placement scans every artifact

**Code paths.**

- `src/lib/organization/placement.ts:23–33`. For each placed path, `locate()` scans:
  - `layout.placements.find` and `evidence.artifacts.find`, over all artifacts;
  - `evidence.artifacts.some(...boundary && startsWith...)`;
  - `layout.links.filter(...).sort(...)`.

  It does this on every redirect hop as well.
- Callers:
  - `src/lib/organization/evaluate.ts:115`, once per project-module source;
  - `src/lib/dependencies/organization.ts:69`, once per endpoint evidence of every dependency occurrence, so at least two calls per occurrence.
- `src/lib/organization/evaluate.ts:131`: `claims.find(item => item.id === placementId)` scans the growing claim list for each module. That list already holds claims for every artifact placement, group, and containment edge.

**Evidence.**

- On `s4a` (800 modules, about 3,200 occurrences, 33 k artifacts), the first `dependencies --json` request spent 12.3 s of 25.1 s in `locate`.
- On the same input, the first `organization` request spent 3.8–4.2 s in `evaluateOrganization`.
- Cost is O((modules + occurrences) × artifacts), so a larger worktree or a more connected project multiplies it.

**Why it matters.** This is the first-request cost of both the organization and dependency lenses. It grows with the whole worktree, not only with the configured project, because repositories contain many files that are not modules. Organization and dependency evaluation are cached only after completion, so this cost is paid once per session, but it is paid by every one-shot command.

**Proportionate change.** Prepare the lookups once for a captured `(evidence, layout)` pair:

- a placement map and an artifact map keyed by path;
- a set of boundary paths;
- a link map keyed by path.

Resolve boundaries and longest-prefix links by walking the path's ancestors, longest first. This is O(path depth) and gives the same answer as the current `startsWith` scans, because paths are captured as `/`-joined segments. `evaluate.ts:131` can keep the claim it just created instead of searching for it. The prototype adds a `locator(evidence, layout)` factory and keeps `locate()` as a compatibility wrapper.

### 5.3 Demonstrated, smaller: discovery-time per-module scans

**Code paths.**

- `src/lib/typescript/expansions.ts:289–301`: for each module, filter all `exportClaims` and all `docClaims`. O(modules × claims).
- `src/lib/typescript/project.ts:313–315`: for each module candidate, filter all import-resolution evidence in the Program. O(modules × import sites).

**Evidence.** At `s4`, the first `modules` request spent about 0.9 s inclusive in the expansion result grouping and about 0.27 s in the resolution filter. Both are quadratic and would dominate discovery at a few thousand modules. They run once per session per expansion set, not per request.

**Proportionate change.** Group the claims by subject and the resolution evidence by source file before the loops. Keep the original order by sorting on the original positions, because evidence order affects claim-context record content and therefore identity.

### 5.4 Demonstrated, moderate: whole-span spreading in source evidence

**Code path.** `src/lib/typescript/project.ts:239–247` computes, for every evidence call:

- the excerpt, `[...span.split('\n').slice(0, 4).join('\n')].slice(0, 300)`;
- `omittedCharacters` as `[...span].length - [...excerpt].length`.

Spans of large ambient declarations can be hundreds of KB; the largest observed was 588 k characters. The same large declarations are evidenced repeatedly, because many contexts cite them.

**Evidence.** I instrumented a copy of the build. Analysing PostCode's own project made 21,629 `evidence()` calls that touched 22.1 M span characters. Spreading that many characters takes about 0.3 s, which matches the 314 ms self time `evidence` shows in the first-request profile. That is about 10% of PostCode's first request after the section 5.1–5.3 fixes.

**Proportionate change.** Count code points without allocating an array, for example by iterating over the string, or by using `text.length` minus the surrogate pairs found. Alternatively, memoize excerpt computation per `(file, start, end)` within one `discover` call; the 2026-09-21 digest cache already follows this pattern. Record content does not change. This is optional in the same task because it is linear, not quadratic. It is still repeated work with a local fix.

### 5.5 Design-level observation: input verification cost and frequency

**Code paths.**

- `session.ts:52–63` (`check`). It runs at the start of `execute()`. The CLI and shell publisher (`command-execution.ts:32–36`) then runs it twice more, before and after output. That makes three full checks per command.
- Each check, via `typescript/project.ts:105–107`:
  - re-runs `captureRepository` in full, which means about seven Git processes, `check-ignore` once per directory level, and an `lstat`/`readdir` walk of the whole worktree;
  - compares the result by canonicalizing both the new capture and the retained one;
  - calls `inputs.changed()` (`typescript/inputs.ts:64–72`), which re-probes every memoized filesystem operation, including re-reading every source and declaration file, and compares values through `canonical()`, that is `JSON.stringify` of whole file contents.

**Evidence.**

- One check costs 0.3 s on PostCode, of which Git process spawning is about 0.18 s and `canonical` 0.06 s.
- On `s4a` it costs 1.1 s, dominated by the worktree walk, so it grows linearly with artifacts.
- With the section 5.1–5.3 fixes in place, the three checks per command, about 0.9 s on PostCode and about 3.3 s on `s4a`, are most of the latency of a steady-state shell command.

**Why this is not a straightforward fix.**

- The number and placement of checks is set by the implementation conventions ("Direct execution validates before and after work; ... checks after result delivery before output and again after output").
- They serve the accepted stable-inputs decision (`docs/decisions/transient-analysis-sessions.md`).
- Reducing their frequency, or replacing full recapture with cheaper change detection (stat metadata, `git status`, a watcher), trades detection coverage for speed. That is a consequential choice for the human and a decision record, not local engineering judgment.

**Local sub-items that are straightforward.** Each saves roughly 10–20% of one check.

- `project.ts:107` re-canonicalizes the retained `repository` capture on every check. That serialization could be computed once when the session opens.
- `inputs.ts:70` could compare string observations with `===` before falling back to `canonical`.

**Recommendation.** Record this as measured input to the existing backlog entry *Investigate analysis parallelism and asynchronous I/O*, which already names repository capture and input probes. Alternatively, record it as its own backlog entry on verification cost. The two local sub-items can be folded into the implementation task.

### 5.6 Potential risks, not measurable at tested sizes (low priority)

None of these appeared in profiles, even at `sdirs` (1,500 directories), `s4a` (33 k artifacts), or 800 modules. Each is superlinear by construction and cheap to fix when its code is touched. None justifies separate work now.

| Location | Pattern | Growth |
| --- | --- | --- |
| `memory-store.ts:138` | dependency-graph validation: `members.some(id => !record.modules.includes(id))` | O(project modules²) per structure projection `put` |
| `memory-store.ts:229` | `outcome.groups.includes(record.subject)` for each group-properties claim | O(groups²) per organization evaluation |
| `memory-store.ts:346` and callers `evaluation.ts:43`, `projections.ts:29`, `dependencies/projections.ts:54`, `organization/projections.ts:81` | `store.evaluations(session)` scans the entire record store on every projection | O(all records) per request (linear, repeated) |
| `presentation.ts:183`, `:319`, `:341` | per module in the Unicode render: `contexts.filter(scope === id)`, `view.evaluations.some(... modules.includes(id))`, `view.qualifications.filter(...)` | O(modules²) (the whole Unicode render took under 0.1 s at 800 modules) |
| `organization/projections.ts:30–38`, `organization/evaluate.ts:147–155` | fixed-point loops rescanning all claims or containment edges until no change | O(tree depth × claims) |
| `repository/layout.ts:38`, `:60` | `reaches()` filters all containment edges per visited node, for each directory symlink | O(directory links × regions²) (only with directory links) |
| `repository/capture.ts:181` | each visited directory scans all ignored directories | O(directories × ignored directories) |
| `dependencies/presentation.ts:193` | `includes` inside a sort comparator over all source items | O(S log S × requests) (source detail only) |
| `organization/presentation.ts:211–220` | `claims.find` and `layout.links.filter(... artifacts.some ...)` per selected group | source-detail inspection of few groups only |
| `typescript/expansions.ts:66`, `:102`, `:199` | `effective(module).find(name)` per forwarding edge | O(exports²) per module with a large export surface |

### 5.7 Considered and not recommended

- **`structuredClone` and `freeze` on every stored record, and canonical-comparison collision checks** (`memory-store.ts:61–68`). This is visible, at about 0.2–0.9 s at the larger sizes, but it is linear and deliberate: it provides immutability and defensive copying at the store boundary. The 2026-09-21 latency record already cautioned against weakening record validation. It could be reconsidered only with a design discussion.
- **Re-validating stored records on repeated `put`.** For example, `evaluateDependencies` re-puts the dependency-evaluation record on every dependency request. This is linear per request and did not show in profiles.
- **Heap after each run was 7–62 MB higher with the prototype.** This is not a controlled measurement, because GC timing varies. The per-view maps are released once the view is built. No action needed.

## 6. The prototype, and what it establishes

To test the claim that the fixes are *straightforward* and *do not materially complicate the design*, I applied them to a copy of `src/` at `prototype/src/` and built it separately. The full diff is in `prototype.diff`.

**Files changed:**

- `composition-view.ts`
- `presentation.ts`
- `organization/presentation.ts`
- `dependencies/presentation.ts`
- `organization/placement.ts`
- `organization/evaluate.ts`
- `dependencies/organization.ts`
- `typescript/expansions.ts`
- `typescript/project.ts`

The prototype does not include the section 5.4 excerpt change or the section 5.5 sub-items.

**Verification:**

- **Output equivalence** (`scripts/compare-outputs.mjs`, output in `results/equivalence.txt`). Both builds analysed the same configurations in one process each. Rendered output was compared after replacing only the random session UUID.
  - Inputs: the `organization`, `dependency-journey`, `exports`, and `dependency-contract` fixtures, PostCode's own `tsconfig.json`, and `s1` and `s2`.
  - Requests: `modules`, `organization project|repository`, and `dependencies` in both Unicode and JSON; `inspect`, `inspect --source-detail`, `children`, `children --source-detail`, and `parents` for several selectors, including no-match and group selectors.
  - Result: **186 of 186 identical.**
- **Existing test suite.**
  - The prototype passed 227 of 229 tests.
  - The unmodified source, copied into the same directory layout (`baseline-copy/`), failed the same two tests (`dependency-presentation.test.ts`, "representative journey…" and "source-owned request results…").
  - Those two tests assert repository-organization placement for fixtures. They fail only because the copies sit inside an ignored directory and reach `fixtures/` through a symlink. Logs are in `results/prototype-tests.log` and `results/baseline-copy-tests.log`.
  - I did not run the suite in the real checkout, because that would have meant changing tracked source.
- **Performance:** see section 4.

**What the prototype is not.** It is not a proposed patch. Several details should be reconsidered in a real task:

- the duplicated `append` helper;
- the defensive order assertion in `organization/evaluate.ts`;
- whether `locate()` should remain as a wrapper;
- naming.

It shows that the needed changes are local, keep every record, ordering, and output the same, and remove the dominant superlinear costs.

## 7. Test coverage assessment

**Behavioural coverage is adequate for these refactors.** The functions involved have fixture-based tests of the behaviour most at risk from indexing mistakes:

- composition annotations (`cli`, `dependency-presentation`, and `dependency-projections` tests);
- link, boundary, and redirect placement outcomes (`organization`, `repository`, and `organization-cli` tests);
- group presence and properties;
- dependency-organization classifications (`same-group`, `into-descendants`, `varies-by-*`);
- documentation omission counts and collapsed qualifications (`cli` tests);
- resolution evidence (`discovery`, `source-evidence`, and `session-inputs` tests).

The main risk in the fixes is ordering. That risk is best covered by the equivalence comparison, which the repository already practises in `scripts/compare-*.mjs` and in the conventions ("Compare full structured views and rendered output...").

**Scale is not covered, and should not become a timing gate.** The conventions and the 2026-09-21 record say explicitly that timings belong in measurement scripts, not tests. However, the existing benchmark cases (`scripts/benchmark-analysis.mjs`) use only PostCode itself and one six-module fixture. At that scale these costs are invisible, so no existing measurement could have caught them.

**Gap to close:** add a deterministic synthetic scale scenario, such as the generator in `scripts/generate-synthetic.mjs` here, as a measure-only benchmark case. Include one repeated (steady-state) request per lens, because the per-request cost is the one that grew.

## 8. Recommendations, in priority order

1. **One bounded implementation task: "Index per-view and per-evaluation lookups".**
   - Scope: sections 5.1, 5.2 and 5.3. Optionally add 5.4 and the two local sub-items from 5.5.
   - It needs no decision record and no identity-method version bump, because analysis, record, and projection semantics do not change. The implementation conventions require a bump only when semantics change.
   - Verify with the existing suite, a before-and-after full-output comparison on the fixtures and PostCode, and representative before-and-after measurements that include a synthetic scale case.
   - Estimated size: comparable to the prototype, about 150–250 changed lines across 9–10 files.
   - This is the most worthwhile correction. It removes the superlinear costs while the view and evaluation code is still small, before more lenses copy the same pattern.
2. **Add a measure-only synthetic scale scenario to the benchmark scripts** (section 7). This can go in the same task or separately.
3. **Record the verification-cost observation** (section 5.5) as a backlog note, with these measurements, attached to the existing *Investigate analysis parallelism and asynchronous I/O* entry. Any change to check frequency or detection strategy needs human direction and a decision record.
4. **Treat the section 5.6 items as fix-when-touched.** None needs separate work now.
5. **Optional process note.** The recurring pattern is `collection.filter/find(x => x.subject === id)` inside a loop over subjects. It appears in every presentation module and in both evaluators. That suggests an idiom has been copied between lenses, not isolated slips. When the guideline is next reviewed, the human maintainer may want to name it as an example in review checklists. Agents must not edit `dev/` or the implementation conventions as part of product work, so this is only a suggestion.

## 9. Limitations of this audit

- Timings are single samples on one machine, taken in-process. They exclude worker message passing, observation-file writing, and process start-up. The conclusions rest on large ratios and on profile attribution, not on small differences.
- The synthetic projects are regular: every module has the same shape, and imports are arithmetic. Real projects vary more, for example with a few very large modules or deep directory trees. The quadratic terms identified hold in general; the constants do not.
- I did not measure a large real-world third-party TypeScript repository. The representative real input was PostCode itself, where the effects are already visible but modest.
- The profiler measures JavaScript on the main thread. Git child-process time is visible only as `spawn` overhead.
- Only processing cost was audited. Other guideline sections, such as state lifetimes, dependency reuse, and output safety, were out of scope.

## 10. Contents of this directory and reproduction

| Path | Contents |
| --- | --- |
| `REPORT.md` | this report |
| `scripts/generate-synthetic.mjs` | deterministic synthetic project and Git repository generator |
| `scripts/measure-requests.mjs` | two-pass, in-process request timing for a given build |
| `scripts/profile-request.mjs`, `scripts/profile-set.sh`, `scripts/profile-check.mjs` | CPU profiles of one request or one check (`FIRST=1` profiles a first request) |
| `scripts/summarize-profile.mjs` | self and inclusive time by function location from a `.cpuprofile` |
| `scripts/compare-outputs.mjs` | normalized rendered-output comparison between two builds |
| `synthetic/` | generated inputs `s1`, `s2`, `s4`, `s4a`, `sdirs` (about 200 MB; regenerable and safe to delete) |
| `prototype/`, `prototype.diff` | isolated source copy with the indexing changes, and its diff against `src/` |
| `baseline-copy/` | unmodified source in the same layout, used as the test-suite control |
| `instrumented/` | build copy counting `evidence()` span sizes (section 5.4) |
| `results/` | timing JSON, the summary table, `.cpuprofile` files, equivalence and test logs |

In the profile filenames, `sdirs-first-org-repo-app` is the baseline build and `…-prototype` is the prototype.

**Reproduce**, from the repository root, after `npm run build`:

```sh
A=_claude-processing-cost-audit
node $A/scripts/generate-synthetic.mjs $A/synthetic/s4 80 10 80 4 5   # skip if present
node $A/scripts/measure-requests.mjs _build $A/synthetic/s4/tsconfig.json /tmp/s4.json
(cd $A && ../node_modules/.bin/tsc -p prototype/tsconfig.json)
node $A/scripts/measure-requests.mjs $A/prototype/_build $A/synthetic/s4/tsconfig.json /tmp/s4-proto.json
SELECTORS=documented node $A/scripts/compare-outputs.mjs _build $A/prototype/_build fixtures/exports/tsconfig.json
```
