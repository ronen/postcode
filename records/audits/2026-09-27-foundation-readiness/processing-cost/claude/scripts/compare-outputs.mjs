// Compares rendered outputs of two builds for the same requests, normalizing only the random session UUID.
// Usage: node compare-outputs.mjs BUILD_A BUILD_B TSCONFIG
import path from 'node:path';
import { createHash } from 'node:crypto';
const [a, b, config] = process.argv.slice(2);
const requests = [];
for (const format of ['unicode', 'json']) {
  const p = { format, sourceDetail: false }, sd = { format, sourceDetail: true };
  requests.push({ lens: 'modules', selector: null, presentation: p },
    { lens: 'organization', selector: null, subject: 'project', presentation: p },
    { lens: 'organization', selector: null, subject: 'repository', presentation: p },
    { lens: 'dependencies', selector: null, presentation: p });
  for (const selector of process.env.SELECTORS?.split(',') ?? []) {
    requests.push({ lens: 'inspect', selector, presentation: p }, { lens: 'inspect', selector, presentation: sd },
      { lens: 'children', selector, presentation: p }, { lens: 'children', selector, presentation: sd },
      { lens: 'parents', selector, presentation: p });
  }
}
const outputs = async build => {
  const { openSession } = await import(path.resolve(build, 'src/lib/session.js'));
  const opened = openSession({ configPath: path.resolve(config) });
  if (opened.status !== 'opened') throw new Error('open failed');
  const uuid = opened.session.id.replace(/^session:/, '');
  return requests.map(request => opened.session.execute(request).rendered.replaceAll(uuid, 'SESSION'));
};
const [left, right] = [await outputs(a), await outputs(b)];
let differences = 0;
requests.forEach((request, index) => {
  const same = left[index] === right[index];
  if (!same) differences++;
  const hash = createHash('sha256').update(left[index]).digest('hex').slice(0, 12);
  console.log(`${same ? 'same' : 'DIFF'} ${hash} ${left[index].length.toString().padStart(9)}B ${request.lens} ${request.subject ?? ''} ${request.selector ?? ''} ${request.presentation.format}${request.presentation.sourceDetail ? ' source-detail' : ''}`);
});
console.log(`${config}: ${requests.length} requests, ${differences} differences`);
process.exitCode = differences ? 1 : 0;
