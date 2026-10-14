# Academy lead operations — frontend task list

**Source:** [`FRONTEND_INTEGRATION_GAP_REPORT_LEADS.md`](FRONTEND_INTEGRATION_GAP_REPORT_LEADS.md)  
**Status:** proposed frontend tasks

The IDs below are descriptive placeholders, not existing Taiga IDs. The supplied `[HAC01-FE-05] Authentication UI` format is used as the task template; that authentication task itself is not part of this lead-operations scope. Assign final sprint/task IDs before implementation.

## [HAC-LEADS-FE-01] Public enquiry capture

### Scope

- Confirm the Academy public-inquiry API contract, permitted landing origin/CORS, privacy/consent wording, thank-you copy, fallback contact method, and whether contact, request-access, and B2B signup are separate workflows or one lead pipeline.
- Add explicit public-request support to the shared Axios client so anonymous inquiry calls do not attach a stale bearer token or enter the 401 refresh flow.
- Replace the fabricated-success behavior in `contactService` and any agreed shared onboarding service flow.
- Align contact DTOs and the public form with the approved Academy contract: organization/institute details, inquiry type, consent, hidden honeypot, UTM fields, validation, 422 field errors, rate-limit/network retry, accessible feedback, and real success state.
- Decide whether the existing `/contact` route remains the only entry point or an inline `#contact` section is also required; retain “Get Started” and “For Institutes” destinations unless product approves a change.

### Acceptance

- Public enquiry submits without login, including when an expired token exists in storage.
- A failed request never displays a success/ticket; entered form values remain available for correction or retry.
- Client validation covers agreed required fields, email, phone, length limits, consent, and honeypot behavior; server 422 messages appear against their inputs.
- Inputs are labelled and disabled while submitting; feedback is announced through an `aria-live` region.
- Success displays only approved response/copy and no client-created or sequential reference number.
- All service calls use `@/lib/axios`, a relative API path, and the approved DTO; no API host is hardcoded.

### Dependencies

- Approved Academy public endpoint and response/error contract.
- Business-owner content and production contact details.

## [HAC-LEADS-FE-02] Lead dashboard and searchable list

### Scope

- Add confirmed Academy lead/dashboard right codes to the backend catalog and frontend `RIGHTS` map; use **rights**, never permissions.
- Create `src/types/lead.ts` and `src/services/lead.service.ts`, including list-envelope normalization and dashboard DTOs.
- Add shared `Badge`, `Textarea`, and `Pagination` only as needed, using Academy design tokens and the established UI export pattern.
- Add protected routes, `ROUTES` constants, and right-gated navigation for the lead dashboard and list; retain the existing forbidden state for users without access.
- Build KPI cards, server-paginated table, URL-synchronised/debounced search, status/assignee/date filters, and loading/error/empty/retry states.
- Decide where lead navigation belongs relative to the bespoke `DashboardPage` navigation, and send a user holding the confirmed dashboard right to the lead dashboard after login only if product approves it.

### Acceptance

- Only users with the confirmed Academy lead-view/dashboard right see the lead navigation and can open dashboard/list routes; all others see the forbidden state.
- Dashboard KPI values, loading, error, and retry behavior use the backend summary response.
- List search and filters update the URL; pagination updates the server offset; empty, loading, and failed responses have clear states.
- The list uses server data only, links each row to its detail route, and normalizes `{ items, total, limit, offset }` in the service rather than a page.
- New types precede services and pages; all API access goes through the single Axios client.

### Dependencies

- Confirmed Academy rights catalog and lead read APIs: summary, list, detail, and assignees.

## [HAC-LEADS-FE-03] Lead detail and staff actions

### Scope

- Build lead detail with the full enquiry, assignee, current status, activity timeline, and follow-up information.
- Add components for a status badge/control, assignee selector, timeline, and note/follow-up form.
- Implement status, assignment, and activity services with version-aware mutation payloads and refetch after a successful mutation.
- Drive status choices from backend `allowed_transitions`; do not hardcode an Academy state machine in the client.
- Gate assignment, status change, and note/follow-up controls by their individual confirmed rights.
- Handle 403, 404, validation errors, invalid state transitions, and `lead_version_conflict` consistently with existing `AsyncState`, `getFieldErrors`, and `getErrorMessage` patterns.

### Acceptance

- Detail renders a valid lead, an empty/not-found state for 404, and an access-denied state for missing rights.
- Available status choices exactly match the server response; closing/unqualifying requires the server-required resolution reason.
- Assignment, activity creation, and follow-up data use the latest lead `version` and replace/refetch local data after success.
- A version conflict refetches the lead and tells the user it was updated elsewhere.
- Users without a mutation right can view only the controls allowed by their effective `rights`; server responses remain authoritative.

### Dependencies

- Confirmed lead detail, activities, status, assignment, and assignee endpoints plus their error contracts.

## [HAC-LEADS-FE-04] Production readiness and verification

### Scope

- Replace remaining placeholder public contact details and legal URLs with approved production values.
- Write and execute a manual QA checklist spanning public enquiry, access control, dashboard/list, mutations, and conflict recovery.
- Confirm the production API origin is in backend CORS configuration and that rate-limit, timeout, and network failures have usable user-facing fallbacks.
- Run lint and production build; fix feature regressions.
- Request approval before adding Vitest/Testing Library. If approved, add focused tests for form error handling, rights-gated routes/navigation, list URL state, and conflict recovery; otherwise record the manual test evidence.

### Acceptance

- Public enquiry covers valid submit, validation failures, server 422, 429, timeout/network retry, double-submit prevention, and expired-token behavior.
- Rights behavior is verified for an authorized lead operator, a user without lead rights, and a platform/admin user with the approved lead rights.
- Dashboard/list covers loading, error/retry, empty results, filters/search URL state, and pagination; detail covers assignments, activities, status validation, 404/403, and conflicts.
- Approved marketing/legal/contact copy is in place and production CORS is verified by a real public-form request.
- `npm run lint` and `npm run build` pass; automated-test additions occur only after explicit stack approval.

### Dependencies

- Completion of the preceding three tasks and access to an Academy staging environment.
