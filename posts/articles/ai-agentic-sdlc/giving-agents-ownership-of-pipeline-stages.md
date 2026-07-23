---
title: "Giving AI Agents Ownership of Pipeline Stages"
description: "A survey of what happens when, instead of one general-purpose AI assistant, each stage of the dev pipeline gets its own narrowly scoped agent."
date: 2026-07-22
tags: [flutter, ai-agents, dev-experience, process]
reading_time: "6 min read"
---

# Giving AI Agents Ownership of Pipeline Stages

> **TL;DR:** A single, general-purpose "help me with this codebase" AI assistant is useful, but it re-derives context and re-decides how to approach a task every single time. Splitting the pipeline into named stages — bug investigation, code review, test generation, PR creation — and giving each stage its own scoped agent with its own explicit rules turned out to matter more than which underlying AI model does the work.

## Why one assistant wasn't enough

A general-purpose assistant asked to "fix this bug and open a PR" has to figure out, from scratch each time, what a good bug fix workflow looks like for this specific codebase: how to assess severity, what counts as done, what the PR description should contain, who should review it. Some of that gets inferred reasonably; some of it gets reinvented slightly differently every time, which is its own kind of inconsistency. The alternative that ended up working better was defining several agents, each scoped to one stage of the pipeline, each carrying its own explicit rules for that stage specifically, rather than one assistant improvising a full pipeline from general instructions every time.

## The stages that got their own agent

**Bug investigation and fixing.** Given a bug report, this agent fetches the report, analyzes the likely cause, checks its severity against a written rubric (more on that in a companion piece), proposes a fix, implements it on a properly named branch, and — critically — stops and asks a human to confirm the fix actually resolves the issue before it updates the tracker or opens a PR. It doesn't fix-and-forget; it fixes and waits.

**Code review.** Given a diff, this agent checks the usual things — null safety, async patterns, obvious performance issues — but its most consequential job is checking the change against the codebase's architectural rules: are dependencies pointing the right direction, is business logic living in the layer it's supposed to live in, is a view-model being imported somewhere it shouldn't be. Some of these checks run as actual executable scripts the agent invokes and reports on, not just a prose judgment call (a companion piece covers this specifically).

**Test generation and validation.** One agent looks at a set of acceptance criteria or a set of changed files and decides, item by item, what's actually worth a unit test versus what would just be padding coverage numbers without testing anything meaningful. A second agent runs the test suite afterward, reports what passed and failed, and does a first pass at root-causing any failures before a human gets pulled in.

**PR creation.** Once review and tests have both passed, this agent opens the pull request — writing the description, linking it to the right work item, assigning reviewers, and validating that nothing that shouldn't be committed (a stray local-only dependency override, a half-finished planning document) is riding along with the real change.

**Environment and upgrade tasks.** Two more agents handle less frequent but higher-stakes operational work: setting up a new development environment correctly, and walking through a Flutter version upgrade with awareness of the specific migration steps that version jump requires.

## Why splitting it up mattered more than the model

The obvious question is whether this is really about agent specialization or just about a capable enough underlying model. In practice, splitting the work by stage bought something a single smarter prompt wouldn't have: each agent's instructions could be specific enough to be genuinely opinionated — exact severity criteria, an exact list of what to test versus skip, an exact required order of operations — without those specifics fighting each other for space in one enormous, do-everything prompt. A bug-fixing agent's instructions can be entirely about triage and root-cause analysis; a test-generation agent's instructions can be entirely about what does and doesn't deserve a test. Neither has to also carry rules about the other's job.

## What this doesn't solve

Specialized agents still only know what their instructions tell them, and those instructions are themselves a maintenance burden — written by a human, reviewed by a human, and just as capable of going stale as any other internal documentation. Splitting the pipeline into stages didn't remove the need for someone to keep each agent's rulebook current; it just made each individual rulebook smaller and more tractable to keep current, which is a real improvement but not the same as the problem disappearing.

## How this compares to the alternative industry pattern

Splitting a pipeline into task-scoped agents is one of two patterns showing up across the industry right now, not the only one. The other — giving agents broad, role-based personas (a product manager, an architect, an engineer, a reviewer) modeled directly on how a human team is organized — shows up in published multi-agent research frameworks like [MetaGPT](https://github.com/FoundationAgents/MetaGPT), whose core thesis is literally "Code = SOP(Team)," and [ChatDev](https://starlog.is/articles/ai-agents/foundationagents-metagpt), which models a full virtual company with roles like CEO, CTO, and Reviewer. That's a deliberately different bet: fewer, thicker agents carrying real judgment, instead of more, thinner agents each carrying one narrow rule. A companion piece in this series compares the two approaches directly, including where each is better supported by current evidence and where each is still unproven.

## Takeaways

- A narrowly scoped agent with explicit, stage-specific rules tends to behave more consistently than one general-purpose agent carrying instructions for an entire pipeline at once.
- Splitting by pipeline stage lets each agent's instructions be genuinely opinionated without those opinions crowding out rules for a different stage entirely.
- Specialization doesn't eliminate the maintenance cost of the instructions themselves — it just makes each piece of that maintenance smaller and easier to keep current.
