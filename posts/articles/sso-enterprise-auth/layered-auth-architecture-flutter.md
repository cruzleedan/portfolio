---
title: "A Layered Auth Architecture: Domain Entities, Services, Repos, and Providers"
description: "Enterprise auth accumulates special cases fast. A strict layering keeps 'add a new identity provider' from becoming 'touch every screen.'"
date: 2026-07-22
tags: [flutter, sso, architecture, enterprise-auth]
reading_time: "5 min read"
---

# A Layered Auth Architecture: Domain Entities, Services, Repos, and Providers

> **TL;DR:** An auth subsystem that supports multiple identity providers, biometric re-login, token refresh, and multi-factor challenges accumulates special cases fast. Keeping a strict boundary between low-level provider integrations, the repository that orchestrates them, and the state notifiers screens actually watch is what keeps "add support for one more identity provider" an additive change instead of a cross-cutting refactor.

## The problem

Auth logic has a habit of leaking sideways. A screen ends up importing a specific auth library's types directly because it was faster than routing through an abstraction. A biometric re-login check gets duplicated in two places because nobody remembered the first one. A new identity provider added six months in touches a dozen files because the original code never assumed there'd be a second one. None of this is any single developer's fault — it's what happens by default when auth logic doesn't have an enforced shape.

## The approach

Four layers, each with one job, each only depending on the layer below it:

**Domain entities** — plain value types with no dependency on any auth library or platform API: `AuthToken`, `AuthCredentials`, `AuthFailure`. These are what every other layer passes around.

**Services** — one class per concern, wrapping a specific external integration: an OIDC service, a biometric service, a secure-credential-storage service. Each exposes only domain types, never a vendor SDK's own types.

```dart
abstract class BiometricService {
  Future<bool> isSupported();
  Future<AuthResult> authenticate();
}

abstract class OidcAuthService {
  Future<AuthResult> authorizeAndExchangeCode(String authorityUrl);
  Future<AuthResult> refreshToken(String refreshToken);
}
```

**Repository** — the one place that orchestrates services to answer a business question like "is the user currently authenticated, and if not, how should they become authenticated." It decides *which* service to call and in what order; it doesn't know about UI, and it doesn't know about specific vendor SDKs beyond the service interfaces it depends on.

```dart
class AuthRepository {
  AuthRepository(this._oidc, this._biometric, this._storage);
  final OidcAuthService _oidc;
  final BiometricService _biometric;
  final SecureCredentialStorage _storage;

  Future<AuthResult> signIn(String authorityUrl) => _oidc.authorizeAndExchangeCode(authorityUrl);

  Future<AuthResult> signInWithBiometrics() async {
    final ok = await _biometric.authenticate();
    if (!ok) return AuthResult.failure(AuthFailure.biometricDeclined());
    final stored = await _storage.readCredentials();
    return AuthResult.success(stored);
  }
}
```

**Providers (presentation-facing state)** — Riverpod notifiers (or the equivalent in another state-management approach) that hold UI-relevant auth state — is a login in progress, did it fail, is a relogin modal needed — and call into the repository. Screens depend only on these, never reaching past them into the repository or services directly.

## Trade-offs

- Four layers is more ceremony than a small app needs — this shape earns its cost once there's more than one identity provider, or once biometric/MFA/relogin flows exist alongside plain sign-in, not before.
- Strict layering slows down "just add one quick check" changes, because the quick check has to go in the right layer instead of wherever's most convenient — that friction is largely the point, but it needs buy-in or it gets bypassed under deadline pressure.
- Services need to be genuinely swappable (mockable in tests, replaceable when a vendor SDK changes) for the layering to pay for itself — an abstraction that still leaks vendor-specific types through its public methods doesn't actually decouple anything.

## Takeaways

- Keep vendor SDK types out of anything above the service layer — repositories and providers should only ever see domain types.
- Route every auth decision (which method to try, in what order) through the repository, not through screen-level conditionals — that's the one place "how does sign-in actually work" should be answerable from.
- Screens depend on state notifiers, never on the repository or services directly — this is what makes UI testable independently of real auth integrations.
