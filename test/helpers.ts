import assert from 'node:assert/strict';
import { evaluateModules } from '../src/lib/evaluation.js';
import { MemoryProgramRecordStore } from '../src/lib/memory-store.js';
import { modules } from '../src/lib/projections.js';
import type { ClaimContextRecord, ModuleClaim, ProgramRecordStore, RecordId } from '../src/lib/records.js';
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

/** Only rename the session namespace; retain record relationships, content and ordering. */
export function normalizeSession<T>(value: T): T {
  return JSON.parse(JSON.stringify(value, (_key, item: unknown) => item instanceof Map ? { entries: [...item] } : item instanceof Set ? { values: [...item] } : item).replace(/session:[a-f0-9-]{36}/g, 'session:normalized').replace(/Session [a-f0-9-]{36}/g, 'Session normalized')) as T;
}
export function inputBasis(result: { store: ProgramRecordStore; evaluation: { contexts: readonly RecordId[] } }): string {
  const context = result.store.get(result.evaluation.contexts[0]!);
  if (context.kind !== 'claim-context' || !context.inputs) throw new Error('Expected captured analysis inputs');
  return JSON.stringify(normalizeSession(result.store.get(context.inputs)));
}
