---
title: "Enforcing Clean Architecture in Flutter with Documented Layer Rules"
description: "Clean Architecture diagrams don't stop violations. Explicit, reviewable import rules do."
date: 2026-07-22
tags: [flutter, architecture, clean-architecture, best-practices]
reading_time: "5 min read"
---

# Enforcing Clean Architecture in Flutter with Documented Layer Rules

> **TL;DR:** A Clean Architecture diagram tells you the intended shape of a codebase. It does nothing to stop a widget from importing a repository directly at 4pm on a Friday. What stops that is a short, explicit rules document that reviewers (human or AI) can check code against.

## The problem

Most Flutter teams start with the textbook four layers — `core`, `data`, `domain`, `features` — and a clean dependency arrow pointing inward. Six months later, a `feature` imports another feature's private notifier because it was faster than exposing a shared provider, a widget builds an API payload inline because "it's just one field," and `core` quietly picks up a dependency on a feature-specific model. None of this shows up in an architecture diagram. It shows up in `flutter analyze` passing cleanly on code nobody wants to touch.

## The approach

Treat the architecture as a set of testable rules, not a picture:

- `core` never imports from `features`, `data`, or `domain`.
- A feature's ViewModel/Notifier is only imported by that feature's own screen — no cross-feature reach-ins.
- API request payloads are constructed inside repositories, never in providers or widgets.
- Response-to-domain transformation lives in one place per feature (e.g. `data/repo/<feature>/utils/`), not duplicated at the call site.

Write these down in a file that lives in the repo, not a wiki. Reference it in PR templates and in any AI coding assistant's instructions, so both human reviewers and generated code get held to the same bar.

## Implementation

The rules are only useful if something enforces them. A cheap version is a Dart test that scans import statements per directory:

```dart
// test/architecture/layer_boundaries_test.dart
import 'dart:io';
import 'package:test/test.dart';

void main() {
  test('core does not import features, data, or domain', () {
    final violations = <String>[];
    for (final file in Directory('lib/core').listSync(recursive: true)) {
      if (file is! File || !file.path.endsWith('.dart')) continue;
      final content = file.readAsStringSync();
      final forbidden = ['package:app/features/', 'package:app/data/', 'package:app/domain/'];
      for (final f in forbidden) {
        if (content.contains(f)) violations.add('${file.path} imports $f');
      }
    }
    expect(violations, isEmpty, reason: violations.join('\n'));
  });
}
```

It's not a linter plugin, it's not sophisticated, but it runs in CI, fails loudly, and takes twenty minutes to write. Teams with more investment graduate to a `custom_lint` rule that does the same check with proper diagnostics in the IDE.

## Trade-offs

- Upfront ceremony: someone has to write and maintain the rules, and they need buy-in or they get bypassed.
- Generated code (`.freezed.dart`, `.g.dart`) needs explicit exclusions from the scan.
- Rules drift from reality if nobody revisits them as the app grows new layers (e.g. a `shared/` folder that starts as UI-only and slowly grows business logic).

## Takeaways

- A diagram documents intent; a test enforces it.
- Keep the rule set small (4-6 rules) and concrete enough to check mechanically.
- Point AI assistants and human reviewers at the same document — consistency matters more than sophistication.
