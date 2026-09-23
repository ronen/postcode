import assert from 'node:assert/strict';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import { normalizeSession } from './helpers.js';
import { digest } from '../src/lib/identity.js';
import { MemoryProgramRecordStore } from '../src/lib/memory-store.js';
import type { ProgramRecord, SourceEvidenceRecord } from '../src/lib/records.js';
import { openTypeScriptProject } from '../src/lib/typescript/project.js';

test('reused content digests preserve distinct captured evidence and refresh on a new opening', () => {
  const root = mkdtempSync(path.join(os.tmpdir(), 'postcode-source-digests-'));
  try {
    const configPath = path.join(root, 'tsconfig.json');
    const origin = path.join(root, 'origin.ts');
    const barrel = path.join(root, 'barrel.ts');
    const original = '/** First value. */\nexport const first = 1;\n/** Second value. */\nexport const second = 2;\n';
    const changed = original.replace('first = 1', 'first = 9');
    const forwarding = "export { first, second } from './origin.js';\nexport { first as renamed } from './origin.js';\n";
    writeFileSync(configPath, JSON.stringify({ compilerOptions: { noLib: true, types: [], module: 'NodeNext' }, files: ['origin.ts', 'barrel.ts'] }));
    writeFileSync(origin, original);
    writeFileSync(barrel, forwarding);
    const open = () => {
      const result = openTypeScriptProject({ configPath });
      assert.equal(result.status, 'opened');
      if (result.status !== 'opened') throw new Error('Project failed to open');
      return result.analysis;
    };
    const collect = (analysis: ReturnType<typeof open>) => {
      const store = new MemoryProgramRecordStore();
      const records = new Map<string, ProgramRecord>();
      const result = analysis.discover({
        put: batch => { store.put(batch); for (const record of batch) records.set(record.id, record); },
        entityIds: (ids, kind) => store.entityIds(ids, kind),
        get: id => store.get(id), evaluations: session => store.evaluations(session),
      }, ['exports', 'documentation', 'composition'], true);
      const evidence = [...records.values()].filter((record): record is SourceEvidenceRecord => record.kind === 'source-evidence');
      return { result, records, evidence };
    };
    const captured = open();
    const before = collect(captured);
    const originEvidence = before.evidence.filter(item => item.path === origin);
    assert.ok(originEvidence.length >= 5, 'file, declarations, documentation and resolution targets remain distinct');
    assert.ok(new Set(originEvidence.map(item => item.start)).size >= 3);
    assert.ok(originEvidence.some(item => item.location.association === 'file'));
    assert.ok(originEvidence.some(item => item.location.association === 'span' && item.location.excerpt.text.includes('first = 1')));
    for (const item of before.evidence) {
      assert.equal(item.contentDigest, digest(item.path === origin ? original : forwarding));
    }
    assert.ok(before.evidence.some(item => item.dependencyResolution));
    writeFileSync(origin, changed);
    // Reusing captured compiler input must not combine later bytes with earlier spans.
    assert.deepEqual(collect(captured), before);
    const after = collect(open());
    assert.notEqual(after.result.session, before.result.session);
    for (const item of after.evidence) {
      assert.equal(item.contentDigest, digest(item.path === origin ? changed : forwarding));
    }
    assert.equal(after.evidence.length, before.evidence.length);
    assert.ok(after.evidence.some(item => item.path === origin && item.location.association === 'span'
      && item.location.excerpt.text.includes('first = 9')));
    assert.deepEqual(normalizeSession(collect(open())), normalizeSession(after), 'equivalent new captures reproduce all records and outcomes');
  } finally { rmSync(root, { recursive: true, force: true }); }
});
