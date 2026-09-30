# Hosted authentication and billing routes

Status: accepted
Decided: 2026-09-30
Arising from: explicit human extension of [module investigation](../plans/module-investigation.md), recorded in the [active task](../../records/tasks/2026-09-29-module-investigation.md)
Scope: milestone-3 hosted authentication, billing attribution and assessment setup

## Decision

Support Sign in with ChatGPT with optional granted ChatGPT plan usage alongside
API-key billing. The user explicitly selects the route; no silent fallback is
permitted. Preserve renewable sign-in across invocations, protected credential
storage and the established parent-process credential boundary. Ordinary process
exit must not sign out. Do not reuse or inspect Codex credentials.

Use the documented subscription streaming/tool contract while preserving domain
submission validation, execution guards, cancellation and the inference retry
policy. Verify the intended model and reasoning configuration against the account;
substitution requires human direction. Renewal is distinct from inference retry.

Report route provenance and provider usage. Unknown ChatGPT allowance/credit or
monetary attribution must remain unknown; API list prices are not actual ChatGPT
credit charges. Evaluator usage remains separate even when sharing an allowance.
Do not purchase credits or modify provider spending settings.

## Rationale and alternatives

The human selected reusable ChatGPT sign-in for the forthcoming assessment while
retaining the API-key option. Treating OAuth as merely another API key would miss
its subscription-specific protocol and billing semantics. Automatic billing
fallback would remove the user's control over which allowance or account is used.

## Consequences

Implementation adds a project-independent setup and credential lifecycle,
subscription transport, offline regressions and explicit human setup pause. Live
account eligibility and model compatibility are verified after that pause. The
same-user Keychain limitation remains disclosed; a separate credential broker and
materially broader protocol/eligibility changes are outside this authorization.
This decision does not change program-claim semantics or governing domain rules.
