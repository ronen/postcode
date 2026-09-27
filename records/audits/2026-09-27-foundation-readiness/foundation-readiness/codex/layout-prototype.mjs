import {createGraph, addEdge} from "file:///Users/ronen/postcode/app/_foundation-readiness-review-codex/upstream/stately-graph/dist/index.mjs";
import {genDFS} from "file:///Users/ronen/postcode/app/_foundation-readiness-review-codex/upstream/stately-graph/dist/algorithms.mjs";
import path from 'node:path';
import { compare } from './build/src/lib/identity.js';
export const repositoryLayoutMethod = 'postcode/repository-layout@2';
/** Pure preparation of region, placement and containment evidence for group records. */
export function deriveLayout(evidence) {
    const artifacts = [...evidence.artifacts].sort((a, b) => compare(a.path, b.path));
    const regions = new Set();
    const parent = (name) => {
        const directory = path.posix.dirname(name);
        return directory === '.' ? '' : directory;
    };
    for (const artifact of artifacts) {
        for (let directory = parent(artifact.path);; directory = parent(directory)) {
            regions.add(directory);
            if (directory === '')
                break;
        }
    }
    const paths = [...regions].sort(compare);
    const containment = paths.filter(Boolean).map(child => ({
        parent: parent(child), child, basis: 'directory', evidencePath: child,
    }));
    const placements = artifacts.map(artifact => ({ artifactPath: artifact.path,
        groupPath: parent(artifact.path), documentation: !artifact.boundary && /^README(?:\.[\s\S]*)?$/.test(path.posix.basename(artifact.path)),
    }));
    const artifactPaths = new Set(artifacts.map(artifact => artifact.path));
    const links = [];
    const graph = createGraph({mode:'directed', nodes:paths.map(id => ({id:'region:'+id})), edges:containment.map((edge,i)=>({id:String(i),sourceId:'region:'+edge.parent,targetId:'region:'+edge.child}))});
    const reaches = (from,target) => {for (const node of genDFS(graph,{from:['region:'+from],direction:'outgoing'})) if(node.id==='region:'+target) return true; return false;};
    // Deterministic ordering makes the accepted acyclic subset reproducible.
    for (const artifact of artifacts) {
        const link = artifact.link;
        if (!link)
            continue;
        const add = (outcome, targetRegion = null) => links.push({ artifactPath: artifact.path, outcome, targetRegion });
        // Capture classifies opaque boundaries while resolving each path segment;
        // preserve that outcome here instead of reclassifying resolved targets.
        if (link.status !== 'resolved') {
            add(link.status);
            continue;
        }
        if (!link.resolved)
            throw new Error('Resolved link is missing target evidence');
        const target = path.relative(evidence.root, link.resolved).split(path.sep).join('/');
        if (link.targetKind !== 'directory') {
            add(artifactPaths.has(target) ? link.targetKind === 'file' ? 'file-target' : 'artifact-target' : 'outside-population');
        }
        else if (!regions.has(target)) {
            add('outside-population');
        }
        else {
            const source = parent(artifact.path);
            if (reaches(target, source))
                add('cyclic-containment');
            else if (containment.some(edge => edge.parent === source && edge.child === target))
                add('existing-parent', target);
            else {
                addEdge(graph,{id:String(containment.length),sourceId:'region:'+source,targetId:'region:'+target});
                containment.push({ parent: source, child: target, basis: 'symlink', evidencePath: artifact.path });
                add('additional-parent', target);
            }
        }
    }
    return { method: repositoryLayoutMethod,
        regions: paths.map(directory => ({ path: directory, name: directory === '' ? null : path.posix.basename(directory) })),
        containment, placements, links };
}
