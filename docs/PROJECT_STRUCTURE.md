# Heftin Academy frontend — project structure

Use this map when adding screens, APIs, or modules. Do not invent a second layout.

## Tree

```
heftin-academy-frontend/

├── .cursor/rules/          # Cursor AI rules
├── docs/                   # Human + AI docs
├── public/                 # Static assets
├── src/
│   ├── components/
│   │   ├── auth/           # Route guards (Protected / PublicOnly)
│   │   └── ui/             # Reusable primitives (Button, Input, Card…)
│   ├── contexts/           # React context (Auth)
│   ├── hooks/
│   ├── layouts/            # AppLayout, AuthLayout
│   ├── lib/                # axios, storage, constants, utils
│   ├── pages/              # Route-level screens
│   ├── routes/             # Router definition
│   ├── services/           # API modules (one file per domain)
│   ├── types/
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css           # Tailwind + design tokens
├── AGENTS.md
├── .env.example
└── README.md
```

## Folder responsibilities

### `src/pages/`

One page ≈ one route. Keep pages as layout + wiring.

### `src/routes/`

- All routes in `src/routes/index.tsx`
- Path strings in `src/lib/constants.ts` → `ROUTES`
- Protected app pages: `<ProtectedRoute />` + `<AppLayout />`
- Guest pages: `<PublicOnlyRoute />` + `<AuthLayout />`

### `src/components/ui/`

Shared primitives only. Domain widgets (for example `ExamCard`) belong in `src/components/<feature>/`.

### `src/services/`

One service file per domain. Pages never call Axios directly.

### `src/lib/`

Infra only: HTTP client, storage keys, route constants, `cn()`.
