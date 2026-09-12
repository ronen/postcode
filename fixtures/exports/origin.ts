/** A value with no type role. */
export const value = 1;
/** First contribution. */
export interface Merged { first: string; }
/** Second contribution, independently recorded. */
export interface Merged { second: number; }
/** A type and a value.
 * @deprecated Use a newer implementation.
 */
export class Dual {}
/** Accepts a string. */
export function overloaded(value: string): string;
/** Accepts a number. */
export function overloaded(value: number): number;
export function overloaded(value: string | number) { return value; }
export default function main() {}
