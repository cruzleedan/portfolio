---
title: "Compile-Time Environment Config: One Codebase, Dev/Prod Without Duplication"
description: "How --dart-define and a single Environment singleton avoid maintaining separate dev and prod entrypoints."
date: 2026-07-22
tags: [flutter, deployment, build-config, best-practices]
reading_time: "5 min read"
---

# Compile-Time Environment Config: One Codebase, Dev/Prod Without Duplication

> **TL;DR:** Instead of maintaining `main_dev.dart` and `main_prod.dart`, pass environment as a compile-time constant via `--dart-define` and gate behavior through a single `Environment` singleton. One entrypoint, one build graph, fewer places for dev-only behavior to leak into a release build.

## The problem

Multi-flavor Flutter apps often end up with parallel entrypoints, parallel Firebase configs, and parallel everything — which means every new feature has to remember to wire itself into both. Worse, dev-only conveniences (self-signed cert overrides, verbose logging, mock data) can accidentally ship to production if they're controlled by a runtime flag instead of something checked at build time.

## The approach

Pass the environment name as a compile-time define:

```bash
flutter build apk --dart-define=ENV=prod --obfuscate --split-debug-info=build/debug-info
flutter build apk --dart-define=ENV=dev
```

Read it once into a singleton that the rest of the app queries:

```dart
enum AppEnv { dev, staging, prod }

class Environment {
  Environment._();
  static final instance = Environment._();

  static const _envName = String.fromEnvironment('ENV', defaultValue: 'dev');

  AppEnv get current => switch (_envName) {
        'prod' => AppEnv.prod,
        'staging' => AppEnv.staging,
        _ => AppEnv.dev,
      };

  bool get isDevelopment => current == AppEnv.dev;
}
```

Anything environment-sensitive reads `Environment.instance.isDevelopment` rather than a runtime toggle:

```dart
if (Environment.instance.isDevelopment) {
  dio.httpClientAdapter = IOHttpClientAdapter(
    createHttpClient: () => HttpClient()..badCertificateCallback = (_, __, ___) => true,
  );
}
```

Because `String.fromEnvironment` is resolved at compile time, the Dart compiler can constant-fold `isDevelopment` to `false` in a release build and tree-shake the dev-only branch entirely — it's not just hidden, it's gone from the binary.

## Trade-offs

- `--dart-define` values are baked into the binary and are trivially extractable — never put real secrets there, only environment *names* and non-sensitive config like base URLs.
- Forgetting to pass `--dart-define=ENV=prod` on a release build silently defaults to dev behavior; CI should assert the flag is present rather than trust the default.
- CI matrices need to pass the same flags flutter build and flutter test both use, or tests exercise a different code path than the shipped build.

## Takeaways

- One entrypoint, gated by a compile-time constant, is easier to keep correct than two hand-maintained entrypoints.
- Anything security-sensitive (TLS relaxation, debug menus) should be behind a compile-time check, not a runtime one, so the compiler can prove it's gone.
- Treat the "which environment am I" question as a single source of truth (`Environment.instance`), not a scattered set of `kDebugMode` checks.
