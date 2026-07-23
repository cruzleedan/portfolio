---
title: "GoRouter at Scale: Shell Routes, Route Guards, and Custom Transitions"
description: "Once an app has a bottom-nav shell and an auth wall, GoRouter's redirect and refreshListenable become the backbone of your navigation state machine."
date: 2026-07-22
tags: [flutter, gorouter, navigation, architecture]
reading_time: "6 min read"
---

# GoRouter at Scale: Shell Routes, Route Guards, and Custom Transitions

> **TL;DR:** A small app can get away with a flat list of `GoRoute`s. Once you have a bottom-navigation shell, an auth wall, and feature-specific transitions, the routing config becomes a state machine in its own right — and `redirect` + `refreshListenable` + `ShellRoute` are the three primitives that keep it manageable.

## The problem

Navigation logic that starts as "just go to `/login` if not authenticated" tends to sprawl: multiple entry points need the auth check, the bottom nav needs to preserve per-tab state, and different flows want different page transitions (a modal-style push for quick actions, a fade for splash-to-home). Handling this ad hoc, in each screen's `initState` or `onTap`, produces inconsistent behavior and duplicated logic.

## The approach

**Auth as a redirect, driven by a listenable.** GoRouter re-evaluates `redirect` whenever the object passed to `refreshListenable` notifies — so auth state changes (login, logout, token expiry) automatically re-route without any screen needing to call `context.go()` itself.

```dart
final router = GoRouter(
  refreshListenable: authListenable,
  redirect: (context, state) {
    final isLoggedIn = authListenable.isAuthenticated;
    final isOnLoginFlow = state.matchedLocation.startsWith('/login');
    if (!isLoggedIn && !isOnLoginFlow) return '/login';
    if (isLoggedIn && isOnLoginFlow) return '/home';
    return null;
  },
  routes: [...],
);
```

**Bottom nav as a `ShellRoute`.** The shell owns the persistent scaffold (nav bar, app bar); each tab's routes nest inside it and keep their own navigation stack.

```dart
ShellRoute(
  builder: (context, state, child) => AppShellScaffold(child: child),
  routes: [
    GoRoute(path: '/home', builder: (_, __) => const HomeScreen()),
    GoRoute(path: '/timesheet', builder: (_, __) => const TimesheetScreen()),
  ],
);
```

**Custom transitions per route, not globally.** `pageBuilder` lets a specific route opt into a different transition (fade for a splash screen, slide for a quick-capture modal) without changing the app-wide default.

```dart
GoRoute(
  path: '/quick-capture',
  pageBuilder: (context, state) => CustomTransitionPage(
    child: const QuickCaptureScreen(),
    transitionsBuilder: (_, animation, __, child) =>
        FadeTransition(opacity: animation, child: child),
  ),
);
```

## Trade-offs

- `redirect` logic that isn't careful about return values (`null` vs a path) can create redirect loops — always have a clear "already there, don't redirect" branch.
- `ShellRoute` nesting adds a layer of indirection that makes deep-link testing more important: a link straight into a nested route needs to correctly rebuild the shell state, not just the leaf screen.
- Per-route custom transitions are easy to overuse; too many different transition styles in one app reads as inconsistent rather than polished.

## Takeaways

- Drive auth redirects off a `Listenable`, not manual navigation calls scattered across screens — one source of truth, automatically re-evaluated.
- Use `ShellRoute` for anything with persistent chrome (bottom nav, app bar) so tab state survives navigation within the shell.
- Reserve custom `pageBuilder` transitions for routes where the default genuinely doesn't fit — not as a default habit.
