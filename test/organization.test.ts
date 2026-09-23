import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { cpSync, mkdirSync, mkdtempSync, realpathSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import { evaluateModules } from '../src/lib/evaluation.js';
import { groupEntityIds, moduleEntityIds, recordId } from '../src/lib/identity.js';
import { evaluateOrganization } from '../src/lib/organization/evaluate.js';
import { inspectOrganization, organization } from '../src/lib/organization/projections.js';
import type { GroupPropertiesClaim, ModulePlacementClaim, OrganizationClaims, OrganizationEvaluationRecord } from '../src/lib/organization/records.js';
import type { EvaluationRecord, ModuleClaim, ProgramRecordStore, RecordId } from '../src/lib/records.js';
import { discover, inputBasis } from './helpers.js';

function fixture(run: (root: string, write: (name: string, text: string) => void) => void) {
  const root = mkdtempSync(path.join(os.tmpdir(), 'postcode-organization-'));
  const write = (name: string, text: string) => {
    mkdirSync(path.dirname(path.join(root, name)), { recursive: true });
    writeFileSync(path.join(root, name), text);
  };
  try {
    cpSync(path.resolve('fixtures/organization'), root, { recursive: true });
    execFileSync('git', ['init', '--quiet', root]);
    run(root, write);
  } finally { rmSync(root, { recursive: true, force: true }); }
}

function evaluated(root: string) {
  const result = discover(path.join(root, 'tsconfig.json'));
  const outcome = evaluateOrganization(result.store, result.evaluation);
  return { ...result, outcome };
}

function claims(store: ProgramRecordStore, outcome: OrganizationEvaluationRecord): OrganizationClaims[] {
  return outcome.claims.map(id => store.get(id) as OrganizationClaims);
}
function groups(store: ProgramRecordStore, outcome: OrganizationEvaluationRecord) {
  return new Map(claims(store, outcome).flatMap(claim => claim.information.type === 'group'
    ? [[claim.information.name, claim.subject] as const] : []));
}
function properties(store: ProgramRecordStore, outcome: OrganizationEvaluationRecord) {
  return new Map(claims(store, outcome).filter((claim): claim is GroupPropertiesClaim => claim.information.type === 'group-properties')
    .map(claim => [claim.subject, claim.information]));
}
function placements(store: ProgramRecordStore, outcome: OrganizationEvaluationRecord) {
  return claims(store, outcome).filter((claim): claim is ModulePlacementClaim => claim.information.type === 'module-placement');
}

test('repository and project select the same groups, preserving direct relationships and typed properties', () => {
  fixture(root => {
    const { store, outcome, evaluation } = evaluated(root);
    const named = groups(store, outcome);
    assert.equal(named.size, 5);
    const repository = organization(store, outcome, 'repository');
    const project = organization(store, outcome);
    assert.deepEqual(repository.groups, outcome.groups);
    assert.deepEqual(new Set(project.groups), new Set([named.get(null), named.get('src'), named.get('child')]));
    const rootContainment = (ids: readonly RecordId[]) => ids.map(id => store.get(id)).filter(claim => claim.kind === 'claim'
      && claim.subject === named.get(null) && claim.information.type === 'group-containment');
    assert.equal(rootContainment(project.claims).length, 3);
    assert.deepEqual(rootContainment(project.claims), rootContainment(repository.claims));
    const props = properties(store, outcome);
    assert.equal(props.get(named.get(null)!)!.modulePresence, 'descendant-only');
    assert.equal(props.get(named.get('src')!)!.modulePresence, 'direct');
    assert.equal(props.get(named.get('child')!)!.documented, false);
    assert.equal(props.get(named.get('manual')!)!.modulePresence, 'none');
    assert.equal(props.get(named.get('manual')!)!.documented, true);
    assert.equal(placements(store, outcome).length, evaluation.modules.length);
    assert.ok(placements(store, outcome).every(claim => claim.information.outcome === 'established'));
    const inspected = inspectOrganization(store, outcome, 'src');
    assert.deepEqual(inspected.groups, [named.get('src')]);
    assert.equal(inspected.expansions.modules.length, 1);
    assert.ok(inspected.expansions.groups.includes(named.get(null)!));
    assert.ok(inspected.expansions.groups.includes(named.get('child')!));
    const documentation = claims(store, outcome).filter(claim => claim.information.type === 'group-documentation');
    assert.equal(documentation.length, 2);
    for (const claim of documentation) {
      const context = store.get(claim.context);
      assert.ok(context.kind === 'claim-context' && context.evidence.some(id => store.get(id).kind === 'repository-artifact'));
    }
  });
});

test('explicit references select group IDs and inspect artifact-only groups outside project selection', () => {
  fixture(root => {
    const { store, outcome } = evaluated(root);
    const manual = groups(store, outcome).get('manual')!;
    const compact = groupEntityIds(outcome.groups).get(manual)!;
    assert.match(compact, /^group-[a-f0-9]{8,64}$/);
    assert.equal(inspectOrganization(store, outcome, compact).selection.referenceStatus, 'current');
    assert.deepEqual(inspectOrganization(store, outcome, compact, true).groups, [manual]);
    const stale = inspectOrganization(store, outcome, 'group-00000000', true);
    assert.equal(stale.selection.referenceStatus, 'unknown-reference');
    assert.equal(stale.groups.length, 0);
    assert.deepEqual(inspectOrganization(store, outcome, manual).groups, [manual]);
    assert.deepEqual(inspectOrganization(store, outcome, 'manual').groups, [manual]);
    assert.equal(inspectOrganization(store, outcome, 'data/value.json').selection.matches, 0);
    assert.equal(inspectOrganization(store, outcome, 'repository').groups.length, 0);
  });
});

test('partial and unavailable module evaluations retain layout and known placements without false negative presence', () => {
  fixture(root => {
    const { store, outcome, evaluation } = evaluated(root);
    for (const available of [true, false]) {
      const incomplete: EvaluationRecord = { ...evaluation, id: recordId(evaluation.session, 'evaluation', ['incomplete', available]),
        attempt: available ? 2 : 3, availability: available ? 'available' : 'unavailable', execution: available ? 'stopped' : 'deferred',
        materialization: available ? 'partial' : 'none', modules: available ? evaluation.modules.slice(0, 1) : [], reason: 'Synthetic bounded provider outcome.' };
      store.put([incomplete]);
      const next = evaluateOrganization(store, incomplete);
      assert.deepEqual(next.groups, outcome.groups);
      assert.equal(next.materialization, 'full');
      assert.equal(next.placement.materialization, available ? 'partial' : 'none');
      assert.ok([...properties(store, next).values()].every(info => info.modulePresence === null || info.modulePresence === 'direct'));
      assert.equal(organization(store, next, 'repository').selection.populationEstablished, true);
      assert.equal(organization(store, next).selection.populationEstablished, false);
      assert.equal(inspectOrganization(store, next, 'manual').selection.matches, 1);
    }
    assert.equal(properties(store, outcome).get(groups(store, outcome).get('manual')!)!.modulePresence, 'none');
  });
});

test('organization evaluation and lenses use captured inputs, with stable groups across module attempts', () => {
  fixture((root, write) => {
    const { store, evaluation, analysis } = discover(path.join(root, 'tsconfig.json'));
    write('later/README', 'later content');
    rmSync(path.join(root, 'manual'), { recursive: true });
    const first = evaluateOrganization(store, evaluation);
    const second = evaluateOrganization(store, evaluateModules(store, analysis));
    assert.deepEqual(first.groups, second.groups);
    assert.deepEqual(groups(store, first), groups(store, second));
    assert.ok(groups(store, first).has('manual'));
    assert.equal(groups(store, first).has('later'), false);
    assert.deepEqual(organization(store, first).groups, organization(store, second).groups);
    assert.notEqual(first.id, second.id);
  });
});

test('repository evidence participates in captured input support without reading ordinary artifact content', () => {
  fixture((root, write) => {
    const initial = evaluated(root);
    write('manual/README.md', 'Completely different documentation bytes.');
    write('data/value.json', '{"changed":true}');
    const content = evaluated(root);
    assert.equal(inputBasis(content), inputBasis(initial));
    write('manual/README.extra', 'new artifact');
    const added = evaluated(root);
    assert.notEqual(inputBasis(added), inputBasis(initial));
    write('.gitignore', 'manual/README.extra\n');
    const excluded = evaluated(root);
    assert.notEqual(inputBasis(excluded), inputBasis(added));
    assert.notEqual(inputBasis(excluded), inputBasis(initial));
  });
});

test('a configured project outside Git remains usable with unavailable organization', () => {
  fixture(root => {
    rmSync(path.join(root, '.git'), { recursive: true });
    const { store, outcome, evaluation } = evaluated(root);
    assert.equal(evaluation.materialization, 'full');
    assert.equal(evaluation.modules.length, 2);
    assert.equal(outcome.availability, 'unavailable');
    assert.equal(outcome.groups.length, 0);
    assert.ok(placements(store, outcome).every(claim => claim.information.outcome === 'unavailable'));
    assert.equal(organization(store, outcome, 'repository').selection.populationEstablished, false);
    const compact = moduleEntityIds(evaluation.modules).get(evaluation.modules[0]!)!;
    assert.deepEqual(inspectOrganization(store, outcome, compact, true).modules, [evaluation.modules[0]]);
  });
});

test('directory aliases share a group and retain all parents while module identities remain apparent-path identities', () => {
  fixture((root, write) => {
    write('holder/readme.txt', 'holder artifact');
    symlinkSync('../src', path.join(root, 'holder/alias'));
    symlinkSync('src/direct.ts', path.join(root, 'file-link.ts'));
    write('tsconfig.json', JSON.stringify({ compilerOptions: { noLib: true, types: [], preserveSymlinks: true },
      files: ['src/direct.ts', 'holder/alias/direct.ts', 'file-link.ts'] }));
    const { store, outcome, evaluation } = evaluated(root);
    assert.equal(evaluation.modules.length, 3);
    const named = groups(store, outcome);
    assert.equal(named.has('alias'), false);
    const byGroup = placements(store, outcome).map(claim => claim.information.groups[0]);
    assert.equal(byGroup.filter(id => id === named.get('src')).length, 2);
    assert.equal(byGroup.filter(id => id === named.get(null)).length, 1);
    const inspected = inspectOrganization(store, outcome, 'src');
    assert.ok(inspected.expansions.groups.includes(named.get('holder')!));
    assert.ok(inspected.expansions.groups.includes(named.get(null)!));
    assert.equal(inspected.expansions.modules.length, 2);
    assert.ok(organization(store, outcome).groups.includes(named.get('holder')!));
  });
});

test('multiple declarations establish multiple placements; external and invisible modules retain distinct exceptions', () => {
  fixture((root, write) => {
    write('src/one.d.ts', "declare module 'shared' { export const a: number; }");
    write('other/two.d.ts', "declare module 'shared' { export const b: number; }");
    write('hidden/file.ts', 'export const hidden = 1;');
    write('opaque/.git', 'gitdir: unavailable');
    write('opaque/file.ts', 'export const opaque = 1;');
    write('.gitignore', 'hidden/\nnode_modules/\n');
    write('node_modules/library/package.json', '{"types":"index.d.ts"}');
    write('node_modules/library/index.d.ts', 'export declare const external: number;');
    write('src/direct.ts', "export { external } from 'library';");
    write('tsconfig.json', JSON.stringify({ compilerOptions: { noLib: true, types: [] },
      files: ['src/one.d.ts', 'other/two.d.ts', 'src/direct.ts', 'hidden/file.ts', 'opaque/file.ts'] }));
    const { store, outcome, claims: moduleClaims } = evaluated(root);
    const placed = placements(store, outcome);
    const shared = placed.find(claim => moduleClaims.find(module => module.subject === claim.subject)?.information.name === 'shared')!;
    assert.equal(shared.information.outcome, 'multiple');
    assert.equal(shared.information.groups.length, 2);
    assert.deepEqual(shared.information.candidates, []);
    const external = placed.find(claim => claim.information.outcome === 'outside-organization')!;
    assert.deepEqual(external.information.reasons, ['external-module']);
    assert.equal(placed.filter(claim => claim.information.outcome === 'unplaced').length, 2);
    assert.ok(placed.some(claim => claim.information.reasons.includes('not-visible')));
    assert.ok(placed.some(claim => claim.information.reasons.includes('opaque-boundary')));
    for (const group of shared.information.groups) {
      assert.ok(inspectOrganization(store, outcome, group).expansions.modules.includes(shared.subject));
    }
  });
});

test('names can match groups and modules together; scoped Entity IDs are precise across kinds', () => {
  fixture((root, write) => {
    write('src/ambient.d.ts', "declare module 'src' { export const value: number; }");
    write('second/src/README', 'duplicate segment');
    write('tsconfig.json', '{"compilerOptions":{"noLib":true,"types":[]},"files":["src/ambient.d.ts"]}');
    const { store, outcome, evaluation } = evaluated(root);
    const inspection = inspectOrganization(store, outcome, 'src');
    assert.equal(inspection.groups.length, 2);
    assert.equal(inspection.modules.length, 1);
    assert.equal(inspection.selection.matches, 3);
    const originalModule = store.get(evaluation.modules[0]!);
    assert.ok(originalModule.kind === 'module');
    const originalClaim = store.get(originalModule.claim) as ModuleClaim;
    const group = inspection.groups[0]!;
    const compactGroup = groupEntityIds(outcome.groups).get(group)!;
    // A later provider may report a literal language name equal to a navigation ID.
    const renamed = { ...originalModule, id: recordId(outcome.session, 'module', 'collision'), claim: recordId(outcome.session, 'claim', 'collision') };
    const claim = { ...originalClaim, id: renamed.claim, subject: renamed.id, information: { ...originalClaim.information, name: compactGroup } };
    const synthetic = { ...evaluation, id: recordId(outcome.session, 'evaluation', 'collision'), modules: [renamed.id], attempt: 2 };
    store.put([renamed, claim, synthetic]);
    const next = evaluateOrganization(store, synthetic);
    assert.deepEqual(inspectOrganization(store, next, compactGroup).modules, [renamed.id]);
    const precise = inspectOrganization(store, next, compactGroup, true);
    assert.deepEqual(precise.groups, [group]);
    assert.deepEqual(precise.modules, []);
    const compactModule = moduleEntityIds(synthetic.modules).get(renamed.id)!;
    assert.deepEqual(inspectOrganization(store, next, compactModule, true).modules, [renamed.id]);
  });
});

test('nested directory-link traversal maps to captured regions and refuses cyclic containment paths', () => {
  fixture((root, write) => {
    write('holder/README', 'holder');
    write('middle/README', 'middle');
    symlinkSync('../middle', path.join(root, 'holder/alias'));
    symlinkSync('../src', path.join(root, 'middle/alias'));
    symlinkSync('..', path.join(root, 'src/up'));
    write('tsconfig.json', JSON.stringify({ compilerOptions: { noLib: true, types: [], preserveSymlinks: true },
      files: ['holder/alias/alias/direct.ts', 'src/up/src/direct.ts'] }));
    const { store, outcome } = evaluated(root);
    const placed = placements(store, outcome);
    assert.equal(placed.length, 2);
    assert.ok(placed.some(claim => claim.information.groups.includes(groups(store, outcome).get('src')!)));
    assert.ok(placed.some(claim => claim.information.outcome === 'unplaced' && claim.information.reasons.includes('link-not-established')));
  });
});

test('placement accepts the destination after 40 directory-link redirects and refuses a 41st', () => {
  fixture((root, write) => {
    for (let index = 0; index < 41; index++) {
      mkdirSync(path.join(root, `d${index}`));
      symlinkSync(`../d${index + 1}`, path.join(root, `d${index}/next`));
    }
    write('d41/module.ts', 'export const linked = 1;');
    write('tsconfig.json', JSON.stringify({ compilerOptions: { noLib: true, types: [] }, files: ['d41/module.ts'] }));
    const { store, evaluation } = discover(path.join(root, 'tsconfig.json'));
    const session = store.get(evaluation.session);
    assert.ok(session.kind === 'session' && session.repository);
    const repository = store.get(session.repository);
    assert.ok(repository.kind === 'repository-evidence');
    assert.equal(repository.layout!.links.length, 41);
    assert.ok(repository.layout!.links.every(link => link.outcome === 'additional-parent'));
    const original = store.get(evaluation.modules[0]!);
    assert.ok(original.kind === 'module');
    const claim = store.get(original.claim) as ModuleClaim;
    const context = store.get(claim.context);
    assert.ok(context.kind === 'claim-context');
    const source = context.evidence.map(id => store.get(id)).find(record => record.kind === 'source-evidence' && !record.resolution);
    assert.ok(source?.kind === 'source-evidence');
    // Use actual captured links with synthetic provider paths: host filesystem
    // traversal limits must not prevent exercising the evaluator's own bound.
    for (const redirects of [39, 40, 41]) {
      const module: typeof original = { ...original, id: recordId(evaluation.session, 'module', redirects), claim: recordId(evaluation.session, 'claim', redirects) };
      const aliasSource = { ...source, id: recordId(evaluation.session, 'source-evidence', redirects),
        path: path.join(root, `d${41 - redirects}`, ...Array<string>(redirects).fill('next'), 'module.ts') };
      const aliasContext = { ...context, id: recordId(evaluation.session, 'context', redirects), scope: module.id, evidence: [aliasSource.id] };
      const aliasClaim = { ...claim, id: module.claim, subject: module.id, context: aliasContext.id };
      const synthetic = { ...evaluation, id: recordId(evaluation.session, 'evaluation', redirects), modules: [module.id], attempt: redirects };
      store.put([module, aliasSource, aliasContext, aliasClaim, synthetic]);
      const outcome = evaluateOrganization(store, synthetic);
      const placement = placements(store, outcome)[0]!;
      assert.equal(placement.subject, module.id);
      assert.equal(placement.information.outcome, redirects <= 40 ? 'established' : 'unplaced', `${redirects} redirects`);
      assert.deepEqual(placement.information.groups, redirects <= 40 ? [groups(store, outcome).get('d41')] : []);
      assert.deepEqual(placement.information.reasons, redirects <= 40 ? [] : ['link-not-established']);
    }
  });
});

test('unavailable source evidence preserves usable placements and leaves absent presence unknown', () => {
  fixture(root => {
    const { store, evaluation } = discover(path.join(root, 'tsconfig.json'));
    const original = store.get(evaluation.modules[0]!);
    assert.ok(original.kind === 'module');
    const claim = store.get(original.claim) as ModuleClaim;
    const context = store.get(claim.context);
    assert.ok(context.kind === 'claim-context');
    const missing = { ...original, id: recordId(evaluation.session, 'module', 'missing-source'), claim: recordId(evaluation.session, 'claim', 'missing-source') };
    const missingContext = { ...context, id: recordId(evaluation.session, 'context', 'missing-source'), scope: missing.id, evidence: [] };
    const missingClaim = { ...claim, id: missing.claim, subject: missing.id, context: missingContext.id };
    const synthetic = { ...evaluation, id: recordId(evaluation.session, 'evaluation', 'missing-source'),
      modules: [...evaluation.modules, missing.id], attempt: 2 };
    store.put([missing, missingContext, missingClaim, synthetic]);
    const outcome = evaluateOrganization(store, synthetic);
    assert.equal(outcome.placement.materialization, 'partial');
    assert.equal(placements(store, outcome).filter(claim => claim.information.outcome === 'established').length, 2);
    assert.deepEqual(placements(store, outcome).find(claim => claim.subject === missing.id)!.information.reasons, ['source-unavailable']);
    assert.equal(properties(store, outcome).get(groups(store, outcome).get('manual')!)!.modulePresence, null);
    assert.equal(organization(store, outcome).selection.materialization, 'partial');
  });
});

test('record boundary rejects malformed placement outcomes and negative properties without completed evidence atomically', () => {
  fixture(root => {
    const { store, outcome, evaluation } = evaluated(root);
    const placement = placements(store, outcome)[0]!;
    for (const information of [
      { ...placement.information, outcome: 'multiple' as const },
      { ...placement.information, outcome: 'ambiguous' as const, groups: [] },
      { ...placement.information, outcome: 'unavailable' as const, groups: [] },
      { ...placement.information, groups: [evaluation.modules[0]!] },
    ]) {
      const invalid = { ...placement, id: recordId(outcome.session, 'claim', information), information };
      assert.throws(() => store.put([invalid]), /placement|group reference/);
      assert.throws(() => store.get(invalid.id), /Missing/);
    }
    const ambiguous = { ...placement, id: recordId(outcome.session, 'claim', 'ambiguous'), information: {
      ...placement.information, outcome: 'ambiguous' as const, groups: [], candidates: outcome.groups.slice(0, 2), materialization: 'partial' as const } };
    store.put([ambiguous]);
    const partial = { ...outcome, id: recordId(outcome.session, 'organization-evaluation', 'partial'),
      placement: { ...outcome.placement, execution: 'stopped' as const, materialization: 'partial' as const } };
    const property = claims(store, outcome).find((claim): claim is GroupPropertiesClaim => claim.information.type === 'group-properties'
      && claim.information.modulePresence === 'none')!;
    const invalid = { ...property, id: recordId(outcome.session, 'claim', 'false-negative'), information: { ...property.information, evaluation: partial.id } };
    assert.throws(() => store.put([partial, invalid]), /completed placement evaluation/);
    assert.throws(() => store.get(partial.id), /Missing/);
  });
});

test('project modules outside the worktree are unplaced with an outside-repository reason', () => {
  const externalRoot = mkdtempSync(path.join(os.tmpdir(), 'postcode-outside-'));
  try {
    const external = path.join(externalRoot, 'module.ts');
    writeFileSync(external, 'export const outside = 1;');
    fixture((root, write) => {
      write('tsconfig.json', JSON.stringify({ compilerOptions: { noLib: true, types: [] }, files: [external] }));
      const { store, outcome } = evaluated(root);
      const placed = placements(store, outcome);
      assert.equal(placed.length, 1);
      assert.equal(placed[0]!.information.outcome, 'unplaced');
      assert.deepEqual(placed[0]!.information.reasons, ['outside-repository']);
      assert.equal(organization(store, outcome).groups.length, 0);
      assert.equal(organization(store, outcome).modules.length, 1);
      assert.ok([...properties(store, outcome).values()].every(info => info.modulePresence === 'none'));
    });
  } finally { rmSync(externalRoot, { recursive: true, force: true }); }
});

test('completed empty module population establishes none; expansions require an explicit declaration', () => {
  fixture((root, write) => {
    write('tsconfig.json', '{"compilerOptions":{"noLib":true,"types":[]},"files":[]}');
    const { store, evaluation } = discover(path.join(root, 'tsconfig.json'));
    const outcome = evaluateOrganization(store, evaluation, []);
    assert.equal(outcome.placement.materialization, 'full');
    assert.ok([...properties(store, outcome).values()].every(info => info.modulePresence === 'none'));
    assert.equal(organization(store, outcome, 'repository').groups.length, 5);
    const project = organization(store, outcome);
    assert.equal(project.groups.length, 0);
    assert.equal(project.selection.populationEstablished, true);
    const inspected = inspectOrganization(store, outcome, 'src');
    assert.equal(inspected.groups.length, 1);
    assert.deepEqual(inspected.expansions, { requested: [], groups: [], modules: [], claims: [], moduleClaims: [], moduleEvaluations: [] });
  });
});

test('generated module handles cannot impersonate group navigation IDs', () => {
  fixture((root, write) => {
    const cue = 'group-12345678';
    write(`${cue}.ts`, 'export const value = 1;');
    write('ambient.d.ts', `declare module '${cue}' { export const x: number; }`);
    write('tsconfig.json', JSON.stringify({ compilerOptions: { noLib: true, types: [] }, files: [`${cue}.ts`, 'ambient.d.ts'] }));
    const { claims: modules } = evaluated(root);
    assert.equal(modules.length, 2);
    assert.ok(modules.every(claim => claim.information.handle === `handle-${cue}`));
    assert.ok(modules.some(claim => claim.information.name === cue));
  });
});

test('opaque README boundaries remain unanalyzed artifacts without documentation availability', () => {
  fixture((root, write) => {
    write('boundaries/README/.git', 'gitdir: unavailable');
    write('boundaries/README/hidden.md', 'not inspected');
    write('boundaries/README.submodule/hidden.md', 'not inspected');
    execFileSync('git', ['-C', root, 'update-index', '--add', '--cacheinfo',
      '160000', '1234567890123456789012345678901234567890', 'boundaries/README.submodule']);
    const { store, outcome } = evaluated(root);
    const group = groups(store, outcome).get('boundaries')!;
    assert.equal(properties(store, outcome).get(group)!.documented, false);
    assert.equal(claims(store, outcome).filter(claim => claim.subject === group && claim.information.type === 'group-documentation').length, 0);
    assert.equal(claims(store, outcome).filter(claim => claim.subject === group && claim.information.type === 'artifact-placement').length, 2);
  });
});

test('intermediate invocation links do not invent worktree-root aliases from path depth', () => {
  fixture((root, write) => {
    write('deep/project/tsconfig.json', '{"compilerOptions":{"noLib":true,"types":[]},"files":["module.ts"]}');
    write('deep/project/module.ts', 'export const value = 1;');
    symlinkSync('deep/project', path.join(root, 'alias'));
    const { store, evaluation } = discover(path.join(root, 'alias/tsconfig.json'));
    const outcome = evaluateOrganization(store, evaluation);
    const repository = store.get(outcome.repository);
    assert.ok(repository.kind === 'repository-evidence' && repository.capture.status === 'available');
    assert.ok(repository.capture.evidence.rootPaths.every(spelling => realpathSync(spelling) === realpathSync(root)));
    assert.equal(repository.capture.evidence.rootPaths.includes(path.dirname(root)), false);
    assert.equal(placements(store, outcome)[0]!.information.outcome, 'established');
    assert.deepEqual(placements(store, outcome)[0]!.information.groups, [groups(store, outcome).get('project')]);
  });
});
