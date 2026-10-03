# GUI design kickoff

Started 2026-10-03. Working notes from the first GUI design session: decisions,
review feedback and the state of the design exploration. Non-governing; see
[notes](../README.md).

## Direction

- The GUI becomes the primary interface. The CLI remains for launching the GUI,
  authentication and debugging. A deliberately designed headless interface may
  come later; the interim CLI is not carried forward as a design constraint.
- Target: a desktop app, probably Electron. The analysis core is Node and
  TypeScript (compiler API, Git, Keychain, hosted adapter) and can run in or
  beside the main process directly. Tauri would need a separately shipped Node
  sidecar, a Rust shell and a second rendering engine.
- Agent integration is designed in both directions:
  [shared context](../../foundation/product-design.md#371-shared-machine-readable-context)
  going out and
  [agent-supplied context](../../foundation/product-design.md#372-agent-supplied-context)
  coming back.
- [Visual and structured qualification](../candidate-capabilities.md#visual-and-structured-qualification)
  is exploratory input, not committed design.

## Design principles from review

- The user trusts PostCode *because* it is always epistemologically honest.
  Qualification is useful information about a claim, not a warning. Avoid
  framing that sets the user up as an auditor of the app.
- Design around interactive examination: focus, expand in place, follow a
  relationship. Not a visual rendering of a series of CLI commands.
- Summary first. Each subject opens with a short account of what it is and its
  shape; users expose the detail they care about instead of receiving a dump.
- No hash codes in the primary interface. Exact identifiers belong in the
  deepest detail layer and in references copied for agents.
- The GUI does no analysis of its own; it only exposes and navigates analyses.
  When a design implies a capability the analyses do not provide, call it out
  explicitly so it can go to the backlog. See [analysis needs](analysis-needs.md).

- Use the analyses' vocabulary in the GUI. Organization groups are "groups",
  not "areas": "area" reads as a functional or architectural claim, which a
  repository-layout group does not establish. Views name the grouping scheme
  (for example "by repository layout"), so later schemes such as user-defined
  or inferred groupings can share the presentation while keeping their own
  qualification.

## Groups in the overview

- Cards that show containment are preferred over a tree with disclosure
  triangles. The current favourite is an expandable treemap. A closed group is
  one tile sized by its total. Opening it shows its subgroups, and it gets a
  size boost so it has room for them. An open group's header carries its own
  module count, with a height proportional to that count. Tile sizes are
  compressed or bounded so small groups stay visible, and the view says so.
- Zooming is done by opening a group as its own subject: a summary-first group
  page with its own treemap. The repository overview is then the root group's
  page.
- Scaling concerns to test with real repositories of different sizes:
  - a pixel minimum for tiles, with the smallest siblings merged into a visible
    "+ N smaller groups" tile
  - folding single-child chains such as `src/lib` into one tile
  - opening levels only while tiles stay readable
  - skipping the treemap entirely for very small projects

## Open question: is "lens" a user-facing notion?

Current proposal: no. The lens / projection / presentation / view vocabulary
is right for the system model, agent context and telemetry, but too much for
the user model. Lenses would surface as:

- the questions offered for a focused subject ("What depends on it?", "What
  is it for?");
- a caption on each view stating the question it answers, with the parameters
  that change its meaning (such as direct versus indirect) editable there.

Presentation becomes an ordinary view control. The user-facing nouns would be
subjects, the questions you can ask of them, views (live or pinned), claims
with what they rest on, and the trail of how you got here.

Interpretations currently have only hash identities; they need human-facing
labels, which are themselves interpretation under
[naming and terminology](../../foundation/product-design.md#25-naming-and-terminology).

## Qualification in layers

At rest, a quiet cue says what kind of claim something is. On focus, one plain
sentence says what it rests on. Opened, a full record shows every field,
including the exact reference. Three earlier directions (kind mark with a
dimension strip, typographic voice, ledger) fed into this. Direction A's kind
icons are adopted as the cues. The ledger became the deepest layer. Serif
type is kept for statements and interpretations, but without quotation marks:
the icon carries the kind.

Where a statement was recorded (README, doc comment, pull request) is basis,
so it belongs on hover or in the opened record rather than at rest. Show the
source at rest only when it distinguishes items in view, such as an agent's
account next to the authors' comments. What a comment is attached to (for
example an export name) is subject rather than source, so it may stay
visible.

## Design canvas

Claude Design canvas "PostCode GUI — UX exploration":
<https://claude.ai/artifact/Fuz2YEruZucBKzPBZvAyXP>

- Six interactive, summary-first journeys:
  1. Get oriented in a repository
  2. Examine a module
  3. Understand what a module does, including corrected accounts
  4. Pick up where I left off
  5. Agent round trip: 5a out, 5b back
- A workspace prototype (product design §3.3, §3.4, §3.6): several views in
  one investigation, linked workspaces as tabs, and a derivation trail. From
  any row you can show it inline, open it beside, open it as a new workspace,
  or compare it then and now. It has two arrangements, columns by derivation
  or tiles. Accepted direction: the workspace is the main surface, and the
  single-subject pages become views within it. Row gestures, confirmed
  after trying them:
  - click: show the item inline
  - double-click: open beside
  - ⌘-click: open as a new workspace
  - right-click: a context menu of every choice
- The journeys are now folded into the workspace prototype as compact views:
  - the repository overview as the root group view
  - module views with summary-first, expandable sections
  - a classify interpretation view (in a tab for the fixture repository)
  - "Since you were last here" as a workspace banner that opens a changes view
  - agent sharing as a header indicator and a "Refer to this in a prompt"
    menu item
  - the agent's report as a view opened beside the module it concerns
  The separate journey boards remain as larger-format references.
- Layout is placement, which the product design already keeps separate from
  derivation. Users can rearrange views without disturbing the investigation
  trail. The current approach is tiling, not a free canvas:
  - new views are placed automatically beside their source
  - views can be dragged to another column, or to a new one
  - columns can be resized
  - a view can collapse to its header strip
  A free canvas could follow if tiling feels confining. The layout would be
  saved with the workspace.
- Workspaces as tabs or OS windows, following browsers:
  - open in a new tab or a new window, with a modifier for the window
  - drag a tab out to make it a window, and drag it back in
  - one app process holds shared state across windows
  - the trail still records which workspace was opened from which, across
    windows
  The agent's "focus" is the focused view in the most recently active window,
  and the share panel should say which window that is.
- "Qualification in layers".
- "Analysis needs exposed by the design": N1–N20, each marked where it appears
  in the journeys.
- The three earlier qualification directions, kept for reference.

## Data used

- Real output from PostCode run on itself (`--json`, at `e9ac1f0`), distilled
  into the git-ignored `_observations/gui-design-fixtures/`. The CLI was run
  from a copy of the checkout so no observation records were added here.
- Journey 4 compares `7f331d5` (main before PR #8) with `e9ac1f0`, using
  separate real runs at each revision.
- Interpretation examples come from
  `records/validation/module-investigation/pass-06`.
- Some prototype figures were computed for the design rather than produced by
  PostCode:
  - the 97 direct-or-indirect users of evidence-access
  - the shortest loop through records
  - journey 4's before/after comparison
- The agent report (5b) and the saved-workspace items (4) are illustrative and
  labelled as such.
