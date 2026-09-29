import { identityReference, methods, recordId } from '../identity.js';
import { freezeOwned } from '../immutable.js';
import { inlineText, terminalText } from '../terminal-text.js';
import type { ProgramRecordStore, RecordId, SessionId, ProgramRecord } from '../records.js';
import type { Presentation } from '../presentation.js';
import type { Investigram, Correction, InvestigationProvenance } from './contracts.js';
import type { InvestigationSelection } from './evaluation.js';
import { usageSummary } from './reporting.js';
import type { InvestigationUsageReport } from './reporting.js';

export function createInvestigationView(store: ProgramRecordStore, session: SessionId,
  request: { lens: 'summarize' | 'inspect' | 'usage' | 'children' | 'parents'; unsupportedSubject?: 'investigram'; selector: string | null; reference?: boolean; presentation: Presentation; referenceLifetime?: 'session' | 'command' },
  selected: readonly RecordId[], result: InvestigationSelection | null, usage: InvestigationUsageReport) {
  const accounts = new Map<RecordId, Investigram>(), corrections = new Map<RecordId, Correction>();
  const provenances = new Map<RecordId, InvestigationProvenance>();
  const pending = result?.evaluation?.outcome.kind === 'accepted' ? [result.evaluation.outcome.root] : request.lens === 'inspect' ? [...selected] : [];
  while (pending.length) {
    const id = pending.pop()!;
    if (accounts.has(id)) continue;
    const account = store.get(id);
    if (account.kind !== 'investigram') throw new Error('Expected investigram');
    accounts.set(id, account);
    const provenance = store.get(account.provenance);
    if (provenance.kind !== 'investigation-provenance') throw new Error('Expected investigation provenance');
    provenances.set(provenance.id, provenance);
    pending.push(...account.children);
    for (const id of account.corrections) {
      const correction = store.get(id);
      if (correction.kind !== 'investigram-correction') throw new Error('Expected correction');
      corrections.set(id, correction); pending.push(correction.replacement);
    }
  }
  const revisions = store.investigations(session).flatMap(item => item.corrections).map(id => store.get(id))
    .filter((item): item is Correction => item.kind === 'investigram-correction' && accounts.has(item.target));
  for (const item of revisions) corrections.set(item.id, item);
  for (const correction of corrections.values()) {
    const provenance = store.get(correction.provenance);
    if (provenance.kind !== 'investigation-provenance') throw new Error('Expected correction provenance');
    provenances.set(provenance.id, provenance);
  }
  const references = store.entityIds([...new Set([...accounts.keys(), ...[...corrections.values()].flatMap(item => [item.reporter, item.target, item.replacement])])], 'investigram');
  const support = new Set([...accounts.values()].flatMap(item => [...item.evidence, ...item.associations.flatMap(item => item.evidence), ...item.inconsistencies.flatMap(item => item.evidence)]));
  for (const correction of corrections.values()) correction.evidence.forEach(id => support.add(id));
  const candidates = request.lens === 'summarize' && !request.unsupportedSubject ? selected.map(id => {
    const module = store.get(id);
    const claim = module.kind === 'module' ? store.get(module.claim) : null;
    if (claim?.kind !== 'claim' || claim.information.type !== 'module') throw new Error('Expected module naming claim');
    return { id, reference: store.entityIds([id], 'module').get(id)!, name: claim.information.name, handle: claim.information.handle };
  }) : [];
  const supportDetails = [...support].map(id => {
    const record = store.get(id);
    const exposures = [...provenances.values()].flatMap(item => {
      const forms = [...(item.suppliedEvidence.includes(id) ? ['full'] : []), ...(item.summarizedEvidence.includes(id) ? ['summary'] : []),
        ...(item.citations.includes(id) ? ['prior-interpretation'] : [])];
      return forms.length ? [{ provenance: item.id, forms }] : [];
    });
    const context = record.kind === 'claim' || record.kind === 'recorded-assertion' ? store.get(record.context) : null;
    return { id, kind: record.kind, method: record.method, exposures,
      ...(record.kind === 'claim' ? { information: record.information } : {}),
      ...(record.kind === 'recorded-assertion' ? { assertion: record.text, tags: record.tags, status: record.status } : {}),
      ...(context?.kind === 'claim-context' ? { qualification: context } : {}),
      ...(record.kind === 'captured-content' ? { coverage: record.coverage, contentDigest: record.contentDigest, mapping: record.mapping, limitations: record.limitations } : {}),
    };
  });
  const sources = new Map<RecordId, ProgramRecord>();
  if (request.presentation.sourceDetail) for (const id of support) {
    const record = store.get(id);
    const context = record.kind === 'claim' || record.kind === 'recorded-assertion' ? store.get(record.context) : record;
    const ids = context.kind === 'claim-context' ? context.evidence : [record.kind === 'captured-content' ? record.mapping : record.id];
    for (const id of ids) {
      const source = store.get(id);
      if (source.kind === 'source-evidence' || source.kind === 'repository-artifact') sources.set(source.id, source);
    }
  }
  const projection = { id: recordId(session, 'investigation-projection', [methods.investigationPresentation, request,
    selected.map(id => identityReference(session, id)), result?.evaluation?.id ?? null, [...corrections.keys()]]),
    session, lens: request.lens, subject: 'selected-subjects', parameters: { selector: request.selector, reference: request.reference ?? false },
    selection: { matches: selected.length, status: request.unsupportedSubject ? 'unsupported-subject-lens' : selected.length === 1 ? 'selected' : selected.length ? 'ambiguous' : 'missing' } };
  return finalizeInvestigationUsage({ schema: 'postcode-investigation-view/1-experimental' as const, id: projection.id, projection,
    presentation: request.presentation, referenceLifetime: request.referenceLifetime ?? 'session',
    result, selected, candidates, unsupportedSubject: request.unsupportedSubject ?? null, references: [...references].map(([id, reference]) => ({ id, reference })),
    accounts: [...accounts.values()], corrections: [...corrections.values()], provenance: [...provenances.values()],
    support: supportDetails, usage,
    limitations: ['Generated accounts remain interpretation. Corrections are retained assertions, not established truth.',
      'This checkpoint shows immutable originals and explicit correction links; replacement selection and reconsideration display arrive in a later milestone.',
      ...(request.lens === 'summarize' && selected.length !== 1 ? ['Summary requires one exact module; resolve a missing or ambiguous selection before investigation.'] : [])],
    ...(request.presentation.sourceDetail ? { sourceDetail: { level: 'investigation-support' as const, items: [...sources.values()] } } : {}),
  }, usage);
}
/** Usage is view reporting, independent of the retained interpretation projection. */
export function finalizeInvestigationUsage<T extends { readonly id: RecordId;
  readonly projection: { readonly id: RecordId; readonly session: SessionId }; readonly usage: InvestigationUsageReport }>(view: T, usage: InvestigationUsageReport): T {
  const session = view.projection.session;
  const id = recordId(session, 'investigation-view', [methods.investigationPresentation, identityReference(session, view.projection.id), usage]);
  return freezeOwned({ ...view, id, usage });
}
export type InvestigationView = ReturnType<typeof createInvestigationView>;
export function renderInvestigationView(view: InvestigationView): string {
  if (view.presentation.format === 'json') return `${JSON.stringify(view)}\n`;
  const reference = (id: RecordId) => view.references.find(item => item.id === id)?.reference ?? id;
  const lines = [view.unsupportedSubject ? `${view.projection.lens} · unsupported subject/lens combination` : view.projection.lens === 'usage' ? 'Investigation usage' : view.projection.lens === 'summarize' ? 'Module summary' : 'Inspect · investigram'];
  lines.push(view.referenceLifetime === 'command' ? 'References expire when this command ends. Use the shell for follow-up inspection.' : 'References remain bound for this session.');
  if (view.unsupportedSubject) lines.push(`The reference is bound to an ${view.unsupportedSubject}; ${view.projection.lens} does not support that subject kind.`);
  if (view.result) {
    lines.push(view.result.reused ? 'Retained outcome; no new investigation.' : 'New investigation request.');
    const outcome = view.result.evaluation?.outcome ?? view.result.unavailable;
    if (outcome && outcome.kind !== 'accepted') lines.push(`${outcome.kind}: ${inlineText('reason' in outcome ? outcome.reason : outcome.diagnostic)}`);
  }
  if (!view.accounts.length && view.projection.lens !== 'usage') lines.push(`Selection: ${view.projection.selection.status} (${view.projection.selection.matches} matches).`);
  for (const candidate of view.candidates) lines.push(`Module @${candidate.reference}: ${inlineText(candidate.name ?? candidate.handle)}`);
  for (const account of view.accounts) {
    lines.push(`\n@${reference(account.id)} · interpretation`, terminalText(account.prose), `Referent: ${inlineText(account.referent.description)}`);
    for (const qualification of account.qualifications) lines.push(`  Qualification: ${inlineText(qualification)}`);
    if (account.children.length) lines.push(`  Composition: ${account.children.map(id => `@${reference(id)}`).join(', ')}`);
    const provenance = view.provenance.find(item => item.id === account.provenance)!;
    lines.push(`  Operation: ${provenance.request.operation}; origin: ${provenance.agent.origin}; provider/model: ${inlineText(provenance.agent.provider)}/${inlineText(provenance.agent.model)}`);
    if (account.evidence.length) lines.push(`  Evidence: ${account.evidence.map(inlineText).join(', ')}`);
  }
  for (const correction of view.corrections) lines.push(`\nCorrection reported by @${reference(correction.reporter)}: @${reference(correction.target)} → @${reference(correction.replacement)}`,
    `  Corrected subjects: ${correction.correctedSubjects.map(inlineText).join(', ')}`,
    `  Evidence: ${correction.evidence.length ? correction.evidence.map(inlineText).join(', ') : 'none supplied'}`,
    `  Reason: ${inlineText(correction.reason)}`, ...correction.qualifications.map(item => `  Qualification: ${inlineText(item)}`));
  if (view.projection.lens === 'inspect') for (const support of view.support) lines.push(`  Support (exposure identified by provenance): ${terminalText(JSON.stringify(support))}`);
  // Changes to this section or JSON source fields must stay aligned with
  // src/lib/source-disclosure.ts and test/source-disclosure.test.ts.
  if (view.sourceDetail) lines.push('\nSource support (captured locations and excerpts):', terminalText(JSON.stringify(view.sourceDetail.items, null, 2)));
  const attempt = view.usage.attempts.find(item => item.attempt === view.result?.attempt);
  if (attempt) lines.push(...usageLines(usageSummary([attempt]), `Attempt ${attempt.attempt} (${attempt.termination})`));
  if (view.projection.lens === 'usage') for (const item of view.usage.attempts) lines.push(...usageLines(usageSummary([item]), `Attempt ${item.attempt} (${item.termination})`));
  lines.push(...usageLines(view.usage, 'Session'));
  lines.push(...view.limitations.map(inlineText), ...view.usage.limitations.map(inlineText));
  return `${lines.join('\n')}\n`;
}

export function usageLines(usage: InvestigationUsageReport, label: string): string[] {
  return [`${label} reported usage: ${usage.calls} calls; ${usage.missingCalls} unknown; ${usage.anomalousCalls} anomalous.`,
    ...usage.totals.map(total => `  ${inlineText(total.agent.provider)}/${inlineText(total.agent.model)} (${total.source})${total.execution ? `; reported model ${inlineText(total.execution.model)}, service tier ${inlineText(total.execution.serviceTier ?? 'unknown')}` : ''}: ${total.categories.map(item => `${inlineText(item.category)} ${item.value ?? 'unknown'} ${inlineText(item.unit)}${item.includedIn ? ` (subset of ${inlineText(item.includedIn)})` : ''}`).join('; ')}`)];
}
