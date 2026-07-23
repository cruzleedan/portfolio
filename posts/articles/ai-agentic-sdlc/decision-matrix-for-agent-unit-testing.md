---
title: "Building a Decision Matrix So an Agent Knows What's Worth Unit Testing"
description: "Told to 'add unit tests,' an agent will happily generate coverage that tests nothing meaningful — unless it's given an explicit rule for what to skip."
date: 2026-07-22
tags: [flutter, ai-agents, testing, dev-experience]
reading_time: "5 min read"
---

# Building a Decision Matrix So an Agent Knows What's Worth Unit Testing

> **TL;DR:** An agent asked to "write unit tests for this" will do exactly that — for everything, including generated code, framework boilerplate, and hardcoded constants that can't meaningfully fail. The fix isn't a smarter agent, it's a written decision matrix spelling out what's actually worth testing and what isn't, so the agent has a rule to apply instead of a vague instinct to approximate.

## The failure mode

Coverage as a number is easy to inflate and easy to game, even unintentionally. An agent that's simply told to add tests for a set of changes will generate a test for a data class's generated `copyWith` method, a test asserting an enum value exists, a test confirming a hardcoded constant equals itself — all technically passing tests, all adding to a coverage report, none of them capable of catching a real regression, because none of them exercise logic a person actually wrote. Left unchecked, this produces a test suite that looks robust in a coverage dashboard and does very little of what a test suite is actually for.

## The rule that fixes it

The fix was writing down, explicitly, what counts as worth testing and what doesn't — not as a one-off note, but as a decision matrix the test-generation agent checks every candidate against before writing anything.

**Worth testing:** extension methods that contain actual logic, calculated getters that derive a value from other state, anything with more than two meaningfully different outcomes ("tri-state" logic, not just true/false), mapping or transformation functions that convert one shape of data into another, string parsing, and null-safety edge cases where a missing or malformed value needs specific handling.

**Not worth testing:** the default values and generated `copyWith` methods that come from a data-class code generator (testing those tests the generator, not anything the team wrote), `fromJson`/`toJson` methods that are themselves generated, confirming an enum value merely exists, hardcoded constants, and conditional UI rendering — that last category belongs to widget tests, not unit tests, and asking a unit test to cover it either doesn't work cleanly or duplicates coverage that belongs somewhere else.

```dart
// Illustrative shape of the matrix, not the literal rule set.
enum TestworthinessVerdict { worthTesting, skip }

class UnitTestworthiness {
  static TestworthinessVerdict assess(CodeUnit unit) {
    if (unit.isGeneratedCopyWith || unit.isGeneratedSerialization) {
      return TestworthinessVerdict.skip; // tests the generator, not the team
    }
    if (unit.isHardcodedConstant || unit.isEnumExistenceCheck) {
      return TestworthinessVerdict.skip;
    }
    if (unit.isConditionalUiRendering) {
      return TestworthinessVerdict.skip; // belongs to a widget test instead
    }
    if (unit.hasBranchingLogic || unit.isDataTransformation || unit.parsesUntrustedInput) {
      return TestworthinessVerdict.worthTesting;
    }
    return TestworthinessVerdict.skip;
  }
}
```

## Why this had to be written down, not left implicit

Before this existed as an explicit rule, the quality of generated tests depended heavily on how the request was phrased in the moment — a more careful prompt got better results, a rushed one got padding. That's not a sustainable foundation for something meant to run repeatedly across many bugs and PBIs without a human re-deriving the right framing every time. Writing the matrix down once, as a rule the agent checks rather than a style the agent has to infer, made the outcome consistent regardless of how the task was initially phrased — which is exactly the property you want from something meant to run unattended more often than not.

## What's still a judgment call

Not every candidate maps cleanly onto the matrix — some logic is borderline enough that a human still needs to weigh in, and the matrix doesn't (and probably shouldn't) try to eliminate that entirely. What it does is shrink the judgment calls down to the genuinely ambiguous cases, instead of leaving every single decision to be reinvented from scratch each time a test gets generated.

## Part of a broader shift, not a one-off fix

Writing an explicit, checkable rule instead of trusting an agent's judgment on "what's worth testing" is a small instance of a larger trend researchers are calling [context engineering](https://sourcegraph.com/blog/context-engineering) — deciding deliberately what information and rules an agent has access to, rather than relying on how well a request happens to be phrased in the moment. [Context engineering is increasingly described as having overtaken prompt engineering](https://www.faros.ai/blog/context-engineering-for-developers) as the actual differentiator for reliable agent output. It's also the same instinct behind the broader move toward [spec-driven development](https://dev.to/krlz/spec-driven-development-in-2026-what-it-is-the-tooling-and-how-teams-actually-use-it-2fk2), where a precise, explicit specification becomes the source of truth an agent is expected to satisfy — a direct response to agents that write plausible code without reliably understanding what was actually meant.

## Takeaways

- "Add tests" is not a sufficient instruction for an agent — without an explicit worth-testing rule, it will happily generate coverage that tests generated code and constants instead of logic.
- Write the decision matrix down as a checkable rule, not an implicit style — consistency across runs depends on the agent having a rule to apply, not a vibe to approximate.
- A good matrix doesn't eliminate judgment calls entirely; it shrinks them down to the genuinely ambiguous cases and handles the obvious ones automatically.
