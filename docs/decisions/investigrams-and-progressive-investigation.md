# Investigrams and progressive investigation

Status: accepted
Decided: 2026-09-26
Arising from: [Module investigation](../plans/module-investigation.md)
Scope: retained interpretation, lens focus, subject associations, composition, investigation provenance, and corrections

## Context

Module structure and qualified evidence do not by themselves explain apparent
functionality or division of responsibility. A terse interpretation can provide
that explanation and expose subjects for further investigation. Follow-ups need
retained meaning, support, and context, not just the identity of a source
entity. They must also be able to correct earlier accounts when further
investigation changes the interpretation.

[Transient analysis
sessions](transient-analysis-sessions.md) already retain
immutable information and stable references while additional analysis
accumulates. They explicitly leave interpretation augmentation and supersession
semantics to summary work. This record extends that model without requiring
persisted investigations, semantic identities across program states, or a
canonical model of program responsibilities.

Subject is extended to explicitly include investigrams while remaining a role
rather than an entity kind. The lens mapping below explains how an investigram serves as a subject of further investigation while retaining its program
context. Investigator execution is addressed in
[Investigator execution and evidence access](investigator-execution-and-evidence-access.md);
the broader facet definition is addressed in [Facets for subjects](facets-for-subjects.md).

## Decisions

### Represent retained interpretation as investigrams

An **investigram** is an immutable, addressable artifact of program investigation
containing a qualified interpretation in prose, with referent information,
evidence context, and provenance. Investigrams can contain broad, related claims
and have subordinate investigrams; they need not express atomic propositions. An
account and a part of an account use the same concept, without requiring
separate domain types.

Each investigram retains or resolves to its generating operation, originating
program context, selected target where applicable, and supporting method and
qualification. Shared metadata is permitted when it remains attributable.
PostCode assigns retained identities and validates references. Generated prose
remains interpretation even when its references resolve and its structure
validates.

An investigram is not a program entity merely because it is addressable. Claim
content is the asserted information within it; Claim context qualifies that
content. Evaluation outcomes describe how an attempt ended, whether it produced an
investigram or failed. These distinctions do not prescribe separate
storage records for every sentence or require a new type system for every claim.

Investigation is the product activity; interpretation is the character of this
investigram's content. Organization and dependency operations also support
investigation, but their qualified mechanical projections are not investigrams.
Projection remains the general lens-result concept. Mechanical results can
provide evidence or a starting point for an investigram without being converted
into investigrams.

#### Rationale and naming

A common retained unit supports repeated explanation, decomposition,
examination, and revision without an arbitrary boundary between a whole account
and a part. Broad initial units can be refined through use rather than being
atomized upfront.

The coined name **investigram** suggests a recorded account produced by an
Investigator. It connects the investigram to its producer while remaining visually
distinct from "investigation". Its definition preserves the interpretive character
of the account. Decomposing an investigram produces new investigrams without
splitting or modifying the original.

#### Alternatives and consequences

Arbitrary unstructured summary text lacks reliable follow-up targets and support
links. A formal semantic knowledge graph would impose precise meanings that this
slice does not establish. Investigrams retain interpretable prose and qualified
context between those alternatives. The name becomes shared domain vocabulary;
its introduction does not make a graph, tree, or forest the canonical store.

Other names were considered. “Account” has competing software meanings, while
“part” suggests a fragment rather than the common retained unit.
“Interpretation” expresses epistemic character but does not strongly convey an
answer to an investigative question; “answer” is too generic. “Opinion” suggests
weak grounding, while “pronouncement” suggests excessive authority. Findings,
assessments, explanations, and descriptions each emphasize only some uses of the
common unit. “Investigation artifact” alone is too broad, also covering captured
evidence and mechanical results. Investigum, investigus, and investigatum were
considered, but their endings and plural forms offered no clear advantage.
“Interpreton” was also considered; it is easy to misread or pronounce as
“interpretron,” suggesting a device rather than a retained result. These are
naming associations, not claims about Latin derivation. The earlier name
“investigon” evoked an immutable particle but was too easily misread as
“investigation”. Investigraph would suggest a graph or visualization; investigram
suggests a recorded account without requiring either representation.

### Separate program referents from interpretive focus

An investigram carries a free-form referent description intelligible to a fresh
investigator request, originating module context, and optional structured
references to supported subjects. The description can concern several
collaborating entities or a source region rather than exactly one entity.
Structured references can support navigation; they need not exhaust the
description's meaning.

PostCode validates structured targets before exposing corresponding actions. A
valid target does not establish that the interpretation correctly attributes a
responsibility to it. An arbitrary ID in prose or the free-form description does
not acquire reference semantics. Referent and evidence remain different roles,
even where the same captured source region serves both.

`summarize`, `explain`, `decompose`, and `examine` are lenses. A successful evaluation
provides a root investigram with optional subordinate investigrams for the projection. `summarize`
selects a module. A follow-up selects an investigram as its subject, retaining
its underlying program context and referent description. Its prose is part of
the explicit interpretive input, not a mechanically established premise. A
projection records the selected focus, qualified resulting investigrams, relevant
evaluation outcomes, and evidence/method context. A projection can select
investigrams as result information, but an investigram is not synonymous with that
projection or its rendering.

`inspect(investigram)` exposes the retained investigram: its prose, referent
information, evidence, composition, provenance, and corrections.

`explain`, `decompose`, and `examine` use the selected investigram's prose and program
context to focus further interpretation. `explain` clarifies what the account
means; `decompose` identifies finer aspects of what it describes; `examine`
investigates its subject more deeply. Each may acquire additional evidence and
qualify or correct the original account.

The lens determines the question asked of the investigram as a subject; subject
status does not imply applicability of every lens.

#### Rationale, alternatives, and consequences

Using only a module ID loses the user's intended aspect. Requiring each aspect
to resolve to exactly one entity excludes distributed functionality and
introduces premature semantic modeling. Using prose alone loses program
grounding and useful navigation. Retaining both allows shared interpretation
machinery to operate on broad or narrow descriptions while preserving
traceability.

Keeping the module as the formal subject and making the investigram only a lens
parameter was considered. Selecting the investigram itself makes its role as the
human's chosen subject explicit, while retaining the module and evidence context
needed for analysis. Subject is a role, not another entity kind. This does not
turn conceptual background into an independent programming-tutorial subject.

### Associate investigrams with subjects and select retained results

Investigrams have explicit qualified associations with the subjects they
describe, allowing human inspection and investigator retrieval by subject.
Originating investigation context, additional referents, and supporting evidence
are distinct roles. A source citation or prose mention is not automatically an
assertion that an investigram describes that subject. Association validation
establishes the referenced subject, not the correctness of the description.
Association records do not mutate the subject entity.

A replacement's associations are independent of its composition placement. It
remains associated with the subject whose account it corrects; other described
subjects require explicit attribution rather than wholesale inheritance of the
original's associations. Correcting an attribution from one module to another
can concern both modules.

Associated investigrams are retained information about a subject rather than
unqualified intrinsic properties. This permits subject-oriented access without
introducing a new universal property schema. Inspection selects associated
accounts and their provenance, support, and revision state; it neither generates
missing interpretations nor adopts the most recent prose as truth. Several
investigations can yield different qualified accounts of the same subject.

The investigram section of `inspect(subject)` answers which retained investigrams
explicitly describe that subject in the current session, with their support,
provenance, and correction context. Selection uses validated subject
associations, not incidental prose mentions or evidence citations. Its contents
depend on the session's investigation history as well as the selected subject.
New associated investigrams or correction relationships can therefore change this
section on a later inspection. The mechanical determinism guarantee applies to
the mechanical portion of inspection, not to the generated content of associated
investigrams.

An investigator can retrieve such accounts on encountering a subject, even
outside its chain of prior investigations. The resulting context is explicitly
labeled as prior interpretation. Its provenance and supplied support remain
attributable; retrieval does not make it independently established evidence, and
repeated or circular reuse is not corroboration.

Projections for repeated requests explicitly select retained results and their
revision relationships. Later requests can construct new projections that prefer
explicit replacements without modifying original investigrams or historical
projections. Subject inspection declares association selection as part of its
requested information; it does not incidentally inherit every result in the
store. Repeating an operation can therefore display explicit replacements
without running the interpretation again. Exact retained request, attempt, and
current-selection representations are implementation details; new generation is
an explicit action.

#### Rationale, alternatives, and consequences

If retained accounts can only be seen as immediate operation output, replacement
as the “primary display” has little meaning. Subject association and repeat
viewing make revisions useful for continuing investigation and avoid unnecessary
investigator invocations. An always-generate command hides a material cost and does not
provide stable access to accumulated understanding. Treating interpretations as
intrinsic subject properties would obscure qualification and multiple accounts;
access restricted to investigation provenance would hide relevant work performed
through another investigative path.

The existing mechanically derived lenses retain their meanings. Adding
associated investigrams to subject inspection is an explicit addition to its
presentation requirements, not a reason to broaden dependency or organization
populations. The inspection association can be implemented as a named standard
expansion or an explicit related-result section, preserving the declared
selection, qualifications, and no-inference behavior. Session-dependent
association selection is part of the declared inspection question; unrelated
accumulated work still does not broaden the view.

### Distinguish fixed composition from investigation provenance

One interpretation produces a root investigram with optional subordinate
investigrams. Composition can have multiple levels; the entire composition tree
is fixed when retained. A subordinate investigram is part of that result, not a
later operation on its parent. All levels use the same investigram concept.

A later operation selecting an investigram as its subject produces a separate
root and composition tree. Its investigation provenance references the selected
subject and generating operation. The new root is not a composition child of
that subject. Reverse lookup can discover investigations performed on an
investigram without adding parts to it or changing its retained content.

Composition records the organization of one interpretation; investigation
provenance records how separate investigations build on selected subjects.
Neither relationship by itself establishes program containment, delegation,
execution order, or logical dependence. Claims about constituent functionality
require their own support.

The investigator can traverse composition to understand surrounding and
subordinate parts, and provenance links in either direction to inspect prior and
subsequent investigations. A reference continues to identify the same investigram
after any later investigation or correction. Retained projections and
composition trees remain unchanged; newly constructed views can expose
additional provenance and revision relationships.

#### Rationale, alternatives, and consequences

Treating every follow-up as an added child conflates the structure of an answer
with the history of investigating it. Treating either relationship as a
hierarchy of program functionality would also misrepresent explanatory and
investigative results. Distinct composition and provenance preserve both
meanings without requiring separate types for whole accounts and their parts. A
fixed composition tree is a semantic structure; storage layout and reverse-link
indexing remain implementation choices.

### Record explicit corrections without rewriting earlier interpretation

An investigram may carry accompanying corrections and unresolved inconsistencies
as immutable content. Each correction identifies a previously retained target,
carries a new replacement investigram, and records its reason and evidence
context. Each replacement is constructed through its correction, with a
composition tree disjoint from the reporting investigram's composition tree. This
is a construction invariant, not a restriction on which program aspects can be
described. The replacement's provenance identifies the actual generating
operation and selected subject.

Each investigram occupies at most one composition position across all trees in
the result.

Replacement investigrams may themselves carry corrections. Every correction
target must have been retained before acceptance of this operation's result; it
cannot be another investigram produced by the same operation. This separates new
replacements from their targets' composition and prevents same-result correction
cycles. The entire result, including recursively accompanying corrections, is
validated and accepted together, then retained atomically by evaluation and
session handling. Correction relationships take effect in the session on
retention, independently of display.

The target's retained prose, referent information, and qualifications must have
been supplied in full to the investigator during the current dialogue, initially
or through permitted context responses. PostCode checks what was actually
supplied; a known or reachable identifier alone is insufficient. Targets need
not belong to the selected subject's composition or provenance chain.

#### Conflicts and primary selection

A correction targeting an already superseded investigram, or competing with
another correction, does not invalidate an otherwise valid result. Retain its
replacement and mark the conflict. Where a presentation selects one account, the
default is the endpoint produced by the most recently accepted correction among
all endpoints reachable from the displayed investigram through explicit
correction links. Selection considers every branch, not only direct corrections.
For example, after A → B, A → C, and then B → D, display selects D rather than
C. Simultaneously accepted alternatives require a stable presentation tie-break,
whose form is an implementation choice. Selecting a primary account does not
resolve the conflict. A newer correction alone does not establish that it
addresses intervening corrections.

An unresolved inconsistency without an asserted replacement is also accompanying
content, referencing the affected investigrams. Inspection of the reporting and
affected investigrams exposes it, and redisplay flags it. PostCode validates
structure and references; semantic inconsistency remains an interpretive
judgment. A missing target or other structurally invalid reference still rejects
the unit.

**Clarification accepted 2026-10-02:** each unresolved-inconsistency target must
have supplied substantive content to the reporting investigation, recorded through
a citation. Identifier availability alone is insufficient. Substantive partial
content, including an excerpt, may suffice; unlike a replacement correction, an
unresolved inconsistency does not require complete target content. This validates
exposure and attribution, not the semantic truth of the inconsistency. The human
explicitly selected this rule in the integrated-review follow-up recorded in the
[module-investigation task](../../records/tasks/2026-09-29-module-investigation.md).
The rule prevents assertions against wholly unseen content while allowing qualified
unresolved disagreement based on the content actually received.

#### Presentation and historical access

The reporting operation's view shows its accompanying corrections with targets,
selectable replacement references, reasons, and access to support. Redisplay
marks updates and conflicts, preserves qualification, and provides access to
originals. A presentation may instead show an overview of conflicting accounts
through attributed excerpts and references, without generating a synthesized
interpretation. Inspection explicitly exposes all conflicting accounts and
correction relationships, identifying the primary selection; bounded listings
disclose omissions and provide access to the remaining accounts.

Redisplay follows explicit replacement chains to the selected endpoint and
displays that investigram's own composition, applying the same rule to its
sub-investigrams. Annotations identify the original and provide access to the
replacement chain. A corrected child appears in place under the old root, marked
as an update. When the root is replaced, corrected children from its old tree
are not spliced into the replacement tree. Disclose corrections in displaced
trees that are not shown, with references. An operation may correct both an
ancestor and a descendant; a node in a superseded tree remains a valid target.
Neither disclosure nor primary selection establishes that the replacement root
incorporates those corrections.

Presentation substitution creates no composition relationship. Original
investigrams, composition trees, and historical projections remain unchanged.
Correction links apply throughout the session; exact inspection exposes the
selected original. Separate investigations retain their exact subjects and
provenance. Repeating a follow-up displays its retained result with a
revised-subject context, without redirecting, reattaching, or regenerating it.
When that revision causes reconsideration, this disclosure presents the same cause
rather than adding a second independent warning.
Composition and provenance alone do not propagate corrections.

A follow-up targets the exact investigram reference supplied, including when it
is superseded. The interface warns and identifies its replacement without
redirecting the request or requiring confirmation. Original and replacement
subjects identify different retained requests. Summary redisplay can select
replacements, labeled with their own precise references; inspection exposes
superseded investigrams and their references. Display selection never changes the
referent of a precise reference.

Reference syntax is independent of these semantics. A path with a
version-distinct spelling can be a precise reference if its binding is stable. A
path or other selector can instead be a lookup handle, with zero, one, or
multiple matches. Missing and ambiguous selections remain explicit; lookup does
not silently prefer a replacement. Requests identify the resolved subject, not
merely the handle text.

The initial correction contract replaces one whole investigram with one
replacement investigram, optionally containing subparts. An operation may correct
several earlier targets. Competing accounts remain available without automatic
merging or erasure. This slice has no operation for declaring conflicting
accounts reconciled. Later corrections may improve the primary account while
recorded conflicts remain visible.

#### Rationale, alternatives, and consequences

Restricting correction to the immediate target misses findings that undermine a
prior summary's division of responsibility. Automatically replacing related
investigrams mistakes composition or provenance for logical implication. Editing
earlier prose erases the basis of existing interpretations and observed views.
Explicit targeted replacement supports upstream correction while preserving what
was actually asserted and why.

When a view presents one account, recency supplies a practical default. A newer
correction may incorporate more evidence or other investigations, but this is
not guaranteed: acceptance order is a display heuristic, not credibility.
Showing no account would withhold useful information. A conflict overview is
another presentation option; synthesizing agreement and differences would itself
require an investigation, not ordinary redisplay.

A sentence-level patch language or arbitrary many-to-many replacement could
express more cases but is not necessary to test this slice. Its detailed
encoding and indices are implementation choices. The mechanism does not
guarantee detection of every inconsistency or correctness of a revision.

### Record citation exposure and derive reconsideration status

Each investigram has a citation index of prior investigrams supplied to the
investigator during its generating evaluation. PostCode constructs it from actual
context supplied initially or in context responses, including traversal or
association queries. All investigrams produced by that evaluation share its
conservative exposure index; shared storage is permitted. A citation records
exposure, not endorsement, proven reliance, or independent corroboration. Merely discovering
an identifier without receiving investigram content does not constitute a
citation. Any substantive content from an investigram, including an excerpt or
descriptive listing, creates a citation. Correction eligibility requires its
complete retained prose, referent information, and qualifications; truncation or
omission of any of these is insufficient. Delivery may accumulate across
exchanges in the same dialogue.

Context delivery means PostCode supplying content to the investigator, initially
or in context responses, at any point during the current evaluation. Later
context trimming or summarization does not erase citations or revoke
delivery-based eligibility or exemptions. PostCode records what it supplies, not
the investigator's internal retention. Context delivery guarantees neither
continued availability nor comprehension; preservation or re-supply during
PostCode-managed trimming remains an implementation choice.

If B corrects A, A necessarily occurs in B's citation index, since correcting an
account requires receiving it first. Do not remove correction targets from the
index to suppress warnings.

When supplying a corrected investigram to the investigator, PostCode includes
the exact requested investigram with an explicit correction notice, replacement
accounts and correction reasons, and the applicable correction chain
and conflicting alternatives. This applies to initial context as well as
subsequent retrieval. Preserve exact identities; do not silently redirect the
request to the primary replacement. Replacement content actually delivered also
enters the citation index. If bounds prevent full delivery, disclose the omitted
content and permit further retrieval within the operation's limits. A notice or
reference alone does not count as delivery of the corresponding account or
complete correction context. Excerpt and descriptive-listing delivery follows
the same bounds rule: include at least a correction notice and replacement
references, disclose omitted correction context, and permit further retrieval.
Such exposure creates a citation but does not by itself establish complete
correction-context delivery.

Retain the identities of corrections for which both the target's and
replacement's own prose, referent information, and qualifications, together with
the correction reasons and qualifications, were fully supplied to the
investigator during the dialogue. Complete delivery does not require the target
or replacement's subordinate composition tree. A later correction of the
replacement is a separate cause and does not make delivery of the earlier correction incomplete.
Record completeness per correction so later session changes cannot
retrospectively make unseen corrections appear known. This records exposure, not
comprehension or agreement, and does not require investigator-reported
acknowledgment.

"Needs reconsideration" is a derived, session-scoped property of an investigram.
When a cited investigram is corrected, expose that status on the citing
investigram and propagate it transitively through citation indexes, subject to
the exemptions below. Preserve the causal graph and distinguish multiple
outstanding causes. Present causes within bounds, with access to further detail;
no enumeration or display of complete paths is required. Presentation may
identify proximal affected citations, corrected originals, or other useful
portions of the graph. Composition and investigation provenance alone do not
establish a citation or propagate this status. The investigram and its citation
index remain immutable; session-derived claims express its current
reconsideration status.

Display the qualification on affected accounts and expose its causes through
inspection and investigator context retrieval. It means that an account used
context that has been corrected, directly or through earlier interpretations,
and has not been reassessed against that change. It does not assert that the
account is wrong, remove it from use, invalidate the session, or trigger new
inference. Existing replacement selection and exact-reference behavior remain
unchanged.

The initial slice detects and discloses the condition but has no operation for
clearing it. Another `explain`, `decompose`, or `examine` operation does not
implicitly certify the old account. Explicit reconsideration is future work.

An investigram is exempt from a specific correction cause when its generating
evaluation either produced that correction or received its complete correction
context. This applies to every investigram produced by the evaluation, including
the reporting root, composition children, and all accompanying replacements.

For each cause, an investigram needs reconsideration if it cites that
correction's target or an investigram needing reconsideration for that cause,
unless it is exempt. Exemption applies at the investigram regardless of the
citation path, so that cause does not propagate through it. A later citer can
still inherit the cause through another, non-exempt citation. Other unseen or
later correction causes remain independent. Partial correction-context delivery
does not qualify for exemption. These rules leave citation indexes intact, do
not clear warnings on earlier investigrams, and do not certify comprehension or
confer a general "reconsidered" status.

#### Rationale, alternatives, and consequences

A corrected account may have influenced later interpretations even when it was
not their selected subject. Exposing those paths preserves qualifications that
direct revision warnings alone miss. Recording all investigrams supplied to the
investigator is verifiable; asking the investigator to report actual relevance may be more
selective but risks missing dependencies. The conservative policy can over-flag
incidental context. Assess citation breadth, apparent irrelevant inclusions,
correction frequency, and the burden of uncleared warnings before refining the
policy.

After explicit reconsideration exists, its frequency of "no change" outcomes can
provide another signal. Such outcomes do not prove irrelevant citations: a
relevant correction can leave a dependent conclusion unchanged. Reassessment
records and clearance propagation require separate design, preserving other
outstanding causes without claiming that downstream accounts were themselves
reassessed.

## Governing impact

The accompanying [core concepts](../core-concepts.md) add Investigram and
explicitly include investigrams among subjects, preserving Subject as a role rather
than an entity kind. They also extend Session reference stability to investigrams
and Projection to cover redisplay with retained revisions. The
[architectural constraints](../architectural-constraints.md)
add stable investigram-reference, composition, provenance, and revision rules.
Existing qualification and session decisions continue to govern. This record
extends inspection without superseding an earlier headed decision. The
[initial inspection decision](initial-module-inventory-decisions.md#begin-with-a-typescript-module-inventory)
establishes qualified inspection and initial module support, rather than an
exhaustive set of subject kinds or related information. Explicit subject
associations preserve its selected-subject meaning. They also respect the
[qualified-inspection requirement](transient-analysis-sessions.md#retained-domain-and-storage-boundaries)
that inspection returns selected subjects and applicable Claim context rather
than arbitrary store records. The
[standard-expansion decision](subject-kind-standard-expansion-decision.md#define-standard-expansions-for-kinds-of-subject)
defines related information by subject kind; it does not require that information
to be independent of session history. A standard expansion or an explicit related
section can therefore provide the declared investigram information without
changing those definitions.
