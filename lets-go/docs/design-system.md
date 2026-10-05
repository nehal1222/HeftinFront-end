# Dashboard Design System

This note records the shared conventions for the dashboard UI. The implementation uses the Tailwind tokens in `dashboard.app/src/styles/tokens.css`; existing component CSS remains the owner of legacy dashboard layouts and behavior.

## Usage

- Prefer token utilities such as `bg-primary`, `text-muted`, `p-card`, `rounded-card`, and `font-display` over raw hex values or one-off spacing values in new JSX.
- Use the named scale: `control` for compact controls, `card` for component padding, `section` for vertical group spacing, and `page` for outer page gutters.
- Use `sm`, `md`, `lg`, and `xl` breakpoints for responsive changes. Build mobile-first, then add layout changes at the smallest breakpoint that needs them.
- Keep content readable with constrained containers, consistent gaps, and stable grid tracks. Avoid fixed widths for content, arbitrary negative margins, and nested cards.
- Keep component classes semantic and scoped, using the existing `dash-*` and page-specific naming pattern. Compose conditional classes with the shared `cn()` helper in `dashboard.app/src/utils/cn.js`.
- Use Tailwind utilities for tokenized composition and small responsive adjustments; add a component stylesheet rule when behavior, animation, or a complex visual needs a named selector.

## Do

- Define visual values through the CSS `@theme` tokens.
- Use `cn()` for conditional or composed class names.
- Add responsive rules mobile-first and test narrow and wide layouts.
- Match typography to role: `font-display` for prominent dashboard headings and `font-sans` for interface text.

## Don't

- Do not introduce another CSS framework or duplicate the token layer.
- Do not add raw brand hex values, arbitrary spacing, or ad hoc breakpoint values to new UI code.
- Do not use Tailwind utilities to bypass an existing component class without a clear responsive or compositional reason.
- Do not encode layout decisions in data objects or inline styles when a token class or component rule is appropriate.

Figma is the source of truth for future visual decisions when a matching design reference is available; update the tokens and this note when the shared scale changes.
