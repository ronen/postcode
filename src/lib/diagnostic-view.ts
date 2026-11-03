import type { ClaimContextRecord } from './records.js';
import { inlineText } from './terminal-text.js';
type Diagnostic = ClaimContextRecord['diagnostics'][number];

export function diagnosticMeaning(diagnostic: Diagnostic): string {
  const problem = diagnostic.code === 2307 ? 'The analyzer could not locate a requested module or its interface description.'
    : diagnostic.code === 1005 ? 'The analyzer encountered malformed program or configuration text.'
      : 'The language analyzer reported a problem with the supplied program or configuration.';
  return `${problem} Information affected by this diagnostic may be incomplete or unreliable. Ask a coding agent to inspect and repair the reported issue before relying on that information.`;
}

/** One meaning per code per View/report; contexts retain complete original occurrences. */
export function withDiagnosticMeanings<T>(value: T): T & { diagnosticMeanings?: { code: number; explanation: string }[] } {
  const meanings = new Map<number, string>();
  const visit = (item: unknown): void => {
    if (!item || typeof item !== 'object') return;
    if (Array.isArray(item)) { item.forEach(visit); return; }
    for (const [key, child] of Object.entries(item)) {
      if (key === 'diagnostics' && Array.isArray(child)) {
        for (const diagnostic of child) if (diagnostic && typeof diagnostic.code === 'number') meanings.set(diagnostic.code, diagnosticMeaning(diagnostic));
      } else if (key !== 'diagnosticMeanings') visit(child);
    }
  };
  visit(value);
  return { ...value, ...(meanings.size ? { diagnosticMeanings: [...meanings].map(([code, explanation]) => ({ code, explanation })) } : {}) };
}

/** Bound occurrence detail without weakening qualification or changing captured diagnostics. */
export function diagnosticLines(contexts: readonly Pick<ClaimContextRecord, 'diagnostics'>[], indent = ''): string[] {
  const diagnostics = new Map(contexts.flatMap(context => context.diagnostics).map(item => [JSON.stringify(item), item]));
  const groups = new Map<number, Diagnostic[]>();
  for (const item of diagnostics.values()) { const group = groups.get(item.code) ?? []; group.push(item); groups.set(item.code, group); }
  const shown = [...groups].slice(0, 5);
  const lines = shown.flatMap(([code, items]) => [
    `${indent}TypeScript TS${code}: ${diagnosticMeaning(items[0]!)}`,
    ...items.slice(0, 3).map(item => `${indent}  ${inlineText(item.category)}${item.path ? ` at ${inlineText(item.path)}${item.line ? `:${item.line}:${item.column}` : ''}` : ''}${item.message ? ` — analyzer message: ${inlineText(item.message)}` : ''}`),
    ...(items.length > 3 ? [`${indent}  … ${items.length - 3} diagnostic occurrence(s) omitted for TS${code}; full locations and messages remain in JSON.`] : []),
  ]);
  if (groups.size > shown.length) lines.push(`${indent}… ${groups.size - shown.length} diagnostic code(s) and ${[...groups.values()].slice(5).reduce((sum, items) => sum + items.length, 0)} occurrence(s) omitted; affected information may be incomplete or unreliable. Full diagnostics remain in JSON.`);
  return lines;
}
