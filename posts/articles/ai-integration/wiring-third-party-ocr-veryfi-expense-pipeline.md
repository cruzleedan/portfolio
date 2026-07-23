---
title: "Wiring Third-Party OCR into a Mobile Form: An Expense Capture Pipeline"
description: "Integrating a receipt-scanning OCR vendor is 20% API call, 80% deciding what to trust and how it maps to your domain."
date: 2026-07-22
tags: [flutter, ai-integration, ocr, mobile]
reading_time: "6 min read"
---

# Wiring Third-Party OCR into a Mobile Form: An Expense Capture Pipeline

> **TL;DR:** Calling a receipt-OCR vendor's SDK is the easy part. The real engineering work is the translation layer between "whatever the vendor returned this month" and "a value that's safe to drop into a user's expense report" — and that layer deserves to be its own set of testable classes, not inline logic in a form.

## The problem

Receipt-capture features look simple in a demo: take a photo, watch fields populate. In production, the vendor's response schema doesn't map 1:1 onto your domain model, categories from the vendor don't match your app's category list, tax handling needs app-specific rules, and the form has existing state (locked fields, user-entered values, in-progress edits) that a naive "just overwrite everything" approach will happily destroy.

## The approach

Split the pipeline into single-purpose stages instead of one big handler:

1. **Mapper** — translates the vendor's raw JSON into your own domain entities. Nothing vendor-specific leaks past this stage.
2. **Category matcher** — maps the vendor's category taxonomy onto your app's category list, with a defined fallback for unmatched categories.
3. **Tax handler** — applies your app's tax rules to the OCR-extracted line items, since vendors typically return raw totals, not your business's tax treatment.
4. **Orchestrator** — decides which extracted fields are actually applied to the form, respecting field state (see the companion article on field-level population rules).

```dart
class VendorReceiptMapper {
  DomainReceipt map(Map<String, dynamic> vendorJson) {
    return DomainReceipt(
      vendorName: vendorJson['vendor']?['name'] as String? ?? '',
      total: (vendorJson['total'] as num?)?.toDouble() ?? 0,
      date: DateTime.tryParse(vendorJson['date'] as String? ?? ''),
      rawCategory: vendorJson['category'] as String?,
      lineItems: (vendorJson['line_items'] as List? ?? [])
          .map((l) => LineItem.fromVendorJson(l))
          .toList(),
    );
  }
}

class CategoryMatcher {
  const CategoryMatcher(this._appCategories);
  final List<String> _appCategories;

  String matchOrDefault(String? vendorCategory, {String fallback = 'Uncategorized'}) {
    if (vendorCategory == null) return fallback;
    return _appCategories.firstWhere(
      (c) => c.toLowerCase() == vendorCategory.toLowerCase(),
      orElse: () => fallback,
    );
  }
}
```

Each stage takes and returns plain data — no widget or provider dependencies — which makes each one independently unit-testable with fixture JSON from real vendor responses.

## Trade-offs

- Vendor schemas drift between SDK versions; pin the version and add a contract test against a saved sample response so an upgrade that silently renames a field fails a test instead of failing in the field.
- OCR confidence varies with photo quality, lighting, and receipt condition — the pipeline needs an explicit "low confidence, don't auto-apply" path, not just a happy path.
- Network/vendor latency means the form has to handle "still processing" state gracefully rather than blocking data entry.

## Takeaways

- Keep vendor-specific knowledge in one mapper class; everything downstream works in your own domain types.
- Category and tax logic are business rules, not OCR output — don't let the vendor's opinion of a category become your app's category.
- Fixture-based tests against real (saved) vendor payloads catch schema drift before users do.
