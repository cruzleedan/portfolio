---
title: "Orchestrating Codegen in a Flutter Release Pipeline"
description: "Wrapping build_runner and platform builds behind a single scripted target avoids scattering flags across READMEs and CI configs."
date: 2026-07-22
tags: [flutter, deployment, ci-cd, build-tools]
reading_time: "5 min read"
---

# Orchestrating Codegen in a Flutter Release Pipeline

> **TL;DR:** A Flutter app with Freezed, json_serializable, and localization codegen has multiple build steps that must run in the right order before a real build starts. Wrapping them behind named build targets — one per environment — turns "remember to run build_runner, then flutter build, with these six flags" into one command a new team member can run correctly on day one.

## The problem

`flutter build` alone isn't enough once code generation is in the mix: `.freezed.dart` and `.g.dart` files have to be current, localization files need to be generated from ARB sources, and release builds need different flags entirely (obfuscation, split debug info, environment defines) than debug builds. If this sequence lives only in a README, it drifts out of date, and CI configs end up with a slightly different sequence than what developers run locally.

## The approach

Define one build target per environment, each of which runs codegen first, then the platform build with the right flags. The exact tool (Make, a shell script, Melos, or in some codebases a legacy Ant `build.xml`) matters less than having a single named entry point per environment that nobody has to reconstruct from memory:

```xml
<target name="android_prod" depends="codegen">
  <exec executable="flutter">
    <arg line="build apk --release --obfuscate --split-debug-info=build/debug-info --dart-define=ENV=prod"/>
  </exec>
</target>

<target name="codegen">
  <exec executable="flutter">
    <arg line="pub run build_runner build --delete-conflicting-outputs"/>
  </exec>
</target>
```

The equivalent as a shell script, for teams without a legacy build tool already in place:

```bash
#!/usr/bin/env bash
set -euo pipefail
flutter pub run build_runner build --delete-conflicting-outputs
flutter gen-l10n
flutter build apk --release --obfuscate --split-debug-info=build/debug-info --dart-define=ENV=prod
```

CI calls the exact same target/script developers use locally — there is no separate "CI version" of the build sequence to keep in sync.

## Trade-offs

- `--delete-conflicting-outputs` is necessary once generated files can go stale, but it means a `build_runner` failure can leave generated files deleted and not regenerated — worth failing the build loudly rather than continuing.
- Obfuscation (`--obfuscate --split-debug-info`) makes crash reports unreadable without the corresponding debug-info archive; that archive needs to be retained per release build, matched to its version, or crash symbolication breaks.
- A build tool unfamiliar to the team (Ant, in codebases that predate more common Flutter tooling) has an onboarding cost; documenting the target names and what each one does matters more than the tool choice itself.

## Takeaways

- One named target per environment beats a README of flags — it's the difference between "run the prod build" and "reconstruct the prod build correctly from memory."
- Codegen is a build dependency, not a separate manual step; wire it into the same target so it can't be forgotten.
- Keep local and CI builds calling the identical script/target — divergence between them is where "works on my machine" release bugs come from.
