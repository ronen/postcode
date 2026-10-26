import { answerIdentity, answerDisplay, answerLines, continuationLines } from '../answer-presentation.js';
import type { AnswerContext } from '../answer-presentation.js';
import { documentationLines, documentationNotice, presentDocumentation } from '../documentation-view.js';
import { exportRoles, exportRoutes } from '../export-view.js';
import { freezeOwned } from '../immutable.js';
import { identityReference, methods, recordId } from '../identity.js';
import { presentQualification } from '../qualification-view.js';
import { lookupQualifications, resolutionContextIdentity } from '../resolution-context.js';
import type { ResolutionContext } from '../resolution-context.js';
import { presentationChanges, validatePresentationContent } from '../presentation-contracts.js';
import type { PresentedOptions, PresentationDefinition } from '../presentation-contracts.js';
import { inlineText, terminalText } from '../terminal-text.js';
import type { ProgramRecord, RecordId, SourceEvidenceRecord } from '../records.js';
import type { ModuleExportsContent } from './content.js';

/** Internal extension pairing; production catalogs do not expose this Lens. */
export const exportsPresentation: PresentationDefinition = freezeOwned({
  id: 'module-exports', contract: 'module-exports', default: true, formats: ['unicode', 'json'], source: 'supported',
  associationPage: false, revisionPage: false, precondition: 'qualified', requirements: { modules: ['exports', 'documentation'], groups: [] },
});
export function arrangeModuleExports(content: ModuleExportsContent, reference: string, presentation: PresentedOptions, title: string, resolution?: ResolutionContext, context: AnswerContext = {}) {
  validatePresentationContent({ contract: 'module-exports', value: content });
  const sources = new Map<RecordId, SourceEvidenceRecord>();
  const collect = (evidence: readonly ProgramRecord[]) => {
    if (presentation.sourceDetail) for (const item of evidence) if (item.kind === 'source-evidence') {
      sources.set(item.id, item);
    }
  };
  const shown = content.exports.slice(0, presentation.format === 'unicode' ? 50 : Infinity);
  const exports = shown.map(item => {
    collect(item.claim.evidence); if (item.symbol) collect(item.symbol.evidence);
    return { id: item.claim.record.id, ...item.claim.record.information, qualification: presentQualification(item.claim.context),
      symbolInformation: item.symbol?.record.information ?? null, originHandle: item.origin?.record.information.handle ?? null,
      ...presentDocumentation(item.documentation, presentation.format === 'unicode' ? 3 : Infinity, presentation, true, doc => collect(doc.evidence)) };
  });
  const { id, session, lens, subject, parameters } = content.projection;
  const view = { ...answerDisplay(context), schema: 'postcode-module-exports-view/1-experimental' as const, projection: { id, session, lens, subject, parameters },
    title, presentation, ...(resolution ? { resolution } : {}),
    module: { id: subject, reference, name: content.module.record.information.name, handle: content.module.record.information.handle,
      qualification: presentQualification(content.module.context) },
    exports, completeness: content.complete ? 'complete' as const : 'not-established' as const,
    outsidePopulation: content.projection.outsidePopulation,
    evaluations: [content.basis, ...content.evaluations].map(({ id, requirement, applicability, availability, execution, materialization, reason }) =>
      ({ id, requirement, applicability, availability, execution, materialization, reason })),
    qualifications: content.contexts.map(item => presentQualification(item.context)),
    omittedExports: content.exports.length - exports.length,
    ...(presentation.sourceDetail ? { sourceDetail: { level: 'declaration-locations-and-excerpts' as const, items: [...sources.values()] } } : {}) };
  return freezeOwned({ ...view, id: recordId(session, 'module-exports-view', [methods.exportsPresentation, identityReference(session, id), title,
    presentation, identityReference(session, subject), answerIdentity(context), resolutionContextIdentity(session, resolution)]) });
}
export type ModuleExportsView = ReturnType<typeof arrangeModuleExports>;
export function renderModuleExports(view: ModuleExportsView): string {
  if (view.presentation.format === 'json') return `${JSON.stringify(view, null, 2)}\n`;
  const lines = [inlineText(view.title), `Session ${view.projection.session.replace(/^session:/, '')}`,
    `${inlineText(view.module.name ?? view.module.handle)} (${inlineText(view.module.reference)})`,
    ...answerLines(view), ...continuationLines(view), ...presentationChanges(view.presentation), ...lookupQualifications(view.resolution),
    view.completeness === 'complete' ? `${view.exports.length + view.omittedExports} exports established; ${view.exports.length} shown.`
      : 'Export completeness is not established; an empty listing does not establish no exports.',
    ...(view.outsidePopulation ? ['The subject is outside the supplied evaluation population.'] : [])];
  for (const outcome of view.evaluations) lines.push(`${outcome.requirement}: ${outcome.applicability}, ${outcome.availability}, ${outcome.execution}, ${outcome.materialization}${outcome.reason ? `; ${inlineText(outcome.reason)}` : ''}`);
  for (const item of view.exports) {
    const details = exportRoutes(item);
    if (!item.routes.length) details.push('route unavailable');
    if (item.origin !== view.module.id) details.push(item.originHandle ? `from ${inlineText(item.originHandle)}` : 'origin not established');
    lines.push(`  ${inlineText(item.exportedName)} [${exportRoles(item)}]${details.length ? ` · ${details.join('; ')}` : ''}`);
    if (item.symbolInformation?.name && item.symbolInformation.name !== item.exportedName) lines.push(`    Semantic symbol: ${inlineText(item.symbolInformation.name)}`);
    lines.push(...documentationLines(item.documentation, item.omittedDocumentation, '    '));
  }
  if (view.exports.some(item => item.documentation.length)) lines.push(documentationNotice);
  if (view.exports.some(item => item.origin !== view.module.id || exportRoutes(item).length)) lines.push('Export relationships describe aliases and forwarding, not calls or dependencies.');
  if (view.omittedExports) lines.push(`${view.omittedExports} exports omitted.`);
  const contexts = [view.module.qualification, ...view.qualifications, ...view.exports.flatMap(item => [item.qualification, ...item.documentation.map(doc => doc.qualification)])];
  for (const limitation of new Set(contexts.flatMap(item => item.limitations))) lines.push(inlineText(limitation));
  for (const code of new Set(contexts.flatMap(item => item.diagnostics.map(diagnostic => diagnostic.code)))) lines.push(`Encountered TypeScript diagnostic: TS${code}`);
  if (view.sourceDetail) {
    lines.push('SOURCE DETAIL — explicit source escape');
    for (const source of view.sourceDetail.items) {
      lines.push(inlineText(source.path));
      if (source.location.association === 'span') lines.push(terminalText(source.location.excerpt.text));
    }
  }
  lines.push('Subject references identify retained records only in this Session; they do not persist after it closes.');
  return `${lines.join('\n')}\n`;
}
