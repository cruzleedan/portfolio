# Articles Index

Technical articles on Flutter development, deployment, best practices, AI integration, and developer experience. Grouped by topic; each article follows the same template (TL;DR, context, approach, code, trade-offs, takeaways).

## architecture/
- [Enforcing Clean Architecture in Flutter with Documented Layer Rules](architecture/clean-architecture-layer-rules.md) — import rules as tests, not diagrams
- [Immutable State the Right Way: Riverpod Notifiers + Freezed](architecture/riverpod-notifiers-freezed-immutable-state.md) — Notifier + Freezed to eliminate mutation bugs
- [Building a Composable Theme System with ThemeExtension in Flutter](architecture/composable-theme-system-theme-extensions.md) — design tokens as strongly-typed theme extensions
- [GoRouter at Scale: Shell Routes, Route Guards, and Custom Transitions](architecture/gorouter-at-scale-shell-routes-guards-transitions.md) — redirect, refreshListenable, ShellRoute

## networking/
- [Versioned REST APIs in a Flutter Client: Lessons from Dio Interceptors](networking/versioned-rest-apis-dio-interceptors.md) — adapters per API version behind one domain interface
- [Handling "200 OK, Actually an Error" APIs Gracefully in Dio](networking/handling-200-ok-error-responses-dio.md) — normalizing embedded error payloads via interceptor

## ai-integration/
- [Wiring Third-Party OCR into a Mobile Form: An Expense Capture Pipeline](ai-integration/wiring-third-party-ocr-veryfi-expense-pipeline.md) — mapper → matcher → tax handler → orchestrator
- [Field-Level Data Population Rules: When Not to Overwrite User Input](ai-integration/field-level-data-population-rules.md) — a centralized, testable auto-fill policy
- [Quick Capture: Three Capture Modes Behind One Button](ai-integration/quick-capture-three-modes-one-button.md) — one camera button, three distinct capture flows

## testing/
- [Testing Riverpod Notifiers: Patterns That Actually Scale](testing/testing-riverpod-notifiers-patterns.md) — ProviderContainer over widget pumping

## deployment/
- [Compile-Time Environment Config: One Codebase, Dev/Prod Without Duplication](deployment/compile-time-environment-config-flutter.md) — --dart-define + a single Environment singleton
- [Orchestrating Codegen in a Flutter Release Pipeline](deployment/build-runner-ant-codegen-release-pipeline.md) — one named build target per environment

## dev-experience/
- [Localizing a Flutter App Across Multiple Locales Without the Boilerplate Pain](dev-experience/localizing-flutter-app-six-locales.md) — ARB + gen-l10n plus a thin call-site wrapper
- [Choosing a Crash Reporting Tool: What a Store Console Crash Log Can't Tell You](dev-experience/choosing-crash-reporting-tool-gap-analysis.md) — one real crash run through both tools, not a feature chart

## security/
- [Why Classic SSL Pinning Doesn't Fit an App With a User-Supplied Server URL](security/certificate-verification-user-supplied-server.md) — trust-on-first-connect as the honest middle ground

## hiring-and-interviews/
- [What Separates a Mid-Level Answer From a Senior One in a Flutter Interview](hiring-and-interviews/senior-flutter-interview-what-separates-levels.md) — five topics, and where thin-but-correct answers fall short

## feature-deep-dives/
- [Multi-Currency Exchange Rate Handling in an Expense Form](feature-deep-dives/multi-currency-exchange-rate-expense-form.md) — rate values need a source, not just a number
- [Designing a Batch-Action Approval Workflow](feature-deep-dives/batch-action-approval-workflow.md) — tri-state select-all, intersection-based action visibility
- [Building a Debounced, Favorites-Aware Lookup Field](feature-deep-dives/debounced-favorites-aware-lookup.md) — one configurable typeahead component, reused across features
- [The Biometric Enrollment Prompt: Opt-In UX Without Being Annoying](feature-deep-dives/biometric-enrollment-prompt-ux.md) — post-login prompt with a real "never ask again"
- [Auto-Matching Corporate Card Charges to Expense Lines](feature-deep-dives/auto-matching-card-charges-reconciliation.md) — a four-state match model instead of a boolean
- [Filename and Attachment Validation for Receipt Uploads](feature-deep-dives/filename-attachment-validation-receipt-uploads.md) — sanitizing phone-sourced file names before upload

## sso-enterprise-auth/
- [Dual-Stack OIDC in Flutter: Routing Between Two Auth Libraries at Runtime](sso-enterprise-auth/dual-stack-oidc-msal-appauth-routing.md) — one interface, two implementations, picked at runtime
- [Supporting Device-Compliance Access Policies in Mobile: The Broker Pattern Explained](sso-enterprise-auth/entra-conditional-access-broker-pattern.md) — why a browser can't prove device compliance but a broker app can
- [Implementing Windows-Integrated Auth on Mobile: A Native HTTP Adapter, Not a Dart Library](sso-enterprise-auth/ntlm-kerberos-native-http-adapter.md) — connection-level auth belongs in the native HTTP stack
- [Handling Token Expiry Gracefully: Proactive Refresh, Reactive Fallback, Relogin Modal](sso-enterprise-auth/handling-401-token-expiry-relogin-modal.md) — three escalating layers of session-expiry handling
- [Forking an Auth SDK: Adding a Missing Parameter to Meet a Backend Security Requirement](sso-enterprise-auth/forking-auth-sdk-oidc-nonce-support.md) — a small, tracked fork beats weakening a security control
- [Platform Trust Stores on Android: Why a Custom CA Breaks One Auth Path but Not Another](sso-enterprise-auth/android-trust-stores-custom-ca-custom-tabs.md) — WebView, browser tabs, and native brokers each read a different trust store
- [Refresh Tokens and Missing Nonce Claims: A Silent Re-Authorize Fallback](sso-enterprise-auth/okta-refresh-token-missing-nonce-fallback.md) — spec-compliant gaps between identity providers, handled gracefully
- [Testing OAuth Flows in Flutter: Where Mocks End and Real Sandboxes Begin](sso-enterprise-auth/testing-oauth-flows-flutter.md) — unit-test the app-side logic, sandbox-test the real handshake
- [A Layered Auth Architecture: Domain Entities, Services, Repos, and Providers](sso-enterprise-auth/layered-auth-architecture-flutter.md) — keeping "add an identity provider" an additive change

## flutter-migration-journey/
- [16 Months Into a Legacy-to-Flutter Migration: Where We Actually Are](flutter-migration-journey/progress-report-legacy-to-flutter.md) — status, scope not yet started, and a revised timeline
- [The 1:1 Migration Myth: Why "Just Port the Screens" Didn't Survive Contact with Reality](flutter-migration-journey/one-to-one-migration-myth.md) — receipt capture and expense-line saving, before and after
- [Flutter vs. PWA vs. Ionic vs. Roll-Your-Own: How We Actually Chose a Mobile Framework](flutter-migration-journey/choosing-flutter-over-alternatives.md) — what each spike was evaluating, and why the debate was close
- [What Changed When We Stopped Running Two-Week Sprints](flutter-migration-journey/velocity-after-dropping-sprint-rituals.md) — how a process change moved a multi-year estimate to next year
- [Inheriting a Shared Design System We Didn't Originally Build](flutter-migration-journey/inheriting-a-shared-design-system.md) — versioning and review as the safety valve for cross-team ownership
- [Migrating Off a Legacy API: Different Shapes, Missing Fields, Multiple Server Versions](flutter-migration-journey/migrating-off-legacy-api.md) — why an "endpoint swap" turned into a data-modeling problem
- [Debugging Then vs. Now: Chrome DevTools, Hot Reload, and What Still Isn't Solved](flutter-migration-journey/debugging-then-vs-now.md) — trading browser tooling fluency for a faster UI iteration loop
- [Evaluating Legacy App Support for Enterprise MDM Conditional Access](flutter-migration-journey/legacy-app-mdm-conditional-access-evaluation.md) — the legacy app is still in production mid-migration, and still fields new requests

## ai-agentic-sdlc/
- [From Sprints to an Agentic SDLC: Redesigning How Work Actually Gets Done](ai-agentic-sdlc/from-sprints-to-agentic-sdlc.md) — an honest, still-in-progress account of using AI agents at every stage
- [Giving AI Agents Ownership of Pipeline Stages](ai-agentic-sdlc/giving-agents-ownership-of-pipeline-stages.md) — why several narrow agents beat one general-purpose assistant
- [Where We Still Draw the Line: When Manual Coding Beats an AI Agent](ai-agentic-sdlc/when-manual-coding-beats-an-agent.md) — three reasons manual coding still wins, and why the line keeps moving
- [Building a Decision Matrix So an Agent Knows What's Worth Unit Testing](ai-agentic-sdlc/decision-matrix-for-agent-unit-testing.md) — an explicit testable/skip rule instead of "add tests"
- [Automating Architecture Enforcement in an AI Code-Review Agent](ai-agentic-sdlc/automating-architecture-enforcement-for-ai-review.md) — deterministic scripts for the rules too expensive to leave to judgment
- [Keeping a Human in the Loop: Confirmation Gates in an Agent-Driven Pipeline](ai-agentic-sdlc/confirmation-gates-in-agent-pipeline.md) — narrow, well-placed stops instead of one big "are you sure?"
- [Teaching an Agent to Triage: A Shared Severity Framework for Humans and AI](ai-agentic-sdlc/shared-severity-framework-for-humans-and-agents.md) — one rubric, so a disagreement becomes a checkable claim
- [Two Teams, Two Bets on Agentic Development: A Case Study](ai-agentic-sdlc/two-teams-two-bets-on-agentic-development.md) — task-scoped pipeline agents vs. role-scoped persona agents, compared in depth
- [A How-To Guide: Designing Role-Scoped AI Agents for a Legacy Modernization](ai-agentic-sdlc/how-to-role-scoped-agents-for-legacy-modernization.md) — a generalized, step-by-step guide for when the target architecture isn't settled yet
- [A How-To Guide: Designing "Artifacts" — Documentation an AI Agent Can Actually Rely On](ai-agentic-sdlc/how-to-design-agent-readable-artifacts.md) — structured, addressable records vs. free-form docs an agent has to interpret
