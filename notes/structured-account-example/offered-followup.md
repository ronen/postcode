# One retained offer and its follow-up

Exploratory account-content example, 2026-11-11. The Follow-up investigation Lens is
stipulated for this probe; it is not a product API or a design of global discovery,
ranking or menus. The initial admission investigation remains a fixture precondition.
The existing behavioral result and diagrams are unchanged.

## Return and invoke the offer

Both the [mixed](first-result.json) and [children](children/first-result.json) results
now place an `investigation-offer/0` content item in ADMISSION-1:

| Field | Value / meaning |
| --- | --- |
| Local key | `concurrent-callers-offer` |
| Label | Concurrent callers and trial outcomes |
| Purpose | Concurrent callers and trial outcomes in the stated default single-trial scope. |
| Architectural target | Half-open S, initially referenced by its submission-local introduction key. |
| Method | A stipulated supported qualified-architectural-interpretation method. |
| Additional parameters | None in this example. |
| Qualification | A question under the account's scope; it does not assert a concurrency outcome or certify the account's admission coverage. |
| Support | Existing admission and default-sampling evidence available to the initial investigation. |

The offer is ordinary qualified account content. It does not allocate another subject,
assert that waiting has already been discovered, or modify the existing subject
associations. The children partition keeps this behavioral offer on ADMISSION-1,
not the identifying child. Its basis and account qualifications apply as usual.

After acceptance, the illustrative request is:

```json
{
  "operation": "follow-up-investigation",
  "subject": {"account": "ADMISSION-1"},
  "parameters": {
    "offerKey": "concurrent-callers-offer",
    "values": {}
  }
}
```

Resolve that item in that exact account; its submitted Half-open reference has been
bound to retained S. The request does not carry a human-authored question or override
the offer's architectural targets. Its existing `informationNeed` field is explicitly
documentary wording; changing that wording cannot select a different question.
The offer's purpose and scope, the supported method, declared values, basis and actual
context determine the investigation meaning. This is one bounded proposed shape,
not a general offer/parameter schema.

The [mixed ledger](context-and-bindings.json) and [children ledger](children/context-and-bindings.json)
record the resolution and provenance: ADMISSION-1 is the invocation subject; S is
the architectural focus. All follow-up outputs retain the exact request/offer origin
and actual supplied context, including the correction replacement. Their architectural
associations remain about P, S and the new scenario roles. The original account gains
no new child. The existing navigation origin from ANSWER-1 is retained independently:
knowing which account supplied an offer does not prove the user viewed that account.

## Delivery and later replacement

The [mixed access probe](offer-access.json) and [children access probe](children/offer-access.json)
make four distinctions:

- **Offer excerpt before correction:** deliver the exact offer with basis, account
  qualifications, item qualifications and support. This cites ADMISSION-1 but does
  not deliver its complete own content or establish correction-target eligibility.
- **The actual follow-up:** separately supplies complete ADMISSION-1 own content,
  including the offer; the children variant also supplies DEFINITIONS-1. This preserves
  the earlier eligibility and exposure conditions without introducing another source
  account merely to host the offer.
- **Fresh access to the original offer after K:** preserve its exact address and
  qualified content. Supply K's reason, support and qualifications with replacement
  references. The partial sample cites ADMISSION-1 and reporter TRIAL-1; it explicitly
  omits full target/replacement content and claims no complete-context exemption.
  Further context remains requestable before investigation. A correction of the
  containing account is not a separate finding that this particular offer is unsuitable.
- **Explicit selection of the replacement offer:** ADMISSION-2 repeats the offer with
  the same local key and wording, now referencing retained S. This is content of a
  different account. Matching keys do not silently redirect an older request or
  assert a retained correspondence between offers.

Exact ANSWER-1 preserves its original account and offer under its captured revision
context. That is distinct from correction-aware investigator delivery of historical
content. Whole-account replacement includes the old offer within its target; a key
is not an independently correctable retained unit, and the original content is not
patched or reparented.

## What this checks

The existing checker validates offer form, support, qualifications, subject reference
resolution and the stipulated method. It resolves both follow-up invocations and
checks excerpt preservation, provenance, complete-target distinctions and exact versus
replacement access. Ten additional malformed offer submissions/requests are rejected,
including label-as-key selection, a non-offer content key, missing original despite a
same-key successor, unsupported method, undeclared parameters and architectural focus
mistaken for the invocation subject.

This makes one prose-like request concrete through retained content. It does not
settle the global Overview/Explain entry routes, turn every other illustrative request
into an offer, or demonstrate a live investigator accepting the proposed protocol.
