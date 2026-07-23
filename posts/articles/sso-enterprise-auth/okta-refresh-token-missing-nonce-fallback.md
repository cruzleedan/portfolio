---
title: "Refresh Tokens and Missing Nonce Claims: A Silent Re-Authorize Fallback"
description: "Not every OIDC provider preserves a nonce claim across a token refresh — and the spec doesn't require them to."
date: 2026-07-22
tags: [flutter, sso, oidc, security]
reading_time: "4 min read"
---

# Refresh Tokens and Missing Nonce Claims: A Silent Re-Authorize Fallback

> **TL;DR:** If your backend validates a nonce claim on every ID token — including ones obtained via refresh, not just the initial login — you'll eventually hit an identity provider that doesn't include a nonce in the refreshed token at all. That's spec-compliant behavior, not a bug, and the fix is a fallback path: a silent, non-interactive re-authorization that mints a fresh nonce when a plain refresh can't provide one.

## The problem

The OIDC Core specification requires a nonce claim on the ID token returned from the *initial* authorization request when one was requested, as a replay-protection mechanism. It does not require identity providers to preserve or reissue that claim on tokens obtained afterward via the refresh-token grant — some providers do, some don't. A backend that strictly validates the nonce claim on every token it receives, refresh included, will work fine against providers that preserve it and fail unpredictably against providers that don't, and the failure looks like a backend bug rather than a spec-compliant gap between providers.

## The approach

Treat "refresh returned a token without the expected nonce claim" as an expected, handleable case rather than an error to propagate. When it happens, fall back to a silent authorization request — using `prompt=none` so it doesn't show any UI to a user who already has an active session with the identity provider — specifically to obtain a fresh token that does carry a nonce, rather than surfacing the missing claim as a hard failure.

```dart
Future<AuthResult> refreshWithNonceGuarantee(String refreshToken, String authorityUrl) async {
  final refreshed = await _client.refresh(refreshToken);

  if (_hasNonceClaim(refreshed.idToken)) {
    return refreshed;
  }

  // Refresh succeeded, but the returned token has no nonce claim to
  // validate. Some providers simply don't reissue one on refresh.
  // Silent re-authorize (no UI, relies on the provider's existing
  // session) to obtain a token that does carry a fresh nonce.
  try {
    return await _client.authorizeSilently(authorityUrl, prompt: 'none');
  } on SilentAuthUnavailableException {
    // No active provider session to authorize against silently —
    // this is the point where an interactive login is genuinely required.
    throw ReauthenticationRequiredException();
  }
}

bool _hasNonceClaim(String idToken) => _decodeClaims(idToken).containsKey('nonce');
```

The fallback is invisible to the user in the common case — it's just an extra network round trip during what already looked like a normal token refresh — and only escalates to an interactive login when the silent path itself has nothing to work with (no active provider-side session).

## Trade-offs

- `prompt=none` depends on the identity provider still recognizing an active browser/session-level login; on some platforms or after some time, that session may have already lapsed even though the refresh token itself was still valid, in which case the fallback correctly escalates to interactive login rather than looping.
- This adds a second network round trip specifically on the code path where a provider omits the nonce — worth confirming which of your supported providers actually need it, rather than always paying the extra latency defensively for providers that already preserve the claim correctly.
- Decoding and checking a token's claims client-side (to make this decision) means the app needs to be able to parse the ID token's JWT payload, which is a reasonable thing to do for this kind of check but shouldn't be confused with actually *validating* the token — that's still the backend's job.

## Takeaways

- A missing nonce claim on a refreshed token is normal, spec-compliant behavior for some providers — design for it rather than treating it as an integration bug.
- A silent, non-interactive re-authorization is the right escalation before an interactive login, since it usually resolves the gap without the user noticing anything happened.
- Only fall back to interactive login when the silent path itself fails — that's the genuine signal that the session is gone, not just the nonce.
