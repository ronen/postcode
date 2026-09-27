// Runs a warm-up request then profiles only the second (steady-state) request via the inspector.
// Usage: node profile-request.mjs BUILD_DIR TSCONFIG LENS FORMAT OUTPUT_CPUPROFILE [SELECTOR] [SUBJECT]
import path from 'node:path';
import { writeFileSync } from 'node:fs';
import { Session } from 'node:inspector/promises';
const [build, config, lens, format, output, selector = null, subject] = process.argv.slice(2);
const { openSession } = await import(path.resolve(build, 'src/lib/session.js'));
const opened = openSession({ configPath: path.resolve(config) });
const request = { lens, selector, ...(subject ? { subject } : {}), presentation: { format, sourceDetail: false } };
if (!process.env.FIRST) opened.session.execute(request, { deferPublicationCheck: true });
const inspector = new Session(); inspector.connect();
await inspector.post('Profiler.enable'); await inspector.post('Profiler.start');
const s = performance.now();
opened.session.execute(request, { deferPublicationCheck: true });
const ms = performance.now() - s;
const { profile } = await inspector.post('Profiler.stop');
writeFileSync(output, JSON.stringify(profile));
console.log(`${lens} ${format}: ${ms.toFixed(0)} ms`);
