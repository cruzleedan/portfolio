---
title: "Quick Capture: Three Capture Modes Behind One Button"
description: "Why a single camera button in an expense app actually needs to branch into three distinct code paths."
date: 2026-07-22
tags: [flutter, ai-integration, feature-design, mobile]
reading_time: "5 min read"
---

# Quick Capture: Three Capture Modes Behind One Button

> **TL;DR:** "Tap the camera icon to add a receipt" hides at least three different behaviors once you account for OCR confidence, where the user tapped from, and whether they're attaching to an existing entry or starting a new one. Treating those as one code path leads to a tangle of conditionals; treating them as three named flows keeps each one simple.

## The problem

A camera-driven capture feature in an expense app looks like one button in the UI, but the right behavior depends on context: capturing from a "new expense" floating action button should try OCR and jump straight into a pre-filled form; capturing to attach a receipt image to a line that's already fully filled in should skip OCR entirely and just attach the image; and capturing to *replace* a receipt on an existing entry needs to ask before overwriting fields that OCR would otherwise silently repopulate.

## The approach

Give each context its own named entry point on the capture controller, sharing the camera/image-picker plumbing underneath but branching on what happens with the result:

```dart
class CaptureController extends Notifier<CaptureState> {
  @override
  CaptureState build() => const CaptureState.idle();

  /// New entry from a global "add expense" action — OCR runs, result feeds a new form.
  Future<void> captureForNewEntry() async {
    final image = await _takePhoto();
    if (image == null) return;
    state = const CaptureState.processing();
    final ocrResult = await ref.read(ocrServiceProvider).extract(image);
    state = CaptureState.readyForNewEntry(image: image, extracted: ocrResult);
  }

  /// Attaching an image to an entry that's already filled in — no OCR needed.
  Future<void> captureImageOnly() async {
    final image = await _takePhoto();
    if (image == null) return;
    state = CaptureState.attachOnly(image: image);
  }

  /// Replacing a receipt on an existing entry — OCR runs, but applying results needs confirmation.
  Future<void> captureForExistingEntry({required bool requireConfirmation}) async {
    final image = await _takePhoto();
    if (image == null) return;
    state = const CaptureState.processing();
    final ocrResult = await ref.read(ocrServiceProvider).extract(image);
    state = CaptureState.readyForExistingEntry(
      image: image,
      extracted: ocrResult,
      requireConfirmation: requireConfirmation,
    );
  }

  Future<XFile?> _takePhoto() => ref.read(cameraServiceProvider).capture();
}
```

The UI layer picks which method to call based on where the capture button lives — a FAB on the report list calls `captureForNewEntry()`, a "replace receipt" action on an existing line calls `captureForExistingEntry(requireConfirmation: true)`, and a plain "attach file" action calls `captureImageOnly()`. Each path produces a distinctly-typed result the rest of the app can pattern-match on, instead of one shared result object with a handful of nullable fields that only make sense in some contexts.

## Trade-offs

- Three named entry points mean three things to keep in sync if the underlying capture mechanism changes (e.g. switching camera plugins) — worth keeping the actual camera/image-picker call in one shared private method, as above, so only the post-capture branching differs.
- Running OCR on every capture, even when the user is just re-taking a photo for cosmetic reasons, costs latency and (if it's a paid vendor API) money — the "attach only" path exists specifically to skip that cost when OCR isn't needed.
- Confirmation-gated field overwriting adds a decision point that's easy to get wrong under time pressure; pairing this with a centralized field-population policy (rather than ad hoc checks per screen) keeps it consistent.

## Takeaways

- When "the same button" means different things depending on where it's tapped from, give each context its own method name — don't encode the difference as a flag deep inside a shared function.
- Skip expensive processing (OCR, vendor API calls) on paths that don't need the result — not every photo capture needs to be understood, some just need to be stored.
- Route the ambiguous case (replacing a receipt on a filled-in entry) through an explicit confirmation step rather than guessing what the user wants.
