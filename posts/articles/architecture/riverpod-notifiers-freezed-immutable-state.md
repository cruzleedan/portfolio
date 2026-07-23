---
title: "Immutable State the Right Way: Riverpod Notifiers + Freezed"
description: "Pairing Riverpod's Notifier with Freezed state classes removes an entire category of state bugs."
date: 2026-07-22
tags: [flutter, riverpod, freezed, state-management]
reading_time: "6 min read"
---

# Immutable State the Right Way: Riverpod Notifiers + Freezed

> **TL;DR:** `Notifier<State>` gives you a single place mutations happen. `Freezed` makes that state immutable, comparable, and impossible to mutate by accident. Together they remove the "why did this widget rebuild" and "who changed this field" debugging sessions.

## The problem

Plain `ChangeNotifier` or hand-rolled state objects in Flutter tend to accumulate mutable fields, missing equality overrides, and rebuild triggers that are hard to reason about. A widget listening to a big mutable object rebuilds on every field change, even ones it doesn't care about. Bugs where state was mutated from two places at once are common and hard to trace because there's no single authoritative mutation path.

## The approach

Model state as a `Freezed` class — immutable, with generated `copyWith`, `==`, and `toString`. Put all mutation logic inside a `Notifier` subclass that only ever produces a new state via `copyWith`, never mutates in place. Widgets subscribe narrowly with `ref.select` instead of watching the whole state object, so they only rebuild when the specific field they care about changes. Side effects (navigation, snackbars, analytics) go in `ref.listen`, which Riverpod guarantees runs after the widget tree has already rebuilt from `ref.watch` — so you don't trigger effects mid-build.

## Implementation

```dart
@freezed
class ReportState with _$ReportState {
  const factory ReportState({
    @Default([]) List<LineItem> lines,
    @Default(false) bool isSubmitting,
    String? errorMessage,
  }) = _ReportState;
}

class ReportNotifier extends Notifier<ReportState> {
  @override
  ReportState build() => const ReportState();

  void addLine(LineItem line) {
    state = state.copyWith(lines: [...state.lines, line]);
  }

  Future<void> submit() async {
    state = state.copyWith(isSubmitting: true, errorMessage: null);
    try {
      await ref.read(reportRepositoryProvider).submit(state.lines);
    } catch (e) {
      state = state.copyWith(errorMessage: e.toString());
    } finally {
      state = state.copyWith(isSubmitting: false);
    }
  }
}

final reportProvider = NotifierProvider<ReportNotifier, ReportState>(ReportNotifier.new);
```

A widget that only cares about the submit spinner:

```dart
final isSubmitting = ref.watch(reportProvider.select((s) => s.isSubmitting));
```

It won't rebuild when a line item is added — only when `isSubmitting` itself changes.

## Trade-offs

- `build_runner` becomes part of the inner dev loop; forgetting to regenerate after editing a `Freezed` class produces confusing stale-code errors.
- Deeply nested state (list of objects containing lists) makes `copyWith` calls verbose; consider splitting into smaller, composed notifiers instead of one god-state.
- `ref.select` is easy to skip when in a hurry, which quietly reintroduces the over-rebuilding problem it's meant to solve.

## Takeaways

- Make illegal states unrepresentable with Freezed unions where state has distinct modes (loading/error/data) instead of a bag of nullable flags.
- Narrow subscriptions with `ref.select` before reaching for `Consumer` splitting or `const` widgets as a rebuild-performance fix.
- Keep side effects in `ref.listen`, not inside the notifier's mutation methods — it keeps the notifier testable without a widget tree.
