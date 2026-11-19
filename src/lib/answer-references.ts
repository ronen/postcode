import type { ProgramRecord } from './records.js';

export type RetainedAnswer = Extract<ProgramRecord, { kind: 'projection' | 'organization-projection' | 'dependency-projection' | 'module-exports-projection' | 'contribution-projection' | 'contribution-inspection-projection' }>;
export function isAnswer(record: ProgramRecord): record is RetainedAnswer {
  return ['projection', 'organization-projection', 'dependency-projection', 'module-exports-projection', 'contribution-projection', 'contribution-inspection-projection'].includes(record.kind);
}
/** Classification provides guidance, never proof of retention or a prefix lookup. */
export function isAnswerReference(value: string): boolean {
  return /^@?answer-[a-f0-9]{8,64}$/.test(value)
    || /^@?session:[^:]+:(projection|organization-projection|dependency-projection|module-exports-projection|contribution-projection|contribution-inspection-projection):[a-f0-9]{64}$/.test(value);
}
