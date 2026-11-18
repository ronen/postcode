# First graphical investigation slice

Exploratory context for SLICE, from strategy discussion on 2026-11-18.
These directions are not an approved experience or implementation plan.

## Purpose

Select a coherent first graphical offering: its user scenario, starting knowledge,
useful endpoint, investigations, representations and acceptance criteria. The
[completed journey exploration](initial-journey/README.md) supplies concrete
experience to build on. ACCOUNT's implemented capabilities and limitations will
provide another input; its representative capabilities may be selected, modified,
supplemented or left out.

## An architectural reference

One promising framing is PostCode as an interactive architectural reference for
a particular software project. The human returns to an organized body of
understanding, browses subjects and follows connections. Investigations develop
that reference rather than appearing only as successive responses in a conversation.

The useful hypothesis is continuity and discoverability, not literal book-shaped
visuals. Looking up retained information, requesting new
investigation and reconsidering earlier information have different effects even
if they fit naturally into one reading experience.

## Book-like patterns to explore

[Visual reference from the original discussion](reference-book-inspiration/book-like-postcode.png):
book spreads and an index alongside the ideas they illustrate. These are visual
inspiration for combining explanations, diagrams, annotations and supporting
detail, not a proposed PostCode layout.

### Entries rather than responses

A subject such as **Circuit-breaker recovery** has a recognizable place in the
reference. Its entry might combine a behavioral explanation, state diagram,
relevant guarantees and connections to policy composition. The reader can return
to the subject as understanding develops, without locating the conversation turn
that first introduced it. An entry need not be one investigram, one answer, or a
canonical account. Entity-oriented browsing can coexist with exact question-specific
results and history.

The architectural-book examples in the original discussion suggest prose and
several complementary illustrations arranged around one subject: an overview,
details and annotations can help explain different aspects together.

### Contents, indexes, and cross-references

Offer ways to browse subjects, follow relationships and find related accounts
without knowing precisely what to ask. A contents view could supply an organized
route; an index could offer direct lookup; cross-references could connect related
material across that organization.

For example, someone opens Recovery, follows a connection to Policy composition,
and identifies a question about recovery sampling and bulkhead waiting. This may
lead to a new investigation. The reference's apparent coverage must remain honest:
an unpopulated topic is not evidence that the behavior is absent, and recognizing
a relevant gap may itself require investigation.

### Main text and supporting detail

Keep the primary explanation readable, with evidence, qualifications, alternative
accounts and historical differences accessible through marginal notes, expandable
sections or linked references. Pair explanatory diagrams with more detailed views
where useful, as technical reference books pair an overview with annotated details.
Important uncertainty and consequential disagreement belong in the visible account,
not only in footnotes or optional expansion. Placement need not imply that one
alternative is authoritative.

### “Write me a chapter on this”

The human could select an architectural concern and ask PostCode to investigate
and construct an entry around it. Later investigations might deepen that entry,
address a gap or provide another perspective. This could make requesting new work
feel like developing the reference rather than appending another response.

“Chapter” suggests a coherent treatment, not a promise of exhaustive coverage or
unbounded investigation. The resulting scope and limitations remain clear.
Collecting existing material and producing a new synthesis are different work:
new architectural meaning requires investigation, even when presented as prose
and pictures in an otherwise familiar entry layout.

## Choices for SLICE

- What makes a bounded reference useful to enter and explore? Which subjects,
  accounts and connections give it enough substance without implying completeness?
- How does it begin: with a supplied subject, existing accounts, a small initial
  investigation, or a generated framework? Automatically orienting someone to an
  unfamiliar project is a capability choice, not an assumed opening screen.
- Does the first experience need [ORGANIZE](architectural-reference-organization.md),
  or can existing relationships and straightforward indexes suffice?
- How does someone recognize an unanswered question and request useful follow-up?
  No retained information, unsuccessful investigation and established absence are
  different. Identifying a relevant gap can itself require investigation.
- Can someone move between perspectives, inspect support and alternatives, and
  return to an earlier account without losing their place or mistaking it for current selection?

SLICE selects the offering; ORGANIZE supplies any required reference-organization
capability; PRESENT and MINIGUI design and implement its representations and
interaction. A useful evaluation would ask whether someone can enter, navigate
and develop architectural understanding through the reference, beyond merely
completing a sequence of requests. This does not assume that the reference-book
framing has already demonstrated an advantage over chat.

See [upcoming work](../steering/upcoming-work.md#slice) for current sequencing.
