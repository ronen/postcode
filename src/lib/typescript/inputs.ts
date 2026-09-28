import { livePath, outputBoundary } from '../output-boundary.js';
import type { OutputBoundary } from '../output-boundary.js';
import path from 'node:path';
import ts from 'typescript';
import { canonical, compare, digest } from '../identity.js';

/** Captures positive and negative resolution inputs, not just configured root contents. */
export function captureInputs(excludedDirectories: readonly string[] | OutputBoundary) {
  const policy = Array.isArray(excludedDirectories) ? outputBoundary(excludedDirectories) : excludedDirectories as OutputBoundary;
  const absolute = (name: string) => path.resolve(name);
  const real = livePath;
  const exclusions = policy.locations;
  const excluded = policy.excluded;
  const observations = new Map<string, unknown>();
  const probes = new Map<string, () => unknown>();
  const memo = <T>(operation: string, args: unknown, run: () => T): T => {
    const key = canonical([operation, args]);
    if (observations.has(key)) return observations.get(key) as T;
    const result = run();
    observations.set(key, result);
    probes.set(key, run);
    return result;
  };
  const system: ts.System = {
    ...ts.sys,
    readFile: (name, encoding) => excluded(name) ? undefined : memo('readFile', [absolute(name), encoding ?? null],
      () => excluded(name) ? undefined : ts.sys.readFile(name, encoding)),
    fileExists: name => !excluded(name) && memo('fileExists', absolute(name), () => !excluded(name) && ts.sys.fileExists(name)),
    directoryExists: name => !excluded(name) && memo('directoryExists', absolute(name), () => !excluded(name) && ts.sys.directoryExists(name)),
    readDirectory: (root, extensions, excludes, includes, depth) => excluded(root) ? [] :
      memo('readDirectory', [absolute(root), extensions ?? null, excludes ?? null, includes ?? null, depth ?? null],
        () => excluded(root) ? [] : ts.sys.readDirectory(root, extensions,
          [...(excludes ?? []), ...exclusions.map(item => `${item.lexical}/**/*`)], includes, depth)
          .filter(name => !excluded(name)).sort(compare)),
    getDirectories: name => excluded(name) ? [] : memo('getDirectories', absolute(name),
      () => excluded(name) ? [] : ts.sys.getDirectories(name).filter(child => !excluded(path.resolve(name, child))).sort(compare)),
    realpath: name => excluded(name) ? absolute(name) : memo('realpath', absolute(name), () => excluded(name) ? absolute(name) : real(name)),
    writeFile: () => { throw new Error('Analysis must not write compiler output'); },
  };
  return {
    system, excluded, excludedLocationCount: policy.count,
    revision: () => observations.size,
    changed: (): boolean => {
      if (policy.changed()) return true;
      for (const [key, probe] of probes) {
        const before = observations.get(key), after = probe();
        if (before === null || after === null || typeof before !== 'object' || typeof after !== 'object') {
          if (before !== after) return true;
        } else if (canonical(before) !== canonical(after)) return true;
      }
      return false;
    },
    identity: () => ({
      caseSensitive: system.useCaseSensitiveFileNames,
      exclusions,
      observations: [...observations].sort(([a], [b]) => compare(a, b))
        .map(([operation, value]) => [operation, value === undefined ? { absent: true } : digest(value)]),
    }),
  };
}
