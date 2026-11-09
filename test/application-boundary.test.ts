import assert from 'node:assert/strict';
import { test } from 'node:test';
import { mkdtempSync, writeFileSync, rmSync, readFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import ts from 'typescript';
import { openApplication, SessionClosed } from '../src/lib/application/index.js';
import type { ApplicationResult, WorkProgress } from '../src/lib/application/index.js';

function answer(result: ApplicationResult) {
  assert.equal(result.kind, 'answer');
  return result;
}
test('direct application returns complete module support and exact answers without a client or sink', async t => {
  const root = mkdtempSync(path.join(os.tmpdir(), 'postcode-direct-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  writeFileSync(path.join(root, 'tsconfig.json'), '{"compilerOptions":{"noLib":true,"types":[]},"files":["module.ts"]}');
  writeFileSync(path.join(root, 'module.ts'), Array.from({ length: 65 }, (_, i) => `/** Export ${i}: ${'Full documentation. '.repeat(80)} */\nexport const item${i} = ${i};`).join('\n'));
  const events: WorkProgress[] = [];
  const opened = await openApplication({ configPath: path.join(root, 'tsconfig.json') }, { onWork: event => events.push(event) });
  assert.equal(opened.status, 'opened');
  const session = opened.session; t.after(() => session.close());
  assert.ok(session.capabilities().some(item => item.id === 'modules'));
  const inventory = answer(await session.execute({ kind: 'lens', lens: 'modules', designation: { kind: 'configured-project' } }));
  assert.equal(inventory.answer.content.contract, 'modules');
  const module = inventory.answer.content.value.modules[0]!;
  assert.equal(module.exports.length, 65, 'full selected content exceeds the human View bound');
  assert.ok(module.exports[0]!.documentation.length);
  const inspected = answer(await session.execute({ kind: 'lens', lens: 'inspect', designation: { kind: 'reference', value: module.id } }));
  assert.equal(inspected.answer.content.contract, 'investigation');
  assert.equal(inspected.answer.content.value.projection.variant, 'associated-inspection');
  assert.equal(inspected.answer.mechanical?.contract, 'modules');
  const exact = answer(await session.execute({ kind: 'present', target: inspected.answer.id }));
  assert.deepEqual(exact.answer, inspected.answer);
  assert.deepEqual(structuredClone(exact), exact);
  assert.ok(Object.isFrozen(exact.answer.content));
  assert.equal('rendered' in exact, false);
  assert.equal('view' in exact, false);
  assert.ok(exact.methods.every(method => !method.includes('presentation')));
  const usage = await session.execute({ kind: 'report', report: 'usage' });
  assert.equal(usage.kind, 'usage');
  assert.equal(usage.usage.calls, 0);
  assert.ok(events.some(event => event.kind === 'finish' && event.status === 'completed'));
  for (const event of events) { assert.deepEqual(structuredClone(event), event); assert.ok(Object.isFrozen(event)); }
  await session.close();
  await assert.rejects(session.execute({ kind: 'report', report: 'usage' }), SessionClosed);
});

test('application runtime and type imports do not reach CLI, Views or terminal helpers', () => {
  const root = path.resolve('src/lib');
  const seen = new Set<string>();
  function visit(file: string, chain: string[]): void {
    if (seen.has(file)) return;
    seen.add(file);
    const relative = path.relative(root, file);
    assert.doesNotMatch(relative, /(^interfaces\/cli\/|(^|\/)(cli|commands|shell|interactive-session|session-worker|session-protocol|presentation|program-presentation|retained-presentation|request-reporting|terminal-text|terminal-layout|answer-presentation|source-disclosure|observations)\.ts$)/, chain.join(' -> '));
    const source = ts.createSourceFile(file, readFileSync(file, 'utf8'), ts.ScriptTarget.Latest, true);
    const inspect = (node: ts.Node): void => {
      const specifier = ts.isImportDeclaration(node) || ts.isExportDeclaration(node) ? node.moduleSpecifier
        : ts.isCallExpression(node) && node.expression.kind === ts.SyntaxKind.ImportKeyword ? node.arguments[0]
          : ts.isImportTypeNode(node) && ts.isLiteralTypeNode(node.argument) ? node.argument.literal : undefined;
      if (specifier && ts.isStringLiteral(specifier) && specifier.text.startsWith('.')) {
        const target = path.resolve(path.dirname(file), specifier.text.replace(/\.js$/, '.ts'));
        visit(target, [...chain, relative]);
      }
      ts.forEachChild(node, inspect);
    };
    inspect(source);
  }
  visit(path.join(root, 'application/index.ts'), []);
  assert.ok(seen.size > 30, 'inspect the transitive graph, including type imports');
});
