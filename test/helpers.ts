import assert from 'node:assert/strict';
import { evaluateModules } from '../src/lib/evaluation.js';
import { MemoryProgramRecordStore } from '../src/lib/memory-store.js';
import { modules } from '../src/lib/projections.js';
import type { ClaimContextRecord, ModuleClaim } from '../src/lib/records.js';
import { openTypeScriptProject } from '../src/lib/typescript/project.js';

export function discover(configPath: string, excludedOutputDirectories: readonly string[] = []) {
  const opened = openTypeScriptProject({ configPath, excludedOutputDirectories });
  assert.equal(opened.status, 'opened', JSON.stringify(opened));
  if (opened.status !== 'opened') throw new Error('Project did not open');
  const store = new MemoryProgramRecordStore();
  const evaluation = evaluateModules(store, opened.analysis);
  const projection = modules(store, evaluation);
  const claims = projection.claims.map(id => store.get(id) as ModuleClaim);
  const contexts = projection.contexts.map(id => store.get(id) as ClaimContextRecord);
  return { store, evaluation, projection, claims, contexts, analysis: opened.analysis };
}
