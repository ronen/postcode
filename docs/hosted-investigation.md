# Hosted investigation setup

Hosted investigation is optional and disabled by default. The initial adapter
uses OpenAI's Responses API, model `gpt-6-sol`, medium reasoning, standard service
(`service_tier: default`), through the official `openai` SDK 7.25.0. The SDK provides
typed provider messages and abortable transport; PostCode disables its automatic
retries and logging. There is no provider or model fallback.

This integration has offline contract and CLI coverage. Live usage verification
and the formative summary assessment remain pending human credential setup.

## Transmission and charges

Setting `POSTCODE_INVESTIGATOR=openai` intentionally enables sending selected
repository source, documentation, qualified mechanical results and prior
interpretation to `https://api.openai.com/v1/responses`. The investigator can
request further evidence through PostCode's subject interface. It cannot browse,
execute shell commands, discover arbitrary files or mutate the program. Treat
repository selection as permission to transmit the evidence reachable through
that interface, not just the initially selected module. The CLI announces this
on stderr before opening the project.

Requests use `store: false` and maintain dialogue history locally for one
operation. This does not promise zero provider retention: OpenAI's abuse monitoring
and prompt caching policies can still apply. Review the provider's
[data controls](https://developers.openai.com/api/docs/guides/your-data).

This API-key route incurs **API charges**, separate from ChatGPT/Codex subscription
usage. See [API-key versus plan pricing](https://learn.chatgpt.com/docs/pricing).
Verified on 2026-09-30, the [model page](https://developers.openai.com/api/docs/models/gpt-6-sol)
lists standard prices per million tokens of $2 input, $0.20 cached input, $2.50
cache writes and $10 output, with different rates for long prompts and other
processing tiers. Actual assessment cost estimates must retain those distinctions
and their pricing date; PostCode's product usage view reports units, not a bill.

The provider's [spend controls](https://developers.openai.com/api/docs/guides/spend-limits)
currently include organization/project monthly alerts and optional enforced hard
limits. Alerts allow traffic to continue. Enable **Enforce a hard limit** in the
applicable API Platform Limits settings to reject subsequent requests when tracked
spend reaches the configured amount. Enforcement can lag and spend can slightly
exceed the setting. Provider-assigned usage limits are separate. Account permissions
and available controls must be checked in your dashboard; PostCode does not configure
them or require an administration key. The plan imposes no separate assessment
allowance. PostCode's execution guards are not monetary caps.

## Human setup on macOS

Use a terminal and Keychain Access directly, outside the coding-agent conversation.
Do not paste the key into chat, a command, a repository file or an assessment record.

1. In the OpenAI API Platform, select the project to bill and create an API key
   with access to Responses and `gpt-6-sol`. Check billing/model access and the
   project's spending controls. This adapter does not reuse a Codex sign-in.
2. Open **Keychain Access**, choose your login keychain, and create a new password
   item (File → New Password Item). Set **Keychain Item Name** (service) to
   `org.postcode.openai`, **Account Name** to `api-key`, and enter the API key in
   the password field. Save it. Keep a single matching item in the default keychain
   search list. Do not print or copy the saved password into an agent-visible tool.
3. Build PostCode with `npm run build`. In your own terminal, set the non-secret
   opt-in and open your chosen project:

   ```sh
   POSTCODE_INVESTIGATOR=openai npm run postcode -- shell --project /path/to/tsconfig.json
   ```

   One-shot commands accept the same enablement. macOS may request approval for
   Keychain access; preflight has a 15-second timeout, so rerun if approval takes
   longer. It reads the item privately through `/usr/bin/security`, with captured
   output never forwarded to the CLI, observations or investigator. Preflight
   checks local credential availability, not remote validity or billing access;
   authentication/model rejection during inference is reported separately.
4. For the planned assessment, tell the implementing agent that setup is ready
   without sharing the credential. That authorizes continuing through this
   configured mechanism; the plan already authorizes the live assessment.

With enablement absent, empty, or `disabled`, mechanical commands require no
credential and summary requests report configuration unavailability. With it set
to `openai`, missing/inaccessible credentials stop **all project opening**, including
mechanical-only commands, before the shell starts. Other values, unsupported
platforms and unavailable secure access fail explicitly. There is no environment
API-key fallback, alternate endpoint, or provider/model substitution. Help remains
available without credential access.

## Credential lifetime and access limits

PostCode reads the Keychain item once per CLI invocation. The key stays in parent
process transport memory; workers receive only identity/configuration and safe
exchange data. Logs and assessment captures exclude authentication headers and SDK
error bodies. Provider error codes are retained with locally written diagnostics;
exact credential echoes are redacted from response data before it leaves the adapter.

Keychain storage **does not isolate the key from an agent or program running as
the same OS user**. Such a process may have access equivalent to PostCode, subject
to Keychain access controls. The coding agent will not request the value, but this
is an operational boundary, not enforced credential isolation. Stronger isolation
would require a separately authorized broker and is not implemented here.

Revoke a key in the API Platform; deleting its Keychain item alone does not revoke
it remotely. Replace the item's password when rotating, revoking or encountering
an expired/unusable key, and restart PostCode. There is no OAuth refresh or automatic
rotation. A running invocation holds its prior key until it ends. Authentication
rejection produces configuration unavailability; usage/transport failures remain
separate. Neither causes automatic retries. Do not enable investigation after
revocation until usable access is configured.

The dialogue guard allows 180 seconds, 32 model exchanges, 96 evidence requests and
2,000,000 serialized UTF-16 code units; the adapter caps each response at 16,000
output tokens. Refusal, truncation and invalid output remain explicit failures.
Aborting closes local transport and discards dialogue state. It cannot guarantee
that remote computation or billing stops, or recover usage not returned before
closure. Repeated retained displays perform no inference.
