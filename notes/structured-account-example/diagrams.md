# Diagram overviews with keyed legends

Exploratory examples, updated 2026-11-12. Each overview uses meaningful short labels and
small display-local reference keys. Open a diagram's page for its legend, full
conditions, qualifications and evidence. The compact image is not the complete qualified explanation.

| Example | Overview and legend | What to look for |
| --- | --- | --- |
| Recovery statechart | [Recovery states](children/recovery-state.md) | Three named states; short guarded edges T1–T3. |
| Trial and concurrent caller | [One trial, one waiting caller](children/concurrent-callers.md) | Short interaction labels I1–I13, with detailed conditions and causal support in the legend. |
| Bulkhead outside breaker | [Capacity held during recovery](composition/bulkhead-outside.md) | One waiting-point summary S1; its legend states each resource occupancy. |
| Breaker outside bulkhead | [A trial queued for capacity](composition/breaker-outside.md) | Trial reservation remains distinct from starting application work. |

The first two use the partitioned variant with separately scoped qualifications. The mixed partition has its
own [state legend](recovery-state.md) and [interaction legend](concurrent-callers.md)
for the same pictures, preserving that variant's exact investigram context.

`displayLabel` and `overviewScope` are authored content in the illustrative payloads.
T/I/B/S/Q keys are mechanically assigned references within one diagram/legend pair.
The [contract](contracts.md#concise-overviews-and-legends) distinguishes the two.

The [generator](render-overviews.py) writes/checks Mermaid input, Markdown legends
and traceability mappings from retained content. It does not infer state changes,
causes, occupancy or subject correspondence. The underlying detailed claims are
unchanged by the current association/context conversion. This is a presentation probe, not a product GUI
or a complete presentation contract.

Verification: all four images were rendered with Mermaid CLI 12.0.0 and visually
inspected. Generated legends and mappings resolve in both partitions; existing
fixture and selector checks pass. The lifecycle conversion preserves the existing state, interaction and compact-label
data; no diagram rerendering is required when the generated Mermaid input is unchanged.
These checks establish readability examples and structural consistency, not semantic
correctness or product acceptance.
