# Structured architectural accounts: working proposal

Updated: 2026-11-15

Exploratory working proposal, not an adopted decision or implementation authorization.
The design organizes accounts through Entities, association declarations and Query results,
with immutable investigram contributions. Supersession acts on exact associations rather than
entire investigrams. Governing documents and the implemented application still use their existing
model; their revision requires the later planning package. Historical discussion remains in the [discussion notes](structured-architectural-accounts.md).

Read the [consolidation](structured-architectural-accounts-consolidation.md) for the
ownership maps, the [walkthrough](structured-architectural-accounts-example.md) for the
worked thread, and the [fixture guide](structured-account-example/README.md) for exact
payloads and executable checks. Consequential architectural decisions and the promised capability
should be settled here before drafting. Detailed schemas, API shapes and operational bounds need
not be settled merely to make a fixture executable. Provisional fixture choices are reviewable
examples, not silently adopted policies; see the design/implementation boundary below.

## Purpose and first scope

Successive investigations should reuse, extend, challenge and reorganize qualified
architectural understanding. Preserve evidence, limitations, conflicts and exact earlier
information. Organize multiple accounts rather than maintain one reconciled model.

The deliverable is the new mechanism, including the agreed staged migration of existing
mechanical architectural information and existing agentic capabilities. This plan does not select the initial user-facing
investigation catalogue or mandate a particular user journey.

The selected architectural capability is explaining **state-dependent behavior**, including
qualified states, conditions, transitions and effects, with retained content sufficient for a state
diagram. Entity and relationship identification/description belong to the common mechanism rather
than a separate generic explanatory capability. This one concept supplies varied referents and
content for exercising identity reuse, associations, qualification, follow-up and revision.

The Cockatiel admission → trial → correction thread remains a worked example and candidate
validation scenario, not a required user journey. Interaction and composition remain design probes;
they are not additional required implemented concepts or diagram types. Add another concept only
if a specific mechanism requirement cannot be exercised by the selected one. This accepts that the
first delivery will not demonstrate catalogue extension across substantially different concepts.

Validation should combine **a few focused live-agent integration trials** with **controlled dialogs
to provide systematic mechanism coverage**. The live trials check that important instructions
communicate their intent through the real integration and also supply smoke-test coverage; no
separate live smoke-test suite is required. Cover consequential optional actions such as
follow-up options, illustrations, reported inability, association addition,
supersession and withdrawal, and reuse of another investigation's content. Do not depend on an
agent spontaneously choosing every action. Once an action is produced, its processing must satisfy
the contract; absence of an optional action is not itself a mechanism failure. Explicitly requested
content remains subject to the request's fulfillment requirements.

Taken together, live-agent checks must demonstrate successful production of qualified structured
state-behavior content, retention and retrieval supplying the required diagram, and execution of a
retained follow-up option through the supported application boundary, acquiring and referencing
retained information. A failed run can exercise outcome handling but does
not substitute for demonstrating the successful integration path.

Keep live checks tolerant of agent evolution, even for an invariant system under study. Assert
contract fulfillment, reference integrity, preserved qualification/provenance and the demonstrated
workflow rather than an exact expected answer. Wording, investigator-chosen local keys, decomposition,
optional content and valid diagram structure can vary within the requested semantic scope and contracts.
Do not freeze one agent's answer as a golden payload or image. This tolerance does not excuse missing
required data or broken references. Controlled dialogs can use fixed payloads and precise expected
mechanism effects; detailed live scenarios and checks remain planning/implementation work.

Include an explicit result-contract case requesting a state diagram, distinct from an optional
illustration. Validate successful fulfillment from retained structured content,
otherwise valid contributions that leave the diagram requirement unmet, and producer-reported
inability to fulfill it. Accepted content and association effects receive normal processing even
when the request is not fulfilled; prose alone does not silently satisfy the diagram contract.
This exercises contract handling within the selected concept, not another architectural capability.
Include one real supported state-diagram catalogue entry, its input contract and a minimal renderer.
Planning specifies the notation and bounded semantic coverage. An injected test catalogue may help
check registration, compatibility and dispatch, but cannot substitute for demonstrating that retained
content supplies the meaning of this real diagram. A polished presentation system is not required.
SLICE may select, refine, supplement or replace this diagram for the initial offering. Catalogue
injection, exact request packaging, rendering integration and test arrangements remain implementation
choices within that requirement.

“Plausibly useful” is a sanity check on the representative architectural application, not a separate
acceptance criterion. Keep a recognizable investigative purpose rather than meaningless examples;
controlled responses may deliberately exercise unusual cases, failures and invalid submissions.
Neither proving user value nor evaluating broad interpretive ability is an acceptance requirement.
Test harnesses, mocking arrangements, exact scenarios and live-run procedures are implementation
choices. Planning identifies observable mechanism coverage without prescribing those details.

Rendering should demonstrate that retained content supplies architectural meaning rather than
inventing it. Real production and application access must validate the mechanism within the supported
Session alongside controlled coverage. The separate [SLICE step](upcoming-work.md#slice) selects
the initial user-facing offering using the demonstrated capabilities and limitations. No persistence,
GUI, general navigation, global operation catalogue or universal ontology is included by implication.

<a id="representative-capability-access"></a>
## Access to the representative capabilities

Deliver state-dependent-behavior investigation and retained follow-up-option execution through the
supported application API, with declared Lens/method subject signatures and result contracts. Use
normal application resolution, execution, retention and exact access, not a test-only bypass into the
producer. Existing Lenses may be extended or additional methods registered as needed; the concrete
names and registry packaging are implementation choices. The live trials exercise this supported
route and a compatible Presentation for the retained state-diagram content.

A new CLI command, menu entry or initial user-facing Lens catalogue is not required for these
representative capabilities. Existing CLI capabilities still migrate as already specified. The
planning package describes the new API-level capabilities in the application specification and
capability reference, and documents their actual supported route and limitations. Update CLI reference
material for migrated behavior or any route actually provided; do not advertise new CLI access solely
because an API exists. SLICE chooses the initial offering. This separates a real supported capability
from the later product catalogue without requiring a private experimental implementation.

## Agent instructions and focused live trials

Implementation should author explicit agent instructions for the following agreed obligations and
map them to a small set of focused live trials. This inventory consolidates the design-level rules;
it is not final prompt wording, a universal agent benchmark or one mandatory standalone test per instruction.
Supported schema/tool contracts supply the detailed protocol instructions. Multiple obligations can
be exercised in one trial, and optional actions can be deliberately elicited rather than left to chance.

| Instruction to author | Focused live observation |
| --- | --- |
| **Honor the requested result contract.** Use supported content types and supply required structured information; report inability or incompleteness when appropriate. | An explicit diagram request supplies compatible qualified content or an explicit unmet outcome, rather than prose presented as fulfillment. The trials collectively demonstrate the successful path, not only failure reporting. |
| **Maintain identity deliberately.** Reuse supplied Entity IDs for the intended referents; explicitly introduce new things with identifying information. Matching names alone do not establish identity. | A follow-up reuses a known intended referent; similarly named distinct things are not automatically conflated. Ambiguous identity remains qualified rather than guessed as certainty. |
| **Ground and qualify claims.** Distinguish source evidence, mechanical findings and earlier interpretations; preserve applicable basis, method and scope limitations. | Evidence and qualifications accompany the claims they support. Earlier interpretation is not presented as mechanically verified fact merely because it was retained. |
| **Acquire the information needed for the action.** Before supersession or withdrawal, acquire the target's complete designated content, qualifications and required support, including semantic dependencies. An address or notice alone is insufficient. | From deliberately limited initial context, the agent requests the material needed before proposing displacement. Recorded acquisition can be inspected without introducing a production acceptance gate for semantic completeness. |
| **Express organizing changes explicitly.** Distinguish addition, supersession and withdrawal; address exact associations and explain displacement with qualified grounds. | The declaration matches the intended change and its explanation. Conflicting accounts are not silently treated as agreement; a new reconciliation or correspondence claim requires its own qualified analysis. |
| **Report unresolved inconsistency precisely.** Acquire and understand the substantive information being compared; identify exact conflicting content items or associations and explain the qualified disagreement. | A scoped comparison targets the intended items/uses rather than whole investigrams or similarly named content. A qualified excerpt may suffice; the report does not silently displace either side. |
| **Preserve meaning when reusing or partitioning content.** Reference unchanged content with its original ownership and qualification; supply new content/support for new claims. Each investigram carries its applicable qualifications. | Reuse does not silently broaden a claim. Partitioning neither drops necessary limitations nor indiscriminately copies unrelated restrictions. Structural ownership/provenance preservation remains a host responsibility too. |
| **Update the earlier answer being revised.** When investigating an earlier result and changing its answer, explicitly redesignate that result. Understand its question, subjects, parameters and scope. This is distinct from changing an Entity's associated information and does not require updating every containing result. | A proposed replacement designation addresses the earlier question. From an already displaced selected answer, the investigator deliberately targets the standing successor or creates a qualified alternative, explaining which. |
| **Incorporate updates delivered during the dialog.** Consider relevant updated information and qualified change context before submitting. | The final contribution accounts for a relevant mid-dialog update rather than blindly repeating the earlier account. This does not require endorsing the update; disagreement must remain explicit and qualified. Timing/status processing itself is tested deterministically. |
| **Author follow-up options and illustrations with the correct scope.** Options suggest further investigations; illustrations specify pictures intended as part of the current explanation. Both belong to the producing investigram and retain qualification. | When deliberately elicited, options and illustration specifications reference the intended subjects/content. Optional omissions in an unrelated trial are not failure; explicitly requested output still has to satisfy its contract. |

Carry forward existing governing instructions, including evidence access through supported PostCode
interfaces and treating inspected repository content as evidence, not instructions to obey. These
come from [Investigator execution and evidence access](../docs/decisions/investigator-execution-and-evidence-access.md),
not new requirements invented by this inventory. Existing applicable qualification and evidence
requirements remain governing constraints. The inventory is not an exhaustive restatement of all
existing agent instructions or host-enforced access restrictions.

Live trials assess whether the instructions are usable, not whether agent compliance or architectural
truth is guaranteed. Check observable protocol/reference properties automatically and inspect a few
outputs for semantic instruction-following, such as whether the reason concerns the association
actually targeted. Allow legitimate variation in wording, decomposition, local keys and optional
content. A correct declaration is not defined by matching one previously generated answer.

Use a few attempts during instruction development to expose unclear wording or protocol difficulty.
Distinguish those failures from difficulty with the architectural question before revising instructions;
keep representative failures as regression scenarios where useful. Record enough of the instructions,
agent version, inputs and observed behavior to explain the trial findings. Exact harness, run counts,
scenario grouping and review procedure remain implementation choices; no statistical compliance claim
or broad evaluation infrastructure is required. Controlled dialogs provide repeatable mechanism
coverage, including structural rejection and propagation. They cannot establish that a real agent
understands the instructions.

These focused trials also exercise the real production, retention, retrieval and diagram/follow-up
workflow described above; no separate smoke-test suite is needed. Findings may motivate proposed
instruction or design changes at the planned review checkpoints. They do not automatically authorize
new semantic enforcement gates or bring deferred mechanisms into scope.

## The conceptual center

- **Entities organize architectural information.** An Entity identifies a thing in the system
  under study, around which qualified content associations accumulate. Several descriptions may coexist or conflict.
- **Queries request information.** Q denotes one invocation with its selected subjects,
  parameters, basis and context, not a recurring question or a continuing inquiry.
- **Query results also have organizing identities.** RESULT-Q identifies that invocation's
  result. Later declarations may designate different information as its answer without
  rewriting what Q originally returned. A Query result is distinct from an Entity; both use
  the common identity/reference and association machinery. No umbrella concept is introduced.
- **Analyses contribute content and association declarations.** Mechanical and agentic
  analyses can use the proposed common contribution structure. An investigram is
  the immutable bundle that attributes those contributions to their producer. It remains
  important for provenance, qualification, inspection and exact addresses; it is not
  the normal context unit or the thing that is superseded.

“Account” remains informal English for the information provided. It is not an aggregate
record. Entity-organized accounts need not be complete, consistent or canonical. Content,
association declarations, qualified relationships and exact selections remain distinct.

<a id="reading-conventions"></a>
## Reading conventions

- **Standing** records whether an exact association remains undisplaced or which later declarations
  displace it. **Displaced** does not mean deleted, false, or replaced in every use. Content keeps its
  original provenance; other associations to it retain their own standing.
- A **result designation** is an association selecting exact content/declarations for a particular
  Query result. A captured engine selection is a qualified delivery of that selection, not an outer
  application Projection. A Lens determines its answer under its existing contract and captures that
  answer in a Projection; neither kind of immutable capture changes when standing changes.
- **Guidance** is collective shorthand for investigram-owned follow-up options and illustrations,
  not a third metadata mechanism. A **context entity/result** is the identity used to organize a
  particular context request, not an assertion that everything about it was delivered.
- Q labels an engine invocation. Fixture reports call invocation-level cause summaries `evaluations`;
  those are unions of per-investigram production concerns, not a redefinition of the governing
  application Evaluation or an exposure unit shared by independent producers. The fixtures do not
  prescribe how application operations map to producer executions.

The [consolidation vocabulary](structured-architectural-accounts-consolidation.md#working-vocabulary)
gives the remaining terms. Example labels are local: P is Circuit Breaker, S is Half-open, R is one
scenario's breaker instance; ADMISSION/TRIAL name immutable investigram contributions. Exact field
spellings and report counts illustrate the mechanism rather than define the product API.

## Identity and reuse

Reuse means reuse as a referent: “this account concerns the previously identified thing.”
It does not endorse an earlier description. An investigation explicitly introduces a new
entity with a submission-local key; PostCode allocates a stable ID at acceptance. Existing
IDs are reused explicitly. A name, topic or local diagram key does not deduplicate identity.
A selected passage is an input, not an automatic entity introduction. Later investigation
may introduce an entity grounded in it; a structured origin field remains an unexercised
extension, not proof of equivalence.

Descriptions, names, classifications and behavior are qualified content, not authoritative
fields on an entity. Correcting or displacing a description does not delete its entity or
retarget the ID. Independent discovery may produce two IDs for the same architectural
thing; qualified correspondence is needed to say so. A conflation cannot be silently fixed
by making the old ID denote whichever part seems preferable.

<a id="identity-findings-with-existing-mechanisms"></a>
For this capability, existing mechanisms are sufficient for duplicate or conflated identities.
Retain qualified correspondence claims between independently introduced IDs. For a conflated
entity, introduce distinct entities and explain their relationship to the original; use ordinary
association additions, supersessions or withdrawals for specifically justified changes. Original
IDs, content and histories remain inspectable. No dedicated merge/split operation or content type
is required merely to express those findings.

Defer automatic ID aliasing, pooling or reassignment of associations, entity-level supersession
and propagation triggered specifically by identity changes. A correspondence claim does not
silently make two IDs interchangeable or transfer their information. Choosing how to present
these histories and relationships may be awkward, but that is later UI work and does not require
more organizing machinery in this capability. These are supported uses of the proposed mechanisms,
not a claim that a new executable merge/split probe has been completed.

Mechanical and agentic producers share identity/reference and qualified-information
semantics without identical storage or guarantees. Mechanical provider identity must retain
its deterministic captured-basis/Session behavior. Do not mint fresh IDs merely on repeated
encounter, or parallel architectural module IDs just to investigate a module. Mechanical
claims can be content in the proposed generalized investigram, without artificial interpretive
prose or agent provenance. The admission/trial fixtures seed compatible module/policy references; the separate
[unification probe](structured-account-example/unification/README.md) exercises authored
mechanical contributions. Live producer integration remains unverified.

Architectural relationships and ordered patterns may be explicitly identified as entities.
Not every edge becomes an entity. A relationship identity does not assert occurrence,
participants or conditions; those remain qualified claims. This eligibility requires governing
clarification beyond interpreted identity. Query results are separate organizing identities, not
another Entity kind: an Entity denotes something in the system under study, whereas a Query result
organizes answers to a particular invocation. Their shared machinery does not erase that distinction.

Keeping a continuing Query result identity permits a later investigation to designate an updated
answer to the earlier question, without replacing its investigram or inferring an answer from all
information about its architectural subjects. For example, descriptions of a breaker collectively
need not answer a particular question about concurrent callers. Redesignation retains that question-
specific organization. The alternative of broadening Entity to include query results was considered;
it would still need a structural distinction for result-designation rules. Prefer separate concepts
with shared association behavior, without a new named umbrella type. Common internal types/storage
remain implementation choices; an umbrella term can be introduced later if recurring usage warrants it.

<a id="mechanical-and-interpreted-contributions"></a>
## Mechanical and agentic production of contributions

Working direction: generalize Investigram from an interpretation artifact to an immutable,
qualified analysis contribution bundle. Mechanical and agentic producers can contribute
content and association declarations through common organizing machinery. Method, captured basis,
evidence, scope and guarantees remain attributable; common packaging does not confer one producer's
guarantees on another's claims. "Interpretation content" would need a broader governing definition
and name: **Analysis content**, as agreed here. No adopted document is changed by this recommendation.

<a id="investigation-and-execution-vocabulary"></a>
Working vocabulary: **investigation** is the architectural inquiry; **analysis** is work performed
within it; **interpretation** is explanatory judgment or inference; an **investigram** retains a
qualified analysis contribution. **Mechanical** and **agentic** distinguish mechanisms for creating
investigrams, not two kinds of artifact or guarantees. They are current examples, not an exhaustive
taxonomy: hybrid or other future mechanisms can produce the same qualified contribution type.
The common model must not require every producer to be classified as exactly one of these two.
Use **investigating agent** for the agent
participating in the dialog, rather than making every provider implement an agent interface.

The operational boundaries remain distinct: an **agentic analysis runner** manages agent dialog,
tools, limits and submissions; a **mechanical analysis provider** executes source-analysis operations
behind its provider boundary. Both feed common data-integrity/retention contracts. These component
names are working terminology, not an adopted code rename or a requirement for one execution API.
An investigation can use either mechanism or both. If an agent requests mechanical analysis, the
mechanical contribution keeps its own producer attribution; reuse does not relabel it agentic.
An agent's additional interpretation has its own attribution. In the probe, `producer.kind`
records `mechanical` or `agentic`; claim method, evidence, scope and guarantee remain separately
attributable. Those two accepted values bound the current fixture, not the conceptual model.
Supporting another mechanism requires its method attribution and execution integration, not a new
kind of investigram. A hybrid label alone would not replace attribution of the actual contributing
methods. No hybrid execution contract is specified in this capability. Mechanical/agentic alone does not establish
correctness, completeness or observation.

The shared definitions do not erase differences in epistemological capability. For supported
questions, a mechanical method can establish verified facts within its stated captured basis,
assumptions and scope. Agentic interpretation does not independently provide that verification
guarantee merely by reaching or asserting a conclusion. An agent can use or relay mechanically
verified information; its verification remains attributable to the establishing method. These are
capabilities and guarantees of the particular mechanisms/methods, recorded in their contracts and
claim qualifications, not restrictions built into the definitions of investigation or investigram.
Neither all mechanical output nor every claim in a mechanically produced bundle is thereby verified.

Either kind of analysis may enhance, qualify, challenge or supersede information from the other.
For example, mechanical analysis may establish statically resolved module dependencies while an
agentic investigation identifies a runtime dependency through a dynamic loader or configuration.
That can add complementary qualified information about the same modules without displacing a valid
static-dependency association. If an earlier contribution claimed exhaustive dependency coverage,
the new finding may instead warrant explicit supersession of that association. Whether it does is
a substantive analysis judgment, not a consequence of producer type. An inferred runtime dependency
retains its conditions and evidence; it is not silently represented as an observed execution.

A replacement based on interpretation retains the interpreting method's provenance and guarantees;
a mechanical replacement of interpreted information retains its own method guarantees. Neither
erases the earlier contribution or inherits its epistemic status by occupying a similar role.
Later mechanical discovery can also extend an interpreted account without alleging an error.
Fuller prose alone warrants addition alongside a valid mechanical finding, not its displacement.
When supersession is justified, its qualified grounds should explain material changes to method,
scope or guarantee; the notice delivers those grounds and preserves the exact old/new qualifications.
Defer a minimum-guarantee selector: scoped guarantees do not form a universal ordered scale.

An investigram is not necessarily the atomic acceptance boundary: a contribution submission may
contain several investigrams. Mechanical analysis may produce reusable contributions incrementally;
unification need not require an entire analysis to finish atomically. Evaluation outcomes remain
separate, including incomplete work, failure and established empty results. Existing mechanical
identities and deterministic reuse must be preserved, without duplicate entity creation on access.

The human explicitly prefers sound design over preserving the existing split to avoid migration
work. Pre-release document and implementation changes are not a compatibility constraint. The
[worked unification](structured-account-example/unification/README.md) maps authored module
discovery, later export/symbol contributions and source-dependency analysis into the common model.
An interpreted conditional target complements the mechanical indeterminate target. The authored
stages distinguish the mechanical finding from an agentic declaration selecting it in place of an
earlier inference. A fuller interpreted explanation is an addition alongside the mechanical
finding, preserving its current availability and guarantee.

The probe supports this direction and identifies three concrete requirements:

- Identifying content can be structured mechanical information rather than a mandatory prose
  description. Supported identifying content types still resolve explicit introductions and carry
  qualifications. Before acceptance, host/provider identity resolution binds repeated native
  identities within supported scope to existing entities. The analyzer need not inspect Session
  state. Native keys differ from common IDs. A genuinely different provider identity scope can
  allocate fresh common IDs without implied correspondence; fresh common-ID collisions still fail.
  Equivalent recomputation reuses the established qualified contribution even when its association
  has been displaced; recomputation alone does not add a new association or restore its standing.
  Host equality/reuse is not analyzer delivery and must not invent exposure. Changed inputs,
  methods or findings may warrant new contributions. The probe exercises reuse after both
  supersession and withdrawal, preserving standing and disclosures without automatic renewal.

- Provenance must retain the actual producing method and basis per contribution. Selecting content
  from different producers must not flatten it to one method, basis or guarantee. The shared probe
  permits host-attributed provenance per investigram within one acceptance. Computing a target
  and deciding to displace an earlier inference are separately attributed, even in one submission.
  An explicit deterministic organizing policy could also author a declaration under its own method.
  The organizer's association alone can make the mechanical item reachable across the submission;
  a second association owned by the mechanical bundle is unnecessary. A later investigation that
  rejects the organizing use while keeping the finding withdraws that association and adds a new
  association to the original item, retaining its provenance/guarantee. Restoring use of the earlier
  interpretation likewise requires an explicit addition, not reversal of its displacement. Selection-only basis names
  retained inputs actually used, not source it did not read. When source is also supplied and cited
  (Q-R), capture both source and retained inputs. Original source bases remain with selected items.
  Older fixtures retain their single fixed basis.
- Evaluation/outcome, contribution, query result and selected answer remain distinct. An established
  empty export surface is content; unavailable analysis does not manufacture that content. Reusing
  an existing answer does not allocate another result. One public request may involve several
  methods; not every internal compiler phase needs a public query result.

Four small content contracts, six provider re-encounter branches, organizing withdrawal-plus-
addition/restoration, independent production-exposure histories and thirty-three malformed cases are exercised. No native provider, live investigator or proposed constant-target method was run.
Production content contracts, actual coordinated execution, detailed stage boundaries and full
partial/failure result handling remain planning work. First native verification separates two paths:
assembling an export answer from retained findings and module naming must preserve qualification,
exact selection and available standing without creating production exposure; an actual producer
receiving retained information and contributing an investigram must record its qualified input and
respond to later applicable displacement. Use an agentic investigation receiving mechanical module
information for the latter integration case. Include native identity re-encounter separately.
A method-specific Lens must preserve its question and guarantee, rather than simply
selecting the latest description of its subject. Both mechanical and agentic contributions use
the common investigram structure without flattening their different guarantees.

### Mechanical analysis wrapper and contribution reuse

The mechanical wrapper resolves native identities, attributes method/basis/evidence/guarantees,
constructs supported content and declarations, records retained input actually supplied, and uses
the common acceptance boundary. Mechanical findings do not themselves decide their organizing use;
that decision belongs to explicit wrapper/organizing policy. This is a responsibility boundary,
not a prescribed class or execution interface.

Agreed rule: equivalent recomputation under the same effective inputs and method reuses the
established qualified contribution without automatically renewing a displaced or withdrawn
association. A cache miss, provider re-encounter or unrelated operation must not by itself make
that information current again. Preserve existing association standing and history. Retrieving or
returning the method's finding is distinct from adding an association; do not invent prior analyzer
exposure to justify reuse. Changed inputs, methods or findings may warrant new contributions.
Deliberate reassertion would require an explicit organizing action, not an incidental recomputation.

The authored unification adapter exercises this rule, including displaced-identification reuse,
unchanged current selection and disclosure through result membership. No automatic provider-
suppression mechanism follows.

<a id="lens-answer-and-standing"></a>
### Lens answers and available standing

A Lens returns what its declared question and method ask for. A method-specific question returns
that method's findings, preserving their captured basis, evidence and guarantees. Subsequent
association displacement or result redesignation does not silently substitute another method's
claims. For example, statically established dependencies remain the answer to a static-dependency
question even when an agent contributes a different runtime-dependency account.

The returned information always has complete applicable displacement, standing, reconsideration
and qualified history available to the application, with exact references and access to the
associated grounds. This is required information availability, not an optional disclosure based on
producer kind. Presentation decides how to communicate it; no new warning system or particular UI
is prescribed. Availability may use linked access rather than embedding all historical content in
every payload. Exact captured answers remain immutable; fresh status is distinguishable from their
captured qualification and standing.

A Lens whose question asks for currently designated retained answers selects through designations,
including all equally standing alternatives. That rule does not override a method-specific question.
Engine Query results and redesignations can organize information without determining every Lens's
answer selection. This distinction follows the question, not a mechanical-versus-agentic division.

Displacement does not rewrite a finding, renew its association, erase its method guarantee or by
itself establish a new reconsideration cause. Cause-specific exposure and timing rules still apply;
existing concerns remain available without claiming reassessment or clearance. Migration preserves
existing answer guarantees and explicitly maps these distinctions into the application contracts.

<a id="answer-assembly-and-production-exposure"></a>
### Answer assembly does not create production exposure

Exposure is captured with each investigram's actual producing execution. Lens answer assembly,
exact retrieval and presentation select or arrange already retained information; those actions do
not by themselves produce an investigram or add to any investigram's exposure history. Reading a
retained module name to construct an export Projection is answer assembly, not an example of a
mechanical producer consuming that claim to produce a new finding.

Answer assembly captures the selected information, qualification and standing under the Projection
contract. Applicable later displacements and concerns remain available through fresh qualified access,
separate from an immutable earlier capture. Neither assembly nor status inspection manufactures a
production cause or transfers the assembler's reads to the original source producer. Existing
result-membership causes and concerns of the selected contributions remain available; this distinction
does not suppress them.

When an agentic or mechanical producer actually receives retained information as analysis input and
contributes an investigram, that production records the actual exposure. A single application request
can coordinate both production and assembly, but their responsibilities remain distinct. Determining
new claims, qualified correspondence or organizing declarations is production even when deterministic;
it must not be hidden as mere assembly. This restates the settled engine/application boundary rather
than adding a new exposure policy.

The [unification verification example](structured-account-example/unification/README.md#answer-assembly-versus-production)
contrasts read-only qualified export-answer selection with an authored producing consumer of the same
module identification. It checks immutable captures, fresh displacement disclosures, unchanged source
production histories, and a cause only for the consumer that actually received the input. This is a
bounded stand-in for answer assembly, not an implementation of the application Projection API.

<a id="existing-lens-selection"></a>
### Selection behavior of existing Lenses

The migration makes selection explicit per Lens; producer kind alone is not a selection policy.
The current definitions are in [the Lens registry](../src/lib/application/lenses.ts).

| Existing Lens | Answer-selection commitment |
| --- | --- |
| `summarize` | Select the current standing designations of the retained result answering the module-summary request, including distinct alternatives. |
| `explain` | Preserve the exact selected prior information as subject; select current standing designations of the result answering this explanation request. |
| `decompose` | Preserve the exact selected prior information as subject; select current standing designations of its decomposition answer, expressed through qualified content and associations, not an investigram tree. |
| `examine` | Preserve the exact selected prior information as subject; select current standing designations of the result answering this further-investigation request. |
| `modules` | Return the designated discovery method's qualified module population over its captured basis. Organizing changes do not substitute a different population. |
| `organization` | Return the designated organization method's qualified findings over its captured basis, with organizing history available rather than substituted claims. |
| `dependency-structure` | Return the designated dependency method's structure over the captured project basis. |
| `dependency-children` | Return that method's qualified direct dependencies for the selected module. |
| `dependency-parents` | Return that method's qualified direct dependents for the selected module. |
| `inspect` | Preserve its mixed contract: method-specific mechanical information and qualified retained information selected through explicit subject associations. Exact-investigram inspection retains that exact contribution and exposes applicable history. Do not classify the whole Lens as either a mechanical-only answer or one inquiry's current designation. |

All rows retain complete applicable standing/displacement/cause access under the Lens-answer rule.
Exact retained-Projection access preserves the captured answer rather than selecting a fresh one.
For the four existing agentic Lenses, a recognized repeated request can therefore show an explicitly
redesignated answer without rerunning its investigation; that does not change the exact subject of an
existing follow-up. Acceptance coverage must include `summarize M`, an investigation that redesignates
its result, and a repeated request selecting the revised answer while the original remains exactly
accessible. The mechanical export-answer path retains its declared method's findings too; it is not
an additional public Lens invented by this table.

## Existing agentic capability migration

The working scope includes migrating the existing agentic capabilities onto the common mechanism,
not retiring them or leaving a permanent second correction/exposure regime. This includes the
current `summarize`, `explain`, `decompose` and `examine` Lenses, their prose results, and access to
and further investigation of earlier results. Preserve their investigative questions, qualifications,
evidence and provenance. Existing prose is representable as supported Analysis content; adding
structure does not require every explanation to become a diagram.

The migration must cover the current inspection and revision/reconsideration access paths as well
as production. Preserving the capability does not mean retaining whole-investigram correction or
implicit replacement-chain selection: specify the corresponding association, result-selection and
status behavior explicitly. The current ability to investigate a prior investigram must have a
faithful input mapping; it is not implicitly removed or restricted to newly offered follow-ups.
The exact-selection rule below settles subject meaning; reference packaging and interface selection
remain implementation choices within the established application/engine boundary.

Drafting must name the cut-over and verify interaction between existing agentic outputs, new
structured investigations and mechanical contributions under the common rules. Any consequential
change to question, subject meaning or answer-selection behavior must be surfaced rather than
hidden as an adapter detail. The fresh-selection rule below preserves all equally standing
alternatives; exact captures remain immutable. No cross-Session data migration is implied.

<a id="prior-result-subject"></a>
### Subject of a prior-result investigation

A follow-up targets the exact information selected by the user. That selection may be one immutable
investigram or an exact designated answer spanning several investigrams. Preserve the selected
membership, content and qualifications; do not silently resolve the subject again through whatever
currently designates the Query result's answer. The originating Query result and invocation remain
identifiable so the investigator can understand the earlier question and redesignate its answer
when appropriate.

For example, Q1 returns designated answer D1 and a later investigation supplies D2, superseding D1's
designation. Selecting D1 for explanation still targets D1, with applicable displacement and related
context available separately. D2 does not silently become the subject. Selecting current information
can produce a different exact selection for a new request; it does not retroactively change an
existing follow-up's explicit input. Request reuse preserves this exact subject meaning under the
existing effective-input rules, rather than treating a Query result ID alone as the complete subject.

Existing investigations of a specific investigram retain that exact subject. Investigations of a
selected answer can address several contributions without forcing them into a new root investigram.
Decomposition examines the selected information and returns qualified claims about its smaller
aspects through content, associations and result designations; it does not construct an investigram
tree. No new follow-current operation or general selection UI is required here. The choice of exact
references, application types and selection controls remains implementation work within these rules.

## Agreed implementation scope: existing mechanical information, staged

The chosen scope is migration of all currently supported mechanical architectural information within
this plan, with staged implementation and verification. A purely agentic extension would leave two
retention/qualification regimes; a permanent mechanical adapter or representative-only migration
would leave existing information outside the common association and exposure guarantees. Full staged
migration makes those guarantees consistent while allowing an early vertical checkpoint to expose
problems before the remaining integration work. This is a deliberate scope choice, not a requirement
to rewrite provider algorithms or physical storage. A partial migration is an intermediate
milestone, not the intended endpoint. The migration groups below are not the full milestone sequence.

Define an internal producer/contribution boundary so the common mechanism can be implemented and
verified with test producers before migrating real providers. Exercise cross-producer reuse and
association operations with separately attributed test contributions where needed. “Producer” names
the operational role here; mechanical and agentic remain extensible production mechanisms, not two
closed investigator types. This boundary need not force compiler operations and agent dialogs into
one execution protocol. Exact interfaces and harness arrangements are implementation choices.

Follow that foundation with an early vertical slice combining initial mechanical integration,
agentic state-dependent behavior, association addition/supersession/withdrawal, exposure and
reconsideration, and the state-diagram result contract. Do not postpone real end-to-end validation
until the remaining mechanical migration is complete. Drafting specifies milestones around this
risk ordering; controlled producer coverage does not replace live-agent integration checks.

The early slice takes the portion of migration group 1 needed for real module identification and
an export answer assembled from retained module naming, alongside the agentic state-behavior and diagram
path. It need not finish every group-1 variant or caller first. Complete the remaining group-1 work
and migrate groups 2–3 after reviewing that slice. Group 4 is final integration across **all** migrated
families and existing agentic capabilities; it is not postponement or repetition of the initial
proof. Its additional purpose is to expose interactions and regressions absent from the small slice.

Milestones provide review checkpoints along the way, including after the early vertical slice.
The full migration remains in this plan; a review may expose consequential changes to discuss,
not automatically move remaining families to a successor plan.

An intermediate implementation state is not necessarily a supported mixed-mode product. Changing
core machinery may temporarily break callers until they are conformed; alternatively, implementation
may keep the old mechanism working until migration permits its removal. Neither strategy is required.
Do not add a compatibility layer or a mixed-state application contract solely to keep every milestone
fully usable. Milestone scope and verification should make clear what is complete, what remains
unconformed and which checks demonstrate that stage; final verification covers the full agreed
endpoint. At each checkpoint the implementing agent records which existing checks fail because
of intentionally unconformed callers, which failures are unexpected, and the milestone by which each
expected failure must pass again. The plan names affected check families; exact tests are recorded
when implementation makes them knowable. Review uses both passing new-mechanism checks and this
explicit migration-gap record. Final integrated verification requires the migrated checks to pass;
expected intermediate failure is not a permanent waiver.

Temporary breakage or coexistence is not authorization to omit capabilities at completion
or to claim unfinished integration works. Detailed transition sequencing remains implementation work.

The mechanical migration groups are:

1. Module discovery/identification and exports, including later symbol introduction and actual
   qualified answer assembly from retained module naming, without fabricating production exposure.
2. Dependencies and remaining module information, including associated documentation and module
   composition, preserving qualified targets, coverage and partial/empty distinctions.
3. Project/repository organization: groups, containment, placement and qualified properties.
4. Integrated use of these real contributions in the representative architectural application,
   with exact access, standing, provenance and exposure verification within the
   supported Session. No particular Cockatiel journey or initial user-facing offering is required.

This scopes the existing architectural outputs, not new analyzers or a rewrite of every provider
algorithm. Provider internals and physical record storage may remain where suitable; architectural
information must participate consistently in the common contribution/association model. Preserve
method-specific result contracts, qualification, deterministic identity guarantees and outcomes.
Persistence, broader navigation/GUI, new mechanical capabilities (including the hypothetical
constant-target method), automatic reassessment and suppression of repeated provider output remain
outside this scope. Preventing a provider from reasserting withdrawn information would require an
explicit host policy. Equivalent recomputation does not automatically reassert an association,
as specified above; this does not prevent the mechanical method from returning its finding.

<a id="observation-review-checkpoints"></a>
### Owners and checkpoints for observations

These are settled first-delivery policies with observations to collect, not unresolved permission
for an implementing agent to change the design. The implementing agent records findings; the human
planning/product owner decides any consequential change at the stated review checkpoint. Absence of
sufficient practical evidence leaves the current policy and deferral in place.

| Observation | Evidence and checkpoint | Default and decision authority |
| --- | --- | --- |
| Acquisition-instruction effectiveness | Implementer records instruction/protocol problems in focused live trials; review after the early vertical slice and again at final integration if new evidence appears. | Keep semantic acquisition as an instruction, with structural validation. The human decides whether evidence warrants a separately designed completeness gate; it is not automatically added to this scope. |
| Usefulness of scoped addition warnings | Implementer preserves representative causes and inputs at the slice and final integration. In particular, additions to subject identification scopes can reach many baseline recipients and their consumers; changed-method production adding identifications for many existing Entity IDs is a likely volume scenario. Authored counts do not estimate user warning rates. | Keep scoped addition causes. The human can commission later suppression/reassessment work if practical evidence warrants it; no demand to prove usefulness or clear warnings before completion. |
| Architectural coverage gaps | Implementer records concrete cases at the same checkpoints, distinguishing missing scope exposure from broken propagation. Preserve the added-waiting-case counterexample as a known limitation. | Fix violations of the agreed propagation contract in this plan. The human decides whether broader gaps justify future declared dependencies or investigator-directed propagation; neither is silently implemented. |

After delivery, the same topics can be reconsidered through backlog prioritization when actual use
provides evidence. This plan does not create an ongoing monitoring service or require an empirical
frequency study. A material threat to a promised guarantee must be raised at the checkpoint rather
than hidden under a deferred-policy label.

## Entity storage and lookup

These are architectural migration requirements and observations of current code, not a chosen
storage implementation. Stable entity identity is separate from the qualified information
associated with it. The common entity-facing contract replaces the existing specialized claim
lookup paths; it must not introduce a parallel registry of architectural versions of existing
mechanical entities. Provider identity resolution remains responsible for native continuity.

| Responsibility | Current implementation observation | Proposed treatment |
| --- | --- | --- |
| Immutable storage and exact retrieval | `MemoryProgramRecordStore` stores records by ID, validates references and accepts atomic batches. | Preserve these guarantees; reuse or adapt the storage where suitable. A new storage engine is not required by unification. |
| Entity identity and reference binding | Specialized module, symbol and group records coexist with Session reference bindings and provider identity rules. | Resolve to common identities without duplicating the underlying things. Provider-native identity, common identity and human-facing reference spellings remain distinct responsibilities. |
| Identifying information | Module/symbol/group records point to one `claim`; subject resolution follows module/group claims for names. | Obtain qualified identifying information through associations. An original identifying claim may remain exactly addressable, but cannot silently act as the authoritative current description outside association standing/selection. |
| Subject lookup | Resolution recognizes a fixed module/group/investigram vocabulary and uses qualified populations for name matching; precise bindings do not require population acquisition. | Generalize supported subject resolution while preserving applicability, ambiguity, population coverage and qualification. Entity identity and the Subject role remain distinct. |

The observations are grounded in [record contracts](../src/lib/records.ts),
[the memory store](../src/lib/memory-store.ts), [reference bindings](../src/lib/identity.ts)
and [subject resolution](../src/lib/subject-resolution.ts).

Exact ID/reference resolution and name search are different operations. An existing entity ID
continues to identify the same entity within the supported Session even if identifying associations
are displaced or withdrawn. Resolving that ID does not select a canonical description or deliver
all associated content. It does not extend reference lifetime beyond the Session.

Name search uses qualified identifying information: matching a name does not establish identity,
several entities may match, and multiple descriptions may concern one entity. Search results must
preserve the standing, qualification and population coverage relevant to the lookup rather than
silently treating a displaced description as current. Lookup must support historical/displaced names,
either routinely or through an explicit history-inclusive request, so a remembered name can still
locate its entity. Return the historical match and its standing with access to relevant current
identifying information; do not silently replace the match with an unqualified current-name result.
A shared entity identity permits following that entity's information, but matching names alone does
not establish identity or a rename, and current descriptions may conflict. Presentation, whether to
search history initially, and whether to continue or ask the user to select are interface policies.
Any lookup coverage must be represented accurately. No fuzzy search, semantic deduplication or new
UI follows. Established precise reference bindings are not mutable descriptive names.

Classes, maps, indexes, physical record layouts and reuse of existing lookup code are implementation
choices. The architectural requirement is one consistent identity/information contract, including
exact historical access and qualified selection, not one universal table or the removal of all
provider-specific records. Migration verification should include exact resolution after identifying
information is withdrawn, ambiguous names and lookup over incompletely established populations.

## Content and declarations

The agreed term **Analysis content** names an investigram's substantive findings and explanations,
including mechanical contributions. It replaces "Interpretation content" in the proposed model;
governing terminology will change only through the planning/adoption workflow.

A **content item** is a keyed portion of Analysis content. Its **content type**
identifies a supported structure. A **content-type contract** specifies required data,
meaning, references, qualifications and partial information; a **schema** expresses its
mechanically checkable shape. Shape validation does not establish architectural truth.
Types form a defined, extensible catalogue. Investigators can invent topics/concepts using
supported types, not unknown structures PostCode is expected to understand.

A **content association** connects qualified information to a target. An investigram's
association specifications express three **association declaration** kinds:

| Kind | Meaning |
| --- | --- |
| Addition | Introduce an association alongside existing information. |
| Supersession | Introduce an association in place of specified earlier associations. |
| Withdrawal | Displace specified earlier associations without replacement members. |

Associations attach information either to an Entity (for identification or other topical information),
or to a Query result as a result designation. Own-result and other-result
associations use the same mechanism. “Target” is ordinary descriptive wording, not another named
core concept. The fixture encodes query results with the `result` role; that shared representation
does not make a Query result an Entity. The target denotes a category of information, not a mutable slot
or an exact earlier item. Supersession/withdrawal must additionally identify exact earlier
associations. Matching role, name or recency is insufficient.

Every association has a submission-local key, including identification and result designations.
Its exact address is `(investigram, local key)`; no additional association identifier is needed.
The key is separate from PostCode-understood purpose. The agreed name for the special identifying
role is **`identification`**. One investigram can contain differently keyed identification
associations for different Entities, or several qualified identifications of the same Entity.
Those remain claims about one referent, not additional identities. Separate keys do not establish
how the claims relate; their content, qualifications and declarations do. Group coherent identifying
information when appropriate; separate contributions can preserve different grounds or qualifications.

The common identification contract supplies a human-readable name or designation and enough
qualified information to distinguish the referent. A source-declared name, a path or an assigned
label can serve; distinguish assigned labels from names present in the system under study. A bare
opaque ID is insufficient identifying support. Identification need not be a complete behavioral
definition, nor mandatory prose when structured mechanical information suffices. Multiple standing
identifications can provide different names/descriptions without a canonical winner.

Other topical information can use an agent-chosen meaningful local key, such as `admission-behavior`.
No separately identified topic system is required. Matching keys across investigrams do not merge
claims or supersede associations. Additional PostCode-understood roles can be defined where special
handling is justified. Fixtures encode `identification` and generic `topic` roles, with independently
keyed associations. This is not evidence of a complete catalogue of topical contracts. The
[baseline probe](structured-account-example/check-baseline.py) exercises all standing identifications
for each subject Entity, including alternatives, empty selections and reconsideration disclosures.

New associations can reference content owned by another investigram. B owns its new
association; A still owns the referenced content, qualifications, evidence and original
provenance. No copying, reparenting or silent scope expansion occurs. If wording must
change, produce new content. The bounded fixture expresses same-target replacement as
supersession and a change of entity/role as withdrawal plus addition. This is an illustrative
operation shape, not an inferred identity rule or an unresolved permission to change targets.
A product encoding must preserve the exact displaced uses and the new qualified use without
silent reassociation; any materially different semantics require discussion.

Supersession and withdrawal have qualified reasons, normally inline. Additional exact
content/evidence references are supplied where needed; do not repeat the target's already
available references as a mandatory support list. Ordinary additions need attributable
grounds without redundant prose. There is no special operation for revising reasons.
Later investigations may provide new grounds concerning an earlier claim, with their own
provenance; they do not change what the earlier investigator knew.

An investigram may rarely contain no new content items but meaningful qualified declarations.
The fixture demonstrates this. Mandatory filler prose would obscure the distinction.
“Metadata” describes the organizing function, not lesser epistemic obligations. Referent
information, associations and guidance can carry qualified interpretation.

### Unresolved inconsistency reports

Preserve reporting a qualified inconsistency without asserting a replacement. The report identifies
specific content items or associations, not whole investigrams by default. Use exact item addresses
when comparing their substantive claims; use exact association addresses when the dispute concerns
what that content is asserted about or its designated use. The owning investigrams retain provenance
and qualification, but unrelated sibling content is not implicated merely by sharing an owner.
For example, conflicting admission claims can be compared directly; an association attaching a
scenario-specific claim to a general Entity can instead be the object of the comparison.

Apply the same data-integrity versus reasoning-policy boundary as other operations. Instruct the
investigator to acquire and understand substantive content sufficient for the comparison, with its
qualifications and relevant support. A qualified excerpt can suffice for a correspondingly limited
comparison; this is not the complete-target acquisition instruction for displacement. Mechanically
validate exact references, supported structure and required grounds/qualification, without a special
prior-delivery acceptance gate. Actual deliveries still determine exposure; the report's references
do not fabricate it. Structural acceptance does not certify the inconsistency judgment.

The report preserves the disagreement without displacing either side, selecting a winner, or
asserting that either entire investigram is invalid. Keep the report attributable and discoverable
against its precise targets; index/API representation is implementation work. This deliberately
revises the prior whole-investigram targets and mechanical exposure prerequisite in
[Investigrams and progressive investigation](../docs/decisions/investigrams-and-progressive-investigation.md).
The planning package must map that governing change explicitly. The [review-alignment probe](structured-account-example/review-alignment.md)
exercises exact claim/use targets, qualified report access, unchanged standing and acceptance without
an acquisition gate. This is not a new association declaration operation.

## Result designation and immutable history

When the Lens question calls for selection through current result designations, fresh selection
of a result with several equally standing designations supplies all of those
alternatives, preserving their distinct membership, qualifications and provenance. For example,
if D2 and D3 independently supersede D1 and neither displaces the other, PostCode Lens code must
use both; it has no basis to assign priority or silently select one. Supplying both does not merge
them into one synthesized answer or certify either as true. This rule constrains the application
mapping, not merely engine storage. Exact-reference or explicit user selection of a particular
alternative remains a different, narrower request.

<a id="alternative-enumeration"></a>
Supply alternatives in a stable, repeatable enumeration for the same selected information; position
implies neither preference nor architectural chronology. The ordering strategy is an implementation
choice, subject to the existing deterministic semantic-ordering guarantee for mechanical answers.
Session-local identifiers must not make semantically distinguishable alternatives appear arbitrarily
reordered across equivalent mechanical answers. This requires no priority field or order among the
claims themselves, and does not relax the requirement to preserve every selected alternative.

An investigating agent can be supplied or offered both alternatives and may choose what to use
for its own investigation based on context, provenance and qualified judgment. Actual acquisition
still determines exposure; availability alone is not content delivery. Such a choice does not
implicitly displace the alternative or establish a universal priority for subsequent inquiries.
Presentation arrangements remain interface choices, but leaving answer selection to application
contracts does not authorize arbitrary preference between equally standing alternatives.

<a id="recognized-request-reuse"></a>
A repeated user request is not automatically a new investigation invocation. When PostCode
recognizes it as the same request and reuses Q1's retained investigation, it returns the existing
RESULT-Q1 identity. It does not create Q2, another query result/designation, duplicate architectural
entities or new interpretive claims. Access/reporting may be recorded separately; exact redisplay
is likewise access, not a new investigation. This preserves the existing reuse behavior.

A new Q represents a new investigation undertaken—for example because effective inputs changed,
or a supported operation explicitly requests new investigation. Same wording alone does not
establish equivalent inputs. This agreement does not introduce a rerun operation, specify a new
cache key, or change mechanical qualified-answer identity. Existing exact-history and fresh-selection
rules still determine what is returned; reuse does not silently mutate the captured answer.

Newly accumulated retained information does not by itself change request identity or force a new
investigation. Relevant changes are handled through the existing needs-reconsideration mechanism:
additions matching acquired inventory/selection scopes, or displacement affecting recorded exposure
or designated membership, can produce cause-specific warnings and propagate. An exact description
acquisition does not subscribe to every future addition about its entity. A warning does not itself
rerun analysis, clear history or invalidate reuse; retained information remains accessible with its
applicable status. Exact redisplay preserves the captured answer, while fresh access can disclose
current standing and concerns under the existing access distinctions.

Distinguish context explicitly selected as an input to the request from context chosen/acquired by
the engine during execution. Changing an explicit input may change the request under existing
application rules. Actual engine acquisitions, including automatically selected initial context,
are recorded in production provenance/exposure; do not reselect today's context merely to force a
new request identity for an otherwise reusable investigation. Deliberate reinvestigation or other
changed effective inputs remain distinct. No automatic reassessment or new cache mechanism follows.

The first accepted contribution for Q adds a result association targeting RESULT-Q.
The fixture represents its members as exact item references and/or declaration references.
Referencing declarations lets a result explicitly include identifying/descriptive uses
and, in a declaration-only result, the organizing assertions themselves. Result membership
selects qualified answer content; it does not organize investigrams into a hierarchy.

B can supersede A's result association while leaving A's other associations untouched,
and independently supersede an identifying or behavioral association. Unchanged content
can be included through its original associations. No investigram is globally superseded;
there is no `sourceSuperseded` attribute on all of its items.

The exact original answer preserves its captured membership, content and qualification.
A later explicit selection can follow current declarations and show competing associations.
It must not mutate that captured answer or redirect an exact item/association reference.
The historical fact that Q produced its contributions remains fixed for the supported
lifetime; this is not a promise of indefinite cross-Session storage.

<a id="redesignation-instructions"></a>
When an investigation addresses an earlier result and its conclusions change that answer, instruct
the investigator to explicitly redesignate that result. This is why Query results are targets of
the displacement mechanism: changing an Entity association alone does not update a designated answer.
The instruction is conditional on changing the answer; a follow-up that merely adds other information
need not replace it. It is a semantic authoring instruction, not a new mechanical acceptance gate.

If the investigation starts from a designation D1 already displaced by D2, choose the displacement
target deliberately after considering the available qualified history. Superseding D2 updates that
standing answer; superseding D1 again leaves the new designation alongside D2 unless D2 is also
explicitly displaced. Both are structurally valid. Explain the chosen relationship in the declaration's
grounds rather than accidentally creating alternatives by copying the originally selected address.
The exact selected subject remains D1 in either case. Include controlled-dialog coverage of both
choices, checking the resulting standing and preserved historical subject; no default winner or new
acceptance gate is introduced.

Understand the earlier invocation's question and scope, including operation, subjects, parameters
and selected option—not merely its old answer. The fixture captures that context in `queryMeanings` alongside
selected result context. When delivered, it must be recorded accurately; prior delivery is not an
acceptance prerequisite. This retained request meaning is not human prose input or a new global
operation. Structural acceptance does not certify that the new designation answers that question.

Superseding an architectural association does not oblige the investigator to find and
redesignate every containing result. Other designations retain exact membership and expose
fresh displacement/membership concerns. Redesignation is never performed by the index or
renderer just to keep two organizing structures synchronized.

The contribution protocol has no parent/child investigram links or composition roots. Atomic
acceptance still resolves local identities, validates references and qualification, and retains the
submitted pool together. Each investigram retains its own content and production provenance.
Displacement targets predate acceptance; cycles in designated membership are still rejected.

**Investigram organization is explicitly deferred.** Future need may justify nesting or another
organization, authored by agents, derived mechanically (for example from follow-up relationships or
UI context), or combining those approaches. None is implied by the current mechanism. References,
shared production and follow-up provenance do not automatically become organization edges.

Result designations still select exact answer members; content references still express their stated
relationships; separate investigrams still provide qualification/provenance boundaries. Architectural
hierarchies, state nesting and other supported structures within Analysis content remain meaningful
claims about the system under study. Removing investigram organization does not remove those forms.
The fixture directory named `children/` is retained for link continuity, but contains the
**partitioned variant**, with independent investigrams and no parent/child relationships.

Migration deliberately removes the old fixed composition-tree contract and its parent/child
navigation, rather than rebuilding it under another name. Preserve the questions and findings of
existing capabilities such as decomposition through qualified content and result designations;
that capability did not make the investigram tree itself a claim of architectural decomposition.
Drafting must map this governing change explicitly. A replacement organization mechanism is not a
prerequisite for this plan or an implementation task hidden in migration.

**Entity organization is a separate future exploration, if a need arises.** Consider how entities
might be grouped or arranged architecturally, and how existing mechanical groupings, module
hierarchies, containment and placement information might contribute. Organization might be mechanical,
agent-proposed or combined, and different qualified organizations may coexist. An arrangement for
navigation need not assert architectural containment; preserve the meaning and basis of each.
This is a candidate topic, not a general entity-organization mechanism required by this plan.
Migration of existing mechanical organization information remains in scope, as does representing
supported architectural relationships in qualified content. Neither is deferred by this note.

Investigrams themselves have no inherent total order or precedence: producing B after A does not
make B more authoritative. Directed exposure, provenance/derivation and amendment relationships
establish a partial order of contribution ancestry. Unrelated investigrams remain incomparable in
that order. Exposure means information was supplied, not that it was relied upon; amendment means
an explicit association declaration, not mutation of an investigram. Shared provenance and ordinary
content references do not automatically establish ancestry. This partial order is distinct from
architectural sequences described by the claims and from recorded production/acceptance chronology.
Acceptance order still supports delivery-completeness and later-change checks; it is not a ranking
of claims or a last-writer-wins rule.

This partial-order description is explanatory, not a new retained graph, index, scheduling rule or
validation subsystem. Existing exposure, provenance and declaration records carry the relevant
relationships; their specific reference, acceptance and propagation rules remain the requirements.
Do not infer a generic acyclicity constraint over all investigram links from this description.

Application access must preserve the relevant meaning of exposure/provenance, association amendments
and reconsideration causes, with qualifications and precise traceability. This may expose engine
contributions directly or map their relationships onto application-level items. Neither hiding
investigrams nor exposing them as a particular API object is required: interface representation is
an implementation choice within the established Projection/investigram distinction and exact-access
requirements. A mapping must not attribute dependence to an entire answer when it concerns only a
selected contribution, or turn exposure into a claim of reliance. Consumers must not have to infer
missing relationships from chronology. Answer-relevant information accompanies the qualified answer;
further history can be acquired without embedding it all in every Projection. The UI chooses what
to display and how. No additional application object model follows from this clarification.

An investigram atomically captures analysis results. Position within the bundle implies no order
of discovery, authority or architectural events. Claims have no implicit ordering from packaging
or investigation chronology; their applicability remains qualified by captured basis, scope, state
or time where relevant. Explicit architectural sequences/dependencies and association amendments
retain their own stated meanings. A result designation may select contributions from different
investigrams without creating an order between their claims. Investigram nesting is outside this
capability; architectural containment and execution sequences require explicit content. Preserve
those contract semantics; incidental member ordering and packaging are implementation choices. No additional
generic ordering/nesting mechanism is required by this capability.

**Fixture result packaging:** each successful new fixture invocation allocates one query result
and an initial result designation. Recognized reuse returns the existing query-result identity.
Submitted content must be reachable through an association; this checks coverage, not intelligibility,
sufficiency or reasoning. The authored simulator is not the product reuse coordinator. Existing
mechanical architectural information is in migration scope, and accepted partial contributions
receive normal processing under the outcome rules below. Detailed
packaging must preserve the application/engine mapping and meaningful membership semantics.

### Outer answers and the investigation engine

Subject, Lens, Projection, Presentation and View are the outer application concepts. The investigation,
investigram, entity and association mechanisms produce, retain and organize their supporting
information. Entities can play the Subject role; the levels are not isolated systems.
Query results and designations belong to the engine and do not replace Projections.
Use **context selection** for choosing qualified engine information and **context delivery** for
actually supplying it to an investigator. Reserve **Projection** for the outer application answer;
engine context selections/deliveries are not a second kind of Projection.

A Lens method determines what engine information constitutes its answer. There is no required
one-to-one mapping between Lens applications, engine invocations and investigrams: a Lens can use
retained information, several analyses or multiple contributions. A Projection captures the selected
qualified answer, including its answer-relevant supporting basis, qualifications and association
standing. Result designations can supply that selection; they are not themselves Projections.

Later declarations do not mutate an existing Projection. Fresh selection may yield a different
Projection; exact redisplay preserves the captured answer. Projection identity continues to follow
the existing qualified-answer rules. An engine invocation ID alone does not distinguish otherwise
equivalent answers; differences in selected content, support or meaningful association history can.
Preserve engine provenance without automatically treating every operational identifier as part of
answer identity. The agreed distinction between invocation-specific context and answer meaning
must also preserve immutable payload consistency.

This resolves the architectural relationship. Drafting must check the mapping against the existing
answer contracts and expose any concrete conflict for discussion, rather than silently changing
either model. Physical packaging and coordination remain implementation choices.

## Entity context and actual delivery

“Supply entity S” means deliver an exact, qualified selection of associated information.
Do not pass only an ID, synthesize a canonical definition, or automatically deliver S's
entire history. Competing descriptions can remain visible. Subject-only context has no
inferred navigation origin. A UI may supply an explicit origin; context and origin remain
separate.

Selecting something in Q's result uses RESULT-Q as organizing context. Supplying the selected
material records exact association/content exposure through its designation route, not exposure
to everything about that query result. A separately acquired inventory records its scope and
delivery position. Human browsing, selection or a bare reference alone creates neither kind of
investigator exposure. The selected passage need not itself become an entity. Qualified addresses
retain original ownership even through context selected through another entity. Actual deliveries, not an
investigator's claimed reliance, determine the structural exposure record.

The fixture materializes delivered values with source investigram, query provenance, captured
basis, source qualifications/evidence and any narrower item/declaration information. It
follows only required content dependencies (for example interaction state-transition refs),
not every informative link or every entity's descriptions. Identifying support can be
explicitly included or requested through dialogue. Missing support follows the rule below;
ranking, pagination and operational bounds are implementation choices that must disclose actual
coverage and omissions. Presentation retrieval/navigation remains outside scope.

<a id="displacement-acquisition-guidance"></a>
**Displacement acquisition is an investigator instruction.** Before superseding or withdrawing
an association, acquire its complete designated content, qualifications and required support,
including semantic dependencies. Result targets include their designated declarations/items;
this does not require entire owner bundles or unrelated items. Acquisition may proceed over
successive dialog requests. Investigators are expected to follow this instruction and supply
qualified grounds; PostCode does not attempt to verify understanding.

For the first capability, defer mechanical enforcement of target-support completeness. Structural
acceptance still validates exact existing eligible targets, compatible target/role, operation
shape and required grounds. It also validates the accuracy and qualification of recorded deliveries:
an ID is not delivered content, and a reason does not deliver its referenced members. A declaration
can therefore be structurally accepted even if the recorded context is insufficient under the
investigator instruction. That is not certification of adequate analysis or instruction compliance.
Observe instruction-following in the end-to-end investigation before deciding whether a completeness
gate is needed. This changes the proposed replacement for the governing correction rule and needs
explicit adoption before product implementation; qualification/evidence/provenance obligations remain.

<a id="validation-and-investigator-policy"></a>
**General first-capability policy:** PostCode mechanically validates data integrity and operational
contracts: schemas, required fields, reference resolution and types, ownership, acyclicity, valid
operation targets, atomicity and faithful history/delivery/exposure records. It checks that evidence,
qualifications and grounds are represented where required, not that they substantively establish
a claim. Valid data is not certification of a valid interpretation.

Reasoning and investigation policies belong in investigator instructions. Mechanical checking of
those policies is deferred until demonstrated need. In particular, reuse has no separate prior-
exposure gate or special new instruction beyond understanding and qualifying information used;
references must resolve and preserve source provenance/qualification without inventing prior exposure.
Redesignation instructions require understanding the earlier question, but the checker does not
require its prior acquisition. The fixture exercises both boundaries as well as displacement.

If policy checks are introduced later, they may participate in the dialog: identify an apparent
omission, remind the investigator of the policy, and allow further acquisition, clarification or
revision before a final submission. Acknowledging a reminder alone does not prove a policy was
satisfied, and dialog recovery cannot make malformed final data acceptable. No semantic checker,
reminder protocol or new application interaction is implemented in this capability. Existing
structural errors could likewise be made recoverable in the dialog without weakening final validity.
This is a proposed design policy, not a revision to adopted governing documents or product behavior.

Fresh delivery discloses applicable declarations with reason, ownership and qualifications.
A substantively supplied declaration is itself an exact exposure, so its later displacement can
create a direct cause. Bare references inside that declaration do not deliver their targets or
members. The fixture derives declaration exposure from its captured qualified disclosures;
target-support acquisition remains an investigator obligation, not a mechanical gate. Fresh access also discloses subsequent displacement
of those supplied declarations, without retroactive warnings or automatic reinstatement.
Further acquisition remains explicit. An exact captured answer stays unchanged.

### Identifying support, alternatives and acquisition

**Agreed baseline initial context:** provide all non-displaced `identification`-role associations
for each subject Entity, including their identifying content, provenance, qualifications and required
support/status disclosures. Do not choose one name/description as canonical. Needs-reconsideration
status accompanies an identification; it does not silently exclude it from this non-displaced set.
If the set is empty, report that absence rather than inventing an identification. This selects an
explicit scope at the actual delivery position, so later matching additions can trigger the existing
scope-exposure reconsideration rule. It does not automatically acquire all other topical information
or all contributions referring to the subject. Exact selected historical context remains distinct
from this fresh baseline. This agreement concerns subject Entities; Query-result and contextual-
selection inputs retain their own meaning rather than being treated as Entities by analogy.

Substantive references need enough qualified identifying information to distinguish their
referents, or an explicit unresolved/contextual designation with inspectable support. Do
not satisfy intelligibility with a bare ID or silently fetch today's preferred description
into an old exact answer. Preserve the support actually grounding the delivered claim.
Basic support obligations are application semantics; UI arrangement/retrieval design is separate.

<a id="missing-support-outcome"></a>
**Missing-support outcome:** supply the qualified identifying/supporting information that is
available, explicitly identify what is missing or unresolved, and preserve the contextual designation
and inspectable grounds actually available. An empty identification selection is reported as empty;
an unavailable acquisition is not a finding that no such information exists. Bounds disclose omissions
and any supported further acquisition. Do not invent a definition, evidence or correspondence, hide
the limitation, or silently substitute a currently preferred description into an exact historical
selection. If the missing support prevents a requested answer or diagram from meeting its contract,
report the unmet requirement through the established outcome mechanism while retaining otherwise
valid contributions. Required exact references must still resolve; this rule does not authorize
malformed dangling references. Tool shapes, limits and support-fetching strategy are implementation
choices within this observable behavior, not new semantic decisions for the renderer.

When two descriptions of S differ without explicit displacement, preserve and make both
available with their scope and attribution; the simple two-description case can supply
both. Difference need not be contradiction. Larger inventories require disclosed selection
bounds and access to alternatives, not automatic reconciliation or hidden last-writer truth.
A supersession can favor new information without making its acceptance a truth judgment.

**Discovery through explicit referents is in first-delivery scope.** It is an important purpose
of retaining referents, not a new optional extension. It is broader than identification/topic
indexing: ADMISSION-1 lists Half-open (S) as a referent even though its admission association targets
Circuit Breaker (P). An investigator of S must be able to discover that contribution without already
knowing its address or having a navigation origin, then acquire selected qualified information.

This is lookup through retained explicit references, not inferred semantic correspondence or a
requirement for general relevance ranking. Discovery does not automatically supply all found
content or fabricate content exposure; normal qualification, acquisition and actual-delivery rules
apply. Referent lookup, association targets and evidential support remain distinct. Indexes and
interface/tool shapes are implementation choices. Planning must include this path in validation.
The [review-alignment probe](structured-account-example/review-alignment.md) exercises reference-only
lookup followed by separate qualified item acquisition, including discovery of ADMISSION-1 through S
although the behavioral association concerns P. Product integration remains to be implemented and verified.

Specify acquisition at the investigation boundary, leaving dialog tools to implementation.
An investigation receives its subject, question and selected initial context, and can acquire
further qualified information. Selection by exact association reference creates content exposure
only. Selection by scope—for example all undisplaced identifying descriptions of S—also records
the scope guarantee and delivery position, even without a separately requested inventory list.
A matching later description could have changed the supplied selection. Do not invent an unseen
list as delivered content, or erase the actual selection dependency because the coordinator made
it up front. The fixture's `selectionScope` captures one complete undisplaced entity/role policy;
it is not an authority ranking or general initial-context algorithm.

A separate “what else is known?” acquisition supplies an inventory with scope/coverage and
captured position, without delivering listed content. Requesting a particular association then
establishes content exposure. Scope-selected content and explicit inventory acquisition both
create selection-opportunity dependencies. No automatic delivery of every other association's
reason. General ranking and partial selection remain outside this bounded contract.

Available, requested and delivered information remain distinct. Mechanical inventory entries
record availability; substantive listing summaries would additionally be delivered interpretive
content with its own provenance and qualifications. Inventory discovery does not satisfy the
instruction to acquire complete qualified support before displacement; structural acceptance
and fulfillment of that instruction are separate.
Incomplete/paged inventories must disclose their actual coverage; the probe uses complete scoped
lists and does not yet generalize those acquisition policies.

Request identity preserves operation, subject, parameters and context explicitly selected as a
request input under existing application rules. Context selected/acquired by the engine for execution
belongs to production provenance and exposure, including any initial scope selection; its changing
availability does not itself force a new request identity or rerun. Relevant later changes can
instead produce needs-reconsideration causes as described in [recognized reuse](#recognized-request-reuse).
Retained-answer identity, query-invocation identity and evaluation reuse remain distinct. Assigning
RESULT-Q introduces no new cache/freshness policy. General discovery rankings and budgets remain
surrounding application design.

### Access obligations independent of presentation

| Access | Required distinction |
| --- | --- |
| Exact captured answer | Keep its membership, content, support and captured status/qualification context fixed. |
| Exact item/declaration inspected afresh | Preserve its target and supply applicable displacement/inherited-cause context, not every addition about the entity. |
| Explicit inventory acquisition | Capture availability scope, actual entries/coverage and delivery position without pretending the listed content was supplied. |
| Newly selected entity/result information | Capture the chosen original/new/competing associations and support; selection does not rewrite their sources. |
| Further investigation | Use declared question meaning and explicit seed/acquired deliveries; preserve what was actually supplied. |

Equivalent captured content/support/status selections should retain the existing repeatable
selection-identity guarantee. This is separate from whether an investigation is rerun or
reused. The new types need continuous submission, validation, retention and direct/exact API
access. Existing human-output paths must preserve qualifications even while GUI/navigation
work is deferred. Neither a saved Account collection nor a special assembly Lens is implied.

## Reconsideration

<a id="scoped-addition-warning-rationale"></a>
**Retain addition-triggered reconsideration in the first capability.** The human reconfirmed this
scope after review: later additions matching an actually acquired inventory or content-selection
scope can expose a possible limitation in the earlier account, even without displacement. Do not
hide that possibility by deferring the cause mechanism merely because warning usefulness is not
yet measured. A warning indicates possible need for reconsideration, not established error.

This preserves the scoped rule, not blanket entity-wide exposure. If practical use reveals excessive
warnings, assess their causes and consider targeted refinements then. Suppression, reassessment and
clearance remain deferred; no warning-rate claim or new mechanism follows from this rationale.


A fuller description can reveal important behavior or edge cases without showing the earlier
one false. Explicit supersession or withdrawal can therefore create a reconsideration cause.
The reason explains it; factual-error classification is not required to trigger review.
The warning is not invalidation, proven reliance, or automatic rejection of an account.
The [revised addition probe](structured-account-example/additions.md) distinguishes
**association exposure** from **inventory exposure**. Later additions affect earlier inventory
recipients when the new association falls within an acquired inventory's or content-selection
scope. Receiving a definition by exact reference, or a fixed result containing it, does not by
itself imply that scope dependency. Receiving all definitions selected by a declared scope does.
The cause is the exact new declaration; it does not claim that new content was received earlier.

The fixture lists all retained association addresses/roles for an entity and selected roles,
including displaced ones, without interpretive summaries or standing claims. A supersession
also introduces an entry and can affect that inventory. Withdrawal preserves the historical
entry, so it affects exact content recipients but not this inventory's membership. Current-only,
status-bearing, ranked or partial inventories need their own explicit change/coverage rules.

The original by-reference boundary control remains 0/7 evaluations and 0/8 designations for
either tested addition; none acquired an inventory or content-selection scope. This is not a
realistic warning-rate estimate. A separate inventory reader and its result consumer give 2/9
and 2/10. In the [discovery follow-up](structured-account-example/acquisition.md), Q2 actually
lists S's available associations and retrieves selected content: either addition then reaches
3/7 evaluations and 4/8 designations. A separate scope-selected identifying-context probe also
reacts to another identifying description while its exact-reference counterpart does not.
The older entity-wide 5/7 and 7/8 counts remain a historical comparison. No targeted suppression,
semantic harmlessness assertion or empirical frequency claim is used.

Three paths matter:

1. **Exposure during investigation.** Q receives entity information, and its produced result
   and contributions retain that actual delivery provenance. A relevant later change can
   warrant reconsideration and propagate through subsequent deliveries.
2. **Designated result membership.** Q may itself create an entity and its description. A
   later change to an association included in RESULT-Q can affect that result even though
   Q had no incoming exposure to its newly created entity. Do not fabricate such exposure.
3. **Availability/selection scope.** Q acquires an inventory or receives content selected by
   a declared scope, initially or later. A matching association could have changed the selection.
   Its outputs can inherit that concern. Fixed result membership alone is not such a scope.

Exposure uses the actual association versions delivered, not all information associated
with the same entity. The entity remains the organizing context and discovery identity.
Q1 received P's orientation; it was not exposed to its own subsequently produced admission
association, nor to a P association another investigation creates later. Item excerpts retain
an explicit association route so partial delivery does not lose this distinction.

Result status belongs to each exact **designation**, not one warning set on RESULT-Q.
Distinguish displaced standing (a newer designation exists), membership concerns (an exact
included association was displaced), and concerns inherited from the generating evaluation's
actual context. A designation's displacement is not itself a reconsideration warning on that
same designation. Consumers that received it can nevertheless need reconsideration.

The updated designation does not acquire the cause that created it. It can still acquire
independent concerns about its exact members or producing evaluation. Historical captured
answers remain fixed; fresh status reports are separate. Receiving the new designation must
not be confused with receiving the old designation of the same query result.

For displacement, membership and exposure operate on exact association references. Sharing a content item
through different associations is not alone a warning path. Observer/reuse results in the
fixture create their own associations to earlier items; their actual incoming exposure,
not shared text, supplies any inherited concern. Automatic entity merge/split effects and
identity-specific propagation are deferred; qualified identity findings use existing mechanisms.

Removing acquisition gates makes one coverage limit explicit: an ordinary association can
reference an earlier item without its producer receiving the source association. Later displacement
of that source association then has no exposure path to the reuser. This is not a reason to invent
exposure or make one association's displacement invalidate every use of shared content. Even with
acquisition, the path is the exact association actually delivered, not a uniquely privileged
"original association." Instruction-following affects whether that path exists.

Result designations acquire membership causes when they include the exact association being
displaced (directly or through nested declaration membership). A direct item reference alone does
not supply this protection. References, deliveries and designated membership are distinct.
An audit of references without prior delivery can be derived from the existing records for a
future study or dialog check. Defer a dedicated retained "used without delivery" field and any
propagation dependency based on it; neither follows from structural acceptance.

<a id="current-standing-of-causes"></a>
Fresh inspection of a reconsideration cause should expose its current declaration standing. If B
superseded A and C later supersedes B, an earlier recipient of A still has historical cause B;
C is not a new exposure-based cause merely because it changes B. Fresh qualified access can show
B together with C and their exact relationship. It does not clear B, certify the recipient's answer,
or reinstate A. The current standing is derived from retained declarations, not a new stored flag.
The [renewal probe](structured-account-example/acquisition.md#current-standing-of-a-cause) exercises
this through existing standing lookup and fresh result disclosure, preserving captured history.

Each investigram captures its actual production/exposure history at creation. Several investigrams
from the same production may share that history; a common acceptance or outer invocation does not
merge distinct producers' inputs. The unification fixture separately captures source-only
mechanical production and the agentic organizer's retained input plus the mechanical item actually
supplied to it. No exposure is inferred merely from an output reference or shared submission.

The prototype conservatively propagates a cause through contributions whose producing execution
received affected input. It does not infer different reliance for output items within one production.
Exact delivery of a mechanical item follows its owner's history, not an organizing sibling's.
Actual mechanical input concerns can pass through the finding to an agent that received it, including
when their contributions are accepted together. Per-invocation warning totals are report summaries,
not a source from which every contribution inherits exposure. This corrects the fixture boundary;
it is not a new per-item exposure policy. A selected result designation can transmit its membership
concerns; this does not establish item-level causal reliance.
The timing boundary is each actual delivery, including later acquisitions during a dialogue.
A displacement already accepted at that point is known context and must be disclosed; it is
not a later change to that delivery. Missing disclosure is a delivery defect, not a substitute
reconsideration warning. This applies to direct association exposure, designation concerns and
inherited generating-context concerns, so a known cause cannot re-enter through another path.
The producing evaluation also remains exempt from its own causes.

New designation membership follows the same distinction: an association already displaced
when the designation is accepted retains that standing, without a new membership warning.
Its producer can still need reconsideration if it acquired information before the displacement
and did not receive the relevant update and change context before submitting its contribution.
Historical designations and completed contributions retain their existing causes.

**Updates during production:** atomic contribution acceptance does not require the retained state
to remain unchanged throughout a dialog. An agent can request a mechanical analysis, receive its
accepted result and incorporate that update before submitting. When the relevant updated information
and qualified change context are delivered to that producing investigation before submission, that
change alone should not mark its resulting contribution for reconsideration merely because an earlier
delivery preceded it. Keep both deliveries in the production history; do not erase exposure or claim
that the agent never received the earlier information. Trust the investigator to use supplied context,
consistent with the existing semantic-instruction policy; no proof-of-understanding gate follows.

This treatment is specific to the change and the still-producing investigation. Changes not delivered
before submission, or arising afterward, retain the ordinary reconsideration behavior. A bare notice
of a change is not necessarily delivery of the relevant updated information. Merely accepting a
mechanical contribution into the store is not delivery to the agent. Completed investigrams are not
cleared by a later dialog, nor do shared acceptance or invocation identities transfer this treatment
to another producer. Displaced associations remain displaced, result memberships remain exact, and
other causes remain independent. This is production-context handling, not retrospective reassessment.

The fixture records host-assigned acceptance positions and the retained-state position of each
captured delivery. An investigation may finish after a change while its inputs precede it;
neither query start nor final acceptance substitutes for actual delivery time. Fresh context deliveries
disclose known direct and indirect causes with qualified reasons. Notice receipt establishes
awareness, not sufficient replacement context or endorsement of the displaced association.
Further acquisition and qualification obligations still apply.

This timing rule does not implement retrospective reassessment or clearance. Detailed inventory
coverage and partial-delivery contracts remain implementation work within these guarantees. Displacement uses exact association exposure;
additions use actual scoped inventory exposure. A newly read inventory includes already accepted
entries without a later-change warning. Refreshing an inventory preserves earlier exposure and does
not by itself deliver the newly listed content. The during-production rule requires the relevant
update and change context, not mere availability. Acquiring a description before an addition and the
inventory only afterward does not create a pre-addition inventory dependency.

The [review-alignment probe](structured-account-example/review-alignment.md) supplies a bounded
sufficient case: before submission, the producing investigation receives the full qualified change
declaration and all its declared replacement/addition members. A withdrawal has no replacement
members; its qualified declaration and reason supply the update. Actual deliveries can supply these
across several acquisitions. The probe checks both direct and inherited causes, keeps notice-only
and inventory-only controls, and preserves completed contributions and separate producers' histories.
It does not decide semantic sufficiency for arbitrary excerpts, invent agent-asserted clearance, or
require this exact representation in the product. Implementation must preserve the agreed timing
behavior while defining supported delivery contracts; any consequential coverage restriction needs review.

Causes remain distinct; no automatic transitive equivalence, last-writer truth, or disappearance
of a cause through context trimming. A supersession can be contested. Competing declarations
remain available; the fixture does not select a winner by timestamp. Withdrawal declarations
are not themselves associations to supersede in this bounded prototype.

<a id="renewed-association"></a>
### Renewed assertions without reinstatement

Working agreement: challenge earlier information through new qualified associations, without
revoking the historical displacement. If B superseded A, C may supersede B while referencing
A's original content. A remains displaced; C is the new assertion. Reused content retains its
original ownership, evidence, qualifications and provenance, while C has its own attributable
grounds. The acquisition instruction and structural eligibility rules apply. Reuse does not clear causes or
establish that the original content is generally sound.

After a withdrawal, C can add a new association to the earlier content without undoing or
superseding the withdrawal declaration. D can later disagree with C and supersede or withdraw
C in turn; it can reuse qualified earlier content where appropriate. C acquires no final
authority, and no timestamp silently settles competing assertions. These operations restore availability
through a new assertion, not the standing of an old association or an old result designation.

Defer general declaration revocation and reinstatement. Historical deliveries, displacement
records and reconsideration causes remain; this choice adds no clearance or reassessment rule.
The A → B → C → D sequence is an illustrative contract case, not a newly executed fixture.

<a id="competing-associations"></a>
### Competing associations remain available

Working agreement: if B and C both supersede A and neither displaces the other, both remain
available. Scoped acquisition of current descriptions includes both with their qualifications,
grounds and required support; current here means undisplaced, not reconciled or authoritative.
PostCode does not choose by recency. Exact-reference acquisition can still request one particular
association and must disclose its applicable standing; that is not a claim to have acquired all
current descriptions. Fixed result designations are not silently expanded.

Parallel producers are not needed to explain this case. Contributions may nevertheless be accepted
between deliveries within one investigation, including mechanical work requested during an agent
dialog. When C acquires A after B's supersession, fresh delivery discloses B's declaration. C can acquire the required
members/support and explicitly supersede B if warranted. Competition is therefore an edge case,
not an assumed routine race: C may deliberately leave B standing while asserting a different
account. Merely learning that B exists does not deliver all of B's content or fulfill the
acquisition instruction, even though no target-support completeness gate is enforced. The fixture's competing declaration remains a useful deliberate case; it does not
establish an observed frequency. Implementation specifies delivery bounds, discloses actual coverage
and omissions, and preserves access to alternatives without silently choosing a winner or claiming
complete coverage for a partial selection.

### Architectural coverage dependencies — deferred

ADMISSION-1's admission item already claims coverage of runtime admission cases. New waiting
information could challenge that claim even if added without superseding it and without any
prior inventory/scope acquisition. The current repairs do not assign that claim a standing
dependency on future P/topic associations. Completeness of a selection of retained
information is distinct from completeness of an architectural account of program behavior.

Defer declared dependencies and investigator-directed propagation beyond the first capability.
Declared dependencies could anticipate a relevant change scope; investigator-directed propagation
could identify affected earlier results when a new finding emerges. Both would supplement actual
exposure tracking, not replace it or fabricate deliveries. They may be complementary. Observe
how often coverage gaps arise, in which circumstances and with what consequences before choosing
between them or designing both. Broad P/topic scope admits unrelated information; narrower
admission semantics and qualified impact assessment each need further design.

Keep the added-waiting-case example as a deferred coverage test. Without prior relevant inventory/
selection exposure or explicit displacement, no automatic reconsideration cause is guaranteed.
This is an accepted limit, not a claim that the earlier explanation is unaffected. No dependency
metadata, standing subscription or investigator-directed concern contract is introduced here.

### Deferred investigator-directed propagation, reassessment and scheduling

The human accepts the coverage limit: an exposure-based mechanism cannot find every earlier
explanation that new information might affect. The current direction is suitable for the first
capability; do not reinstate broad entity-based propagation to seek perfect coverage.

**Investigator-directed propagation** could later supplement structural causes. An investigator
might already know an earlier result, or ask which earlier evaluations received associations
about an entity (including other information roles). An exposure-index lookup would identify
candidates, not assert impact or deliver their substantive content. The investigator would
acquire selected results, their questions/scopes and relevant qualified support, then identify
an exact result designation that may need updating, with an exact new finding/cause and a
qualified explanation. That concern could enter the same cause-preserving propagation mechanism.
Candidate discovery, eligibility and the concern's retained representation still need design;
no reverse-lookup API, new declaration type or executed probe is introduced here.

This differs from targeted suppression: it adds a justified concern where automatic exposure
rules missed one. It does not retroactively invent inventory/content exposure, displace the
earlier information, establish a replacement, or require exhaustive search of earlier results.
Actual review deliveries would themselves be recorded. An omitted assessment means unassessed.

Keep targeted suppression by the causing investigator and later reassessment together as
a deferred, qualified, target-and-cause assessment mechanism. An omitted assessment does
not mean unaffected. An assessment that a target needs no change is distinct from a finding
that this cause need not propagate through it. Other causes and independent paths remain;
neither operation certifies the target generally or rewrites historical deliveries.

PostCode could later initiate reassessment automatically, starting with immediately affected
results (the discussion's "0th-order dependents"). Qualified findings might stop further
propagation along those paths without waiting for a user to request reassessment. This is
an orchestration policy over the same assessment mechanism, not weaker evidence requirements
or permission to silently discard a cause. Whether to assess before surfacing warnings or
to expose pending status while assessing remains future behavior, not a UI commitment here.

Scheduling could also respond to UI state: prioritize information underlying currently
visible views, or reassess when a user re-exposes a view. The interface supplies a scheduling
signal; the assessment still concerns exact retained targets and causes. Visibility alone
is not investigator exposure and does not clear warnings or rewrite an exact captured answer.
Only actual reassessment deliveries create new exposure. Pending-status behavior, blocking
versus background execution and scheduling limits remain deferred presentation/orchestration
choices, rather than requirements of the retained-content model.

Investigator-directed propagation, targeted suppression, reassessment/clearance and automatic
scheduling remain deferred and unimplemented. The original
broad experiment flagged outputs that manual inspection found unlikely to require substantive
change. The refined boundary removes those addition causes structurally: no inventory was
received. It does not prove semantic harmlessness or establish that every important new fact
will be noticed. A genuinely new finding might matter to an investigator that never requested
an inventory. Keep that coverage limitation explicit; do not reintroduce implicit entity-wide
exposure through result membership to hide it. These results do not establish that first delivery
requires suppression or clearance. Test further if that scope decision needs stronger evidence.

Exposure granularity grows with actual acquisition, not every retained association. Inventory
exposure can be indexed by its scope/position without creating content-exposure edges for all
entries. Implementations may share delivery records across outputs and index direct edges
separately from derived propagation, preserving meaningful acquisition times. No performance
bound or storage representation is decided by the authored probe.

## Architectural content and diagrams

The catalogue has three responsibilities: architectural concept guidance; content-type
contracts; diagram-type input contracts/mappings. They need not be three physical registries.
One item can express several concepts; one concept can have several representations or prose.
Concept classifications are qualified information. Multiple tags and investigator-proposed
concepts are possible; known icons or concept-specific operations are deferred treatments.
A small recognized vocabulary can grow without becoming an exhaustive whitelist of ideas.

Agents may use qualified classifications as context when authoring follow-up options without
PostCode maintaining an ontology of operations. Future work can decide whether concept-to-investigation
knowledge belongs in PostCode, in agent guidance/judgment, or in both. Besides generating suggestions,
it could assess available investigations as more or less relevant. Such an assessment is advisory,
not a hard eligibility rule: a UI might prioritize, demote, hide or visually de-emphasize an operation
while still allowing the user to request it. Those presentation choices remain outside this remit.

Subject signatures and applicability contracts are already part of the Lens model. Mechanical
investigations have explicit subject signatures; agentic investigations can likewise have signatures
under that existing architecture. Defining the supported agentic capability's signature is ordinary
contract work, not a new ontology mechanism or something this deferral prohibits.

Relevance assessment is distinct from those applicability constraints; “deemed irrelevant” does not
mean an operation is invalid, and missing a suggestion implies neither judgment. The future question
is whether and how qualified architectural classifications feed applicability or relevance judgments,
with concept-to-investigation knowledge in PostCode, agents or both. A host ontology and systematic
classification-driven assessment are deferred; none is required by the current follow-up mechanism.
Existing Lens applicability contracts remain explicit. No choice among the future approaches is
required for this capability, and existing follow-up options acquire no new lifecycle semantics.

“Soft signatures” are one candidate implementation of that already-deferred relevance capability:
a signature could list recommended architectural categories separately from required input constraints.
Missing or unmatched recommendations would not prohibit invocation. This is an illustrative option,
not an adopted signature extension, a separate capability commitment or a prerequisite for this plan.

The examples supply identifying descriptions, prose, admission cases, architectural
relationships, a recovery state model and an interaction. Local roles are variables within
an item with explicit scope, not automatically shared entities. Example bindings relate a general
role to an example; they are not aliases for the same scenario identity. Content refs share
claims with source qualification; entity refs share identity only. Local keys support exact
references and later selection without automatically creating identities.

State content includes bearer, states, transitions, triggers, guards/effects and limits.
Interaction content includes participants, conditions, order, alternatives, causal links and
omissions. A state-transition step names its exact state content/transition; a diagram follows
that reference rather than duplicating it in an illustration specification. Sequence position alone
is not causation. Situations assert resource occupancy, state assignment and execution progress;
they are not inferred from drawings and do not themselves assert transitions.

An **illustration** is a picture the investigator authors as part of its explanation alongside words.
An **illustration specification** is its retained description: the diagram type, exact content inputs
and applicable qualifications/evidence. The fixture stores these in investigram-owned `illustrations`
metadata. This replaces the term “presentation recommendation”: the intent is to communicate through
pictures, not merely suggest a future UI treatment. The specification references architectural
content rather than duplicating its claims or declaring dependencies already owned by content contracts.

The application controls presentation through existing Presentation contracts. An investigator may
include illustrations without being asked; explicitly requested pictures remain subject to fulfillment
requirements. Other compatible diagrams can be rendered independently without an authored illustration
specification. New renderers do not require revising earlier specifications. Compact labels and legends
preserve conditions, scope, evidence and causal meaning; the image alone may be only an overview.
The generator cannot invent missing nodes, transitions, correspondence or ordering. General cross-owner
diagram retrieval is not implemented by the current authored probe.

The content envelope uses **example bindings** (`exampleBindings`) for qualified mappings from
general roles to example subjects. They are not pictures or rendering instructions.

Diagram requirements use the existing result/Presentation contracts; there is no separate
fulfillment mechanism. The investigation supplies qualified content satisfying the requested
diagram-input requirements. Missing required data is an unmet investigation requirement, while
otherwise valid content is retained and processed normally. The application uses existing
Presentation compatibility and failure reporting to arrange/render the content. A presentation
failure does not invalidate the accepted investigation content. Presentation policy remains with
clients under the governing boundary; this does not prescribe renderer packaging or a new UI.

Compatibility is checked against the actual selected content. A later result designation does
not inherit the original answer's diagram compatibility or fulfillment merely by answering the
same query. Preserve the earlier captured answer and apply existing contracts to the newly
selected information, including distinct alternatives. No automatic redesignation, content
substitution or new standing rule follows.

<a id="diagram-alternative-coverage"></a>
**Diagram fulfillment follows the requested selection.** If a diagram is requested for an answer
containing several alternatives, check coverage for each alternative within that request's scope.
One renderable alternative does not establish fulfillment for an unrenderable alternative. Preserve
all alternatives and report which lack required content or fail Presentation compatibility; otherwise
valid information remains available. A request explicitly limited to one alternative is assessed for
that selection alone. Separate diagrams may satisfy the requirement; no combined diagram or new
renderer is required. A supported combined presentation may cover several alternatives only if it
keeps their qualified differences explicit rather than synthesizing a reconciled model.

Acceptance coverage includes an answer with two alternatives where only one supports the requested
state diagram: the supported alternative is identifiable, the other's unmet requirement is explicit,
and the whole request is not reported fully fulfilled. Presentation failure remains distinct from
missing investigation content. Exact historical access and optional illustrations retain their
existing contracts.

<a id="offered-followup-investigation"></a>
## Follow-up options and surrounding application context

Follow-up options are qualified metadata owned by exact producing investigrams. They express
available investigations, not necessarily recommended next steps. References include exact
owner and option key; replacement/reselection of entity associations does not retarget options.
The fixture follows an option made available within Q1's result while keeping its originating
owner explicit. Q2's expanded admission bundle does not repeat a question Q2 already answered.
This is an authoring choice, not a prohibition on reinvestigation.

Execution of retained follow-up options is in scope, not merely their production and storage.
An investigation can return an option; the application can retrieve it and request its execution
by exact owner/option reference. The resulting investigation receives the option's meaning, targets,
parameters and relevant qualified context under a supported method. Preserve actual delivery,
provenance and result contracts through the common mechanism; naming an unsupported method does
not make an option executable.

The focused live trials must include this option-specific invocation path through the supported
application boundary. General investigation of an earlier result alone does not cover it. Controlled
dialogs provide deterministic protocol and lifecycle coverage. The authored fixture already illustrates
the chain, but does not establish product integration. No menu, ranking, global operation catalogue,
ontology or particular public Lens name is required; exact API packaging remains an implementation
choice. This scope does not replace the existing ability to investigate a prior result independently
of any offered option.

The follow-up operation delegates its question to the selected qualified option under a supported
method. Its default result contract is qualified information in supported types,
not a prescribed diagram. An explicit “generate a state diagram” promise additionally requires
compatible data under the investigation result contract and successful presentation under the
existing application contract, with their respective unmet/failure outcomes kept distinct. Schemas
alone cannot establish adequate interpretation. Optional specialization is a conceptual
contract example not yet exercised as a product API; existing result/Presentation contracts govern
the implementation.

<a id="global-investigation-entry"></a>
Overview, Explain, structural listings, option discovery and user selection are surrounding
application context. They demonstrate fit, not a menu/UI implementation commitment. Human
pushback to investigators stays outside this slice; existing inadequacy feedback is to
researchers/developers. General reconciliation operations are not implied by selecting
retained information. Direct/exact access must preserve qualification, association standing,
actual delivery, reference lifetime and result snapshots regardless of presentation.

<a id="composition-as-a-design-probe"></a>
## Composition as a design probe

The two Cockatiel orders remain intentionally different setups. Bulkhead outside breaker:
a later caller holds execution capacity while waiting for the recovery decision. Breaker
outside bulkhead: the trial reserves the breaker slot while queued behind an independently
occupied bulkhead. State categories, scenario roles and particular execution progress remain
distinct. Scenario relationships can stay locally designated; this proves local addressing
suffices here, not that general relationship identities are never useful.

Q4 receives selected P, S, R and B information, not whole investigrams or a historical
superseded admission payload by default. Its Query result has its own identity; the contribution also declares pattern
identities C-BB/C-BH. Follow-up can select a pattern or an exact occurrence within RESULT-Q4;
neither recreates the pair as a new generic operation or promotes every selected node.
The two-subject invocation is a design probe with explicit unordered roles. A general state
model and a second consumer of situation/resource content remain useful later probes, not
new requirements silently introduced here.

## Implementation boundary and governing changes

The [current contracts](../src/lib/investigation/contracts.ts) retain prose investigrams,
subject associations, child trees, correction records and generating provenance with
`citations` and delivery history. The [capability reference](../docs/capability-reference.md)
describes retained interpretation and follow-up within the active process, not the new
entity context-delivery/declaration protocol. Those facilities provide qualified acquisition,
identity, history and Session lifetime machinery; they do not already implement this proposal.

Specific inspected constraints still matter for migration:

| Existing machinery | Consequence for this design |
| --- | --- |
| One investigation already returns a root with recursive children and atomic allocation | Retain atomic allocation with an unordered contribution pool; remove investigram nesting and defer organization. Introductions, content references and result associations carry their own meanings. |
| Current correction constructs a replacement and has selection/conflict/reconsideration effects | Replace those effects explicitly with declaration rules; do not merely rename the correction field. |
| Current unresolved inconsistency indexes comparisons of earlier investigrams and requires recorded substantive delivery | Preserve qualified disagreement without displacement, but target exact content items/associations. Acquisition becomes an investigator instruction under the common boundary; remove the special prior-delivery gate. |
| `correctedSubjects` has a restricted existing subject vocabulary | New entities/result targets and association operations need explicit validation/migration. |
| Investigrams/provenance require `originatingModule` | Specify attributable originating context for new subjects; interpreted implementation correspondence cannot become a mechanical guarantee. |
| Current investigation parameters are empty; context parts are prose/referent/qualifications | Extend declared request meaning and structured partial/full delivery deliberately. Future dialogue acquisitions are provenance, not pre-request parameters. |

These findings are recorded against [acceptance](../src/lib/investigation/acceptance.ts),
[revision processing](../src/lib/investigation/revisions.ts) and the
[application boundary](../src/lib/application/index.ts). The agreed endpoint brings all existing mechanical architectural information into the common
model in stages. This does not require replacing every physical storage path or provider algorithm.
Verify interpreted use of mechanical subjects while preserving their provider guarantees.

The planning package would need explicit treatment of:

- Interpreted, architectural-relationship/pattern and query-result identities; preservation
  of existing mechanical identity and result guarantees.
- Investigrams as immutable mechanically or agentically produced analysis contributions, with explicit
  method-specific guarantees; broader content terminology, item addresses, cross-owner references,
  declaration-only results and result designation, with fixed child composition removed and investigram organization deferred.
- Association addition/supersession/withdrawal replacing whole-investigram correction,
  including structural validation, acquisition guidance, conflict/standing and exact historical access.
- Exact association/content exposure, separate scoped inventory exposure, and result-membership
  reconsideration with qualified context disclosures and exact cause identities. Entity/result
  IDs organize access; they are not blanket exposure units.
  Rename citation index to exposure index consistently across affected governing documents, APIs
  and code as part of this plan, alongside the semantic migration. This is not merely a rename;
  preserve the distinction from evidence citations and substantive support, whose meanings differ.
- Representation-independent qualification, captured basis, direct/exact application access,
  atomicity and the supported Session boundary. No foundation or governing text is changed here.

<a id="governing-migration-inventory"></a>
## Governing migration inventory for drafting

This is a preparation inventory, not supersession metadata or permission to edit governing files.
Drafting must identify the complete headed units being replaced, carry their unaffected obligations
forward explicitly, and add both predecessor-to-successor and successor-to-predecessor mappings in
the package. Follow live successors rather than treating historically superseded wording as a second
independent governing rule. The exact packaging into decision records remains drafting work.

| Governing source / affected unit | Required treatment in the package |
| --- | --- |
| [Specialized architectural investigation: Architectural subjects](../docs/decisions/specialized-architectural-investigation.md#architectural-subjects) | Broaden eligible Entity identities to deliberately identified architectural relationships/patterns, preserving qualification and mechanical identity guarantees. Add Query result as a separate core concept, not another Entity kind. Not every edge becomes an Entity. |
| [Specialized architectural investigation: Architectural interpretation](../docs/decisions/specialized-architectural-investigation.md#architectural-interpretation) | Generalize Investigram to analysis contributions from mechanical/agentic producers, with Analysis content and separately attributed method guarantees. This is the live successor of structured-content's representation definition. |
| [Structured content: Generalize interpretation contracts](../docs/decisions/structured-investigram-content.md#generalize-interpretation-contracts), including Application to structured content | Replace its inherited association, correction, exposure and full-delivery rules with exact declarations and qualified acquisitions. Name the change from mechanically enforced whole-target delivery to semantic acquisition instructions; preserve accurate delivery records, support and structural rejection. Do not describe arbitrary partial delivery as complete. |
| [Investigrams: correction, conflicts and redisplay](../docs/decisions/investigrams-and-progressive-investigation.md#record-explicit-corrections-without-rewriting-earlier-interpretation), through the structured-content successor where applicable | Replace whole-investigram replacement and latest-endpoint primary selection with exact association displacement, result redesignation and all equally standing alternatives for designation-based selection. Carry R1 method-specific answers, R2 authoring instructions and R3 exact subjects into the replacement. Revise inspection/redisplay without losing original access. |
| [Investigrams: citation exposure](../docs/decisions/investigrams-and-progressive-investigation.md#record-citation-exposure-and-derive-reconsideration-status), through the structured-content successor | Replace the shared generating-evaluation index with actual per-producing-investigram exposure, exact content/association acquisition and scoped inventory exposure. Preserve cause identities and distinguish membership concerns. Replace the complete-correction-context exemption with actual delivery timing and qualified substantive updates before submission; no retrospective clearance. Rename exposure indexes without renaming evidence citations. |
| [Investigrams: unresolved inconsistency clarification](../docs/decisions/investigrams-and-progressive-investigation.md#conflicts-and-primary-selection) | Explicitly replace the 2026-10-02 prior-citation prerequisite and whole-investigram endpoints. Target exact claims/uses, preserve attributed qualified disagreement, and use the common instruction-versus-validation boundary. |
| [Investigrams: fixed composition](../docs/decisions/investigrams-and-progressive-investigation.md#distinguish-fixed-composition-from-investigation-provenance), [operation/Lens decision](../docs/decisions/investigation-operations-and-lenses.md#decision), structured-content composition provisions | Replace the at-most-one-root/tree model with an unordered atomic contribution pool. Preserve operation/Lens separation, truthful terminal outcomes, provenance, exact subject meaning and qualified decomposition findings. Remove tree-dependent inspection and CLI navigation commitments; no replacement organization mechanism is implied. |
| [Investigator execution: bounded dialog](../docs/decisions/investigator-execution-and-evidence-access.md#start-each-operation-fresh-and-permit-bounded-investigator-dialogue), through the structured-content successor | Specify initial identification context, exact selected prior-answer input, additional acquisition, explicit referent discovery and during-production update delivery. Carry unchanged evidence-access, source-as-data, authorization, operational and outcome protections forward. Follow-up-option execution is an API-level delivered capability with explicit contracts. |
| [Lens answer identity](../docs/decisions/lens-application-and-request-outcomes.md#give-equivalent-qualified-answers-repeatable-identity), [exact retained answers](../docs/decisions/exact-retained-answer-presentation.md), [application API delivery](../docs/decisions/internal-application-api.md#qualified-content-delivery) | Restate answer-relevant selection, standing and cause snapshots in the new terms. Preserve immutable Projection identity, exact historical access, application-controlled selection, qualified unsupported/partial outcomes and Presentation compatibility. No renderer store access or silent resolution through current history. Session-local engine invocation IDs alone do not distinguish otherwise equivalent answers. |
| [Session retained-domain boundaries](../docs/decisions/transient-analysis-sessions.md#retained-domain-and-storage-boundaries) and determinism/retention headings | Reconcile eligible identified relationships with existing derived relationship/grouping distinctions; do not make every derived edge/group an Entity. Unify retention and exact lookup while preserving stable references, Session lifetime, mechanical semantic determinism and qualified storage boundaries. Method-specific content and later organizing status remain distinct. |
| [Research-question-driven observation](../docs/decisions/research-question-driven-observation.md) live successors for basis, retained context and request reporting | Carry captured basis, provenance, qualified architectural context and reporting obligations forward without imposing research capture on ordinary use. Trace through this record where it supersedes the earlier specialized-investigation or exact-answer headings. Only replace units whose architectural meaning actually changes. |

Canonical revision targets are **core concepts** (Entity, Relationship, Query result, Investigation/
Investigator, Investigram, Analysis content, association/result designation, exposure, Captured basis,
Evaluation, Session and the Projection/engine distinction); **architectural constraints** (retained
information, exact access, producer exposure, selection, investigator acquisition and determinism);
and the **application specification** (immutable history, migrated operations, qualified outcomes and
the API-level representative capabilities). Preserve existing meanings where only cross-references
or old correction terminology need revision. A new term in these notes does not automatically require
an independent core-concept entry.

Also revise the capability/CLI references to match actual supported paths and removal of tree or
whole-investigram revision behavior. The backlog revisions must reconcile the existing architectural-
accounts and reconsideration candidates with delivered scope, then carry the explicitly deferred
mechanisms as candidates, not hidden acceptance requirements. Human-facing content rules still cover
agent-authored names, diagram labels and qualifications. No foundation or development-process revision
is required or authorized by this inventory.

## Execution outcomes, known inadequacy and undetected error

Distinguish receipt of a contribution, acceptance for retention, fulfillment of the request and
substantive correctness. These distinctions apply to both mechanical and agentic production.

| Case | Meaning and required treatment |
| --- | --- |
| No accepted investigram obtained | Connectivity/authentication failure, mechanical file-read failure, or an unrepairable invalid response can prevent contribution acceptance. Record/report the execution outcome; do not manufacture architectural content to represent the failure. No response and a received-but-unacceptable response remain distinguishable. |
| PostCode detects unmet requirements | Expected descriptions, result content or diagram-supporting data are missing when execution ends without repair. Report the specific unmet contract. Unresolved references and other invalid data cannot be accepted; structurally valid information may nevertheless fail to fulfill the requested result. |
| The producer reports inability or incompleteness | Preserve the producer's report and its grounds/limitations, distinguishing it from PostCode's own contract checks. Relevant information can carry its own qualifications. |
| Accepted contribution, contracts met, reported success, but substantively wrong or incomplete | No general acceptance mechanism can detect this case. Acceptance and reported success do not certify architectural correctness/completeness. Specific mechanical guarantees remain method- and scope-qualified. Later discovery can lead to challenge, supersession/withdrawal and the existing exposure-based reconsideration mechanisms; discovery is not guaranteed. |

Execution policy may retry or attempt repair through dialog. The precise reporting fields,
carrier and repair strategy are implementation choices within these observable distinctions.
An established empty finding is still different from failure to obtain an answer. No additional
general semantic acceptance gate follows from undetected errors.

Agreed treatment: when an investigram passes the ordinary data-integrity acceptance requirements,
retain and process all its content normally, including its association declarations and their
ordinary effects. Failure to achieve the whole request does not invalidate what the investigation
did achieve. There is no special partial-result quarantine, selective suppression or separate
retention path merely because fulfillment is incomplete. Qualifications and known unmet requirements
remain available; normal processing does not present the request as fulfilled or certify correctness.
Malformed data still requires repair or rejection under the ordinary integrity rules.

This resolves the architectural retention question. Outcome fields, result packaging and repair
sequence are implementation choices that must preserve the distinction between available accepted
information and fulfillment of the request. No intermediate-submission mechanism is required by
this agreement.

User-reported suspected error is a possible future source of objections, not proof that a result
is wrong. The human explicitly reconfirmed deferring both recording such objections for the
investigator and investigation driven by them. No automatic withdrawal or reconsideration follows
from hypothetical user feedback in this capability. Existing developer/research feedback is not
this mechanism. Future objection targets, inquiry behavior and any propagation policy need their
own design; they are not added here.

## Design requirements, implementation choices and deferred capabilities

The human clarified that these notes should not prescribe implementation choices merely because
the authored probes required concrete ones. A choice belongs in the architectural design when
changing it would change what retained information means, what an investigator can rely on,
what a consumer receives, or the promised capability. Different implementations that preserve
those guarantees need not be decided here. Observable failure, completeness or qualification
behavior cannot be dismissed as an implementation detail.

| Area | Architectural requirement or decision | Implementation freedom within that boundary |
| --- | --- | --- |
| Partial, failed and empty results | Retain and process accepted investigram content normally; separately preserve fulfillment, known inadequacy and the distinction between failure and established emptiness. | Buffering, batching, internal checkpoints and error-handling structure, subject to accepted atomicity and outcome contracts. |
| Associations and results | Membership meaning, qualification, standing and exact history; ordering only where it conveys meaning. | Serialization, collection types, indexes and incidental ordering that preserve the supported capability and disclose limits accurately. Investigram organization is deferred, not an implementation choice to add here. |
| Context acquisition | Selection meaning, actual coverage, qualification, exposure and the representation of unavailable or incomplete support. | Dialog tool shapes, fetching strategy, pagination mechanics and operational limits that preserve those contracts. |
| Architectural content and diagrams | State-dependent behavior exercises varied architectural subjects/relationships and supplies the meaning needed for a state diagram; live-agent runs check integration and controlled dialogs provide mechanism coverage. This is not selection of the initial user-facing catalogue. | Concrete examples, detailed schemas, field layout and renderer implementation that satisfy the agreed validation coverage. |
| Entity lookup | Stable exact identity within the Session; qualified and potentially ambiguous name lookup; no silent identity merging or displaced-description authority. | Storage layout, lookup indexes, caching and search mechanics within the supported lookup semantics. |
| Migration and verification | All existing mechanical architectural information and agentic capabilities join the common model in agreed stages; define observable acceptance scenarios and retained guarantees. | Test harnesses, internal task breakdown and sequencing within those stages. |

An executable probe is evidence about a proposed behavior, not authority for every field, constant,
role spelling or operational restriction in its implementation. During drafting, distinguish:

- **Architectural requirements:** meaning, invariants and observable capabilities to preserve.
- **Illustrative implementation choices:** replaceable details used to exercise those requirements.
- **Deferred capabilities:** explicitly outside the first delivery, not commitments for implementers
  to fill in opportunistically.

Implementation may propose detailed schemas, APIs and bounds without reopening the design when
it preserves the agreed behavior. A choice that changes that behavior, weakens a guarantee or
exposes an unresolved architectural question requires discussion and the applicable decision
workflow. Neither the probes nor this boundary authorize product implementation.

<a id="decisions-still-to-make-in-notes"></a>
## Settled decisions and remaining drafting work

The original review questions were resolved below. Re-review subsequently identified three
application-boundary consequences: R1 is resolved by the [Lens-answer rule](#lens-answer-and-standing);
R2 is clarified by the [redesignation instruction](#redesignation-instructions): update the earlier
answer being revised, without a duty to update every containing result. R3 is resolved by the
[exact-selection subject rule](#prior-result-subject), with originating question and displacement
context preserved. The [review alignment summary](structured-account-example/review-alignment.md#review-resolutions)
locates the resolutions, authored validation and explicit deferrals. Remaining work is to express
these agreements in the planning package and map their governing changes. The incremental review
confirmed no regression; its misleading native-verification example is corrected by the
[assembly/production distinction](#answer-assembly-and-production-exposure), without changing exposure
semantics. The [review note](structured-account-example/review-alignment.md#second-re-review-and-incremental-history-check)
records that correction and the concrete baseline-identification warning-volume risk.

| Question | Required resolution |
| --- | --- |
| Validation coverage (planning work) | The selected concept is state-dependent behavior. Map the common mechanism to observable checks using a few live-agent runs and controlled dialogs; test details remain implementation choices. Interaction/composition remain design probes, not required implemented capabilities. Initial user-facing catalogue selection is outside this task. |
| Name-search scope (resolved) | Support historical/displaced-name lookup with qualified standing and current information access. Default history inclusion and user continuation behavior are interface policies; preserve accurate coverage and ambiguity. |
| Result ordering and investigram organization (resolved) | Atomic capture and result membership introduce no implicit claim order. Remove investigram parent/child organization and defer agentic, mechanical or combined organization until needed. Preserve explicit content/declaration semantics and qualifications. |
| Exposure terminology migration (resolved) | Include the rename throughout affected governing documents, APIs and code, alongside the semantic migration; do not rename distinct evidence citations or support. |
| Early vertical validation (resolved) | Test the common mechanism through an internal producer boundary before real-provider migration, then exercise initial mechanical integration and the agentic/diagram path early. Detailed interfaces and milestones remain implementation/planning work. |

Association versus inventory/selection-scope exposure, actual reason delivery, standing and
qualified access remain requirements. Richer selectors, exact tool shapes and operational bounds
are not all architectural decisions. Detailed migration task breakdown is implementation/planning
work within the agreed stages. The formal name **Analysis content** is agreed for the proposed model; this is not yet an
adopted governing edit.

Declared dependencies, investigator-directed propagation, targeted suppression, reassessment/clearance
and automatic scheduling are deferred beyond the first capability unless a later concrete need changes that
scope. Persistence, global discovery and broader UI remain outside this work. The plan must
carry these boundaries explicitly, while resolving the actual first-delivery contracts.

Verification should combine deterministic acceptance/history/API tests, an actual bounded
investigation testing discovery/reuse and supported dialogue, and representative rendering.
The [current authored checks](structured-account-example/README.md#verification) establish
structural/lifecycle consistency only. They do not prove interpretation quality, semantic
identity, performance, live agent compliance or product acceptance.

## Designs and theories to build on

Prior research identified [incremental formalization](https://people.engr.tamu.edu/shipman/viki/papers/tochi/tochi.html),
[qualified statements](https://www.mediawiki.org/wiki/Wikibase/DataModel/Primer),
[reason maintenance](https://dspace.mit.edu/entities/publication/5377b306-4ecc-4687-b1f5-78cbb4a0543a)
and [nanopublications](https://nanopub.net/docs/guidelines/) as conceptual precedents.
Missing information is not a negative assertion; structural validity is not truth;
an agent's classification remains a claim. No library selection or universal logical
inference engine follows from these references.
The [research discussion](structured-architectural-accounts.md) records the exploration behind
these precedents. Preserve identity, claims, provenance and contestability separately; expressive
power alone is not a reason to adopt a universal truth-maintenance model.
