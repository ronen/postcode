"""Check the completed chain and exposure rule from retained observations only."""
from pathlib import Path
import json
base = Path(__file__).parent
case = base / 'merge-anything-m5'
batches = [json.loads(line) for line in (case / 'observations.jsonl').read_text().splitlines()]
views = [record['value'] for batch in batches for record in batch['records'] if record['kind'] == 'qualified-view']
accepted = {}; accounts = {}; origins = {}
for view in views:
    for account in view.get('accounts', []):
        if account['id'] in accounts:
            assert accounts[account['id']] == account
        accounts[account['id']] = account
    for origin in view.get('provenance', []):
        origins[origin['id']] = origin
    evaluation = (view.get('result') or {}).get('evaluation')
    if evaluation and evaluation['outcome']['kind'] == 'accepted':
        accepted[evaluation['id']] = evaluation
chain = list(accepted.values())
assert [item['request']['operation'] for item in chain] == ['functionality', 'clarification', 'decomposition', 'examination']
for prior, following in zip(chain, chain[1:]):
    assert following['request']['subject'] in prior['investigrams']
inconsistencies = []
for account in accounts.values():
    for item in account['inconsistencies']:
        origin = origins[account['provenance']]
        assert set(item['targets']).issubset(origin['citations'])
        inconsistencies.append({'reporter': account['id'], 'targets': item['targets'], 'allTargetsCited': True})
disclosures = []
for batch in batches:
    for event in batch['events']:
        if event['type'] != 'source-escape':
            continue
        view = next(record['value'] for record in batch['records'] if record['kind'] == 'qualified-view')
        rendered = next(record['value'] for record in batch['records'] if record['kind'] == 'rendered-output')
        assert event['sourceForms'] == ['locations']
        items = view['sourceDetail']['items']
        assert items and all(item['path'] in rendered for item in items)
        disclosures.append({'command': batch['command'], 'forms': event['sourceForms'], 'renderedLocations': len(items)})
assert len(disclosures) == 1
result = {'acceptedChain': [{'operation': item['request']['operation'], 'subject': item['request']['subject'], 'root': item['outcome']['root']} for item in chain],
          'eachFollowUpTargetsTheImmediatelyPrecedingResult': True,
          'sourceDisclosures': disclosures,
          'inconsistencies': inconsistencies,
          'newInconsistencyTargetsMeetCurrentCitationRule': True,
          'limits': 'Historical pass-05 runtime used; this is a post-run exposure check, not live verification of current acceptance code or semantic truth.'}
(base / 'completion-verification.json').write_text(json.dumps(result, indent=2) + '\n')
print(json.dumps(result))
