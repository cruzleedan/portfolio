---
title: "Filename and Attachment Validation for Receipt Uploads"
description: "The unglamorous but necessary work of sanitizing file names before they hit a backend that doesn't expect iOS smart quotes."
date: 2026-07-22
tags: [flutter, mobile, best-practices, file-handling]
reading_time: "4 min read"
---

# Filename and Attachment Validation for Receipt Uploads

> **TL;DR:** File names captured on a phone come with baggage — curly quotes from iOS autocorrect, missing extensions, names far longer than a backend's column limit — and validating them client-side, before upload, avoids a class of "upload succeeded, then failed to save" bugs that are miserable to reproduce.

## The problem

A receipt attachment's file name usually isn't something the app generates — it comes from the camera roll, a share-sheet import, or a scanned document, and inherits whatever the source app or OS named it. iOS in particular has a habit of substituting "smart quotes" and other typographic characters into text that started as a plain apostrophe, which then breaks systems that whitelist a strict character set for file names. Add backend-imposed limits (max filename length, allowed extensions) and a file that looked fine on the device can fail validation only after it's already been uploaded — the worst place to discover a problem.

## The approach

Validate and, where reasonable, auto-correct the file name client-side before the upload even starts, so failures surface immediately with a clear message instead of after a round trip to the server.

```dart
class AttachmentValidator {
  static const _maxFileNameLength = 199;
  static const _maxDescriptionLength = 500;
  static const _allowedExtensions = {'jpg', 'jpeg', 'png', 'pdf'};

  ValidationResult validateFileName(String rawName) {
    final sanitized = _sanitize(rawName);
    final extension = sanitized.split('.').last.toLowerCase();

    if (!_allowedExtensions.contains(extension)) {
      return ValidationResult.invalid('Unsupported file type: .$extension');
    }
    if (sanitized.length > _maxFileNameLength) {
      return ValidationResult.invalid('File name exceeds $_maxFileNameLength characters');
    }
    return ValidationResult.valid(sanitized);
  }

  /// Replaces typographic characters phones commonly introduce (smart quotes,
  /// em dashes) with their plain-ASCII equivalents, and strips characters
  /// that are outright invalid in file names on common backends.
  String _sanitize(String name) {
    const replacements = {
      '‘': "'", '’': "'", // smart single quotes
      '“': '"', '”': '"', // smart double quotes
      '–': '-', '—': '-', // en/em dash
    };
    var result = name;
    replacements.forEach((from, to) => result = result.replaceAll(from, to));
    return result.replaceAll(RegExp(r'[\\/:*?"<>|]'), '_');
  }
}
```

Description fields attached to a receipt (a note, a memo) get the same length-limit treatment as file names, just with a higher ceiling — both are enforced before the user can proceed, with the limit surfaced as a live character counter rather than a rejection after the fact.

## Trade-offs

- Silently substituting characters (smart quote → straight quote) is usually the right default, but it means the stored file name is no longer byte-identical to what the user saw on their camera roll — worth a design decision on whether that's acceptable or whether the user should be shown the corrected name before upload.
- Backend limits change over time (a column gets widened, a new file type gets supported); hardcoding limits client-side means two places to update instead of one — fetching them from a config endpoint is more resilient if limits are expected to change.
- Overly aggressive sanitization (stripping instead of replacing) can produce confusingly similar file names when multiple receipts differ only in punctuation that got stripped — replace where there's a sane equivalent, strip only what has none.

## Takeaways

- Validate file names and attachment metadata before upload starts, not after the server rejects them — the failure mode of "uploaded, then failed" is far more confusing to debug and to explain to a user.
- Phone-sourced content brings OS-specific quirks (typographic character substitution being one); test with real device-captured content, not just hand-typed test fixtures.
- Keep length and type limits visible to the user as they type/select, not just enforced silently at submission time.
