# Conflicts

Where the documents and the code disagree, so the disagreement is settled once and not built in
twice. Newest facts win; a conflict is closed when the loser is changed, not when it is noted.

| | |
|---|---|
| Last updated | 2026-09-30 |
| Frontend side | "Organization & Roles — Implementation Report", dated 2026-09-29 (a frontend **prototype**, not merged). **Only the report was read; the prototype code was not** |
| Backend side | `Heftin_Academy_Sprint_2.md` and `Proposed_Architecture_2026-09-17.md` (this folder), and the backend as it stands on `dev` |
| Scope | C1 to C5: frontend prototype report vs backend spec. C6 and C7: backend side (a doc copy and two branches) |
| Open | 7 conflicts (C1 to C7), 7 gaps (G1 to G7), 1 open question (Q1) |

**Verdict.** The prototype's target direction matches the backend: rights instead of permissions, an
organization ceiling, roles as subsets of it, no plans in authorization, access decided by codes and
not by role names. Five points conflict with the spec (C1 to C5), two more conflicts sit on the
backend side (C6, C7), and the backend has nothing yet for a frontend to integrate against (§4).

---

## 1. What already matches

- **One word: rights.** The report replaces `permissions` with `rights` and drops the separate
  entitlement layer (Sprint 2 §2; architecture §3.1).
- **Plans are not authorization.** The plan selector and `SubscriptionPlan` are to be removed.
- **No `individual` role.** The system creates only organization accounts.
- **Dynamic roles.** Org-defined roles (HOD, Subject Head, Teacher) replace the fixed `faculty` role.
- **Ceiling model.** Role rights bounded by the organization's rights.
- **Gate on codes, not roles.** `requiredRight="…"` on routes and navigation (FE-03).
- **`src/types/auth.ts`** carrying `account_id` and `rights` (FE-04).
- **The two admin pages** are reusable as layouts, once repurposed (C3).

## 2. Conflicts

### C1. Effective rights are computed on the client

| | |
|---|---|
| Report | §8 flow and §9.3: load organization rights, load role rights, filter on the client |
| Spec | The server computes them, per request ([architecture §3.3](Proposed_Architecture_2026-09-17.md)). `/auth/me` returns effective `rights` and `scopes` ([Sprint 2 FE-03, FE-04](Heftin_Academy_Sprint_2.md)) |
| Why it breaks | `org_admin` stores **no** `role_rights` rows and holds the whole ceiling implicitly, so a client intersection gives the Org Admin an empty set. The ceiling APIs are platform-only (BE-02), and the spec defines no tenant endpoint that returns it. A revoke is live on the server's next request, which a client calculation cannot see |
| Fix | Read `user.rights` from `/auth/me` and gate on it. No role-rights or org-rights arithmetic in the frontend. The role editor is the only screen that needs the ceiling, and it gets it from the role APIs (BE-04) |

### C2. Scopes are missing

| | |
|---|---|
| Report | `AuthProfile { account_id, role, rights }` (§9.1). No departments, batches or scope picker |
| Spec | Scopes are core to Sprint 2: `scopes: { type, id }[]` in `/auth/me` (FE-04); department and batch screens and a scope picker (FE-11); a scoped assignment fails closed on a route with no resource scope (BE-12) |
| Why it breaks | A batch-scoped teacher's `users.view` does not open the org-wide user list. Gating on `rights` alone would show items that then return `403` |
| Fix | Add `scopes` to the auth type and plan FE-11. How a scoped right appears in `rights` is for the `/auth/me` contract to define (Q1) |

### C3. Onboarding request page and onboarding queue

| | |
|---|---|
| Report | `OnboardingRequestPage` and the SuperAdmin onboarding queue are kept (§6); the plan is to connect them to backend APIs (§9.6) |
| Spec | "The onboarding request front door" is **out of Sprint 2** ([Sprint 2 §8](Heftin_Academy_Sprint_2.md)). It is unscheduled ([architecture §8.1](Proposed_Architecture_2026-09-17.md)): an `onboarding_requests` table, a public rate-limited CAPTCHA form, and a form that never creates an account. Until then the SuperAdmin creates the organization and its Org Admin directly (D6) |
| Why it breaks | There is no table, API or sprint to connect it to |
| Fix | Do not build onboarding UI in HAC02. Repurpose the SuperAdmin page as the ceiling grant (FE-01) and the catalog and bundles screens (FE-06). Park the onboarding pages until §8.1 is scheduled |

### C4. Right codes that do not exist, and a frontend "source of truth"

| | |
|---|---|
| Report | §7.2 and §9.2 use `users.disable`, `content.view/create/edit`, `exams.view/create/edit`, and propose one frontend catalog of codes |
| Spec | The catalog is the backend `rights` table, edited only by the SuperAdmin ([architecture §3.5](Proposed_Architecture_2026-09-17.md)). Sprint 2 codes: `users.view/create/edit/deactivate/reset_password`; `roles.view/create/edit/delete/rights.edit/assign`; `org.profile.view/edit`; `audit.view`; `departments.*`; `batches.*` ([Sprint 2 §10](Heftin_Academy_Sprint_2.md)). Later modules use `subjects.*`, `material.*`, `questions.*`, `patterns.*`, `tests.*`. There is no `content.*` or `exams.*`, and no exam screens in Sprint 2 |
| Why it breaks | A gate on `users.disable` or `exams.view` never matches, so its screen stays hidden forever. A second catalog in the frontend drifts from the real one |
| Fix | Use the exact codes above. Keep typed constants only for codes the UI actually gates on. List the catalog from the API (BE-02) on the platform screens |

### C5. The SuperAdmin is modelled as a role

| | |
|---|---|
| Report | §7.4 lists SuperAdmin beside `org_admin`, dynamic roles and `student`; `AuthProfile.account_id` is a non-null string |
| Spec | `roles.role_type` is only `org_admin`, `dynamic` or `student` ([architecture §3.2](Proposed_Architecture_2026-09-17.md)). The SuperAdmin is a row in `platform_admins`, a user whose `account_id` is null, checked through that table and not bound by any ceiling. Platform-only rights (`is_platform`) never sit on a client ceiling |
| Why it breaks | A non-null `account_id` cannot represent the SuperAdmin, and a role-name check is the pattern the spec forbids (FE-03) |
| Fix | Make `account_id` a nullable string and carry a platform indicator. The contract for a platform admin's `/auth/me` is not written yet (Q1) |

### C6. Repo copy of the architecture predates D34

A conflict on the backend side, found while checking [PR #6](https://github.com/heftinai/heftin-academy-backend/pull/6)
(HAC01-BE-06, open).

| | |
|---|---|
| Source | `academy_ignore/Proposed_Architecture_2026-09-17.md` has D34 and the `accounts` / `organizations` shape as built: UUID ids, a composite FK, `updated_at`, and **no** `status` on `organizations` |
| PR #6 | Its copy at `docs/Proposed_Architecture_2026-09-17.md` (729 lines against 733) still has the older §2: no UUIDs, `organizations ... status`, no composite FK, and no D34. Its copy of `Heftin_Academy_Sprint_2.md` is identical to the source |
| Why it breaks | Merging it would put a description in `dev`'s docs that contradicts the merged code (PR #4) |
| Fix | Refresh the repo copy from this folder before PR #6 merges (Academy `CLAUDE.md` §2 already says the source wins) |

### C7. BE-05's branch and PR #6 change the same files

| | |
|---|---|
| Branches | `feature/HAC01-BE-05-login-identifier-rules` (`a0823c4`, no PR) and [PR #6](https://github.com/heftinai/heftin-academy-backend/pull/6) (BE-06, `da906b3`, open) |
| Facts | A merge simulation on 2026-09-30 gives content conflicts in `app/core/config.py`, `app/core/security.py` and `pyproject.toml`; `.env.example` merges. Each branch merges cleanly into `dev` on its own |
| Why it matters | Both build the auth core. PR #6 adds Argon2id hashing, makes `SECRET_KEY` required and swaps `passlib[bcrypt]` for `argon2-cffi`. BE-05's branch edits the same three files. Whichever merges second has to be reworked |
| Fix | Agree the order and who owns `security.py`. BE-06 is the dependency of BE-05 and BE-07, so it is the natural first, with BE-05 rebasing onto it. Not yet raised with either owner |

## 3. Gaps: in the frontend spec, absent from the report

| # | Gap | Spec |
|---|---|---|
| G1 | Forbidden state for `403 right_denied`, never a blank page | FE-07 |
| G2 | Empty, limited and full ceiling states | FE-08 |
| G3 | Rights rebuilt from `me` after a SuperAdmin revoke | FE-09 |
| G4 | Role editor lists only codes the editor holds (no self-escalation) | FE-02, FE-05; BE-04 |
| G5 | The student role accepts only student-audience codes | architecture §3.4 |
| G6 | Errors are `{ code, message, fields }`; a stale ceiling revision shows a reload prompt | FE-01; API conventions |
| G7 | The client never sends `account_id`; tenant comes from the token. UI hiding is convenience, and the server's `require_right` is the real check | architecture §3.3; `CLAUDE.md` §5 |

## 4. Backend readiness, 2026-09-30

Read from GitHub. `origin/dev` is `db63bd8`.

| Frontend needs | State |
|---|---|
| `accounts`, `organizations` | **Merged** ([PR #4](https://github.com/heftinai/heftin-academy-backend/pull/4), 2026-09-29) |
| `users` | **Merged** ([PR #5](https://github.com/heftinai/heftin-academy-backend/pull/5), BE-03; migration `7c1e5a9d3b20`) |
| Password hashing and auth core | [PR #6](https://github.com/heftinai/heftin-academy-backend/pull/6) open (BE-06; see C6, C7) |
| Login endpoint (BE-07) | No branch. BE-05's branch has auth files but no PR |
| `/auth/me` (BE-10) | No branch |
| Rights tables, ceiling, `require_right`, scopes (HAC02) | No HAC02 branch on the remote |

There is no login, no `/auth/me` and no rights model to integrate with yet, and the spec says HAC02
frontend work waits until HAC01 login works. Until then the prototype can only be rebuilt against
mock data shaped like the spec.

## 5. Open question

**Q1. The `/auth/me` contract.** The spec fixes `rights: string[]` and `scopes: { type, id }[]`
(FE-04), but not: how a *scoped* assignment's rights appear in `rights`; what a platform admin's
response looks like (`account_id` null, a platform flag); or whether `role` is returned at all (it may
be shown, never used to gate). Owner: backend, in BE-10 and BE-12. Frontend types should wait for it.

## 6. Other conflicts on record

Tracked in [archive/0_tracking_sprint1.md](archive/0_tracking_sprint1.md), not repeated here:

- **Postgres 18 on Neon, 16 in Compose, CI and the docs.** Undecided.
- **BE-05's branch had its own root migration** (R1). Since resolved on the branch: it merged `dev`
  and dropped it.
