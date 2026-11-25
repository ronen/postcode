# Authentication CLI reference

The `postcode` package command provides authentication and help only. Build first
with `npm run build`; use `npm run postcode -- <arguments>`.

## Commands

| Arguments | Behavior |
| --- | --- |
| (none), `help`, `--help`, `-h` | Show authentication help without opening a project. |
| `auth chatgpt sign-in [label] [--consent]` | Human browser sign-in; save protected credentials. |
| `auth chatgpt status` | Show registration labels and availability without credentials. |
| `auth chatgpt use <label>` | Select a registration for subsequent configured clients. |
| `auth chatgpt sign-out [label]` | Clear local tokens and attempt remote revocation. |
| `auth chatgpt check` | Explicit cost-bearing connection/model check. |

See [hosted setup](hosted-investigation.md) for exact account, consent, credential,
transmission and billing contracts. Authentication alone never enables project
transmission. Help and retired-command rejection require no project or investigator.
Account labels and diagnostics are escaped for terminal output; credentials and raw
caught errors are not printed. Authentication cancellation retains its existing
signal handling. Exit codes are 0 for success/help, 2 for invalid arguments or expected
authentication failure, 130 for interruption, and 1 for an unexpected entry-point failure.

<a id="product-model-and-current-cli-scope"></a>
## Current scope

Investigation commands (`modules`, `organization`, `inspect`, `dependencies`,
`children`, `parents`, `summarize`, `explain`, `decompose`, `examine`), `shell`,
`present`, `usage` and `feedback` are unsupported. Their flags and `@` aliases are
not compatibility routes, including when combined with `--help`.
There is no replacement human investigation interface.

Internal Node clients use [the application entry](architecture/README.md#application-entry)
and the [capability reference](capability-reference.md). Direct trials retain
validation rendering. The application supplies complete selected qualified content,
precise same-Session references, work/usage reports and exact retained access.
This does not establish a public transport, GUI, persistence or source-disclosure UI.

<a id="inventory-and-inspection"></a>
<a id="organization-and-group-inspection"></a>
<a id="names-handles-and-identity"></a>
<a id="analysis-coverage-and-display-omissions"></a>
<a id="supported-typescript-population-and-qualifications"></a>
<a id="dependency-investigation"></a>
<a id="interpretation-checkpoint-summary-inspection-and-usage"></a>
<a id="progressive-investigation-and-usage"></a>
## Retired investigation reference

These historical link destinations no longer document runnable commands.
[Mechanical and interpretive capabilities](capability-reference.md) remain through
the direct application. [Architecture](architecture/README.md) describes supported
TypeScript populations, evidence, qualification and identity. Historical validation
captures retain their original interface/runtime assumptions and limitations.

<a id="input-stability-and-retained-work"></a>
## Input stability and retained work

Direct execution validates captured inputs before and after requests. Detection
invalidates the Session, starts cleanup and requires reopening. Sequential checks
cannot provide an atomic snapshot or continuous watch, or preempt synchronous work.
See [identity and evidence](architecture/README.md#identity-and-evidence) and
[lifecycle](architecture/README.md#application-entry) for actual ownership and limits.

<a id="source-detail-and-observations"></a>
## Research support gap

CLI Views, human disclosure classification, observation delivery and inadequacy
feedback have retired. Operational attribution and actual investigator exposure
remain independent. Trial artifacts are not replacement research observations.
[Research reconciliation](backlog.md#research-observation-and-feedback-after-cli-retirement)
remains backlogged; foundation commitments have not been withdrawn.
