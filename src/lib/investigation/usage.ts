import { isDeepStrictEqual } from 'node:util';
import { canonical } from '../identity.js';
import { freezeOwned } from '../immutable.js';
import type { RecordId } from '../records.js';
import type { AgentIdentity, CallUsage, ReportedUsage } from './contracts.js';

function usageAnomalies(usage: ReportedUsage): readonly string[] {
  const anomalies = new Set<string>();
  if (!['provider', 'synthetic'].includes(usage.source)) anomalies.add('Unrecognized usage source.');
  if (!usage.categories.length) anomalies.add('No usage categories were reported.');
  if (usage.execution && (typeof usage.execution.model !== 'string' || !usage.execution.model ||
      (usage.execution.serviceTier !== null && (typeof usage.execution.serviceTier !== 'string' || !usage.execution.serviceTier)))) {
    anomalies.add('Invalid provider execution metadata.');
  }
  const key = (unit: string, category: string) => canonical([unit, category]);
  const categories = new Map(usage.categories.map(item => [key(item.unit, item.category), item]));
  if (categories.size !== usage.categories.length) anomalies.add('Duplicate usage categories.');
  for (const item of usage.categories) {
    if (!item.category || !item.unit || !Number.isFinite(item.value) || item.value < 0) anomalies.add('Invalid usage category or amount.');
    const seen = new Set<string>();
    let current = item;
    while (current.includedIn !== null) {
      if (seen.has(current.category)) { anomalies.add('Cyclic usage category relationships.'); break; }
      seen.add(current.category);
      const parent = categories.get(key(current.unit, current.includedIn));
      if (!parent) { anomalies.add('Usage parent category was not reported in the same unit.'); break; }
      if (current.value > parent.value) anomalies.add('Reported usage subset exceeds its parent.');
      current = parent;
    }
  }
  return [...anomalies];
}

/** Owned independently of dialogue/session state so cancellation cannot erase received usage. */
export class InvestigationUsage {
  readonly #calls = new Map<string, CallUsage>();
  start(attempt: RecordId, call: number, agent: AgentIdentity): (usage: ReportedUsage) => void {
    const key = canonical([attempt, call]);
    if (this.#calls.has(key)) throw new Error('Duplicate provider call');
    this.#calls.set(key, freezeOwned(structuredClone({ attempt, call, agent, reported: null, reports: [], anomalies: [] })));
    return usage => {
      const prior = this.#calls.get(key)!;
      if (prior.reports.some(item => isDeepStrictEqual(item.reported, usage))) return;
      const reports = [...prior.reports, { reported: usage, anomalies: usageAnomalies(usage) }];
      const anomalies = [...new Set(reports.flatMap(item => item.anomalies))];
      if (reports.length > 1) anomalies.push('Differing reports for one call; cumulative versus incremental accounting is unresolved.');
      // Preserve every distinct report, but never silently select or add
      // uncertain values. An accounting anomaly cannot fail investigation.
      const reported = anomalies.length ? null : usage;
      this.#calls.set(key, freezeOwned(structuredClone({ ...prior, reported, reports, anomalies })));
    };
  }
  calls(attempt?: RecordId): readonly CallUsage[] {
    return freezeOwned([...this.#calls.values()].filter(item => attempt === undefined || item.attempt === attempt));
  }
}
