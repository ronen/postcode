import path from 'node:path';
import type { LayoutEvidence, RepositoryEvidence } from '../repository/evidence.js';
import type { PlacementReason } from './records.js';

/** Resolve directory-link regions without changing the identity of an apparent-path module. */
export function locate(sourcePath: string, evidence: RepositoryEvidence, layout: LayoutEvidence):
  { group: string; artifact: string } | { reason: PlacementReason } {
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
    const direct = layout.placements.find(item => item.artifactPath === relative);
    if (direct) {
      const artifact = evidence.artifacts.find(item => item.path === relative)!;
      if (artifact.boundary) return { reason: 'opaque-boundary' };
      if (artifact.link?.status === 'excluded-output') return { reason: 'link-not-established' };
      return { group: direct.groupPath, artifact: direct.artifactPath };
    }
    if (evidence.artifacts.some(item => item.boundary && relative!.startsWith(`${item.path}/`))) return { reason: 'opaque-boundary' };
    const link = layout.links.filter(item => relative!.startsWith(`${item.artifactPath}/`))
      .sort((a, b) => b.artifactPath.length - a.artifactPath.length)[0];
    if (!link) return { reason: 'not-visible' };
    if (link.targetRegion === null || redirects === 40) return { reason: 'link-not-established' };
    relative = [link.targetRegion, relative.slice(link.artifactPath.length + 1)].filter(Boolean).join('/');
  }
  return { reason: 'link-not-established' };
}
