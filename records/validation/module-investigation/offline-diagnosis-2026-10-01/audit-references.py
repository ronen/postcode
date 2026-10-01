import pathlib,json,re,difflib,collections
base=pathlib.Path('records/validation/module-investigation/pass-02');out=[]
for name in ['focused-entry-r2','cockatiel-r2','fsm-engine-r2','merge-anything-r2']:
 p=base/name;xs=[json.loads(l) for l in (p/'exchanges.jsonl').read_text().splitlines()];submission=json.loads((p/'unaccepted-submission.json').read_text())['submission'];all_input='\n'.join(json.dumps(x['request']['input']) for x in xs)
 supplied=set(re.findall(r'session:[0-9a-f-]+:[a-z-]+:[0-9a-f]+',all_input));records={}
 def collect(x):
  if isinstance(x,dict):
   if isinstance(x.get('id'),str) and 'kind' in x:records[x['id']]=x
   for v in x.values():collect(v)
  elif isinstance(x,list):
   for v in x:collect(v)
 for x in xs:
  for item in x['request']['input']:
   raw=item.get('content') or item.get('output')
   if isinstance(raw,str):
    try:collect(json.loads(raw))
    except ValueError:pass
 refs=[]
 def visit(x,path='$'):
  if isinstance(x,dict):
   for k,v in x.items():
    if k in ['evidence','subjects','targets','correctedSubjects']:
     refs.extend({'path':f'{path}.{k}[{i}]','reference':ref} for i,ref in enumerate(v))
    elif k in ['subject','target']:refs.append({'path':path+'.'+k,'reference':v})
    visit(v,path+'.'+k)
  elif isinstance(x,list):
   for i,v in enumerate(x):visit(v,path+f'[{i}]')
 visit(submission);unknown=[]
 for ref in refs:
  r=ref['reference']
  if r in supplied:continue
  samekind=[s for s in supplied if s.rsplit(':',1)[0]==r.rsplit(':',1)[0]]
  close=difflib.get_close_matches(r,samekind,n=1,cutoff=.96)
  hashmatch=[s for s in supplied if s.rsplit(':',1)[-1]==r.rsplit(':',1)[-1]]
  knowncorrectelswhere=bool(close and any(e['reference']==close[0] for e in refs))
  unknown.append({**ref,'length':len(r),'suffixLength':len(r.rsplit(':',1)[-1]),'closeSuppliedSameKind':close,'sameSuffixDifferentKind':hashmatch,'closestAlsoUsedCorrectlyElsewhereInSubmission':knowncorrectelswhere})
 out.append({'case':name,'structuredReferenceOccurrences':len(refs),'uniqueStructuredReferences':len(set(x['reference'] for x in refs)),'referenceLengths':sorted(set(len(x['reference']) for x in refs)),'unmatchedOccurrences':unknown,'method':'Exact membership in every provider input string; nearest candidates are diagnosis only, never accepted or repaired. Full-record lookup completeness is not asserted.'})
pathlib.Path('_investigation/reference-audit.json').write_text(json.dumps(out,indent=2)+'\n');print(json.dumps(out,indent=2))
