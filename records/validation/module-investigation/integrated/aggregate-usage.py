"""Aggregate frozen assessment ledgers; no network or credential access."""
from pathlib import Path
import json

base = Path(__file__).resolve().parent.parent
passes = []
for number in range(1, 8):
    name = f'pass-{number:02}'
    folder = base / name
    ledger = json.loads((folder / 'request-budget.json').read_text())
    report = json.loads((folder / 'usage-report.json').read_text())
    groups = [group for run in report['runs'] for group in run['groups']]
    assert all(group['source'] == 'provider' and group['billingRoute'] == 'chatgpt-plan'
               and group['authenticationRoute'] == 'chatgpt-sign-in' for group in groups)
    names = list(dict.fromkeys(request['run'] for request in ledger['requests']))
    if number == 1:
        names.append('focused-hard-limit')  # Captured zero-call guard control.
    sessions = []
    for run in names:
        requests = [request for request in ledger['requests'] if request['run'] == run]
        known = [request['usage']['total_tokens'] for request in requests
                 if isinstance(request.get('usage'), dict) and 'total_tokens' in request['usage']]
        sessions.append(dict(run=run, providerRequests=len(requests), knownReportedTokens=sum(known),
                             missingReports=len(requests) - len(known)))
    known_tokens = sum(row['knownReportedTokens'] for row in sessions)
    assert known_tokens == sum(category['value'] for group in groups for category in group['categories']
                               if category['category'] == 'total' and category['unit'] == 'tokens')
    missing = sum(row['missingReports'] for row in sessions)
    assert missing == sum(run['missingCalls'] for run in report['runs'])
    synthetic = sum(run['calls'] for run in report['runs']) - len(ledger['requests'])
    if number >= 3:
        raw = json.loads((folder / 'usage-runs.json').read_text())
        assert synthetic == sum(len(attempt['usage']) for run in raw for attempt in run['usage']['attempts']
                                if attempt['agent']['origin'] == 'scripted')
    else:
        assert synthetic == 0
    assert sum(run['anomalousCalls'] for run in report['runs']) == synthetic
    passes.append(dict(assessmentPass=name, authenticationRoute='chatgpt-sign-in', billingRoute='chatgpt-plan',
                       ledger=f'{name}/request-budget.json', usageReport=f'{name}/usage-report.json',
                       roleUsage=f'{name}/assessment-agent-usage.json', sessions=sessions,
                       providerRequests=len(ledger['requests']), knownReportedTokens=known_tokens,
                       missingProviderReports=missing, anomalousProviderReports=0,
                       emptySyntheticReportsExcluded=synthetic))
result = dict(passes=passes, totals={key: sum(row[key] for row in passes) for key in
              ['providerRequests', 'knownReportedTokens', 'missingProviderReports',
               'anomalousProviderReports', 'emptySyntheticReportsExcluded']},
              monetaryAttribution=None, assessmentRoleUsage=None,
              limitations=['Includes all seven frozen assessment passes and their recovery attempts; failed calls are retained.',
                           'Token subsets are not added to total tokens. Missing reports are unknown, not zero.',
                           'API-key support has offline coverage; no API-billed assessment runs are recorded.',
                           'Diagnostic/connection requests are separate; see 2026-09-30-chatgpt-completed-items.md.',
                           'Evaluator, assessor, reference-preparer and orchestrator usage is separately unavailable, not zero.',
                           'ChatGPT included allowance versus optional purchased-credit attribution is unknown; API prices are not actual charges.'])
(base / 'integrated' / 'usage-summary.json').write_text(json.dumps(result, indent=2) + '\n')
print(json.dumps(result['totals']))
