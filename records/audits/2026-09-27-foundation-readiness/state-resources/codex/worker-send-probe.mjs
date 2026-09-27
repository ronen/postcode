import assert from 'node:assert/strict';
import path from 'node:path';
import { Worker } from 'node:worker_threads';
import { interactiveSession } from './checkout/_build/src/lib/interactive-session.js';
const configPath = path.resolve('_codex_state_resource_audit/probe-data/tsconfig.json');
const remote = interactiveSession({ configPath });
const unhandled = [];
const captureUnhandled = error => unhandled.push(error.message);
process.on('unhandledRejection', captureUnhandled);
const report = {};
try {
  assert.equal((await remote.opening).status, 'opened');
  // Structural typing permits extra properties; real postMessage rejects the function.
  try { await remote.execute({ lens: 'modules', selector: null,
    presentation: { format: 'json', sourceDetail: false }, extra: () => {} }); }
  catch (error) { report.sendError = error.name; }
  try { await remote.check(); }
  catch (error) { report.nextCommandError = error.message; }
} finally {
  await remote.close();
  await new Promise(resolve => setImmediate(resolve));
  process.removeListener('unhandledRejection', captureUnhandled);
}
report.unhandledRejections = unhandled;
assert.equal(report.sendError, 'DataCloneError');
assert.equal(report.nextCommandError, 'Concurrent session command');
assert.equal(unhandled.length, 1);
console.log(JSON.stringify(report, null, 2));
