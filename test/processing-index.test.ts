import assert from 'node:assert/strict';
import path from 'node:path';
import { test } from 'node:test';
import { locate } from '../src/lib/organization/placement.js';
import { deriveLayout } from '../src/lib/repository/layout.js';
import type { RepositoryEvidence } from '../src/lib/repository/evidence.js';
import { compositionView } from '../src/lib/composition-view.js';
import { resolveComposition } from '../src/lib/composition-content.js';
import type { ProgramRecord, ProgramRecordStore, RecordId, SessionId } from '../src/lib/records.js';

test('repeated placement lookup reads artifact paths once per immutable capture/layout pair', () => {
  for (const size of [64, 512]) {
    let reads = 0;
    const root = path.resolve('captured-root');
    const evidence: RepositoryEvidence = Object.freeze({ provider: 'repository-layout', method: 'test', root,
      rootPaths: [root], gitVersion: 'test', gitPathPolicy: { ignoreCase: false, precomposeUnicode: false },
      inputConsistency: 'first-observed', sparseCheckout: false, limitations: [], exclusions: [], excludedOutputDirectories: [],
      artifacts: Object.freeze(Array.from({ length: size }, (_, index) => Object.freeze({
        get path() { reads++; return `group/file-${index}.ts`; }, kind: 'file' as const, tracked: false,
      }))),
    });
    const layout = deriveLayout(evidence); reads = 0;
    for (let pass = 0; pass < 2; pass++) for (let index = 0; index < size; index++) {
      const artifact = `group/file-${index}.ts`;
      assert.deepEqual(locate(path.join(root, artifact), evidence, layout), { group: 'group', artifact });
    }
    assert.ok(reads <= size * 2, `${size} artifacts caused ${reads} path reads`);
  }
});

test('selected composition preparation has linear store reads and keeps parallel claims and outcome order', () => {
  const id = (value: string) => value as RecordId;
  const session = 'session:test' as SessionId;
  for (const size of [32, 256]) {
    const records = new Map<RecordId, ProgramRecord>();
    const claims: RecordId[] = [], evaluations: RecordId[] = [];
    for (let index = 0; index < size; index++) {
      const subject = id(`module-${index}`), context = id(`context-${index}`);
      records.set(context, { kind: 'claim-context', id: context, session, method: 'test', scope: subject, evidence: [],
        status: 'mechanically-derived', guarantee: 'test', limitations: [], diagnostics: [] });
      for (const suffix of ['a', 'b']) {
        const claim = id(`claim-${index}-${suffix}`); claims.push(claim);
        records.set(claim, { kind: 'claim', id: claim, session, method: 'test', subject, context,
          information: { type: 'module-composition', property: 're-exports-only' } });
      }
      const outcome = id(`outcome-${index}`); evaluations.push(outcome);
      records.set(outcome, { kind: 'evaluation', id: outcome, session, method: 'test', attempt: 1, requirement: 'composition',
        modules: [subject], claims: [], contexts: [], applicability: 'applicable', availability: 'available',
        execution: 'completed', materialization: 'full', reason: null, cost: { measure: 'module-count', value: 1 } });
    }
    let reads = 0;
    const store = { get(key: RecordId) { reads++; const record = records.get(key); assert.ok(record); return record; } } as ProgramRecordStore;
    const content = resolveComposition(store, claims, evaluations);
    const preparedReads = reads;
    for (let pass = 0; pass < 2; pass++) for (let index = 0; index < size; index++) {
      const result = compositionView(content(id(`module-${index}`)));
      assert.deepEqual(result.claims.map(claim => claim.id), [`claim-${index}-a`, `claim-${index}-b`]);
      assert.deepEqual(result.evaluations.map(outcome => outcome.id), [`outcome-${index}`]);
    }
    assert.equal(reads, preparedReads);
    assert.ok(reads <= size * 5);
  }
});
