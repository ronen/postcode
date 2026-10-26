import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { test } from 'node:test';
import type { TestContext } from 'node:test';
import { temporaryDirectory } from './cli-helpers.js';
import { requireView } from './request-helpers.js';
import { openSession } from '../src/lib/session.js';
import { interactiveSession } from '../src/lib/interactive-session.js';
import { publishCommand } from '../src/lib/command-execution.js';
import { normalizeRequest } from '../src/lib/requests.js';
import type { ViewRequest } from '../src/lib/requests.js';
import type { ObservationBatch } from '../src/lib/observations.js';
import type { RequestContext } from '../src/lib/request-reporting.js';

const presentation = { format: 'json' as const, sourceDetail: false };
const base = { lens: 'organization', selector: null, presentation };
async function fixture(t: TestContext, worker: boolean) {
  const root = temporaryDirectory(t, 'postcode-designation-input-');
  execFileSync('git', ['init', '--quiet', root]);
  mkdirSync(path.join(root, 'src')); mkdirSync(path.join(root, 'docs'));
  writeFileSync(path.join(root, 'src/widget.ts'), 'export const value = 1;');
  writeFileSync(path.join(root, 'docs/README.md'), 'Repository documentation.');
  const configPath = path.join(root, 'tsconfig.json');
  writeFileSync(configPath, JSON.stringify({ compilerOptions: { noLib: true, types: [] }, files: ['src/widget.ts'] }));
  if (worker) {
    const remote = interactiveSession({ configPath }); t.after(() => remote.close());
    const opened = await remote.opening; assert.equal(opened.status, 'opened');
    return { configPath, session: { id: opened.id, ...remote } };
  }
  const opened = await openSession({ configPath }); assert.equal(opened.status, 'opened');
  t.after(() => opened.session.close());
  return { configPath, session: opened.session };
}

for (const worker of [false, true]) {
  test(`organization scope follows validated normalized designation (${worker ? 'worker' : 'direct'})`, async t => {
    const { session, configPath } = await fixture(t, worker);
    for (const subject of ['bogus', '', false, 0, null, {}, ['repository']]) {
      const request = { ...base, subject } as unknown as ViewRequest;
      const result = await session.execute(request);
      assert.equal(result.kind, 'resolution', `invalid subject ${JSON.stringify(subject)}`);
      assert.equal(result.context.request.kind, 'rejected');
      assert.deepEqual(result.context.request.input.subject, subject);
      assert.deepEqual(result.attribution.work, []);
    }
    const views = [];
    for (const subject of [undefined, 'project', 'repository'] as const) {
      const request = { ...base, ...(subject === undefined ? {} : { subject }) };
      const result = requireView(await session.execute(request));
      assert.equal(result.view.schema, 'postcode-organization-view/1-experimental');
      assert.equal(result.context.request.kind, 'lens');
      assert.deepEqual(result.context.request.designation, { kind: subject === undefined ? 'default' : subject === 'project' ? 'configured-project' : 'repository' });
      assert.equal(result.view.projection.subject, subject === 'repository' ? 'repository' : 'configured-project');
      views.push(result.view);
      const batches: ObservationBatch[] = [];
      assert.equal(await publishCommand(session, request, request, configPath, 1, { stdout() {}, stderr() {} },
        { async submit(batch) { batches.push(batch); return { accepted: true }; } }), 0);
      assert.deepEqual((batches[0]!.records.find(item => item.kind === 'request')!.value as RequestContext).request, result.context.request);
    }
    assert.equal(views[0]!.projection.id, views[1]!.projection.id);
    assert.notEqual(views[1]!.projection.id, views[2]!.projection.id);
  });

  test(`built-in module and organization question headings survive coordination (${worker ? 'worker' : 'direct'})`, async t => {
    const { session } = await fixture(t, worker);
    const cases = [
      { request: { lens: 'modules', selector: null }, title: 'Modules', context: 'configured TypeScript project' },
      { request: { lens: 'organization', selector: null }, title: 'Organization', context: 'configured project' },
      { request: { lens: 'organization', selector: null, subject: 'repository' as const }, title: 'Organization', context: 'repository' },
      { request: { lens: 'inspect', selector: 'widget' }, title: 'Inspect', context: 'configured TypeScript project' },
      { request: { lens: 'inspect', selector: 'src' }, title: 'Inspect', context: 'groups and modules' },
    ];
    for (const { request, title, context } of cases) {
      const json = requireView(await session.execute({ ...request, presentation }));
      assert.equal(JSON.parse(json.rendered).title, title);
      const unicode = requireView(await session.execute({ ...request, presentation: { ...presentation, format: 'unicode' } }));
      assert.equal(unicode.rendered.split('\n')[0], `${title} · ${context}`);
      assert.equal(unicode.view.projection.id, json.view.projection.id);
    }
  });

  test(`malformed designation fields refuse before lookup and preserve publication (${worker ? 'worker' : 'direct'})`, async t => {
    const { session, configPath } = await fixture(t, worker);
    const cases = [
      ...['modules', 'dependency-structure', 'inspect'].map(lens => ({ field: 'selector', request: { lens, presentation } })),
      ...[42, {}, ['widget'], false].map(selector => ({ field: 'selector', request: { ...base, lens: 'inspect', selector } })),
      ...['yes', 1, 0, null, {}].map(reference => ({ field: 'reference', request: { ...base, lens: 'inspect', selector: 'widget', reference } })),
      ...['forever', '', false, null, []].map(referenceLifetime => ({ field: 'referenceLifetime', request: { ...base, referenceLifetime } })),
      { field: 'subject', request: { ...base, subject: 'bogus' } },
      { field: 'lens', request: { selector: null, presentation } },
    ];
    for (const { field, request: input } of cases) {
      const request = input as unknown as ViewRequest;
      const result = await session.execute(request);
      assert.equal(result.kind, 'resolution');
      assert.equal(result.report.resolution.reason, 'invalid-request');
      assert.equal(result.context.request.kind, 'rejected');
      const rejected = result.context.request;
      assert.deepEqual(rejected.input, input);
      assert.ok(rejected.problems.some(problem => problem.field === field));
      assert.deepEqual(result.attribution.work, []);
      assert.deepEqual(result.report.resolution.prerequisites, []);
      assert.deepEqual(result.report.resolution.retainedAnswers, []);
      if (!Object.hasOwn(input, field)) {
        assert.doesNotMatch(result.report.resolution.qualifications.join(' '), /Representation limit/);
        assert.match(result.report.resolution.qualifications.join(' '), new RegExp(`${field}.*supplied`, 'i'));
        assert.equal(field in rejected.input, false);
        assert.equal(rejected.problems[0]!.representation, 'absent');
      }
      let stdout = '', stderr = '';
      const batches: ObservationBatch[] = [];
      assert.equal(await publishCommand(session, request, input, configPath, 1,
        { stdout(text) { stdout += text; }, stderr(text) { stderr += text; } },
        { async submit(batch) { batches.push(batch); return { accepted: true }; } }), 3);
      assert.equal(stderr, '');
      assert.deepEqual(JSON.parse(stdout).context.request, rejected);
      assert.deepEqual((batches[0]!.records.find(item => item.kind === 'request')!.value as RequestContext).request, rejected);
      assert.equal(batches[0]!.events.some(item => item.type === 'view-produced'), false);
      assert.equal(batches[0]!.events.at(-1)!.type, 'command-refused');
    }
    assert.equal((await session.execute({ lens: 'usage', selector: null, presentation })).kind, 'usage');
    const selected = requireView(await session.execute({ lens: 'inspect', selector: 'widget', reference: false, presentation }));
    const reference = selected.resolution!.candidates[0]!.reference;
    const precise = requireView(await session.execute({ lens: 'inspect', selector: reference, reference: true, presentation }));
    assert.equal(precise.view.projection.id, selected.view.projection.id);
  });
}

test('supported reference lifetimes remain explicit and omitted optional fields keep defaults', () => {
  for (const referenceLifetime of [undefined, 'session', 'command'] as const) {
    const result = normalizeRequest({ ...base, ...(referenceLifetime === undefined ? {} : { referenceLifetime }) });
    assert.equal(result.kind, 'lens');
    assert.equal(result.referenceLifetime, referenceLifetime ?? 'session');
    assert.deepEqual(result.designation, { kind: 'default' });
  }
});

test('designation validation preserves representation limits without reading rejected accessors', () => {
  let reads = 0;
  const accessor = { ...base, get selector(): never { reads++; throw new Error('Must not read caller accessor'); } };
  for (const input of [accessor, { ...base, selector: () => {} }]) {
    const result = normalizeRequest(input as unknown as ViewRequest);
    assert.equal(result.kind, 'rejected');
    assert.equal(result.problems.length, 1);
    assert.equal(result.problems[0]!.field, 'selector');
    assert.equal(result.problems[0]!.representation, 'omitted');
    assert.equal(result.problems[0]!.omittedField, 'selector');
    assert.equal('selector' in result.input, false);
    assert.doesNotThrow(() => JSON.stringify(result));
  }
  assert.equal(reads, 0);
  const missing = normalizeRequest({ ...base, selector: undefined } as unknown as ViewRequest);
  assert.equal(missing.kind, 'rejected');
  assert.equal(missing.problems[0]!.representation, 'absent');
  assert.equal('selector' in missing.input, false);
});

test('missing Lens values are absent while rejected Lens representations remain limited', () => {
  for (const input of [{ selector: null, presentation }, { ...base, lens: undefined }]) {
    const result = normalizeRequest(input as unknown as ViewRequest);
    assert.equal(result.kind, 'rejected');
    assert.deepEqual(result.problems, [{ field: 'lens', reason: 'A Lens or report name must be supplied.', representation: 'absent' }]);
    assert.equal('lens' in result.input, false);
  }
  let reads = 0;
  for (const input of [{ ...base, lens: () => {} }, { ...base, get lens(): never { reads++; throw new Error('Must not read caller accessor'); } }]) {
    const result = normalizeRequest(input as unknown as ViewRequest);
    assert.equal(result.kind, 'rejected');
    assert.equal(result.problems.length, 1);
    assert.equal(result.problems[0]!.field, 'lens');
    assert.equal(result.problems[0]!.representation, 'omitted');
    assert.equal(result.problems[0]!.omittedField, 'lens');
    assert.equal('lens' in result.input, false);
    assert.doesNotThrow(() => JSON.stringify(result));
  }
  assert.equal(reads, 0);
});
