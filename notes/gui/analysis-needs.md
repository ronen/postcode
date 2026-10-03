# Analysis needs exposed by GUI design

The GUI exposes and navigates analyses; it does no analysis of its own. This
note lists capabilities that the [GUI design exploration](design-kickoff.md)
shows but no current analysis provides. Each item says where it appears in the
journeys and where the need is already recorded, if anywhere. Candidate backlog
entries follow for items not yet tracked elsewhere.

IDs (N1…) match the markers on the design canvas. Journeys:
1 get oriented, 2 examine a module, 3 understand what a module does,
4 pick up where I left off, 5a/5b agent round trip, L qualification layers.

## Needs

| ID | Need | Journeys | Already recorded |
|----|------|----------|------------------|
| N1 | Signals that a module is used for testing (source/test counts, filtering) | 1, 2, 4 | Backlog: [qualify evidence that modules are used for testing](../../docs/backlog.md#qualify-evidence-that-modules-are-used-for-testing) |
| N2 | Kinds of external module, such as runtime built-in versus installed package | 1 | Product design: [external dependency lenses](../../foundation/product-design.md#418-external-dependency-lenses). Candidate entry below |
| N3 | Aggregates over organization: modules per group, which groups hold modules, project totals | 1 | Open question below |
| N4 | Interpretive summary of a repository or group, not only a module | 1 | Product design: [summary as initial view](../../foundation/product-design.md#32-summary-as-initial-view-and-recursive-navigation) |
| N5 | Transitive reach: modules depending on a subject directly or indirectly | 2 | Deferred: [module dependency structure decisions](../../docs/decisions/module-dependency-structure-decisions.md#provide-project-structure-and-focused-direct-navigation) |
| N6 | Explaining cycles: shortest loop through a module; which modules joined or left a cycle | 2, 4 | Related: [path lenses](../../foundation/product-design.md#415-path-lenses). Candidate entry below |
| N7 | Which module owns each undeterminable dynamic import | 4 | Already available: dependency request results carry the owning module |
| N8 | Human-facing names for interpretations, so no hashes appear in the main interface | 3 | Related: [naming and terminology](../../foundation/product-design.md#25-naming-and-terminology). Candidate entry below |
| N9 | Structured evidence fields for interpretations: what was read, whether code ran, which tests were consulted | 3, L | Note: [visual and structured qualification](../candidate-capabilities.md#visual-and-structured-qualification) |
| N10 | Re-examining accounts that need reconsideration, possibly several at once | 3 | Backlog: [reconsider investigrams after context corrections](../../docs/backlog.md#reconsider-investigrams-after-context-corrections) |
| N11 | Cost estimate before starting a hosted interpretation | 3 | Backlog (partly): [investigation usage and budgeting support](../../docs/backlog.md#investigation-usage-and-budgeting-support) |
| N12 | Callers of a function or module export | 3 | Product design: [entity cross-reference lenses](../../foundation/product-design.md#413-entity-cross-reference-lenses) |
| N13 | Tests associated with a subject ("find tests for", "tests that cover") | 3, 5b | Product design: [test lenses](../../foundation/product-design.md#414-test-lenses); builds on N1 |
| N14 | Workspace and attention persisting across sessions: last session, pinned views | 4, 5a | Product design: [continuity of attention](../../foundation/product-design.md#24-identity-and-continuity-of-attention), [workspace model](../../foundation/product-design.md#33-workspace-model). Excluded from the [transient session shell](../../docs/plans/transient-session-shell.md) |
| N15 | Comparing projections across revisions, including matching subjects between revisions (IDs are session-local) | 1, 4, 5b | Product design: [revision and projection comparison](../../foundation/product-design.md#36-revision-and-projection-comparison), [temporal and revision lenses](../../foundation/product-design.md#416-temporal-and-revision-lenses). Note: [investigation across changing repository states](../candidate-capabilities.md#investigation-across-changing-repository-states) |
| N16 | Git change information for people: files changed between revisions, commit and PR messages as recorded assertions, when an annotation appeared | 4, L | Backlog covers investigator evidence only: [provide Git history as investigator evidence](../../docs/backlog.md#provide-git-history-as-investigator-evidence). Candidate entry below |
| N17 | Marking interpretations whose cited source changed in a later revision | 4 | Note: [investigation across changing repository states](../candidate-capabilities.md#investigation-across-changing-repository-states) |
| N18 | Shared context file for coding agents, with references usable outside a session | 5a | Product design: [shared machine-readable context](../../foundation/product-design.md#371-shared-machine-readable-context). Related decision: [reference lifetime disclosure](../../docs/decisions/reference-lifetime-disclosure.md) |
| N19 | Agent-supplied context recorded with provenance | 5b | Product design: [agent-supplied context](../../foundation/product-design.md#372-agent-supplied-context) |
| N20 | A plain-language statement of the question each view answers | 2, L | Candidate entry below |

Items recorded only in the product design (N4, N12–N15, N18, N19) get no
candidate entry here. The journeys mainly show where the GUI depends on them,
which may inform planning order.

## Open question: N3

Counting modules per group, or listing only the groups that contain modules,
could count as presentation over the organization projection rather than new
analysis. Product design allows presentation to aggregate as long as the
aggregation stays visible. Decide whether such counts belong to presentation or
need a lens of their own.

## Candidate backlog entries

```markdown
## Distinguish runtime built-ins from installed packages among external modules

Added: 2026-10-03
Origin: GUI design exploration of repository overviews
Area: mechanical analysis

An overview that summarizes a project's external modules is more useful when it
can say which are runtime built-ins (such as `node:` modules) and which come
from installed packages. Investigate which signals establish each category
under the configured TypeScript environment, such as module specifiers,
resolution outcomes and package metadata, and what each signal does not
establish. Unrecognized modules must remain unclassified rather than defaulting
to either category. This is a narrow first step toward the external dependency
lenses in the product design.
```

```markdown
## Explain dependency cycles

Added: 2026-10-03
Origin: GUI design exploration of module examination and revision comparison
Area: dependency analysis and presentation

The dependency view reports cyclic components but not how a given module takes
part in one. A short explanation, such as the shortest loop through a module
with the mechanism of each edge (including type-only edges), would make a large
component intelligible. Across revisions, a related need is to say which modules
joined or left a cycle, which depends on subject correspondence between
revisions. Path choice must be explicit: a shortest loop is one of possibly many
and does not establish that other paths are unimportant.
```

```markdown
## Human-facing labels for interpretations

Added: 2026-10-03
Origin: GUI design review (no hash codes in the primary interface)
Area: interpretation presentation and naming

Retained interpretations are identified only by generated references. A GUI
needs a short human-facing label for each, such as "account of classify" or
"earlier description (corrected)", while exact references stay available for
traceability and agents. Any descriptive label is itself interpretation and
must keep that status and its provenance; structural labels derived from
subject, operation and revision state may be preferable where they suffice.
```

```markdown
## Show Git change information to people, not only investigators

Added: 2026-10-03
Origin: GUI design exploration of resuming work after repository changes
Area: history evidence and presentation

The existing history backlog entry provides Git history to the investigator.
Resuming work also calls for history shown directly to the human: which files
changed between two revisions, commit and pull-request messages presented as
recorded assertions with their provenance, and when a given annotation first
appeared. Keep Git-derived facts distinct from the authors' statements in those
messages. Could be combined with the existing entry if scoped together.
```

```markdown
## State each view's question in plain language

Added: 2026-10-03
Origin: GUI design discussion of whether lenses are a user-facing concept
Area: presentations

If lenses are not presented as a user concept, each view still needs to say
what question it answers, including any parameter that changes its meaning,
such as direct versus transitive reach. A plain-language statement derived from
the lens and its parameters would serve as the view's caption and as the
"question" field when a claim is opened in full. The wording must not narrow or
broaden what the projection establishes.
```
