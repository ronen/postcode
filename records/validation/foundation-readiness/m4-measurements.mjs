// Reproduce the M4 comparison from the repository root with two frozen builds.
// node records/validation/foundation-readiness/m4-measurements.mjs BEFORE AFTER OUTPUT_DIRECTORY
import { comparisonFixture, buildIdentity } from '../../../scripts/comparison-fixtures.mjs';
import { execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const [before, after, output] = process.argv.slice(2).map(value => path.resolve(value));
mkdirSync(output, { recursive: true });
const builds = { before: buildIdentity(before), after: buildIdentity(after) };
for (const artifacts of [240, 2400]) {
  await comparisonFixture('generated-scale', async root => {
    for (let index = 240; index < artifacts; index++) {
      writeFileSync(path.join(root, `assets/group${index % 24}/item${index}.txt`), 'non-module artifact');
    }
    const config = path.join(root, 'tsconfig.json');
    for (let repetition = 1; repetition <= 2; repetition++) {
      // Alternate order to reduce systematic warm-cache/order bias; no timing assertions.
      for (const label of repetition === 1 ? ['before', 'after'] : ['after', 'before']) {
        const build = builds[label].build;
        const prefix = `${artifacts}-${repetition}-${label}`;
        execFileSync(process.execPath, ['--expose-gc', 'scripts/measure-session-journey.mjs', config,
          path.join(output, `${prefix}-journey.json`), build], { stdio: ['ignore', 'ignore', 'inherit'] });
        for (const [name, args] of [
          ['modules', ['modules']], ['organization', ['organization', 'repository']],
        ]) execFileSync(process.execPath, ['scripts/measure-analysis.mjs', build,
          path.join(output, `${prefix}-${name}.json`), ...args, '--project', config, '--json'],
        { stdio: ['ignore', 'ignore', 'inherit'] });
        console.log(`${prefix}: direct/interactive journey and two real-publication CLI measurements complete`);
      }
    }
  });
}
writeFileSync(path.join(output, 'conditions.json'), JSON.stringify({ builds, modules: 80, artifacts: [240, 2400],
  repetitions: 2, order: ['before/after', 'after/before'],
  fixture: 'comparisonFixture generated-scale: 80 wildcard-chain modules, 24 artifact groups; second size adds 2160 non-module artifacts',
  policy: 'Sequential runs, naturally warm OS caches, no latency threshold. Direct/shell journeys use no-op sink; full CLI measurements use real local publication.' }, null, 2) + '\n');
