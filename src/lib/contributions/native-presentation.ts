import { inlineText } from '../terminal-text.js';
import type { NativeSelection } from './native-selection.js';
import { addressKey, itemKey } from './model.js';
import type { Qualification } from './model.js';

/** Only attributed qualification and exact navigation references cross the human output boundary. */
export function nativeConcerns(selection: NativeSelection) {
  const { support } = selection;
  const owners = new Map(support.owners.map(owner => [owner.investigram, owner]));
  const uses = support.uses.filter(use => use.status.standing.state === 'displaced' || use.status.producing.length
    || use.status.membership.length || use.status.content.some(content => content.producing.length) || use.status.inconsistencies.length);
  const items = support.items.filter(item => item.inconsistencies.length || owners.get(item.address.investigram)!.producing.length);
  const keys = new Set([...uses.map(use => addressKey(use.address)), ...items.map(item => itemKey(item.address))]);
  return {
    findings: selection.findings.filter(finding => keys.has(itemKey(finding.item)) || finding.uses.some(use => keys.has(addressKey(use)))),
    uses: uses.map(use => ({ address: use.address, target: use.declaration.target, qualification: use.declaration.qualification,
      ownerQualification: owners.get(use.address.investigram)!.qualification, status: use.status })),
    items: items.map(item => ({ address: item.address, inconsistencies: item.inconsistencies })),
    owners: support.owners.filter(owner => owner.producing.length).map(owner => ({ investigram: owner.investigram,
      producer: owner.producer, qualification: owner.qualification, producing: owner.producing })),
    changes: support.changes.map(change => ({ address: change.address, operation: change.declaration.operation,
      grounds: change.declaration.grounds, qualification: change.declaration.qualification, standing: change.standing,
      producer: owners.get(change.address.investigram)!.producer, ownerQualification: owners.get(change.address.investigram)!.qualification })),
    inconsistencies: support.metadata.flatMap(meta => 'endpoints' in meta.value ? [{ address: meta.address, ...meta.value,
      ownerQualification: owners.get(meta.address.investigram)!.qualification }] : []),
  };
}
export type NativeConcerns = ReturnType<typeof nativeConcerns>;

export function nativeConcernLines(value: NativeConcerns): string[] {
  // The surrounding View identifies the Session; structured output retains complete exact references.
  const local = (reference: string) => inlineText(reference.replace(/^session:[a-f0-9-]{36}:/, ''));
  const qualified = (label: string, qualification: Qualification | null): string[] => qualification ? [
    `  ${label}: ${inlineText(qualification.status)}; ${inlineText(qualification.method)}${qualification.scope ? `; scope ${inlineText(qualification.scope)}` : ''}.`,
    ...(qualification.guarantee ? [`  Guarantee: ${inlineText(qualification.guarantee)}`] : []),
    ...qualification.limitations.map(limit => `  Limitation: ${inlineText(limit)}`),
  ] : [];
  return [
    ...value.uses.filter(use => use.status.standing.state === 'displaced').map(use =>
      `A selected finding's organizing use is displaced (${local(addressKey(use.address))}). Its method-specific finding remains selected; displacement does not change its truth or reinstate another use.`),
    ...value.owners.flatMap(owner => [
      `Selected information or organizing context needs reconsideration (${local(owner.investigram)}): ${owner.producing.length} recorded cause(s). This does not establish error or reverse a displacement.`,
      ...qualified('Producing context', owner.qualification),
      ...owner.producing.map(cause => `  Exact cause: ${local(addressKey(cause.change))}.`),
    ]),
    ...value.changes.flatMap(change => [
      `Change ${local(addressKey(change.address))}: ${change.operation}${change.grounds ? ` — ${inlineText(change.grounds.text)}` : ''}.`,
      ...qualified('Change owner', change.ownerQualification), ...qualified('Change declaration', change.qualification),
    ]),
    ...value.inconsistencies.flatMap(report => [
      `Unresolved inconsistency (${local(report.address.investigram)} / ${inlineText(report.address.key)}): ${inlineText(report.grounds.text)}`,
      ...qualified('Report owner', report.ownerQualification), ...qualified('Report', report.qualification),
    ]),
  ];
}
