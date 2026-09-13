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
  readonly analysis?: {
    readonly provider: 'typescript';
    readonly coverage: 'external-source-files-and-visible-named-ambient-modules';
    readonly inputConsistency: 'first-observed';
    /** Distinct output-location boundaries enforced by this run's input filter, not a count of files found. */
    readonly excludedOutputLocations: number;
  };
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
    readonly handleProvenance: 'language-name' | 'source-basename' | 'declared-export' | 'anonymous-fallback';
    readonly facets: readonly ModuleFacet[];
  };
}

export type ModuleExpansion = 'exports' | 'documentation';
/** Entity-kind policy, independent of the lens used to select modules. */
export const moduleStandardExpansions: readonly ModuleExpansion[] = ['exports', 'documentation'];

export interface SymbolRecord extends RecordContext {
  readonly kind: 'symbol';
  readonly claim: RecordId;
}

export interface SymbolClaim extends RecordContext {
  readonly kind: 'claim';
  readonly subject: RecordId;
  readonly context: RecordId;
  readonly information: {
    readonly type: 'symbol';
    readonly name: string | null;
    readonly roles: { readonly type: boolean; readonly value: boolean };
    readonly declarationCount: number;
  };
}

export interface ExportClaim extends RecordContext {
  readonly kind: 'claim';
  readonly subject: RecordId;
  readonly context: RecordId;
  readonly information: {
    readonly type: 'export';
    readonly exportedName: string;
    readonly symbol: RecordId | null;
    readonly origin: RecordId | null;
    readonly roles: { readonly type: boolean; readonly value: boolean } | null;
    readonly routes: readonly {
      readonly kind: 'direct' | 'alias' | 'reexport' | 'wildcard' | 'default' | 'export-assignment';
      readonly typeOnly: boolean;
      readonly aliased: boolean;
      readonly via: RecordId | null;
    }[];
  };
}

export interface RecordedAssertion extends RecordContext {
  readonly kind: 'recorded-assertion';
  readonly context: RecordId;
  readonly status: 'recorded-assertion';
  readonly text: string;
  readonly tags: readonly { readonly name: string; readonly text: string }[];
}

export interface DocumentationAssociationClaim extends RecordContext {
  readonly kind: 'claim';
  readonly subject: RecordId;
  readonly context: RecordId;
  readonly information: {
    readonly type: 'documentation-association';
    readonly assertion: RecordId;
    readonly association: 'module' | 'origin-symbol' | 'export-alias';
  };
}

export type Claim = ModuleClaim | SymbolClaim | ExportClaim | DocumentationAssociationClaim;
export function isModuleClaim(record: ProgramRecord): record is ModuleClaim {
  return record.kind === 'claim' && record.information.type === 'module';
}

export interface SourceEvidenceRecord extends RecordContext {
  readonly kind: 'source-evidence';
  readonly path: string;
  readonly contentDigest: string;
  readonly start: number;
  readonly length: number;
  readonly configuredRoot: boolean;
  readonly compilerName: string | null;
  readonly resolution?: {
    readonly writtenSpecifier: string;
    readonly target: RecordId | null;
    readonly status: 'established' | 'not-established';
  };
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
  readonly requirement: 'modules' | ModuleExpansion;
  readonly basis?: RecordId;
  readonly claims?: readonly RecordId[];
  readonly attempt: number;
  readonly modules: readonly RecordId[];
  readonly contexts: readonly RecordId[];
}

export interface ProjectionRecord extends RecordContext {
  readonly kind: 'projection';
  readonly lens: 'modules' | 'inspect';
  readonly subject: 'configured-project' | 'selected-modules';
  readonly parameters: { readonly selector: string | null; readonly expectedSnapshot: string | null };
  readonly modules: readonly RecordId[];
  readonly claims: readonly RecordId[];
  readonly contexts: readonly RecordId[];
  readonly evaluations: readonly RecordId[];
  readonly expansions: { readonly requested: readonly ModuleExpansion[]; readonly claims: readonly RecordId[] };
  readonly selection: {
    readonly matches: number;
    readonly population: number;
    readonly populationEstablished: boolean;
    readonly subset: boolean;
    readonly referenceStatus: 'current' | 'snapshot-required' | 'snapshot-mismatch';
  };
}

export type ProgramRecord = SnapshotRecord | ModuleRecord | SymbolRecord | Claim | RecordedAssertion
  | SourceEvidenceRecord | ClaimContextRecord | EvaluationRecord | ProjectionRecord;

/** Only the domain operations currently used by discovery and lenses. */
export interface ProgramRecordStore {
  put(records: readonly ProgramRecord[]): void;
  get(id: RecordId): ProgramRecord;
  evaluations(snapshot: SnapshotId): readonly EvaluationRecord[];
}
