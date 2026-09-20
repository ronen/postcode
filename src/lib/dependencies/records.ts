import type { EvaluationState, RecordContext, RecordId } from '../records.js';

export type DependencyMechanism = 'static-import' | 'side-effect-import' | 're-export'
  | 'import-type' | 'import-equals' | 'dynamic-import' | 'commonjs';
export type DependencyTargetStatus = 'resolved' | 'unresolved' | 'target-indeterminate' | 'outside-population';

/** Recognition qualification is independent of literal target resolution. */
export interface CommonJSRecognition {
  readonly outcome: 'recognized' | 'alternative-binding' | 'unsupported-format'
    | 'insufficient-lexical-evidence' | 'insufficient-context' | 'insufficient-binding-evidence' | 'conflicting-binding-evidence';
  readonly lexical: 'not-established' | 'local-binding' | 'no-local-binding';
  readonly format: 'not-examined' | 'commonjs-file' | 'esm-file' | 'commonjs-option' | 'preserve-option' | 'unsupported-option' | 'absent';
  readonly binding: 'not-examined' | 'absent' | 'callable-ambient' | 'alternative' | 'conflicting' | 'insufficient';
}

export interface DependencyOccurrenceRecord extends RecordContext {
  readonly kind: 'dependency-occurrence';
  readonly owner: RecordId;
  readonly context: RecordId;
  readonly evidence: RecordId;
  /** Declaration/file evidence actually corresponding to the established target. */
  readonly targetEvidence: readonly RecordId[];
  readonly mechanism: DependencyMechanism;
  readonly typeOnly: boolean;
  readonly targetStatus: DependencyTargetStatus;
  readonly target: RecordId | null;
  readonly commonjs: CommonJSRecognition | null;
}

/** Not a recognized request: never count this as an unresolved literal. */
export interface DependencyCoverageRecord extends RecordContext {
  readonly kind: 'dependency-coverage';
  readonly owner: RecordId | null;
  readonly context: RecordId;
  readonly evidence: RecordId;
  readonly outcome: 'ownership-unestablished' | 'external-owner' | 'outside-commonjs-shape' | CommonJSRecognition['outcome'];
  readonly commonjs: CommonJSRecognition | null;
}

/** A relationship claim, not a new entity or a replacement for its occurrences. */
export interface DependencyRelationshipClaim extends RecordContext {
  readonly kind: 'claim';
  readonly subject: RecordId;
  readonly context: RecordId;
  readonly information: {
    readonly type: 'dependency';
    readonly child: RecordId;
    readonly occurrences: readonly RecordId[];
    readonly mechanisms: readonly DependencyMechanism[];
    readonly typeOnly: boolean;
  };
}

export interface DependencyResult extends EvaluationState {
  readonly projectModules: readonly RecordId[];
  readonly occurrences: readonly RecordId[];
  readonly relationships: readonly RecordId[];
  readonly coverage: readonly RecordId[];
  readonly contexts: readonly RecordId[];
}

export interface DependencyEvaluationRecord extends RecordContext, DependencyResult {
  readonly kind: 'dependency-evaluation';
  readonly moduleEvaluation: RecordId;
}

export type DependencyRecords = DependencyOccurrenceRecord | DependencyCoverageRecord | DependencyEvaluationRecord | DependencyProjectionRecord | DependencyOrganizationEvaluation;

export const dependencyLimitations = [
  'Source requests only: no value-use, emission, loader availability, execution, bundler, or deployment claims.',
  'Only project-owned requests are analyzed; external module interiors are opaque.',
  'CommonJS coverage is bare require with exactly one argument, complete lexical evidence, and affirmative captured context; aliases, properties and other APIs are excluded.',
  'Defined ESM format overrides ambient declarations; preserve requires callable ambient corroboration; absent module options do not infer compiler defaults.',
  'Nonliteral targets are not evaluated; resolved files outside the discovered population do not add modules.',
] as const;

export interface DependencyGraph {
  /** Derived grouping indices are not entity identities or selectable subjects. */
  readonly components: readonly {
    readonly members: readonly RecordId[];
    readonly internalRelationships: readonly RecordId[];
    readonly children: readonly number[];
    readonly cyclic: boolean;
  }[];
  readonly roots: readonly number[];
  readonly rootsEstablished: boolean;
}

export interface DependencyProjectionRecord extends RecordContext {
  readonly kind: 'dependency-projection';
  readonly lens: 'dependency-structure' | 'dependency-children' | 'dependency-parents';
  readonly subject: 'configured-project' | 'selected-modules';
  readonly parameters: { readonly selector: string | null; readonly expectedSnapshot: string | null };
  readonly evaluation: RecordId;
  readonly subjects: readonly RecordId[];
  readonly modules: readonly RecordId[];
  readonly relationships: readonly RecordId[];
  readonly occurrences: readonly RecordId[];
  readonly nonEdgeRequests: readonly RecordId[];
  readonly coverage: readonly RecordId[];
  readonly opaqueSubjects: readonly RecordId[];
  readonly contexts: readonly RecordId[];
  readonly graph: DependencyGraph | null;
  readonly selection: {
    readonly matches: number;
    readonly population: number;
    readonly populationEstablished: boolean;
    readonly referenceStatus: 'current' | 'snapshot-required' | 'snapshot-mismatch';
  };
  readonly expansions: {
    readonly moduleEvaluations: readonly RecordId[];
    readonly moduleClaims: readonly RecordId[];
    readonly organization: RecordId | null;
  };
}

export type DependencyPlacementClassification = 'same-group' | 'into-descendants' | 'outward' | 'varies-by-placement';
export interface DependencyEndpointPlacement {
  readonly basis: 'occurrence' | 'target-declaration' | 'module-placement';
  readonly outcome: 'established' | 'multiple' | 'ambiguous' | 'unplaced' | 'outside-organization' | 'unavailable';
  readonly materialization: 'none' | 'partial' | 'full';
  readonly groups: readonly RecordId[];
  readonly candidates: readonly RecordId[];
  readonly artifacts: readonly RecordId[];
  readonly evidence: readonly RecordId[];
  readonly claims: readonly RecordId[];
  readonly reasons: readonly string[];
}
export interface DependencyOrganizationClaim extends RecordContext {
  readonly kind: 'claim';
  readonly subject: RecordId;
  readonly context: RecordId;
  readonly information: {
    readonly type: 'dependency-organization';
    readonly scheme: 'repository-layout';
    readonly evaluation: RecordId;
    readonly classification: DependencyPlacementClassification | 'varies-by-occurrence' | null;
    readonly occurrences: readonly {
      readonly occurrence: RecordId;
      readonly source: DependencyEndpointPlacement;
      readonly target: DependencyEndpointPlacement;
      readonly status: 'established' | 'partial' | 'unavailable' | 'ambiguous';
      readonly classification: DependencyPlacementClassification | null;
      readonly pairs: readonly {
        readonly source: RecordId;
        readonly target: RecordId;
        readonly classification: 'same-group' | 'into-descendants' | 'outward';
        readonly commonAncestors: readonly RecordId[];
        readonly containment: readonly RecordId[];
      }[];
    }[];
  };
}
export interface DependencyOrganizationEvaluation extends RecordContext, Omit<EvaluationState, 'cost'> {
  readonly kind: 'dependency-organization-evaluation';
  readonly dependencyEvaluation: RecordId;
  readonly organizationEvaluation: RecordId;
  readonly scheme: 'repository-layout';
  readonly claims: readonly RecordId[];
  readonly contexts: readonly RecordId[];
  readonly cost: { readonly measure: 'relationship-count'; readonly value: number };
}
