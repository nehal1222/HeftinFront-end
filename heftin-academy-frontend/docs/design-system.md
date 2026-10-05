# Heftin Academy — Design System & Tokens (Sprint 1)

This document details the shared conventions, CSS variables, and Tailwind v4 `@theme` design tokens for the Heftin Academy frontend application.

## Sprint 1 Scope & Goals

- **Centralized Tokens**: Configure Tailwind and design tokens for **color (brand)**, **typography**, **spacing**, **radius**, and **breakpoints**.
- **Rule**: Always prefer token utility classes (e.g. `bg-primary`, `text-muted`, `border-border`, `rounded-card`) over hardcoded hex values or arbitrary CSS styles in UI code.
- **Documented Source of Truth**:
  - CSS Variables & Theme: [`src/styles/tokens.css`](../src/styles/tokens.css)
  - Global Entry: [`src/index.css`](../src/index.css)
  - Sample/Preview Page: [`src/pages/DesignSystemPage.tsx`](../src/pages/DesignSystemPage.tsx)

---

## 1. Strict Color Tokens

The design system enforces a strict 4-color core palette:

| Token | Hex Value | Semantic Role |
| :--- | :--- | :--- |
| `--primary` / `--color-primary` | `#00828e` | Brand primary, action buttons, active navigation states |
| `--border` / `--color-border` | `#cce6e8` | Card borders, dividers, subtle tints, secondary outlines |
| `--error` / `--color-error` | `#001a1c` | High contrast headings, dark ink typography, alerts |
| `--white` / `--color-white` | `#ffffff` | Background canvas, card surfaces, white button text |

### Color Roles in `@theme`
- `bg-primary` / `text-primary`: `#00828e`
- `bg-surface` / `bg-white`: `#ffffff`
- `text-foreground` / `text-foreground-strong`: `#001a1c`
- `text-muted`: `#001a1c` (accessible high-contrast ink)
- `border-border`: `#cce6e8`
- `text-error`: `#001a1c`

---

## 2. Typography Tokens

Tailwind v4 font families and modular typography scales:

### Font Families
- `font-sans`: `"Inter", system-ui, sans-serif` — Primary interface copy, tables, body text
- `font-display`: `"Jost", sans-serif` — Prominent headers, section titles, hero headlines
- `font-serif`: `"Source Serif 4", serif` — Distinctive editorial accents
- `font-auth`: `"Roboto", sans-serif` — Authentication inputs, login dialogs
- `font-mono`: `"SFMono-Regular", Consolas, monospace` — Code tokens, telemetry, rights IDs

### Type Scale Classes
- `text-eyebrow`: `0.625rem` (10px, uppercase, tracking-wider)
- `text-caption`: `0.75rem` (12px, line-height 1.4)
- `text-body-sm`: `0.75rem` (12px, compact secondary text)
- `text-body`: `0.8125rem` / `1rem` (13px–16px, line-height 1.6)
- `text-heading-sm`: `1.125rem` (18px)
- `text-heading-md`: `1.375rem` (22px)
- `text-heading-lg`: `1.75rem` (28px)
- `text-display`: `clamp(2rem, 5vw, 3.5rem)`
- `tracking-tight`: `-0.01em`

---

## 3. Spacing Scale

Tokens are composable and provide uniform rhythm across views:

- `spacing`: `0.25rem` (4px base grid unit)
- `p-control` / `py-control`: `0.75rem` (buttons, select inputs, chips)
- `p-card`: `1rem` (card internal padding)
- `p-section` / `py-section`: `2rem` – `2.5rem` (section gutters)
- `p-page` / `px-page`: `1.5rem` – `3rem` (outer container margin)

---

## 4. Radius Tokens

Unified shape hierarchy:

- `rounded-sm`: `0.5rem` (8px, small badges, inline code tags)
- `rounded-md`: `0.75rem` (12px, dropdown items)
- `rounded-control`: `0.5rem` (input fields, action buttons)
- `rounded-lg`: `1.125rem` (18px)
- `rounded-card`: `1.125rem` (cards, dialog surfaces)
- `rounded-full` / `rounded-pill`: `999px` (pill tags, avatars, toggle switches)

---

## 5. Responsive Breakpoints

Mobile-first responsive media queries:

- `sm`: `35rem` / `40rem` (560px – 640px)
- `md`: `40rem` / `48rem` (640px – 768px)
- `lg`: `56.25rem` / `64rem` (900px – 1024px)
- `xl`: `75rem` / `80rem` (1200px – 1280px)

---

## 6. CSS `@theme` Definition

Configured in `src/index.css` and `src/styles/tokens.css`:

```css
@theme {
  --color-*: initial;
  --color-white: #ffffff;
  --color-transparent: transparent;
  --color-current: currentColor;

  /* Strict 4-color palette */
  --color-primary: #00828e;
  --color-border: #cce6e8;
  --color-error: #001a1c;

  /* Roles */
  --color-ink: #001a1c;
  --color-muted: #001a1c;
  --color-surface: #ffffff;
  --color-on-primary: #ffffff;
  --color-foreground: #001a1c;
  --color-foreground-strong: #001a1c;
  --color-card: #ffffff;
  --color-ring: #00828e;
  --color-line: #cce6e8;

  /* Typography */
  --font-sans: "Inter", system-ui, sans-serif;
  --font-display: "Jost", sans-serif;
  --font-serif: "Source Serif 4", serif;
  --font-auth: "Roboto", sans-serif;

  --text-eyebrow: 0.625rem;
  --text-body-sm: 0.75rem;
  --text-body: 0.8125rem;
  --text-heading-sm: 1.125rem;
  --text-heading-md: 1.375rem;
  --text-heading-lg: 1.75rem;
  --tracking-tight: -0.01em;

  /* Spacing */
  --spacing: 0.25rem;
  --spacing-control: 0.75rem;
  --spacing-card: 1rem;
  --spacing-section: 2.5rem;
  --spacing-page: 3rem;

  /* Radius */
  --radius-control: 0.5rem;
  --radius-sm: 0.5rem;
  --radius-md: 0.75rem;
  --radius-lg: 1.125rem;
  --radius-card: 1.125rem;
  --radius-full: 999px;

  /* Breakpoints */
  --breakpoint-sm: 35rem;
  --breakpoint-md: 40rem;
  --breakpoint-lg: 56.25rem;
  --breakpoint-xl: 75rem;
}
```

---

## 7. Interactive Specimen & Sample Page

The sample page demonstrating token classes (`bg-primary`, `text-muted`, `border-border`, `p-page`, `text-eyebrow`, `font-display`, `rounded-card`, `rounded-control`) and rendering the live token source code is accessible at:

- `http://localhost:5174/tokens`
- `http://localhost:5174/design-tokens`
- `http://localhost:5174/design-system`
