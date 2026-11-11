"""Check authored design fixtures, not the implemented PostCode protocol or truth.
Run with Python 3 from any directory. No dependencies and no fixture mutations.
"""
import copy
import json
import runpy
from pathlib import Path

BASE = Path(__file__).resolve().parent
guidance = runpy.run_path(str(BASE / 'guidance.py'))
# Stipulated capabilities for these authored fixtures, not a product registry.
OPTION_METHODS = {'qualified-architectural-interpretation'}


def read(path):
    return json.loads(path.read_text())


def check_result(document, bindings, known_entities, earlier, supplied, evidence):
    result = document['result']
    investigrams = {a['key']: a for a in result['investigrams']}
    assert len(investigrams) == len(result['investigrams']), 'duplicate account key'
    assert set(investigrams) == set(bindings['investigramIds']), 'account bindings differ'
    root = result['rootInvestigram']['submittedInvestigram']
    assert root in investigrams, 'unknown result root'
    owned = {k: [] for k in investigrams}
    owned[root].append('root')
    edges = {k: [] for k in investigrams}
    for key, a in investigrams.items():
        for child in a['children']:
            assert set(child) == {'submittedInvestigram'}, 'old/external child adoption'
            target = child['submittedInvestigram']
            assert target in investigrams, 'missing child'
            owned[target].append(key)
            edges[key].append(target)
    relationships = result['investigramRelationships']
    assert len({r['key'] for r in relationships}) == len(relationships)
    assert {r['key'] for r in relationships} == set(bindings['relationshipIds'])
    for rel in relationships:
        assert rel['kind'] == 'correction' and rel['reason'] and rel['qualifications']
        reporter = rel['reporter']['submittedInvestigram']
        replacement = rel['replacement']['submittedInvestigram']
        assert reporter in investigrams and replacement in investigrams
        assert rel['target']['investigram'] in supplied, 'incomplete correction target'
        assert rel['target']['investigram'] in earlier, 'target must predate result'
        owned[replacement].append(rel['key'])
        edges[reporter].append(replacement)
    assert all(len(v) == 1 for v in owned.values()), 'missing/duplicate owning position'
    reached = set()
    def visit(key):
        assert key not in reached, 'cycle/shared subtree'
        reached.add(key)
        for target in edges[key]:
            visit(target)
    visit(root)
    assert reached == set(investigrams), 'unreachable owned account'

    declarations = {}
    def canon(value):
        return json.dumps(value, sort_keys=True)
    for a in investigrams.values():
        assert a['qualifications'] and a['evidence'] and a['referents'], 'missing own qualification/support'
        assert len({i['key'] for i in a['content']}) == len(a['content'])
        for association in a['contentAssociations']:
            if 'contentKey' in association:
                assert association['contentKey'] in {i['key'] for i in a['content']}, 'unknown associated item'
        identifies = {canon(x['subject']) for x in a['contentAssociations'] if x['role'] == 'identifies'}
        for item in a['content']:
            if item['contentType'] == 'entity-description/0':
                assert canon(item['subject']) in identifies, 'missing identifying association on owner'
                assert any(x['role'] == 'identifies' and x['subject'] == item['subject'] and x.get('contentKey') == item['key'] for x in a['contentAssociations']), 'identifying item not addressed'
            if item.get('introducesEntity'):
                key = item['subject']['introducedEntity']
                assert key not in declarations, 'duplicate entity declaration'
                assert item['name'] and item['description']
                declarations[key] = item
    assert set(declarations) == set(bindings['entityIds'])
    def references(value, roles=None):
        if isinstance(value, list):
            for child in value:
                references(child, roles)
        elif isinstance(value, dict):
            if set(value) == {'entity'} and isinstance(value['entity'], str):
                assert value['entity'] in known_entities, 'unknown entity'
            if set(value) == {'introducedEntity'}:
                assert value['introducedEntity'] in declarations, 'undeclared entity'
            if set(value) == {'submittedInvestigram'}:
                assert value['submittedInvestigram'] in investigrams, 'unknown submitted account'
            if set(value) == {'investigram'} and isinstance(value['investigram'], str):
                assert value['investigram'] in earlier, 'unknown prior account'
            if set(value) == {'localRole'} and roles is not None:
                assert value['localRole'] in roles, 'unknown item-local role'
            for ev in value.get('evidence', []):
                if isinstance(ev, str):
                    assert ev in evidence, 'evidence unavailable in dialogue'
            for child in value.values():
                references(child, roles)
    references(result)
    for a in investigrams.values():
        guidance['presentation_plans'](a)
        own_items = {i['key']: i for i in a['content']}
        for item in own_items.values():
            roles = {r['key'] for r in item.get('roles', [])}
            assert len(roles) == len(item.get('roles', [])), 'duplicate local role'
            if roles:
                assert item['roleScope']
            references(item, roles)
            for link in item.get('relatedContent', []):
                ref = link['investigram']
                target = investigrams[ref['submittedInvestigram']] if 'submittedInvestigram' in ref else earlier[ref['investigram']]
                assert link['contentKey'] in {i['key'] for i in target['content']}, 'unknown related content item'
                assert link['purpose'], 'missing related-content purpose'
            for illustration in item.get('illustrations', []):
                ref = illustration['investigram']
                target = investigrams[ref['submittedInvestigram']] if 'submittedInvestigram' in ref else earlier[ref['investigram']]
                assert illustration['contentKey'] in {i['key'] for i in target['content']}, 'unknown exact content key'
                assert illustration['qualification'] and illustration['evidence']
                mapped = [b['role'] for b in illustration['roleBindings']]
                assert len(mapped) == len(set(mapped)) and set(mapped) == roles
                if 'case' in illustration:
                    assert item['contentType'] == 'admission-cases/0'
                    assert illustration['case'] in {c['key'] for c in item['cases']}
            if item['contentType'] == 'state-behavior/0':
                states = {s['key'] for s in item['states']}
                assert len(states) == len(item['states'])
                assert len({t['key'] for t in item['transitions']}) == len(item['transitions'])
                assert all(t['source'] in states and t['target'] in states for t in item['transitions'])
            if item['contentType'] == 'interaction/0':
                participants = {p['key'] for p in item['participants']}
                assert len(participants) == len(item['participants'])
                all_steps = item['prefix'] + [s for b in item['alternatives'] for s in b['steps']]
                assert len({s['key'] for s in all_steps}) == len(all_steps)
                def path(steps, seen=()):
                    prior = set(seen)
                    for step in steps:
                        assert set(step.get('causedBy', [])) <= prior, 'cause is not earlier on same path'
                        for field in ['from', 'to', 'actor', 'participant', 'on']:
                            if field in step:
                                assert step[field] in participants
                        if step['kind'] == 'state-transition':
                            model = own_items[step['stateContent']]
                            assert model['contentType'] == 'state-behavior/0', 'incompatible content dependency'
                            assert step['transition'] in {t['key'] for t in model['transitions']}
                        prior.add(step['key'])
                    return prior
                prefix = path(item['prefix'])
                for branch in item['alternatives']:
                    path(branch['steps'], prefix)
    return investigrams


def resolve_option_request(request, investigrams, entity_bindings):
    assert request['operation'] == 'follow-up-investigation', 'unsupported invocation'
    assert set(request['subject']) == {'investigram'}, 'option invocation needs an exact account'
    params = request['parameters']
    assert set(params) == {'optionKey', 'values'} and params['values'] == {}, 'undeclared parameter values'
    origin = request['subject']['investigram']
    investigram = investigrams[origin]  # No fallback to replacements, labels or matching keys elsewhere.
    matches = [i for i in investigram['followupOptions'] if i['key'] == params['optionKey']]
    assert len(matches) == 1, 'not an exact option'
    guidance['validate_option'](matches[0])
    followupOption = matches[0]
    assert followupOption['method'] in OPTION_METHODS and followupOption['parameterDefinitions'] == []
    targets = copy.deepcopy(followupOption['targets'])
    for target in targets:
        ref = target['subject']
        if 'introducedEntity' in ref:
            target['subject'] = {'entity': entity_bindings[origin][ref['introducedEntity']]}
    return {'followupOption': {'investigram': origin, 'optionKey': followupOption['key']}, 'method': followupOption['method'],
            'architecturalTargets': targets, 'parameterValues': params['values']}


def check_option_chain(directory, investigrams):
    ledger = read(directory / 'context-and-bindings.json')
    bindings = {}
    for stage in ['firstAcceptance', 'followupAcceptance']:
        bindings.update({a: ledger[stage]['entityIds'] for a in ledger[stage]['investigramIds'].values()})
    request = ledger['followupRequest']
    resolved = resolve_option_request(request, investigrams, bindings)
    documentary_change = copy.deepcopy(request)
    documentary_change['informationNeed'] = 'Different explanatory wording, not another operation.'
    assert resolve_option_request(documentary_change, investigrams, bindings) == resolved
    expected = ledger['followupResolution']
    assert all(expected[k] == v for k, v in resolved.items())
    source = investigrams[resolved['followupOption']['investigram']]
    followupOption = next(i for i in source['followupOptions'] if i['key'] == resolved['followupOption']['optionKey'])
    assert request['informationNeed'] == followupOption['purpose']  # Documentary wording, not resolver input.
    assert ledger['applicationAssumptions']['operation'] == request['operation']
    assert set(ledger['applicationAssumptions']['supportedMethods']) == OPTION_METHODS
    provenance = expected['provenance']
    assert provenance['invocationSubject'] == request['subject']
    assert provenance['optionKey'] == request['parameters']['optionKey']
    assert set(provenance['outputs']) == set(ledger['followupAcceptance']['investigramIds'].values())
    access = read(directory / 'followup-option-access.json')
    assert access['exactAnswer']['followupOption'] == resolved['followupOption']
    for key in ['optionOnlyBeforeCorrection', 'freshOriginalOptionAfterCorrection']:
        delivery = access[key]['delivery']; address = delivery['address']
        original = investigrams[address['investigram']]
        content = copy.deepcopy(next(i for i in original['followupOptions'] if i['key'] == address['optionKey']))
        for target in content['targets']:
            ref = target['subject']
            if 'introducedEntity' in ref:
                target['subject'] = {'entity': bindings[address['investigram']][ref['introducedEntity']]}
        assert delivery['followupOption'] == content, 'option excerpt lost or changed content'
        assert delivery['investigramQualifications'] == original['qualifications'], 'option lost investigram scope'
        assert delivery['basis'] == ledger['basis']['id']
        assert access[key]['completeTargets'] == [], 'option alone is not complete delivery'
    assert access['optionOnlyBeforeCorrection']['exposureIndex'] == ['ADMISSION-1']
    fresh = access['freshOriginalOptionAfterCorrection']
    assert fresh['delivery']['address'] == resolved['followupOption'] and fresh['automaticRetarget'] is False
    assert fresh['completeCorrectionContext'] is False and fresh['omissions']
    assert fresh['exposureIndex'] == ['ADMISSION-1', 'TRIAL-1']
    correction = read(directory / 'followup-result.json')['result']['investigramRelationships'][0]
    for key in ['reason', 'qualifications', 'evidence']:
        assert fresh['revisionNotice'][key] == correction[key]
    assert fresh['revisionNotice']['target'] == correction['target']['investigram']
    assert fresh['revisionNotice']['relationship'] == ledger['followupAcceptance']['relationshipIds'][correction['key']]
    for field in ['replacement', 'reporter']:
        assert fresh['revisionNotice'][field] == ledger['followupAcceptance']['investigramIds'][correction[field]['submittedInvestigram']]
    absent = access['replacementHasNoOption']
    assert investigrams[absent['investigram']]['followupOptions'] == absent['followupOptions'] == []
    explicit = copy.deepcopy(request); explicit['subject'] = {'investigram': absent['investigram']}
    try:
        resolve_option_request(explicit, investigrams, bindings)
    except AssertionError:
        pass
    else:
        raise AssertionError('Absent replacement option resolved through historical content')
    complete = {x['investigram'] for x in request['suppliedInvestigramContext'] if isinstance(x, dict)}
    assert complete == set(access['actualFollowup']['completeTargets'])
    assert 'ADMISSION-1' in complete
    return request, bindings


def check_variant(directory):
    ledger = read(directory / 'context-and-bindings.json')
    known = set(ledger['entry']['knownEntities'])
    earlier = {'ORIENTATION-0': {'content': []}}
    saved = []
    for filename, stage, request in [('first-result.json', 'firstAcceptance', 'firstRequest'),
                                      ('followup-result.json', 'followupAcceptance', 'followupRequest')]:
        doc = read(directory / filename)
        complete = {x['investigram'] for x in ledger[request]['suppliedInvestigramContext'] if isinstance(x, dict)}
        args = (ledger[stage], set(known), dict(earlier), complete, set(ledger[request]['suppliedEvidence']))
        investigrams = check_result(doc, *args)
        saved.append((doc, args))
        known.update(ledger[stage]['entityIds'].values())
        earlier.update({ledger[stage]['investigramIds'][k]: a for k, a in investigrams.items()})
    all_investigram_ids = {**ledger['firstAcceptance']['investigramIds'], **ledger['followupAcceptance']['investigramIds']}
    for selection in ledger['expectedSelections']:
        assert all(k in earlier for k in selection['investigrams'])
        for composition in selection.get('storedComposition', []):
            expected = [all_investigram_ids[c['submittedInvestigram']] for c in earlier[composition['parent']]['children']]
            assert composition['children'] == expected, 'captured composition differs from stored tree'
        for support in selection['identifyingSupport']:
            if isinstance(support, str):
                assert support in earlier
            else:
                investigram = earlier[support['investigram']]
                assert support['investigramQualifications'] == investigram['qualifications']
                assert support['basis'] == ledger['basis']['id']
                assert set(support['items']) <= {i['key'] for i in investigram['content']}
    probe = read(directory / 'illustration-access.json')
    assert probe['fixedTarget']['contentKey'] in {i['key'] for i in earlier[probe['fixedTarget']['investigram']]['content']}
    assert probe['freshAccess']['preservedTarget'] == probe['fixedTarget']
    assert probe['freshAccess']['automaticRetarget'] is False
    source = read(directory / 'followup-result.json')
    for entry in read(directory / 'diagram-traceability.json'):
        if entry['diagram'] != 'both':
            assert (directory / entry['diagram']).exists()
        paths = [entry['pointer']] if 'pointer' in entry else entry.get('pointers', [])
        for path in paths:
            value = source
            for part in path.strip('/').split('/'):
                value = value[int(part)] if isinstance(value, list) else value[part]
    return saved, earlier


mixed, mixed_investigrams = check_variant(BASE)
children, child_investigrams = check_variant(BASE / 'children')
check_option_chain(BASE, mixed_investigrams)
option_request, option_bindings = check_option_chain(BASE / 'children', child_investigrams)
# The behavioral diagram data is unchanged by its partition into child accounts.
for key in ['recovery', 'concurrent-callers']:
    get = lambda a: next(i for i in a['TRIAL-1']['content'] if i['key'] == key)
    assert get(mixed_investigrams) == get(child_investigrams)
assert not any(i['contentType'] == 'entity-description/0' for i in child_investigrams['ADMISSION-2']['content'])
assert child_investigrams['INTRO-1']['children'] == [{'submittedInvestigram': 'state-definitions'}, {'submittedInvestigram': 'admission'}]
# Negative probes: invariants reject malformed copies, never edit the fixture files.
first, args = children[0]
mutations = {
    'duplicate ownership': lambda d: d['result']['investigrams'][0]['children'].append({'submittedInvestigram': 'admission'}),
    'cycle': lambda d: d['result']['investigrams'][1]['children'].append({'submittedInvestigram': 'introduction'}),
    'orphan child': lambda d: d['result']['investigrams'][0]['children'].pop(),
    'missing child qualifications': lambda d: d['result']['investigrams'][1].update(qualifications=[]),
    'missing child identifies': lambda d: d['result']['investigrams'][1].update(contentAssociations=[]),
    'undeclared entity': lambda d: d['result']['investigrams'][1]['content'][0].update(subject={'introducedEntity': 'absent'}),
}
for name, mutate in mutations.items():
    invalid = copy.deepcopy(first)
    mutate(invalid)
    try:
        check_result(invalid, *args)
    except (AssertionError, KeyError):
        continue
    raise AssertionError('Invalid fixture accepted: ' + name)
follow, follow_args = children[1]
def trial_item(document, key):
    investigram = next(a for a in document['result']['investigrams'] if a['key'] == 'trial')
    return next(i for i in investigram['content'] if i['key'] == key)
def admission_item(document):
    investigram = next(a for a in document['result']['investigrams'] if a['key'] == 'admission-replacement')
    return next(i for i in investigram['content'] if i['key'] == 'admission-cases')
extra_mutations = {
    'unknown item-local role': lambda d: admission_item(d).update(stateBearer={'localRole': 'absent'}),
    'unknown target item': lambda d: admission_item(d)['illustrations'][0].update(contentKey='absent'),
    'unqualified illustration': lambda d: admission_item(d)['illustrations'][0].update(qualification=''),
    'forward causal reference': lambda d: trial_item(d, 'concurrent-callers')['prefix'][0].update(causedBy=['wait']),
}
for name, mutate in extra_mutations.items():
    invalid = copy.deepcopy(follow)
    mutate(invalid)
    try:
        check_result(invalid, *follow_args)
    except (AssertionError, KeyError):
        continue
    raise AssertionError('Invalid fixture accepted: ' + name)
# Option identity is investigram-local, not selected by prose or retargeted by replacement.
option_request_mutations = {
    'unknown key': lambda r, a: r['parameters'].update(optionKey='absent'),
    'label instead of key': lambda r, a: r['parameters'].update(optionKey='Concurrent callers and trial outcomes'),
    'non-option item': lambda r, a: r['parameters'].update(optionKey='admission-cases'),
    'architectural target as invocation subject': lambda r, a: r.update(subject={'entity': 'S'}),
    'unknown operation': lambda r, a: r.update(operation='arbitrary-question'),
    'undeclared user parameters': lambda r, a: r['parameters'].update(values={'question': 'another question'}),
    'missing original with same-key replacement': lambda r, a: (a['ADMISSION-2'].update(followupOptions=copy.deepcopy(a['ADMISSION-1']['followupOptions'])), a.pop('ADMISSION-1')),
    'unsupported method': lambda r, a: a['ADMISSION-1']['followupOptions'][0].update(method='undeclared-method'),
}
for name, mutate in option_request_mutations.items():
    invalid, registry = copy.deepcopy(option_request), copy.deepcopy(child_investigrams)
    mutate(invalid, registry)
    try:
        resolve_option_request(invalid, registry, option_bindings)
    except (AssertionError, KeyError):
        continue
    raise AssertionError('Invalid option invocation accepted: ' + name)
for name, change in [('missing option qualification', {'qualifications': []}),
                     ('undeclared option target', {'targets': [{'role': 'focus', 'subject': {'introducedEntity': 'absent'}}]})]:
    invalid = copy.deepcopy(first)
    next(a for a in invalid['result']['investigrams'] if a['key'] == 'admission')['followupOptions'][0].update(change)
    try:
        check_result(invalid, *args)
    except (AssertionError, KeyError):
        continue
    raise AssertionError('Invalid returned option accepted: ' + name)
print('Follow-up option chain and exact/replacement access pass in both variants; ten additional malformed option submissions/requests rejected.')
print('Both variants pass structural checks and traceability; ten malformed copies rejected.')
print('State and interaction content match across partitions. This is not product acceptance or semantic verification.')

# Content associations are exact own-content references, not title-based matching.
for path in [BASE / 'first-result.json', BASE / 'children/first-result.json']:
    ledger = read(path.parent / 'context-and-bindings.json')
    fixture = read(path)
    check_result(fixture, ledger['firstAcceptance'], set(ledger['entry']['knownEntities']), {'ORIENTATION-0'}, {'ORIENTATION-0'}, set(ledger['evidence']))
    for bad_key in ['absent-item', 'admission-cases']:
        bad = copy.deepcopy(fixture)
        owner = next(a for a in bad['result']['investigrams'] if any(x['role'] == 'identifies' for x in a['contentAssociations']))
        next(x for x in owner['contentAssociations'] if x['role'] == 'identifies')['contentKey'] = bad_key
        try:
            check_result(bad, ledger['firstAcceptance'], set(ledger['entry']['knownEntities']), {'ORIENTATION-0'}, {'ORIENTATION-0'}, set(ledger['evidence']))
        except AssertionError:
            pass
        else:
            raise AssertionError('invalid identifying-content association accepted')
print('Exact content associations pass; four dangling or mismatched association copies rejected.')
