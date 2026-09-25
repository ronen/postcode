# Drafts

This directory contains canonical-shaped proposals being prepared for approval and promotion.

Except for this directory guide, material here is non-governing. A draft does not become an approved plan, an accepted decision, or another canonical project document because it is committed or because its contents claim an approved status. Agents may use drafts as context for planning and discussion, but must not treat them as binding requirements.

Group each planning package under a descriptive subdirectory. Treat the package root as the counterpart of canonical `docs/`, and mirror relevant directory paths from there; the planning workflow defines filenames for complete documents and revision files. Keep durable exploratory planning notes, alternatives, unresolved questions, and investigation results under human-curated [`notes/`](../notes/). Keep ephemeral, bulky, generated, or checkout-local investigation material in a descriptively named ignored root underscore directory.

Drafts may link to human-curated [`notes/`](../notes/) as planning context. Promoted material must remove or replace those links and carry any context required for its durable role. Never carry a note link into a historical record that cannot later be edited.

The [planning workflow](../dev/planning.md#suggested-planning-sequence) describes a suggested planning-package layout and format for revisions to existing canonical documents.

The human directs promotion and disposal. Move or incorporate approved plans into [`docs/plans/`](../docs/plans/), accepted decisions into [`docs/decisions/`](../docs/decisions/), and other material into its appropriate canonical location. Review promoted content against the destination's requirements; carry all context needed to understand it into canonical documents rather than citing draft artifacts. An abandoned draft may be deleted without receiving a lifecycle status; Git retains its history.

Any commit that adds, modifies, or deletes draft artifacts in this directory must use a subject of the form `draft: <description>` and must not include changes outside this directory. A promotion commit is an exception: it may add or update approved material at its canonical location while deleting the corresponding draft artifacts, and uses an ordinary descriptive subject. A human-directed reclassification commit is also an exception: it may move shelved exploratory material into `notes/` and update directly affected links and guidance without implying approval. This `README.md` is repository guidance rather than a draft artifact, so changes to it follow ordinary commit conventions.
