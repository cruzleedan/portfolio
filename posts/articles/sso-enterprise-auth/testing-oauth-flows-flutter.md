---
title: "Testing OAuth Flows in Flutter: Where Mocks End and Real Sandboxes Begin"
description: "You can unit-test almost everything around an OAuth flow. The flow itself needs a real identity provider sandbox, deliberately kept out of the regular test suite."
date: 2026-07-22
tags: [flutter, sso, testing, oauth]
reading_time: "5 min read"
---

# Testing OAuth Flows in Flutter: Where Mocks End and Real Sandboxes Begin

> **TL;DR:** Almost everything around an OAuth/OIDC integration — header parsing, token expiry math, refresh-retry logic, error translation — is a pure function or a small class that's trivially unit-testable with mocks. The actual authorization handshake against a real identity provider is not, and pretending otherwise with an elaborate mock of the provider's behavior tests your mock, not your integration.

## The problem

An OAuth integration has two very different kinds of logic bundled together: deterministic, app-side logic (does this response header indicate NTLM or Bearer auth? has this token expired? should this request retry after a refresh?) and an inherently non-deterministic, network-and-browser-dependent handshake with an external identity provider that a real user has to complete interactively. Teams sometimes try to unit-test the second kind by mocking the identity provider's entire behavior, which produces tests that pass reliably and tell you almost nothing about whether the real integration still works after, say, the provider changes a response format.

## The approach

Split test coverage along that boundary explicitly.

**Unit-testable app-side logic** — anything that takes a plain input and produces a plain output without needing an actual network round trip to a real provider:

```dart
test('classifies a Negotiate challenge header correctly', () {
  final scheme = AuthSchemeParser.parse('Negotiate, NTLM');
  expect(scheme, ServerAuthScheme.negotiate);
});

test('treats a token expiring in 30s as needing refresh', () {
  final expiresAt = DateTime.now().add(const Duration(seconds: 30));
  expect(TokenExpiry.needsRefresh(expiresAt, buffer: const Duration(seconds: 60)), isTrue);
});

test('retries exactly once after a successful reactive refresh', () async {
  final dio = buildDioWithMockAdapter(respondsWith: [401, 200]);
  final response = await dio.get('/protected-resource');
  expect(response.statusCode, 200);
});
```

These tests run in CI on every commit, need no network access, and no real identity provider credentials.

**Integration-level coverage against a real sandbox** — a dedicated test tenant/application registration with the identity provider, used specifically to verify the actual authorization handshake, token exchange, and refresh still work end-to-end. This tier is deliberately smaller, runs less frequently (e.g., nightly or pre-release rather than per-commit), and is gated behind environment variables holding sandbox credentials so it doesn't run — and doesn't need to run — in a contributor's local unit test suite.

```dart
@Tags(['integration', 'requires-sandbox-idp'])
test('full authorization code exchange against sandbox tenant', () async {
  final result = await realOidcClient.authorizeAndExchangeCode(sandboxAuthorityUrl);
  expect(result.idToken, isNotEmpty);
}, skip: !hasSandboxCredentials);
```

## Trade-offs

- Sandbox-tenant integration tests are slower, flakier (dependent on the identity provider's own uptime), and need credential management (rotation, secure storage in CI) that unit tests don't — keep this tier small and focused on the handshake itself, not every business-logic branch.
- Some steps in a real OAuth flow (an interactive consent screen, for instance) resist full automation without browser-automation tooling, which adds its own maintenance burden — many teams accept a manual smoke test for the truly interactive parts and automate everything else.
- Mocking the provider for broader test coverage is still useful for testing your app's *reaction* to provider responses (a specific error code, a malformed token) — the distinction is that these tests should be understood as testing your error-handling code, not as validation that the real integration works.

## Takeaways

- Draw a clear line between app-side logic (unit-test everything here, generously) and the actual provider handshake (a small, separate, sandbox-backed integration tier).
- Don't let an elaborate provider mock give false confidence about a real integration — it validates your code's reaction to invented scenarios, not the actual contract with the provider.
- Gate sandbox-dependent tests behind explicit tags/environment checks so they can't accidentally run — or accidentally get skipped — without someone noticing.
