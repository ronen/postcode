import assert from 'node:assert/strict';
import path from 'node:path';
import { test } from 'node:test';
import { writeFileSync } from 'node:fs';
import { temporaryDirectory } from './cli-helpers.js';
import { openSession } from '../src/lib/session.js';
import { discover } from './helpers.js';
import { requireView } from './request-helpers.js';
import { inspect } from '../src/lib/projections.js';
import { createView } from '../src/lib/presentation.js';
import { resolveSubjects } from '../src/lib/subject-resolution.js';
import { resolutionContext, resolutionContextIdentity } from '../src/lib/resolution-context.js';
import { lenses } from '../src/lib/requests.js';
import { identityReference, recordId } from '../src/lib/identity.js';
import type { EvaluationRecord, ProjectionRecord } from '../src/lib/records.js';

const configPath = path.resolve('fixtures/dependency-journey/tsconfig.json');
const presentation = { format: 'json' as const, sourceDetail: false };

test('mechanical names and references share answers while exposed resolution changes View identity', async t => {
  const opened = await openSession({ configPath });
  if (opened.status !== 'opened') throw new Error('Expected project');
  t.after(() => opened.session.close());
  const inventory = requireView(await opened.session.execute({ lens: 'modules', selector: null, presentation })).view;
  assert.equal(inventory.schema, 'postcode-view/1-experimental');
  const module = inventory.modules.find(item => item.handle === 'left')!;
  assert.ok(module);
  for (const lens of ['inspect', 'children', 'parents'] as const) {
    const named = requireView(await opened.session.execute({ lens, selector: module.handle, presentation }));
    const precise = requireView(await opened.session.execute({ lens, selector: module.entityId, reference: true, presentation }));
    assert.deepEqual(named.view.projection, precise.view.projection);
    assert.deepEqual(named.view.projection.parameters, {});
    assert.notEqual(named.view.id, precise.view.id, 'exposed lookup context belongs to the View');
    assert.notDeepEqual(named.view.resolution, precise.view.resolution);
    const again = requireView(await opened.session.execute({ lens, selector: module.handle, presentation }));
    assert.deepEqual(again.view, named.view);
  }
  const organized = requireView(await opened.session.execute({ lens: 'organization', selector: null, presentation })).view;
  assert.equal(organized.schema, 'postcode-organization-view/1-experimental');
  const group = organized.groups.find(item => item.selected && item.name !== null)!;
  assert.ok(group);
  const named = requireView(await opened.session.execute({ lens: 'inspect', selector: group.name!, presentation })).view;
  const precise = requireView(await opened.session.execute({ lens: 'inspect', selector: group.entityId, reference: true, presentation })).view;
  assert.deepEqual(named.projection, precise.projection);
  assert.equal(named.schema, 'postcode-organization-view/1-experimental');
  assert.equal(precise.schema, 'postcode-organization-view/1-experimental');
  assert.deepEqual(named.moduleDetail, precise.moduleDetail, 'legitimate empty embedded detail is retained for both routes');
  assert.notEqual(named.id, precise.id);
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
  const context = resolutionContext(designation, found);
  assert.ok(context.qualifications.includes(partial.reason!));
  const shown = createView(store, named, presentation, 'Inspect', context);
  assert.equal(shown.resolution, context);
  assert.notEqual(shown.id, createView(store, reconstructed, presentation, 'Inspect').id);
  assert.notEqual(shown.id, createView(store, reconstructed, presentation, 'Inspect', { ...context, qualifications: [] }).id,
    'exposed lookup qualification alone changes View identity');
  assert.ok(Object.isFrozen(context));
  const differentBasis = inspect(store, partial, subjects);
  assert.notEqual(differentBasis.id, named.id, 'qualified population support remains an answer input');
  const before = structuredClone(shown);
  store.entityIds(basis.modules, 'module');
  assert.deepEqual(shown, before);
  assert.notDeepEqual(resolutionContextIdentity(basis.session, { ...context, designation: { kind: 'name', value: basis.session } }),
    resolutionContextIdentity(basis.session, { ...context, designation: { kind: 'name', value: 'session' } }), 'literal Session-shaped names remain literal');
  assert.notDeepEqual(resolutionContextIdentity(basis.session, { ...context, designation: { kind: 'reference', value: entity.id } }),
    resolutionContextIdentity(basis.session, { ...context, designation: { kind: 'name', value: identityReference(basis.session, entity.id)! } }),
    'a literal name and a raw reference with the same normalized spelling have distinct context identity');
});
