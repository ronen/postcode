import assert from 'node:assert/strict';
import { test } from 'node:test';
import path from 'node:path';
import { mkdir, open, link, unlink, readFile, readdir, stat, writeFile } from 'node:fs/promises';
import type { FileHandle } from 'node:fs/promises';
import { localFileObservationSink, commandObservation } from '../src/lib/observations.js';
import { submitObservation } from '../src/lib/command-execution.js';
import { temporaryDirectory } from './cli-helpers.js';

const now = () => new Date('2026-09-28T23:59:59.123Z');
const batch = () => commandObservation('session:test', 1, {}, 'refused', '', 'Usage error');
const io = { mkdir, open, link, unlink };

test('observation grouping is bound to the configured project even for batches without views', async t => {
  const root = temporaryDirectory(t, 'postcode-project-sink-');
  const destination = path.join(root, '_observations');
  const configs = ['one/shared/tsconfig.json', 'two/shared/tsconfig.json', 'one/shared/alternate.json', '!!!/tsconfig.json'];
  const sinks = configs.map(config => localFileObservationSink(destination, path.join(root, config), { now }));
  assert.equal(new Set(sinks.map(sink => sink.destination)).size, 4);
  assert.match(path.basename(sinks[3]!.destination), /^project-[a-f0-9]{6}$/);
  const repeated = localFileObservationSink(destination, path.join(root, configs[0]!), { now });
  assert.equal(repeated.destination, sinks[0]!.destination);
  for (const sink of [...sinks, repeated]) assert.deepEqual(await sink.submit(batch()), { accepted: true });
  const dates = await readdir(repeated.destination);
  assert.deepEqual(dates, ['2026-09-28']);
  assert.equal((await readdir(path.join(repeated.destination, dates[0]!))).length, 2);
  for (const directory of [destination, repeated.destination, path.join(repeated.destination, dates[0]!)]) {
    assert.equal((await stat(directory)).mode & 0o777, 0o700);
  }
  let ticks = 0;
  const rollover = localFileObservationSink(destination, path.join(root, configs[0]!), {
    now: () => new Date(ticks++ === 0 ? '2026-09-28T23:59:59.999Z' : '2026-09-29T00:00:00.000Z'),
  });
  await rollover.submit(batch()); await rollover.submit(batch());
  assert.equal(ticks, 2);
  assert.deepEqual((await readdir(repeated.destination)).sort(), ['2026-09-28', '2026-09-29']);
});

test('final observation names expose complete closed bytes and never replace a prior batch', async t => {
  const root = temporaryDirectory(t, 'postcode-atomic-observation-');
  let closed = false, wasClosed = false, before = '', published = '';
  const sink = localFileObservationSink(root, path.join(root, 'tsconfig.json'), { now, io: { ...io,
    open: async (...args) => {
      const file = await open(...args);
      return { writeFile: file.writeFile.bind(file), close: async () => { await file.close(); closed = true; } } as FileHandle;
    },
    link: async (source, destination) => {
      wasClosed = closed; before = await readFile(source, 'utf8');
      await link(source, destination); published = await readFile(destination, 'utf8');
    },
  } });
  const observation = batch();
  assert.deepEqual(await sink.submit(observation), { accepted: true });
  assert.equal(wasClosed, true); assert.deepEqual(JSON.parse(before), observation); assert.equal(before, published);
  const directory = path.join(sink.destination, '2026-09-28');
  const files = await readdir(directory);
  assert.equal(files.length, 1); assert.match(files[0]!, /^23-59-59\.123Z_.*\.json$/);
  assert.equal((await stat(path.join(directory, files[0]!))).mode & 0o777, 0o600);
  const failed = await sink.submit({ ...observation, command: 2 });
  assert.equal(failed.accepted, false);
  assert.equal(await readFile(path.join(directory, files[0]!), 'utf8'), published);
  assert.deepEqual(await readdir(directory), files);
});

for (const failure of ['create', 'partial-write', 'close', 'unsupported-publication', 'cleanup'] as const) {
  test(`observation ${failure} failure retains truthful acceptance and cleanup ownership`, async t => {
    const root = temporaryDirectory(t, 'postcode-sink-failure-');
    let staging = '';
    const sink = localFileObservationSink(root, path.join(root, 'tsconfig.json'), { now, io: {
      ...io,
      open: async (name, ...args) => {
        staging = String(name);
        if (failure === 'create') {
          await writeFile(name, 'foreign staging contents');
          throw Object.assign(new Error('Controlled exclusive creation failure'), { code: 'EEXIST' });
        }
        const file = await open(name, ...args);
        return {
          writeFile: async (text: string) => {
            if (failure === 'partial-write') { await file.writeFile(text.slice(0, 12)); throw new Error('Controlled partial write'); }
            await file.writeFile(text);
          },
          close: async () => { await file.close(); if (failure === 'close') throw new Error('Controlled close failure'); },
        } as FileHandle;
      },
      link: async (...args) => {
        if (failure === 'unsupported-publication') throw Object.assign(new Error('Hard links unsupported'), { code: 'ENOTSUP' });
        await link(...args);
      },
      unlink: async name => { if (failure === 'cleanup') throw new Error('Controlled staging unlink failure'); await unlink(name); },
    } });
    let warning = '';
    const observation = batch();
    await submitObservation(sink, observation, { stdout() {}, stderr(text) { warning += text; } });
    const files = await readdir(path.join(sink.destination, '2026-09-28'));
    const final = files.filter(name => name.endsWith('.json'));
    if (failure === 'cleanup') {
      assert.equal(final.length, 1);
      assert.deepEqual(JSON.parse(await readFile(path.join(sink.destination, '2026-09-28', final[0]!), 'utf8')), observation);
      assert.match(warning, /published; staging cleanup failed/);
      assert.doesNotMatch(warning, /not recorded/);
      assert.equal(files.length, 2);
    } else {
      assert.equal(final.length, 0); assert.match(warning, /observation not recorded/);
      if (failure === 'create') assert.equal(await readFile(staging, 'utf8'), 'foreign staging contents');
      else assert.deepEqual(files, []);
    }
  });
}
