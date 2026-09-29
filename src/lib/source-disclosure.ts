import type { QualifiedView } from './presentation.js';
import type { QualifiedOrganizationView } from './organization/presentation.js';
import type { QualifiedDependencyView } from './dependencies/presentation.js';
import type { InvestigationView } from './investigation/presentation.js';
import type { ProgramRecord, SourceEvidenceRecord } from './records.js';

export type SourceDisclosureLevel = NonNullable<QualifiedView['sourceDetail']>['level']
  | NonNullable<QualifiedOrganizationView['sourceDetail']>['level']
  | NonNullable<QualifiedDependencyView['sourceDetail']>['level']
  | NonNullable<InvestigationView['sourceDetail']>['level'];
export type SourceDisclosureForm = 'locations' | 'excerpts';

/** Classify the bounded source fields actually rendered by each presentation.
 * Requests, empty containers, evidence IDs and omission counts are not disclosure.
 */
export function sourceDisclosure(view: QualifiedView | QualifiedOrganizationView | QualifiedDependencyView | InvestigationView): {
  level: SourceDisclosureLevel; forms: SourceDisclosureForm[];
} | null {
  const forms = new Set<SourceDisclosureForm>();
  const json = view.presentation.format === 'json';
  const source = (item: SourceEvidenceRecord) => {
    if (item.path || item.location.association === 'span') forms.add('locations');
    if (item.location.association === 'span' && item.location.excerpt.text.length) forms.add('excerpts');
  };
  const record = (item: ProgramRecord) => {
    if (item.kind === 'source-evidence') source(item);
    // An empty region path denotes the repository root, also a disclosed location.
    if (item.kind === 'repository-region' || item.kind === 'repository-artifact') forms.add('locations');
  };
  const modules = (detail: QualifiedView) => {
    for (const item of detail.sourceDetail?.items ?? []) {
      const module = detail.modules.find(module => module.id === item.module);
      const visible = module && (item.subject === module.id && (item.role === 'module' || item.role === 'documentation')
        || module.exports.some(exported => exported.id === item.subject));
      if (json || visible) item.evidence.forEach(source);
    }
  };
  let level: SourceDisclosureLevel;
  switch (view.schema) {
    case 'postcode-view/1-experimental':
      modules(view); level = 'declaration-locations-and-excerpts'; break;
    case 'postcode-organization-view/1-experimental': {
      const detail = view.sourceDetail;
      const organization = !!detail && (detail.groups.length > 0 || json && detail.repositoryRoot !== null);
      if (view.moduleDetail) modules(view.moduleDetail);
      if (json) for (const item of detail?.modules?.items ?? []) item.evidence.forEach(source);
      const moduleSource = forms.size > 0;
      if (organization) forms.add('locations');
      level = organization && moduleSource ? 'organization-and-module-source'
        : organization ? 'organization-paths' : 'declaration-locations-and-excerpts';
      break;
    }
    case 'postcode-dependency-view/1-experimental':
      view.sourceDetail?.items.forEach(item => source(item.evidence));
      for (const item of view.sourceDetail?.organizationEvidence ?? []) {
        // Human output shows region/artifact paths, but only JSON embeds source
        // evidence records from this separate organization-support collection.
        if (json || item.kind === 'repository-region' || item.kind === 'repository-artifact') record(item);
      }
      level = 'dependency-occurrences-and-organization-evidence'; break;
    case 'postcode-investigation-view/1-experimental':
      view.sourceDetail?.items.forEach(record);
      level = 'investigation-support'; break;
  }
  return forms.size ? { level, forms: (['locations', 'excerpts'] as const).filter(form => forms.has(form)) } : null;
}
