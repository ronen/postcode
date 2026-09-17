import type { EvaluationState, RecordContext, RecordId } from '../records.js';
import type { LayoutEvidence, RepositoryArtifact, RepositoryCapture } from '../repository/evidence.js';

export const groupStandardExpansions = ['group-details'] as const;
export type GroupExpansion = typeof groupStandardExpansions[number];

export interface RepositoryEvidenceRecord extends RecordContext {
  readonly kind: 'repository-evidence';
  readonly capture: RepositoryCapture;
  readonly layout: LayoutEvidence | null;
}

export interface RegionEvidenceRecord extends RecordContext {
  readonly kind: 'repository-region';
  readonly repository: RecordId;
  readonly path: string;
}

export interface ArtifactEvidenceRecord extends RecordContext {
  readonly kind: 'repository-artifact';
  readonly repository: RecordId;
  readonly artifact: RepositoryArtifact;
}

export interface GroupRecord extends RecordContext {
  readonly kind: 'group';
  readonly claim: RecordId;
}

interface OrganizationClaim extends RecordContext {
  readonly kind: 'claim';
  readonly subject: RecordId;
  readonly context: RecordId;
}

export interface GroupClaim extends OrganizationClaim {
  readonly information: { readonly type: 'group'; readonly name: string | null };
}

export interface ContainmentClaim extends OrganizationClaim {
  readonly information: { readonly type: 'group-containment'; readonly child: RecordId };
}

export interface ArtifactPlacementClaim extends OrganizationClaim {
  readonly information: { readonly type: 'artifact-placement'; readonly artifact: RecordId };
}

export interface GroupDocumentationClaim extends OrganizationClaim {
  readonly information: { readonly type: 'group-documentation'; readonly artifact: RecordId };
}

export type PlacementReason = 'external-module' | 'repository-unavailable' | 'source-unavailable'
  | 'outside-repository' | 'not-visible' | 'opaque-boundary' | 'link-not-established';

export interface ModulePlacementClaim extends OrganizationClaim {
  readonly information: {
    readonly type: 'module-placement';
    readonly outcome: 'established' | 'multiple' | 'ambiguous' | 'unplaced' | 'outside-organization' | 'unavailable';
    readonly groups: readonly RecordId[];
    /** Candidate relationships are distinct from independently established placements. */
    readonly candidates: readonly RecordId[];
    readonly artifacts: readonly RecordId[];
    readonly reasons: readonly PlacementReason[];
    readonly materialization: 'none' | 'partial' | 'full';
  };
}

export interface GroupPropertiesClaim extends OrganizationClaim {
  readonly information: {
    readonly type: 'group-properties';
    readonly documented: boolean;
    readonly modulePresence: 'direct' | 'descendant-only' | 'none' | null;
    readonly evaluation: RecordId;
  };
}

export interface OrganizationEvaluationRecord extends RecordContext, Omit<EvaluationState, 'cost'> {
  readonly kind: 'organization-evaluation';
  readonly repository: RecordId;
  readonly moduleEvaluation: RecordId;
  readonly groups: readonly RecordId[];
  readonly claims: readonly RecordId[];
  readonly contexts: readonly RecordId[];
  readonly requested: readonly GroupExpansion[];
  /** Placement/property coverage can differ from the complete repository layout. */
  readonly placement: EvaluationState;
  readonly cost: { readonly measure: 'group-count'; readonly value: number };
}

export interface OrganizationProjectionRecord extends RecordContext {
  readonly kind: 'organization-projection';
  readonly lens: 'organization' | 'inspect';
  readonly subject: 'repository' | 'configured-project' | 'selected-entities';
  readonly parameters: { readonly selector: string | null; readonly expectedSnapshot: string | null };
  readonly evaluation: RecordId;
  readonly moduleProjection: RecordId | null;
  readonly groups: readonly RecordId[];
  readonly modules: readonly RecordId[];
  readonly claims: readonly RecordId[];
  readonly contexts: readonly RecordId[];
  readonly expansions: { readonly requested: readonly GroupExpansion[];
    readonly groups: readonly RecordId[]; readonly modules: readonly RecordId[]; readonly claims: readonly RecordId[];
    readonly moduleClaims: readonly RecordId[]; readonly moduleEvaluations: readonly RecordId[] };
  readonly selection: {
    readonly matches: number;
    readonly population: number;
    readonly populationEstablished: boolean;
    readonly materialization: 'none' | 'partial' | 'full';
    readonly referenceStatus: 'current' | 'snapshot-required' | 'snapshot-mismatch';
  };
}

export type OrganizationClaims = GroupClaim | ContainmentClaim | ArtifactPlacementClaim
  | GroupDocumentationClaim | ModulePlacementClaim | GroupPropertiesClaim;
export type OrganizationRecords = RepositoryEvidenceRecord | RegionEvidenceRecord | ArtifactEvidenceRecord
  | GroupRecord | OrganizationEvaluationRecord | OrganizationProjectionRecord;
