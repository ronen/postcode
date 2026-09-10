# Drafts

This directory holds provisional planning artifacts whose history is worth preserving in Git. It supports review, comparison, and continuity across sessions without giving unfinished material a canonical project role.

Except for this directory guide, material here is non-governing. A draft does not become an approved plan, an accepted decision, or another canonical project document because it is committed or because its contents claim an approved status. Agents may use drafts as context for planning and discussion, but must not treat them as binding requirements.

Use descriptive subdirectories when a planning effort has several related artifacts. Keep ephemeral, bulky, generated, or checkout-local investigation material in a descriptively named ignored root underscore directory instead.

The human directs promotion and disposal. Move or incorporate approved plans into [`docs/plans/`](../docs/plans/), accepted decisions into [`docs/decisions/`](../docs/decisions/), and other material into its appropriate canonical location. Review promoted content against the destination's requirements; carry all context needed to understand it into canonical documents rather than citing draft artifacts. An abandoned draft may be deleted without receiving a lifecycle status; Git retains its history.

Any commit that adds, modifies, or deletes draft artifacts in this directory must use a subject of the form `draft: <description>` and must not include changes outside this directory. A promotion commit is the exception: it may add or update approved material at its canonical location while deleting the corresponding draft artifacts, and uses an ordinary descriptive subject. This `README.md` is repository guidance rather than a draft artifact, so changes to it follow ordinary commit conventions.
