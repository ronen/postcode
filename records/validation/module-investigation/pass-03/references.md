# Frozen source-grounded references — summary pass 01

Prepared before any subject/fixture inference by the implementing agent. Exact
model identifier is unavailable; the family is OpenAI. Shared implementation,
reference selection and orchestration can bias judgments. These are purposeful
development examples, not an unbiased or untouched validation set. This material
must not be supplied to the investigator or view-only evaluators.

The [manifest](manifest.json) fixes revisions, source/document/configuration hashes,
Node 22.13.1, the **PostCode analyzer TypeScript 6.0.3**, and the selected hosted
configuration. Installed subject build TypeScript versions do not replace that
analyzer. Repository source, README and ordinary subject-based evidence are
accessible; reference answers, selection rationale and this file are not.
PostCode source inspection is not execution or proof of runtime guarantees.

## Cockatiel: Executor

Source pin: [Executor.ts](https://github.com/connor4312/cockatiel/blob/80b5ed67966dfcc5410a912285fcb3eeb2dc5e5e/src/common/Executor.ts).
Original `tsconfig.json`; selector `executor`. Mechanical inventory materializes
its exports `ExecuteWrapper`, `FailureOrSuccess`, and `returnOrThrow`. Its source
mapping and qualification are compiler-derived, not a behavioral proof.

Supported source conclusions:

- Lines 45–75 invoke supplied work once, await its return, and classify the value
  or thrown error using supplied filters. A value matching the result filter is
  returned as `{value}`; a nonmatching value as `{success}`. Handled errors become
  `{error}`; unhandled errors are rethrown.
- Lines 19–28 and 49–68 measure duration only when event listeners are present;
  success/failure notifications are emitted through delegated event emitters.
- Lines 30–43 expose two listener interfaces; cloning reuses filter functions but
  creates a fresh wrapper and emitters. This is not a clone of caller work/state.
- Lines 6–16 convert the tagged result into a return value or throw. A result
  classified as failure by value can still be returned by this helper.
- [RetryPolicy.ts lines 100–140](https://github.com/connor4312/cockatiel/blob/80b5ed67966dfcc5410a912285fcb3eeb2dc5e5e/src/RetryPolicy.ts#L100)
  supplies the retry loop around this executor. Do not attribute retry/backoff,
  the caller's business operation or generic fault tolerance to this file alone.

Acceptable interpretation: a reusable boundary for invoking, classifying and
observing caller-supplied work, used by surrounding resilience policies.
Material limits: no runtime test was performed; caller operations/filters can do
arbitrary work. Listener exceptions and filter exceptions can affect execution;
the broad try/catch also encloses successful-value classification and notification.
Do not claim that only exceptions from `fn` are handled or that all callbacks are
safe. The library README's policy descriptions are attributed context, not proof
that this module itself implements every policy.

## fsm-engine: runtime engine

Source pin: [fsm-engine.ts](https://github.com/thingts/fsm-engine/blob/0bd7bb2cc9df14a1b599fb2748e5daf10169f513/src/fsm-engine.ts).
Original `tsconfig.json`; selector `fsm-engine`. Mechanical inventory materializes
`FsmEngine` and `FsmEngineFactory`. Normal evidence can reach DSL implementation,
timer registry, types, errors and the root README; these were not injected as
expected answers.

Supported source conclusions:

- Lines 119–135 build, validate and compile a definition via `FsmBuilderImpl`,
  returning a factory. Instances share the definition but own runtime state,
  queue, timers and caller-supplied context; context is not deep-copied.
- Lines 184–222 enqueue all dispatches. Reentrant calls return after enqueuing;
  the outer call drains FIFO synchronously. Exceptions clear queued work and
  reset the dispatching flag; this does not undo actions already run.
- Lines 241–266 run state-specific begin actions and try transitions, then
  fallback begins/transitions. If there are transition candidates but none match,
  the event is treated as an implicit stay. Absent handling produces an error.
- Lines 271–313 choose the first transition whose guards all pass. External
  transitions run exit actions, transition actions, commit state, then entry
  actions. Internal transitions run actions without exit/entry or a state change.
  The inline comment implying state is committed first is not the actual order.
- Lines 366–376 provide action-facing dispatch and timer operations; scheduling
  is delegated to `TimerRegistry`. Optional tracing records event/guard/action
  progression but is not the transition-selection mechanism.

Acceptable interpretation: synchronous typed state-machine execution with ordered
guard/action handling, queued reentrant events, fallback handling, timers and
tracing. Material limits: no subject test execution; caller guards/actions are
unconstrained functions, and queued execution is not thread-safety or rollback.
Do not generalize the README's broad safety claim beyond established control flow.
The timer payload expression at line 371 is suspicious (a present payload selects
an empty argument array); references do not establish correct payload forwarding.
A summary need not audit every defect, but must not assert that guarantee as proven.

## merge-anything: public entry and delegated merging

Source pin: [index.ts](https://github.com/mesqueeb/merge-anything/blob/bc7c79fe8fce89ed3350d7b3bdf7cdd1a7633906/src/index.ts).
Selector `anonymous`, verified to select the public forwarding entry; conceptual
handle is not a source path. The entry re-exports `extensions.ts` and `merge.ts`.
The summary must follow delegation to explain functionality rather than stop at
the fact that this file is a barrel.

The human-approved effective configuration is the exact
[override](merge-anything-override.json), beside the unchanged original config,
extending it and setting only `ignoreDeprecations: "6.0"`. The inherited package
is `@cycraft/tsconfig` 0.1.2, pinned by the repository lockfile and hashed in the
manifest. Use this configuration and TypeScript 6.0.3 consistently throughout all
assessment runs; attribute results to them, not to an unmodified-config run.
The original config fails opening on deprecation diagnostics. The override was
mechanically verified to open, not asserted equivalent by unperformed testing.

Supported source conclusions from
[merge.ts](https://github.com/mesqueeb/merge-anything/blob/bc7c79fe8fce89ed3350d7b3bdf7cdd1a7633906/src/merge.ts):

- Lines 39–94 merge plain-object properties recursively, with plain-object and
  symbol classification delegated to `is-what`. A non-plain newcomer replaces
  the current value. Prior own properties absent from the newcomer are retained.
- Own string and symbol properties are considered; `__proto__` is skipped. This
  is specific source behavior, not a general security certification.
- Lines 19–36 preserve enumerability when assigning values but do not preserve
  every original descriptor or avoid evaluating getters.
- Lines 101–124 fold inputs in order through the common implementation. Ordinary
  merge replaces arrays; merge-and-compare applies a supplied comparison function;
  merge-and-concat uses the array-concatenation helper when both values are arrays.
- `extensions.ts` delegates array recognition to `is-what` and otherwise returns
  the newcomer. Type utilities describe compile-time result shape, not runtime work.

Acceptable interpretation: an entry exposing related merge strategies sharing
recursive plain-object handling and replacement rules, with configurable comparison
or array concatenation. Material limits: no subject execution; external predicate
implementation is not established here. It is not a general deep clone: references
can be retained, non-plain inputs can be returned directly, and zero extra inputs
return the original. The README's always-new-object wording is broader than that
source supports. Do not claim circular-input handling, rollback or general safety.

## Controlled focused cases

The fixture source and README live under `fixtures/module-investigation-assessment`
and are hashed in the manifest. Before running, copy them unchanged into a small
isolated Git repository; record its commit and effective project path. No other
repository context should be accessible. No earlier interpretation is injected.

- `entry.ts` delegates to two distinct operations: numeric clamping in
  `normalize.ts`, and a module-scoped incrementing counter in `counter.ts`.
  The deliberately authored README describes all exports as pure/stateless and
  deterministic for the same arguments. The counter contradicts that assertion.
  A useful summary distinguishes the two responsibilities and reports the
  attributed documentation conflict without inventing one business purpose.
- `opaque.ts` invokes a supplied callback once and returns its value. No caller
  implementation or business purpose is present. This tests whether further
  investigation stops with a disclosed gap instead of inventing behavior or
  repeatedly searching irrelevant material.
- A separate hard-limit control uses the same opaque subject with an explicitly
  recorded tiny character guard. It is controlled execution containment, not a
  finding about model quality or an exhausted financial allowance. Zero provider
  calls in that control must be reported as such if the guard stops before a call.

## Assessment procedure and limitations

Freeze the exact [instructions](instructions.json), general context-selection code
hashes, model and route before inference. Keep production evidence access and
guards unchanged except the labelled hard-limit control. No reference answers
enter live context. The first pass has zero automatic repeat allowance; a
diagnostic rerun requires a separately recorded question/count and preserves the
original outcome. Administrative request-ceiling interruption is incomplete
validation, not a semantic failure or hard milestone failure.

Use the fixed `scripts/module-investigation/questions.json` for fresh view-only
evaluators and `assessor-rubric.json` for separate fresh source-informed assessment.
Retain exact prompts, inputs, outputs and available role configuration/usage.
Unknown role usage is not zero. Fresh contexts and same-family agents do not
establish independent corroboration. Per-subject results and focused cases stay
separate; no universal acceptance score or prompt optimization search is intended.
