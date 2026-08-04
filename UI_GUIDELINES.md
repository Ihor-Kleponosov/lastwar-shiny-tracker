# UI Guidelines

## Purpose

This document is the visual and interaction source of truth for the Last War Shiny Tracker. The app is a compact, mobile-first, offline-capable companion for viewing shiny-task server rotations and managing the server list a player wants to see.

Use a polished dark game-companion style: focused, reliable, compact, and slightly futuristic. Do not copy Last War artwork, logos, screenshots, or proprietary UI. Avoid dense dashboards, aggressive neon, excessive gradients, blur, animation, or desktop-first layouts.

## Layout and visual language

- Keep a single centered column with `width: 100%`, `max-width: 1200px`, and 16 px mobile / 24 px larger-screen horizontal padding.
- Use a 4 px spacing scale. Prefer 16 px section gaps on mobile and 20 px on larger screens.
- Use semantic CSS variables from `src/index.css` for the page, surfaces, borders, text, focus, overlay, and export group colors. Do not scatter hardcoded colors through components.
- Cards use a surface background, subtle border, 14-18 px radius, and restrained shadow. Avoid nested cards unless they clarify a separate interaction.
- Use the local system font stack only. Body text is at least 14 px; server IDs use strong, tabular numerals where useful.
- Preserve `min-width: 320px`, avoid horizontal overflow, and account for the bottom safe area in fixed controls.

The primary application shell is:

```text
Header (logo, title, language selector)
Date summary (selected date, export, today, calendar controls)
  Calendar overlay (when open)
Preset selector
Selected preset server lists (preset name, count, server chips or empty state)
Preset configuration dialog (when editing presets)
Export dialogs (when open)
```

The interface stays single-column at all sizes. Larger screens may increase padding and fit more server chips, but should not become a sidebar dashboard.

## Current interaction model

### Header and language

The header shows the local tracker logo, the application title, and the language selector. The selector exposes English, French, German, and Ukrainian, is keyboard accessible, applies changes without a reload, and persists the selection. Do not use flags as the only language identifier.

### Date summary and calendar

The date-summary card presents the localized selected date. Its icon controls open PNG export, select today, and show or hide the calendar. Icon-only buttons require translated accessible names and a visible focus state.

The calendar opens as an overlay below the summary instead of permanently occupying the main screen. Use React DayPicker with:

- Monday as the first weekday;
- the active `date-fns` locale for labels and month names;
- clear selected, today, outside-month, hover, and focus-visible states;
- 44 px day and month-navigation targets; and
- selection that closes the overlay and updates the active server list.

Today must remain distinguishable from the selected date. Calendar month navigation changes only the visible month, not the selected date.

### Selected preset server lists

The preset selector can select one or more saved presets. Render one active-server card for each selected preset, in preset order. Each card uses its preset name as a title and shows a localized live count and numerically sorted server chips for the selected cycle group. When no configured server in that preset is enabled for the selected date, show a neutral, translated empty state; this is not an error.

Use a responsive grid with a minimum chip width of about 88 px. Server IDs must remain easy to scan and must not rely on color alone for meaning.

### Preset configuration dialog

Preset configuration uses a custom, full-screen dialog with the same centered maximum width and horizontal padding as the application shell. Do not add a third-party modal library.

The dialog contains a title, preset-name input, help popover, close control, selected-server counter, filter controls, server grid, and fixed Cancel / Save actions. Its scrolling content must not obscure the header or footer. The configuration workflow supports immediate number search, inclusive range filtering (including reversed input bounds), resettable filters, and a select/deselect-displayed action. Users can switch between one flat server list and lists separated into the configured A, B, and C groups. The two icon controls behave as one radio group, expose their selected state, and support arrow-key navigation. A maximum of 75 servers may be selected; attempts to exceed the limit show a concise error toast.

Changes remain a draft until Save. A changed dialog must ask for confirmation before discard on close, Escape, or other close requests. Saving persists the preset name and enabled IDs, closes the dialog, and shows a concise success toast. Do not show a toast for individual checkbox changes.

Every dialog must use `role="dialog"`, `aria-modal="true"`, and a heading connected through `aria-labelledby`; move focus inside on open, trap focus, lock body scrolling, restore focus to the trigger on close, and support Escape. A confirmation dialog may use a backdrop; a full-screen settings dialog does not need one.

### PNG export

The export action opens a month picker, then a preview dialog. The preview renders the calendar and enabled servers from the first selected preset for the chosen month, supports light and dark export themes, and downloads only the export view as a PNG. With no selected preset, export an empty server list. Keep its fixed export dimensions, local font choice, group colors, and calendar rendering stable so generated images remain predictable.

While capture is in progress, show a localized status overlay and prevent duplicate export actions. Export failures should be logged for diagnosis without exposing technical details in the interface.

## Components, controls, and motion

- Use `lucide-react` for interface icons. Decorative icons use `aria-hidden="true"`; typical icon size is 18-20 px.
- Reuse the local Button and IconButton components. Icon controls have a minimum 44 x 44 px target and translated `aria-label` values. Set `type="button"` except for actual form submissions.
- Keep native checkboxes for server selection when practical; their whole target area should be keyboard and pointer accessible with visible focus.
- Use subtle Motion transitions only: short fades and small translates, generally 120-220 ms with `cubic-bezier(0.2, 0.8, 0.2, 1)`. Respect `prefers-reduced-motion` both in component transitions and global CSS.
- Dark mode is the application theme. The light choice applies only to export output; do not add a general theme switcher without an explicit request.
- Keep UI components focused on presentation and interaction. Put cycle calculation, date formatting, persistence, and export filename/capture behavior in utilities or hooks.

## Accessibility and localization

- Use semantic landmarks, headings, buttons, lists, and native inputs as appropriate.
- Maintain sufficient contrast, visible `focus-visible` treatment, keyboard operation, and no color-only meaning.
- Localize all visible and accessible content: labels, placeholders, dialog headings, icon labels, live-region text, and calendar navigation text.
- Use semantic translation keys and i18next pluralization/interpolation; do not concatenate translated sentence fragments.
- Format dates with the active locale at the presentation boundary. Do not store translated strings in state.
- Add every string to `en`, `fr`, `de`, and `uk` in the same change. English is the default and fallback.
- Ensure layouts remain usable with longer French and German labels and Ukrainian Cyrillic text.

## Offline, errors, and PWA

The app must remain complete offline: it has no remote data dependency, local preferences are optional, and the PWA caches production assets. Do not treat offline use as an error or block app features because storage is unavailable.

Recover silently to default preferences when localStorage is missing, corrupt, or contains unknown server IDs. Keep the error boundary's user-facing fallback concise and translated. PWA registration or export failures must not prevent the core tracker from working.

## Acceptance checklist

- Verify at approximately 360 px, 390 px, 768 px, and 1280 px widths with no horizontal scrolling.
- Verify calendar date selection, today action, calendar visibility, active-server updates, and localized calendar labels.
- Verify preset configuration search, range filtering, bulk actions, Save, dirty-discard confirmation, keyboard navigation, focus return, and translated feedback.
- Verify the export month picker, preview, theme switch, loading state, and PNG download path.
- Verify all supported languages, especially longer French/German labels and Ukrainian Cyrillic text.
- Verify dark visual contrast, reduced motion, offline-capable layout, and absence of remote visual dependencies.
- Run formatting, linting, tests, and a production build before completion.

## Out of scope

- A general light-theme switcher or user-selectable application color themes
- Complex analytics dashboards, charts, drag-and-drop, sound, animated backgrounds, or game artwork
- A custom calendar implementation or swipe-only date navigation
- A large toast/notification framework, a separate design-system site, or Storybook unless explicitly requested
