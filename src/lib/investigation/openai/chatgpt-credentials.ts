import { randomUUID } from 'node:crypto';
import type { CredentialStore } from './credential-store.js';
import { CredentialError } from './credential-store.js';
import { issuer, requiresReauthorization } from './oauth.js';
import type { OAuthRegistration, OAuthService, TokenSet } from './oauth.js';

interface Registration extends OAuthRegistration { label: string; session: string; pending?: string }
interface Vault { version: 1; issuer: typeof issuer; hostId: string; active?: string; registrations: Registration[] }
export interface AccountStatus { label: string; active: boolean; signedIn: boolean; planUsage: boolean; renewable: boolean }
export interface ChatGPTSession {
  /** Parent-only token supplier. Each call checks persisted state; no account/billing fallback. */
  token(signal: AbortSignal): Promise<string>;
  /** Abort an in-flight request after local sign-out/replacement is observed. */
  watch(controller: AbortController): () => void;
}
const planEnabled = (tokens?: TokenSet) => !!tokens?.scopes.includes('chatgpt.tokens.use.direct') && tokens.scopes.includes('resource.invoke');
const unavailable = () => new CredentialError('reauthorization_required', 'ChatGPT sign-in is required. Run postcode auth chatgpt sign-in in your own terminal. No API billing fallback was used.');
function decode(raw: string | undefined): Vault {
  if (raw === undefined) return { version: 1, issuer, hostId: `urn:uuid:${randomUUID()}`, registrations: [] };
  try {
    const v = JSON.parse(raw) as Vault;
    if (v.version !== 1 || v.issuer !== issuer || !/^urn:uuid:[a-f0-9-]{36}$/.test(v.hostId) || !Array.isArray(v.registrations) ||
        new Set(v.registrations.map(r => r.label)).size !== v.registrations.length || new Set(v.registrations.map(r => r.clientId)).size !== v.registrations.length ||
        v.registrations.some(r => !/^[a-zA-Z0-9_-]{1,40}$/.test(r.label) || typeof r.clientId !== 'string' || !r.clientId || r.clientId === 'dynamic_agent_client' ||
          typeof r.session !== 'string' || (r.identity && (typeof r.identity.subject !== 'string' || !r.identity.subject)) ||
          (r.tokens && (!r.identity || typeof r.tokens.idToken !== 'string' || !Array.isArray(r.tokens.scopes) || r.tokens.scopes.some(s => typeof s !== 'string') ||
            !Number.isFinite(r.tokens.expiresAt) || typeof r.tokens.accessToken !== 'string' || typeof r.tokens.refreshToken !== 'string')))) throw new Error();
    return v;
  } catch { throw new CredentialError('invalid_storage', 'PostCode ChatGPT registration storage is invalid; it was not overwritten.'); }
}
export function chatGPTCredentials(store: CredentialStore, oauth: OAuthService, now = Date.now) {
  const read = async () => decode(await store.read());
  const save = (vault: Vault) => store.write(JSON.stringify(vault));
  return {
    async status(): Promise<AccountStatus[]> {
      return store.exclusive(async () => { const v = await read(); return v.registrations.map(r => ({ label: r.label, active: r.label === v.active,
        signedIn: !!r.tokens, planUsage: planEnabled(r.tokens), renewable: !!r.tokens?.refreshToken })); });
    },
    async signIn(label: string, consent: boolean, signal: AbortSignal): Promise<AccountStatus> {
      if (!/^[a-zA-Z0-9_-]{1,40}$/.test(label)) throw new CredentialError('invalid_label', 'Use a registration label of 1–40 letters, numbers, underscores or hyphens.');
      const pending = randomUUID();
      const initial = await store.exclusive(async () => {
        const v = await read(); const r = v.registrations.find(r => r.label === label);
        if (r) r.pending = pending;
        await save(v); return { hostId: v.hostId, registration: r };
      }, signal);
      const result = await oauth.authorize(initial.hostId, initial.registration, consent, async clientId => {
        await store.exclusive(async () => {
          const v = await read(); let r = v.registrations.find(r => r.label === label);
          if (r && r.pending !== pending) throw new CredentialError('sign_in_superseded', 'This sign-in was superseded by another account operation.');
          if (!r) {
            if (v.registrations.some(r => r.clientId === clientId)) throw new CredentialError('duplicate_registration', 'This client is already saved under another label.');
            r = { label, clientId, session: randomUUID(), pending }; v.registrations.push(r);
          }
          if (r.clientId !== clientId) throw new CredentialError('invalid_registration', 'The returned registration does not match the selected account.');
          await save(v);
        }, signal);
      }, signal);
      return store.exclusive(async () => {
        const v = await read(), r = v.registrations.find(r => r.label === label);
        if (!r || r.pending !== pending || r.clientId !== result.clientId) throw new CredentialError('sign_in_superseded', 'This sign-in was superseded; its credentials were not activated.');
        r.tokens = result.tokens; r.identity = result.identity; r.session = randomUUID(); delete r.pending; v.active = label;
        await save(v);
        return { label, active: true, signedIn: true, planUsage: planEnabled(r.tokens), renewable: !!r.tokens.refreshToken };
      }, signal);
    },
    async select(label: string): Promise<void> {
      await store.exclusive(async () => { const v = await read(); const r = v.registrations.find(r => r.label === label);
        if (!r?.tokens || !r.identity) throw unavailable(); v.active = label; await save(v); });
    },
    async signOut(label?: string): Promise<boolean> {
      return store.exclusive(async () => {
        const v = await read(), r = v.registrations.find(r => r.label === (label ?? v.active));
        if (!r) throw unavailable();
        const previous = structuredClone(r);
        delete r.tokens; delete r.pending; r.session = randomUUID();
        // Persist the stop marker first. Other processes reject new calls and cancel observed requests.
        await save(v);
        return previous.tokens ? oauth.revoke({ ...previous, tokens: previous.tokens }) : true;
      });
    },
    async session(): Promise<ChatGPTSession> {
      const selected = await store.exclusive(async () => {
        const v = await read(), r = v.registrations.find(r => r.label === v.active);
        if (!r?.tokens || !r.identity) throw unavailable();
        if (!planEnabled(r.tokens)) throw new CredentialError('plan_permission_required', 'Signed in, but ChatGPT plan usage was not granted. Use postcode auth chatgpt sign-in <label> --consent to request it, or explicitly choose API billing.');
        return { label: r.label, session: r.session };
      });
      async function current(): Promise<{ vault: Vault; registration: Registration & { tokens: TokenSet } }> {
        const vault = await read(), r = vault.registrations.find(r => r.label === selected.label);
        if (!r?.tokens || r.session !== selected.session) throw unavailable();
        return { vault, registration: r as Registration & { tokens: TokenSet } };
      }
      return {
        async token(signal) {
          return store.exclusive(async () => {
            const { vault, registration: r } = await current();
            // The docs do not define earliest_refresh_at units. Preserve it opaquely and
            // renew at expiry, avoiding speculative proactive renewal before that boundary.
            if (now() >= r.tokens.expiresAt) {
              try { r.tokens = await oauth.refresh(r, signal); }
              catch (error) {
                if (requiresReauthorization(error)) { delete (r as Registration).tokens; r.session = randomUUID(); await save(vault); }
                throw error;
              }
              await save(vault); // Whole rotated set is replaced in one Keychain write under the kernel lock.
            }
            if (!planEnabled(r.tokens)) throw new CredentialError('plan_permission_required', 'ChatGPT plan permission is unavailable. No API billing fallback was used.');
            return r.tokens.accessToken;
          }, signal);
        },
        watch(controller) {
          let stopped = false, pending = false;
          const timer = setInterval(() => {
            if (stopped || pending) return; pending = true;
            // Reads are atomic Keychain snapshots and do not wait behind a slow revocation.
            void current().catch(() => { if (!stopped) controller.abort(unavailable()); }).finally(() => { pending = false; });
          }, 1000);
          timer.unref();
          return () => { stopped = true; clearInterval(timer); };
        },
      };
    },
  };
}
export type ChatGPTCredentials = ReturnType<typeof chatGPTCredentials>;
