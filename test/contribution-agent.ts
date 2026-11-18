import assert from 'node:assert/strict';
import type { DialogAgent, DialogInput, DialogReply } from '../src/lib/contributions/dialog.js';
import type { ReportedUsage } from '../src/lib/investigation/contracts.js';
import type { EntityId, SubmittedContribution, SubmittedInvestigram } from '../src/lib/contributions/model.js';
import type { RecordId } from '../src/lib/records.js';
export type ContributionExchange = (input: DialogInput, signal: AbortSignal, usage: (value: ReportedUsage) => void) => DialogReply | Promise<DialogReply>;
/** Only the communication participant is replaced. Each execution starts the supplied script afresh. */
export class ScriptedContributionAgent implements DialogAgent {
  readonly identity = { provider: 'postcode-test', model: 'scripted', configuration: {}, origin: 'scripted' as const };
  readonly inputs: DialogInput[][] = [];
  closes = 0;
  constructor(readonly script: readonly ContributionExchange[]) {}
  open() {
    const inputs: DialogInput[] = []; this.inputs.push(inputs);
    let position = 0, closed = false;
    return {
      exchange: async (input: DialogInput, signal: AbortSignal, usage: (value: ReportedUsage) => void) => {
        assert.equal(closed, false); inputs.push(input);
        const step = this.script[position++]; assert.ok(step, 'Unexpected contribution exchange');
        return step(input, signal, usage);
      },
      close: () => { assert.equal(closed, false); closed = true; this.closes++; },
    };
  }
}
export const caveat = { limitations: ['Controlled interpretation; not mechanically established.'] };
export function moduleRecord(input: DialogInput): RecordId {
  const value = input.request.subjects[0] as { moduleRecord?: RecordId };
  assert.ok(value.moduleRecord, 'Expected a discovered module subject'); return value.moduleRecord;
}
export function entitySubject(input: DialogInput): EntityId {
  const value = input.request.subjects[0] as { subject: { entity?: EntityId } };
  assert.ok(value.subject.entity); return value.subject.entity;
}
/** A flat explicitly designated prose answer; optional Entity association is a distinct qualified use. */
export function proseContribution(input: DialogInput, text = 'Controlled finding.', options: { key?: string; evidence?: readonly RecordId[]; associate?: EntityId } = {}): SubmittedContribution {
  const key = options.key ?? 'answer';
  const member = { kind: 'item' as const, item: { investigram: { local: key }, item: 'prose' } };
  const owner: SubmittedInvestigram = { key, qualification: caveat,
    items: [{ key: 'prose', type: 'prose', body: { text }, evidence: options.evidence ?? [] }],
    declarations: [{ key: 'answer', operation: 'add', target: { kind: 'result', result: input.request.result }, members: [member] },
      ...(options.associate ? [{ key: 'about', operation: 'add' as const, target: { kind: 'entity' as const, entity: options.associate, role: 'topic' as const, topic: 'functionality' }, members: [member] }] : [])] };
  return { investigrams: [owner] };
}
