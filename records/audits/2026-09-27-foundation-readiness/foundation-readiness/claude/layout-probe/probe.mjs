// Compare PostCode's current wrapText contract with display-width-aware alternatives.
// `currentWrap` is copied verbatim from src/lib/presentation.ts (private function) at the audited commit.
import { writeFileSync } from 'node:fs';
import stringWidth from 'string-width';
import wrapAnsi from 'wrap-ansi';
import { terminalText } from '../build/src/lib/terminal-text.js';

function currentWrap(text, indent, width = 88, continuation = indent) {
  const available = Math.max(1, width - Math.max([...indent].length, [...continuation].length));
  return terminalText(text.replace(/\r\n/g, '\n')).split('\n').flatMap(line => {
    const result = [];
    let rest = [...line];
    while (rest.length > available) {
      let end = rest.slice(0, available + 1).lastIndexOf(' ');
      if (end < 1) end = available;
      result.push((result.length ? continuation : indent) + rest.slice(0, end).join(''));
      rest = rest.slice(end + (rest[end] === ' ' ? 1 : 0));
    }
    result.push((result.length ? continuation : indent) + rest.join(''));
    return result;
  });
}

// Same contract (indent/continuation, single-space break consumption, hard break), measured in display
// columns over grapheme clusters instead of code points.
const segmenter = new Intl.Segmenter(undefined, { granularity: 'grapheme' });
function widthAwareWrap(text, indent, width = 88, continuation = indent) {
  const available = Math.max(1, width - Math.max(stringWidth(indent), stringWidth(continuation)));
  return terminalText(text.replace(/\r\n/g, '\n')).split('\n').flatMap(line => {
    const result = [];
    let rest = [...segmenter.segment(line)].map(item => item.segment);
    const columns = clusters => clusters.reduce((sum, cluster) => sum + stringWidth(cluster), 0);
    while (columns(rest) > available) {
      let fit = 0, used = 0;
      while (fit < rest.length && used + stringWidth(rest[fit]) <= available) used += stringWidth(rest[fit++]);
      let end = rest.slice(0, fit + 1).lastIndexOf(' ');
      if (end < 1) end = Math.max(1, fit);
      result.push((result.length ? continuation : indent) + rest.slice(0, end).join(''));
      rest = rest.slice(end + (rest[end] === ' ' ? 1 : 0));
    }
    result.push((result.length ? continuation : indent) + rest.join(''));
    return result;
  });
}

function wrapAnsiAdapter(text, indent, width = 88, continuation = indent) {
  const available = Math.max(1, width - Math.max(stringWidth(indent), stringWidth(continuation)));
  return terminalText(text.replace(/\r\n/g, '\n')).split('\n').flatMap(line =>
    wrapAnsi(line, available, { hard: true, trim: false, wordWrap: true }).split('\n')
      .map((part, index) => (index ? continuation : indent) + part));
}

const cases = {
  ascii: 'PostCode supervises development by presenting qualified structural information about modules, organization and dependencies.',
  doubleSpaces: 'Two  spaces  between  words  should  be  preserved  exactly  as  recorded  in  the  assertion  text  of  this  documentation.',
  leadingIndent: '    indented code-like line that is long enough to wrap beyond the available display width of the terminal renderer.',
  longWord: 'x'.repeat(200),
  cjk: '这个模块负责解析配置文件并提供类型安全的访问接口，同时保留所有来源信息和限定条件以便后续展示和审查使用。'.repeat(2),
  combining: 'é'.repeat(100),
  emojiZwj: '👩‍👩‍👧 '.repeat(40),
  tabs: 'col1\tcol2\tcol3\t'.repeat(10),
  escapedControl: `danger \u001b[31mred\u001b[0m ${'word '.repeat(20)}`,
};
const maxColumns = lines => Math.max(...lines.map(line => stringWidth(line)));
const out = {};
for (const [name, text] of Object.entries(cases)) {
  const current = currentWrap(text, '  ', 88, '  ↪ ');
  const aware = widthAwareWrap(text, '  ', 88, '  ↪ ');
  const adapter = wrapAnsiAdapter(text, '  ', 88, '  ↪ ');
  out[name] = {
    current: { lines: current.length, maxDisplayColumns: maxColumns(current) },
    widthAware: { lines: aware.length, maxDisplayColumns: maxColumns(aware), sameAsCurrent: JSON.stringify(aware) === JSON.stringify(current) },
    wrapAnsi: { lines: adapter.length, maxDisplayColumns: maxColumns(adapter), sameAsCurrent: JSON.stringify(adapter) === JSON.stringify(current),
      sameAsWidthAware: JSON.stringify(adapter) === JSON.stringify(aware),
      contentPreserved: adapter.map((line, index) => line.slice((index ? '  ↪ ' : '  ').length)).join('') === terminalText(text).replace(/ /g, '') ? 'n/a' : undefined },
    sample: { current: current.slice(0, 2), wrapAnsi: adapter.slice(0, 2) },
  };
}
out.stringWidthOfTab = stringWidth('\t');
out.stringWidthOfEscapedControlText = stringWidth(terminalText('\u001b[31m'));
out.stringWidthOfRawAnsi = stringWidth('\u001b[31mred\u001b[0m');
writeFileSync(new URL('./results.json', import.meta.url), `${JSON.stringify(out, null, 2)}\n`);
console.log(JSON.stringify(Object.fromEntries(Object.entries(out).map(([k, v]) => [k, typeof v === 'object' ? { current: v.current, widthAware: v.widthAware, wrapAnsi: v.wrapAnsi && { ...v.wrapAnsi, contentPreserved: undefined } } : v])), null, 1));
