# Milestone 1 round-2 correction validation

Date: 2026-09-29
Task: [Module investigation](../../tasks/2026-09-29-module-investigation.md)
Review: [Round 2](../../reviews/module-investigation/2026-09-29-milestone-1-round-2-findings.md)
Disposition: [Milestone 1](../../reviews/module-investigation/2026-09-29-milestone-1-disposition.md)
Correction target: `212fa9e82f58d41f3de6829ad84285e40305930b`
Prior reviewed code: `32f90a504344352a12810be66e3b41547731909f`
Validator: implementing Codex agent; not an independent review
Runtime: Node.js 22.13.1 with pinned TypeScript 6.0.3

Validation remains qualified by the unresolved, human-deferred execution-ownership
cancellation concern. The latest full run passed, but does not explain or erase
the previously cancelled runs.

## Checks and outcomes

- `npm run check`: passed on the final code.
- `npm test`: 339 passed, zero failed, cancelled or skipped; approximately
  120.9 seconds. This includes the final supplied-evidence regression.
- Before the final full run, the investigation/session-input suites passed all
  57 tests, and the new evidence suite passed all seven tests. The last evidence
  test was then strengthened to reject a citation to undelivered source support;
  that final assertion passed in the full run.
- `git diff --check`: passed. Architecture links resolve.
- Real-repository evidence measurements and traversal are described below.

The code and tests changed only the approved scoped evidence delivery/navigation
contract and corrected-subject kinds. Investigation semantics advanced to
`postcode/investigation@4`. No dependency, hosted adapter, credential, CLI
capability, cancellation code, governing document or development-process file
changed. The architecture account describes the new delivery contract.

## Regression coverage

The new evidence tests use real TypeScript evaluation and temporary repositories:

- Compare a five-module fixture with a 163-module fixture. Dependency, dependent,
  membership and export responses do not pull in unrelated source records or
  grow by more than 2,000 serialized code units as 158 unrelated modules are
  added. Returned claims and their own contexts match retained records exactly.
- Traverse bounded pages to every module and every group artifact, including a
  README and 160 unrelated files. Validate complete enumeration without duplicate
  entries and reject forged or mismatched continuations. Repeated continuation
  uses its pinned selection without invoking discovery again.
- Preserve incomplete evaluation state and reason independently of organization
  layout versus module-placement coverage. Missing provider expansions/dependency
  analysis remain unavailable rather than empty complete results.
- Explicitly omit an intrinsically oversized documentation item while preserving
  access to later entries. A merged ambient module with 150 declarations remains
  selectable with its claim/context intact and source support separately
  inspectable. Undelivered support references do not enter supplied-evidence
  provenance and cannot be cited as delivered evidence.
- Exercise an actual multi-exchange investigation over 163 modules: follow
  entry → middle → leaf, navigate module membership to a group, acquire its
  README by artifact reference, follow a module-list continuation and submit an
  accepted, qualified result. Responses stay within the coordinator's bound.
- Accept corrected subjects of kinds module, symbol, group and repository-artifact;
  reject claims, source evidence and content captures with the specific validation
  reason. Earlier correction-target/composition/citation tests remain passing.

While developing the correction, a real-repository traversal exposed two modules
whose own source support exceeded one page (the merged `process` module and
`agent`). The final delivery keeps those subjects selectable by retaining their
identity claims and contexts while exposing explicit inspect references for the
undelivered support bodies. This is covered by the merged-module regression;
the initial failed enumeration was not dismissed or treated as a passing sweep.

## Real-repository measurements

The pre-correction local probe reproduced the review's structural issue on 256
modules (91 project modules): `graph` dependencies were 3,039,446 code units for
four selected relationships, dependents 3,041,486 for two, and membership
3,163,084 for one. Those raw responses exceeded the 60,000-unit delivery bound.

A corrected sample, with the two new source/test modules present, measured
`graph` dependencies at 29,241 units, dependents at 15,381 and membership at
9,042. All were available in one page. Exports were 17,052 and source 3,641 units.
These are measured repository instances; exact sizes depend on source and
repository population and are not universal thresholds.

The final sweep runs every dependency, dependent, membership and export query
for all project modules, follows all continuations, enumerates all modules and
groups, walks all group artifact pages, and acquires the root README. It checks
every collection response against the 55,000-unit page target and checks exact
module enumeration. The final result table follows.


Final sweep: 258 modules, 93 project modules, 79 groups and 595 distinct artifacts.
The root README was acquired as captured content (14,278 serialized code units
including its response metadata). The repository population includes this new
validation document; artifact counts can differ at the code-only target.

| Query | Subjects/queries | Pages | Largest page (code units) | Selected entries | Omitted entries | Unavailable pages |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| dependencies | 93 | 136 | 54,665 | 625 | 0 | 0 |
| dependents | 93 | 119 | 54,674 | 424 | 0 | 0 |
| membership | 93 | 93 | 9,064 | 93 | 0 | 0 |
| exports | 93 | 102 | 54,640 | 315 | 0 | 0 |
| modules | 1 | 39 | 54,590 | 258 | 0 | 0 |
| organization | 1 | 4 | 54,227 | 79 | 0 | 0 |
| group | 79 | 92 | 54,729 | 941 | 0 | 0 |

Zero omitted entries means no selected entry was withheld in this sweep. It does
not mean every support body was embedded: entries with extensive own support
can return explicit source-support references and partial delivery status.
Their claim/context stays present and that support can be inspected separately.
All listed pages were below both the 55,000-unit page target and 60,000-unit
coordinator bound. This is selective navigability, not a claim that the entire
sweep fits one investigation's cumulative time/call/volume budget.

### Reproduction

From a checkout of the correction, run `npm run check` and `npm test`.
Focused reproduction is:

```sh
npm run build
node --test _build/test/evidence-access.test.js _build/test/investigation.test.js _build/test/session-inputs.test.js
```

For the repository-scale sweep after building, run this from the project root:

```sh
node --input-type=module <<'JS'
import assert from 'node:assert/strict';
import { openTypeScriptProject } from './_build/src/lib/typescript/project.js';
import { MemoryProgramRecordStore } from './_build/src/lib/memory-store.js';
import { evaluateModules } from './_build/src/lib/evaluation.js';
import { evidenceAccess } from './_build/src/lib/evidence-access.js';
import { evidencePageCharacters } from './_build/src/lib/evidence-delivery.js';
const opened = await openTypeScriptProject({ configPath: 'tsconfig.json' });
assert.equal(opened.status, 'opened');
const store = new MemoryProgramRecordStore();
const evaluation = evaluateModules(store, opened.analysis);
const modules = evaluation.modules.filter(id =>
  store.get(store.get(id).claim).information.discoveryFacets.includes('project'));
const evidence = evidenceAccess(store, opened.analysis, opened.session);
const stats = {};
function pages(query) {
  const result = [];
  let response = evidence.query(query);
  do {
    result.push(response);
    assert.ok(result.length < 2000);
    const characters = JSON.stringify(response).length;
    assert.ok(characters <= evidencePageCharacters);
    const stat = stats[query.kind] ??= { queries: 0, pages: 0, maxCharacters: 0,
      selected: 0, omitted: 0, unavailable: 0 };
    stat.pages++;
    stat.maxCharacters = Math.max(characters, stat.maxCharacters);
    stat.selected += response.selected.length;
    stat.omitted += response.page?.omitted.length ?? 0;
    stat.unavailable += response.status === 'unavailable' ? 1 : 0;
    if (!response.page?.next) break;
    response = evidence.query({ ...query, cursor: response.page.next });
  } while (true);
  stats[query.kind].queries++;
  return result;
}
for (const subject of modules) for (const kind of
  ['dependencies', 'dependents', 'membership', 'exports']) pages({ kind, subject });
const listed = pages({ kind: 'modules' }).flatMap(item => item.selected);
assert.deepEqual(new Set(listed), new Set(evaluation.modules));
assert.equal(listed.length, evaluation.modules.length);
const groups = pages({ kind: 'organization' }).flatMap(item => item.selected);
const artifacts = new Map();
for (const subject of groups) for (const page of pages({ kind: 'group', subject }))
  for (const record of page.records) if (record.kind === 'repository-artifact')
    artifacts.set(record.id, record);
const readme = [...artifacts.values()].find(item => item.artifact.path === 'README.md');
assert.ok(readme);
const source = evidence.query({ kind: 'source', subject: readme.id });
assert.ok(source.records.some(item => item.kind === 'captured-content'));
console.log(JSON.stringify({ modules: evaluation.modules.length,
  projectModules: modules.length, groups: groups.length, artifacts: artifacts.size,
  readmeCharacters: JSON.stringify(source).length, stats }, null, 2));
JS
```

## Qualification, residual limits and gate

The earlier baseline comparison recorded 283 passes and 13 cancellations; its
corrected full run recorded 318 passes and 13 cancellations. Both isolated runs
passed all 13 execution-ownership tests. Round 2 independently reproduced 318
passes plus 13 cancellations and a successful isolated run. The latest 339-test
run passed in full. These are separate observations, not a causal diagnosis.
The [authorized backlog deferral](../../../docs/backlog.md#diagnose-execution-ownership-cancellations-in-full-suite-runs)
and explicit validation qualification remain in force; no further cancellation
diagnosis was undertaken.

This correction is evidence delivery and navigation, not a guarantee that every
project can be exhaustively analyzed in one bounded dialogue. Intrinsically large
qualification, individual assertions, captures or source bodies may remain
unavailable with explicit omissions. Source acquisition remains full-file without
streaming/range access. Overall call, time and volume guards still apply. Direct
summary references identify what representation was supplied; they do not claim
full underlying record delivery. No live inference or interpretive usefulness
assessment was performed.

A further independent round is required for the changed evidence contract,
including qualification preservation and the scale evidence. The original
handoff remains the assignment. The human arranges review and decides the gate;
milestone 2 has not begun.
