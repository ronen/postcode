import type { ExportClaim } from './records.js';

/** Shared language-neutral display of established export roles and routes. */
export function exportRoles(exported: Pick<ExportClaim['information'], 'roles'>): string {
  return exported.roles
    ? [exported.roles.type ? 'type' : '', exported.roles.value ? 'value' : ''].filter(Boolean).join('+') || 'no type/value role'
    : 'roles unavailable';
}
export function exportRoutes(exported: Pick<ExportClaim['information'], 'routes'>): string[] {
  return [...new Set(exported.routes.filter(route => route.kind !== 'direct' && route.kind !== 'default' || route.aliased || route.typeOnly)
    .map(route => `${route.kind}${route.typeOnly ? ' (type-only)' : ''}`))];
}
