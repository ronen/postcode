"""Bounded fixture helpers for investigram-owned metadata, not product code."""
import json
from pathlib import Path

BASE = Path(__file__).resolve().parent
DIAGRAMS = json.loads((BASE / 'diagram-contracts.json').read_text())['types']
OPTION_METHODS = {'qualified-architectural-interpretation'}


def validate_option(followupOption):
    assert set(followupOption) == {'key', 'label', 'purpose', 'targets', 'method', 'parameterDefinitions', 'qualifications', 'evidence'}, 'invalid option metadata fields'
    assert all(followupOption[k] for k in ['key', 'label', 'purpose', 'qualifications', 'evidence']), 'unqualified/incomplete option'
    assert followupOption['method'] in OPTION_METHODS, 'unsupported option method'
    assert followupOption['parameterDefinitions'] == [], 'parameterized options outside this probe'
    assert len(followupOption['targets']) == 1 and followupOption['targets'][0]['role'] == 'focus'
    assert set(followupOption['targets'][0]['subject']) in [{'entity'}, {'introducedEntity'}]


def diagram_plan(investigram, diagram_type, bindings, owner_id=None):
    """Resolve primary inputs and their declared content dependencies, without guidance."""
    assert diagram_type in DIAGRAMS, 'unsupported diagram type'
    rules = DIAGRAMS[diagram_type]['inputs']
    assert set(bindings) <= set(rules), 'unknown diagram input role'
    assert {k for k, v in rules.items() if v['required']} <= set(bindings), 'missing required diagram input'
    items = {i['key']: (i, n) for n, i in enumerate(investigram['content'])}
    inputs = {}
    for role, address in bindings.items():
        assert set(address) == {'investigram', 'contentKey'}, 'diagram input must address content, not metadata/entity alone'
        owner = address['investigram']
        local_match = owner == {'submittedInvestigram': investigram.get('key')} and 'key' in investigram
        retained_match = owner_id is not None and owner == {'investigram': owner_id}
        assert local_match or retained_match, 'input outside supported own-investigram scope'
        assert address['contentKey'] in items, 'missing exact diagram content'
        item, index = items[address['contentKey']]
        assert item['contentType'] == rules[role]['contentType'], 'incompatible diagram input content type'
        inputs[role] = (item, index)
    dependencies = {}
    if diagram_type == 'sequence-diagram/0':
        interaction = inputs['interaction'][0]
        steps = interaction['prefix'] + [s for b in interaction['alternatives'] for s in b['steps']]
        for step in steps:
            if step['kind'] != 'state-transition':
                continue
            model, index = items[step['stateContent']]
            assert model['contentType'] == 'state-behavior/0', 'incompatible content dependency'
            assert step['transition'] in {t['key'] for t in model['transitions']}, 'unknown referenced transition'
            dependencies[step['stateContent']] = (model, index)
    return {'diagramType': diagram_type, 'inputs': inputs, 'dependencies': dependencies}


def presentation_plans(investigram, owner_id=None):
    """Recommendations select primary inputs; content contracts own dependencies."""
    assert 'followupOptions' in investigram and 'presentations' in investigram, 'metadata arrays must be explicit'
    for name in ['followupOptions', 'presentations']:
        assert len({x['key'] for x in investigram[name]}) == len(investigram[name]), 'duplicate metadata key'
    for followupOption in investigram['followupOptions']:
        validate_option(followupOption)
    assert all(i['contentType'] != 'investigation-option/0' for i in investigram['content']), 'option in interpretation content'
    plans = []
    for rec in investigram['presentations']:
        assert set(rec) == {'key', 'diagramType', 'inputs', 'qualifications', 'evidence'}, 'invalid presentation metadata fields'
        assert rec['key'] and rec['qualifications'] and rec['evidence'], 'unqualified recommendation'
        plan = diagram_plan(investigram, rec['diagramType'], rec['inputs'], owner_id)
        plan['recommendation'] = rec
        plans.append(plan)
    return plans
