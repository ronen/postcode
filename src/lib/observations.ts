import type { WorkReport } from './work-attribution.js';
import type { SubjectResolution } from './subject-resolution.js';
import type { RequestContext, ResolutionReport, UsageReport } from './request-reporting.js';
import { inlineText } from './terminal-text.js';
import { sourceDisclosure, diagnosticLocations } from './source-disclosure.js';
import type { SourceDisclosureLevel, SourceDisclosureForm } from './source-disclosure.js';
import type { InvestigationUsageReport } from './investigation/reporting.js';
import type { InvestigationView } from './investigation/presentation.js';
import type { QualifiedDependencyView } from './dependencies/presentation.js';
import { randomUUID, createHash } from 'node:crypto';
import { mkdir, open, link, unlink } from 'node:fs/promises';
import path from 'node:path';
import type { QualifiedView } from './presentation.js';
import type { QualifiedOrganizationView } from './organization/presentation.js';
import type { ModuleExportsView } from './exports/presentation.js';

export interface ObservationBatch {
  readonly formatVersion: 4;
  readonly id: string;
  readonly session: string;
  readonly command: number;
  readonly records: readonly { readonly id: string; readonly kind: 'request' | 'analysis-context' | 'qualified-view' | 'rendered-output' | 'command-outcome' | 'investigation-usage' | 'resolution-result' | 'resolution-information' | 'usage-report' | 'request-work' | 'inadequacy-feedback' | 'representation-limit'; readonly value: unknown }[];
  readonly events: readonly {
    readonly id: string; readonly type: 'view-produced' | 'attribution-disclosed' | 'command-completed' | 'command-refused' | 'session-invalidated' | 'command-failed' | 'command-defect' | 'command-interrupted' | 'inadequacy-reported' | 'representation-limited' | 'additional-detail-requested' | 'source-displayed';
    readonly request: string; readonly analysis?: string; readonly feedback?: string; readonly view?: string; readonly rendered: string;
    readonly sourceLevel?: SourceDisclosureLevel;
    readonly sourceForms?: readonly SourceDisclosureForm[];
  }[];
}

export interface ObservationSink {
  submit(batch: ObservationBatch): Promise<{ readonly accepted: true } | { readonly accepted: false; readonly reason: string }>;
}

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

/** The generic acceptance contract stays unchanged; local publication can additionally report cleanup. */
export function localFileObservationSink(directory: string, configPath: string | null, options: {
  now?: () => Date;
  io?: { mkdir: typeof mkdir; open: typeof open; link: typeof link; unlink: typeof unlink };
} = {}) {
  const absolute = configPath === null ? null : path.resolve(configPath);
  const label = path.basename(path.dirname(absolute ?? '')).normalize('NFKD').replace(/[^a-zA-Z0-9_-]+/g, '-')
    .replace(/^-+|-+$/g, '').slice(0, 64).toLowerCase() || 'project';
  const key = createHash('sha256').update(absolute ?? '').digest('hex').slice(0, 6);
  const destination = path.join(path.resolve(directory), absolute === null ? 'context-free' : `${label}-${key}`);
  const io = options.io ?? { mkdir, open, link, unlink };
  const reason = (error: unknown) => error instanceof Error ? error.message : String(error);
  return { destination, async submit(batch: ObservationBatch) {
    const timestamp = (options.now ?? (() => new Date()))().toISOString();
    const datedDirectory = path.join(destination, timestamp.slice(0, 10));
    const filename = path.join(datedDirectory, `${timestamp.slice(11).replaceAll(':', '-')}_${batch.id}.json`);
    const staging = path.join(datedDirectory, `.staging-${randomUUID()}`);
    let owned = false, published = false;
    let file: Awaited<ReturnType<typeof open>> | undefined;
    try {
      // mkdir recursive's mode applies only to newly created directories.
      await io.mkdir(datedDirectory, { recursive: true, mode: 0o700 });
      file = await io.open(staging, 'wx', 0o600);
      owned = true;
      await file.writeFile(`${JSON.stringify(batch)}\n`);
      await file.close(); file = undefined;
      await io.link(staging, filename);
      published = true;
      await io.unlink(staging); owned = false;
      return { accepted: true as const };
    } catch (error) {
      const problems = [reason(error)];
      if (file) { try { await file.close(); } catch (cleanup) { problems.push(`staging close: ${reason(cleanup)}`); } }
      if (owned && !published) {
        try { await io.unlink(staging); } catch (cleanup) { problems.push(`staging cleanup: ${reason(cleanup)}`); }
      }
      return published ? { accepted: true as const, cleanupWarning: `Observation published; staging cleanup failed: ${problems.join('; ')}` }
        : { accepted: false as const, reason: problems.join('; ') };
    }
  } };
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
