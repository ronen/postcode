"""Authored host/provider adapter probe, not a native identity implementation.

Normalize provider encounters before common acceptance. The analyzer supplies native
identity and scope; it does not inspect the Session's retained entities. Scope here is
explicitly pinned. A real adapter must use the provider's actual continuity rules.
"""
import copy
import json


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
    for bundle in stage['submission']['result']['investigrams']:
        keep = []
        for item in bundle['content']:
            equal = None
            if 'providerIdentity' in item and not item['introducesEntity']:
                for owner, key, previous in known[identity_key(item)]:
                    comparison = copy.deepcopy(previous); comparison['introducesEntity'] = False
                    prior = model.investigrams[owner]
                    if (item == comparison and bindings['provenance'] == prior.get('provenance')
                            and bundle['qualifications'] == prior['qualifications']
                            and bundle['evidence'] == prior['evidence']):
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
                selection = {'entity': item['subject']['entity'], 'associations': [{'investigram': equal[0], 'associationKey': equal[1]}], 'items': [], 'options': []}
                stage['request']['deliveries'].append(selection)
            else:
                keep.append(item)
        bundle['content'] = keep
    for bundle in stage['submission']['result']['investigrams']:
        for association in bundle['associationSpecifications']:
            for member in association.get('members', []):
                ref = member.get('declaration', {})
                local_owner = ref.get('investigram', {}).get('submittedInvestigram')
                replacement = redirected.get((local_owner, ref.get('associationKey')))
                if replacement:
                    ref.update(investigram={'investigram': replacement[0]}, associationKey=replacement[1])
    return stage, {'resolvedExistingEntities': reused, 'reusedIdentifications': [f'{o}::{k}' for o, k in redirected.values()]}
