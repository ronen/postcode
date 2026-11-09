import type { WorkReport } from '../../work-attribution.js';
import type { SubjectResolution } from '../../subject-resolution.js';
import type { RequestContext, ResolutionReport, UsageReport } from './report-contracts.js';
import { inlineText } from '../../terminal-text.js';
import { sourceDisclosure, diagnosticLocations } from '../../source-disclosure.js';
import type { InvestigationUsageReport } from '../../investigation/reporting.js';
import type { InvestigationView } from '../../investigation/presentation.js';
import type { QualifiedDependencyView } from '../../dependencies/presentation.js';
import { randomUUID } from 'node:crypto';
import type { QualifiedView } from '../../presentation.js';
import type { QualifiedOrganizationView } from '../../organization/presentation.js';
import type { ModuleExportsView } from '../../exports/presentation.js';

import { deliverObservation } from '../../application/observations.js';
import type { ObservationBatch, ObservationSink } from '../../application/observations.js';

/** No UUID registry, historical reads, producer retention policy, or operational-store dependency. */
export function observationBatch(view: QualifiedView | QualifiedOrganizationView | QualifiedDependencyView | InvestigationView | ModuleExportsView, rendered: string, context: {
  readonly configPath: string; readonly repositoryRoot: string | null; readonly methods: readonly string[];
}, requestValue: RequestContext, command = 1, resolution?: SubjectResolution): ObservationBatch {
  if (!Number.isSafeInteger(command) || command < 1) throw new Error('Invalid command order');
  const request = randomUUID();
  const analysis = randomUUID();
  const artifact = randomUUID();
  const output = randomUUID();
  const references = { request, analysis, view: artifact, rendered: output };
  const disclosed = rendered.length ? sourceDisclosure(view, rendered) : null;
  const limits = representedLimits(view).filter(limit => view.presentation.format === 'json' || rendered.replace(/^[\s│├└─]*/gm, '').replace(/\s+/g, ' ').includes(limit.replace(/\s+/g, ' ')));
  const limitId = randomUUID();
  return { formatVersion: 4, id: randomUUID(), session: view.projection.session, command, records: [
    { id: request, kind: 'request', value: requestValue },
    { id: analysis, kind: 'analysis-context', value: { ...context, session: view.projection.session } },
    { id: artifact, kind: 'qualified-view', value: view },
    { id: output, kind: 'rendered-output', value: rendered },
    ...(limits.length ? [{ id: limitId, kind: 'representation-limit' as const, value: { limits, view: artifact } }] : []),
    ...(resolution ? [{ id: randomUUID(), kind: 'resolution-information' as const, value: resolution }] : []),
  ], events: [
    { id: randomUUID(), type: 'view-produced', ...references },
    ...(limits.length ? [{ id: randomUUID(), type: 'representation-limited' as const, ...references }] : []),
    ...(view.presentation.moreDetails ? [{ id: randomUUID(), type: 'additional-detail-requested' as const, ...references }] : []),
    ...(disclosed?.forms.includes('excerpts') ? [{ id: randomUUID(), type: 'source-displayed' as const, ...references, sourceLevel: disclosed.level, sourceForms: disclosed.forms }] : []),
    ...(disclosed ? [{ id: randomUUID(), type: 'attribution-disclosed' as const, ...references, sourceLevel: disclosed.level, sourceForms: disclosed.forms }] : []),
  ] };
}

/** Non-View reports disclose only their actually rendered diagnostic provenance; no View is fabricated. */
export function commandObservation(session: string, command: number, requestValue: unknown,
  status: 'completed' | 'refused' | 'invalidated' | 'failed' | 'defect' | 'interrupted',
  stdout: string, stderr: string, produced?: ObservationBatch, usage?: InvestigationUsageReport, report?: { readonly kind: 'resolution-result' | 'usage-report'; readonly value: unknown }, requestContext?: RequestContext, work?: WorkReport): ObservationBatch {
  if (!Number.isSafeInteger(command) || command < 1) throw new Error('Invalid command order');
  const request = produced?.records.find(item => item.kind === 'request')?.id ?? randomUUID();
  const analysis = produced?.records.find(item => item.kind === 'analysis-context')?.id ?? randomUUID();
  const rendered = produced?.records.find(item => item.kind === 'rendered-output')?.id ?? randomUUID();
  const records: ObservationBatch['records'][number][] = produced ? [...produced.records] : [
    { id: request, kind: 'request', value: requestContext ?? requestValue },
    { id: analysis, kind: 'analysis-context', value: { session } },
    { id: rendered, kind: 'rendered-output', value: stdout },
  ];
  if (work) records.push({ id: randomUUID(), kind: 'request-work', value: work });
  if (report) records.push({ id: randomUUID(), ...report });
  if (usage?.attempts.length) records.push({ id: randomUUID(), kind: 'investigation-usage', value: usage });
  records.push({ id: randomUUID(), kind: 'command-outcome', value: { status, request: requestValue, stderr } });
  const limits = !produced && report ? representedLimits(report.value).filter(limit =>
    stdout.includes(limit) || stdout.includes(JSON.stringify(limit))) : [];
  if (limits.length) records.push({ id: randomUUID(), kind: 'representation-limit', value: { limits } });
  const type = status === 'invalidated' ? 'session-invalidated' : `command-${status}` as const;
  return { formatVersion: 4, id: produced?.id ?? randomUUID(), session, command, records,
    events: [...(produced?.events ?? []),
      ...(limits.length ? [{ id: randomUUID(), type: 'representation-limited' as const, request, analysis, rendered }] : []),
      ...(!produced && report && diagnosticLocations(report.value).some(location => stdout.includes(inlineText(location)) || stdout.includes(JSON.stringify(location)))
        ? [{ id: randomUUID(), type: 'attribution-disclosed' as const, request, analysis, rendered, sourceLevel: 'diagnostic-locations' as const, sourceForms: ['locations' as const] }] : []),
      { id: randomUUID(), type, request, analysis, rendered }] };
}

/** Only owned presentation disclosures are recognized; request and attribution data are not limits. */
function representedLimits(value: unknown): string[] {
  if (!value || typeof value !== 'object') return [];
  const artifact = value as QualifiedView | QualifiedOrganizationView | QualifiedDependencyView | InvestigationView
    | ModuleExportsView | ResolutionReport | UsageReport;
  let limits: readonly string[];
  switch (artifact.schema) {
    case 'postcode-view/1-experimental':
      limits = artifact.modules.flatMap(module => [...module.documentation, ...module.exports.flatMap(item => item.documentation)])
        .flatMap(doc => doc.representationLimits); break;
    case 'postcode-module-exports-view/1-experimental':
      limits = artifact.exports.flatMap(item => item.documentation.flatMap(doc => doc.representationLimits)); break;
    case 'postcode-organization-view/1-experimental':
      limits = representedLimits(artifact.moduleDetail); break;
    case 'postcode-investigation-view/1-experimental':
      limits = artifact.support.flatMap(item => item.assertion?.representationLimits ?? []); break;
    case 'postcode-resolution/1-experimental':
      limits = artifact.resolution.representationLimits ?? []; break;
    default: limits = [];
  }
  return [...new Set(limits)];
}

export async function submitObservation(sink: ObservationSink, batch: ObservationBatch, output: { stdout(text: string): void; stderr(text: string): void }) {
  const acknowledgement = await deliverObservation(sink, batch);
  if (acknowledgement.accepted && 'cleanupWarning' in acknowledgement && typeof acknowledgement.cleanupWarning === 'string') {
    output.stderr(`WARNING: ${inlineText(acknowledgement.cleanupWarning)}\n`);
  }
  if (!acknowledgement.accepted) output.stderr(`WARNING: observation not recorded: ${inlineText(acknowledgement.reason)}\n`);
}

