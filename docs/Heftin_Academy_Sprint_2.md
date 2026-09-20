# Heftin Academy — Sprint 2 (frontend + backend)

**Product:** Heftin Academy (e-examination)  
**Sprint:** HAC02 — Organization access ceiling  
**Date:** 2026-09-20  
**Branch:** `dev`  
**Architecture:** `docs/Proposed_Architecture_2026-09-17.md` §3  
**Taiga:** [kanban?tags=sprint-2](http://129.225.109.121:9000/project/heftin-academy/kanban?tags=sprint-2)

| Repo | URL |
|---|---|
| Backend | https://github.com/heftinai/heftin-academy-backend |
| Frontend | https://github.com/heftinai/heftin-academy-frontend |

This is the **one share file** for Sprint 2. It covers both backend and frontend. Exam catalog, prelims, mains, and evaluation screens are **not** in this sprint.

Same rights shape as NexGen Athlete and HRMS. Academy’s tenant key is **`account_id`**. Do not copy NexGen sports/payments codes here.

---

## 1. What this sprint is

Sprint 1 is auth, tenant, and a website shell. Sprint 2 puts the **Academy rights model** live:

- One word: **rights** (not permissions)
- Heftin Admin grants a **ceiling** onto the account (`organization_rights`, keyed by `account_id`)
- Org Admin holds the **full ceiling**
- Extra admins (Exam Admin, Evaluation Admin, User Admin, …) get a **subset**
- Check: `require_right` = role ∩ ceiling
- `/auth/me` returns `rights` (never `permissions`)
- Deny: `403` with `right_denied`

**Do not invent exam APIs** (patterns, tests, attempts, evaluation) in HAC02. Later modules only **add catalog rows**.

---

## 2. Shared vocabulary

| Use in Sprint 2 | Do not use (new work) |
|---|---|
| `rights` catalog | `permissions` table |
| `organization_rights` (ceiling, `account_id`) | org pack / entitlements |
| `role_rights` | `role_permissions` |
| `require_right("users.view")` | `require_permission(...)` |
| `/auth/me` field `rights` | `permissions` |
| error `right_denied` | `permission_denied` |
| One feature = one code | `*.manage` for a module with several actions |
| Tenant key `account_id` | `organization_id` on operational tables |

Login identifiers (architecture D32; implement after HAC02 unless already started): unique email; unique E.164 mobile when present; `POST /auth/login` `{ "login", "password" }`.

---

## 3. Who may do what

```
Heftin SuperAdmin
  └── rights catalog                 one code per feature
        └── organization_rights      this client's ceiling (account_id)
              ├── Org_Admin          full ceiling (no stored role_rights rows)
              ├── Extra admins       named subset (Exam Admin, Evaluation Admin, …)
              ├── Dynamic roles      HOD, Subject Head, Teacher; ticks ⊆ ceiling
              └── Student            system-in-org; rights ⊆ ceiling and audience=student
```

| Action | Who |
|---|---|
| Edit the rights catalog and bundles | SuperAdmin |
| Grant / revoke `organization_rights` | SuperAdmin |
| Create the primary Org_Admin | SuperAdmin only |
| Create extra admins (subset of ceiling) | SuperAdmin or Org_Admin |
| Tick codes onto a dynamic role | Org_Admin; every tick ∈ ceiling |
| Edit student role rights | Org_Admin; codes ∈ ceiling and `audience = student` |
| Use a tenant API | `require_right(code)` after login |

```
effective_rights(user, account) =
    if org_admin: organization_rights(account)
    else:         role_rights ∩ organization_rights(account)
```

Empty ceiling → tenant APIs `403`. Login / refresh / forgot-password / health stay public.

Scopes (optional): `subject` | `department` | `batch`. No rows = whole account.

---

## 4. Target tables (backend)

From architecture §3.2. Do **not** create a `permissions` table.

- `rights`
- `right_bundles` / `right_bundle_items` (copied into the ceiling at grant time)
- `organization_rights` (`account_id`, `right_code`)
- `roles` (`role_type`: `org_admin` | `dynamic` | `student`)
- `role_rights` (`org_admin` stores **none**)
- `user_role_assignments`
- `assignment_scopes`
- `platform_admins`

Plus identity tables already planned: `users`, `accounts`, `organizations` (1:1 with account).

---

## 5. Order of work

**Backend first:** BE-06 and BE-09, then BE-01, then 02 / 03 / 04 / 05 / 07, BE-10 after staging is locked, BE-08 closes.

**Frontend** follows AGENTS.md: types → service → page → `ProtectedRoute`. Gate on **right codes**, not role names. Do not start HAC02 FE until HAC01 login works.

Local ports (do not reuse other Heftin products): API **8001**, Vite **5174**, Postgres **5433**, Redis **6382**, Mailhog **8026**.

---

## 6. Backend tasks (HAC02-BE-01 … 10)

Repo: `heftin-academy-backend` · `feature/HAC02-BE-<n>-short-slug` from `dev`

### HAC02-BE-01 — Migrate to Academy rights tables (P0, 3d)

Create the tables in §4 keyed by `account_id`. Micro-catalog: one feature = one code. Never `*.manage` for a module with several actions. `org_admin` has zero `role_rights` rows.

**Acceptance:** Fresh migrate has no `permissions` table. Seed `org_admin` has no `role_rights` rows.

**Out of scope:** Exam patterns, tests, attempts, evaluation tables.

### HAC02-BE-02 — Heftin Admin APIs: catalog, ceiling, extra admins (P0, 3d)

Platform-only: catalog + bundles; get/replace `organization_rights` for one account; create Org_Admin; create extra admins as a dynamic role ⊆ ceiling. Atomic, revision check, audit.

**Acceptance:** Org Admin cannot call these APIs (`403 right_denied`). Unknown codes `422`. Bundle grant copies codes; later catalog edits do not auto-change existing accounts.

### HAC02-BE-03 — `require_right` = role ∩ ceiling (P0, 4d)

Every protected tenant route uses `require_right(code)`. Empty ceiling denies tenant APIs. Revoke is live on the next request. Tenant filter is `account_id` from the token, not a client-supplied id.

**Acceptance:** Role has code, ceiling does not → `403 right_denied`. Both have it → `200`. Login stays `200` without a right.

### HAC02-BE-04 — Org Admin role APIs only tick ceiling codes (P0, 3d)

Attachable codes = `organization_rights` only. FK rejects out-of-ceiling grants. Student role ticks must also match `audience = student`.

**Acceptance:** Cannot attach `tests.schedule` if it is not on the ceiling. Role list does not advertise `platform.*`. Tamper → `422`/`403`, not `500`.

### HAC02-BE-05 — Seed demo account with a full tenant ceiling (P1, 1d)

Idempotent seed so Sprint 1 login/nav keep working. Limited/empty fixtures for tests. Seed staff rights only (not a live exam module).

**Acceptance:** Fresh migrate + seed → demo Org Admin can use Sprint 1 flows. Seed twice does not duplicate rows.

### HAC02-BE-06 — Lock architecture: `account_id`, rights vocab, D32 login (P0, 2d)

Align `AGENTS.md` with `Proposed_Architecture_2026-09-17.md`: tenant key `account_id`; word **rights**; `/auth/me` field `rights`. Login identifiers specified; implementing `{ login, password }` can land with identity work if not already done.

**Acceptance:** Agents following AGENTS.md use `require_right` and `account_id`. No invented exam APIs.

### HAC02-BE-07 — Clean install and upgrade (P0, 3d)

Empty DB: migrate + seed. If a Sprint 1 schema exists, backfill ceilings. Backup/restore note for staging.

**Acceptance:** Upgrade does not drop user/account rows. After upgrade, `require_right` matches §3.

### HAC02-BE-08 — Tests (P0, 4d)

Full / limited / empty ceiling; two accounts cannot see each other; extra admin subset; `org_admin` implicit ceiling; SuperAdmin revoke on next request. Coverage test: no `*.manage` for multi-feature modules.

**Acceptance:** CI fails if a tenant route is missing `require_right`. Cover `right_denied` vs `not_authenticated`.

### HAC02-BE-09 — No literal seed password in deploy files (P0, 2d)

No plaintext seed password in `render.yaml` or committed env. Seed from env / explicit ops.

**Acceptance:** Repo has no committed seed password.

### HAC02-BE-10 — One staging path, lockfile, health/ready (P0, 2d)

Single staging deploy path. Lockfiles. `/health` (and `/ready` if the host needs it). Ports stay 8001 / 6382.

**Acceptance:** One documented staging URL. Health check is enough for the host.

---

## 7. Frontend tasks (HAC02-FE-01 … 10)

Repo: `heftin-academy-frontend` · `feature/HAC02-FE-<n>-short-slug` from `dev`  
Stack: types → `src/services/` via `import api from '@/lib/axios'` → page under `ProtectedRoute`.

### HAC02-FE-01 — Heftin Admin screen: grant account ceiling (P0, 3d)

Pick an account/org, grant/revoke codes or copy a bundle, save. Platform only. Calls HAC02-BE-02.

**Acceptance:** Org Admin cannot open this screen. Errors use `getErrorMessage`.

**Out of scope:** Exam authoring UI, billing, Google login.

### HAC02-FE-02 — Org Admin roles: only codes on the ceiling (P0, 3d)

Roles UI lists only `organization_rights` codes.

**Acceptance:** A code not on the ceiling cannot be selected. Server `422`/`403` is shown, not ignored.

### HAC02-FE-03 — Hide nav and routes using effective rights (P0, 2d)

Menu and `ProtectedRoute` use `rights` from `/auth/me`.

**Acceptance:** If `users.create` is not in effective rights, that nav is hidden **and** the route is blocked.

### HAC02-FE-04 — Auth me payload uses `rights` (P0, 2d)

`src/types/auth.ts` and auth context: `rights: string[]`. No `permissions` field on new types.

**Acceptance:** After login, UI reads `user.rights`. Refresh/`me` stays in sync.

### HAC02-FE-05 — Extra admin UI: named subset of the ceiling (P0, 2d)

Create Exam Admin / Evaluation Admin / User Admin as a dynamic role ⊆ ceiling. Pairs HAC02-BE-02 / BE-04.

**Acceptance:** Cannot tick a code not on the ceiling. That user only sees screens those codes allow.

### HAC02-FE-06 — Heftin Admin rights catalog and bundles (P0, 3d)

Platform screens for catalog rows and bundles. Bundles are a copy-at-grant shortcut, not a second RBAC.

**Acceptance:** Org Admin cannot open these screens. Save calls HAC02-BE-02.

### HAC02-FE-07 — Forbidden UI for `right_denied` (P0, 1d)

`403 right_denied` → forbidden state, not a blank page.

**Acceptance:** Direct URL without the right shows forbidden UI. No stack traces.

### HAC02-FE-08 — Empty / limited / full ceiling empty-states (P0, 1d)

Three fixtures from BE-05 / BE-08.

**Acceptance:** Empty: explain nothing is granted, hide modules. Limited: only granted modules. Full: Sprint 1 shell still works.

### HAC02-FE-09 — Session refresh keeps rights in sync (P0, 1d)

Architecture Phase 1 is one account per user. Refresh/`me` must rebuild nav after a SuperAdmin revoke. If org-switch exists, it must reload rights; if not, do not invent a second tenancy UI.

**Acceptance:** A revoke is visible after the next `me` call.

### HAC02-FE-10 — Sprint 2 FE end-to-end (P0, 2d)

Heftin Admin grants a ceiling → Org Admin creates an extra admin with a subset → that user logs in → nav/routes match. Login stays public.

**Acceptance:** Documented click-through on local or staging. No exam/prelims/mains screens invented.

---

## 8. Out of Sprint 2

Do **not** implement in HAC02:

- Exam patterns, tests, 72h windows, attempts, AI grading, mains evaluation
- A second RBAC beside `organization_rights`
- NexGen sports / HRMS payroll codes

Those later sprints only **add catalog rows**.

---

## 9. FE / BE pairing

| Frontend | Needs backend |
|---|---|
| FE-04 `me.rights` | BE-03 |
| FE-01, FE-06 ceiling / catalog UI | BE-02 |
| FE-02, FE-05 roles / extra admins | BE-04 |
| FE-03, FE-07, FE-08, FE-09 nav / forbidden / refresh | BE-03 + BE-05 fixtures |
| FE-10 E2E | BE-02, BE-03, BE-04, BE-05 |

---

## 10. Starter right codes (catalog; grant onto the ceiling)

Platform-only (never on a client ceiling): create account, list tenants, suspend, grant `organization_rights`, create extra org admins.

Tenant examples (architecture §3.5; one action = one code): `users.view`, `users.create`, `users.edit`, `roles.view`, `roles.rights.edit`, `roles.assign`, `org.profile.view`, `departments.view`, `subjects.view`, `tests.view`, `evaluations.review`, `tests.take` (student), …

Do not build Tests / Evaluation **screens** in Sprint 2. The codes exist so Heftin Admin can grant a ceiling for later sprints.
