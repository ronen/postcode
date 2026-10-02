# Milestone 3: offline hosted-adapter checkpoint

Date: 2026-09-30
Starting revision: `64a4ddb`
Scope: hosted summary integration and credential-setup handoff, before live use.
This is not milestone-3 completion or its independent-review handoff.

## Implemented and checked

OpenAI Responses integration uses the official SDK 7.25.0 (Apache-2.0), pinned in
the lockfile, with `gpt-6-sol`, medium reasoning, standard service, no SDK retries,
no provider/model fallback, no SDK logging, and `store: false`. Each operation has
fresh local history; only subject-based evidence and explicit result submission
functions are supplied. The existing domain coordinator validates every request
and result. Request cancellation reaches SDK transport; remote cessation of work
or billing is not promised.

The shared CLI entry preflights intentional hosted enablement before shell or
one-shot project opening. Disabled use performs no credential lookup. Enabled
use requires macOS and privately retrieved Keychain material, with no environment
key fallback. Preflight verifies local availability only; remote validity and
model/billing access remain runtime checks. The human setup guide discloses that
limit, transmission, charges, provider spending controls, supported platform,
revocation/rotation, and the absence of enforced isolation from same-user agents.
No real Keychain item was read or changed in this checkpoint.

Provider response usage is recorded before terminal outcome classification.
Actual returned model/service tier metadata remains separate from the requested
agent configuration and partitions aggregates. Token totals and input/output,
cache-read/write and reasoning subsets are reported without adding subsets twice.
Missing reports remain unknown. Presentation identity advances to
`postcode/investigation-presentation@4` for this reporting change.

## Offline boundary coverage

Eleven tests in `test/openai-investigator.test.ts` exercise the real SDK through
an injected HTTP transport, without network inference or credentials:

- fixed route, authentication-header confinement, selected model/settings, only
  sanctioned functions, evidence reply mapping and fresh operation history;
- authentication/model access, rate limiting, quota/credit/spending limits, server
  and unrecognized errors, simulated transport failure and request timeout, with
  exactly one HTTP attempt per exchange;
- refusal, truncation, failed responses with usage, malformed JSON and function
  arguments, missing usage and malformed output shapes;
- abort and local close cancelling an in-flight SDK request;
- returned model/tier grouping, category subset relationships and duplicate usage;
- disabled, unsupported, unknown-provider and unavailable/failed credential
  preflight, without real system credential access;
- preflight failure before project opening for shell, mechanical and summary
  invocations;
- quota failure after successful source acquisition, preserved usage and acquired
  evidence, no reusable result and a fresh dialogue on the next request;
- real compiler/worker/CLI shell integration in human and JSON output: source
  acquisition, accepted summary, retained redisplay and subsequent usage without
  extra inference, with observations agreeing;
- synthetic sentinel exclusion from diagnostics, investigator requests, responses,
  views, observations and assessment captures, including echoed provider errors.

Representative provider bodies are constructed test data, not captured live
responses. Synthetic numbers passed through the real adapter are confined to
these tests and are not live measurement or assessment cost evidence. Existing
investigation integration tests continue to cover worker closure windows,
retention taxonomy, interruption, invalidation and late report exclusion.

## Results

- `npm run check`: passed.
- `npm run build` and the final 11-test adapter file: passed (2.69 seconds).
- Earlier focused adapter plus existing integration run: 35 passed before the
  additional malformed-wire regression; the final full run includes it.
- `npm test`: **382 passed, 0 failed, 0 cancelled, 0 skipped**, 128.10 seconds.
  Repository inputs were unchanged during the suite.
- `git diff --check`: passed; changed-document local link targets exist.
- The system `security` help confirms the selected generic-password service/account
  lookup options; no credential lookup was executed.

The separate [ownership diagnosis](2026-09-30-execution-ownership-diagnosis.md)
resolves the deferred pre-live prerequisite by reproducing and correcting the
readiness test defect. Its historical timing/inference limitations remain explicit;
old cancelled runs are not recast as successful suite runs.

## Pending live work and handoff

The [setup guide](../../../docs/hosted-investigation.md) is ready for human
credential configuration, as required by the approved plan. No live inference,
real usage verification, source-reference freezing, formative assessment or
assessment cost reporting has occurred. SDK/provider schema acceptance and model
access still require live verification; offline tests cannot establish them.

After human setup, prepare and commit assessment tooling and source-grounded
references, pin all three fixed subjects, and freeze references before any live
assessment-subject/fixture run. Complete the summary evaluator/assessor pipeline,
baseline and milestone-3 focused cases with usage/cost records before preparing the
independent-review handoff. Include the ownership diagnosis, adapter boundary
changes, setup disclosure and real provider results in that handoff. Milestone 4
remains behind the milestone-3 acceptance gate.
