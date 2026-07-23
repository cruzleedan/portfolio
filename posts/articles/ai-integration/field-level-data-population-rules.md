---
title: "Field-Level Data Population Rules: When Not to Overwrite User Input"
description: "Auto-filling a form from OCR or AI output is only trustworthy if every field-level decision is explicit and centralized."
date: 2026-07-22
tags: [flutter, ai-integration, ux, forms]
reading_time: "5 min read"
---

# Field-Level Data Population Rules: When Not to Overwrite User Input

> **TL;DR:** The moment an AI or OCR feature silently overwrites something a user already typed, or fills in a field they explicitly locked, they stop trusting the automation — even if it was right. The fix is a small, centralized, testable set of per-field rules instead of ad hoc `if` statements scattered through the form.

## The problem

Auto-population features tend to grow their rules organically: "don't overwrite if the user already typed something," then "except for the date field," then "unless the field is locked by a business rule," then "but confirm first if they retake the photo." Written inline in form-handling code, these rules become an unreadable tangle of conditionals, and it becomes impossible to answer "why didn't this field get filled?" without stepping through a debugger.

## The approach

Centralize the decision into a single pure function per field (or a small table-driven policy), so the rule set is enumerable and testable independent of the UI:

```dart
enum PopulationDecision { apply, skip, confirmOverwrite }

class FieldPopulationPolicy {
  PopulationDecision decide({
    required bool fieldIsLocked,
    required bool fieldIsHidden,
    required bool hasExistingValue,
    required bool isAuthoritativeField, // e.g. date: always trust the new source
  }) {
    if (fieldIsLocked || fieldIsHidden) return PopulationDecision.skip;
    if (!hasExistingValue) return PopulationDecision.apply;
    if (isAuthoritativeField) return PopulationDecision.apply;
    return PopulationDecision.confirmOverwrite;
  }
}
```

The orchestrator calls this once per field and branches on the result — apply directly, skip silently, or surface a confirmation dialog before overwriting. Because the policy is a pure function with no UI dependency, every combination of inputs can be covered with a plain unit test:

```dart
test('locked field is never populated even with no existing value', () {
  final decision = FieldPopulationPolicy().decide(
    fieldIsLocked: true,
    fieldIsHidden: false,
    hasExistingValue: false,
    isAuthoritativeField: false,
  );
  expect(decision, PopulationDecision.skip);
});
```

Keep an explicit record of which fields were populated automatically (even just a `Set<String> autoPopulatedFields` on the form state) so an "undo auto-fill" or audit trail is possible later without re-deriving what happened.

## Trade-offs

- The rule table grows combinatorially as more field types and conditions get added — worth revisiting periodically to see if some conditions can collapse.
- "Confirm before overwrite" dialogs, if shown per-field, get noisy fast on a form with many fields; batching into one confirmation for the whole auto-fill pass is usually better UX.
- Policy correctness depends on accurate field-state inputs (locked/hidden flags) — if those flags are wrong, the policy quietly makes the wrong call with no visible failure.

## Takeaways

- Treat "should this field be overwritten" as a business rule with its own tests, not a UI-layer afterthought.
- A pure decision function is easy to reason about and easy to get 100% branch coverage on — a scattered set of inline conditionals is neither.
- Track what was auto-populated; users trust automation more when they can see (and undo) what it touched.
