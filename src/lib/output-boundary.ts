import { lstatSync, readlinkSync, realpathSync } from 'node:fs';
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

/** One immutable boundary basis, re-resolved at each existing validation phase. */
export function outputBoundary(directories: readonly string[]) {
  const requested = [...new Set(directories.map(name => path.resolve(name)))].sort(compare);
  const resolve = () => requested.map(lexical => {
    try { return { lexical, real: livePath(lexical) }; }
    catch (error) {
      if (!operationalIO(error)) throw error;
      throw new OutputBoundaryFailure(lexical, errorCode(error) ?? error.message);
    }
  });
  const locations = Object.freeze(resolve().map(item => Object.freeze(item)));
  const basis = canonical(locations);
  const contains = (name: string) => locations.some(item => within(path.resolve(name), item.lexical) || within(path.resolve(name), item.real));
  return {
    locations, count: new Set(locations.map(item => item.real)).size,
    contains,
    excluded(name: string) { return contains(name) || locations.length > 0 && contains(livePath(name)); },
    changed() { return canonical(resolve()) !== basis; },
  };
}
export type OutputBoundary = ReturnType<typeof outputBoundary>;
