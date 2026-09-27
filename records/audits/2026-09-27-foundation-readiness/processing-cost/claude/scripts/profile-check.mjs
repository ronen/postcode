// Profiles one session.check() after a modules request. Usage: node profile-check.mjs BUILD TSCONFIG OUT
import path from 'node:path';
import { writeFileSync } from 'node:fs';
import { Session } from 'node:inspector/promises';
const [build, config, output] = process.argv.slice(2);
const { openSession } = await import(path.resolve(build, 'src/lib/session.js'));
const opened = openSession({ configPath: path.resolve(config) });
opened.session.execute({ lens: 'dependencies', selector: null, presentation: { format: 'json', sourceDetail: false } });
const inspector = new Session(); inspector.connect();
await inspector.post('Profiler.enable'); await inspector.post('Profiler.start');
const s = performance.now(); opened.session.check(); const ms = performance.now() - s;
const { profile } = await inspector.post('Profiler.stop');
writeFileSync(output, JSON.stringify(profile));
console.log(`check: ${ms.toFixed(0)} ms`);
