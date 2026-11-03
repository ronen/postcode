import type { ViewRequest } from '../src/lib/requests.js';
import assert from 'node:assert/strict';
import { test } from 'node:test';
import path from 'node:path';
import { writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { temporaryDirectory } from './cli-helpers.js';
import { openSession } from '../src/lib/session.js';
import { requireView } from './request-helpers.js';
import { defaultCatalog } from '../src/lib/request-catalog.js';
import { exportsLens } from '../src/lib/mechanical-implementations.js';
import { exportsPresentation, renderModuleExports } from '../src/lib/exports/presentation.js';
import { renderView } from '../src/lib/presentation.js';
import { renderOrganizationView } from '../src/lib/organization/presentation.js';
import { renderDependencyView } from '../src/lib/dependencies/presentation.js';
import { presentQualification } from '../src/lib/qualification-view.js';
import { observationBatch, commandObservation } from '../src/lib/observations.js';
import { investigationInstructions } from '../src/lib/investigation/execute.js';
import { assertionContent } from '../src/lib/documentation-view.js';

for (const format of ['unicode', 'json'] as const) test(`human detail and diagnostic meaning survive fresh and retained family presentations (${format})`, async t => {
  const root = temporaryDirectory(t, 'postcode-human-output-');
  execFileSync('git', ['init', '--quiet', root]);
  writeFileSync(path.join(root, 'tsconfig.json'), '{"compilerOptions":{"noLib":true,"types":[]},"files":["entry.ts"]}');
  writeFileSync(path.join(root, 'entry.ts'), `import './missing'; import 'unknown-package/subpath';
/** Coordinates requests.\n * \`\`\`ts\n * export const SOURCE_ONLY = 1;\n * \`\`\`\n * @see Architecture handbook\n */
export const namedValue = 1;
const broken = ;`);
  const opened = await openSession({ configPath: path.join(root, 'tsconfig.json') }, {}, {
    ...defaultCatalog, lenses: { ...defaultCatalog.lenses, exports: exportsLens }, presentations: [...defaultCatalog.presentations!, exportsPresentation],
  });
  assert.equal(opened.status, 'opened'); t.after(() => opened.session.close());
  const session = opened.session;
  for (const request of [
    { lens: 'inspect', selector: 'named-value', detail: true },
    { lens: 'organization', selector: null, detail: false },
    { lens: 'dependencies', selector: null, detail: true },
    { lens: 'exports', selector: 'named-value', detail: true },
  ]) {
    const presentation = { format, moreDetails: request.detail };
    const executed = await session.execute({ lens: request.lens, selector: request.selector, ...(request.lens === 'organization' ? { subject: 'project' as const } : {}), presentation });
    assert.equal(executed.kind, 'view', `${request.lens}: ${executed.rendered}`);
    const fresh = requireView(executed);
    const retained = requireView(await session.execute({ kind: 'present', target: fresh.view.projection.id, presentation }));
    assert.equal(retained.view.projection.id, fresh.view.projection.id);
    for (const result of [fresh, retained]) {
      assert.doesNotMatch(result.rendered, /export const SOURCE_ONLY|"excerpt"/);
      assert.match(result.rendered, /TS1109|"code": 1109/);
      assert.match(result.rendered, /incomplete or unreliable/);
      assert.match(result.rendered, /Expression expected/);
      assert.match(result.rendered, /coding agent/);
      if (result.view.schema === 'postcode-dependency-view/1-experimental') {
        assert.match(result.rendered, /\.\/missing/); assert.match(result.rendered, /unknown-package\/subpath/);
        assert.equal(result.view.requestResults.find(item => item.writtenSpecifier === './missing')?.targetStatus, 'unresolved');
        assert.match(result.rendered, /local naming is fully checked/); assert.match(result.rendered, /compile-time descriptions/);
      }
      if (result.view.schema === 'postcode-view/1-experimental' || result.view.schema === 'postcode-module-exports-view/1-experimental') {
        assert.match(result.rendered, /Coordinates requests/); assert.match(result.rendered, /Architecture handbook/);
        const batch = observationBatch(result.view, result.rendered, { configPath: root, repositoryRoot: root, methods: [] }, result.context);
        assert.ok(batch.events.some(event => event.type === 'representation-limited'), `${request.lens}: ${result.rendered}`);
        assert.ok(batch.records.some(record => record.kind === 'representation-limit'));
      }
      const { moreDetails: _detail, ...noDetail } = result.view;
      const jsonDiagnostic = { ...noDetail, presentation: { ...noDetail.presentation, format: 'json' as const } } as typeof result.view;
      const diagnosticBatch = observationBatch(jsonDiagnostic, JSON.stringify(jsonDiagnostic), { configPath: root, repositoryRoot: root, methods: [] }, result.context);
      assert.ok(diagnosticBatch.events.some(event => event.type === 'attribution-disclosed' && event.sourceLevel === 'diagnostic-locations'));
      // Controlled code-only diagnostic exercises the shared wording for each family.
      if (result.view.schema === 'postcode-investigation-view/1-experimental') throw new Error('Unexpected interpretation');
      const context = result.view.qualifications[0]!;
      const qualified = presentQualification({ ...context, scope: 'configured-project', kind: 'claim-context', evidence: [], diagnostics: [{ code: 2307, category: 'error', message: "Cannot find module './missing'." }] });
      const view = { ...result.view, qualifications: [qualified] };
      const rendered = view.schema === 'postcode-view/1-experimental' ? renderView(view)
        : view.schema === 'postcode-organization-view/1-experimental' ? renderOrganizationView(view)
          : view.schema === 'postcode-dependency-view/1-experimental' ? renderDependencyView(view) : renderModuleExports(view);
      assert.match(rendered, /could not locate a requested module/); assert.match(rendered, /2307/);
      assert.match(rendered, /Cannot find module/);
    }
  }
  const missing = await session.execute({ lens: 'inspect', selector: 'absent', presentation: { format, moreDetails: false } });
  assert.equal(missing.kind, 'resolution');
  if (missing.kind !== 'resolution') throw new Error('Expected resolution');
  assert.match(missing.rendered, /incomplete or unreliable/); assert.match(missing.rendered, /Expression expected/);
  const batch = commandObservation(session.id, 1, {}, 'refused', missing.rendered, '', undefined, undefined,
    { kind: 'resolution-result', value: missing.report }, missing.context);
  assert.ok(batch.events.some(event => event.type === 'attribution-disclosed' && event.sourceLevel === 'diagnostic-locations'));
  assert.ok(!batch.records.some(record => record.kind === 'qualified-view'));
  const rejected = await session.execute({ lens: 'inspect', selector: () => {}, presentation: { format, moreDetails: false } } as unknown as ViewRequest);
  assert.equal(rejected.kind, 'resolution');
  if (rejected.kind !== 'resolution') throw new Error('Expected rejected-input report');
  const limited = commandObservation(session.id, 2, {}, 'refused', rejected.rendered, '', undefined, undefined,
    { kind: 'resolution-result', value: rejected.report }, rejected.context);
  assert.ok(limited.events.some(event => event.type === 'representation-limited'));
  assert.ok(limited.records.some(record => record.kind === 'representation-limit'));

});

test('plain-text documentation blocks and references remain assertions; omitted blocks disclose a representation limit', () => {
  const represented = assertionContent({ text: 'Useful claim.\n```text\nRequests cross the cache boundary.\n```\n```ts\nconst opaque = () => 1;\n```', tags: [{ name: 'see', text: 'Architecture' }] });
  assert.match(represented.text, /Useful claim/); assert.match(represented.text, /cross the cache boundary/);
  assert.doesNotMatch(represented.text, /const opaque/); assert.equal(represented.tags[0]!.text, 'Architecture');
  assert.equal(represented.representationLimits.length, 1);
  for (const operation of ['functionality', 'clarification', 'decomposition', 'examination']) {
    const instructions = investigationInstructions(operation);
    assert.match(instructions, /not presumed to read or write/); assert.match(instructions, /correction and inconsistency reasons/);
    assert.match(instructions, /Never hide a material qualification/);
  }
});
