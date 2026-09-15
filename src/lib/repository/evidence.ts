/** Captured provider evidence. Paths are source detail, never conceptual selectors. */
export interface RepositoryArtifact {
  readonly path: string;
  readonly kind: 'file' | 'symlink' | 'submodule' | 'nested-repository' | 'other';
  readonly tracked: boolean;
  readonly link?: {
    readonly target: string;
    readonly resolved: string | null;
    readonly targetKind: 'file' | 'directory' | 'other' | null;
    readonly status: 'resolved' | 'broken' | 'cyclic' | 'outside-repository' | 'excluded-output'
      | 'outside-population' | 'opaque-boundary' | 'resolution-limit' | 'target-not-established';
  };
  readonly boundary?: { readonly basis: 'gitlink' | 'git-marker'; readonly markerKind: 'file' | 'directory' | null };
}

export interface ExclusionEvidence {
  readonly origin: 'repository' | 'local' | 'global';
  readonly path: string;
  /** Only exclusion bytes influence layout; ordinary artifact contents are not captured. */
  readonly contentDigest: string | null;
}

export interface RepositoryEvidence {
  readonly provider: 'repository-layout';
  readonly method: string;
  readonly root: string;
  /** Captured worktree spellings used for apparent source-path association. */
  readonly rootPaths: readonly string[];
  readonly gitVersion: string;
  readonly gitPathPolicy: { readonly ignoreCase: boolean; readonly precomposeUnicode: boolean };
  readonly inputConsistency: 'first-observed';
  readonly sparseCheckout: boolean;
  readonly limitations: readonly string[];
  readonly exclusions: readonly ExclusionEvidence[];
  readonly excludedOutputDirectories: readonly { readonly lexical: string; readonly real: string }[];
  readonly artifacts: readonly RepositoryArtifact[];
}

export type RepositoryCapture =
  | { readonly status: 'available'; readonly evidence: RepositoryEvidence }
  | { readonly status: 'unavailable'; readonly reason: 'not-in-worktree' | 'git-unavailable' | 'capture-failed';
      readonly operation: string; readonly code: string | number | null };

/** Prepared evidence for qualified group records; these paths are not Entity IDs. */
export interface LayoutEvidence {
  readonly method: string;
  readonly regions: readonly { readonly path: string; readonly name: string | null }[];
  readonly containment: readonly { readonly parent: string; readonly child: string;
    readonly basis: 'directory' | 'symlink'; readonly evidencePath: string }[];
  readonly placements: readonly { readonly artifactPath: string; readonly groupPath: string;
    readonly documentation: boolean }[];
  readonly links: readonly { readonly artifactPath: string; readonly targetRegion: string | null;
    readonly outcome: 'file-target' | 'artifact-target' | 'additional-parent' | 'existing-parent' | 'cyclic-containment'
      | 'outside-population' | 'opaque-boundary' | 'broken' | 'cyclic' | 'outside-repository' | 'excluded-output'
      | 'resolution-limit' | 'target-not-established' }[];
}
