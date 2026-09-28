import stringWidth from 'string-width';
import { terminalText } from './terminal-text.js';

const segmenter = new Intl.Segmenter('und', { granularity: 'grapheme' });
export const displayWidth = (text: string): number => stringWidth(text, { ambiguousIsNarrow: true });
export const padDisplay = (text: string, width: number): string => text + ' '.repeat(Math.max(0, width - displayWidth(text)));
export function codePointLength(text: string): number { let length = 0; for (const _ of text) length++; return length; }

interface Token { raw: string; display: string; width: number; end: number; characters: number }
function tokens(text: string): Token[] {
  const result: Token[] = [];
  let offset = 0;
  // LF is structural; CR remains an escaped character, including in CRLF.
  for (const [lineIndex, line] of text.split('\n').entries()) {
    if (lineIndex) { result.push({ raw: '\n', display: '\n', width: 0, end: offset + 1, characters: 1 }); offset++; }
    const segments = [...segmenter.segment(line)];
    for (let cursor = 0; cursor < segments.length; cursor++) {
      const { segment, index } = segments[cursor]!;
      // Escapes already produced by inlineText must also remain indivisible.
      let end = index + segment.length;
      if (/^\\u[\da-f]{4}/i.test(line.slice(index, index + 6))) {
        while (end < index + 6) {
          const next = segments[++cursor]!;
          end = next.index + next.segment.length;
        }
      }
      const raw = line.slice(index, end);
      const display = terminalText(raw);
      result.push({ raw, display, width: displayWidth(display), end: offset + end, characters: codePointLength(raw) });
    }
    offset += line.length;
  }
  return result;
}

/** Display cells and indivisible escaped graphemes; omission counts use original code points. */
export function layoutText(text: string, indent: string, width = 88, continuation = indent): { lines: string[]; omittedCharacters: number } {
  const available = Math.max(0, width - Math.max(displayWidth(indent), displayWidth(continuation)));
  const logical: Token[][] = [[]];
  for (const token of tokens(text)) {
    if (token.raw === '\n') logical.push([]);
    else logical.at(-1)!.push(token);
  }
  const lines: string[] = [];
  let omittedCharacters = 0;
  for (const line of logical) {
    let start = 0, remaining = line.reduce((sum, token) => sum + token.width, 0), wrapped = false;
    while (remaining > available) {
      let end = start, columns = 0, space = -1;
      while (end < line.length) {
        const token = line[end]!;
        if (token.raw === ' ' && columns <= available) space = end;
        if (columns + token.width > available) break;
        columns += token.width; end++;
      }
      if (end === start) {
        const token = line[start++]!;
        omittedCharacters += token.characters; remaining -= token.width;
        continue;
      }
      const cut = space > start ? space : end;
      lines.push((wrapped ? continuation : indent) + line.slice(start, cut).map(token => token.display).join(''));
      wrapped = true;
      const next = cut + (line[cut]?.raw === ' ' ? 1 : 0);
      for (let index = start; index < next; index++) remaining -= line[index]!.width;
      start = next;
    }
    lines.push((wrapped ? continuation : indent) + line.slice(start).map(token => token.display).join(''));
  }
  return { lines, omittedCharacters };
}

/** A source prefix whose rendered form uses the same layout calculation as rendering. */
export function fitText(text: string, prefix: string, maximumLines: number, indent = '       ', width = 88): string {
  const boundaries = [0, ...tokens(text).map(token => token.end)];
  let low = 0, high = boundaries.length - 1;
  while (low < high) {
    const middle = Math.ceil((low + high) / 2);
    const layout = layoutText(prefix + text.slice(0, boundaries[middle]), indent, width);
    if (layout.lines.length <= maximumLines && layout.omittedCharacters === 0) low = middle;
    else high = middle - 1;
  }
  return text.slice(0, boundaries[low]).trimEnd();
}

export function boundedText(text: string, maximum: number, graphemeSafe: boolean): { text: string; omittedTextCharacters: number } {
  const total = codePointLength(text);
  let kept = 0, end = 0;
  if (graphemeSafe) {
    for (const token of tokens(text)) {
      if (kept + token.characters > maximum) break;
      kept += token.characters; end = token.end;
    }
  } else {
    for (const character of text) {
      if (kept === maximum) break;
      kept++; end += character.length;
    }
  }
  return { text: text.slice(0, end), omittedTextCharacters: total - kept };
}
