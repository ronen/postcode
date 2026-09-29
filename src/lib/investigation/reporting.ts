import { canonical } from '../identity.js';
import { freezeOwned } from '../immutable.js';
import type { AgentIdentity, AttemptReport, CallUsage, ReportedUsage, UsageCategory } from './contracts.js';

/** Sum each actual call once; subsets remain distinct categories, never a grand total. */
export function usageSummary(attempts: readonly AttemptReport[]) {
  const calls = new Map<string, CallUsage>();
  for (const attempt of attempts) for (const call of attempt.usage) calls.set(canonical([call.attempt, call.call]), call);
  const totals = new Map<string, { agent: AgentIdentity; source: 'provider' | 'synthetic'; execution?: ReportedUsage['execution']; categories: (Omit<UsageCategory, 'value'> & { value: number | null })[] }>();
  let missingCalls = 0, anomalousCalls = 0;
  const nonFiniteReports: { attempt: string; call: number; report: number; category: number; value: string }[] = [];
  for (const call of calls.values()) call.reports.forEach((report, reportIndex) => report.reported.categories.forEach((item, category) => {
    if (!Number.isFinite(item.value)) nonFiniteReports.push({ attempt: call.attempt, call: call.call, report: reportIndex, category, value: String(item.value) });
  }));
  const limitations = new Set(['Reported usage is not confirmed billed usage. Synthetic usage is test data, separate from provider usage. Categories with includedIn are subsets, not additional usage.']);
  for (const call of calls.values()) {
    if (!call.reported) { if (call.anomalies.length) anomalousCalls++; else missingCalls++; continue; }
    const key = canonical([call.agent, call.reported.source, call.reported.execution ?? null]);
    const group = totals.get(key) ?? { agent: call.agent, source: call.reported.source, ...(call.reported.execution ? { execution: call.reported.execution } : {}), categories: [] };
    for (const item of call.reported.categories) {
      const index = group.categories.findIndex(prior => prior.unit === item.unit && prior.category === item.category && prior.includedIn === item.includedIn);
      if (index < 0) group.categories.push({ ...item });
      else {
        const prior = group.categories[index]!.value;
        const sum = prior === null ? Infinity : prior + item.value;
        if (!Number.isFinite(sum)) limitations.add('An aggregate exceeds finite numeric range; its value is unknown. Raw call reports remain available.');
        group.categories[index] = { ...item, value: Number.isFinite(sum) ? sum : null };
      }
    }
    totals.set(key, group);
  }
  return freezeOwned({ attempts: [...attempts], calls: calls.size, missingCalls, anomalousCalls, nonFiniteReports, totals: [...totals.values()], limitations: [...limitations] });
}
export type InvestigationUsageReport = ReturnType<typeof usageSummary>;
