import { openApplication } from '../src/lib/application/index.js';
import { requireAnswer } from './application-assertions.js';
import { lenses } from '../src/lib/application/lenses.js';
import assert from 'node:assert/strict';
import path from 'node:path';
import { test } from 'node:test';
import { writeFileSync } from 'node:fs';
import { temporaryDirectory } from './temporary-directory.js';
import { discover } from './helpers.js';
import { inspect } from '../src/lib/projections.js';
import { resolveSubjects } from '../src/lib/subject-resolution.js';
import { recordId } from '../src/lib/identity.js';
import type { EvaluationRecord, ProjectionRecord } from '../src/lib/records.js';

const configPath = path.resolve('fixtures/dependency-journey/tsconfig.json');

test('mechanical names and exact references share answers and retain distinct qualified resolution', async t => {
  const opened = await openApplication({ configPath }); assert.equal(opened.status, 'opened'); t.after(() => opened.session.close());
  const inventory = requireAnswer(await opened.session.execute({ kind: 'lens', lens: 'modules', designation: { kind: 'configured-project' } }));
  assert.equal(inventory.answer.content.contract, 'modules');
  const module = inventory.answer.content.value.modules.find(item => item.claim.record.information.handle === 'left')!;
  for (const lens of ['dependency-children', 'dependency-parents']) {
    const named = requireAnswer(await opened.session.execute({ kind: 'lens', lens, designation: { kind: 'name', value: 'left' } }));
    const exact = requireAnswer(await opened.session.execute({ kind: 'lens', lens, designation: { kind: 'reference', value: module.id } }));
    assert.deepEqual(named.answer, exact.answer);
    assert.notDeepEqual(named.resolution, exact.resolution);
    assert.deepEqual(requireAnswer(await opened.session.execute({ kind: 'present', target: named.answer.id })).answer, named.answer);
  }
});

test('partial lookup context stays separate from selected answer support and remains frozen', async t => {
  const root = temporaryDirectory(t, 'postcode-matching-answer-');
  writeFileSync(path.join(root, 'tsconfig.json'), '{"compilerOptions":{"noLib":true,"types":[]},"files":["widget.ts","ambient.d.ts"]}');
  writeFileSync(path.join(root, 'widget.ts'), 'export const value = 1;');
  writeFileSync(path.join(root, 'ambient.d.ts'), "declare module 'widget' { export const other: 2; }");
  const { store, evaluation: basis } = await discover(path.join(root, 'tsconfig.json'));
  const entity = store.get(basis.modules[0]!);
  assert.equal(entity.kind, 'module');
  const claim = store.get(entity.claim);
  assert.equal(claim.kind, 'claim');
  assert.equal(claim.information.type, 'module');
  const partial: EvaluationRecord = { ...basis, id: recordId(basis.session, 'evaluation', 'partial-name-lookup'),
    execution: 'stopped', materialization: 'partial', reason: 'Other matches may be unknown.' };
  store.put([partial]);
  const designation = { kind: 'name' as const, value: claim.information.handle };
  const found = resolveSubjects(store, basis.session, lenses.inspect, designation, { modules: partial });
  assert.equal(found.status, 'resolved');
  assert.equal(found.candidates.length, 2, 'the name selects both established modules under incomplete coverage');
  const subjects = found.candidates.map(item => item.id);
  const named = inspect(store, basis, subjects);
  const reconstructed = inspect(store, basis, subjects);
  assert.deepEqual(named, reconstructed);
  assert.equal('selector' in named.parameters, false);
  assert.throws(() => store.put([{ ...named, id: recordId(basis.session, 'projection', 'invalid-designation-payload'),
    parameters: { selector: 'widget' } } as unknown as ProjectionRecord]), /Invocation-specific/);
  assert.ok(found.qualifications.includes(partial.reason!));
  assert.ok(Object.isFrozen(found));
  const differentBasis = inspect(store, partial, subjects);
  assert.notEqual(differentBasis.id, named.id, 'qualified population support remains an answer input');
});
