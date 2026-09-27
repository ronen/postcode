declare module 'strongly-connected-components' {
 export default function scc(adjacency: number[][]): {components: number[][]; adjacencyList: number[][]};
}
