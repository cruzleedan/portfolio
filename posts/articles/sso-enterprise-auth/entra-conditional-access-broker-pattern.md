---
title: "Supporting Device-Compliance Access Policies in Mobile: The Broker Pattern Explained"
description: "Some enterprise access policies require proof a device is managed and compliant. A browser can't provide that proof — only a native broker app can."
date: 2026-07-22
tags: [flutter, sso, enterprise-auth, mobile, security]
reading_time: "5 min read"
---

# Supporting Device-Compliance Access Policies in Mobile: The Broker Pattern Explained

> **TL;DR:** Some enterprise identity providers let an organization require that sign-in only succeeds from a device the organization has enrolled and considers compliant. Proving that requires a hardware-backed device identity assertion — something a browser-based OAuth flow structurally cannot provide. A native "broker" app installed on the device is what makes it possible.

## The problem

Standard OAuth 2.0 / OIDC login on mobile opens a browser (or an in-app browser tab) to the identity provider, the user authenticates, and a code comes back to the app. That flow proves who the user is. It says nothing about what device they're using, or whether that device meets an organization's security requirements — encrypted storage, a passcode, no jailbreak/root, and so on. An organization that wants to enforce "only compliant, enrolled devices may access this app" needs a way to attach a verifiable device identity claim to the login request, and a browser has no mechanism to produce one.

## The approach

The identity provider's native broker app — typically an authenticator or device-management companion app already used for other enterprise sign-ins — holds a device certificate issued when the device was enrolled in management. When the mobile app needs to authenticate against a tenant with a device-compliance policy, it hands the request to the broker instead of opening a browser. The broker signs the request with the device certificate, proving device identity to the identity provider as part of the token exchange, then returns the result to the calling app.

```dart
Future<AuthResult> authorize(String authorityUrl) async {
  final brokerAvailable = await BrokerDetector.isInstalled();

  if (brokerAvailable) {
    // Broker can assert device identity; required if the tenant enforces
    // device-compliance policy.
    return _brokerClient.acquireToken(authorityUrl);
  }

  // No broker: falls back to an in-app browser tab. This works for
  // tenants without a device-compliance requirement, but a tenant that
  // requires one will reject the sign-in with a specific policy error
  // (commonly surfaced by Azure AD as AADSTS53000, "device required").
  try {
    return await _fallbackBrowserClient.acquireToken(authorityUrl);
  } on PolicyRequiresDeviceException {
    throw SignInBlockedException(
      'This organization requires signing in from an enrolled, managed device. '
      'Install the authenticator/management app and try again.',
    );
  }
}
```

The practical implication for app design: detect broker availability before attempting sign-in, prefer the broker whenever it's present (even for tenants without a compliance requirement, since it also enables device-wide single sign-on), and give the fallback path a clear, specific error message rather than a generic "sign-in failed" when a compliance policy blocks it.

## Trade-offs

- A broker-first strategy means the app is exposed to broker version skew — broker app updates ship on their own schedule, outside the app's control, and can introduce behavior changes.
- Detecting broker availability reliably at runtime requires platform-specific mechanisms (package queries on Android, app-scheme checks on iOS) that themselves need permission declarations in the app manifest.
- There is no in-app workaround for a device-compliance rejection when no broker is installed — the correct UX is a clear, actionable message pointing at what the user needs to install or enroll, not a retry loop.

## Takeaways

- A device-compliance policy needs a device-level signal a browser can't provide — this is precisely the gap a native broker exists to fill, not a library API design change.
- Detect broker presence and prefer it proactively, rather than treating it as a rare fallback path.
- Translate provider-specific policy rejection codes into a message that tells the user what to actually do, not a generic failure.
