// Do values returned by evaluators alias provider-retained or store-owned state?
import { writeFileSync } from 'node:fs';
import { openTypeScriptProject } from './build/src/lib/typescript/project.js';
import { MemoryProgramRecordStore } from './build/src/lib/memory-store.js';
import { evaluateModules } from './build/src/lib/evaluation.js';
import { evaluateOrganization } from './build/src/lib/organization/evaluate.js';
const out = {};
const opened = openTypeScriptProject({ configPath: '../fixtures/dependency-journey/tsconfig.json' });
if (opened.status !== 'opened') throw new Error('open failed');
const store = new MemoryProgramRecordStore();
const first = evaluateModules(store, opened.analysis, ['exports']);
out.returnedIsStored = first === store.get(first.id);
out.returnedFrozen = Object.isFrozen(first) || Object.isFrozen(first.modules);
out.storedFrozen = Object.isFrozen(store.get(first.id).modules);
// Another requirement set produces a new discovery result from the provider's retained core population.
const probeResult = opened.analysis.discover(store, ['documentation']);
out.providerModulesAliasReturnedEvaluation = probeResult.modules === first.modules;
const original = [...first.modules];
first.modules.push(first.modules[0]); // runtime mutation through a readonly-typed caller reference
const second = opened.analysis.discover(store, ['composition']);
out.laterDiscoverySeesCallerMutation = second.modules.length !== original.length;
first.modules.pop();
const organization = evaluateOrganization(store, store.get(first.id));
out.organizationReturnedIsStored = organization === store.get(organization.id);
out.organizationReturnedFrozen = Object.isFrozen(organization.claims);
writeFileSync(new URL('./ownership-probe-results.json', import.meta.url), `${JSON.stringify(out, null, 2)}\n`);
console.log(out);
