import assert from 'node:assert/strict';
import { test } from 'node:test';
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { openApplication } from '../src/lib/application/index.js';
import { temporaryDirectory } from './temporary-directory.js';

test('direct reference lookup retains exact identity, name ambiguity and refusal distinctions without compact aliases', async t => {
  const root = temporaryDirectory(t, 'postcode-direct-references-');
  for (const directory of ['a', 'b']) {
    mkdirSync(path.join(root, directory));
    writeFileSync(path.join(root, directory, 'entry.ts'), 'export const entry = 1;');
  }
  const configPath = path.join(root, 'tsconfig.json');
  writeFileSync(configPath, JSON.stringify({ compilerOptions: { noLib: true, types: [] }, files: ['a/entry.ts', 'b/entry.ts'] }));
  let openings = 0;
  const dependencies = { investigation: { selectDialogAgent: async () => { openings++; throw Error('Refused request opened an investigator'); } } };
  const first = await openApplication({ configPath }, dependencies), other = await openApplication({ configPath });
  assert.equal(first.status, 'opened'); assert.equal(other.status, 'opened');
  t.after(() => Promise.all([first.session.close(), other.session.close()]));
  const session = first.session;
  const inventory = await session.execute({ kind: 'lens', lens: 'modules', designation: { kind: 'configured-project' } });
  assert.equal(inventory.kind, 'answer'); assert.equal(inventory.answer.content.contract, 'modules');
  const modules = inventory.answer.content.value.modules;
  assert.equal(modules.length, 2);
  const id = modules[0]!.id;
  const inspect = await session.execute({ kind: 'lens', lens: 'inspect', designation: { kind: 'reference', value: id } });
  assert.equal(inspect.kind, 'answer'); assert.equal(inspect.context.request.kind, 'lens');
  assert.ok(!('bindings' in inspect)); assert.ok(!('answerReference' in inspect)); assert.ok(!('referenceLifetime' in inspect));
  const exact = await session.execute({ kind: 'present', target: inspect.answer.id });
  assert.equal(exact.kind, 'answer'); assert.deepEqual(exact.answer, inspect.answer);
  const ambiguous = await session.execute({ kind: 'lens', lens: 'summarize', designation: { kind: 'name', value: 'entry' } });
  assert.equal(ambiguous.kind, 'resolution'); assert.equal(ambiguous.resolution.reason, 'ambiguous');
  assert.equal(ambiguous.resolution.candidates.length, 2);
  assert.ok(ambiguous.resolution.candidates.every(candidate => candidate.reference === candidate.id));
  for (const value of ['module-00000000', '@' + id, id.replace(/.$/, id.endsWith('0') ? '1' : '0')]) {
    const result = await session.execute({ kind: 'lens', lens: 'summarize', designation: { kind: 'reference', value } });
    assert.equal(result.kind, 'resolution'); assert.equal(result.resolution.reason, 'unknown-reference');
  }
  const literal = await session.execute({ kind: 'lens', lens: 'summarize', designation: { kind: 'name', value: id } });
  assert.equal(literal.kind, 'resolution'); assert.equal(literal.resolution.reason, 'missing');
  const foreignSubject = await other.session.execute({ kind: 'lens', lens: 'inspect', designation: { kind: 'reference', value: id } });
  assert.equal(foreignSubject.kind, 'resolution'); assert.equal(foreignSubject.resolution.reason, 'unknown-reference');
  const answerSubject = await session.execute({ kind: 'lens', lens: 'summarize', designation: { kind: 'reference', value: inventory.answer.id } });
  assert.equal(answerSubject.kind, 'resolution'); assert.equal(answerSubject.resolution.reason, 'answer-as-subject');
  for (const [target, reason] of [[id, 'unsupported-answer'], ['answer-00000000', 'unknown-answer'], ['@' + inspect.answer.id, 'unknown-answer']] as const) {
    const result = await session.execute({ kind: 'present', target });
    assert.equal(result.kind, 'resolution'); assert.equal(result.resolution.reason, reason);
  }
  const foreignAnswer = await other.session.execute({ kind: 'present', target: inspect.answer.id });
  assert.equal(foreignAnswer.kind, 'resolution'); assert.equal(foreignAnswer.resolution.reason, 'foreign-answer');
  assert.equal(openings, 0);
});
