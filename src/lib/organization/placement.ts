import path from 'node:path';
import type { LayoutEvidence, RepositoryEvidence } from '../repository/evidence.js';
import type { PlacementReason } from './records.js';

function placementIndex(evidence: RepositoryEvidence, layout: LayoutEvidence) {
  return {
    placements: new Map(layout.placements.map(item => [item.artifactPath, item])),
    artifacts: new Map(evidence.artifacts.map(item => [item.path, item])),
    boundaries: new Set(evidence.artifacts.filter(item => item.boundary).map(item => item.path)),
    links: new Map(layout.links.map(item => [item.artifactPath, item])),
  };
}
// Captures and their prepared layouts are immutable; weak keys bound index lifetime.
const indexes = new WeakMap<RepositoryEvidence, WeakMap<LayoutEvidence, ReturnType<typeof placementIndex>>>();

/** Resolve directory-link regions without changing the identity of an apparent-path module. */
export function locate(sourcePath: string, evidence: RepositoryEvidence, layout: LayoutEvidence):
  { group: string; artifact: string } | { reason: PlacementReason } {
  let layouts = indexes.get(evidence);
  if (!layouts) { layouts = new WeakMap(); indexes.set(evidence, layouts); }
  let index = layouts.get(layout);
  if (!index) { index = placementIndex(evidence, layout); layouts.set(layout, index); }
  const source = path.resolve(sourcePath);
  let relative: string | undefined;
  for (const root of evidence.rootPaths) {
    const candidate = path.relative(root, source);
    if (candidate !== '..' && !candidate.startsWith(`..${path.sep}`) && !path.isAbsolute(candidate)) {
      relative = candidate.split(path.sep).join('/');
      break;
    }
  }
  if (relative === undefined) return { reason: 'outside-repository' };
  const seen = new Set<string>();
  // Inspect the destination after the last permitted redirect as well.
  for (let redirects = 0; redirects <= 40; redirects++) {
    if (seen.has(relative)) return { reason: 'link-not-established' };
    seen.add(relative);
    const direct = index.placements.get(relative);
    if (direct) {
      const artifact = index.artifacts.get(relative)!;
      if (artifact.boundary) return { reason: 'opaque-boundary' };
      if (artifact.link?.status === 'excluded-output') return { reason: 'link-not-established' };
      return { group: direct.groupPath, artifact: direct.artifactPath };
    }
    const ancestors: string[] = [];
    for (let end = relative.lastIndexOf('/'); end >= 0; end = relative.lastIndexOf('/', end - 1)) {
      ancestors.push(relative.slice(0, end));
      if (end === 0) break;
    }
    if (ancestors.some(name => index.boundaries.has(name))) return { reason: 'opaque-boundary' };
    const link = ancestors.map(name => index.links.get(name)).find(item => item !== undefined);
    if (!link) return { reason: 'not-visible' };
    if (link.targetRegion === null || redirects === 40) return { reason: 'link-not-established' };
    relative = [link.targetRegion, relative.slice(link.artifactPath.length + 1)].filter(Boolean).join('/');
  }
  return { reason: 'link-not-established' };
}
