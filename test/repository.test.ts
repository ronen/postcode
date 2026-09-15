import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, realpathSync, renameSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import { digest } from '../src/lib/identity.js';
import { captureRepository } from '../src/lib/repository/capture.js';
import { deriveLayout } from '../src/lib/repository/layout.js';

function fixture(run: (root: string, write: (name: string, text?: string) => void,
  git: (...args: string[]) => string, workspace: string) => void) {
  const workspace = mkdtempSync(path.join(os.tmpdir(), 'postcode-repository-'));
  const root = path.join(workspace, 'repo');
  mkdirSync(root);
  const settings: NodeJS.ProcessEnv = { GIT_CONFIG_NOSYSTEM: '1', GIT_CONFIG_GLOBAL: path.join(workspace, 'gitconfig'),
    XDG_CONFIG_HOME: path.join(workspace, 'config') };
  const previous = Object.fromEntries(Object.keys(settings).map(key => [key, process.env[key]]));
  Object.assign(process.env, settings);
  writeFileSync(settings.GIT_CONFIG_GLOBAL!, '');
  const write = (name: string, text = 'fixture') => {
    mkdirSync(path.dirname(path.join(root, name)), { recursive: true });
    writeFileSync(path.join(root, name), text);
  };
  const git = (...args: string[]) => execFileSync('git', ['-C', root, ...args], { encoding: 'utf8' });
  try {
    git('init', '--quiet');
    write('tsconfig.json', '{"files":[]}');
    run(root, write, git, workspace);
  } finally {
    for (const [key, value] of Object.entries(previous)) {
      if (value === undefined) delete process.env[key]; else process.env[key] = value;
    }
    rmSync(workspace, { recursive: true, force: true });
  }
}

function capture(root: string, outputs: readonly string[] = []) {
  const result = captureRepository(path.join(root, 'tsconfig.json'), outputs);
  assert.equal(result.status, 'available', JSON.stringify(result));
  if (result.status !== 'available') throw new Error('Repository unavailable');
  return result.evidence;
}

test('representative layout retains artifact-only siblings, direct documentation and ancestor regions', () => {
  fixture((root, write) => {
    write('src/README', 'Not a promise about descendants');
    write('src/README.txt');
    write('src/README.unusual-extension');
    write('src/readme.md');
    write('src/direct.ts', 'export const direct = 1;');
    write('src/child/module.ts', 'export const child = 1;');
    write('manual/README.md');
    write('data/data.json');
    mkdirSync(path.join(root, 'empty'));
    const evidence = capture(root);
    const layout = deriveLayout(evidence);
    assert.deepEqual(layout.regions, [
      { path: '', name: null }, { path: 'data', name: 'data' }, { path: 'manual', name: 'manual' },
      { path: 'src', name: 'src' }, { path: 'src/child', name: 'child' },
    ]);
    assert.deepEqual(layout.containment.map(edge => [edge.parent, edge.child]),
      [['', 'data'], ['', 'manual'], ['', 'src'], ['src', 'src/child']]);
    assert.equal(layout.placements.length, evidence.artifacts.length);
    assert.deepEqual(layout.placements.filter(item => item.documentation).map(item => [item.artifactPath, item.groupPath]),
      [['manual/README.md', 'manual'], ['src/README', 'src'], ['src/README.txt', 'src'], ['src/README.unusual-extension', 'src']]);
    assert.equal(JSON.stringify(evidence).includes('Not a promise'), false);
  });
});

test('worktree visibility respects tracked overrides, nested ignores, local/global exclusions and current deletion', () => {
  fixture((root, write, git, workspace) => {
    write('ignored/tracked.ts');
    write('deleted.ts');
    git('add', '.');
    write('.gitignore', 'ignored/\n*.tmp\n');
    write('ignored/untracked.ts');
    write('ignored/deeper/untracked.ts');
    write('visible/new.ts');
    write('visible/a.tmp');
    write('visible/.gitignore', '!keep.tmp\nlocal-only/\n');
    write('visible/keep.tmp');
    write('visible/local-only/data');
    write('.git/info/exclude', 'local-litter/\n');
    write('local-litter/data');
    const global = path.join(workspace, 'global-ignore');
    writeFileSync(global, 'global-litter/\n');
    git('config', 'core.excludesFile', global);
    write('global-litter/data');
    rmSync(path.join(root, 'deleted.ts'));
    const evidence = capture(root);
    assert.deepEqual(evidence.artifacts.map(item => item.path),
      ['.gitignore', 'ignored/tracked.ts', 'tsconfig.json', 'visible/.gitignore', 'visible/keep.tmp', 'visible/new.ts']);
    assert.equal(evidence.artifacts.find(item => item.path === 'ignored/tracked.ts')!.tracked, true);
    assert.ok(evidence.exclusions.some(item => item.origin === 'local' && item.contentDigest));
    assert.ok(evidence.exclusions.some(item => item.origin === 'global' && item.path === global && item.contentDigest));
    assert.ok(evidence.exclusions.some(item => item.origin === 'repository' && item.path.endsWith('/visible/.gitignore')));
  });
});

test('captures exclusion rules even where no visible artifact induces a group', () => {
  fixture((root, write) => {
    write('.gitignore', '.gitignore\n');
    write('hidden/.gitignore', '*\n');
    write('hidden/payload');
    const before = capture(root);
    assert.equal(deriveLayout(before).regions.some(region => region.path === 'hidden'), false);
    assert.ok(before.exclusions.some(item => item.path.endsWith('/hidden/.gitignore') && item.contentDigest));
    write('hidden/.gitignore', '*\n!payload\n');
    const after = capture(root);
    assert.notEqual(digest(before), digest(after));
    assert.ok(after.artifacts.some(item => item.path === 'hidden/payload'));
  });
});

test('tracked overrides honor Git case matching while retaining the observed worktree spelling', () => {
  fixture((root, write, git) => {
    write('source.ts');
    git('add', '.');
    git('config', 'core.ignoreCase', 'true');
    renameSync(path.join(root, 'source.ts'), path.join(root, 'SOURCE.ts'));
    write('.gitignore', '*.ts\n');
    const evidence = capture(root);
    assert.ok(evidence.artifacts.some(item => item.path === 'SOURCE.ts' && item.tracked));
    assert.equal(evidence.gitPathPolicy.ignoreCase, true);
  });
});

test('default XDG global ignore and configured global ignore are distinguished from repository policy', () => {
  fixture((root, write, git, workspace) => {
    const xdg = path.join(workspace, 'config/git/ignore');
    mkdirSync(path.dirname(xdg), { recursive: true });
    writeFileSync(xdg, 'default-litter\n');
    write('default-litter');
    write('explicit-litter');
    const first = capture(root);
    assert.equal(first.artifacts.some(item => item.path === 'default-litter'), false);
    assert.ok(first.exclusions.some(item => item.origin === 'global' && item.path === xdg));
    const explicit = path.join(workspace, 'explicit-ignore');
    writeFileSync(explicit, 'explicit-litter\n');
    git('config', 'core.excludesFile', explicit);
    const second = capture(root);
    assert.ok(second.artifacts.some(item => item.path === 'default-litter'));
    assert.equal(second.artifacts.some(item => item.path === 'explicit-litter'), false);
    assert.notEqual(digest(first), digest(second));
    git('config', 'core.excludesFile', '');
    const disabled = capture(root);
    assert.equal(disabled.exclusions.some(item => item.origin === 'global'), false);
    assert.ok(disabled.artifacts.some(item => item.path === 'explicit-litter'));
  });
});

test('ineffective ignore contents beneath ignored directories do not become evidence through tracked descendants', () => {
  fixture((root, write, git) => {
    write('ignored/tracked.ts');
    git('add', '.');
    write('.gitignore', 'ignored/\n');
    write('ignored/.gitignore', 'first ignored rules');
    const before = capture(root);
    assert.equal(before.exclusions.some(item => item.path.endsWith('/ignored/.gitignore')), false);
    write('ignored/.gitignore', 'different ignored rules');
    assert.deepEqual(capture(root), before);
  });
});

test('output locations are explicit and normalized; conventional names remain ordinary evidence', () => {
  fixture((root, write, git) => {
    write('_build/ordinary');
    write('_observations/ordinary');
    write('actual-output/generated');
    git('add', '.');
    const output = path.join(root, 'actual-output');
    const first = capture(root, [output]);
    assert.deepEqual(first.artifacts.map(item => item.path), ['_build/ordinary', '_observations/ordinary', 'tsconfig.json']);
    write('actual-output/generated', 'changed excluded bytes');
    write('actual-output/new/artifact');
    assert.deepEqual(capture(root, [output, `${output}/../actual-output`, output]), first);
    const all = capture(root);
    assert.ok(all.artifacts.some(item => item.path === 'actual-output/new/artifact'));
  });
});

test('nested repositories and submodules are one opaque artifact each, including tracked nested contents', () => {
  fixture((root, write, git) => {
    write('nested/already-tracked.ts');
    git('add', '.');
    execFileSync('git', ['init', '--quiet', path.join(root, 'nested')]);
    write('nested/deep/README');
    write('submodule/hidden.ts');
    git('update-index', '--add', '--cacheinfo', `160000,${'1'.repeat(40)},submodule`);
    const first = capture(root);
    assert.deepEqual(first.artifacts.map(item => [item.path, item.kind]),
      [['nested', 'nested-repository'], ['submodule', 'submodule'], ['tsconfig.json', 'file']]);
    assert.deepEqual(deriveLayout(first).regions, [{ path: '', name: null }]);
    write('nested/new-file');
    write('submodule/more/new-file');
    assert.deepEqual(capture(root), first);
  });
});

test('links into missing and existing generated output do not observe generated target existence or contents', () => {
  fixture((root, write) => {
    const output = path.join(root, 'generated');
    symlinkSync('generated', path.join(root, 'output-alias'));
    symlinkSync('output-alias/missing/deep', path.join(root, 'indirect-alias'));
    const before = capture(root, [output]);
    assert.ok(before.artifacts.filter(item => item.kind === 'symlink')
      .every(item => item.link?.status === 'excluded-output' && item.link.resolved === null));
    write('generated/missing/deep/payload');
    assert.deepEqual(capture(root, [output]), before);
    write('generated/missing/deep/payload', 'changed');
    assert.deepEqual(capture(root, [output]), before);
  });
});

test('symlinks retain captured target evidence and safe additional containment without duplicate regions', () => {
  fixture((root, write, _git, workspace) => {
    write('target/module.ts');
    write('other/README');
    write('ignored/private.ts');
    write('.gitignore', 'ignored/\n');
    write('nested/.git', 'gitdir: unavailable');
    write('nested/inside.ts');
    write('generated/payload');
    writeFileSync(path.join(workspace, 'outside'), 'outside bytes');
    const link = (name: string, target: string) => symlinkSync(target, path.join(root, name));
    link('other/alias', '../target');
    link('file-link', 'target/module.ts');
    link('root-alias', 'target');
    link('target/back', '..');
    link('broken', 'absent');
    link('outside', '../outside');
    link('private', 'ignored');
    link('opaque', 'nested');
    link('output', 'generated');
    link('loop-a', 'loop-b');
    link('loop-b', 'loop-a');
    const evidence = capture(root, [path.join(root, 'generated')]);
    const layout = deriveLayout(evidence);
    assert.deepEqual(layout.regions.map(region => region.path), ['', 'other', 'target']);
    assert.deepEqual(layout.links.map(item => [item.artifactPath, item.outcome]), [
      ['broken', 'broken'], ['file-link', 'file-target'], ['loop-a', 'cyclic'], ['loop-b', 'cyclic'],
      ['opaque', 'opaque-boundary'], ['other/alias', 'additional-parent'], ['output', 'excluded-output'],
      ['outside', 'outside-repository'], ['private', 'outside-population'], ['root-alias', 'existing-parent'],
      ['target/back', 'cyclic-containment'],
    ]);
    assert.equal(layout.containment.filter(edge => edge.child === 'target').length, 2);
    assert.equal(layout.placements.filter(item => item.artifactPath === 'other/alias').length, 1);
    rmSync(path.join(root, 'other/alias'));
    symlinkSync('../ignored', path.join(root, 'other/alias'));
    assert.equal(evidence.artifacts.find(item => item.path === 'other/alias')!.link!.target, '../target');
    assert.notEqual(digest(capture(root)), digest(evidence));
  });
});

test('opposed directory links establish a deterministic acyclic subset', () => {
  fixture((root, write) => {
    write('a/file');
    write('b/file');
    symlinkSync('../b', path.join(root, 'a/to-b'));
    symlinkSync('../a', path.join(root, 'b/to-a'));
    const layout = deriveLayout(capture(root));
    assert.deepEqual(layout.links.map(item => item.outcome), ['additional-parent', 'cyclic-containment']);
    assert.deepEqual(layout, deriveLayout({ ...capture(root), artifacts: [...capture(root).artifacts].reverse() }));
  });
});

test('directory links refuse a cycle through several established containment edges', () => {
  fixture((root, write) => {
    for (const name of ['a', 'b', 'c']) write(`${name}/file`);
    symlinkSync('../b', path.join(root, 'a/to-b'));
    symlinkSync('../c', path.join(root, 'b/to-c'));
    symlinkSync('../a', path.join(root, 'c/to-a'));
    const evidence = capture(root);
    const layout = deriveLayout(evidence);
    assert.deepEqual(layout.links, [
      { artifactPath: 'a/to-b', outcome: 'additional-parent', targetRegion: 'b' },
      { artifactPath: 'b/to-c', outcome: 'additional-parent', targetRegion: 'c' },
      { artifactPath: 'c/to-a', outcome: 'cyclic-containment', targetRegion: null },
    ]);
    assert.deepEqual(layout.containment.filter(edge => edge.basis === 'symlink').map(edge => [edge.parent, edge.child]),
      [['a', 'b'], ['b', 'c']]);
    assert.deepEqual(layout, deriveLayout({ ...evidence, artifacts: [...evidence.artifacts].reverse() }));
  });
});

test('link resolution uses captured evidence without traversing opaque or ignored targets', () => {
  fixture((root, write) => {
    write('nested/.git', 'gitdir: unavailable');
    write('.gitignore', 'ignored/\n');
    write('ignored/first');
    symlinkSync('nested', path.join(root, 'nested-alias'));
    symlinkSync('nested-alias/missing/deep', path.join(root, 'opaque-link'));
    symlinkSync('ignored/missing/deep', path.join(root, 'ignored-link'));
    const before = capture(root);
    assert.equal(before.artifacts.find(item => item.path === 'opaque-link')!.link!.status, 'opaque-boundary');
    assert.equal(before.artifacts.find(item => item.path === 'ignored-link')!.link!.status, 'outside-population');
    const layout = deriveLayout(before);
    assert.deepEqual(layout.links, [
      { artifactPath: 'ignored-link', outcome: 'outside-population', targetRegion: null },
      { artifactPath: 'nested-alias', outcome: 'opaque-boundary', targetRegion: null },
      { artifactPath: 'opaque-link', outcome: 'opaque-boundary', targetRegion: null },
    ]);
    assert.deepEqual(layout.containment, []);
    write('nested/missing/deep/new-file');
    write('ignored/missing/deep/new-file');
    assert.deepEqual(capture(root), before);
  });
});

test('an existing link target with uncaptured case spelling remains unestablished rather than broken', context => {
  fixture((root, write) => {
    write('Target/module.ts');
    if (!existsSync(path.join(root, 'target'))) {
      context.skip('Requires a filesystem where Target and target address the same existing directory.');
      return;
    }
    symlinkSync('target', path.join(root, 'alias'));
    const evidence = capture(root);
    assert.deepEqual(evidence.artifacts.find(item => item.path === 'alias')!.link, {
      target: 'target', status: 'target-not-established', resolved: null, targetKind: null,
    });
    const layout = deriveLayout(evidence);
    assert.deepEqual(layout.links, [{ artifactPath: 'alias', outcome: 'target-not-established', targetRegion: null }]);
    assert.deepEqual(layout.regions.map(region => region.path), ['', 'Target']);
    assert.deepEqual(layout.containment, [{ parent: '', child: 'Target', basis: 'directory', evidencePath: 'Target' }]);
  });
});

test('a nested project opened through a directory alias accepts absolute links through the invoked worktree path', () => {
  fixture((root, write, _git, workspace) => {
    write('projects/selected/tsconfig.json', '{"files":[]}');
    write('target/file');
    write('holder/file');
    const invokedRoot = path.join(workspace, 'invoked-repo');
    symlinkSync(root, invokedRoot);
    symlinkSync(path.join(invokedRoot, 'target'), path.join(root, 'holder/through-invocation'));
    const result = captureRepository(path.join(invokedRoot, 'projects/selected/tsconfig.json'));
    assert.equal(result.status, 'available', JSON.stringify(result));
    if (result.status !== 'available') throw new Error('Repository unavailable');
    assert.equal(result.evidence.root, realpathSync(root));
    assert.deepEqual(result.evidence.artifacts.find(item => item.path === 'holder/through-invocation')!.link, {
      target: path.join(invokedRoot, 'target'), status: 'resolved',
      resolved: path.join(realpathSync(root), 'target'), targetKind: 'directory',
    });
    assert.deepEqual(deriveLayout(result.evidence).links, [{
      artifactPath: 'holder/through-invocation', outcome: 'additional-parent', targetRegion: 'target',
    }]);
  });
});

test('links resolve directory redirects before dot-dot and preserve absolute captured worktree paths', () => {
  fixture((root, write) => {
    write('a/inside/data');
    write('a/file');
    write('file');
    symlinkSync('a/inside', path.join(root, 'directory-alias'));
    symlinkSync('directory-alias/../file', path.join(root, 'relative-link'));
    symlinkSync(path.join(root, 'a/file'), path.join(root, 'absolute-link'));
    symlinkSync('a/file/../file', path.join(root, 'not-directory'));
    const evidence = capture(root);
    for (const name of ['relative-link', 'absolute-link']) {
      assert.equal(evidence.artifacts.find(item => item.path === name)!.link!.resolved, path.join(realpathSync(root), 'a/file'));
    }
    assert.equal(evidence.artifacts.find(item => item.path === 'not-directory')!.link!.status, 'broken');
  });
});

test('a bounded long link chain is not falsely classified as a demonstrated cycle', () => {
  fixture((root, write) => {
    write('last');
    for (let index = 0; index < 43; index++) symlinkSync(index === 42 ? 'last' : `link-${index + 1}`, path.join(root, `link-${index}`));
    const evidence = capture(root);
    assert.equal(evidence.artifacts.find(item => item.path === 'link-0')!.link!.status, 'resolution-limit');
    assert.equal(evidence.artifacts.find(item => item.path === 'link-42')!.link!.status, 'resolved');
  });
});

test('special artifacts stay present and README matching asserts only direct availability', () => {
  fixture((root, write) => {
    execFileSync('mkfifo', [path.join(root, 'README.pipe')]);
    write('README.repo/.git', 'gitdir: missing');
    const evidence = capture(root);
    assert.equal(evidence.artifacts.find(item => item.path === 'README.pipe')!.kind, 'other');
    const layout = deriveLayout(evidence);
    assert.deepEqual(layout.placements.filter(item => item.documentation).map(item => item.artifactPath), ['README.pipe']);
    assert.ok(layout.placements.some(item => item.artifactPath === 'README.repo' && !item.documentation));
  });
});

test('Git failure is unavailable and an unexpected programming defect propagates', () => {
  fixture((root, write) => {
    write('.git/config', '[malformed');
    const result = captureRepository(path.join(root, 'tsconfig.json'));
    assert.ok(result.status === 'unavailable' && result.reason === 'capture-failed');
    assert.throws(() => captureRepository(undefined as unknown as string), TypeError);
  });
});

test('identity evidence changes only for relevant artifact, exclusion and link inputs', () => {
  fixture((root, write, git) => {
    write('docs/README.md', 'first documentation contents');
    write('data/payload', 'first opaque bytes');
    const before = capture(root);
    write('docs/README.md', 'new documentation contents');
    write('data/payload', 'new opaque bytes');
    assert.deepEqual(capture(root), before);
    write('added/payload');
    const added = capture(root);
    assert.notEqual(digest(added), digest(before));
    rmSync(path.join(root, 'added'), { recursive: true });
    assert.deepEqual(capture(root), before);
    git('add', 'data/payload');
    const tracked = capture(root);
    assert.notEqual(digest(tracked), digest(before));
    write('.git/info/exclude', '# changed effective exclusion input\n');
    assert.notEqual(digest(capture(root)), digest(tracked));
    git('config', 'core.sparseCheckout', 'true');
    assert.equal(capture(root).sparseCheckout, true);
    assert.ok(capture(root).limitations.some(item => item.includes('Sparse-checkout completeness is unresolved')));
  });
});

test('NUL-delimited Git operations retain literal control characters, whitespace and selector-like names', () => {
  fixture((root, write, git) => {
    for (const name of ['new\nline/file', 'tab\tname', ' leading trailing ', '--flag', 'escape\u001bname']) write(name);
    git('add', '.');
    const evidence = capture(root);
    assert.deepEqual(evidence.artifacts.map(item => item.path),
      [' leading trailing ', '--flag', 'escape\u001bname', 'new\nline/file', 'tab\tname', 'tsconfig.json']);
    assert.equal(deriveLayout(evidence).regions.find(region => region.path === 'new\nline')!.name, 'new\nline');
  });
});

test('separate processes reproduce the same capture and prepared layout', () => {
  fixture((root, write) => {
    write('src/README');
    write('src/module.ts');
    const probe = path.resolve('_build/test/repository-probe.js');
    const run = () => execFileSync(process.execPath, [probe, path.join(root, 'tsconfig.json')], { encoding: 'utf8' });
    assert.equal(run(), run());
  });
});

test('an enclosing worktree is found from a nested project; outside Git is explicitly unavailable', () => {
  fixture((root, write, _git, workspace) => {
    write('projects/selected/tsconfig.json', '{"files":[]}');
    assert.equal(captureRepository(path.join(root, 'projects/selected/tsconfig.json')).status, 'available');
    const nested = captureRepository(path.join(root, 'projects/selected/tsconfig.json'));
    assert.ok(nested.status === 'available' && nested.evidence.root === realpathSync(root));
    const outside = captureRepository(path.join(workspace, 'tsconfig.json'));
    assert.equal(outside.status, 'unavailable');
    assert.ok(outside.status === 'unavailable' && outside.reason === 'not-in-worktree');
  });
});
