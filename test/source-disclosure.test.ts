import assert from 'node:assert/strict';
import { test } from 'node:test';
import { execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { PassThrough } from 'node:stream';
import { temporaryDirectory, interactionDriver } from './cli-helpers.js';
import { runCli } from '../src/lib/cli.js';
import { ScriptedInvestigator } from './investigator-double.js';
import type { EvidenceResponse } from '../src/lib/evidence-access.js';
import type { ObservationBatch } from '../src/lib/observations.js';
import { observationBatch } from '../src/lib/observations.js';
import type { InvestigationView } from '../src/lib/investigation/presentation.js';
import { renderInvestigationView } from '../src/lib/investigation/presentation.js';
import type { QualifiedView } from '../src/lib/presentation.js';
import { renderView } from '../src/lib/presentation.js';
import type { QualifiedOrganizationView } from '../src/lib/organization/presentation.js';
import { renderOrganizationView } from '../src/lib/organization/presentation.js';
import type { QualifiedDependencyView } from '../src/lib/dependencies/presentation.js';
import { renderDependencyView } from '../src/lib/dependencies/presentation.js';

type View = QualifiedView | QualifiedOrganizationView | QualifiedDependencyView | InvestigationView;
const dataOf = (batch: ObservationBatch) => batch.records.find(item => item.kind === 'qualified-view')!.value as View;
const escapes = (batch: ObservationBatch) => batch.events.filter(item => item.type === 'source-escape');

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
  const agent = new ScriptedInvestigator([
    item => ({ kind: 'tools', requests: [{ kind: 'source', subject: item.request.subject }] }),
    item => ({ kind: 'submit', result: { localId: 'root', prose: 'Uses the other value.', referent: { description: 'Entry module.', subjects: [item.request.subject] },
      qualifications: ['Interpretation.'], evidence: (item.responses[0] as EvidenceResponse).selected, associations: [], children: [{ localId: 'child', prose: 'An unsupported inference.', referent: { description: 'Entry module.', subjects: [item.request.subject] }, qualifications: ['No source support supplied.'], evidence: [], associations: [], children: [], corrections: [], inconsistencies: [] }], corrections: [], inconsistencies: [] } }),
  ]);
  const commands = [
    'inspect @investigram-00000000 --source-detail',
    'children @REFERENCE --source-detail', 'parents @REFERENCE --source-detail',
    'children @module-00000000 --source-detail', 'parents @module-00000000 --source-detail',
    'inspect @module-00000000 --source-detail', 'inspect @group-00000000 --source-detail',
    'inspect empty --source-detail', 'inspect entry --source-detail', 'inspect docs --source-detail',
    'children entry --source-detail', 'parents other --source-detail', 'dependencies --source-detail',
    'inspect @REFERENCE --source-detail', 'inspect entry', 'inspect @EMPTY --source-detail',
  ];
  const input = Object.assign(new PassThrough(), { isTTY: true }), driver = interactionDriver(() => input.end());
  const batches: ObservationBatch[] = [];
  let started = false, reference = '', emptyReference = '', stdout = '', stderr = '';
  const code = await runCli(['shell', '--project', config, ...(format === 'json' ? ['--json'] : [])], {
    cwd: root, checkout: root, input, investigator: agent,
    stdout: text => { stdout += text; if (!started && text.includes('postcode> ')) { started = true; setImmediate(() => input.write('summarize entry\n')); } },
    stderr: text => { stderr += text; },
    sink: { async submit(batch) { batches.push(batch); driver.run(() => {
      if (batches.length === 1) { const data = dataOf(batch) as InvestigationView; reference = data.references.find(item => item.id === data.accounts[0]!.id)!.reference; emptyReference = data.references.find(item => item.id === data.accounts[1]!.id)!.reference; }
      const command = commands[batches.length - 1];
      if (command) input.write(command.replace('REFERENCE', reference).replace('EMPTY', emptyReference) + '\n'); else input.end();
    }); return { accepted: true }; } },
  });
  driver.verify(); assert.equal(code, 0, stderr); assert.equal(batches.length, commands.length + 1);
  for (let index = 0; index < commands.length; index++) {
    const command = commands[index]!, batch = batches[index + 1]!, view = dataOf(batch);
    const request = batch.records.find(item => item.kind === 'request')!.value as { presentation: { sourceDetail: boolean } };
    assert.equal(request.presentation.sourceDetail, command.includes('--source-detail'), command);
    const rendered = batch.records.find(item => item.kind === 'rendered-output')!.value as string;
    assert.ok(stdout.includes(rendered));
    const actual = escapes(batch);
    // Missing organization selection still serializes repositoryRoot in JSON;
    // Unicode renders no path for it. The event must follow that actual output.
    const rootOnly = index === 5 || index === 6;
    const disclosed = index >= 7 && index <= 13 || rootOnly && format === 'json';
    assert.equal(actual.length, disclosed ? 1 : 0, command);
    if (actual.length) {
      assert.ok(actual[0]!.sourceForms!.includes('locations'), command);
      if (index === 7 || index === 9 || rootOnly) assert.deepEqual(actual[0]!.sourceForms, ['locations'], command);
      if (index === 8 || index >= 10 && index <= 12) assert.deepEqual(actual[0]!.sourceForms, ['locations', 'excerpts'], command);
      if (rootOnly || index === 9) assert.equal(actual[0]!.sourceLevel, 'organization-paths');
      if (format === 'json') assert.ok(JSON.parse(rendered).sourceDetail);
    }
    if (view.schema === 'postcode-view/1-experimental' && index === 8) {
      const noExcerpts = { ...view, sourceDetail: { ...view.sourceDetail!, items: view.sourceDetail!.items.map(item => ({ ...item,
        evidence: item.evidence.map(evidence => evidence.location.association === 'file' ? evidence : { ...evidence,
          location: { ...evidence.location, excerpt: { ...evidence.location.excerpt, text: '' } } }) })) } };
      const event = escapes(observationBatch(noExcerpts, renderView(noExcerpts), { configPath: config, repositoryRoot: root, methods: [] }))[0]!;
      assert.deepEqual(event.sourceForms, ['locations'], 'empty excerpts do not erase genuine locations or claim text disclosure');
      const hidden = { ...view, modules: [] };
      assert.equal(escapes(observationBatch(hidden, renderView(hidden), { configPath: config, repositoryRoot: root, methods: [] })).length,
        format === 'json' ? 1 : 0, 'Unicode does not render source items for omitted modules; JSON serializes them');
    }
    if (view.schema === 'postcode-dependency-view/1-experimental' && index === 10) {
      const embedded = { ...view, sourceDetail: { ...view.sourceDetail!, items: [], organizationEvidence: view.sourceDetail!.items.map(item => item.evidence) } };
      assert.equal(escapes(observationBatch(embedded, renderDependencyView(embedded), { configPath: config, repositoryRoot: root, methods: [] })).length,
        format === 'json' ? 1 : 0, 'organization-support source records are embedded only by JSON');
    }
    // Exercise present-but-empty containers and metadata-only containers through
    // the real renderers and shared observation boundary for every view family.
    let empty: View, render: (view: never) => string;
    switch (view.schema) {
      case 'postcode-view/1-experimental':
        empty = { ...view, sourceDetail: { ...view.sourceDetail!, items: (view.sourceDetail?.items ?? []).map(item => ({ ...item, evidence: [] })) } }; render = renderView; break;
      case 'postcode-organization-view/1-experimental':
        empty = { ...view, moduleDetail: null, sourceDetail: { ...view.sourceDetail!, repositoryRoot: null, groups: [], modules: null } }; render = renderOrganizationView; break;
      case 'postcode-dependency-view/1-experimental':
        empty = { ...view, sourceDetail: { ...view.sourceDetail!, items: [], organizationEvidence: (view.sourceDetail?.organizationEvidence ?? []).filter(item => item.kind === 'claim' || item.kind === 'claim-context') } }; render = renderDependencyView; break;
      case 'postcode-investigation-view/1-experimental':
        empty = { ...view, sourceDetail: { level: 'investigation-support', items: [] } }; render = renderInvestigationView; break;
    }
    if (view.sourceDetail) assert.deepEqual(escapes(observationBatch(empty, render(empty as never), { configPath: config, repositoryRoot: root, methods: [] })), [], `empty ${view.schema}`);
  }
  assert.equal(agent.inputs.length, 1, 'source observation does not invoke investigation');
});
