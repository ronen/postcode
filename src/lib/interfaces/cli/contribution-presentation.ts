import { arrangeContributionAnswer } from '../../contributions/answers.js';
import type { ContributionAnswerContent } from '../../contributions/answers.js';
import type { ContributionInspectionContent } from '../../contributions/inspection.js';
import { addressKey, itemKey } from '../../contributions/model.js';
import type { Qualification } from '../../contributions/model.js';
import { answerDisplay, answerIdentity, answerLines, answerContinuations, continuationLines } from './answer-presentation.js';
import type { AnswerContext } from './answer-presentation.js';
import { presentationMethods } from './methods.js';
import { finalizeInvestigationUsage, usageLines } from '../../investigation/usage-presentation.js';
import { usageSummary } from '../../investigation/reporting.js';
import type { InvestigationUsageReport } from '../../investigation/reporting.js';
import type { AnswerDelivery } from '../../application/contracts.js';
import { identityReference, recordId } from '../../identity.js';
import type { RecordId } from '../../records.js';
import { presentationChanges } from '../../presentation-contracts.js';
import type { PresentedOptions } from '../../presentation-contracts.js';
import type { ResolutionContext } from '../../resolution-context.js';
import { lookupQualifications, resolutionContextIdentity } from '../../resolution-context.js';
import { inlineText, terminalText } from '../../terminal-text.js';
import { sourceAttribution } from '../../evidence-view.js';
import { presentAssertion } from '../../documentation-view.js';
import { presentQualification } from '../../qualification-view.js';
import { diagnosticContexts, diagnosticLines, withDiagnosticMeanings } from '../../diagnostic-view.js';
import { renderMechanicalView } from '../../program-presentation.js';
import type { createMechanicalView } from '../../program-presentation.js';

type MechanicalView = ReturnType<typeof createMechanicalView>;
function nestedMechanical(view: MechanicalView): MechanicalView {
  if (!('diagnosticMeanings' in view)) return view;
  const { diagnosticMeanings: _meanings, ...body } = view;
  return body;
}
const ownerReport = (value: { readonly inability?: string | null; readonly statement?: string | null } | null): readonly string[] => value ? [
  ...(value.inability ? [`Producer-reported inability: ${value.inability}`] : []), ...(value.statement ? [value.statement] : [])] : [];
const qualified = (value: Qualification | null): readonly string[] => value ? [
  `${value.status} (${value.method})${value.scope ? `; scope: ${value.scope}` : ''}.`,
  ...(value.guarantee ? [value.guarantee] : []), ...value.limitations,
] : [];

/** Human-facing projection of fixed support: never serialize native/source-bearing item bodies. */
export function arrangeContributionView(content: ContributionAnswerContent | ContributionInspectionContent,
  options: AnswerContext & { readonly title: string; readonly presentation: PresentedOptions; readonly resolution?: ResolutionContext;
    readonly after?: string; readonly revisionPage?: number },
  reporting: AnswerDelivery['reporting'], usage: InvestigationUsageReport, references: ReadonlyMap<RecordId, string>, mechanical: MechanicalView | null = null) {
  const projection = content.projection, support = projection.support, session = projection.session;
  const inspection = projection.kind === 'contribution-inspection-projection';
  if (mechanical && (!inspection || projection.mechanical !== mechanical.projection.id)) throw new Error('Invalid mechanical inspection View');
  const selectedItems = new Set(inspection ? projection.items.map(itemKey) : projection.alternatives.flatMap(alternative => alternative.items.map(item => itemKey(item.address))));
  const selectedUses = new Set(inspection ? projection.uses.map(addressKey) : projection.alternatives.flatMap(alternative => alternative.uses.map(addressKey)));
  const owners = [...new Set([...support.items.filter(item => selectedItems.has(itemKey(item.address))).map(item => item.address.investigram),
    ...support.uses.filter(use => selectedUses.has(addressKey(use.address))).map(use => use.address.investigram),
    ...(inspection ? projection.subjects.flatMap(subject => subject.kind === 'investigram' ? [subject.investigram] : []) : [])])];
  const after = options.after?.replace(/^@/, '');
  const index = after === undefined ? -1 : owners.findIndex(owner => owner === after || references.get(owner) === after);
  const valid = after === undefined || index >= 0;
  const shownOwners = inspection ? (valid ? owners.slice(index + 1, index + 25) : []) : owners;
  const shown = new Set(shownOwners);
  const rows = support.items.filter(value => selectedItems.has(itemKey(value.address)) && shown.has(value.address.investigram)).map(value => {
    const item = value.item, owner = support.owners.find(owner => owner.investigram === value.address.investigram)!;
    const prose = item.type === 'prose' ? (item.body as { text: string }).text : null;
    return { address: value.address, reference: references.get(value.address.investigram)!, type: item.type,
      prose, names: value.identifyingNames, components: item.components, qualifications: [...qualified(owner.qualification), ...ownerReport(owner.report), ...qualified(item.qualification)],
      producer: owner.producer, origin: owner.origin, evidence: item.evidence,
      concerns: owner.producing, inconsistencies: value.inconsistencies,
      unpresented: prose !== null || value.identifyingNames.length ? null : `The exact ${item.type} body is available through application content. This listing does not render it.` };
  });
  const uses = support.uses.filter(value => selectedUses.has(addressKey(value.address)) && shown.has(value.address.investigram)).map(value => ({
    address: value.address, target: value.declaration.target, members: value.declaration.members, standing: value.status.standing,
    qualifications: qualified(value.declaration.qualification), grounds: value.declaration.grounds, membership: value.status.membership,
    producing: value.status.producing, inconsistencies: value.status.inconsistencies,
  }));
  // Display all material qualification for selected support, separately attributed. No raw bodies or captured inputs.
  const qualificationGroups = [
    ...support.owners.map(owner => ({ source: owner.investigram, statements: [...qualified(owner.qualification), ...ownerReport(owner.report)], concerns: owner.producing })),
    ...support.items.map(item => ({ source: itemKey(item.address), statements: qualified(item.item.qualification), concerns: [] })),
    ...support.metadata.filter(value => value.address.metadata === 'option').map(value => ({ source: JSON.stringify(value.address), statements: qualified(value.value.qualification), concerns: [] })),
    ...support.uses.map(use => ({ source: addressKey(use.address), statements: qualified(use.declaration.qualification), concerns: [...use.status.membership, ...use.status.producing] })),
  ].filter(group => group.statements.length || group.concerns.length);
  const page = options.revisionPage ?? 1;
  const qualification = qualificationGroups.slice((page - 1) * 24, page * 24);
  const changes = support.changes.map(change => ({ address: change.address, operation: change.declaration.operation,
    displaces: 'displaces' in change.declaration ? change.declaration.displaces : [], grounds: change.declaration.grounds, qualification: change.declaration.qualification, standing: change.standing }));
  const allConflicts = support.metadata.filter(value => 'endpoints' in value.value).map(value => ({ address: value.address, value: value.value }));
  const conflicts = allConflicts.slice((page - 1) * 24, page * 24);
  const details = { page, qualifications: qualificationGroups.length, omittedQualifications: qualificationGroups.length - qualification.length,
    conflicts: allConflicts.length, omittedConflicts: allConflicts.length - conflicts.length };
  const shownChanges = changes.slice((page - 1) * 24, page * 24);
  const status = { total: changes.length, page, changes: shownChanges, omitted: changes.length - shownChanges.length,
    next: Math.max(changes.length, qualificationGroups.length, allConflicts.length) > page * 24 ? page + 1 : null };
  const omitted = inspection ? valid ? Math.max(0, owners.length - index - 1 - shownOwners.length) : owners.length : 0;
  const next = omitted && shownOwners.length ? references.get(shownOwners.at(-1)!)! : null;
  const summary = projection.kind === 'contribution-projection' ? arrangeContributionAnswer({ projection }, options.title) : null;
  const sourceDetails = options.presentation.moreDetails ? support.evidence.flatMap(record => record.kind === 'source-evidence' ? [sourceAttribution(record)] : []) : [];
  const diagnostics = support.evidence.filter(record => record.kind === 'claim-context');
  const evidenceSupport = (mechanical && support.owners.every(owner => owner.producer.mechanism === 'mechanical') ? [] : support.evidence).flatMap(record => record.kind === 'recorded-assertion' ? [{ id: record.id, status: record.status,
    assertion: presentAssertion(record, options.presentation, true), qualification: presentQualification(diagnostics.find(context => context.id === record.context)!) }] : []);
  const continuation = after === undefined ? { none: true } : index >= 0 ? { reference: identityReference(session, owners[index]!) } : { literal: after };
  const key = recordId(session, 'contribution-arrangement', [presentationMethods.contributionPresentation, identityReference(session, projection.id),
    mechanical ? identityReference(session, mechanical.id) : null, options.title, options.presentation, answerIdentity(options), continuation, page,
    resolutionContextIdentity(session, options.resolution), reporting]);
  const view = finalizeInvestigationUsage(withDiagnosticMeanings({ ...answerDisplay(options), schema: 'postcode-contribution-view/1-experimental' as const,
    id: key, projection: { id: projection.id, session, lens: projection.lens, method: projection.method, parameters: projection.parameters }, title: options.title,
    presentation: options.presentation, mechanical: mechanical ? nestedMechanical(mechanical) : null, summary, rows, uses, qualification, conflicts, status, details,
    listing: { total: owners.length, shown: shownOwners.length, omitted, next, status: valid ? 'available' as const : 'unknown-continuation' as const },
    references: [...references], diagnostics, support: evidenceSupport, moreDetails: { items: sourceDetails }, reporting, usage,
    ...(options.resolution ? { resolution: options.resolution } : {}),
    continuations: answerContinuations(projection.id, options, options.presentation, { after: options.after, revisionPage: page, next, nextPage: status.next, unknownContinuation: !valid }),
    notices: [inspection ? 'Exact selected content and all retained explicit associated uses, with their captured standing. Listing order implies no authority.' : 'Current designated answers; equally standing alternatives remain separate.',
      'Inspect a contribution reference for a new status selection. Present this answer to preserve its captured selection and status.',
      ...(omitted ? [`${omitted} contribution(s) omitted from this page; use the supplied continuation.`] : []),
      ...(!valid ? ['The continuation is not in this answer’s fixed listing. This presentation retains failed status.'] : []),
      ...(status.omitted || details.omittedQualifications || details.omittedConflicts ? [`Status pages omit ${status.omitted} change(s), ${details.omittedQualifications} qualification group(s) and ${details.omittedConflicts} inconsistency report(s) from this page. Use --revision-page for the fixed details; all exact support remains in the application answer.`] : [])],
  }), usage, key, presentationMethods.contributionPresentation);
  return { view, investigationArrangementKey: key };
}
export type ContributionView = ReturnType<typeof arrangeContributionView>['view'];
export function renderContributionView(view: ContributionView): string {
  if (view.presentation.format === 'json') return `${JSON.stringify(view, null, 2)}\n`;
  const lines = [view.mechanical ? renderMechanicalView(view.mechanical, true) : inlineText(view.title), ...answerLines(view), ...presentationChanges(view.presentation), ...lookupQualifications(view.resolution), ...view.notices.map(inlineText)];
  if (view.reporting) {
    lines.push(view.reporting.reused ? 'Retained outcome; no new investigation.' : 'New investigation request.');
    const outcome = view.reporting.contribution?.outcome ?? view.reporting.unavailable;
    if (outcome) {
      const detail = 'reason' in outcome ? outcome.reason : 'diagnostic' in outcome ? outcome.diagnostic : null;
      lines.push(`Attempt: ${inlineText(outcome.kind)}${'code' in outcome ? ` (${inlineText(outcome.code)})` : ''}${detail ? `: ${inlineText(detail)}` : ''}`);
      if ('problems' in outcome) lines.push(...outcome.problems.map(problem => `Submission problem: ${inlineText(problem)}`));
    }
    const fulfillment = view.reporting.contribution?.fulfillment;
    if (fulfillment) lines.push(`Attempt fulfillment: ${inlineText(fulfillment.status)}.`);
    for (const alternative of view.reporting.contribution?.answers ?? []) {
      const standing = alternative.standing;
      lines.push(`Attempt answer ${inlineText(addressKey(alternative.designation))}: ${standing.state} when assessed.`);
      for (const displacement of standing.displacedBy) lines.push(
        `Attempt answer standing when assessed: ${displacement.operation === 'withdraw' ? 'withdrawn' : 'superseded'} by ${inlineText(addressKey(displacement.change))}.`);
      if (standing.state === 'displaced') lines.push('Returning this designation is neither endorsement nor re-adoption; making its content current again requires a new declaration.');
    }
    lines.push(...ownerReport(view.reporting.contribution?.report ?? null).map(statement => `Attempt report: ${inlineText(statement)}`));
  }
  if (view.summary) {
    if (view.summary.noCurrentAnswer) lines.push(view.summary.noCurrentAnswer.explanation);
    lines.push(...view.summary.notices.map(inlineText));
    for (const alternative of view.summary.alternatives) {
      lines.push(`Answer designation: ${inlineText(addressKey(alternative.designation))}`);
      lines.push(...alternative.prose.map(text => terminalText(text)));
      for (const group of alternative.qualifications) lines.push(...[...group.statements, ...(group.owner?.statements ?? [])].map(text => `Qualification (${inlineText(group.label)}): ${inlineText(text)}`));
      for (const diagram of alternative.diagrams) lines.push(terminalText(diagram.text));
      lines.push(...alternative.unpresented.map(item => inlineText(item.reason)));
    }
  } else for (const row of view.rows) {
    lines.push(`@${inlineText(row.reference)} / ${inlineText(row.address.item)} · ${inlineText(row.type)}`,
      ...(row.prose ? [terminalText(row.prose)] : row.names.map(name => `${inlineText(name.origin)}: ${inlineText(name.text)}`)),
      ...row.qualifications.map(text => `Qualification: ${inlineText(text)}`), ...(row.unpresented ? [inlineText(row.unpresented)] : []));
  }
  for (const use of view.uses) lines.push(`Use ${inlineText(addressKey(use.address))}: ${use.standing.state}${use.membership.length || use.producing.length ? '; needs reconsideration' : ''}${use.inconsistencies.length ? '; unresolved inconsistency' : ''}.`);
  for (const group of view.qualification) {
    lines.push(...group.statements.map(text => `Qualification (${inlineText(group.source)}): ${inlineText(text)}`));
    if (group.concerns.length) lines.push(`Needs reconsideration (${inlineText(group.source)}): ${group.concerns.length} cause(s); this does not establish error.`);
  }
  for (const change of view.status.changes) lines.push(`${inlineText(addressKey(change.address))}: ${change.operation}; ${inlineText(change.grounds?.text ?? '')}`,
    ...qualified(change.qualification).map(text => `Qualification: ${inlineText(text)}`));
  for (const conflict of view.conflicts) if ('grounds' in conflict.value) lines.push(`Unresolved inconsistency (${inlineText(JSON.stringify(conflict.address))}): ${inlineText(conflict.value.grounds.text)}`);
  for (const item of view.support) lines.push('Recorded assertion; truth and currency are not established.', terminalText(item.assertion.text),
    ...(item.assertion.omittedTextCharacters ? [`${item.assertion.omittedTextCharacters} assertion character(s) omitted.`] : []),
    ...(item.assertion.omittedTags ? [`${item.assertion.omittedTags} structured tag(s) omitted.`] : []),
    ...item.assertion.tags.map(tag => `@${inlineText(tag.name)} ${inlineText(tag.text)}${tag.omittedTextCharacters ? ` (${tag.omittedTextCharacters} characters omitted)` : ''}`),
    ...item.assertion.representationLimits.map(inlineText));
  for (const item of view.moreDetails.items) lines.push(`Evidence: ${inlineText(item.path)}${item.location.association === 'span' ? `:${item.location.from.line}:${item.location.from.column}` : ''}`);
  lines.push(...diagnosticLines(diagnosticContexts(view)), ...continuationLines(view));
  const attempt = view.usage.attempts.find(value => value.attempt === view.reporting?.attempt);
  if (attempt) lines.push(...usageLines(usageSummary([attempt]), `Attempt ${attempt.attempt} (${attempt.termination})`));
  lines.push(...usageLines(view.usage, 'Session'), ...view.usage.limitations.map(inlineText));
  return `${lines.join('\n')}\n`;
}
