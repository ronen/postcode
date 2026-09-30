# Human-selected GPT-5.6 Sol configuration and connection checks

Date: 2026-09-30
Authorization: task follow-up `8567ab0`, preserved before implementation.
Implementation: the commit containing this record, based on `8567ab0`.
Scope: fixed ChatGPT-plan assessment configuration and pre-assessment verification.

## Selection and rationale

The human selected `gpt-5.6-sol` with medium reasoning through the ChatGPT-plan
route, with this rationale:

> `gpt-6-sol` is unavailable through the account’s ChatGPT-plan route. GPT-5.6 Sol is a capable alternative with lower published token rates than GPT-6 Astra, preserving our preference to start with a reasonably capable, moderately priced configuration. Whether it provides sufficient interpretive value remains for the assessments to establish.

This is the human-selected rationale, not an assessment result or an estimate of
actual ChatGPT credit charges. The configuration is fixed throughout the planned
pass. Disappointing quality requires reporting, not automatic switching to Astra.
API-key configuration retains `gpt-6-sol` / medium and remains an explicit separate
billing route. No fallback, credit purchase or provider-setting change occurred.

The ChatGPT identity, actual request model, account check, configuration disclosure,
help and documentation now agree on the selected model. Regressions distinguish
the two route-specific models in actual requests and both CLI output formats.

## Live attempts

Both attempts invoked `npm run postcode -- auth chatgpt check`, using PostCode's
saved sign-in through its parent credential boundary. Both passed the account
catalog check for the selected model and attempted one inference POST. Neither
opened a project or transmitted assessment source. The check's fixed prompt asks
only for a `submit_investigram` connection confirmation; exact prompt and request
construction are retained in `auth-command.ts`, `adapter.ts` and `protocol.ts` in
this record's implementation commit. Each request uses medium reasoning,
`store: false`, streaming, namespaced functions, no inference retries and a
30-second caller deadline. No response was accepted as an investigram.

| Attempt | Implementation condition | Result | Usage received |
| --- | --- | --- | --- |
| 1 | Selected model applied; original stream parsing/diagnostics | `communication-failure: invalid_provider_response` | None; consumption unknown |
| 2 | Optional terminal status corrected; distinct stream diagnostics added | `communication-failure: unexpected_response_content_type` | None; consumption unknown |

The first attempt's CLI diagnostic was:

```text
The gpt-5.6-sol / medium / subscription-streaming check did not complete (communication-failure: invalid_provider_response). Retained check usage: []. A human decision may be required; no substitute or inference retry was used.
```

Before attempt 2, a finite policy was recorded: one post-fix verification only,
followed by a stop if unsuccessful. This was a check of changed transport handling,
not an automatic retry of an unchanged investigation. Its diagnostic was:

```text
The gpt-5.6-sol / medium / subscription-streaming check did not complete (communication-failure: unexpected_response_content_type). Retained check usage: []. Provider diagnostic: {"status":200,"body":{"contentType":null,"observedEvents":[]},"requestId":null}. A human decision may be required; no substitute or inference retry was used.
```

The second response reached the adapter with HTTP 200, no content type and no
request ID. It failed admission before consuming any stream events. This does
not establish whether the body contained valid events, a non-stream response or
some other intermediary/provider result. No raw body was captured. The first
diagnostic cannot distinguish those cases either. Elapsed times and exact wire
payloads were not captured; these are limits of these connection-check records,
not measurements to reconstruct by assumption. No credential, authorization URL,
identity claim or Keychain content was displayed or inspected.

Neither attempt establishes completed inference, medium-reasoning compatibility,
or interpretive quality. No received usage means unknown consumption and unknown
monetary/allowance/credit attribution, not zero. Evaluators and assessment subjects
have not been run in this pass.

## Local contract correction and diagnosis limits

The installed official `openai` 7.25.0 SDK declares `Response.status` optional,
including within `ResponseCompletedEvent.response`. The adapter previously
required that nested status even when an explicit terminal event supplied it.
It now derives an absent status from the terminal event, rejects contradictory
status, and still rejects partial output and premature EOF. This is a demonstrated
contract correction, **not a verified cause or fix of either live failure**.

Malformed-stream diagnostics now distinguish missing/wrong content type, premature
EOF and inconsistent terminal response, retaining HTTP status, request ID and
bounded event-type history with credential redaction. The CLI check preserves
those diagnostics instead of reducing them to a generic failure code.

The current [official subscription inference guide](https://developers.openai.com/siwc/token-sharing-open-source/models-and-inference)
was rechecked on this date. It requires the public Responses endpoint, streaming,
and an explicit completed terminal before success. The adapter retains these
requirements. No endpoint substitution or acceptance of unfinished output was
introduced to work around the failure.

## Offline verification

- `npm run check` and build passed.
- Focused transport/shared CLI run: **21 passed**, zero failures, cancellations or
  skips, 5.73 seconds. This preceded additional missing-header and credential-
  redaction cases within the same diagnostic regression.
- First full `npm test`, sandboxed: **409 passed, 3 failed**, zero cancellations or
  skips, 156.41 seconds. Failures were the real-loopback OAuth tests for first
  sign-in, returning sign-in, and identity-only permission decline.
- Full `npm test` rerun with required local loopback permission: **412 passed**,
  zero failures, cancellations or skips, 160.18 seconds. The three failures above
  passed with permission and no intervening source changes. Repository inputs
  remained unchanged during both full runs. Tests use synthetic credentials and
  offline transports, not real sign-in or paid inference.
- `git diff --check` passed.

Coverage includes selected request/provenance models, API-key preservation,
terminal status omission and contradiction, absent/wrong content type, premature
EOF, credential-safe diagnostics, completed/failed/incomplete usage, cancellation,
credential lifecycle and both CLI output formats. Offline success does not clear
the live connection concern.

## Disposition and next boundary

Configuration and documentation are updated; live verification is unsuccessful.
The [assessment recovery policy](../../../docs/plans/module-investigation.md#assessment-failure-recovery-and-reliability)
does not automatically permit repetition of an unclassified failure. Stop further
inference and request human direction. A proposed bounded next step is one
instrumented connection check, retaining only credential-safe response metadata
and body structure, to identify what arrived before considering a transport fix.
That request is not yet authorized by a new recovery decision or executed.

Carry both failed attempts, unknown usage, the independent contract correction,
offline verification and unresolved response origin/content into the milestone-3
handoff. The task remains active. Pinned/frozen references, remaining assessment
tooling, baseline/focused cases, fresh evaluators and source-informed assessors,
and independent milestone review remain due. Milestone 4 remains gated.
