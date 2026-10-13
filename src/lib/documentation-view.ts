import type { DocumentationContent } from './module-content.js';
import type { ClaimContextRecord, RecordedAssertion } from './records.js';
import type { Presentation } from './presentation.js';
import { presentQualification } from './qualification-view.js';
import { boundedText, codePointLength, fitText, layoutText } from './terminal-layout.js';
import { inlineText } from './terminal-text.js';
type Qualification = Omit<ClaimContextRecord, 'kind' | 'evidence' | 'inputs'>;
export type Documentation = Pick<RecordedAssertion, 'id' | 'status' | 'text'> & {
  omittedTextCharacters: number;
  tags: readonly { name: string; text: string; omittedTextCharacters: number }[];
  omittedTags: number;
  association: 'module' | 'origin-symbol' | 'export-alias'; qualification: Qualification;
};

function wrapText(text: string, indent: string, width = 88, continuation = indent): string[] {
  const result = layoutText(text, indent, width, continuation);
  return [...result.lines, ...(result.omittedCharacters
    ? [`${indent}… ${result.omittedCharacters} character(s) omitted because indivisible display text exceeds the available width.`] : [])];
}

export function presentDocumentation(associations: readonly DocumentationContent[], maximumDocs: number,
  presentation: Presentation, detailed: boolean, onShown?: (association: DocumentationContent['association']) => void) {
  const excerpt = (text: string, maximum: number) => boundedText(text, maximum, presentation.format === 'unicode');
  const shown = associations.slice(0, maximumDocs);
  const items: Documentation[] = shown.map(({ association, assertion: supported }) => {
    const claim = association.record, assertion = supported.record;
    onShown?.(association);
    const maximumTags = detailed ? 20 : 5;
    // Keep source-oriented examples/links in the assertion record, outside normal conceptual excerpts.
    const prose = assertion.text.replace(/```[\s\S]*?```/g, '').trim();
    let proseExcerpt = excerpt(prose, detailed ? 2000 : 400);
    let remainingLines = presentation.format === 'unicode' ? 8 : Infinity;
    if (Number.isFinite(remainingLines)) proseExcerpt = excerpt(prose, codePointLength(fitText(proseExcerpt.text, '', remainingLines)));
    remainingLines -= proseExcerpt.text ? wrapText(proseExcerpt.text, '       ').length : 0;
    const conceptualTags = assertion.tags.filter(tag => tag.name !== 'example' && tag.name !== 'see');
    const tags: Documentation['tags'][number][] = [];
    for (const tag of conceptualTags.slice(0, maximumTags)) {
      if (remainingLines <= 0) break;
      const bounded = excerpt(tag.text, 300);
      const text = Number.isFinite(remainingLines) ? fitText(bounded.text, `@${inlineText(tag.name)} `, remainingLines) : bounded.text;
      if (Number.isFinite(remainingLines) && wrapText(`@${inlineText(tag.name)} ${text}`, '       ').length > remainingLines) break;
      tags.push({ name: tag.name, text, omittedTextCharacters: codePointLength(tag.text) - codePointLength(text) });
      remainingLines -= wrapText(`@${inlineText(tag.name)} ${text}`, '       ').length;
    }
    return { id: assertion.id, status: assertion.status,
      text: proseExcerpt.text, omittedTextCharacters: codePointLength(assertion.text) - codePointLength(proseExcerpt.text),
      tags, omittedTags: assertion.tags.length - tags.length,
      association: claim.information.association, qualification: presentQualification(association.context) };
  });
  return { documentation: items, omittedDocumentation: associations.length - shown.length };
}

export const documentationNotice = 'Documentation entries are recorded assertions; truth, currency, and completeness are not established.';

export const documentationLabel = (association: Documentation['association'], mixed: boolean) =>
  association === 'export-alias' ? 'Documentation from export alias:'
    : mixed && association === 'origin-symbol' ? 'Documentation from original symbol:' : 'Documentation:';

export function documentationLines(items: readonly Documentation[], omitted: number, indent: string): string[] {
  const lines: string[] = [];
  const associations = [...new Set(items.map(doc => doc.association))];
  for (const association of associations) {
    lines.push(`${indent}${documentationLabel(association, associations.length > 1)}`);
    const contributions = items.filter(doc => doc.association === association);
    for (const [index, doc] of contributions.entries()) {
      if (index) lines.push(indent);
      if (doc.text) lines.push(...wrapText(doc.text, `${indent}  `));
      if (doc.omittedTextCharacters) lines.push(`${indent}  … ${doc.omittedTextCharacters} assertion character(s) omitted.`);
      for (const tag of doc.tags) lines.push(...wrapText(`@${inlineText(tag.name)} ${tag.text}${tag.omittedTextCharacters ? ` … (${tag.omittedTextCharacters} characters omitted)` : ''}`, `${indent}  `));
      if (doc.omittedTags) lines.push(`${indent}  … ${doc.omittedTags} structured tag(s) omitted (including source-oriented examples/links).`);
    }
  }
  if (omitted) lines.push(`${indent}… ${omitted} documentation assertion(s) omitted.`);
  return lines;
}
