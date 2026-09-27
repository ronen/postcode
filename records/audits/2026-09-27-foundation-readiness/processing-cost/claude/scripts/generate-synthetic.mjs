// Generates a synthetic TypeScript project inside its own Git worktree.
// Usage: node generate-synthetic.mjs OUTPUT_DIR DIRS MODULES_PER_DIR EXTRA_FILES_PER_DIR IMPORTS_PER_MODULE EXPORTS_PER_MODULE
// Deterministic: no randomness; import targets are chosen arithmetically.
import { mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import path from 'node:path';

const [output, dirs, perDir, extras, imports, exportsPer] = process.argv.slice(2);
const D = Number(dirs), M = Number(perDir), F = Number(extras), K = Number(imports), X = Number(exportsPer);
if (!output || [D, M, F, K, X].some(n => !Number.isInteger(n) || n < 0)) throw new Error('bad arguments');
if (existsSync(output)) throw new Error(`refusing to overwrite ${output}`);
const total = D * M;
const dirName = d => `pkg${Math.floor(d / 10)}/area${d}`; // two-level nesting
const modulePath = i => `src/${dirName(Math.floor(i / M))}/mod${i}.ts`;
mkdirSync(output, { recursive: true });
for (let d = 0; d < D; d++) {
  const dir = path.join(output, 'src', dirName(d));
  mkdirSync(dir, { recursive: true });
  if (d % 5 === 0) writeFileSync(path.join(dir, 'README.md'), `# area ${d}\n`);
  for (let f = 0; f < F; f++) writeFileSync(path.join(dir, `asset${f}.txt`), `asset ${d}/${f}\n`);
}
for (let i = 0; i < total; i++) {
  const lines = [];
  for (let k = 1; k <= K; k++) {
    const target = (i * 7 + k * 13) % total;
    if (target === i) continue;
    const rel = path.posix.relative(path.posix.dirname(modulePath(i)), modulePath(target)).replace(/\.ts$/, '.js');
    lines.push(`import { value${target}_0 } from '${rel.startsWith('.') ? rel : `./${rel}`}';`);
  }
  lines.push(`/** Module ${i} documentation. @remarks synthetic */`);
  for (let x = 0; x < X; x++) {
    lines.push(`/** Export ${x} of module ${i}. @param none unused */`);
    lines.push(`export const value${i}_${x} = ${x};`);
  }
  lines.push(`export function use${i}() { return ${lines.filter(l => l.startsWith('import')).length}; }`);
  writeFileSync(path.join(output, modulePath(i)), `${lines.join('\n')}\n`);
}
writeFileSync(path.join(output, 'tsconfig.json'), JSON.stringify({
  compilerOptions: { target: 'es2022', module: 'nodenext', moduleResolution: 'nodenext', lib: ['es2022'], types: [], strict: true, noEmit: true },
  include: ['src'],
}, null, 2));
writeFileSync(path.join(output, 'package.json'), JSON.stringify({ name: 'synthetic', type: 'module', private: true }));
execFileSync('git', ['init', '-q'], { cwd: output });
execFileSync('git', ['add', '-A'], { cwd: output });
execFileSync('git', ['-c', 'user.email=audit@example.invalid', '-c', 'user.name=audit', 'commit', '-q', '-m', 'synthetic'], { cwd: output });
console.log(JSON.stringify({ output, dirs: D, modules: total, artifacts: total + D * F + Math.ceil(D / 5) + 2, importsPerModule: K, exportsPerModule: X }));
