# Proposed revisions to docs/architecture/README.md

Insert the following complete section immediately before “Responsibilities and flow”. The rest of the implemented architecture remains unchanged.

## Implemented subset of the product model

The [coordinated-Views decision](../decisions/coordinated-views-and-qualified-results.md) allows a Presentation to coordinate several independently qualified Projections and a Projection to concern several captured program states. The current CLI implements a narrower shape: one configured project under the unchanged-input session contract, family-specific construction and a single top-level Projection descriptor per program View. Embedded module bases and associated-inspection selections are specific compositions within that implementation, not a general facility for coordinating arbitrary Projections.

The existing construction/arrangement boundary remains applicable to each input. Core supplies selected qualified content and any qualified population summaries; arrangement describes the supplied populations and applies display choices. A display count or a count of omitted items does not independently establish project-wide coverage. New program claims remain core analysis responsibilities.

The CLI does not follow changing inputs, persist workspaces or offer multi-state analysis. It invalidates on detected relevant changes and requires reopening. Retained results remain immutable; later requests can select new interpretation revision snapshots. There is no public request for redisplaying a specified retained Projection, so current paging commands may reselect. These limits must be distinguished from future binding, refresh and View-lifecycle policies.

The product permits a summary suggestion when no more specific information need has been expressed; it does not require a summary-first default. The current no-argument CLI command lists modules, and `summarize` requests the implemented module interpretation. This is compatible with the optional suggestion, although the CLI does not provide a general summary View selector. Adoption of the conceptual model changes neither command behavior nor the current schema and identity contracts.
