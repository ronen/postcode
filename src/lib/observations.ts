import type { InvestigationUsageReport } from './investigation/reporting.js';
import type { InvestigationView } from './investigation/presentation.js';
import type { QualifiedDependencyView } from './dependencies/presentation.js';
import { randomUUID, createHash } from 'node:crypto';
import { mkdir, open, link, unlink } from 'node:fs/promises';
import path from 'node:path';
import type { QualifiedView } from './presentation.js';
import type { QualifiedOrganizationView } from './organization/presentation.js';

export interface ObservationBatch {
  readonly formatVersion: 1;
  readonly id: string;
  readonly session: string;
  readonly command: number;
  readonly records: readonly { readonly id: string; readonly kind: 'request' | 'analysis-context' | 'qualified-view' | 'rendered-output' | 'command-outcome' | 'investigation-usage'; readonly value: unknown }[];
  readonly events: readonly {
    readonly id: string; readonly type: 'view-produced' | 'source-escape' | 'command-completed' | 'command-refused' | 'session-invalidated' | 'command-failed' | 'command-defect' | 'command-interrupted';
    readonly request: string; readonly analysis: string; readonly view?: string; readonly rendered: string;
    readonly sourceLevel?: 'declaration-locations-and-excerpts' | 'organization-paths' | 'organization-and-module-source' | 'dependency-occurrences-and-organization-evidence' | 'investigation-support';
  }[];
}

export interface ObservationSink {
  submit(batch: ObservationBatch): Promise<{ readonly accepted: true } | { readonly accepted: false; readonly reason: string }>;
}

/** No UUID registry, historical reads, producer retention policy, or operational-store dependency. */
export function observationBatch(view: QualifiedView | QualifiedOrganizationView | QualifiedDependencyView | InvestigationView, rendered: string, context: {
  readonly configPath: string; readonly repositoryRoot: string | null; readonly methods: readonly string[];
}, command = 1): ObservationBatch {
  if (!Number.isSafeInteger(command) || command < 1) throw new Error('Invalid command order');
  const request = randomUUID();
  const analysis = randomUUID();
  const artifact = randomUUID();
  const output = randomUUID();
  const references = { request, analysis, view: artifact, rendered: output };
  return { formatVersion: 1, id: randomUUID(), session: view.projection.session, command, records: [
    { id: request, kind: 'request', value: {
      lens: view.projection.lens, subject: view.projection.subject, lensParameters: view.projection.parameters,
      presentation: view.presentation, navigation: ['inspect', 'dependency-children', 'dependency-parents'].includes(view.projection.lens)
        ? view.projection.parameters.reference
          ? 'Session-local entity reference supplied; resolution is within this session only, with no cross-invocation continuity.'
          : 'Exact name or handle supplied for lookup; no session-reference or cross-invocation continuity is asserted.'
        : view.projection.lens === 'summarize' || view.projection.lens === 'usage' ? 'Investigation or usage requested; references are scoped to this producing session.' : view.projection.lens === 'organization' ? 'Organization investigation requested for the stated subject.' : view.projection.lens === 'dependency-structure' ? 'Project dependency structure requested.' : 'Configured-project inventory requested.',
    } },
    { id: analysis, kind: 'analysis-context', value: { ...context, session: view.projection.session } },
    { id: artifact, kind: 'qualified-view', value: view },
    { id: output, kind: 'rendered-output', value: rendered },
  ], events: [
    { id: randomUUID(), type: 'view-produced', ...references },
    ...(view.sourceDetail ? [{ id: randomUUID(), type: 'source-escape' as const, ...references, sourceLevel: view.sourceDetail.level }] : []),
  ] };
}

/** The generic acceptance contract stays unchanged; local publication can additionally report cleanup. */
export function localFileObservationSink(directory: string, configPath: string, options: {
  now?: () => Date;
  io?: { mkdir: typeof mkdir; open: typeof open; link: typeof link; unlink: typeof unlink };
} = {}) {
  const absolute = path.resolve(configPath);
  const label = path.basename(path.dirname(absolute)).normalize('NFKD').replace(/[^a-zA-Z0-9_-]+/g, '-')
    .replace(/^-+|-+$/g, '').slice(0, 64).toLowerCase() || 'project';
  const key = createHash('sha256').update(absolute).digest('hex').slice(0, 6);
  const destination = path.join(path.resolve(directory), `${label}-${key}`);
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

/** Refusals and failures have no fabricated view or source-disclosure event. */
export function commandObservation(session: string, command: number, requestValue: unknown,
  status: 'completed' | 'refused' | 'invalidated' | 'failed' | 'defect' | 'interrupted',
  stdout: string, stderr: string, produced?: ObservationBatch, usage?: InvestigationUsageReport): ObservationBatch {
  if (!Number.isSafeInteger(command) || command < 1) throw new Error('Invalid command order');
  const request = produced?.records.find(item => item.kind === 'request')?.id ?? randomUUID();
  const analysis = produced?.records.find(item => item.kind === 'analysis-context')?.id ?? randomUUID();
  const rendered = produced?.records.find(item => item.kind === 'rendered-output')?.id ?? randomUUID();
  const records: ObservationBatch['records'][number][] = produced ? [...produced.records] : [
    { id: request, kind: 'request', value: requestValue },
    { id: analysis, kind: 'analysis-context', value: { session } },
    { id: rendered, kind: 'rendered-output', value: stdout },
  ];
  if (usage?.attempts.length) records.push({ id: randomUUID(), kind: 'investigation-usage', value: usage });
  records.push({ id: randomUUID(), kind: 'command-outcome', value: { status, request: requestValue, stderr } });
  const type = status === 'invalidated' ? 'session-invalidated' : `command-${status}` as const;
  return { formatVersion: 1, id: produced?.id ?? randomUUID(), session, command, records,
    events: [...(produced?.events ?? []), { id: randomUUID(), type, request, analysis, rendered }] };
}
