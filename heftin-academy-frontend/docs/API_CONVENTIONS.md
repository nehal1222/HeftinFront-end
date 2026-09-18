# Frontend API conventions

- Only client: `import api from '@/lib/axios'`
- Feature APIs: `src/services/<feature>.service.ts`
- Types: `src/types/<feature>.ts`
- UI errors: `getErrorMessage(err, fallback)`
- `401`: interceptor only (refresh / redirect) — do not duplicate in pages
- Normalize backend envelopes in services, not pages
- Never hardcode hosts; use `VITE_API_BASE_URL`

Backend base (local): `http://localhost:8001/api/v1`
