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

export type DependencyRecords = DependencyOccurrenceRecord | DependencyCoverageRecord | DependencyEvaluationRecord;

export const dependencyLimitations = [
  'Source requests only: no value-use, emission, loader availability, execution, bundler, or deployment claims.',
  'Only project-owned requests are analyzed; external module interiors are opaque.',
  'CommonJS coverage is bare require with exactly one argument, complete lexical evidence, and affirmative captured context; aliases, properties and other APIs are excluded.',
  'Defined ESM format overrides ambient declarations; preserve requires callable ambient corroboration; absent module options do not infer compiler defaults.',
  'Nonliteral targets are not evaluated; resolved files outside the discovered population do not add modules.',
] as const;
