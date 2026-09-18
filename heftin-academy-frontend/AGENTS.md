# Heftin Academy Frontend — Agent Guide (MANDATORY)

**Read and follow this file before any code change.**
If a request conflicts with these rules, follow this file and warn the user.

Also read:

- `docs/PROJECT_STRUCTURE.md` — folders and where code goes
- `docs/API_CONVENTIONS.md` — Axios, errors, env
- `README.md` — git workflow and local setup

This repo is **Heftin Academy only** (e-examination). Do not mix NexGen Athlete or Heftin IAS code here.

Tasks live in Taiga: project **Heftin Academy**, Sprint 1 `HAC01-FE-*`, entitlements `HAC02-FE-*`.

---

## How to run (review with README)

```bash
git clone https://github.com/heftinai/heftin-academy-frontend.git
cd heftin-academy-frontend
git checkout dev
git pull origin dev
git checkout -b feature/HAC-FE-01-project-setup

cp .env.example .env
npm install
npm run dev
```

App: http://localhost:5174
Need Node.js 20+. Full notes: `README.md`.

---

## Stack (do not change without asking)

- React 19 + Vite 6 + TypeScript (strict)
- Tailwind CSS v4 — tokens only in `src/index.css` `@theme`
- React Router v7
- Axios via **single** client: `src/lib/axios.ts`
- Path alias: `@/` → `src/`

---

## Git (never break)

1. Base branch is **`dev`**. Pull it before you start.
2. One task = one branch: `feature/<TASK-ID>-short-slug`
   Example: `feature/HAC-FE-01-project-setup`
3. Open a Pull Request **into `dev`**.
4. **Do not merge** to `dev` or `main` without explicit approval.
5. **Do not push to `main`.**
6. Never commit `.env` secrets.

---

## Hard rules (never break)

1. **One Axios client** — always `import api from '@/lib/axios'`. Never `axios.create`, never raw `fetch` for backend APIs.
2. **No hardcoded API URLs** — only `VITE_API_BASE_URL` from env.
3. **API calls live in services** — `src/services/<feature>.service.ts`. Pages/components call services, not `api` directly.
4. **Types first** — DTOs in `src/types/<feature>.ts` before services/pages.
5. **Reuse UI** — `@/components/ui` before inventing new buttons/inputs/tables.
6. **Use design tokens** — `bg-primary`, `text-muted`, etc. Prefer tokens over raw hex.
7. **Auth stays gated** — app pages under `ProtectedRoute`; login under `PublicOnlyRoute`.
8. **Use `@/` imports** and `cn()` from `@/lib/utils` for classNames.
9. **Keep pages thin** — layout + wiring only; business/API logic in services/hooks.
10. Authorize UI by **permission codes**, not hardcoded role names.
11. **Prelims:** students only take exams. **Mains:** answer sheet required for validate; answer key optional; difficulty required.
12. **Org pack:** Heftin Admin assigns roles/rights to the organization. Org Admin may use and assign **only** those rights. Hide nav for modules not in the pack. Tasks: `HAC02-FE-*`.

---

## Where code MUST go

| Concern | Location |
|---|---|
| Screen / page | `src/pages/<Feature>Page.tsx` or `src/pages/<feature>/` |
| Routes | `src/routes/index.tsx` + `ROUTES` in `src/lib/constants.ts` |
| Auth-gated page | Nest under `<ProtectedRoute />` + `<AppLayout />` |
| Public auth page | Nest under `<PublicOnlyRoute />` + `<AuthLayout />` |
| Shared UI | `src/components/ui/` |
| Feature UI | `src/components/<feature>/` (never put domain UI in `ui/`) |
| Layouts | `src/layouts/` |
| API | `src/services/<feature>.service.ts` |
| Auth/session | `src/contexts/AuthContext.tsx`, `src/lib/storage.ts` |
| Types | `src/types/` |
| Hooks | `src/hooks/` |
| Constants | `src/lib/constants.ts` |
| Env | `.env` / `.env.example` (`VITE_*` only) |

Exam features go under `pages/prelims`, `pages/mains`, `pages/exams`, `pages/evaluation` when you build them.

---

## New feature checklist (required order)

1. Types → `src/types/<feature>.ts`
2. Service → `src/services/<feature>.service.ts` using `api`
3. Page → `src/pages/...`
4. Feature components → `src/components/<feature>/` if needed
5. Add `ROUTES.*` + register in `src/routes/index.tsx`
6. Nav link in `AppLayout` if user-facing
7. Errors via `getErrorMessage()` — show in UI
8. Reuse `Button`, `Input`, `Select`, `Table`, `Badge`, `Card`, etc.

---

## API / Axios (required pattern)

```ts
import api from '@/lib/axios'
import { getErrorMessage } from '@/lib/axios'

export const featureService = {
  async list(params?: Record<string, unknown>) {
    const { data } = await api.get('/feature', { params })
    return data
  },
}
```

| Status | What to do |
|---|---|
| `401` | Interceptor only (refresh / redirect login). Do not duplicate in pages. |
| `403` | Forbidden UI |
| `404` | Not-found / empty state |
| `422` / `400` | Map field errors to the form |
| `500` / network | `getErrorMessage(err, '...')` |

---

## Org entitlements (read this)

Heftin Admin does **not** day-to-day assign each student’s job. Heftin Admin gives the **organization a pack** of roles and rights (permission codes). Organization Admin then runs that org using **only** what is in the pack.

Same idea as NexGen Athlete. This product’s pack is exam features (catalog, prelims, mains, evaluation, batches). Do not copy NexGen sports/payments codes here.

| Who | What they do |
|---|---|
| Heftin Admin | Create/suspend orgs. Attach a pack (which modules / permission codes this org may use). Platform-only rights stay here (`orgs.manage`, plans). |
| Org Admin | Create users and org roles. Assign rights **from the pack only**. Cannot invent a permission Heftin Admin did not grant. |
| Faculty / Student | Get a role inside the org. Effective access = role **and** org pack. |

`/auth/me` must return `permissions` (user) and `entitlements` (org pack) so nav can hide unsold modules.

Taiga: **HAC02-FE-01** Heftin Admin pack screen, **HAC02-FE-02** Org Admin roles (filtered), **HAC02-FE-03** nav/routes, **HAC02-FE-04** me payload.

Do not start HAC02 until Sprint 1 auth/RBAC (`HAC01-*`) can log in. Seed a full pack on the demo org so Sprint 1 still works.
