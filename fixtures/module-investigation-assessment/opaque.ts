export function invokeOperation<T>(operation: () => T): T {
  return operation();
}
