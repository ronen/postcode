// Verification harness only; this is not a public CLI or presentation contract.
import { discover } from './helpers.js';
const { evaluation, projection, claims, contexts } = discover(process.argv[2]!);
process.stdout.write(JSON.stringify({ evaluation, projection, claims, contexts }));
