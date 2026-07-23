---
title: "Versioned REST APIs in a Flutter Client: Lessons from Dio Interceptors"
description: "When your backend ships versioned endpoints, the client needs a strategy for keeping response shapes from colliding in application code."
date: 2026-07-22
tags: [flutter, dio, networking, api-design]
reading_time: "6 min read"
---

# Versioned REST APIs in a Flutter Client: Lessons from Dio Interceptors

> **TL;DR:** If your backend versions endpoints (`/v2025_3/...`, `/v2025_4/...`) faster than your app's release cadence, the fix isn't to sprinkle version checks through the UI layer — it's to isolate versioning entirely inside the data layer behind a stable domain interface.

## The problem

Enterprise backends that update independently of client release trains often introduce breaking response changes behind a version segment in the URL. If the app talks to whichever version is deployed, and multiple app versions are in the field at once, you can end up needing to support two or three response shapes for the same logical resource simultaneously. Left unmanaged, that means `if (response.containsKey('newField'))` checks leaking into repositories, providers, or worse, widgets.

## The approach

Mirror the backend's version folders inside the data layer, one implementation per version, all conforming to the same interface. A single factory or repository picks the right implementation and the rest of the app only ever sees the domain entity — never the wire format.

```dart
abstract class ExpenseApi {
  Future<ExpenseEntity> getExpense(String id);
}

class ExpenseApiV2025_3 implements ExpenseApi {
  ExpenseApiV2025_3(this._dio);
  final Dio _dio;

  @override
  Future<ExpenseEntity> getExpense(String id) async {
    final res = await _dio.get('/v2025_3/expenses/$id');
    return ExpenseEntity(
      id: res.data['id'],
      amount: res.data['amount'],
      // v2025_3 has no `taxBreakdown` field — default it.
      taxBreakdown: const [],
    );
  }
}

class ExpenseApiV2025_4 implements ExpenseApi {
  ExpenseApiV2025_4(this._dio);
  final Dio _dio;

  @override
  Future<ExpenseEntity> getExpense(String id) async {
    final res = await _dio.get('/v2025_4/expenses/$id');
    return ExpenseEntity(
      id: res.data['id'],
      amount: res.data['amount'],
      taxBreakdown: (res.data['taxBreakdown'] as List).map(TaxLine.fromJson).toList(),
    );
  }
}
```

The repository picks a version based on a capability signal (server header, feature flag, or app config) and hands back the same `ExpenseEntity` regardless:

```dart
class ExpenseRepository {
  ExpenseRepository(this._api);
  final ExpenseApi _api;

  Future<ExpenseEntity> getExpense(String id) => _api.getExpense(id);
}
```

Everything above the repository — providers, widgets, tests — depends only on `ExpenseEntity` and never learns which wire version served the data.

## Trade-offs

- Every supported version needs its own adapter, and adapters accumulate; a sunset policy (e.g. drop support for versions older than N app releases) is necessary or the data layer grows without bound.
- Defaulting missing fields (like `taxBreakdown: []` above) can hide real gaps — worth logging when an older version is hit in production so you know real usage before deprecating it.
- Contract tests against each version's real (or recorded) response payload catch drift that unit tests with hand-written fixtures miss.

## Takeaways

- Version adapters belong in the data layer; the domain layer should never know a version number exists.
- Pick the version at the repository boundary, not scattered through call sites.
- Budget for adapter sunset from day one — versioned APIs without a deprecation plan only grow.
