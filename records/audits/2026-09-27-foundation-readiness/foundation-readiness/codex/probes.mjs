import assert from 'node:assert/strict';
import { readFileSync, writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import path from 'node:path';
import {recordId} from './build/src/lib/identity.js';
import { normalizeSession } from './build/test/helpers.js';
import { deriveLayout } from './build/src/lib/repository/layout.js';
import { openTypeScriptProject } from './build/src/lib/typescript/project.js';
import { MemoryProgramRecordStore } from './build/src/lib/memory-store.js';
import { evaluateModules, recordModuleEvaluation } from './build/src/lib/evaluation.js';
import { parseCommand } from './build/src/lib/commands.js';
import { parseArgs } from 'node:util';
const packagePath = new URL('./upstream/stately-graph/dist/', import.meta.url).pathname;
const { createGraph, addEdge, getInEdges, invalidateIndex } = await import(pathToFileURL(path.join(packagePath, 'index.mjs')));
const { genDFS, hasPath } = await import(pathToFileURL(path.join(packagePath, 'algorithms.mjs')));
const results = [];
function check(name, run) { const result = run(); results.push({ name, ...result }); }
const a = 'session:11111111-1111-4111-8111-111111111111';
const b = 'session:22222222-2222-4222-8222-222222222222';
check('normalizer collapses inconsistent reference namespaces and literal evidence text', () => {
  const original = { session: a, refs: [`${a}:module:abc`, `${a}:module:abc`], text: `Literal ${a}` };
  const alteredReference = { ...original, refs: [`${a}:module:abc`, `${b}:module:abc`] };
  const alteredText = { ...original, text: `Literal ${b}` };
  assert.deepEqual(normalizeSession(original), normalizeSession(alteredReference));
  assert.deepEqual(normalizeSession(original), normalizeSession(alteredText));
  return { maskedReferenceDifference: true, maskedTextDifference: true };
});
check('record key textual namespace removal also rewrites literal data', () => {
  const literalNamespace=recordId(a,'example',{text:a});
  const literalWord=recordId(a,'example',{text:'session'});
  assert.equal(literalNamespace,literalWord);
  return {distinctLiteralKeysCollide:true};
});
check('module outcome recording is split across atomic store batches', () => {
  const opened = openTypeScriptProject({ configPath: 'fixtures/dependency-journey/tsconfig.json' });
  assert.equal(opened.status, 'opened');
  const store = new MemoryProgramRecordStore();
  const discovered = opened.analysis.discover(store);
  const before = store.evaluations(discovered.session).length;
  assert.throws(() => recordModuleEvaluation(store, { ...discovered, expansions: [{
    applicability: 'applicable', availability: 'available', execution: 'completed', materialization: 'full',
    reason: null, cost: {measure:'module-count',value:0}, requirement: 'exports', modules: [],
    claims: [`${discovered.session}:claim:missing`], contexts: []
  }] }), /reference/);
  const after = store.evaluations(discovered.session);
  assert.equal(after.length, before + 1);
  const next = evaluateModules(store, opened.analysis);
  assert.equal(next.attempt, 2);
  return { orphanRootAttempts: after.length - before, nextAttempt: next.attempt };
});
// Isolated replacement of the existing layout's reachability kernel. Domain policy is unchanged.
let source = readFileSync(new URL('./build/src/lib/repository/layout.js', import.meta.url), 'utf8');
source = source.replace("'../identity.js'", "'./build/src/lib/identity.js'");
const begin = source.indexOf('    const reaches = ');
const end = source.indexOf('    // Deterministic ordering', begin);
assert.ok(begin >= 0 && end > begin);
source = `import {createGraph, addEdge} from ${JSON.stringify(pathToFileURL(path.join(packagePath,'index.mjs')).href)};\nimport {genDFS} from ${JSON.stringify(pathToFileURL(path.join(packagePath,'algorithms.mjs')).href)};\n` + source.slice(0, begin) + `    const graph = createGraph({mode:'directed', nodes:paths.map(id => ({id:'region:'+id})), edges:containment.map((edge,i)=>({id:String(i),sourceId:'region:'+edge.parent,targetId:'region:'+edge.child}))});\n    const reaches = (from,target) => {for (const node of genDFS(graph,{from:['region:'+from],direction:'outgoing'})) if(node.id==='region:'+target) return true; return false;};\n` + source.slice(end);
source = source.replace("containment.push({ parent: source, child: target, basis: 'symlink', evidencePath: artifact.path });", "addEdge(graph,{id:String(containment.length),sourceId:'region:'+source,targetId:'region:'+target});\n                containment.push({ parent: source, child: target, basis: 'symlink', evidencePath: artifact.path });");
writeFileSync(new URL('./layout-prototype.mjs', import.meta.url), source);
const {deriveLayout: candidateLayout} = await import('./layout-prototype.mjs');
check('incremental layout graph adapter preserves full deterministic cycle-refusal records', () => {
  let compared = 0;
  const dirs = ['a','b','c'];
  const possible = dirs.flatMap(from => dirs.filter(to => to !== from).map(to => [from,to]));
  for(let mask=0;mask<64;mask++) {
    const artifacts = dirs.map(dir=>({path:`${dir}/file.ts`,kind:'file',boundary:null}));
    possible.forEach(([from,to],i)=>{if(mask & (1<<i)) artifacts.push({path:`${from}/link-${to}`,kind:'symlink',boundary:null,link:{status:'resolved',resolved:`/review/${to}`,targetKind:'directory'}});});
    artifacts.push({path:'a/self',kind:'symlink',link:{status:'resolved',resolved:'/review/a',targetKind:'directory'}});
    artifacts.push({path:'a/missing',kind:'symlink',link:{status:'broken'}});
    const evidence={root:'/review',artifacts};
    const expected=deriveLayout(evidence);
    assert.deepEqual(candidateLayout(evidence),expected);
    assert.deepEqual(candidateLayout({...evidence,artifacts:[...artifacts].reverse()}),expected);
    compared+=2;
  }
  return {fullLayoutComparisons: compared};
});
check('incoming traversal retains reflexive ancestry and every parallel containment claim', () => {
  const edges=[['root','left'],['root','right'],['left','leaf'],['right','leaf'],['right','leaf']].map(([sourceId,targetId],i)=>({id:`claim${i}`,sourceId,targetId}));
  const g=createGraph({mode:'directed',nodes:['root','left','right','leaf','isolate'].map(id=>({id})),edges});
  const groups=[...genDFS(g,{from:['leaf'],direction:'incoming'})].map(n=>n.id);
  const claims=groups.flatMap(id=>getInEdges(g,id).map(edge=>edge.id)).sort();
  assert.deepEqual(groups.sort(),['leaf','left','right','root']);
  assert.deepEqual(claims,edges.map(edge=>edge.id));
  return {groups,claims};
});
check('graph index ownership requires mutation APIs or explicit invalidation', () => {
  const g=createGraph({mode:'directed',nodes:['a','b','c'].map(id=>({id})),edges:[{id:'e',sourceId:'a',targetId:'b'}]});
  assert.equal(hasPath(g,'a','b'),true);
  g.edges[0].sourceId='c';
  const stale = hasPath(g,'c','b');
  invalidateIndex(g);
  assert.equal(hasPath(g,'c','b'),true);
  assert.equal(stale,false);
  return {directFieldEditMissed:true, explicitInvalidationCorrect:true, missingReflexivePath:hasPath(g,'absent','absent')};
});
check('standard parser compatibility deltas', () => {
  const options={project:{type:'string'},json:{type:'boolean'},'source-detail':{type:'boolean'},help:{type:'boolean',short:'h'}};
  const cases=[['inspect','--','@literal'],['modules','--project=foo'],['modules','--project','-x'],['inspect','-x'],['--help','--unknown'],['modules','--project','--json']];
  return {cases:cases.map(args=>{let platform;try{platform=parseArgs({args,options,strict:true,allowPositionals:true,tokens:true});}catch(e){platform={code:e.code};}return {args,current:parseCommand(args,'.',false),platform};})};
});
writeFileSync(new URL('./probe-results.json', import.meta.url), JSON.stringify({node:process.version,graphVersion:'2.4.0',results},null,2)+'\n');
console.log(JSON.stringify(results.map(({name,...rest})=>({name,...rest})),null,2));
