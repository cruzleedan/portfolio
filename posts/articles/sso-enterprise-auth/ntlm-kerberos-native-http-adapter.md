---
title: "Implementing Windows-Integrated Auth on Mobile: A Native HTTP Adapter, Not a Dart Library"
description: "NTLM/Kerberos authentication is connection-level, not request-level — which rules out most pure-Dart HTTP libraries and points straight at the platform's native stack."
date: 2026-07-22
tags: [flutter, sso, enterprise-auth, networking, mobile]
reading_time: "6 min read"
---

# Implementing Windows-Integrated Auth on Mobile: A Native HTTP Adapter, Not a Dart Library

> **TL;DR:** NTLM and Kerberos authenticate a TCP connection, not an individual HTTP request — the negotiation is a multi-step handshake tied to a specific socket, and any new connection has to redo it. That single fact rules out implementing it in a portable, connection-agnostic Dart HTTP client and points toward each platform's native networking stack, which already knows how to do this correctly.

## The problem

Corporate networks that rely on Windows-integrated authentication (domain-joined servers authenticating via NTLM or Kerberos) expect the HTTP client itself to participate in a challenge-response handshake at the connection level: the server responds `401` with a `WWW-Authenticate: Negotiate` or `NTLM` header, the client computes a response using the current user's or a supplied domain credential, and the exchange continues on the *same* underlying connection. A typical mobile HTTP stack built around stateless request/response semantics has no natural place to hook this in — and reimplementing the NTLM message flow and cryptography in pure Dart, while possible, means maintaining a security-sensitive protocol implementation yourself instead of relying on an OS vendor's.

## The approach

Detect the authentication scheme the server expects by inspecting the `WWW-Authenticate` header on an initial unauthenticated probe request, then route requests needing Windows-integrated auth through a native HTTP client (`URLSession` on iOS, `OkHttp` or the platform's own NTLM-capable client on Android) instead of the Dart-level HTTP stack used for everything else.

```dart
enum ServerAuthScheme { negotiate, ntlm, basic, bearer, unknown }

class AuthSchemeProbe {
  Future<ServerAuthScheme> detect(Uri endpoint) async {
    final response = await _unauthenticatedHead(endpoint);
    final header = response.headers.value('www-authenticate')?.toLowerCase() ?? '';

    if (header.contains('negotiate')) return ServerAuthScheme.negotiate;
    if (header.contains('ntlm')) return ServerAuthScheme.ntlm;
    if (header.contains('basic')) return ServerAuthScheme.basic;
    if (header.contains('bearer')) return ServerAuthScheme.bearer;
    return ServerAuthScheme.unknown;
  }
}

class HttpClientFactory {
  Dio buildFor(ServerAuthScheme scheme) {
    final dio = Dio();
    if (scheme == ServerAuthScheme.negotiate || scheme == ServerAuthScheme.ntlm) {
      // Native adapter: hands connection-level auth off to the platform's
      // own HTTP stack instead of Dio's default Dart-level transport.
      dio.httpClientAdapter = NativeWindowsAuthHttpAdapter(credentials: _storedCredentials);
    }
    return dio;
  }
}
```

Credentials for this path are stored per-host in platform secure storage and handed to the native layer only at request time — never transmitted as plaintext, since the native client computes the challenge-response hash locally rather than sending the password over the wire.

## Trade-offs

- Because the handshake is connection-scoped, connection pooling and reuse strategy matter more than usual — an HTTP client that aggressively recycles connections can force repeated re-authentication handshakes, adding latency that wouldn't show up with a stateless bearer-token API.
- Native adapters mean platform-specific code paths (and platform-specific bugs) instead of one shared Dart implementation — testing has to cover iOS and Android separately, including OS version differences in how each platform's networking stack handles the handshake.
- Storing a domain username/password on-device, even in secure storage, is a materially different trust model than storing a short-lived OAuth token — worth being explicit with users and security review about what's retained and for how long.

## Takeaways

- Probe the server's expected auth scheme before deciding which HTTP client to use for a given host — don't assume every backend speaks the same auth model.
- Connection-level auth protocols belong in native platform HTTP stacks, not reimplemented in a portable language runtime, unless you specifically want to own that protocol's security surface.
- Be deliberate about credential storage trust models when a feature requires long-lived domain credentials instead of short-lived tokens.
