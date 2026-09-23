import { parentPort, workerData } from 'node:worker_threads';
import { openSession, SessionInvalidated, AnalysisFailure } from './session.js';
import type { ViewRequest } from './session.js';
import type { ProjectOptions } from './typescript/project.js';

// Private process boundary for interrupting synchronous compiler work. No public transport.
const port = parentPort!;
const opened = openSession(workerData as ProjectOptions);
if (opened.status !== 'opened') {
  port.postMessage(opened);
  port.close();
} else {
  const { session } = opened;
  port.postMessage({ status: 'opened', id: session.id });
  port.on('message', (message: { type: 'execute'; request: ViewRequest } | { type: 'check' } | { type: 'close' }) => {
    try {
      if (message.type === 'close') { session.close(); port.close(); return; }
      const result = message.type === 'execute' ? session.execute(message.request) : session.check();
      port.postMessage({ status: 'ok', result });
    } catch (error) {
      if (error instanceof SessionInvalidated) port.postMessage({ status: 'invalidated' });
      else if (error instanceof AnalysisFailure) port.postMessage({ status: 'unavailable', message: error.message });
      else throw error;
    }
  });
}
