---
id: 0001
title: "Static React SPA built by Vite, served by Nginx in production"
status: accepted
kind: infra
opened: 2026-08-01
decided: 2026-08-01
branch: ~
supersedes: ~
superseded-by: ~
---

# WORK-0001 — Static React SPA built by Vite, served by Nginx in production

| | |
|---|---|
| **Opened** | 2026-08-01 |
| **Status** | accepted |
| **Kind** | infra |
| **Supersedes** | — |
| **Superseded by** | — |

## Problem

The portfolio site is a content-light personal site. It needs fast builds, a
good developer experience, and simple production deployment. There is no
server-side rendering requirement.

## Decision

React 18 + TypeScript SPA, built with **Vite**, served by **Nginx** in a Docker
container. No SSR, no Next.js, no meta-framework.

## Options considered

| Option | Pros | Cons | Chosen? |
|---|---|---|---|
| Vite + Nginx (static SPA) | Sub-second HMR; simple deployment (just serve files); no Node.js in production | No SSR; initial HTML is empty shell (SEO via client-side) | ✓ |
| Next.js | SSR/SSG; better SEO out of the box | Overkill; Node.js required in production container | ✗ |
| Create React App | Familiar | Deprecated; slow builds; Webpack | ✗ |

## Consequences

**Positive:**
- Production container is just `nginx:alpine` + static files — minimal attack surface
- `npm run build` produces a `dist/` folder; Nginx serves it directly
- Vite HMR is near-instant during development

**Negative / Trade-offs accepted:**
- SEO depends on client-side rendering (acceptable for a personal portfolio)
- All routing is client-side; Nginx must be configured to rewrite all paths to
  `index.html` (already done in `nginx.conf`)

**Risks / Open questions:**
- None outstanding.

## Definition of done

- [x] `nginx.conf` handles SPA routing: all `404`s fall back to `index.html`
- [x] Docker multi-stage: build stage (`node`) → production stage (`nginx:alpine`)
- [x] No environment variables baked into the build; runtime config fetched
      from the API or hardcoded at build time via `import.meta.env`

## Log

- 2026-08-01 accepted — decision made at project inception; migrated from
  ADR-0001 to this work item format

---

> **For AI agents:** Do NOT implement this work item unless status is
> `accepted` or `building`. If status is `proposed`, surface it to the user
> for a decision before writing any code. If status is `superseded`, follow
> the item in `superseded-by` instead — do NOT implement the pattern
> described here. If you are about to contradict an `accepted`, `building`,
> `shipped`, or `operating` item, stop and surface it to the user before
> proceeding.
