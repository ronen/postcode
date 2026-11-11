# Children variant: independent identification and behavioral correction

Exploratory notes, 2026-11-11. This is the recommended partition worked through as
complete authored payloads, not an adopted schema, an executed investigator, or
supported application input. It uses the [shared contracts](../contracts.md) and the
same bounded Cockatiel interpretation as the [mixed-content comparison](../README.md).
Each variant describes its own hypothetical Session; identical readable aliases do
not imply shared allocated records between variants. The separated category descriptions have been rechecked against the pinned state
vocabulary and phrased as identification; qualification is not broadened merely by
moving content. No broader behavioral/state-model applicability is established.

The [statechart with legend](recovery-state.md) and [interaction with legend](concurrent-callers.md)
use concise authored labels and preserve this variant's own scope and source mapping.

The [metadata payload tour](../metadata-payload.md) applies here too: offers belong to
their behavioral investigram, TRIAL-1 recommends two diagrams with explicit input
bindings, and [guidance access](guidance-access.json) keeps excerpts distinct from
complete own delivery. No guidance child or independent offer lifecycle is added.

## Files and reading order

1. [First result](first-result.json): substantive root plus independently qualified
   state-definition and admission children.
2. [Follow-up result](followup-result.json): substantive root, role-definition and
   trial-behavior children, and K with a disjoint admission replacement.
3. [Context and bindings](context-and-bindings.json): supplied context, allocated IDs,
   selections, composition, exposure and the definition-only consumer probe.
4. [Illustration access](illustration-access.json): exact versus fresh linked-investigram
   status under an explicitly hypothetical later correction.
5. [Diagram traceability](diagram-traceability.json): pointers into this variant's
   behavioral child for the shared [statechart](../recovery-state.svg) and
   [interaction](../concurrent-callers.svg).

## First result: useful parts with their own support

```text
INTRO-1                    qualified orientation: state and execution progress differ
├── DEFINITIONS-1          identifies S-closed, S-open and S (Half-open)
└── ADMISSION-1            describes P's admission and inspection behavior
```

The explicit entity declarations and `identifies` associations live on DEFINITIONS-1.
It has its own qualifications, evidence, referents and description items. It can be
delivered without INTRO-1 or ADMISSION-1; its meaning does not depend on inheriting
the root's qualifications. The root has substantive orientation content and describes
P, rather than merely serving as a list of children.

INTRO-1 likewise qualifies only its orientation: the state/progress distinction is
not restricted to default sampling. Admission-specific sampling and interference
limits remain on ADMISSION-1; the root does not assert its admission rules.

The definition child's qualifications are selected for its own claims, not copied
from the behavioral sibling. Its state-category designations are not restricted to
default sampling; it does not specify admission outcomes or transition rules for
unexamined configurations. The descriptions use the pinned `CircuitState` distinctions
([source](https://github.com/connor4312/cockatiel/blob/f48bea55022ab15ab07eb52a79bfc1e661300fd4/src/CircuitBreakerPolicy.ts)).
A later non-default-sampling inquiry can select S using this identifying support,
while requiring new qualified behavioral analysis. The ledger includes that probe.

ADMISSION-1 still contains the deliberately staged coverage error: its three cases
omit waiting during an occupied trial. Its qualifications match the mixed example,
including the reentrancy exclusion. The identifying descriptions do not repeat that
coverage claim. Grouping the three state descriptions into one child deliberately
keeps a coherent correction/delivery unit; it is not a one-entity-per-child rule.

ADMISSION-1 returns a qualified `concurrent-callers-offer`. The follow-up request
selects that exact investigram and offer key, whose architectural focus resolves to S.
The [offer chain](../offered-followup.md) explains the stipulated invocation; this
variant's [access probe](offer-access.json) preserves its exact context independently
of the mixed variant. ADMISSION-2 repeats the offer without migrating old references.

The follow-up receives the complete own content of DEFINITIONS-1 and
ADMISSION-1. The first identifies the subject; the second is eligible for correction.
INTRO-1's own content is not supplied merely because it owns these children.

## Follow-up: new definitions, behavior and a replacement

```text
TRIAL-RESULT-1             orientation: referents, behavioral questions and child scope
├── ROLE-DEFINITIONS-1     introduces/identifies R, E-trial, E-caller and W
└── TRIAL-1                relations, prose, state behavior and interaction
    └─ reports K          ADMISSION-1 → ADMISSION-2 (correction, not composition)

ADMISSION-2                separate replacement tree; complete admission content
```

TRIAL-RESULT-1 orients the reader to the shared state, execution roles and relationship
under examination, and locates the identifying and behavioral explanations. It does
not restate waiting, admission or release rules. Such summaries would create another
correction surface; a corrected child would not automatically repair the summary.
ROLE-DEFINITIONS-1 supplies all four descriptions and their `identifies` associations
with its own support. TRIAL-1
describes P and S, referring to the subjects declared in its sibling. It does not
duplicate their descriptions or identifying associations.

ROLE-DEFINITIONS-1 preserves the scenario context needed to identify these particular
roles: one shared breaker, a single trial slot, and the concurrent execution. That is
different from restricting the identity of state category S to default sampling.
It does not inherit cancellation, reentrancy or outcome restrictions as blanket
conditions on identification. Those qualify the behavioral investigram's claims.

W's minimal description identifies the participants and what is awaited. It expressly
does not supply occurrence/release conditions. Its exact `relatedContent` address
locates TRIAL-1's interaction for a consumer needing those conditions; the address
alone neither supplies the behavior nor cites TRIAL-1. The identification can be
intelligible without being a complete behavioral explanation.

K is reported by TRIAL-1, the behavioral child. Its explanation cites that reporter,
not the root or the relationship ID. The reporter and replacement are in different
composition trees. The pool representation permits cross-tree content references,
but those references are not owning edges. Every investigram has exactly one owning
position, and the result root reaches every submitted investigram through composition
and reporter-to-replacement ownership links.

ADMISSION-2 supplies its entire admission explanation, including the corrected
waiting case, with its own qualifications and evidence. **It copies no state
definitions and adopts no old children.** DEFINITIONS-1 was not the correction target
and remains available as identifying support. This is ordinary independent investigram
selection, not an exception to whole-investigram replacement based on `affectedSubjects`.

## Shared roles without broadening the state model

The general admission item declares local roles for a requested execution and its
breaker instance. Its waiting claim uses those variables. A separately qualified
illustration maps them to R/E-caller and points to TRIAL-1's `concurrent-callers`
item, using W as the illustrated relationship. That mapping is authored, supported
interpretation, not an inferred correspondence from matching names.

The state bearer is a direct reference to R. An item-local alias for that same
scenario participant added no useful variable, and calling its binding an illustration
confused identity with a general-to-example relationship. The redundant alias/binding
has been removed from both variants. The common role contract remains available
across forms, but this sample only uses variables where they add meaning. General
relationship identity and broader state applicability remain for the composition probe.

The interaction explicitly links wait initiation to the caller request and trial
entry, conditioned on the slot still being occupied. Its later chain is completion,
classification, transition, resume/recheck, and ordinary work or refusal. Causes
are not asserted to be sufficient without the stated conditions.

## What remains selected after correction

| Access | Selected content and support |
| --- | --- |
| Exact ANSWER-1 | INTRO-1 with its captured DEFINITIONS-1 and ADMISSION-1 children; original support and revision context |
| Follow-up answer | TRIAL-RESULT-1 with its two children, accompanying ADMISSION-2 and K; identifying support from DEFINITIONS-1 and ROLE-DEFINITIONS-1 |
| Fresh admission answer | ADMISSION-2 and K; unchanged DEFINITIONS-1, plus ROLE-DEFINITIONS-1 for the scenario illustration |
| Fresh replacement-aware initial answer | INTRO-1 and DEFINITIONS-1, with ADMISSION-2 selected in place of ADMISSION-1 and that displacement disclosed |

INTRO-1's stored child list always remains `[DEFINITIONS-1, ADMISSION-1]`; a fresh
projection is not a rewrite of its composition or own text. Supporting descriptions
can be supplied without selecting their parent roots. Delivering the complete
ROLE-DEFINITIONS-1 child gives complete context for that child, not for TRIAL-1 or
TRIAL-RESULT-1. Each answer fixes the identifying support it actually supplies.

The cited-unit benefit is concrete: a later investigation receiving DEFINITIONS-1
alone cites that child, so a correction of ADMISSION-1 provides no reconsideration
path through that citation alone. By contrast, every output of the actual follow-up
shares its exposure to both supplied investigrams. Children do not narrow the producing
evaluation's exposure index, and grouped descriptions still share one correction
target. None of these mechanisms establishes semantic independence between siblings.

## Illustration status without automatic reassessment

ADMISSION-2's illustration targets the exact pair `(TRIAL-1, concurrent-callers)`.
The access probe postulates a later correction of TRIAL-1 solely to describe retrieval
behavior; it does not invent a third investigation result or assert another source error.
Fresh access can report “illustrated investigram has a replacement,” preserve the original
item target, and leave that particular item's revision status unestablished. It
cannot substitute a same-named item from the replacement without correspondence.

The link is within the original follow-up evaluation, so it is not a prior-exposure
citation and does not itself flag ADMISSION-2. Surfacing the referenced investigram's
status is useful without adding a propagation or clearance rule. Exact captured
answers preserve their earlier status context; fresh inspection is separate.
W’s related-content link uses the same exact addressing rules, with a descriptive
purpose rather than an illustrative binding. Neither link silently delivers its target.

## Verification and limits

[The standalone fixture checker](../check-fixtures.py) can be run with Python 3.
It checks both variants' declaration/reference resolution, unique ownership,
reachability, qualification, identifying associations, local roles, illustration
addresses/bindings and ordered causal links. It rejects malformed copies with
duplicate owners, a cycle, an orphan, missing child qualifications, missing child
identification and an undeclared entity, plus invalid role/address/qualification and
forward-causality references. It also checks that the state/interaction
items are identical across partitions and that ADMISSION-2 copies no definitions.
Diagram traceability pointers resolve against this variant's actual payload.

Choosing applicable qualifications was reviewed against the actual descriptions and
source; the structural checker cannot decide whether a limitation is semantically
necessary. Both variants' behavioral diagram data remains identical, so the direct
bearer and qualification repairs do not require different rendered diagrams.

These are checks of authored examples, not a production schema, semantic proof or
end-to-end Session verification. The linked-investigram status probe is conditional,
not an implemented access operation. No universal cross-form consistency check,
automatic role alignment, independent item correction, correction revocation, or
parent/sibling reassessment is introduced. The mixed fixture remains a useful
comparison; this variant demonstrates the current partition recommendation without
adopting it as a requirement for every explanation.
