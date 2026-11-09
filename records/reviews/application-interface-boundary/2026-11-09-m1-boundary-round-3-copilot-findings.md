Record type: findings
Received: 2026-11-09
Reviewer: GitHub Copilot
Handoff: [M1 application boundary review](2026-11-09-m1-boundary-handoff.md)
Round: 3 (Copilot review on PR #13)
Reviewed target: `9b1446614d54a764ef50d2860be54652f49826ed`
Prior findings: [Round 2](2026-11-09-m1-boundary-round-2-findings.md)
Prior reviewed target: `67e3818cbdbeb7156e6426115aaed337a4e2b6e6`

## Retrieval metadata

Retrieved with `gh api --paginate --slurp` from all pages of `repos/ronen/postcode/pulls/13/reviews`, `pulls/13/comments`, and `issues/13/comments`. The endpoints returned one review submission, two inline annotations, and zero conversation comments. All returned review components are preserved below with their bodies unchanged; there was no filtering or redaction. Labels and metadata are repository-authored. The review targets the PR diff at the exact commit above; the intervening commits since round 2 change records only. Copilot does not report executed verification or confirm that it followed the repository handoff. Its stated effort and recommendation are preserved in the review body.

## Retrieved findings

### Review submission 5824285917

Author: copilot-pull-request-reviewer[bot]
Source: https://github.com/ronen/postcode/pull/13#pullrequestreview-5824285917
Submitted: 2026-11-09T10:03:10Z
State: COMMENTED

<!-- ccr-overview-v2 -->

### 🟡 Changes recommended

Supported raw organization requests can fail unexpectedly, and closing a session during completion can trigger a TypeError instead of the typed SessionClosed outcome.

<details open>
<summary><strong>2 open issues</strong></summary>

- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.png" alt="Medium severity" width="62" height="18" align="texttop"></picture> [Allow raw organization requests without Presentation group details](https://github.com/ronen/postcode/pull/13#discussion_r4511492976) · New
- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.png" alt="Medium severity" width="62" height="18" align="texttop"></picture> [Return SessionClosed if the session closes during perform](https://github.com/ronen/postcode/pull/13#discussion_r4511493065) · New
</details>

<details>
<summary><strong>What changed in this PR</strong></summary>

Implements the M1 application boundary, separating semantic execution and retained content from CLI presentation while preserving existing output and reference allocation behavior.

**Changes:**
- Adds an internal application API with captured requests, complete selected content, exact retrieval, and typed lifecycle outcomes.
- Routes both CLI hosts through a shared adapter, separates presentation provenance, and keeps local publication checks within one operation scope.
- Adds boundary and compatibility tests, comparison scripts, and implementation/review records; broader service and script migration remains deferred.

| File | Description |
| ---- | ----------- |
| `test/​work-attribution.test.ts` | Migrates attribution tests to CLI adapters. |
| `test/​subject-resolution.test.ts` | Uses the shared CLI adapter. |
| `test/​session.test.ts` | Exercises sessions through the CLI adapter. |
| `test/​session-inputs.test.ts` | Separates direct execution and publication checks. |
| `test/​retained-presentation.test.ts` | Migrates retained-answer tests to the adapter. |
| `test/​request-model.test.ts` | Selects appropriate CLI hosts for request tests. |
| `test/​request-designation-input.test.ts` | Migrates designation tests to the adapter. |
| `test/​projection-content.test.ts` | Checks client-owned presentation identity. |
| `test/​presentation-compatibility.test.ts` | Uses the shared CLI adapter. |
| `test/​output-boundary.test.ts` | Migrates output-boundary session imports. |
| `test/​openai-investigator.test.ts` | Uses the adapter for investigation sessions. |
| `test/​method-provenance.test.ts` | Tests independent application and presentation identities. |
| `test/​lens-extensions.test.ts` | Migrates extension tests to the adapter. |
| `test/​investigation-integration.test.ts` | Migrates investigation session entry points. |
| `test/​human-output.test.ts` | Tests rendered output through the adapter. |
| `test/​exports-lens.test.ts` | Updates adapter and presentation-method references. |
| `test/​execution-ownership.test.ts` | Migrates lifecycle tests to the adapter. |
| `test/​compiler-candidate-paths.test.ts` | Updates session imports for compiler-input tests. |
| `test/​collection-selection.test.ts` | Uses the adapter for selection tests. |
| `test/​application-lifecycle.test.ts` | Covers capture, lifecycle, bindings, and partial content. |
| `test/​application-exact-compatibility.test.ts` | Covers retained support, fallbacks, and continuations. |
| `test/​application-cli-outcomes.test.ts` | Tests command outcomes and scoped publication races. |
| `test/​application-boundary.test.ts` | Tests complete direct content and dependency isolation. |
| `test/​answer-identity.test.ts` | Migrates answer-identity tests to the adapter. |
| `src/​lib/​work-attribution.ts` | Separates semantic requests from invocation attachments. |
| `src/​lib/​subject-resolution.ts` | Imports application-owned lens types. |
| `src/​lib/​session.ts` | Becomes a transitional CLI-adapter forwarder. |
| `src/​lib/​session-worker.ts` | Uses the worker CLI adapter. |
| `src/​lib/​session-protocol.ts` | Derives protocol types from the adapter. |
| `src/​lib/​requests.ts` | Shares semantic capture and validation logic. |
| `src/​lib/​request-reporting.ts` | Reuses application resolution information types. |
| `src/​lib/​request-catalog.ts` | Delegates semantic catalog validation. |
| `src/​lib/​presentation.ts` | Uses client-owned presentation methods. |
| `src/​lib/​presentation-contracts.ts` | Reuses application content validation. |
| `src/​lib/​organization/​presentation.ts` | Separates presentation provenance from application identity. |
| `src/​lib/​mechanical-implementations.ts` | Uses application request and content contracts. |
| `src/​lib/​investigation/​selection.ts` | Uses application-owned lens definitions. |
| `src/​lib/​investigation/​presentation.ts` | Uses client-owned investigation presentation methods. |
| `src/​lib/​investigation/​associations.ts` | Updates association presentation provenance. |
| `src/​lib/​interfaces/​cli/​methods.ts` | Defines presentation methods and artifact provenance. |
| `src/​lib/​interfaces/​cli/​application.ts` | Adds shared arrangement and publication adapter. |
| `src/​lib/​interactive-session.ts` | Updates adapter types and deferred validation flow. |
| `src/​lib/​identity.ts` | Removes presentation methods from application capture. |
| `src/​lib/​exports/​presentation.ts` | Uses client-owned exports presentation provenance. |
| `src/​lib/​execution-errors.ts` | Adds typed concurrent-session refusal. |
| `src/​lib/​dependencies/​presentation.ts` | Uses client-owned presentation identity. |
| `src/​lib/​commands.ts` | Imports request types from the CLI adapter. |
| `src/​lib/​command-execution.ts` | Delegates local publication or uses shared guards. |
| `src/​lib/​application/​session.ts` | Owns application lifecycle and operation coordination. |
| `src/​lib/​application/​retained.ts` | Resolves exact answers from fixed support. |
| `src/​lib/​application/​requests.ts` | Defines and captures semantic requests. |
| `src/​lib/​application/​reports.ts` | Defines interface-neutral resolution information. |
| `src/​lib/​application/​publication.ts` | Adds typed pre/post-output validity outcomes. |
| `src/​lib/​application/​operation-scope.ts` | Defines trusted operation-scoped host integration. |
| `src/​lib/​application/​lenses.ts` | Houses semantic lens definitions and types. |
| `src/​lib/​application/​input.ts` | Validates safe structured-data representation. |
| `src/​lib/​application/​index.ts` | Exposes the internal application entry point. |
| `src/​lib/​application/​executor.ts` | Coordinates semantic execution and answer delivery. |
| `src/​lib/​application/​contracts.ts` | Defines application delivery and lifecycle contracts. |
| `src/​lib/​application/​content.ts` | Defines qualified content and materialization validation. |
| `src/​lib/​application/​consumption.ts` | Matches declared consumption requirements and fallbacks. |
| `src/​lib/​application/​catalog.ts` | Captures and validates application declarations. |
| `src/​lib/​application/​bindings.ts` | Preserves coordinated reference allocation order. |
| `scripts/​compare-application-journey.mjs` | Compares retained journeys and allocation traces. |
| `scripts/​compare-application-boundary.mjs` | Compares CLI output, reports, and provenance. |
| `records/​validation/​application-interface-boundary/​provenance-checkpoint.md` | Records method-separation verification. |
| `records/​validation/​application-interface-boundary/​consumer-inventory.md` | Documents consumers and allocation schedules. |
| `records/​validation/​application-interface-boundary/​boundary-checkpoint.md` | Records boundary verification and remaining scope. |
| `records/​validation/​application-interface-boundary/​baseline-source-consumers.txt` | Captures baseline source consumers. |
| `records/​validation/​application-interface-boundary/​baseline-script-imports.txt` | Captures baseline script dependencies. |
| `records/​validation/​application-interface-boundary/​baseline-binding-sites.txt` | Captures baseline reference allocation sites. |
| `records/​tasks/​2026-11-08-application-interface-boundary.md` | Records implementation, corrections, and verification. |
| `records/​reviews/​application-interface-boundary/​2026-11-09-m1-boundary-round-2-findings.md` | Preserves correction-review results. |
| `records/​reviews/​application-interface-boundary/​2026-11-09-m1-boundary-round-1-findings.md` | Preserves initial review findings. |
| `records/​reviews/​application-interface-boundary/​2026-11-09-m1-boundary-handoff.md` | Documents review scope and handoff evidence. |
| `records/​reviews/​application-interface-boundary/​2026-11-09-m1-boundary-disposition.md` | Records finding resolutions and pending human gate. |
| `docs/​architecture/​README.md` | Documents the application entry and CLI boundary. |
</details>

<sub>Review effort: Balanced</sub>

### Inline annotation 4511492976

Author: Copilot
Source: https://github.com/ronen/postcode/pull/13#discussion_r4511492976
Location: `src/lib/application/executor.ts:147` (RIGHT)
Review ID: 5824285917
Created: 2026-11-09T10:03:09Z

A direct `organization` request with `requirements: { modules: [], groups: [] }` passes `supportedRequirements`, but this construction path calls `resolveOrganizationProjection`, whose guard in `organization/content.ts` throws `Organization presentation requires evaluated group-details`. The new API therefore rejects a supported subset with an exception and `defect` work status, even though no Presentation was requested. Separate raw organization-content resolution from the Presentation-only `group-details` requirement so this request, and subsequent raw exact retrieval, can return the fixed subset without acquiring extra detail.

### Inline annotation 4511493065

Author: Copilot
Source: https://github.com/ronen/postcode/pull/13#discussion_r4511493065
Location: `src/lib/application/session.ts:137` (RIGHT)
Review ID: 5824285917
Created: 2026-11-09T10:03:10Z

If the host closes the session from the `onWork` finish callback, `close()` clears `state` while `perform()` is completing. This continuation then dereferences `state!.store` for an investigation answer and throws a `TypeError` instead of the typed `SessionClosed` outcome, even though application work is already completed. Recheck `allowed()` after awaiting `perform()` and before accessing state, as the scoped `check()` does after its await.

