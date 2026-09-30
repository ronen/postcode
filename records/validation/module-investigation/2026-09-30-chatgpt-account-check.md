# ChatGPT sign-in and account compatibility check

Date: 2026-09-30
Implementation revision: `55ded4c`
Scope: human-completed browser authorization and the authorized pre-assessment connection check.

## Observed setup

The human reported receiving the browser callback acknowledgement. PostCode's
credential-safe `auth chatgpt status` subsequently reported:

```text
* personal: signed in; plan usage granted; renewal available
```

This confirms saved, validated sign-in and granted plan permission. No token,
identity claim, authorization/callback URL or Keychain contents were printed or
inspected. The first sandboxed status invocation lacked normal runtime access;
rerunning with access to PostCode's per-user coordination directory succeeded.

## Compatibility outcome

The authorized `auth chatgpt check` stopped at the authenticated model catalog:

```text
The authorized ChatGPT account does not list gpt-6-sol. A human model choice is required; no substitute was used.
```

A separate read through the same PostCode credential boundary selected only the
catalog's visible model identifiers/display names, in provider order:

| Identifier | Display name |
| --- | --- |
| `gpt-6-astra` | GPT-6-Astra |
| `gpt-5.6-sol` | GPT-5.6-Sol |
| `gpt-5.6-terra` | GPT-5.6-Terra |
| `gpt-5.6-luna` | GPT-5.6-Luna |
| `gpt-5.5` | GPT-5.5 |

No inference POST was sent. Only authenticated model-catalog GETs were performed;
there are no provider inference-usage reports for this check. This is not a
monetary charge estimate. No API-key fallback, model substitution, purchase or
spending-setting change occurred. Medium reasoning and the live subscription
Responses contract remain unverified because the configured model was unavailable.

## Disposition and handoff

Sign-in setup is working; model incompatibility requires the human choice mandated
by the authorized scope. The human was asked whether to use `gpt-6-astra`,
`gpt-5.6-sol`, another listed model, or retain `gpt-6-sol` and pause. No choice has
been applied. After explicit direction, update the selected configuration and its
provenance, then verify medium reasoning through the chosen account/model before
continuing live assessment. Source-reference freezing must still precede any live
run on the formative subjects or fixtures. Include this account-specific
compatibility result in the milestone review handoff.
