import { execFile } from 'node:child_process';
import { CredentialError } from './credential-store.js';

/** Parent-only macOS browser handoff, also exercised by the opt-in local browser check. */
export function openBrowser(url: string): Promise<void> {
  // stdin avoids putting a returning ID-token hint in process arguments.
  return new Promise((resolve, reject) => {
    const child = execFile('/usr/bin/osascript', ['-e', 'use framework "Foundation"', '-e', 'use scripting additions', '-e', "set rawURL to current application's NSFileHandle's fileHandleWithStandardInput()'s readDataToEndOfFile()", '-e', "set targetURL to current application's NSString's alloc()'s initWithData:rawURL encoding:4", '-e', 'open location (targetURL as text)'],
      { timeout: 15000 }, error => error ? reject(new CredentialError('browser_unavailable', 'PostCode could not open the sign-in browser.')) : resolve());
    child.stdin?.end(url);
  });
}
