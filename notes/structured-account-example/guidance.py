"""Bounded fixture helpers for investigram-owned metadata, not product code."""
import copy
import json
from pathlib import Path

BASE = Path(__file__).resolve().parent
DIAGRAMS = json.loads((BASE / 'diagram-contracts.json').read_text())['types']
OFFER_METHODS = {'qualified-architectural-interpretation'}
OWN_PARTS = {'id', 'title', 'content', 'referents', 'associations', 'qualifications',
             'evidence', 'children', 'offers', 'presentations'}


def validate_offer(offer):
    assert set(offer) == {'key', 'label', 'purpose', 'targets', 'method', 'parameterDefinitions', 'qualifications', 'evidence'}, 'invalid offer metadata fields'
    assert all(offer[k] for k in ['key', 'label', 'purpose', 'qualifications', 'evidence']), 'unqualified/incomplete offer'
    assert offer['method'] in OFFER_METHODS, 'unsupported offer method'
    assert offer['parameterDefinitions'] == [], 'parameterized offers outside this probe'
    assert len(offer['targets']) == 1 and offer['targets'][0]['role'] == 'focus'
    assert set(offer['targets'][0]['subject']) in [{'entity'}, {'introducedEntity'}]


def diagram_plan(account, diagram_type, bindings, owner_id=None):
    """Resolve primary inputs and their declared content dependencies, without guidance."""
    assert diagram_type in DIAGRAMS, 'unsupported diagram type'
    rules = DIAGRAMS[diagram_type]['inputs']
    assert set(bindings) <= set(rules), 'unknown diagram input role'
    assert {k for k, v in rules.items() if v['required']} <= set(bindings), 'missing required diagram input'
    items = {i['key']: (i, n) for n, i in enumerate(account['content'])}
    inputs = {}
    for role, address in bindings.items():
        assert set(address) == {'account', 'contentKey'}, 'diagram input must address content, not metadata/entity alone'
        owner = address['account']
        local_match = owner == {'submittedAccount': account.get('key')} and 'key' in account
        retained_match = owner_id is not None and owner == {'account': owner_id}
        assert local_match or retained_match, 'input outside supported own-investigram scope'
        assert address['contentKey'] in items, 'missing exact diagram content'
        item, index = items[address['contentKey']]
        assert item['form'] == rules[role]['form'], 'incompatible diagram input form'
        inputs[role] = (item, index)
    dependencies = {}
    if diagram_type == 'sequence-diagram/0':
        interaction = inputs['interaction'][0]
        steps = interaction['prefix'] + [s for b in interaction['alternatives'] for s in b['steps']]
        for step in steps:
            if step['kind'] != 'state-transition':
                continue
            model, index = items[step['stateContent']]
            assert model['form'] == 'state-behavior/0', 'incompatible content dependency'
            assert step['transition'] in {t['key'] for t in model['transitions']}, 'unknown referenced transition'
            dependencies[step['stateContent']] = (model, index)
    return {'diagramType': diagram_type, 'inputs': inputs, 'dependencies': dependencies}


def presentation_plans(account, owner_id=None):
    """Recommendations select primary inputs; content contracts own dependencies."""
    assert 'offers' in account and 'presentations' in account, 'metadata arrays must be explicit'
    for name in ['offers', 'presentations']:
        assert len({x['key'] for x in account[name]}) == len(account[name]), 'duplicate metadata key'
    for offer in account['offers']:
        validate_offer(offer)
    assert all(i['form'] != 'investigation-offer/0' for i in account['content']), 'offer in interpretation content'
    plans = []
    for rec in account['presentations']:
        assert set(rec) == {'key', 'diagramType', 'inputs', 'qualifications', 'evidence'}, 'invalid presentation metadata fields'
        assert rec['key'] and rec['qualifications'] and rec['evidence'], 'unqualified recommendation'
        plan = diagram_plan(account, rec['diagramType'], rec['inputs'], owner_id)
        plan['recommendation'] = rec
        plans.append(plan)
    return plans


def resolve_references(value, entities, accounts):
    if isinstance(value, list):
        return [resolve_references(x, entities, accounts) for x in value]
    if isinstance(value, dict):
        if set(value) == {'introducedEntity'}:
            return {'entity': entities[value['introducedEntity']]}
        if set(value) == {'submittedAccount'}:
            return {'account': accounts[value['submittedAccount']]}
        return {k: resolve_references(v, entities, accounts) for k, v in value.items()}
    return value


def retained(document, bindings):
    result = {}
    for account in document['result']['accounts']:
        value = resolve_references(account, bindings['entityIds'], bindings['accountIds'])
        key = value.pop('key')
        value['id'] = bindings['accountIds'][key]
        result[value['id']] = value
    return result


def metadata_excerpt(registry, address, basis, provenance):
    assert len(address) == 2 and 'account' in address, 'exact metadata address required'
    kinds = {'offerKey': 'offers', 'presentationKey': 'presentations'}
    found = set(address) & set(kinds)
    assert len(found) == 1, 'metadata namespace required'
    field = next(iter(found))
    owner = registry[address['account']]
    matches = [x for x in owner[kinds[field]] if x['key'] == address[field]]
    assert len(matches) == 1, 'missing exact metadata entry'
    return {'address': copy.deepcopy(address), 'value': copy.deepcopy(matches[0]),
            'accountQualifications': copy.deepcopy(owner['qualifications']),
            'basis': basis, 'provenance': copy.deepcopy(provenance)}


def own_delivery(owner, parts):
    assert len(parts) == len(set(parts)) and set(parts) <= OWN_PARTS, 'invalid own-part selection'
    return {k: copy.deepcopy(owner[k]) for k in parts}


def complete_own_delivery(owner, delivered):
    # Complete own delivery is explicitly different from expanding every child/input.
    return set(delivered) == OWN_PARTS and all(delivered[k] == owner[k] for k in OWN_PARTS)


def complete_delivery(owner, delivered, basis, provenance):
    """Fixture evidence context is explicit; full own parts alone do not suffice."""
    return (set(delivered) == {'own', 'basis', 'provenance'}
            and complete_own_delivery(owner, delivered['own'])
            and delivered['basis'] == basis
            and delivered['provenance'] == provenance)
