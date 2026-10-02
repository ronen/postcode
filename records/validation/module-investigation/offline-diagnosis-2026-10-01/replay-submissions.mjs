import { readFileSync, writeFileSync } from 'node:fs';
import assert from 'node:assert/strict';
import { openAIInvestigator, chatGPTInvestigator } from '../../../../_build/src/lib/investigation/openai/adapter.js';
const base='records/validation/module-investigation/pass-02', results=[];
for(const name of ['focused-entry-r2','cockatiel-r2','fsm-engine-r2','merge-anything-r2']){
 const xs=readFileSync(`${base}/${name}/exchanges.jsonl`,'utf8').trim().split('\n').map(JSON.parse);
 const last=xs.at(-1),call=last.streamOutput.find(x=>x.type==='function_call'&&x.name==='submit_investigram');
 const expected=JSON.parse(readFileSync(`${base}/${name}/unaccepted-submission.json`,'utf8')).submission;
 assert.deepEqual(JSON.parse(call.arguments),expected);
 const first=JSON.parse(xs[0].request.input.find(x=>x.role==='user').content);
 const input={attempt:'offline-replay',instructions:xs[0].request.instructions,request:first.request,responses:[],remaining:first.remaining};
 for(const route of ['api-key','chatgpt-plan']){
  let calls=0;
  const fetch=async()=>{calls++;const body={...last.response,output:[call]};return route==='api-key'
   ? new Response(JSON.stringify(body),{headers:{'content-type':'application/json'}})
   : new Response(`data: ${JSON.stringify({type:'response.completed',response:body})}\n\ndata: [DONE]\n\n`,{headers:{'content-type':'text/event-stream'}});};
  const credential='offline-sentinel-no-real-credential';
  const agent=route==='api-key'?openAIInvestigator(credential,{fetch}):chatGPTInvestigator({token:async()=>credential,watch:()=>()=>{}},{fetch});
  const dialogue=agent.open();const reply=await dialogue.exchange(input,new AbortController().signal,()=>{});dialogue.close();
  assert.equal(reply.kind,'submit');assert.deepEqual(reply.result,expected);assert.equal(calls,1);
  results.push({case:name,route,stubCalls:calls,submissionExactlyPreserved:true});
 }
}
writeFileSync('_investigation/submission-replay.json',JSON.stringify({results,scope:'Offline stub response carrying the recorded submission arguments; terminal output is synthesized from retained finalized items. Verifies adapter parsing/redaction does not change the submitted references. Does not replay original wire streaming, domain lookup, inference, or semantics. No provider network or credentials used.'},null,2)+'\n');
console.log('Eight offline adapter replays preserved captured submissions exactly; zero live calls.');
