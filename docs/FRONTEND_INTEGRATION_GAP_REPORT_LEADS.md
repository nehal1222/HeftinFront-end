# Academy frontend integration gap report: enquiries and lead operations

**Reviewed:** 2026-10-12  
**Repository:** `heftin-academy-frontend`  
**Purpose:** adapt the supplied *Frontend Integration Report: Landing Page Contact Form and Business Lead Dashboard* to Heftin Academy, and record the implementation still needed. No application code is changed by this report.

## Scope and adaptation

The supplied report is a planning document for the **NexGen Athlete** frontend. Its endpoint names, sports terminology, routes, permission model, and implementation findings are not instructions that can be copied into Academy. In particular, Academy must retain its own terminology and the repository rule that access is expressed as **rights**, never `permissions`.

The useful product outcome is still applicable: capture public enquiries reliably and give authorized internal staff a way to review and work those leads. For Academy, terms such as *athlete count*, *sports interest*, and *business user* should become Academy equivalents such as *expected students*, *exam focus*, and the explicitly designated Academy staff role/right.

The source report states its listed lead endpoints are **proposed**. There is no Academy backend contract in this repository that confirms equivalent endpoints. Treat the API proposal below as a frontend dependency to agree with the Academy backend, not as an existing API.

## Executive assessment

The Academy frontend has a more mature shell than the source repository described in the supplied report:

- `rights: string[]` is already the auth shape, is validated during session hydration, and gates routes and navigation.
- A public `/contact` screen, a typed `contact.service.ts`, a `ContactInquiry` type, and public navigation links already exist.
- Route access denial renders the shared `AsyncState` forbidden UI rather than silently redirecting.
- The shared UI set already includes forms, state screens, buttons, cards, tables, and loading states.

However, the current contact and onboarding services intentionally convert backend failures into fake success responses. This means an enquiry can appear submitted when nothing was stored. That is the critical issue to resolve before a public lead-capture flow is considered production-ready.

No internal lead dashboard, lead list/detail route, lead types, lead service, lead navigation, status workflow, assignment UI, activity timeline, or pagination component currently exists.

## Confirmed current implementation

| Area | Current Academy implementation | Evidence |
|---|---|---|
| Product and access vocabulary | Academy-only repo; types and UI use `rights`, not `permissions`. | `AGENTS.md`, `src/types/auth.ts`, `src/lib/rights.ts` |
| Auth normalization | `/auth/me` is expected to supply `roles` and `rights`; `AuthContext` normalizes this into `AuthUser`. No duplicated `AuthProvider` exists. | `src/types/auth.ts`, `src/contexts/AuthContext.tsx`, `src/main.tsx`, `src/App.tsx` |
| Rights gating | `ProtectedRoute` supports one `requiredRight`; unauthorized users receive an in-layout forbidden state. Navigation hides entries without the required right. | `src/components/auth/ProtectedRoute.tsx`, `src/navigation/AppNavigation.tsx` |
| Public contact entry points | Home header/footer link to `/contact`; `/contact` is a public route. | `src/pages/HomePage.tsx`, `src/routes/index.tsx` |
| Current contact form | Captures name, email, optional phone, organization, category, subject, and message; has local required-field validation, loading state, and a confirmation view. | `src/pages/ContactPage.tsx`, `src/types/contact.ts` |
| Contact API layer | Uses the required shared Axios client through `contact.service.ts`. It posts to `/contact`, but catches every failure and returns a fabricated success/ticket. | `src/services/contact.service.ts` |
| Institutional request flow | `/request-access` and the B2B sign-up mode submit Academy institution/onboarding data. These likewise treat backend failure as success. | `src/pages/OnboardingRequestPage.tsx`, `src/pages/SignupPage.tsx`, `src/services/b2b.service.ts` |
| API infrastructure | One Axios instance, `VITE_API_BASE_URL`, a 30-second timeout, refresh handling, `getErrorMessage`, and generic field-error parsing are present. | `src/lib/axios.ts` |
| Shared components | `Alert`, `AsyncState`, `Button`, `Card`, `Checkbox`, `FormField`, `Input`, `Select`, `Spinner`, `Table`, and `Toast` exist. | `src/components/ui/` |
| Shared-component gaps | There is no reusable `Badge`, `Textarea`, or `Pagination`. `Table` is compositional rather than the column/data table in the source report. | `src/components/ui/index.ts`, `src/components/ui/Table.tsx` |
| Lead operations | No `lead` type/service/components/pages/routes/rights were found. | `src/types/`, `src/services/`, `src/pages/`, `src/routes/index.tsx`, `src/lib/rights.ts` |
| Tests | `package.json` has lint and build scripts but no test runner. | `package.json` |

## Gaps to close

### P0 — make public submissions truthful and contract-backed

1. Agree an Academy backend contract for the public endpoint before changing the UI. Prefer a product-specific endpoint such as `POST /public/inquiries` only if the backend adopts it; do not assume the existing placeholder `POST /contact` is real.
2. Replace the catch-all successful fallback in `contactService.submitContact`. A network, 4xx, or 5xx result must remain an error so the form can preserve data and offer retry/contact alternatives.
3. Make unauthenticated requests explicit in the Axios request configuration. The current interceptor always adds any stored bearer token and refreshes a 401; introduce the agreed `skipAuthRefresh`/`skipAuth` behaviour in the shared client before relying on it for public lead submission.
4. Align `ContactInquiry` with the agreed API DTO. At minimum the backend needs an Academy-safe equivalent of name, email, phone, organization, inquiry type, subject, message, consent, honeypot, and attribution fields.
5. Add client validation that mirrors—not replaces—server validation: valid email, phone format/length, field lengths, consent, and message limits. Use `getFieldErrors()` plus `getErrorMessage()` to show 422 fields and other failure messages.
6. Add a hidden honeypot field, consent checkbox with business-approved privacy wording, an `aria-live` error area, UTM capture, disabled inputs while submitting, and a success panel that uses only response text. Never show a client-generated ticket/reference number.
7. Decide whether `/contact`, `/request-access`, and B2B signup are separate business workflows. If they create the same lead record, consolidate their DTOs and service behavior; if not, give each a truthful success/failure contract. Do not silently merge them based on the frontend alone.

### P1 — build the Academy lead-operations shell after the read APIs exist

1. Define Academy-specific `Lead`/`Inquiry` DTOs in `src/types/lead.ts`, including the API status values, version, assignee, activity, allowed transitions, list envelope, and dashboard summary.
2. Add `src/services/lead.service.ts`. Normalize any `{ items, total, limit, offset }` envelope in the service, never in pages, and use `api` exclusively.
3. Add real Academy right codes only after they are added to the backend catalog. Suggested names to confirm with the backend: `leads.view`, `leads.assign`, `leads.update_status`, `leads.notes.create`, and a dashboard-read code. These must not use the source document's NexGen/business codes unless Academy formally adopts them.
4. Add `ROUTES` and protected pages for a lead dashboard, lead list, and lead detail. `ProtectedRoute` presently supports one required right; compose/nest guards or extend it carefully only if a page needs alternative rights. Preserve the existing forbidden state.
5. Add right-gated lead navigation to `src/navigation/AppNavigation.tsx`. Academy's `DashboardPage` has its own bespoke sidebar/navigation, so decide whether lead operations belong in that workspace, the shared navigation, or both before implementing links.
6. Create dashboard cards for agreed KPI definitions; use `AsyncState` loading/error/forbidden/not-found states and retry behavior.
7. Build a server-paginated list with URL-synchronised search and filters, `Input type="date"`, a debounced search hook, empty state, and links to detail pages.
8. Build lead detail with full submission data, status control driven by server `allowed_transitions`, assignee selector, activities/timeline, follow-up display, optimistic-version conflict recovery, and right-gated mutation controls.
9. Add reusable `Badge`, `Textarea`, and `Pagination` only where their design-system use is confirmed. Continue using Academy tokens and `cn()`; do not import raw styles from the source project.

### P2 — complete product and quality work

1. Decide the public placement: retain the standalone `/contact` page, add an inline `#contact` section to the landing page, or both. The source plan's inline-section requirement is not currently met; Academy already has clear route links.
2. Point marketing CTAs according to product intent. Today “Get Started” opens sign-up and “For Institutes” opens request access; neither should be changed to contact without a product decision.
3. Replace placeholder contact details (`hello@example.com`, `hello@heftin.com`, Delhi) and legal placeholder links with owner-approved production content.
4. Decide and implement post-login destination only if a new lead-dashboard right is confirmed. Current login safely uses a validated `returnTo`, otherwise `/dashboard`.
5. Add a manual QA checklist now. Adding Vitest/Testing Library requires approval because it changes the pinned stack/dependencies in `AGENTS.md`.

## Proposed Academy API agreement (pending backend approval)

This is an adaptation of the supplied report, not an assertion about the current backend.

| Capability | Suggested route | Request / response considerations |
|---|---|---|
| Public enquiry | `POST /public/inquiries` | Anonymous; validated fields; honeypot; consent; UTM; return a generic receipt without exposing a sequential lead number. |
| Lead summary | `GET /lead-operations/dashboard/summary` | Bearer; confirmed KPI names and definitions. |
| Lead list | `GET /lead-operations/leads` | Bearer; `q`, repeated status, assignee, date range, sort, `limit`, `offset`; return `{items,total,limit,offset}`. |
| Lead detail | `GET /lead-operations/leads/{id}` | Bearer; full data, `version`, and server-supplied `allowed_transitions`. |
| Status | `PATCH /lead-operations/leads/{id}/status` | Bearer; `{status, expected_version, note?, resolution_reason?}`; server owns transition rules. |
| Assignment | `PUT /lead-operations/leads/{id}/assignment` | Bearer; `{assignee_id: string | null, expected_version}`. |
| Activities | `GET` / `POST /lead-operations/leads/{id}/activities` | Bearer; notes and follow-ups; formalize available channels and due-date rules. |
| Assignees | `GET /lead-operations/assignees` | Bearer; only staff eligible to receive leads. |

The exact route prefix and Academy right codes need backend/product approval. All calls must remain relative to `VITE_API_BASE_URL` and reside in a service module.

## Delivery roadmap

| Phase | Outcome | Dependency | Estimate |
|---|---|---|---|
| ACAD-LEADS-0 | Confirm product ownership, Academy backend contract, privacy wording, success copy, and assignee model. | Product + backend | S |
| ACAD-LEADS-1 | Replace false-success contact/onboarding handling; contract-backed public enquiry form with validation, anti-spam, consent, UTM, and accessible errors. | Public API/CORS | M |
| ACAD-LEADS-2 | Rights catalog, routes, navigation, UI primitives, summary dashboard, and paginated/filterable lead list. | Auth rights + lead read APIs | L |
| ACAD-LEADS-3 | Detail, assignments, activities, status changes, conflict recovery, and mutation-specific authorization. | Lead mutation APIs | L |
| ACAD-LEADS-QA | Lint, build, manual acceptance pass; optionally add approved automated tests. | All prior phases | M |

## Acceptance checklist

- [ ] Public enquiry works logged out even with an expired stored session; it never reports success after a failed API request.
- [ ] Client validation, server 422 fields, rate-limit, timeout, network errors, and retry preserve the user’s entered values.
- [ ] Consent, honeypot, UTM fields, labelled controls, disabled-on-submit state, and accessible live feedback are present.
- [ ] Academy staff with the confirmed lead-view right can use dashboard/list/detail; users without it see the existing forbidden state and no lead navigation.
- [ ] List filters/search sync with URL state, pagination changes server offsets, and loading/empty/error states work.
- [ ] Detail status choices come from server `allowed_transitions`; assignment, activity, and status controls observe their separate rights.
- [ ] A stale version update refetches and tells the user the record was updated elsewhere.
- [ ] No host is hardcoded, pages do not call Axios directly, and new types/services follow `AGENTS.md`.
- [ ] `npm run lint` and `npm run build` pass.

## Decisions needed before implementation

1. Which Academy team owns submitted enquiries, and which Academy users can view, assign, and update them?
2. Are `/contact`, institutional request access, and B2B signup distinct workflows or inputs to a shared lead pipeline?
3. What are the approved privacy/consent text, thank-you copy, fallback contact method, and production contact details?
4. Will the Academy backend adopt the proposed lead API (or supply an alternative contract), including CORS for the production landing origin?
5. Is adding an automated test runner approved, or should this feature ship with lint/build and a written manual QA pass only?
