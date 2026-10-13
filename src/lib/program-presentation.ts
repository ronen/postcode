import { createView, renderView } from './presentation.js';
import { createOrganizationView, renderOrganizationView } from './organization/presentation.js';
import { createDependencyView, renderDependencyView } from './dependencies/presentation.js';
import { arrangeModuleExports, renderModuleExports } from './exports/presentation.js';
import type { PresentedOptions } from './presentation-contracts.js';
import type { MechanicalContent } from './mechanical-implementations.js';
import type { ProgramRecordStore } from './records.js';
import type { ResolutionContext } from './resolution-context.js';

/** Bounded runtime contract-to-arrangement registration. These wrappers coordinate bindings;
 * the underlying arrangements receive only resolved content and Presentation inputs. */
export function createMechanicalView(store: ProgramRecordStore, content: MechanicalContent, presentation: PresentedOptions, title: string, resolution: ResolutionContext) {
  switch (content.contract) {
    case 'modules': return createView(store, content.value.projection, presentation, title, resolution, content.value);
    case 'organization': return createOrganizationView(store, content.value.projection, presentation, title, resolution, content.value);
    case 'dependencies': return createDependencyView(store, content.value.projection, presentation, resolution, content.value);
    case 'module-exports': {
      store.entityIds(content.value.basis.modules, 'module');
      const bindings = store.entityIds([content.value.projection.subject], 'module');
      return arrangeModuleExports(content.value, bindings.get(content.value.projection.subject)!, presentation, title, resolution);
    }
  }
}
export function renderMechanicalView(view: ReturnType<typeof createMechanicalView>): string {
  switch (view.schema) {
    case 'postcode-view/1-experimental': return renderView(view);
    case 'postcode-organization-view/1-experimental': return renderOrganizationView(view);
    case 'postcode-dependency-view/1-experimental': return renderDependencyView(view);
    case 'postcode-module-exports-view/1-experimental': return renderModuleExports(view);
  }
}
