# Hosted investigation setup

Hosted investigation is optional and disabled by default. Explicitly select one
of two OpenAI routes: `POSTCODE_INVESTIGATOR=chatgpt` uses Sign in with ChatGPT and
its granted plan allowance; `POSTCODE_INVESTIGATOR=openai` uses an API key and API
billing. Signing in alone does not enable hosted project work. PostCode never
switches between these routes, accounts or models to recover from a failure.

The ChatGPT-plan route requests `gpt-5.6-sol` with medium reasoning; the API-key
route retains `gpt-6-sol` with medium reasoning. Both use the public Responses API.
Compatibility must be verified against the authorized ChatGPT account before
assessment; availability is account-dependent. No substitute model is selected automatically.

The human selected `gpt-5.6-sol` for the fixed ChatGPT-plan assessment pass because
`gpt-6-sol` is unavailable through this account. The recorded rationale is that
GPT-5.6 Sol is a capable alternative with lower published token rates than GPT-6
Astra, preserving a reasonably capable, moderately priced starting configuration.
Sufficient interpretive value remains for assessment to establish. Hold this
configuration fixed throughout the pass; disappointing findings do not authorize
switching to Astra. The account catalog lists the selected model, but live medium
reasoning and streaming compatibility remain unverified: the connection check
received HTTP 200 without a content type and accepted no result. See the
[verification record](../records/validation/module-investigation/2026-09-30-chatgpt-56sol-check.md).
This selection rationale is not a claim about actual ChatGPT
credit charges, which remain unattributed by token reports.

## Human setup: Sign in with ChatGPT

Build PostCode, then run this in your own terminal from the PostCode checkout:

```sh
npm run build
npm run postcode -- auth chatgpt sign-in
```

No project is opened. PostCode starts a local `127.0.0.1` callback before opening
the browser. Sign in and grant optional ChatGPT plan use if desired. Return to
the terminal for the validation result. Credentials are saved directly in macOS
Keychain, never printed. A missing item initializes a new registration; invalid or
inaccessible existing storage is reported without overwriting it. Tell the
implementing agent that setup is ready;
**do not share tokens, callback URLs, or authorization URLs**.

The initial registration label is `personal`. To add another account/workspace,
use `auth chatgpt sign-in <new-label>`. Reuse an existing label to reauthorize
that registration; its issued client and workspace binding are preserved. Labels
are distinct even when accounts share an email address.

```sh
npm run postcode -- auth chatgpt status
npm run postcode -- auth chatgpt use personal
npm run postcode -- auth chatgpt sign-in personal --consent
npm run postcode -- auth chatgpt sign-out personal
```

Status reports only labels and availability, not identity claims or credential
values. `--consent` explicitly requests plan permission again after it was not
granted. A valid sign-in without plan permission is retained but cannot run
investigations on this route. Signing out retains the registration and stable
host identifier, attempts renewable-session revocation with bounded retries, and
clears its local access, refresh and ID tokens. An unconfirmed remote revocation
is reported. Disconnect PostCode in **ChatGPT Settings → Security and login →
Sign in with ChatGPT** when remote access needs to be removed.

After human setup, this explicit connection check lists the account's available
models and performs a small, cost-bearing streaming request with `gpt-5.6-sol` and
medium reasoning. It reports provider token usage and stops on incompatibility:

```sh
npm run postcode -- auth chatgpt check
```

Then explicitly choose the route when opening a project:

```sh
POSTCODE_INVESTIGATOR=chatgpt npm run postcode -- shell --project /path/to/tsconfig.json
```

The same choice applies to one-shot commands. Account eligibility, plan/workspace
restrictions and model availability are provider-controlled; public documentation
is not evidence of access through your particular account. Interactive
reauthorization pauses assessment work for the human terminal flow.

## ChatGPT allowance and optional credits

This route shares the applicable ChatGPT allowance with other eligible usage;
PostCode does not receive a separate allowance. A provider-side app cap may stop
PostCode before the overall allowance is exhausted. Optional purchased credits
can be used after allowance limits only when the user has permitted it and
credits are available. Setting an app's weekly cap to 100% does not itself enable
credit use. PostCode does not purchase credits, enable automatic purchases, or
change spending settings. Review [ChatGPT Settings → Usage](https://chatgpt.com/settings/usage)
and the provider's [plan-sharing explanation](https://help.openai.com/en/articles/20001542-using-your-chatgpt-plan-in-other-apps-and-sites).

Provider token reports remain attributed to each call, attempt, model and route.
They do not identify actual ChatGPT credit charges or distinguish allowance from
credits. Monetary attribution is **unavailable, not zero**. API list prices must
not be called ChatGPT charges; any future API-equivalent estimate must be labeled
as a comparison. Assessment reporting keeps investigator, evaluator and
source-informed assessor usage separate even if all share the same allowance.
The development [usage report](../scripts/module-investigation/usage-report.mjs)
preserves those distinctions and unknown amounts.

## API-key option

The API-key route remains available and incurs API charges separately from
ChatGPT plan usage. In OpenAI API Platform select the project to bill and create
an API key with Responses and `gpt-6-sol` access. Check its billing/model access
and [spending controls](https://developers.openai.com/api/docs/guides/spend-limits).
PostCode does not configure them or require an administration key.

In **Keychain Access**, create a password item with service **org.postcode.openai**,
account **api-key**, and the key in the password field. Keep one matching item in
the default search list. Do not put the key in chat, shell arguments, environment
variables, repository files or assessment records. Explicitly select:

```sh
POSTCODE_INVESTIGATOR=openai npm run postcode -- shell --project /path/to/tsconfig.json
```

Preflight privately reads this item once per invocation through `/usr/bin/security`
with a 15-second timeout. Keychain approval can require rerunning the command.
Replace the saved password after rotation and restart PostCode. Deleting it alone
does not revoke the key remotely; revoke it in API Platform. This route uses
standard service tier and a 16,000 output-token cap. Reported tokens are not a
bill; API assessment estimates require dated rates and applicable caching,
context-length and service-tier distinctions. See the [model pricing page](https://developers.openai.com/api/docs/models/gpt-6-sol).

## Transmission, storage and cancellation

Enabled project commands disclose on stderr that selected source, documentation,
qualified analysis and prior interpretation can be sent to
`https://api.openai.com/v1/responses`. The investigator accesses evidence only
through PostCode's subject interface. It has no independent filesystem, shell,
mutation or browsing tools. Opt-in covers evidence reachable through that
interface, not only the initially selected module.

Both routes use `store: false` and a fresh local history per investigation. This
does not promise zero provider retention; review [provider data controls](https://developers.openai.com/api/docs/guides/your-data).
The ChatGPT route streams, groups functions in the `postcode` namespace and omits
unsupported request fields, including `max_output_tokens`. A completed transport
response still requires explicit result submission and domain validation. Partial
streamed output never becomes an accepted investigram. The SDK's inference retries
and logging are disabled; token renewal is separate from inference retry.

ChatGPT registrations and tokens persist together in Keychain service
`org.postcode.chatgpt`, account `registrations-v1`. The stable host identifier and
issued client/validated subject mapping survive sign-out. A kernel file lock in
`~/Library/Application Support/PostCode` serializes read/renew/write across
processes; it contains no credentials and has no stale lease that could allow a
second process to rotate a suspended process's refresh token. Keychain replacement
saves each rotated set together. Ordinary process exit does not sign out or revoke.

PostCode renews expired access tokens before the next request. The current docs
name `earliest_refresh_at` without defining its representation; PostCode retains
it opaquely and avoids speculative early refresh. A terminal refresh rejection
clears unusable tokens, retains the registration, and asks for interactive sign-in.
Temporary service failures retain the saved credentials. Each running project
binds to its selected registration; choosing another account affects subsequent
invocations. Sign-out invalidates that session, rejects new requests and cancels
in-flight local transport when its one-second watcher observes the change.

Credentials stay inside the parent process. Workers receive non-secret provider
configuration, qualified replies and usage only. Investigator context, logs,
observations, artifacts and diagnostics exclude credentials. Sanitized provider
failure bodies preserve status, error shape, code/parameter and request ID.
OpenAI ID-token validation uses signed JWKS, exact issuer/audience, expiry, nonce
and saved-subject binding. The setup never reads or reuses Codex credentials.

**Keychain does not absolutely isolate credentials from other processes running
as the same OS user.** Its access controls are an operational boundary, not a
separate-user broker. This limitation applies to both routes.

Absent, empty or `disabled` enablement leaves mechanical commands usable without
credentials. Enabled routes fail project preflight if their local prerequisites
are missing. Help and authentication commands work independently of a project.
Protected hosted credentials currently require macOS; there is no plaintext,
environment-key or alternate-endpoint fallback.

The domain guard allows 180 seconds, 32 model exchanges, 96 evidence requests and
2,000,000 serialized UTF-16 code units. Aborting discards local dialogue state; it
cannot guarantee that provider computation, allowance consumption or billing
stops, or recover usage not returned before closure. Retained displays perform
no inference.

Protocol verified against the current [quickstart](https://developers.openai.com/siwc/quickstart),
[open-source integration guide](https://developers.openai.com/siwc/token-sharing-open-source),
[sign-in flow](https://developers.openai.com/siwc/token-sharing-open-source/sign-in),
[session lifecycle](https://developers.openai.com/siwc/token-sharing-open-source/profiles-and-sessions),
[inference contract](https://developers.openai.com/siwc/token-sharing-open-source/models-and-inference)
and [OIDC discovery](https://auth.openai.com/.well-known/openid-configuration) on 2026-09-30.

The integration pins `openai` 7.25.0 (Responses transport), `jose` 6.2.12
(signed OIDC validation), `@napi-rs/keyring` 2.1.0 (in-process Keychain read/write)
and `fs-ext` 2.1.1 (kernel refresh coordination). The latter two are optional
native dependencies so mechanical analysis can install on other platforms;
ChatGPT setup fails explicitly if they are unavailable. Building `fs-ext` on
macOS requires the native Node build toolchain/Xcode Command Line Tools. No
credential is passed through native-helper command arguments.


For a credential-free native browser diagnostic after building, run
`node scripts/module-investigation/check-browser.mjs`. It exercises the production
launcher and waits for the browser to request a temporary local test page. It
opens a browser tab but does not access Keychain, initiate OAuth or contact an
inference provider. This opt-in check is separate from the routine offline suite.
