"""Post-run checks on displayed history, retained reuse and per-command usage."""
import json
from pathlib import Path
base=Path(__file__).parent
rows=[]
for case in sorted(base.glob('*-m4')):
    batches=[json.loads(s) for s in (case/'observations.jsonl').read_text().splitlines()]
    commands=[json.loads(s)['command'] for s in (case/'commands.jsonl').read_text().splitlines()]
    known={};initial={};repeats=0;inspections=0;corrections=set();lenses=[]
    prior_call_count=0
    for batch in batches:
        view=next((r['value'] for r in batch['records'] if r['kind']=='qualified-view'),None)
        command=commands[batch['command']-1]
        if view is None:
            assert command=='exit' and next(r['value'] for r in batch['records'] if r['kind']=='rendered-output')==''
            continue
        for a in view.get('accounts',[]):
            if a['id'] in known:assert a==known[a['id']],('historical account changed',command)
            known[a['id']]=a
        lens=view['projection']['lens'];lenses.append(lens)
        for c in view.get('corrections',[]):corrections.add(c['id'])
        usage=next((r['value'] for r in batch['records'] if r['kind']=='investigation-usage'),None)
        count=sum(len(a['usage']) for a in usage['attempts']) if usage else prior_call_count
        result=view.get('result') or {}
        if result.get('reused'):
            repeats+=1
            assert command in initial and result['evaluation']==initial[command]
            assert count==prior_call_count,('repeat added calls',command)
        elif result.get('evaluation'):
            initial[command]=result['evaluation']
        if command.startswith('inspect '):
            inspections+=1;assert count==prior_call_count,('inspection added calls',command)
        prior_call_count=count
    if case.name=='progressive-numeric-m4':
        first=next(r['value'] for r in batches[0]['records'] if r['kind']=='qualified-view')
        originals={a['id'] for a in first['accounts']}
        all_corrections={c['id']:c for b in batches for r in b['records'] if r['kind']=='qualified-view' for c in r['value'].get('corrections',[])}
        assert len(originals)==2 and {c['target'] for c in all_corrections.values()}==originals
        assert all(c['replacement'] in known and c['reporter'] in known for c in all_corrections.values())
        module=first['result']['request']['subject']
        assert all(module in c['correctedSubjects'] and all(':module:' in subject or ':symbol:' in subject for subject in c['correctedSubjects']) for c in all_corrections.values())
        assert all(a==known[a['id']] for a in first['accounts'])
    assert repeats>=1 and inspections>=3
    assert set(['summarize','explain','decompose','examine']).issubset(lenses)
    rows.append({'case':case.name,'commandsWithObservations':len(batches),'retainedRepeats':repeats,'inspections':inspections,'unchangedDisplayedAccountRecords':len(known),'displayedCorrections':len(corrections),'repeatAndInspectionAddedNoCalls':True})
(base/'navigation-verification.json').write_text(json.dumps(rows,indent=2)+'\n')
print(json.dumps(rows,indent=2))
