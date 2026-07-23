---
title: "The Biometric Enrollment Prompt: Opt-In UX Without Being Annoying"
description: "Prompting for Face ID/fingerprint login after a successful password login, without nagging users who already said no."
date: 2026-07-22
tags: [flutter, ux, security, feature-design]
reading_time: "4 min read"
---

# The Biometric Enrollment Prompt: Opt-In UX Without Being Annoying

> **TL;DR:** Prompting a user to enable biometric login right after they've just typed a password is good timing — but only if declining is remembered permanently, and the same prompt can still be reached later from settings for anyone who changes their mind.

## The problem

Biometric login is a clear UX win once enabled, but the moment to suggest it — right after a successful manual login — is also a moment where an unwanted, un-dismissable prompt does real damage to trust. If "not now" isn't remembered, the app nags on every login. If it's remembered too aggressively, a user who declined once out of hesitation has no way back to opt in later without digging through settings.

## The approach

Split the feature into two entry points that share the same underlying enrollment logic but differ in exit behavior. The automatic post-login prompt checks device capability and a persisted "permanently dismissed" flag before showing anything, and offers a "don't ask again" action that sets that flag. The settings-screen toggle reuses the identical enrollment flow but without the dismiss option, since a user opening settings has already opted in to seeing it.

```dart
class BiometricEnrollmentNotifier extends Notifier<bool> {
  static const _dismissedKey = 'biometric_enrollment_dismissed_forever';

  @override
  bool build() => false; // whether the prompt is currently visible

  Future<void> maybePromptAfterLogin() async {
    final deviceSupportsIt = await ref.read(biometricServiceProvider).isSupported();
    final dismissedForever = ref.read(preferencesProvider).getBool(_dismissedKey) ?? false;
    final alreadyEnabled = ref.read(preferencesProvider).getBool('biometric_enabled') ?? false;

    if (deviceSupportsIt && !dismissedForever && !alreadyEnabled) {
      state = true;
    }
  }

  Future<void> enrollAndEnable() async {
    final success = await ref.read(biometricServiceProvider).authenticate();
    if (success) {
      await ref.read(secureCredentialsProvider).persistCurrentSession();
      await ref.read(preferencesProvider).setBool('biometric_enabled', true);
    }
    state = false;
  }

  Future<void> dismissForever() async {
    await ref.read(preferencesProvider).setBool(_dismissedKey, true);
    state = false;
  }

  /// Entry point from Settings — same enrollment, no permanent-dismiss option.
  Future<void> promptFromSettings() async {
    state = true;
  }
}
```

The overlay widget itself renders identically for both entry points; only the set of actions offered (with or without "don't ask again") differs based on which method triggered it.

## Trade-offs

- Persisting "dismissed forever" locally means it doesn't follow the user across devices — reinstalling or switching devices re-triggers the prompt, which is usually acceptable but worth being a deliberate decision, not an oversight.
- Storing credentials for biometric re-login needs to go through platform secure storage (Keychain/Keystore-backed), not plain preferences — biometric convenience shouldn't come at the cost of weaker credential storage.
- If biometric enrollment fails (hardware error, user cancels the OS prompt), the UI needs a distinct path from "declined" — a failed attempt shouldn't silently count as a permanent no.

## Takeaways

- Give a "never ask again" action real teeth (persisted, checked before showing), or the feature trains users to dismiss without reading.
- Keep one enrollment flow, with entry-point-specific exit options, rather than duplicating the biometric logic between the post-login prompt and the settings toggle.
- Treat "user declined" and "enrollment technically failed" as different outcomes with different recovery paths.
