# Module investigation assessment tooling

Run from the PostCode checkout using Node 22.13.1, `npm ci` and `npm run build`.
The analyzer is the package-lock-pinned TypeScript 6.0.3. These development tools
are not public CLI commands or a provider service.

`run-shell.mjs spec.json` opens one actual CLI shell. The spec supplies `id`,
`pass`, `subject`, `manifest`, `project`, `output`, `budget` and `commands`.
Use absolute project/output paths; the output directory must not already exist.
Optional `incremental: true` accepts subsequent commands from stdin at prompts;
optional `json: true` selects JSON views. `bounds` is reserved for the labelled
hard-limit control. Ordinary runs use production bounds and fresh sessions.
The fixed pass manifest is under `records/validation/module-investigation/pass-01`.
Source pins, configuration hashes, runtime version and frozen instructions are
checked before credential access. Build before running so emitted code is current.

Clone each public repository at the manifest commit. Install lockfile dependencies
without lifecycle scripts (`npm ci --ignore-scripts` for Cockatiel/fsm-engine;
`pnpm install --frozen-lockfile --ignore-scripts` using pnpm 11.28.3 for
merge-anything). Preserve tracked files. Copy the recorded merge-anything override
beside its original tsconfig, unchanged. The inherited @cycraft/tsconfig 0.1.2
is verified too. Each result belongs to this effective configuration, not an
unmodified-config run. Fixed source references and evaluator questions must be
committed before live inference and never supplied as expected answers.

The runner uses only PostCode's credential manager and parent-process transport;
it requires prior human sign-in and never inspects Codex credentials. Captures
contain sanitized provider exchanges, exact CLI views/commands, observations,
elapsed time and the effective run spec. They can contain public source evidence;
retain license attribution and inspect captures before committing. No raw caught
exception, header or credential is written. `questions.json` and
`assessor-rubric.json` are fixed inputs for separate fresh evaluator/assessor agents,
not API clients. Record their exact prompts/configuration and unavailable usage
separately. `usage-report.mjs` keeps role/route accounting separate; monetary
attribution unavailable through ChatGPT must not be represented as zero.

The request ledger reserves before dispatch and keeps failed/uncertain attempts.
An exclusive lease prevents concurrent runners sharing a ledger. After a crash,
a remaining `.lock` requires manual confirmation that its owner is gone and an
audit of reserved requests before removal; do not automatically clear it. A finite
ceiling stops further POSTs and records an administrative pause, not a semantic or
milestone failure. No automatic repeat or model/billing fallback is implemented.
`diagnose-chatgpt.mjs` is a separate one-request structural diagnostic; record its
question, authorization and result before resuming assessment.

The human clarified that the ten-request ceiling is for implementation/debugging.
`diagnostic-budget.json` retains its two used and eight remaining requests. The
assessment ledger is separate: six scheduled summary/focused cases, one attempt
each, at most the production 32 requests per investigation (192 theoretical
maximum, not a usage target). The hard-limit control should use fewer or none.
Additional diagnostic runs consume the diagnostic allowance; evaluator and
assessor work is separately attributed as required by the plan.

The controlled fixture is copied from `fixtures/module-investigation-assessment`
into an isolated repository. Its manifest hashes fix all six files. To recreate
the recorded local commit exactly, stage those files (mode 100644), write the
tree with `git write-tree`, import the recorded `fixture-git-commit.txt` using
`git hash-object -t commit -w`, and point the isolated repository HEAD at that
commit. The recorded tree must match. This fixture pin is a local assessment
artifact, not an upstream repository revision.

New ledgers use `ceiling` for the numeric containment limit. Historical ledgers
using `authorized` remain readable and unchanged; a ledger specifying both is
rejected. A ceiling does not itself authorize requests. Pass 02 is the separately
authorized documentation reassessment: the three original subjects and focused
entry, plus a one-call opaque control. A direct-documentation diagnostic is
conditional on normal focused-entry acquisition still failing, and must retain
its intervention and separate diagnostic accounting.
