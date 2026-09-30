# Native sign-in browser handoff correction

Date: 2026-09-30
Starting revision: `32779df`
Scope: the second human setup failure, after missing-Keychain-item handling was corrected.

## Reproduction and cause

The human received `PostCode could not open the sign-in browser.` after the
opening announcement. Running the original production AppleScript with a harmless
loopback test URL reproduced exit code 1 and a native `unrecognized selector`
error for `location` (AppleScript error -10000). No credential or OAuth URL was
used in the reproduction.

The script imported Foundation for stdin reading but omitted `use scripting
additions`, needed to resolve its `open location` command. The earlier native
check exercised only the Foundation/stdin portion and therefore did not cover
this failure. Offline OAuth tests substituted browser opening, so their passing
results did not establish native browser launch.

## Correction and regression check

The macOS handoff explicitly imports scripting additions. It is isolated in the
parent-only browser boundary so both OAuth and the committed diagnostic execute
the same production launcher. Authorization URLs still travel through stdin;
returning ID-token hints are not placed in helper arguments, logs or diagnostics.
No authentication, billing, credential-storage or consent policy changes.

The new opt-in check starts a temporary loopback HTTP server, invokes the production
launcher with its unique local URL, and requires both successful launcher exit
and receipt of the browser's page request within 20 seconds. It serves a harmless
confirmation page and closes the server. It does not access Keychain, start OAuth,
contact inference services or automate sign-in. It is intentionally separate from
the routine test suite because it opens a visible browser tab.

```sh
npm run build
node scripts/module-investigation/check-browser.mjs
```

## Verification

- `npm run check` and `npm run build`: passed.
- Native production-launcher check: **passed**. The browser opened and requested
  the temporary local confirmation page. No credential/OAuth access occurred.
- Focused authentication, subscription transport, API-key/shared CLI and assessment
  reporting regression run: **39 passed, 0 failed, 0 cancelled, 0 skipped**, 4.91 seconds:

  ```sh
  node --test _build/test/chatgpt-auth.test.js _build/test/chatgpt-investigator.test.js _build/test/openai-investigator.test.js _build/test/assessment-usage.test.js
  ```

- `git diff --check`: passed. The full suite was not rerun for this localized
  native handoff correction; the prior full-suite result remains historical.

The architecture account identifies the stdin handoff, and the hosted setup guide
links the credential-free native diagnostic. Actual browser authorization,
credential persistence approval and account/model compatibility still require the
human setup flow. The rebuilt sign-in command is ready for another human attempt.
Include both the missed native coverage and this verified correction in the
milestone review handoff; milestone 3 remains incomplete.
