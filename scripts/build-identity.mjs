import { createHash } from 'node:crypto';
import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';

export function buildIdentity(build) {
  const hash = createHash('sha256');
  function walk(directory) {
    for (const entry of readdirSync(directory, { withFileTypes: true }).sort((a, b) => a.name < b.name ? -1 : 1)) {
      const filename = path.join(directory, entry.name);
      if (entry.isDirectory()) walk(filename);
      else { hash.update(path.relative(build, filename)); hash.update(readFileSync(filename)); }
    }
  }
  walk(path.join(build, 'src'));
  return { build: path.resolve(build), sha256: hash.digest('hex') };
}
