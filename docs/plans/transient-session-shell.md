# Transient interactive session shell

Status: approved
Created: 2026-09-22
Updated: 2026-09-23
Superseded by:

This plan is governed by the [session decisions](../decisions/transient-analysis-sessions.md),
[core concepts](../core-concepts.md), and
[architectural constraints](../architectural-constraints.md).

## Motivation and strongest alternative

The strongest argument against a shell now is that it adds lifecycle complexity
without adding a program-understanding capability. The completed
[performance task](../../records/tasks/2026-09-21-analysis-latency.md)
already reduced ordinary analysis cost through discovery-local digest reuse.
Its [measurements](../../records/validation/2026-09-21-analysis-latency.md)
report fresh PostCode dependency analysis falling from 39.09 to 4.82 seconds and
organization from 39.00 to 4.35 seconds. Those results do not measure session reuse.

The stronger reason to build this slice is accumulating investigation state.
A separately planned summary lens will let an interpreting AI agent produce an
account, follow it with examinations, and potentially augment or supersede that
account using further evidence. This shell establishes the continuing analysis
context that such examinations need, using existing lenses to exercise it first.
This establishes an internal foundation for agent investigations, not access for
an external agent to participate in the same live session. Adaptive investigation
does not inherently require a terminal; this slice exposes the state through a
human-operated shell. It does not implement agent access, interpretation, or
summary supersession semantics.

The one-shot CLI, language analysis, module inventory, inspection, organization,
dependency lenses, qualification, source detail, and observation sink are
established infrastructure. A command loop that merely repeats fresh CLI
invocations would not satisfy this plan.

## Intended outcome

A human opens one configured TypeScript project and navigates existing views
within a transient session. New requests can read additional inputs, materialize
additional results, and reuse applicable completed work. Earlier references stay
bound and earlier evidence and results remain unchanged.

The session replaces the snapshot as the analysis and reference context. The
snapshot model, snapshot-based reference contract, and --snapshot option are
absent from the resulting interface and architecture. A one-shot
invocation becomes a short-lived session. Cross-invocation navigation is not
retained; if later needed, it belongs to session persistence.

Inputs are assumed stable during a session. Best-effort detection of relevant
changes invalidates the session. Tracking an evolving worktree, automatic
refresh, and absolute concurrent-change guarantees are not goals.

## Representative investigation

Use the existing compact dependency journey, with ordinary repository placement,
a shared child, a re-export intermediary, and documented organizational groups
where available. Prefer small fixture extensions to a new all-purpose repository.

1. Open the project and request modules or project organization first.
2. Inspect a displayed module by its precise reference.
3. Request dependency structure. This must exercise additional analysis and, in
   focused coverage, an input not observed by the earlier request.
4. Follow a branch to direct dependency children.
5. Select a shared child and request its direct dependency parents.
6. Inspect the re-export intermediary, using a reference already encountered.
7. Request project and repository organization, inspect a group, and follow its
   subgroup or module references.
8. Revisit an earlier question after additional analysis has completed.
9. Explicitly request bounded source detail where supporting evidence is needed.

The human chooses each next subject from preceding output. Public stdin and
command-file execution are deferred: this is an adaptive investigation, not a
fixed script. Tests may inspect structured results and submit subsequent commands
through the shared command-processing boundary.

The journey needs project context, stable reference bindings, retained evidence,
evaluation outcomes, results, and observation correlation. It does not require an
implicit current module, navigation stack, managed view collection, or workspace.

## Observable success criteria

### Session and analysis

- One configured project is opened for the session; no project switching or
  repository-only fallback is introduced.
- Existing lenses and presentations retain their meaning and bounded coverage.
  Unrelated accumulated work does not change a lens's selected population or
  meaning. Reuse satisfies the request's declared requirements and expansions;
  a projection does not indiscriminately select everything in the session store.
- For current mechanical analyses, equivalent inputs, methods, requirements,
  completed evaluations, and presentation choices produce deterministic semantic
  content, ordering, and presentation, apart from session-local references and
  observation metadata. Identical reference spellings across sessions are not
  required. This does not impose determinism on future interpreting analyses.
- A view request supplies lens requirements and declared standard expansions to
  evaluation. Rendering never requests analysis or reads live source.
- Completed applicable analysis is reused across commands. Missing work can
  acquire new inputs and add qualified results; precomputing every supported
  analysis at startup is not a substitute for supporting this behavior.
- Retained source evidence comes from the captured input used for its claims.
  A newly read file is not represented as known to have had those contents at
  session start.
- Captured evidence, claims, evaluation outcomes, and produced projections remain
  unchanged by later analysis. With unchanged inputs and completed evaluation,
  repeating a current view request produces the same information and qualifications.
  The implementation may reconstruct its projection or presentation without
  implying a different answer or requiring a new product-visible identity.
  If earlier evaluation was incomplete, a later attempt may establish additional
  information while retaining the earlier outcome and projection unchanged.
- Each claim retains its supporting evidence and method context, and each
  projection retains its selected claims and relevant evaluation outcomes.
- The unchanged-input assumption is documented.
  Detection is best-effort across relevant source, configuration, resolution,
  repository, and environment inputs; its actual coverage and limitations are
  documented. An implemented, meaningful detection strategy is required; merely
  documenting that changes may go undetected is insufficient. Verification
  demonstrates detection and invalidation for representative changes within its
  stated coverage and identifies uncovered input classes. No mandatory watcher,
  per-command full-input scan, or exhaustive validation algorithm is prescribed.
- A detected relevant change invalidates the session and prevents further
  investigation. Restarting is the recovery path; no silent reopening occurs.
  If detection occurs during a command before its view is published, that view
  is withheld and invalidation is reported and observed instead. If output has
  already been emitted, the invalidation is reported explicitly and observations
  retain what was actually emitted; output cannot be retroactively withdrawn.

### Selection and presentation

- Bound entity references never rebind or change merely because analysis grows.
  New allocations cannot steal earlier spellings, including on collisions.
- Exact name and generated-handle lookups preserve honest zero/one/many outcomes.
  Lookup ambiguity must not silently choose a subject. If supported additional
  discovery expands a lookup population, a name or handle may acquire further
  matches; help explains this distinction from stable bound references.
- Remove --snapshot and generated next-command text from both shell and one-shot
  surfaces, including structured navigation fields that exist only to carry it.
  Reassess --dependency-context as part of this removal: retire it if no
  independently useful behavior remains beyond reproducing snapshot scope.
- One-shot name/handle queries remain useful without recreating cross-invocation
  ID navigation. A user facing ambiguous one-shot matches opens a shell, repeats
  the lookup, and selects a displayed reference within that session. Help explains
  this recovery path and the lifetime of references; an ID copied from the
  one-shot output does not provide cross-invocation navigation.
- Existing Unicode and experimental JSON view presentations remain available.
  Exact shell syntax, quoting, and selection behavior are implementation choices,
  preserving stable bindings and honest selection cardinality. No separate
  selector-mode UI is required.
- Source disclosure remains explicit. The implementation may use a repeated view
  request with a source-detail option or another simple interaction. The
  disclosed evidence must support the claims shown. Qualification and omission remain visible in each view,
  without relying on earlier output.

### Observations and safety

- Submit self-contained command observations as work occurs rather than holding
  the entire session until exit. Record requests, outcomes, selections, produced
  views, exact output, and actual source disclosure as applicable.
- Include a session identifier and command order in each observation batch.
  Reuse the same session identifier throughout the session, including in a one-shot
  invocation’s batch. Keep each batch interpretable independently of the transient
  store and preceding batches.
- Record command refusal, invalidation, failure, and interruption where possible.
  Do not invent a view or disclosure event when none was produced.
- Sink delivery failure is visible and does not invalidate a successful view.
  Preserve the local private sink and no historical-read behavior.
- Preserve terminal-control escaping for all external values, including command
  input, diagnostics, and status text.
- Enforce generated-output exclusions throughout the session and additional input
  acquisition. Observations are not program evidence or persistence.
- Storing more data does not broaden claims or imply more certainty.

## Command lifecycle

| Event | Behavior |
| --- | --- |
| Shell requested with non-terminal stdin | Report unsupported interactive input and exit without opening a shell; do not interpret piped commands. |
| Initial project-open failure | Report operational failure and exit without opening a shell. |
| Syntax error | Report the command error, leave valid session state intact, and return to the prompt. |
| Zero or multiple name/handle matches | Preserve honest existing selection results; do not choose implicitly. |
| Partial/unavailable analysis with a usable view | Show the qualified result; permit further commands. |
| Expected analysis failure preventing a result | Record the outcome, retain independently usable completed work, and return to the prompt if state is sound. |
| Unexpected defect or broken invariant | Terminate distinctly; do not disguise it as ordinary unavailability. |
| Detected input change | Mark the session invalid, withhold any not-yet-published view from the in-flight command, report and observe invalidation, and require restart. Already emitted output remains recorded as emitted, with explicit invalidation reporting. |
| Interrupt during a command | Interrupt the running work. Ending the session is an allowed fallback; return to the prompt only when completed work and session state can be preserved safely. |
| Interrupt at an idle prompt | Cancel the input line; explicit exit or EOF ends the session. |
| EOF or explicit exit | Finish any already accepted command and its observation submission, then release transient state. |
| Observation delivery failure | Warn and preserve the successful result. |

Cancellation must work on the actual compiler-backed path, not just an asynchronous
test double. Exact exit codes, interrupt handling mechanics, and whether invalidation
immediately exits or leaves a help/exit-only prompt are implementation choices
within these behavioral bounds.
No batch continuation policy is needed in this slice.

## Scope and non-goals

Implement only session lifecycle, incremental accumulation of requested work,
reference binding, interactive command processing, corresponding one-shot changes,
and the observation/documentation/test changes needed to preserve existing contracts.

Exclude persistent sessions, durable caching, a daemon, GUI integration, a public
server protocol, external-agent access to the live session, public stdin/file
execution, scripting variables, new lenses,
summary interpretation, interpretation-revision machinery, new languages,
cross-project aggregation, evolving-worktree tracking, automatic refresh,
workspace management, fuzzy selectors, operating-system command execution, and a
general analysis scheduler.

## Implementation stages and validation

1. Convert one-shot operation to a short-lived session. Replace snapshot-dependent
   record, reference, and schema assumptions while preserving existing lens
   behavior and the ProgramRecordStore/ObservationSink boundaries. Demonstrate
   semantic equivalence and run a small real-compiler interruption experiment
   within this checkpoint, before settling the execution arrangement for
   accumulation and the shell. The experiment must show that running compiler
   work can be interrupted; ending the session is an acceptable fallback and
   worker isolation is not prescribed. Then pause for human-arranged independent
   review before proceeding to accumulation.
2. Add accumulating analysis and stable bindings. Exercise a narrower request
   followed by dependencies acquiring additional inputs; demonstrate completed-work
   reuse, immutable earlier projections, and independence from unrelated work.
3. Add the prompt over shared request execution, with command observations,
   invalidation, and verified interruption behavior.
4. Update runtime documentation and exercise the complete investigation.

Verification includes:

- the representative journey on fixtures and PostCode, with human inspection;
- additional-input acquisition, completed-work reuse, repeated requests, and
  immutability of earlier results and evaluation outcomes;
- reference collision, ambiguous lookup, reserved-looking exact names, and invalid
  references, plus growing name/handle ambiguity where supported discovery can
  expand the lookup population, and the recovery journey from an ambiguous
  one-shot lookup to an in-session lookup and precise selection;
- relevant detected source/configuration/resolution/repository changes, including
  an absent dependency becoming present and a new file entering the configured
  population. Demonstrate detection where the chosen strategy covers these cases
  and explicitly document uncovered cases as limitations of its best-effort
  contract; the examples do not mandate exhaustive detection;
- writing excluded observation output without invalidating its own session;
- detected changes during a command before publication, with no successful view
  emitted, and detection after output has already been emitted, with truthful
  invalidation reporting and observation of the actual output;
- source detail after accumulated work, generated-output exclusion, terminal
  controls, observations, sink failure, non-terminal input refusal, EOF, and
  interruption on the real compiler-backed path;
- equivalent semantic results between one-shot and shell requests and between
  reordered independent requests. Tests control the relevant inputs and compare
  selected populations, relationships, evidence, qualification, omissions, and
  presentation ordering, normalizing only session-local references and observation
  metadata through consistent mappings, not by dropping referenced relationships;
- repeated requests after unrelated analysis, and separate cases where a later
  attempt completes previously incomplete evaluation. No aggregate input-set
  digest or general historical-run comparison feature is required;
- existing semantic fixtures and appropriate type checks and full tests;
- separately measured first-view and follow-up costs, with work-reuse evidence
  and no unstable timing thresholds in ordinary tests.

Follow the development workflow's human-arranged independent review gates.
The one-shot conversion checkpoint above precedes accumulation. Further
intermediate review is proportional to risk; prepare the final integrated review
handoff after verification. Existing
slice validation need not be repeated wholesale absent a changed semantic boundary.

## Risks and open decisions

The compiler-backed path includes synchronous work such as ts.createProgram.
A signal handler on the same blocked event loop may not run until analysis ends.
Interruption must therefore be verified during actual work; ending the session
is an acceptable fallback. Worker isolation or another cancellation mechanism is
an implementation choice, not an architectural prerequisite.


Session growth may increase memory use. This slice need not add eviction or
budgets that silently discard required history; measure representative use and
report a material limit.

Future summary work may need explicit derivation and supersession relationships.
This slice preserves earlier results but must not invent those semantics in
anticipation of that work.

## Documentation

Implementation updates the CLI reference, architecture overview, README, status,
experimental schemas, and affected tests. Review current backlog wording for
obsolete snapshot requirements, preserving descriptions of historical work and
without reprioritizing backlog entries. It also updates implementation
conventions to remove obsolete snapshot and generated-command practices and
document the session practices actually established by the implementation.

Historical completed plans, task records, validation, and review evidence retain
their original terminology; they are not retroactively rewritten.
