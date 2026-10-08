# Proposed revisions to docs/cli-reference.md

Insert this section immediately before “First use”. Existing command instructions, defaults and output descriptions remain unchanged.

## Product model and current CLI scope

A product View may coordinate multiple independently qualified Projections, and a Projection may concern several captured program states. This CLI exposes a limited single-state implementation through its existing commands and family-specific View schemas. It does not accept arbitrary collections of Projections, analyze several revisions together, follow a live branch or working tree, or save a workspace.

The product may suggest a summary View when the human has not expressed a more specific information need; it does not require a summary-first default, and a summary View need not use a summary Lens. The current no-argument command remains `modules`, and `summarize` requests a module interpretation. No automatic general summary selection is implemented.

Each produced Projection retains its selected information and qualification. Repeating a command requests a selection again: changes to retained interpretation or correction/association selections can yield a different answer, including when requesting another page or format. Those supporting selections are distinct from captured program states. Input changes follow the separate [session invalidation contract](#input-stability-and-retained-work), not a live-refresh policy.

Current commands cannot explicitly redisplay a particular retained Projection. They preserve earlier stored results but cannot guarantee that successive pages or formats present the same selected answer. Separate commands and changed Projection IDs in JSON do not provide sufficient human-facing refresh disclosure for paging. This known continuity/disclosure limitation (F6) remains deferred for [separately scoped remediation](backlog.md#allow-a-view-to-be-requested-for-an-existing-projection).
