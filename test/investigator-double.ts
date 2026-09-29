import assert from 'node:assert/strict';
import type { AgentInput, AgentReply, InvestigatorAgent, ReportedUsage } from '../src/lib/investigation/contracts.js';

export type ScriptedExchange = (input: AgentInput, signal: AbortSignal, usage: (value: ReportedUsage) => void) => AgentReply | Promise<AgentReply>;

/** Reusable communication-boundary double: real coordination, acquisition and acceptance remain active. */
export class ScriptedInvestigator implements InvestigatorAgent {
  readonly identity = { provider: 'postcode-test', model: 'scripted', configuration: {}, origin: 'scripted' as const };
  readonly inputs: AgentInput[][] = [];
  closes = 0;
  constructor(readonly script: readonly ScriptedExchange[]) {}
  open() {
    const inputs: AgentInput[] = [];
    this.inputs.push(inputs);
    let position = 0, closed = false;
    return {
      exchange: async (input: AgentInput, signal: AbortSignal, usage: (value: ReportedUsage) => void) => {
        assert.equal(closed, false);
        inputs.push(input);
        const step = this.script[position++];
        assert.ok(step, 'Unexpected investigator exchange');
        return step(input, signal, usage);
      },
      close: () => { assert.equal(closed, false); closed = true; this.closes++; },
    };
  }
}

export const syntheticUsage: ReportedUsage = { source: 'synthetic', categories: [
  { category: 'input', unit: 'tokens', value: 20, includedIn: null },
  { category: 'cached-input', unit: 'tokens', value: 5, includedIn: 'input' },
  { category: 'output', unit: 'tokens', value: 10, includedIn: null },
  { category: 'reasoning', unit: 'tokens', value: 4, includedIn: 'output' },
] };
