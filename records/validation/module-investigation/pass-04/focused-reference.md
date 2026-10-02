# Progressive numeric fixture: frozen source-grounded reference

Prepared by the implementing agent before any live run. Exact orchestrator model
identifier unavailable; OpenAI family. Shared authorship and model-family overlap
with assessment roles limit independence. The reference is never supplied to the
investigator or view-only evaluator.

Source: repository fixture [classify.ts](../../../../fixtures/progressive-investigation-assessment/classify.ts),
[README](../../../../fixtures/progressive-investigation-assessment/README.md), and
[configuration](../../../../fixtures/progressive-investigation-assessment/tsconfig.json).
The manifest records the isolated local Git pin and every input hash. TypeScript
6.0.3 analyzes it; no target function is executed by PostCode.

The function creates a fresh array, independently tests three numeric conditions,
and appends literal labels in source order: positive when value > 0, even when
value % 2 === 0, large when value >= 10. It returns the array. The three independent
if statements are neither an else-if partition nor exhaustive validation.
For example, 12 receives positive, even, large; 3 receives positive; -2 receives
even; -3 receives no label. The return path does not reject or throw for an input
that satisfies none of the conditions. These conclusions are source-grounded
static readings, not observed executions. Runtime callers, non-number JavaScript
arguments, author intent and usefulness of the chosen threshold are unestablished.
TypeScript's number annotation alone does not implement runtime validation.

A supported decomposition may split by tested property, by accumulation versus
classification, or another qualified selection. Its parts can overlap: 12 meets
all three predicates. A diagram or list alone cannot establish mutual exclusion
or exhaustive coverage. A qualified account of no further useful subdivision is
also legitimate; assess whether the distinction was conveyed, not whether a
particular exact wording appeared.

The injected setup deliberately claims a mutually exclusive, exhaustive partition
and rejection outside its classes. It is a scripted earlier interpretation, not a
natural investigator error. Its child claims a positive number receives only the
positive label. The frozen recipe carries this text and test-origin qualification.
A live examination can correct the child and/or root after receiving complete
context and source. Reporting a correction does not establish truth; assess its
reason, evidence, target and replacement against these statements. Earlier
records and composition must remain unchanged. Repeated milestone-4 views still
show originals and explicit correction links; automatic replacement selection and
derived revision warnings belong to milestone 5 and are not assessed as failed
milestone-4 behavior.
