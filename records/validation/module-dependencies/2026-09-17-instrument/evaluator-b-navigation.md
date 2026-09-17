The fresh-navigation distinction is clear: navigation reevaluates current inputs, scoped selectors reject snapshot mismatches, and source detail uses evidence captured during the new invocation. This resolves my earlier concern about implying historical replay.

The numbered rows map unambiguously within the source-detail view: Requests 1–6 and Coverage 1–6 each have corresponding locations and snippets. For example, Request 4 identifies the outside-population resolution and target file; Coverage 5 identifies `require()`. Keeping this detail behind explicit source escape works.

The snippets locate coverage outcomes but do not independently explain every classification: Coverage 2–4 show the call without surrounding binding declarations. That is a bounded-evidence limitation, not a numbering ambiguity. Numbers remain view-local and should not be matched across fresh evaluations.
