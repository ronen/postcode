# GUI visual language

Working notes on the GUI's visual language. Non-governing; see
[notes](../README.md). Token values live in [tokens.css](tokens.css), and the
visual references are on the design canvas linked from the
[design kickoff](design-kickoff.md) ("Visual language" row).

## Status

- **Decided (2026-10-03):** the IBM Plex family; light and dark designed
  together; calm defaults with a compact density option; direction A's cue
  icons; the app icon (⇒ on a green perforated stamp).
- **Proposed, not yet confirmed:** the colour palette, type scale, spacing and
  the details of the states.

## Character

A calm reading tool first and a developer tool second. Quiet chrome,
generous type at the default density, and one accent. Colour carries meaning,
not decoration: the accent marks interaction, amber marks attention, and the
claim-kind colours appear only in cue icons. A compact density serves people
who want more on screen.

## Typefaces and roles

| Role | Face | Used for |
|------|------|----------|
| Sans | IBM Plex Sans | PostCode's own findings, interface text, labels |
| Serif | Source Serif 4 | Statements recorded by people or documents, and interpretations |
| Mono | IBM Plex Mono | Code, identifiers when shown literally, exact references |

The serif is a voice, not decoration. Text set in serif was said by someone
or produced by an interpreter, and its cue icon says which. PostCode's own
derived findings stay in sans. Quotation marks are not used, because the icon
carries the kind.

Atkinson Hyperlegible with Literata, and Geist with Newsreader, were compared
and not chosen.

## Type scale

| Token | Comfortable | Compact | Use |
|-------|-------------|---------|-----|
| `--size-view-title` | 16 / 600 | 14 / 600 | View titles |
| `--size-body` | 14 | 12.5 | Summary sentences, body |
| `--size-row` | 13.5 | 12.5 | List rows |
| `--size-small` | 12 | 11.5 | Secondary text, captions |
| `--size-provenance` | 11 | 10.5 | "Opened from …" lines |
| `--size-statement` | 15, line 1.55 | 13.5, line 1.45 | Serif statements and interpretations |

Mono is set at 0.86em of the surrounding text.

## Colour roles

| Role | Light | Dark | Notes |
|------|-------|------|-------|
| bg | `#f6f6f3` | `#161719` | Workspace ground |
| surface | `#ffffff` | `#1f2023` | View cards |
| raised | `#fbfbf9` | `#25272a` | Menus, inline embeds |
| text | `#1c1d1f` | `#e9e7e2` | |
| muted | `#5b5c60` | `#a9a8a3` | Secondary text |
| faint | `#6f7075` | `#8b8a86` | Provenance, hints |
| accent | `#2a4e9b` | `#93b2f2` | Links, focus, selection |
| attn | `#8a5a00` | `#e3b04f` | Updated, needs attention |
| derived | `#1e2b47` | `#b9c7e8` | Cue only |
| assertion | `#8a4b0f` | `#e2a868` | Cue only |
| interpretation | `#6b3fa0` | `#c6a6ee` | Cue only |
| observation | `#1f5f59` | `#7fc6b9` | Cue only |

Contrast: every text and cue colour, faint included, reaches at least 4.5:1
on both bg and surface in both themes. Faint sits right at that threshold, so
keep it for non-essential text.

## Cues

A 16px tile (14px compact) before a claim or a section title. Every cue has
an accessible name, and its meaning can be inspected. Shape and colour are
never the only way the kind is conveyed.

| Cue | Mark | Meaning |
|-----|------|---------|
| Derived | Filled tile, small square | Established by PostCode's analysis |
| Recorded | Filled tile, quote mark | Recorded by a person or document (comment, README, PR, agent report) |
| Interpretation | Outlined tile, diamond | Produced by an interpreter (model, agent) |
| Observation | Filled tile, ring and dot | Observed in a run |
| Not done / unknown | Dashed tile, dash | Not run, unavailable, or not established |

## Qualification in layers

- **At rest:** the cue, plus wording that carries the guarantee where it
  matters ("at least 11", "in this project").
- **On focus or hover:** one plain sentence on what the claim rests on.
  Where a statement was recorded goes here.
- **Opened:** the full record, including method, guarantees, limits,
  revision, and the exact reference for agents. Hash identifiers appear only
  at this level.

Show the source of a statement at rest only when it distinguishes items in
view. What a statement is attached to (for example an export name) is subject
rather than source, so it may stay visible.

## View card anatomy

1. **Header:** title (subject name), subtitle (kind and location, or what the
   view answers), then controls: live/pinned chip, collapse, close. The header
   is the drag handle.
2. **Provenance line:** "Opened from …", "Where this workspace starts", or
   "Opened from a view you closed".
3. **Lead (optional):** a recorded statement or summary sentence.
4. **Sections:** a disclosure chevron, the cue, a bold title, and a summary
   clause that stays visible when collapsed. Expanded sections show rows or
   body text.
5. **Rows:** a name, then muted context such as the group or "types only".
   Click shows inline, double-click opens beside, ⌘-click opens as a
   workspace, right-click opens the menu.
6. **Inline embed:** a raised, bordered block under its row, with its own
   remove control.

## States

| State | Treatment |
|-------|-----------|
| Focused view | Accent border plus a soft glow |
| Selected row | Selected fill |
| Pinned | "Pinned · ‹revision›" chip; no colour change |
| Collapsed | Header only; a fully collapsed column narrows |
| Updated | Attention-coloured link: "Updated earlier · see what changed" |
| Needs attention | Attention fill on the affected block |
| Not run / unavailable | Dashed border and the not-done cue, muted text |

Amber is never used for errors in the program; it only says that something
wants the user's attention in PostCode itself.

## Density

Comfortable is the default. Compact (`data-density="compact"`) reduces type,
padding, cue size and column width. Content, cues and states are identical in
both.

## Open items

- Confirm or adjust the palette.
- Decide dark-theme treatment of the treemap fills.
- Decide motion: expand/collapse and view-opening transitions, respecting
  reduced-motion settings.
- Window chrome: Electron gives a native title bar by default.
- Check the green header mark in the dark theme.
- Test the icon at real sizes to set where the engraving and then the
  perforations drop out, and choose the font for the small ⇒.

## App icon

Glyph: the connected fat arrow (⇒) on a perforated stamp. It reads as an
arrow first and as code second (arrow functions, match arms, "implies"). The
stamp says "post". Rejected along the way: a postmark (it looked like a
jellyfish), P (a parking sign), a separated `=>` (a house or a smiley),
⇥, ↦, `}`, `>>` and `//`. The app icon deliberately doesn't reuse the in-app
cue icons, so those can change independently.

Colour, external icon (Dock, taskbar, installer, website): green, engraved
at large sizes. Green reads as postage and stands out among the mostly blue
developer-tool icons. Red was rejected because it means danger, error or
stop. Keep the green deep (forest or bottle), away from the teal of the
observation cue.

| Role | Value |
| --- | --- |
| Stamp (postal green) | `#205C42` |
| Arrow (ivory) | `#FFFCF4` |
| Engraving | `#FFFCF4` at 13% opacity |
| App tile around the stamp | `#ECEBE6` |

Sizes: the mark simplifies step by step as it gets smaller.

1. Large (app tile, about 128px and up): the tile, the perforated stamp, the
   engraving, and the drawn ⇒.
2. Medium (about 32 to 64px): drop the engraving; keep the tile, the
   perforations and the drawn ⇒.
3. Small (header, about 24px): drop the tile; the stamp alone, cropped to it,
   with its perforations.
4. Smallest (16px and below): drop the perforations too; a plain rounded
   rectangle with the ⇒.

At the small steps the arrow can switch from drawn strokes to the ⇒
character (U+21D2) set in a font with well-made small math symbols, so it
benefits from the font's hinting and optical design. Which font: to be
chosen (for example, IBM Plex Math or another font with a good arrow). The
pixel thresholds are starting points, to be settled by testing at real
sizes.

In the app: the window header carries the green stamp mark at about 24px,
next to the product name. Tried against engraved blue in a sample header,
the dark green reads as the product's mark, not as a status, because it sits
in the identity slot beside the name and nowhere near findings. Keep it
there: the mark never appears inside views, beside claims or as a status
indicator, where green would hint at "passed" or "approved". Colour inside
views stays reserved for the claim-kind cues and attention. Still to check:
the dark theme, where the mark may need a lighter green or a light keyline.
