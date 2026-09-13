import path from 'node:path';
import ts from 'typescript';
import { canonical, compare, digest } from '../identity.js';

/** Captures positive and negative resolution inputs, not just configured root contents. */
export function captureInputs(excludedDirectories: readonly string[]) {
  const absolute = (name: string) => path.resolve(name);
  const real = (name: string): string => {
    const requested = absolute(name);
    let ancestor = requested;
    // realpath alone leaves a missing leaf unresolved, even under an existing symlink.
    while (!ts.sys.fileExists(ancestor) && !ts.sys.directoryExists(ancestor)) {
      const parent = path.dirname(ancestor);
      if (parent === ancestor) break;
      ancestor = parent;
    }
    const resolved = ts.sys.realpath?.(ancestor) ?? ancestor;
    return path.resolve(resolved, path.relative(ancestor, requested));
  };
  const exclusions = excludedDirectories.map(name => ({ lexical: absolute(name), real: real(name) }))
    .sort((a, b) => compare(a.lexical, b.lexical) || compare(a.real, b.real))
    .filter((directory, index, all) => index === 0 || directory.lexical !== all[index - 1]!.lexical
      || directory.real !== all[index - 1]!.real);
  const within = (name: string, directory: string) => {
    const relative = path.relative(directory, name);
    return relative === '' || (!relative.startsWith(`..${path.sep}`) && relative !== '..' && !path.isAbsolute(relative));
  };
  const excluded = (name: string) => {
    const lexical = absolute(name);
    if (exclusions.some(directory => within(lexical, directory.lexical))) return true;
    if (exclusions.length === 0) return false;
    const resolved = real(name);
    return exclusions.some(directory => within(resolved, directory.real));
  };
  const observations = new Map<string, unknown>();
  const memo = <T>(operation: string, args: unknown, run: () => T): T => {
    const key = canonical([operation, args]);
    if (observations.has(key)) return observations.get(key) as T;
    const result = run();
    observations.set(key, result);
    return result;
  };
  const system: ts.System = {
    ...ts.sys,
    readFile: (name, encoding) => excluded(name) ? undefined : memo('readFile', [absolute(name), encoding ?? null],
      () => ts.sys.readFile(name, encoding)),
    fileExists: name => !excluded(name) && memo('fileExists', absolute(name), () => ts.sys.fileExists(name)),
    directoryExists: name => !excluded(name) && memo('directoryExists', absolute(name), () => ts.sys.directoryExists(name)),
    readDirectory: (root, extensions, excludes, includes, depth) => excluded(root) ? [] :
      memo('readDirectory', [absolute(root), extensions ?? null, excludes ?? null, includes ?? null, depth ?? null],
        () => ts.sys.readDirectory(root, extensions,
          [...(excludes ?? []), ...exclusions.map(item => `${item.lexical}/**/*`)], includes, depth)
          .filter(name => !excluded(name)).sort(compare)),
    getDirectories: name => excluded(name) ? [] : memo('getDirectories', absolute(name),
      () => ts.sys.getDirectories(name).filter(child => !excluded(path.resolve(name, child))).sort(compare)),
    realpath: name => excluded(name) ? absolute(name) : memo('realpath', absolute(name), () => real(name)),
    writeFile: () => { throw new Error('Analysis must not write compiler output'); },
  };
  return {
    system, excluded, excludedLocationCount: new Set(exclusions.map(directory => directory.real)).size,
    identity: () => ({
      caseSensitive: system.useCaseSensitiveFileNames,
      exclusions,
      observations: [...observations].sort(([a], [b]) => compare(a, b))
        .map(([operation, value]) => [operation, value === undefined ? { absent: true } : digest(value)]),
    }),
  };
}
