"""Reconcile captured requests, accepted content exposure and authoritative usage."""
import json, pathlib, sys
base=pathlib.Path(sys.argv[1] if len(sys.argv)>1 else 'records/validation/module-investigation/pass-07')
ledger=json.loads((base/'request-budget.json').read_text())['requests']
instructions=json.loads((base/'instructions.json').read_text())
rows=[];runs=[]
for case in sorted(p for p in base.iterdir() if p.is_dir() and (p/'observations.jsonl').exists()):
 bs=[json.loads(line) for line in (case/'observations.jsonl').read_text().splitlines()]
 views=[r['value'] for b in bs for r in b['records'] if r['kind']=='qualified-view']
 usage=next(v['usage'] for v in reversed(views) if 'usage' in v)
 for b in bs:
  v=next((r['value'] for r in b['records'] if r['kind']=='qualified-view'),None)
  u=next((r['value'] for r in b['records'] if r['kind']=='investigation-usage'),None)
  if v and 'usage' in v: assert v['usage']==u
 live=[a for a in usage['attempts'] if a['agent']['origin']=='hosted']
 xs=[json.loads(line) for line in (case/'exchanges.jsonl').read_text().splitlines()] if (case/'exchanges.jsonl').exists() else []
 selected=[r for r in ledger if r['run']==case.name]
 assert len(xs)==len(selected)==sum(len(a['usage']) for a in live)
 groups=[]; offset=0
 for attempt in live:
  count=len(attempt['usage']);groups.append(xs[offset:offset+count]);offset+=count
 assert offset==len(xs)
 resolved=0;tokens=0;outcomes=[]
 for exchanges, attempt in zip(groups,live):
  supplied=set(); summarized=set(); citations=set(); previous={}
  for x in exchanges:
   audit=x['references'];assert audit['characterGuard']=='canonical-domain-exchanges'
   bindings={item['handle']:item['reference'] for item in audit['bindings']}
   assert len(bindings)==len(audit['bindings'])==len(set(bindings.values()))
   assert all(bindings[k]==v for k,v in previous.items()); previous=bindings
   for r in audit['resolutions']:
    assert r['reference'] is not None and bindings[r['handle']]==r['reference'];resolved+=1
   req=json.loads(x['request']['input'][0]['content'])['request']
   assert req['operation']==attempt['request']['operation'] and bindings[req['subject']]==attempt['request']['subject']
   assert x['request']['instructions']==instructions[req['operation']]+'\n\n'+instructions['referenceTransport']
   assert x['request']['model']=='gpt-5.6-sol' and x['request']['reasoning']['effort']=='medium'
   if x.get('response',{}).get('usage'): tokens+=x['response']['usage']['total_tokens']
   for item in x['request']['input']:
    raw=item.get('output') if item.get('type')=='function_call_output' else item.get('content') if item.get('role')=='user' else None
    if not isinstance(raw,str):continue
    content=json.loads(raw);responses=content if isinstance(content,list) else content.get('responses',[])
    for response in responses:
     for record in response.get('records',[]):supplied.add(bindings[record['id']])
     for record in response.get('evaluations',[])+response.get('repositories',[]):
      summarized.add(bindings[record['id']])
      for qualification in record.get('qualification',[]):summarized.add(bindings[qualification['id']])
     for account in response.get('accounts',[]):
      if account.get('prose','').strip() or 'referent' in account or 'qualifications' in account:citations.add(bindings[account['id']])
      for inconsistency in account.get('revision',{}).get('inconsistencies',[]):citations.add(bindings[inconsistency['reporter']])
     for correction in response.get('corrections',[]):citations.add(bindings[correction['reporter']])
     # Bare listing and table bindings deliberately do not enter any exposure set.
  assert supplied==set(attempt['suppliedEvidence']) and summarized==set(attempt['summarizedEvidence'])
  origins=[p for v in views for p in v.get('provenance',[]) if p['request']==attempt['request']]
  if attempt['termination']=='accepted':
   assert origins and set(origins[0]['citations'])==citations
  outcomes.append({'operation':attempt['request']['operation'],'termination':attempt['termination'],'calls':len(exchanges),'citations':len(citations),'fullEvidenceRecords':len(supplied),'summaryRecords':len(summarized)})
 assert tokens==sum(x['usage']['total_tokens'] for x in selected if x.get('usage'))
 assert tokens==sum(c['value'] for g in usage['totals'] if g['source']=='provider' for c in g['categories'] if c['category']=='total')
 result=json.loads((case/'result.json').read_text());assert result['exit']==0 and not result['pausedForBudget']
 rows.append({'case':case.name,'liveOutcomes':outcomes,'requests':len(xs),'tokens':tokens,'exactResolvedFields':resolved,'missingCalls':sum(call['reported'] is None and not call['anomalies'] for a in live for call in a['usage']),'anomalousCalls':sum(bool(call['anomalies']) for a in live for call in a['usage']),'wireExposureEqualsCanonicalLedger':True,'usageViewsObservationsAndProviderAgree':True,'elapsedMilliseconds':result['elapsedMilliseconds']})
 runs.append({'role':'investigator-and-separately-marked-scripted-setup','session':case.name,'usage':usage})
(base/'usage-runs.json').write_text(json.dumps(runs,indent=2)+'\n')
(base/'verification.json').write_text(json.dumps({'cases':rows,'requests':len(ledger),'providerReportedTokens':sum(row['tokens'] for row in rows),'monetaryAttribution':None},indent=2)+'\n')
print(json.dumps(rows,indent=2))
