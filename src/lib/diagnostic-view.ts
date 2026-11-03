import type { ClaimContextRecord } from './records.js';
import { inlineText } from './terminal-text.js';
type Diagnostic = ClaimContextRecord['diagnostics'][number];

export function diagnosticMeaning(diagnostic: Diagnostic): string {
  const problem = diagnostic.code === 2307 ? 'The analyzer could not locate a requested module or its interface description.'
    : diagnostic.code === 1005 ? 'The analyzer encountered malformed program or configuration text.'
      : 'The language analyzer reported a problem with the supplied program or configuration.';
  return `${problem} Information affected by this diagnostic may be incomplete or unreliable. Ask a coding agent to inspect and repair the reported issue before relying on that information.`;
}

export function diagnosticLines(contexts: readonly Pick<ClaimContextRecord, 'diagnostics'>[], indent = ''): string[] {
  const diagnostics = new Map(contexts.flatMap(context => context.diagnostics).map(item => [JSON.stringify(item), item]));
  return [...diagnostics.values()].map(item => `${indent}${diagnosticMeaning(item)} TypeScript TS${item.code} (${inlineText(item.category)})${item.path ? ` at ${inlineText(item.path)}${item.line ? `:${item.line}:${item.column}` : ''}` : ''}${item.message ? ` — analyzer message: ${inlineText(item.message)}` : ''}`);
}
