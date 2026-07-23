---
title: "Building a Debounced, Favorites-Aware Lookup Field"
description: "A reusable typeahead component that stays fast against a large dataset and doubles as a picker across multiple features."
date: 2026-07-22
tags: [flutter, ux, performance, feature-design]
reading_time: "5 min read"
---

# Building a Debounced, Favorites-Aware Lookup Field

> **TL;DR:** A lookup/picker field used in more than one place in an app (projects, customers, cost codes — anything with a large, searchable list) is worth building once as a configurable component, with debounced search, pagination, and a favorites/suggested tier, rather than rebuilding a similar search screen per feature.

## The problem

Any field that lets a user search a large hierarchical or flat dataset — thousands of projects, say — has the same handful of requirements regardless of which feature it's embedded in: search-as-you-type without hammering the backend on every keystroke, paged results so the initial load stays fast, and a way to surface the items a user picks most often (favorites, recents, or "assigned to me") above the general search results. Building this per feature means the debounce delay, pagination logic, and favorites handling all drift independently and get fixed in one place but not the others.

## The approach

Extract the lookup as a component that takes its data access and its favorites logic as injected configuration, rather than hardcoding a single API call. The component owns debouncing, paging, and the tabbed view between "Favorites," "Suggested," and "Search results"; the caller supplies how to fetch and how to toggle a favorite for its specific domain object.

```dart
class LookupConfig<T> {
  const LookupConfig({
    required this.search,
    required this.toggleFavorite,
    this.debounce = const Duration(milliseconds: 400),
    this.pageSize = 25,
  });

  final Future<List<T>> Function(String query, int page, int pageSize) search;
  final Future<bool> Function(T item) toggleFavorite;
  final Duration debounce;
  final int pageSize;
}

class LookupController<T> extends Notifier<AsyncValue<List<T>>> {
  Timer? _debounceTimer;

  void onQueryChanged(String query, LookupConfig<T> config) {
    _debounceTimer?.cancel();
    _debounceTimer = Timer(config.debounce, () => _search(query, config));
  }

  Future<void> _search(String query, LookupConfig<T> config) async {
    state = const AsyncValue.loading();
    state = await AsyncValue.guard(() => config.search(query, 0, config.pageSize));
  }
}
```

A feature wires up its own fetch and favorite-toggle logic without touching the lookup's internals:

```dart
final projectLookupConfig = LookupConfig<Project>(
  search: (query, page, pageSize) => projectApi.search(query, page, pageSize),
  toggleFavorite: (project) => favoritesRepo.toggle(project.id),
);
```

## Trade-offs

- A single reusable component tends to accumulate configuration options as more features adopt it; worth periodically checking whether some callers only use a fraction of the surface and would be simpler with a smaller, split-out component.
- Debounce timers need explicit disposal (canceling the `Timer` on notifier disposal) or a search fires after the user has already navigated away.
- Favorites toggling optimistically in the UI, before the backend confirms, makes the interaction feel instant but needs a rollback path if the toggle call fails — otherwise the UI and server state quietly diverge.

## Takeaways

- If more than one feature needs "search a big list with paging," build it once as a configurable component rather than N similar screens.
- Debounce at the controller level, not the widget's `onChanged`, so the timer's lifecycle is tied to something disposable and testable.
- Favorites/suggested tiers are a UX win that's cheap to add once search and paging already exist — don't bolt them on as an afterthought that bypasses the same data path.
