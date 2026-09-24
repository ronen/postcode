# Investigons and progressive module investigation

Status: in review
Decided: [needs-review — set adoption date at promotion]
Arising from: [Module investigation](../plans/module-investigation.md)
Scope: retained interpretation, lens focus, composition, investigation provenance, correction, subject facets, and interpreter execution
Supersedes: [Define Facet as a classification role played by a property](../../../docs/decisions/initial-core-concepts-decisions.md#define-facet-as-a-classification-role-played-by-a-property)

## Context

Module structure and qualified evidence do not by themselves explain apparent
functionality or division of responsibility. A terse interpretation can provide
that explanation and expose subjects for further investigation. Follow-ups need
retained meaning, support, and context, not just the identity of a source entity.
They must also be able to correct earlier accounts when further investigation
changes the interpretation.

[Transient analysis sessions](../../../docs/decisions/transient-analysis-sessions.md)
already retain immutable information and stable references while additional
analysis accumulates. They explicitly leave interpretation augmentation and
supersession semantics to summary work. This record extends that model without
requiring persisted investigations, semantic identities across program states,
or a canonical model of program responsibilities.

The decisions extend the existing concepts, including broadening facet applicability
from entities to subjects. Existing definitions of Entity, Subject, Claim,
Evaluation, Lens, Projection, and Session retain their meanings. The entity-only scope of the initial facet decision is replaced by
[subject facets](#apply-facets-to-subjects-including-investigons), which restates the
carried-forward meaning. The lens mapping below makes explicit how an interpretation artifact can be
a subject of further investigation while retaining its program context.

## Decisions

### Represent retained interpretation as investigons

An **investigon** is an immutable, addressable artifact of program investigation
containing a qualified interpretation in prose, with referent information, evidence
context, and provenance.
Investigons can contain broad, related claims and have subordinate investigons;
they need not express atomic propositions. An account and a part of an account
use the same concept, without requiring separate domain types.

Each investigon retains or resolves to its generating operation, originating
program context, selected target where applicable, and supporting method and
qualification. Shared metadata is permitted when it remains attributable.
PostCode assigns retained identities and validates references. Generated prose
remains interpretation even when its references resolve and its structure validates.

An investigon is not a program entity merely because it is addressable. Claim
content is the asserted information within it; Claim context qualifies that
content. Evaluation outcomes describe the attempt that produced it, including
failure or no materialized result. These distinctions do not prescribe separate
storage records for every sentence or require a new type system for every claim.

Investigation is the product activity; interpretation is the character of this
artifact's content. Organization and dependency operations also support investigation,
but their qualified mechanical projections are not investigons. Projection remains
the general lens-result concept. Mechanical results can provide evidence or a
starting point for an investigon without being converted into prose artifacts.

#### Rationale and naming

A common retained unit supports repeated explanation, decomposition, examination,
and revision without an arbitrary boundary between a whole account and a part.
Broad initial units can be refined through use rather than being atomized upfront.

The coined name **investigon**, plural **investigons**, names its role in
investigation while its definition preserves the interpretive character of its
content. It has a straightforward plural and evokes a particle: an immutable unit
that can be retained, referenced, and passed between operations. That analogy
concerns identity and lifecycle, not indivisible meaning or a guarantee of truth.
Decomposing an investigon produces new investigons without splitting or modifying
the original.

#### Alternatives and consequences

Arbitrary unstructured summary text lacks reliable follow-up targets and support
links. A formal semantic knowledge graph would impose precise meanings that this
slice does not establish. Investigons retain interpretable prose and qualified
context between those alternatives. The name becomes shared domain vocabulary;
its introduction does not make a graph, tree, or forest the canonical store.

Other names were considered. “Account” has competing software meanings, while “part” suggests a fragment rather
than the common retained unit. “Interpretation” expresses epistemic character but
does not strongly convey an answer to an investigative question; “answer” is too
generic. “Opinion” suggests weak grounding, while “pronouncement” suggests excessive
authority. Findings, assessments, explanations, and descriptions each emphasize
only some uses of the common unit. “Investigation artifact” alone is too broad,
also covering captured evidence and mechanical results. Investigum, investigus, and investigatum were considered, but their endings and
plural forms offered no clear advantage. “Interpreton” was also considered; it is
easy to misread or pronounce as “interpretron,” suggesting a device rather than
a retained result. These are naming associations, not claims about Latin derivation.
Investigon's resemblance to “investigation” can itself cause a reading stumble;
the name remains the working choice while terminology is evaluated in use.

### Separate program referents from interpretive focus

An investigon carries a free-form referent description intelligible to a fresh
interpreter request, originating module context, and optional structured references
to supported subjects. The description can concern several collaborating entities
or a source region rather than exactly one entity. Structured references can support
navigation; they need not exhaust the description's meaning.

PostCode validates structured targets before exposing corresponding actions. A
valid target does not establish that the interpretation correctly attributes a
responsibility to it. An arbitrary ID in prose or the free-form description does
not acquire reference semantics. Referent and evidence remain different roles,
even where the same captured source region serves both.

Summary, explain, decompose, and examine are lenses, each producing a projection
containing a root investigon with optional subordinate investigons. Summary
selects a module. A follow-up selects an investigon as its subject,
retaining its underlying program context and referent description. Its prose is
part of the explicit interpretive input, not a mechanically established premise.
A projection records the selected focus, qualified resulting investigons,
relevant evaluation outcomes, and evidence/method context. A
projection can select investigons as result information, but an investigon is
not synonymous with that projection or its rendering.

#### Rationale, alternatives, and consequences

Using only a module ID loses the user's intended aspect. Requiring each aspect
to resolve to exactly one entity excludes distributed functionality and introduces
premature semantic modeling. Using prose alone loses program grounding and useful
navigation. Retaining both allows shared interpretation machinery to operate on
broad or narrow descriptions while preserving traceability.

Keeping the module as the formal subject and making the investigon only a lens
parameter was considered. Selecting the investigon itself makes its role as the
human's chosen subject explicit, while retaining the module and evidence context
needed for analysis. Subject is a role, not another entity kind. This does not
turn conceptual background into an independent programming-tutorial subject.

### Associate investigons with subjects and select retained results

Investigons have explicit qualified
associations with the subjects they describe, allowing human inspection and
interpreter retrieval by subject. Originating investigation context, additional
referents, and supporting evidence are distinct roles. A source citation or prose
mention is not automatically an assertion that an investigon describes that subject.
Association validation establishes the referenced subject, not the correctness of
the description. Association records do not mutate the subject entity.

A replacement's associations are independent of its composition placement. It
remains associated with the subject whose account it corrects; other described
subjects require explicit attribution rather than wholesale inheritance of the
original's associations. Correcting an attribution from one module to another can
concern both modules.

Associated investigons are retained information about a subject rather than
unqualified intrinsic properties. This permits subject-oriented access without
introducing a new universal property schema. Inspection selects associated accounts
and their provenance, support, and revision state; it neither generates missing
interpretations nor adopts the most recent prose as truth. Several investigations
can yield different qualified accounts of the same subject.

An interpreter can retrieve such accounts on encountering a subject, even outside
its chain of prior investigations. The resulting context is explicitly labeled
as prior interpretation. Its provenance and supplied support remain attributable;
retrieval does not make it independently established evidence, and repeated or
circular reuse is not corroboration.

Projections for repeated requests explicitly select retained results and their revision
relationships. Later requests can construct new projections that prefer explicit
replacements without modifying original investigons or historical projections.
Subject inspection declares association selection as part of its requested
information; it does not incidentally inherit every result in the store. Repeating
an operation can therefore display explicit replacements without running the
interpretation again. Exact retained request, attempt, and current-selection
representations are implementation details; new generation is an explicit action.

#### Rationale, alternatives, and consequences

If retained accounts can only be seen as immediate operation output, replacement
as the “primary display” has little meaning. Subject association and repeat viewing
make revisions useful for continuing investigation and avoid unnecessary model calls.
An always-generate command hides a material cost and does not provide stable access
to accumulated understanding. Treating interpretations as intrinsic model properties
would obscure qualification and multiple accounts; access restricted to investigation provenance would
hide relevant work performed through another investigative path.

The existing mechanically derived lenses retain their meanings. Adding associated
investigons to subject inspection is an explicit addition to its presentation
requirements, not a reason to broaden dependency or organization populations.
The inspection association can be implemented as a named standard expansion
or an explicit related-result section, preserving the declared selection,
qualifications, and no-inference behavior. No general change
to Property, Session, or mechanical determinism is made by this decision.

### Distinguish fixed composition from investigation provenance

One interpretation produces a root investigon with optional subordinate investigons.
Composition can have multiple levels; the entire composition tree is fixed when
retained. A subordinate investigon is part of that result, not a later operation
on its parent. All levels use the same investigon concept.

A later operation selecting an investigon as its subject produces a separate root
and composition tree. Its investigation provenance references the selected subject
and generating operation. The new root is not a composition child of that subject.
Reverse lookup can discover investigations performed on an investigon without
adding parts to it or changing its retained content.

Composition records the organization of one interpretation; investigation provenance
records how separate investigations build on selected subjects. Neither relationship
by itself establishes program containment, delegation, execution order, or logical
dependence. Claims about constituent functionality require their own support.

The interpreter can traverse composition to understand surrounding and subordinate
parts, and provenance links in either direction to inspect prior and subsequent
investigations. A reference continues to identify the same investigon after any
later investigation or correction. Retained projections and composition trees
remain unchanged; newly constructed views can expose additional provenance and
revision relationships.

#### Rationale, alternatives, and consequences

Treating every follow-up as an added child conflates the structure of an answer
with the history of investigating it. Treating either relationship as a hierarchy
of program functionality would also misrepresent explanatory and investigative
results. Distinct composition and provenance preserve both meanings without
requiring separate types for whole accounts and their parts. A fixed composition
tree is a semantic structure; storage layout and reverse-link indexing remain
implementation choices.

### Record explicit corrections without rewriting earlier interpretation

An investigon may carry accompanying corrections and unresolved inconsistencies as
immutable content. Each correction identifies a previously retained target, carries
a new replacement investigon, and records its reason and evidence context. Each
replacement is constructed through its correction, with a composition tree disjoint
from the reporting investigon's composition tree. This is a construction invariant,
not a restriction on which program aspects can be described. The replacement's
provenance identifies the actual generating operation and selected subject.

Each investigon occupies at most one composition position across all trees in the
result.

Replacement investigons may themselves carry corrections. Every correction target
must have been retained before acceptance of this operation's result; it cannot
be another investigon produced by the same operation. This separates new replacements
from their targets' composition and prevents same-result correction cycles. The
entire result, including recursively accompanying corrections, is validated and
accepted together. Corrections take effect on acceptance, not display.

A correction targeting an already superseded investigon, or competing with another
correction, does not invalidate an otherwise valid result. Retain its replacement
and mark the conflict. Where a presentation selects one account, the default is
the endpoint produced by the most recently accepted correction among all endpoints
reachable from the displayed investigon through explicit correction links. Selection
considers every branch, not only direct corrections. For example, after A → B,
A → C, and then B → D, display selects D rather than C. Simultaneously accepted
alternatives require a stable presentation tie-break, whose form is an
implementation choice. Selecting a primary account does not resolve the conflict.
A newer correction alone does not establish that it addresses intervening corrections.

An unresolved inconsistency without an asserted replacement is also accompanying
content, referencing the affected investigons. Inspection of the reporting and
affected investigons exposes it, and redisplay flags it. PostCode validates
structure and references; semantic inconsistency remains an interpretive judgment.
A missing target or other structurally invalid reference still rejects the unit.

The reporting operation's view shows its accompanying corrections with targets,
selectable replacement references, reasons, and access to support. Redisplay marks
updates and conflicts, preserves qualification, and provides access to originals.
A presentation may instead show an overview of conflicting accounts through
attributed excerpts and references, without generating a synthesized interpretation.
Inspection explicitly exposes all conflicting accounts and correction relationships,
identifying the primary selection; bounded listings disclose omissions and provide
access to the remaining accounts.

Redisplay follows explicit replacement chains to the selected endpoint and displays
that investigon's own composition, applying the same rule to its sub-investigons.
Annotations identify the original and provide access to the replacement chain.
A corrected child appears in place under the old root, marked as an update. When
the root is replaced, corrected children from its old tree are not spliced into the
replacement tree. Disclose corrections in displaced trees that are not shown,
with references. An operation may correct both an ancestor and a descendant; a
node in a superseded tree remains a valid target. Neither disclosure nor primary
selection establishes that the replacement root incorporates those corrections.

Presentation substitution creates no composition relationship. Original investigons,
composition trees, and historical projections remain unchanged. Correction links
apply throughout the session; exact inspection exposes the selected original.
Separate investigations retain their exact subjects and provenance. Repeating a
follow-up displays its retained result with a revised-subject warning, without
redirecting, reattaching, or regenerating it. Composition and provenance alone do
not propagate corrections.

A follow-up targets the exact investigon reference supplied, including when it is
superseded. The interface warns and identifies its replacement without redirecting
the request or requiring confirmation. Original and replacement subjects identify
different retained requests. Summary redisplay can select replacements, labeled
with their own precise references; inspection exposes superseded investigons and their references.
Display selection never changes the referent of a precise reference.

Reference syntax is independent of these semantics. A path with a version-distinct
spelling can be a precise reference if its binding is stable. A path or other
selector can instead be a lookup handle, with zero, one, or multiple matches.
Missing and ambiguous selections remain explicit; lookup does not silently prefer
a replacement. Requests identify the resolved subject, not merely the handle text.

The initial correction contract replaces one whole investigon
with one replacement investigon, optionally containing subparts. An operation may
correct several earlier targets. Competing accounts remain available without
automatic merging or erasure. This slice has no operation for declaring conflicting
accounts reconciled. Later corrections may improve the primary account while
recorded conflicts remain visible.

#### Rationale, alternatives, and consequences

Restricting correction to the immediate target misses findings that undermine a
prior summary's division of responsibility. Automatically replacing related
investigons mistakes composition or provenance for logical implication. Editing earlier prose erases the basis of existing
interpretations and observed views. Explicit targeted replacement supports upstream
correction while preserving what was actually asserted and why.

When a view presents one account, recency supplies a practical default. A newer
correction may incorporate more evidence or other investigations, but this is not
guaranteed: acceptance order is a display heuristic, not credibility. Showing no
account would withhold useful information. A conflict overview is another
presentation option; synthesizing agreement and differences would itself require
an investigation, not ordinary redisplay.

A sentence-level patch language or arbitrary many-to-many replacement could express
more cases but is not necessary to test this slice. Its detailed encoding and indices are implementation choices. The mechanism
does not guarantee detection of every inconsistency or correctness of a revision.

### Apply facets to subjects, including investigons

Use Property for a characteristic of a subject about which information can be
requested or asserted. Distinguish the characteristic from claims about its value
or whether it holds. A Facet is a property used as a compact classification dimension
for describing, filtering, grouping, or comparing subjects, including entities and
investigons. A claim supplies its value, and Claim context supplies its qualification.
Different facets may overlap and need not share a representation or value type.

Facet names a role played by a property, not a separate record category or a special
epistemological status. A conceptual facet describes the subject in terms useful to
investigation; a source facet describes its source-level representation or
implementation mapping. Language-specific knowledge can establish a conceptual
facet and does not by itself make that facet source-level. Facet names do not
determine claim strength. Adopt no universal Property or Facet schema,
implementation subtype hierarchy, or generic facet machinery.

Investigon facets such as superseded, supersedes, and conflicting have values
supplied by session-scoped claims derived from retained correction relationships.
New session context yields new derived claims without modifying immutable
investigon content. A recorded correction or conflict does not establish which
program interpretation is true.

#### Rationale, alternatives, and consequences

Properties already apply to subjects. Broadening facets from entities to subjects
allows the same descriptive classification role for investigons. Describing their
revision and conflict states is useful by itself; this slice does not require new
filtering or grouping operations. Presentation-only annotations would describe the
same characteristics without recognizing their existing conceptual role as facets.

### Integrate interpretation with evaluation and qualified evidence access

Language analysis and interpretation produce qualified information through the
existing evaluation and session record-store architecture. Interpretation adds
investigons and their support and relationships; it does not establish a separate
storage or projection pipeline. Shared evidence, Claim context, and evaluation
outcomes preserve their meaning across both kinds of analysis without requiring
entities and investigons to be the same record kind.

Lenses declare requested information. Evaluation selects retained results and
explicit revisions and determines what missing analysis or investigation must run.
Validated results are retained before projection construction; rendering and
projection construction consume materialized information without invoking analysis.
A retained interpretation's reuse and an explicit request for a new attempt remain
distinct from mechanical reuse rules. More available context alone does not require
regeneration of every earlier investigon.

An agent-communication failure closes the interpreter session and returns no
reusable investigation result. Execution diagnostics remain attributable but do
not satisfy or block later request selection. A subsequent request with no retained
result starts an ordinary fresh investigation, without detecting repetition or
resuming the failed dialogue. Completed communication yielding invalid output is
instead a retained investigation-failure outcome; execution-limit stops remain
separately identified. Reject late responses from finished attempts.

Classification follows the failure's meaning, not whether a complete protocol
response arrived. Transport errors, request timeouts, rate limiting, and provider
unavailability are communication/service failures, including after successful tool
exchanges. Provider refusals, provider-reported output truncation, malformed output,
and invalid references are retained investigation outcomes. Expiry of PostCode's
execution guard is always a limit stop, including while a provider call is in flight.

Runtime authentication rejection is configuration unavailability and leaves no
reusable investigation outcome. Unrecognized provider errors are reported as
unclassified communication/service failures with credential-safe diagnostics;
this classification does not establish that they are transient.

Communication failure discards the dialogue's unaccepted interpretation content;
it does not retain a partial investigation result that would block later selection.
Qualified mechanical results and evidence acquired through tools remain available
under the normal session-validity rules.

The interpreter has domain-level access to supported qualified entities and
relationships. Queries go through evaluation, which reuses retained analysis or
performs missing mechanical analysis. Results retain their scope, method, evidence,
and limitations. An established dependency does not establish the responsibility
it serves; source interpretation can contribute that account separately.

The interpreter's complete program-access surface is PostCode's subject population.
It navigates entities, relationships, organization groups, and opaque documentation
or artifact records, requesting source or contents by reference. There is no
independent filesystem discovery or path-based read interface. Completeness here
concerns the accessible subject set, not complete contents or analysis of each
subject. Organization membership does not by itself establish a documentation
association with a module.

Subject-based evidence requests use shared acquisition backed by the session
record store. Acquisition resolves established mappings, returns retained captures,
or acquires and retains missing contents within the existing validity boundary.
One subject can map to several files or regions. Unsupported mappings or unavailable
contents remain qualified outcomes rather than falling back to arbitrary reads.
Filesystem I/O need not be performed by the store itself. Capture, output exclusion,
and validity enforcement remain responsibilities of shared acquisition, without
introducing a second interpreter-specific file-access policy.

Full captured source is available through this interface within execution limits;
bounded human-facing excerpts do not constrain analysis. Source acquisition and
coverage remain attributable, including chunking and omissions. New content
acquisition participates in the session's existing change-detection contract.

Source supplied to an interpreter is analysis input, not a human source escape.
Its delivery is retained for provenance and resource accounting; a source-escape
observation records source actually disclosed to the human through the interface.
Provider transmission remains an operational disclosure distinct from both human
source presentation and the evidential qualification of an interpretation.

#### Rationale, alternatives, and consequences

A separate interpreter pipeline would duplicate evaluation, retention, failure,
and qualification responsibilities. Restricting the interpreter to source would
require it to reconstruct relationships already established by language analysis.
Restricting it to currently retained records would prevent useful on-demand analysis.
The shared evaluation boundary supports both acquisition and reuse without hiding
limitations or treating interpretation as mechanically established information.

Full source access is often needed to understand apparent functionality; human
presentation bounds address a different concern. Conflating those bounds would
silently reduce analysis coverage, while labeling interpreter reads as human source
escapes would misreport the user's interaction. These distinctions specialize the
existing evaluation and source-disclosure contracts rather than replacing them.

### Start each operation fresh and permit bounded interpreter dialogue

Each new interpretation evaluation starts a fresh interpreter session. Reading
retained results does not invoke the interpreter. PostCode provides
the objective and initial context, the interpreter requests additional context or
source, and PostCode returns it. Request and response repeat until a structured
result or an execution limit. Conversation can accumulate within the operation;
opaque conversational memory does not carry over to the next operation.

The minimum initial request supplies the operation and module reference for a
summary, or the selected investigon's prose, referent information, and context
references for a follow-up. Further evidence is acquired through the shared
subject-based interface. Prefetching is an execution choice, not a separate evidence
contract; initially supplied and subsequently requested material obey the same
capture, qualification, and provenance rules. The actual context delivered remains
attributable in either case.

The surrounding PostCode session retains investigons, evidence, and outcomes. The
interpreter can follow composition, investigation-provenance, and revision links
on demand, including reverse lookup of operations that selected an investigon.
The selected investigon directs attention without restricting access to its
composition tree or its own chain of prior investigations. Retrieved prior
interpretations are distinguished from source and mechanical evidence.

Two internal boundaries separate domain interpretation from agent communication:

- The outer **domain interpretation boundary** accepts an operation, subject, and
  investigation context; coordinates subject-based evidence access and validation;
  and returns investigons carrying any accompanying corrections, and evaluation outcomes.
- The inner **agent communication boundary** exchanges instructions, messages,
  tool requests and responses, and completion or failure signals. It encapsulates
  provider protocols, authentication, and transport details without defining
  investigation semantics.

Dialogue coordination between these boundaries translates domain requests into
agent instructions, dispatches tool requests through PostCode's subject-based APIs,
and translates agent output into validated domain results. The same infrastructure
supports all four operations. Interface shapes and whether coordination occupies a
separate module are implementation choices.

This separation allows agent integration to change without changing the domain
operations. Source access remains a controlled PostCode capability; local versus
hosted inference does not itself determine which repository material can be read.

#### Rationale, alternatives, and consequences

Fresh requests make carried context explicit despite variable agent memory
behavior. Requiring one model call would force PostCode to predict all useful
context in advance and amplify oversized-input problems. A persistent opaque
agent conversation would hide selection and revision assumptions. A bounded
per-operation dialogue supports selective acquisition without either restriction.

The implementing agent selects the concrete hosted integration and initial settings;
a universal provider framework and local-model comparison are unnecessary. The
user's Ollama trial of qwen3.6:27b on the development machine was reported too slow
for practical use; that observation does not establish performance of other local
configurations. A later local integration can implement the agent communication boundary while
preserving the domain interpretation contract.

The plan defines the initial access and outcome policy. Execution bounds constrain
evaluation rather than changing the lens question. Context selection, explicit
instructions, tool-delivered evidence, model/configuration, and generated results
remain attributable without requiring access to model-private reasoning. Normal
session invalidation and generated-output boundaries continue to apply.

## Governing impact and promotion

The accompanying [core concepts](../docs/core-concepts.md) add Investigon and
explicitly include investigons among subjects, preserving Subject as a role rather
than an entity kind. This makes an additional instance of that role explicit
without replacing the earlier definition. The
[architectural constraints](../docs/architectural-constraints.md) add stable
investigon-reference, composition, provenance, and revision rules. Existing qualification,
evaluation, session, and observation decisions continue to govern.

Plan-specific review choices are resolved with the plan before adoption. Set the decision date at adoption,
update canonical indexes, and rewrite links for their destination paths. Facet's
general definition now applies to subjects. The subject-facets decision above fully
replaces the initial decision's headed Property/Facet definition, preserving its
other distinctions. At promotion, add a `Superseded in part` mapping from that
heading in `initial-core-concepts-decisions.md` to
[Apply facets to subjects, including investigons](#apply-facets-to-subjects-including-investigons).
The earlier record remains partially superseded. No other headed decision is replaced.
