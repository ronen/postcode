import { lstatSync, readdirSync, readlinkSync, realpathSync, statSync } from 'node:fs';
import path from 'node:path';
import { canonical, compare } from './identity.js';
import { errorCode, operationalIO } from './execution-errors.js';

/** Platform paths only. Captured repository-relative links have their own resolver. */
export function within(name: string, directory: string): boolean {
  const relative = path.relative(directory, name);
  return relative === '' || (relative !== '..' && !relative.startsWith(`..${path.sep}`) && !path.isAbsolute(relative));
}

/** Resolve links component by component, including dangling targets and missing suffixes. */
export function livePath(name: string, redirects = 0): string {
  if (redirects > 40) throw Object.assign(new Error('Cyclic or excessive symbolic-link resolution'), { code: 'ELOOP' });
  // Do not collapse a link target's `..` before following earlier links in it.
  const absolute = path.isAbsolute(name) ? name : `${process.cwd()}${path.sep}${name}`;
  try { return realpathSync.native(absolute); }
  catch (error) { if (!['ENOENT', 'ENOTDIR'].includes(errorCode(error) ?? '')) throw error; }
  const root = path.parse(absolute).root;
  const segments = absolute.slice(root.length).split(path.sep).filter(Boolean);
  let current = root;
  for (let index = 0; index < segments.length; index++) {
    current = path.join(current, segments[index]!);
    let info;
    try { info = lstatSync(current); }
    catch (error) {
      if (!['ENOENT', 'ENOTDIR'].includes(errorCode(error) ?? '')) throw error;
      return path.join(current, ...segments.slice(index + 1));
    }
    if (info.isSymbolicLink()) {
      const target = readlinkSync(current);
      const redirected = path.isAbsolute(target) ? target : `${path.dirname(current)}${path.sep}${target}`;
      return livePath([redirected, ...segments.slice(index + 1)].join(path.sep), redirects + 1);
    }
    // Preserve the filesystem's canonical spelling on case-insensitive volumes.
    current = realpathSync.native(current);
  }
  return current;
}

export class OutputBoundaryFailure extends Error {
  constructor(readonly path: string, readonly reason: string) { super(`resolve generated-output boundary ${path}: ${reason}`); }
}

/** Observe case handling on the actual filesystem, without creating probe files. */
function caseInsensitive(name: string, devices: Map<number, boolean>): boolean {
  let directory = name;
  for (;;) {
    try { if (statSync(directory).isDirectory()) break; }
    catch (error) { if (!['ENOENT', 'ENOTDIR'].includes(errorCode(error) ?? '')) throw error; }
    const parent = path.dirname(directory);
    if (parent === directory) throw new OutputBoundaryFailure(name, 'Cannot establish filesystem case handling');
    directory = parent;
  }
  const device = statSync(directory).dev;
  const known = devices.get(device);
  if (known !== undefined) return known;
  for (;;) {
    const names = readdirSync(directory);
    const spellings = new Set(names);
    for (const entry of names) {
      const alternate = entry.replace(/[a-zA-Z]/, letter => letter === letter.toLowerCase() ? letter.toUpperCase() : letter.toLowerCase());
      // An explicitly present second spelling could be a separate file or link.
      if (alternate === entry || spellings.has(alternate)) continue;
      const original = lstatSync(path.join(directory, entry));
      let insensitive = false;
      try {
        const other = lstatSync(path.join(directory, alternate));
        insensitive = original.dev === other.dev && original.ino === other.ino;
      } catch (error) { if (errorCode(error) !== 'ENOENT') throw error; }
      devices.set(device, insensitive);
      return insensitive;
    }
    const parent = path.dirname(directory);
    if (parent === directory || statSync(parent).dev !== device) {
      throw new OutputBoundaryFailure(name, 'Cannot establish filesystem case handling');
    }
    directory = parent;
  }
}

/** One immutable boundary basis, re-resolved at each existing validation phase. */
export function outputBoundary(directories: readonly string[]) {
  const requested = [...new Set(directories.map(name => path.resolve(name)))].sort(compare);
  const resolve = () => {
    const devices = new Map<number, boolean>();
    return requested.map(lexical => {
      try {
        const real = livePath(lexical);
        return { lexical, real, lexicalInsensitive: caseInsensitive(path.dirname(lexical), devices), realInsensitive: caseInsensitive(real, devices) };
      }
      catch (error) {
        if (!operationalIO(error)) throw error;
        throw new OutputBoundaryFailure(lexical, errorCode(error) ?? error.message);
      }
    });
  };
  const resolved = resolve();
  const key = (name: string, insensitive: boolean) => insensitive ? name.toLowerCase() : name;
  const snapshot = (items: typeof resolved) => canonical(items.map(item => [item.lexical,
    key(item.real, item.realInsensitive), item.lexicalInsensitive, item.realInsensitive]));
  const locations = Object.freeze(resolved.map(({ lexical, real }) => Object.freeze({ lexical, real })));
  const basis = snapshot(resolved);
  const contains = (name: string) => resolved.some(item =>
    within(key(path.resolve(name), item.lexicalInsensitive), key(item.lexical, item.lexicalInsensitive))
    || within(key(path.resolve(name), item.realInsensitive), key(item.real, item.realInsensitive)));
  return {
    locations, count: new Set(resolved.map(item => key(item.real, item.realInsensitive))).size,
    contains,
    excluded(name: string) { return contains(name) || locations.length > 0 && contains(livePath(name)); },
    changed() { return snapshot(resolve()) !== basis; },
  };
}
export type OutputBoundary = ReturnType<typeof outputBoundary>;
