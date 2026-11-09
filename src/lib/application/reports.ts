import type { RecordId } from '../records.js';
import type { LookupSupport, SubjectResolution } from '../subject-resolution.js';

export interface ResolutionInformation {
  readonly reason: 'unknown-answer' | 'foreign-answer' | 'unsupported-answer' | 'presentation-unavailable' | 'invalid-parameters' | 'invalid-designation' | 'invalid-report-inputs' | 'invalid-request' | Exclude<SubjectResolution['status'], 'resolved'>;
  readonly explanation: string;
  readonly guidance?: string;
  readonly candidates: readonly { readonly id: RecordId; readonly kind: 'module' | 'group' | 'investigram'; readonly reference: string }[];
  readonly criteria: readonly string[];
  readonly qualifications: readonly string[];
  readonly prerequisites: readonly RecordId[];
  readonly retainedAnswers: readonly { readonly id: RecordId; readonly reference: string }[];
  readonly support?: readonly LookupSupport[];
  readonly representationLimits?: readonly string[];
}
