---
title: "16 Months Into a Legacy-to-Flutter Migration: Where We Actually Are"
description: "A status check on migrating a Cordova + ExtJS mobile app to Flutter — what's done, what hasn't started, and how the timeline changed."
date: 2026-07-22
tags: [flutter, migration, dev-experience, case-study]
reading_time: "4 min read"
---

# 16 Months Into a Legacy-to-Flutter Migration: Where We Actually Are

> **TL;DR:** We started Flutter training in February 2025 and opened the first migration work item that April. Sixteen months later, we're roughly 60% through porting one legacy app's functionality, haven't started on the second legacy app that's also slated to merge in, and the delivery estimate has moved a lot since day one — in the direction of sooner, not later.

## Where this started

Our mobile presence was a legacy app built on Cordova wrapping an ExtJS web app — effectively a website in a native shell. Two of us started Flutter training in February 2025: fundamentals, debugging, architecture patterns, the things you'd expect before touching production code. We kept maintaining the legacy app the whole time — it didn't stop needing bug fixes and support just because a rewrite was coming. The first actual Flutter work item landed in April 2025.

## Where we are now

As of today, we're at roughly 60% coverage of the functionality in the first legacy app we're targeting — a time-and-expense tool. That number is doing a lot of work, though: percentage-of-features-ported doesn't capture that a meaningful chunk of what shipped isn't a straight port at all, it's a redesigned flow (more on that in a companion piece on the "1:1 migration" assumption). There's a second legacy app — a CRM tool — that's also planned to eventually live inside the same Flutter app. We haven't started that work yet. It's a known, sized, not-yet-begun piece of scope, which matters for anyone trying to reason about "when is this migration actually done."

## The timeline, revised

The original estimate for the full migration was three to four years out, made early on based on how long PBIs were taking under our development process at the time. That process changed significantly since — we cover the specifics in a separate piece — and delivery expectations moved with it. The current expectation from our engineering manager is that we could realistically ship the first version of the Flutter app publicly next year, not three or four years from when the estimate was made. That's a big swing, and it's worth being honest about why: it's not that the original estimate was sloppy, it's that the inputs to that estimate (how a team works day to day) changed underneath it.

## What "60%" doesn't tell you

A percentage-complete number invites the wrong question — "are we on track" — when the more useful question is "does the remaining 40% look like the 60% we've already done." In our case, no, not entirely. Early screens leaned closer to what the legacy app already did because the team, and the product's UX approach, were both still forming. Later screens increasingly diverge from the legacy behavior on purpose, because by then we had a dedicated UX function making deliberate calls about what a good mobile flow looks like, independent of what the old app happened to do. That means later percentage points are, on average, more expensive than earlier ones — a nuance a single completion number doesn't carry.

## Takeaways

- A migration's timeline is only as good as the assumptions behind it — when the way the team works changes, the estimate has to be revisited, not just trusted because it was carefully made once.
- "Percent complete" hides whether remaining work is like the work already done or systematically harder — say so explicitly rather than let a single number imply a smooth finish.
- Scope that hasn't started yet (our second legacy app) deserves to be named as its own line item, not folded into an overall percentage that makes it invisible.
