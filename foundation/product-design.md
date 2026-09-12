# PostCode: Product Design

This document describes the current design hypothesis for PostCode: what the system is and how its concepts fit together.

## 1. Design Premise

The research goal is a projection-based software-development environment through which a human can understand, direct, and supervise software using task-appropriate, epistemologically qualified representations rather than routinely working through conventional programming-language source.

The first design decision is a simplification: PostCode's projections and views are read-only. The human continues to direct program changes by instructing coding agents in prose. This simplification defers questions about semantics, authority, ambiguity, round-tripping, and implementation conformance that need not be answered to investigate the core projection model. Later versions of PostCode could support bidirectional views without invalidating the projection model described here.

The core projection pipeline is therefore:

```text
filesystem + Git
       │
       ↓
language-aware analysis
       │
       ↓
lenses and projections
       │
       ↓
read-only view
```

In addition to projecting information available from repository state, PostCode can display runtime observations produced by external systems. PostCode need not itself become a debugger, profiler, test runner, or execution environment.

```text
debugger / profiler / tracer / test runner
                 │
                 ↓
            runtime adapter
                 │
                 ↓
              PostCode
```

Such observations might concern calls, time, allocation, coverage, values, stack frames, or debugger state.

## 2. Core Model and Design Principles

### 2.1 Lenses, Projections, Presentations, and Views

PostCode distinguishes four related concepts that should not be used interchangeably. They need not become formal software abstractions prematurely; their immediate purpose is to keep the design vocabulary clear.

#### 2.1.1 Lens

A **lens** describes the aspect of the program being investigated: the question being asked of it.

Examples include:

- dependencies;
- callers;
- references;
- construction;
- mutation;
- tests;
- behavior;
- history;
- rationale;
- summary.

A lens answers:

> **What aspect of this subject are we interested in?**

A lens may accept lens-specific parameters that refine the information requested. A summary lens might specify focus, breadth, depth, or an information budget; a callers lens might distinguish direct from transitive callers.

A lens may be primitive or composite. A composite lens can select and combine information from other qualified projections; for example, `summarize(subject)` might draw on structure, dependencies, callers, tests, and history while remaining a lens over the subject.

#### 2.1.2 Projection

A **projection** is the information produced by applying a lens to a particular program state and subject.

Conceptually:

```text
projection = lens(repository, revision, subject, lens_parameters)
```

The lens parameter values are part of the projection's identity and must remain distinct from choices about how the projection is presented.

A projection includes both its content and the qualifications needed to understand what that content establishes.

For example, applying a callers lens to `MediaManager` might produce:

```text
Subject
  MediaManager

Direct static callers
  A
  B
  C

Method
  TypeScript static analysis

Guarantee
  Shown direct static calls are real.

Limitation
  Calls through escaped closures cannot be
  exhaustively determined.
```

#### 2.1.3 Presentation

A **presentation** describes how a projection should be rendered, interacted with, or exposed through a PostCode interface.

A projection might be presented as:

- a graph;
- a table;
- a tree;
- a timeline;
- annotated text;
- a diagram;
- a combination of these.

Presentation can be selected independently of the information requested. Four dependencies might be most useful as a small graph; eighty-seven might be better as a searchable or clustered table. A rationale projection might be best presented as annotated text.

A presentation may accept presentation-specific parameters such as sorting, grouping, layout, filtering, expansion depth, or whether to show implementation names, descriptive labels, or both. Consequential filtering, aggregation, or omission must remain visible so that presentation does not make a projection appear more complete than the information shown.

Presentations may share common interaction affordances such as hover or focus detail, subject and relationship selection, contextual lens application, expansion and collapse of evidence or qualifications, opening or pinning views, and copying stable references for coding-agent prompts.

Presentations need not be GUI elements; they may be emitted or exported as human-readable text or structured machine-readable data.

#### 2.1.4 View

A **view** is an instantiated presentation of a particular projection through a PostCode interface.

Conceptually:

```text
view = presentation(projection, context, presentation_parameters)
```

Different presentations or presentation parameter values may produce distinct views over the same projection. Presentation context may change how an existing view is rendered without changing its identity.

#### 2.1.5 Logical Model and Execution Planning

The conceptual separation of lens, projection, presentation, and view does not require PostCode to materialize each stage independently or in that order.

An implementation may plan them together:

```text
plan = optimize(
  lens,
  lens_parameters,
  presentation,
  presentation_parameters,
  available_analyses
)

view = execute(plan)
```

Presentation requirements such as filtering, ordering, field selection, or pagination may be pushed into a lens or underlying analysis. Lens and lens-parameter choices may likewise select a narrower or less expensive analysis.

These optimizations must preserve the conceptual distinctions. Lens parameters define the information requested; presentation parameters define how it is shown; pushdown is an execution strategy rather than a reclassification of those choices. Partial or lazy materialization must retain explicit coverage and limitation information, and a change in execution plan must not masquerade as a change in the projected program information.

##### 2.1.5.1 Resource-Bounded Analysis

An analysis may be applicable and supported while its anticipated or accumulating cost in time, computation, money, agent credits, or another limited resource exceeds a threshold. PostCode may describe the expected cost and likely effect of further analysis with appropriate uncertainty, and allow the human to proceed, stop, accept the current qualified result, or choose a less expensive analysis. When analysis is under way, accumulated cost should also be available where practical. Stopping an analysis may preserve a qualified partially materialized result when the analysis method permits it.

A resource budget is an execution constraint rather than a lens parameter: it governs how aggressively PostCode tries to satisfy the request, not what information the lens requests. If the budget leaves requested information unmaterialized, the projection must explicitly indicate its partial materialization rather than silently behaving like a narrower lens. When a less expensive analysis uses a different method or provides different guarantees, those differences must remain visible.

PostCode should distinguish three dimensions:

- **applicability and availability:** whether the analysis is applicable, supported, and currently available;
- **execution state:** whether it is deferred, running, stopped, failed, or completed;
- **result materialization:** whether it has produced no result, a partially materialized result, or a fully materialized result relative to the request.

These dimensions can coexist: a stopped or failed analysis may retain usable qualified information, and an unavailable analysis may have an earlier partially materialized result. They are distinct from epistemological status. Additional effort may broaden coverage or select a different analysis method, but does not inherently make a claim truer or more exact.

### 2.2 Epistemological Contract

The requirement is not that every projection be exact or complete.

The requirement is:

> **Every projection must be accurate about what is known, what is asserted, what is observed, what is inferred, and what cannot be determined.**

For example:

> Direct static callers: A, B and C.  
> Additional callers through escaped closures cannot be exhaustively determined.

or:

> According to a source annotation, this module exists to cache remote catalog state.

or:

> Tests X and Y reject duplicate media IDs.

or:

> **Interpretation:** These tests appear intended to protect uniqueness of media IDs.

or simply:

> Cannot project this property reliably.

The unacceptable result is presenting partial, historical, asserted, observed, or inferred information in a way that implies a stronger claim than the evidence supports.

For mechanically derived information that has been produced, a projection's guarantee might be:

- exact;
- sound but incomplete;
- complete but over-approximate.

A projection may instead report that the requested information or analysis is unavailable. Availability is distinct from the guarantee attached to any result that has been produced. Information derived from observation requires a scope qualification identifying what was observed.

Other kinds of information require different qualifications. PostCode need not finalize a formal terminology immediately; plain-English qualification may initially be clearer.

Two things must remain conceptually distinct:

- **Provenance or method:** where the information came from or how it was obtained.
- **Epistemological status or guarantee:** what can safely be concluded from it.

For example:

```text
Method
  TypeScript static analysis

Guarantee
  All shown direct static import edges are real.
  Dynamic imports are not included.
```

or:

```text
Claim
  MediaCatalog exists to avoid repeated remote queries.

Provenance
  Source annotation in MediaCatalog.ts

Status
  Recorded design assertion.
  May be historical or stale.
```

or:

```text
Claim
  Duplicate media IDs are invalid.

Evidence
  Tests X, Y and Z

Status
  Interpreted test intent.
  The tests establish particular expected behavior,
  but not necessarily the complete intended invariant.
```

or:

```text
Claim
  MediaCatalog separates local catalog state
  from synchronization policy.

Evidence
  Source structure + Git + tests

Status
  Interpretive explanation.
  Plausible but not mechanically established.
```

#### 2.2.1 Evidence, method, and interpretation

A claim's epistemological status must follow from its evidence and the method by which it was produced, not from the confidence expressed by a person, heuristic, or generative model.

An AI agent may help select lenses, gather and combine evidence, propose labels, synthesize explanations, and identify useful interpretations. Its participation does not by itself make the resulting claims mechanically established. An interpretation does not become a derived fact merely because an agent states it confidently or cites supporting evidence. If appropriate evidence and a defined method independently establish the claim, that established claim is a separate result.

PostCode can therefore make a stronger commitment about the disciplined assignment and preservation of epistemological status than it can about the correctness of unrestricted natural-language interpretation. Consequential established claims may need wording that preserves the guarantee supplied by their evidence and method; interpretive synthesis must remain identifiable as interpretation. This distinction should allow qualified views to contain useful explanation without reducing every result to an undifferentiated expression of uncertainty.

#### 2.2.2 Status is part of the view

Epistemological qualification must not exist only in internal metadata or surrounding documentation.

> **The status of a claim must survive into the human-facing view of that claim.**

The eventual interface might represent status through text, badges, typography, icons, expandable evidence, interaction, or some combination of these. The presentation is open to experimentation; the requirement is not.

A weaker claim must not visually masquerade as a stronger one.

The governing principle is:

> **Graceful refusal or explicit qualification is preferable to plausible-looking certainty.**

Trust is critical. If subtle errors cause the user to doubt every projection, the environment loses its value as an alternative working surface.

### 2.3 Sources of Program Knowledge

Program understanding can draw on several epistemologically different sources. PostCode should not collapse them into a single category of facts.

#### 2.3.1 Derived facts

Derived facts are established through a defined analysis, such as an import relationship or a set of statically identifiable direct callers. The relevant analysis must describe what it does and does not establish.

#### 2.3.2 Recorded assertions

Programs and their histories contain statements made by humans or agents about the program. Possible sources include comments, structured annotations, design documents, commit messages, pull-request descriptions, issue discussions, agent-supplied development context, and other project documentation.

PostCode can establish precisely that an explanation was recorded. It cannot thereby establish that the explanation is true, current, complete, or still the reason the code exists.

```text
Assertion
  Foo is true.

Source
  Annotation in Bar.ts

Historical context
  The annotation first appears in commit 8fa39c2 "Frobnify the glomax..."
  The same commit introduced Bar and modified Baz.

Status
  Recorded assertion with derived historical context.
  The history does not establish that the assertion
  remains true or current.
```

#### 2.3.3 Behavioral and observational evidence

Tests, runtime traces, profiler output, debugger observations, and similar evidence establish something different again.

```text
Tests X and Y reject duplicate media IDs.

Status
  Derived observation about test behavior
```

That is stronger than merely guessing that duplicates are invalid, but weaker than proving that their rejection is a complete intended invariant of the system.

Runtime observations carry a natural scope qualification:

> Observed during run X.

They must not silently become claims about all possible executions.

#### 2.3.4 Inferred explanations

Some useful questions inherently require interpretation:

> Why does this exist?

> Why is this functionality split across two modules?

> What happened to `MediaManager`?

> What would be affected if this went away?

An answer may combine current source structure, derived relationships, recorded assertions, commit history, tests, runtime observations, and language-model interpretation.

Such an answer may be extremely useful while still being an interpretation rather than an established program fact. Its evidence, confidence, and limitations should remain visible.

### 2.4 Identity and Continuity of Attention

PostCode does not presuppose persistent semantic identities for program entities or relationships, or a formal architecture model.

Entities and relationships can be discovered from the implementation according to explicit analysis rules. Possible entities include repositories, packages, modules, files, namespaces, types, functions, methods, exported symbols, tests, and fields or variables where useful. Possible relationships include containment, dependencies, calls, references, construction, mutation, and associations between tests and program entities. What can be discovered—and with what guarantees—may vary by language.

The design distinguishes continuity of human attention from continuity of the underlying program structure:

> **PostCode can persist what the human was paying attention to without requiring continuity in the underlying program structure.**

For example, workspace state might record:

```text
MediaManager / dependencies
MediaManager → MediaCatalog / dependency
SyncReconciler / callers
sync tests
```

If `MediaManager` or one of its recorded relationships later disappears, PostCode need not infer a conceptual successor. It can show that the recorded subject no longer exists, identify the revisions in which it was last present and removed, and provide a qualified summary of the available evidence or let the human investigate what happened.

In this way, PostCode preserves the continuity of the human's investigation across changes and discontinuities in the underlying program structure.

### 2.5 Naming and Terminology

An entity's identity, its implementation identifier, and the label presented to the human are distinct.

An implementation identifier is a mechanically established fact about the program, but it may be arbitrary, misleading, language-specific, or chosen for concerns irrelevant to the current investigation. A descriptive label expresses what the entity appears to mean or do and is therefore interpretation. A PostCode-level term may provide useful continuity across implementations or programming languages, but it must not silently become a canonical concept merely because PostCode introduced it.

Views may present an implementation name, a descriptive label, or both. Exact identifiers and their source mappings should remain available for traceability and coding-agent coordination. Inferred labels must retain their provenance and interpretive status. For example:

```text
has glob
Implementation: isFrobGlob(frob)
Status: interpreted label
```

A change to a displayed label must not masquerade as a change to the program. Conversely, a renamed implementation identifier need not break the continuity of the human's attention when the available evidence supports continued reference to the same subject.

Language-independent terminology may emerge through use, but PostCode should not prematurely impose a canonical pseudocode or universal naming vocabulary.

## 3. Interaction Model

PostCode may expose a command-line interface for requesting and inspecting individual views. This interface uses the same lenses, projections, qualifications, and provenance as the GUI, with presentations that are human-readable or machine-readable. It supports development-time exercise, direct human inspection, coding-agent invocation, and useful operation before the GUI is mature.

### 3.1 Investigation and Representation Selection

The human can choose a subject, lens, lens parameter values, presentation, presentation parameter values, or any combination of them. PostCode can choose whichever elements the human leaves unspecified, based on the expressed information need and the projections available, and create the resulting view.

Selection can therefore be explicit, automatic, or mixed. For example:

> What depends on this?

leaves PostCode to choose an appropriate lens and presentation.

> Show callers of this.

effectively selects the lens while leaving the presentation open.

> Show this as a tree.

selects a presentation for information established by the surrounding context.

> Show the transitive callers of this as a tree.

selects a lens, a lens parameter value, and a presentation.

The prose interface supports questions at several levels:

> Show me everything related to synchronization.

> What calls this?

> Why does this exist?

> What happened to `MediaManager`?

> What behavior do these tests appear to protect?

For whatever the human leaves unspecified, the prose interface can act as a query planner:

```text
human information need
and explicit choices
        │
        ↓
prose interpretation
        │
        ↓
subject / lens / lens-parameter selection
        │
        ↓
qualified projection
        │
        ↓
presentation / presentation-parameter selection
        │
        ↓
view
```

“What calls this?” may map almost directly to a callers lens backed by static analysis. “Why does this exist?” may select evidence, history, and rationale lenses and synthesize several projections. “What behavior do these tests appear to protect?” may combine mechanically established test structure with recorded descriptions and explicitly marked interpretation.

PostCode may therefore reduce two different kinds of effort:

1. determining what information about the program would answer the question;
2. determining how that information should be presented.

The important rule is:

> **Interpretation may guide investigation and may itself be useful output, but it must not masquerade as mechanically established program truth.**

Text is a first-class presentation. A view need not be graphical, and its underlying projection need not be mechanically derived, provided the provenance and epistemological status of its claims remain visible.

### 3.2 Summary as Initial View and Recursive Navigation

The default initial projection for a subject is:

```text
summarize(subject, lens_parameters)
```

For an unfamiliar subject, a summary can provide an overview of its structure, behavior, and role; for a familiar subject, it can provide efficient access to details relevant to the current investigation. Lens parameter values can adjust the summary's focus, breadth, depth, and information budget. A summary may satisfy the human's current purpose or help them select or reach a further subject of investigation.

A root summary might identify, where supportable:

- major packages and modules;
- executable applications or libraries;
- major dependency boundaries;
- entry points and exported APIs;
- tests and their distribution;
- build and package structure;
- major externally recorded descriptions;
- candidate architectural groupings, explicitly marked as interpretation.

A typical investigation might proceed:

```text
summarize(root)
        ↓
summarize(publishing)
        ↓
structure(publishing)
        ↓
summarize(MediaManager)
        ↓
tests(MediaManager)
        ↓
callers(reconcile)
```

This gives PostCode a simple recursive interaction model:

> **Summarize where I am; then let me follow whatever becomes interesting.**

### 3.3 Workspace Model

A workspace contains an arbitrary number of views over projections.

```text
projection = lens(repository, revision, subject, lens_parameters)
view       = presentation(projection, context, presentation_parameters)
```

Presentation parameters may express choices such as sorting, grouping, layout, filtering, expansion depth, or label style. Presentation context might eventually include the current investigation, the number and shape of results, available screen space, neighbouring views, user preferences, and previous interaction.

A revision may be the current working tree, a branch, or a commit. Staged or index state may also be useful.

Views may be:

- **live:** the underlying projection follows a working tree or branch;
- **pinned:** the projection remains attached to a particular revision.

The user constructs the working surface appropriate to the current problem rather than operating within a predetermined dashboard.

A workspace organizes its views as an investigation graph. Views are nodes; relationships record how views were derived, placed, and connected. Navigation usually creates a relationship to the view that supplied the new subject or other input, while comparison or synthesis may relate a view to several earlier views.

Derivation, placement, revision binding, and investigation role are distinct. A view may be embedded in another view, placed alongside it, or moved into a linked workspace. It may be live or pinned independently of whether it is a root or descendant of the investigation. A view can become the root of a linked workspace without being pinned and without losing its derivation history.

A PostCode workspace may comprise multiple such linked workspaces, each preserving its own focal subject and collection of views. Collectively, they form the workspace through which the human conducts an investigation.

### 3.4 Navigation Through Views

Views support navigation by allowing displayed subjects and relationships to become subjects of other lenses. Any presentation may provide this affordance.

Selecting an entity shown in a view—whether presented as a summary, tree, graph, table, or text—can apply another lens to that entity or make it the subject of a new query. A dependency shown in one view might lead to a summary of the dependency, its callers, its tests, its history, or another available projection.

Selecting a subject or relationship can create another projection and embed its view within the originating view, open it as a separate view in the current workspace, or create a linked workspace focused on that subject. For example, expanding an item in a tree might show a summary view inline while preserving the item's position in the surrounding hierarchy. A focused workspace might begin with `summarize(subject)` and accumulate additional views as the investigation develops. The originating workspace remains available so that the human can move among related investigation contexts without reconstructing them.

The relationship to an originating view may record only how a subject was discovered, or it may remain a live dependency in which input to one view comes from another view's projection. If a live parent changes, an anchored view may remain in place, move with its anchor, or become detached when the anchor disappears. PostCode must not silently retarget or destroy the view when correspondence becomes uncertain; it should preserve the continuity of the human's investigation and expose whether the anchor is present, moved, absent, or uncertain.

Some presentations may emphasize navigation, while others emphasize explanation, comparison, or inspection. A package or module hierarchy projection, for example, might use a tree presentation through which the human can move into more specific subjects. Other navigation may proceed through non-hierarchical relationships such as dependencies, calls, data flow, tests, or history.

PostCode should not assume that there is one uniquely correct conceptual hierarchy of the program. Containment and decomposition may be hierarchical; many other useful relationships are not. Navigation should follow whichever subjects and relationships the current investigation exposes.

### 3.5 Source Escape Hatch

Source-level detail and conventional source should not be PostCode's default or primary representations. Completely excluding them, however, would hide cases in which projections are insufficient and add artificial friction to investigation.

PostCode may therefore provide an explicit escape-hatch mechanism through which the human can access source-level detail or conventional source when needed.

Using the source escape hatch is a legitimate action, not a failure. It allows the human to obtain implementation detail, verify a projection, or continue an investigation for which PostCode cannot yet provide an adequate representation. Its use is recorded as described in [Automatic Event Capture](#381-automatic-event-capture), allowing later analysis to help identify conceptual capabilities that are missing or inadequate.

#### 3.5.1 Supporting Source-Level Detail

PostCode should use conceptual terms rather than source-language details as its default representation where the evidence supports them. A concept such as a build-time dependency may, for example, be backed by a TypeScript-specific definition such as an `import type` declaration without displaying that definition initially.

The conceptual view must still expose enough provenance, epistemological status, guarantees, and limitations for the human to understand what its claims establish. Further supporting detail may be disclosed progressively, including the language-specific definition or analysis rule and the corresponding declaration or source location.

These disclosures are a form of escape-hatch use rather than a silent fallback from conceptual representation. They should remain visible and distinguishable according to the level of detail disclosed.

#### 3.5.2 Conventional Source Views

Primary navigation is organized around program entities and relationships exposed or discovered by PostCode, rather than raw files and directories. Files and filesystem structure remain available through the source escape hatch for traceability, verification, and investigations that the available projections cannot support.

A file reached through the source escape hatch may itself become the subject of a projection, but the resulting investigation remains identifiable as having originated from source-level navigation.

Conceptually, source follows the same model as other views. A source lens produces a projection containing conventional implementation text for a subject and repository state; a source presentation renders that projection; and the resulting source view is provided through the escape-hatch mechanism.

### 3.6 Revision and Projection Comparison

During agent-mediated development, one of the most important questions is:

> **What did the agent just change?**

Git source diffs answer that at the implementation-text level. A projection comparison can instead ask:

> **What changed at the level at which I was thinking about the program?**

Examples include changed dependencies, callers, construction sites, test relationships, behavior, call paths, or recorded rationale.

The smallest design is to apply the same lens to the same subject at two revisions and compare the resulting projections:

```text
before = lens(repository, revisionA, subject, lens_parameters)
after  = lens(repository, revisionB, subject, lens_parameters)

compare(before, after)
```

The two projections may initially be placed side by side. More specialized comparison views can emerge if use demands them.

Projection stability is particularly important here: changes in the projection mechanism must not masquerade as changes in the program.

#### 3.6.1 Conceptual Diffs

A broader change-oriented lens for conceptual diffs takes a revision or commit range as its input and identifies relevant subjects and kinds of change rather than requiring the human to select one lens and subject in advance:

```text
diff(revision_range, lens_parameters)
```

Lens parameters may specify a subject or scope; a perspective such as dependencies, behavior, boundaries, tests, or requirements; a focus expressed in prose; breadth, depth, or an information budget; and whether to include interpreted significance as well as mechanically derived changes.

A command-line interface might expose this capability as `postcode diff`, accepting explicit options or descriptive text that asks for a particular perspective or focus. The resulting projection can also use an appropriate presentation in the GUI.

An unfocused conceptual diff may provide a compact, qualified starting view analogous to `summarize(subject)`. It should expose the lenses, evidence, and selection criteria behind its account and allow the human to expand alternative descriptions or lens-specific comparisons. It must not imply that its account is uniquely correct or that omitted changes are unimportant unless those claims are supportable.

A single commit might, for example, be described from different perspectives as moving responsibility across a module boundary, adding a runtime dependency, preserving externally visible behavior while restructuring implementation, satisfying a recorded refactoring requirement, and strengthening a projected boundary guarantee.

These descriptions may coexist while having different epistemological bases: the dependency change may be mechanically derived, movement of responsibility may be interpretation, behavioral preservation may be supported by tests, and correspondence to the requirement may come from recorded development context. Which descriptions are salient generally depends on the current task and investigation.

### 3.7 Agent Integration

Separating PostCode from the coding agent creates an important interaction question.

The human may understand a desired change through a PostCode view, but the agent ordinarily sees the repository and the human's prose—not necessarily the projection, its qualifications, or the investigation that produced it. If the human must repeatedly translate a projected concept back into filenames, symbols, and implementation details, much of the value of working at the projection level may be lost.

The human and agent should be able to discuss the software using projections as shared referents. For example:

> Separate the synchronization policy shown in this projection from catalog-state management.

or:

> Preserve the behavior represented here, but remove this dependency path.

When a view reports uncertainty or a limitation, the human may use that report as development feedback when directing a coding agent. The shared context should give the agent access to what was reported and any stated cause, allowing the human to refer to it without translating it into source-level terms. A reported limitation in the shared context is not itself an instruction to change the program.

#### 3.7.1 Shared machine-readable context

The initial mechanism can be a machine-readable context artifact that PostCode keeps synchronized with the current workspace. Agent instructions such as `AGENTS.md` or `CLAUDE.md` can direct coding agents to read that artifact when interpreting the human's prompts.

The purpose is not merely to give the agent another description of the repository. It is to let the human refer directly to PostCode context in a prompt: the focused view, a projected relationship, a qualified summary, or the current investigation. The agent can then resolve that reference without requiring the human to translate the projection back into filenames, symbols, and implementation details.

The artifact should describe at least:

- the repository and revision or working-tree state against which it was generated;
- the current operational task and information need, where formalized;
- the open views and their stable identifiers;
- which view or subject currently has the human's focus;
- the lens, lens parameter values, subject, projection, presentation, and presentation parameter values underlying each view;
- the projection's content, provenance, epistemological status, and limitations;
- source entities or locations that allow an agent to reconnect projected concepts to the implementation;
- relationships among views, including derivation, placement, live dependencies, and investigation roots.

Conceptually:

```text
PostCode workspace
        │
        ↓ continuously updates
machine-readable context artifact
        │
        ↓ read according to project agent instructions
external coding agent
```

The context artifact should be generated state rather than a canonical program representation. It should not normally be committed, and updating it should not dirty the repository or trigger PostCode to analyze its own output. It should be written atomically and carry enough revision information for an agent to recognize when the context no longer describes the current program state.

A compact manifest may be preferable to duplicating every projection into one indefinitely growing file. The manifest can describe the current workspace and point to separate machine-readable projection records when necessary. The exact representation can emerge with the implementation, but it should be documented and stable enough that different coding agents can consume it without bespoke integration.

This allows prompts such as “remove the dependency shown in the focused view” or “preserve the behavior represented here” to carry useful shared context.

#### 3.7.2 Agent-supplied context

Communication can also flow from the coding agent back into PostCode.

Project instructions can ask the agent to leave a structured response artifact or invoke a command to record context relating to its work. That context might include:

- the task and request as the agent understood them;
- which projected concept the agent understood the request to concern;
- how the implementation corresponds to that concept;
- rationale for a change;
- constraints, uncertainty, or missing information encountered;
- tests or other verification performed;
- source entities affected;
- projections that should be refreshed or shown;
- questions that another lens might help answer.

Agent-supplied context must retain its provenance and epistemological status. An agent's account of its rationale, behavior, or interpretation is a recorded assertion or interpretation, not a derived fact merely because it was written in a structured form.

The response artifact should be associated with the relevant repository state and, where possible, the task or conversation that produced it. PostCode can then present this development context alongside derived structure, history, tests, and other evidence without collapsing their distinctions.

#### 3.7.3 Interactive agent exchange

The file-based exchange can later develop into a more interactive protocol. An external agent might:

- query PostCode lenses directly;
- refer to projections and views by stable identifier;
- request a new projection or refresh;
- contribute rationale or uncertainty during development rather than only after a task;
- suggest useful additions to the current investigation.

PostCode might in turn generate prompt-ready references, expose structured queries, or eventually contain the agent conversation itself. These mechanisms can build on the same shared context model rather than replacing it.

### 3.8 Formative Observation Support

PostCode should support formative observation without requiring the developer to maintain a separate research diary.

#### 3.8.1 Automatic Event Capture

PostCode should automatically record relevant interaction events, including prompts and prose requests submitted to PostCode; prompts sent to coding agents, when available; selected lenses, lens parameter values, presentations, presentation parameter values, and resulting views; navigation; source escape-hatch use; unavailable, refused, or failed projection requests; analysis applicability and availability, execution state, and result materialization; resource estimates, budgets or thresholds, user choices, and actual resource use where available; workspace changes; and interactions with coding-agent context.

#### 3.8.2 Contemporaneous Subjective Observations

PostCode should also make it easy to record subjective observations and reactions at the moment they occur. Possibilities include:

- lightweight controls that record an immediate positive or negative reaction—for example, 😁 or 😩—and offer an optional prompt for explanatory text;
- a **Wish I had lens/projection…** control that records an unmet information need and offers an optional prompt to describe it.

#### 3.8.3 Event Provenance

Each recorded event should include provenance and context metadata sufficient to identify:

- the version of PostCode that produced it;
- the observed repository state, including its Git commit and any relevant working-tree changes;
- a session identifier, where applicable, allowing related events to be grouped without assuming that a session corresponds to a single investigation or task;
- the current operational task and relevant contextual information, where available;
- whether the event arose from genuine use of PostCode for software investigation or development or from testing or debugging PostCode itself.

Where the operational task is formalized, the recorded context may include its definition or a stable reference to the external task artifact or conversation that defines it.

#### 3.8.4 Observation Delivery

Released production builds deliver research-oriented observation events to the designated research observation storage using configuration selected when the build is produced. Development and test builds may suppress observation events or deliver them to another destination convenient for development, including a location within the development repository, subject to the [Generated-Output Evidence Boundary](#5-generated-output-evidence-boundary).

## 4. Projection Capabilities and Architecture

### 4.1 Candidate Lenses

Candidate lenses may include judgments such as “important component” or “architectural responsibility,” but must present them explicitly as interpretation rather than established program facts.

These are candidate lenses and lens families, not a proposed universal ontology. The eventual set of lenses, their behavior, and their grouping should emerge from use rather than being assumed.

#### 4.1.1 Summary lenses

One particularly important lens is also one of the simplest and most familiar:

> **Summarize this.**

Conceptually:

```text
summarize(subject)
```

The subject might be a repository, package, subsystem, module, type, function, test, collection of entities, or change between revisions.

Unlike a conventional prose summary generated directly from source, a PostCode summary can be assembled from other qualified projections:

```text
summarize(MediaManager)
        │
        ├── structure(MediaManager)
        ├── dependencies(MediaManager)
        ├── callers(MediaManager)
        ├── tests(MediaManager)
        ├── history(MediaManager)
        │
        ↓
qualified summary
```

Its output may contain derived facts, recorded assertions, observations, and interpretations. It must preserve those distinctions rather than flattening everything into equally authoritative prose.

This makes summary a useful stress test of PostCode's epistemological contract: it deliberately compresses several kinds of program knowledge while still preserving the strength and provenance of consequential claims.

Summary provides a qualified initial account of a subject. It should be recursive across entity levels and may either satisfy the human's current purpose or expose useful directions for further investigation.

#### 4.1.2 System and repository lenses

Examples include:

- module and package hierarchy;
- imports and dependencies;
- exported API;
- test inventory;
- type relationships;
- package and module references.

Hierarchy and other structural projections should be based only on relationships the relevant language analysis can define accurately.

#### 4.1.3 Entity cross-reference lenses

For an identified entity, possible lenses include:

- definition;
- callers and callees;
- references;
- construction and allocation sites;
- reads and writes;
- values passed to and from it;
- implementations;
- inheritance, interface, or trait relationships;
- ownership or lifetime information where meaningful.

The available facts and guarantees are language-dependent. PostCode should not manufacture symmetry where language semantics differ.

#### 4.1.4 Test lenses

Tests occupy a semi-formal boundary between intended program behavior and source-language implementation. A test may be considered at several distinct levels:

- **test intent:** the behavior or property the test appears intended to protect;
- **test realization:** the setup, fixtures, mocks, calls, and assertions used to exercise it;
- **evidence:** what passing or failing the test establishes;
- **language- or runtime-specific mechanism:** concepts necessary to express or execute it.

For example:

```text
Test
  rejects duplicate media IDs

Behavior/property
  Duplicate IDs are rejected.

Status
  Interpreted test intent

Evidence
  Test name + structure + assertions

Realization
  Creates catalog containing A.
  Attempts to add another item with A's ID.
  Expects failure.

Status
  Derived from test structure
```

PostCode should project a test at the highest useful abstraction level that preserves what it actually establishes. It should not require every test to have a language-independent behavioral description.

Potential test lenses include inventory, association with entities, setup/action/assertion structure, behavior or property summaries, dependencies, affected tests, and history across revisions.

#### 4.1.5 Path lenses

Possible path lenses include call paths, dependency paths, data-propagation paths, and possible control-flow paths. These may frequently produce qualified rather than exact projections.

#### 4.1.6 Temporal and revision lenses

Examples include:

- where and when an entity appeared or disappeared;
- callers and dependencies across revisions;
- tests added or removed;
- changes in what a test exercises or asserts;
- the same projection across branches.

#### 4.1.7 Rationale and evidence lenses

Possible lenses include recorded rationale, relevant annotations, history explaining a design choice, tests that appear to encode requirements, evidence supporting or contradicting old rationale, and synthesized explanations with explicit epistemological status.

#### 4.1.8 External dependency lenses

Possible lenses include:

- libraries and packages, classified by development, build, test, or runtime use;
- external services and APIs;
- tools, platforms, and infrastructure;
- specifications, standards, and protocols upon which the program depends;
- versions, configuration, affected program entities, and evidence for each dependency.

#### 4.1.9 Requirement and constraint lenses

Possible lenses include:

- stated behavioral and non-behavioral requirements;
- design and implementation constraints;
- requirements or constraints encoded by tests, types, configuration, documentation, history, or external specifications;
- their scope, provenance, epistemological status, and affected entities;
- evidence that the implementation satisfies, violates, or does not establish them.

A written requirement is a recorded assertion. A test may provide partial behavioral evidence, an inferred constraint is interpretation, and a type-system restriction may be mechanically established. These distinctions must remain visible in the projection.

#### 4.1.10 Boundary and modularity lenses

Possible lenses can identify candidate module boundaries by combining evidence from dependencies, calls, data flow, state ownership, change history, requirements, and rationale. They might ask:

- which entities form a relatively cohesive group;
- where dependencies cross a possible boundary;
- which state, effects, or invariants belong together;
- which entities repeatedly change together;
- what remains common across multiple implementations and what varies;
- what would need to move or become an interface if a unit were extracted.

These projections should present candidate groupings, supporting and contrary evidence, cross-boundary dependencies, and ambiguity. They must be able to report that no clean boundary is evident rather than presenting an interpretive decomposition as established program structure.

### 4.2 Language Integration

Support for a programming language supplies the entity discovery, analyses, and guarantees available for that language.

When adding new languages, the rule is:

> **Accrete shared abstractions upward from multiple languages; never discard language-specific semantics merely to fit a shared model.**

Tests are a particularly useful stress case. A behavioral test may project naturally into a shared concept such as “duplicate identifiers are rejected,” while another test may fundamentally concern a language's type system, ownership rules, macro behavior, linking semantics, runtime scheduling, or memory management.

Shared concepts and language-specific extensions can coexist. Experience across languages should reveal their boundary rather than deciding that boundary in advance.

## 5. Generated-Output Evidence Boundary

Outputs produced by PostCode about a repository—including observation records, CLI output, exported projections or views, cached analysis results, and reports—must not silently become repository evidence in subsequent analysis of that same repository. PostCode may retain, reuse, or compare such outputs as PostCode-produced artifacts with their provenance intact, but must not rediscover them as though they were independent evidence about the program.

PostCode must support keeping generated outputs outside the analyzed repository or explicitly excluding their locations from repository evidence. Markings within the generated data may supplement but must not replace that boundary.

Outputs concerning other subject repositories may remain within the PostCode development repository as development or test artifacts and may provide evidence about PostCode's behavior, provided their provenance is preserved. When PostCode analyzes its own repository for development or testing, locally retained PostCode outputs must be excluded from repository evidence to prevent a feedback loop.
