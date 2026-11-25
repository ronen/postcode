# Proposed revisions to docs/decisions/internal-application-api.md

Replace the metadata block before the first level-two heading with the following. Preserve all historical body text.

# Establish an internal application API independent of interfaces

Status: partially superseded
Decided: 2026-11-08
Arising from: [Application/interface separation](../plans/application-interface-boundary.md)
Scope: existing application capabilities, their internal client boundary, CLI adaptation and extension policy

Superseded in part:

- [Deliver qualified answers independently of CLI Views](#qualified-content-delivery) is replaced in full by [qualified answers over contributions](qualified-answers-over-contributions.md#qualified-application-access).
- [Preserve typed application attribution and separate client context](#invocation-context), only CLI attachments, parser outcomes and adapter-specific invocation requirements, is replaced by [CLI shell retirement](cli-shell-retirement.md#retire-client).

- [Keep compact binding CLI-scoped and distinguish presentation outcomes](#cli-bindings-and-outcomes), compact allocation, binding ports and private operation scopes; preserve semantic outcome and publication distinctions, is replaced by [CLI shell retirement](cli-shell-retirement.md#precise-references).

- [Preserve runtime, publication and audience guarantees](#runtime-and-publication), CLI worker/finalization and deferred-check composition, CLI outputs and command-shaped feedback/sink implementation; preserve direct validation, credential, resource, audience and publication duties, is replaced by [CLI shell retirement](cli-shell-retirement.md#retire-client).

- [Preserve runtime, publication and audience guarantees](#runtime-and-publication), terminal Session-abort and separate-cleanup obligations are refined by the shared shutdown assessment, is replaced by [CLI shell retirement](cli-shell-retirement.md#terminal-abort).

- [Preserve runtime, publication and audience guarantees](#runtime-and-publication), required current observation/feedback service implementation, with its absence explicitly tracked, is replaced by [CLI shell retirement](cli-shell-retirement.md#research-gap).
