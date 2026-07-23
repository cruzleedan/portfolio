---
title: "Multi-Currency Exchange Rate Handling in an Expense Form"
description: "Letting a user override an exchange rate without losing track of where the number came from is harder than it looks."
date: 2026-07-22
tags: [flutter, fintech, forms, feature-design]
reading_time: "5 min read"
---

# Multi-Currency Exchange Rate Handling in an Expense Form

> **TL;DR:** An exchange rate field isn't just a number input — it's a value with a *source* (system default, fetched market rate, or user override), and the UI, validation, and downstream calculations all need to agree on which source is currently active.

## The problem

A traveling employee logs an expense in a foreign currency. The app needs to convert it to the reporting currency, and there's more than one legitimate way to get that rate: a rate baked into the company's default settings, a live market rate fetched at entry time, or a rate the user types in because they know their card was charged at a specific rate. If the form only stores the numeric rate, it's impossible to tell later whether that number is still trustworthy — a fetched market rate from an hour ago is stale in a way a user-entered rate isn't.

## The approach

Model the rate as a small tagged value, not a bare `double`: a source enum plus the number. Fetching a market rate is an explicit async action with its own loading state, separate from the text field's normal validation, since it can fail or take a moment on a slow connection. Switching to a user-entered rate immediately invalidates the "fetched" state so stale numbers can't masquerade as live ones.

```dart
enum RateSource { companyDefault, fetchedMarket, userEntered }

class ExchangeRate {
  const ExchangeRate({required this.value, required this.source, this.fetchedAt});
  final double value;
  final RateSource source;
  final DateTime? fetchedAt;

  ExchangeRate withUserOverride(double newValue) =>
      ExchangeRate(value: newValue, source: RateSource.userEntered);
}

class ExchangeRateController extends Notifier<AsyncValue<ExchangeRate>> {
  @override
  AsyncValue<ExchangeRate> build() =>
      AsyncValue.data(const ExchangeRate(value: 1.0, source: RateSource.companyDefault));

  Future<void> fetchMarketRate(String fromCurrency, String toCurrency) async {
    state = const AsyncValue.loading();
    state = await AsyncValue.guard(async () async {
      final rate = await ref.read(rateServiceProvider).fetch(fromCurrency, toCurrency);
      return ExchangeRate(value: rate, source: RateSource.fetchedMarket, fetchedAt: DateTime.now());
    });
  }

  void applyUserOverride(double value) {
    final current = state.valueOrNull ?? const ExchangeRate(value: 1.0, source: RateSource.companyDefault);
    state = AsyncValue.data(current.withUserOverride(value));
  }
}
```

The form reads `state.source` to decide what to show next to the field — "market rate as of 2:14 PM" for a fetched rate, nothing for a manual override — so the user always knows what they're looking at.

## Trade-offs

- A field that can be both "loading" and "editable" (the user can type over a rate while a fetch is still in flight) needs an explicit precedence rule — usually, the most recent user keystroke wins over a slow fetch response arriving late.
- Precision matters for financial values: storing rates as `double` accumulates floating-point error over repeated multiplication; high-precision decimal types are worth the extra dependency for anything audited.
- Rate source needs to survive serialization if the report is saved as a draft — losing the "this was user-entered" flag on reload silently turns a deliberate override into an unexplained fixed rate.

## Takeaways

- Attach provenance to a financial value, not just the number — it changes how the UI presents it and how much you trust it downstream.
- Treat a rate fetch as its own async operation with its own loading/error state, decoupled from field-level form validation.
- Decide explicitly what happens when a user edits a field while a background fetch for that same field is still pending.
