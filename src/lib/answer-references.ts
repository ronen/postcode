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
