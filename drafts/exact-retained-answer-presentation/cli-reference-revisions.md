# Proposed revisions to docs/cli-reference.md

## Replace the paragraph beginning “Current commands cannot explicitly redisplay a particular retained Projection.”

Current commands cannot explicitly present a particular retained Projection with new presentation inputs. They preserve earlier stored results but cannot guarantee that successive pages or formats present the same selected answer. Separate commands and changed Projection IDs in JSON do not provide sufficient human-facing refresh disclosure for paging. This known continuity/disclosure limitation (F6) remains deferred for [exact retained-answer implementation](plans/exact-retained-answer-presentation.md).

Apply this reference update when promoting the planning package. Retain the current limitation until implementation verifies the new behavior.
