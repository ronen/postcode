/** A single-entry cache; remembering another key replaces the earlier entry. */
let entry: { key: string; value: string } | undefined;
export function cached(key: string) { return entry?.key === key ? entry.value : undefined; }
export function remember(key: string, value: string) { entry = { key, value }; }
