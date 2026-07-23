---
title: "Handling Token Expiry Gracefully: Proactive Refresh, Reactive Fallback, Relogin Modal"
description: "A three-phase approach to session expiry that tries to never interrupt the user, and has a clear fallback when it can't avoid it."
date: 2026-07-22
tags: [flutter, sso, enterprise-auth, networking, ux]
reading_time: "5 min read"
---

# Handling Token Expiry Gracefully: Proactive Refresh, Reactive Fallback, Relogin Modal

> **TL;DR:** Token expiry handling works best as three escalating layers, not one: refresh before the token expires so most requests never hit a 401 at all, catch the 401s that slip through with a reactive refresh, and only when both fail, interrupt the user — with a modal that keeps their place in the app rather than bouncing them to a fresh login screen.

## The problem

A session token has a lifetime, and something has to happen when it runs out. Handling that only reactively — wait for a request to fail with `401`, then refresh — means every session boundary costs at least one failed request and a retry, and if the refresh itself fails (revoked session, expired refresh token), the user needs to re-authenticate. Handled badly, that re-authentication step drops the user back to a blank login screen, losing whatever they were doing.

## The approach

**Phase 0 — proactive refresh.** Before sending a request, check how much longer the current token is valid. If it's within a short buffer window of expiring, refresh it first and use the new token for the request that's about to go out. Most sessions never experience a failed request at all under this phase alone.

```dart
class ProactiveTokenInterceptor extends Interceptor {
  static const _refreshBuffer = Duration(seconds: 60);

  @override
  void onRequest(RequestOptions options, RequestInterceptorHandler handler) async {
    final expiresAt = tokenStore.currentExpiry;
    if (expiresAt != null && expiresAt.difference(DateTime.now()) < _refreshBuffer) {
      await tokenStore.refresh();
    }
    options.headers['Authorization'] = 'Bearer ${tokenStore.currentToken}';
    handler.next(options);
  }
}
```

**Phase 1 — reactive refresh.** Some 401s happen anyway — a token revoked server-side, clock drift, a request already in flight when expiry hit. An error interceptor catches these, attempts a refresh, and retries the original request exactly once with the new token.

```dart
class ReactiveRefreshInterceptor extends Interceptor {
  @override
  void onError(DioException err, ErrorInterceptorHandler handler) async {
    if (err.response?.statusCode == 401 && !err.requestOptions.extra.containsKey('retried')) {
      final refreshed = await tokenStore.refresh().catchError((_) => false);
      if (refreshed) {
        final retryOptions = err.requestOptions..extra['retried'] = true;
        return handler.resolve(await dio.fetch(retryOptions));
      }
    }
    handler.next(err);
  }
}
```

**Phase 2 — relogin modal.** If reactive refresh also fails (the refresh token itself is no longer valid), surface a modal overlay asking the user to re-authenticate — biometric if available, credentials otherwise — without navigating away from their current screen. On success, the original request that triggered the modal is retried automatically.

## Trade-offs

- Proactive refresh needs an accurate, synchronized notion of "now" versus token expiry — significant client clock drift can trigger refreshes either too early (wasted calls) or too late (a 401 slips through anyway), so Phase 1 stays necessary even with Phase 0 in place.
- The single-retry guard in Phase 1 (`retried` flag) is important — without it, a persistently failing refresh can loop a request indefinitely.
- A relogin modal has to correctly suspend and resume in-flight state (form data, navigation position) across the interruption, which is more work than a full navigation to a login screen, but the UX payoff is real: the user doesn't lose their place.

## Takeaways

- Layer expiry handling: proactive refresh prevents most failures, reactive refresh catches what proactive misses, and a relogin modal is the last resort — not the first response.
- Guard reactive retries against infinite loops explicitly; a failing refresh should escalate to Phase 2, not retry forever.
- Keep the re-authentication UI as an overlay on the current screen rather than a full navigation — it materially reduces how disruptive a session expiry feels to the user.
