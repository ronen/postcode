import ts from 'typescript';
import type { ClaimContextRecord } from '../records.js';

/** Select source diagnostics without rescanning other files; preserve compiler order. */
export function diagnosticLookup(diagnostics: readonly ts.Diagnostic[]) {
  const byFile = new Map<ts.SourceFile | undefined, { diagnostic: ts.Diagnostic; order: number }[]>();
  diagnostics.forEach((diagnostic, order) => {
    const bucket = byFile.get(diagnostic.file) ?? [];
    bucket.push({ diagnostic, order }); byFile.set(diagnostic.file, bucket);
  });
  return (files: Iterable<ts.SourceFile>, includeGlobal = false): ts.Diagnostic[] => {
    const selected = new Set<ts.SourceFile | undefined>(files);
    if (includeGlobal) selected.add(undefined);
    return [...selected].flatMap(file => byFile.get(file) ?? []).sort((a, b) => a.order - b.order).map(item => item.diagnostic);
  };
}

/** Preserve useful original messages and provenance without exposing compiler objects. */
export function capturedDiagnostic(diagnostic: ts.Diagnostic): ClaimContextRecord['diagnostics'][number] {
  const position = diagnostic.file && diagnostic.start !== undefined ? ts.getLineAndCharacterOfPosition(diagnostic.file, diagnostic.start) : null;
  return { code: diagnostic.code, category: ts.DiagnosticCategory[diagnostic.category]!.toLowerCase(),
    message: ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n'),
    ...(diagnostic.file ? { path: diagnostic.file.fileName } : {}),
    ...(position ? { line: position.line + 1, column: position.character + 1 } : {}) };
}
