import assert from 'node:assert/strict';
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';
import { prepareExpansions } from './build/src/lib/typescript/expansions.js';
const directory = path.dirname(fileURLToPath(import.meta.url));
const results = [];
for (const n of [250, 500, 1000, 2000]) {
  const root = path.join(directory, 'inputs', `exports-${n}`);
  mkdirSync(root, {recursive:true});
  const file = path.join(root, 'broad.ts');
  writeFileSync(file, Array.from({length:n}, (_, i) => `export const v${i} = ${i};`).join('\n'));
  const program = ts.createProgram([file], {noLib:true, types:[]});
  const checker = program.getTypeChecker();
  const source = program.getSourceFile(file), symbol = checker.getSymbolAtLocation(source);
  assert.ok(symbol);
  const modules = [{key: `source:${file}`, symbol, declarations:[source]}];
  const run = () => prepareExpansions(checker, modules, ['exports']);
  run();
  const ms = Array.from({length:3}, () => { const start = performance.now(); run(); return performance.now() - start; });
  const exports = checker.getExportsOfModule(symbol);
  const originals = exports.map(symbol => symbol.getName);
  let getNames = 0;
  exports.forEach((symbol, i) => { symbol.getName = function() { getNames++; return originals[i].call(this); }; });
  try { run(); } finally { exports.forEach((symbol, i) => {symbol.getName = originals[i];}); }
  results.push({exports:n, ms, getNames});
}
writeFileSync(path.join(directory, 'export-measurements.json'), JSON.stringify(results, null, 2) + '\n');
console.log(JSON.stringify(results));
