/** Investigation-only build transformation; never edits product source.
 * node scripts/prototype-contribution-sharing.mjs <compiled-build> <new-build-dir> [answers|all|roots]
 * The prototype explores owned immutable object sharing, not lazy references or current-status lookup.
 */
import { cpSync, existsSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { pathToFileURL } from 'node:url';
const source = path.resolve(process.argv[2]), target = path.resolve(process.argv[3]), mode = process.argv[4] ?? 'all';
if (!['answers', 'all', 'roots'].includes(mode) || existsSync(target)) throw Error('Expected mode answers/all/roots and a new output directory');
cpSync(source, target, { recursive: true });
writeFileSync(path.join(target, 'src/lib/immutable.js'), `
// Scratch prototype. Trust comes from recursive ownership, never Object.isFrozen alone.
const owned = new WeakSet();
const nativeClone = globalThis.structuredClone;
export const copyCounts = {};
function freezeTree(value) {
  if (value !== null && typeof value === 'object' && !owned.has(value)) {
    Object.values(value).forEach(freezeTree);
    Object.freeze(value); ${mode === 'roots' ? '' : 'owned.add(value);'}
  }
  return value;
}
export function freezeOwned(value) {
  freezeTree(value);
  if (value !== null && typeof value === 'object') owned.add(value);
  return value;
}
function clone(value, seen) {
  if (value === null || typeof value !== 'object') {
    return typeof value === 'function' || typeof value === 'symbol' ? nativeClone(value) : value;
  }
  if (owned.has(value)) return value;
  if (seen.has(value)) return seen.get(value);
  const proto = Object.getPrototypeOf(value);
  if (!Array.isArray(value) && proto !== Object.prototype && proto !== null) return nativeClone(value);
  const result = Array.isArray(value) ? new Array(value.length) : {};
  seen.set(value, result);
  for (const key of Object.keys(value)) Object.defineProperty(result, key, {
    value: clone(value[key], seen), enumerable: true, configurable: true, writable: true,
  });
  return result;
}
function cloneAnswerRecord(value) { return clone(value, new Map()); }
function cloneCanonicalRecord(value) { return clone(value, new Map()); }
function cloneLedgerRecord(value) { return clone(value, new Map()); }
function cloneOther(value) { return clone(value, new Map()); }
export function copyOwned(value) {
  const kind = value?.kind;
  const copy = kind?.includes('projection') ? cloneAnswerRecord
    : kind === 'investigram' || kind === 'production' ? cloneLedgerRecord
      : value?.session && value?.id ? cloneCanonicalRecord : cloneOther;
  copyCounts[copy.name] = (copyCounts[copy.name] ?? 0) + 1;
  return copy(value);
}
`);
const files = mode !== 'answers'
  ? ['memory-store.js', 'contributions/ledger.js', 'contributions/answers.js', 'contributions/production.js']
  : ['memory-store.js'];
for (const file of files) {
  const filename = path.join(target, 'src/lib', file);
  let text = readFileSync(filename, 'utf8');
  if (mode === 'answers') {
    const before = 'pending.set(record.id, structuredClone(record));';
    if (!text.includes(before)) throw Error('Store capture changed; review the prototype');
    text = text.replace(before, "pending.set(record.id, record.kind.includes('projection') ? copyOwned(record) : structuredClone(record));");
    text = "import { copyOwned } from './immutable.js';\n" + text;
  } else text = "import { copyOwned as structuredClone } from '" + (file.includes('/') ? '../' : './') + "immutable.js';\n" + text;
  if (mode === 'roots' && file === 'contributions/ledger.js') {
    const before = 'const retained = built.map(value => freezeOwned(structuredClone(value)));';
    if (!text.includes(before)) throw Error('Ledger capture changed; review the prototype');
    text = text.replace(before, before + '\n        for (const value of retained) [...value.items, ...value.declarations, ...value.options, ...value.illustrations, ...value.inconsistencies].forEach(freezeOwned);');
  }
  writeFileSync(filename, text);
}
// Narrow ownership controls in addition to the existing behavioral suites. A shallow
// caller freeze must never grant authority to reuse its still-mutable descendants.
const { freezeOwned, copyOwned } = await import(pathToFileURL(path.join(target, 'src/lib/immutable.js')));
const external = Object.freeze({ nested: { text: 'original' } });
const captured = freezeOwned(copyOwned(external));
external.nested.text = 'changed';
assert.equal(captured.nested.text, 'original');
assert.notEqual(captured, external);
const evidence = freezeOwned({ id: 'fixed-evidence', content: { text: 'original' } });
const status = { standing: 'current', causes: [] };
const earlier = freezeOwned(copyOwned({ evidence, status }));
assert.equal(earlier.evidence, evidence);
status.standing = 'displaced'; status.causes.push({ change: 'later' });
const later = freezeOwned(copyOwned({ evidence, status }));
assert.equal(later.evidence, earlier.evidence);
assert.deepEqual(earlier.status, { standing: 'current', causes: [] });
assert.deepEqual(later.status, status);
assert.deepEqual(structuredClone(earlier), earlier);
assert.notEqual(structuredClone(earlier).evidence, evidence);
console.log(JSON.stringify({ source, target, mode, files, ownershipControlsPassed: true }));
