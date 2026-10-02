# Module investigation: round-3 correction validation

Date: 2026-09-29
Task: [Module investigation](../../tasks/2026-09-29-module-investigation.md)
Findings: [Round 3](../../reviews/module-investigation/2026-09-29-milestone-1-round-3-findings.md)
Disposition: [Milestone 1](../../reviews/module-investigation/2026-09-29-milestone-1-disposition.md)
Prior reviewed implementation: `212fa9e82f58d41f3de6829ad84285e40305930b`
Correction target: aef0878b17e1d31ec079edecd63a8ada469f56f8

## Scope and qualification

The human approved both recommendations: lighter module listings and separate
summary-exposure attribution, with regression coverage and architecture updates.
This validation concerns those domain corrections only. It is implementer
verification, not a new independent review or human gate acceptance. Milestone 2
has not begun; no hosted adapter, credentials or live inference were exercised.

**Validation remains qualified by the unresolved execution-ownership cancellation
concern.** Earlier full runs cancelled 13 tests; isolated runs passed. The baseline
comparison and reproduction remain in the
[deferred backlog entry](../../../docs/backlog.md#diagnose-execution-ownership-cancellations-in-full-suite-runs).
A later passing full run does not diagnose or resolve that intermittent behavior.
This correction did not change cancellation code or repeat the baseline comparison.

## Regression checks

- Type checking and build passed.
- The final focused evidence-access run passed all 10 tests, with zero failures,
  cancellations or skips (approximately 6.75 seconds).
- `npm test`: all 342 tests passed, zero failed, cancelled or skipped
  (approximately 122.2 seconds).
- Whitespace and local documentation-link validation passed.

The new 263-module fixture traverses the entire inventory through an actual
investigator dialogue under the unchanged default guards, inspects one source
reference and submits an accepted account. Every page retains stored naming
claims and contexts without rewriting them, contains no source bodies, preserves
explicit partial status and omits no module. Only the inspected source enters
full-evidence exposure. Existing merged-module coverage rejects a citation to
uninspected support and exercises each reference's inspection.

Summary attribution coverage delivers module and organization evaluation summaries,
global qualification summaries and a repository summary. It accepts citations to
these substantive summaries and checks exact distinct full-record and summary
exposure in both final report and accepted provenance. Inspecting a previously
summarized context records full exposure without deleting the summary exposure.
A failed attempt still reports its delivered summaries. A response withheld by the
size guard records neither exposure form and rejects a citation to its summary ID.

The initial focused run passed 44 of 45 tests. The new summary test incorrectly
expected membership navigation to deliver repository evidence, although its
claims use region support. The fixture dialogue was corrected to inspect the
global layout context explicitly, which delivers the repository summary. Runtime
code was not changed to satisfy this test assumption. The final focused run above
and full run below use that corrected regression.

## Real-repository measurements

The production evidence boundary was exercised over this repository's
`tsconfig.json`: 258 modules, 93 project modules, 79 groups. The inventory dialogue
completed with ordinary before/after input-validity checks and default guards:

| Measurement | Result |
| --- | --- |
| Modules selected, without duplication or omission | 258 |
| Inventory pages | 21 |
| Inventory response volume | 1,070,829 UTF-16 code units |
| Agent exchanges, including one source inspection and final submission | 23 |
| Complete sent/received dialogue volume | 1,141,713 UTF-16 code units |
| Result | Accepted |

The reviewer measured 40 pages and 1,871,220 inventory-response units before this
correction. The current dialogue fits the existing 32-exchange and 2,000,000-unit
guards without changing them. It cites delivered evaluation/global-qualification
summaries and one inspected source; uninspected source support is not treated as
supplied evidence. This demonstrates the measured repository, not that arbitrary
inventories always fit. Source inspection remains unpaged.

The full collection sweep used the same reproduction method recorded in the
[round-2 validation](2026-09-29-milestone-1-round-2-corrections.md), traversing all
continuations for every project module and group. Results:

| Query | Queries | Pages | Largest page (UTF-16 units) | Selected entries |
| --- | ---: | ---: | ---: | ---: |
| dependencies | 93 | 136 | 54,665 | 625 |
| dependents | 93 | 119 | 54,674 | 424 |
| membership | 93 | 93 | 9,064 | 93 |
| exports | 93 | 102 | 54,640 | 315 |
| modules | 1 | 21 | 54,780 | 258 |
| organization | 1 | 4 | 54,227 | 79 |
| group | 79 | 92 | 54,729 | 942 |

There were zero omitted entries and zero unavailable responses in these collection
traversals. They exposed 596 artifacts; root README acquisition returned a mapped
content record in 14,278 units. Counts depend on repository contents at capture;
subsequent documentation-only records can change the artifact population.

## Reproduction

From the repository root:

```sh
npm run check
npm test
node --test _build/test/evidence-access.test.js _build/test/investigation.test.js
```

After building, run the following complete script from the repository root using
`node --input-type=module`. It uses real production evaluation, evidence delivery,
acceptance and validity checks with the test communication double. The script is
included here so reproduction does not depend on disposable local files.

```js
import assert from 'node:assert/strict';
import { openTypeScriptProject } from './_build/src/lib/typescript/project.js';
import { MemoryProgramRecordStore } from './_build/src/lib/memory-store.js';
import { evaluateModules } from './_build/src/lib/evaluation.js';
import { evidenceAccess } from './_build/src/lib/evidence-access.js';
import { investigate } from './_build/src/lib/investigation/execute.js';
import { InvestigationUsage } from './_build/src/lib/investigation/usage.js';
import { ScriptedInvestigator } from './_build/test/investigator-double.js';
const opened = await openTypeScriptProject({ configPath: 'tsconfig.json' });
assert.equal(opened.status, 'opened');
const store = new MemoryProgramRecordStore();
const evaluation = evaluateModules(store, opened.analysis);
const evidence = evidenceAccess(store, opened.analysis, opened.session);
const subject = evaluation.modules.find(id => store.get(store.get(id).claim).information.discoveryFacets.includes('project'));
const selected = [], summaries = new Set();
let pages = 0, pageCharacters = 0, dialogueCharacters = 0, calls = 0, inspected;
const next = input => {
 calls++; dialogueCharacters += JSON.stringify(input).length;
 let reply;
 if (!input.responses.length) reply = {kind:'tools',requests:[{kind:'modules'}]};
 else {
  const response = input.responses[0];
  assert.notEqual(response.status,'unavailable');
  if (response.page) {
   pages++; pageCharacters += JSON.stringify(response).length;
   assert.equal(response.page.omitted.length,0);
   assert.ok(response.records.every(item=>item.kind!=='source-evidence'));
   for(const item of response.records) assert.deepEqual(item,store.get(item.id));
   selected.push(...response.selected);
   for(const item of response.evaluations) {summaries.add(item.id);for(const context of item.qualification)summaries.add(context.id);}
   if (response.page.next) reply = {kind:'tools',requests:[{kind:'modules',cursor:response.page.next}]};
   else {inspected=response.supportReferences[0].id;reply={kind:'tools',requests:[{kind:'inspect',subject:inspected}]};}
  } else {
   assert.ok(response.records.some(item=>item.id===inspected));
   reply = {kind:'submit',result:{localId:'root',prose:'Traversed the module inventory.',referent:{description:'Selected module.',subjects:[subject]},qualifications:['Source support was inspected selectively; summary citations refer only to summaries.'],evidence:[inspected,...summaries],associations:[],children:[],corrections:[],inconsistencies:[]}};
  }
 }
 dialogueCharacters+=JSON.stringify(reply).length;
 return reply;
};
const execution=await investigate({session:opened.session,request:{operation:'functionality',subject,parameters:{}},evidence,history:{get:()=>undefined,provenance:()=>undefined,correction:()=>undefined,corrections:()=>[]},agent:new ScriptedInvestigator(Array.from({length:32},()=>next)),usage:new InvestigationUsage(),check:async()=>assert.equal(await opened.changed(),false)});
assert.equal(execution.outcome.kind,'accepted');
assert.equal(selected.length,evaluation.modules.length);
assert.deepEqual(new Set(selected),new Set(evaluation.modules));
assert.deepEqual(new Set(execution.report.summarizedEvidence),summaries);
assert.equal(execution.report.suppliedEvidence.filter(id=>store.get(id).kind==='source-evidence').length,1);
console.log(JSON.stringify({modules:selected.length,pages,pageCharacters,calls,dialogueCharacters,outcome:execution.outcome.kind,summaryIdentities:summaries.size},null,2));
```
