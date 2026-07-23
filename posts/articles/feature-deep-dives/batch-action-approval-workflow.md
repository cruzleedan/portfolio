---
title: "Designing a Batch-Action Approval Workflow"
description: "Select-all, indeterminate checkboxes, and actions that only apply when every selected item supports them."
date: 2026-07-22
tags: [flutter, ux, feature-design, state-management]
reading_time: "5 min read"
---

# Designing a Batch-Action Approval Workflow

> **TL;DR:** A "select multiple items and approve them together" screen has two problems hiding inside it: the select-all checkbox needs a real indeterminate state, and any action button has to reflect what's actually valid for the *whole* selection, not just the first item someone happened to tap.

## The problem

Approval queues (expense reports, timesheets, whatever needs sign-off) commonly let a manager select several items and act on all of them at once. Two things go wrong if this is implemented naively: the "select all" checkbox is often built as a plain boolean, so it can't represent "3 of 10 selected," and action buttons like "Reassign" or "Email" get shown unconditionally, only to fail or silently no-op when the selection includes an item that doesn't support that action.

## The approach

Keep selection state separate from the list's data-loading state — selection shouldn't reset just because the underlying list refreshed. Compute the select-all checkbox's tri-state value (`true`, `false`, or `null` for indeterminate) from the relationship between the selected-ID set and the currently visible item IDs, rather than storing it as its own flag that can drift out of sync.

```dart
class SelectionState {
  const SelectionState(this.selectedIds);
  final Set<String> selectedIds;

  bool? selectAllValue(List<String> visibleIds) {
    if (selectedIds.isEmpty) return false;
    final visibleSelected = visibleIds.where(selectedIds.contains).length;
    if (visibleSelected == 0) return false;
    if (visibleSelected == visibleIds.length) return true;
    return null; // indeterminate
  }
}

class SelectionNotifier extends Notifier<SelectionState> {
  @override
  SelectionState build() => const SelectionState({});

  void toggle(String id) {
    final ids = {...state.selectedIds};
    ids.contains(id) ? ids.remove(id) : ids.add(id);
    state = SelectionState(ids);
  }

  void selectAll(List<String> visibleIds) => state = SelectionState(visibleIds.toSet());
  void clear() => state = const SelectionState({});
}
```

For action visibility, compute the *intersection* of actions each selected item allows, not the union — an action only belongs on the toolbar if every selected item supports it:

```dart
Set<ApprovalAction> availableActions(List<ApprovalItem> selectedItems) {
  if (selectedItems.isEmpty) return {};
  return selectedItems
      .map((item) => item.allowedActions)
      .reduce((a, b) => a.intersection(b));
}
```

A "Reassign" button only appears when every item currently selected can be reassigned — mixing a reassignable item with one that's locked simply hides the button rather than letting the user tap it and hit a partial failure.

## Trade-offs

- Intersection-based action visibility can feel restrictive to users who expect to act on "most" of their selection — a clear reason ("item X can't be reassigned") in a tooltip or snackbar helps more than a silently missing button.
- Selection sets keyed by ID need to be pruned when items leave the list entirely (approved elsewhere, deleted) or the count can be wrong even though visible rows look right.
- Batch actions that partially fail (3 of 5 succeed) need a result summary, not a single success/failure toast — silently reporting "done" when some items failed erodes trust fast.

## Takeaways

- Model select-all as computed tri-state derived from selection vs. visible items, not a separately tracked boolean.
- Compute available batch actions as an intersection across the selection, not per-item optimism.
- Plan for partial failure in any batch operation from the start — it's not an edge case, it's the normal case at scale.
