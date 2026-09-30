import { createHash, randomBytes } from 'node:crypto';
import { createServer } from 'node:http';
import { openBrowser } from './browser.js';
import { createRemoteJWKSet, jwtVerify } from 'jose';
import type { JWTVerifyGetKey, JWTPayload } from 'jose';
import { CredentialError } from './credential-store.js';

export const issuer = 'https://auth.openai.com';
export const resource = 'https://api.openai.com/v1';
export const scopes = 'openid profile email offline_access resource.invoke chatgpt.tokens.use.direct';
export interface OAuthIdentity { subject: string; email?: string }
export interface TokenSet {
  accessToken: string; refreshToken: string; idToken: string; scopes: string[];
  expiresAt: number; earliestRefreshAt?: unknown;
}
export interface OAuthRegistration { clientId: string; identity?: OAuthIdentity; tokens?: TokenSet }
export interface OAuthResult { clientId: string; identity: OAuthIdentity; tokens: TokenSet }
export interface OAuthService {
  authorize(hostId: string, registration: OAuthRegistration | undefined, consent: boolean, issued: (clientId: string) => Promise<void>, signal: AbortSignal): Promise<OAuthResult>;
  refresh(registration: OAuthRegistration & { tokens: TokenSet }, signal?: AbortSignal): Promise<TokenSet>;
  revoke(registration: OAuthRegistration & { tokens: TokenSet }): Promise<boolean>;
}
const terminalRefreshCodes = new Set(['invalid_grant', 'invalid_refresh_token', 'token_expired', 'refresh_token_expired', 'refresh_token_invalidated', 'refresh_token_reused']);
export function requiresReauthorization(error: unknown): boolean { return error instanceof CredentialError && (terminalRefreshCodes.has(error.code) || ['invalid_identity', 'invalid_token_response'].includes(error.code)); }
const fail = (code: string, message: string): never => { throw new CredentialError(code, message); };
const object = (value: unknown): value is Record<string, unknown> => !!value && typeof value === 'object' && !Array.isArray(value);
const secret = (value: unknown): value is string => typeof value === 'string' && value.length > 0 && value.length < 65536 && !/\s/.test(value);
const clientIdValid = (value: unknown): value is string => typeof value === 'string' && /^[a-zA-Z0-9_.-]{1,256}$/.test(value) && value !== 'dynamic_agent_client';

/** Validates identity without ever returning raw JWT/library errors. */
export async function verifyIdentity(token: string, clientId: string, nonce: string | undefined, keys: JWTVerifyGetKey, previous?: OAuthIdentity): Promise<OAuthIdentity> {
  let claims: JWTPayload;
  try {
    const result = await jwtVerify(token, keys, { issuer, audience: clientId, algorithms: ['RS256'], requiredClaims: ['exp', 'iat', 'sub'] });
    claims = result.payload;
  } catch { return fail('invalid_identity', 'OpenAI identity validation failed. Sign in again.'); }
  if (!claims.sub || (nonce !== undefined && claims.nonce !== nonce) || (previous && previous.subject !== claims.sub))
    return fail('invalid_identity', 'OpenAI identity did not match this sign-in or saved registration.');
  return { subject: claims.sub, ...(typeof claims.email === 'string' ? { email: claims.email } : {}) };
}
function parseTokens(body: unknown, now: number, previous?: TokenSet): TokenSet {
  if (!object(body) || (!previous && !secret(body.id_token)) || (body.id_token !== undefined && !secret(body.id_token)) ||
      (body.scope !== undefined && typeof body.scope !== 'string') || (!previous && typeof body.scope !== 'string'))
    return fail('invalid_token_response', 'OpenAI returned an invalid credential response. Interactive sign-in is required.');
  const granted = typeof body.scope === 'string' ? body.scope.split(/\s+/).filter(Boolean) : previous!.scopes;
  const enabled = granted.includes('chatgpt.tokens.use.direct') && granted.includes('resource.invoke');
  if ((enabled && !secret(body.access_token)) || (granted.includes('offline_access') && !secret(body.refresh_token)) ||
      (body.access_token !== undefined && (!secret(body.access_token) || typeof body.token_type !== 'string' || body.token_type.toLowerCase() !== 'bearer' ||
        typeof body.expires_in !== 'number' || !Number.isFinite(body.expires_in) || body.expires_in <= 0)) ||
      (body.refresh_token !== undefined && !secret(body.refresh_token)))
    return fail('invalid_token_response', 'OpenAI returned an invalid credential response. Interactive sign-in is required.');
  return { accessToken: body.access_token as string ?? '', refreshToken: body.refresh_token as string ?? '', idToken: body.id_token as string ?? previous!.idToken,
    expiresAt: now + (typeof body.expires_in === 'number' ? body.expires_in * 1000 : 0), scopes: granted,
    ...(body.earliest_refresh_at !== undefined ? { earliestRefreshAt: body.earliest_refresh_at } : {}) };
}

export function oauthService(options: {
  fetch?: typeof fetch;
  openBrowser?: (url: string) => Promise<void>;
  keys?: JWTVerifyGetKey;
  now?: () => number;
} = {}): OAuthService {
  const fetcher = options.fetch ?? fetch;
  const now = options.now ?? Date.now;
  let metadata: Promise<{ jwks: string; revoke: string }> | undefined;
  const discovery = () => metadata ??= (async () => {
    try {
      const response = await fetcher(`${issuer}/.well-known/openid-configuration`, { signal: AbortSignal.timeout(15000), redirect: 'error' });
      const body: unknown = await response.json();
      if (!response.ok || !object(body) || body.issuer !== issuer || body.authorization_endpoint !== `${issuer}/api/accounts/authorize` ||
          body.token_endpoint !== `${issuer}/api/accounts/oauth/token` || body.jwks_uri !== `${issuer}/.well-known/jwks.json` ||
          body.revocation_endpoint !== `${issuer}/api/accounts/oauth/revoke`) throw new Error();
      return { jwks: body.jwks_uri, revoke: body.revocation_endpoint };
    } catch { metadata = undefined; return fail('identity_metadata', 'OpenAI identity metadata is unavailable or incompatible. No credentials were changed.'); }
  })();
  let remoteKeys: JWTVerifyGetKey | undefined;
  const keys = async () => options.keys ?? (remoteKeys ??= createRemoteJWKSet(new URL((await discovery()).jwks), { timeoutDuration: 15000 }));
  async function tokenRequest(form: Record<string, string>, signal?: AbortSignal): Promise<unknown> {
    let response: Response, body: unknown;
    try {
      response = await fetcher(`${issuer}/api/accounts/oauth/token`, { method: 'POST', redirect: 'error',
        headers: { 'content-type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams(form),
        signal: signal ? AbortSignal.any([signal, AbortSignal.timeout(20000)]) : AbortSignal.timeout(20000) });
      body = await response.json();
    } catch { return fail('credential_transport', 'OpenAI credential renewal or exchange could not be confirmed. No investigation was retried.'); }
    if (!response.ok) {
      const code = object(body) && typeof body.error === 'string' && (terminalRefreshCodes.has(body.error) || body.error === 'invalid_client') ? body.error : 'credential_service';
      return fail(code, terminalRefreshCodes.has(code) ? 'ChatGPT authorization has expired or was revoked. Run PostCode sign-in in your terminal.' : 'OpenAI credential exchange is unavailable. No billing fallback was used.');
    }
    return body;
  }
  return {
    async authorize(hostId, registration, consent, issued, signal) {
      const state = randomBytes(32).toString('base64url'), nonce = randomBytes(32).toString('base64url'), verifier = randomBytes(48).toString('base64url');
      let resolveCallback!: (value: URLSearchParams) => void;
      const callback = new Promise<URLSearchParams>(resolve => { resolveCallback = resolve; });
      let accepted = false;
      const server = createServer((req, res) => {
        const url = new URL(req.url ?? '/', 'http://127.0.0.1');
        res.setHeader('content-type', 'text/plain; charset=utf-8'); res.setHeader('cache-control', 'no-store');
        if (req.method !== 'GET' || url.pathname !== '/auth/callback' || accepted ||
            url.searchParams.getAll('state').length !== 1 || url.searchParams.get('state') !== state) {
          res.writeHead(400); res.end('Invalid sign-in callback.'); return;
        }
        accepted = true; res.end('PostCode received the sign-in response. Return to your terminal for validation.'); resolveCallback(url.searchParams);
      });
      let abort!: () => void;
      const bounded = AbortSignal.any([signal, AbortSignal.timeout(300000)]);
      const aborted = new Promise<never>((_, reject) => {
        abort = () => reject(new CredentialError('sign_in_interrupted', 'ChatGPT sign-in was interrupted or timed out. No project was opened.'));
        bounded.addEventListener('abort', abort, { once: true });
      });
      // Attach a rejection handler even when listener startup or browser opening fails first.
      void aborted.catch(() => {});
      try {
        bounded.throwIfAborted();
        await new Promise<void>((resolve, reject) => { server.once('error', reject); server.listen(0, '127.0.0.1', () => resolve()); });
        const address = server.address();
        if (!address || typeof address === 'string') return fail('callback_unavailable', 'PostCode could not start its local sign-in callback.');
        const redirect = `http://127.0.0.1:${address.port}/auth/callback`;
        const url = new URL(`${issuer}/api/accounts/authorize`);
        url.search = new URLSearchParams({ client_id: registration?.clientId ?? 'dynamic_agent_client', ext_agent_host_id: hostId,
          response_type: 'code', redirect_uri: redirect, scope: scopes, resource, state, nonce,
          code_challenge_method: 'S256', code_challenge: createHash('sha256').update(verifier).digest('base64url'),
          ...(!registration ? { agent_name_hint: 'PostCode' } : {}), ...(consent ? { prompt: 'consent' } : {}),
          ...(registration?.tokens ? { id_token_hint: registration.tokens.idToken } : {}) }).toString();
        await (options.openBrowser ?? openBrowser)(url.toString());
        const params = await Promise.race([callback, aborted]);
        if (['code', 'client_id', 'error'].some(key => params.getAll(key).length > 1)) return fail('invalid_callback', 'OpenAI returned an ambiguous sign-in callback.');
        if (params.has('error')) return fail('sign_in_denied', 'ChatGPT sign-in was not authorized. No credentials were changed.');
        const code = params.get('code'), returnedId = params.get('client_id');
        const clientId = returnedId ?? registration?.clientId;
        if (!secret(code) || !clientIdValid(clientId) || (registration && returnedId && returnedId !== registration.clientId))
          return fail('invalid_callback', 'OpenAI returned an invalid registration or authorization code.');
        // Persist the issued client mapping before exchange so an exchange failure does not re-register it.
        await issued(clientId);
        const tokens = parseTokens(await tokenRequest({ grant_type: 'authorization_code', client_id: clientId, code, code_verifier: verifier, redirect_uri: redirect, resource }, bounded), now());
        const identity = await verifyIdentity(tokens.idToken, clientId, nonce, await keys(), registration?.identity);
        return { clientId, identity, tokens };
      } catch (error) {
        if (error instanceof CredentialError) throw error;
        return fail('sign_in_failed', 'ChatGPT sign-in could not complete. No project was opened; retry sign-in in your terminal.');
      } finally { bounded.removeEventListener('abort', abort); server.closeAllConnections(); await new Promise<void>(resolve => server.close(() => resolve())); }
    },
    async refresh(registration, signal) {
      if (!registration.tokens.refreshToken) return fail('refresh_token_expired', 'ChatGPT interactive sign-in is required; no renewable grant is available.');
      const body = await tokenRequest({ grant_type: 'refresh_token', client_id: registration.clientId, refresh_token: registration.tokens.refreshToken, resource }, signal);
      const tokens = parseTokens(body, now(), registration.tokens);
      if (tokens.idToken !== registration.tokens.idToken) await verifyIdentity(tokens.idToken, registration.clientId, undefined, await keys(), registration.identity);
      return tokens;
    },
    async revoke(registration) {
      if (!registration.tokens.refreshToken) return true;
      try {
        const endpoint = (await discovery()).revoke;
        for (let attempt = 0; attempt < 3; attempt++) {
          let response: Response | undefined;
          try { response = await fetcher(endpoint, { method: 'POST', redirect: 'error', headers: { 'content-type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({ token: registration.tokens.refreshToken, token_type_hint: 'refresh_token', client_id: registration.clientId }), signal: AbortSignal.timeout(10000) }); }
          catch { /* Bounded revocation retries are independent of inference. */ }
          if (response?.status === 200) return true;
          if (response && response.status < 500) return false;
          if (attempt < 2) await new Promise(resolve => setTimeout(resolve, 250 * 2 ** attempt));
        }
      } catch { /* Sign out locally, disclose unconfirmed remote revocation. */ }
      return false;
    },
  };
}
