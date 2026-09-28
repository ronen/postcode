import { GitExecutionOwner } from '../git-execution.js';
import type { RunGit } from '../git-execution.js';
import { GitFailure, errorCode, operationalIO } from '../execution-errors.js';
import { outputBoundary } from '../output-boundary.js';
import type { OutputBoundary } from '../output-boundary.js';
import { isUtf8 } from 'node:buffer';
import { lstatSync, readFileSync, readdirSync, readlinkSync, realpathSync, statSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { canonical, compare, digest } from '../identity.js';
import type { ExclusionEvidence, RepositoryArtifact, RepositoryCapture } from './evidence.js';

export const repositoryInputMethod = 'postcode/repository-inputs@5';

class CaptureFailure extends Error {
  constructor(readonly operation: string, readonly code: string | number | null) { super(operation); }
}

/** Capture once, then derive organization without more filesystem or Git reads.
 * The caller must enforce the configured-project-open precondition before invoking this provider.
 */
export async function captureRepository(configPath: string, excludedOutputDirectories: readonly string[] | OutputBoundary = [], runGit?: RunGit): Promise<RepositoryCapture> {
  const policy = Array.isArray(excludedOutputDirectories) ? outputBoundary(excludedOutputDirectories) : excludedOutputDirectories as OutputBoundary;
  const owner = runGit ? undefined : new GitExecutionOwner();
  const run = runGit ?? owner!.run;
  try {
    return await capture();
  } catch (error) {
    if (error instanceof CaptureFailure || error instanceof GitFailure) return { status: 'unavailable', reason: 'capture-failed',
      operation: error.operation, code: error.code };
    // Programming errors and broken invariants must not become ordinary evaluation outcomes.
    const code = errorCode(error);
    if (operationalIO(error)) {
      return { status: 'unavailable', reason: 'capture-failed', operation: 'filesystem capture', code };
    }
    throw error;
  } finally { await owner?.close(); }

  async function capture(): Promise<RepositoryCapture> {
    const git = async (cwd: string, args: readonly string[], input?: string) => {
      const result = await run({ cwd, args, ...(input === undefined ? {} : { input }) });
      if (result.signal || result.status === null) throw new CaptureFailure(`git ${args[0]}`, result.signal);
      if (!isUtf8(result.stdout) || !isUtf8(result.stderr)) throw new CaptureFailure('non-UTF-8 Git evidence', null);
      return { status: result.status, output: Buffer.from(result.stdout).toString('utf8'), error: Buffer.from(result.stderr).toString('utf8') };
    };
    const required = async (cwd: string, args: readonly string[], input?: string): Promise<string> => {
      const result = await git(cwd, args, input);
      if (result.status !== 0) throw new CaptureFailure(`git ${args[0]}`, result.status);
      return result.output;
    };
    const base = path.dirname(path.resolve(configPath));
    let discovery;
    try { discovery = await git(base, ['rev-parse', '--show-toplevel']); }
    catch (error) {
      if (error instanceof GitFailure && error.operation === 'git executable') {
        return { status: 'unavailable', reason: 'git-unavailable', operation: error.operation, code: error.code };
      }
      throw error;
    }
    if (discovery.status !== 0) {
      if (/not a git repository|must be run in a work tree/.test(discovery.error)) {
        return { status: 'unavailable', reason: 'not-in-worktree', operation: 'repository discovery', code: discovery.status };
      }
      throw new CaptureFailure('repository discovery', discovery.status);
    }
    // Remove only Git's final newline; path whitespace is significant.
    const root = discovery.output.replace(/\n$/, '');
    // A lexical ancestor is a root alias only when it actually resolves to the
    // worktree root. Intermediate links can change the relative path depth.
    const rootPaths = [root];
    for (let ancestor = base; ; ancestor = path.dirname(ancestor)) {
      if (realpathSync(ancestor) === root) {
        if (ancestor !== root) rootPaths.push(ancestor);
        break;
      }
      if (path.dirname(ancestor) === ancestor) break;
    }
    rootPaths.sort((a, b) => b.length - a.length);
    const absolute = (name: string) => path.resolve(root, name);
    const relative = (name: string) => path.relative(root, name).split(path.sep).join('/');
    const statCache = new Map<string, ReturnType<typeof lstatSync> | null>();
    const readLink = (name: string) => {
      const bytes = readlinkSync(name, { encoding: 'buffer' });
      if (!isUtf8(bytes)) throw new CaptureFailure('non-UTF-8 link target', null);
      return bytes.toString('utf8');
    };
    const lstat = (name: string) => {
      if (statCache.has(name)) return statCache.get(name)!;
      let value: ReturnType<typeof lstatSync> | null;
      try { value = lstatSync(name); } catch (error) {
        if (!['ENOENT', 'ENOTDIR'].includes(errorCode(error) ?? '')) throw error;
        value = null;
      }
      statCache.set(name, value);
      return value;
    };
    const real = (name: string, links = 0): string => {
      if (links > 40) throw Object.assign(new Error('Cyclic path resolution'), { code: 'ELOOP' });
      let ancestor = path.resolve(name);
      while (!lstat(ancestor)) {
        const parent = path.dirname(ancestor);
        if (parent === ancestor) break;
        ancestor = parent;
      }
      const tail = path.relative(ancestor, path.resolve(name));
      if (lstat(ancestor)?.isSymbolicLink()) {
        return real(path.resolve(path.dirname(ancestor), readLink(ancestor), tail), links + 1);
      }
      return path.resolve(realpathSync(ancestor), tail);
    };
    const outputs = policy.locations;
    // Captured source-link traversal below stays separate from live boundary resolution.
    const excluded = policy.contains;
    const exclusionEvidence: ExclusionEvidence[] = [];
    const exclusionDigest = (name: string, origin: ExclusionEvidence['origin'], info: ReturnType<typeof lstat>) => {
      if (excluded(name)) throw new CaptureFailure('exclusion policy overlaps generated output', null);
      // Git does not follow a symbolic .gitignore. Environmental exclude files can be links.
      if (!info || (origin === 'repository' && info.isSymbolicLink())) return null;
      if (excluded(real(name))) throw new CaptureFailure('exclusion policy overlaps generated output', null);
      if (!statSync(name).isFile()) throw new CaptureFailure('non-file exclusion policy', null);
      return digest(readFileSync(name).toString('base64'));
    };
    const captureExclusion = (name: string, origin: ExclusionEvidence['origin']) => {
      exclusionEvidence.push({ origin, path: name, contentDigest: exclusionDigest(name, origin, lstat(name)) });
    };
    const local = (await required(root, ['rev-parse', '--path-format=absolute', '--git-path', 'info/exclude'])).replace(/\n$/, '');
    const configuredGlobal = await git(root, ['config', '--path', '--null', '--get', 'core.excludesFile']);
    if (![0, 1].includes(configuredGlobal.status)) throw new CaptureFailure('global exclusions configuration', configuredGlobal.status);
    const global = configuredGlobal.status === 0 ? configuredGlobal.output.replace(/\0$/, '')
      : path.join(process.env.XDG_CONFIG_HOME || path.join(os.homedir(), '.config'), 'git', 'ignore');
    captureExclusion(absolute(local), 'local');
    // An explicitly empty core.excludesFile disables the user-global source.
    if (global !== '') captureExclusion(absolute(global), 'global');
    const sparse = await git(root, ['config', '--bool', '--get', 'core.sparseCheckout']);
    if (![0, 1].includes(sparse.status)) throw new CaptureFailure('sparse checkout configuration', sparse.status);
    const booleanConfig = async (name: string) => {
      const result = await git(root, ['config', '--bool', '--get', name]);
      if (![0, 1].includes(result.status)) throw new CaptureFailure('Git path configuration', result.status);
      return result.output === 'true\n';
    };
    const gitPathPolicy = { ignoreCase: await booleanConfig('core.ignoreCase'), precomposeUnicode: await booleanConfig('core.precomposeUnicode') };
    const trackedKey = (name: string) => {
      const normalized = gitPathPolicy.precomposeUnicode ? name.normalize('NFC') : name;
      return gitPathPolicy.ignoreCase ? normalized.replace(/[A-Z]/g, letter => letter.toLowerCase()) : normalized;
    };
    const tracked = new Map<string, Set<string>>();
    for (const entry of (await required(root, ['ls-files', '--stage', '-z'])).split('\0').filter(Boolean)) {
      const match = /^(\d+) [a-f0-9]+ [0-3]\t([\s\S]+)$/.exec(entry);
      if (!match) throw new Error('Unexpected Git index entry');
      const key = trackedKey(match[2]!);
      const modes = tracked.get(key) ?? new Set<string>();
      modes.add(match[1]!);
      tracked.set(key, modes);
    }
    const trackedDirectories = new Set<string>();
    for (const name of tracked.keys()) {
      for (let parent = path.posix.dirname(name); parent !== '.'; parent = path.posix.dirname(parent)) trackedDirectories.add(parent);
    }
    const artifacts: RepositoryArtifact[] = [];
    const linkTargets = new Map<string, string>();
    const visibleDirectories = new Set<string>();
    const ignoredPaths = new Set<string>();
    const inactivePolicyDirectories = new Set<string>();
    const inactivePolicy = (directory: string) => {
      for (let current = relative(directory); current !== '.'; current = path.posix.dirname(current)) {
        if (inactivePolicyDirectories.has(current)) return true;
        if (current === '') break;
      }
      return false;
    };
    let directories = excluded(root) ? [] : [root];
    while (directories.length > 0) {
      const entries = directories.flatMap(directory => {
        visibleDirectories.add(relative(directory));
        // Descend ignored regions only for tracked artifacts. Git does not use
        // deeper ignore rules beneath an excluded directory.
        if (!inactivePolicy(directory)) {
          captureExclusion(path.join(directory, '.gitignore'), 'repository');
        }
        return readdirSync(directory, { encoding: 'buffer' }).map(name => {
          if (!isUtf8(name)) throw new CaptureFailure('non-UTF-8 artifact name', null);
          return name.toString('utf8');
        }).sort(compare).filter(name => name !== '.git')
          .map(name => path.join(directory, name)).filter(name => !excluded(name));
      });
      directories = [];
      const untracked = entries.filter(name => !tracked.has(trackedKey(relative(name))));
      const ignored = new Set<string>();
      if (untracked.length > 0) {
        // Tracked entries are handled explicitly above and below. --no-index
        // also reveals ignored parents that have tracked descendants, so their
        // ineffective deeper policies are never read as repository evidence.
        const checked = await git(root, ['check-ignore', '--no-index', '-z', '--stdin'], `${untracked.map(relative).join('\0')}\0`);
        if (![0, 1].includes(checked.status)) throw new CaptureFailure('Git visibility', checked.status);
        checked.output.split('\0').filter(Boolean).forEach(name => ignored.add(name));
      }
      for (const name of entries) {
        const key = relative(name);
        const info = lstat(name);
        if (!info) throw new CaptureFailure('artifact disappeared during capture', 'ENOENT');
        const isTracked = tracked.has(trackedKey(key));
        if (ignored.has(key) && info.isDirectory()) inactivePolicyDirectories.add(key);
        if (ignored.has(key) && !(info.isDirectory() && trackedDirectories.has(trackedKey(key)))) {
          ignoredPaths.add(key);
          continue;
        }
        if (info.isSymbolicLink()) {
          linkTargets.set(key, readLink(name));
          artifacts.push({ path: key, kind: 'symlink', tracked: isTracked });
        } else if (info.isDirectory()) {
          const gitlink = tracked.get(trackedKey(key))?.has('160000') ?? false;
          const marker = lstat(path.join(name, '.git'));
          if (gitlink || marker) {
            // Marker presence is boundary evidence, not a claim that the nested checkout is usable.
            artifacts.push({ path: key, kind: gitlink ? 'submodule' : 'nested-repository', tracked: isTracked,
              boundary: { basis: gitlink ? 'gitlink' : 'git-marker',
                markerKind: marker?.isDirectory() ? 'directory' : marker?.isFile() ? 'file' : null } });
          } else directories.push(name);
        } else artifacts.push({ path: key, kind: info.isFile() ? 'file' : 'other', tracked: isTracked });
      }
    }
    const byPath = new Map(artifacts.map(artifact => [artifact.path, artifact]));
    const resolveLink = (artifactPath: string): NonNullable<RepositoryArtifact['link']> => {
      const target = linkTargets.get(artifactPath)!;
      const outcome = (status: NonNullable<RepositoryArtifact['link']>['status'], resolved: string | null = null,
        targetKind: NonNullable<RepositoryArtifact['link']>['targetKind'] = null) => ({ target, status, resolved, targetKind });
      let current = path.posix.dirname(artifactPath).split('/').filter(segment => segment !== '.');
      let pending = target.split(path.sep);
      const absoluteTarget = (value: string): string[] | null => {
        // Absolute paths must enter through the captured worktree root; do not
        // follow filesystem aliases outside the provider to infer re-entry.
        for (const rootPath of rootPaths) {
          if (value === rootPath) return [];
          if (value.startsWith(`${rootPath}${path.sep}`)) return value.slice(rootPath.length + 1).split(path.sep);
        }
        return null;
      };
      if (path.isAbsolute(target)) {
        const inside = absoluteTarget(target);
        if (!inside) return outcome('outside-repository');
        current = [];
        pending = inside;
      }
      let hops = 0;
      const seen = new Set<string>();
      while (pending.length > 0) {
        const state = canonical([current, pending]);
        if (seen.has(state)) return outcome('cyclic');
        seen.add(state);
        const segment = pending.shift()!;
        if (!segment || segment === '.') continue;
        if (segment === '..') {
          if (current.length === 0) return outcome('outside-repository');
          current.pop();
          continue;
        }
        const candidate = [...current, segment].join('/');
        if (excluded(absolute(candidate))) return outcome('excluded-output');
        if (segment === '.git' || ignoredPaths.has(candidate)) return outcome('outside-population');
        const item = byPath.get(candidate);
        if (item?.boundary) return outcome('opaque-boundary');
        const redirect = linkTargets.get(candidate);
        if (redirect !== undefined) {
          if (++hops > 40) return outcome('resolution-limit');
          if (path.isAbsolute(redirect)) {
            const inside = absoluteTarget(redirect);
            if (!inside) return outcome('outside-repository');
            current = [];
            pending = [...inside, ...pending];
          } else pending = [...redirect.split(path.sep), ...pending];
        } else if (visibleDirectories.has(candidate)) current.push(segment);
        else if (item) {
          if (pending.length > 0) return outcome('broken');
          return outcome('resolved', absolute(candidate), item.kind === 'file' ? 'file' : 'other');
        } else {
          // The containing directory is captured and visible. A metadata-only
          // existence probe distinguishes a missing target from an unsupported
          // spelling (for example a case alias), without following that target.
          return outcome(lstat(absolute(candidate)) ? 'target-not-established' : 'broken');
        }
      }
      return outcome('resolved', absolute(current.join('/')), 'directory');
    };
    // Git consumes live policies during its queries. Refuse detected policy
    // changes instead of qualifying a visibility result with different bytes.
    // This is a guard, not an atomicity guarantee (transient changes can escape it).
    for (const policy of exclusionEvidence) {
      let current: ReturnType<typeof lstat>;
      try { current = lstatSync(policy.path); } catch (error) {
        if (!['ENOENT', 'ENOTDIR'].includes(errorCode(error) ?? '')) throw error;
        current = null;
      }
      if (exclusionDigest(policy.path, policy.origin, current) !== policy.contentDigest) {
        throw new CaptureFailure('exclusion policy changed during capture', null);
      }
    }
    const finalGlobal = await git(root, ['config', '--path', '--null', '--get', 'core.excludesFile']);
    if (finalGlobal.status !== configuredGlobal.status || finalGlobal.output !== configuredGlobal.output) {
      throw new CaptureFailure('global exclusion selection changed during capture', null);
    }
    return { status: 'available', evidence: {
      provider: 'repository-layout', method: repositoryInputMethod, root, rootPaths,
      gitVersion: (await required(root, ['--version'])).replace(/\n$/, ''), gitPathPolicy, inputConsistency: 'first-observed',
      sparseCheckout: sparse.output === 'true\n',
      limitations: ['Current worktree inputs are first-observed, not an atomic filesystem transaction.',
        'Git reads live exclusion policy; a final policy check detects lasting changes, not transient concurrent edits.',
        'Sparse-checkout completeness is unresolved; absent worktree contents are not reconstructed.',
        'Effective local and user-global exclusions can change visibility across environments.',
        'Nested repositories and submodules are opaque, unanalyzed boundary artifacts.',
        'Links resolve only through captured paths, with at most 40 redirects; traversal outside the provider is refused.',
        'An existing link target without an exact captured path spelling is not established as a region or artifact.'],
      exclusions: exclusionEvidence.sort((a, b) => compare(a.origin, b.origin) || compare(a.path, b.path)),
      excludedOutputDirectories: outputs, artifacts: artifacts.sort((a, b) => compare(a.path, b.path))
        .map(artifact => artifact.kind === 'symlink' ? { ...artifact, link: resolveLink(artifact.path) } : artifact),
    } };
  }
}
