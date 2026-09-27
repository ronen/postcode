import assert from 'node:assert/strict';
import {readFileSync, writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import ts from 'typescript';
import scc from 'strongly-connected-components';
import rtsao from '@rtsao/scc';
import {Graph, alg} from '@dagrejs/graphlib';
import Graphology from 'graphology';
import components from 'graphology-components';
import {createGraph, getStronglyConnectedComponents} from '@statelyai/graph';
import {DirectedGraph} from 'directed-graph-typed';
import cytoscape from 'cytoscape';
const root=new URL('../../../',import.meta.url);
const source=readFileSync(new URL('src/lib/dependencies/graph.ts',root),'utf8');
const identity=readFileSync(new URL('src/lib/identity.ts',root),'utf8');
const moduleURL=s=>'data:text/javascript;base64,'+Buffer.from(ts.transpileModule(s,{compilerOptions:{target:ts.ScriptTarget.ES2023,module:ts.ModuleKind.ESNext}}).outputText).toString('base64');
const {deriveDependencyGraph:current}=await import(moduleURL(source.replace("'../identity.js'",JSON.stringify(moduleURL(identity)))));
const {compare}=await import(moduleURL(identity));
const normalize=groups=>groups.map(g=>[...g].sort(compare)).sort((a,b)=>compare(a[0],b[0]));
const ids=adj=>adj.map((_,i)=>String(i).padStart(7,'0'));
const implementations={
 'strongly-connected-components':adj=>scc(adj).components,
 '@statelyai/graph':adj=>getStronglyConnectedComponents(createGraph({nodes:adj.map((_,i)=>({id:String(i)})),edges:adj.flatMap((ns,i)=>ns.map((j,k)=>({id:`${i}-${k}`,sourceId:String(i),targetId:String(j)})))})).map(g=>g.map(n=>Number(n.id))),
 '@rtsao/scc':adj=>rtsao(new Map(adj.map((ns,i)=>[i,new Set(ns)]))).map(g=>[...g]),
 '@dagrejs/graphlib':adj=>{const g=new Graph();adj.forEach((_,i)=>g.setNode(String(i)));adj.forEach((ns,i)=>ns.forEach(j=>g.setEdge(String(i),String(j))));return alg.tarjan(g).map(g=>g.map(Number));},
 'graphology-components':adj=>{const g=new Graphology.DirectedGraph();adj.forEach((_,i)=>g.addNode(String(i)));adj.forEach((ns,i)=>ns.forEach(j=>g.mergeEdge(String(i),String(j))));return components.stronglyConnectedComponents(g).map(g=>g.map(Number));},
 'directed-graph-typed':adj=>{const g=new DirectedGraph();adj.forEach((_,i)=>g.addVertex(i));adj.forEach((ns,i)=>ns.forEach(j=>g.addEdge(i,j)));return [...g.tarjan().SCCs.values()].map(g=>g.map(v=>v.key));},
 'cytoscape':adj=>{const g=cytoscape({headless:true,styleEnabled:false,elements:[...adj.map((_,i)=>({data:{id:String(i)}})),...adj.flatMap((ns,i)=>ns.map((j,k)=>({data:{id:`e${i}-${k}`,source:String(i),target:String(j)}})))]});try{return g.elements().tarjanStronglyConnected().components.map(c=>c.nodes().map(n=>Number(n.id())));}finally{g.destroy();}},
 'PostCode':adj=>{const pop=ids(adj);return current(pop,edges(adj,pop),true).components.map(c=>c.members.map(Number));}
};
function edges(adj,pop=ids(adj)){return adj.flatMap((ns,i)=>ns.map((j,k)=>({id:`r${i}-${k}`,subject:pop[i],information:{child:pop[j]}})));}
function oracle(adj){const n=adj.length;const reach=Array.from({length:n},(_,i)=>Array.from({length:n},(_,j)=>i===j||adj[i].includes(j)));for(let k=0;k<n;k++)for(let i=0;i<n;i++)for(let j=0;j<n;j++)reach[i][j] ||= reach[i][k]&&reach[k][j];const seen=new Set(),groups=[];for(let i=0;i<n;i++)if(!seen.has(i)){const g=[];for(let j=0;j<n;j++)if(reach[i][j]&&reach[j][i]){g.push(j);seen.add(j);}groups.push(g);}return groups;}
const canonical=g=>normalize(g.map(ns=>ns.map(String)));
let state=0x12345678;const random=()=>{state=(Math.imul(1664525,state)+1013904223)>>>0;return state/2**32;};
const fixtures=[[],[[]],[[0]],[[],[],[]],[[1],[0,2],[],[3],[]],[[1,1],[2],[0,3],[],[]]];
for(let q=0;q<500;q++){const n=1+Math.floor(random()*24),p=random();fixtures.push(Array.from({length:n},()=>Array.from({length:n},(_,j)=>j).filter(()=>random()<p)));}
const result={node:process.version,platform:process.platform,arch:process.arch,date:new Date().toISOString(),source_sha256:createHash('sha256').update(source).digest('hex'),tests:[]};
function record(name,test,fn){try{fn();result.tests.push({name,test,passed:true});}catch(e){result.tests.push({name,test,passed:false,error:e.name+': '+e.message});}console.log(JSON.stringify(result.tests.at(-1)));}
for(const [name,fn] of Object.entries(implementations))record(name,'506 fixtures and seeded random graphs versus independent reachability oracle',()=>{for(const adj of fixtures)assert.deepEqual(canonical(fn(adj)),canonical(oracle(adj)));});
for(const name of ['strongly-connected-components','@statelyai/graph','PostCode'])record(name,'all 65,536 directed graphs on four vertices, including self-loops',()=>{for(let mask=0;mask<65536;mask++){const adj=Array.from({length:4},(_,i)=>[0,1,2,3].filter(j=>mask&(1<<(i*4+j))));assert.deepEqual(canonical(implementations[name](adj)),canonical(oracle(adj)));}});
for(const [name,fn] of Object.entries(implementations))for(const kind of ['chain','cycle'])record(name,`20,000-node ${kind}`,()=>{const n=20000,adj=Array.from({length:n},(_,i)=>i<n-1?[i+1]:kind==='cycle'?[0]:[]),got=fn(adj);assert.equal(got.length,kind==='cycle'?1:n);assert.equal(got.reduce((a,g)=>a+g.length,0),n);});
for(const name of ['strongly-connected-components','@statelyai/graph','PostCode'])for(const kind of ['chain','cycle'])record(name,`100,000-node ${kind}`,()=>{const n=100000,adj=Array.from({length:n},(_,i)=>i<n-1?[i+1]:kind==='cycle'?[0]:[]),got=implementations[name](adj);assert.equal(got.length,kind==='cycle'?1:n);assert.equal(got.reduce((a,g)=>a+g.length,0),n);});
// Keep the existing domain-output assembly unchanged; replace only SCC population/partition computation.
const suffix=ts.transpileModule(source.slice(source.indexOf('  groups.sort(')),{compilerOptions:{target:ts.ScriptTarget.ES2023}}).outputText.replace(/}\s*$/,'');
const assemble=new Function('modules','relationships','complete','groups','compare',suffix);
for(const name of ['strongly-connected-components','@statelyai/graph'])record(name,'full DependencyGraph output, complete/incomplete, duplicates, external endpoints, reversed inputs',()=>{for(const adj of fixtures){const pop=ids(adj);const rel=edges(adj,pop);if(pop.length){rel.push({id:'external',subject:pop[0],information:{child:'external-node'}});if(rel.length>1)rel.push({...rel[0],id:'parallel-claim'});}for(const complete of [true,false]){const expected=current([...pop,...pop],rel,complete);for(const reverse of [false,true]){const population=[...new Set(pop)].sort(compare);const positions=new Map(population.map((id,i)=>[id,i]));const relationships=reverse?[...rel].reverse():rel;const adjacency=population.map(()=>[]);for(const r of relationships)if(positions.has(r.subject)&&positions.has(r.information.child))adjacency[positions.get(r.subject)].push(positions.get(r.information.child));const groups=implementations[name](adjacency).map(g=>g.map(i=>population[i]).sort(compare));assert.deepEqual(assemble(population,relationships,complete,groups,compare),expected);}}}});
writeFileSync(new URL('../probe-results.json',import.meta.url),JSON.stringify(result,null,2)+'\n');
