# Request publication checkpoint: disposition

Record type: disposition
Date: 2026-10-11
Task: [2026-10-11-lens-request-model](../../tasks/2026-10-11-lens-request-model.md)
Handoff: [Request publication checkpoint](2026-10-11-request-publication-handoff.md)
Findings: [Round 1](2026-10-11-request-publication-round-1-findings.md)

## Findings and dispositions

### F1 — Accepted; corrected

The plan explicitly requires normalized dependency Lens identities independent of command spellings. `LensId`, definitions, Session dispatch, and investigation selection records now use `dependency-structure`, `dependency-children`, and `dependency-parents`. A separate command spelling map translates the existing CLI commands; direct Session callers may supply either spelling. Observation regression coverage compares the normalized request identity with the delivered dependency Projection identity for all three commands. Internal investigation selection tests use the same normalized vocabulary.

The investigation Projection method advances from `@1` to `@2` because the normalized Lens vocabulary changes retained unsupported-investigram selection payloads and identities. Dependency Projection methods remain unchanged because those records already used the required identities. This correction does not claim to finish the plan's remaining resolution or answer-identity work.

### F2 — Accepted; corrected

Direct requests now return `invalid-designation` resolution results before Evaluation for missing required designations, incompatible project/repository subjects, selectors on population Lenses, or conflicting selector/subject inputs. This includes all four examples in the finding: missing children, repository-subject modules, missing inspect, and missing summarize. No requested-application Projection or View is constructed. Tests cover the declared Lens families and verify no store writes for these refusals.

The parser now supplies a project/repository subject only for organization, whose command grammar actually designates it. It no longer adds an unrelated project subject to every request. Lookup-dependent resolution and the other previously disclosed family migrations remain outside this narrow correction and inside the authorized plan; this finding is not deferred in their place.

### F3 — Accepted; corrected with human direction

The human approved refusing extraneous usage inputs while preserving them. Usage requests with a selector, subject, reference designation, or nonempty parameters now return `invalid-report-inputs` before Evaluation. Their normalized report request retains the rejected values under `suppliedInputs`. Subjectless usage with absent or empty parameters remains successful. Direct-call and worker/publication tests verify preservation, refusal, no fabricated View, and continued Session usability.

### F4 — Accepted; corrected with human direction

The human approved caller-input refusal, required preservation of the supplied Lens name as rejected input, required explicit field/reason/representation limits for values that cannot be preserved, and required unexpected post-validation failures to remain defects. That direction is preserved in the active task's follow-ups.

Own-property lookup prevents inherited names from masquerading as registered Lenses. Unknown names produce `kind: rejected` request context: the exact supplied name is retained under `input.lens`, with no validated Lens identity or question invented. Non-cloneable or non-JSON values are identified by field and reason; the containing field is omitted with an explicit representation limit. Accessors are not executed to produce reports. Safe fields remain available. Rejected-input observations omit the raw invocation explicitly rather than try to serialize the invalid values a second time.

Capture and validation precede asynchronous work. Direct Session calls produce resolution results; the parent refuses untransportable inputs before posting them to the worker and uses the same result builder, authoritative usage ledger, and input checks. Normalization is inside publication's outcome handling. Abnormal final usage uses captured presentation choices instead of rereading rejected input. Unexpected execution errors, including a later `DataCloneError` after successful boundary validation, still produce `defect`/`command-defect`, not caller refusals.

Regression tests cover ordinary unknown names and `toString`/`constructor`/`__proto__`, functions, symbols, bigint, cycles, non-finite numbers, unsupported object values, accessors, and a non-cloneable proxy. They check field omissions, serializable reports and observations, direct and worker publication, preserved supplied names, continued Session usability, and unexpected-error classification.

### F5 — Accepted; corrected by documentation

The CLI reference now defines the two producers as one usage-report family with required `schema`, `session`, and `usage`, and optional request `context`: explicit usage output includes context, while the abnormal final-usage supplement on stderr does not. The enclosing command observation identifies the failed/interrupted request. No producer shape or schema label changes are needed for this documentation correction.

## Corrections and verification

- `4c9c3e0` corrects F1/F2, the F4 lookup guard, and F5 documentation. `npm run check` passed; all 26 focused tests passed; a stable full run passed all 497 tests.
- The first full correction run passed 493/497 tests and reported four Session-invalidated outcomes. The disposition file was created during that run. Repository capture compares visible artifact evidence on input checks, so that concurrent write contaminated the verification conditions. A rerun with no repository edits passed all 497 tests. This is not an explanation of the reviewer's separate intermittent failure.
- `709ea65d9ffe7f21e60306fa2d02ba9c0b74dd5f` completes F3/F4. Final `npm run check` passed and `npm test` passed all 503 tests (about 420 seconds). `git diff --check` passed. The focused rejected-input/command/execution suite passed all 35 tests; the full suite then passed all 502 tests. The final 503-test run includes the subsequently identified final-usage accessor correction and its regression test.
- No paid inference was used. The full runs permitted the existing offline sign-in tests to bind local loopback listeners. No tests or comparison qualifications were weakened.

The reviewer's intermittent CLI JSON failure remains unresolved. A passing rerun cannot establish its cause. The human authorized investigation in task follow-up `aeee963`; the investigation and its remaining uncertainty are recorded below. The reported test passed in the stable full reruns, but the earlier failure has not been dismissed as unrelated or treated as fixed.

Non-defect observations are retained as review evidence. The unverified attribution, execution-constraint, runtime compatibility, remaining family lookup, and wider cancellation/interactive areas remain subject to the existing plan's outstanding implementation and verification obligations. This disposition does not convert them into completed work.

## Intermittent failure investigation

The human authorized investigation after the initial disposition. The investigated implementation was the corrected request model at `709ea65`, with later record-only commits; the failing test and its invocation/collection path were also checked against the reviewed code. The returned findings do not preserve the failed command's exit status, stderr, or observation batch. A request for the location of the original full log produced no additional evidence during this investigation.

### Established facts

- The named test calls `invokeCli`, which invokes `runCli` in-process and concatenates its stdout callback values. Compiler work runs in a worker and Git runs in child processes, but this test does not collect CLI stdout from a subprocess pipe. Its inventory JSON parser previously ran before any assertion on the command's exit status or stderr.
- A command that fails before publication can therefore return empty stdout and a useful diagnostic, which the test then masks with `JSON.parse('')`. This is a demonstrated mechanism, not an attribution of the historical failure.
- In a disposable Git fixture, unchanged inputs produced exit 0 and parseable JSON. A controlled visible-file addition after the worker's opening reply caused the production CLI to return exit 2, zero stdout bytes, the `Session invalidated` diagnostic, and a `session-invalidated` observation. Parsing that empty stdout reproduced the exact `SyntaxError: Unexpected end of JSON input` text.
- The compiler/repository validity check intentionally refuses changed or unverifiable inputs. That behavior was not relaxed, retried, or suppressed.

### Reproduction attempts and verification

Temporary generated-build tracing classified environment, compiler-input, and repository-capture mismatches for `fixtures/exports/tsconfig.json`. With repository inputs held stable, the full offline suite passed all 503 tests (about 150 seconds). Two additional concurrent lanes ran the named test eight times during that suite; all eight passed. No mismatch was recorded for the fixture. These runs did not reproduce the reviewer's failure or establish a load-related cause.

After tracing was removed by rebuilding, `npm run check` passed and the uninstrumented named test passed again. The controlled invalidation demonstration also passed with the restored production build. `git diff --check` passed. No paid inference was used. Temporary tracing and reproduction material were removed after recording this evidence.

Diagnostic correction `42038cb207eefe6c4993a27511cf1b5627f23159` adds exit-status assertions, with stderr as the assertion message, before parsing the inventory and before checking inspection rendering. It preserves all existing output assertions and introduces no product behavior change. A future command refusal/failure will expose its underlying diagnostic instead of first appearing as a JSON syntax failure.

### Conclusion and limit

The diagnostic masking is established and corrected. The original intermittent command failure remains unconfirmed: neither an input change, a transient acquisition failure, nor another cause can be selected from the preserved evidence. Passing stress runs do not prove the failure is fixed. No product defect or product fix is claimed, and the reviewer-authored findings remain unchanged. A recurrence with the improved diagnostic, or the original command output if available, is needed to attribute that occurrence confidently.

## Review rounds

- Round 1 reviewed `a9c8189f042d5fe6cabf27db414b995a5972d0f6`, scope `e83a7f3..a9c8189`. The findings are preserved unchanged in commit `fde7ccf`.
- Current implementation target: `42038cb207eefe6c4993a27511cf1b5627f23159`, comprising correction commits `4c9c3e0` and `709ea65` plus the test diagnostic correction `42038cb`. These corrections stay under the original handoff. No further independent review has been arranged or claimed.

## Gate conclusion

All five actionable findings have accepted corrections, including the human-directed F3/F4 behavior. The authorized investigation is complete at the evidence level described above; the historical cause remains unconfirmed. Human direction is still required on accepting that residual uncertainty for the intermediate gate or arranging further review/evidence collection. The human has not determined that this intermediate review gate is satisfied. Wider implementation remains paused; the task remains active. The reviewer's recommendation does not substitute for human gate acceptance. Final integrated implementation and review remain required by the approved plan.
