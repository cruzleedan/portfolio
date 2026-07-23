---
title: "Inheriting a Shared Design System We Didn't Originally Build"
description: "Our product and a sibling product both depend on the same Flutter design system. Neither of our teams built it. Here's how we keep it moving anyway."
date: 2026-07-22
tags: [flutter, migration, design-systems, dev-experience]
reading_time: "5 min read"
---

# Inheriting a Shared Design System We Didn't Originally Build

> **TL;DR:** We initially built our own design system because our UX mocks looked different from another Flutter product's mocks. Leadership's broader push to harmonize designs and technology across products meant that plan didn't survive, and we ended up adopting a shared design system instead, built by a dedicated architecture team. That architecture team no longer exists in the form it did when the library was built, and our product — one of two consumers of the library — is now its de facto primary maintainer. This is how we keep a shared dependency healthy without the team that originally owned it.

## How we got here

Early in our migration, we built a design system specific to our product, because our UX team's mocks genuinely didn't look like the mocks another team was working from for their own Flutter product. That made sense from inside our project. It made less sense against a company-wide push toward harmonizing products — designs, technology choices, frameworks — across the portfolio, and once that priority was made explicit, our custom design system wasn't the direction to keep going. A dedicated architecture team built a shared design system aligned to that harmonization goal, and both our product and the sibling product migrated onto it.

Since then, the architecture team that originally built and staffed that shared library changed shape — its members moved to other responsibilities — and primary maintenance landed with us, the team using the library the most heavily day to day. The sibling product's team recently brought on a part-time Flutter developer of their own, so it's no longer a one-sided relationship, but the maintenance load and the decisions about the library's direction sit mostly with our team now, by circumstance more than by original design.

## How day-to-day maintenance actually works

A few concrete things make this workable with a shared library and no dedicated owning team behind it:

**Aligned branching strategy.** We're moving the design system's git branching model to match our own product's, specifically because we're the team touching it most and the friction of context-switching between two different branching conventions wasn't worth preserving just for parity with how it used to be run.

**Shared but bounded review.** Pull requests — whether from us, from the sibling team's developer, or from any other contributor — get reviewed by a small, consistent group spanning both products' primary contributors. Contributions from outside our team are genuinely welcome; the bounded reviewer group exists so someone with context on both products' usage is always in the loop, not to gatekeep contributions.

**Versioning as the safety valve.** Rather than pushing every change to every consumer immediately, the design system maintains multiple versions, and each product subscribes to whichever version it's ready for. Significant changes land only in a new version; existing consumers keep running the version they're on until they choose to migrate. This is what makes shared ownership tenable at all — without it, every change to the library would be a negotiation with the other product's release schedule.

## The trade-off we accepted

None of this makes shared ownership free. Every meaningful change to the library now has to be considered from two products' perspectives, not one, which is real overhead compared to owning a design system exclusively for our own use. What versioning buys us is the ability to keep moving without that overhead turning into a blocking dependency — we can ship a breaking change for our own use case without forcing the sibling product to absorb it on our timeline, and vice versa.

## Takeaways

- A shared internal library outliving the team that built it is a common failure mode, not a rare one — plan the maintenance model (branching, review, versioning) assuming ownership will shift, rather than assuming the original team stays intact indefinitely.
- Versioning a shared library isn't just a technical migration convenience — it's what makes shared ownership between teams with different release cadences workable without constant renegotiation.
- A small, cross-product reviewer group is cheap insurance against changes that look safe from one product's perspective but aren't from the other's — worth keeping even when one team is doing most of the day-to-day maintenance.
