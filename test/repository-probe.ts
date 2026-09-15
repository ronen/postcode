// Verification harness only; this is not a public CLI or presentation contract.
import { captureRepository } from '../src/lib/repository/capture.js';
import { deriveLayout } from '../src/lib/repository/layout.js';
const capture = captureRepository(process.argv[2]!);
process.stdout.write(JSON.stringify({ capture, layout: capture.status === 'available' ? deriveLayout(capture.evidence) : null }));
