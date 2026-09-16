import ts from 'typescript';
import type { CommonJSRecognition } from '../dependencies/records.js';

/** Ordered, pinned compiler protocol approved at the provider-contract checkpoint. */
export function recognizeCommonJS(program: ts.Program, checker: ts.TypeChecker, call: ts.CallExpression,
  syntaxFailures: ReadonlySet<ts.SourceFile>): { recognition: CommonJSRecognition; declarations: readonly ts.Declaration[] } {
  let lexical: CommonJSRecognition['lexical'] = 'not-established';
  let format: CommonJSRecognition['format'] = 'not-examined';
  let binding: CommonJSRecognition['binding'] = 'not-examined';
  let declarations: readonly ts.Declaration[] = [];
  const result = (outcome: CommonJSRecognition['outcome']) => ({ recognition: { outcome, lexical, format, binding }, declarations });
  const file = call.getSourceFile();
  if (program.getSourceFile(file.fileName) !== file || syntaxFailures.has(file)) return result('insufficient-lexical-evidence');
  let root: ts.Node = call;
  while (root.parent) {
    if (ts.isWithStatement(root.parent)) return result('insufficient-lexical-evidence');
    root = root.parent;
  }
  if (root !== file) return result('insufficient-lexical-evidence');
  let location = call;
  while (location.parent && ts.isCallExpression(location.parent)) location = location.parent;
  const local = checker.resolveName('require', location, ts.SymbolFlags.Value, true);
  if (local) {
    declarations = local.getDeclarations() ?? [];
    if (declarations.length === 0) return result('insufficient-lexical-evidence');
    lexical = 'local-binding';
    return result('alternative-binding');
  }
  lexical = 'no-local-binding';
  if (file.impliedNodeFormat !== undefined) {
    format = file.impliedNodeFormat === ts.ModuleKind.CommonJS ? 'commonjs-file' : 'esm-file';
    if (format === 'esm-file') return result('unsupported-format');
  } else {
    const configured = program.getCompilerOptions().module;
    format = configured === ts.ModuleKind.CommonJS ? 'commonjs-option'
      : configured === ts.ModuleKind.Preserve ? 'preserve-option' : configured === undefined ? 'absent' : 'unsupported-option';
    if (format === 'absent') return result('insufficient-context');
    if (format === 'unsupported-option') return result('unsupported-format');
  }
  declarations = checker.getSymbolAtLocation(call.expression)?.getDeclarations() ?? [];
  if (declarations.length === 0) {
    binding = 'absent';
    return result(format === 'preserve-option' ? 'insufficient-context' : 'recognized');
  }
  const contributions = declarations.map(declaration => {
    const ambient = declaration.getSourceFile().isDeclarationFile
      || (ts.getCombinedModifierFlags(declaration) & ts.ModifierFlags.Ambient) !== 0;
    if (!ambient || (ts.isFunctionDeclaration(declaration) && declaration.body !== undefined)
      || (ts.isVariableDeclaration(declaration) && declaration.initializer !== undefined)) return 'implementation';
    if (ts.isFunctionDeclaration(declaration)) {
      return checker.getSignatureFromDeclaration(declaration) ? 'callable' : 'insufficient';
    }
    if (!ts.isVariableDeclaration(declaration) || !declaration.type) return 'insufficient';
    const type = checker.getTypeFromTypeNode(declaration.type);
    if (type.flags & (ts.TypeFlags.Any | ts.TypeFlags.Unknown | ts.TypeFlags.Never | ts.TypeFlags.TypeParameter)) return 'insufficient';
    return type.getCallSignatures().length > 0 ? 'callable' : 'noncallable';
  });
  if (contributions.includes('implementation')) {
    binding = 'alternative';
    return result('alternative-binding');
  }
  if (contributions.includes('callable') && contributions.includes('noncallable')) {
    binding = 'conflicting';
    return result('conflicting-binding-evidence');
  }
  if (contributions.includes('insufficient')) {
    binding = 'insufficient';
    return result('insufficient-binding-evidence');
  }
  if (contributions.every(contribution => contribution === 'noncallable')) {
    binding = 'alternative';
    return result('alternative-binding');
  }
  binding = 'callable-ambient';
  return result('recognized');
}
