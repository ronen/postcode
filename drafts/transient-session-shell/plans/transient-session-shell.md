# Transient interactive session shell

Status: in preparation
Created: 2026-09-22

This is a provisional plan, not implementation authorization. Read it with the
[proposed decisions](../decisions/transient-analysis-sessions.md) and the complete
proposed revisions to [core concepts](../docs/core-concepts.md),
[architectural constraints](../docs/architectural-constraints.md), and
[implementation conventions](../docs/implementation-conventions.md).

## Motivation and strongest alternative

The strongest argument against a shell now is that it adds lifecycle complexity
without adding a program-understanding capability. The completed
[performance task](../../../records/tasks/2026-09-21-analysis-latency.md)
already reduced ordinary analysis cost through discovery-local digest reuse.
Its [measurements](../../../records/validation/2026-09-21-analysis-latency.md)
report fresh PostCode dependency analysis falling from 39.09 to 4.82 seconds and
organization from 39.00 to 4.35 seconds. Those results do not measure session reuse.

The stronger reason to build this slice is accumulating investigation state.
A separately planned summary lens will let an interpreting AI agent produce an
account, follow it with examinations, and potentially augment or supersede that
account using further evidence. This shell establishes the continuing analysis
context that such examinations need, using existing lenses to exercise it first.
It does not implement interpretation or define summary supersession semantics.

The one-shot CLI, language analysis, module inventory, inspection, organization,
dependency lenses, qualification, source detail, and observation sink are
established infrastructure. A command loop that merely repeats fresh CLI
invocations would not satisfy this plan.

## Intended outcome

A human opens one configured TypeScript project and navigates existing views
within a transient session. New requests can read additional inputs, materialize
additional results, and reuse applicable completed work. Earlier references stay
bound and earlier evidence and results remain unchanged.

The session replaces the snapshot as the analysis and reference context. Remove
the snapshot model, snapshot-based reference contract, and --snapshot option
rather than hiding them behind an interactive convenience layer. A one-shot
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
- A view request supplies lens requirements and declared standard expansions to
  evaluation. Rendering never requests analysis or reads live source.
- Completed applicable analysis is reused across commands. Missing work can
  acquire new inputs and add qualified results; precomputing every supported
  analysis at startup is not a substitute for supporting this behavior.
- Retained source evidence comes from the captured input used for its claims.
  A newly read file is not represented as known to have had those contents at
  session start.
- Evidence, results, evaluation attempts, and produced projections are retained
  without later mutation. Reuse does not turn an earlier partial result into a
  complete one. A repeated request may produce a new result.
- Session identity is not a hash of the growing observed-input collection.
  Method versions and supporting evidence remain attributable to each result.
- The unchanged-input assumption is disclosed at startup and documented.
  Detection is best-effort across relevant source, configuration, resolution,
  repository, and environment inputs; its actual coverage and limitations are
  documented. No mandatory watcher or exhaustive validation algorithm is prescribed.
- A detected relevant change invalidates the session and prevents further
  investigation. Restarting is the recovery path; no silent reopening occurs.

### Selection and presentation

- Bound entity references never rebind or change merely because analysis grows.
  New allocations cannot steal earlier spellings, including on collisions.
- An unknown precise reference is invalid; it has no other-session interpretation
  and does not fall back to a different selection mechanism.
- Exact name and generated-handle lookups preserve honest zero/one/many outcomes.
  They remain distinct from precise bound references.
- Remove --snapshot and generated next-command text from both shell and one-shot
  surfaces, including structured navigation fields that exist only to carry it.
- One-shot name/handle queries remain useful without recreating cross-invocation
  ID navigation. Help explains the lifetime of references.
- Existing Unicode and experimental JSON view presentations remain available.
  Exact shell syntax, quoting, and selector-mode spelling are implementation
  proposals to review before implementation, not an OS shell execution language.
- Per-command source disclosure remains explicit. Qualification and omission
  remain visible in each view, without relying on earlier output.

### Observations and safety

- Submit self-contained command observations as work occurs rather than holding
  the entire session until exit. Record requests, outcomes, selections, produced
  views, exact output, and actual source disclosure as applicable.
- Correlate commands with their session and order while keeping each batch
  interpretable independently of the transient store and preceding batches.
- Record command refusal, invalidation, failure, and interruption where possible.
  Do not invent a view or disclosure event when none was produced.
- Sink delivery failure is visible and does not invalidate a successful view.
  Preserve the local private sink and no historical-read behavior.
- Preserve terminal-control escaping for all external values, including command
  input, diagnostics, and status text.
- Enforce generated-output exclusions throughout the session and additional input
  acquisition. Observations are not program evidence or persistence.
- Storing more data does not broaden claims or imply more certainty.

## Proposed command lifecycle — for review

These are draft defaults, not additional accepted choices:

| Event | Proposed behavior |
| --- | --- |
| Initial project-open failure | Report operational failure and exit without an investigation view. |
| Syntax error or unknown precise reference | Report the command error, leave valid session state intact, and return to the prompt. |
| Zero or multiple name/handle matches | Preserve honest existing selection results; do not choose implicitly. |
| Partial/unavailable analysis with a usable view | Show the qualified result; permit further commands. |
| Expected analysis failure preventing a result | Record the outcome, retain independently usable completed work, and return to the prompt if state is sound. |
| Unexpected defect or broken invariant | Terminate distinctly; do not disguise it as ordinary unavailability. |
| Detected input change | Mark the session invalid, report restart required, and permit no further investigation commands. |
| Interrupt during a command | Stop the command; preserve safe completed work and return to the prompt only if consistent state can be guaranteed, otherwise end the session. |
| Interrupt at an idle prompt | Cancel the input line; explicit exit or EOF ends the session. |
| EOF or explicit exit | Finish any already accepted command and its observation submission, then release transient state. |
| Observation delivery failure | Warn and preserve the successful result. |

Cancellation must work on the actual compiler-backed path, not just an asynchronous
test double. Exact exit codes, interrupt responsiveness, and whether invalidation
immediately exits or leaves a help/exit-only prompt remain review questions.
No batch continuation policy is needed in this slice.

## Scope and non-goals

Implement only session lifecycle, incremental accumulation of requested work,
reference binding, interactive command processing, corresponding one-shot changes,
and the observation/documentation/test changes needed to preserve existing contracts.

Exclude persistent sessions, durable caching, a daemon, GUI integration, a public
server protocol, public stdin/file execution, scripting variables, new lenses,
summary interpretation, interpretation-revision machinery, new languages,
cross-project aggregation, evolving-worktree tracking, automatic refresh,
workspace management, fuzzy selectors, and a general analysis scheduler.

Retaining immutable records does not require exposing history browsing in the shell.

## Implementation stages and validation

1. Establish session ownership and immutable accumulation beneath the existing
   CLI. Replace snapshot-dependent record and reference assumptions coherently;
   retain ProgramRecordStore and ObservationSink responsibility boundaries.
2. Exercise a narrower request followed by dependencies that acquire additional
   inputs. Demonstrate stable bindings and useful reuse before adding prompt UX.
3. Route interactive and one-shot requests through shared execution, preserving
   existing lenses, views, source disclosure, and error distinctions.
4. Add per-command observations, invalidation, and real interruption behavior.
5. Update runtime documentation and exercise the complete investigation.

Verification includes:

- the representative journey on fixtures and PostCode, with human inspection;
- additional-input acquisition, completed-work reuse, repeated requests, and
  immutability of earlier results and evaluation outcomes;
- reference collision, ambiguous lookup, reserved-looking exact names, and invalid
  references, without cross-session interpretation tests;
- relevant detected source/configuration/resolution/repository changes and
  honest statements of undetected-change limitations;
- source detail after accumulated work, generated-output exclusion, terminal
  controls, observations, sink failure, EOF, and cancellation;
- equivalent semantic results between one-shot and shell requests, allowing
  session-local identity differences while preserving evidence and qualification;
- existing semantic fixtures and appropriate type checks and full tests;
- separately measured first-view and follow-up costs, with work-reuse evidence
  and no unstable timing thresholds in ordinary tests.

Follow the development workflow's human-arranged independent review gates.
Review session/reference/accumulation boundaries before broad integration if their
risk warrants it, then prepare the final integrated review handoff. Existing
slice validation need not be repeated wholesale absent a changed semantic boundary.

## Risks and open decisions

Before implementation authorization, resolve selector-mode syntax/precedence,
the proposed command-lifecycle defaults, and the experimental output/observation
schema transition. One-shot precise IDs have no prior binding; their handling
must not accidentally recreate the removed cross-invocation contract.

Implementation may choose input-change detection, allocation algorithms, retained
compiler mechanics, requirement representation, and cancellation mechanisms.
It must report evidence that those choices cannot meet the agreed behavior.

Session growth may increase memory use. This slice need not add eviction or
budgets that silently discard required history; measure representative use and
report a material limit.

Future summary work may need explicit derivation and supersession relationships.
This slice preserves earlier results but must not invent those semantics in
anticipation of that work.

## Documentation and promotion

The companion decision identifies superseded choices. On human-directed
promotion, update decision supersession metadata and indexes, and promote the
approved core-concept and constraint revisions together. The conventions copy
is proposed future implementation practice; align its canonical adoption with
implementation rather than claiming unimplemented behavior already exists.

Implementation must update the CLI reference, architecture overview, README,
status, experimental schemas, and affected tests. Historical completed plans,
task records, validation, and review evidence retain their original terminology;
they are not retroactively rewritten.

No task record, source modification, or implementation commitment is authorized
by this draft.
