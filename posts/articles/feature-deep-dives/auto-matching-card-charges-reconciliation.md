---
title: "Auto-Matching Corporate Card Charges to Expense Lines"
description: "A confidence-tiered matching engine, and why 'matched' needs more than two states."
date: 2026-07-22
tags: [flutter, fintech, feature-design, ux]
reading_time: "5 min read"
---

# Auto-Matching Corporate Card Charges to Expense Lines

> **TL;DR:** Reconciling corporate card transactions against expense report lines isn't a binary "matched or not" problem — real-world data (rounding, delayed postings, split charges) means the honest model has at least four states, and the UI needs to make the ambiguous middle ones easy to resolve, not just easy to see.

## The problem

When a company card feed and manually-entered expense lines both exist, someone has to reconcile them: does this $42.17 card charge correspond to the taxi expense the employee already logged? Exact amount-and-date matches are easy. The hard cases are the common ones — a charge posts two days after the receipt date, a tip changes the total slightly, or one card charge should map to two split expense lines. A system that only supports "matched" and "unmatched" forces every ambiguous case into manual review, which defeats the purpose of automating the easy 80%.

## The approach

Model match state as a small set of named tiers instead of a boolean, each with different UI treatment and a different resolution action:

```dart
enum MatchStatus { autoMatched, potentialMatch, unmatched, cleared }

class CardCharge {
  const CardCharge({
    required this.id,
    required this.amount,
    required this.status,
    this.candidateLineIds = const [],
  });

  final String id;
  final double amount;
  final MatchStatus status;
  final List<String> candidateLineIds; // populated only for potentialMatch
}

class ChargeMatcher {
  MatchStatus classify(CardCharge charge, List<ExpenseLine> candidates) {
    final exact = candidates.where((l) => _isExactMatch(charge, l));
    if (exact.length == 1) return MatchStatus.autoMatched;

    final fuzzy = candidates.where((l) => _isFuzzyMatch(charge, l));
    if (fuzzy.isNotEmpty) return MatchStatus.potentialMatch;

    return MatchStatus.unmatched;
  }

  bool _isExactMatch(CardCharge charge, ExpenseLine line) =>
      charge.amount == line.amount && charge.date == line.date;

  bool _isFuzzyMatch(CardCharge charge, ExpenseLine line) {
    final amountClose = (charge.amount - line.amount).abs() < 0.05;
    final dateClose = charge.date.difference(line.date).inDays.abs() <= 3;
    return amountClose && dateClose;
  }
}
```

`potentialMatch` charges carry their candidate line IDs so the UI can present "did you mean this line?" instead of dumping the user into a full search. Confirming a potential match promotes it to `autoMatched` (for that charge going forward, not retroactively for the matching algorithm); explicitly marking a charge as personal or unrelated moves it to `cleared`, a distinct end state from `unmatched` so it stops showing up in the "needs attention" queue without pretending it was ever matched to a real expense.

## Trade-offs

- Fuzzy-match thresholds (amount tolerance, date window) are business decisions, not just code constants — they should be easy to tune per deployment rather than hardcoded, since tolerance for what counts as "close enough" varies by company policy.
- A charge with multiple `potentialMatch` candidates needs a deliberate tie-break UI (show all candidates, let the user pick) rather than silently picking the "best" one — silent auto-resolution of an ambiguous case is where trust in the automation breaks.
- `cleared` needs to be reversible (a mis-click marking a real business expense as personal) or the state becomes a trap; keep an audit trail of who cleared what and when.

## Takeaways

- Four match states (auto-matched, potential, unmatched, cleared) cover real-world reconciliation better than a boolean — resist collapsing them for simplicity.
- Surface *why* something is a potential match (which candidates, and by what criteria) rather than just flagging it as ambiguous.
- Make terminal states like "cleared" reversible with an audit trail — reconciliation UIs get used under time pressure, and mis-clicks happen.
