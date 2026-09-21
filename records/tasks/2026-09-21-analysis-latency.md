# Investigate and reduce analysis latency

Status: active
Opened: 2026-09-21
Closed:

## Task

# Investigate and reduce analysis latency

Investigate the high fresh-invocation latency observed in the completed
repository-organization and module-dependencies slices, then implement the
smallest coherent optimization supported by the measurements.

Begin with a reproducible baseline and profile the complete user-visible path,
including project opening, repository evidence capture, TypeScript analysis,
expansion materialization, dependency and organization derivation, projection and
view construction, rendering, and observation submission. Use PostCode as the
primary subject and at least one smaller existing fixture or previously exercised
external project to distinguish fixed costs from scale-dependent costs. Account
for warm-up, repeated runs, and material outliers rather than relying on one
timing. Treat laptop sleep, process suspension, substantial contention or
throttling, and unusually long wall-clock runs as possible measurement
contamination. Detect suspension where practical by recording both wall-clock
and monotonic elapsed time and relevant run conditions; mark contaminated or
timed-out runs separately and repeat them rather than including them in
representative aggregates. Preserve anomalous observations and their disposition
instead of silently deleting inconvenient results.

Use the evidence to identify the dominant costs and implement one or more bounded
improvements that materially reduce ordinary investigation latency. Prefer
removing redundant work, avoiding accidental repeated analysis, or reusing valid
work within an invocation before introducing a broader lifecycle. An in-process
investigation session or another bounded reuse mechanism is in scope if the
measurements justify it and its validity boundary can be stated precisely.

Do not introduce durable cross-process caching, a background daemon, a general
incremental-analysis framework, partial-discovery semantics, or a new public
server protocol without pausing for explicit human direction. Do not weaken
snapshot identity, changed-input invalidation, provider completeness,
qualification, deterministic results, source-detail behavior, generated-output
exclusion, observation recording, or the distinction between previously computed
information and evidence established for the current investigation. If no safe,
bounded optimization can produce a meaningful improvement, preserve the
investigation evidence and pause for human direction rather than expanding the
architecture speculatively.

Verify semantic equivalence with the existing automated suite and focused checks
of module inventory, repository organization, dependency structure, focused
navigation, source detail, structured output, and observations. Add targeted
regression coverage for any optimized boundary where stale, incomplete, or
duplicated information could otherwise be returned. Measure the resulting
end-to-end behavior using the same baseline conditions and report both absolute
times and relative improvement, along with remaining bottlenecks and limits. Do
not turn unstable timing thresholds into ordinary unit tests.

Update implemented architecture, user-facing documentation, status, and the
performance backlog entry as required by the resulting behavior. Keep the task
focused on investigation latency; do not add new product lenses, visual UI,
dependency-landscape behavior, or interpretive summary features.

## Follow-ups

### Review follow-up — 2026-09-21

> Claude's review is complete.  Take a look; no actionable findings that I can see

> but don't close the task, that will wait for PR & copilot review

The supplied review is preserved in the
[round-1 findings](../reviews/analysis-latency/2026-09-21-integrated-round-1-findings.md).
Task closure remains deferred pending PR and Copilot review.

### PR review follow-up — 2026-09-21

> ok, now open the PR, with handoff instructions for Copilot to do its review

### Copilot findings follow-up — 2026-09-21

> Copilot's review is complete.  Please fetch and preserve the review as per dev/review\.md.   Assess and record a disposition for every finding. Act on findings whose resolution is clear and within the authorized scope. Ask me before rejecting or materially qualifying a finding, choosing between consequential alternatives, expanding scope, or proceeding where the reviewer identifies unresolved uncertainty.

## Outcome

## Verification
