---
title: "Teaching an Agent to Triage: A Shared Severity Framework for Humans and AI"
description: "An agent asked to judge how bad a bug is, with no shared rubric, will sound confident and be inconsistent. Writing the rubric down is what made agentic triage trustworthy."
date: 2026-07-22
tags: [flutter, ai-agents, dev-experience, process]
reading_time: "4 min read"
---

# Teaching an Agent to Triage: A Shared Severity Framework for Humans and AI

> **TL;DR:** Severity and priority calls on a bug are exactly the kind of judgment that sounds reasonable from an AI agent and can still be inconsistent from one bug to the next, because "how bad is this" has no single correct answer without an agreed rubric. Writing that rubric down as an explicit, shared document — the same one a human triager would use — is what let an agent's severity assessment be trusted at all.

## The problem with an ungrounded judgment call

Ask an agent to assess how serious a bug is with no further guidance, and it will produce something that reads as a reasonable answer — a severity level, some justification, a recommended priority. The problem isn't that the answer is obviously wrong; it's that it's ungrounded, which means a similarly serious bug reported a week later can get a meaningfully different assessment for no principled reason, just because the agent weighed the same underlying factors slightly differently that time. That inconsistency is invisible until someone compares two triage calls side by side and notices they don't agree with each other on comparable bugs — at which point trust in the whole triage step takes a real hit.

## What the shared rubric actually contains

The fix was writing down an explicit severity framework — the same one intended for a human triager to apply — covering a five-level severity scale mapped to a priority scale, with specific defined criteria across a wide set of dimensions: whether the bug affects core functionality or something peripheral, whether it causes instability like a crash, how it affects usability, performance, security, integration with other systems, and how broadly it's likely to affect customers versus a narrow edge case. A severity-to-priority matrix makes the mapping concrete rather than left to inference — a crash affecting all users maps to the highest priority, for instance, rather than that conclusion being re-derived from first principles every time.

```
Severity: Crash / data loss, affects all users, no workaround
  → Priority: highest

Severity: Functional defect, affects a subset of users, workaround exists
  → Priority: medium

Severity: Cosmetic, no functional impact
  → Priority: lowest
```

Both a person triaging a new bug report and an agent doing the same thing are meant to apply this same written rubric — not two separately evolving standards that happen to look similar.

## Why the shared part matters as much as the written part

It would have been possible to write a severity rubric just for the agent to follow, separate from whatever a human triager does informally. That would have missed the actual point. Using the same document for both means a person can check an agent's severity call against the identical criteria they'd apply themselves, and disagreements become concrete — "you said this affects all users, but it's actually scoped to one integration" — rather than a vague sense that the AI's judgment "feels off" with no specific criterion to point to. A shared rubric turns triage disagreements into checkable claims instead of dueling intuitions.

## What this made possible

This rubric is what an automated bug-fixing workflow actually depends on upstream — a bug-fixing agent that has to decide how aggressively to pursue a fix, or whether to flag something for human attention before proceeding, needs a severity signal it can trust was arrived at consistently. Without the written rubric, that signal would have been exactly the kind of ungrounded judgment call that makes an otherwise capable agent's output hard to rely on. The severity framework isn't a side document sitting next to the agentic workflow — it's a precondition for the workflow being trustworthy at all.

## A rubric is a kind of spec

A written severity rubric is a narrow instance of a pattern showing up industry-wide under different names — [Architecture Decision Records](https://www.nexapp.ca/en/blog/architecture-decision-records-adr) for design choices, specification documents in the broader [spec-driven development](https://dev.to/krlz/spec-driven-development-in-2026-what-it-is-the-tooling-and-how-teams-actually-use-it-2fk2) movement for what a feature should do. In each case the point is the same: an explicit, shared document that both a person and an agent can be held to the same standard against, rather than either one operating on an implicit, individually-derived sense of the right answer.

## Takeaways

- A judgment call with no shared rubric behind it will sound reasonable from an AI agent while still being inconsistent across similar cases — confidence in the output isn't evidence of consistency.
- Use the same written rubric for human and AI triage, not a separate one for each — it's what turns a disagreement into a checkable claim instead of a vague feeling.
- Some of the most important groundwork for an agentic workflow isn't a prompt or a script — it's a plain document spelling out criteria a human would have needed anyway.
