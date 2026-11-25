import type { ContributionAnswer, ContributionAnswerContent } from '../../../src/lib/contributions/answers.js';
import type { AnswerSupport } from '../../../src/lib/contributions/answer-support.js';
import type { AssociationAddress, DeclarationAddress, InvestigramId, ItemAddress, MetadataAddress, Producer, Qualification } from '../../../src/lib/contributions/model.js';
import { addressKey, itemKey } from '../../../src/lib/contributions/model.js';
import type { RecordId } from '../../../src/lib/records.js';
import type { Cause } from '../../../src/lib/contributions/status.js';
import type { StateModel } from '../../../src/lib/contributions/state-model.js';
import { freezeOwned } from '../../../src/lib/immutable.js';
import { renderStateDiagram, stateDiagramIncompatibility } from './state-diagram.js';
import type { StateDiagram } from './state-diagram.js';

/** Qualification stays attached to its exact source; owner statements qualify that source's production. */
export interface ArrangedQualification {
  readonly kind: 'selected-content' | 'selected-use' | 'supporting-item' | 'bearer-identification' | 'displacement' | 'reconsideration' | 'inconsistency' | 'result-contract' | 'follow-up-option';
  readonly source: { readonly kind: 'item'; readonly address: ItemAddress }
    | { readonly kind: 'association' | 'declaration'; readonly address: DeclarationAddress }
    | { readonly kind: 'metadata'; readonly address: MetadataAddress };
  readonly label: string;
  readonly statements: readonly string[];
  readonly owner: { readonly investigram: InvestigramId; readonly statements: readonly string[] } | null;
}
export interface ArrangedAlternative {
  readonly designation: AssociationAddress;
  readonly producer: Producer;
  /** Statements a reader needs alongside the content: epistemic status, limitations, and current concerns. */
  readonly qualifications: readonly ArrangedQualification[];
  readonly prose: readonly string[];
  /** A diagram for each selected state model, or why none can be drawn from this alternative's content. */
  readonly diagrams: readonly StateDiagram[];
  readonly diagramUnavailable: string | null;
  /** Every selected item not rendered, including each incompatible model and its full retained meaning. */
  readonly unpresented: readonly { readonly address: ItemAddress; readonly type: string; readonly reason: string;
    readonly bearer: string | null; readonly stateModel: StateModel | null }[];
  readonly options: readonly { readonly address: MetadataAddress; readonly meaning: string; readonly operation: string; readonly resultContract: string | null; readonly qualification: ArrangedQualification }[];
}
export interface ContributionAnswerView {
  readonly answer: RecordId;
  readonly title: string;
  /** Present when the Query result has no standing designated answer; historical answers remain exactly accessible. */
  readonly noCurrentAnswer: { readonly explanation: string; readonly withdrawn: ContributionAnswer['history'] } | null;
  readonly alternatives: readonly ArrangedAlternative[];
  readonly notices: readonly string[];
}
const statusPhrase: Readonly<Record<Qualification['status'], string>> = { 'mechanically-derived': 'Mechanically derived', 'recorded-assertion': 'Recorded assertion',
  observation: 'Observation', interpretation: 'Interpretation', 'organizing-policy': 'Organizing policy' };

/**
 * Arrange a retained contribution answer as explanation with pictures. This is presentation:
 * it uses only the supplied content, draws a diagram for every alternative that supports one
 * without needing an authored illustration, reports each alternative that does not, and never
 * merges alternatives or chooses between them.
 */
export function arrangeContributionAnswer(content: ContributionAnswerContent, title: string): ContributionAnswerView {
  const { projection } = content;
  const useSupport = new Map(projection.support.uses.map(value => [addressKey(value.address), value]));
  const itemSupport = new Map(projection.support.items.map(value => [itemKey(value.address), value]));
  const changeSupport = new Map(projection.support.changes.map(value => [addressKey(value.address), value]));
  const bearerSupport = new Map(projection.support.bearers.map(value => [value.entity, value]));
  const alternatives = projection.alternatives.map((alternative): ArrangedAlternative => {
    const models = alternative.items.filter(item => item.type === 'state-model').map(item => item.body as StateModel);
    const drawable = models.filter(model => stateDiagramIncompatibility(model) === null);
    const qualify = (qualification: Qualification | null) => qualification ? [`${statusPhrase[qualification.status]} (${qualification.method})${qualification.scope ? `, scope: ${qualification.scope}` : ''}.`,
      ...(qualification.guarantee ? [qualification.guarantee] : []), ...qualification.limitations] : [];
    const uses = alternative.uses.map(address => useSupport.get(addressKey(address))!);
    const selected = new Map<string, AnswerSupport['items'][number]>();
    const include = (address: ItemAddress) => {
      const key = itemKey(address); if (selected.has(key)) return;
      const value = itemSupport.get(key)!; selected.set(key, value);
      [...value.item.support, ...value.item.dependencies].forEach(include);
    };
    alternative.items.forEach(item => include(item.address));
    const selectedItems = [...selected.values()];
    const ownerIds = new Set([...uses.map(use => use.address.investigram), ...selectedItems.map(item => item.address.investigram)]);
    const bearerUses = models.flatMap(model => model.bearer.kind === 'entity' ? bearerSupport.get(model.bearer.entity)?.identifications ?? [] : [])
      .map(address => useSupport.get(addressKey(address))!);
    bearerUses.forEach(use => { ownerIds.add(use.address.investigram); use.declaration.members.forEach(member => { if (member.kind === 'item') ownerIds.add(member.item.investigram); }); });
    const owners = projection.support.owners.filter(owner => ownerIds.has(owner.investigram));
    const concerns = [...uses.flatMap(use => [...use.status.membership, ...use.status.producing]), ...owners.flatMap(owner => owner.producing)];
    const conflicts = new Set([...uses.flatMap(use => use.status.inconsistencies), ...selectedItems.flatMap(item => item.inconsistencies)].map(address => JSON.stringify(address)));
    const displacements = uses.flatMap(use => use.status.standing.displacedBy.map(address => changeSupport.get(addressKey(address))!));
    const changes = [...new Map([...displacements, ...concerns.map(cause => changeSupport.get(addressKey(cause.change))!)].map(change => [addressKey(change.address), change])).values()];
    const reports = projection.support.metadata.filter(meta => conflicts.has(JSON.stringify(meta.address)));
    const bearer = (model: StateModel): string => {
      if (model.bearer.kind === 'role') return model.bearer.role;
      const entity = model.bearer.entity, selected = bearerSupport.get(entity);
      const labels = selected?.identifications.flatMap(address => {
        const use = useSupport.get(addressKey(address))!;
        return use.declaration.members.flatMap(member => member.kind === 'item' ? [itemSupport.get(itemKey(member.item))!] : [])
          .flatMap(({ item, identifyingNames }) => identifyingNames.length ? identifyingNames.map(name => name.text)
            : item.type === 'identification' ? [(item.body as { designation: string }).designation] : []);
      }) ?? [];
      return labels.length ? [...new Set(labels)].join(' / ') : 'Unlabelled Entity';
    };
    const concernText = (causes: readonly Cause[]) => causes.length ? [`Needs reconsideration: ${new Set(causes.map(cause => addressKey(cause.change))).size} later change(s) to selected or received information. This does not establish an error.`] : [];
    const group = (kind: ArrangedQualification['kind'], source: ArrangedQualification['source'], label: string,
      statements: readonly string[]): ArrangedQualification => {
      const owner = projection.support.owners.find(owner => owner.investigram === source.address.investigram)!;
      return { kind, source, label, statements: [...new Set(statements)], owner: kind === 'result-contract' ? null : { investigram: owner.investigram,
        statements: [...qualify(owner.qualification), ...concernText(owner.producing),
          ...(owner.report?.inability ? [`Producer-reported inability: ${owner.report.inability}`] : []), ...(owner.report?.statement ? [owner.report.statement] : [])] } };
    };
    const selectedKeys = new Set(alternative.items.map(item => itemKey(item.address)));
    const displacedKeys = new Set(displacements.map(change => addressKey(change.address)));
    const options = alternative.options.map(({ address, option }) => ({ address, meaning: option.meaning, operation: option.request.operation,
      resultContract: option.request.resultContract, qualification: group('follow-up-option', { kind: 'metadata', address }, `Follow-up option: ${address.key}`, qualify(option.qualification)) }));
    const qualifications: ArrangedQualification[] = [
      ...options.map(option => option.qualification),
      ...selectedItems.map(item => group(selectedKeys.has(itemKey(item.address)) ? 'selected-content' : 'supporting-item',
        { kind: 'item', address: item.address }, `${selectedKeys.has(itemKey(item.address)) ? 'Selected content' : 'Supporting item'}: ${item.item.key}`, qualify(item.item.qualification))),
      ...uses.map(use => group('selected-use', { kind: 'association', address: use.address }, `Selected use: ${use.address.declaration}`,
        [...qualify(use.declaration.qualification), ...concernText(use.status.membership)])),
      ...bearerUses.flatMap(use => [group('bearer-identification', { kind: 'association', address: use.address }, 'Bearer identification use',
        [...qualify(use.declaration.qualification), ...concernText(use.status.membership)]),
        ...use.declaration.members.flatMap(member => member.kind === 'item' ? [group('bearer-identification', { kind: 'item', address: member.item },
          'Bearer identification content', [...qualify(itemSupport.get(itemKey(member.item))!.item.qualification),
            ...itemSupport.get(itemKey(member.item))!.identifyingNames.map(name => `${name.origin === 'generated-handle' ? 'Generated handle' : name.origin === 'assigned' ? 'Assigned name' : 'Name in the system under study'}: ${name.text}.`)])] : [])]),
      ...changes.map(change => group(displacedKeys.has(addressKey(change.address)) ? 'displacement' : 'reconsideration',
        { kind: 'declaration', address: change.address }, displacedKeys.has(addressKey(change.address)) ? 'Displacement of selected use' : 'Change requiring reconsideration',
        [...qualify(change.declaration.qualification), `${change.declaration.operation}: ${change.declaration.grounds?.text ?? ''}`])),
      ...reports.map(report => group('inconsistency', { kind: 'metadata', address: report.address }, 'Inconsistency report',
        [...qualify(report.value.qualification), ...('grounds' in report.value ? [`Unresolved inconsistency: ${report.value.grounds.text}`] : [])])),
      ...(alternative.unmet.length ? [group('result-contract', { kind: 'association', address: alternative.designation }, 'Requested result',
        alternative.unmet.map(item => `Requested result not met: ${item.requirement} ${item.reason}`))] : []),
    ];
    return { designation: alternative.designation, producer: alternative.producer, qualifications,
      prose: alternative.items.flatMap(item => item.type === 'prose' ? [(item.body as { text: string }).text] : []),
      diagrams: drawable.map(model => renderStateDiagram(model, bearer(model), qualifications.flatMap(group => [
        ...group.statements.map(statement => `${group.label}: ${statement}`),
        ...(group.owner?.statements.map(statement => `${group.label} — owner: ${statement}`) ?? []),
      ]))),
      diagramUnavailable: drawable.length ? null : models.length ? 'None of the selected state models can be drawn; see the unpresented items.' : 'This alternative selects no state model.',
      unpresented: alternative.items.flatMap((item): ArrangedAlternative['unpresented'] => {
        if (item.type === 'prose') return [];
        if (item.type === 'state-model') {
          const model = item.body as StateModel, reason = stateDiagramIncompatibility(model);
          return reason ? [{ address: item.address, type: item.type, reason, bearer: bearer(model), stateModel: model }] : [];
        }
        return [{ address: item.address, type: item.type, reason: `Selected ${item.type} content is retained but has no renderer in this arrangement.`, bearer: null, stateModel: null }];
      }),
      options };
  });
  const drawn = alternatives.filter(item => item.diagrams.length).length;
  const unmet = projection.fulfillment === null ? 0 : projection.alternatives.filter(item => item.unmet.length).length;
  return freezeOwned({ answer: projection.id, title, alternatives,
    noCurrentAnswer: alternatives.length ? null : { withdrawn: projection.history,
      explanation: projection.history.length ? 'Every designated answer to this question has been withdrawn or superseded without a standing replacement. This is not a finding that nothing can be established, and no earlier answer is restored. Historical answers remain exactly accessible; a fresh investigation can be requested explicitly.'
        : 'No answer has been designated for this question.' },
    notices: [...(alternatives.length > 1 ? [`${alternatives.length} equally standing alternative answers are shown separately. Their order implies no preference, and they are not reconciled.`] : []),
      ...(alternatives.length > 1 && drawn > 0 && drawn < alternatives.length ? [`A diagram can be drawn for ${drawn} of ${alternatives.length} alternatives.${unmet ? ` The requested result is unmet for ${unmet} of ${alternatives.length} alternatives; see their qualifications.` : ''}`] : [])] });
}
