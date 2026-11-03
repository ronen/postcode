import { inlineText } from './terminal-text.js';
import { diagnosticContexts } from './diagnostic-view.js';
import type { SourceAttribution, DetailRecord } from './evidence-view.js';
import type { QualifiedView } from './presentation.js';
import type { QualifiedOrganizationView } from './organization/presentation.js';
import type { QualifiedDependencyView } from './dependencies/presentation.js';
import type { InvestigationView } from './investigation/presentation.js';
import type { ModuleExportsView } from './exports/presentation.js';

export type SourceDisclosureLevel = 'diagnostic-locations' | NonNullable<QualifiedView['moreDetails']>['level']
  | NonNullable<QualifiedOrganizationView['moreDetails']>['level']
  | NonNullable<QualifiedDependencyView['moreDetails']>['level']
  | NonNullable<InvestigationView['moreDetails']>['level'];
export type SourceDisclosureForm = 'locations' | 'excerpts';

/** Classify the bounded source fields actually rendered by each presentation.
 * Requests, empty containers, evidence IDs and omission counts are not disclosure.
 */
export function sourceDisclosure(view: QualifiedView | QualifiedOrganizationView | QualifiedDependencyView | InvestigationView | ModuleExportsView, rendered?: string): {
  level: SourceDisclosureLevel; forms: SourceDisclosureForm[];
} | null {
  const forms = new Set<SourceDisclosureForm>();
  const json = view.presentation.format === 'json';
  const source = (item: SourceAttribution) => {
    if (item.path || item.location.association === 'span') forms.add('locations');
    // Truthfully classify a nonconforming extension payload rather than assuming the declared shape.
    if ((json || view.schema === 'postcode-investigation-view/1-experimental') && 'excerpt' in item.location && item.location.excerpt && typeof item.location.excerpt === 'object'
      && 'text' in item.location.excerpt && typeof item.location.excerpt.text === 'string' && item.location.excerpt.text.length) forms.add('excerpts');
  };
  const record = (item: DetailRecord) => {
    if (item.kind === 'source-evidence') source(item);
    // An empty region path denotes the repository root, also a disclosed location.
    if (item.kind === 'repository-region' || item.kind === 'repository-artifact') forms.add('locations');
  };
  const modules = (detail: QualifiedView) => {
    for (const item of detail.moreDetails?.items ?? []) {
      const module = detail.modules.find(module => module.id === item.module);
      const visible = module && (item.subject === module.id && (item.role === 'module' || item.role === 'documentation')
        || module.exports.some(exported => exported.id === item.subject));
      if (json || visible) item.evidence.forEach(source);
    }
  };
  let level: SourceDisclosureLevel;
  switch (view.schema) {
    case 'postcode-module-exports-view/1-experimental':
      view.moreDetails?.items.forEach(source); level = 'declaration-locations'; break;
    case 'postcode-view/1-experimental':
      modules(view); level = 'declaration-locations'; break;
    case 'postcode-organization-view/1-experimental': {
      const detail = view.moreDetails;
      const organization = !!detail && (detail.groups.length > 0 || json && detail.repositoryRoot !== null);
      if (view.moduleDetail) modules(view.moduleDetail);
      if (json) for (const item of detail?.modules?.items ?? []) item.evidence.forEach(source);
      const moduleSource = forms.size > 0;
      if (organization) forms.add('locations');
      level = organization && moduleSource ? 'organization-and-module-source'
        : organization ? 'organization-paths' : 'declaration-locations';
      break;
    }
    case 'postcode-dependency-view/1-experimental':
      view.moreDetails?.items.forEach(item => source(item.evidence));
      for (const item of view.moreDetails?.organizationEvidence ?? []) {
        // Human output shows region/artifact paths, but only JSON embeds source
        // evidence records from this separate organization-support collection.
        if (json || item.kind === 'repository-region' || item.kind === 'repository-artifact') record(item);
      }
      level = 'dependency-occurrences-and-organization-evidence'; break;
    case 'postcode-investigation-view/1-experimental':
      view.moreDetails?.items.forEach(record);
      level = 'investigation-support'; break;
  }
  const detailDisclosed = forms.size > 0;
  for (const location of diagnosticLocations(view)) if (json || rendered?.includes(inlineText(location))) forms.add('locations');
  if (!detailDisclosed && forms.size) level = 'diagnostic-locations';
  return forms.size ? { level, forms: (['locations', 'excerpts'] as const).filter(form => forms.has(form)) } : null;
}

/** Diagnostic provenance is an explicit new location-bearing presentation field. */
export function diagnosticLocations(value: unknown): string[] {
  return diagnosticContexts(value).flatMap(context => context.diagnostics.flatMap(item => item.path ? [item.path] : []));
}
