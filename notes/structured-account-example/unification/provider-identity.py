"""Authored host/provider adapter probe, not a native identity implementation.

Normalize provider encounters before common acceptance. The analyzer supplies native
identity and scope; it does not inspect the Session's retained entities. Scope here is
explicitly pinned. A real adapter must use the provider's actual continuity rules.
"""
import copy
import json
import uuid


def identity_key(item):
    identity = item['providerIdentity']
    assert identity['provider'] and identity['nativeEntity'] and identity['basisScope']
    return json.dumps({k: identity[k] for k in ('provider', 'nativeEntity', 'scope', 'basisScope')}, sort_keys=True)


def normalize(model, stage):
    stage = copy.deepcopy(stage)
    bindings = stage['bindings']
    known = {}
    for (owner, key), item in model.items().items():
        if 'providerIdentity' in item:
            known.setdefault(identity_key(item), []).append((owner, key, item))
    reused = {}
    allocated = {}
    for bundle in stage['submission']['result']['investigrams']:
        for item in bundle['content']:
            if 'providerIdentity' not in item:
                continue
            local = item['subject']['introducedEntity']
            matches = known.get(identity_key(item), [])
            if matches:
                entities = {x[2]['subject']['entity'] for x in matches}
                assert len(entities) == 1, 'provider identity resolves ambiguously'
                reused[local] = entities.pop()
                del bindings['entityIds'][local]
                item['introducesEntity'] = False
            else:
                # Host allocation is separate from the native key. Deterministic UUIDs
                # make this authored probe reproducible, not a product identity algorithm.
                common_id = 'E-' + str(uuid.uuid5(uuid.NAMESPACE_URL, 'authored-provider:' + identity_key(item)))
                assert common_id not in model.entities, 'fresh common identity collision'
                bindings['entityIds'][local] = common_id
                allocated[local] = common_id

    def resolve(value):
        if isinstance(value, dict):
            if set(value) == {'introducedEntity'} and value['introducedEntity'] in reused:
                return {'entity': reused[value['introducedEntity']]}
            return {k: resolve(v) for k, v in value.items()}
        if isinstance(value, list):
            return [resolve(v) for v in value]
        return value
    stage['submission'] = resolve(stage['submission'])
    # Reuse exact identifying content/association only for equal information AND
    # equal qualification, evidence and method/basis. A changed method gets a new
    # qualified association on the same entity, without automatic supersession.
    redirected = {}
    displaced_matches = set()
    for bundle in stage['submission']['result']['investigrams']:
        keep = []
        production = (bindings['provenanceByInvestigram'][bundle['key']]
                      if 'provenanceByInvestigram' in bindings else bindings['provenance'])
        for item in bundle['content']:
            equal = None
            displaced_equal = []
            if 'providerIdentity' in item and not item['introducesEntity']:
                for owner, key, previous in known[identity_key(item)]:
                    comparison = copy.deepcopy(previous); comparison['introducesEntity'] = False
                    prior = model.investigrams[owner]
                    if (item == comparison and production == prior.get('provenance')
                            and bundle['qualifications'] == prior['qualifications']
                            and bundle['evidence'] == prior['evidence']):
                        # This bounded provider uses same-key identifying items and
                        # associations. Identity remains reusable after displacement;
                        # the displaced association does not. Renew with a new addition.
                        if model.standing((owner, key))['displacedBy']:
                            displaced_matches.add((owner, key))
                            displaced_equal.append((owner, key))
                            continue
                        equal = (owner, key)
                        break
            if equal:
                association = next(a for a in bundle['associationSpecifications'] if a['key'] == item['key'])
                assert association['operation'] == 'addition' and association['target']['role'] == 'identifies'
                # This bounded provider emits one identifying item per same-key association.
                old_association = model.declarations()[equal]
                assert old_association['target'] == association['target']
                assert model.expand(equal)[1] == {equal}
                redirected[(bundle['key'], item['key'])] = equal
                bundle['associationSpecifications'].remove(association)
                # Host equality/reuse is not context delivered to the analyzer.
            else:
                keep.append(item)
                if displaced_equal:
                    bindings.setdefault('renewals', []).append({
                        'association': {'investigram': {'submittedInvestigram': bundle['key']}, 'associationKey': item['key']},
                        'previousAssociations': [{'investigram': {'investigram': o}, 'associationKey': k} for o, k in displaced_equal],
                        'establishedBy': 'authored/provider-qualified-equality@0'})
        bundle['content'] = keep
    for bundle in stage['submission']['result']['investigrams']:
        for association in bundle['associationSpecifications']:
            for member in association.get('members', []):
                ref = member.get('declaration', {})
                local_owner = ref.get('investigram', {}).get('submittedInvestigram')
                replacement = redirected.get((local_owner, ref.get('associationKey')))
                if replacement:
                    ref.update(investigram={'investigram': replacement[0]}, associationKey=replacement[1])
    return stage, {'resolvedExistingEntities': reused, 'allocatedEntities': allocated,
                   'reusedIdentifications': [f'{o}::{k}' for o, k in redirected.values()],
                   'skippedDisplacedIdentifications': [f'{o}::{k}' for o, k in sorted(displaced_matches)],
                   'decisionBasis': 'Host comparison by provider identity and qualified content equality; not analyzer delivery.'}
