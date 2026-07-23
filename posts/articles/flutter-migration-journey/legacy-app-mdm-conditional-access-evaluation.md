---
title: "Evaluating Legacy App Support for Enterprise MDM Conditional Access"
description: "Our legacy Cordova app is still in production mid-migration. 'Nobody does this on a hybrid app' turned out to be wrong, and the real answer was more nuanced."
date: 2026-07-22
tags: [flutter, migration, sso, enterprise-auth, mobile]
reading_time: "5 min read"
---

# Evaluating Legacy App Support for Enterprise MDM Conditional Access

> **TL;DR:** Migrating to Flutter doesn't put the legacy app on pause — it's still in production for existing customers, and it still gets asked to support new enterprise requirements. When one customer asked whether it could support an enterprise mobility provider's app-protection conditional access policies, the first-pass answer was "we'd have to hand-build a native bridge ourselves." That framing was wrong, and only got corrected by actually searching for evidence instead of reasoning from what seemed likely.

## Why a "legacy" app was still fielding new feature requests

The rest of this series covers building the Flutter replacement, but the legacy app hasn't stopped being a live product in the meantime — it's still what most customers run today, and a multi-year migration means "still in production" is measured in years, not months. That's the situation this request came out of: the legacy app is the Cordova-based hybrid app covered elsewhere in this series — a web view wrapping what's functionally still a web application — and a customer asked whether it could be managed under an enterprise mobility provider's app-protection policies, the kind that require an app to prove device/app compliance before allowing access, before they'd let their employees use it.

## The question

The instinctive answer was that this class of enforcement is normally the province of fully native apps talking directly to a vendor's native SDK, and that a hybrid, web-view-based app would need someone to hand-build a bridge between its web-based runtime and that native SDK — a real, custom engineering project, not a configuration change. That instinct also carried an unspoken second half: even if it were technically possible, was it worth building custom integration work into an app that's intentionally not getting much further investment while its replacement is being built?

## Why that framing didn't hold up

That instinct turned out to be an assumption dressed up as a conclusion. A direct search surfaced two concrete counter-examples: the enterprise mobility vendor itself had, at one point, published an open-source plugin for exactly this hybrid-framework case — old, and apparently no longer actively maintained, but proof the integration path had existed. More relevant, a commercial framework vendor in the same hybrid-app ecosystem maintains an actively supported plugin, sold as a premium add-on, that wraps the real native SDK (not a lighter-weight app-wrapping alternative) and explicitly supports the same conditional-access enforcement being asked about. That's a materially different answer than "nobody does this" — it's "this is a solved problem, sold as a paid plugin, actively maintained as of a recent release."

## What the corrected answer still had to be honest about

Finding that the capability exists commercially didn't make the ask trivial. The vendor's own documentation was clear that adopting the plugin meant real changes to the legacy app beyond installing a dependency: native project configuration changes on both mobile platforms, and — the more consequential detail — configuring the vendor's broker-based authentication flow, which meant migrating the app's current browser-based sign-in flow to a different authentication model entirely. For an app whose stated direction was minimal further investment while a full rewrite is underway elsewhere, "install a plugin" and "migrate the authentication architecture" are very different asks, and the corrected technical answer needed to say so plainly rather than undersell the lift just because the "impossible" framing had been wrong.

## The self-correction that mattered as much as the research

An early draft of the write-up leaned on the commercial vendor's broader brand recognition — mentioning the company primarily known for a different, related hybrid framework — as supporting evidence, without making clear that the actual documentation cited was specific to *our* framework, not the adjacent one. Getting challenged on that distinction mattered: citing evidence loosely, even when the underlying fact is correct, invites doubt that a more precisely sourced citation wouldn't. The fix wasn't to abandon the finding, it was to cite the framework-specific installation instructions and documentation directly, rather than route the credibility through a related product's name recognition.

## Takeaways

- "Nobody does this" is a hypothesis, not a finding — a direct search before committing to that framing in a customer-facing or leadership-facing answer would have caught the gap earlier.
- A corrected "yes, it's possible" still needs its real costs stated honestly — finding that a capability exists commercially doesn't mean adopting it is free of consequential trade-offs.
- Cite the most specific evidence available, not the most recognizable adjacent brand — a claim that leans on name recognition instead of precise sourcing invites exactly the kind of doubt a tighter citation would have avoided.
