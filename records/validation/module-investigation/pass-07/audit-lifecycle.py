"""Independent post-run reconciliation of immutable records and derived causes.
No source/model access; operates on actual observation artifacts only.
"""
import json
from pathlib import Path
base=Path(__file__).parent
results=[]
for case in sorted(p for p in base.iterdir() if (p/'result.json').exists()):
    batches=[json.loads(s) for s in (case/'observations.jsonl').read_text().splitlines()]
    commands=[json.loads(s)['command'] for s in (case/'commands.jsonl').read_text().splitlines()]
    accounts={};provenance={};corrections={};evaluations={};repeats=0;inspections=0;prior_calls=0;warnings=set();conflicts=set();updates=0
    for batch in batches:
        view=next((r['value'] for r in batch['records'] if r['kind']=='qualified-view'),None)
        if view is None:continue
        command=commands[batch['command']-1]
        result=view.get('result') or {};evaluation=result.get('evaluation')
        for account in view.get('accounts',[]):
            if account['id'] in accounts:assert account==accounts[account['id']],('immutable account',command)
            accounts[account['id']]=account
        for origin in view.get('provenance',[]):
            if origin['id'] in provenance:assert origin==provenance[origin['id']],('immutable provenance',command)
            provenance[origin['id']]=origin
        for correction in view.get('corrections',[]):
            if correction['id'] in corrections:assert correction==corrections[correction['id']],('immutable correction',command)
            corrections[correction['id']]=correction
        if evaluation:
            if evaluation['id'] in evaluations:assert evaluation==evaluations[evaluation['id']]
            else:evaluations[evaluation['id']]=evaluation
        ordered=[corrections[c] for e in evaluations.values() for c in e['corrections']]
        # Only accepted evaluations introduce the ordered correction population.
        active=[accounts[a] for e in evaluations.values() for a in e['investigrams']]
        outgoing={};incoming={}
        for c in ordered:outgoing.setdefault(c['target'],[]).append(c);incoming.setdefault(c['replacement'],[]).append(c)
        def links(root,family=False):
            pending=[root];seen=set();found=set()
            while pending:
                a=pending.pop()
                if a in seen:continue
                seen.add(a)
                for c in outgoing.get(a,[])+(incoming.get(a,[]) if family else []):
                    found.add(c['id']);pending.append(c['replacement'])
                    if family:pending.append(c['target'])
            return [c for c in ordered if c['id'] in found]
        def primary(a):
            found=links(a);return found[-1]['replacement'] if found else a
        affected={}
        for c in ordered:
            population=set();changed=True
            while changed:
                changed=False
                for a in active:
                    p=provenance[a['provenance']]
                    if p['id']==c['provenance'] or c['id'] in p['completeCorrections']:continue
                    if a['id'] not in population and any(x==c['target'] or x in population for x in p['citations']):population.add(a['id']);changed=True
            affected[c['id']]=population
        for status in view.get('revisions',[]):
            a=status['original'];family=links(a,True);targets=[c['target'] for c in family]
            causes=[c['id'] for c in ordered if a in affected[c['id']]]
            assert status['primary']==primary(a)
            assert status['familyPrimary']==(family[-1]['replacement'] if family else a)
            assert status['superseded']==(primary(a)!=a)
            assert status['conflicting']==(len(targets)!=len(set(targets)))
            assert status['needsReconsideration']==bool(causes) and status['causeCount']==len(causes)
            assert len(status['rows'])<=24
            if causes:warnings.add(a)
            if status['conflicting']:conflicts.add(a)
            for row in status['rows']:
                if row['cause']:
                    assert row['correction'] in causes and len(row['cause']['via'])<=8
                    p=provenance[accounts[a]['provenance']]
                    assert row['cause']['direct']==(row['target'] in p['citations'])
                    assert all(v in p['citations'] and (v==row['target'] or v in affected[row['correction']]) for v in row['cause']['via'])
        for place in view.get('display',[]):
            assert place['account']==(place['original'] if view['projection']['lens']=='inspect' else primary(place['original']))
            if place['parent']:assert place['original'] in accounts[place['parent']]['children']
            updates+=place['account']!=place['original']
        calls=view.get('usage',{}).get('calls',prior_calls)
        if result.get('reused'):repeats+=1;assert calls==prior_calls
        if command.startswith('inspect '):inspections+=1;assert calls==prior_calls
        prior_calls=calls
    assert repeats>=1 and inspections>=3
    results.append({'case':case.name,'immutableAccounts':len(accounts),'acceptedEvaluations':sum(e['outcome']['kind']=='accepted' for e in evaluations.values()),
        'corrections':len(ordered),'affectedAccountsObserved':len(warnings),'conflictingAccountsObserved':len(conflicts),'displaySubstitutionsObserved':updates,
        'retainedRepeats':repeats,'inspections':inspections,'derivedStateMatchesIndependentReconciliation':True})
(base/'lifecycle-verification.json').write_text(json.dumps(results,indent=2)+'\n')
print(json.dumps(results,indent=2))
