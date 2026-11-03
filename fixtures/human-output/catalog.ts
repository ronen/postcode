import { cached, remember } from './cache';
import { readRemote } from './remote';
/** Coordinates catalog lookup. Failed requests are not stored in the cache. */
export async function lookup(key: string) {
  if (!key) throw new Error('A catalog key is required.');
  const previous = cached(key);
  if (previous !== undefined) return previous;
  const value = await readRemote(key);
  remember(key, value);
  return value;
}
