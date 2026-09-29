import { canonical } from '../identity.js';
import { freezeOwned } from '../immutable.js';
import type { RecordId } from '../records.js';
import type { AgentIdentity, CallUsage, ReportedUsage } from './contracts.js';

/** Owned independently of dialogue/session state so cancellation cannot erase received usage. */
export class InvestigationUsage {
  readonly #calls = new Map<string, CallUsage>();
  start(attempt: RecordId, call: number, agent: AgentIdentity): (usage: ReportedUsage) => void {
    const key = canonical([attempt, call]);
    if (this.#calls.has(key)) throw new Error('Duplicate provider call');
    this.#calls.set(key, freezeOwned(structuredClone({ attempt, call, agent, reported: null })));
    return usage => {
      if (!['provider', 'synthetic'].includes(usage.source) || usage.categories.some(item => !item.category || !item.unit
        || !Number.isFinite(item.value) || item.value < 0 || item.includedIn === item.category)) throw new Error('Invalid provider usage');
      const keys = new Set(usage.categories.map(item => `${item.unit}:${item.category}`));
      if (keys.size !== usage.categories.length || usage.categories.some(item => item.includedIn !== null && !keys.has(`${item.unit}:${item.includedIn}`))) {
        throw new Error('Invalid usage category relationships');
      }
      for (const item of usage.categories) {
        const seen = new Set<string>();
        let current = item;
        while (current.includedIn !== null) {
          if (seen.has(current.category)) throw new Error('Cyclic usage categories');
          seen.add(current.category);
          const parent = usage.categories.find(other => other.unit === current.unit && other.category === current.includedIn)!;
          if (current.value > parent.value) throw new Error('Usage subset exceeds parent');
          current = parent;
        }
      }
      const prior = this.#calls.get(key)!;
      if (prior.reported && canonical(prior.reported) !== canonical(usage)) throw new Error('Conflicting provider usage');
      this.#calls.set(key, freezeOwned(structuredClone({ ...prior, reported: usage })));
    };
  }
  calls(attempt?: RecordId): readonly CallUsage[] {
    return freezeOwned([...this.#calls.values()].filter(item => attempt === undefined || item.attempt === attempt));
  }
}
