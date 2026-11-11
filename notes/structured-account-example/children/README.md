# Children variant: independent identification and behavioral correction

Exploratory notes, 2026-11-11. This is the recommended partition worked through as
complete authored payloads, not an adopted schema, an executed investigator, or
supported application input. It uses the [shared contracts](../contracts.md) and the
same bounded Cockatiel interpretation as the [mixed-account comparison](../README.md).
Each variant describes its own hypothetical Session; identical readable aliases do
not imply shared allocated records between variants. No new source claims or broader
state-model applicability are established by repartitioning the content.

## Files and reading order

1. [First result](first-result.json): substantive root plus independently qualified
   state-definition and admission children.
2. [Follow-up result](followup-result.json): substantive root, role-definition and
   trial-behavior children, and K with a disjoint admission replacement.
3. [Context and bindings](context-and-bindings.json): supplied context, allocated IDs,
   selections, composition, exposure and the definition-only consumer probe.
4. [Illustration access](illustration-access.json): exact versus fresh linked-account
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

The explicit subject declarations and `identifies` associations live on DEFINITIONS-1.
It has its own qualifications, evidence, referents and description items. It can be
delivered without INTRO-1 or ADMISSION-1; its meaning does not depend on inheriting
the root's qualifications. The root has substantive orientation content and describes
P, rather than merely serving as a list of children.

ADMISSION-1 still contains the deliberately staged coverage error: its three cases
omit waiting during an occupied trial. Its qualifications match the mixed example,
including the reentrancy exclusion. The identifying descriptions do not repeat that
coverage claim. Grouping the three state descriptions into one child deliberately
keeps a coherent correction/delivery unit; it is not a one-subject-per-child rule.

The follow-up selects S and receives the complete own content of DEFINITIONS-1 and
ADMISSION-1. The first identifies the subject; the second is eligible for correction.
INTRO-1's own content is not supplied merely because it owns these children.

## Follow-up: new definitions, behavior and a replacement

```text
TRIAL-RESULT-1             qualified synthesis: shared decision, separate execution progress
├── ROLE-DEFINITIONS-1     introduces/identifies R, E-trial, E-caller and W
└── TRIAL-1                relations, prose, state behavior and interaction
    └─ reports K          ADMISSION-1 → ADMISSION-2 (correction, not composition)

ADMISSION-2                separate replacement tree; complete admission content
```

TRIAL-RESULT-1 says that shared recovery state and each execution's progress differ,
and that release leads to a recheck rather than guaranteed execution. These are
qualified claims with their own evidence. ROLE-DEFINITIONS-1 supplies all four
descriptions and their `identifies` associations with its own support. TRIAL-1
describes P and S, referring to the subjects declared in its sibling. It does not
duplicate their descriptions or identifying associations.

K is reported by TRIAL-1, the behavioral child. Its explanation cites that reporter,
not the root or the relationship ID. The reporter and replacement are in different
composition trees. The pool representation permits cross-tree content references,
but those references are not owning edges. Every account has exactly one owning
position, and the result root reaches every submitted account through composition
and reporter-to-replacement ownership links.

ADMISSION-2 supplies its entire admission explanation, including the corrected
waiting case, with its own qualifications and evidence. **It copies no state
definitions and adopts no old children.** DEFINITIONS-1 was not the correction target
and remains available as identifying support. This is ordinary independent account
selection, not an exception to whole-account replacement based on `affectedSubjects`.

## Shared roles without broadening the state model

The general admission item declares local roles for a requested execution and its
breaker instance. Its waiting claim uses those variables. A separately qualified
illustration maps them to R/E-caller and points to TRIAL-1's `concurrent-callers`
item, using W as the illustrated relationship. That mapping is authored, supported
interpretation, not an inferred correspondence from matching names.

The state item uses the same `roles`/`roleScope`/`illustrations` envelope for its
breaker bearer. Its scope remains the bounded scenario, with an explicit binding
to R. Sharing syntax does not make it a model of all instances/configurations of P.
Role keys belong to exact content items: the two occurrences of `breaker` are not
automatically one identity. General relationship identity and broader applicability
remain questions for the composition probe.

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
shares its exposure to both supplied accounts. Children do not narrow the producing
evaluation's exposure index, and grouped descriptions still share one correction
target. None of these mechanisms establishes semantic independence between siblings.

## Illustration status without automatic reassessment

ADMISSION-2's illustration targets the exact pair `(TRIAL-1, concurrent-callers)`.
The access probe postulates a later correction of TRIAL-1 solely to describe retrieval
behavior; it does not invent a third investigation result or assert another source error.
Fresh access can report “illustrated account has a replacement,” preserve the original
item target, and leave that particular item's revision status unestablished. It
cannot substitute a same-named item from the replacement without correspondence.

The link is within the original follow-up evaluation, so it is not a prior-exposure
citation and does not itself flag ADMISSION-2. Surfacing the referenced account's
status is useful without adding a propagation or clearance rule. Exact captured
answers preserve their earlier status context; fresh inspection is separate.
The analogous state-to-interaction illustration uses the same addressing rules.

## Verification and limits

[The standalone fixture checker](../check-fixtures.py) can be run with Python 3.
It checks both variants' declaration/reference resolution, unique ownership,
reachability, qualification, identifying associations, local roles, illustration
addresses/bindings and ordered causal links. It rejects malformed copies with
duplicate owners, a cycle, an orphan, missing child qualifications, missing child
identification and an undeclared subject, plus invalid role/address/qualification and
forward-causality references. It also checks that the state/interaction
items are identical across partitions and that ADMISSION-2 copies no definitions.
Diagram traceability pointers resolve against this variant's actual payload.

These are checks of authored examples, not a production schema, semantic proof or
end-to-end Session verification. The linked-account status probe is conditional,
not an implemented access operation. No universal cross-form consistency check,
automatic role alignment, independent item correction, correction revocation, or
parent/sibling reassessment is introduced. The mixed fixture remains a useful
comparison; this variant demonstrates the current partition recommendation without
adopting it as a requirement for every explanation.
