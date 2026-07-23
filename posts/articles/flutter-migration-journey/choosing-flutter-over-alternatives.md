---
title: "Flutter vs. PWA vs. Ionic vs. Roll-Your-Own: How We Actually Chose a Mobile Framework"
description: "Before committing to Flutter, we spiked four different paths. Here's what each one was actually being evaluated for, and why the debate wasn't as one-sided as the outcome suggests."
date: 2026-07-22
tags: [flutter, migration, architecture, dev-experience]
reading_time: "5 min read"
---

# Flutter vs. PWA vs. Ionic vs. Roll-Your-Own: How We Actually Chose a Mobile Framework

> **TL;DR:** Before settling on Flutter, we ran spike work items against a Progressive Web App approach, Ionic, and a custom JavaScript framework built on top of our existing web app's stack. Flutter won on being modern, fast, and closer to native than the alternatives — but the decision wasn't unanimous going in, and the strongest counter-argument (reuse what the web team already knows) was a genuinely reasonable position, not a straw man.

## Why this wasn't an obvious call

Rewriting a mobile app is expensive regardless of what you rewrite it in, so the framework choice was treated as a real decision with real spikes, not a foregone conclusion. Several paths got serious evaluation:

- **A Progressive Web App**, extending patterns from our existing web application's framework so mobile could reuse investment already made there.
- **Ionic**, a hybrid framework that, like our legacy app, wraps web technology in a native shell — lower framework-switching cost, closer to what the team already knew.
- **A custom JavaScript framework plus PWA**, essentially betting on building bespoke mobile tooling around our own web stack rather than adopting someone else's framework at all.
- **Flutter**, a from-scratch commitment to a different language (Dart) and a genuinely different rendering and app model, closer to native than any of the other three options.

## The case for staying closer to the web stack

Our engineering manager pushed hard for one of the web-stack-adjacent options — PWA, Ionic, or the custom framework — and it wasn't a weak argument. The team's deepest expertise was in the web framework already powering the product; a mobile approach that extended that stack meant less retraining, faster ramp-up, and a smaller blast radius if something went wrong, since it wouldn't require the team to become proficient in an entirely new language and framework paradigm at the same time as shipping a rewrite. For an organization already stretched across other priorities, "reuse what you have" is a legitimate strategy, not just a reluctance to change.

## Why it didn't land

The counter-argument that ultimately won out was that extending the existing web-based approach to mobile was underestimated in complexity — refactoring a framework built for desktop-oriented web use into something that behaves well as a mobile app (offline behavior, native-feeling navigation, performance on lower-powered devices, platform integrations like biometrics and camera access) turned out to be its own substantial undertaking, not a lighter lift than adopting a purpose-built mobile framework. Our Flutter architecture lead's recommendation — modern, fast, and structurally closer to native app conventions than a webview-based approach — was ultimately persuasive precisely because the "lighter lift" alternatives weren't actually lighter once evaluated concretely against real requirements, rather than in the abstract.

## What made the decision durable

The spikes mattered here in a way a purely theoretical debate wouldn't have: each option was evaluated against the same criteria using real, if small, implementation work rather than slideware. That's what let a decision this consequential get made with actual evidence behind it, and it's also what made the losing arguments easier to set aside once the results were in — the debate wasn't "framework preference," it was "which of these can actually deliver on the concrete requirements," and the spikes gave a real answer rather than a hypothetical one.

## Takeaways

- Treat "reuse the existing stack" as a real contender worth spiking, not something to wave off — the case for lower retraining cost and smaller blast radius is legitimate even when it ultimately loses.
- Evaluate framework options against concrete requirements (offline behavior, native integrations, performance on real devices) rather than reputation or team familiarity alone — that's what actually surfaces hidden costs.
- A decision this size holds up better when it's backed by spike work everyone can point to, rather than a debate that ends in a vote or a mandate.
