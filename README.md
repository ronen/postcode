# PostCode

> *Humans should be able to understand, design, direct and evaluate software without needing to read or write its programming language.*

PostCode is an interactive window onto software architecture. It aims to present a software project through established architectural concepts—such as responsibility, ownership, boundaries and state transitions—and support investigation in those terms. These investigations can concern existing implementations, hypothetical alternatives or intended designs. The goal is for these accounts to help humans and agents understand the software, explore design choices, direct implementation and evaluate the results, without requiring them to read source code.

Accounts preserve provenance, epistemological status and limitations, distinguishing derived facts, recorded assertions, observations and interpretations.

PostCode's Projections and Views are read-only: they do not directly modify the program or silently rewrite their underlying material. Humans continue to direct program changes by instructing implementation agents; PostCode-provided context can allow the terminology of the software investigation to also be used to direct changes.

See the [research product design](foundation/product-design.md) for conceptual commitments, the [application specification](docs/app-specification.md) for intended application behavior and high-level design, and the [capability reference](docs/capability-reference.md) for the current toolbox.

## Development

PostCode is expected to be implemented primarily by coding agents under human direction and review. The repository uses explicit plans, recorded architectural decisions, and durable task records so that development does not depend on transient agent conversations.

Once PostCode is minimally functional, the human directing the project will use it to understand and supervise further development of PostCode itself. Experience from that use will guide its continued development.

For the current project state, see [`STATUS.md`](STATUS.md). For plans, architecture, decisions, and the backlog, see the [documentation guide](docs/README.md).

Coding agents should begin with [`AGENTS.md`](AGENTS.md). The detailed development process is described in [`dev/workflow.md`](dev/workflow.md).

<a id="documentation-map"></a>
## Documentation map

- [`dev/`](dev/workflow.md): human-maintained development workflow and engineering guidance.
- [`docs/`](docs/README.md): application specification, governing architecture, approved plans and decisions, capability references, implemented architecture, and backlog.
- [`drafts/`](drafts/README.md): proposed canonical documents and revisions being prepared for approval and promotion.
- [`foundation/`](foundation/README.md): adopted research concepts and task-record requirements.
- [`notes/`](notes/README.md): non-governing exploration, supporting research, and retained design results.
- `records/`: durable [task records](records/tasks/), [independent implementation reviews](records/reviews/README.md), and [audits](records/audits/README.md) with their supporting evidence.
- [`steering/`](steering/README.md): human-maintained material for considering future directions, selecting work, and revisiting priorities.

## Running and developing

Use Node.js 22.13 or later:

```sh
npm ci
npm run build
npm run postcode -- --help
npm run check
npm test
```

The retained CLI provides authentication and help only. Use
`npm run postcode -- auth chatgpt sign-in` for human sign-in; see the
[authentication reference](docs/cli-reference.md) and
[hosted setup and transmission disclosure](docs/hosted-investigation.md).
Investigation, shell, presentation, usage and feedback commands have retired.
There is currently no human investigation interface.

Internal Node clients use [the application entry](docs/architecture/README.md#application-entry)
for mechanical analysis, qualified investigations, exact retained answers and
work/usage reporting. For example, after building:

```js
import { openApplication } from './_build/src/lib/application/index.js';
const opened = await openApplication({ configPath: '/absolute/path/to/tsconfig.json' });
if (opened.status === 'opened') {
  try {
    const result = await opened.session.execute({
      kind: 'lens', lens: 'modules', designation: { kind: 'configured-project' },
    });
    // Consume the complete qualified answer or resolution result.
  } finally {
    await opened.session.close();
  }
}
```

This internal entry is not a stable public package API or browser transport.
One Session retains one configured TypeScript project under an unchanged-input
precondition. Detection of relevant changes invalidates it and requires reopening.
Execution is cooperative in the calling process; synchronous compiler work cannot
be preempted. Callers await shutdown and separately observe cleanup failures.

The [direct structured-account trial runner](scripts/structured-accounts/run-trial.mjs)
retains controlled and hosted validation paths. Its qualified explanation and SVG/text
rendering lives under `scripts/structured-accounts/support/`, consumes supplied
content. Each standalone diagram identifies its alternative and account, states the
standing of multiple alternatives, and carries its own qualifications and coverage
notes. The SVG points to the companion text for the full transition legend.
The [retirement evidence](records/validation/cli-shell-retirement/README.md) explains
controlled comparison and intentional differences. Routine tests need no inference
credentials. Live trials require separately authorized provider use.

## Observability

Request work attribution, provider usage, qualified bases and actual producer
exposure remain available through the application. The CLI observation sink,
disclosure classification and feedback implementation have retired. Retained trials
capture their own artifacts; they do not replace research observation or human
feedback facilities. Historical observations remain historical evidence, with their
recorded limitations. The [research-support backlog](docs/backlog.md#research-observation-and-feedback-after-cli-retirement)
tracks reconciliation with the foundation, including basis attribution and feedback
context. No new research capture or human interface is supplied by this retirement.

Callers supply actual generated-output destinations when opening a project.
Git-ignore rules alone do not exclude outputs from evidence. Captured information
can include source and repository context; direct content is not a human-display
or authorized evidence-export contract.

## License

This project is licensed under the [Apache License 2.0](LICENSE).
