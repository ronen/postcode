import { createHash } from 'node:crypto';
import { cpSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import os from 'node:os';
import path from 'node:path';

export const fixtures = ['dependency-journey', 'dependency-contract', 'exports', 'generated-scale'];
export async function comparisonFixture(name, run) {
  const root = mkdtempSync(path.join(os.tmpdir(), 'postcode-comparison-'));
  try {
    if (name === 'generated-scale') {
      writeFileSync(path.join(root, 'tsconfig.json'), JSON.stringify({ compilerOptions: { noLib: true, types: [], module: 'NodeNext' }, include: ['src/**/*.ts'] }));
      mkdirSync(path.join(root, 'src'));
      for (let i = 0; i < 80; i++) {
        writeFileSync(path.join(root, `src/module${i}.ts`), `/** Module ${i}. Literal session:11111111-1111-1111-1111-111111111111. */\nexport const value${i} = ${i};\n`
          + (i < 79 ? `export * from './module${i + 1}.js';\n` : ''));
      }
      for (let i = 0; i < 240; i++) {
        mkdirSync(path.join(root, `assets/group${i % 24}`), { recursive: true });
        writeFileSync(path.join(root, `assets/group${i % 24}/item${i}.txt`), 'non-module artifact');
      }
    } else cpSync(`fixtures/${name}`, root, { recursive: true });
    execFileSync('git', ['init', '--quiet', root]);
    await run(root, name === 'dependency-journey' ? 'forward' : name === 'dependency-contract' ? 'requests' : name === 'exports' ? 'origin' : 'module0');
  } finally { rmSync(root, { recursive: true, force: true }); }
}

export function buildIdentity(build) {
  const hash = createHash('sha256');
  function walk(directory) {
    for (const entry of readdirSync(directory, { withFileTypes: true }).sort((a, b) => a.name < b.name ? -1 : 1)) {
      const filename = path.join(directory, entry.name);
      if (entry.isDirectory()) walk(filename);
      else { hash.update(path.relative(build, filename)); hash.update(readFileSync(filename)); }
    }
  }
  walk(path.join(build, 'src'));
  return { build: path.resolve(build), sha256: hash.digest('hex') };
}

export function commands(selector) {
  return [['modules'], ['organization', 'project'], ['organization', 'repository'], ['inspect', selector],
    ['inspect', selector, '--source-detail'], ['dependencies'], ['dependencies', '--source-detail'],
    ['children', selector, '--source-detail'], ['parents', selector, '--source-detail']]
    .flatMap(command => [command, [...command, '--json']]);
}
