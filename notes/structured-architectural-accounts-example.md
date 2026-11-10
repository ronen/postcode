# Architectural accounts: concrete walkthrough

Updated: 2026-11-10

An exploratory example of the [working proposal](structured-architectural-accounts-proposal.md).
Current recommendations and remaining choices are stated inline. They are provisional,
not adopted decisions, implementation authorization or an API schema. This follows the
[Cockatiel examples](initial-journey/cockatiel-account-examples.md): one captured
revision, default single-trial recovery, static interpretation. The admission omission
and discovery are staged; no new source or runtime investigation has been performed.

## Choices for this pass

- Shared reference S continues to designate Half-open. Definitions and behavior
  occupy separately correctable child investigrams under a coherent result root.
- The caller explicitly selects context for the subject follow-up, using the
  originating answer to propose the references. Origin is not a hidden input rule.
- The follow-up introduces new roles and relationship W, with a definition child of
  its own. Earlier definitions are neither extended nor reparented.
- Every child delivers its own applicable qualifications. Composition does not
  implicitly inherit substantive limitations from its parent.
- Identifying descriptions are designated by qualified per-subject identifies
  associations, independently of an account's content form or other describes roles.
- Every answer supplies fixed identifying support for its substantive subject
  references. Supporting definitions need not be selected account constituents.
- Retain the follow-up request's answer and provide qualified exact/current access.
  Presume the UI can show and select retained information; no separate assembled
  answer or UI workflow is required by this example.
- Keep evaluation-wide exposure/reconsideration. Smaller correction units do not
  establish smaller dependency sets or fewer warnings.

Only explicit introduction/reuse is exercised as an application path here. Local/prose
promotion remains a separate probe, not an agreed scope exclusion. The caller may
be a direct API client. This is an architecture exercise: presume suitable viewing
and selection affordances and specify only their behavioral inputs. Subject(s), Lens,
parameters and supplied context are distinct; merely displaying accounts together
neither feeds them to an investigator nor creates a new domain result.

## 1. Establish referents and basis

A mechanical module analysis yields M and its qualified information. An orientation
investigation from M introduces Circuit breaker policy kind P, with an attributable
definition and qualified implementation mapping. This is a proposed discovery path;
seeding orientation in a fixture cannot demonstrate discovery.

The admission investigation introduces S for Half-open and S-open/S-closed for the
Open and Closed state categories used by the explanation. S is a state category,
not one runtime occurrence or a trial execution. Default recovery configuration
qualifies the behavioral claims; examining only that configuration need not make
it part of the state category's identity.

Allocation guarantees stable reference within the Session, not mechanical correctness,
uniqueness across discoveries or correspondence across program revisions. Introducing
provenance and basis remain attributable; later accounts may refine, dispute or
identify conflation. Mechanical M and interpreted P/S share a reference mechanism
without sharing guarantees. Interpreted identity's allocation/continuity contract
still needs an explicit governing decision before implementation.

The shared-instance role R is deliberately introduced during the follow-up. Knowing
that a policy has instances would not logically preclude missing waiting behavior,
but delaying R here preserves the original journey and tests genuinely new subjects.

## 2. One introduction, separate correction units

The hierarchy itself is existing machinery: one investigation can already return
a root and recursive child investigrams, each with its own retained ID. Choosing
definition and admission children is this example's proposed use of that machinery.
Introducing Half-open as a shared subject and recording which investigram identifies
it are proposed extensions, not existing hierarchy behavior.

The admission evaluation returns a fixed composition:

```text
INTRO-1                 root: orientation to this result
├── DEFINITIONS-1       child: state-category descriptions
└── ADMISSION-1         child: admission/inspection behavior; waiting omitted
```

DEFINITIONS-1 has qualified **identifies** associations with S, S-open and S-closed.
It may also **describe** P through its state relationships without identifying P.
Identification is a role on each account–subject association, not a whole-account
content kind. This avoids returning it as P's definition merely because it contains
identifying content and describes P. It remains one small coherent unit, not an
investigram for each sentence or a unique authoritative definition.

ADMISSION-1 describes P's admission behavior and refers to S. That reference does
not automatically make it a describes-S association. It contains the admission cases
and inspection account, with support and qualifications attributable to those claims.

Thus Circuit Breaker already has retained subject reference P, and ADMISSION-1 is
one qualified item associated with it through a describes association. Here that
item is an independently addressable investigram. Its composition parent INTRO-1
is separate from the subject association; neither P nor INTRO-1 owns every future
account about Circuit Breaker.

INTRO-1 organizes the explanation without repeating the behavioral claims as a
second account. If its own content were misleading, correcting a child would not
correct the root's claim. Its orientation remains qualified interpretation with
ordinary exposure/correction
semantics. Thin roots must still contribute useful context; this example does not
introduce an unqualified children-only result type. If a root adds nothing useful,
reconsider the result pattern rather than retaining empty scaffolding by convention.

Each child delivers every qualification applicable to its own claims, including
static interpretation and recovery scope where relevant. INTRO-1 may summarize these
limits but is not their sole owner. Storage may share explicit immutable support or
provenance records; delivery must still resolve and supply applicable qualification.
There is no implicit parent qualification that a reader must discover separately.

Accept the result atomically, resolving submission-local keys to shared IDs.
ANSWER-1 fixes the selected result, children, support and revision snapshot. Its
identity differs from INTRO-1, and exact retrieval remains available after correction.

### What each answer owes for its references

For this walkthrough, an answer supplies qualified identifying content or an explicit
unresolved contextual designation for substantive subject references, with exact
inspectable support. The application selects and fixes that content and its supporting
references when constructing the answer. A renderer neither invents a description
nor silently retrieves a newer preferred one during exact presentation.

This is support for understanding a referent, not evidence for every behavioral claim
about it. Supporting definition investigrams need not become selected constituents.
Preserve the descriptions grounding each selected account, and expose newer or
competing descriptions separately; do not silently reinterpret old content. Use
already qualified descriptions from selected context or the new result's explicit
identifying associations. Deriving a new description would require qualified analysis.

Avoid unlimited recursive inclusion. Enough qualified context must distinguish the
intended referents; ambiguity/unavailable support must remain explicit. General
support-selection, bounding and intelligibility checks still need design, but the
plain answers must carry that identifying support regardless of UI arrangement.

Human display alone is not investigator exposure. If an investigator later receives
this substantive support, record exposure even though it is not a selected constituent.
A short identifying description is not complete delivery of its owning investigram
and does not establish correction eligibility.

## 3. The caller selects follow-up context

The human selects Half-open through a structured UI affordance and chooses an offered
concurrent-callers investigation; the prose question below explains its meaning,
not text the human must type. CLI handles or GUI menus/badges are possible affordances
whose design is deferred.

For this path, the caller constructs the request from ANSWER-1. It explicitly names
ADMISSION-1 as the source explanation being followed and DEFINITIONS-1 as the chosen
identifying description of S. Both are available in that exact answer. This is a
structural context choice, not analysis establishing relevance or exhaustiveness.

| Request component | Concrete value |
| --- | --- |
| Subject | S. |
| Information need | Concurrent callers and trial outcomes in default single-trial recovery. |
| Selected prior interpretation | DEFINITIONS-1 and ADMISSION-1, by exact reference. |
| Architectural basis | Captured project/revision and actual originating analysis context. |
| Navigation lineage | S was selected while viewing ANSWER-1. |

The coordinator does not obtain ADMISSION-1 from the describes-S index: it need not
appear there. Nor does it silently supply every mention of S. A different navigation
route can choose the same exact context and yield the same effective inputs. Choosing
different context changes inputs explicitly, not through an undisclosed origin rule.
A fresh request on S without an originating answer needs its own context-selection
policy and is not demonstrated by this path.

The general distinction is that both contextual and subject-only requests should
receive relevant retained identifying descriptions with scope and revision/conflict
context. Only a selection with an explicitly known originating explanation adds that
explanation on the strength of origin. A bare subject handle supplies no such origin;
neither the latest answer nor the subject's introduction is a substitute. If the UI
knows only an answer and cannot identify the originating account, it must represent
that actual granularity and make any broader context selection explicit.
For subject-only requests, identifying-candidate selection and bounds remain open;
this does not justify omitting all retained definitions or supplying the full history.

ADMISSION-1 explicitly lists S as a referent. The required discovery capability can
therefore offer it among accounts referring to Half-open, either initially or when
the investigator requests them. Known navigation origin is unnecessary for finding
it; the index implementation remains an engineering choice. Ordering candidates by
retention time may be useful, but cannot establish which account the human came from
or which is authoritative/applicable. Preserve any actual origin separately.

Current describes-style association lookup does not supply this reverse-reference
discovery, so implementation and an origin-free discovery fixture are still needed.
Bare IDs do not create content exposure; substantive titles/descriptions and retrieved
content do. Discovering ADMISSION-1 enables further inspection, not a guarantee that
the investigator notices its omission or corrects it.

Give the information need declared Lens/operation meaning. Fixed questions may need
no free-form parameters; meaningful variations and context selection must enter
request/reuse identity. S alone cannot identify the effective request.

M is known from actual originating evaluations and can remain an explicit analysis-entry
anchor for this example. Do not derive it by treating the interpreted P-to-M mapping
as mechanical fact. It does not claim that S is implemented exclusively by M.
Clarifying the existing module field versus generalizing originating context remains
open, especially beyond this single-origin case.

### Actual delivery

Initial context is a seed for an existing investigator dialogue, not a closed set of
permitted information. In this path the caller names DEFINITIONS-1 and ADMISSION-1
up front. More generally, a hybrid can supply identifying descriptions initially,
expose other available accounts/attributes, and let the investigator request relevant
content or missing portions. An independent selection of S could discover further
context this way once the required subject indexes/queries exist.

The initial policy need not impose a rigid relevance cutoff. Deliveries remain
bounded and omissions explicit, with further retrieval available within dialogue
limits. Record what actually arrives, including substantive listing content; mere
availability is not exposure. Complete corrective context may be acquired over later
requests, so initial omission of a target need not prevent eventual correction.

The coordinator supplies and records complete own content, referent information and
qualifications of both selected children, with resolvable support and disclosed
revision context. Their parent need not be delivered because their qualifications
are self-contained in delivery. Parent/answer IDs alone do not expose their content.
The investigator separately acquires the necessary program evidence: earlier
interpretation is reusable context, not independent corroboration.

Structured completeness must already be defined. If bounds omit an admission branch
or required qualification, ADMISSION-1 is not eligible for correction. Retrieve the
missing material or finish without the correction. Navigation origin and ordinary
account follow-up do not bypass this actual-delivery check.

## 4. New role definitions, behavior and correction

The investigation is selected on Half-open S, but its findings can add qualified
items to Circuit Breaker P or explicitly correct P's earlier items. Output associations
need not equal the input subject. Here TRIAL-1 adds understanding while ADMISSION-2
replaces the identified ADMISSION-1; both remain associated with their declared subjects.

The follow-up introduces:

| Reference | Meaning |
| --- | --- |
| R | Shared breaker-instance role in the described usage pattern, not an observed runtime object. |
| E-trial | An execution occupying the recovery-trial role. |
| E-caller | A concurrent caller's execution role. |
| W | The waiting relationship between E-caller and R's recovery decision in the named usage pattern; occurrence and conditions remain qualified claims. |

Qualified content connects R to P and distinguishes S from a particular instance
occupying that state. These are new descriptions, not additions to DEFINITIONS-1.
Use a consistent partition:

```text
TRIAL-RESULT-1                 root: orientation to the follow-up result
├── ROLE-DEFINITIONS-1         child: identifying descriptions of R, roles and W
└── TRIAL-1                    child: interaction and recovery outcomes
      accompanying correction:
        target:               ADMISSION-1
        replacement:          ADMISSION-2
        corrected subject:    P
        reason:               omitted waiting during an occupied recovery trial
```

ROLE-DEFINITIONS-1 identifies R, E-trial, E-caller and W through explicit qualified
associations. It may describe their connection to P without identifying P.
TRIAL-1 uses supported interaction/transition forms and qualified describes
associations with P, S and R where its claims warrant them. Each child supplies its
own applicable qualifications. Definitions need not always be separate children;
we choose them here because independent follow-up/correction is useful to test.

Default recovery configuration and the conditions under which waiting occurs belong
to TRIAL-1/ADMISSION-2's behavioral claims, not W's identity merely because this is
the configuration examined. Retaining W does not establish that waiting actually
occurs. A correction to waiting conditions normally targets behavioral content;
wrong participants or identifying characterization can also require correcting
ROLE-DEFINITIONS-1 or distinguishing another referent. Definitions are still claims,
and not every relationship correction necessarily preserves identity.

TRIAL-1 explains shared state across calls, supplied trial work, waiting while the
single trial is occupied, and how trial outcomes affect subsequent admission,
including possible refusal of the waiting caller. ADMISSION-2 restates the complete
admission account with the missing case and conditions. Both retain default-configuration
and static possible-scenario limits; neither claims an observed execution.

The correction explicitly identifies P because it corrects P's admission account.
For this example, corrected subjects identify whose descriptive accounts are corrected,
not every participant or condition. Include S too if explicitly correcting an account
of S; do not automatically copy input S, origin M or all referents. General validation
of this rule remains open. Current corrected-subject validation needs extension.

TRIAL-RESULT-1's reporting tree and ADMISSION-2's replacement tree are disjoint.
Shared subject IDs and evidence do not constitute shared composition children.
Neither adopts DEFINITIONS-1 or appends to INTRO-1. The correction's reason,
qualifications and evidence remain accessible as reporting content. S and its
identifying description are unchanged by this behavioral correction.

TRIAL-1 is the correction reporter, so the reason and qualifications belong to its
own substantive content. Correcting TRIAL-1 later preserves that original reasoning
and correction record; it does not automatically revoke or retarget the admission
correction. Changing a correction's standing would need explicit semantics beyond
this example.

## 5. Retain the result and expose qualified information

The concurrent-callers request returns FOLLOWUP-ANSWER-1, retaining the selected
TRIAL-RESULT-1 tree and accompanying ADMISSION-2 with support and revision context.
It supplies identifying support for S from DEFINITIONS-1 without making that whole
investigram a selected constituent. New roles are identified through ROLE-DEFINITIONS-1.
Actual input-context provenance remains a separate responsibility.

The user can view these retained items and select subjects or accounts from them.
How the UI groups them is outside this design. It does not require a second assembled
answer, a collection Lens or a saved selection. If the UI supplies a selection as
investigation context, that becomes explicit input and actual delivery is recorded.
Selecting several subjects for an applicable Lens is a separate semantic operation,
with declared cardinality/order/roles, not a consequence of displaying accounts together.

A fresh replacement-aware selection from INTRO-1 supplies identifying support for
ADMISSION-2's new R/E-caller/W references from ROLE-DEFINITIONS-1, although that child
is outside INTRO-1's tree. Here its explicit identifying associations provide exact
support references. The application freezes the selected support and qualification/
revision context for the new answer; presentation cannot invent the link.

| Application access | Result |
| --- | --- |
| Exact ANSWER-1 | Original content, selected references, support and captured revision context. |
| Exact FOLLOWUP-ANSWER-1 | The follow-up answer with its fixed identifying support; supporting definitions need not be constituents. |
| Fresh inspection of ADMISSION-1 | ADMISSION-1 itself, with applicable current correction context; never silent redirection. |
| Fresh replacement-aware selection from INTRO-1 | Can select DEFINITIONS-1 and ADMISSION-2 with displacement and fixed support for new role references; stored children remain unchanged. |

If DEFINITIONS-2 later exists, exact access to DEFINITIONS-1 still targets it. A fresh
replacement-aware request can select DEFINITIONS-2 with the substitution and conflicts
disclosed. Earlier answers retain their snapshots. Neither operation silently rewrites
old TRIAL-1's identifying context or establishes that its behavior was revalidated.
An answer containing old behavior alongside a newer definition preserves that difference.

Fresh identifying-description lookup uses per-subject identifies associations and
exposes scope, revisions and conflicts. Independent definitions remain candidates;
TRIAL-1 does not become a definition merely because it describes S. Likewise,
DEFINITIONS-1 does not identify P merely because it describes P's states. Candidate
selection policy and delivery bounds remain architectural design work, independent
of UI layout or selection gestures.

## 6. Supply diagram meaning and discovery

This step moves from the retained-account mechanism to architectural content forms.
The recommendation is to retain structured claims through the same qualified
investigrams and subject references used above. For example, a transition's source
and destination can reference retained state subjects, while its trigger, guard,
effect and state-bearing participant are explicit content. The transition does not
require its own shared subject identity merely to be structured. Its containing
investigram remains the initial correction unit.

The terminology and field meanings remain to be worked through using established
architectural concepts. Distinguish a state category from a participant occupying
that state, and a possible interaction from an observed execution. Neither familiar
terminology nor a valid record establishes correctness or complete behavioral
coverage. These are recommendations for the next content probe, not an adopted
schema or newly verified Cockatiel claims.

The emerging catalogue proposal would give the investigator an agent-facing
state-behavior concept contract (identifier/version and semantic/data requirements,
possibly a JSON Schema). The investigator returns that identifier with structured
content and associated prose, using existing subject references and qualified
support. The concept may be explicitly requested or selected by the investigator
as relevant. This is separate from declaring Half-open itself to be a state subject.
The first concrete contract and payload remain to be drafted.

Use statechart information requirements for a concrete sufficiency test: named
states, directed transitions, any meaningful hierarchy, state-bearing participant,
initial entry when established, and distinct triggers, guards and effects. Keep
scope, qualifications and exact account/support references. The human's proposed
hierarchically grouped directed-graph shape is a starting point to examine, not a
settled schema; default entry and ordinary incoming transitions need distinguishing.
A concurrent-caller sequence account should subsequently test the waiting correction
and meaningful ordering. First establish that retained content supplies the needed
meaning, then perform a bounded rendering experiment to validate sufficiency.
Layout, styling and interactive navigation should not sidetrack this content work.

| Content | Supplied meaning |
| --- | --- |
| DEFINITIONS-1 | State-category identities and their qualified relationship to P. |
| ROLE-DEFINITIONS-1 | R, execution roles and W with their pattern context. |
| ADMISSION-2 | Admission cases, conditions, effects and inspection/execution distinctions. |
| TRIAL-1 | Participants, occupancy, waiting, meaningful ordering, alternative outcomes and supported transitions. |

ADMISSION-2 and TRIAL-1 refer to the same W allocated with the follow-up. Qualified
content supplies its conditions. A consumer can align the referent while preserving
any conflict between descriptions; identity alone does not reconcile claims.

Place detailed recovery-outcome transitions in TRIAL-1 for this probe, with explicit
state endpoints, owner role, conditions and effects. Mark the transition content
and explicitly associate its account with P and S so later state inquiries can find
it without relying on incidental mentions. This does not promise complete state-machine
coverage. If transitions warrant separate selection/correction, a future result can
partition them separately; there is no universal rule binding them to interactions.

ADMISSION-2 need not duplicate these transitions. Combined depictions can align
shared S/R references. Independently described transitions later need a shared
reference or qualified correspondence before alignment. Keep missing triggers,
guards and cases visible; elapsed eligibility is not an execution-triggered state
change. Layout cannot supply missing semantics. This remains a content probe for
small structure, state and interaction depictions, not a full presentation system.

### Candidate diagram inventory

This is a useful inventory for the bounded example and composition probe, not a
commitment to implement every depiction or a catalogue entry for each diagram.

| Candidate | Reference concept | Diagram type / reference status | Question and information requirements |
| --- | --- | --- | --- |
| Runtime structure/roles | Component-and-connector (C&C) view; elements and relations | Graphical primary presentation of a C&C view; exact notation not prescribed. [V&B §§2.2, 2.5][vb-structure] | What is shared across calls? Instance roles, execution roles, supplied operation, state-bearing participant and typed control/use/wait relationships. These are roles, not observed runtime objects. |
| Breaker recovery statechart | State-based behavioral modeling | Statechart. [Behavior §6.1.1][statecharts] | What changes the breaker's state? Closed/Open/Half-open, state owner, triggers, guards, effects and known coverage; default entry only if established. |
| Admission flow | Trace-oriented behavior; execution paths and responsibilities | Use-case map (UCM), a candidate mapping to assess. [Behavior §6.2.2][ucms] | What can happen to an execution request? Conditions and branches for execution, trial, refusal and waiting, including subsequent behavior. Requires supported paths/order, not just an unordered cases list. |
| Concurrent-caller sequence | Trace-oriented behavior; interacting instances | Sequence diagram. [Behavior §6.2.3][sequences] | How do trial and waiting caller interact? Shared instance and distinct executions, ordering, waiting/release and outcome alternatives. |
| Composition structure | Component-and-connector view; elements and relations | Graphical primary presentation of a C&C view; exact notation not prescribed. [V&B §§2.2, 2.5][vb-structure] | How do wrapping orders differ? Two scoped patterns with outer/inner roles, delegation, supplied operation and separate state/resource responsibilities. Topology is distinct from containment/ownership. |
| Composition sequences | Trace-oriented behavior; interacting instances | Sequence diagrams, one or more per order. [Behavior §6.2.3][sequences] | What runs or waits, and what remains occupied? Interactions, capacity/state changes and waiting intervals supplied by qualified composition analysis. |
| Individual-execution lifecycle (optional) | State-based behavioral modeling | Statechart. [Behavior §6.1.1][statecharts] | What is an execution's progress? Requires a lifecycle account; its waiting is not another breaker state. |
| Implementation correspondence (optional) | Mapping between views, here architectural runtime and module views | Mapping representation; no specific diagram type prescribed in this reference. A correspondence graph would be our choice. [V&B §2.5, printed p.7][vb-mapping] | How do architectural roles relate to modules/symbols? Requires qualified mappings; visual proximity or labels do not establish correspondence. |

[vb-structure]: https://www.sei.cmu.edu/documents/2072/2005_004_001_14498.pdf#page=14
[statecharts]: https://www.sei.cmu.edu/documents/1986/2002_004_001_13934.pdf#page=22
[ucms]: https://www.sei.cmu.edu/documents/1986/2002_004_001_13934.pdf#page=30
[sequences]: https://www.sei.cmu.edu/documents/1986/2002_004_001_13934.pdf#page=33
[vb-mapping]: https://www.sei.cmu.edu/documents/2072/2005_004_001_14498.pdf#page=18

The source concepts/types above are distinct from the local exploratory mnemonics
RESP, OWNERSHIP, INTERFACE, STATE and INTERACTION. Mapping each example to a source
concept is our design recommendation, not a source assertion about Cockatiel.
The earlier label “admission activity/decision flow” did not establish UML activity
diagrams from the inspected references. UCM is a named candidate in those references;
its suitability for this account remains to be tested, not silently adopted.

Success/failure and inspection-before-execution cases are sequence variants.
Original/corrected depictions reuse the corresponding architectural diagram type.
Correction/evidence graphs concern PostCode's retained accounts: their concepts are
the local ACCOUNT/BASIS/CORRECTION entries, with no claimed SEI diagram type.
No optional account or mapping should be inferred solely to draw a diagram.

Recommend prioritizing runtime structure, breaker statechart and concurrent-caller
sequence; retain admission flow as a useful contract/correction probe. Composition
then tests reuse of structural and interaction forms across accounts. Before/after
correction depictions reuse those forms, keeping exact prior selections available.
No new source analysis has established complete data for this inventory.

## 7. Later definition correction: two different limits

Suppose later analysis corrects DEFINITIONS-1 with DEFINITIONS-2 while retaining S.
This is a design test, not a new claim about Cockatiel. Full delivery of the target
child is required; unrelated parent/admission content is not required solely for
eligibility. Earlier answers and composition remain fixed.

Every investigram from the follow-up shares the evaluation's conservative exposure
index. TRIAL-RESULT-1, ROLE-DEFINITIONS-1, TRIAL-1 and ADMISSION-2 can all be flagged
after correction of DEFINITIONS-1, subject to established per-correction exemptions.
Partitioning does not assign each child its own claim-level dependency set.

DEFINITIONS-1 also groups several descriptions. Correcting one replaces that whole
child; exposure to another part still counts. Smaller units narrow correction targets
and required delivery, not necessarily reconsideration flags. They can change what
later evaluations choose to retrieve, but once content is exposed the evaluation-wide
rule remains. This is an explicit tradeoff, not an accidental promise of precision.

Conversely, ADMISSION-1 was created alongside DEFINITIONS-1. Sibling composition and
shared S do not establish prior-content exposure, so they do not automatically flag
it. Selecting the improved definition does not establish compatibility of old behavior.

Thus the existing policy can be broad for one evaluation's results and silent about
same-result semantic dependencies. If that is insufficient, add explicit impact
semantics or qualified checking of affected accounts; do not silently invent it.
Actual conflation requires distinguished referents and correspondence rather than
retaining S merely for convenient continuity.

## What this pass suggests

The child partition supports correction identity and coherent initial explanations,
with evaluation-wide propagation costs explicit. Caller-provided context can identify
ADMISSION-1 as the explanation being followed; referent-based discovery also makes
it available when origin is unknown. Per-subject identifies associations and fixed
identifying support let application results preserve meaning under exact/fresh access.

Continue with the underlying contracts: support selection and delivery, applicability,
contextual identity, and reconsideration. Presume UI viewing/selection capabilities;
retain only their effects on actual request inputs and context. Composition-role and
local/prose-promotion probes, migration, delivery scope and correction-standing semantics
remain open. No planning package is authorized by this example.
