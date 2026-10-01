import { sessionRevisions } from './revisions.js';
import { associatedView, renderAssociatedInvestigations } from './associations.js';
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
  request: { lens: 'summarize' | 'explain' | 'decompose' | 'examine' | 'inspect' | 'usage' | 'children' | 'parents'; unsupportedSubject?: 'investigram' | 'program-subject'; after?: string; revisionPage?: number; selector: string | null; reference?: boolean; presentation: Presentation; referenceLifetime?: 'session' | 'command' },
  selected: readonly RecordId[], result: InvestigationSelection | null, usage: InvestigationUsageReport) {
  const revisionIndex = sessionRevisions(store, session);
  const accounts = new Map<RecordId, Investigram>(), corrections = new Map<RecordId, Correction>();
  const provenances = new Map<RecordId, InvestigationProvenance>();
  const roots = result?.evaluation?.outcome.kind === 'accepted' ? [result.evaluation.outcome.root] : request.lens === 'inspect' ? [...selected] : [];
  const display: { original: RecordId; account: RecordId; parent: RecordId | null; role: 'result' | 'accompanying' }[] = [];
  const pending = roots.map(original => ({ original, parent: null as RecordId | null, role: 'result' as 'result' | 'accompanying' }));
  const displaced = new Set<RecordId>(), omittedAccounts = new Set<RecordId>();
  const historical = request.lens === 'inspect';
  // Displaced composition is disclosed separately; it is never spliced into a replacement.
  const rememberDisplaced = (root: RecordId) => {
    const queue = [root];
    for (let index = 0; index < queue.length; index++) {
      const id = queue[index]!;
      if (displaced.has(id)) continue;
      displaced.add(id); queue.push(...revisionIndex.accounts.get(id)!.children);
    }
  };
  while (pending.length) {
    const entry = pending.shift()!;
    const id = historical ? entry.original : revisionIndex.primary(entry.original);
    if (id !== entry.original) rememberDisplaced(entry.original);
    if (accounts.has(id)) continue;
    if (accounts.size >= 256) { omittedAccounts.add(id); continue; }
    const account = revisionIndex.accounts.get(id);
    if (!account) throw new Error('Expected investigram');
    accounts.set(id, account); display.push({ ...entry, account: id });
    const provenance = store.get(account.provenance);
    if (provenance.kind !== 'investigation-provenance') throw new Error('Expected investigation provenance');
    provenances.set(provenance.id, provenance);
    pending.push(...account.children.map(original => ({ original, parent: id, role: entry.role })));
    for (const correctionId of account.corrections) {
      const correction = store.get(correctionId);
      if (correction.kind !== 'investigram-correction') throw new Error('Expected correction');
      corrections.set(correctionId, correction);
      pending.push({ original: correction.replacement, parent: null, role: 'accompanying' });
    }
  }
  const revisionSubjects = [...new Set([...display.flatMap(item => [item.original, item.account]), ...displaced,
    ...selected.filter(id => revisionIndex.accounts.has(id))])];
  const revisions = revisionSubjects.map(id => revisionIndex.status(id, request.revisionPage));
  for (const status of revisions) for (const row of status.rows) {
    const correction = store.get(row.correction);
    if (correction.kind !== 'investigram-correction') throw new Error('Expected correction');
    corrections.set(correction.id, correction);
  }
  // The bounded relationship overview identifies every alternative by a precise
  // reference. Its own inspect page supplies full qualified historical content.
  const inconsistencies = [...new Map(revisions.flatMap(item => item.inconsistencies).map(item => [`${item.reporter}:${item.ordinal}`, item])).values()];
  for (const correction of corrections.values()) {
    const provenance = store.get(correction.provenance);
    if (provenance.kind !== 'investigation-provenance') throw new Error('Expected correction provenance');
    provenances.set(provenance.id, provenance);
  }
  for (const item of inconsistencies) {
    const reporter = revisionIndex.accounts.get(item.reporter)!;
    const provenance = store.get(reporter.provenance);
    if (provenance.kind !== 'investigation-provenance') throw new Error('Expected inconsistency provenance');
    provenances.set(provenance.id, provenance);
  }
  const compositionParents = new Map(store.investigations(session).flatMap(item => item.investigrams).flatMap(id => {
    const account = store.get(id);
    return account.kind === 'investigram' ? account.children.map(child => [child, account.id] as const) : [];
  }));
  const navigation = [...accounts.values()].map(account => {
    const provenance = provenances.get(account.provenance)!;
    return { account: account.id, compositionParent: compositionParents.get(account.id) ?? null, investigationSubject: provenance.request.subject };
  });
  const navigable = navigation.flatMap(item => [item.compositionParent, item.investigationSubject]).filter((id): id is RecordId => id !== null && store.get(id).kind === 'investigram');
  const references = new Map(store.entityIds([...new Set([...accounts.keys(), ...navigable, ...revisionSubjects, ...omittedAccounts, ...revisions.flatMap(item => [item.primary, item.familyPrimary, ...item.rows.flatMap(row => [row.target, row.replacement, row.reporter, ...(row.cause?.via ?? [])])]), ...inconsistencies.flatMap(item => [item.reporter, ...item.targets]), ...[...accounts.values()].flatMap(item => item.inconsistencies.flatMap(item => item.targets)), ...[...corrections.values()].flatMap(item => [item.reporter, item.target, item.replacement])])], 'investigram'));
  for (const [id, reference] of store.entityIds(navigation.map(item => item.investigationSubject).filter(id => store.get(id).kind === 'module'), 'module')) references.set(id, reference);
  const support = new Set([...accounts.values()].flatMap(item => [...item.evidence, ...item.associations.flatMap(item => item.evidence), ...item.inconsistencies.flatMap(item => item.evidence)]));
  for (const correction of corrections.values()) correction.evidence.forEach(id => support.add(id));
  for (const item of inconsistencies) item.evidence.forEach(id => support.add(id));
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
  const investigations = request.lens === 'inspect' ? associatedView(store, session, selected, request.after, request.referenceLifetime) : undefined;
  const projection = { id: recordId(session, 'investigation-projection', [methods.investigationPresentation, request,
    selected.map(id => identityReference(session, id)), result?.evaluation?.id ?? null, [...corrections.keys()], investigations ?? null, revisions, inconsistencies]),
    session, lens: request.lens, subject: 'selected-subjects', parameters: { selector: request.selector, reference: request.reference ?? false },
    selection: { matches: selected.length, status: request.unsupportedSubject ? 'unsupported-subject-lens' : selected.length === 1 ? 'selected' : selected.length ? 'ambiguous' : 'missing' } };
  return finalizeInvestigationUsage({ schema: 'postcode-investigation-view/1-experimental' as const, id: projection.id, projection,
    presentation: request.presentation, referenceLifetime: request.referenceLifetime ?? 'session',
    result, selected, candidates, unsupportedSubject: request.unsupportedSubject ?? null, references: [...references].map(([id, reference]) => ({ id, reference })),
    display, revisions, displaced: [...displaced], omittedAccounts: [...omittedAccounts], inconsistencies,
    navigation, ...(investigations ? { investigations } : {}),
    accounts: [...accounts.values()], corrections: [...corrections.values()], provenance: [...provenances.values()],
    support: supportDetails, usage,
    limitations: ['Generated accounts remain interpretation. Corrections are retained assertions, not established truth.',
      'Primary replacement selection uses acceptance recency, not credibility; conflicts remain unresolved. Exact inspection preserves originals. Needs reconsideration records corrected context exposure, not established error. Inspect replacement or cause references for qualified content; revision pages retain bounded relationship and cause details.',
      ...(['explain', 'decompose', 'examine'].includes(request.lens) && selected.length !== 1 ? ['Follow-up requires one exact investigram reference from this session.'] : []),
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
  const lines = [view.unsupportedSubject ? `${view.projection.lens} · unsupported subject/lens combination` : view.projection.lens === 'usage' ? 'Investigation usage' : view.projection.lens === 'summarize' ? 'Module summary' : requestTitle(view.projection.lens)];
  lines.push(view.referenceLifetime === 'command' ? 'References expire when this command ends. Use the shell for follow-up inspection.' : 'References remain bound for this session.');
  if (view.unsupportedSubject) lines.push(view.unsupportedSubject === 'investigram'
    ? `This reference identifies an investigram; ${view.projection.lens} does not support that kind of subject.`
    : `This reference identifies part of the program. ${view.projection.lens} requires an investigram reference from this session.`);
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
    const placement = view.display.find(item => item.account === account.id)!;
    if (placement.original !== account.id) lines.push(`  Updated display of @${reference(placement.original)}; replacement uses its own composition.`);
    const displayedChildren = view.display.filter(item => item.parent === account.id).map(item => item.account);
    if (displayedChildren.length) lines.push(`  Displayed composition: ${displayedChildren.map(id => `@${reference(id)}`).join(', ')}`);
    if (account.children.length) lines.push(`  Composition: ${account.children.map(id => `@${reference(id)}`).join(', ')}`);
    const provenance = view.provenance.find(item => item.id === account.provenance)!;
    lines.push(`  Operation: ${provenance.request.operation}; origin: ${provenance.agent.origin}; provider/model: ${inlineText(provenance.agent.provider)}/${inlineText(provenance.agent.model)}`);
    const navigation = view.navigation.find(item => item.account === account.id)!;
    lines.push(`  Investigation subject: @${reference(navigation.investigationSubject)} (provenance, not composition)`);
    if (navigation.compositionParent) lines.push(`  Composition parent: @${reference(navigation.compositionParent)}`);
    for (const inconsistency of account.inconsistencies) lines.push(`  Unresolved inconsistency: ${inlineText(inconsistency.reason)}; targets: ${inconsistency.targets.map(id => `@${reference(id)}`).join(', ')}`, ...inconsistency.qualifications.map(item => `    Qualification: ${inlineText(item)}`));
    if (account.evidence.length) lines.push(`  Evidence: ${account.evidence.map(inlineText).join(', ')}`);
  }
  for (const revision of view.revisions) {
    lines.push(`\nRevision status @${reference(revision.original)}: ${revision.superseded ? `superseded; primary @${reference(revision.primary)}` : 'original remains selected'}${revision.conflicting ? `; conflicting alternatives remain (family primary @${reference(revision.familyPrimary)})` : ''}.`);
    if (revision.needsReconsideration) lines.push(`  Needs reconsideration: ${revision.causeCount} correction causes. This does not establish error or trigger inference.`);
    for (const row of revision.rows) if (row.cause) lines.push(`  ${row.cause.direct ? 'Direct' : 'Transitive'} cause ${row.correction}: @${reference(row.target)} → @${reference(row.replacement)}; via ${row.cause.via.map(id => `@${reference(id)}`).join(', ')}${row.cause.omittedVia ? `; ${row.cause.omittedVia} additional proximal citations in provenance` : ''}.`);
    lines.push(`  Revision page ${revision.page}; ${revision.rows.length} of ${revision.total} relationships/causes.${revision.nextPage ? ` Inspect @${reference(revision.original)} --revision-page ${revision.nextPage} for more.` : ''}`);
  }
  if (view.displaced.length) lines.push(`Displaced original composition (not incorporated into replacement): ${view.displaced.map(id => `@${reference(id)}`).join(', ')}`);
  if (view.omittedAccounts.length) lines.push(`Account display bound; inspect omitted references: ${view.omittedAccounts.map(id => `@${reference(id)}`).join(', ')}`);
  for (const item of view.inconsistencies) lines.push(`Unresolved inconsistency reported by @${reference(item.reporter)}: ${inlineText(item.reason)}; targets ${item.targets.map(id => `@${reference(id)}`).join(', ')}`, ...item.qualifications.map(value => `  Qualification: ${inlineText(value)}`), `  Evidence: ${item.evidence.map(inlineText).join(', ') || 'none supplied'}`);
  for (const correction of view.corrections) lines.push(`\nCorrection reported by @${reference(correction.reporter)}: @${reference(correction.target)} → @${reference(correction.replacement)}`,
    `  Corrected subjects: ${correction.correctedSubjects.map(inlineText).join(', ')}`,
    `  Evidence: ${correction.evidence.length ? correction.evidence.map(inlineText).join(', ') : 'none supplied'}`,
    `  Reason: ${inlineText(correction.reason)}`, ...correction.qualifications.map(item => `  Qualification: ${inlineText(item)}`));
  if (view.investigations) lines.push(renderAssociatedInvestigations(view.investigations).trimEnd());
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
    ...usage.totals.map(total => `  ${inlineText(total.agent.provider)}/${inlineText(total.agent.model)} (${total.source})${total.agent.configuration.billingRoute ? `; billing route ${inlineText(String(total.agent.configuration.billingRoute))}` : ''}${total.execution ? `; reported model ${inlineText(total.execution.model)}, service tier ${inlineText(total.execution.serviceTier ?? 'unknown')}` : ''}: ${total.categories.map(item => `${inlineText(item.category)} ${item.value ?? 'unknown'} ${inlineText(item.unit)}${item.includedIn ? ` (subset of ${inlineText(item.includedIn)})` : ''}`).join('; ')}`)];
}

function requestTitle(lens: string): string {
  return ({ explain: 'Explain · investigram', decompose: 'Decompose · investigram', examine: 'Examine · investigram' } as Record<string, string>)[lens] ?? 'Inspect · investigram';
}
