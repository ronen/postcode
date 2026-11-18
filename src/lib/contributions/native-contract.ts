import { canonical } from '../identity.js';
import type { ProgramRecord, ProgramRecordStore, RecordId, SessionId } from '../records.js';
import { record, text } from './catalog.js';
import type { ContentTypeContract } from './catalog.js';
import { InvalidContribution } from './model.js';

/** Provider records remain the authoritative statement and qualification of native findings. */
export function nativeFindingContract(store: ProgramRecordStore, session: SessionId): ContentTypeContract {
  return {
    type: 'native-finding', method: 'postcode/content-native-finding@1',
    meaning: 'An exact qualified provider finding. Recorded documentation is an assertion, not verification of its text. Relationship records are claims, not Entities.',
    accept(body) {
      const value = record(body, ['record', 'finding'], 'native finding');
      const id = text(value.record, 'native record') as RecordId, source = store.lookup(id);
      if (!source || source.session !== session || !isNativeFinding(source)) throw new InvalidContribution('Expected a retained native finding in this Session.');
      if (value.finding === undefined || canonical(value.finding) !== canonical(source)) throw new InvalidContribution('Native finding differs from its retained provider record.');
      return { body: { record: id, finding: source }, entities: [], content: [], components: [] };
    },
    identifying(body) {
      const source = (body as { finding: ProgramRecord }).finding;
      return source.kind === 'claim' && (source.information.type === 'symbol' || source.information.type === 'group') && source.information.name !== null
        ? [{ text: source.information.name, origin: 'system-under-study' }] : [];
    },
  };
}

export function isNativeFinding(value: ProgramRecord): boolean {
  return value.kind === 'claim' || value.kind === 'recorded-assertion'
    || value.kind === 'dependency-occurrence' || value.kind === 'dependency-coverage';
}
