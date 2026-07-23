---
title: "Dual-Stack OIDC in Flutter: Routing Between Two Auth Libraries at Runtime"
description: "When one enterprise identity provider needs a native broker and another doesn't, the cleanest fix is a router behind a single interface, not a library swap."
date: 2026-07-22
tags: [flutter, sso, oidc, enterprise-auth, architecture]
reading_time: "6 min read"
---

# Dual-Stack OIDC in Flutter: Routing Between Two Auth Libraries at Runtime

> **TL;DR:** Supporting more than one enterprise identity provider (Azure AD/Entra-style vs. generic OIDC providers like Okta) often means supporting two different auth libraries, because one ecosystem's advanced features — device-compliance checks, native broker apps — aren't available through a generic OIDC client. The fix isn't to pick one library and lose those features; it's a thin routing layer that picks the right implementation behind a single interface the rest of the app never has to think about.

## The problem

Generic OIDC libraries (Authorization Code + PKCE against any standards-compliant provider) work well for most identity providers. But some providers offer a deeper native integration — a device-level broker app that can assert device compliance and satisfy stricter access policies, single sign-on across the OS rather than just the app, and other benefits that a generic OIDC client can't provide because those features live outside the OIDC spec entirely. Committing to only the generic client to keep the codebase simple loses those capabilities for customers who need them; committing to only the vendor-specific client breaks every other identity provider your customers might already be using.

## The approach

Define one interface both implementations satisfy, and pick the implementation at runtime based on which authority URL the app was told to use (fetched from your own backend as part of tenant login configuration, not hardcoded).

```dart
abstract class OidcAuthService {
  Future<AuthResult> authorizeAndExchangeCode(String authorityUrl);
  Future<AuthResult> refreshToken(String refreshToken);
  Future<void> signOut();
}

class RoutingOidcAuthService implements OidcAuthService {
  RoutingOidcAuthService({required this.brokerCapable, required this.genericOidc});
  final OidcAuthService brokerCapable;   // native-broker-capable implementation
  final OidcAuthService genericOidc;     // generic OIDC implementation

  OidcAuthService _pick(String authorityUrl) =>
      IdentityProviderDetector.supportsBroker(authorityUrl) ? brokerCapable : genericOidc;

  @override
  Future<AuthResult> authorizeAndExchangeCode(String authorityUrl) =>
      _pick(authorityUrl).authorizeAndExchangeCode(authorityUrl);

  @override
  Future<AuthResult> refreshToken(String refreshToken) =>
      // refresh needs to remember which implementation issued the token;
      // in practice this is tracked alongside the stored token, not re-detected.
      genericOidc.refreshToken(refreshToken);

  @override
  Future<void> signOut() => Future.wait([brokerCapable.signOut(), genericOidc.signOut()]);
}

class IdentityProviderDetector {
  static const _brokerHostSuffixes = ['login.example-idp.com', 'login.example-idp.net'];

  static bool supportsBroker(String? authorityUrl) {
    final host = Uri.tryParse(authorityUrl ?? '')?.host;
    if (host == null) return false;
    return _brokerHostSuffixes.any(host.endsWith);
  }
}
```

Everything above the router — login screens, session state, token refresh interceptors — depends only on `OidcAuthService`. Adding a third identity provider later means adding a third implementation and a detection rule, not touching call sites.

## Trade-offs

- Detecting the provider by host suffix is simple but brittle against custom domains, on-prem federation gateways, or reverse proxies that don't match the expected hostname pattern — worth having an explicit override in tenant configuration for edge cases rather than relying on detection alone.
- Two libraries means two sets of platform setup (redirect URI registration, native SDK configuration) to keep current, and two dependency upgrade cadences to track instead of one.
- Refresh needs to remember which implementation originally issued a token — detecting the provider fresh at refresh time from the authority URL alone works, but tracking it explicitly alongside the stored token is more robust against authority URL changes between login and refresh.

## Takeaways

- When one identity provider needs native capabilities a generic client can't offer, add a second implementation behind the same interface rather than compromising on either provider's feature set.
- Pick the implementation based on server-provided configuration (tenant authority URL), not a hardcoded per-build flag — the same binary should support any tenant.
- Keep the routing decision in exactly one place so a new identity provider is an additive change, not a refactor.
