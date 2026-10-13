export interface InvestigationBounds { readonly milliseconds: number; readonly calls: number; readonly toolCalls: number; readonly characters: number }
export const investigationBounds: InvestigationBounds = Object.freeze({ milliseconds: 180_000, calls: 32, toolCalls: 96, characters: 2_000_000 });
