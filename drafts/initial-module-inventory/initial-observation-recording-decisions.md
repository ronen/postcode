# Initial observation recording decisions

Status: accepted
Decided: 2026-09-10
Arising from: [Initial module inventory plan](../plans/initial-module-inventory-plan.md)
Scope: formative observation production in the initial PostCode slice
Supersedes:
Superseded in part:
Superseded by:

## Context

The adopted product design requires PostCode to support formative observation of
normal use, including requested lenses and presentations, resulting views,
navigation, analysis outcomes, failures, and source escape-hatch use. The first
CLI slice has no durable investigation session or analysis cache, but one
invocation may still produce several events sharing substantial context.

Observation evidence has a different purpose and lifecycle from operational
analysis records. PostCode must produce useful observation data without making
the application runtime responsible for querying, retaining, migrating, or
curating the research archive.

## Decisions

### Record normal view production automatically

Normal CLI view production emits formative observation events automatically. For
the initial slice, an observation should establish at least:

- repository and analysis-snapshot context;
- lens, subject, lens parameters, presentation, presentation parameters, and
  declared standard expansions;
- selector input, resolved subjects, and navigation or focus provenance available
  within the invocation;
- relevant evaluation outcomes, qualifications, refusals, unavailability, and
  failures;
- projection and view identity;
- the machine-readable qualified view artifact and exact rendered output shown to
  the user; and
- any explicit source expansion and the level of source detail disclosed.

Recording the rendered result and the qualified machine-readable artifact keeps
what the human saw distinguishable from analysis data that existed but was not
presented. Observation data is not automatically treated as a Claim, analysis
cache, or source of program truth.

#### Rationale

Recording only a command name would omit the presentation, selection,
qualification, and materialization conditions that shaped the interaction.
Copying the complete operational store would over-record information the user did
not encounter and confuse analysis availability with observed experience.

### Submit self-contained, invocation-scoped observation batches

The producer groups the events from one CLI invocation into an observation batch.
The batch has a UUID and contains or accompanies every shared context record and
artifact required to interpret its events. Events and context records have UUIDs,
and events refer to shared context by UUID rather than embedding it repeatedly.

Context references are guaranteed to resolve within the submitted batch. UUIDs
need not be reused across invocations, even when context content is equivalent.
Content hashes may later support integrity checking or sink-side deduplication,
but content identity and observation-record identity are not conflated.

The initial batch envelope carries `formatVersion: 0`. Version zero is explicitly
experimental. Later slices may change or replace the event representation without
providing backward-compatible production or reading behavior.

#### Rationale

Invocation scope captures shared context without introducing an undefined CLI
session or a persistent producer-side UUID registry. A batch-level version costs
little and lets development and research sinks distinguish experimental formats
without promising support for old ones.

### Send to a sink and forget

PostCode produces typed application-level observations through an
`ObservationSink` boundary. Once a sink accepts a complete batch according to its
own contract, the CLI may discard the batch and its UUID mapping. Normal PostCode
operation does not read prior event streams.

Retention, durability after acceptance, deduplication, indexing, migration,
querying, rewriting, deletion, and export are sink responsibilities. A sink may
retain every batch, transform it, forward it, or deliberately discard it. The
producer does not impose a historical-preservation policy on sinks.

Development and tests may provide sinks with behavior appropriate to their
purpose, including in-memory capture, deterministic fixture output, local file
output, failure injection, or deliberate discard. No observation data is
automatically sent to a research service or other remote destination.

#### Rationale

Separating production from sink policy keeps PostCode usable with local,
development, testing, and future research destinations without embedding one
archive lifecycle in the application.

#### Consequences

- The producer needs only delivery acknowledgement as defined by the selected
  sink; it does not need a historical read API.
- Experimental old streams are outside the producer's compatibility guarantee.
- Any research sink that values long-term evidence must choose its own retention
  and migration policy.

### Keep observations separate from `ProgramRecordStore`

`ProgramRecordStore` holds ephemeral operational program records used to evaluate
and construct projections. Observation batches contain durable-or-discardable
evidence submitted to a sink. Observation artifacts may serialize or copy
relevant program records, but must remain interpretable without the ephemeral
store after submission.

The two logical stores may later share a physical engine if that is useful, but
they do not share ownership, validity, retention, or cache semantics merely
because they can both be represented as records.

#### Rationale

Using the operational store as the observation archive would make ephemeral
analysis lifecycle determine research evidence retention and could accidentally
turn observed historical results into current analysis data.

### Surface observation delivery failure without blocking normal use

Failure to submit an observation batch is visible to the user and is not reported
as successful recording. It does not by itself convert a successfully constructed
view into an analysis or projection failure. The initial CLI may continue after a
prominent warning.

The producer cannot reliably record the sink failure into the same failed sink;
development diagnostics and user-visible output are therefore the immediate
evidence of that observation gap.

#### Rationale

Silent loss would undermine formative evidence, while making all application use
depend on a research or development sink would confuse observability with the
program-information result. A later research protocol may choose a stricter sink
policy without changing view semantics.

### Defer contemporaneous note capture

The first slice does not implement a separate subjective-note command. Such a
command would strengthen the case for durable investigation context because a
later CLI invocation needs an explicit or persistent way to identify the view or
interaction being discussed.

Subjective notes remain part of the adopted product direction. They should be
introduced with an intentional association mechanism rather than implicitly
attaching a note to whichever prior invocation seems most likely.

## Alternatives considered

- Store observations in `ProgramRecordStore`: rejected because operational and
  observation lifecycles differ.
- Maintain persistent producer-side context UUIDs: deferred because invocation
  batches capture immediate sharing without creating sessions or a registry.
- Embed all context into every event: rejected because it duplicates potentially
  large projections, view artifacts, and repository context.
- Record only semantic projection data: rejected because research may need the
  exact rendered output the human encountered.
- Require permanent compatibility from the first event schema: rejected because
  the prerelease producer and observation needs are still evolving.
- Omit format versioning until stabilization: not selected; an explicit zero
  version is a low-cost guard against silent format confusion.
- Block view delivery whenever observation recording fails: deferred in favor of
  visible warning and continued normal use.

## Follow-up

- Choose a concrete default development sink and external location during
  implementation planning.
- Revisit persistent observation/session association when adding subjective
  notes, a GUI workspace, or navigation across process lifetimes.
- Let each research or archival sink define its own retention, migration, privacy,
  and export policies.
