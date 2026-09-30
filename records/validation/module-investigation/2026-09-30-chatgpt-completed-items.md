# Completed stream items and successful ChatGPT connection

Date: 2026-09-30
Authorization: `5052825` permits up to ten additional requests; `d2cb79c` clarifies
that reaching the ceiling requires pausing and reporting, not milestone failure.
Implementation: the commit containing this record.

## Request accounting

Every attempted inference counts, including failures and unknown usage. Two of
the new ten-request allowance have been used; **eight remain**. Model and route
are fixed at `gpt-5.6-sol`, medium, ChatGPT plan. No purchases, spending-setting
changes, API-key fallback, model changes or automatic inference retries occurred.

| Allowance request | Purpose | Result | Input / output / total tokens | Elapsed including catalog |
| --- | --- | --- | --- | --- |
| 1 | Inspect completed function-item structure | Completed provider inference; client check had empty terminal output | 808 / 65 / 873 | 5,366 ms |
| 2 | Verify finalized-item handling | **Connection check succeeded** | 808 / 84 / 892 | 6,276 ms |

Exact credential-safe structural captures are retained as
[request 1](2026-09-30-chatgpt-allowance-01.json) and
[request 2](2026-09-30-chatgpt-allowance-02.json). Both used the committed
development diagnostic, the same connection prompt, PostCode credentials and
the production adapter. No assessment source was sent. Within this allowance,
reported tokens total **1,765** (1,616 input and 149 output). These are connection
diagnostic counts, separate from investigator/evaluator assessment usage.

Across all five connection inference attempts so far, three have reported
2,659 tokens in total and two have unknown consumption. Actual monetary charges
and included-allowance versus purchased-credit funding remain unknown. The
diagnostic retains input/output/total counts, not all provider token subsets.
No received usage or client failure is treated as zero cost.

## Evidence and correction

Request 1 confirmed an added function item at index 0 followed by one done item
at the same index. The finalized item named `submit_investigram`, matched namespace
`postcode`, had a nonempty call ID and JSON-object arguments. A successful
completed terminal followed, reporting the selected model and an empty output
array. This resolved the structural uncertainty left by the earlier diagnostic.

The [official function-calling guide](https://developers.openai.com/api/docs/guides/function-calling)
describes assembling function calls from indexed streaming events and shows the
finalized call in `response.output_item.done`. The
[subscription guide](https://developers.openai.com/siwc/token-sharing-open-source/models-and-inference)
requires successful terminal completion before inference success. Combining those
requirements supports collecting completed items while retaining the terminal
gate; the convenience SDK's terminal snapshot replacement is not the only way to
consume the documented event stream.

When a completed terminal has empty output, the adapter now resolves finalized
items only if there is one created response with matching terminal identity,
contiguous added indices, exactly one matching done item for every added item,
and consistent kind, ID, call ID, name and namespace. Explicit event response IDs
must agree. Missing, duplicated or mismatched events remain unaccepted. Deltas
alone are never executable arguments. Nonempty terminal output remains authoritative.
Failed/incomplete terminals, EOF and cancellation cannot promote provisional items.
The resolved items then pass through existing tool and domain validation.

Captures preserve the raw sanitized terminal envelope separately from resolved
`streamOutput`, so inspection does not falsely imply the provider repeated items
in the terminal. Reconstructed local output also preserves reasoning items needed
for evidence-tool continuation. Adapter provenance advances to
`postcode/chatgpt-responses@2`; model/reasoning/billing are unchanged. Request 2
verified the corrected behavior before this provenance-only version increment.

## Verification

- Type checking and build passed.
- 26 focused diagnostic, ChatGPT/API transport and shared CLI tests passed, zero
  failures/cancellations/skips (5.53 seconds). Both Unicode and JSON CLI cases now
  use headerless, item-based subscription streams with empty terminal envelopes,
  exercising source acquisition, continuation, validated submission, retention,
  command/session usage and credential exclusion through the worker boundary.
- Full `npm test` with required loopback access: **417 passed**, zero failures,
  cancellations or skips, 156.90 seconds. Repository inputs were unchanged during
  the suite. Tests use synthetic credentials and offline provider responses.
- `git diff --check` passed.
- Live request 2 confirmed the selected model/medium streaming tool connection.
  This is not a source-based assessment or proof of interpretive usefulness.

The task remains active. The connection obstacle is resolved; preparation and
execution of the planned assessments and milestone review remain. Preserve all
earlier failed attempts and their unknown usage in the milestone handoff.

## Assessment acquisition and configuration proposal

The three approved source repositories were acquired at these fixed revisions:

| Repository | Revision | Intended subject |
| --- | --- | --- |
| [Cockatiel](https://github.com/connor4312/cockatiel/tree/80b5ed67966dfcc5410a912285fcb3eeb2dc5e5e) | `80b5ed67966dfcc5410a912285fcb3eeb2dc5e5e` | `src/common/Executor.ts` |
| [fsm-engine](https://github.com/thingts/fsm-engine/tree/0bd7bb2cc9df14a1b599fb2748e5daf10169f513) | `0bd7bb2cc9df14a1b599fb2748e5daf10169f513` | `src/fsm-engine.ts` |
| [merge-anything](https://github.com/mesqueeb/merge-anything/tree/bc7c79fe8fce89ed3350d7b3bdf7cdd1a7633906) | `bc7c79fe8fce89ed3350d7b3bdf7cdd1a7633906` | `src/index.ts`, with forwarding/delegated implementation accessible |

Dependencies were installed from each lockfile with lifecycle scripts disabled:
`npm ci --ignore-scripts --no-audit --no-fund` for Cockatiel and fsm-engine, and
the declared pnpm 11.28.3 with `install --ignore-scripts --frozen-lockfile` for
merge-anything. Initial invocations from clone directories selected a broken
system Node 25 executable (missing llhttp dylib); invoking package managers from
the PostCode checkout used working Node 22.13.1 and succeeded. No host runtime
repair or repository source change was made. All tracked subject files remain
unchanged. These installation commands made no inference requests.

Mechanical inventory through original `tsconfig.json` succeeds for Cockatiel and
fsm-engine. Merge-anything's inherited configuration fails opening with TypeScript
6.0.3 deprecation diagnostics for `baseUrl` and `downlevelIteration`. Its intended
module source is still TypeScript; the obstacle is configuration compatibility.

The following proposed additional configuration was prepared and verified with
hosted investigation disabled:

```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": { "ignoreDeprecations": "6.0" }
}
```

With that assessment-only file beside the original configuration, inventory
succeeds. It suppresses deprecation errors while retaining inherited analysis
options and source selection. It does not modify source or the original config.
No inference has used this proposal. The approved plan requires human choice
when a fixed subject cannot be exercised in the supported configured-project
scope, so request authorization before adopting the override for assessment.
Source-grounded reference material and the prompt/context freeze are not yet
complete; acquisition and compatibility checks do not substitute for that gate.
No baseline/focused assessment or evaluator has been run.
