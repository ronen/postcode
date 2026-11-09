/** Observation transport accepts caller-owned, already-disclosed artifacts. It does
 * not inspect a Session, reconstruct source context, or decide disclosure policy. */
import { randomUUID, createHash } from 'node:crypto';
import { mkdir, open, link, unlink } from 'node:fs/promises';
import path from 'node:path';

export type SourceDisclosureLevel = 'diagnostic-locations' | 'declaration-locations' | 'organization-paths'
  | 'organization-and-module-source' | 'dependency-occurrences-and-organization-evidence' | 'investigation-support';
export type SourceDisclosureForm = 'locations' | 'excerpts';

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

export type ObservationAcknowledgement = { readonly accepted: true; readonly cleanupWarning?: string }
  | { readonly accepted: false; readonly reason: string };
export interface ObservationSink {
  submit(batch: ObservationBatch): Promise<ObservationAcknowledgement>;
}

/** Delivery failure cannot change the operation that produced the observation. */
export async function deliverObservation(sink: ObservationSink, batch: ObservationBatch): Promise<ObservationAcknowledgement> {
  try { return await sink.submit(batch); }
  catch (error) { return { accepted: false, reason: error instanceof Error ? error.message : 'sink delivery failed' }; }
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

