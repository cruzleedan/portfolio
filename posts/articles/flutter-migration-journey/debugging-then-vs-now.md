---
title: "Debugging Then vs. Now: Chrome DevTools, Hot Reload, and What Still Isn't Solved"
description: "Trading a webview we could inspect like any website for a real mobile app changed our debugging workflow more than almost anything else in the migration."
date: 2026-07-22
tags: [flutter, migration, debugging, dev-experience]
reading_time: "4 min read"
---

# Debugging Then vs. Now: Chrome DevTools, Hot Reload, and What Still Isn't Solved

> **TL;DR:** Debugging the legacy app felt like debugging any website, because it effectively was one — Chrome DevTools, live CSS edits, a network tab, no separate mobile toolchain required. Flutter took that away and gave back something different: no browser-based inspection, but hot reload, which turned out to be a bigger net win for UI iteration than losing the browser tooling was a loss.

## What debugging used to look like

The legacy app being a Cordova wrapper around an ExtJS web app meant debugging it was debugging a website — open Chrome DevTools, inspect the network tab, tweak an element's CSS live in the inspector and see the change immediately. This was comfortable territory for a team whose deepest experience was in web development; nothing about the debugging workflow required learning new tools. The real friction was iteration speed on device: there's no hot reload in this stack, so any code change meant reloading the page if you were testing in a desktop browser, or the full rebuild-install-retest cycle if you needed to verify behavior on an actual device or emulator.

## What debugging looks like now

Flutter has no equivalent of "open dev tools on the running app in a browser tab" — you're debugging a compiled native (or near-native) app on an emulator, simulator, or physical device, full stop, there's no web-page fallback. What it gives back is hot reload: most UI changes appear on screen within a second or two of saving the file, without a rebuild or a reinstall. For the kind of iterative, "nudge this padding, check the spacing, nudge it again" work that dominates UI development, that's a faster loop than anything the legacy stack offered, even accounting for the legacy app's live CSS editing — hot reload covers logic changes too, not just styling.

Network inspection and broader UI-level testing are the areas where the gap still shows. The legacy app's browser-based network tab was a tool the whole team already knew how to use fluently; Flutter's equivalents exist and keep improving, but they're not yet the same level of "everyone on the team already knows this cold" that browser DevTools were. This isn't a permanent ceiling — the tooling has visibly gotten better over the course of the migration — but it's real friction today, and worth naming rather than glossing over just because hot reload is a clear win elsewhere.

## The net result

This wasn't a strict downgrade or a strict upgrade — it was a trade. We gave up a debugging environment the whole team had years of fluency in, in exchange for a faster iteration loop on the specific kind of work (UI layout and behavior) that eats the most calendar time during active feature development. Network and integration-level debugging are the parts of the old workflow we miss most concretely, and they're also the parts where the new stack's tooling is still catching up rather than already matching what we had.

## Takeaways

- A framework switch that changes your debugging tools isn't just a workflow inconvenience to push through — budget real ramp-up time for the team to rebuild fluency, the same way you'd budget it for the framework's application code itself.
- Weigh tooling trade-offs by where your team actually spends its time, not feature-for-feature — hot reload mattered more to us than losing browser DevTools precisely because UI iteration was the highest-frequency activity, not because one tool objectively beats the other.
- Call out the parts of a new toolchain that are still maturing honestly, even when the overall trade is a net win — "it's mostly better, except here" is more useful to a team planning its own migration than "it's strictly better."
