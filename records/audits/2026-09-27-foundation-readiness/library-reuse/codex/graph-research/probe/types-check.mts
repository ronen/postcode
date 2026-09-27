import {createGraph} from '@statelyai/graph';
import {getStronglyConnectedComponents} from '@statelyai/graph/algorithms';
export function components(nodes: readonly string[], edges: readonly [string,string][]): string[][] {
 const graph=createGraph({nodes:nodes.map(id=>({id})),edges:edges.map(([sourceId,targetId],i)=>({id:String(i),sourceId,targetId}))});
 return getStronglyConnectedComponents(graph).map(group=>group.map(node=>node.id));
}
