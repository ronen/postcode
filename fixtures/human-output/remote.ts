/** The adapter is selected at runtime. Its transport and availability are not established here. */
let adapter = './adapter';
export function configureAdapter(name: string) { adapter = name; }
export async function readRemote(key: string): Promise<string> {
  const reader = await import(adapter);
  return reader.read(key);
}
