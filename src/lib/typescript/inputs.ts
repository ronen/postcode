import { livePath, outputBoundary } from '../output-boundary.js';
import { operationalIO } from '../execution-errors.js';
import type { OutputBoundary } from '../output-boundary.js';
import path from 'node:path';
import ts from 'typescript';
import { canonical, compare, digest } from '../identity.js';

/** Captures positive and negative resolution inputs, not just configured root contents. */
export function captureInputs(excludedDirectories: readonly string[] | OutputBoundary) {
  const policy = Array.isArray(excludedDirectories) ? outputBoundary(excludedDirectories) : excludedDirectories as OutputBoundary;
  const absolute = (name: string) => path.resolve(name);
  const exclusions = policy.locations;
  const observations = new Map<string, unknown>();
  const probes = new Map<string, () => unknown>();
  let replaying = false;
  const unavailable = (name: string) => canonical(['unavailablePath', absolute(name)]);
  const recordUnavailable = (name: string, error: unknown) => {
    if (!operationalIO(error)) throw error;
    // Validation compares the captured basis; only acquisition may extend it.
    if (replaying) return;
    const key = unavailable(name);
    observations.set(key, true);
    probes.set(key, () => {
      try { livePath(name); return false; }
      catch (error) { if (!operationalIO(error)) throw error; return true; }
    });
  };
  // Explicit boundaries were resolved before this host exists. An operationally
  // unreadable candidate is absent, but its later recovery must still be replayed.
  const excluded = (name: string) => {
    if (observations.has(unavailable(name))) return true;
    try { return policy.excluded(name); }
    catch (error) { recordUnavailable(name, error); return true; }
  };
  const real = (name: string) => {
    try { return livePath(name); }
    catch (error) { recordUnavailable(name, error); return absolute(name); }
  };
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
      replaying = true;
      try {
        for (const [key, probe] of probes) {
          const before = observations.get(key), after = probe();
          if (before === null || after === null || typeof before !== 'object' || typeof after !== 'object') {
            if (before !== after) return true;
          } else if (canonical(before) !== canonical(after)) return true;
        }
        return false;
      } finally { replaying = false; }
    },
    identity: () => ({
      caseSensitive: system.useCaseSensitiveFileNames,
      exclusions,
      observations: [...observations].sort(([a], [b]) => compare(a, b))
        .map(([operation, value]) => [operation, value === undefined ? { absent: true } : digest(value)]),
    }),
  };
}
