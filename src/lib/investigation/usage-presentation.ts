import { presentationMethods } from '../interfaces/cli/methods.js';
import { withDiagnosticMeanings } from '../diagnostic-view.js';
import { identityReference, recordId } from '../identity.js';
import { freezeOwned } from '../immutable.js';
import { inlineText } from '../terminal-text.js';
import type { RecordId, SessionId } from '../records.js';
import type { InvestigationUsageReport } from './reporting.js';

/** Usage is view reporting, independent of the retained interpretation projection. */
export function finalizeInvestigationUsage<T extends { readonly id: RecordId;
  readonly projection: { readonly id: RecordId; readonly session: SessionId }; readonly usage: InvestigationUsageReport }>(view: T, usage: InvestigationUsageReport, arrangementKey: RecordId, method: string = presentationMethods.contributionPresentation): T {
  const session = view.projection.session;
  const id = recordId(session, 'investigation-view', [method, identityReference(session, arrangementKey), usage]);
  return freezeOwned(withDiagnosticMeanings({ ...view, id, usage }));
}
export function usageLines(usage: InvestigationUsageReport, label: string): string[] {
  return [`${label} reported usage: ${usage.calls} calls; ${usage.missingCalls} unknown; ${usage.anomalousCalls} anomalous.`,
    ...usage.totals.map(total => `  ${inlineText(total.agent.provider)}/${inlineText(total.agent.model)} (${total.source})${total.agent.configuration.billingRoute ? `; billing route ${inlineText(String(total.agent.configuration.billingRoute))}` : ''}${total.execution ? `; reported model ${inlineText(total.execution.model)}, service tier ${inlineText(total.execution.serviceTier ?? 'unknown')}` : ''}: ${total.categories.map(item => `${inlineText(item.category)} ${item.value ?? 'unknown'} ${inlineText(item.unit)}${item.includedIn ? ` (subset of ${inlineText(item.includedIn)})` : ''}`).join('; ')}`)];
}
