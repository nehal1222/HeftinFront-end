# Heftin Academy — Frontend

Vite + React 19 + TypeScript + Tailwind CSS v4.

**Read `AGENTS.md` before you write code.** This is the e-examination product only (not NexGen Athlete, not Heftin IAS).

This repo currently has the **basic structure** (folders, auth client, home page). Full schema, extra features, and AI add-ons are still a team plan.

## GitHub

- Repo: https://github.com/heftinai/heftin-academy-frontend.git
- Default working branch: **`dev`**
- Production branch: `main` (do not push here)
- Backend: https://github.com/heftinai/heftin-academy-backend.git

## Git workflow (required)

```bash
git clone https://github.com/heftinai/heftin-academy-frontend.git
cd heftin-academy-frontend
git checkout dev
git pull origin dev
git checkout -b feature/HAC-FE-01-project-setup
```

Branch name = your task id + short slug.

1. Push your branch.
2. Open a Pull Request **into `dev`**.
3. **Do not merge** without approval. Never merge your own PR.

## Setup

Prerequisites: Node.js 20+.

```bash
cp .env.example .env
npm install
npm run dev
```

App: http://localhost:5174
API (backend): `VITE_API_BASE_URL` (default `http://localhost:8001/api/v1`)

Port **5174** so it does not clash with other Heftin apps on 5173.

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Local Vite server |
| `npm run build` | Typecheck + production build |
| `npm run lint` | ESLint |

## Product (what we will build)

Prelims (objective), mains (descriptive + evaluation), exam catalog, question bank, batches, students, faculty. Students only take prelims. Mains: answer sheet required; answer key optional; difficulty required.

## Org entitlements (Heftin Admin pack)

Heftin Admin assigns **roles and rights to the organization**. Org Admin then uses those rights fully inside the org and may assign them to users. They cannot add a right that is not in the pack.

Read the **Org entitlements** section in `AGENTS.md`. Taiga tasks: `HAC02-FE-*` (after Sprint 1 `HAC01-*`).

Read `docs/PROJECT_STRUCTURE.md` before adding screens.

Read [`docs/design-system.md`](docs/design-system.md) before building shared UI or updating design tokens.
