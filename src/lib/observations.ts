import { randomUUID } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import type { QualifiedView } from './presentation.js';

export interface ObservationBatch {
  readonly formatVersion: 0;
  readonly id: string;
  readonly records: readonly { readonly id: string; readonly kind: 'request' | 'analysis-context' | 'qualified-view' | 'rendered-output'; readonly value: unknown }[];
  readonly events: readonly {
    readonly id: string; readonly type: 'view-produced' | 'source-escape';
    readonly request: string; readonly analysis: string; readonly view: string; readonly rendered: string;
    readonly sourceLevel?: 'declaration-locations-and-excerpts';
  }[];
}

export interface ObservationSink {
  submit(batch: ObservationBatch): Promise<{ readonly accepted: true } | { readonly accepted: false; readonly reason: string }>;
}

/** No UUID registry, historical reads, producer retention policy, or operational-store dependency. */
export function observationBatch(view: QualifiedView, rendered: string, context: {
  readonly configPath: string; readonly repositoryRoot: string | null; readonly methods: readonly string[];
}): ObservationBatch {
  const request = randomUUID();
  const analysis = randomUUID();
  const artifact = randomUUID();
  const output = randomUUID();
  const references = { request, analysis, view: artifact, rendered: output };
  return { formatVersion: 0, id: randomUUID(), records: [
    { id: request, kind: 'request', value: {
      lens: view.projection.lens, subject: view.projection.subject, lensParameters: view.projection.parameters,
      presentation: view.presentation, navigation: view.projection.lens === 'inspect'
        ? 'Exact selector supplied in this invocation; no previous view or cross-invocation continuity is established.'
        : 'Configured-project inventory requested.',
    } },
    { id: analysis, kind: 'analysis-context', value: { ...context, snapshot: view.projection.snapshot } },
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
