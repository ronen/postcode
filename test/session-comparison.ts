/** Comparison workers acquire ownership before opening; every close is attempted. */
export async function withComparisonSessions<T extends { opening: Promise<unknown>; close(): Promise<void> }>(
  create: () => T, run: (first: T, second: T) => Promise<void>,
): Promise<void> {
  const owned: T[] = [];
  try {
    const first = create(); owned.push(first);
    await first.opening;
    const second = create(); owned.push(second);
    await second.opening;
    await run(first, second);
  } finally {
    const results = await Promise.allSettled(owned.map(session => Promise.resolve().then(() => session.close())));
    const failures = results.flatMap(result => result.status === 'rejected' ? [result.reason] : []);
    if (failures.length) throw new AggregateError(failures, 'Comparison worker cleanup failed');
  }
}
