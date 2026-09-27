/// <reference path="./scc.d.ts" />
import scc from 'strongly-connected-components';
/** Research adapter; qualified relationship processing remains in PostCode. */
export function components(nodes: readonly string[], edges: readonly [string,string][]): string[][] {
 const population=[...new Set(nodes)].sort();
 const index=new Map(population.map((id,i)=>[id,i]));
 const adjacency=population.map(()=>new Set<number>());
 for(const [from,to] of edges){
  const a=index.get(from), b=index.get(to);
  if(a!==undefined && b!==undefined) adjacency[a]!.add(b);
 }
 return scc(adjacency.map(ns=>[...ns])).components.map(group=>group.map(i=>population[i]!).sort()).sort((a,b)=>a[0]!<b[0]!?-1:a[0]!>b[0]!?1:0);
}
