---
title: "A How-To Guide: Designing Role-Scoped AI Agents for a Legacy Modernization"
description: "When the target architecture itself isn't settled yet, a different agent design fits better than the narrow, task-scoped agents that work well against an already-decided structure."
date: 2026-07-22
tags: [flutter, ai-agents, architecture, dev-experience, how-to]
reading_time: "8 min read"
---

# A How-To Guide: Designing Role-Scoped AI Agents for a Legacy Modernization

> **TL;DR:** Task-scoped agents — one for bug-fixing, one for code review, one for test generation — work well once an architecture is already settled and an agent's job is mostly "implement this correctly within rules that already exist." Carving a legacy monolith into a modernized structure is a different problem: the target shape isn't fully decided yet, and every implementation choice is also, implicitly, an architectural decision. That calls for a different agent design — fewer, broader agents scoped to a role and mapped to one module at a time, carrying real architectural judgment rather than a narrow checklist. Here's how to set that up deliberately, rather than backing into it.

## When this pattern actually fits

Before reaching for role-scoped agents, it's worth being honest about whether the problem actually calls for them. They're a good fit when a system is being decomposed rather than extended — pulling a bounded piece of logic out of a large, tangled legacy codebase and rebuilding it against a cleaner target architecture, where the target architecture is itself still being worked out in the process. They're a poor fit, and needlessly heavy, for work that's mostly extending an already-settled structure — adding a new screen to an app whose architecture is fixed, or fixing a bug in a module whose design isn't in question. That second category is exactly where narrower, task-scoped agents (one per pipeline stage, each carrying a small explicit rule set) tend to outperform broader ones — there's no architectural judgment being exercised, so there's nothing for a "persona" to bring that a rule doesn't already cover.

## Step 1: Pick exactly one pilot module, not the whole system

Resist the temptation to define every module of the target system up front and turn agents loose on all of them at once. Pick one — ideally the smallest, most self-contained piece of the domain you can find, something with few dependencies on the rest of the legacy system — and treat everything about your agent design as provisional until that one module is actually built, working, and lived with for a while. Every subsequent step below should be read as "figure this out on the pilot," not "decide this in the abstract and apply it everywhere immediately." A design that looks right on paper before any real module exists is exactly the kind of thing worth being suspicious of.

## Step 2: Define agents around roles mapped to that one module, not around pipeline stages

Rather than one agent per stage of a generic pipeline, define a small set of agents, each representing a role a person on the team would recognize — someone who implements, someone who reviews, someone who writes tests, someone who triages problems — and scope every one of them to the single pilot module, not to the system as a whole. The point isn't to have more agents than a task-scoped setup would; it's that each agent's job is now "bring good judgment to this whole module," not "execute this one narrow task correctly."

## Step 3: Write each agent's instructions as an architecture brief, not a checklist

A role-scoped agent needs to carry real architectural context, because it's going to be making judgment calls a narrow task-scoped agent never has to make. Its instruction document should cover, at minimum: the design principles that govern the target module (in priority order, since principles sometimes conflict and the agent needs to know which one wins), explicit rules about what it must never guess at and must instead verify against a real source of truth, and clear guidance on when to stop and escalate to a human rather than proceed on an assumption.

```markdown
# Illustrative shape of a role-scoped agent brief — not a real one.

## Identity
You are implementing the [Module Name] domain. You follow, in this order of
priority when principles conflict: correctness and testability first, then
consistency with the target architecture's existing patterns, then simplicity.

## Never guess
Any reference to a legacy field, table, or business rule must be verified
against the module's own documentation or the legacy source directly.
If you cannot verify it, stop and ask, rather than proceeding on an assumption.

## Escalate when
- A legacy business rule appears to contradict the target module's design.
- Two previously-documented principles conflict for the specific case at hand.
- You are about to introduce a new cross-module dependency that isn't
  already an approved pattern.

## Workflow
1. Confirm the specific piece of legacy behavior being ported, citing its source.
2. Propose the target-architecture equivalent before writing code.
3. Implement against the confirmed design.
4. Flag anything you had to assume rather than verify.
```

The specific content will vary by domain and by which architectural style the target system is adopting — the point isn't this exact template, it's that the instructions read like something written for a competent new team member who needs to be brought up to speed on real judgment calls, not like a checklist.

## Step 4: Give agents a documentation source they can actually rely on — and make maintaining it a first-class task

Whatever role-scoped agents are meant to check their judgment against — architecture principles, legacy business rules, prior decisions — needs to exist somewhere reliable enough that "verify against the documentation" is a meaningful instruction rather than a hopeful one. Two workable approaches, not mutually exclusive: constrain a category of documentation to a specific, consistent format (even a strict markdown structure with required sections) so an agent's parsing of it is predictable, or write a small number of automated checks for the handful of rules where a wrong guess would be genuinely expensive, so those specific rules aren't riding on documentation-reading at all. Either way, budget real, ongoing time for keeping this material current — a role-scoped agent trusting stale documentation will confidently reproduce a decision that's already been reversed, and it won't know to doubt itself.

## Step 5: Decide deliberately when a human checks in — don't default to either extreme

Two reasonable models exist, and the right one depends on how expensive a mistake is to catch late versus how much reviewer attention is actually available. One model places a human checkpoint immediately before any specific, hard-to-reverse action — a merge, a schema change, anything touching data at rest — and lets the agent otherwise work uninterrupted between those checkpoints. The other lets an agent work through a defined period largely unsupervised, then puts a human review at the end of that period, focused on recognizing what worked and formalizing it, rather than catching problems mid-flight. Pick deliberately, and say out loud which one you picked and why — "we're reviewing after each unit of work because mistakes here are expensive to undo" is a different, and checkable, claim than defaulting to periodic review because it's less interruptive and never actually weighing the trade-off.

## Step 6: Keep a record of what you tried and rejected, not just what you kept

As the pilot module takes shape, you'll consider approaches that seem reasonable and then decide against them once you understand the problem better — a heavier coordination mechanism that turns out to be unnecessary at the current scale, a documentation structure that turns out to be more rigid than useful. Write those decisions down with their reasoning, in a place that persists, separate from your current active rules. A rulebook captures what you do now; it doesn't capture what you considered and specifically decided against, which is exactly the context that stops the same "shouldn't we build X" conversation from happening again a few months later with nobody remembering why X was shelved the first time.

## Step 7: Set an explicit bar before scaling past the pilot

Before applying this pattern to a second module, name the specific things you need to have seen work reliably in the first one — not a vague sense that it's going well, but concrete criteria: has the agent's judgment held up on genuinely ambiguous cases, not just clean ones; has the documentation layer stayed current without heroic effort; has the human review cadence you chose actually caught the mistakes it was meant to catch. If you can't point to specific evidence for each, that's a sign to keep refining the pilot rather than multiplying an unproven pattern across more modules, where problems get harder to notice simply because attention is spread thinner.

## Common pitfalls

- Defining the full target architecture for every module before any of them are built, then treating agent design as a formality layered on top — the pilot module should still be teaching you things about the architecture itself, not just about the agents.
- Writing agent instructions that read like a checklist when the actual job requires judgment — if an agent's document could just as easily be a lint rule, it probably should be one, and the persona framing is adding false weight without adding real guidance.
- Letting "verify against the documentation" become a hollow instruction because the documentation itself isn't actually being kept current — this fails silently, since an agent has no way to know its source of truth has gone stale.
- Scaling the pattern to more modules because the pilot "seems to be working," without naming what evidence would have told you if it wasn't.

## This pattern has real precedent

Role-scoped agents aren't a speculative idea — published multi-agent research frameworks take the same approach and have been studied specifically as software-engineering tools. [MetaGPT](https://github.com/FoundationAgents/MetaGPT) assigns distinct personas (Product Manager, Architect, Project Manager, Engineer, QA Engineer) that collaborate through a shared message pool, built around the thesis that software quality comes from well-defined procedures executed by specialized roles rather than from one generalist doing everything. [ChatDev](https://starlog.is/articles/ai-agents/foundationagents-metagpt) takes it further, modeling an entire virtual company with roles like CEO, CTO, Programmer, and Reviewer. If you're building this pattern from scratch, those two projects are worth reading directly — they've been through more public iteration on the role-definition and communication problem than any single team is likely to redo from first principles.

## Takeaways

- Role-scoped agents earn their extra complexity when the target architecture itself is still being decided — for work that extends an already-settled structure, narrower task-scoped agents are usually the better fit.
- An agent instruction document for this pattern should read like an architecture brief for a new team member, not a checklist — if it doesn't need to carry judgment, it doesn't need this pattern.
- Whatever an agent is told to "verify against" has to actually be reliable and current, or the instruction is hollow — treat maintaining that source of truth as real, ongoing work, not a one-time setup cost.
- Keep a record of what you tried and rejected, with the reasoning, separate from your current rules — it's the piece a rulebook alone doesn't capture.
- Set a concrete bar for what "the pilot is working" means before scaling to more modules — a vague sense of progress isn't evidence, and the harder version of this problem is coordinating across many modules, not building the first one.
