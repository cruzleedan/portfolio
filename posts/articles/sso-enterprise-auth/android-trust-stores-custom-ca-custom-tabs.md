---
title: "Platform Trust Stores on Android: Why a Custom CA Breaks One Auth Path but Not Another"
description: "Different Android HTTP surfaces read from different certificate trust stores, and enterprise proxy setups expose exactly where they diverge."
date: 2026-07-22
tags: [flutter, sso, android, networking, security]
reading_time: "5 min read"
---

# Platform Trust Stores on Android: Why a Custom CA Breaks One Auth Path but Not Another

> **TL;DR:** On Android, "installed a certificate on the device" doesn't mean "every HTTP client trusts it." A user-installed CA, a system-installed CA, a browser's own bundled root store, and a WebView's trust store are four different things, and enterprise networks that intercept TLS (common with corporate proxies and VPN clients) will work in some in-app auth flows and silently fail in others depending on which one an SDK happens to use.

## The problem

Debugging "login works on my home network but fails on the corporate network" often comes down to a mismatch between where a custom root certificate was installed and which trust store the specific HTTP surface in play actually reads from. A corporate network that performs TLS inspection (common with security proxies and some VPN clients) replaces the real server certificate with one signed by an internal CA, and every client on the device needs to trust that CA to avoid certificate errors — but "every client" isn't one trust store on Android, it's several, each populated differently.

## The approach

Know which trust store each auth-flow component reads from before assuming a CA installation "should" work everywhere:

- A device's **system CA store** is what a WebView typically consults (system store plus, on older Android versions, a user-installed store).
- A **user-installed CA** (added via device settings) is generally trusted by WebView-based flows on older OS versions, but modern Chrome and Chromium-based components increasingly ignore user-installed CAs for security reasons — a certificate that shows as "installed" in device settings may still not be trusted by a browser-based OIDC login.
- A **broker or native auth app** talking to the network directly (rather than through a browser) typically consults only the OS-level system trust store, not the user store, and not any browser-specific store.
- A **modern browser's own bundled root store** (increasingly common as browsers move away from relying solely on the OS store) is separate again, and a corporate CA has to be distributed and trusted through the browser's own mechanism to be picked up there.

```dart
enum AuthUserAgent { systemWebView, externalBrowserTab, nativeBroker }

class TrustStoreExpectation {
  static String explain(AuthUserAgent agent) => switch (agent) {
        AuthUserAgent.systemWebView =>
          'Reads system CA store (and, on older OS versions, user-installed CAs).',
        AuthUserAgent.externalBrowserTab =>
          "Reads the browser's own bundled root store on modern versions — "
              'a device-installed CA may not be trusted here.',
        AuthUserAgent.nativeBroker =>
          'Reads system CA store only; ignores user-installed CAs entirely.',
      };
}
```

The practical fix on a network with TLS inspection is to get the intercepting CA installed as a **system-level** trust anchor wherever possible (which typically requires device management/enrollment rather than a manual settings-screen install, since a plain user-level install lands in the store least consistently honored), and to pick the auth user-agent per build/environment deliberately — falling back to a WebView-based flow specifically in environments where the intercepting CA is trusted there but not in the browser tab path.

## Trade-offs

- Relying on a WebView fallback for TLS-inspected networks trades away the security and UX benefits of an external browser/native broker flow (isolation from the app's process, shared browser session state) for environments where that's the only path with a trusted CA — a deliberate, documented compromise, not a permanent architecture.
- System-level CA installation generally requires a managed/enrolled device (via an MDM profile), which isn't something an app can do to itself — this has to be coordinated with IT policy, not solved purely in application code.
- Trust store behavior differs across OS versions and browser versions, so a configuration that works today can regress silently after an OS or browser update — worth periodic re-verification, not a one-time fix.

## Takeaways

- Treat "certificate is installed on the device" and "this specific HTTP surface trusts it" as two different claims — verify per auth user-agent, not device-wide.
- Native brokers and modern browser tabs increasingly ignore user-installed CAs; only a WebView or a system-level (managed-device) CA install can be relied on broadly.
- Document which auth path is used in which environment and why — this is exactly the kind of decision that looks like an inconsistency to a future engineer unless the trust-store reasoning is written down.
