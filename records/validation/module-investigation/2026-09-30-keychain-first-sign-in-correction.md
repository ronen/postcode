# First-sign-in Keychain absence correction

Date: 2026-09-30
Starting revision: `cba73b0`
Scope: reported pre-browser sign-in failure; milestone 3 remains active.

## Reproduction and cause

The human twice received `PostCode ChatGPT registration storage is invalid; it
was not overwritten.` before the browser opened. A read of a newly randomized,
nonexistent test service/account through installed `@napi-rs/keyring` 2.1.0
returned JavaScript `null`. Only its type/absence indicators were printed; no
PostCode or Codex credential item was queried, and no test item was created.

The library's asynchronous TypeScript declaration advertises
`Promise<string | undefined>`. The previous adapter forwarded the runtime null
unchanged. Registration decoding recognizes undefined as absence, whereas
`JSON.parse(null)` produces null and fails vault validation. This reproduces the
reported pre-browser failure without reading the human's actual storage.
Earlier offline tests supplied undefined for absence and missed the native
binding/declaration mismatch. Their historical passing results do not establish
that first-use native setup worked.

## Correction

The native-entry boundary now translates null or undefined absence to undefined
before registration decoding. Empty strings, JSON null, malformed JSON and
invalid vault objects still fail without writes. Inaccessible native storage
remains a credential-safe access failure, not a signal to initialize or reset.
The same adapter handles production Keychain and controlled test entries; no
plaintext fallback, credential reset or OAuth/billing-policy change is introduced.
The architecture account and setup guide document the distinction.

## Verification

- `npm run check` and `npm run build`: passed.
- Focused authentication, subscription transport, API-key/shared CLI and assessment
  reporting run: **39 passed, zero failures, cancellations or skips**, 4.92 seconds:

  ```sh
  node --test _build/test/chatgpt-auth.test.js _build/test/chatgpt-investigator.test.js _build/test/openai-investigator.test.js _build/test/assessment-usage.test.js
  ```

- Three new regressions cover both missing-item sentinels through first sign-in
  and subsequent invocation, preservation of empty/invalid storage, and native
  read failures without credential disclosure or replacement.
- A second, freshly randomized nonexistent native Keychain item was read through
  the corrected production adapter and registration manager. It produced
  normalized absence and an empty registration list. Only those two boolean
  results were printed. No actual credential contents were inspected or modified.
- `git diff --check`: passed. The full suite was not rerun for this localized
  boundary correction; the preceding 407-test result remains historical.

The build is ready for the human to retry the same sign-in command in their own
terminal. Actual browser sign-in, saved-credential approval and account/model
verification remain pending. Include this failure, test gap and correction in
the milestone review handoff.
