# Heftin Academy Design System

The shared design system lives in `src/index.css` as Tailwind v4 `@theme` tokens. Use the tokens in new UI code; component CSS remains responsible for complex visuals and behavior.

## Conventions

- Prefer semantic token classes such as `bg-primary`, `text-muted`, `p-card`, `rounded-card`, and `font-display` over raw hex values.
- Use `sm`, `md`, `lg`, and `xl` breakpoints mobile-first. Choose the smallest breakpoint that needs a layout change.
- Use the named spacing scale for page, section, card, and control composition. Avoid arbitrary spacing and fixed content widths.
- Keep component classes semantic and scoped. Use the shared `cn()` helper in `src/lib/utils.ts` for conditional class names.
- Prefer Tailwind utilities for tokenized composition and small responsive adjustments; use component CSS for animation or complex visual behavior.

## Do

- Define colors, typography, spacing, radius, and breakpoints through `@theme`.
- Keep layouts readable with constrained containers, stable grid tracks, and consistent gaps.
- Treat Figma as the source of truth when a matching design reference is available.

## Don't

- Do not introduce another CSS framework or duplicate the token layer.
- Do not add raw brand hex values, arbitrary breakpoints, or ad hoc spacing to new UI code.
- Do not use inline styles for layout decisions when a token class or component rule is appropriate.