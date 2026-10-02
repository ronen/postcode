/** Read-only pre/postflight of the historical runtime and frozen completion inputs. */
import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
const base = path.dirname(fileURLToPath(import.meta.url));
const checkout = path.resolve(base, '../../../..');
const frozen = path.join(checkout, '_investigation/merge-completion-runtime');
const manifest = JSON.parse(readFileSync(path.join(base, 'manifest.json'), 'utf8'));
for (const [file, expected] of Object.entries(manifest.completionMaterialSHA256)) {
  if (createHash('sha256').update(readFileSync(path.join(base, file))).digest('hex') !== expected) throw new Error(`Completion input changed: ${file}`);
}
process.chdir(frozen);
const { verifyConfiguration } = await import(pathToFileURL(path.join(frozen, 'scripts/module-investigation/verify-configuration.mjs')));
verifyConfiguration({ manifest: path.join(base, 'manifest.json'), pass: manifest.pass, subject: 'merge-anything',
  project: path.join(checkout, '_investigation/module-assessment-sources/merge-anything/tsconfig.postcode-assessment.json') });
const result = { checkedAt: new Date().toISOString(), frozenRuntimeExport: manifest.frozenRuntimeExport,
  frozenRuntimeInstructionsSourcePinModelRouteAndEffectiveConfigurationUnchanged: true,
  completionMaterialsUnchanged: true, credentialsAccessed: false };
if (process.argv[2]) writeFileSync(path.join(base, process.argv[2]), JSON.stringify(result, null, 2) + '\n');
process.stdout.write(JSON.stringify(result) + '\n');
