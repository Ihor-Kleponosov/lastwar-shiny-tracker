# Repository Agent Instructions

## Source of truth

Follow project documentation in this order:

1. `AGENTS.md`
2. `UI_GUIDELINES.md`
3. `README.md`

When guidance conflicts, the earlier document wins.

## Working approach

For non-trivial work, read the relevant documentation and implementation first, make a short plan, then implement the smallest focused change. Preserve existing architecture and unrelated working-tree changes. Do not rewrite code before understanding the current behavior.

Prefer readable, strongly typed, immutable code; meaningful names; short functions; early returns; and focused diffs. Avoid speculative refactors, dead code, commented-out code, unnecessary dependencies, and unrelated formatting or lockfile changes.

Avoid nested ternary expressions; use clear control flow instead.

## Architecture and domain behavior

- Keep business logic in hooks and framework-independent utilities; keep components focused on rendering and interaction.
- The shiny-task cycle is configured by `anchorDate` and ordered server groups in `src/config/index.ts`. Use the existing cycle utilities rather than duplicating date arithmetic.
- Treat server IDs as numbers and preserve their numerical ordering.
- Server preferences are local-only. Use the existing persistence helpers and retain their safe fallback behavior for invalid, stale, or unavailable localStorage data.
- Keep settings edits as a draft until an explicit save. A dirty settings dialog must confirm discard before closing.
- Reuse `useModalAccessibility` for dialogs so Escape handling, focus movement, focus return, focus trapping, and scroll locking remain consistent.
- Reuse existing export helpers and the export view for PNG capture; do not introduce a second rendering or download path without a demonstrated need.

## Component architecture

- Keep application-wide shell elements, such as the header and language controls, in `src/components/app-shell/`.
- Keep domain-specific components in `src/components/features/<domain>/`, grouped by capability such as calendar, date, export, presets, servers, or settings.
- Keep reusable visual primitives and generic composite controls in `src/components/shared/ui/`.
- Keep cross-application technical concerns, such as error boundaries, in `src/components/infrastructure/`.
- Keep page composition in `src/pages/`, business logic in hooks or framework-independent utilities, and domain configuration in its existing configuration modules.
- Keep feature-specific components inside their owning feature even when they resemble generic UI. Promote a component to shared UI only when it has a clear, reusable contract independent of domain behavior.
- Keep private helpers and feature subcomponents colocated with their owning component unless independent reuse is demonstrated.
- Colocate component tests and component-specific utilities with the implementation.
- Avoid global component barrels that hide ownership; preserve focused local `index.ts` exports where they already exist.
- Update import paths when moving components and preserve public component APIs unless the task explicitly requires an API change.
- Maintain one-way dependency intent: shared UI must not import feature components, infrastructure should remain independent of domain features, and features may consume shared UI plus application hooks and utilities.

## React, TypeScript, and styling

- Use functional components, hooks, composition, and local state where practical.
- Avoid `any`; reuse shared types and use explicit public props and utility return types.
- Use Tailwind and semantic CSS variables from `src/index.css`; do not hardcode visual colors or introduce another UI framework.
- Follow `UI_GUIDELINES.md` for layout, touch targets, icons, motion, responsive behavior, and accessibility.
- Preserve semantic HTML, native controls where practical, keyboard operation, visible focus states, dialog ARIA semantics, and reduced-motion behavior.

## Internationalization

- All user-facing strings, including labels, placeholders, ARIA text, status text, and dialog titles, must use `react-i18next`.
- Add every new key to `en`, `fr`, `de`, and `uk` locale files in the same change. English is the fallback.
- Keep values in literal characters, including Ukrainian Cyrillic; do not use Unicode escapes.
- Use the existing `date-fns` locale helper for displayed dates and React DayPicker. Store `Date` values or machine-readable strings, never translated dates.
- Allow layouts to accommodate longer French and German strings.

## Testing and verification

- Colocate component and utility tests using `*.test.ts(x)`.
- Update affected tests whenever behavior changes; favor independent utility tests for business logic and interaction tests for accessible UI behavior.
- Before completion, run:

  ```bash
  npm run format:check
  npm run lint
  npm run test:run
  npm run build
  ```

- If any check cannot run, state why and what was verified instead.

## Git and documentation

- Modify only files required by the task. Do not reset, overwrite, or discard user changes.
- Keep the result easy to review; do not rename files without a clear reason.
- Update `README.md` when user-visible behavior, setup, configuration, storage, or deployment changes. Update `UI_GUIDELINES.md` when interaction or visual conventions change.
