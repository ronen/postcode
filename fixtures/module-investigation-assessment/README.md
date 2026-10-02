# Small utility entry

The entry offers a pure, stateless numeric utility API. All its exports return
the same result whenever called with the same arguments. It exposes `normalize`
and `nextSequence` for callers.

The separate `invokeOperation` helper executes caller-supplied work. Implementations
of those callbacks are provided by applications outside this repository. This
repository contains no examples of their business purpose.
