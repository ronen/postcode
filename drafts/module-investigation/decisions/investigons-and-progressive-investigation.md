# Investigons and progressive investigation

Status: in review
Decided: [needs-review — set adoption date at promotion]
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
sessions](../../../docs/decisions/transient-analysis-sessions.md) already retain
immutable information and stable references while additional analysis
accumulates. They explicitly leave interpretation augmentation and supersession
semantics to summary work. This record extends that model without requiring
persisted investigations, semantic identities across program states, or a
canonical model of program responsibilities.

Existing definitions of Entity, Subject, Claim, Evaluation, Lens, Projection, and
Session retain their meanings. The lens mapping below makes explicit how an
interpretation artifact can be a subject of further investigation while retaining
its program context. Interpreter execution is addressed in
[Interpreter execution and evidence access](interpreter-execution-and-evidence-access.md);
the broader facet definition is addressed in [Facets for subjects](facets-for-subjects.md).

## Decisions

### Represent retained interpretation as investigons

An **investigon** is an immutable, addressable artifact of program investigation
containing a qualified interpretation in prose, with referent information,
evidence context, and provenance. Investigons can contain broad, related claims
and have subordinate investigons; they need not express atomic propositions. An
account and a part of an account use the same concept, without requiring
separate domain types.

Each investigon retains or resolves to its generating operation, originating
program context, selected target where applicable, and supporting method and
qualification. Shared metadata is permitted when it remains attributable.
PostCode assigns retained identities and validates references. Generated prose
remains interpretation even when its references resolve and its structure
validates.

An investigon is not a program entity merely because it is addressable. Claim
content is the asserted information within it; Claim context qualifies that
content. Evaluation outcomes describe the attempt that produced it, including
failure or no materialized result. These distinctions do not prescribe separate
storage records for every sentence or require a new type system for every claim.

Investigation is the product activity; interpretation is the character of this
artifact's content. Organization and dependency operations also support
investigation, but their qualified mechanical projections are not investigons.
Projection remains the general lens-result concept. Mechanical results can
provide evidence or a starting point for an investigon without being converted
into prose artifacts.

#### Rationale and naming

A common retained unit supports repeated explanation, decomposition,
examination, and revision without an arbitrary boundary between a whole account
and a part. Broad initial units can be refined through use rather than being
atomized upfront.

The coined name **investigon**, plural **investigons**, names its role in
investigation while its definition preserves the interpretive character of its
content. It has a straightforward plural and evokes a particle: an immutable
unit that can be retained, referenced, and passed between operations. That
analogy concerns identity and lifecycle, not indivisible meaning or a guarantee
of truth. Decomposing an investigon produces new investigons without splitting
or modifying the original.

#### Alternatives and consequences

Arbitrary unstructured summary text lacks reliable follow-up targets and support
links. A formal semantic knowledge graph would impose precise meanings that this
slice does not establish. Investigons retain interpretable prose and qualified
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
naming associations, not claims about Latin derivation. Investigon's resemblance
to “investigation” can itself cause a reading stumble; the name remains the
working choice while terminology is evaluated in use.

### Separate program referents from interpretive focus

An investigon carries a free-form referent description intelligible to a fresh
interpreter request, originating module context, and optional structured
references to supported subjects. The description can concern several
collaborating entities or a source region rather than exactly one entity.
Structured references can support navigation; they need not exhaust the
description's meaning.

PostCode validates structured targets before exposing corresponding actions. A
valid target does not establish that the interpretation correctly attributes a
responsibility to it. An arbitrary ID in prose or the free-form description does
not acquire reference semantics. Referent and evidence remain different roles,
even where the same captured source region serves both.

Summary, explain, decompose, and examine are lenses, each producing a projection
containing a root investigon with optional subordinate investigons. Summary
selects a module. A follow-up selects an investigon as its subject, retaining
its underlying program context and referent description. Its prose is part of
the explicit interpretive input, not a mechanically established premise. A
projection records the selected focus, qualified resulting investigons, relevant
evaluation outcomes, and evidence/method context. A projection can select
investigons as result information, but an investigon is not synonymous with that
projection or its rendering.

`inspect(investigon)` exposes the retained artifact: its prose, referent
information, evidence, composition, provenance, and corrections.

Explain, decompose, and examine use the selected investigon's prose and program
context to focus further interpretation. Explain clarifies what the account
means; decompose identifies finer aspects of what it describes; examine
investigates its subject more deeply. Each may acquire additional evidence and
qualify or correct the original account.

The lens determines the question asked of the investigon as a subject; subject
status does not imply applicability of every lens.

#### Rationale, alternatives, and consequences

Using only a module ID loses the user's intended aspect. Requiring each aspect
to resolve to exactly one entity excludes distributed functionality and
introduces premature semantic modeling. Using prose alone loses program
grounding and useful navigation. Retaining both allows shared interpretation
machinery to operate on broad or narrow descriptions while preserving
traceability.

Keeping the module as the formal subject and making the investigon only a lens
parameter was considered. Selecting the investigon itself makes its role as the
human's chosen subject explicit, while retaining the module and evidence context
needed for analysis. Subject is a role, not another entity kind. This does not
turn conceptual background into an independent programming-tutorial subject.

### Associate investigons with subjects and select retained results

Investigons have explicit qualified associations with the subjects they
describe, allowing human inspection and interpreter retrieval by subject.
Originating investigation context, additional referents, and supporting evidence
are distinct roles. A source citation or prose mention is not automatically an
assertion that an investigon describes that subject. Association validation
establishes the referenced subject, not the correctness of the description.
Association records do not mutate the subject entity.

A replacement's associations are independent of its composition placement. It
remains associated with the subject whose account it corrects; other described
subjects require explicit attribution rather than wholesale inheritance of the
original's associations. Correcting an attribution from one module to another
can concern both modules.

Associated investigons are retained information about a subject rather than
unqualified intrinsic properties. This permits subject-oriented access without
introducing a new universal property schema. Inspection selects associated
accounts and their provenance, support, and revision state; it neither generates
missing interpretations nor adopts the most recent prose as truth. Several
investigations can yield different qualified accounts of the same subject.

The investigon section of `inspect(subject)` answers which retained investigons
explicitly describe that subject in the current session, with their support,
provenance, and correction context. Selection uses validated subject
associations, not incidental prose mentions or evidence citations. Its contents
depend on the session's investigation history as well as the selected subject.
New associated investigons or correction relationships can therefore change this
section on a later inspection. The mechanical determinism guarantee applies to
the mechanical portion of inspection, not to the generated content of associated
investigons.

An interpreter can retrieve such accounts on encountering a subject, even
outside its chain of prior investigations. The resulting context is explicitly
labeled as prior interpretation. Its provenance and supplied support remain
attributable; retrieval does not make it independently established evidence, and
repeated or circular reuse is not corroboration.

Projections for repeated requests explicitly select retained results and their
revision relationships. Later requests can construct new projections that prefer
explicit replacements without modifying original investigons or historical
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
model calls. An always-generate command hides a material cost and does not
provide stable access to accumulated understanding. Treating interpretations as
intrinsic model properties would obscure qualification and multiple accounts;
access restricted to investigation provenance would hide relevant work performed
through another investigative path.

The existing mechanically derived lenses retain their meanings. Adding
associated investigons to subject inspection is an explicit addition to its
presentation requirements, not a reason to broaden dependency or organization
populations. The inspection association can be implemented as a named standard
expansion or an explicit related-result section, preserving the declared
selection, qualifications, and no-inference behavior. Session-dependent
association selection is part of the declared inspection question; unrelated
accumulated work still does not broaden the view. No general change to Property,
Session, or mechanical determinism is made by this decision.

### Distinguish fixed composition from investigation provenance

One interpretation produces a root investigon with optional subordinate
investigons. Composition can have multiple levels; the entire composition tree
is fixed when retained. A subordinate investigon is part of that result, not a
later operation on its parent. All levels use the same investigon concept.

A later operation selecting an investigon as its subject produces a separate
root and composition tree. Its investigation provenance references the selected
subject and generating operation. The new root is not a composition child of
that subject. Reverse lookup can discover investigations performed on an
investigon without adding parts to it or changing its retained content.

Composition records the organization of one interpretation; investigation
provenance records how separate investigations build on selected subjects.
Neither relationship by itself establishes program containment, delegation,
execution order, or logical dependence. Claims about constituent functionality
require their own support.

The interpreter can traverse composition to understand surrounding and
subordinate parts, and provenance links in either direction to inspect prior and
subsequent investigations. A reference continues to identify the same investigon
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

An investigon may carry accompanying corrections and unresolved inconsistencies
as immutable content. Each correction identifies a previously retained target,
carries a new replacement investigon, and records its reason and evidence
context. Each replacement is constructed through its correction, with a
composition tree disjoint from the reporting investigon's composition tree. This
is a construction invariant, not a restriction on which program aspects can be
described. The replacement's provenance identifies the actual generating
operation and selected subject.

Each investigon occupies at most one composition position across all trees in
the result.

Replacement investigons may themselves carry corrections. Every correction
target must have been retained before acceptance of this operation's result; it
cannot be another investigon produced by the same operation. This separates new
replacements from their targets' composition and prevents same-result correction
cycles. The entire result, including recursively accompanying corrections, is
validated and accepted together. Corrections take effect on acceptance, not
display.

The target's retained prose, referent information, and qualifications must have
been delivered in full during the current interpreter dialogue, initially or through
permitted context retrieval. PostCode checks actual delivery; a known or reachable
identifier alone is insufficient. Targets need not belong to the selected
subject's composition or provenance chain.

#### Conflicts and primary selection

A correction targeting an already superseded investigon, or competing with
another correction, does not invalidate an otherwise valid result. Retain its
replacement and mark the conflict. Where a presentation selects one account, the
default is the endpoint produced by the most recently accepted correction among
all endpoints reachable from the displayed investigon through explicit
correction links. Selection considers every branch, not only direct corrections.
For example, after A → B, A → C, and then B → D, display selects D rather than
C. Simultaneously accepted alternatives require a stable presentation tie-break,
whose form is an implementation choice. Selecting a primary account does not
resolve the conflict. A newer correction alone does not establish that it
addresses intervening corrections.

An unresolved inconsistency without an asserted replacement is also accompanying
content, referencing the affected investigons. Inspection of the reporting and
affected investigons exposes it, and redisplay flags it. PostCode validates
structure and references; semantic inconsistency remains an interpretive
judgment. A missing target or other structurally invalid reference still rejects
the unit.

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
displays that investigon's own composition, applying the same rule to its
sub-investigons. Annotations identify the original and provide access to the
replacement chain. A corrected child appears in place under the old root, marked
as an update. When the root is replaced, corrected children from its old tree
are not spliced into the replacement tree. Disclose corrections in displaced
trees that are not shown, with references. An operation may correct both an
ancestor and a descendant; a node in a superseded tree remains a valid target.
Neither disclosure nor primary selection establishes that the replacement root
incorporates those corrections.

Presentation substitution creates no composition relationship. Original
investigons, composition trees, and historical projections remain unchanged.
Correction links apply throughout the session; exact inspection exposes the
selected original. Separate investigations retain their exact subjects and
provenance. Repeating a follow-up displays its retained result with a
revised-subject context, without redirecting, reattaching, or regenerating it.
When that revision causes reconsideration, this disclosure presents the same cause
rather than adding a second independent warning.
Composition and provenance alone do not propagate corrections.

A follow-up targets the exact investigon reference supplied, including when it
is superseded. The interface warns and identifies its replacement without
redirecting the request or requiring confirmation. Original and replacement
subjects identify different retained requests. Summary redisplay can select
replacements, labeled with their own precise references; inspection exposes
superseded investigons and their references. Display selection never changes the
referent of a precise reference.

Reference syntax is independent of these semantics. A path with a
version-distinct spelling can be a precise reference if its binding is stable. A
path or other selector can instead be a lookup handle, with zero, one, or
multiple matches. Missing and ambiguous selections remain explicit; lookup does
not silently prefer a replacement. Requests identify the resolved subject, not
merely the handle text.

The initial correction contract replaces one whole investigon with one
replacement investigon, optionally containing subparts. An operation may correct
several earlier targets. Competing accounts remain available without automatic
merging or erasure. This slice has no operation for declaring conflicting
accounts reconciled. Later corrections may improve the primary account while
recorded conflicts remain visible.

#### Rationale, alternatives, and consequences

Restricting correction to the immediate target misses findings that undermine a
prior summary's division of responsibility. Automatically replacing related
investigons mistakes composition or provenance for logical implication. Editing
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

Each investigon has a citation index of prior investigons delivered to the
interpreter during its generating evaluation. PostCode constructs it from actual
context delivery, including initial context and traversal or association
retrieval. All investigons produced by that evaluation share its conservative
exposure index; shared storage is permitted. A citation records exposure, not
endorsement, proven reliance, or independent corroboration. Merely discovering
an identifier without receiving investigon content does not constitute a
citation. Any substantive content from an investigon, including an excerpt or
descriptive listing, creates a citation. Correction eligibility requires its
complete retained prose, referent information, and qualifications; truncation or
omission of any of these is insufficient. Delivery may accumulate across
exchanges in the same dialogue.

Delivery means exposure at any point during the current evaluation. Later
context trimming or summarization does not erase citations or revoke
delivery-based eligibility or exemptions. PostCode records what it supplies, not
the interpreter's internal retention. Delivery guarantees neither continued
availability nor comprehension; preservation or re-supply during
PostCode-managed trimming remains an implementation choice.

If B corrects A, A necessarily occurs in B's citation index, since correcting an
account requires receiving it first. Do not remove correction targets from the
index to suppress warnings.

When delivering an investigon that has been corrected, PostCode supplies the
exact requested artifact together with an explicit correction notice, the
replacement accounts and correction reasons, and the applicable correction chain
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
the correction reasons and qualifications, were fully delivered during the
dialogue. Complete delivery does not require the target or replacement's
subordinate composition tree. A later correction of the replacement is a
separate cause and does not make delivery of the earlier correction incomplete.
Record completeness per correction so later session changes cannot
retrospectively make unseen corrections appear known. This records exposure, not
comprehension or agreement, and does not require interpreter-reported
acknowledgment.

"Needs reconsideration" is a derived, session-scoped property of an investigon.
When a cited investigon is corrected, expose that status on the citing
investigon and propagate it transitively through citation indexes, subject to
the exemptions below. Preserve the causal graph and distinguish multiple
outstanding causes. Present causes within bounds, with access to further detail;
no enumeration or display of complete paths is required. Presentation may
identify proximal affected citations, corrected originals, or other useful
portions of the graph. Composition and investigation provenance alone do not
establish a citation or propagate this status. The artifact and its citation
index remain immutable; session-derived claims express its current
reconsideration status.

Display the qualification on affected accounts and expose its causes through
inspection and interpreter context retrieval. It means that an account used
context that has been corrected, directly or through earlier interpretations,
and has not been reassessed against that change. It does not assert that the
account is wrong, remove it from use, invalidate the session, or trigger new
inference. Existing replacement selection and exact-reference behavior remain
unchanged.

The initial slice detects and discloses the condition but has no operation for
clearing it. Another explain, decompose, or examine operation does not
implicitly certify the old account. Explicit reconsideration is future work.

An investigon is exempt from a specific correction cause when its generating
evaluation either produced that correction or received its complete correction
context. This applies to every investigon produced by the evaluation, including
the reporting root, composition children, and all accompanying replacements.

For each cause, an investigon needs reconsideration if it cites that
correction's target or an investigon needing reconsideration for that cause,
unless it is exempt. Exemption applies at the investigon regardless of the
citation path, so that cause does not propagate through it. A later citer can
still inherit the cause through another, non-exempt citation. Other unseen or
later correction causes remain independent. Partial correction-context delivery
does not qualify for exemption. These rules leave citation indexes intact, do
not clear warnings on earlier artifacts, and do not certify comprehension or
confer a general "reconsidered" status.

#### Rationale, alternatives, and consequences

A corrected account may have influenced later interpretations even when it was
not their selected subject. Exposing those paths preserves qualifications that
direct revision warnings alone miss. Recording all delivered investigons is
verifiable; asking the interpreter to report actual relevance may be more
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

## Governing impact and promotion

The accompanying [core concepts](../core-concepts.md) add Investigon and
explicitly include investigons among subjects, preserving Subject as a role rather
than an entity kind. The [architectural constraints](../architectural-constraints.md)
add stable investigon-reference, composition, provenance, and revision rules.
Existing qualification and session decisions continue to govern. This record
does not supersede an earlier headed decision.

At adoption, set the decision date, update canonical indexes, and rewrite links
for their destination paths.
