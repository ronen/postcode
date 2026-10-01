import { randomBytes } from 'node:crypto';
import type { AgentInput } from '../contracts.js';
import type { Claim, ProgramRecord } from '../../records.js';

export const referenceInstructions = 'PostCode reference fields use short opaque handles issued in this dialogue. Copy them exactly; never construct a handle or use a canonical ID in place of one. A handle makes a reference available, not its underlying content supplied: bare support references still require acquisition before citation. Use descriptive names in prose; text inside source, assertions, qualifications and prose is literal, not translated. The dialogue character guard measures canonical domain inputs and decoded replies, not compact wire messages or repeated provider history.';
export interface ReferenceAudit {
  readonly version: 'postcode/investigator-references@3';
  readonly characterGuard: 'canonical-domain-exchanges';
  readonly bindings: readonly { readonly handle: string; readonly reference: string }[];
  readonly resolutions: readonly { readonly path: string; readonly handle: string; readonly reference: string | null }[];
}

type Transform = (value: unknown, path: string) => unknown;
type Fields = Readonly<Record<string, Transform>>;
const list = (map: Transform): Transform => (value, path) => Array.isArray(value) ? value.map((item, index) => map(item, `${path}[${index}]`)) : value;
const object = (fields: Fields): Transform => (value, path) => {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) return value;
  const result: Record<string, unknown> = { ...value };
  for (const [key, map] of Object.entries(fields)) if (Object.hasOwn(result, key)) result[key] = map(result[key], `${path}.${key}`);
  return result;
};
const impossible = (_value: never): never => { throw new Error('Unsupported investigator reference structure'); };

/** Private wire spelling only. No store, evidence acquisition, exposure ledger or credentials. */
export class InvestigatorReferences {
  readonly #namespace = randomBytes(8).toString('base64url');
  readonly #handles = new Map<string, string>();
  readonly #references = new Map<string, string>();
  #resolutions: ReferenceAudit['resolutions'][number][] = [];
  #closed = false;

  readonly #encode: Transform = value => {
    if (typeof value !== 'string') return value;
    let handle = this.#handles.get(value);
    if (!handle) {
      handle = `r${this.#namespace}.${(this.#handles.size + 1).toString(36)}`;
      this.#handles.set(value, handle); this.#references.set(handle, value);
    }
    return handle;
  };
  readonly #decode: Transform = (value, path) => {
    if (typeof value !== 'string') return value;
    const reference = this.#references.get(value) ?? null;
    this.#resolutions.push({ path, handle: value, reference });
    // Deliberately unresolvable in the session ID namespace. Keep the whole
    // invalid spelling so decoding cannot shrink it past the character guard.
    // Tool lookup then reports unavailable; submission validation rejects it.
    return reference ?? `invalid-investigator-reference:${value}`;
  };
  #fields(one: readonly string[], many: readonly string[] = [], nested: Fields = {}, map = this.#encode): Fields {
    return { ...Object.fromEntries(one.map(key => [key, map])), ...Object.fromEntries(many.map(key => [key, list(map)])), ...nested };
  }
  #context(): Fields { return this.#fields(['id', 'session']); }
  #qualification(): Transform {
    return object({ ...this.#context(), ...this.#fields(['inputs']), scope: (value, path) => value === 'configured-project' ? value : this.#encode(value, path) });
  }
  #support(map = this.#encode): Fields { return this.#fields([], ['evidence'], {}, map); }
  #referent(map = this.#encode): Transform { return object(this.#fields([], ['subjects'], {}, map)); }
  #associations(map = this.#encode): Transform { return list(object({ ...this.#support(map), ...this.#fields(['subject'], [], {}, map) })); }
  #inconsistencies(map = this.#encode): Transform { return list(object({ ...this.#support(map), ...this.#fields([], ['targets'], {}, map) })); }
  #request(map = this.#encode): Transform { return object(this.#fields(['subject'], [], {}, map)); }
  #provenance(deliveries = true): Transform {
    return object({ ...this.#context(), ...this.#fields(['originatingModule'], ['citations', 'completeTargets', 'completeCorrections', 'suppliedEvidence', 'summarizedEvidence']),
      request: this.#request(), ...(deliveries ? { deliveries: list((value, path) => this.#delivery(value, path)) } : {}) });
  }
  #account(): Transform {
    return object({ ...this.#context(), ...this.#support(), ...this.#fields(['originatingModule'], ['children', 'corrections']),
      referent: this.#referent(), associations: this.#associations(), inconsistencies: this.#inconsistencies(),
      revision: object({ ...this.#fields(['original', 'primary', 'familyPrimary'], ['omittedInconsistencyReporters']), inconsistencies: list(object({ ...this.#support(), ...this.#fields(['reporter'], ['targets']) })), rows: list(object({ ...this.#fields(['correction', 'target', 'replacement', 'reporter']), cause: object(this.#fields([], ['via'])) })) }),
      provenance: this.#provenance(false), revisionNotices: list(object(this.#fields(['id', 'target', 'replacement']))) });
  }
  #correction(): Transform {
    return object({ ...this.#context(), ...this.#support(), ...this.#fields(['reporter', 'target', 'replacement', 'provenance'], ['correctedSubjects']) });
  }
  #delivery: Transform = (value, path) => object({ ...this.#fields(['requested'], ['omittedAccounts', 'omittedCorrections']),
    listing: object(this.#fields(['subject', 'next'], ['selected'])), accounts: list(this.#account()), corrections: list(this.#correction()) })(value, path);
  #endpoint(): Transform { return object(this.#fields([], ['groups', 'candidates', 'artifacts', 'evidence', 'claims'])); }
  #information(information: Claim['information']): Fields {
    switch (information.type) {
      case 'module': case 'symbol': case 'module-composition': case 'group': return {};
      case 'export': return this.#fields(['symbol', 'origin'], [], { routes: list(object(this.#fields(['via']))) });
      case 'documentation-association': return this.#fields(['assertion']);
      case 'group-containment': return this.#fields(['child']);
      case 'artifact-placement': case 'group-documentation': return this.#fields(['artifact']);
      case 'module-placement': return this.#fields([], ['groups', 'candidates', 'artifacts']);
      case 'group-properties': return this.#fields(['evaluation']);
      case 'dependency': return this.#fields(['child'], ['occurrences']);
      case 'dependency-organization': return this.#fields(['evaluation'], [], { occurrences: list(object({ ...this.#fields(['occurrence']),
        source: this.#endpoint(), target: this.#endpoint(), pairs: list(object(this.#fields(['source', 'target'], ['commonAncestors', 'containment']))) })) });
      default: return impossible(information);
    }
  }
  /** Keep this discriminated traversal aligned with ProgramRecord: opaque input
   * payloads, paths, source text, assertion tags and ordinary prose are not walked. */
  #record: Transform = (value, path) => {
    const record = value as ProgramRecord;
    let fields: Fields;
    switch (record.kind) {
      case 'session': fields = this.#fields(['repository']); break;
      case 'analysis-inputs': case 'repository-evidence': fields = {}; break;
      case 'module': case 'symbol': case 'group': fields = this.#fields(['claim']); break;
      case 'claim': fields = this.#fields(['subject', 'context'], [], { information: object(this.#information(record.information)) }); break;
      case 'recorded-assertion': fields = this.#fields(['context']); break;
      case 'source-evidence': fields = { resolution: object(this.#fields(['target'])) }; break;
      case 'claim-context': fields = { ...this.#support(), ...this.#fields(['inputs']), scope: (v, p) => v === 'configured-project' ? v : this.#encode(v, p) }; break;
      case 'evaluation': fields = this.#fields(['basis'], ['claims', 'modules', 'contexts']); break;
      case 'projection': fields = this.#fields([], ['modules', 'claims', 'contexts', 'evaluations'], { expansions: object(this.#fields([], ['claims'])) }); break;
      case 'repository-region': case 'repository-artifact': fields = this.#fields(['repository']); break;
      case 'organization-evaluation': fields = this.#fields(['repository', 'moduleEvaluation'], ['groups', 'claims', 'contexts']); break;
      case 'organization-projection': fields = this.#fields(['evaluation', 'moduleProjection'], ['groups', 'modules', 'claims', 'contexts'], {
        expansions: object(this.#fields([], ['groups', 'modules', 'claims', 'moduleClaims', 'moduleEvaluations'])) }); break;
      case 'dependency-occurrence': fields = this.#fields(['owner', 'context', 'evidence', 'target'], ['targetEvidence']); break;
      case 'dependency-coverage': fields = this.#fields(['owner', 'context', 'evidence']); break;
      case 'dependency-evaluation': fields = this.#fields(['moduleEvaluation'], ['projectModules', 'occurrences', 'relationships', 'coverage', 'contexts']); break;
      case 'dependency-projection': fields = this.#fields(['evaluation'], ['subjects', 'modules', 'relationships', 'occurrences', 'nonEdgeRequests', 'coverage', 'opaqueSubjects', 'contexts'], {
        graph: object({ components: list(object(this.#fields([], ['members', 'internalRelationships']))) }),
        expansions: object(this.#fields(['organization'], ['moduleEvaluations', 'moduleClaims'])) }); break;
      case 'dependency-organization-evaluation': fields = this.#fields(['dependencyEvaluation', 'organizationEvaluation'], ['claims', 'contexts']); break;
      case 'captured-content': fields = this.#fields(['subject', 'inputs', 'mapping']); break;
      case 'investigram': fields = { ...this.#support(), ...this.#fields(['originatingModule', 'provenance'], ['children', 'corrections']),
        referent: this.#referent(), associations: this.#associations(), inconsistencies: this.#inconsistencies() }; break;
      case 'investigram-correction': return this.#correction()(record, path);
      case 'investigation-provenance': return this.#provenance()(record, path);
      case 'investigation-evaluation': fields = this.#fields(['attempt'], ['investigrams', 'corrections'], {
        request: this.#request(), outcome: object(this.#fields(['root'])) }); break;
      default: return impossible(record);
    }
    return object({ ...this.#context(), ...fields })(record, path);
  };
  #response: Transform = (value, path) => {
    if (value && typeof value === 'object' && 'accounts' in value) return this.#delivery(value, path);
    return object({ records: list(this.#record), ...this.#fields([], ['selected']),
      evaluations: list(object({ ...this.#context(), ...this.#fields(['basis']), qualification: list(this.#qualification()) })),
      repositories: list(object(this.#context())), supportReferences: list(object(this.#fields(['id']))),
      page: object({ ...this.#fields(['next']), omitted: list(object(this.#fields(['id']))) }) })(value, path);
  };
  #alive(): void { if (this.#closed) throw new Error('Investigator references are closed'); }
  encode(input: AgentInput): { readonly request: unknown; readonly responses: unknown } {
    this.#alive(); this.#resolutions = [];
    return { request: this.#request()(input.request, '$.request'), responses: list(this.#response)(input.responses, '$.responses') };
  }
  tools(value: unknown): unknown {
    this.#alive();
    return object({ requests: list(object(this.#fields(['subject', 'cursor'], [], {}, this.#decode))) })(value, '$');
  }
  submission(value: unknown): unknown {
    this.#alive();
    let count = 0;
    const account = (value: unknown, path: string, depth: number): unknown => {
      // Domain validation rejects the untouched remainder at its original bounds.
      if (depth > 32 || ++count > 256) return value;
      const descend: Transform = (child, p) => account(child, p, depth + 1);
      return object({ ...this.#support(this.#decode), referent: this.#referent(this.#decode), associations: this.#associations(this.#decode),
        children: list(descend), inconsistencies: this.#inconsistencies(this.#decode),
        corrections: list(object({ ...this.#support(this.#decode), ...this.#fields(['target'], ['correctedSubjects'], {}, this.#decode), replacement: descend })) })(value, path);
    };
    return account(value, '$', 0);
  }
  audit(): ReferenceAudit {
    this.#alive();
    return { version: 'postcode/investigator-references@3', characterGuard: 'canonical-domain-exchanges',
      bindings: [...this.#references].map(([handle, reference]) => ({ handle, reference })), resolutions: this.#resolutions.map(item => ({ ...item })) };
  }
  close(): void { this.#closed = true; this.#handles.clear(); this.#references.clear(); this.#resolutions = []; }
}
