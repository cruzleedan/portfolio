---
title: "Migrating Off a Legacy API: Different Shapes, Missing Fields, Multiple Server Versions"
description: "Swapping a legacy SOAP-style service layer for REST endpoints sounds like a networking-layer change. It turned into a data-modeling and compatibility problem."
date: 2026-07-22
tags: [flutter, migration, networking, api-design]
reading_time: "5 min read"
---

# Migrating Off a Legacy API: Different Shapes, Missing Fields, Multiple Server Versions

> **TL;DR:** Our legacy mobile app talked to a legacy service layer that's being retired for security reasons, so the new Flutter app talks to newer REST endpoints instead. That sounds like a client-side networking swap. In practice it meant reconciling a different JSON shape, filling gaps where information the legacy services returned simply isn't present in the new endpoints, and supporting multiple server versions at once because not every customer runs the newest backend.

## The problem

The legacy mobile app called into an older service layer that's being phased out for security reasons — old enough, and broad enough in its access patterns, that keeping it around indefinitely wasn't the right call. The plan was straightforward on its face: point the new app at the newer REST API that the rest of the product already uses, and move on. What that plan undersold was how different "the same data, different endpoint" can actually be once you're comparing response shapes field by field.

## What actually changed

The new REST endpoints don't return the same JSON structure as the legacy services — expected, given they weren't designed as a drop-in replacement, but it meant every screen pulling from a legacy endpoint needed its data-mapping logic rebuilt, not just repointed at a new URL. More disruptive: some information the legacy services provided isn't present in the new endpoints at all. Getting it means calling a second endpoint specifically to backfill what the primary one doesn't carry — which changes the request shape for those screens from "one call, render" to "two calls, merge, render," with the attendant question of what to show while the second call is still in flight.

On top of the shape mismatch, the app has to work against more than one server version, because customers don't all run the same backend release at the same time. That means the client can't assume a single fixed contract — it has to detect (or be told) which server version it's talking to and branch to the correct endpoint and, in some cases, the correct response-parsing logic for that version. A request that's a single unconditional call against the newest server becomes a version-conditional call once you account for customers still on an older one.

## Why this is a data-modeling problem, not just a networking one

The instinct to treat an API migration as "swap the base URL and update the request paths" undersells what's actually different: the shape of the data, not just its location. Fixing that means redesigning the mapping layer between wire format and domain model for every affected feature, not just repointing a client. Add the missing-field problem and the multi-version problem, and what looked like a networking task becomes, in practice, a data-modeling and compatibility exercise that happens to be triggered by a networking change.

## Takeaways

- Don't scope an "endpoint swap" as a networking task until you've actually diffed the old and new response shapes field by field — the difference between "same data, new URL" and "different shape entirely" changes the size of the work by an order of magnitude.
- When new endpoints don't carry information the old ones did, decide deliberately whether to backfill via an extra call, degrade the feature, or push the gap back to whoever owns the new API — silently working around it screen by screen produces inconsistent behavior across the app.
- Supporting multiple server versions on the client isn't a corner case to handle later — if your customer base doesn't upgrade in lockstep, version-conditional request logic is core scope from day one, not a follow-up task.
