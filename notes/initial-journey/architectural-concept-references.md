# Concept references for the Cockatiel selection walkthrough

Recorded: 2026-11-06
Status: exploratory grounding, not an adopted taxonomy or prescribed methodology

These references ground the displayed content and selections in the
[detailed walkthrough](cockatiel-information-and-judgment.md) and
[standalone script](cockatiel-investigation-script.md), as well as the earlier
[human + PostCode walkthrough](cockatiel-human-postcode-walkthrough.md).
Definitions below are brief paraphrases; **application** identifies our adaptation.
They do not establish that PostCode implements the corresponding analysis.
References belong in these design notes; whether the product exposes them is open.

The sources are public SEI accounts of Views and Beyond and related architectural
concepts. We inspected the cited portions, not the entire V&B book. This exercise
adopts neither a documentation template nor an ATAM/ADD workflow. A V&B
architectural view is not identical to PostCode's instantiated Presentation (View).


<a id="mnemonics"></a>
## Mnemonics used in the sketches

Each displayed item in the detailed walkthrough and standalone script links to
its corresponding entry below. Mnemonics identify the kind of information, not
a prescribed control, Lens definition or independent proof of a Cockatiel claim.
Two labels indicate complementary aspects of one item. The mapping records the
primary correspondence; qualifications and evidence apply to every account.
Even the deliberately erroneous initial explanations receive concept labels:
classification does not certify correctness.

| Mnemonic | Correspondence |
| --- | --- |
| [CONTEXT](#context) | Surrounding participants and architectural boundaries |
| [RESP](#responsibility) | Element roles, responsibilities and family/catalog |
| [OWNERSHIP](#ownership) | Creation, retention, control, access and resource lifetime |
| [INTERFACE](#interface) | Observable promises, usage restrictions, results and effects |
| [STATE](#state) | States, transition conditions, triggers and effects |
| [INTERACTION](#interaction) | Execution sequences, composition, waiting and concurrent callers |
| [SCENARIO](#scenario) | Quality concerns and assessment of alternatives under conditions |
| [RATIONALE](#rationale) | Reasons, constraints, preferences and intentions |
| [ACCOUNT](#account) | PostCode account selection, navigation, retention and supplied records |
| [BASIS](#basis) | Evidence, provenance, scope, qualifications and information gaps |
| [CORRECTION](#correction) | Explicit revision notices and access to earlier/corrected accounts |

The first eight are architectural concepts with the source meanings and adaptations
below. ACCOUNT, BASIS and CORRECTION are PostCode support entries, grounded in its
own model. A record of human intent can therefore carry RATIONALE for its content
and ACCOUNT for its retention. The present route leaves design alternatives and
judgments to the human; its displayed execution examples use INTERACTION, while
SCENARIO remains available for a route that requests quality-based assessment.

<a id="context"></a>
## CONTEXT — Context and boundary

**Source meaning:** a context diagram relates the system, or selected part, to its
environment. See Clements, *Comparing the SEI’s Views and Beyond Approach…*,
[section 2.5, printed page 5](https://www.sei.cmu.edu/documents/2072/2005_004_001_14498.pdf#page=16).

**Application:** select the surrounding participants and boundary relevant to an
issue. The result need not be a diagram. Moving outward follows architectural
relationships, not necessarily filesystem containment.

<a id="responsibility"></a>
## RESP — Responsibility and element catalog

**Source meaning:** V&B's element catalog describes elements and their properties;
component-and-connector views concern interacting runtime elements. See the same
report, [sections 2.2 and 2.5, printed pages 3 and 5](https://www.sei.cmu.edu/documents/2072/2005_004_001_14498.pdf#page=14).
ADD explicitly uses allocation of responsibilities and definition of interfaces
in design; see the [ADD collection](https://www.sei.cmu.edu/library/attribute-driven-design-method-collection/).

**Application:** responsibility means what work an element performs or governs.
A selectable responsibility account is our organization of that information,
not a claim that V&B defines a universal “Responsibility” viewpoint. Catalog
selection exposes the relevant family of elements and the limits of its coverage.

<a id="ownership"></a>
## OWNERSHIP — Ownership, access and lifetime

**Source meaning:** interface usage restrictions can distinguish actors' access,
modification rights, concurrency limits and assumptions about other resources.
See Bachmann et al., *Documenting Software Architecture: Documenting Interfaces*,
[resource-usage restrictions, printed page 11](https://www.sei.cmu.edu/documents/1999/2002_004_001_13973.pdf).

**Application:** “ownership” is our contextual label for who creates, retains,
controls or can access a specified resource or state. These relations must be
named separately. It does not mean organizational ownership, language-specific
memory ownership, or a V&B allocation view by default. Lifecycle questions combine
these relations with behavior; they are not answered by the label alone.

<a id="contract"></a>
<a id="interface"></a>
## INTERFACE — Interface and contract

**Source meaning:** an interface account includes supplied resources, their
semantics and usage restrictions. Semantics include results, state changes,
notifications and effects on later interactions. See *Documenting Interfaces*,
[resources provided, printed page 11](https://www.sei.cmu.edu/documents/1999/2002_004_001_13973.pdf).

**Application:** contract selects observable promises and conditions: what a
request can mean, require, change or report. This includes waiting, failure and
notification. We emphasize semantics intelligible without programming-language
syntax. An inferred implemented contract and a proposed promise remain distinct.

<a id="state"></a>
## STATE — State and transitions

**Source meaning:** state-based descriptions characterize reactions to events from
a given state; timing and ordering constraints are part of behavior. See Bachmann
et al., *Documenting Software Architecture: Documenting Behavior*,
[sections 5.2–5.3 and 6.1, printed pages 8–10](https://www.sei.cmu.edu/documents/1986/2002_004_001_13934.pdf#page=19).

**Application:** expose states, transition triggers, conditions and effects.
A state name alone is inadequate. Selecting “half-open” reveals its behavior and
relevant conditions; selecting a transition distinguishes elapsed time from an
action triggered by a timer. No particular statechart notation is required.

<a id="interaction"></a>
## INTERACTION — Interaction and execution scenarios

**Source meaning:** trace-oriented behavior describes sequences of activity or
interaction responding to a particular stimulus; one trace does not cover all
possible behavior. See *Documenting Behavior*,
[section 6.2, printed pages 16–17](https://www.sei.cmu.edu/documents/1986/2002_004_001_13934.pdf#page=27).

**Application:** examine a call, a queued call, or concurrent calls under specified
conditions. Composition order, waiting and resource occupancy belong in the
account. A reconstructed possible sequence is not an observed execution.

<a id="scenario"></a>
## SCENARIO — Quality concerns and scenario-based assessment

**Source meaning:** ATAM scenarios specify a stimulus, conditions and observable
response; analysis relates decisions to quality goals and uncertainty. See
Kazman, Klein and Clements, *ATAM: Method for Architecture Evaluation*,
[section 5, printed page 13](https://www.sei.cmu.edu/documents/629/2000_005_001_13706.pdf#page=24),
and [sections 7.1–7.3, printed pages 21–23](https://www.sei.cmu.edu/documents/629/2000_005_001_13706.pdf#page=32).

**Application:** compare known alternatives under a selected concern and scenario:
preparation cost, notification, compatibility or timer lifetime. This is not an
ATAM session or a claim of formal evaluation. “Compare” requests analysis; the
concept reference does not supply the alternatives or prove the conclusion.

<a id="rationale"></a>
## RATIONALE — Rationale, constraints and intentions

**Source meaning:** V&B architecture background explains why the design arose;
see [section 2.5, printed page 6](https://www.sei.cmu.edu/documents/2072/2005_004_001_14498.pdf#page=17).
ADD distinguishes requirements from constraints imposed on design; see the
[ADD collection](https://www.sei.cmu.edu/library/attribute-driven-design-method-collection/).

**Application:** expose recorded reasons, scope preferences and commitments,
with their authors and status. “Conservative scope” is this human's preference;
it is not automatically a Cockatiel requirement. An inferred advantage of a design
is not evidence of the maintainer's rationale.

<a id="support-operations"></a>
## Account operations, rather than architectural concepts

Selecting a subject, opening related material, comparing selected accounts,
expanding detail, inspecting evidence, revisiting an exact answer and examining a
correction are operations. No V&B definition is claimed for them. Their local
grounding is PostCode's [working-through-qualified-views contract](../../docs/app-specification.md#working-through-qualified-views),
[captured-basis model](../../docs/core-concepts.md#captured-basis), and
[current capability reference](../../docs/capability-reference.md).

They must identify the selected meaning and basis. In particular, inspecting what
an issue reporter said is a provenance question; forcing it into an architectural
view category would obscure rather than clarify it. Human proposal entry and
endorsement are inputs, not analytical conclusions or navigation operations.

<a id="account"></a>
### ACCOUNT — Selection, navigation and retained material

**Local meaning:** selecting subjects and related accounts, expanding detail,
revisiting exact answers, and retaining explicitly supplied preferences or choices.
Name lookup may itself require semantic analysis; this entry identifies the
account/navigation role rather than classifying its implementation as presentation.
See the [working-through-qualified-views contract](../../docs/app-specification.md#working-through-qualified-views)
and [retained answer presentation](../../docs/decisions/exact-retained-answer-presentation.md).

**Application:** name matches, newly selectable subjects, unchanged reference
material and optional human records. Use an architectural label as well when an
item describes the record's substantive content.

<a id="basis"></a>
### BASIS — Evidence, qualifications and gaps

**Local meaning:** the material and interpretation supporting an account, its
provenance, applicable conditions, coverage and limits. See the
[captured-basis model](../../docs/core-concepts.md#captured-basis) and
[qualified results](../../docs/decisions/coordinated-views-and-qualified-results.md).

**Application:** static-versus-observed behavior, illustrations, inferred reasons,
unknown maintainer intent, missing lifecycle detail and the status of human choices.
The label identifies these disclosures; it does not establish the underlying claim.

<a id="correction"></a>
### CORRECTION — Revisions and retained earlier answers

**Local meaning:** explicitly relate an earlier account to a proposed replacement,
with correction reasons and qualifications, preserving both accounts and earlier
answers. See the [investigram and correction model](../../docs/decisions/investigrams-and-progressive-investigation.md)
and [architectural constraints](../../docs/architectural-constraints.md).

**Application:** the waiting correction and timer-wording correction. The sketch
requires PostCode to inform the human when each correction appears; inspecting
both versions and their basis remains available. Notification form and delivery
are presentation requirements to design, rather than a V&B concept or evidence
that this journey is already implemented.
