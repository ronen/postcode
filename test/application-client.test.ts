import assert from 'node:assert/strict';
import { test } from 'node:test';
import { execFileSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import path from 'node:path';
import { exerciseApplication } from './application-client.js';
import { ScriptedInvestigator } from './investigator-double.js';
import { temporaryDirectory } from './cli-helpers.js';
import { normalizeSession } from './comparison.js';
import { runCli } from '../src/lib/cli.js';
import type { ObservationBatch } from '../src/lib/application/observations.js';
import type { QualifiedView } from '../src/lib/presentation.js';
import type { QualifiedDependencyView } from '../src/lib/dependencies/presentation.js';
import type { RecordId } from '../src/lib/records.js';
import type { SubmittedInvestigram } from '../src/lib/investigation/contracts.js';

test('intended-entry client retains complete content while the same fixture keeps bounded CLI output and answer identity', async t => {
  const root = temporaryDirectory(t, 'postcode-application-client-');
  const configPath = path.join(root, 'tsconfig.json');
  writeFileSync(configPath, JSON.stringify({ compilerOptions: { noLib: true, types: [] }, files: ['large.ts', 'leaf.ts'] }));
  writeFileSync(path.join(root, 'large.ts'), Array.from({ length: 75 }, () => "import './leaf';").join('\n') + '\n'
    + Array.from({ length: 65 }, (_, i) => `/** ${'Complete documentation. '.repeat(150)} */\nexport const item${i} = ${i};`).join('\n'));
  writeFileSync(path.join(root, 'leaf.ts'), 'export const leaf = 1;');
  execFileSync('git', ['init', '--quiet', root]);
  let module!: RecordId;
  const draft = (subject: RecordId, localId: string): SubmittedInvestigram => ({ localId, prose: localId,
    referent: { description: 'Controlled module interpretation.', subjects: [subject] }, qualifications: ['Offline scripted evidence.'],
    evidence: [], associations: [], children: [], corrections: [], inconsistencies: [] });
  const agent = new ScriptedInvestigator([input => {
    if (input.request.operation === 'functionality') {
      module = input.request.subject; return { kind: 'submit', result: draft(module, 'original') };
    }
    return { kind: 'submit', result: { ...draft(module, 'follow'), children: Array.from({ length: 30 }, (_, i) => ({ ...draft(module, `child-${i}`),
      associations: [{ subject: input.request.subject, qualifications: ['Explicit association.'], evidence: [] }] })),
    corrections: Array.from({ length: 26 }, (_, i) => ({ target: input.request.subject, correctedSubjects: [module], reason: `Alternative ${i}`,
      qualifications: ['Controlled alternatives.'], evidence: [input.request.subject], replacement: draft(module, `replacement-${i}`) })) } };
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
  assert.equal(direct.historical.answer.content.contract, 'investigation');
  assert.ok(direct.historical.answer.content.value.projection.associated.length >= 30);
  assert.equal(direct.historical.answer.content.value.projection.revisions[0]!.rows.length, 26);

  for (const format of ['unicode', 'json'] as const) for (const lens of ['inspect', 'children'] as const) {
    let stdout = '', stderr = ''; const batches: ObservationBatch[] = [];
    const code = await runCli([lens, 'large', '--more-details', ...(format === 'json' ? ['--json'] : []), '--project', configPath], {
      cwd: root, checkout: root, stdout: text => { stdout += text; }, stderr: text => { stderr += text; },
      configureInvestigator: async () => ({ kind: 'disabled' }), sink: { async submit(batch) { batches.push(batch); return { accepted: true }; } },
    });
    assert.equal(code, 0, stderr); assert.equal(batches.length, 1);
    const view = batches[0]!.records.find(record => record.kind === 'qualified-view')!.value as QualifiedView | QualifiedDependencyView;
    const expected = lens === 'inspect' ? direct.inspection : direct.children;
    assert.equal(normalizeSession(view.projection).id, normalizeSession(expected.answer.content.value.projection).id);
    assert.equal(batches[0]!.records.find(record => record.kind === 'rendered-output')!.value, stdout);
    assert.equal(batches[0]!.formatVersion, 4);
    if (lens === 'inspect') {
      assert.equal(view.schema, 'postcode-view/1-experimental');
      assert.equal(view.modules[0]!.exports.length, 50); assert.equal(view.modules[0]!.omittedExports, 15);
      assert.ok(view.modules[0]!.exports[0]!.documentation[0]!.omittedTextCharacters > 0);
    } else {
      assert.equal(view.schema, 'postcode-dependency-view/1-experimental');
      assert.equal(view.relationships[0]!.occurrences.length, format === 'unicode' ? 20 : 50);
      assert.equal(view.relationships[0]!.omittedOccurrences, format === 'unicode' ? 55 : 25);
    }
    if (format === 'json') assert.deepEqual(JSON.parse(stdout), view);
  }
});
