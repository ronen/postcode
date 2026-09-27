import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import type { TestContext } from 'node:test';
import { runCli } from '../src/lib/cli.js';
import type { ObservationBatch, ObservationSink } from '../src/lib/observations.js';

export async function invokeCli(args: string[], options: {
  cwd?: string; checkout?: string; sink?: ObservationSink; expectedWarning?: boolean;
} = {}) {
  let stdout = '', stderr = '';
  const batches: ObservationBatch[] = [];
  const exit = await runCli(args, { cwd: options.cwd ?? process.cwd(), checkout: options.checkout ?? process.cwd(),
    stdout: text => { stdout += text; }, stderr: text => { stderr += text; },
    sink: options.sink ?? { async submit(batch) { batches.push(batch); return { accepted: true }; } },
  });
  if (!options.expectedWarning) assert.doesNotMatch(stderr, /WARNING: observation/);
  return { stdout, stderr, exit, batches };
}

/** Register ownership before any fixture writes or project opening can fail. */
export function temporaryDirectory(t: Pick<TestContext, 'after'>, prefix: string): string {
  const directory = mkdtempSync(path.join(os.tmpdir(), prefix));
  t.after(() => rmSync(directory, { recursive: true, force: true }));
  return directory;
}

/** Drive asynchronous interaction without letting a callback failure stall a test. */
export function interactionDriver(cleanup: () => void) {
  const failures: unknown[] = [];
  return {
    run(action: () => void) {
      setImmediate(() => { try { action(); } catch (error) { failures.push(error); cleanup(); } });
    },
    verify() { if (failures.length) throw failures[0]; },
  };
}
