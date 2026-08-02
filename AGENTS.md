# Portfolio — Project Guide

Personal portfolio site.  
**Stack:** React 18 · TypeScript · Vite · Tailwind CSS  
**Live at:** `cruzleedan.work`

---

## Directory Structure

```
portfolio/
├── src/                    # React source
├── posts/                  # Blog/content posts (Markdown)
├── public/                 # Static assets
├── index.html
├── Dockerfile
├── nginx.conf              # Static file serving in production
└── docker-compose.yml
```

---

## Common Commands

```bash
npm run dev           # Dev server (hot reload)
npm run build         # Production build → dist/
npm run preview       # Preview production build locally

# Docker (production)
docker compose up -d --build portfolio-app
```

---

## Conventions

- Static site served by Nginx in production (`nginx.conf`)
- Content posts live in `posts/` directory
- Tailwind for all styling — no separate CSS files unless unavoidable
- `npm run build` must succeed before any deployment

## Checklist for New Code

- [ ] `npm run build` succeeds with no TypeScript errors
- [ ] New components follow existing component patterns in `src/`
- [ ] No hardcoded URLs (use env vars or config)

---

## Context

Architectural decisions and proposals live in `context/work/` (see
`context/work/0001-static-spa-vite-nginx.md`). Release conventions are in
`context/RELEASING.md`. Log framework friction (not code bugs) in
`context/friction.md`.
