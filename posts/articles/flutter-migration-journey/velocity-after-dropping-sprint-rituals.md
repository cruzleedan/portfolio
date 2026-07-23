---
title: "What Changed When We Stopped Running Two-Week Sprints"
description: "A four-year migration estimate turned into a next-year release target — not because the team got smarter, but because the process around the work changed."
date: 2026-07-22
tags: [flutter, migration, process, dev-experience]
reading_time: "4 min read"
---

# What Changed When We Stopped Running Two-Week Sprints

> **TL;DR:** Our original multi-year migration estimate was built on how fast the team completed work items under a traditional two-week sprint cadence — planning, a technical design review, a technical demo, a separate demo for the product manager, all repeating every two weeks. When we dropped the fixed sprint boundary and the associated rituals in favor of continuous flow, the same team started finishing work items roughly twice as fast, and the delivery outlook changed with it.

## The process the estimate was built on

Early in the migration, we worked in traditional two-week sprints: pick up work at the start of the sprint, spend the two weeks building it, and along the way run a set of standard ceremonies — a technical design review with the team before starting, a technical demo partway through, a separate demo for the product manager near the end. None of these rituals are unreasonable in isolation; each one exists to catch a real risk (bad design decisions, drifting scope, misaligned expectations). Our original three-to-four-year migration estimate was built directly on how long a work item actually took to close under this process.

## What changed

We moved to a model where a developer starts the next work item as soon as the current one is done, rather than waiting for a fixed two-week boundary to reset. The ceremony load dropped too — the design reviews, technical demos, and separate PM demos that used to gate every item's progress are no longer required steps. The result, directionally, was that items that used to take roughly two weeks under the old cadence started closing in about a week, and the next item could start immediately rather than waiting for the next sprint to officially begin.

## Why this moved the estimate, not just the mood

An estimate based on "how many work items can this team close per unit time" is only as good as the process generating that rate. When the process changed this much — cutting both the artificial two-week floor on work-item duration and a meaningful chunk of ceremony overhead — the historical rate the original estimate was built on stopped being representative of how the team actually worked going forward. That's the honest reason the delivery outlook moved from three-to-four years to a next-year release target: not a burst of unusual productivity, but a structural change in how much of each week went toward the actual work versus the process wrapped around it.

## What this doesn't mean

It would be a mistake to read this as "ceremonies are always waste" — technical design review, demos, and check-ins exist because unreviewed technical decisions and invisible progress are real risks on a project this size. What changed for us wasn't that those risks stopped mattering; it's that a fixed two-week box and a mandatory ceremony for every single item turned out to impose more overhead than the risks it was managing justified, at least for a team and a body of work that had matured past the point of needing that much structure per item. A newer team, or a higher-stakes body of work, might reasonably need more of that structure back.

## Takeaways

- An estimate is a statement about a process as much as it's a statement about scope — revisit the estimate explicitly when the process changes, rather than assuming the number still holds.
- Ceremony overhead is easiest to see in aggregate, at the level of "how many work items closed this month," not by looking at any single sprint in isolation.
- Removing process is a trade-off against real risks (misaligned design, invisible progress), not a free win — it's worth reassessing periodically as the team and the work itself change, not treated as a permanent, one-time decision.
