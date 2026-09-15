import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { cpSync, mkdirSync, mkdtempSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import { runCli } from '../src/lib/cli.js';
import type { ObservationBatch, ObservationSink } from '../src/lib/observations.js';
import { createOrganizationView, organizationPresentationRequirements, renderOrganizationView } from '../src/lib/organization/presentation.js';
import type { QualifiedOrganizationView } from '../src/lib/organization/presentation.js';
import { evaluateOrganization } from '../src/lib/organization/evaluate.js';
import { inspectOrganization, organization } from '../src/lib/organization/projections.js';
import { evaluateModules } from '../src/lib/evaluation.js';
import { recordId } from '../src/lib/identity.js';
import type { QualifiedView } from '../src/lib/presentation.js';
import { discover } from './helpers.js';
import type { GroupPropertiesClaim, ModulePlacementClaim, OrganizationClaims } from '../src/lib/organization/records.js';

async function fixture(run: (root: string, write: (name: string, text: string) => void) => Promise<void>) {
  const root = mkdtempSync(path.join(os.tmpdir(), 'postcode-organization-cli-'));
  const write = (name: string, text: string) => {
    mkdirSync(path.dirname(path.join(root, name)), { recursive: true });
    writeFileSync(path.join(root, name), text);
  };
  try {
    cpSync(path.resolve('fixtures/organization'), root, { recursive: true });
    execFileSync('git', ['init', '--quiet', root]);
    await run(root, write);
  } finally { rmSync(root, { recursive: true, force: true }); }
}

async function invoke(root: string, args: string[], sink?: ObservationSink) {
  let stdout = '';
  let stderr = '';
  const batches: ObservationBatch[] = [];
  const exit = await runCli([...args, '--project', path.join(root, 'tsconfig.json')], {
    cwd: root, checkout: process.cwd(), stdout: text => { stdout += text; }, stderr: text => { stderr += text; },
    sink: sink ?? { async submit(batch) { batches.push(batch); return { accepted: true }; } },
  });
  return { exit, stdout, stderr, batches };
}
const viewOf = (result: { stdout: string }) => JSON.parse(result.stdout) as QualifiedOrganizationView;

test('representative organization journey selects, inspects, navigates, and escapes to captured paths only', async () => {
  await fixture(async root => {
    const repository = await invoke(root, ['organization', 'repository', '--json']);
    assert.equal(repository.exit, 0);
    const full = viewOf(repository);
    assert.equal(full.groups.length, 5);
    const project = viewOf(await invoke(root, ['organization', 'project', '--json']));
    assert.equal(project.projection.snapshot, full.projection.snapshot);
    assert.equal(project.display.selectedGroups, 3);
    assert.equal(project.groups.filter(group => !group.selected).length, 2);
    const src = full.groups.find(group => group.name === 'src')!;
    const inspected = viewOf(await invoke(root, ['inspect', src.entityId, '--snapshot', full.projection.snapshot, '--json']));
    const detail = inspected.groups.find(group => group.selected)!;
    assert.equal(detail.name, 'src');
    assert.equal(detail.documented, true);
    assert.equal(detail.documentationCount, 1);
    assert.equal(detail.parents.length, 1);
    assert.equal(detail.subgroups.length, 1);
    assert.equal(detail.modules.length, 1);
    assert.equal(detail.modules[0]!.name, null);
    assert.equal(detail.modules[0]!.handleStatus, 'generated-navigation-aid');
    assert.equal(detail.modules[0]!.handleProvenance, 'source-basename');
    const child = viewOf(await invoke(root, ['inspect', detail.subgroups[0]!.entityId, '--snapshot', full.projection.snapshot, '--json']));
    const childGroup = child.groups.find(group => group.selected)!;
    assert.equal(childGroup.modulePresence, 'direct');
    assert.equal(childGroup.documented, false);
    const module = JSON.parse((await invoke(root, ['inspect', childGroup.modules[0]!.entityId, '--snapshot', full.projection.snapshot, '--json'])).stdout) as QualifiedView;
    assert.equal(module.modules.length, 1);
    assert.equal(module.modules[0]!.entityId, childGroup.modules[0]!.entityId);
    assert.ok(module.modules[0]!.exports.some(item => item.exportedName === 'child'));
    const source = await invoke(root, ['inspect', src.entityId, '--snapshot', full.projection.snapshot, '--source-detail', '--json']);
    const sourceView = viewOf(source);
    assert.equal(sourceView.sourceDetail!.groups.length, 1);
    assert.ok(sourceView.sourceDetail!.groups[0]!.path.endsWith('/src'));
    assert.ok(sourceView.sourceDetail!.groups[0]!.artifacts.some(item => item.path === 'src/README'));
    assert.equal(source.stdout.includes('Direct documentation for'), false);
    for (const conceptual of [JSON.stringify(full), JSON.stringify(project), JSON.stringify(inspected)]) {
      // Navigation paths are operational context; remove that field before checking source disclosure.
      const parsed = JSON.parse(conceptual) as QualifiedOrganizationView;
      const withoutNavigation = { ...parsed, presentation: { ...parsed.presentation, navigation: null } };
      assert.equal(JSON.stringify(withoutNavigation).includes(root), false);
      assert.equal(JSON.stringify(withoutNavigation).includes('src/README'), false);
      assert.equal(JSON.stringify(withoutNavigation).includes('module.ts'), false);
    }
    assert.deepEqual(source.batches[0]!.events.map(event => event.type), ['view-produced', 'source-escape']);
    assert.equal(source.batches[0]!.events[1]!.sourceLevel, 'organization-paths');
    assert.equal(source.batches[0]!.records.find(record => record.kind === 'rendered-output')!.value, source.stdout);
  });
});

test('Unicode and JSON share selection, disclose project pruning, and show all direct inspection relationships', async () => {
  await fixture(async root => {
    const unicode = await invoke(root, ['organization']);
    const json = viewOf(await invoke(root, ['organization', '--json']));
    const recorded = unicode.batches[0]!.records.find(record => record.kind === 'qualified-view')!.value as QualifiedOrganizationView;
    assert.deepEqual(recorded.projection, json.projection);
    assert.ok(unicode.stdout.includes('manual'));
    assert.ok(unicode.stdout.includes('no project modules · context group · descent pruned'));
    assert.ok(unicode.stdout.includes('3 selected groups · 5 repository groups'));
    const inspect = await invoke(root, ['inspect', 'src']);
    assert.ok(inspect.stdout.includes('Parents:'));
    assert.ok(inspect.stdout.includes('Subgroups:'));
    assert.ok(inspect.stdout.includes('Direct modules:'));
    assert.ok(inspect.stdout.includes('Direct documentation: 1 artifact'));
    assert.ok(inspect.stdout.includes('Other artifacts: 0 unanalyzed'));
    assert.equal(inspect.stdout.includes('src/direct.ts'), false);
  });
});

test('group source detail retains incoming parent-link evidence without changing direct artifact placement', async () => {
  await fixture(async (root, write) => {
    write('other/README', 'parent documentation contents stay private');
    write('unrelated/README', 'unrelated contents stay private');
    symlinkSync('../src', path.join(root, 'other/alias'));
    symlinkSync('../src', path.join(root, 'other/second'));
    symlinkSync('../manual', path.join(root, 'unrelated/alias'));
    const ordinary = viewOf(await invoke(root, ['inspect', 'src', '--json']));
    assert.ok(ordinary.groups.find(group => group.selected)!.parents.some(parent => parent.name === 'other'));
    assert.equal(ordinary.sourceDetail, undefined);
    assert.equal(JSON.stringify(ordinary).includes('other/alias'), false);
    const source = await invoke(root, ['inspect', 'src', '--source-detail', '--json']);
    const detailed = viewOf(source);
    assert.equal(detailed.projection.snapshot, ordinary.projection.snapshot);
    assert.deepEqual(detailed.groups, ordinary.groups);
    assert.deepEqual(detailed.sourceDetail!.groups[0]!.links, [
      { artifactPath: 'other/alias', outcome: 'additional-parent', targetRegion: 'src' },
      { artifactPath: 'other/second', outcome: 'existing-parent', targetRegion: 'src' },
    ]);
    assert.deepEqual(detailed.sourceDetail!.groups[0]!.artifacts.map(artifact => artifact.path), ['src/README', 'src/direct.ts']);
    assert.equal(source.stdout.includes('documentation contents stay private'), false);
    assert.equal(source.stdout.includes('unrelated/alias'), false);
    assert.equal(source.batches[0]!.events[1]!.sourceLevel, 'organization-paths');
    assert.equal(source.batches[0]!.records.find(record => record.kind === 'rendered-output')!.value, source.stdout);
    const parent = viewOf(await invoke(root, ['inspect', 'other', '--source-detail', '--json']));
    assert.deepEqual(parent.sourceDetail!.groups[0]!.links, detailed.sourceDetail!.groups[0]!.links);
    assert.ok(parent.sourceDetail!.groups[0]!.artifacts.some(artifact => artifact.path === 'other/alias'));
    const unicode = await invoke(root, ['inspect', 'src', '--source-detail']);
    assert.ok(unicode.stdout.includes('Relationship evidence: other/alias · additional-parent'));
    assert.ok(unicode.stdout.includes('Relationship evidence: other/second · existing-parent'));
    assert.equal(unicode.stdout.includes('unrelated/alias'), false);
  });
});

test('generic inspection displays every group/module name match, with precise scoped navigation and stale refusal', async () => {
  await fixture(async (root, write) => {
    write('src/ambient.d.ts', "declare module 'src' { export const named: number; }");
    write('tsconfig.json', '{"compilerOptions":{"noLib":true,"types":[]},"files":["src/ambient.d.ts"]}');
    const both = viewOf(await invoke(root, ['inspect', 'src', '--json']));
    assert.equal(both.projection.selection.matches, 2);
    assert.equal(both.groups.filter(group => group.selected).length, 1);
    assert.equal(both.moduleDetail!.modules.length, 1);
    const unicode = await invoke(root, ['inspect', 'src']);
    assert.ok(unicode.stdout.includes('Groups\n'));
    assert.ok(unicode.stdout.includes('Modules\n'));
    const group = both.groups.find(group => group.selected)!;
    const missingScope = viewOf(await invoke(root, ['inspect', group.entityId, '--json']));
    assert.equal(missingScope.projection.selection.referenceStatus, 'snapshot-required');
    write('new/artifact.txt', 'new input');
    const stale = viewOf(await invoke(root, ['inspect', group.entityId, '--snapshot', both.projection.snapshot, '--json']));
    assert.equal(stale.projection.selection.referenceStatus, 'snapshot-mismatch');
    assert.equal(stale.projection.selection.matches, 0);
    const source = viewOf(await invoke(root, ['inspect', 'src', '--source-detail', '--json']));
    assert.equal(source.sourceDetail!.level, 'organization-and-module-source');
    assert.ok(source.sourceDetail!.modules!.items.length > 0);
  });
});

test('shared groups expand once; link mechanics stay in source detail and placement exceptions remain visible', async () => {
  await fixture(async (root, write) => {
    write('holder/data.txt', 'holder');
    symlinkSync('../src', path.join(root, 'holder/alias'));
    symlinkSync('missing', path.join(root, 'holder/broken'));
    const normal = await invoke(root, ['organization', 'repository']);
    assert.ok(normal.stdout.includes('reference (already expanded)'));
    assert.equal(normal.stdout.includes('symlink'), false);
    assert.equal(normal.stdout.includes('alias'), false);
    const source = viewOf(await invoke(root, ['inspect', 'holder', '--source-detail', '--json']));
    assert.ok(source.sourceDetail!.groups[0]!.links.some(link => link.outcome === 'broken'));
    write('hidden/module.ts', 'export const hidden = 1;');
    write('.gitignore', 'hidden/\n');
    write('tsconfig.json', '{"compilerOptions":{"noLib":true,"types":[]},"files":["hidden/module.ts"]}');
    const exceptions = await invoke(root, ['organization']);
    assert.ok(exceptions.stdout.includes('Placement exceptions'));
    assert.ok(exceptions.stdout.includes('unplaced:'));
    assert.ok(exceptions.stdout.includes('not-visible'));
  });
});

test('partial module evaluation preserves organization views and unknown properties without I/O on construction', async () => {
  await fixture(async root => {
    const { store, analysis } = discover(path.join(root, 'tsconfig.json'));
    const evaluation = evaluateModules(store, analysis, organizationPresentationRequirements.modules);
    const partial = { ...evaluation, id: recordId(evaluation.snapshot, 'evaluation', 'partial-view'),
      execution: 'stopped' as const, materialization: 'partial' as const, modules: evaluation.modules.slice(0, 1), reason: 'Stopped fixture.' };
    store.put([partial]);
    const outcome = evaluateOrganization(store, partial, organizationPresentationRequirements.groups);
    const projection = organization(store, outcome, 'repository');
    rmSync(path.join(root, 'src'), { recursive: true });
    const view = createOrganizationView(store, projection, { format: 'unicode', sourceDetail: false });
    assert.equal(view.groups.length, 5);
    assert.ok(view.groups.some(group => group.modulePresence === null));
    assert.ok(renderOrganizationView(view).includes('module presence unknown'));
    assert.ok(renderOrganizationView(view).includes('Project placement: available, stopped, materialization partial'));
    const source = createOrganizationView(store, inspectOrganization(store, outcome, 'src'), { format: 'json', sourceDetail: true });
    assert.ok(source.sourceDetail!.groups[0]!.artifacts.some(item => item.path === 'src/README'));
  });
});

test('unavailable repository and observation-sink failure remain visible after opening; invalid projects produce no view', async () => {
  await fixture(async (root, write) => {
    rmSync(path.join(root, '.git'), { recursive: true });
    const unavailable = await invoke(root, ['organization', 'repository'], { async submit() { return { accepted: false, reason: 'fixture rejection' }; } });
    assert.equal(unavailable.exit, 0);
    assert.ok(unavailable.stdout.includes('Repository layout: unavailable'));
    assert.ok(unavailable.stderr.includes('WARNING: observation not recorded: fixture rejection'));
    write('tsconfig.json', '{broken');
    const invalid = await invoke(root, ['organization']);
    assert.equal(invalid.exit, 2);
    assert.equal(invalid.stdout, '');
    assert.equal(invalid.batches.length, 0);
  });
});

test('Unicode depth and leaf limits disclose omissions while JSON retains complete selected structure', async () => {
  await fixture(async (root, write) => {
    for (let index = 0; index < 15; index++) write(`src/m${index}.ts`, `export const m${index} = ${index};`);
    write('a/b/c/d/e/f/g/h/module.ts', 'export const deep = 1;');
    write('tsconfig.json', '{"compilerOptions":{"noLib":true,"types":[]},"include":["**/*.ts"]}');
    const unicode = await invoke(root, ['organization', 'repository']);
    const view = unicode.batches[0]!.records.find(record => record.kind === 'qualified-view')!.value as QualifiedOrganizationView;
    assert.ok(view.display.omittedSelectedGroups > 0);
    assert.ok(view.display.omittedModulePlacements >= 4);
    assert.ok(unicode.stdout.includes('depth limit'));
    const json = viewOf(await invoke(root, ['organization', 'repository', '--json']));
    assert.equal(json.display.omittedSelectedGroups, 0);
    assert.equal(json.display.omittedModulePlacements, 0);
    assert.equal(json.projection.selection.matches, view.projection.selection.matches);
    const inspect = viewOf(await invoke(root, ['inspect', 'src', '--json']));
    assert.equal(inspect.groups.find(group => group.selected)!.modules.length, 16);
  });
});

test('organization output reproduces across processes and escapes control characters at terminal boundaries', async () => {
  await fixture(async (root, write) => {
    const name = 'group\nwith\tcontrols';
    write(`${name}/README`, 'not disclosed');
    const config = path.join(root, 'tsconfig.json');
    const script = `import { runCli } from './_build/src/lib/cli.js';
      await runCli(['organization','repository','--json','--project',process.argv[1]], {
        cwd:process.cwd(), checkout:process.cwd(), stdout:s=>process.stdout.write(s), stderr:()=>{},
        sink:{ async submit(){return {accepted:true};} }
      });`;
    const run = () => execFileSync(process.execPath, ['--input-type=module', '-e', script, config], { encoding: 'utf8' });
    const first = run();
    assert.equal(run(), first);
    const json = viewOf({ stdout: first });
    assert.ok(json.groups.some(group => group.name === name));
    const unicode = await invoke(root, ['organization', 'repository']);
    assert.equal(unicode.stdout.includes(name), false);
    assert.ok(unicode.stdout.includes('group\\u000awith\\u0009controls'));
    const source = await invoke(root, ['inspect', name, '--source-detail']);
    assert.equal(source.stdout.includes(name), false);
    assert.ok(source.stdout.includes('group\\u000awith\\u0009controls/README'));
  });
});

test('group expansion limit is a display omission while root inspection retains every direct subgroup', async () => {
  await fixture(async (root, write) => {
    for (let index = 0; index < 151; index++) write(`extra/g${index}/artifact`, 'unanalyzed');
    const unicode = await invoke(root, ['organization', 'repository']);
    const view = unicode.batches[0]!.records.find(record => record.kind === 'qualified-view')!.value as QualifiedOrganizationView;
    assert.equal(new Set(view.display.rows.filter(row => row.kind === 'group').map(row => row.id)).size, 150);
    assert.ok(view.display.omittedSelectedGroups > 0);
    const inspected = viewOf(await invoke(root, ['inspect', 'extra', '--json']));
    assert.equal(inspected.groups.find(group => group.selected)!.subgroups.length, 151);
    assert.equal(inspected.display.omittedSelectedGroups, 0);
  });
});

test('candidate ambiguity retains partial status and reachable candidate groups without asserting placements', async () => {
  await fixture(async root => {
    const { store, evaluation } = discover(path.join(root, 'tsconfig.json'));
    const outcome = evaluateOrganization(store, evaluation);
    const claims = outcome.claims.map(id => store.get(id) as OrganizationClaims);
    const original = claims.find((claim): claim is ModulePlacementClaim => claim.information.type === 'module-placement')!;
    const ambiguous: ModulePlacementClaim = { ...original, id: recordId(outcome.snapshot, 'claim', 'ambiguous-view'), information: {
      ...original.information, outcome: 'ambiguous', groups: [], candidates: outcome.groups.slice(0, 2), artifacts: [], materialization: 'partial',
    } };
    const nextId = recordId(outcome.snapshot, 'organization-evaluation', 'candidate-view');
    const properties = claims.filter((claim): claim is GroupPropertiesClaim => claim.information.type === 'group-properties')
      .map(claim => ({ ...claim, id: recordId(outcome.snapshot, 'claim', ['candidate-property', claim.subject]),
        information: { ...claim.information, evaluation: nextId, modulePresence: null } }));
    const next = { ...outcome, id: nextId, claims: [...claims.filter(claim => claim.id !== original.id && claim.information.type !== 'group-properties').map(claim => claim.id),
      ambiguous.id, ...properties.map(claim => claim.id)], placement: { ...outcome.placement, materialization: 'partial' as const, reason: 'Candidate membership not established.' } };
    store.put([ambiguous, ...properties, next]);
    const projection = inspectOrganization(store, next, ambiguous.subject);
    assert.ok(ambiguous.information.candidates.every(id => projection.expansions.groups.includes(id)));
    const view = createOrganizationView(store, projection, { format: 'unicode', sourceDetail: false });
    assert.equal(view.placementExceptions[0]!.placement.outcome, 'ambiguous');
    assert.equal(view.placementExceptions[0]!.placement.materialization, 'partial');
    assert.equal(view.placementExceptions[0]!.locations.length, 0);
    assert.equal(view.placementExceptions[0]!.candidates.length, 2);
    const rendered = renderOrganizationView(view);
    assert.ok(rendered.includes('Candidate only:'));
    assert.equal(rendered.includes('Established in'), false);
  });
});
