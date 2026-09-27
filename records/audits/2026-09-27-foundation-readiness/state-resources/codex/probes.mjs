import assert from 'node:assert/strict';
import path from 'node:path';
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import { syncBuiltinESMExports } from 'node:module';
import { setTimeout as delay } from 'node:timers/promises';
import { openTypeScriptProject } from './checkout/_build/src/lib/typescript/project.js';
import { MemoryProgramRecordStore } from './checkout/_build/src/lib/memory-store.js';
import { recordModuleEvaluation } from './checkout/_build/src/lib/evaluation.js';
import { modules } from './checkout/_build/src/lib/projections.js';
import { interactiveSession } from './checkout/_build/src/lib/interactive-session.js';
import { localFileObservationSink } from './checkout/_build/src/lib/observations.js';

const root = path.dirname(new URL(import.meta.url).pathname);
const data = path.join(root, 'probe-data');
fs.mkdirSync(data, { recursive: true });
const configPath = path.join(data, 'tsconfig.json');
fs.writeFileSync(configPath, '{"compilerOptions":{"noLib":true,"types":[]},"files":["entry.ts"]}');
fs.writeFileSync(path.join(data, 'entry.ts'), 'export const entry = 1;');
const reports = [];

// A provider may legally retain a mutable source array while exposing readonly data.
{
  const opened = openTypeScriptProject({ configPath });
  assert.equal(opened.status, 'opened');
  const store = new MemoryProgramRecordStore();
  const original = opened.analysis.discover(store);
  const producerModules = [...original.modules];
  const outcome = recordModuleEvaluation(store, { ...original, modules: producerModules });
  const before = structuredClone(store.get(outcome.id));
  producerModules.length = 0;
  const reused = recordModuleEvaluation(store, { ...original, modules: [...original.modules] });
  const projection = modules(store, reused);
  assert.deepEqual(store.get(outcome.id), before);
  assert.equal(reused, outcome);
  assert.equal(reused.modules.length, 0);
  assert.ok(before.modules.length > 0);
  reports.push({ probe: 'evaluation-cache-alias', storedModules: before.modules.length,
    cachedModules: reused.modules.length, projectedModules: projection.modules.length,
    populationEstablished: projection.selection.populationEstablished });
}

// Inject a filesystem write failure after successful creation and a short write.
{
  const destination = path.join(data, 'sink');
  fs.rmSync(destination, { recursive: true, force: true });
  const originalWrite = fsp.writeFile;
  fsp.writeFile = async (file, content, options) => {
    await originalWrite(file, String(content).slice(0, 9), options);
    throw Object.assign(new Error('Controlled ENOSPC after partial write'), { code: 'ENOSPC' });
  };
  syncBuiltinESMExports();
  try {
    await assert.rejects(localFileObservationSink(destination, () => new Date('2026-09-27T00:00:00Z'))
      .submit({ formatVersion: 1, id: 'probe', session: 'probe', command: 1, records: [], events: [] }), /ENOSPC/);
    const directory = path.join(destination, 'date=2026-09-27');
    const names = fs.readdirSync(directory);
    const content = fs.readFileSync(path.join(directory, names[0]), 'utf8');
    assert.throws(() => JSON.parse(content));
    reports.push({ probe: 'partial-observation-write', names, content, bytes: content.length });
  } finally { fsp.writeFile = originalWrite; syncBuiltinESMExports(); }
}

// A bounded Git substitute models a stalled child while a worker is opening.
{
  const bin = path.join(data, 'bin'); fs.mkdirSync(bin, { recursive: true });
  const marker = path.join(data, 'git-started'); fs.rmSync(marker, { force: true });
  fs.writeFileSync(path.join(bin, 'git'), `#!/bin/sh\nprintf started > '${marker}'\nsleep 3\nexit 1\n`, { mode: 0o700 });
  const oldPath = process.env.PATH;
  process.env.PATH = `${bin}:${oldPath}`;
  const remote = interactiveSession({ configPath });
  process.env.PATH = oldPath;
  const opening = remote.opening.then(value => ({ value }), error => ({ error: error.constructor.name }));
  try {
    const deadline = Date.now() + 10000;
    while (!fs.existsSync(marker)) { assert.ok(Date.now() < deadline); await delay(10); }
    const start = performance.now();
    const stopped = remote.interrupt();
    const openingResult = await opening;
    const rejectedAfterMs = performance.now() - start;
    await stopped;
    reports.push({ probe: 'interrupt-during-git', openingResult, rejectedAfterMs, terminationAfterMs: performance.now() - start });
  } finally { await remote.close(); }
}
console.log(JSON.stringify(reports, null, 2));
