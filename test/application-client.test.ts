import assert from 'node:assert/strict';
import { test } from 'node:test';
import { execFileSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import path from 'node:path';
import { exerciseApplication } from './application-client.js';
import { ScriptedContributionAgent, proseContribution, moduleRecord } from './contribution-agent.js';
import { temporaryDirectory } from './cli-helpers.js';
import { normalizeSession } from './comparison.js';
import { runCli } from '../src/lib/cli.js';
import type { ObservationBatch } from '../src/lib/application/observations.js';
import type { ContributionView } from '../src/lib/interfaces/cli/contribution-presentation.js';
import type { QualifiedDependencyView } from '../src/lib/dependencies/presentation.js';
import type { RecordId } from '../src/lib/records.js';

test('intended-entry client retains complete content while the same fixture keeps bounded CLI output and answer identity', async t => {
  const root = temporaryDirectory(t, 'postcode-application-client-');
  const configPath = path.join(root, 'tsconfig.json');
  writeFileSync(configPath, JSON.stringify({ compilerOptions: { noLib: true, types: [] }, files: ['large.ts', 'leaf.ts'] }));
  writeFileSync(path.join(root, 'large.ts'), Array.from({ length: 75 }, () => "import './leaf';").join('\n') + '\n'
    + Array.from({ length: 65 }, (_, i) => `/** ${'Complete documentation. '.repeat(150)} */\nexport const item${i} = ${i};`).join('\n'));
  writeFileSync(path.join(root, 'leaf.ts'), 'export const leaf = 1;');
  execFileSync('git', ['init', '--quiet', root]);
  let module!: RecordId;
  const agent = new ScriptedContributionAgent([input => {
    if (input.request.operation === 'functionality') {
      module = moduleRecord(input); return { kind: 'submit', contribution: proseContribution(input, 'Original') };
    }
    return { kind: 'submit', contribution: { investigrams: [{ key: 'follow', qualification: { limitations: ['Offline scripted alternatives.'] },
      items: Array.from({ length: 30 }, (_, index) => ({ key: `aspect-${index}`, type: 'prose', body: { text: `Aspect ${index}` } })),
      declarations: Array.from({ length: 26 }, (_, index) => ({ key: `alternative-${index}`, operation: 'add',
        target: { kind: 'result', result: input.request.result }, members: Array.from({ length: 30 }, (_, item) => ({
          kind: 'item', item: { investigram: { local: 'follow' }, item: `aspect-${item}` } })),
        qualification: { limitations: [`Alternative ${index}; no preferred replacement is implied.`] } })) }] } };
  }]);
  const direct = await exerciseApplication(configPath, agent);
  assert.equal(agent.inputs.length, 2);
  assert.equal(direct.inventory.answer.content.contract, 'modules');
  const large = direct.inventory.answer.content.value.modules.find(item => item.id === module)!;
  assert.equal(large.exports.length, 65);
  assert.ok(large.exports[64]!.documentation[0]!.assertion.record.text.length > 2000);
  assert.equal(direct.children.answer.content.contract, 'dependencies');
  assert.equal(Object.keys(direct.children.answer.content.value.occurrences).length, 75);
  assert.equal(direct.children.answer.content.value.organization[0]!.occurrences.length, 75);
  assert.equal(direct.historical.answer.content.contract, 'contribution-inspection');
  assert.equal(direct.historical.answer.content.value.projection.investigations.length, 1);
  assert.equal(direct.follow.answer.content.contract, 'contribution');
  assert.equal(direct.follow.answer.content.value.projection.alternatives.length, 26);
  assert.ok(direct.follow.answer.content.value.projection.alternatives.every(alternative => alternative.items.length === 30));

  for (const format of ['unicode', 'json'] as const) for (const lens of ['inspect', 'children'] as const) {
    let stdout = '', stderr = ''; const batches: ObservationBatch[] = [];
    const code = await runCli([lens, 'large', '--more-details', ...(format === 'json' ? ['--json'] : []), '--project', configPath], {
      cwd: root, checkout: root, stdout: text => { stdout += text; }, stderr: text => { stderr += text; },
      configureInvestigator: async () => ({ kind: 'disabled' }), sink: { async submit(batch) { batches.push(batch); return { accepted: true }; } },
    });
    assert.equal(code, 0, stderr); assert.equal(batches.length, 1);
    const view = batches[0]!.records.find(record => record.kind === 'qualified-view')!.value as ContributionView | QualifiedDependencyView;
    const expected = lens === 'inspect' ? direct.inspection : direct.children;
    const mechanicalProjection = view.schema === 'postcode-contribution-view/1-experimental' ? view.mechanical!.projection : view.projection;
    const expectedProjection = expected.answer.mechanical?.value.projection ?? expected.answer.content.value.projection;
    assert.equal(normalizeSession(mechanicalProjection).id, normalizeSession(expectedProjection).id);
    assert.equal(batches[0]!.records.find(record => record.kind === 'rendered-output')!.value, stdout);
    assert.equal(batches[0]!.formatVersion, 4);
    if (lens === 'inspect') {
      assert.equal(view.schema, 'postcode-contribution-view/1-experimental');
      assert.equal(view.mechanical!.schema, 'postcode-view/1-experimental');
      const mechanical = view.mechanical!; assert.equal(mechanical.schema, 'postcode-view/1-experimental');
      assert.equal(mechanical.modules[0]!.exports.length, 50); assert.equal(mechanical.modules[0]!.omittedExports, 15);
      assert.ok(mechanical.modules[0]!.exports[0]!.documentation[0]!.omittedTextCharacters > 0);
    } else {
      assert.equal(view.schema, 'postcode-dependency-view/1-experimental');
      assert.equal(view.relationships[0]!.occurrences.length, format === 'unicode' ? 20 : 50);
      assert.equal(view.relationships[0]!.omittedOccurrences, format === 'unicode' ? 55 : 25);
    }
    if (format === 'json') assert.deepEqual(JSON.parse(stdout), view);
  }
});
