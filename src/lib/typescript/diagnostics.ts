import type ts from 'typescript';

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
