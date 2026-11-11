"""Check authored design fixtures, not the implemented PostCode protocol or truth.
Run with Python 3 from any directory. No dependencies and no fixture mutations.
"""
import copy
import json
from pathlib import Path

BASE = Path(__file__).resolve().parent
# Stipulated capabilities for these authored fixtures, not a product registry.
OFFER_METHODS = {'qualified-architectural-interpretation'}


def read(path):
    return json.loads(path.read_text())


def check_result(document, bindings, known_entities, earlier, supplied, evidence):
    result = document['result']
    accounts = {a['key']: a for a in result['accounts']}
    assert len(accounts) == len(result['accounts']), 'duplicate account key'
    assert set(accounts) == set(bindings['accountIds']), 'account bindings differ'
    root = result['rootAccount']['submittedAccount']
    assert root in accounts, 'unknown result root'
    owned = {k: [] for k in accounts}
    owned[root].append('root')
    edges = {k: [] for k in accounts}
    for key, a in accounts.items():
        for child in a['children']:
            assert set(child) == {'submittedAccount'}, 'old/external child adoption'
            target = child['submittedAccount']
            assert target in accounts, 'missing child'
            owned[target].append(key)
            edges[key].append(target)
    relationships = result['accountRelationships']
    assert len({r['key'] for r in relationships}) == len(relationships)
    assert {r['key'] for r in relationships} == set(bindings['relationshipIds'])
    for rel in relationships:
        assert rel['kind'] == 'correction' and rel['reason'] and rel['qualifications']
        reporter = rel['reporter']['submittedAccount']
        replacement = rel['replacement']['submittedAccount']
        assert reporter in accounts and replacement in accounts
        assert rel['target']['account'] in supplied, 'incomplete correction target'
        assert rel['target']['account'] in earlier, 'target must predate result'
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
    assert reached == set(accounts), 'unreachable owned account'

    declarations = {}
    def canon(value):
        return json.dumps(value, sort_keys=True)
    for a in accounts.values():
        assert a['qualifications'] and a['evidence'] and a['referents'], 'missing own qualification/support'
        assert len({i['key'] for i in a['content']}) == len(a['content'])
        for association in a['associations']:
            if 'contentKey' in association:
                assert association['contentKey'] in {i['key'] for i in a['content']}, 'unknown associated item'
        identifies = {canon(x['subject']) for x in a['associations'] if x['role'] == 'identifies'}
        for item in a['content']:
            if item['form'] == 'entity-description/0':
                assert canon(item['subject']) in identifies, 'missing identifying association on owner'
                assert any(x['role'] == 'identifies' and x['subject'] == item['subject'] and x.get('contentKey') == item['key'] for x in a['associations']), 'identifying item not addressed'
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
            if set(value) == {'submittedAccount'}:
                assert value['submittedAccount'] in accounts, 'unknown submitted account'
            if set(value) == {'account'} and isinstance(value['account'], str):
                assert value['account'] in earlier, 'unknown prior account'
            if set(value) == {'localRole'} and roles is not None:
                assert value['localRole'] in roles, 'unknown item-local role'
            for ev in value.get('evidence', []):
                if isinstance(ev, str):
                    assert ev in evidence, 'evidence unavailable in dialogue'
            for child in value.values():
                references(child, roles)
    references(result)
    for a in accounts.values():
        own_items = {i['key']: i for i in a['content']}
        for item in own_items.values():
            roles = {r['key'] for r in item.get('roles', [])}
            assert len(roles) == len(item.get('roles', [])), 'duplicate local role'
            if roles:
                assert item['roleScope']
            references(item, roles)
            for link in item.get('relatedContent', []):
                ref = link['account']
                target = accounts[ref['submittedAccount']] if 'submittedAccount' in ref else earlier[ref['account']]
                assert link['contentKey'] in {i['key'] for i in target['content']}, 'unknown related content item'
                assert link['purpose'], 'missing related-content purpose'
            for illustration in item.get('illustrations', []):
                ref = illustration['account']
                target = accounts[ref['submittedAccount']] if 'submittedAccount' in ref else earlier[ref['account']]
                assert illustration['contentKey'] in {i['key'] for i in target['content']}, 'unknown exact content key'
                assert illustration['qualification'] and illustration['evidence']
                mapped = [b['role'] for b in illustration['roleBindings']]
                assert len(mapped) == len(set(mapped)) and set(mapped) == roles
                if 'case' in illustration:
                    assert item['form'] == 'admission-cases/0'
                    assert illustration['case'] in {c['key'] for c in item['cases']}
            if item['form'] == 'investigation-offer/0':
                assert item['label'] and item['purpose'] and item['qualifications'] and item['evidence'], 'unqualified/incomplete offer'
                assert item['method'] in OFFER_METHODS, 'unsupported offer method'
                assert item['parameterDefinitions'] == [], 'parameterized offers outside this probe'
                assert len(item['targets']) == 1 and item['targets'][0]['role'] == 'focus'
                assert set(item['targets'][0]['subject']) in [{'entity'}, {'introducedEntity'}]
            if item['form'] == 'state-behavior/0':
                states = {s['key'] for s in item['states']}
                assert len(states) == len(item['states'])
                assert len({t['key'] for t in item['transitions']}) == len(item['transitions'])
                assert all(t['source'] in states and t['target'] in states for t in item['transitions'])
            if item['form'] == 'interaction/0':
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
                            assert step['transition'] in {t['key'] for t in model['transitions']}
                        prior.add(step['key'])
                    return prior
                prefix = path(item['prefix'])
                for branch in item['alternatives']:
                    path(branch['steps'], prefix)
    return accounts


def resolve_offer_request(request, accounts, entity_bindings):
    assert request['operation'] == 'follow-up-investigation', 'unsupported invocation'
    assert set(request['subject']) == {'account'}, 'offer invocation needs an exact account'
    params = request['parameters']
    assert set(params) == {'offerKey', 'values'} and params['values'] == {}, 'undeclared parameter values'
    origin = request['subject']['account']
    account = accounts[origin]  # No fallback to replacements, labels or matching keys elsewhere.
    matches = [i for i in account['content'] if i['key'] == params['offerKey']]
    assert len(matches) == 1 and matches[0]['form'] == 'investigation-offer/0', 'not an exact offer'
    offer = matches[0]
    assert offer['method'] in OFFER_METHODS and offer['parameterDefinitions'] == []
    targets = copy.deepcopy(offer['targets'])
    for target in targets:
        ref = target['subject']
        if 'introducedEntity' in ref:
            target['subject'] = {'entity': entity_bindings[origin][ref['introducedEntity']]}
    return {'offer': {'account': origin, 'contentKey': offer['key']}, 'method': offer['method'],
            'architecturalTargets': targets, 'parameterValues': params['values']}


def check_offer_chain(directory, accounts):
    ledger = read(directory / 'context-and-bindings.json')
    bindings = {}
    for stage in ['firstAcceptance', 'followupAcceptance']:
        bindings.update({a: ledger[stage]['entityIds'] for a in ledger[stage]['accountIds'].values()})
    request = ledger['followupRequest']
    resolved = resolve_offer_request(request, accounts, bindings)
    documentary_change = copy.deepcopy(request)
    documentary_change['informationNeed'] = 'Different explanatory wording, not another operation.'
    assert resolve_offer_request(documentary_change, accounts, bindings) == resolved
    expected = ledger['followupResolution']
    assert all(expected[k] == v for k, v in resolved.items())
    source = accounts[resolved['offer']['account']]
    offer = next(i for i in source['content'] if i['key'] == resolved['offer']['contentKey'])
    assert request['informationNeed'] == offer['purpose']  # Documentary wording, not resolver input.
    assert ledger['applicationAssumptions']['operation'] == request['operation']
    assert set(ledger['applicationAssumptions']['supportedMethods']) == OFFER_METHODS
    provenance = expected['provenance']
    assert provenance['invocationSubject'] == request['subject']
    assert provenance['offerKey'] == request['parameters']['offerKey']
    assert set(provenance['outputs']) == set(ledger['followupAcceptance']['accountIds'].values())
    access = read(directory / 'offer-access.json')
    assert access['exactAnswer']['offer'] == resolved['offer']
    for key in ['offerOnlyBeforeCorrection', 'freshOriginalOfferAfterCorrection', 'explicitReplacementOffer']:
        delivery = access[key]['delivery']; address = delivery['address']
        original = accounts[address['account']]
        content = copy.deepcopy(next(i for i in original['content'] if i['key'] == address['contentKey']))
        for target in content['targets']:
            ref = target['subject']
            if 'introducedEntity' in ref:
                target['subject'] = {'entity': bindings[address['account']][ref['introducedEntity']]}
        assert delivery['content'] == content, 'offer excerpt lost or changed content'
        assert delivery['accountQualifications'] == original['qualifications'], 'offer lost account scope'
        assert delivery['basis'] == ledger['basis']['id']
        assert access[key]['completeTargets'] == [], 'offer alone is not complete delivery'
    assert access['offerOnlyBeforeCorrection']['citations'] == ['ADMISSION-1']
    assert access['explicitReplacementOffer']['citations'] == ['ADMISSION-2']
    fresh = access['freshOriginalOfferAfterCorrection']
    assert fresh['delivery']['address'] == resolved['offer'] and fresh['automaticRetarget'] is False
    assert fresh['completeCorrectionContext'] is False and fresh['omissions']
    assert fresh['citations'] == ['ADMISSION-1', 'TRIAL-1']
    correction = read(directory / 'followup-result.json')['result']['accountRelationships'][0]
    for key in ['reason', 'qualifications', 'evidence']:
        assert fresh['revisionNotice'][key] == correction[key]
    assert fresh['revisionNotice']['target'] == correction['target']['account']
    assert fresh['revisionNotice']['relationship'] == ledger['followupAcceptance']['relationshipIds'][correction['key']]
    for field in ['replacement', 'reporter']:
        assert fresh['revisionNotice'][field] == ledger['followupAcceptance']['accountIds'][correction[field]['submittedAccount']]
    replacement = fresh['replacementOfferReference']
    assert replacement == access['explicitReplacementOffer']['delivery']['address']
    assert replacement['contentKey'] == resolved['offer']['contentKey'] and replacement['account'] != resolved['offer']['account']
    explicit = copy.deepcopy(request); explicit['subject'] = {'account': replacement['account']}
    assert resolve_offer_request(explicit, accounts, bindings)['offer'] == replacement
    complete = {x['account'] for x in request['suppliedAccountContext'] if isinstance(x, dict)}
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
        complete = {x['account'] for x in ledger[request]['suppliedAccountContext'] if isinstance(x, dict)}
        args = (ledger[stage], set(known), dict(earlier), complete, set(ledger[request]['suppliedEvidence']))
        accounts = check_result(doc, *args)
        saved.append((doc, args))
        known.update(ledger[stage]['entityIds'].values())
        earlier.update({ledger[stage]['accountIds'][k]: a for k, a in accounts.items()})
    all_account_ids = {**ledger['firstAcceptance']['accountIds'], **ledger['followupAcceptance']['accountIds']}
    for selection in ledger['expectedSelections']:
        assert all(k in earlier for k in selection['accounts'])
        for composition in selection.get('storedComposition', []):
            expected = [all_account_ids[c['submittedAccount']] for c in earlier[composition['parent']]['children']]
            assert composition['children'] == expected, 'captured composition differs from stored tree'
        for support in selection['identifyingSupport']:
            if isinstance(support, str):
                assert support in earlier
            else:
                account = earlier[support['account']]
                assert support['accountQualifications'] == account['qualifications']
                assert support['basis'] == ledger['basis']['id']
                assert set(support['items']) <= {i['key'] for i in account['content']}
    probe = read(directory / 'illustration-access.json')
    assert probe['fixedTarget']['contentKey'] in {i['key'] for i in earlier[probe['fixedTarget']['account']]['content']}
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


mixed, mixed_accounts = check_variant(BASE)
children, child_accounts = check_variant(BASE / 'children')
check_offer_chain(BASE, mixed_accounts)
offer_request, offer_bindings = check_offer_chain(BASE / 'children', child_accounts)
# The behavioral diagram data is unchanged by its partition into child accounts.
for key in ['recovery', 'concurrent-callers']:
    get = lambda a: next(i for i in a['TRIAL-1']['content'] if i['key'] == key)
    assert get(mixed_accounts) == get(child_accounts)
assert not any(i['form'] == 'entity-description/0' for i in child_accounts['ADMISSION-2']['content'])
assert child_accounts['INTRO-1']['children'] == [{'submittedAccount': 'state-definitions'}, {'submittedAccount': 'admission'}]
# Negative probes: invariants reject malformed copies, never edit the fixture files.
first, args = children[0]
mutations = {
    'duplicate ownership': lambda d: d['result']['accounts'][0]['children'].append({'submittedAccount': 'admission'}),
    'cycle': lambda d: d['result']['accounts'][1]['children'].append({'submittedAccount': 'introduction'}),
    'orphan child': lambda d: d['result']['accounts'][0]['children'].pop(),
    'missing child qualifications': lambda d: d['result']['accounts'][1].update(qualifications=[]),
    'missing child identifies': lambda d: d['result']['accounts'][1].update(associations=[]),
    'undeclared entity': lambda d: d['result']['accounts'][1]['content'][0].update(subject={'introducedEntity': 'absent'}),
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
    account = next(a for a in document['result']['accounts'] if a['key'] == 'trial')
    return next(i for i in account['content'] if i['key'] == key)
def admission_item(document):
    account = next(a for a in document['result']['accounts'] if a['key'] == 'admission-replacement')
    return next(i for i in account['content'] if i['key'] == 'admission-cases')
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
# Offer identity is account-local, not selected by prose or retargeted by replacement.
offer_request_mutations = {
    'unknown key': lambda r, a: r['parameters'].update(offerKey='absent'),
    'label instead of key': lambda r, a: r['parameters'].update(offerKey='Concurrent callers and trial outcomes'),
    'non-offer item': lambda r, a: r['parameters'].update(offerKey='admission-cases'),
    'architectural target as invocation subject': lambda r, a: r.update(subject={'entity': 'S'}),
    'unknown operation': lambda r, a: r.update(operation='arbitrary-question'),
    'undeclared user parameters': lambda r, a: r['parameters'].update(values={'question': 'another question'}),
    'missing original with same-key replacement': lambda r, a: a.pop('ADMISSION-1'),
    'unsupported method': lambda r, a: a['ADMISSION-1']['content'][-1].update(method='undeclared-method'),
}
for name, mutate in offer_request_mutations.items():
    invalid, registry = copy.deepcopy(offer_request), copy.deepcopy(child_accounts)
    mutate(invalid, registry)
    try:
        resolve_offer_request(invalid, registry, offer_bindings)
    except (AssertionError, KeyError):
        continue
    raise AssertionError('Invalid offer invocation accepted: ' + name)
for name, change in [('missing offer qualification', {'qualifications': []}),
                     ('undeclared offer target', {'targets': [{'role': 'focus', 'subject': {'introducedEntity': 'absent'}}]})]:
    invalid = copy.deepcopy(first)
    next(a for a in invalid['result']['accounts'] if a['key'] == 'admission')['content'][-1].update(change)
    try:
        check_result(invalid, *args)
    except (AssertionError, KeyError):
        continue
    raise AssertionError('Invalid returned offer accepted: ' + name)
print('Offer chain and exact/replacement access pass in both variants; ten additional malformed offer submissions/requests rejected.')
print('Both variants pass structural checks and traceability; ten malformed copies rejected.')
print('State and interaction content match across partitions. This is not product acceptance or semantic verification.')

# Item associations are exact own-content references, not title-based matching.
for path in [BASE / 'first-result.json', BASE / 'children/first-result.json']:
    ledger = read(path.parent / 'context-and-bindings.json')
    fixture = read(path)
    check_result(fixture, ledger['firstAcceptance'], set(ledger['entry']['knownEntities']), {'ORIENTATION-0'}, {'ORIENTATION-0'}, set(ledger['evidence']))
    for bad_key in ['absent-item', 'admission-cases']:
        bad = copy.deepcopy(fixture)
        owner = next(a for a in bad['result']['accounts'] if any(x['role'] == 'identifies' for x in a['associations']))
        next(x for x in owner['associations'] if x['role'] == 'identifies')['contentKey'] = bad_key
        try:
            check_result(bad, ledger['firstAcceptance'], set(ledger['entry']['knownEntities']), {'ORIENTATION-0'}, {'ORIENTATION-0'}, set(ledger['evidence']))
        except AssertionError:
            pass
        else:
            raise AssertionError('invalid identifying-item association accepted')
print('Exact item associations pass; four dangling or mismatched association copies rejected.')
