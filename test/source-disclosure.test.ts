import assert from 'node:assert/strict';
import { test } from 'node:test';
import { execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { PassThrough } from 'node:stream';
import { temporaryDirectory, interactionDriver } from './cli-helpers.js';
import { runCli } from '../src/lib/cli.js';
import { ScriptedContributionAgent, moduleRecord, proseContribution, caveat } from './contribution-agent.js';
import type { ObservationBatch } from '../src/lib/application/observations.js';
import { observationBatch } from '../src/lib/interfaces/cli/observations.js';
import type { ContributionView as InvestigationView } from '../src/lib/interfaces/cli/contribution-presentation.js';
import { renderContributionView as renderInvestigationView } from '../src/lib/interfaces/cli/contribution-presentation.js';
import type { QualifiedView } from '../src/lib/presentation.js';
import { renderView } from '../src/lib/presentation.js';
import type { QualifiedOrganizationView } from '../src/lib/organization/presentation.js';
import { renderOrganizationView } from '../src/lib/organization/presentation.js';
import type { QualifiedDependencyView } from '../src/lib/dependencies/presentation.js';
import { renderDependencyView } from '../src/lib/dependencies/presentation.js';

type View = QualifiedView | QualifiedOrganizationView | QualifiedDependencyView | InvestigationView;
const dataOf = (batch: ObservationBatch) => batch.records.find(item => item.kind === 'qualified-view')!.value as View;
const escapes = (batch: ObservationBatch) => batch.events.filter(item => item.type === 'attribution-disclosed');

for (const format of ['unicode', 'json'] as const) test(`source observations follow actual supported disclosure in ${format} shell output`, async t => {
  const root = temporaryDirectory(t, 'postcode-disclosure-');
  mkdirSync(path.join(root, 'src')); mkdirSync(path.join(root, 'docs'));
  writeFileSync(path.join(root, 'src/entry.ts'), "import { other } from './other.js'; export const entry = other;");
  writeFileSync(path.join(root, 'src/other.ts'), 'export const other = 7;');
  writeFileSync(path.join(root, 'empty.ts'), 'export {};');
  writeFileSync(path.join(root, 'docs/README.md'), 'Repository documentation.');
  const config = path.join(root, 'tsconfig.json');
  writeFileSync(config, JSON.stringify({ compilerOptions: { noLib: true, types: [] }, files: ['src/entry.ts', 'src/other.ts', 'empty.ts'] }));
  execFileSync('git', ['init', '--quiet', root]);
  const agent = new ScriptedContributionAgent([
    item => ({ kind: 'tools', requests: [{ kind: 'source', subject: moduleRecord(item) }] }),
    item => { const supplied = item.responses[0]!; assert.equal(supplied.tool, 'evidence');
      const root = proseContribution(item, 'Uses the other value.', { evidence: supplied.response.selected, key: 'root' });
      return { kind: 'submit', contribution: { investigrams: [{ ...root.investigrams[0]!, declarations: [{ key: 'answer', operation: 'add', target: { kind: 'result', result: item.request.result },
        members: [{ kind: 'item', item: { investigram: { local: 'root' }, item: 'prose' } }, { kind: 'item', item: { investigram: { local: 'unsupported' }, item: 'prose' } }] }] },
        { key: 'unsupported', qualification: caveat, items: [{ key: 'prose', type: 'prose', body: { text: 'An unsupported inference.' } }] }] } }; },
  ]);
  const commands = [
    'inspect @investigram-00000000 --more-details',
    'children @REFERENCE --more-details', 'parents @REFERENCE --more-details',
    'children @module-00000000 --more-details', 'parents @module-00000000 --more-details',
    'inspect @module-00000000 --more-details', 'inspect @group-00000000 --more-details',
    'inspect empty --more-details', 'inspect entry --more-details', 'inspect docs --more-details',
    'children entry --more-details', 'parents other --more-details', 'dependencies --more-details',
    'inspect @REFERENCE --more-details', 'inspect entry', 'inspect @EMPTY --more-details',
    'present @ANSWER --more-details', 'present @ANSWER',
  ];
  const input = Object.assign(new PassThrough(), { isTTY: true }), driver = interactionDriver(() => input.end());
  const batches: ObservationBatch[] = [];
  let started = false, reference = '', emptyReference = '', answerReference = '', stdout = '', stderr = '';
  const code = await runCli(['shell', '--project', config, ...(format === 'json' ? ['--json'] : [])], {
    cwd: root, checkout: root, input, investigator: agent,
    stdout: text => { stdout += text; if (!started && text.includes('postcode> ')) { started = true; setImmediate(() => input.write('summarize entry\n')); } },
    stderr: text => { stderr += text; },
    sink: { async submit(batch) { batches.push(batch); driver.run(() => {
      if (batches.length === 1) { const data = dataOf(batch) as InvestigationView; answerReference = data.answerReference!; reference = data.rows[0]!.reference; emptyReference = data.rows[1]!.reference; }
      const command = commands[batches.length - 1];
      if (command) input.write(command.replace('REFERENCE', reference).replace('EMPTY', emptyReference).replace('ANSWER', answerReference) + '\n'); else input.end();
    }); return { accepted: true }; } },
  });
  driver.verify(); assert.equal(code, 0, stderr); assert.equal(batches.length, commands.length + 1);
  for (let index = 0; index < commands.length; index++) {
    const command = commands[index]!, batch = batches[index + 1]!;
    const request = batch.records.find(item => item.kind === 'request')!.value as import('../src/lib/interfaces/cli/report-contracts.js').RequestContext;
    assert.equal(request.request.presentation.moreDetails, command.includes('--more-details'), command);
    const rendered = batch.records.find(item => item.kind === 'rendered-output')!.value as string;
    assert.ok(stdout.includes(rendered));
    const actual = escapes(batch);
    if (index < 7) {
      assert.deepEqual(actual, [], command);
      assert.equal(batch.records.some(item => item.kind === 'qualified-view'), false);
      assert.equal(batch.events.some(item => item.type === 'view-produced'), false);
      assert.equal(batch.events.at(-1)!.type, 'command-refused');
      continue;
    }
    const view = dataOf(batch);
    const disclosed = index >= 7 && index <= 13 || index === 16;
    if (index >= 16) { assert.equal(request.request.kind, 'present'); assert.equal(view.projection.id, dataOf(batches[0]!).projection.id); }
    assert.equal(actual.length, disclosed ? 1 : 0, command);
    if (actual.length) {
      assert.ok(actual[0]!.sourceForms!.includes('locations'), command);
      if (index === 7 || index === 9) assert.deepEqual(actual[0]!.sourceForms, ['locations'], command);
      if (index === 8 || index >= 10 && index <= 12) assert.deepEqual(actual[0]!.sourceForms, ['locations'], command);
      if (index === 9) assert.equal(actual[0]!.sourceLevel, 'organization-paths');
      if (format === 'json') assert.ok(JSON.parse(rendered).moreDetails);
    }
    const native = view.schema === 'postcode-contribution-view/1-experimental' ? view.mechanical : view;
    if (native?.schema === 'postcode-view/1-experimental' && index === 8) {
      assert.ok(native.moreDetails!.items.flatMap(item => item.evidence).every(item => !('excerpt' in item.location)));
      const nonconforming = { ...native, moreDetails: { ...native.moreDetails!, items: native.moreDetails!.items.map(item => ({ ...item,
        evidence: item.evidence.map(evidence => ({ ...evidence, location: { ...evidence.location, excerpt: { text: 'export const unexpected = 1;' } } })) })) } };
      const unexpectedBatch = observationBatch(nonconforming, renderView(nonconforming), { configPath: config, repositoryRoot: root, methods: [] }, request);
      assert.equal(unexpectedBatch.events.some(event => event.type === 'source-displayed'), format === 'json',
        'truthful exposure follows the renderer: JSON serializes an unexpected excerpt, text does not');
      const hidden = { ...native, modules: [] };
      assert.equal(escapes(observationBatch(hidden, renderView(hidden), { configPath: config, repositoryRoot: root, methods: [] }, request)).length,
        format === 'json' ? 1 : 0, 'Unicode does not render source items for omitted modules; JSON serializes them');
    }
    if (native?.schema === 'postcode-dependency-view/1-experimental' && index === 10) {
      const embedded = { ...native, moreDetails: { ...native.moreDetails!, items: [], organizationEvidence: native.moreDetails!.items.map(item => item.evidence) } };
      assert.equal(escapes(observationBatch(embedded, renderDependencyView(embedded), { configPath: config, repositoryRoot: root, methods: [] }, request)).length,
        format === 'json' ? 1 : 0, 'organization-support source records are embedded only by JSON');
    }
    if (view.schema === 'postcode-contribution-view/1-experimental' && view.moreDetails.items.length) {
      const nonconforming = { ...view, moreDetails: { items: view.moreDetails.items.map(item => ({ ...item,
        location: { ...item.location, excerpt: { text: 'export const unexpected = 1;' } } })) } };
      const unexpectedBatch = observationBatch(nonconforming, renderInvestigationView(nonconforming), { configPath: config, repositoryRoot: root, methods: [] }, request);
      assert.equal(unexpectedBatch.events.some(event => event.type === 'source-displayed'), format === 'json', 'only JSON serializes an unexpected extra source field');
    }
    // Exercise present-but-empty containers and metadata-only containers through
    // the real renderers and shared observation boundary for every view family.
    let empty: View, render: (view: never) => string;
    switch (view.schema) {
      case 'postcode-view/1-experimental':
        empty = { ...view, moreDetails: { ...view.moreDetails!, items: (view.moreDetails?.items ?? []).map(item => ({ ...item, evidence: [] })) } }; render = renderView; break;
      case 'postcode-organization-view/1-experimental':
        empty = { ...view, moduleDetail: null, moreDetails: { ...view.moreDetails!, repositoryRoot: null, groups: [], modules: null } }; render = renderOrganizationView; break;
      case 'postcode-dependency-view/1-experimental':
        empty = { ...view, moreDetails: { ...view.moreDetails!, items: [], organizationEvidence: (view.moreDetails?.organizationEvidence ?? []).filter(item => item.kind === 'claim' || item.kind === 'claim-context') } }; render = renderDependencyView; break;
      case 'postcode-contribution-view/1-experimental':
        empty = { ...view, mechanical: null, moreDetails: { items: [] } }; render = renderInvestigationView; break;
    }
    if (view.moreDetails) assert.deepEqual(escapes(observationBatch(empty, render(empty as never), { configPath: config, repositoryRoot: root, methods: [] }, request)), [], `empty ${view.schema}`);
  }
  assert.equal(agent.inputs.length, 1, 'source observation does not invoke investigation');
});
