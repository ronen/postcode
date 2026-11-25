import assert from 'node:assert/strict';
import { test } from 'node:test';
import { execFileSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import path from 'node:path';
import { exerciseApplication } from './application-client.js';
import { ScriptedContributionAgent, proseContribution, moduleRecord } from './contribution-agent.js';
import { temporaryDirectory } from './temporary-directory.js';
import type { RecordId } from '../src/lib/records.js';

test('intended-entry client retains complete exports, occurrences, alternatives and exact historical content', async t => {
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

});
