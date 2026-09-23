import type { QualifiedDependencyView } from './dependencies/presentation.js';
import { randomUUID } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import type { QualifiedView } from './presentation.js';
import type { QualifiedOrganizationView } from './organization/presentation.js';

export interface ObservationBatch {
  readonly formatVersion: 1;
  readonly id: string;
  readonly session: string;
  readonly command: number;
  readonly records: readonly { readonly id: string; readonly kind: 'request' | 'analysis-context' | 'qualified-view' | 'rendered-output'; readonly value: unknown }[];
  readonly events: readonly {
    readonly id: string; readonly type: 'view-produced' | 'source-escape';
    readonly request: string; readonly analysis: string; readonly view: string; readonly rendered: string;
    readonly sourceLevel?: 'declaration-locations-and-excerpts' | 'organization-paths' | 'organization-and-module-source' | 'dependency-occurrences-and-organization-evidence';
  }[];
}

export interface ObservationSink {
  submit(batch: ObservationBatch): Promise<{ readonly accepted: true } | { readonly accepted: false; readonly reason: string }>;
}

/** No UUID registry, historical reads, producer retention policy, or operational-store dependency. */
export function observationBatch(view: QualifiedView | QualifiedOrganizationView | QualifiedDependencyView, rendered: string, context: {
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
        ? 'Exact selector supplied in this invocation; no previous view or cross-invocation continuity is established.'
        : view.projection.lens === 'organization' ? 'Organization investigation requested for the stated subject.' : view.projection.lens === 'dependency-structure' ? 'Project dependency structure requested.' : 'Configured-project inventory requested.',
    } },
    { id: analysis, kind: 'analysis-context', value: { ...context, session: view.projection.session } },
    { id: artifact, kind: 'qualified-view', value: view },
    { id: output, kind: 'rendered-output', value: rendered },
  ], events: [
    { id: randomUUID(), type: 'view-produced', ...references },
    ...(view.sourceDetail ? [{ id: randomUUID(), type: 'source-escape' as const, ...references, sourceLevel: view.sourceDetail.level }] : []),
  ] };
}

export function localFileObservationSink(
  directory: string,
  now: () => Date = () => new Date(),
): ObservationSink {
  return { async submit(batch) {
    const timestamp = now().toISOString();
    const datedDirectory = path.join(directory, `date=${timestamp.slice(0, 10)}`);
    const filenameTimestamp = timestamp.replaceAll(':', '-');
    await mkdir(datedDirectory, { recursive: true, mode: 0o700 });
    const destination = path.join(datedDirectory, `timestamp=${filenameTimestamp}_${batch.id}.json`);
    await writeFile(destination, `${JSON.stringify(batch)}\n`, { flag: 'wx', mode: 0o600 });
    return { accepted: true };
  } };
}
