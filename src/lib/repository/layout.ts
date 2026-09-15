import path from 'node:path';
import { compare } from '../identity.js';
import type { LayoutEvidence, RepositoryEvidence } from './evidence.js';

export const repositoryLayoutMethod = 'postcode/repository-layout@2';

/** Pure preparation of region, placement and containment evidence for group records. */
export function deriveLayout(evidence: RepositoryEvidence): LayoutEvidence {
  const artifacts = [...evidence.artifacts].sort((a, b) => compare(a.path, b.path));
  const regions = new Set<string>();
  const parent = (name: string) => {
    const directory = path.posix.dirname(name);
    return directory === '.' ? '' : directory;
  };
  for (const artifact of artifacts) {
    for (let directory = parent(artifact.path); ; directory = parent(directory)) {
      regions.add(directory);
      if (directory === '') break;
    }
  }
  const paths = [...regions].sort(compare);
  const containment: LayoutEvidence['containment'][number][] = paths.filter(Boolean).map(child => ({
    parent: parent(child), child, basis: 'directory', evidencePath: child,
  }));
  const placements = artifacts.map(artifact => ({ artifactPath: artifact.path,
    groupPath: parent(artifact.path), documentation: !artifact.boundary && /^README(?:\.[\s\S]*)?$/.test(path.posix.basename(artifact.path)),
  }));
  const artifactPaths = new Set(artifacts.map(artifact => artifact.path));
  const links: LayoutEvidence['links'][number][] = [];
  const reaches = (from: string, target: string) => {
    const pending = [from];
    const seen = new Set<string>();
    while (pending.length > 0) {
      const current = pending.pop()!;
      if (current === target) return true;
      if (seen.has(current)) continue;
      seen.add(current);
      containment.filter(edge => edge.parent === current).forEach(edge => pending.push(edge.child));
    }
    return false;
  };
  // Deterministic ordering makes the accepted acyclic subset reproducible.
  for (const artifact of artifacts) {
    const link = artifact.link;
    if (!link) continue;
    const add = (outcome: LayoutEvidence['links'][number]['outcome'], targetRegion: string | null = null) =>
      links.push({ artifactPath: artifact.path, outcome, targetRegion });
    // Capture classifies opaque boundaries while resolving each path segment;
    // preserve that outcome here instead of reclassifying resolved targets.
    if (link.status !== 'resolved') { add(link.status); continue; }
    if (!link.resolved) throw new Error('Resolved link is missing target evidence');
    const target = path.relative(evidence.root, link.resolved).split(path.sep).join('/');
    if (link.targetKind !== 'directory') {
      add(artifactPaths.has(target) ? link.targetKind === 'file' ? 'file-target' : 'artifact-target' : 'outside-population');
    } else if (!regions.has(target)) {
      add('outside-population');
    } else {
      const source = parent(artifact.path);
      if (reaches(target, source)) add('cyclic-containment');
      else if (containment.some(edge => edge.parent === source && edge.child === target)) add('existing-parent', target);
      else {
        containment.push({ parent: source, child: target, basis: 'symlink', evidencePath: artifact.path });
        add('additional-parent', target);
      }
    }
  }
  return { method: repositoryLayoutMethod,
    regions: paths.map(directory => ({ path: directory, name: directory === '' ? null : path.posix.basename(directory) })),
    containment, placements, links };
}
