import assert from 'node:assert/strict';
import { test } from 'node:test';
import { generateKeyPair, exportJWK, createLocalJWKSet, SignJWT } from 'jose';
import { mkdtemp, rm, writeFile, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { chatGPTCredentials } from '../src/lib/investigation/openai/chatgpt-credentials.js';
import { withCredentialLock, CredentialError, keychainEntryStore } from '../src/lib/investigation/openai/credential-store.js';
import type { CredentialStore } from '../src/lib/investigation/openai/credential-store.js';
import { oauthService, verifyIdentity, issuer, scopes, resource } from '../src/lib/investigation/openai/oauth.js';
import type { OAuthService, OAuthRegistration, TokenSet } from '../src/lib/investigation/openai/oauth.js';
import { configuredInvestigator } from '../src/lib/investigation/openai/configuration.js';
import { runCli } from '../src/lib/cli.js';

const pair = await generateKeyPair('RS256'), jwk = await exportJWK(pair.publicKey), keys = createLocalJWKSet({ keys: [{ ...jwk, kid: 'test' }] });
const now = Date.now();
const tokens = (): TokenSet => ({ accessToken: 'access-secret', refreshToken: 'refresh-secret', idToken: 'id-secret', expiresAt: now + 3600000, scopes: scopes.split(' ') });
function service(overrides: Partial<OAuthService> = {}): OAuthService {
  return { authorize: async (_host, registration, _consent, issued) => { await issued(registration?.clientId ?? 'client-test'); return { clientId: registration?.clientId ?? 'client-test', identity: { subject: 'person', email: 'private@example.test' }, tokens: tokens() }; },
    refresh: async () => ({ ...tokens(), accessToken: 'rotated-access', refreshToken: 'rotated-refresh' }), revoke: async () => true, ...overrides };
}
function memoryStore(): CredentialStore {
  let raw: string | undefined, tail = Promise.resolve();
  return { read: async () => raw, write: async v => { raw = v; }, exclusive(action) { const next = tail.then(action); tail = next.then(() => {}, () => {}); return next; } };
}
async function jwt(overrides: Record<string, unknown> = {}) {
  return new SignJWT({ sub: 'person', iss: issuer, aud: 'client-test', nonce: 'nonce', iat: Math.floor(Date.now() / 1000), exp: Math.floor(Date.now() / 1000) + 600, ...overrides }).setProtectedHeader({ alg: 'RS256', kid: 'test' }).sign(pair.privateKey);
}
test('OIDC validates signature, issuer, issued audience, expiry, nonce and saved identity', async () => {
  assert.equal((await verifyIdentity(await jwt(), 'client-test', 'nonce', keys)).subject, 'person');
  for (const change of [{ iss: 'https://elsewhere.test' }, { aud: 'dynamic_agent_client' }, { exp: 1 }, { nonce: 'other' }, { sub: '' }])
    await assert.rejects(verifyIdentity(await jwt(change), 'client-test', 'nonce', keys), CredentialError);
  await assert.rejects(verifyIdentity(await jwt(), 'client-test', 'nonce', keys, { subject: 'different' }), CredentialError);
  const foreign = await generateKeyPair('RS256');
  const forged = await new SignJWT({ sub: 'person' }).setProtectedHeader({ alg: 'RS256', kid: 'test' }).sign(foreign.privateKey);
  await assert.rejects(verifyIdentity(forged, 'client-test', 'nonce', keys), CredentialError);
});

test('real loopback sign-in validates state, PKCE, client binding and authoritative granted scope', async () => {
  let authorization!: URL, exchanged = 0, issued = '', requestBody!: URLSearchParams;
  const oauth = oauthService({ keys, openBrowser: async address => {
    authorization = new URL(address);
    const redirect = authorization.searchParams.get('redirect_uri')!;
    assert.match(redirect, /^http:\/\/127\.0\.0\.1:\d+\/auth\/callback$/);
    assert.equal((await fetch(`${redirect}?state=wrong&code=bad&client_id=evil`)).status, 400);
    const params = new URLSearchParams({ state: authorization.searchParams.get('state')!, code: 'auth-code', client_id: 'client-test', scope: scopes });
    assert.equal((await fetch(`${redirect}?${params}`)).status, 200);
  }, fetch: async (url, options) => {
    assert.equal(String(url), `${issuer}/api/accounts/oauth/token`); exchanged++;
    requestBody = new URLSearchParams(String(options?.body));
    const { createHash } = await import('node:crypto');
    assert.equal(createHash('sha256').update(requestBody.get('code_verifier')!).digest('base64url'), authorization.searchParams.get('code_challenge'));
    return new Response(JSON.stringify({ access_token: 'access-secret', refresh_token: 'refresh-secret', id_token: await jwt({ nonce: authorization.searchParams.get('nonce') }), token_type: 'Bearer', expires_in: 3600, scope: 'openid profile email offline_access resource.invoke', earliest_refresh_at: 'opaque' }));
  } });
  const result = await oauth.authorize('urn:uuid:host', undefined, false, async id => { issued = id; }, new AbortController().signal);
  assert.equal(authorization.searchParams.get('client_id'), 'dynamic_agent_client');
  assert.equal(authorization.searchParams.get('agent_name_hint'), 'PostCode');
  assert.equal(authorization.searchParams.get('resource'), resource);
  assert.equal(issued, 'client-test'); assert.equal(exchanged, 1);
  assert.equal(requestBody.get('redirect_uri'), authorization.searchParams.get('redirect_uri'));
  assert.equal(result.tokens.scopes.includes('chatgpt.tokens.use.direct'), false, 'callback scope cannot grant plan use');
});

test('denial, missing new client, duplicate callback and mismatched returning client never exchange credentials', async () => {
  for (const mode of ['denied', 'missing-client', 'duplicate-code', 'wrong-client']) {
    let exchanges = 0;
    const oauth = oauthService({ keys, fetch: async () => { exchanges++; throw new Error('secret must not escape'); }, openBrowser: async address => {
      const url = new URL(address), params = new URLSearchParams({ state: url.searchParams.get('state')!, code: 'code' });
      if (mode === 'denied') params.set('error', 'access_denied');
      if (mode === 'duplicate-code') { params.append('code', 'other'); params.set('client_id', 'client-test'); }
      if (mode === 'wrong-client') params.set('client_id', 'wrong');
      await fetch(`${url.searchParams.get('redirect_uri')}?${params}`);
    } });
    await assert.rejects(oauth.authorize('host', mode === 'wrong-client' ? { clientId: 'client-test' } : undefined, false, async () => {}, new AbortController().signal), CredentialError);
    assert.equal(exchanges, 0);
  }
});

test('sign-in persists registration and host across instances, retains mappings on sign-out, and never merges accounts', async () => {
  const store = memoryStore(), hosts: string[] = [], registrations: (OAuthRegistration | undefined)[] = [];
  const oauth = service({ authorize: async (host, r, _consent, issued) => {
    hosts.push(host); registrations.push(r); const clientId = r?.clientId ?? `client-${hosts.length}`; await issued(clientId);
    return { clientId, identity: { subject: 'same-person', email: 'same@example.test' }, tokens: tokens() };
  } });
  const first = chatGPTCredentials(store, oauth);
  await first.signIn('personal', false, new AbortController().signal);
  const second = chatGPTCredentials(store, oauth);
  assert.equal(await (await second.session()).token(new AbortController().signal), 'access-secret');
  await second.signIn('workspace', false, new AbortController().signal);
  assert.equal((await second.status()).length, 2);
  await second.signOut('personal');
  await second.signIn('personal', false, new AbortController().signal);
  assert.equal(new Set(hosts).size, 1); assert.equal(registrations[2]?.clientId, 'client-1'); assert.equal(registrations[2]?.tokens, undefined);
  assert.equal(JSON.stringify(await second.status()).includes('secret'), false);
  assert.equal(JSON.stringify(await second.status()).includes('same@example'), false);
});

test('permission decline retains signed-in identity; explicit routes never silently read or fall back to API credentials', async () => {
  const manager = chatGPTCredentials(memoryStore(), service({ authorize: async (_h, _r, _c, issued) => { await issued('client-test'); return { clientId: 'client-test', identity: { subject: 'person' }, tokens: { ...tokens(), scopes: ['openid'] } }; } }));
  await manager.signIn('personal', false, new AbortController().signal);
  assert.equal((await manager.status())[0]?.signedIn, true);
  let read = 0;
  const deps = { readCredential: async () => { read++; return 'api-secret'; }, chatGPTCredentials: async () => manager };
  assert.equal((await configuredInvestigator(undefined, deps)).kind, 'disabled');
  assert.equal((await configuredInvestigator('chatgpt', deps)).kind, 'configuration-unavailable');
  assert.equal((await configuredInvestigator('automatic', deps)).kind, 'configuration-unavailable');
  assert.equal(read, 0);
  assert.equal((await configuredInvestigator('openai', { ...deps, platform: 'darwin' })).kind, 'ready'); assert.equal(read, 1);
});

test('renewal replaces the whole token set once across concurrent manager instances; transient errors preserve it', async () => {
  const store = memoryStore(); let renewals = 0;
  const oauth = service({ refresh: async r => { renewals++; assert.equal(r.tokens.refreshToken, 'refresh-secret'); return { ...tokens(), accessToken: 'new-access', refreshToken: 'new-refresh', expiresAt: now + 7200000 }; } });
  await chatGPTCredentials(store, oauth).signIn('personal', false, new AbortController().signal);
  const one = await chatGPTCredentials(store, oauth, () => now + 3600001).session(), two = await chatGPTCredentials(store, oauth, () => now + 3600001).session();
  assert.deepEqual(await Promise.all([one.token(new AbortController().signal), two.token(new AbortController().signal)]), ['new-access', 'new-access']); assert.equal(renewals, 1);
  const before = await store.read();
  const unavailable = await chatGPTCredentials(store, service({ refresh: async () => { throw new CredentialError('credential_transport', 'safe'); } }), () => now + 8000000).session();
  await assert.rejects(unavailable.token(new AbortController().signal), CredentialError); assert.equal(await store.read(), before);
  const revoked = await chatGPTCredentials(store, service({ refresh: async () => { throw new CredentialError('refresh_token_reused', 'safe'); } }), () => now + 8000000).session();
  await assert.rejects(revoked.token(new AbortController().signal), CredentialError);
  const saved = JSON.parse((await store.read())!); assert.equal(saved.registrations[0].tokens, undefined); assert.equal(saved.registrations[0].clientId, 'client-test');
});

test('refresh sends the issued client and rotating refresh token without scope; invalid-grant is classified safely', async () => {
  let mode = 'ok';
  const oauth = oauthService({ keys, fetch: async (_url, options) => {
    const form = new URLSearchParams(String(options?.body));
    assert.equal(form.get('grant_type'), 'refresh_token'); assert.equal(form.get('scope'), null); assert.equal(form.get('client_id'), 'client-test'); assert.equal(form.get('refresh_token'), 'refresh-secret');
    return mode === 'ok' ? new Response(JSON.stringify({ access_token: 'new-access', refresh_token: 'new-refresh', token_type: 'Bearer', expires_in: 3600 })) : new Response(JSON.stringify({ error: 'invalid_grant', error_description: 'refresh-secret' }), { status: 400 });
  } });
  const registration = { clientId: 'client-test', identity: { subject: 'person' }, tokens: tokens() };
  const rotated = await oauth.refresh(registration); assert.equal(rotated.refreshToken, 'new-refresh'); assert.deepEqual(rotated.scopes, registration.tokens.scopes);
  mode = 'error'; await assert.rejects(oauth.refresh(registration), error => error instanceof CredentialError && error.code === 'invalid_grant' && !error.message.includes('secret'));
});

test('sign-out invalidates existing sessions, retains registration, and discloses unconfirmed revocation', async () => {
  const store = memoryStore(), manager = chatGPTCredentials(store, service({ revoke: async () => false }));
  await manager.signIn('personal', false, new AbortController().signal); const session = await manager.session();
  assert.equal(await manager.signOut(), false); await assert.rejects(session.token(new AbortController().signal), CredentialError);
  assert.equal((await manager.status())[0]?.signedIn, false);
  assert.doesNotMatch((await store.read())!, /access-secret|refresh-secret|id-secret/);
});

test('auth commands run without opening a project and status/sign-out never reveal credentials or identity', async () => {
  const manager = chatGPTCredentials(memoryStore(), service()); let output = '';
  const environment = { cwd: '/no-project', checkout: '/no-project', authentication: manager, stdout: (s: string) => { output += s; }, stderr: (s: string) => { output += s; }, configureInvestigator: async () => { throw new Error('must not configure project'); } };
  assert.equal(await runCli(['auth', 'chatgpt', 'sign-in'], environment), 0);
  assert.equal(await runCli(['auth', 'chatgpt', 'status'], environment), 0);
  assert.equal(await runCli(['auth', 'chatgpt', 'sign-out'], environment), 0);
  assert.doesNotMatch(output, /access-secret|refresh-secret|id-secret|private@example/);
  assert.match(output, /renewable session saved/);
});

test('kernel lock serializes separate processes and is released after process death without stale-file deletion', async () => {
  const directory = await mkdtemp(path.join(tmpdir(), 'postcode-lock-'));
  try {
    const script = `import { withCredentialLock } from ${JSON.stringify(new URL('../src/lib/investigation/openai/credential-store.js', import.meta.url).href)}; await withCredentialLock(process.argv[1], async () => { process.stdout.write('locked\\n'); await new Promise(() => { setInterval(() => {}, 1000); }); });`;
    const child = spawn(process.execPath, ['--input-type=module', '-e', script, directory], { stdio: ['ignore', 'pipe', 'pipe'] });
    const exited = new Promise<void>(resolve => child.once('exit', () => resolve()));
    try {
      await new Promise<void>((resolve, reject) => { child.stdout.once('data', () => resolve()); child.once('exit', () => reject(new Error('lock child exited before ready'))); child.once('error', reject); });
      let acquired = false; const controller = new AbortController();
      const waiting = withCredentialLock(directory, async () => { acquired = true; }, controller.signal);
      controller.abort(); await assert.rejects(waiting); assert.equal(acquired, false);
      child.kill('SIGKILL'); await exited;
      await withCredentialLock(directory, async () => { acquired = true; }); assert.equal(acquired, true);
      const counter = path.join(directory, 'counter'); await writeFile(counter, '0');
      const increment = async () => withCredentialLock(directory, async () => { const n = Number(await readFile(counter, 'utf8')); await writeFile(counter, String(n + 1)); });
      await Promise.all(Array.from({ length: 10 }, increment)); assert.equal(await readFile(counter, 'utf8'), '10');
    } finally { child.kill('SIGKILL'); await exited; }
  } finally { await rm(directory, { recursive: true, force: true }); }
});

test('separate processes renew a shared near-expiry registration exactly once and both use the rotated access token', async () => {
  const directory = await mkdtemp(path.join(tmpdir(), 'postcode-renew-'));
  try {
    const vaultPath = path.join(directory, 'fake-vault');
    const store: CredentialStore = { read: async () => { try { return await readFile(vaultPath, 'utf8'); } catch { return undefined; } }, write: value => writeFile(vaultPath, value), exclusive: action => withCredentialLock(directory, action) };
    await chatGPTCredentials(store, service()).signIn('personal', false, new AbortController().signal);
    const script = `import { readFile, writeFile, appendFile } from 'node:fs/promises';
      import { withCredentialLock } from ${JSON.stringify(new URL('../src/lib/investigation/openai/credential-store.js', import.meta.url).href)};
      import { chatGPTCredentials } from ${JSON.stringify(new URL('../src/lib/investigation/openai/chatgpt-credentials.js', import.meta.url).href)};
      const dir = process.argv[1], file = dir + '/fake-vault';
      const store = { read: () => readFile(file, 'utf8'), write: v => writeFile(file, v), exclusive: action => withCredentialLock(dir, action) };
      const oauth = { refresh: async r => { if(r.tokens.refreshToken !== 'refresh-secret') throw Error('reused rotation'); await appendFile(dir + '/renewals', '1'); await new Promise(r => setTimeout(r, 100)); return { ...r.tokens, accessToken: 'rotated', refreshToken: 'rotated-refresh', expiresAt: ${now + 7200000} }; } };
      const session = await chatGPTCredentials(store, oauth, () => ${now + 3540000}).session();
      process.stdout.write('ready\\n');
      await new Promise(resolve => process.stdin.once('data', resolve));
      if (await session.token(new AbortController().signal) !== 'rotated') throw Error('wrong access');
      process.stdout.write('passed\\n'); process.stdin.destroy();`;
    const children = [0, 1].map(() => spawn(process.execPath, ['--input-type=module', '-e', script, directory], { stdio: ['pipe', 'pipe', 'pipe'] }));
    const exits = children.map(child => new Promise<number | null>(resolve => child.once('exit', resolve)));
    try {
      await Promise.all(children.map(child => new Promise<void>((resolve, reject) => { child.stdout.once('data', () => resolve()); child.once('exit', () => reject(new Error('renewal child ended before ready'))); child.once('error', reject); })));
      for (const child of children) child.stdin.write('go');
      assert.deepEqual(await Promise.all(exits), [0, 0]); assert.equal(await readFile(path.join(directory, 'renewals'), 'utf8'), '1');
      const saved = JSON.parse(await readFile(vaultPath, 'utf8')); assert.equal(saved.registrations[0].tokens.refreshToken, 'rotated-refresh');
    } finally { for (const child of children) child.kill('SIGKILL'); await Promise.all(exits); }
  } finally { await rm(directory, { recursive: true, force: true }); }
});

test('revocation uses discovered endpoint, retries transient failures, and treats empty 200 as success', async () => {
  let revocations = 0;
  const oauth = oauthService({ fetch: async (url, options) => {
    if (String(url).includes('openid-configuration')) return new Response(JSON.stringify({ issuer, authorization_endpoint: `${issuer}/api/accounts/authorize`, token_endpoint: `${issuer}/api/accounts/oauth/token`, jwks_uri: `${issuer}/.well-known/jwks.json`, revocation_endpoint: `${issuer}/api/accounts/oauth/revoke` }));
    assert.equal(String(url), `${issuer}/api/accounts/oauth/revoke`);
    const form = new URLSearchParams(String(options?.body)); assert.equal(form.get('token'), 'refresh-secret'); assert.equal(form.get('client_id'), 'client-test'); assert.equal(form.get('token_type_hint'), 'refresh_token');
    revocations++; return new Response('', { status: revocations === 1 ? 503 : 200 });
  } });
  assert.equal(await oauth.revoke({ clientId: 'client-test', tokens: tokens() }), true); assert.equal(revocations, 2);
});

test('returning sign-in reuses client and host, requests explicit consent only when asked, and validates before activation', async () => {
  let authorization!: URL;
  const oauth = oauthService({ keys, openBrowser: async address => {
    authorization = new URL(address); const params = new URLSearchParams({ state: authorization.searchParams.get('state')!, code: 'code' });
    await fetch(`${authorization.searchParams.get('redirect_uri')}?${params}`);
  }, fetch: async () => new Response(JSON.stringify({ access_token: 'access-secret', refresh_token: 'refresh-secret', id_token: await jwt({ nonce: authorization.searchParams.get('nonce'), sub: 'different' }), token_type: 'Bearer', expires_in: 3600, scope: scopes })) });
  await assert.rejects(oauth.authorize('stable-host', { clientId: 'client-test', identity: { subject: 'person' }, tokens: tokens() }, true, async () => {}, new AbortController().signal), CredentialError);
  assert.equal(authorization.searchParams.get('client_id'), 'client-test'); assert.equal(authorization.searchParams.get('agent_name_hint'), null);
  assert.equal(authorization.searchParams.get('ext_agent_host_id'), 'stable-host'); assert.equal(authorization.searchParams.get('id_token_hint'), 'id-secret'); assert.equal(authorization.searchParams.get('prompt'), 'consent');
});

test('an active session observes persisted sign-out and aborts its local transport watcher', async () => {
  const store = memoryStore(), manager = chatGPTCredentials(store, service());
  await manager.signIn('personal', false, new AbortController().signal);
  const session = await manager.session(), controller = new AbortController(), stop = session.watch(controller);
  const observed = new Promise<void>((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error('sign-out not observed')), 4000);
    controller.signal.addEventListener('abort', () => { clearTimeout(timeout); resolve(); }, { once: true });
  });
  try { await chatGPTCredentials(store, service()).signOut(); await observed; assert.ok(controller.signal.reason instanceof CredentialError); }
  finally { stop(); }
});

test('identity-only permission decline persists a valid sign-in without inventing access or refresh grants', async () => {
  let nonce = '';
  const oauth = oauthService({ keys, openBrowser: async address => {
    const url = new URL(address); nonce = url.searchParams.get('nonce')!;
    await fetch(`${url.searchParams.get('redirect_uri')}?${new URLSearchParams({ state: url.searchParams.get('state')!, code: 'code', client_id: 'client-test' })}`);
  }, fetch: async () => new Response(JSON.stringify({ id_token: await jwt({ nonce }), scope: 'openid profile email' })) });
  const manager = chatGPTCredentials(memoryStore(), oauth);
  const result = await manager.signIn('personal', false, new AbortController().signal);
  assert.equal(result.signedIn, true); assert.equal(result.planUsage, false); assert.equal(result.renewable, false);
  await assert.rejects(manager.session(), CredentialError);
});

test('interrupted browser authorization closes the callback listener without exchanging tokens', async () => {
  const controller = new AbortController(); let redirect = '', exchanged = false;
  const oauth = oauthService({ keys, openBrowser: async address => { redirect = new URL(address).searchParams.get('redirect_uri')!; controller.abort(); },
    fetch: async () => { exchanged = true; throw new Error(); } });
  await assert.rejects(oauth.authorize('host', undefined, false, async () => {}, controller.signal), CredentialError);
  assert.equal(exchanged, false); await assert.rejects(fetch(redirect));
});


test('native null or undefined absence permits first sign-in through the production Keychain boundary', async () => {
  for (const absent of [null, undefined]) {
    let saved: string | null | undefined = absent, authorizations = 0;
    const store = keychainEntryStore({ getPassword: async () => saved, setPassword: async value => { saved = value; } }, action => action());
    const manager = chatGPTCredentials(store, service({ authorize: async (_host, _registration, _consent, issued) => {
      authorizations++; await issued('client-test');
      return { clientId: 'client-test', identity: { subject: 'person' }, tokens: tokens() };
    } }));
    assert.deepEqual(await manager.status(), []);
    assert.equal(saved, absent, 'status must not overwrite absent storage');
    const result = await manager.signIn('personal', false, new AbortController().signal);
    assert.equal(authorizations, 1); assert.equal(result.signedIn, true); assert.equal(result.planUsage, true);
    const restarted = chatGPTCredentials(store, service());
    assert.equal(await (await restarted.session()).token(new AbortController().signal), 'access-secret');
  }
});

test('empty or invalid stored values remain invalid and are never silently reset as missing', async () => {
  for (const invalid of ['', 'null', '{}', 'not-json']) {
    let writes = 0, authorizations = 0;
    const store = keychainEntryStore({ getPassword: async () => invalid, setPassword: async () => { writes++; } }, action => action());
    const manager = chatGPTCredentials(store, service({ authorize: async () => { authorizations++; throw new Error('must not authorize'); } }));
    await assert.rejects(manager.signIn('personal', false, new AbortController().signal), error => error instanceof CredentialError && error.code === 'invalid_storage');
    assert.equal(writes, 0); assert.equal(authorizations, 0);
  }
});

test('native storage failures remain credential-safe failures instead of creating a new vault', async () => {
  let writes = 0;
  const store = keychainEntryStore({ getPassword: async () => { throw new Error('native error with secret'); }, setPassword: async () => { writes++; } }, action => action());
  const manager = chatGPTCredentials(store, service());
  await assert.rejects(manager.signIn('personal', false, new AbortController().signal), error => error instanceof CredentialError && error.code === 'credential_storage' && !error.message.includes('secret'));
  assert.equal(writes, 0);
});


test('refresh margin retains safely valid tokens and rotates at the boundary before returning credentials', async () => {
  for (const remaining of [60_001, 60_000, 1, 0, -1]) {
    const store = memoryStore(); let renewals = 0;
    const oauth = service({ refresh: async () => { renewals++; return { ...tokens(), accessToken: 'rotated', refreshToken: 'replacement', expiresAt: now + 7200000 }; } });
    await chatGPTCredentials(store, oauth).signIn('personal', false, new AbortController().signal);
    const manager = chatGPTCredentials(store, oauth, () => now + 3600000 - remaining);
    const session = await manager.session();
    const expected = remaining > 60_000 ? 'access-secret' : 'rotated';
    assert.equal(await session.token(new AbortController().signal), expected);
    assert.equal(renewals, remaining > 60_000 ? 0 : 1);
    assert.equal(await (await manager.session()).token(new AbortController().signal), expected);
    assert.equal(renewals, remaining > 60_000 ? 0 : 1);
    if (renewals) assert.equal(JSON.parse((await store.read())!).registrations[0].tokens.refreshToken, 'replacement');
  }
});
