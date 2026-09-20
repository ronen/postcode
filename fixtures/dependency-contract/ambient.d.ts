declare module 'ambient-target' { export interface Shape { value: number } }
declare module 'ambient-parent' {
  import type { Shape } from 'ambient-target';
  export { Shape } from 'ambient-target';
  export type Result = import('ambient-target').Shape;
}
declare module 'ambient-parent' {
  export type Other = import('ambient-target').Shape;
}
