/** Logical records; no compiler objects or storage-native identifiers cross this boundary. */
export type RecordId = string & { readonly recordId: unique symbol };
export type SnapshotId = RecordId & { readonly snapshotId: unique symbol };

export interface RecordContext {
  readonly id: RecordId;
  readonly snapshot: SnapshotId;
  readonly method: string;
}

export interface SnapshotRecord extends RecordContext {
  readonly kind: 'snapshot';
  readonly inputDigest: string;
  readonly methods: readonly string[];
}

export interface ModuleRecord extends RecordContext {
  readonly kind: 'module';
  readonly claim: RecordId;
}

export type ModuleFacet = 'ambient' | 'declaration-only' | 'implementation-available'
  | 'project' | 'external';

export interface ModuleClaim extends RecordContext {
  readonly kind: 'claim';
  readonly subject: RecordId;
  readonly context: RecordId;
  readonly information: {
    readonly type: 'module';
    /** File-derived compiler symbol names are source provenance, not conceptual names. */
    readonly name: string | null;
    readonly handle: string;
    readonly handleStatus: 'generated-navigation-aid';
    readonly facets: readonly ModuleFacet[];
  };
}

export interface SourceEvidenceRecord extends RecordContext {
  readonly kind: 'source-evidence';
  readonly path: string;
  readonly contentDigest: string;
  readonly start: number;
  readonly length: number;
  readonly configuredRoot: boolean;
  readonly compilerName: string | null;
}

export interface ClaimContextRecord extends RecordContext {
  readonly kind: 'claim-context';
  readonly scope: 'configured-project' | RecordId;
  readonly evidence: readonly RecordId[];
  readonly status: 'mechanically-derived';
  readonly guarantee: string;
  readonly limitations: readonly string[];
  /** Codes are conceptual qualification; compiler messages/locations remain source detail. */
  readonly diagnostics: readonly { readonly code: number; readonly category: string }[];
}

export interface EvaluationState {
  readonly applicability: 'applicable' | 'inapplicable';
  readonly availability: 'available' | 'unavailable';
  readonly execution: 'deferred' | 'running' | 'stopped' | 'failed' | 'completed';
  readonly materialization: 'none' | 'partial' | 'full';
  readonly reason: string | null;
  readonly cost: { readonly measure: 'module-count'; readonly value: number };
}

export interface EvaluationRecord extends RecordContext, EvaluationState {
  readonly kind: 'evaluation';
  readonly requirement: 'modules';
  readonly attempt: number;
  readonly modules: readonly RecordId[];
  readonly contexts: readonly RecordId[];
}

export interface ProjectionRecord extends RecordContext {
  readonly kind: 'projection';
  readonly lens: 'modules' | 'inspect';
  readonly subject: 'configured-project' | 'selected-modules';
  readonly parameters: { readonly selector: string | null };
  readonly modules: readonly RecordId[];
  readonly claims: readonly RecordId[];
  readonly contexts: readonly RecordId[];
  readonly evaluations: readonly RecordId[];
  readonly selection: {
    readonly matches: number;
    readonly population: number;
    readonly populationEstablished: boolean;
    readonly subset: boolean;
  };
}

export type ProgramRecord = SnapshotRecord | ModuleRecord | ModuleClaim
  | SourceEvidenceRecord | ClaimContextRecord | EvaluationRecord | ProjectionRecord;

/** Only the domain operations currently used by discovery and lenses. */
export interface ProgramRecordStore {
  put(records: readonly ProgramRecord[]): void;
  get(id: RecordId): ProgramRecord;
  evaluations(snapshot: SnapshotId): readonly EvaluationRecord[];
}
