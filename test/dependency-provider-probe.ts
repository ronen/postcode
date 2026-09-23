/** Manual production-provider exercise. Does not execute investigated source. */
import path from 'node:path';
import { performance } from 'node:perf_hooks';
import { evaluateDependencies } from '../src/lib/dependencies/evaluate.js';
import { MemoryProgramRecordStore } from '../src/lib/memory-store.js';
import type { RecordId } from '../src/lib/records.js';
import { openTypeScriptProject } from '../src/lib/typescript/project.js';

const configPath = path.resolve(process.argv[2]!);
const base = path.dirname(configPath);
const relative = (file: string) => path.relative(base, file).split(path.sep).join('/');
const started = performance.now();
const opened = openTypeScriptProject({ configPath, excludedOutputDirectories: [path.resolve('_build'), path.resolve('_observations')] });
if (opened.status !== 'opened') {
  console.log(JSON.stringify(opened, null, 2));
} else {
  const store = new MemoryProgramRecordStore();
  const result = evaluateDependencies(store, opened.analysis);
  const elapsedMs = Math.round(performance.now() - started);
  const module = (id: RecordId) => {
    const record = store.get(id);
    if (record.kind !== 'module') throw new Error('Expected module');
    const claim = store.get(record.claim);
    if (claim.kind !== 'claim' || claim.information.type !== 'module') throw new Error('Expected module claim');
    const context = store.get(claim.context);
    if (context.kind !== 'claim-context') throw new Error('Expected context');
    return { name: claim.information.name, handle: claim.information.handle, discoveryFacets: claim.information.discoveryFacets,
      files: [...new Set(context.evidence.flatMap(id => {
        const evidence = store.get(id);
        return evidence.kind === 'source-evidence' && !evidence.resolution ? [relative(evidence.path)] : [];
      }))] };
  };
  const occurrences = result.occurrences.map(id => {
    const occurrence = store.get(id);
    if (occurrence.kind !== 'dependency-occurrence') throw new Error('Expected occurrence');
    const source = store.get(occurrence.evidence);
    if (source.kind !== 'source-evidence' || source.location.association !== 'span') throw new Error('Expected source span');
    return { id, owner: module(occurrence.owner), file: relative(source.path), from: source.location.from,
      mechanism: occurrence.mechanism, typeOnly: occurrence.typeOnly, commonjs: occurrence.commonjs,
      resolution: { ...source.dependencyResolution, resolvedFile: source.dependencyResolution?.resolvedFile
        ? relative(source.dependencyResolution.resolvedFile) : null }, target: occurrence.target ? module(occurrence.target) : null };
  });
  const core = occurrences.filter(item => item.file.startsWith('src/') && !item.file.startsWith('src/test/') && item.mechanism === 'commonjs');
  const surveyed = result.relationships.flatMap(id => {
    const relationship = store.get(id);
    if (relationship.kind !== 'claim' || relationship.information.type !== 'dependency') throw new Error('Expected dependency');
    const child = module(relationship.information.child);
    if (!child.files.some(file => ['src/child/child-loader.ts', 'src/esm.ts'].includes(file))) return [];
    return [{ owner: module(relationship.subject), child, typeOnly: relationship.information.typeOnly,
      mechanisms: relationship.information.mechanisms,
      occurrences: occurrences.filter(item => relationship.information.type === 'dependency' && relationship.information.occurrences.includes(item.id)) }];
  });
  const coverage = result.coverage.map(id => {
    const record = store.get(id);
    if (record.kind !== 'dependency-coverage') throw new Error('Expected coverage');
    const source = store.get(record.evidence);
    if (source.kind !== 'source-evidence') throw new Error('Expected evidence');
    return { file: relative(source.path), location: source.location.association === 'span' ? source.location.from : null,
      outcome: record.outcome, commonjs: record.commonjs };
  });
  const counts = (values: readonly string[]) => Object.fromEntries([...new Set(values)].sort().map(value => [value, values.filter(item => item === value).length]));
  console.log(JSON.stringify({ status: opened.status, node: process.versions.node, elapsedMs,
    execution: result.execution, materialization: result.materialization,
    projectModules: result.projectModules.length, occurrences: occurrences.length, relationships: result.relationships.length,
    mechanisms: counts(occurrences.map(item => item.mechanism)), targetStatuses: counts(occurrences.map(item => item.resolution.status!)),
    coverageCounts: counts(coverage.map(item => item.outcome)), coreCommonJS: core, surveyedRelationships: surveyed, coverage,
    pathPolicy: 'Source paths are relative to the selected configuration directory. Session IDs are retained as random namespaces, independent of analysis inputs; captured input support is recorded separately.',
  }, null, 2));
}
