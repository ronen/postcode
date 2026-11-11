"""Check authored design fixtures, not the implemented PostCode protocol or truth.
Run with Python 3 from any directory. No dependencies and no fixture mutations.
"""
import copy
import json
from pathlib import Path

BASE = Path(__file__).resolve().parent


def read(path):
    return json.loads(path.read_text())


def check_result(document, bindings, known_subjects, earlier, supplied, evidence):
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
        identifies = {canon(x['subject']) for x in a['associations'] if x['role'] == 'identifies'}
        for item in a['content']:
            if item['form'] == 'subject-description/0':
                assert canon(item['subject']) in identifies, 'missing identifying association on owner'
            if item.get('introduceRetainedSubject'):
                key = item['subject']['introducedSubject']
                assert key not in declarations, 'duplicate subject declaration'
                assert item['name'] and item['description']
                declarations[key] = item
    assert set(declarations) == set(bindings['subjectIds'])
    def references(value, roles=None):
        if isinstance(value, list):
            for child in value:
                references(child, roles)
        elif isinstance(value, dict):
            if set(value) == {'subject'} and isinstance(value['subject'], str):
                assert value['subject'] in known_subjects, 'unknown retained subject'
            if set(value) == {'introducedSubject'}:
                assert value['introducedSubject'] in declarations, 'undeclared subject'
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


def check_variant(directory):
    ledger = read(directory / 'context-and-bindings.json')
    known = set(ledger['entry']['knownSubjects'])
    earlier = {'ORIENTATION-0': {'content': []}}
    saved = []
    for filename, stage, request in [('first-result.json', 'firstAcceptance', 'firstRequest'),
                                      ('followup-result.json', 'followupAcceptance', 'followupRequest')]:
        doc = read(directory / filename)
        complete = {x['account'] for x in ledger[request]['suppliedAccountContext'] if isinstance(x, dict)}
        args = (ledger[stage], set(known), dict(earlier), complete, set(ledger[request]['suppliedEvidence']))
        accounts = check_result(doc, *args)
        saved.append((doc, args))
        known.update(ledger[stage]['subjectIds'].values())
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
# The behavioral diagram data is unchanged by its partition into child accounts.
for key in ['recovery', 'concurrent-callers']:
    get = lambda a: next(i for i in a['TRIAL-1']['content'] if i['key'] == key)
    assert get(mixed_accounts) == get(child_accounts)
assert not any(i['form'] == 'subject-description/0' for i in child_accounts['ADMISSION-2']['content'])
assert child_accounts['INTRO-1']['children'] == [{'submittedAccount': 'state-definitions'}, {'submittedAccount': 'admission'}]
# Negative probes: invariants reject malformed copies, never edit the fixture files.
first, args = children[0]
mutations = {
    'duplicate ownership': lambda d: d['result']['accounts'][0]['children'].append({'submittedAccount': 'admission'}),
    'cycle': lambda d: d['result']['accounts'][1]['children'].append({'submittedAccount': 'introduction'}),
    'orphan child': lambda d: d['result']['accounts'][0]['children'].pop(),
    'missing child qualifications': lambda d: d['result']['accounts'][1].update(qualifications=[]),
    'missing child identifies': lambda d: d['result']['accounts'][1].update(associations=[]),
    'undeclared subject': lambda d: d['result']['accounts'][1]['content'][0].update(subject={'introducedSubject': 'absent'}),
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
extra_mutations = {
    'unknown item-local role': lambda d: trial_item(d, 'recovery').update(stateBearer={'localRole': 'absent'}),
    'unknown target item': lambda d: trial_item(d, 'recovery')['illustrations'][0].update(contentKey='absent'),
    'unqualified illustration': lambda d: trial_item(d, 'recovery')['illustrations'][0].update(qualification=''),
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
print('Both variants pass structural checks and traceability; ten malformed copies rejected.')
print('State and interaction content match across partitions. This is not product acceptance or semantic verification.')
