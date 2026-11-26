import assert from 'node:assert/strict';
import { test } from 'node:test';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';
import { runCli } from '../src/lib/cli.js';
import type { ChatGPTCredentials } from '../src/lib/application/accounts.js';

function output() {
  let stdout = '', stderr = '';
  return { stdout: (text: string) => { stdout += text; }, stderr: (text: string) => { stderr += text; }, read: () => ({ stdout, stderr }) };
}
test('authentication-only entry has help and rejects retired commands without consulting credentials', async () => {
  const authentication = new Proxy({}, { get() { assert.fail('Retired command consulted authentication'); } }) as ChatGPTCredentials;
  for (const args of [[], ['help'], ['--help'], ['-h']]) {
    const capture = output(); assert.equal(await runCli(args, { ...capture, authentication }), 0);
    assert.match(capture.read().stdout, /authentication CLI/); assert.match(capture.read().stdout, /auth chatgpt sign-in/);
  }
  for (const command of ['shell', 'modules', 'organization', 'inspect', 'dependencies', 'children', 'parents', 'summarize', 'explain', 'decompose', 'examine', 'present', 'usage', 'feedback', 'exit', '--project', '\u001b[31mhostile']) {
    const capture = output(); assert.equal(await runCli([command, '--help'], { ...capture, authentication }), 2);
    assert.equal(capture.read().stdout, ''); assert.match(capture.read().stderr, /Only authentication and help/);
    assert.doesNotMatch(capture.read().stderr, /\u001b/);
  }
  assert.match(execFileSync(process.execPath, [fileURLToPath(new URL('../src/cli.js', import.meta.url)), '--help'], { encoding: 'utf8' }), /authentication CLI/);
});

test('authentication status escapes supplied account labels and failures stay credential-safe', async () => {
  const capture = output();
  const authentication = { status: async () => [{ label: 'a\n\u001b[31m', active: true, signedIn: true, planUsage: true, renewable: false }] } as unknown as ChatGPTCredentials;
  assert.equal(await runCli(['auth', 'chatgpt', 'status'], { ...capture, authentication }), 0);
  assert.match(capture.read().stdout, /a\\u000a\\u001b/);
  const failure = output();
  assert.equal(await runCli(['auth', 'chatgpt', 'status'], { ...failure, authentication: { status: async () => { throw Error('secret-token'); } } as unknown as ChatGPTCredentials }), 2);
  assert.doesNotMatch(JSON.stringify(failure.read()), /secret-token/);
});

test('authentication entry has no runtime import path to project opening or investigation hosting', () => {
  const seen = new Set<string>();
  function visit(file: string) {
    if (seen.has(file)) return; seen.add(file);
    assert.doesNotMatch(file, /\/(?:application\/session|typescript\/project|interactive-session|session-worker|shell)\.ts$/);
    const source = ts.createSourceFile(file, readFileSync(file, 'utf8'), ts.ScriptTarget.Latest, true);
    for (const statement of source.statements) {
      if (!ts.isImportDeclaration(statement) && !ts.isExportDeclaration(statement)) continue;
      if (ts.isImportDeclaration(statement) && statement.importClause?.isTypeOnly || ts.isExportDeclaration(statement) && statement.isTypeOnly) continue;
      const specifier = statement.moduleSpecifier;
      if (specifier && ts.isStringLiteral(specifier) && specifier.text.startsWith('.')) visit(path.resolve(path.dirname(file), specifier.text.replace(/\.js$/, '.ts')));
    }
  }
  visit(path.resolve('src/cli.ts'));
});
