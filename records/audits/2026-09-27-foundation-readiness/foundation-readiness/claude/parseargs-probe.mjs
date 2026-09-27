// Compare node:util parseArgs with PostCode's current parseCommand option scan on edge inputs.
import { parseArgs } from 'node:util';
import { writeFileSync } from 'node:fs';
import { parseCommand } from './build/src/lib/commands.js';
const config = { options: { json: { type: 'boolean' }, 'source-detail': { type: 'boolean' }, project: { type: 'string' }, help: { type: 'boolean', short: 'h' } },
  strict: true, allowPositionals: true, tokens: true };
const cases = [
  ['inspect', 'foo', '--json'], ['inspect', '-x'], ['inspect', '--', '-x'], ['inspect', '--', '--help'], ['--project', 'a/tsconfig.json', 'modules'],
  ['--project=a/tsconfig.json', 'modules'], ['--project', '--json'], ['--project', '-p'], ['-h'], ['inspect', 'x', '--unknown'], ['inspect', '@ref'],
  ['-jh'], ['--json=true'], ['--no-json'],
];
const out = cases.map(args => {
  const current = parseCommand(args, '/cwd');
  let library;
  try {
    const { values, positionals, tokens } = parseArgs({ ...config, args });
    library = { values, positionals, terminator: tokens.some(token => token.kind === 'option-terminator') };
  } catch (error) { library = { error: error.code, message: error.message.split('\n')[0] }; }
  return { args, current: current.kind === 'view' ? { kind: 'view', configPath: current.configPath, request: current.request } : current, library };
});
writeFileSync(new URL('./parseargs-results.json', import.meta.url), `${JSON.stringify(out, null, 2)}\n`);
for (const item of out) console.log(JSON.stringify(item.args), '| current:', item.current.kind === 'view' ? `view ${item.current.request.lens} sel=${item.current.request.selector} json=${item.current.request.presentation.format === 'json'} cfg=${item.current.configPath}` : item.current.kind + (item.current.message ? ' ' + item.current.message.trim() : ''), '| parseArgs:', item.library.error ? `${item.library.error}` : JSON.stringify(item.library));
