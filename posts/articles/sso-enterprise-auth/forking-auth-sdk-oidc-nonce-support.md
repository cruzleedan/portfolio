---
title: "Forking an Auth SDK: Adding a Missing Parameter to Meet a Backend Security Requirement"
description: "Sometimes the right call is a small, well-documented fork of a vendor SDK rather than bending your backend to fit the SDK's gaps."
date: 2026-07-22
tags: [flutter, sso, oidc, dependency-management, security]
reading_time: "4 min read"
---

# Forking an Auth SDK: Adding a Missing Parameter to Meet a Backend Security Requirement

> **TL;DR:** A vendor's official OIDC SDK covers the common cases well but doesn't expose every parameter the spec allows — sometimes because their own backend doesn't need it. When your backend specifically requires a parameter (like a nonce for replay protection) that the SDK's public API has no way to pass through, a small, upstream-trackable fork is a reasonable engineering trade-off, not a last resort.

## The problem

OpenID Connect's `nonce` parameter exists to bind a specific authorization request to its corresponding token response, preventing a captured token from being replayed in a different session. A backend that enforces nonce validation strictly — checking that the nonce it generated for a given login attempt matches the nonce claim in the returned token — needs to be able to pass a specific nonce value into the authorization request and read it back out of the token. Some official OIDC client SDKs generate the nonce internally and don't expose a way to supply your own or to guarantee it survives every phase of the flow, including token refresh, because their own reference backend doesn't need that level of control.

## The approach

Rather than removing nonce validation from the backend (weakening a real security control to accommodate a library gap) or building a hand-rolled OIDC client from scratch (reimplementing a security-critical protocol), fork the SDK at the specific point where it needs to accept an extra parameter, keep the fork as small and localized as possible, and track it against the upstream project so it can be dropped if a future release adds the capability natively.

```dart
// Illustrative: the shape of a minimal fork's public surface change.
class AuthRequestOptions {
  const AuthRequestOptions({
    required this.authorityUrl,
    required this.clientId,
    this.extraAuthorizationParameters = const {},
  });

  final String authorityUrl;
  final String clientId;
  // The upstream SDK's request builder didn't forward arbitrary extra
  // query parameters to the authorization endpoint. The fork adds this
  // field and threads it through to the underlying request construction.
  final Map<String, String> extraAuthorizationParameters;
}

Future<AuthResult> login(AuthRequestOptions options, String nonce) {
  final params = {...options.extraAuthorizationParameters, 'nonce': nonce};
  return _authClient.authorize(options.authorityUrl, options.clientId, params);
}
```

The change is deliberately narrow — a new optional field and the plumbing to pass it through — rather than a broad rewrite, which keeps the diff against upstream small enough to review, re-apply after an upstream version bump, or eventually contribute back.

## Trade-offs

- Every upstream release now requires re-applying (or re-verifying compatibility of) the fork's diff — this is real, ongoing maintenance cost, not a one-time change.
- A private fork lags behind upstream security patches unless someone actively tracks the vendor's release notes and merges relevant fixes forward.
- The alternative of contributing the change back upstream is worth pursuing in parallel — even if it takes months to land, it eventually removes the need to maintain a fork at all.

## Takeaways

- A small, targeted fork to expose a missing parameter is a legitimate engineering decision when the alternative is weakening a real security control — don't default to "wait for upstream" if that leaves a validation gap live in production.
- Keep forks minimal and clearly documented at the diff level, so future maintainers (including future you) can quickly tell what changed and why.
- Track fork-worthy gaps against the upstream project's issue tracker; today's fork is tomorrow's deleted workaround if the maintainers pick it up.
