# Structured architectural accounts: working exploration

Started: 2026-11-09

Exploratory, non-governing notes. Recommendations below are discussion proposals,
not accepted decisions or implementation authorization. No draft planning package
has been requested yet.

## Scope established by the human

Explore accounts that successive investigations can reuse, extend and challenge,
preserving evidence, qualifications, conflicts and earlier accounts. Retained
content should supply the meaning needed by architectural diagrams and later
graphical investigation. Validate an eventual implementation independently through
the application boundary within the supported Session lifetime. Broader
presentation/navigation work and the minimal GUI follow separately.

Work is isolated on `codex/structured-architectural-accounts`, based on
`1805b3131fb57d2cdee93e059688045961ef8ec2`; local main matched fetched origin/main.
The human authorized these evolving notes. No design agreements beyond the
request's constraints have yet been reached.

## Inspected basis and existing machinery

Governing context: [product design](../foundation/product-design.md),
[application specification](../docs/app-specification.md),
[core concepts](../docs/core-concepts.md),
[constraints](../docs/architectural-constraints.md), and the accepted decisions on
[structured interpretation](../docs/decisions/structured-investigram-content.md),
[progressive investigation](../docs/decisions/investigrams-and-progressive-investigation.md),
[architectural investigation](../docs/decisions/specialized-architectural-investigation.md)
and the [application API](../docs/decisions/internal-application-api.md).

Exploratory inputs: [connected examples](initial-journey/cockatiel-account-examples.md),
[script](initial-journey/cockatiel-investigation-script.md), and
[findings](initial-journey/design-findings.md). Their Cockatiel behavior is an
illustrative static account at the recorded revision, not newly verified behavior.
The waiting omission and its discovery are staged.

- Immutable investigrams, fixed composition, qualified subject associations,
  whole-result atomic acceptance, corrections, competing replacements and
  citation-based reconsideration already exist. Fresh answer selection snapshots
  current revision/association information; exact answer access preserves its
  earlier snapshot. Exact investigram inspection and exact answer retrieval differ:
  a new inspection can retain newer revision context around the same original.
- Reuse currently matches a compatible operation request/method. It does not
  establish semantic equivalence between differently framed questions. Association
  selection answers which accounts explicitly describe a subject, not which ones
  best answer a particular question. Replacement preference follows the accepted
  recency policy across correction branches; it does not resolve disagreement.
- The [application entry](../src/lib/application/index.ts) already delivers full
  selected qualified content without CLI rendering, supports precise follow-up
  references and exact retrieval, and keeps work/usage separate from retained
  answers. [Direct journey tests](../test/application-journey.test.ts) exercise
  correction, conflicts, reconsideration, reuse and fixed earlier answers through
  this boundary, substituting only investigator communication.
- Content remains `prose` in [contracts](../src/lib/investigation/contracts.ts),
  [acceptance](../src/lib/investigation/acceptance.ts), investigator submission and
  [context delivery](../src/lib/investigation/context.ts). Complete delivery checks
  prose, referent and qualifications. All structured content would need equivalent
  coverage, including partial exposure and correction eligibility.
- Investigation operations accept a module or investigram, retain an originating
  module, and currently have no semantic parameters. Public subject resolution
  does not offer policy kinds, states or instance/execution roles as such.
  Existing associations connect accounts to supported subjects; they are not
  state-of, ownership, interaction or cross-account correspondence claims.
- No general working-account selection, architectural element designation,
  behavioral content contract or arbitrary multi-Projection composition is supplied
  by the existing API. Its provider `accounts.ts` concerns authentication accounts,
  not architectural accounts.

Inspection only: no tests or hosted investigations were run. A documentation
lag exists: the application-boundary plan/index still say approved/not authorized,
whereas STATUS and implementation describe the delivered API. This exploration
uses the inspected implementation for capability claims; plan lifecycle metadata
has not been changed.

## Initial recommendation and alternatives

Use admission → trial → correction as the primary bounded case: one program
revision, default single-trial recovery, implemented architecture, one live Session.
ADMISSION-1 exposes Half-open; the follow-up returns TRIAL-1 with ADMISSION-2 and
the explicit correction. ANSWER-1 remains exactly retrievable. A working selection
can contain ADMISSION-2 and TRIAL-1 without appending to ADMISSION-1's composition
tree or pretending they form a newly synthesized explanation.

Use the two composition orders as a design probe before fixing content contracts.
They test distinct component roles, resource ownership and a new qualified claim
using earlier accounts. Keep a full composition investigation a scope choice,
rather than automatically adding the rest of the journey. Starting with composition
would test cross-account synthesis sooner but also adds bulkhead discovery,
multi-account input selection and ordered roles before basic continuity is proven.

Prefer small coherent interpretation units that can be separately qualified,
selected and corrected. Do not make every sentence an investigram, or assume all
content belongs in one large account. Partition affects correction delivery cost:
the complete target's own content must be supplied, not merely its changed fields.

Keep three dimensions separate:

| Dimension | Example | Proposed treatment |
| --- | --- | --- |
| Revision | ADMISSION-1 has replacement ADMISSION-2; alternatives may conflict | Existing correction/reconsideration machinery; explicit snapshots |
| Applicability | TRIAL-1 concerns default single-trial recovery, not every configuration | Retained scope and request meaning; interpretive relevance judgments require qualified analysis |
| Working selection | The current answer selects ADMISSION-2 plus TRIAL-1 | Exact selected references with selection basis; no claim of consolidation or authority |

The smallest first design could let callers explicitly select already qualified
accounts; automatic semantic relevance ranking or reconciliation would be separate
analysis. Existing automatic replacement selection must retain its disclosures.

## Subjects, relationships and diagram demands

Prefer account-scoped designations for exposed architectural subjects, with explicit
meaning and supporting context. Whether these are structured content targets,
dedicated subject records or selected investigrams remains open. Avoid creating a
global canonical entity solely because two accounts use the same label.

For example, Half-open is a state of the breaker in this account; Shared breaker
instance is a role in a usage pattern, not an observed runtime object; Recovery
trial is an execution role; Individual execution has its own progress. Following
one must preserve that distinction and its account origin. Reusing an exact
designation preserves reference identity; claiming correspondence to a separately
introduced subject needs qualified support. Corrections must not retarget old
subject references; any successor correspondence needs explicit treatment.

| Representative diagram | Meaning retained content must supply |
| --- | --- |
| Small ownership/structure diagram | Policy kind, shared instance role, individual executions, supplied work and qualified relationships among them |
| Recovery state diagram | State owner, states, transition triggers, guards/conditions, effects and omitted cases; elapsed eligibility differs from an execution-triggered transition |
| Concurrent-caller interaction | Participants/roles, meaningful ordering, trial occupancy, waiting, release conditions and alternative later outcomes; possible scenario differs from observed execution |

Use a few explicit content forms justified by these examples, with attributable
prose and qualifications. A universal graph with arbitrary edge labels leaves too
much interpretation to consumers; a full UML/statechart model would prematurely
commit to semantics and completeness the evidence may not support.

Validation should demonstrate that simple independent consumers can construct the
representative diagrams from retained content alone. Every meaningful edge,
transition, ordering, condition and qualification must trace to that content;
layout may choose placement but cannot invent missing semantics. Include negative
cases: omitted transition, ambiguous identity, partial scope, conflicting accounts
and missing support must remain incomplete or refused. Formal shape/reference
checks do not establish behavioral correctness or human comprehension.

## Application boundary and verification direction

Extend the existing path end to end: submission and reference transport; structural
and qualified-support validation; immutable retention; subject resolution and Lens
applicability; context delivery/exposure; selection and fixed support resolution;
direct delivery and exact retrieval. Keep interpretation in core analysis and
keep client rendering dependent on delivered qualified content. Scope affected
human-output handling explicitly even though broad presentation work is deferred.

Fixtures can establish subject/reference integrity, full versus partial delivery,
atomic acceptance/rejection, conflicts, replacement selection and unchanged exact
answers. Use the real application/evidence/retention path with scripted investigator
communication. A seeded orientation can isolate follow-up design, but cannot prove
discovery. A seeded correction can prove delivery, not error detection.

A separate real investigation must start from an ordinary supported entry point,
produce a usable architectural subject, follow it, reuse the actual earlier content
and acquire supporting program evidence. Check semantic fidelity independently.
Natural correction discovery needs its own assessment and must not be claimed from
a staged success. Diagram sufficiency, architectural correctness and usefulness to
a human are distinct validation questions. Existing observation basis-export gaps
matter if new research records are used for state-specific assessment; live
application verification alone need not introduce a general observation redesign.

## First discussion questions

1. Is the first success criterion a small complete admission → trial → correction
   capability, with composition as a design probe, or must the first delivered
   capability also establish new claims across separately produced accounts?
2. Should a selected Half-open identify the state as described in a particular
   account, or an independently maintained subject shared by several accounts?
   Recommend account-scoped meaning first; shared identity adds correspondence
   and revision policy that matching labels cannot supply.
3. Should the initial working account be an explicit selection of qualified parts,
   or must PostCode choose and synthesize the most applicable account for a question?
   Recommend explicit selection first; synthesis remains an available qualified
   investigation, not an implicit consequence of selection.

Further decisions: exact boundaries of interpretation units; initial subject
discovery; request/perspective meanings; per-part support and qualifications;
content-delivery completeness/bounds; subject continuity under replacement;
representative diagram consumers and independent semantic checks.
