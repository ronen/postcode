import path from 'node:path';
import { interactiveSession } from '../../interactive-session.js';
import { localFileObservationSink } from '../../application/observations.js';
import type { CliEnvironment } from '../../cli.js';

/** Hosts share project exclusions and worker assembly, retaining their own input lifecycle. */
export function createCliRuntime(configPath: string, environment: CliEnvironment) {
  const destination = path.resolve(environment.checkout, '_observations');
  const localSink = localFileObservationSink(destination, configPath);
  const remote = interactiveSession({ configPath, excludedOutputDirectories: [destination, path.resolve(environment.checkout, '_build')] }, {
    ...(environment.selectInvestigator ? { selectInvestigator: environment.selectInvestigator } : {}),
    ...(environment.investigator ? { investigator: environment.investigator } : {}),
    ...(environment.investigationBounds ? { investigationBounds: environment.investigationBounds } : {}),
  });
  return { localSink, sink: environment.sink ?? localSink, remote };
}
