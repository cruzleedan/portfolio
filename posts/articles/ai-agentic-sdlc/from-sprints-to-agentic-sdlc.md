---
title: "From Sprints to an Agentic SDLC: Redesigning How Work Actually Gets Done"
description: "Dropping fixed sprints was the first change. Using AI agents at every stage of development, not just for autocomplete, was the next — and it's still being figured out."
date: 2026-07-22
tags: [flutter, ai-agents, dev-experience, process]
reading_time: "5 min read"
---

# From Sprints to an Agentic SDLC: Redesigning How Work Actually Gets Done

> **TL;DR:** Dropping the fixed two-week sprint cadence changed *when* work happened. The next change is changing *how* it happens — using AI agents across nearly every step of development, from investigating a bug to opening the pull request, rather than treating AI as a smarter autocomplete. It's an explicit, organization-level push, and it is genuinely not fully worked out yet. This series is about what that actually looks like day to day, including the parts that are still rough.

## Where this picks up

A separate piece in this series covers moving away from fixed two-week sprints and their associated ceremonies toward continuous flow — finish one item, start the next, no waiting for a sprint boundary to reset. That change was about removing overhead from *when* work happens. The next shift is about *how* the work itself gets done: a deliberate move toward what's being called an agentic software development lifecycle, where AI agents aren't just suggesting the next line of code, they're handling entire phases of the process — investigating a bug, reviewing a diff, writing tests, opening a pull request — with a developer directing and checking the work rather than typing every line of it.

## What "use AI whenever possible" actually means day to day

The operating principle is close to that literal: at nearly every step of building a feature or fixing a bug, the first move is reaching for an AI agent rather than doing the step by hand. Investigating what's causing a bug, reviewing a colleague's changes, implementing a fix once the cause is understood, writing the pull request description, generating unit tests, updating documentation — all of these have an agent in the loop by default now, not as an occasional shortcut. Manual coding hasn't disappeared, but it's become the exception that needs a reason, rather than the default that needs no justification. The reasons that come up most: giving an agent a concrete reference or template to work from when nothing like it exists yet in the codebase, correcting a mistake an agent keeps making after a couple of attempts, or a change simple enough that writing it by hand is genuinely faster than describing it.

## Why this isn't a finished story

None of this is settled practice yet. The specific boundary between "let the agent handle this" and "just do it yourself" is still shifting as trust in particular agents grows or shrinks based on their actual track record on real work, not on how the process was designed to work on paper. Some of what's been built — specialized agents scoped to single tasks like fixing a bug end-to-end, generating unit tests from a set of acceptance criteria, or opening a pull request with the right metadata attached — works well enough to lean on daily. Other parts are closer to "this is being tried and adjusted as it breaks." Calling this a mature, settled system would be overstating it. Calling it a serious, organization-wide bet that's already changing daily work is accurate, and that's the more honest way to describe where things actually stand.

## What this series covers

The rest of this series goes into the specific pieces: how work got split across several narrowly scoped agents instead of one general-purpose assistant, where the line between agent and manual work actually falls in practice, the explicit decision rules that had to be written down before an agent could be trusted with a task like "decide what's worth unit testing," and the checkpoints built in specifically to keep a human confirming the consequential steps before they become irreversible.

## Where this fits in the wider industry

This isn't an isolated experiment. Industry analysts now describe the same shift in almost identical terms: Gartner projects [task-specific AI agents will appear in 40% of enterprise applications by the end of 2026](https://www.gartner.com/en/newsroom/press-releases/2025-08-26-gartner-predicts-40-percent-of-enterprise-apps-will-feature-task-specific-ai-agents-by-2026-up-from-less-than-5-percent-in-2025), up from under 5% in 2025 — the same "agent scoped to a specific job" framing used throughout this series. Multiple industry guides now define an ["agentic SDLC"](https://www.coderabbit.ai/guides/agentic-sdlc) as [AI participating meaningfully across planning, coding, testing, and review](https://www.sonarsource.com/resources/library/what-is-agentic-sdlc/), not just autocomplete — which is a fair description of the bet described here. None of that makes this particular version of the approach settled or validated; it means the underlying wager — narrow agents, explicit rules, a human still doing the judgment work — is one a lot of the industry is making in parallel, not something invented from scratch in isolation.

## Takeaways

- Changing *when* work happens (dropping sprint ceremonies) and changing *how* it happens (agentic workflows) are separate, sequential shifts — don't conflate them, and don't expect one to automatically produce the other.
- "Use AI whenever possible" is a real operating principle, not a slogan, once manual coding requires a specific justification rather than being the assumed default.
- Be honest, including publicly, about what's still being figured out — a process description that only shows the polished parts isn't useful to anyone trying to learn from it.
