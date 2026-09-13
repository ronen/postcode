# Module inventory: validation handoff

Prepared: 2026-09-13
Implementation commit: `3c66971`
Clean-agent input commit: `7308fac`
Feature branch: `codex/initial-module-inventory`
Status: validation in progress; task active

This records the runnable milestone of the
[active task](../tasks/2026-09-12-initial-module-inventory.md), governed by the
[approved plan](../../docs/plans/initial-module-inventory-plan.md) and its accepted
[module inventory](../../docs/decisions/initial-module-inventory-decisions.md),
[projection architecture](../../docs/decisions/initial-projection-architecture-decisions.md),
and [observation recording](../../docs/decisions/initial-observation-recording-decisions.md)
decisions. It is a validation handoff, not final independent review or acceptance.

## Implemented and verified

`8c3fc00` adds qualified effective exports and compiler-associated documentation.
`7308fac` adds Unicode and experimental JSON CLI presentations, exact module
inspection, explicit source detail, and invocation-scoped local observations.
All five nonblocking early-review findings have recorded
[dispositions](../reviews/2026-09-12-module-inventory-core.md); the early independent
review gate is cleared. No accepted plan, decision, or foundation text was changed.

All 37 automated tests pass on Node 22.13.1 and TypeScript 6.0.3; `npm run check`
passes. Coverage includes semantic fixtures, incomplete and failed outcomes,
independent-process determinism, changed analysis inputs, source separation,
visible omissions, sink rejection/failure, private local batch files, and actual
checkout output exclusions for nested selected configurations. The complete branch
diff passes `git diff main..HEAD --check`.

At the clean-agent input commit, separate Unicode and JSON CLI invocations against PostCode's own `tsconfig.json`
produced the same snapshot:

`snapshot:7826743d0ef21a918e7f21b933ecb8ad9aec9ccb17a611e7aca1119338bb7a04`

Both report 174 modules, including 18 project-associated modules. Discovery and
all 174 export and 174 documentation expansion scopes are fully established within
their declared guarantees. This is not a claim of whole-program correctness or
documentation truth. The conceptual JSON contains no source-evidence fields.
The Unicode artifact is 279,159 bytes; output volume remains a usability question
for the human and clean-agent exercises.

## Retained local evidence

Exact real-project artifacts are retained, Git-ignored, under
`_observations/validation/2026-09-13/` in the implementing checkout. They are
excluded from analysis inputs. No real-project observations are committed; the
summary here is self-contained and the local artifacts are supplementary evidence.

| Artifact | Bytes | SHA-256 |
| --- | ---: | --- |
| `view.txt` | 279159 | `45f60907029ab6272e220cc9a537b3c8d416e94fa450f5f3e744312be969de46` |
| `view.json` | 2833952 | `085e959d9022687edb407ab76101cef867175073bc0c1a04244f749980a5aa67` |
| `questions.txt` | 1580 | `dea99a0d1365fad1c60577c5636e02d746b2dfb3a33195e04de3260f9915d2b4` |
| `answers-a.json` | 12648 | `c63b36b0511718c272af72ea859c92190f76fa986863ab00f98f31b1a6f8ee8c` |
| `answers-b.json` | 12862 | `fbdf31860668a6e33540a76f9c465da8e3a7760ea9fccc5059179edbeccc536a` |
| `view-after.txt` | 193526 | `e002ed48b260179f87cc7f02270a1da0c7bcdb2afe47e70b4a640921aca5e7af` |
| `view-after.json` | 2353107 | `55e4d7de4431aceb0a1318f244d85d7a6b9db02447d1f516ce28b51696b2cf37` |
| `attempts.json` | 889 | `8128973df3ab0fbbae63c2058d3edd802e018eb894617eb738731eb88bef2acb` |

The generic [structured questions](initial-module-inventory-questions.md) are
committed. Two fresh agents were supplied only the exact Unicode view and these
questions in a neutral temporary directory, without conversation history, source,
repository documentation, or internet access. Both used the session-inherited
model; the tool did not return its exact build. The first attempts returned account
usage-limit errors and no answers; those attempts are recorded locally in
`attempts.json`. The same isolated agents were retried once capacity was available.
Both retries completed. Agent A reported reading all 4,752 lines in eight
untruncated chunks; agent B reported reading all 266,900 characters in nine
untruncated chunks. Both reported using only the supplied artifacts and labeled
their interpretations. No executing-code or independent implementation-review
claim follows from this usability exercise.

## Clean-agent findings and corrections

Both responses inferred a plausible project purpose and several module roles,
identified concrete handles for further investigation, and distinguished exported
facts and recorded assertions from runtime behavior. Both called the view useful
as a cautious inventory but weak as a conceptual starting point. Shared concerns
were anonymous project modules, absent relationship/contract information,
dominating external documentation, repeated qualification/identity text, and
ambiguity between full analysis materialization and display omissions.

`3c66971` addresses the actionable presentation ambiguities:

- Unicode explains materialization versus display limits and how to inspect a
  handle using the same configured project.
- Established empty effective exports are stated directly; unresolved exports
  explicitly do not establish emptiness. A regression checks both cases.
- Export routes use a labeled list instead of arrows that could imply one
  sequential path; a legend distinguishes export relationships from dependencies.
- Compact inventories omit external documentation with counts while retaining
  every module and the export display budget. Exact inspection exposes bounded
  external assertions. A regression verifies omission and retrieval.

The presentation method version advances so changed semantics have a new snapshot
context. Honest anonymity remains required; role synthesis, dependencies, and
broader relationship/contract analysis are outside this slice. Repetition and
excerpt truncation remain usability limitations for human inspection. This is not
an acceptance of those limitations on the human's behalf. The retained clean-agent
responses evaluate the original artifact, not the corrected presentation.

After the correction, separate Unicode and JSON self-analysis invocations agree on
`snapshot:2174f0d1617aa0b0c15bcfbbc195fa3cffe19ccd2873740e6c26416215515903`.
The population remains 174 modules, 18 project-associated, with all 349 evaluation
scopes fully materialized. The conceptual JSON source-field exclusion checks pass.
Unicode now has 3,380 lines and 193,526 bytes, about 31% fewer bytes than the
evaluated input. Human usability inspection is still necessary.

## Remaining gates and work

1. Human Unicode-output inspection: inspect the retained corrected `view-after.txt` for usefulness
   as an investigation starting point, including qualifications, module roles,
   navigation, and distracting output volume. Human acceptance has not occurred.
2. External-repository approval: proposed candidate is
   [sindresorhus/p-queue](https://github.com/sindresorhus/p-queue). No contents have
   been acquired or analyzed. The task explicitly requires human approval before
   either action. After approval, record the exact revision and configured inputs,
   exercise the CLI, and retain evidence locally without committing third-party
   contents or real-project observations.
3. After planned verification is substantially complete, prepare the final
   integrated-review handoff identifying the complete reviewed commit and ask the
   human to arrange independent review. Resolve returned findings or obtain human
   acceptance of residual concerns before closing the task.

External-repository validation, human inspection, and final integrated independent
review are not yet verified. These remain within
the authorized task; no deferral or task closure is claimed.
