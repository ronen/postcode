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

test('prefix fitting agrees with exhaustive legal-prefix rendering across whitespace and Unicode', () => {
  const segmenter = new Intl.Segmenter('und', { granularity: 'grapheme' });
  const check = (text: string, prefix: string, indent: string, width: number, maximum: number) => {
    // Enumerate all legal prefixes rather than duplicating the binary search.
    const escapes = [...text.matchAll(/\\u[\da-f]{4}/gi)].map(match => [match.index, match.index + 6] as const);
    const ends = [0, ...[...segmenter.segment(text)].map(part => part.index + part.segment.length)]
      .filter(end => !escapes.some(([start, stop]) => start < end && end < stop));
    const fits = ends.map(end => {
      const rendered = layoutText(prefix + text.slice(0, end), indent, width);
      return rendered.lines.length <= maximum && rendered.omittedCharacters === 0;
    });
    const context = JSON.stringify({ text, prefix, indent, width, maximum });
    assert.equal(fits.some((fit, index) => index > 0 && fit && !fits[index - 1]), false, context);
    const expected = text.slice(0, ends[Math.max(0, fits.lastIndexOf(true))]).trimEnd();
    assert.equal(fitText(text, prefix, maximum, indent, width), expected, context);
  };
  const ascii = ['a', ' ', '\n', '\t'];
  for (let size = 0; size <= 4; size++) for (let number = 0; number < ascii.length ** size; number++) {
    let text = '', remaining = number;
    for (let index = 0; index < size; index++) { text += ascii[remaining % ascii.length]; remaining = Math.floor(remaining / ascii.length); }
    for (const width of [1, 2, 3, 6, 7]) for (const maximum of [1, 2, 3]) check(text, '', '', width, maximum);
  }
  const unicode = ['a', ' ', '\n', '\t', '\r', '古', 'e\u0301', '👩‍👩‍👧‍👦', '\\u0009', '\x1b', '🙂', '\u0301', '\ufe0e', '\u200d'];
  let seed = 192837;
  const random = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed; };
  for (let trial = 0; trial < 1000; trial++) {
    let text = '';
    for (let index = 0, size = random() % 24; index < size; index++) text += unicode[random() % unicode.length];
    check(text, ['', '@tag ', '@\\u0009 ', '  '][random() % 4]!, ['', '  ', '↪ '][random() % 3]!, 1 + random() % 18, 1 + random() % 5);
  }
});
