---
title: "The 1:1 Migration Myth: Why 'Just Port the Screens' Didn't Survive Contact with Reality"
description: "The plan was to rebuild the legacy app screen-for-screen in Flutter. Two concrete flows show why that plan didn't hold up."
date: 2026-07-22
tags: [flutter, migration, ux, dev-experience]
reading_time: "5 min read"
---

# The 1:1 Migration Myth: Why "Just Port the Screens" Didn't Survive Contact with Reality

> **TL;DR:** The initial plan for our legacy-to-Flutter migration was a 1:1 port — same screens, same designs, same behaviors, just rebuilt on a different framework. In practice, we ended up redesigning flows almost everywhere we touched, because Flutter and a UX practice that didn't previously exist on this product both pushed in the same direction: more capable, more flexible, and unavoidably more complex than the original.

## The plan

Leadership's initial thinking was reasonable on paper: the legacy app already reflects years of validated business logic and user familiarity, so why not just rebuild the same screens on Flutter and move on. It's a lower-risk-sounding plan — less design work, less behavior-change risk, a more predictable scope. It also assumes the old screens are still the right screens, which turned out not to hold once we actually looked at them next to what a native-feeling mobile flow should do, and once a dedicated UX function — something this product never had during the legacy app's life — started making calls based on UX patterns and user testing instead of "how did the old app do it."

## Receipt capture, before and after

The legacy app's receipt-capture flow is genuinely simple: take a photo, then either pick an existing expense report to attach the new line to, or create a new one. Once you're past the photo, you're committed — no going back to retake the photo, no changing your mind about which report you picked.

The Flutter version does more, on purpose. A user can back out and retake the photo if the first shot came out bad. They can back out of report selection and reconsider whether they meant to attach to an existing report or start a new one. After saving, the app now offers a set of next-action options — add another line, create another report, and so on — that simply don't exist as choices in the legacy flow, where "you're done" was the only path forward.

None of this changes what the feature *does* at the business level: it still turns a photo into an expense line on a report. But the flow underneath is materially more complex — more states, more back-navigation paths, more decisions about what data survives a "wait, let me go back" moment — because a mobile-native flow is expected to let users recover from a wrong turn instead of forcing them through a fixed sequence.

## Expense line entry, before and after

The legacy app only lets a user save a report and its lines from the report detail screen — one save action, one place it happens. In the Flutter app, a user can save an entire report from the expense-line screen itself, or trigger a save just by adding a new line: the app now detects unsaved changes and auto-saves them before opening the new line's screen, so the user never loses work by navigating deeper into the flow. Again — same underlying business object, same end state, but the actual mechanics of "when does a save happen and who triggers it" changed enough that it isn't the same screen with a new coat of paint. It's a different interaction model built around not losing user data across navigation, which the legacy single-save-point design never had to solve.

## Why "1:1" didn't survive

Two forces pushed in the same direction independently. Flutter, as a framework closer to native app conventions than a webview wrapping a website, made state-rich, multi-path navigation cheap enough to build that there was no longer a technical reason to force users through a single linear path. And a UX practice that didn't exist when the legacy app was designed started asking "is this actually the best way to do this," rather than "how do we reproduce what's already there." Once either force is in play, screen-for-screen parity stops being the natural outcome — it becomes something you'd have to actively fight for, and it's not clear you'd want to.

## Takeaways

- A "just port it" plan implicitly assumes the old screens are still correct — that assumption is worth testing explicitly before it becomes the scope baseline everyone's estimating against.
- Framework capability and UX maturity can independently push a migration away from parity; when both are present at once, expect divergence, not despite planning but because of it.
- The real cost of "it's more capable now" is complexity — more states, more paths, more edge cases to design and test for. That's a trade worth making deliberately, not one that should arrive as a surprise mid-migration.
