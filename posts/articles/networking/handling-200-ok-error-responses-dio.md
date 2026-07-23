---
title: "Handling \"200 OK, Actually an Error\" APIs Gracefully in Dio"
description: "Some backends return HTTP 200 with an embedded error payload. An interceptor is where you normalize that into a real exception."
date: 2026-07-22
tags: [flutter, dio, networking, error-handling]
reading_time: "4 min read"
---

# Handling "200 OK, Actually an Error" APIs Gracefully in Dio

> **TL;DR:** When a backend signals failure inside a 200 response body instead of via HTTP status, don't make every repository method check for it. Catch it once in a Dio interceptor and rethrow as a typed exception, so the rest of the app can treat "response succeeded" as actually meaning success.

## The problem

Some APIs — often ones built around a generic envelope format — return `200 OK` even when the operation failed, with the real failure nested as `{"error": {...}}` or `{"Error": "..."}` in the body. If nothing normalizes this centrally, every call site needs its own defensive check, and it's easy for a new repository method to skip that check and treat a failed operation as a success.

## The approach

Add a response interceptor that inspects the body of every successful HTTP response for the error shape, and if found, converts it into a `DioException` (or rejects with a custom exception) before it ever reaches application code. From the repository's point of view, a `try { await dio.get(...) } catch (DioException)` now reliably catches every failure mode — HTTP-level and payload-level alike.

## Implementation

```dart
class ApiErrorInterceptor extends Interceptor {
  @override
  void onResponse(Response response, ResponseInterceptorHandler handler) {
    final data = response.data;
    if (data is Map && (data.containsKey('error') || data.containsKey('Error'))) {
      final message = (data['error'] ?? data['Error']).toString();
      handler.reject(
        DioException(
          requestOptions: response.requestOptions,
          response: response,
          error: ServerException(message),
          type: DioExceptionType.badResponse,
        ),
      );
      return;
    }
    handler.next(response);
  }
}

class ServerException implements Exception {
  ServerException(this.message);
  final String message;

  @override
  String toString() => message;
}
```

Registered once on the shared client:

```dart
dio.interceptors.add(ApiErrorInterceptor());
```

Every repository now has one failure path to handle, not two:

```dart
try {
  final res = await dio.get('/expenses');
  return ExpenseEntity.fromJson(res.data);
} on DioException catch (e) {
  throw mapToDomainError(e);
}
```

## Trade-offs

- If the backend is inconsistent — sometimes real error status codes, sometimes embedded errors — the interceptor needs to handle both, and it's worth writing a contract test per endpoint to confirm which mode it uses.
- Inspecting every response body for an `error` key adds a small amount of overhead and a small risk of a false positive if a legitimate payload happens to have a field named `error`. Scope the check as narrowly as the API contract allows.
- Interceptor-level exceptions are easy to lose track of in Dio's logging; make sure crash reporting captures the wrapped `ServerException.message`, not just "DioException: bad response".

## Takeaways

- Normalize failure shape once, at the network boundary — don't let it leak into every repository.
- Prefer converting to a typed exception over a boolean "success" flag; typed exceptions carry a message and are catchable specifically.
- Write a contract test against real API responses (or recordings of them) so a backend change to the error envelope is caught immediately, not discovered via a support ticket.
