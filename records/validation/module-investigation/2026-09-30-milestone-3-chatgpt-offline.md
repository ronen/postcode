# Milestone 3: ChatGPT sign-in offline checkpoint

Date: 2026-09-30
Starting revision: `1de7477`
Scope: the human-authorized Sign in with ChatGPT addition and replacement setup
handoff. This is not milestone-3 completion or an independent-review clearance.

## Protocol and implementation

Verified the current official [quickstart](https://developers.openai.com/siwc/quickstart),
[open-source flow](https://developers.openai.com/siwc/token-sharing-open-source),
its sign-in, session, model/inference, token, error and preview-limitations pages,
the [plan-sharing help](https://help.openai.com/en/articles/20001542-using-your-chatgpt-plan-in-other-apps-and-sites),
and public [OIDC discovery](https://auth.openai.com/.well-known/openid-configuration).
Discovery identifies the fixed OpenAI authorization/token/revocation endpoints,
issuer, RS256 signing algorithm and JWKS. Runtime discovery is validated before
using its metadata; signed identity verification uses `jose`.

The CLI provides project-independent browser sign-in, credential-safe status,
registration selection and sign-out. State, PKCE, callback/client binding, signed
issuer/audience/expiry/nonce and returning-subject checks precede activation.
Granted token scopes are authoritative. Identity-only permission decline remains
a saved sign-in with plan inference unavailable. Issued registrations and the
stable host survive sign-out; returning sign-in reuses them.

Credentials persist together in the PostCode-specific macOS Keychain item. A
kernel lock serializes renewal across processes; each rotation replaces the whole
credential set. Process death releases the lock without stale-file deletion or
lease expiry. A running project binds to a registration generation. Sign-out
invalidates it before remote revocation; active transport observes invalidation
and aborts. Ordinary close does not revoke. Temporary credential errors retain
state; terminal renewal errors require interactive sign-in.

The API-key option remains explicit and separate. ChatGPT configuration uses
streaming Responses, `store: false`, array input, namespaced functions, and omits
unsupported fields, including `max_output_tokens`. Only terminal completed
responses can submit results for unchanged domain validation. Failed/incomplete
responses retain received usage; EOF and partial deltas never imply acceptance.
Cancellation, domain guards and zero automatic inference retries remain in force.

Route provenance and usage distinguish API billing and ChatGPT plan funding.
Unknown monetary/credit attribution is not zero. Development usage reporting
keeps investigator/evaluator/assessor rows separate, even when funded by the same
allowance. No API-equivalent estimate is presented as actual ChatGPT charges.
No purchase or provider-side spending change is implemented.

## Dependencies and boundary rationale

- Official `openai` 7.25.0 remains the abortable Responses/SSE transport with SDK
  logging and inference retries disabled.
- `jose` 6.2.12 (MIT) supplies maintained JOSE signature/claim validation and JWKS
  caching instead of implementing cryptography locally.
- `@napi-rs/keyring` 2.1.0 (MIT), a maintained native binding to OS credential
  stores, writes Keychain values inside the parent process. This avoids secrets
  in `security` command arguments. Its published asynchronous entry contract
  distinguishes an absent item from inaccessible storage.
- `fs-ext` 2.1.1 (MIT) supplies the mature OS `flock` binding. A suspended owner
  cannot lose a lease and race a rotating refresh token. The native module built
  successfully on this host and was exercised across processes. Native storage
  and locking packages are optional install dependencies; hosted setup fails if
  unavailable, while mechanical operation retains its platform independence.

Keychain does not absolutely isolate credentials from same-user processes. This
is explicitly disclosed in the setup guide. No Codex credentials were inspected
or reused. No real Keychain credential was read or written during verification.

## Verification evidence

- `npm run check`: passed.
- `npm test`: **407 passed, 0 failed, 0 cancelled, 0 skipped**, 127.11 seconds.
  Repository inputs remained unchanged throughout the suite. It ran with local
  loopback permission; all authentication/inference responses were test data.
- Sixteen authentication tests cover actual loopback callbacks; signature,
  issuer, audience, nonce, expiry and identity rejection; state/PKCE/client binding;
  denial/ambiguous callbacks; granted-scope validation; identity-only sign-in;
  persistence/registration separation; expiry renewal; temporary versus terminal
  failure; explicit routes; revocation/retry; interrupted sign-in; and sign-out
  notification. A two-process test proves one refresh and use of the rotated
  token by both processes. Another proves kernel-lock release after process death.
- Six subscription adapter tests exercise the real SDK with offline HTTP/SSE:
  namespace/history/rotated token handling, completed-only submission, partial
  output/EOF/malformed/failed/incomplete streams, credential-safe failure metadata,
  cancellation and revocation, and model/medium connection-check behavior without
  substitution. A missing model causes no inference call.
- Thirteen shared adapter tests retain API-key regressions and exercise both
  routes through the actual parent/worker/CLI shell in human and JSON output.
  Accepted summaries, retained redisplay, subsequent usage and observations agree;
  sentinel credentials are absent from output, context and captures.
- One assessment report test keeps evaluator attribution separate and monetary
  amounts unknown instead of zero or purported ChatGPT charges.
- `npm run postcode -- auth chatgpt help` succeeds without project or credentials.
  The browser launcher's Foundation/stdin bridge was checked using a harmless URL
  length, without launching a browser. Browser launch itself awaits human setup.
- `git diff --check`: passed. New documentation link targets checked.

An initial sandboxed authentication test could not bind its loopback listener;
rerunning with loopback permission passed. This was not a provider call or a
suppressed product failure. Test stores use synthetic credentials; their temporary
file-backed cross-process fixture is not a product plaintext-storage fallback.
The earlier execution-ownership [diagnosis](2026-09-30-execution-ownership-diagnosis.md)
and historical cancelled runs remain separately preserved.

## Limits and required human handoff

Public protocol verification and offline tests do not establish eligibility,
provider schema acceptance, real Keychain approval or `gpt-6-sol`/medium access
through the human account. The documented `earliest_refresh_at` field lacks a
specified representation; it is retained opaquely and PostCode renews at access
expiry rather than speculating about an earlier schedule. Any protocol mismatch
requiring a consequential choice or broader scope returns to the human.

The human now runs `npm run postcode -- auth chatgpt sign-in` from the checkout in
their own terminal and reports setup readiness without credentials. After that,
run `auth chatgpt check` and retain its provider usage, model and compatibility
result. Continue the authorized assessments on the ChatGPT route; interactive
reauthorization pauses work for the human. Source-reference freezing, remaining
assessment runners, clean evaluators/source-informed assessors, live baseline and
focused cases, and milestone-3 independent review remain pending. Milestone 4 is
still gated. The eventual milestone review handoff must include this addition,
these tests, account compatibility evidence and all usage-attribution limitations.
