# Heftin Academy - Frontend Repository

This repository is segregated into two primary project directories:

## 1. `lets-go/`
Contains the static marketing website, onboarding pages, and legacy React dashboard:
- **Landing & Portal Pages**: `index.html`, `login.html`, `signup.html`, `b2b.html`, `create-exam.html`, `explore.html`, `premium.html`, `pr.html`, etc.
- **Assets & Styles**: `css/`, `js/`, `images/`, `videos/`, `styles.css`.
- **Dashboard Source**: `lets-go/dashboard.app/` (Vite + React single-file dashboard).
- **Built Dashboard**: `lets-go/dashboard/index.html`.

## 2. `heftin-academy-frontend/`
The modern modular Single Page Application (SPA):
- **Stack**: Vite, React, TypeScript, Tailwind CSS, React Router DOM, Axios.
- **Commands**:
  - `npm install`: Install dependencies.
  - `npm run dev`: Launch local development server.
  - `npm run build`: Compile and build production assets to `dist/`.