---
title: "Automating Architecture Enforcement in an AI Code-Review Agent"
description: "Prose architecture rules are ambiguous enough for a tired human reviewer to wave through a violation on a Friday — and just as ambiguous for an AI reviewer."
date: 2026-07-22
tags: [flutter, ai-agents, architecture, dev-experience]
reading_time: "5 min read"
---

# Automating Architecture Enforcement in an AI Code-Review Agent

> **TL;DR:** A written architecture rulebook is necessary but not sufficient for an AI code-review agent, for the same reason it's not sufficient for a human one — prose rules leave room to talk yourself into "this one's probably fine." Pairing the agent with a handful of small, deterministic scripts that check the highest-stakes rules turns "please check the architecture" from a judgment call into a pass/fail gate.

## The rulebook alone wasn't enough

An earlier piece in this space covered writing down Clean Architecture rules explicitly — core code never importing from features, a view-model only ever imported by its own screen, and so on — specifically so they could be checked, not just intended. That written rulebook is exactly what a code-review agent is pointed at when it evaluates a diff. But a rule stated in prose still requires interpretation: does this particular import technically cross a boundary, or is it a defensible exception? A human reviewer under deadline pressure can talk themselves into "this one's fine" on a rule that's inconvenient to enforce in the moment. An AI reviewer, working from the same prose rule, can do the same thing — it's not immune to ambiguity just because it's not human.

## What closes the gap

For the highest-stakes rules — the ones where a violation is expensive to unwind later, not just stylistically undesirable — the fix was writing small, deterministic scripts that check the rule mechanically and hand the review agent a clear pass or fail, rather than asking the agent to reason its way to a verdict from prose alone each time. A handful of these exist now, each scoped to one specific structural rule: whether the core layer stays independent of anything above it, whether dependencies across layers point in the allowed direction only, whether a view-model is being imported somewhere outside the one screen it belongs to, whether imports respect the intended hierarchy, whether a utility class stays free of the kind of hidden state that would make it non-reusable, and whether providers are structured the way the architecture expects.

```bash
# Illustrative shape of one such check, not the literal script.
#!/usr/bin/env bash
# check_core_independence.sh — fails if lib/core imports from features, data, or domain
violations=$(grep -rl "package:app/features/\|package:app/data/\|package:app/domain/" lib/core --include="*.dart")
if [ -n "$violations" ]; then
  echo "CRITICAL: lib/core has forbidden imports:"
  echo "$violations"
  exit 1
fi
exit 0
```

The review agent runs these against a diff and reports their pass/fail output directly, rather than trying to independently re-derive the same judgment from the diff's contents. For the rules marked as the most critical — the ones where letting a violation through would be genuinely costly to unwind — that mechanical check is the actual gate; the agent's own prose-level review is the second layer on top, catching things a fixed script can't (a bad naming choice, a subtly wrong but structurally valid design), not the sole line of defense on the rules that matter most.

## Why this matters more for an agent than it might seem

It would be easy to assume an AI reviewer, unlike a rushed human, will always apply a written rule perfectly and consistently. That assumption doesn't hold up in practice — an agent reasoning over prose rules is still doing interpretation, and interpretation is exactly where inconsistency creeps in, whether the reviewer is a person or a model. Converting the highest-stakes rules into something a script checks mechanically removes that interpretation step entirely for those specific rules. It's not that the agent can't be trusted with judgment — it's that the rules where a mistake is expensive shouldn't depend on judgment being exercised correctly every single time.

## A known pattern, not a new idea

Converting a written rule into something mechanically checked has a well-established parallel outside of Flutter or any single codebase: Architecture Decision Records, [a documentation format formalized well over a decade ago](https://www.nexapp.ca/en/blog/architecture-decision-records-adr), are now increasingly [paired with tooling that turns them into deterministic, pre-generation checks](https://mnemehq.com/insights/how-ai-coding-agents-use-adrs/) for AI coding agents, rather than being left as prose an agent has to interpret on the fly. The instinct behind both is identical: some rules matter enough that they shouldn't depend on correct interpretation every single time, whether the interpreter is a person or a model.

## Trade-offs

- Writing and maintaining these scripts is itself real engineering work, and a check that's too strict (or written against a rule that's since evolved) will start blocking legitimate changes, which erodes trust in the gate fast if it isn't kept current.
- Not every architectural concern reduces cleanly to a script — anything requiring judgment about intent or design quality still has to go through the agent's (or a human's) actual reasoning, not a grep pattern.
- A passing script doesn't mean a change is good, only that it doesn't violate one specific, narrow rule — treating a green check as a full architecture review would be its own mistake.

## Takeaways

- Prose architecture rules are ambiguous for AI reviewers in the same way they're ambiguous for human ones — writing the rule down isn't the same as making it unambiguous.
- Convert the highest-stakes, most expensive-to-unwind rules into small deterministic scripts so the reviewer gets a pass/fail signal instead of having to re-derive judgment every time.
- Keep the scripts scoped narrowly and maintained actively — a stale or overly strict check damages trust in the whole review gate, not just itself.
