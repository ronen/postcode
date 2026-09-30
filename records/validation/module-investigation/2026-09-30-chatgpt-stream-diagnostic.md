# Subscription stream diagnostic and missing-header correction

Date: 2026-09-30
Authorization: task follow-up `ff3a53d`.
Implementation: the commit containing this record.

## Bound and procedure

The human authorized the proposed diagnostic, requiring only a few requests when
cost is incurred or cannot be determined, followed by another pause. Since the
two earlier connection attempts have unknown consumption, this run used a
conservative bound of **one additional inference request**. No automatic retry,
model/account/billing switch or provider spending-setting change occurred.

After offline checks, the development diagnostic ran once:

```sh
node scripts/module-investigation/diagnose-chatgpt.mjs
```

It invokes the existing connection check using PostCode's parent-only credential
manager. The selected configuration is `gpt-5.6-sol`, medium reasoning,
ChatGPT-plan route. It opens no project and sends only the connection prompt and
tool schemas. A fetch wrapper inspects a clone of the response with a 128 KiB
capture bound and 30-second overall deadline. Only allowlisted structural labels,
field types, event types and numeric token counts leave the process. Raw content,
header values, credentials and arbitrary field names are not emitted or saved.
The clone does not change the response supplied to the adapter.

## Observed result

The [captured diagnostic](2026-09-30-chatgpt-stream-diagnostic.json) records one
inference request, 8,472 ms elapsed including catalog access, HTTP 200, absent
content type and request ID, and 37,995 captured bytes with a complete read.
The body was an event stream, with created/in-progress, output-item, function-call
argument and completed events. The completed response matched `gpt-5.6-sol` and
reported:

| Measure | Provider-reported tokens |
| --- | ---: |
| Input | 808 |
| Output | 86 |
| Total (includes input and output) | 894 |

These are connection-diagnostic usage, not investigator-assessment or evaluator
usage. The diagnostic retained these three counts; token subsets were not
captured. Actual monetary charges and included-allowance versus optional-credit
funding remain unknown. Failure at the client does not imply no consumption or
billing. The earlier two attempts still have unknown consumption; this result
does not retrospectively establish their usage or response contents.

The production adapter rejected the missing content type before consuming events,
so its check remained unsuccessful and its normal usage callback received no
report. The diagnostic clone established completed inference and exposed the
usage despite that client rejection. This is evidence that the selected
model/medium request can reach completed inference through the selected route;
it is not evidence of a validated PostCode submission or sufficient quality.

## Correction and remaining uncertainty

The adapter now permits an absent content type and parses the requested SSE
stream. An explicitly incompatible type still fails. Framing, terminal status,
whole-result submission and domain validation remain required; missing headers
do not turn JSON, HTML, EOF or partial output into an accepted result. Offline
regressions verify accepted framed completion, failed/incomplete usage, empty
terminal output, partial events and non-SSE JSON with absent headers.

The same diagnostic exposes a separate issue: the terminal response's `output`
was an **empty array**, despite earlier function-call and output-item events.
The original capture intentionally omitted item contents, so the function name,
namespace, call ID and argument structure are not established. No result was
reconstructed or accepted from those earlier events. Header tolerance alone is
not sufficient to clear the connection check, and no live check of that correction
has been run.

The [official subscription inference guide](https://developers.openai.com/siwc/token-sharing-open-source/models-and-inference)
and [streaming guide](https://developers.openai.com/api/docs/guides/streaming-responses)
were rechecked. The installed official SDK's response accumulator replaces its
snapshot on lifecycle events, including completion; it does not establish that
an empty terminal output should be replaced by earlier items. Whether this is a
provider/intermediary representation issue, and what the earlier item events
contain, remain unresolved. Do not silently introduce reconstruction assumptions.

The committed diagnostic now also supports allowlisted output-item kind, known
function name, namespace-match and call-ID-presence booleans, argument JSON type
and numeric output index. This additional instrumentation was tested offline
after the captured run; **it has not been run live**. It provides a concrete next
diagnostic if authorized without exposing argument content or arbitrary strings.

## Verification and disposition

- Before the live diagnostic: type check/build and 11 diagnostic/subscription
  regressions passed, zero failures/cancellations/skips (0.88 seconds).
- After the header correction: type check/build and **25 diagnostic, subscription,
  API-key and shared CLI tests passed**, zero failures/cancellations/skips (6.26
  seconds). Credential exclusion, usage, cancellation and both output modes remain
  covered. Additional item-structure instrumentation passed type check/build and
  all three diagnostic tests separately (0.50 seconds). `git diff --check` passed.
- The full suite was not rerun for this bounded correction; the previous 412-test
  pass remains historical evidence.
- Documentation and current status distinguish completed provider inference from
  unsuccessful PostCode submission. No assessment subject or evaluator was run.

Pause further inference as directed: there have now been three connection
inference attempts, one with known token usage and two with unknown consumption.
Propose at most one further targeted diagnostic of output-item structure, followed
by another report, before choosing a transport correction. This is a request for
human direction, not another issued request. Carry usage, the header correction,
empty terminal output and limits of the captured evidence into the milestone-3
handoff. The task remains active; assessments and milestone review remain pending.
