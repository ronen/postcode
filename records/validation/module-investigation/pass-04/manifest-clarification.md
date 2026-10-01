# Manifest metadata clarification

The frozen manifest was copied from pass 03. Three descriptive fields were not
updated and must not be used to identify this pass's authorization or implementation:

- `authorization: a53ea33` describes the earlier reference-transport approval.
  Milestone 4 is authorized by the human follow-up recorded in `e25d727`.
- `implementation: 71949dd...` is the earlier implementation. This pass uses the
  separately recorded `implementationCommit: 9a204a65b46507daa5b2fefb7cde821ec0157835`,
  all frozen code hashes, and the preflight-verified build.
- `referenceBasis` describes pass 03's single summary attempts. The upstream
  reference files, questions, rubric, pins and effective configurations are reused,
  but the new controlled numeric reference/setup and all four operation templates
  are separately frozen. The actual schedule, adaptive selections and bounded
  recovery rules are in `protocol.md` and the per-case records.

This clarification was recorded during the FSM sequence after Cockatiel completed.
It changes no input, instruction, source, guard, runtime code, or scheduled request.
The frozen manifest is preserved unchanged so its original content remains auditable.
