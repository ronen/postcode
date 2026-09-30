import { constants } from 'node:fs';
import { mkdir, open, lstat } from 'node:fs/promises';
import { homedir } from 'node:os';
import path from 'node:path';
import { setTimeout } from 'node:timers/promises';

/** All credential-store and OAuth exceptions crossing the parent boundary are allowlisted. */
export class CredentialError extends Error {
  constructor(readonly code: string, message: string) { super(message); }
}
export interface CredentialStore {
  read(): Promise<string | undefined>;
  write(value: string): Promise<void>;
  exclusive<T>(action: () => Promise<T>, signal?: AbortSignal): Promise<T>;
}

/** Kernel lock: no expiring lease that could admit a second refresh while a process is suspended.
 * The lock inode is permanent; process death releases its lock without deleting the file. */
export async function withCredentialLock<T>(directory: string, action: () => Promise<T>, signal?: AbortSignal): Promise<T> {
  const { default: fsExt } = await import('fs-ext');
  await mkdir(directory, { recursive: true, mode: 0o700 });
  const dir = await lstat(directory);
  if (!dir.isDirectory() || dir.isSymbolicLink() || dir.uid !== process.getuid?.() || (dir.mode & 0o077))
    throw new CredentialError('unsafe_storage', 'PostCode credential coordination directory must be private and owned by this user.');
  const file = await open(path.join(directory, 'credentials.lock'), constants.O_CREAT | constants.O_RDWR | constants.O_NOFOLLOW, 0o600);
  try {
    const stat = await file.stat();
    if (!stat.isFile() || stat.uid !== process.getuid?.() || (stat.mode & 0o077)) throw new CredentialError('unsafe_storage', 'PostCode credential lock is not private.');
    const deadline = Date.now() + 30000;
    for (;;) {
      signal?.throwIfAborted();
      try { fsExt.flockSync(file.fd, 'exnb'); break; }
      catch (error) {
        if (!error || typeof error !== 'object' || !('code' in error) || !['EAGAIN', 'EWOULDBLOCK'].includes(String(error.code))) throw error;
        if (Date.now() >= deadline) throw new CredentialError('credential_busy', 'Another PostCode process is updating credentials. Try again when it finishes.');
        await setTimeout(40, undefined, signal ? { signal } : {});
      }
    }
    return await action();
  } finally { await file.close(); }
}

export async function keychainStore(): Promise<CredentialStore> {
  if (process.platform !== 'darwin') throw new CredentialError('unsupported_storage', 'ChatGPT sign-in currently requires macOS Keychain.');
  try {
    const { AsyncEntry } = await import('@napi-rs/keyring');
    const entry = new AsyncEntry('org.postcode.chatgpt', 'registrations-v1');
    return {
      async read() {
        try { return await entry.getPassword(); }
        catch { throw new CredentialError('credential_storage', 'PostCode could not read its ChatGPT Keychain item.'); }
      },
      async write(value) {
        try { await entry.setPassword(value); }
        catch { throw new CredentialError('credential_storage', 'PostCode could not save its ChatGPT Keychain item; interactive sign-in may be required.'); }
      },
      exclusive(action, signal) {
        return withCredentialLock(path.join(homedir(), 'Library', 'Application Support', 'PostCode'), action, signal);
      },
    };
  } catch { throw new CredentialError('credential_storage', 'PostCode macOS Keychain support could not be loaded.'); }
}
