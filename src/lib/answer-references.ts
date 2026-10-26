import type { ProgramRecord } from './records.js';

export type RetainedAnswer = Extract<ProgramRecord, { kind: 'projection' | 'organization-projection' | 'dependency-projection' | 'investigation-selection-projection' | 'module-exports-projection' }>;
export function isAnswer(record: ProgramRecord): record is RetainedAnswer {
  return ['projection', 'organization-projection', 'dependency-projection', 'investigation-selection-projection', 'module-exports-projection'].includes(record.kind);
}
/** Classification provides guidance, never proof of retention or a prefix lookup. */
export function isAnswerReference(value: string): boolean {
  return /^@?answer-[a-f0-9]{8,64}$/.test(value)
    || /^@?session:[^:]+:(projection|organization-projection|dependency-projection|investigation-selection-projection|module-exports-projection):[a-f0-9]{64}$/.test(value);
}
export const answerSubjectGuidance = 'An answer reference is not a Lens subject. Use present with that answer in the active shell Session that retains it. References expire with their Session; to begin new work, open postcode shell and request the information there.';
