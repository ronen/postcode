import json,pathlib
base=pathlib.Path('records/validation/module-investigation/pass-03')
names=['focused-entry-r3','cockatiel-r3','fsm-engine-r3','merge-anything-r3']
ledger=json.loads((base/'request-budget.json').read_text())['requests'];rows=[];roles=[];runs=[]
for name in names:
 case=base/name
 xs=[json.loads(l) for l in (case/'exchanges.jsonl').read_text().splitlines()]
 bs=[json.loads(l) for l in (case/'observations.jsonl').read_text().splitlines()]
 views=[r['value'] for b in bs for r in b['records'] if r['kind']=='qualified-view']
 usage=views[0]['usage'];assert all(v['usage']==usage for v in views)
 assert all(r['value']==usage for b in bs for r in b['records'] if r['kind']=='investigation-usage')
 selected=[r for r in ledger if r['run']==name];assert len(xs)==len(selected)==usage['calls']
 total=sum(x['response']['usage']['total_tokens'] for x in xs)
 assert total==sum(x['usage']['total_tokens'] for x in selected)==sum(c['value'] for g in usage['totals'] for c in g['categories'] if c['category']=='total')
 assert usage['missingCalls']==usage['anomalousCalls']==0
 previous={};resolutions=0;supplied=set();summarized=set()
 for x in xs:
  assert x['request']['instructions']==json.loads((base/'instructions.json').read_text())['hostedFunctionality']
  audit=x['references'];assert audit['characterGuard']=='canonical-domain-exchanges'
  bindings={item['handle']:item['reference'] for item in audit['bindings']}
  assert len(bindings)==len(audit['bindings'])==len(set(bindings.values()))
  assert all(bindings[k]==v for k,v in previous.items());previous=bindings
  for r in audit['resolutions']:
   assert r['reference'] is not None and bindings[r['handle']]==r['reference'];resolutions+=1
  for item in x['request']['input']:
   raw=item.get('output') if item.get('type')=='function_call_output' else item.get('content') if item.get('role')=='user' else None
   if not isinstance(raw,str):continue
   content=json.loads(raw);responses=content if isinstance(content,list) else content.get('responses',[])
   for response in responses:
    for record in response.get('records',[]):supplied.add(bindings[record['id']])
    for record in response.get('evaluations',[])+response.get('repositories',[]):
     summarized.add(bindings[record['id']])
     for qualification in record.get('qualification',[]):summarized.add(bindings[qualification['id']])
  # Binding tables are deliberately excluded from exposure membership.
 assert supplied==set(usage['attempts'][0]['suppliedEvidence'])
 assert summarized==set(usage['attempts'][0]['summarizedEvidence'])
 d=json.loads((case/'documentation-discovery.json').read_text())
 assert all(r['id'] in supplied for r in d['deliveredReadmes'])
 result=json.loads((case/'result.json').read_text());assert result['exit']==0 and not result['pausedForBudget']
 rows.append({'case':name,'outcome':views[0]['result']['evaluation']['outcome']['kind'],'calls':len(xs),'totalTokens':total,'elapsedMilliseconds':result['elapsedMilliseconds'],'readmeDeliveredExchanges':[r['firstDeliveredExchange'] for r in d['deliveredReadmes']],'exactResolvedFields':resolutions,'unresolvedFields':0,'finalAvailableBindings':len(previous),'suppliedEvidenceRecords':len(supplied),'summarizedEvidenceRecords':len(summarized),'wireExposureEqualsCanonicalLedger':True,'usageViewsObservationsAndProviderAgree':True})
 runs.append({'role':'investigator','session':name,'usage':usage})
 for role in ['evaluator','assessor']:
  dispatch=json.loads((case/f'{role}-dispatch.json').read_text());json.loads((case/f'{role}-output.json').read_text())
  roles.append({'subject':name,'role':role,**{k:dispatch[k] for k in ['task','model','reasoning','family','usage','billingRoute']},'monetaryAttribution':None})
(base/'assessment-agent-usage.json').write_text(json.dumps({'roles':roles,'limitations':['Usage and monetary attribution are unavailable, not zero. These roles are separate from PostCode investigator inference even if they share an allowance.','Fresh contexts share orchestration/model family; they are not independent corroboration.']},indent=2)+'\n')
(base/'usage-runs.json').write_text(json.dumps(runs,indent=2)+'\n')
(base/'verification.json').write_text(json.dumps({'implementationCommit':'71949dd10c895bc3869849538389aee3f101e0c7','freezeCommit':'b13810e','fullOfflineSuite':{'passed':438,'failed':0,'cancelled':0,'skipped':0,'durationMilliseconds':138834.399085,'timing':'offline-suite.timing.json','output':'offline-suite.tap.txt'},'cases':rows,'requests':len(ledger),'providerReportedTokens':sum(r['totalTokens'] for r in rows),'actualMonetaryAttribution':None,'diagnosticAllowance':{'used':2,'remaining':8}},indent=2)+'\n')
print(json.dumps(rows,indent=2))
