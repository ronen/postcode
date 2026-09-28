import assert from 'node:assert/strict';
import { test } from 'node:test';
import { boundedText, codePointLength, displayWidth, fitText, layoutText, padDisplay } from '../src/lib/terminal-layout.js';

test('terminal layout uses cells and preserves combining, CJK and ZWJ spelling', () => {
  const family = '👩‍👩‍👧‍👦';
  for (const [text, width, expected] of [
    ['古古古', 4, ['古古', '古']],
    ['e\u0301e\u0301e\u0301', 2, ['e\u0301e\u0301', 'e\u0301']],
    [family + family, 2, [family, family]],
  ] as const) {
    const result = layoutText(text, '', width);
    assert.deepEqual(result.lines, expected);
    assert.equal(result.omittedCharacters, 0);
    assert.equal(result.lines.join(''), text);
    assert.ok(result.lines.every(line => displayWidth(line) <= width));
  }
  assert.equal(displayWidth('·'), 1);
  assert.equal(padDisplay('古', 4), '古  ');
  assert.equal(fitText('e\u0301'.repeat(10), '', 1, '', 3), 'e\u0301'.repeat(3));
});

test('layout keeps control escapes indivisible and counts omitted original code points', () => {
  assert.deepEqual(layoutText('a\tb', '', 7), { lines: ['a\\u0009', 'b'], omittedCharacters: 0 });
  assert.deepEqual(layoutText('a\r\nb', ''), { lines: ['a\\u000d', 'b'], omittedCharacters: 0 });
  assert.deepEqual(layoutText('\u001ba', '', 5), { lines: ['a'], omittedCharacters: 1 });
  assert.deepEqual(layoutText('\\u001ba', '', 5), { lines: ['a'], omittedCharacters: 6 });
  assert.deepEqual(layoutText('\\u0009\u0301a', '', 6), { lines: ['\\u0009\u0301', 'a'], omittedCharacters: 0 });
  const family = '👩‍👩‍👧‍👦';
  assert.deepEqual(layoutText(family, '', 1), { lines: [''], omittedCharacters: codePointLength(family) });
  assert.deepEqual(boundedText(`A${family}B`, 5, true), { text: 'A', omittedTextCharacters: 8 });
  assert.equal(fitText(`a\tb`, '', 1, '', 7), 'a'); // trailing raw tab is trimmed, never split into an escape fragment
});

test('fit checks and rendering share continuation budgets and structural newlines', () => {
  assert.deepEqual(layoutText('ab cd ef', ' ', 6, '↪ ').lines, [' ab', '↪ cd', '↪ ef']);
  const raw = '古'.repeat(30) + '\r\n' + 'e\u0301'.repeat(30);
  const fitted = fitText(raw, '', 3, '  ', 12);
  const rendered = layoutText(fitted, '  ', 12);
  assert.ok(rendered.lines.length <= 3);
  assert.ok(rendered.lines.every(line => displayWidth(line) <= 12));
  assert.equal(rendered.omittedCharacters, 0);
  assert.equal(raw.startsWith(fitted), true);
});
