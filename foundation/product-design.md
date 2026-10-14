# PostCode: Product Design

This document describes the conceptual product design through which PostCode's research questions are investigated. It defines the product hypothesis and the distinctions that the implementation must preserve, without specifying the application's detailed behavior, interface, or architecture.

<a id="design-premise"></a>

## 1. Design Premise

The goal is a projection-based software-development environment through which a human can understand, direct, and supervise software using task-appropriate, epistemologically qualified representations rather than routinely working through conventional programming-language source.

The conceptual model should not presuppose that the human knows the implementation language or that the program's persistent representation is intended for human reading.

The first design decision is a simplification: PostCode's projections and views are read-only. The human continues to direct program changes by instructing coding agents in prose. This defers questions about semantics, authority, ambiguity, round-tripping, and implementation conformance that need not be answered to investigate the core projection model. Later versions could support bidirectional views without invalidating that model.

The core projection pipeline is:

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

PostCode can also present runtime observations supplied by debuggers, profilers, tracers, test runners, or other external systems. Such observations remain qualified by the executions in which they were made; PostCode need not itself become an execution environment.

<a id="core-model-and-design-principles"></a>

## 2. Core Model and Design Principles

<a id="lenses-projections-presentations-and-views"></a>

### 2.1 Lenses, Projections, Presentations, and Views

PostCode distinguishes four related concepts that should not be used interchangeably.

<a id="lens"></a>

#### 2.1.1 Lens

A **lens** describes the aspect of the program being investigated: the question being asked of it.

Examples include dependencies, callers, references, construction, mutation, tests, behavior, history, rationale, and summary.

A lens answers:

> **What aspect of this subject are we interested in?**

A lens may accept parameters that refine the information requested, such as focus, breadth, depth, or whether callers are direct or transitive. It may draw on several analyses and evidence sources, but its result must preserve the method, provenance, qualifications, and limitations needed to understand the answer.

<a id="projection"></a>

#### 2.1.2 Projection

A **projection** is the qualified information produced by applying a lens to a subject and a captured basis of one or more program states or observations.

Conceptually:

```text
projection = lens(captured_basis, subject, lens_parameters)
```

The subject may be a repository, package, module, program entity, relationship, collection, or another concept exposed by PostCode. Most lenses concern one program state or set of observations; historical and comparison lenses may concern several ordered states.

A projection includes its content together with what establishes that content: its subject, lens, parameter values, captured basis, evidence, method, provenance, epistemological status, and limitations. Those elements remain associated even when the projection is reused or presented differently.

Changing inputs such as a branch or working tree designate states that can be captured at different times. Information based on a later capture has a new basis; it must not appear to continue unchanged from earlier evidence.

<a id="presentation"></a>

#### 2.1.3 Presentation

A **presentation** describes how one or more projections are rendered or exposed through a PostCode interface.

Examples include text, tables, graphs, trees, timelines, diagrams, and structured machine-readable data. A presentation can arrange, align, compare, or coordinate several projections while preserving each projection's identity and qualifications.

Presentation is distinct from analysis. Sorting or grouping information already established by a projection may be presentational. Inferring correspondence, synthesizing an explanation, identifying a flow, or deriving another claim requires a lens and produces another qualified projection.

Presentation choices must not make the displayed information appear more complete or authoritative than its projections support.

<a id="view"></a>

#### 2.1.4 View

A **view** is an instantiated presentation of one or more projections through a PostCode interface.

Conceptually:

```text
view = presentation(projections, presentation_context, presentation_parameters)
```

A view may coordinate several separately qualified projections of the same subject, or projections across subjects or program states. `presentation_context` supplies circumstances relevant to rendering without adding claims about the program.

Several independent views placed beside one another remain several views. A multi-projection view exists when one presentation establishes relationships among its projections that would be lost if they were presented independently; visual proximity or a shared container alone does not make them one view.

Adding or removing a projection changes a view's composition. Replacing a projection with one based on newly captured input changes its basis. These changes must remain identifiable rather than appearing to be changes in rendering alone.

<a id="planning-execution-and-resource-limits"></a>

#### 2.1.5 Planning, execution, and resource limits

The conceptual separation among lens, projection, presentation, and view does not require the implementation to materialize each stage independently. Analyses may be shared, results may be materialized lazily, and presentation requirements may guide execution. Such optimization must preserve the conceptual distinctions and the qualifications of the result.

Lens parameters define the information requested; presentation parameters define how that information is shown. Using either kind of parameter to optimize execution does not reclassify it or erase the distinction.

Resource constraints govern how aggressively PostCode tries to satisfy a request, not what the request means. When available analysis is deferred, stopped, fails, or produces only part of the requested result, that condition must remain visible rather than silently changing the question or implying complete coverage. Spending more resources may broaden materialization or enable another method; it does not inherently make a claim truer.

<a id="epistemological-contract"></a>

### 2.2 Epistemological Contract

The requirement is not that every projection be exact or complete.

The requirement is:

> **Every projection must be accurate about what is known, what is asserted, what is observed, what is inferred, and what cannot be determined.**

For example:

> Direct static callers: A, B, and C.
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

For mechanically derived information, a projection might guarantee that its result is exact, sound but incomplete, or complete but over-approximate. Observed information requires a scope identifying what was observed. Requested information or analysis may instead be unavailable. Availability, execution state, materialization, and epistemological guarantee are distinct.

Two things must remain conceptually separate:

- **provenance or method:** where information came from or how it was obtained;
- **epistemological status or guarantee:** what can safely be concluded from it.

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
  MediaCatalog separates local catalog state
  from synchronization policy.

Evidence
  Source structure + Git + tests

Status
  Interpretive explanation.
  Plausible but not mechanically established.
```

<a id="evidence-method-and-interpretation"></a>

#### 2.2.1 Evidence, method, and interpretation

A claim's epistemological status follows from its evidence and method, not from confidence expressed by a person, heuristic, or generative model.

An AI agent may select lenses, gather evidence, propose labels, synthesize explanations, and identify useful interpretations. Its participation does not make the resulting claims mechanically established. Interpretive synthesis must remain identifiable as interpretation even when it cites evidence or is expressed confidently.

Interpretation may motivate further analysis. If appropriate evidence and a defined method independently establish a claim, that established claim is a separate result whose status follows from that evidence and method.

PostCode can therefore make a stronger commitment about the disciplined assignment and preservation of epistemological status than it can about the correctness of unrestricted natural-language interpretation.

<a id="status-is-part-of-the-view"></a>

#### 2.2.2 Status is part of the view

Epistemological qualification must not exist only in internal metadata or surrounding documentation.

> **The status of a claim must survive into the human-facing view of that claim.**

A weaker claim must not visually or linguistically masquerade as a stronger one. The particular representation is open to experimentation; the requirement is not.

The governing principle is:

> **Graceful refusal or explicit qualification is preferable to plausible-looking certainty.**

Trust is critical. If subtle errors cause the human to doubt every projection, PostCode loses its value as an alternative working surface.

<a id="sources-of-program-knowledge"></a>

### 2.3 Sources of Program Knowledge

Program understanding draws on epistemologically different sources. PostCode must not collapse them into a single category of facts.

<a id="derived-facts"></a>

#### 2.3.1 Derived facts

Derived facts are established through defined analyses, such as import relationships or statically identifiable direct callers. Each analysis must communicate what it does and does not establish.

<a id="recorded-assertions"></a>

#### 2.3.2 Recorded assertions

Comments, annotations, design documents, commit messages, issue discussions, and agent-supplied development context record claims about a program. PostCode can establish that an explanation was recorded and correlate it with history; that does not establish that the explanation is true, complete, or current.

<a id="behavioral-and-observational-evidence"></a>

#### 2.3.3 Behavioral and observational evidence

Tests, runtime traces, profiler output, and debugger observations provide evidence about particular behavior or executions. They can be stronger than interpretation while still falling short of proving a complete intended invariant or all possible executions.

Tests can be considered at distinct levels: their apparent intent, their source- and runtime-level realization, and the evidence supplied by their behavior. PostCode can seek the highest useful abstraction that preserves what a test actually establishes, without requiring every test to have a language-independent behavioral description. Apparent intent remains interpretation unless independently established.

<a id="inferred-explanations"></a>

#### 2.3.4 Inferred explanations

Questions such as “Why does this exist?”, “What happened here?”, or “What would be affected if this went away?” inherently invite interpretation. Answers may combine structure, derived relationships, assertions, history, tests, runtime observations, and model-assisted synthesis. Their evidence and limitations remain visible.

<a id="identity-and-continuity-of-attention"></a>

### 2.4 Identity and Continuity of Attention

PostCode does not presuppose persistent semantic identities for program entities or relationships, or a formal architecture model. Entities and relationships are discovered from the implementation according to explicit analysis rules, with language-dependent guarantees.

The design distinguishes continuity of human attention from continuity of the underlying program structure:

> **PostCode can persist what the human was paying attention to without requiring continuity in the underlying program structure.**

If an entity or relationship disappears, PostCode need not invent a conceptual successor. It can preserve the earlier focus, show that its subject no longer exists, identify relevant history, and support investigation of what happened. In this way, continuity of an investigation can survive discontinuity in the program.

<a id="naming-and-terminology"></a>

### 2.5 Naming and Terminology

An entity's identity, its implementation identifier, and the label presented to the human are distinct.

An implementation identifier may be arbitrary or language-specific. A descriptive label expresses interpreted meaning. A PostCode-level term may provide continuity across implementations or languages but must not silently become canonical merely because PostCode introduced it.

Views may expose implementation identifiers, descriptive labels, or both. Exact identifiers and source mappings remain available for traceability and agent coordination; inferred labels retain their provenance and interpretive status. Language-independent terminology should emerge through use rather than being imposed in advance.

A change to a displayed label must not masquerade as a change to the program. Conversely, a renamed implementation identifier need not break continuity of attention when the available evidence supports continued reference to the same subject.

<a id="interaction-model"></a>

## 3. Interaction Model

PostCode supports investigation through qualified views rather than requiring the human to navigate conventional source. Interfaces may include graphical interaction, prose, command-line interaction, machine-readable output, or combinations of them. These interfaces share the same conceptual model and epistemological contract.

<a id="investigation-and-representation-selection"></a>

### 3.1 Investigation and Representation Selection

Given a human's information need and explicit choices, PostCode constructs an appropriate view by selecting subjects, lenses and lens parameters, and a presentation and its parameters. The human may specify any of these; PostCode may select what remains unspecified.

For example:

> What depends on this?

leaves PostCode to choose an appropriate lens and presentation, while:

> Show the transitive callers of this as a tree.

selects a lens, a lens parameter, and a presentation.

The resolved construction, consequential selection criteria, and omissions must remain inspectable. Interpretation may guide investigation and may itself be useful output, but must not masquerade as mechanically established truth.

Resolving a request may require information that has not yet been established. Request interpretation may consume qualified information but does not itself derive program claims; obtaining such information is [request-scoped system-initiated investigation](#system-initiated-investigation). Outcomes—including candidates, ambiguity, incomplete coverage, and inability to resolve the request—remain attributable and qualified.

<a id="system-initiated-investigation"></a>

#### 3.1.1 System-Initiated Investigation

PostCode may initiate investigation that a human or external agent did not separately request. Such investigation may support orientation, request resolution, navigation, suggested views, or later interaction.

System-initiated investigation may be:

- **request-scoped:** additional investigation PostCode undertakes to satisfy an explicit parent request;
- **autonomous:** investigation PostCode undertakes without a parent request.

Selecting unspecified elements of a view in order to answer an expressed information need is part of interpreting the request, not by itself system-initiated investigation.

Request-scoped investigation remains PostCode-initiated even when its parent request was initiated by a human or external agent. It remains request-scoped only while it serves that parent request; work that extends beyond that purpose or continues after the parent request is satisfied or cancelled is autonomous.

The two forms must remain distinguishable. When system-initiated investigation influences what PostCode shows, selects, suggests, or reports, its relationship to any parent request or autonomous trigger, together with its relevant results and qualifications, must remain identifiable in the resulting investigation and observation records.

<a id="investigation-context-and-continuity"></a>

### 3.2 Investigation Context and Continuity

An **investigation context** comprises the views accumulated as the human follows subjects, relationships, and questions, together with their captured bases and relevant lineage. PostCode preserves enough context to identify what each view shows and how it relates to the rest of the investigation.

An investigation may continue as the program changes, but newly captured information must not silently replace or become evidence for results based on an earlier state. Relationships among views can preserve useful lineage, such as where a subject was discovered or which earlier information contributed to a comparison or summary.

<a id="navigation-through-views"></a>

### 3.3 Navigation Through Views

Displayed entities and relationships can become subjects of further investigation. Navigation may follow containment, dependencies, calls, data flow, tests, history, or any other relationship exposed by a projection.

A resulting view may remain connected to the view that supplied its subject or input. PostCode must preserve continuity when the underlying program changes and must not silently retarget a view when correspondence becomes uncertain.

PostCode should not assume one uniquely correct conceptual hierarchy. Different investigations may reveal different useful structures and paths through the same program.

<a id="source-escape-hatch"></a>

### 3.4 Source Escape Hatch

Source-level detail and conventional repository artifacts should not be PostCode's primary representation. Completely excluding them would hide cases in which projections are insufficient and impose artificial friction.

PostCode therefore provides an identifiable **source escape hatch** through which the human can inspect language-specific definitions, conventional source, documentation, files, and other repository artifacts. Escape-hatch use can provide implementation detail, verify a projection, or continue an investigation that available conceptual representations cannot support.

Source use is legitimate, not failure. Each use of the escape hatch is a **source excursion**. It remains visibly distinct from conceptual representation and is recorded through [research observation support](#research-observation-support) because repeated use may reveal missing or inadequate capabilities.

Progressive disclosure of a language-specific analysis rule, declaration, source location, or other source-level detail is also a source excursion and must remain identifiable according to the level of detail disclosed. An investigation that begins through source-level navigation retains that origin in its investigation context.

Primary navigation is organized around entities and relationships exposed by PostCode rather than raw files and directories. Files may still become subjects after the human enters through the escape hatch.

<a id="revision-and-projection-comparison"></a>

### 3.5 Revision and Projection Comparison

During agent-mediated development, a central question is:

> **What did the agent just change at the level at which I was thinking about the program?**

Applying the same lens to a subject at two states and presenting the projections together permits direct comparison without implying that PostCode has derived a claim about the change. Identifying additions, removals, correspondence, movement, or significance instead requires a qualified comparison or conceptual-diff lens.

<a id="conceptual-diffs"></a>

#### 3.5.1 Conceptual Diffs

A conceptual diff begins with change between program states and identifies the subjects and conceptual effects involved. It may be focused by dependencies, behavior, boundaries, tests, requirements, or a prose information need.

Several accounts of one change may be valid and differently grounded: a dependency change may be derived mechanically, movement of responsibility may be interpretation, behavioral preservation may be supported by tests, and correspondence to a requirement may be a recorded assertion. PostCode must expose these different perspectives and epistemological bases rather than imply a uniquely correct conceptual description.

Projection behavior itself must be stable or versioned enough that changes in PostCode do not masquerade as changes in the program.

<a id="agent-integration"></a>

### 3.6 Agent Integration

The human and coding agent should be able to discuss software using PostCode's projected concepts as shared referents. Otherwise the human must repeatedly translate an investigation back into filenames, symbols, and implementation detail, forfeiting much of the value of working at a conceptual level.

A view's reported uncertainty and limitations can also become development feedback. The agent needs access to what PostCode reported, but a limitation is not itself an instruction to change the program.

<a id="shared-machine-readable-context"></a>

#### 3.6.1 Shared machine-readable context

PostCode can expose machine-readable context representing the human's current investigation. Agent instructions can direct coding agents to use that context when interpreting the human's instructions.

The context should make focused views, underlying subjects and projections, captured bases, qualifications, relationships among views, and relevant source mappings available as shared referents. A reference to a projection over its captured basis must remain distinguishable from a reference to its underlying request repeated against current inputs. The context is generated rather than a canonical representation of the program and is subject to the [Generated-Output Evidence Boundary](#generated-output-evidence-boundary).

This allows the human to refer to projected concepts in instructions to a coding agent—for example, “remove the dependency shown in the focused view” or “preserve the behavior represented here”—without reconstructing source-level coordinates.

<a id="agent-supplied-context"></a>

#### 3.6.2 Agent-supplied context

Communication may also flow from the coding agent into PostCode. An agent can record its understanding of the task, correspondence between conceptual and implementation elements, rationale, constraints, uncertainty, verification, and suggested follow-up investigation.

Such context remains a recorded assertion or interpretation with agent provenance; structured form does not turn it into a derived fact.

<a id="interactive-agent-exchange"></a>

#### 3.6.3 Interactive agent exchange

The context exchange may eventually become interactive: agents could request projections, refer to views through stable references, contribute rationale during development, or suggest further investigation. These capabilities build on the same shared-context and epistemological model.

<a id="research-observation-support"></a>

### 3.7 Research Observation Support

PostCode is used as the instrument of a research project. It therefore produces research-oriented observations about how its concepts and interactions function in practice, without requiring a separate research diary during every use.

PostCode's observation facilities record relevant requests, choices, investigations, results, qualifications, navigation, source excursions, investigation-context evolution, resource decisions, agent-context interaction, and contemporaneous subjective reports. Each record distinguishes human-, agent-, and PostCode-initiated activity; for PostCode-initiated investigation, it also distinguishes request-scoped from autonomous work and retains the parent request or autonomous trigger. The records preserve enough provenance to relate each to the PostCode version, repository state, session, and task.

For research use, PostCode delivers observation records to a designated research destination, subject to the [Generated-Output Evidence Boundary](#generated-output-evidence-boundary).

<a id="projection-scope"></a>

## 4. Projection Scope

<a id="illustrative-lens-families"></a>

### 4.1 Illustrative Lens Families

The following lens families illustrate kinds of questions that PostCode could support:

- **summary and orientation:** qualified accounts of a subject, possibly synthesized from other results;
- **structure and repository organization:** modules, packages, containment, exports, and repository structure;
- **cross-reference:** callers, callees, references, construction, mutation, implementations, ownership, and lifetime where meaningful;
- **tests and behavior:** test inventory, association, realization, apparent intent, evidence, and history;
- **paths and flows:** call, dependency, control, and data-propagation paths;
- **history and change:** appearance, disappearance, revision comparison, and conceptual differences;
- **rationale and evidence:** recorded rationale, supporting and contrary evidence, and qualified explanations;
- **external dependencies:** libraries, services, tools, platforms, standards, and protocols;
- **requirements and constraints:** stated, encoded, inferred, satisfied, violated, or unestablished requirements;
- **boundaries and modularity:** candidate groupings, cohesion, cross-boundary dependencies, state ownership, and change coupling.

Which lenses, parameters, and groupings prove useful is a research result to be discovered through use.

<a id="programming-language-integration"></a>

### 4.2 Programming Language Integration

Support for a programming language supplies the entities, analyses, and guarantees available for that language.

PostCode does not presuppose which programming concepts should be language-independent. Shared concepts and language-specific extensions may coexist; their boundary is a research result to be discovered through use across languages.

When experience across languages reveals common concepts, PostCode can accrete shared abstractions. It must not discard or distort language-specific semantics to fit a preselected universal model.

<a id="generated-output-evidence-boundary"></a>

## 5. Generated-Output Evidence Boundary

Outputs produced by PostCode about a repository—including observation records, exported views or projections, command-line output, cached results, and reports—must not become independent repository evidence in subsequent analysis of that same repository. Otherwise PostCode can create a feedback loop in which its earlier conclusions appear to corroborate themselves.

PostCode may retain, reuse, and compare its outputs as PostCode-produced artifacts, provided their provenance and separation from repository evidence remain intact.

Markings within generated output may supplement but must not replace that separation.
